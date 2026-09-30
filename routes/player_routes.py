from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from database.database import get_db
from schemas.player_schema import PlayerCreate, PlayerUpdate, PlayerResponse
import controllers.player_controller as player_controller

router = APIRouter(prefix="/players", tags=["Players"])


@router.get(
    "/",
    response_model=List[PlayerResponse],
    summary="Get all players",
    description="Retrieve a list of players with optional pagination and club filter."
)
def read_players(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=100, description="Maximum number of records to return"),
    club_id: Optional[int] = Query(None, gt=0, description="Filter players by club ID"),
    db: Session = Depends(get_db)
):
    return player_controller.get_all_players(db=db, skip=skip, limit=limit, club_id=club_id)


@router.get(
    "/{player_id}",
    response_model=PlayerResponse,
    summary="Get a player by ID",
    description="Retrieve specific details of a single player by its ID."
)
def read_player(
    player_id: int,
    db: Session = Depends(get_db)
):
    player = player_controller.get_player_by_id(db=db, player_id=player_id)
    if not player:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Player with id {player_id} not found"
        )
    return player


@router.post(
    "/",
    response_model=PlayerResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new player",
    description="Add a new player entry, referencing an existing team as club."
)
def create_new_player(
    player_data: PlayerCreate,
    db: Session = Depends(get_db)
):
    return player_controller.create_player(db=db, player_data=player_data)


@router.put(
    "/{player_id}",
    response_model=PlayerResponse,
    summary="Update an existing player",
    description="Update one or more attributes of an existing player."
)
def update_existing_player(
    player_id: int,
    player_data: PlayerUpdate,
    db: Session = Depends(get_db)
):
    updated_player = player_controller.update_player(
        db=db, player_id=player_id, player_data=player_data
    )
    if not updated_player:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Player with id {player_id} not found"
        )
    return updated_player


@router.delete(
    "/{player_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a player",
    description="Permanently remove a player from the database by its ID."
)
def remove_player(
    player_id: int,
    db: Session = Depends(get_db)
):
    deleted = player_controller.delete_player(db=db, player_id=player_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Player with id {player_id} not found"
        )
    return None