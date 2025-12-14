from fastapi import FastAPI, HTTPException
import ollama_llm as llm

app = FastAPI()

# --- for test ---

tllm = llm.Qwen3_8b()

# --- endpoints ---

@app.post("/translate")
def translate(input, language):
    try:
       translation = tllm.translate(input, language)  
       return {"translation": translation}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))




# --- funcs for test ---

def llm_test_1(llm: llm.OllamaLLM):
    return llm.translate(
        input="We would want to play a basketball match tomorrw at 8 pm. We still need 4 extra people. Please join in!",
        language="Chinese"
    )

def llm_test_2(llm: llm.OllamaLLM):
    return llm.translate(
        input="Hi, I'm selling a 66L capacity fridge with a 22L capacity freezer for ¥200. If anyone is interested, please contact me before the end of this month.",
        language="Chinese"
    )

def llm_test_3(llm: llm.OllamaLLM):
    return llm.translate(
        input_content="We would like to go to the cinema in Anting this Saturday to watch Zootropolis 2. If someone else also wants to come we could share transport expenses.",
        language="Chinese"
    )


def llm_test(llm: llm.OllamaLLM):
    return [llm_test_1(llm), llm_test_2(llm), llm_test_3(llm)]


# --- test endpoints ---

@app.post("/llm-test/qwenb8")
def llm_test_qwenb8():
    llm_test(tllm)


