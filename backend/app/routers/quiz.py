from fastapi import APIRouter
from app.services.quiz_generator import generate_quiz

router = APIRouter()

@router.get("/")
def get_quiz():
    return generate_quiz()
