from fastapi import FastAPI
import post_info
import ollama_llm as llm
import embeddings
import tagging_pgdb as db
import tagpost_pgbd as tagpost_db

app = FastAPI()

@app.on_event("startup")
def on_startup():
    db.init_db()

# --- for test ---

phi3 = llm.Phi3_3b()
qwen4b = llm.Qwen3_4b()
qwen8b = llm.Qwen3_8b()

# --- endpoints ---

@app.post("/tag")
def tag(post_id):
    try:
        title, content = post_info.getTitleContent(post_id)

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

def llm_test_1(llm: llm.OllamaLLM):
    return llm.generate_tags(
        input_title="Basketball match",
        input_content="We would want to play a basketball match tomorrw at 8 pm. We still need 4 extra people. Please join in!"
    )

def llm_test_2(llm: llm.OllamaLLM):
    return llm.generate_tags(
        input_title="Selling fridge",
        input_content="Hi, I'm selling a 66L capacity fridge with a 22L capacity freezer for ¥200. If anyone is interested, please contact me before the end of this month."
    )

def llm_test_3(llm: llm.OllamaLLM):
    return llm.generate_tags(
        input_title="Zootropolis in Anting cinema this Saturday",
        input_content="We would like to go to the cinema in Anting this Saturday to watch Zootropolis 2. If someone else also wants to come we could share transport expenses."
    )


def llm_test(llm: llm.OllamaLLM):
    return [llm_test_1(llm), llm_test_2(llm), llm_test_3(llm)]


# --- test endpoints ---

@app.post("/llm-test/phi3")
def llm_test_phi3():
    llm_test(phi3)

@app.post("/llm-test/qwenb4")
def llm_test_qwenb4():
    llm_test(qwen4b)

@app.post("/llm-test/qwenb8")
def llm_test_qwenb8():
    llm_test(qwen8b)


