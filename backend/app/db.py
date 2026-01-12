from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# SQLite Database URL
SQLALCHEMY_DATABASE_URL = "sqlite:///./recallai.db"

# Create Engine
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    connect_args={"check_same_thread": False} # Needed for SQLite
)

# Create Session Factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)