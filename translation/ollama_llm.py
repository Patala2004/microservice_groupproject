from ollama import Client
import os

class OllamaLLM:
    _shared_client = None

    def __init__(self, model_name = ""):
        if OllamaLLM._shared_client == None:
            OllamaLLM._shared_client = Client(
                host=os.environ['OLLAMA_HOST'],
                headers={}
            )
        self.client = OllamaLLM._shared_client
        self.model_name = model_name
    
    def translate(self, input, language):
        response = self.client.generate(
            prompt = get_prompt(input=input, language=language),
            model = self.model_name
        )
        return response.message.content

class Qwen3_8b(OllamaLLM):
    def __init__(self):
        super().__init__(model_name = "qwen3:8b")


def get_prompt(input: str, language: str):
    return (
        f"""Instructions:
        - Translate the following text into {language}. 
        - Do not add any extra comments or text.

        Text:
        {input}"""
    )

def response_to_tagnames_list(response: str):
    return response.split("$")



