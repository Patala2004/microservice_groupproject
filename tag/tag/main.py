import numpy as np
from fastapi import FastAPI, HTTPException
import post_info
import translation
import ollama_llm as llm
import embeddings
import tagging_pgdb as db
import posttag_pgbd as posttag_db

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

        posttag_db.add_relations(tag_ids=final_tag_ids, post_id=post_id)

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
    id_list = []
    for i in range(len(vectors)):
        current_name = tagname_list[i]
        current_vector = vectors[i]
        id_list.append(db.store_tag(
            name=current_name,
            embedding=current_vector
        ))

    return id_list


@app.post("/embeddings-db-test-2")
def embeddings_db_test_2():
    tagname_list = [
        "Basketball",
        "Apple",
        "Dormitory",
        "Hair dryer"
    ]
    vectors = embeddings.embed(tagname_list)
    id_list = []
    for i in range(len(vectors)):
        current_name = tagname_list[i]
        current_vector = vectors[i]
        id_list.append(db.store_tag(
            name=current_name,
            embedding=current_vector
        ))


@app.post("/embedding-db-similarity-test")
def embeddings_db_similarity_test():
    tagnames = [
        "Basketball"
    ]
    vectors = embeddings.embed(tagnames)
    id_list = []
    for i in range(len(vectors)):
        current_name = tagnames[i]
        current_vector = vectors[i]
        id_list.append(db.store_tag(
            name=current_name,
            embedding=current_vector
        ))
    related_id_list: set[int] = set()
    related_id_list.update(id_list)
    for tag_id in id_list:
        related_ids = db.get_top3_related_tags(tag_id)
        related_id_list.update(related_ids)
    final_list = list(related_id_list)
    return final_list


@app.post("/post-tag-test-1")
def posttag_test_1():
    post = 1
    tags = [1, 2, 3, 4, 5]
    posttag_db.add_relations(tag_ids=tags, post_id=post)


@app.post("/post-tag-test-2")
def posttag_test_2():
    post = 1
    tags = [3, 4, 5, 6, 7, 8]
    posttag_db.add_relations(tag_ids=tags, post_id=post)


@app.post("/post-tag-test-3")
def posttag_test_2():
    post = 1
    posttag_db.delete_relations(post)
