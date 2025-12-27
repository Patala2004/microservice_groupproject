from fastapi import FastAPI, HTTPException, BackgroundTasks
from pydantic import BaseModel
import httpx

app = FastAPI()

EXTERNAL_API_BASE = "http://host.docker.internal:8081/user" # User api
WECHAT_API_BASE = "http://unknown.example.com"

class Message(BaseModel):
    message: str

async def send_wechat_notif(weixinId : int, message : str):
    async with httpx.AsyncClient(timeout=5.0) as client:
        try:
            # notif_response = await client.post(f"{WECHAT_API_BASE}/{weixinId}") # For example
            # notif_response.raise_for_status()
            print(f"Sent fake notification to weixin id {weixinId}: {message}")
        except httpx.HTTPError as e:
            raise HTTPException(status_code=502, detail=str(e))

@app.post("/notify/{item_id}")
async def get_item(item_id: int, message: Message, background_tasks: BackgroundTasks):
    async with httpx.AsyncClient(timeout=5.0) as client:
        try:
            response = await client.get(f"{EXTERNAL_API_BASE}/users/{item_id}/")
            response.raise_for_status()
        except httpx.HTTPStatusError as e:
            status_code = e.response.status_code

            # Propagate 4xx errors from the upstream service
            if 400 <= status_code < 500:
                raise HTTPException(
                    status_code=status_code,
                    detail=e.response.text,
                )

            # Treat 5xx as Bad Gateway
            raise HTTPException(
                status_code=502,
                detail="Upstream user service error",
            )

        except httpx.RequestError as e:
            # Network errors, timeouts, DNS, etc.
            raise HTTPException(
                status_code=502,
                detail=f"Error connecting to user service: {str(e)}",
            )
        
        # Now response has user data
        print(response)
        
        user_data = response.json()
        
        weixinId = user_data.get("weixinId")
        
        # Fire-and-forget notification
        if weixinId:
            background_tasks.add_task(send_wechat_notif, weixinId, message.message)
            

    return {
        "requested_id": item_id,
        "user_data": user_data,
    }
