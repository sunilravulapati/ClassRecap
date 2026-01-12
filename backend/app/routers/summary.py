# app/routers/summary.py
from fastapi import APIRouter
from app.services.summarizer import generate_summary
from app.store import class_state

router = APIRouter()

@router.get("/")
def get_class_summary():
    content = class_state["last_class_content"]

    if not content:
        return {
            "topics": [],
            "key_takeaways": ["No class content uploaded yet"],
            "recap_questions": []
        }

    return generate_summary(content)
