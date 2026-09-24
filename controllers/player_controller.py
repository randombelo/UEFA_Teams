from typing import List, Optional
from fastapi import HTTPException, status
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from models.player_model import Player
from models.team_model import Team
from schemas.player_schema import PlayerCreate, PlayerUpdate


def get_all_players(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    club_id: Optional[int] = None,
) -> List[Player]:
    """
    Retrieve a paginated list of players, optionally filtered by club.
    """
    try:
        query = db.query(Player)
        if club_id:
            query = query.filter(Player.club_id == club_id)
        return query.offset(skip).limit(limit).all()
    except SQLAlchemyError as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error while retrieving players: {str(error)}"
        )


def get_player_by_id(db: Session, player_id: int) -> Optional[Player]:
    """
    Retrieve a single player by its primary key ID.
    """
    try:
        return db.query(Player).filter(Player.id == player_id).first()
    except SQLAlchemyError as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error while retrieving player {player_id}: {str(error)}"
        )


def _validate_club_exists(db: Session, club_id: int) -> None:
    """
    Private helper that raises 404 if the referenced team does not exist.
    """
    team = db.query(Team).filter(Team.id == club_id).first()
    if not team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Team with id {club_id} not found"
        )


def create_player(db: Session, player_data: PlayerCreate) -> Player:
    """
    Insert a new player record into the database with transaction error handling.
    """
    _validate_club_exists(db, player_data.club_id)

    new_player = Player(
        name=player_data.name,
        country=player_data.country,
        performance=player_data.performance,
        field_position=player_data.field_position,
        birth_date=player_data.birth_date,
        market_value=player_data.market_value,
        salary=player_data.salary,
        club_id=player_data.club_id,
    )
    try:
        db.add(new_player)
        db.commit()
        db.refresh(new_player)
        return new_player
    except SQLAlchemyError as error:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error while creating player: {str(error)}"
        )


def update_player(db: Session, player_id: int, player_data: PlayerUpdate) -> Optional[Player]:
    """
    Update an existing player record with provided non-null fields.
    """
    existing_player = get_player_by_id(db, player_id)
    if not existing_player:
        return None

    # Si la operación reasigna de club, el nuevo club debe existir
    if player_data.club_id is not None:
        _validate_club_exists(db, player_data.club_id)

    update_fields = player_data.model_dump(exclude_unset=True)
    for field, value in update_fields.items():
        setattr(existing_player, field, value)

    try:
        db.commit()
        db.refresh(existing_player)
        return existing_player
    except SQLAlchemyError as error:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error while updating player {player_id}: {str(error)}"
        )


def delete_player(db: Session, player_id: int) -> bool:
    """
    Delete a player record by its ID. Returns True if deleted, False if not found.
    """
    existing_player = get_player_by_id(db, player_id)
    if not existing_player:
        return False

    try:
        db.delete(existing_player)
        db.commit()
        return True
    except SQLAlchemyError as error:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error while deleting player {player_id}: {str(error)}"
        )