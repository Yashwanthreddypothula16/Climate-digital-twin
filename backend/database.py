"""SQLAlchemy database models and connection management for Telangana Climate Digital Twin."""
from datetime import datetime, timezone
import json
from sqlalchemy import (
    create_engine, Column, Integer, Float, String, DateTime, Text, Boolean, ForeignKey
)
from sqlalchemy.orm import declarative_base, sessionmaker, scoped_session
from .config import DATABASE_URL

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
)

SessionLocal = scoped_session(sessionmaker(autocommit=False, autoflush=False, bind=engine))
Base = declarative_base()


class DistrictRecord(Base):
    __tablename__ = "districts"

    id = Column(String(64), primary_key=True)  # canonical identifier, e.g. "hyderabad"
    name = Column(String(128), nullable=False) # display name, e.g. "Hyderabad"
    geojson_name = Column(String(128), nullable=False) # exact name in telangana.geojson
    dtcode = Column(String(16), nullable=True) # official census dtcode
    lat = Column(Float, nullable=False)
    lon = Column(Float, nullable=False)
    elevation = Column(Float, default=300.0)
    area_km2 = Column(Float, default=2500.0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class WeatherSnapshot(Base):
    __tablename__ = "weather_snapshots"

    id = Column(Integer, primary_key=True, autoincrement=True)
    district_id = Column(String(64), nullable=False, index=True)
    observation_time = Column(String(64), nullable=False) # local timestamp from API
    retrieval_time = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)
    data_source = Column(String(64), default="Open-Meteo ECMWF / GFS")
    
    # Core variables
    temperature = Column(Float, nullable=True)
    apparent_temperature = Column(Float, nullable=True)
    relative_humidity = Column(Float, nullable=True)
    dew_point = Column(Float, nullable=True)
    precipitation = Column(Float, nullable=True)
    rainfall = Column(Float, nullable=True)
    weather_code = Column(Integer, nullable=True)
    weather_condition = Column(String(64), nullable=True)
    cloud_cover = Column(Float, nullable=True)
    wind_speed = Column(Float, nullable=True)
    wind_direction = Column(Float, nullable=True)
    wind_gusts = Column(Float, nullable=True)
    surface_pressure = Column(Float, nullable=True)
    uv_index = Column(Float, nullable=True)
    
    raw_payload = Column(Text, nullable=True)


class AirQualitySnapshot(Base):
    __tablename__ = "air_quality_snapshots"

    id = Column(Integer, primary_key=True, autoincrement=True)
    district_id = Column(String(64), nullable=False, index=True)
    observation_time = Column(String(64), nullable=False)
    retrieval_time = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)
    data_source = Column(String(64), default="Open-Meteo CAMS Atmospheric Service")

    pm2_5 = Column(Float, nullable=True)
    pm10 = Column(Float, nullable=True)
    nitrogen_dioxide = Column(Float, nullable=True)
    sulphur_dioxide = Column(Float, nullable=True)
    ozone = Column(Float, nullable=True)
    carbon_monoxide = Column(Float, nullable=True)
    
    us_aqi = Column(Integer, nullable=True)
    european_aqi = Column(Integer, nullable=True)
    indian_naqi_estimate = Column(Integer, nullable=True)
    aqi_status = Column(String(32), nullable=True)
    
    raw_payload = Column(Text, nullable=True)


class HistoricalWeatherRecord(Base):
    __tablename__ = "historical_weather"

    id = Column(Integer, primary_key=True, autoincrement=True)
    district_id = Column(String(64), nullable=False, index=True)
    date = Column(String(10), nullable=False, index=True) # YYYY-MM-DD
    data_source = Column(String(64), default="Open-Meteo ERA5 / Historical Archive")
    retrieval_time = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    tmax = Column(Float, nullable=True)
    tmin = Column(Float, nullable=True)
    tmean = Column(Float, nullable=True)
    precipitation_sum = Column(Float, nullable=True)
    rain_sum = Column(Float, nullable=True)
    wind_speed_max = Column(Float, nullable=True)


class ForecastRun(Base):
    __tablename__ = "forecast_runs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    district_id = Column(String(64), nullable=False, index=True)
    retrieval_time = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)
    forecast_horizon = Column(String(32), default="10_days")
    data_source = Column(String(64), default="Open-Meteo Global Models Ensemble")
    forecast_json = Column(Text, nullable=False)


class PredictionResult(Base):
    __tablename__ = "model_predictions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    district_id = Column(String(64), nullable=False, index=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    model_name = Column(String(64), nullable=False) # e.g. "Random Forest", "XGBoost", "QSVM", "VQC"
    task_type = Column(String(32), nullable=False)  # "regression" or "classification"
    target_variable = Column(String(64), nullable=False) # "temperature", "rainfall", "climate_risk"
    predicted_value = Column(Float, nullable=True)
    predicted_label = Column(String(64), nullable=True) # e.g. "Moderate", "High"
    confidence = Column(Float, nullable=True)
    horizon = Column(String(32), default="daily")
    features_json = Column(Text, nullable=True)


class ModelEvaluationRecord(Base):
    __tablename__ = "model_evaluations"

    id = Column(Integer, primary_key=True, autoincrement=True)
    model_name = Column(String(64), nullable=False, unique=True)
    task_type = Column(String(32), nullable=False)
    architecture = Column(String(128), nullable=False)
    dataset = Column(String(128), nullable=False)
    evaluation_date = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    test_period = Column(String(64), nullable=False)
    
    # Serialized metrics (MAE, RMSE, R2, Accuracy, Precision, Recall, F1, Confusion Matrix)
    metrics_json = Column(Text, nullable=False)
    feature_importance_json = Column(Text, nullable=True)
    is_operational = Column(Boolean, default=True)


class SimulationRun(Base):
    __tablename__ = "simulation_runs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    district_id = Column(String(64), nullable=False, index=True)
    scenario = Column(String(64), nullable=False)
    run_timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    parameters_json = Column(Text, nullable=False)
    results_json = Column(Text, nullable=False)


def init_db():
    """Create all tables in the SQLite database."""
    Base.metadata.create_all(bind=engine)


def get_db():
    """Dependency helper for FastAPI endpoints."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

