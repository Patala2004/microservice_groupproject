from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import ollama_llm as llm

app = FastAPI()


class TranslateRequest(BaseModel):
    texts: list[str]
    language: str


tllm = llm.Qwen3_8b()

# --- endpoints ---


@app.post("/translate")
def translate(req: TranslateRequest):
    try:
        translation = tllm.translate(req.texts, req.language)
        return {"translation": translation}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
