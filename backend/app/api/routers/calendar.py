from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_calendar_tasks():
    # Simulated DB response based on seed.sql
    return [
        { "id": 1, "title": "Apply Nitrogen Fertilizer", "due": "In 3 days", "priority": "High", "type": "Nutrition" },
        { "id": 2, "title": "Inspect for Rust Spores", "due": "In 5 days", "priority": "Medium", "type": "Scouting" },
        { "id": 3, "title": "Reduce Irrigation Frequency", "due": "Next Week", "priority": "Low", "type": "Water" },
        { "id": 4, "title": "Harvest Wheat Plot A", "due": "Next Month", "priority": "High", "type": "Harvest" },
        { "id": 5, "title": "Soil Sample Testing", "due": "In 14 days", "priority": "Medium", "type": "Analysis" }
    ]
