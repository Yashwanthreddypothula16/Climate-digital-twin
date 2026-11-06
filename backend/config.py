"""Configuration module for Telangana Climate Digital Twin backend."""
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = BASE_DIR.parent
GEOJSON_PATH = PROJECT_ROOT / "public" / "telangana.geojson"
MODELS_DIR = BASE_DIR / "models"
DB_PATH = BASE_DIR / "climate_twin.db"
DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{DB_PATH}")

TIMEZONE = "Asia/Kolkata"

# Cache TTLs in seconds
CACHE_TTL_CURRENT = 900          # 15 minutes
CACHE_TTL_AIR_QUALITY = 900      # 15 minutes
CACHE_TTL_FORECAST = 3600        # 1 hour
CACHE_TTL_HISTORICAL = 86400     # 24 hours
CACHE_TTL_CLIMATE = 86400        # 24 hours

# Open-Meteo API Endpoints
OPEN_METEO_FORECAST_URL = "https://api.open-meteo.com/v1/forecast"
OPEN_METEO_ARCHIVE_URL = "https://archive-api.open-meteo.com/v1/archive"
OPEN_METEO_AIR_QUALITY_URL = "https://air-quality-api.open-meteo.com/v1/air-quality"
OPEN_METEO_CLIMATE_URL = "https://climate-api.open-meteo.com/v1/climate"

