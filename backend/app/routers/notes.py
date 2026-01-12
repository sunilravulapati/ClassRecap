from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

# Import your database session and model
from app.db import SessionLocal
from app.models.schema import SavedNote, SavedNoteResponse

router = APIRouter()

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=List[SavedNoteResponse])
def get_all_notes(db: Session = Depends(get_db)):
    """
    Fetches all saved notes (both raw uploads and AI refinements).
    Ordered by newest first.
    """
    try:
        # Query using the SQLAlchemy ORM
        notes = db.query(SavedNote).order_by(SavedNote.created_at.desc()).all()
        return notes
        
    except Exception as e:
        print(f"Error fetching notes: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch notes")