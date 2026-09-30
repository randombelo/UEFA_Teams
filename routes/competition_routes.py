from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from database.database import get_db
from schemas.competition_schema import CompetitionCreate, CompetitionUpdate, CompetitionResponse
import controllers.competition_controller as competition_controller

router = APIRouter(prefix="/competitions", tags=["Competitions"])


@router.get(
    "/",
    response_model=List[CompetitionResponse],
    summary="Get all competitions",
    description="Retrieve a list of competitions with optional pagination."
)
def read_competitions(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=100, description="Maximum number of records to return"),
    db: Session = Depends(get_db)
):
    return competition_controller.get_all_competitions(db=db, skip=skip, limit=limit)


@router.get(
    "/{competition_id}",
    response_model=CompetitionResponse,
    summary="Get a competition by ID",
    description="Retrieve specific details of a single competition by its ID."
)
def read_competition(
    competition_id: int,
    db: Session = Depends(get_db)
):
    competition = competition_controller.get_competition_by_id(db=db, competition_id=competition_id)
    if not competition:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Competition with id {competition_id} not found"
        )
    return competition


@router.post(
    "/",
    response_model=CompetitionResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new competition",
    description="Add a new competition entry to the database."
)
def create_new_competition(
    competition_data: CompetitionCreate,
    db: Session = Depends(get_db)
):
    return competition_controller.create_competition(db=db, data=competition_data)


@router.put(
    "/{competition_id}",
    response_model=CompetitionResponse,
    summary="Update an existing competition",
    description="Update one or more attributes of an existing competition."
)
def update_existing_competition(
    competition_id: int,
    competition_data: CompetitionUpdate,
    db: Session = Depends(get_db)
):
    updated_competition = competition_controller.update_competition(
        db=db, competition_id=competition_id, data=competition_data
    )
    if not updated_competition:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Competition with id {competition_id} not found"
        )
    return updated_competition


@router.delete(
    "/{competition_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a competition",
    description="Permanently remove a competition by ID."
)
def remove_competition(
    competition_id: int,
    db: Session = Depends(get_db)
):
    deleted = competition_controller.delete_competition(db=db, competition_id=competition_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Competition with id {competition_id} not found"
        )
    return None