from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from alembic.config import Config
from alembic import command

from config.config_variables import APP_TITLE, APP_VERSION, APP_DESCRIPTION
from routes.team_routes import router as teams_router
from routes.player_routes import router as players_router
from routes.competition_routes import router as competitions_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager to execute startup and shutdown events.
    Applies any pending Alembic migration before serving requests.
    """
    alembic_cfg = Config("alembic.ini")
    command.upgrade(alembic_cfg, "head")
    yield


# Initialize FastAPI application
app = FastAPI(
    title=APP_TITLE,
    version=APP_VERSION,
    description=APP_DESCRIPTION,
    lifespan=lifespan
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include application routers
app.include_router(teams_router)
app.include_router(players_router)
app.include_router(competitions_router)


@app.get("/", tags=["Health Check"])
def read_root():
    """
    Root endpoint returning service status and documentation link.
    """
    return {
        "status": "online",
        "message": f"Welcome to {APP_TITLE}",
        "docs_url": "/docs",
        "redoc_url": "/redoc"
    }