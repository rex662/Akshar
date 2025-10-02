from fastapi import APIRouter, Request
import pyphen

# Create router
syllable_router = APIRouter()

# Initialize pyphen dictionary (English US)
dic = pyphen.Pyphen(lang="en_US")

@syllable_router.post("/split")
async def split_syllables(req: Request):
    """
    Splits text into syllables using pyphen.
    Example input: { "text": "beautiful reading" }
    """
    try:
        data = await req.json()
        text = data.get("text", "").strip()

        if not text:
            return {"error": "No text provided"}

        words = text.split()
        if len(words) > 5000:
            return {"error": "Maximum word limit exceeded"}

        # Split each word into syllables
        result = {}
        for word in words:
            result[word] = dic.inserted(word).split("-")

        # Format output for readability
        formatted = "\n".join([f"{w}: {'-'.join(syl)}" for w, syl in result.items()])

        return {"output": formatted, "details": result}

    except Exception as e:
        return {"error": str(e)}
