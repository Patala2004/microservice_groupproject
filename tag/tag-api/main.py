from fastapi import FastAPI, HTTPException
import producer

app = FastAPI()


@app.post("/tag")
def tag(post_id: int):
    try:
        producer.publish_to_rabbit(post_id=post_id)

        return {"status": "ok"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/tag")
def tag(post_id: int):
    try:
        producer.publish_to_rabbit(post_id=post_id)

        return {"status": "ok"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
