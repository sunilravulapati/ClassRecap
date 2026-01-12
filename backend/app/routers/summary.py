from fastapi import APIRouter
from app.services.summarizer import generate_summary

router = APIRouter()

@router.get("/")
def get_class_summary():
    try:
        return generate_summary()
    except Exception as e:
        return {
            "topics": [],
            "key_takeaways": ["No summary available yet"]
        }
