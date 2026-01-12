from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.services.summarizer import generate_summary
from app.db import SessionLocal
from app.models.schema import SavedNote

router = APIRouter()

# Simple DB Dependency (No Auth)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/")  # Removed any 'dependencies=[Depends(get_current_user)]'
def get_class_summary(db: Session = Depends(get_db)):
    """
    Public endpoint to fetch the latest class summary.
    """
    # 1. Fetch latest raw submission
    latest_note = (
        db.query(SavedNote)
        .filter(SavedNote.note_type == "raw_submission")
        .order_by(SavedNote.created_at.desc())
        .first()
    )

    if not latest_note:
        return {
            "topics": [],
            "key_takeaways": ["No class content uploaded yet"],
            "recap_questions": []
        }

    # 2. Generate Summary
    return generate_summary(latest_note.content)