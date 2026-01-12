from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db import engine
from app.models import schema

# 1. IMPORT ALL ROUTERS
# Ensure you have files for all of these in app/routers/
from app.routers import upload, student_notes, summary, quiz, notes

# 2. CREATE DATABASE TABLES
# This ensures the 'saved_notes' table exists when the app starts
schema.Base.metadata.create_all(bind=engine)

# 3. INITIALIZE APP
app = FastAPI(title="RecallAI API")

# 4. CONFIGURE CORS
# allow_origins=["*"] is safer for debugging deployment issues.
# In production, you might restrict this to your specific Vercel URL.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 5. REGISTER ROUTERS
# We use prefixes for cleaner URLs.

# Notes Router (GET /notes)
app.include_router(notes.router, prefix="/notes", tags=["Notes"])

# Student Notes (POST /student-notes, POST /student-notes/save)
# Note: We leave prefix empty here because the router file likely defines the full paths
app.include_router(student_notes.router, tags=["Student Notes"])

# Upload Router (POST /upload)
app.include_router(upload.router, prefix="/upload", tags=["Upload"])

# Summary Router (GET /summary)
app.include_router(summary.router, prefix="/summary", tags=["Summary"])

# Quiz Router (GET /quiz)
app.include_router(quiz.router, prefix="/quiz", tags=["Quiz"])

# 6. HEALTH CHECK
@app.get("/")
def read_root():
    return {"status": "running", "message": "ClassPulse API is fully operational"}