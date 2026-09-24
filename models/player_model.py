from sqlalchemy import Column, Integer, String, Date, Numeric, Enum, ForeignKey
from sqlalchemy.orm import relationship
from database.database import Base
from models.enums import PlayerPosition


class Player(Base):
    """
    SQLAlchemy ORM Model representing the 'players' table.
    """
    __tablename__ = "players"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(150), nullable=False, index=True)
    country = Column(String(100), nullable=False, index=True)
    performance = Column(Integer, nullable=False)
    field_position = Column(Enum(PlayerPosition), nullable=False)
    birth_date = Column(Date, nullable=False)
    market_value = Column(Numeric(14, 2), nullable=False)
    salary = Column(Numeric(14, 2), nullable=False)
    club_id = Column(Integer, ForeignKey("teams.id", ondelete="CASCADE"), nullable=False)
    club = relationship("Team", back_populates="players")

    def __repr__(self) -> str:
        return f"<Player(id={self.id}, name='{self.name}')>"