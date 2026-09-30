from typing import List, Optional
from fastapi import HTTPException, status
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from models.competition_model import Competition
from schemas.competition_schema import CompetitionCreate, CompetitionUpdate


def get_all_competitions(db: Session, skip: int = 0, limit: int = 100) -> List[Competition]:
    try:
        return db.query(Competition).offset(skip).limit(limit).all()
    except SQLAlchemyError as error:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail=f"Database error while retrieving competitions: {str(error)}")


def get_competition_by_id(db: Session, competition_id: int) -> Optional[Competition]:
    try:
        return db.query(Competition).filter(Competition.id == competition_id).first()
    except SQLAlchemyError as error:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail=f"Database error while retrieving competition {competition_id}: {str(error)}")


def create_competition(db: Session, data: CompetitionCreate) -> Competition:
    new_competition = Competition(name=data.name, country=data.country)
    try:
        db.add(new_competition)
        db.commit()
        db.refresh(new_competition)
        return new_competition
    except SQLAlchemyError as error:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail=f"Database error while creating competition: {str(error)}")


def update_competition(db: Session, competition_id: int, data: CompetitionUpdate) -> Optional[Competition]:
    existing = get_competition_by_id(db, competition_id)
    if not existing:
        return None
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(existing, field, value)
    try:
        db.commit()
        db.refresh(existing)
        return existing
    except SQLAlchemyError as error:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail=f"Database error while updating competition {competition_id}: {str(error)}")


def delete_competition(db: Session, competition_id: int) -> bool:
    existing = get_competition_by_id(db, competition_id)
    if not existing:
        return False
    try:
        db.delete(existing)
        db.commit()
        return True
    except SQLAlchemyError as error:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail=f"Database error while deleting competition {competition_id}: {str(error)}")