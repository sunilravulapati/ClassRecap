from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.services.summarizer import generate_summary
from app.db import SessionLocal
from app.models.schema import SavedNote

router = APIRouter()

# Database Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/")
def get_class_summary(db: Session = Depends(get_db)):
    """
    Fetches the latest student submission from the DB and generates a summary.
    """
    # 1. Find the latest note with note_type="raw_submission"
    # This ensures we get what the student just uploaded via the "Upload to Faculty" button
    latest_note = (
        db.query(SavedNote)
        .filter(SavedNote.note_type == "raw_submission")
        .order_by(SavedNote.created_at.desc())
        .first()
    )

    # 2. If no notes exist in the DB, return the empty state
    if not latest_note:
        return {
            "topics": [],
            "key_takeaways": ["No class content uploaded yet"],
            "recap_questions": []
        }

    # 3. Generate the summary using the content from the Database
    # (Note: This might take a few seconds as it calls the AI)
    return generate_summary(latest_note.content)