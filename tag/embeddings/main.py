from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from sentence_transformers import SentenceTransformer

app = FastAPI()

MODEL_NAME = "all-mpnet-base-v2"  # dimensions: 768

model = SentenceTransformer(MODEL_NAME)


class SentencesRequest(BaseModel):
    sentences: List[str]


@app.post("/embed")
def embed(request: SentencesRequest):
    sentences = request.sentences
    embeddings = model.encode(
        sentences,
        convert_to_numpy=True,
        normalize_embeddings=True)
    return {"embeddings": [e.tolist() for e in embeddings]}
