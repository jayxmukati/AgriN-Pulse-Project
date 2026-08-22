import io
from PIL import Image

def strip_exif(image_bytes: bytes) -> bytes:
    """Strip EXIF metadata from the image to anonymize GPS/Camera details."""
    try:
        img = Image.open(io.BytesIO(image_bytes))
        data = list(img.getdata())
        image_without_exif = Image.new(img.mode, img.size)
        image_without_exif.putdata(data)
        out = io.BytesIO()
        image_without_exif.save(out, format="JPEG")
        return out.getvalue()
    except Exception as e:
        # Fallback to original bytes if stripping fails
        return image_bytes

def predict_disease(image_bytes: bytes) -> dict:
    """Mock function simulating an ONNX EfficientNet-B2 model inference."""
    # Simulate stripping EXIF
    clean_bytes = strip_exif(image_bytes)
    
    # Simulate inference result
    return {
        "disease_name": "Tomato Early Blight - Alternaria solani",
        "confidence": 0.94,
        "alternatives": [
            {"disease_name": "Septoria Leaf Spot", "confidence": 0.12},
            {"disease_name": "Late Blight", "confidence": 0.04}
        ]
    }
