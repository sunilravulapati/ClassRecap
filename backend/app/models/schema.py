from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel
from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.orm import declarative_base

# ==========================================
# 1. Pydantic Schemas (API Validation)
# ==========================================

class UploadRequest(BaseModel):
    content: str

class NoteRequest(BaseModel):
    content: str

class NoteSaveRequest(BaseModel):
    content: str
    note_type: str = "ai_refined"

class NoteResponse(BaseModel):
    notes: str

class SavedNoteResponse(BaseModel):
    id: int
    content: str
    note_type: str
    created_at: datetime
    class Config:
        from_attributes = True

class SavedNotesListResponse(BaseModel):
    saved_notes: List[SavedNoteResponse]

# ==========================================
# 2. SQLAlchemy Models (Database Tables)
# ==========================================

Base = declarative_base()

class SavedNote(Base):
    __tablename__ = "saved_notes"
    
    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text, nullable=False)
    note_type = Column(String(50), nullable=False)  # 'raw_submission' or 'ai_refined'
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)