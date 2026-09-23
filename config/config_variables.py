import os
from dotenv import load_dotenv

# Load environment variables from .env file if present
load_dotenv()

# Application configuration
APP_TITLE: str = os.getenv("APP_TITLE", "UEFA Teams Management API")
APP_VERSION: str = os.getenv("APP_VERSION", "1.0.0")
APP_DESCRIPTION: str = os.getenv(
    "APP_DESCRIPTION",
    "REST API for managing UEFA football teams and their players using FastAPI, SQLite and Alembic."
)

# Database configuration
DATABASE_NAME: str = os.getenv("DATABASE_NAME", "uefa_teams.sqlite3")
DATABASE_URL: str = os.getenv("DATABASE_URL", f"sqlite:///./{DATABASE_NAME}")