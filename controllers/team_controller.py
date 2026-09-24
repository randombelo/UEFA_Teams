from typing import List, Optional
from fastapi import HTTPException, status
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from models.team_model import Team
from schemas.team_schema import TeamCreate, TeamUpdate


def get_all_teams(db: Session, skip: int = 0, limit: int = 100) -> List[Team]:
    """
    Retrieve a paginated list of teams from the database.
    """
    try:
        return db.query(Team).offset(skip).limit(limit).all()
    except SQLAlchemyError as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error while retrieving teams: {str(error)}"
        )


def get_team_by_id(db: Session, team_id: int) -> Optional[Team]:
    """
    Retrieve a single team by its primary key ID.
    """
    try:
        return db.query(Team).filter(Team.id == team_id).first()
    except SQLAlchemyError as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error while retrieving team {team_id}: {str(error)}"
        )


def create_team(db: Session, team_data: TeamCreate) -> Team:
    """
    Insert a new team record into the database with transaction error handling.
    """
    new_team = Team(
        name=team_data.name,
        founded_date=team_data.founded_date,
        country=team_data.country,
        titles_won=team_data.titles_won,
        uefa_ranking=team_data.uefa_ranking,
        division=team_data.division,
        head_coach=team_data.head_coach,
        president=team_data.president
    )
    try:
        db.add(new_team)
        db.commit()          # ← aquí se genera el id
        db.refresh(new_team)
        return new_team
    except SQLAlchemyError as error:
        db.rollback()        # ← revierte la transacción para no dejar sesión corrupta
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error while creating team: {str(error)}"
        )


def update_team(db: Session, team_id: int, team_data: TeamUpdate) -> Optional[Team]:
    """
    Update an existing team record with provided non-null fields.
    """
    existing_team = get_team_by_id(db, team_id)
    if not existing_team:
        return None

    update_fields = team_data.model_dump(exclude_unset=True)
    for field, value in update_fields.items():
        setattr(existing_team, field, value)

    try:
        db.commit()
        db.refresh(existing_team)
        return existing_team
    except SQLAlchemyError as error:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error while updating team {team_id}: {str(error)}"
        )


def delete_team(db: Session, team_id: int) -> bool:
    """
    Delete a team record by its ID. Returns True if deleted, False if not found.
    """
    existing_team = get_team_by_id(db, team_id)
    if not existing_team:
        return False

    try:
        db.delete(existing_team)
        db.commit()
        return True
    except SQLAlchemyError as error:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error while deleting team {team_id}: {str(error)}"
        )