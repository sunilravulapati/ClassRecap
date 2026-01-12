# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db import engine
from app.models import schema
# Import routers
from app.routers import upload, student_notes, summary, quiz, notes

schema.Base.metadata.create_all(bind=engine)

app = FastAPI(title="RecallAI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow your frontend to connect
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# REGISTER ROUTERS
app.include_router(notes.router, prefix="/notes", tags=["Notes"])
app.include_router(student_notes.router, tags=["Student Notes"])
app.include_router(upload.router, prefix="/upload", tags=["Upload"])
app.include_router(summary.router, prefix="/summary", tags=["Summary"])
app.include_router(quiz.router, prefix="/quiz", tags=["Quiz"])

@app.get("/")
def read_root():
    return {"status": "running"}