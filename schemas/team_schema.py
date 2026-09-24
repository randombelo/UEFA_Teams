from datetime import date
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field

from models.enums import TeamDivision


class TeamBase(BaseModel):
    """
    Base schema defining shared attributes for football teams.
    """
    name: str = Field(
        ...,
        min_length=1,
        max_length=150,
        description="Official name of the football team",
        examples=["Real Madrid CF"]
    )
    founded_date: date = Field(
        ...,
        description="Date when the club was founded",
        examples=["1902-03-06"]
    )
    country: str = Field(
        ...,
        min_length=1,
        max_length=100,
        description="Country where the team is based",
        examples=["Spain"]
    )
    titles_won: int = Field(
        0,
        ge=0,
        description="Total number of titles won by the team",
        examples=[100]
    )
    uefa_ranking: int = Field(
        ...,
        ge=1,
        description="UEFA club ranking position",
        examples=[5]
    )
    division: TeamDivision = Field(
        ...,
        description="League division of the team",
        examples=["first"]
    )
    head_coach: str = Field(
        ...,
        min_length=1,
        max_length=100,
        description="Current head coach",
        examples=["Carlo Ancelotti"]
    )
    president: str = Field(
        ...,
        min_length=1,
        max_length=100,
        description="Current club president",
        examples=["Florentino Perez"]
    )


class TeamCreate(TeamBase):
    """
    Schema for creating a new team.
    """
    pass


class TeamUpdate(BaseModel):
    """
    Schema for updating an existing team (all fields optional).
    """
    name: Optional[str] = Field(None, min_length=1, max_length=150)
    founded_date: Optional[date] = Field(None)
    country: Optional[str] = Field(None, min_length=1, max_length=100)
    titles_won: Optional[int] = Field(None, ge=0)
    uefa_ranking: Optional[int] = Field(None, ge=1)
    division: Optional[TeamDivision] = Field(None)
    head_coach: Optional[str] = Field(None, min_length=1, max_length=100)
    president: Optional[str] = Field(None, min_length=1, max_length=100)


class TeamResponse(TeamBase):
    """
    Schema representing the serialized response returned to API consumers.
    """
    id: int = Field(..., description="Unique database identifier", examples=[1])
    players_count: int = Field(..., description="Number of players in the team")

    # Enable ORM attribute mapping for SQLAlchemy instances
    model_config = ConfigDict(from_attributes=True)
    
class TeamSummary(BaseModel):
    """
    Lightweight summary of a team used inside other responses.
    """
    id: int = Field(..., description="Unique database identifier", examples=[1])
    name: str = Field(..., min_length=1, max_length=150, examples=["Real Madrid CF"])
    country: str = Field(..., min_length=1, max_length=100, examples=["Spain"])
    division: TeamDivision = Field(..., examples=["first"])
    uefa_ranking: int = Field(..., ge=1, examples=[5])

    # Enable ORM attribute mapping for SQLAlchemy instances
    model_config = ConfigDict(from_attributes=True)    