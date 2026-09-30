from sqlalchemy import Column, Integer, String, Date, Enum
from sqlalchemy.orm import relationship
from database.database import Base
from models.enums import TeamDivision
from models.competition_model import team_competitions


class Team(Base):
    """
    SQLAlchemy ORM Model representing the 'teams' table.
    """
    __tablename__ = "teams"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(150), nullable=False, index=True)
    founded_date = Column(Date, nullable=False)
    country = Column(String(100), nullable=False, index=True)
    titles_won = Column(Integer, default=0, nullable=False)
    uefa_ranking = Column(Integer, nullable=False)
    division = Column(Enum(TeamDivision), nullable=False)
    head_coach = Column(String(100), nullable=False)
    president = Column(String(100), nullable=False)
    players = relationship(
        "Player",
        back_populates="club",
        cascade="all, delete-orphan"
    )
    competitions = relationship(
        "Competition",
        secondary=team_competitions,
        back_populates="teams"
    )

        
    @property
    def players_count(self) -> int:
        """Number of players currently assigned to the team."""
        return len(self.players)

    def __repr__(self) -> str:
        return f"<Team(id={self.id}, name='{self.name}')>"