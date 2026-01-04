from ollama import Client
import os

MODEL_NAME = "qwen3:4b"


class LLM:
    _shared_client = None

    def __init__(self):
        if LLM._shared_client == None:
            LLM._shared_client = Client(
                host=os.environ['OLLAMA_HOST'],
                headers={}
            )
        self.client = LLM._shared_client
        self.model_name = MODEL_NAME

    def translate(self, texts, language):
        response = self.client.generate(
            prompt=get_prompt(texts=texts, language=language),
            model=self.model_name
        )
        return response_to_list(response.response)


def get_prompt(texts: list[str], language: str):
    n = len(texts)
    return (
        f"""Instructions:
        - Translate the following {n} text(s) into {language}.
        - Return ONLY the translated text(s).
        - Do NOT include numbering, labels, or explanations.
        - If there is more than one translated text, separate them using exactly this token: $%$%
        - Do NOT add the separator at the beginning or end.
        - Output must be a single line.

        Example output for 3 texts: <translation1>$%$%<translation2>$%$%<translation3>

        Texts to translate:
        {format_texts_for_prompt(texts)}""".strip()
    )


def format_texts_for_prompt(texts: list[str]) -> str:
    lines = []
    for i in range(len(texts)):
        lines.append(f"Text {i+1}: {texts[i]}")
    return "\n".join(lines)


def response_to_list(response: str):
    return response.split("$%$%")
