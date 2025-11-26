
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.wsgi import WSGIMiddleware
import socketio
# Import routers and helper functions from your modules
from models.Eye_track.app import eye_router, get_eye_result
from models.speech.app import speech_router
from models.Handwriting.app import app as handwriting_flask_app
from models.Syllable import syllable_router
#from your_module import router
# from Game.backend_test import adaptive_flask_app

# Initialize FastAPI app
app = FastAPI(title="Dyslexia Detection Backend")

# Enable CORS (so your React frontend can talk to it)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For stricter security, use ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers for modular endpoints
app.include_router(eye_router, prefix="/eye", tags=["Eye Tracking"])
app.include_router(speech_router, prefix="/speech", tags=["Speech Analysis"])
app.mount("/hand", WSGIMiddleware(handwriting_flask_app))
app.include_router(syllable_router, prefix="/split", tags=["Syllable Analysis"])
 # Added router
# app.mount("/adaptive", adaptive_flask_app)

# ── Combined Endpoint ──────────────────────────────────────────────
@app.post("/combined-result")
async def combined_result(req: Request):
    """
    Combines Eye + Speech results sent from frontend.
    Frontend should send JSON: { "eye_score": X, "speech_score": Y }
    """
    try:
        data = await req.json()
        eye_score = float(data.get("eye_score", 0))
        speech_score = float(data.get("speech_score", 0))

        # Simple average for combined score
        combined_score = (eye_score + speech_score) / 2
        combined_label = "🧠 Dyslexic" if combined_score > 0.5 else "✔️ Typical"

        return {
            "eye_score": eye_score,
            "speech_score": speech_score,
            "combined": round(combined_score, 2),
            "label": combined_label
        }

    except Exception as e:
        return {"error": str(e)}

#from fastapi import FastAPI
app = FastAPI()
# ── Run using Uvicorn ─────────────────────────────────────────────
# Command: uvicorn Backend.main:app --reload
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("Backend.main:app", host="127.0.0.1", port=8000, reload=True)