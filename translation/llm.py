from ollama import Client
from mistralai import Mistral
import os
from abc import ABC, abstractmethod


LLM_FLAG = os.environ["LLM_FLAG"]

OLLAMA_HOST = os.environ["OLLAMA_HOST"]
OLLAMA_MODEL_NAME = os.environ["OLLAMA_MODEL_NAME"]

MISTRAL_MODEL_NAME = os.environ["MISTRAL_MODEL_NAME"]
API_KEY = "ZhrxrPAQloPtDvssR8Sac5cvEkXcY1UV"

SEPARATOR = "$%$%"


class LLM(ABC):
    @abstractmethod
    def __init__(self):
        pass

    @abstractmethod
    def translate(self, texts, language):
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

    def translate(self, texts, language):
        response = self.client.generate(
            prompt=get_prompt(texts=texts, language=language),
            model=self.model_name
        )
        return response_to_list(response.response)


class Mistral_LLM(LLM):
    def __init__(self):
        self.model_name = MISTRAL_MODEL_NAME
        self.key = API_KEY

    def translate(self, texts, language):
        try:
            with Mistral(
                api_key=self.key
            ) as mistral:
                res = mistral.chat.complete(
                    model=self.model_name,
                    messages=[
                        {
                            "content": get_prompt(texts=texts, language=language),
                            "role": "user"
                        }
                    ],
                    stream=False
                )
            text = extract_text_from_content(res.choices[0].message.content)
            return response_to_list(text)

        except:
            return response_to_list(fake_response(texts, language))


def get_prompt(texts: list[str], language: str):
    n = len(texts)
    return (
        f"""Instructions:
        - Translate the following {n} text(s) into {language}.
        - Return ONLY the translated text(s).
        - Do NOT include numbering, labels, or explanations.
        - If there is more than one translated text, separate them using exactly this token: {SEPARATOR}
        - Do NOT add the separator at the beginning or end.
        - Output must be a single line.

        Example output for 3 texts: <translation1>{SEPARATOR}<translation2>{SEPARATOR}<translation3>

        Texts to translate:
        {format_texts_for_prompt(texts)}""".strip()
    )


def format_texts_for_prompt(texts: list[str]) -> str:
    lines = []
    for i in range(len(texts)):
        lines.append(f"Text {i+1}: {texts[i]}")
    return "\n".join(lines)


def response_to_list(response: str):
    return response.split(SEPARATOR)


def extract_text_from_content(content):
    if isinstance(content, str):
        return content

    texts = []
    for chunk in content:
        if hasattr(chunk, "text"):
            texts.append(chunk.text)

    return "".join(texts)


def fake_response(texts: list[str], language: str):
    fake_response = f"This is a fake response for the translation to {language}. Translation failed due to network connection error or exceeding Mistral API call usage."
    fr_list = []
    for t in texts:
        fr_list.append(fake_response)
    return SEPARATOR.join(fr_list)


def get_llm() -> LLM:
    if LLM_FLAG.upper() == "API":
        return Mistral_LLM()
    else:  # OLLAMA
        return Ollama_LLM()
