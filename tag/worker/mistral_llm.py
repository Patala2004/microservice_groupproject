from mistralai import Mistral

MODEL_NAME = "mistral-large-2512"
API_KEY = "ZhrxrPAQloPtDvssR8Sac5cvEkXcY1UV"


class LLM:
    def __init__(self):
        self.key = API_KEY
        self.model_name = MODEL_NAME

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
