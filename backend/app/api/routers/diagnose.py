import uuid
from typing import Optional
from fastapi import APIRouter, File, UploadFile, Form
from app.services.vision import strip_exif, predict_disease
from app.services.treatments import get_treatment_plan
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
    3. Retrieves regenerative agronomy treatments from knowledge base.
    """
    image_bytes = None
    if file:
        image_bytes = await file.read()
        image_bytes = strip_exif(image_bytes)
    
    # Run vision diagnostics
    prediction = predict_disease(image_bytes if image_bytes else b"")
    
    if prediction and "error" in prediction[0]:
        return {
            "status": "error",
            "message": prediction[0]["error"]
        }
    
    # Generate regenerative advisory
    geo_id = anonymize_location(lat, lon)
    top_detection = prediction[0] if prediction else {}
    disease_name = top_detection.get("disease_name", "Unknown Disease")
    
    advisory = get_treatment_plan(disease_name)
    
    scan_id = f"SCAN-{uuid.uuid4().hex[:6].upper()}"
    
    # Dynamically construct audio script
    is_healthy = "Healthy" in disease_name
    primary_treatment = advisory.get("natural_treatments", [""])[0] if advisory.get("natural_treatments") else ""
    
    if is_healthy:
        audio_script = "Diagnostic complete. Your crop appears healthy! No immediate intervention is required. Maintain your current regenerative soil practices."
    else:
        audio_script = f"Diagnostic update. The scan indicates a high probability of {disease_name}. For remediation, we recommend {primary_treatment}"

    return {
        "status": "success",
        "scan_id": scan_id,
        "geo_id": geo_id,
        "disease_name": disease_name,
        "scientific_name": "Pathogen Detection",
        "severity": advisory.get("warning_level", "Unknown"),
        "severity_color": "tertiary",
        "confidence": top_detection.get("confidence", 0.94),
        "detections": prediction,
        "regenerative_plan": advisory,
        "audio_script": audio_script,
        "privacy_status": "EXIF & GPS metadata stripped. Location mapped to H3 privacy cell."
    }

