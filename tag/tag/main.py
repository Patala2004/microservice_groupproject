import numpy as np
from fastapi import FastAPI, HTTPException
import post_info
import translation
import ollama_llm as llm
import embeddings
import tagging_pgdb as db
import tagpost_pgbd as tagpost_db

app = FastAPI()

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
    db.store_tag("test", [0.1]*768)


@app.post("/embeddings-test")
def embeddings_test():
    embs = embeddings.embed([
        "Basketball match",
        "Basketball",
        "Basket"
    ])
    return {
        "embeddings": embs,
        "cosine_distances": [
            {
                "basket_sports": cosine_distance(np.asarray(embs[0]), np.asarray(embs[1]))
            },
            {
                "sports_tea": cosine_distance(np.asarray(embs[1]), np.asarray(embs[2]))
            },
            {
                "tea_basket": cosine_distance(np.asarray(embs[2]), np.asarray(embs[0]))
            }
        ]
    }


@app.post("/embeddings-db-test-1")
def embeddings_db_test():
    tagname_list = [
        "Basketball",
        "Basketball match",
        "Dormitory"
    ]
    vectors = embeddings.embed(tagname_list)
    print("embeddings worked")
    for i, v in enumerate(vectors):
        print(f"Vector {i} length:", len(v))
        print(f"Vector {i} element types:", [type(x) for x in v])
    for i in range(len(vectors)):
        current_name = tagname_list[i]
        current_vector = vectors[i]
        print("before storing")
        db.store_tag(
            name=current_name,
            embedding=current_vector
        )


@app.post("/embeddings-db-test-2")
def embeddings_db_test_2():
    tagname_list = [
        "Basketball",
        "Apple",
        "Dormitory",
        "Hair dryer"
    ]
    vectors = embeddings.embed(tagname_list)
    final_tag_ids = []
    for i in range(len(vectors)):
        current = db.store_tag(
            name=tagname_list[i],
            embedding=vectors[i]
        )
        final_tag_ids.append(current.id)
