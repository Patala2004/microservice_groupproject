from ollama import Client
import os


class OllamaLLM:
    _shared_client = None

    def __init__(self, model_name=""):
        if OllamaLLM._shared_client == None:
            OllamaLLM._shared_client = Client(
                host=os.environ['OLLAMA_HOST'],
                headers={}
            )
        self.client = OllamaLLM._shared_client
        self.model_name = model_name

    def generate_tags(self, input_title, input_content):
        response = self.client.generate(
            prompt=get_prompt(input_title, input_content),
            model=self.model_name
        )
        return response_to_tagnames_list(response.message.content)


class Phi3_3b(OllamaLLM):
    def __init__(self):
        super().__init__(model_name="phi3:3.8b-mini-4k-instruct-q2_K")


class Qwen3_4b(OllamaLLM):
    def __init__(self):
        super().__init__(model_name="qwen3:4b")


class Qwen3_8b(OllamaLLM):
    def __init__(self):
        super().__init__(model_name="qwen3:8b")


def get_prompt(input_title: str, input_content: str):
    return (
        f"""Task: Extract between 1 and 15 concepts that represent the main topics of the Title and Content.
        Extraction rules (strict):
        - Concepts must be nouns or noun phrases.
        - Concepts must represent the main subjects or high-level themes (e.g., activity, domain, object, event, topic).
        - Concepts must be explicitly present or clearly implied by the Title or Content.
        - Ignore all secondary details, including: time, date, location, people, invitations, metadata, opinions, logistics, prices, or any other incidental information.
        - Do not infer or invent information not grounded in the text.
        - Do not repeat concepts.
        - Output strictly in the format: <concept>$<concept>$...<concept> (with $ and no spaces).
        - Output only the concepts.

        Input:
        Title: {input_title}
        Content: {input_content}
        """
    )


def response_to_tagnames_list(response: str):
    return response.split("$")
