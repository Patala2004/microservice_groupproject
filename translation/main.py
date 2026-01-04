from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
import ollama_llm as llm

app = FastAPI()


class TranslateRequest(BaseModel):
    texts: list[str] = Field(..., examples=[["Text to translate"]])
    language: str = Field(..., examples=["Chinese"])


class TranslateOut(BaseModel):
    translation: list[str] = Field(..., examples=[["Translated text"]])


tllm = llm.LLM()

# --- endpoints ---


@app.post(
    "/translate",
    summary="Translate",
    description="Translates a list of texts to the specified language",
    response_model=TranslateOut
)
def translate(req: TranslateRequest):
    try:
        translation = tllm.translate(req.texts, req.language)
        return {"translation": translation}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
