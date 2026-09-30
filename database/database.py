from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from config.config_variables import DATABASE_URL

# SQLite requires 'check_same_thread: False' to allow multi-threaded requests in FastAPI
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)

# SessionLocal class to generate new database sessions per request
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Base class for SQLAlchemy declarative models
Base = declarative_base()


def get_db() -> Generator[Session, None, None]:
    """
    Dependency helper that yields an active database session
    and guarantees its closure after the request finishes.
    """
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()