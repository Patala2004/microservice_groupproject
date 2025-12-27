from fastapi import FastAPI, HTTPException, BackgroundTasks
import httpx

app = FastAPI()

EXTERNAL_API_BASE = "http://host.docker.internal:8081/user" # User api


WECHAT_API_BASE = "http://unknown.example.com"

async def send_wechat_notif(weixinId : int):
    async with httpx.AsyncClient(timeout=5.0) as client:
        try:
            # notif_response = await client.get(f"{WECHAT_API_BASE}/{weixinId}") # For example
            # notif_response.raise_for_status()
            print(f"Sent fake notification to weixin id {weixinId}")
        except httpx.HTTPError as e:
            raise HTTPException(status_code=502, detail=str(e))

@app.get("/notify/{item_id}")
async def get_item(item_id: int, background_tasks: BackgroundTasks):
    async with httpx.AsyncClient(timeout=5.0) as client:
        try:
            response = await client.get(f"{EXTERNAL_API_BASE}/users/{item_id}/")
            response.raise_for_status()
        except httpx.HTTPError as e:
            raise HTTPException(status_code=502, detail=str(e))
        
        # Now response has user data
        print(response)
        
        user_data = response.json()
        
        weixinId = user_data.get("weixinId")
        
        # Fire-and-forget notification
        if weixinId:
            background_tasks.add_task(send_wechat_notif, weixinId)
            

    return {
        "requested_id": item_id,
        "user_data": user_data,
    }
