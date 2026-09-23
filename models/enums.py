from enum import Enum


class PlayerPosition(str, Enum):
    portero = "portero"
    defensa = "defensa"
    mediocampista = "mediocampista"
    delantero = "delantero"


class TeamDivision(str, Enum):
    primera = "primera"
    segunda = "segunda"
    tercera = "tercera"