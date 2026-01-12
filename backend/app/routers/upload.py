from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

# Import from the FIXED schema and db files
from app.db import SessionLocal
from app.models.schema import UploadRequest, SavedNote
from app.store import class_state 

router = APIRouter()

# DB Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/")
def upload_class_content(payload: UploadRequest, db: Session = Depends(get_db)):
    try:
        if not payload.content.strip():
             raise HTTPException(status_code=400, detail="Content cannot be empty")

        # 1. Create a new SavedNote record
        new_note = SavedNote(
            content=payload.content,
            note_type="raw_submission",
            created_at=datetime.utcnow()
        )

        # 2. Add to DB
        db.add(new_note)
        db.commit()
        db.refresh(new_note)

        # 3. Update Faculty Dashboard State
        class_state["last_note_id"] = new_note.id
        class_state["last_class_content"] = payload.content

        return {
            "message": "Notes uploaded successfully",
            "note_id": new_note.id
        }

    except Exception as e:
        db.rollback()
        print(f"Upload Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to upload notes")