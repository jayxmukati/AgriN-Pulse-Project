from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_forum_posts():
    # Simulated DB response based on seed.sql
    return [
        {
            "id": 1,
            "author": "Ramesh Singh",
            "role": "Farmer",
            "time": "2 hours ago",
            "content": "Noticed yellowing on the lower leaves of my tomato plants. Could this be early blight?",
            "tags": ["#PestControl"],
            "likes": 12,
            "replies": [
                {
                    "author": "Dr. Anita Sharma",
                    "role": "Extension Officer",
                    "verified": True,
                    "time": "1 hour ago",
                    "content": "Yes, Ramesh. Given the recent humidity, this is highly likely Early Blight. Please apply a copper-based fungicide and ensure bottom watering to prevent splash-back."
                }
            ]
        },
        {
            "id": 2,
            "author": "Priya Patel",
            "role": "Farmer",
            "time": "5 hours ago",
            "content": "Has anyone received the latest fertilizer subsidy direct benefit transfer? Mine is delayed.",
            "tags": ["#Subsidies"],
            "likes": 45,
            "replies": []
        },
        {
            "id": 3,
            "author": "John Doe",
            "role": "Farmer",
            "time": "1 day ago",
            "content": "What cover crops are best for restoring nitrogen?",
            "tags": ["#Nutrition"],
            "likes": 22,
            "replies": [
                {
                    "author": "Ext. Agent Smith",
                    "role": "Extension Officer",
                    "verified": True,
                    "time": "20 hours ago",
                    "content": "Legumes such as clover or vetch are excellent nitrogen fixers."
                }
            ]
        },
        {
            "id": 4,
            "author": "Anna K",
            "role": "Farmer",
            "time": "3 days ago",
            "content": "Is it too late to sow winter wheat?",
            "tags": ["#Irrigation"],
            "likes": 5,
            "replies": []
        },
        {
            "id": 5,
            "author": "Dev",
            "role": "Agronomist",
            "time": "4 days ago",
            "content": "Remember to calibrate your sprayers before applying pesticides.",
            "tags": ["#PestControl"],
            "likes": 89,
            "replies": []
        }
    ]
