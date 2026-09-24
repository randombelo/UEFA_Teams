from enum import Enum


class PlayerPosition(str, Enum):
    goalkeeper = "goalkeeper"
    defender = "defender"
    midfielder = "midfielder"
    forward = "forward"


class TeamDivision(str, Enum):
    first = "first"
    second = "second"
    third = "third"