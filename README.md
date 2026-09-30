# UEFA Teams Management API

REST API para la gestión de **equipos** y **jugadores** de fútbol, con un catálogo de **competiciones** y una relación muchos-a-muchos (N:M) entre equipos y competiciones.

Construida con **FastAPI**, **SQLAlchemy** y **SQLite**, con migraciones de esquema controladas por **Alembic**, documentación interactiva automática y configuración por variables de entorno.

## Características

- CRUD completo de **equipos** (`/teams/`), **jugadores** (`/players/`) y **competiciones** (`/competitions/`).
- Relación **N:M equipos ↔ competiciones** a través de la tabla asociativa `team_competitions`.
- **Borrado en cascada**: eliminar un equipo borra sus jugadores (`ondelete=CASCADE`); eliminar una competición limpia sus asociaciones.
- Documentación interactiva automática: **Swagger UI** en `/docs` y **ReDoc** en `/redoc`.
- **Migraciones Alembic** que se aplican automáticamente en el arranque de la aplicación (lifespan).
- **CORS abierto** para que el frontend pueda consumir la API desde cualquier origen o puerto.
- Validación de datos con **Pydantic v2** y manejo de errores HTTP estandarizado.

## Tecnologías

| Tecnología | Versión |
|------------|---------|
| Python | 3.11+ |
| FastAPI | `>=0.110` |
| Uvicorn | `>=0.28` |
| SQLAlchemy | `>=2.0.28` |
| Pydantic | `>=2.6` |
| Alembic | `>=1.13` |
| SQLite | (incluida en Python) |
| python-dotenv | `>=1.0.1` |

Las versiones mínimas están declaradas en [`requirements.txt`](requirements.txt).

## Estructura del proyecto

```
.
├── main.py                  # App FastAPI, CORS y registro de routers
├── requirements.txt         # Dependencias
├── .env.example             # Plantilla de variables de entorno
├── alembic.ini              # Configuración de Alembic
├── alembic/
│   └── versions/            # Migraciones (revisiones)
├── config/
│   └── config_variables.py  # Lectura de variables de entorno
├── database/
│   └── database.py          # Motor, sesión (SessionLocal) y dependencia get_db
├── models/                  # Modelos ORM (Team, Player, Competition + tabla N:M)
├── schemas/                 # Schemas Pydantic (entrada/salida)
├── controllers/             # Lógica de negocio y acceso a datos
├── routes/                  # Definición de endpoints (equipos, jugadores, competiciones)
└── uefa_teams.sqlite3       # Base de datos SQLite (generada por las migraciones)
```

## Requisitos previos

- Python 3.11 o superior.
- (Opcional pero recomendado) un entorno virtual.

## Guía paso a paso (ejecución)

```bash
# 1. Crear el entorno virtual
python -m venv .venv

# 2. Activar el entorno
#   Linux/macOS:
source .venv/bin/activate
#   Windows:
#   .venv\Scripts\activate

# 3. Instalar dependencias
pip install -r requirements.txt

# 4. Configurar variables de entorno
cp .env.example .env

# 5. (Opcional) Aplicar migraciones manualmente
#    Nota: el propio arranque de la API ya aplica las migraciones pendientes.
alembic upgrade head

# 6. Arrancar el servidor de desarrollo
uvicorn main:app --reload
```

> 💡 **WSL**: el primer arranque puede tardar **~20 segundos** por la lentitud de E/S del montaje `drvfs` al importar `alembic`/`sqlalchemy`. No es un error; espera a que aparezca `Uvicorn running on http://127.0.0.1:8000`.

- Documentación interactiva: **http://127.0.0.1:8000/docs** (Swagger) y **http://127.0.0.1:8000/redoc**.
- Estado del servicio: `http://127.0.0.1:8000/`.

## Variables de entorno

Definidas en `.env` (usa [`.env.example`](.env.example) como plantilla):

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `APP_TITLE` | Título de la aplicación | `UEFA Teams Management API` |
| `APP_VERSION` | Versión de la API | `1.0.0` |
| `APP_DESCRIPTION` | Descripción mostrada en Swagger/ReDoc | texto descriptivo de la API |
| `DATABASE_NAME` | Nombre del archivo SQLite | `uefa_teams.sqlite3` |
| `DATABASE_URL` | Cadena de conexión SQLAlchemy | `sqlite:///./uefa_teams.sqlite3` |

## Endpoints

Base URL: `http://127.0.0.1:8000`

### Sistema

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/` | Estado del servicio (`status`, `message`, `docs_url`) |

### Equipos (`/teams`)

| Método | Ruta | Descripción | Parámetros |
|--------|------|-------------|------------|
| `GET` | `/teams/` | Lista de equipos (paginada) | `skip` (def. 0), `limit` (def. 100, máx. 100) |
| `POST` | `/teams/` | Crea un equipo | body `TeamCreate` |
| `GET` | `/teams/{id}` | Detalle de un equipo | `id` |
| `PUT` | `/teams/{id}` | Actualiza un equipo (puede ser parcial) | `id`, body `TeamUpdate` |
| `DELETE` | `/teams/{id}` | Elimina un equipo y **sus jugadores** (cascada) | `id` |

**`TeamCreate`**:
```json
{
  "name": "Real Madrid CF",
  "founded_date": "1902-03-06",
  "country": "Spain",
  "titles_won": 100,
  "uefa_ranking": 1,
  "division": "first",
  "head_coach": "Carlo Ancelotti",
  "president": "Florentino Perez",
  "competition_ids": [1, 2, 3, 4]
}
```

> En la respuesta de cada equipo se incluye el campo `competitions: [...]` (objetos completos) además de `players_count`. En `PUT` se puede enviar `competition_ids` (vacío para desasociar todas).

### Jugadores (`/players`)

| Método | Ruta | Descripción | Parámetros |
|--------|------|-------------|------------|
| `GET` | `/players/` | Lista de jugadores (paginada y con filtro) | `skip`, `limit`, `club_id` (filtra por club) |
| `POST` | `/players/` | Crea un jugador ligado a un club | body `PlayerCreate` |
| `GET` | `/players/{id}` | Detalle de un jugador | `id` |
| `PUT` | `/players/{id}` | Actualiza un jugador (puede ser parcial) | `id`, body `PlayerUpdate` |
| `DELETE` | `/players/{id}` | Elimina un jugador | `id` |

**`PlayerCreate`**:
```json
{
  "name": "Kylian Mbappe",
  "country": "France",
  "performance": 96,
  "field_position": "forward",
  "birth_date": "1998-12-20",
  "market_value": "180000000.00",
  "salary": "25000000.00",
  "club_id": 1
}
```

### Competiciones (`/competitions`)

| Método | Ruta | Descripción | Parámetros |
|--------|------|-------------|------------|
| `GET` | `/competitions/` | Lista de competiciones (paginada) | `skip`, `limit` |
| `POST` | `/competitions/` | Crea una competición | body `CompetitionCreate` |
| `GET` | `/competitions/{id}` | Detalle de una competición | `id` |
| `PUT` | `/competitions/{id}` | Actualiza una competición | `id`, body `CompetitionUpdate` |
| `DELETE` | `/competitions/{id}` | Elimina una competición (limpia sus asociaciones) | `id` |

**`CompetitionCreate`**:
```json
{
  "name": "La Liga",
  "country": "Spain"
}
```

## Ejemplos de uso (curl)

**Crear un equipo con competiciones asignadas:**

```bash
curl -X POST http://127.0.0.1:8000/teams/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Real Madrid CF",
    "founded_date": "1902-03-06",
    "country": "Spain",
    "titles_won": 100,
    "uefa_ranking": 1,
    "division": "first",
    "head_coach": "Carlo Ancelotti",
    "president": "Florentino Perez",
    "competition_ids": [1, 2, 3, 4]
  }'
```

**Crear un jugador asignado a un club:**

```bash
curl -X POST http://127.0.0.1:8000/players/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Kylian Mbappe",
    "country": "France",
    "performance": 96,
    "field_position": "forward",
    "birth_date": "1998-12-20",
    "market_value": "180000000.00",
    "salary": "25000000.00",
    "club_id": 1
  }'
```

**Listar jugadores de un club concreto:**

```bash
curl "http://127.0.0.1:8000/players/?club_id=1&limit=10"
```

**Actualizar las competiciones de un equipo:**

```bash
curl -X PUT http://127.0.0.1:8000/teams/1 \
  -H "Content-Type: application/json" \
  -d '{ "competition_ids": [4] }'
```

**Eliminar recursos:**

```bash
curl -X DELETE http://127.0.0.1:8000/teams/1
curl -X DELETE http://127.0.0.1:8000/competitions/1
```

## Modelo de datos (DER)

Diagrama entidad-relación:

```mermaid
erDiagram
    TEAMS ||--o{ PLAYERS : "tiene jugadores (1..N, CASCADE)"
    TEAMS ||--o{ TEAM_COMPETITIONS : "participa (N..M)"
    COMPETITIONS ||--o{ TEAM_COMPETITIONS : "agrupa (N..M)"

    TEAMS {
        int id PK
        string(150) name
        date founded_date
        string(100) country
        int titles_won
        int uefa_ranking
        enum division
        string(100) head_coach
        string(100) president
    }

    PLAYERS {
        int id PK
        string(150) name
        string(100) country
        int performance "0-100"
        enum field_position
        date birth_date
        numeric(14,2) market_value
        numeric(14,2) salary
        int club_id FK
    }

    COMPETITIONS {
        int id PK
        string(150) name "UNIQUE"
        string(100) country "NULL"
    }

    TEAM_COMPETITIONS {
        int team_id PK, FK
        int competition_id PK, FK
    }
```

### Diccionario de datos

**`teams`**

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| `id` | Integer | PK, autoincrement | Identificador único |
| `name` | String(150) | NOT NULL, index | Nombre oficial |
| `founded_date` | Date | NOT NULL | Fecha de fundación |
| `country` | String(100) | NOT NULL, index | País del club |
| `titles_won` | Integer | NOT NULL, default `0` | Títulos ganados |
| `uefa_ranking` | Integer | NOT NULL | Posición en el ranking UEFA |
| `division` | Enum | NOT NULL | `first` \| `second` \| `third` |
| `head_coach` | String(100) | NOT NULL | Entrenador actual |
| `president` | String(100) | NOT NULL | Presidente actual |

**`players`**

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| `id` | Integer | PK, autoincrement | Identificador único |
| `name` | String(150) | NOT NULL, index | Nombre completo |
| `country` | String(100) | NOT NULL, index | Nacionalidad |
| `performance` | Integer | NOT NULL, 0-100 | Valoración de rendimiento |
| `field_position` | Enum | NOT NULL | `goalkeeper` \| `defender` \| `midfielder` \| `forward` |
| `birth_date` | Date | NOT NULL | Fecha de nacimiento |
| `market_value` | Numeric(14,2) | NOT NULL | Valor de mercado (€) |
| `salary` | Numeric(14,2) | NOT NULL | Salario anual (€) |
| `club_id` | Integer | FK → `teams.id`, NOT NULL, ON DELETE CASCADE | Club al que pertenece |

**`competitions`**

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| `id` | Integer | PK, autoincrement | Identificador único |
| `name` | String(150) | NOT NULL, **UNIQUE**, index | Nombre de la competición |
| `country` | String(100) | NULL | País organizador |

**`team_competitions`** (tabla asociativa N:M)

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| `team_id` | Integer | PK compuesta, FK → `teams.id`, ON DELETE CASCADE | Equipo |
| `competition_id` | Integer | PK compuesta, FK → `competitions.id`, ON DELETE CASCADE | Competición |

## Migraciones (Alembic)

Historial de revisiones en `alembic/versions/`:

| Revisión | Descripción |
|----------|-------------|
| `3db47e468d67` | Creación de tablas `teams` y `players` |
| `191b42490d3c` | Creación de `competitions` y tabla N:M `team_competitions` |

> La API aplica automáticamente las migraciones pendientes en cada arranque (`main.py` → lifespan → `alembic upgrade head`).

Comandos habituales:

```bash
# Crear una migración nueva a partir de los modelos
alembic revision --autogenerate -m "descripcion"

# Aplicar las migraciones
alembic upgrade head

# Revertir a una revisión anterior
alembic downgrade -1
```

## Datos de demostración

Para tener datos de ejemplo (5 equipos, 10 jugadores y 6 competiciones relacionados entre sí), ejecuta el siguiente script contra la API con el entorno virtual activado. Es **idempotente**: aborta si ya existen equipos en la base de datos.

```bash
python - <<'EOF'
from datetime import date
from database.database import SessionLocal
from models.team_model import Team
from models.player_model import Player
from models.competition_model import Competition

TEAMS = [
    {"name": "Real Madrid CF", "founded_date": "1902-03-06", "country": "Spain", "titles_won": 100, "uefa_ranking": 1, "division": "first", "head_coach": "Carlo Ancelotti", "president": "Florentino Perez", "comps": [1, 2, 3, 4]},
    {"name": "FC Barcelona", "founded_date": "1899-11-29", "country": "Spain", "titles_won": 92, "uefa_ranking": 3, "division": "first", "head_coach": "Hansi Flick", "president": "Joan Laporta", "comps": [1, 2, 3, 4]},
    {"name": "Atletico de Madrid", "founded_date": "1903-04-26", "country": "Spain", "titles_won": 40, "uefa_ranking": 8, "division": "first", "head_coach": "Diego Simeone", "president": "Enrique Cerezo", "comps": [1, 2, 3, 4]},
    {"name": "Sevilla FC", "founded_date": "1890-01-25", "country": "Spain", "titles_won": 18, "uefa_ranking": 15, "division": "first", "head_coach": "Garcia Pimienta", "president": "Jose Maria del Nido Carrasco", "comps": [1, 5]},
    {"name": "Real Betis", "founded_date": "1907-09-12", "country": "Spain", "titles_won": 8, "uefa_ranking": 30, "division": "second", "head_coach": "Manuel Pellegrini", "president": "Angel Haro", "comps": [1, 2, 5]},
]

PLAYERS = [
    {"name": "Kylian Mbappe", "country": "France", "performance": 96, "field_position": "forward", "birth_date": "1998-12-20", "market_value": 180000000, "salary": 25000000, "club": "Real Madrid CF"},
    {"name": "Vinicius Junior", "country": "Brazil", "performance": 92, "field_position": "forward", "birth_date": "2000-07-12", "market_value": 200000000, "salary": 22000000, "club": "Real Madrid CF"},
    {"name": "Lamine Yamal", "country": "Spain", "performance": 90, "field_position": "forward", "birth_date": "2007-07-13", "market_value": 150000000, "salary": 18000000, "club": "FC Barcelona"},
    {"name": "Pedri", "country": "Spain", "performance": 88, "field_position": "midfielder", "birth_date": "2002-11-25", "market_value": 120000000, "salary": 15000000, "club": "FC Barcelona"},
    {"name": "Julian Alvarez", "country": "Argentina", "performance": 88, "field_position": "forward", "birth_date": "2000-01-31", "market_value": 90000000, "salary": 14000000, "club": "Atletico de Madrid"},
    {"name": "Jan Oblak", "country": "Slovenia", "performance": 87, "field_position": "goalkeeper", "birth_date": "1993-01-07", "market_value": 40000000, "salary": 12000000, "club": "Atletico de Madrid"},
    {"name": "Jesus Navas", "country": "Spain", "performance": 82, "field_position": "defender", "birth_date": "1985-11-21", "market_value": 5000000, "salary": 4000000, "club": "Sevilla FC"},
    {"name": "Youssef En-Nesyri", "country": "Morocco", "performance": 80, "field_position": "forward", "birth_date": "1997-06-01", "market_value": 25000000, "salary": 6000000, "club": "Sevilla FC"},
    {"name": "Isco", "country": "Spain", "performance": 83, "field_position": "midfielder", "birth_date": "1992-04-21", "market_value": 15000000, "salary": 5000000, "club": "Real Betis"},
    {"name": "Hector Bellerin", "country": "Spain", "performance": 80, "field_position": "defender", "birth_date": "1995-03-19", "market_value": 18000000, "salary": 5000000, "club": "Real Betis"},
]

db = SessionLocal()
try:
    if db.query(Team).count() > 0:
        raise SystemExit("YA hay equipos en la BD. Script abortado (idempotente).")
    comps = {c.id: c for c in db.query(Competition).all()}
    club = {}
    for t in TEAMS:
        team = Team(name=t["name"], founded_date=date.fromisoformat(t["founded_date"]), country=t["country"],
                    titles_won=t["titles_won"], uefa_ranking=t["uefa_ranking"], division=t["division"],
                    head_coach=t["head_coach"], president=t["president"])
        team.competitions = [comps[cid] for cid in t["comps"]]
        db.add(team); db.flush()
        club[t["name"]] = team
    for p in PLAYERS:
        db.add(Player(name=p["name"], country=p["country"], performance=p["performance"],
                      field_position=p["field_position"], birth_date=date.fromisoformat(p["birth_date"]),
                      market_value=p["market_value"], salary=p["salary"], club_id=club[p["club"]].id))
    db.commit()
    print("Datos de demostración cargados correctamente.")
finally:
    db.close()
EOF
```

> Los IDs de competición (`comps`) asumen el catálogo inicial creado por la migración + seed de la presentación (La Liga=1, Copa del Rey=2, Supercopa=3, Champions=4, Europa League=5, Premier League=6).

## Frontend (proyecto hermano)

El frontend vive en un **repositorio independiente**: [`https://github.com/randombelo/UEFA_Teams_Frontend/`](https://github.com/randombelo/UEFA_Teams_Frontend/).

- **Servir el frontend**: `python3 -m http.server 5500` desde la raíz de `UEFA_Teams_Frontend`.
- **URL de la API**: se configura en el frontend en `js/config/endpointsConfig.js` → `API_BASE_URL`. Por defecto apunta a `http://127.0.0.1:8000`.
- **CORS**: el backend permite cualquier origen (`allow_origins=["*"]`), por lo que el frontend puede servirse desde cualquier puerto o dominio (por ejemplo `http://127.0.0.1:5500`).

## Troubleshooting

| Síntoma | Causa / solución |
|---------|------------------|
| El servidor tarda ~20 s en arrancar en WSL | E/S lenta del montaje `drvfs` al importar `alembic`/`sqlalchemy`. Espera a `Uvicorn running on http://127.0.0.1:8000`. |
| `address already in use` | El puerto `8000` está ocupado: `lsof -i :8000` y detén el proceso, o usa `uvicorn main:app --port 8001`. |
| `ModuleNotFoundError: No module named 'fastapi'` | Las dependencias no están instaladas o el venv no está activado. Revisa el paso 3 de la guía. |
| El frontend muestra `ERR_CONNECTION_REFUSED` | El backend no está corriendo en `127.0.0.1:8000`. Arranca la API (guía paso 6). |