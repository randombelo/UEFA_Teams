from datetime import date
from decimal import Decimal
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field

from models.enums import PlayerPosition
from schemas.team_schema import TeamSummary


class PlayerBase(BaseModel):
    """
    Base schema defining shared attributes for football players.
    """
    name: str = Field(
        ...,
        min_length=1,
        max_length=150,
        description="Full name of the player",
        examples=["Kylian Mbappe"]
    )
    country: str = Field(
        ...,
        min_length=1,
        max_length=100,
        description="Nationality of the player",
        examples=["France"]
    )
    performance: int = Field(
        ...,
        ge=0,
        le=100,
        description="Player performance rating (0-100)",
        examples=[93]
    )
    field_position: PlayerPosition = Field(
        ...,
        description="Position held on the field",
        examples=["forward"]
    )
    birth_date: date = Field(
        ...,
        description="Date of birth of the player",
        examples=["1998-12-20"]
    )
    market_value: Decimal = Field(
        ...,
        gt=0,
        max_digits=14,
        decimal_places=2,
        description="Current market value of the player in euros",
        examples=[Decimal("180000000.00")]
    )
    salary: Decimal = Field(
        ...,
        gt=0,
        max_digits=14,
        decimal_places=2,
        description="Annual salary of the player in euros",
        examples=[Decimal("25000000.00")]
    )
    club_id: int = Field(
        ...,
        gt=0,
        description="Foreign key referencing the team the player belongs to",
        examples=[1]
    )


class PlayerCreate(PlayerBase):
    """
    Schema for creating a new player.
    """
    pass


class PlayerUpdate(BaseModel):
    """
    Schema for updating an existing player (all fields optional).
    """
    name: Optional[str] = Field(None, min_length=1, max_length=150)
    country: Optional[str] = Field(None, min_length=1, max_length=100)
    performance: Optional[int] = Field(None, ge=0, le=100)
    field_position: Optional[PlayerPosition] = Field(None)
    birth_date: Optional[date] = Field(None)
    market_value: Optional[Decimal] = Field(None, gt=0, max_digits=14, decimal_places=2)
    salary: Optional[Decimal] = Field(None, gt=0, max_digits=14, decimal_places=2)
    club_id: Optional[int] = Field(None, gt=0)


class PlayerResponse(PlayerBase):
    """
    Schema representing the serialized response returned to API consumers.
    """
    id: int = Field(..., description="Unique database identifier", examples=[1])
    club: TeamSummary = Field(..., description="Summary of the team the player belongs to")

    # Enable ORM attribute mapping for SQLAlchemy instances
    model_config = ConfigDict(from_attributes=True)