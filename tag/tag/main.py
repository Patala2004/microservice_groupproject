import numpy as np
from fastapi import FastAPI
import post_info
import translation
import ollama_llm as llm
import embeddings
import tagging_pgdb as db
import tagpost_pgbd as tagpost_db

app = FastAPI()


@app.on_event("startup")
def on_startup():
    db.init_db()


qwen8b = llm.Qwen3_8b()

# --- endpoints ---


@app.post("/tag")
def tag(post_id):
    try:
        title, content = post_info.getTitleContent(post_id)
        title = translation.translate(
            input=title,
            language="English"
        )
        content = translation.translate(
            input=content,
            language="English"
        )

        tagname_list = qwen8b.generate_tags(
            input_title=title,
            input_content=content
        )

        vectors = embeddings.embed(tagname_list)

        final_tag_ids = []
        for i in range(len(vectors)):
            current = db.store_tag(
                name=tagname_list[i],
                embedding=vectors[i]
            )
            final_tag_ids.append(current.id)

        tagpost_db.add_relations(tag_ids=final_tag_ids, post_id=post_id)

        return {"status": "ok"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# --- funcs for test ---


def cosine_distance(a: np.ndarray, b: np.ndarray) -> float:
    if a.shape != b.shape:
        raise ValueError("Los vectores deben tener la misma dimensión")

    denom = np.linalg.norm(a) * np.linalg.norm(b)
    if denom == 0:
        raise ValueError(
            "No se puede calcular distancia coseno con vector cero")

    return 1.0 - float(np.dot(a, b) / denom)


# --- test endpoints ---

@app.post("/llm-test/qwenb8")
def llm_test_qwenb8():
    return qwen8b.generate_tags(
        input_title="Zootropolis in Anting cinema this Saturday",
        input_content="We would like to go to the cinema in Anting this Saturday to watch Zootropolis 2. If someone else also wants to come we could share transport expenses."
    )

@app.post("/tag-db-test")
def tag_db_test():
    db.store_tag("test",[0.1]*384)

@app.post("/embeddings-test")
def embeddings_test():
    embs = embeddings.embed([
        "Basketball match",
        "Sports",
        "Tea"
    ]),
    return {
        "embeddings": embs,
        "cosine_distances": [
            {
                "basket_sports": cosine_distance(embs[0], embs[1])
            },
            {
                "sports_tea": cosine_distance(embs[1], embs[2])
            },
            {
                "tea_basket": cosine_distance(embs[2], embs[0])
            }
        ]
    }
