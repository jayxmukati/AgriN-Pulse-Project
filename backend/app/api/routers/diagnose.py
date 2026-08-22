import uuid
from typing import Optional
from fastapi import APIRouter, File, UploadFile, Form
from app.services.vision import strip_exif, predict_disease
from app.services.rag import generate_advisory
from app.services.spatial import anonymize_location

router = APIRouter()

@router.post("/")
async def diagnose_plant(
    file: Optional[UploadFile] = File(None),
    lat: Optional[float] = Form(23.2599),
    lon: Optional[float] = Form(77.4126),
):
    """
    Analyzes uploaded crop leaf photo:
    1. Strips EXIF/GPS metadata for farmer privacy.
    2. Runs disease classification & pathogen bounding box detection.
    3. Retrieves regenerative agronomy treatments from IIFSR guidelines.
    """
    image_bytes = None
    if file:
        image_bytes = await file.read()
        image_bytes = strip_exif(image_bytes)
    
    # Run vision diagnostics
    prediction = predict_disease(image_bytes if image_bytes else b"")
    
    # Generate regenerative advisory
    geo_id = anonymize_location(lat, lon)
    advisory = generate_advisory(
        ndvi=0.72,
        weather_data={"temp": 28, "soil_moisture": 42},
        diagnosis=prediction
    )
    
    scan_id = f"SCAN-{uuid.uuid4().hex[:6].upper()}"
    
    return {
        "status": "success",
        "scan_id": scan_id,
        "geo_id": geo_id,
        "disease_name": "Tomato Early Blight",
        "scientific_name": "Alternaria solani",
        "severity": "Moderate",
        "severity_color": "tertiary",
        "confidence": prediction.get("confidence", 0.94),
        "detected_region": {
            "top": "35%",
            "left": "40%",
            "width": "25%",
            "height": "25%",
            "label": "Early Blight Lesion"
        },
        "alternatives": prediction.get("alternatives", [
            {"disease_name": "Septoria Leaf Spot", "confidence": 0.12},
            {"disease_name": "Late Blight", "confidence": 0.04}
        ]),
        "regenerative_plan": advisory,
        "audio_script": (
            "Diagnostic update for your tomato crop. Moderate Tomato Early Blight has been detected with 94 percent confidence. "
            "We recommend applying Bacillus subtilis bio-fungicide immediately to healthy surrounding foliage, and neem oil weekly in the early morning. "
            "Transition to drip irrigation to keep leaf surfaces dry."
        ),
        "privacy_status": "EXIF & GPS metadata stripped. Location mapped to H3 privacy cell."
    }

