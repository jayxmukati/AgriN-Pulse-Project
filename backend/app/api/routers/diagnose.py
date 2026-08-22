from fastapi import APIRouter

router = APIRouter()

@router.post("/")
async def diagnose_plant():
    return {"status": "success", "disease_name": "Tomato Early Blight", "confidence": 0.94}
