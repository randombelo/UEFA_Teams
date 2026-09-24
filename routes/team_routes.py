from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from database.database import get_db
from schemas.team_schema import TeamCreate, TeamUpdate, TeamResponse
import controllers.team_controller as team_controller

router = APIRouter(prefix="/teams", tags=["Teams"])


@router.get(
    "/",
    response_model=List[TeamResponse],
    summary="Get all teams",
    description="Retrieve a list of teams with optional pagination."
)
def read_teams(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=100, description="Maximum number of records to return"),
    db: Session = Depends(get_db)
):
    return team_controller.get_all_teams(db=db, skip=skip, limit=limit)


@router.get(
    "/{team_id}",
    response_model=TeamResponse,
    summary="Get a team by ID",
    description="Retrieve specific details of a single team by its ID."
)
def read_team(
    team_id: int,
    db: Session = Depends(get_db)
):
    team = team_controller.get_team_by_id(db=db, team_id=team_id)
    if not team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Team with id {team_id} not found"
        )
    return team


@router.post(
    "/",
    response_model=TeamResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new team",
    description="Add a new team entry to the database."
)
def create_new_team(
    team_data: TeamCreate,
    db: Session = Depends(get_db)
):
    return team_controller.create_team(db=db, team_data=team_data)


@router.put(
    "/{team_id}",
    response_model=TeamResponse,
    summary="Update an existing team",
    description="Update one or more attributes of an existing team."
)
def update_existing_team(
    team_id: int,
    team_data: TeamUpdate,
    db: Session = Depends(get_db)
):
    updated_team = team_controller.update_team(db=db, team_id=team_id, team_data=team_data)
    if not updated_team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Team with id {team_id} not found"
        )
    return updated_team


@router.delete(
    "/{team_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a team",
    description="Permanently remove a team and cascade its players by ID."
)
def remove_team(
    team_id: int,
    db: Session = Depends(get_db)
):
    deleted = team_controller.delete_team(db=db, team_id=team_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Team with id {team_id} not found"
        )
    return None