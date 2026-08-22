from fastapi import APIRouter

router = APIRouter()

@router.post("/register")
async def register_field():
    return {"status": "success", "message": "Field registered successfully"}
