from mistralai import Mistral
from ollama import Client
import os
from abc import ABC, abstractmethod

LLM_FLAG = os.environ["LLM_FLAG"]

OLLAMA_MODEL_NAME = os.environ["OLLAMA_MODEL_NAME"]
OLLAMA_HOST = os.environ["OLLAMA_HOST"]

MISTRAL_MODEL_NAME = os.environ["MISTRAL_MODEL_NAME"]
MISTRAL_API_KEY = "ZhrxrPAQloPtDvssR8Sac5cvEkXcY1UV"


class LLM(ABC):
    @abstractmethod
    def __init__(self):
        pass

    @abstractmethod
    def generate_tags(self, input_title, input_content):
        pass


class Ollama_LLM(LLM):
    _shared_client = None

    def __init__(self):
        if Ollama_LLM._shared_client == None:
            Ollama_LLM._shared_client = Client(
                host=OLLAMA_HOST,
                headers={}
            )
        self.client = Ollama_LLM._shared_client
        self.model_name = OLLAMA_MODEL_NAME

    def generate_tags(self, input_title, input_content):
        response = self.client.generate(
            prompt=get_prompt(input_title, input_content),
            model=self.model_name
        )
        return response_to_tagnames_list(response.response)


class Mistral_LLM(LLM):
    def __init__(self):
        self.key = MISTRAL_API_KEY
        self.model_name = MISTRAL_MODEL_NAME

    def generate_tags(self, input_title, input_content):
        try:
            with Mistral(
                api_key=self.key
            ) as mistral:
                res = mistral.chat.complete(
                    model=self.model_name,
                    messages=[
                        {
                            "content": get_prompt(input_title=input_title, input_content=input_content),
                            "role": "user"
                        }
                    ],
                    stream=False
                )
            text = extract_text_from_content(res.choices[0].message.content)
            return response_to_tagnames_list(text)

        except:
            return response_to_tagnames_list(fake_response())


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


def extract_text_from_content(content):
    if isinstance(content, str):
        return content

    texts = []
    for chunk in content:
        if hasattr(chunk, "text"):
            texts.append(chunk.text)

    return "".join(texts)


def fake_response():
    fr_list = "Sports"
    return fr_list


def get_llm() -> LLM:
    if LLM_FLAG.upper() == "API":
        return Mistral_LLM()
    else:  # OLLAMA
        return Ollama_LLM()
