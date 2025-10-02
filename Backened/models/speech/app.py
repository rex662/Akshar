# models/speech/app.py
import whisper
import tempfile
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from fastapi import APIRouter, UploadFile, File
from fastapi.responses import JSONResponse
from models.speech.feature_extraction import compute_features, rule_based_predict  # your feature extraction logic
import numpy as np
# -------------------- Flask Setup --------------------
flask_app = Flask(__name__, static_folder="static")
CORS(flask_app)  # allow cross-origin requests

# -------------------- FastAPI Router --------------------
speech_router = APIRouter()

# -------------------- Load Whisper Model --------------------
model = whisper.load_model("base")
REFERENCE_TEXT = "The quick brown fox jumps over the lazy dog."

# Store last result (optional)
speech_last_result = None

# -------------------- Core Processing Logic --------------------
def process_audio(audio_path: str):
    """
    Transcribe audio using Whisper, compute features, and return prediction.
    Returns numeric prediction score between 0 (typical) and 1 (dyslexic).
    """
    result = model.transcribe(audio_path, word_timestamps=True)
    transcript = result.get("text", "")

    # Get words with timestamps if available
    words = result["segments"][0]["words"] if "segments" in result and result["segments"] else []

    # Feature extraction
    features = compute_features(REFERENCE_TEXT, transcript, words)

    # Rule-based prediction
    prediction_label = rule_based_predict(features)

    # Convert to numeric score: Dyslexic = 1, Typical = 0
    prediction_score = 1.0 if prediction_label == "Dyslexic" else 0.0

    return {
        "transcript": transcript,
        "wer": round(features.get("wer", 0), 3),
        "pause_count": features.get("pause_count", 0),
        "wpm": round(features.get("wpm", 0), 2),
        "prediction": prediction_score
    }

# -------------------- Flask Route --------------------
@flask_app.route("/speech", methods=["POST"])
def upload_audio_flask():
    try:
        audio = request.files["audio"]
        with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as tmp:
            audio.save(tmp.name)
            audio_path = tmp.name

        result = process_audio(audio_path)
        os.remove(audio_path)
        return jsonify(result)

    except Exception as e:
        print("❌ ERROR (Flask):", e)
        return jsonify({"error": str(e)}), 500

# -------------------- FastAPI Route --------------------
@speech_router.post("/result")
async def upload_audio_fastapi(file: UploadFile = File(...)):
    global speech_last_result
    try:
        # Save uploaded file to temp
        tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".webm")
        tmp.write(await file.read())
        tmp.close()
        audio_path = tmp.name

        # Process audio
        result = process_audio(audio_path)
        speech_last_result = result

        result = convert_numpy_types(result)
        # Clean up temp file
        os.remove(audio_path)
        return result

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

# -------------------- Utility Function --------------------
def get_speech_result():
    """
    Returns last speech result, or default if none recorded yet.
    """
    global speech_last_result
    return speech_last_result or {"prediction": 0.0, "error": "No speech recorded yet"}
def convert_numpy_types(obj):
    """
    Recursively convert numpy types to native Python types
    """
    if isinstance(obj, dict):
        return {k: convert_numpy_types(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [convert_numpy_types(i) for i in obj]
    elif isinstance(obj, np.integer):
        return int(obj)
    elif isinstance(obj, np.floating):
        return float(obj)
    else:
        return obj