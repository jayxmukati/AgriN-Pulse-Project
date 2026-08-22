from fastapi import APIRouter

router = APIRouter()

@router.get("/jsonld")
async def export_jsonld():
    return {"@context": "https://schema.org", "@type": "Dataset", "name": "BRICS AgriN-Pulse Export"}
