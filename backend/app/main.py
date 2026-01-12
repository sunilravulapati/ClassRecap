from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import student_notes
from app.routers import upload, summary, quiz,notes

from app.db import engine
from app.models import schema

# Create tables automatically on startup
schema.Base.metadata.create_all(bind=engine)
app = FastAPI(title="ClassPulse API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(notes.router, prefix="/notes")
app.include_router(student_notes.router, prefix="/student-notes")
app.include_router(upload.router, prefix="/upload")
app.include_router(summary.router, prefix="/summary")
app.include_router(quiz.router, prefix="/quiz")

@app.get("/")
def health():
    return {"status": "running"}

schema.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- REGISTER ROUTERS ---
# The prefixes here determine the final URL. 
# Since student_notes.py already has "/student-notes" in the decorator, 
# we leave the prefix empty to avoid "/student-notes/student-notes".

app.include_router(upload.router, prefix="/upload", tags=["Upload"])
app.include_router(student_notes.router, tags=["Student Notes"])

@app.get("/")
def read_root():
    return {"message": "ClassPulse API is running"}
