from fastapi import APIRouter

router = APIRouter()

@router.post("/query")
async def voice_query():
    return {"status": "success", "transcription": "Mock transcription", "advisory": "Mock advisory"}
