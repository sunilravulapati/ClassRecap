from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List

# Correct Imports
from app.models.schema import NoteRequest, NoteSaveRequest, NoteResponse, SavedNote, SavedNotesListResponse
from app.db import SessionLocal
from app.services.student_notes import generate_student_notes

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- Endpoints ---

@router.post("/student-notes", response_model=NoteResponse)
async def refine_student_notes(request: NoteRequest):
    try:
        if not request.content.strip():
            raise HTTPException(status_code=400, detail="Content cannot be empty")
        
        refined_notes = generate_student_notes(request.content)
        return {"notes": refined_notes}
    except Exception as e:
        print(f"Error in refine_student_notes: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/student-notes/save")
async def save_note(request: NoteSaveRequest, db: Session = Depends(get_db)):
    try:
        if not request.content.strip():
            raise HTTPException(status_code=400, detail="Content cannot be empty")
        
        new_note = SavedNote(
            content=request.content,
            note_type=request.note_type,
            created_at=datetime.utcnow()
        )
        
        db.add(new_note)
        db.commit()
        db.refresh(new_note)
        
        return {"success": True, "message": "Note saved", "note_id": new_note.id}
    except Exception as e:
        db.rollback()
        print(f"Error in save_note: {e}")
        raise HTTPException(status_code=500, detail="Failed to save note")


@router.get("/student-notes/saved", response_model=SavedNotesListResponse)
async def get_saved_notes(db: Session = Depends(get_db)):
    try:
        saved_notes = db.query(SavedNote).order_by(SavedNote.created_at.desc()).all()
        return {"saved_notes": saved_notes}
    except Exception as e:
        print(f"Error in get_saved_notes: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch notes")