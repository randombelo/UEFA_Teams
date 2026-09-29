from sqlalchemy import Column, Integer, String, Table, ForeignKey
from sqlalchemy.orm import relationship
from database.database import Base

team_competitions = Table(
    "team_competitions",
    Base.metadata,
    Column("team_id", Integer, ForeignKey("teams.id", ondelete="CASCADE"), primary_key=True),
    Column("competition_id", Integer, ForeignKey("competitions.id", ondelete="CASCADE"), primary_key=True),
)


class Competition(Base):
    __tablename__ = "competitions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(150), nullable=False, index=True, unique=True)
    country = Column(String(100), nullable=True)
    teams = relationship("Team", secondary=team_competitions, back_populates="competitions")

    def __repr__(self) -> str:
        return f"<Competition(id={self.id}, name='{self.name}')>"