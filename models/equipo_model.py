from sqlalchemy import Column, Integer, String, Date, Enum
from database.database import Base
from models.enums import TeamDivision 


class Team(Base):
    """
    SQLAlchemy ORM Model representing the 'teams' table.
    """
    __tablename__ = "teams"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nombre = Column(String(150), nullable=False, index=True)
    fecha_fundacion = Column(Date, nullable=False)
    nacion = Column(String(100), nullable=False, index=True)
    titulos_ganados = Column(Integer, default=0, nullable=False)
    ranking_uefa = Column(Integer, nullable=False)
    division = Column(Enum(TeamDivision), nullable=False)
    director_tecnico = Column(String(100), nullable=False)
    presidente = Column(String(100), nullable=False)

    def __repr__(self) -> str:
        return f"<Team(id={self.id}, nombre='{self.nombre}')>"