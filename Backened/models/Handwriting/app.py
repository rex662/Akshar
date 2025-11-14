from flask import Flask, request, jsonify, render_template, send_file
from xhtml2pdf import pisa
import io
import datetime
from werkzeug.utils import secure_filename
import os
import unicodedata
import difflib
import easyocr

app = Flask(__name__)

# Initialize OCR reader
reader = easyocr.Reader(['en'])

# Define common letter reversal pairs
REVERSAL_PAIRS = [('b', 'd'), ('d', 'b'), ('p', 'q'), ('q', 'p')]

def normalize(text):
    return unicodedata.normalize('NFKC', text.lower())

def count_reversals(expected, actual):
    return sum(1 for a, b in zip(expected, actual) if (a, b) in REVERSAL_PAIRS)

def predict_dysgraphia(subs, inserts, deletes, reversals, cer, wer):
    score = 0
    if cer > 0.25: score += 2
    elif cer > 0.15: score += 1
    if wer > 0.35: score += 2
    elif wer > 0.20: score += 1
    if subs > 4: score += 2
    elif subs > 2: score += 1
    if inserts > 3: score += 2
    elif inserts > 1: score += 1
    if deletes > 3: score += 2
    elif deletes > 1: score += 1
    if reversals >= 2: score += 2
    elif reversals >= 1: score += 1

    if score >= 6:
        return "High likelihood of dysgraphia (🔥) – Recommend detailed screening."
    elif score >= 3:
        return "Moderate likelihood (⚠️) – Monitor and observe further."
    else:
        return "Low likelihood (✅) – No significant indicators found."

def calculate_stats(expected, actual):
    expected_norm = normalize(expected)
    actual_norm = normalize(actual)
    matcher = difflib.SequenceMatcher(None, expected_norm, actual_norm)

    comparison_html = ""
    subs, inserts, deletes = 0, 0, 0

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

    filename = secure_filename(file.filename)
    temp_path = os.path.join("temp_" + filename)
    file.save(temp_path)

    ocr_results = reader.readtext(temp_path, detail=0)
    os.remove(temp_path)

    actual = " ".join(ocr_results).strip()
    if not actual:
        return jsonify({"error": "OCR failed to recognize text"}), 400

    stats = calculate_stats(expected, actual)
    result = {"name": name, "expected": expected, "ocr_output": actual, **stats}

    return jsonify(result)

@app.route('/generate-report', methods=['POST'])
def generate_report():
    data = request.json
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    # Render HTML template
    html = render_template('report_template.html', **data, timestamp=timestamp)

    # Generate PDF in memory
    pdf_file = io.BytesIO()
    pisa_status = pisa.CreatePDF(io.StringIO(html), dest=pdf_file)
    pdf_file.seek(0)

    if pisa_status.err:
        return jsonify({"error": "PDF generation failed"}), 500
    return send_file(
        pdf_file,
        as_attachment=True,
        download_name=f"{data.get('name', 'handwriting')}_report.pdf",
        mimetype='application/pdf'
    )
    # Return PDF as file download
  
if __name__ == '__main__':
    app.run(debug=True)
