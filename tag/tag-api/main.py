from fastapi import FastAPI, HTTPException
import producer
from pydantic import BaseModel, Field

app = FastAPI()


class TagResponse(BaseModel):
    status: str = Field(..., example="ok")


@app.post(
    "/tag",
    summary="Tag post",
    description="Adds tag-post relations. If the post is already tagged, it will overwrite the previous tagging.",
    response_model=TagResponse
)
def tag(post_id: int):
    try:
        producer.publish_to_rabbit(post_id=post_id, delete=False)

        return {"status": "ok"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.delete(
    "/tag",
    summary="Delete post tags",
    description="Deletes all post-tag relations from a specific post.",
    response_model=TagResponse
)
def tag(post_id: int):
    try:
        producer.publish_to_rabbit(post_id=post_id, delete=True)

        return {"status": "ok"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
