from flask import send_file, render_template_string
from xhtml2pdf import pisa
import io
import datetime
from flask import Flask, request, jsonify, render_template
from PIL import Image
import easyocr
import difflib
import os
import unicodedata
from werkzeug.utils import secure_filename

app = Flask(__name__)
# Initialize the OCR reader
reader = easyocr.Reader(['en'])

# Define common letter reversal pairs
REVERSAL_PAIRS = [('b', 'd'), ('d', 'b'), ('p', 'q'), ('q', 'p')]

def normalize(text):
    """Normalize text to a common form for comparison."""
    return unicodedata.normalize('NFKC', text.lower())

def count_reversals(expected, actual):
    """Count the occurrences of defined letter reversals."""
    return sum(1 for a, b in zip(expected, actual) if (a, b) in REVERSAL_PAIRS)

def predict_dysgraphia(subs, inserts, deletes, reversals, cer, wer):
    """
    Predicts the likelihood of dysgraphia based on error metrics.
    Thresholds are adjusted for the short, fixed sentence.
    """
    score = 0

    # Score based on Character Error Rate (CER)
    if cer > 0.25: score += 2
    elif cer > 0.15: score += 1

    # Score based on Word Error Rate (WER)
    if wer > 0.35: score += 2
    elif wer > 0.20: score += 1

    # Score based on substitutions
    if subs > 4: score += 2
    elif subs > 2: score += 1

    # Score based on insertions
    if inserts > 3: score += 2
    elif inserts > 1: score += 1

    # Score based on deletions
    if deletes > 3: score += 2
    elif deletes > 1: score += 1
    
    # Score based on letter reversals (a strong indicator)
    if reversals >= 2: score += 2
    elif reversals >= 1: score += 1

    # Determine final prediction based on the total score
    if score >= 6:
        return "High likelihood of dysgraphia (🔥) – Recommend detailed screening."
    elif score >= 3:
        return "Moderate likelihood (⚠️) – Monitor and observe further."
    else:
        return "Low likelihood (✅) – No significant indicators found."

def calculate_stats(expected, actual):
    """Calculates all statistics by comparing expected and actual text."""
    expected_norm = normalize(expected)
    actual_norm = normalize(actual)
    matcher = difflib.SequenceMatcher(None, expected_norm, actual_norm)

    comparison_html = ""
    subs, inserts, deletes = 0, 0, 0

    # Generate an HTML visualization of the comparison
    for tag, i1, i2, j1, j2 in matcher.get_opcodes():
        expected_chunk = expected[i1:i2]
        actual_chunk = actual[j1:j2]
        if tag == 'equal':
            comparison_html += f"<span class='correct'>{expected_chunk}</span>"
        else:
            comparison_html += f"<span class='incorrect' title='Got: {actual_chunk}'>{expected_chunk}</span>"
            if tag == 'replace': subs += 1
            elif tag == 'insert': inserts += len(actual_chunk)
            elif tag == 'delete': deletes += len(expected_chunk)

    char_error_rate = round(1 - matcher.ratio(), 3)
    word_error_rate = round(1 - difflib.SequenceMatcher(None, expected_norm.split(), actual_norm.split()).ratio(), 3)
    reversals = count_reversals(expected_norm, actual_norm)
    dysgraphia_risk = predict_dysgraphia(subs, inserts, deletes, reversals, char_error_rate, word_error_rate)

    return {
        "comparison_html": comparison_html,
        "char_error_rate": char_error_rate,
        "word_error_rate": word_error_rate,
        "substitutions": subs,
        "insertions": inserts,
        "deletions": deletes,
        "reversed_letters": reversals,
        "dysgraphia_risk": dysgraphia_risk
    }

@app.route('/hand', methods=['POST'])
def analyze_handwriting():
    file = request.files.get("file")
    expected = request.form.get("expected", "").strip()
    name = request.form.get("name", "")

    if not file or not expected:
        return jsonify({"error": "File and expected sentence required"}), 400

    # Save the uploaded file temporarily
    filename = secure_filename(file.filename)
    temp_path = os.path.join("temp_" + filename)
    file.save(temp_path)

    # OCR
    ocr_results = reader.readtext(temp_path, detail=0)
    os.remove(temp_path)

    actual = " ".join(ocr_results).strip()
    if not actual:
        return jsonify({"error": "OCR failed to recognize text"}), 400

    # Calculate metrics
    stats = calculate_stats(expected, actual)

    # Return all data for the frontend / report
    result = {
        "name": name,
        "expected": expected,
        "ocr_output": actual,
        **stats
    }

    return jsonify(result)


@app.route('/ocr-compare', methods=['POST'])
def ocr_compare():
    """Handles the image upload, OCR, and analysis."""
    image = request.files.get('image')
    expected = request.form.get('expected', '').strip()

    if not image or not expected:
        return jsonify({'error': 'Missing image or expected sentence'}), 400

    try:
        filename = secure_filename(image.filename)
        temp_path = os.path.join("temp_" + filename)
        image.save(temp_path)

        # Perform OCR on the saved image
        results = reader.readtext(temp_path, detail=0)
        os.remove(temp_path)

        actual = " ".join(results).strip()
        if not actual:
            return jsonify({'error': 'OCR failed to recognize any text from the image.'}), 400

        stats = calculate_stats(expected, actual)

        return jsonify({
            "expected": expected,
            "ocr_output": actual,
            **stats
        })

    except Exception as e:
        return jsonify({'error': f'An unexpected error occurred: {str(e)}'}), 500
    
@app.route('/generate-report', methods=['POST'])
def generate_report():
    """Generates a PDF report from the analysis data."""
    data = request.json
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    # Render the HTML template with the data
    html = render_template('report_template.html', **data, timestamp=timestamp)
    
    # Create a unique filename for the report
    report_dir = 'static/reports'
    os.makedirs(report_dir, exist_ok=True)
    report_filename = os.path.join(report_dir, f"report_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf")
    
    # Convert the rendered HTML to a PDF file
    with open(report_filename, "w+b") as pdf_file:
        pisa_status = pisa.CreatePDF(io.StringIO(html), dest=pdf_file)
    
    if pisa_status.err:
        return jsonify({"error": "PDF generation failed"}), 500
    
    return jsonify({ "download_url": f"/{report_filename}" })


if __name__ == '__main__':
    app.run(debug=True)