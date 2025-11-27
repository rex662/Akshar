from fastapi import FastAPI, Request 
from fastapi.middleware.cors import CORSMiddleware 
from fastapi.middleware.wsgi import WSGIMiddleware 
# import socketio 

# Import routers and helper functions from your modules 
from models.Eye_track.app import eye_router, get_eye_result 
from models.speech.app import speech_router 
from models.Handwriting.app import app as handwriting_flask_app 
from models.Syllable import syllable_router 
import os
from dotenv import load_dotenv

# Load variables from .env
load_dotenv()

port = int(os.environ.get("PORT", 8000))
api_key = os.environ.get("API_KEY")
app = FastAPI(title="Dyslexia Detection Backend")

# Enable CORS (so your React frontend can talk to it)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Routers
app.include_router(eye_router, prefix="/eye", tags=["Eye Tracking"]) 
app.include_router(speech_router, prefix="/speech", tags=["Speech Analysis"])
app.mount("/hand", WSGIMiddleware(handwriting_flask_app)) 
app.include_router(syllable_router, prefix="/split", tags=["Syllable Analysis"])

# ── Combined Endpoint
@app.post("/combined-result") 
async def combined_result(req: Request):

    try:
        data = await req.json()
        eye_score = float(data.get("eye_score", 0)) 
        speech_score = float(data.get("speech_score", 0))

        # Simple average
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


# ── Run using Uvicorn (DO NOT USE ON RENDER)
if __name__ == "__main__": 
    import uvicorn 
    uvicorn.run("Backend.main:app", host="127.0.0.1", port=port, reload=True)

























