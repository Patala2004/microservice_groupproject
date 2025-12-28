import post_info
import translation
import ollama_llm as llm
import embeddings
import tagging_pgdb as db
import posttag_pgbd as posttag_db

qwen8b = llm.Qwen3_8b()

# --- endpoints ---


def tag_post(post_id: int):
    title, content = post_info.getTitleContent(post_id)

    translated_title_content = translation.translate(
        texts=[title, content],
        language="English"
    )

    tagname_list = qwen8b.generate_tags(
        input_title=translated_title_content[0],
        input_content=translated_title_content[1]
    )

    vectors = embeddings.embed(tagname_list)

    id_list = store_explicit_tags(tagname_list, vectors)

    final_list = get_related_tags(id_list)

    posttag_db.add_relations(tag_ids=final_list, post_id=post_id)


def store_explicit_tags(tagname_list, vectors):
    id_list = [int]
    for i in range(len(vectors)):
        current = db.store_tag(
            name=tagname_list[i],
            embedding=vectors[i]
        )
        id_list.append(current.id)
    return id_list


def get_related_tags(explicit_id_list: list[int]):
    related_id_list: set[int] = set()
    related_id_list.update(explicit_id_list)
    for tag_id in explicit_id_list:
        related_ids = db.get_top3_related_tags(tag_id)
        related_id_list.update(related_ids)
    final_list = list(related_id_list)
    return final_list
