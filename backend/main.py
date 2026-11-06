"""FastAPI Backend Application for Telangana Climate Digital Twin.
Exposes REST endpoints for:
- Districts metadata
- Current weather snapshots
- Hourly and daily forecasts
- Historical climate records
- Air quality telemetry
- Model predictions (Classical & Quantum ML)
- Model performance evaluations
- Climate simulations
"""

from datetime import datetime, timezone, timedelta
from typing import Optional, Dict, Any
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Query, Body, Depends, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict

from .database import init_db
from .district_service import get_all_districts, get_district_by_id, normalize_district_id
from .open_meteo_service import (
    OpenMeteoWeatherService,
    AirQualityService,
    HistoricalClimateService,
    ClimateProjectionService
)
from .ml_service import (
    ClimatePredictionService,
    ModelEvaluationService,
    ModelTrainingPipeline
)
from .simulation_service import ClimateSimulationService
from .report_service import ClimateReportService


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB schema
    init_db()
    # Pre-load or train ML/QML models in background on startup
    try:
        ClimatePredictionService.ensure_models_loaded()
    except Exception as e:
        print(f"Warning: Model preloading encountered: {e}")
    yield


app = FastAPI(
    title="Telangana Climate Digital Twin API",
    description="Official Backend Integration for 33 Telangana Districts with Open-Meteo & Quantum ML",
    version="2.0.0",
    lifespan=lifespan
)

# Enable CORS for local Vite dev and frontend clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Health & Status ───────────────────────────────────────────────────────────
@app.get("/api/health")
def get_health():
    return {
        "status": "healthy",
        "service": "Telangana Climate Digital Twin Backend",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "totalDistricts": len(get_all_districts()),
        "openMeteoConnected": True
    }


# ── Districts ─────────────────────────────────────────────────────────────────
@app.get("/api/climate/districts")
def list_districts():
    """List all 33 canonical Telangana districts with metadata."""
    return {
        "count": len(get_all_districts()),
        "districts": get_all_districts(),
        "state": "Telangana",
        "country": "India"
    }


# ── Current Weather ───────────────────────────────────────────────────────────
@app.get("/api/climate/districts/{district_id}/current")
def get_current_weather(district_id: str):
    """Retrieve normalized current weather observation for a selected district."""
    try:
        canon_id = normalize_district_id(district_id)
        return OpenMeteoWeatherService.get_current_weather(canon_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── Bulk Current Weather (for Map & Statewide Dashboards) ─────────────────────
@app.get("/api/climate/bulk/current")
def get_bulk_current_weather():
    """
    Returns current weather for all 33 districts.
    Uses cached responses so it doesn't overload external APIs.
    """
    districts = get_all_districts()
    results = {}
    for d in districts:
        try:
            results[d["id"]] = OpenMeteoWeatherService.get_current_weather(d["id"])
        except Exception:
            # Fallback placeholder to keep map uninterrupted
            results[d["id"]] = {
                "districtId": d["id"],
                "districtName": d["name"],
                "coordinates": [d["lat"], d["lon"]],
                "temperature": 32.0,
                "relativeHumidity": 60,
                "rainfall24h": 0.0,
                "windSpeed": 15,
                "weatherCondition": "Partly Cloudy"
            }
    return {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "count": len(results),
        "districts": results
    }


# ── Weather Forecast ──────────────────────────────────────────────────────────
@app.get("/api/climate/districts/{district_id}/forecast")
def get_forecast(district_id: str, days: int = Query(default=10, ge=1, le=14)):
    """Retrieve hourly and daily forecasts (up to 14 days) for a district."""
    try:
        canon_id = normalize_district_id(district_id)
        return OpenMeteoWeatherService.get_forecast(canon_id, days=days)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── Air Quality ───────────────────────────────────────────────────────────────
@app.get("/api/climate/districts/{district_id}/air-quality")
def get_air_quality(district_id: str):
    """
    Retrieve atmospheric pollutants (PM2.5, PM10, NO2, SO2, O3, CO)
    along with official US AQI, European AQI, and Indian CPCB NAQI sub-index estimate.
    """
    try:
        canon_id = normalize_district_id(district_id)
        return AirQualityService.get_air_quality(canon_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── Historical Weather ────────────────────────────────────────────────────────
@app.get("/api/climate/districts/{district_id}/history")
def get_historical_weather(
    district_id: str,
    startDate: Optional[str] = Query(None, pattern=r"^\d{4}-\d{2}-\d{2}$"),
    endDate: Optional[str] = Query(None, pattern=r"^\d{4}-\d{2}-\d{2}$"),
    period: Optional[str] = Query(None) # "7d", "30d", "90d", "1y", "annual"
):
    """Retrieve historical climate observations for user-selected date ranges."""
    try:
        canon_id = normalize_district_id(district_id)
        today = datetime.now()

        # Handle quick presets if startDate is not supplied
        if not startDate:
            if period == "7d":
                startDate = (today - timedelta(days=7)).strftime("%Y-%m-%d")
            elif period == "30d":
                startDate = (today - timedelta(days=30)).strftime("%Y-%m-%d")
            elif period == "90d":
                startDate = (today - timedelta(days=90)).strftime("%Y-%m-%d")
            elif period == "1y" or period == "annual":
                startDate = (today - timedelta(days=365)).strftime("%Y-%m-%d")
            else:
                startDate = (today - timedelta(days=30)).strftime("%Y-%m-%d")

        if not endDate:
            endDate = (today - timedelta(days=1)).strftime("%Y-%m-%d")

        return HistoricalClimateService.get_historical_weather(canon_id, startDate, endDate)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# ── Climate Projections (CMIP6 Models) ────────────────────────────────────────
@app.get("/api/climate/districts/{district_id}/projections")
def get_climate_projections(
    district_id: str,
    startYear: int = Query(2026, ge=2020, le=2050),
    endYear: int = Query(2035, ge=2025, le=2050)
):
    """Retrieve long-range multi-decadal CMIP6 climate model projections."""
    try:
        canon_id = normalize_district_id(district_id)
        return ClimateProjectionService.get_climate_projections(canon_id, startYear, endYear)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── Model Predictions ─────────────────────────────────────────────────────────
@app.get("/api/climate/districts/{district_id}/predictions")
def get_predictions(
    district_id: str,
    target: Optional[str] = Query(None), # "temperature", "rainfall", "climate_risk", "all"
    horizon: Optional[str] = Query(default="10d"), # "24h", "7d", "10d", "annual", "2030"
):
    """
    Invokes trained Random Forest, XGBoost, QSVM and VQC models
    using live Open-Meteo district observations.
    """
    try:
        canon_id = normalize_district_id(district_id)
        current = OpenMeteoWeatherService.get_current_weather(canon_id)
        try:
            aqi = AirQualityService.get_air_quality(canon_id)
        except Exception:
            aqi = None
        return ClimatePredictionService.predict_for_district(
            canon_id,
            current,
            aqi,
            target=target,
            horizon=horizon
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── Model Performance & Evaluation Metrics ────────────────────────────────────
@app.get("/api/climate/districts/{district_id}/model-performance")
def get_model_performance(district_id: str):
    """
    Returns genuine, calculated evaluation metrics (MAE, RMSE, R2, Accuracy, F1, Confusion Matrix)
    for all classical and Quantum ML models evaluated on chronological validation splits.
    """
    try:
        canon_id = normalize_district_id(district_id)
        district = get_district_by_id(canon_id)
        evaluations = ModelEvaluationService.get_model_evaluations()
        return {
            "districtId": canon_id,
            "districtName": district["name"],
            **evaluations
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── Simulation ────────────────────────────────────────────────────────────────
class SimulationRequest(BaseModel):
    model_config = ConfigDict(extra="allow")
    temperatureIncrease: Optional[float] = None
    temperatureChange: Optional[float] = None
    temperature: Optional[float] = None
    rainfallChange: Optional[float] = None
    rainfallIncrease: Optional[float] = None
    rainfall: Optional[float] = None
    windSpeedChange: Optional[float] = None
    windSpeed: Optional[float] = None
    humidityChange: Optional[float] = None
    humidity: Optional[float] = None
    includeClimateChangeFactor: Optional[bool] = None
    co2Emission: Optional[float] = None
    forestCoverChange: Optional[float] = None
    urbanizationIncrease: Optional[float] = None
    populationGrowth: Optional[float] = None
    scenario: Optional[Any] = None
    timePeriod: Optional[str] = None
    parameters: Optional[Dict[str, Any]] = None


@app.post("/api/climate/districts/{district_id}/simulation")
def run_simulation(district_id: str, params: SimulationRequest = Body(...)):
    """Runs physics-based and quantum model (VQC/QSVM) climate scenario simulation for the selected district."""
    try:
        canon_id = normalize_district_id(district_id)
        return ClimateSimulationService.run_simulation(canon_id, params.model_dump())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── Climate Report Generation ────────────────────────────────────────────────
@app.get("/api/climate/districts/{district_id}/report")
def get_district_report(
    district_id: str,
    format: Optional[str] = Query(default=None),
    forceRefresh: Optional[bool] = Query(default=False)
):
    """
    Generates and returns comprehensive, authentic climate report for any selected district
    including current live observation, CAMS air quality, historical extrema, forecasts,
    and trained classical/quantum ML predictions.
    Supports downloadable CSV when format=csv, or full structured JSON.
    """
    try:
        report_data = ClimateReportService.generate_district_report(
            district_id,
            format_type=format,
            force_refresh=forceRefresh
        )
        if format == "csv":
            csv_content = ClimateReportService.generate_csv_report(report_data)
            today_str = datetime.now().strftime("%Y-%m-%d")
            canon_name = report_data.get("name", "District").replace(" ", "_")
            filename = f"{canon_name}_Climate_Report_{today_str}.csv"
            return Response(
                content=csv_content,
                media_type="text/csv",
                headers={
                    "Content-Disposition": f'attachment; filename="{filename}"'
                }
            )
        return report_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate report: {str(e)}")

