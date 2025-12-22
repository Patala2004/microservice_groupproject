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
        return response_to_tagnames_list(response.response)


class Qwen3_8b(OllamaLLM):
    def __init__(self):
        super().__init__(model_name="qwen3:8b")


def get_prompt(input_title: str, input_content: str):
    return (
        f"""Task: Extract between 1 and 15 concepts representing the main topics of the Title and Content from Input.

        Concepts:
        - Should be simple nouns that represents a main subject, object, activity, event, domain, or topic.
        - Something that captures the essence of what the text is about.
        - It also includes named works of media (for example, the name of a book).

        Ignore secondary information, which includes:   
        - Specific dates, times, or periods
        - Specific addresses (only general categories are okay)
        - Personal names
        - Metadata, invitations, prices, logistics, numbers, or incidental details
        - Opinions or subjective comments

        Output:
        - Do not repeat exactly the same concepts.
        - Output only the concepts.
        - Format for multiple concepts: <concept>$<concept>$<concept>
        - Format for single concept: <concept>
        - Do not add any extra text or explanation.

        Input:
        Title: {input_title}
        Content: {input_content}
        """
    )


def response_to_tagnames_list(response: str):
    return response.split("$")
