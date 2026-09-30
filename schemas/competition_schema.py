from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


class CompetitionBase(BaseModel):
    name: str = Field(
        ...,
        min_length=1,
        max_length=150,
        description="Name of the competition",
        examples=["Champions League"]
    )
    country: Optional[str] = Field(
        None,
        min_length=1,
        max_length=100,
        description="Country or region where the competition is played",
        examples=["Europa"]
    )


class CompetitionCreate(CompetitionBase):
    pass


class CompetitionUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=150)
    country: Optional[str] = Field(None, min_length=1, max_length=100)


class CompetitionResponse(CompetitionBase):
    id: int = Field(..., description="Unique database identifier", examples=[1])
    model_config = ConfigDict(from_attributes=True)