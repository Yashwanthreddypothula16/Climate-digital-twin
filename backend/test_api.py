"""Comprehensive unit and integration tests for Telangana Climate Twin API."""
import pytest
from backend.main import (
    get_health,
    list_districts,
    get_model_performance,
    get_predictions,
    get_historical_weather,
    get_district_report,
    run_simulation,
    SimulationRequest
)
from backend.report_service import ClimateReportService
from backend.district_service import normalize_district_id, get_all_districts, verify_geojson_sync
from backend.open_meteo_service import calculate_cpcb_naqi_subindex, HistoricalClimateService
from backend.ml_service import ClimatePredictionService


def test_geojson_and_districts_count():
    """Verify that all 33 districts are synchronized with public/telangana.geojson."""
    districts = get_all_districts()
    assert len(districts) == 33
    assert verify_geojson_sync() is True


def test_district_normalization():
    """Verify district name resolution for various spellings, cases, hyphens and aliases."""
    test_cases = [
        ("Hyderabad", "hyderabad"),
        ("hyderabad", "hyderabad"),
        ("HYDERABAD", "hyderabad"),
        ("Warangal", "warangal_urban"),
        ("Hanamkonda", "warangal_urban"),
        ("Warangal Urban", "warangal_urban"),
        ("Warangal Rural", "warangal_rural"),
        ("Jagtial", "jagitial"),
        ("Jangoan", "jangoan"),
        ("Komaram Bheem", "kumuram_bheem_asifabad"),
        ("Kumuram Bheem Asifabad", "kumuram_bheem_asifabad"),
        ("Medchal-Malkajgiri", "medchal_malkajgiri"),
        ("Medchal Malkajgiri", "medchal_malkajgiri"),
        ("Ranga Reddy", "ranga_reddy"),
        ("Rangareddy", "ranga_reddy"),
        ("Jogulamba Gadwal", "jogulamba_gadwal"),
        ("Gadwal", "jogulamba_gadwal"),
        ("Bhadradri Kothagudem", "bhadradri_kothagudem"),
        ("Bhadradri", "bhadradri_kothagudem"),
        ("UnknownDistrictXYZ", "hyderabad")
    ]
    for raw, expected in test_cases:
        assert normalize_district_id(raw) == expected, f"Failed for {raw}"


def test_cpcb_naqi_calculation():
    """Verify official Indian CPCB NAQI breakpoints calculation."""
    aqi_good, status_good = calculate_cpcb_naqi_subindex(20.0, 35.0)
    assert aqi_good is not None and aqi_good <= 50
    assert status_good == "Good"

    aqi_mod, status_mod = calculate_cpcb_naqi_subindex(75.0, 110.0)
    assert aqi_mod is not None and 100 < aqi_mod <= 200
    assert status_mod == "Moderate"

    aqi_sev, status_sev = calculate_cpcb_naqi_subindex(280.0, 450.0)
    assert aqi_sev is not None and aqi_sev >= 400
    assert status_sev == "Severe"


def test_api_health():
    """Verify API health endpoint function."""
    data = get_health()
    assert data["status"] == "healthy"
    assert data["totalDistricts"] == 33
    assert data["openMeteoConnected"] is True


def test_api_districts_list():
    """Verify districts listing endpoint function."""
    data = list_districts()
    assert data["count"] == 33
    assert len(data["districts"]) == 33
    d0 = data["districts"][0]
    assert "id" in d0
    assert "name" in d0
    assert "lat" in d0
    assert "lon" in d0


def test_api_model_performance():
    """Verify that model performance endpoint returns genuine, calculated evaluation metrics."""
    data = get_model_performance("hyderabad")
    assert data["districtId"] == "hyderabad"
    assert "models" in data
    models = data["models"]

    # Verify all 4 required model families are present
    assert "Random Forest (Temperature Regressor)" in models
    assert "XGBoost (Rainfall Regressor)" in models
    assert "XGBoost (Climate Risk Classifier)" in models
    assert "QSVM (Quantum Support Vector Machine)" in models
    assert "VQC (Variational Quantum Classifier)" in models

    rf_metrics = models["Random Forest (Temperature Regressor)"]["metrics"]
    assert "mae" in rf_metrics and "rmse" in rf_metrics and "r2Score" in rf_metrics
    assert rf_metrics["mae"] > 0

    xgb_metrics = models["XGBoost (Climate Risk Classifier)"]["metrics"]
    assert "accuracy" in xgb_metrics and "f1Score" in xgb_metrics
    assert "confusionMatrix" in xgb_metrics

    qsvm_meta = models["QSVM (Quantum Support Vector Machine)"]
    assert qsvm_meta["taskType"] == "classification"
    assert "quantumDetails" in qsvm_meta
    assert qsvm_meta["quantumDetails"]["qubitCount"] == 4

    vqc_meta = models["VQC (Variational Quantum Classifier)"]
    assert "quantumDetails" in vqc_meta
    assert vqc_meta["quantumDetails"]["qubitCount"] == 4


def test_api_predictions():
    """Verify ML model predictions from backend."""
    data = get_predictions("hyderabad", target="all", horizon="10d")
    assert data["districtId"] == "hyderabad"
    assert "shortRangePredictions" in data
    assert "temperature" in data["shortRangePredictions"]
    assert "rainfall" in data["shortRangePredictions"]
    assert "modelInference" in data
    assert "randomForest" in data["modelInference"]
    assert "xgboost" in data["modelInference"]
    assert "qsvm" in data["modelInference"]
    assert "vqc" in data["modelInference"]


def test_api_predictions_targets_and_horizons():
    """Verify dynamic target parameter and horizon execution with trained models."""
    # 1. Temperature + Daily (Random Forest Regressor)
    t_data = get_predictions("hyderabad", target="temperature", horizon="daily")
    assert t_data["target"] == "temperature"
    assert t_data["selectedModel"]["name"] == "Random Forest Regressor v4.2"
    assert t_data["selectedModel"]["isTrainedModel"] is True
    assert t_data["primaryPrediction"]["unit"] == "°C"
    assert len(t_data["timeSeries"]) > 0
    assert len(t_data["predictionInsights"]["cards"]) == 3

    # 2. Rainfall + Weekly (XGBoost Regressor across 7 days)
    r_data = get_predictions("adilabad", target="rainfall", horizon="weekly")
    assert r_data["target"] == "rainfall"
    assert r_data["selectedModel"]["name"] == "XGBoost Climate Ensemble v3.3"
    assert r_data["selectedModel"]["isTrainedModel"] is True
    assert r_data["primaryPrediction"]["unit"] == "mm"
    assert len(r_data["timeSeries"]) == 7

    # 3. Climate Risk (PennyLane VQC & QSVM Multi-Class Classifier)
    risk_data = get_predictions("warangal", target="climate_risk", horizon="daily")
    assert risk_data["target"] == "climate_risk"
    assert "VQC" in risk_data["selectedModel"]["name"]
    assert risk_data["primaryPrediction"]["value"] in ["Low", "Moderate", "High", "Severe"]

    # 4. Humidity (External NWP Notice)
    hum_data = get_predictions("nizamabad", target="humidity", horizon="daily")
    assert hum_data["target"] == "humidity"
    assert hum_data["selectedModel"]["isTrainedModel"] is False
    assert "Open-Meteo" in hum_data["selectedModel"]["name"]


def test_api_simulation_quantum_execution():
    """Verify that simulation executes actual PennyLane VQC quantum circuits."""
    req = SimulationRequest(
        temperatureChange=2.5,
        rainfallIncrease=40.0,
        windSpeedChange=15.0,
        humidityChange=10.0,
        includeClimateChangeFactor=True
    )
    data = run_simulation("warangal", req)
    assert data["districtId"] == "warangal_urban"
    assert data["status"] == "completed"
    assert data["model"]["type"] == "quantum"
    assert "PennyLane" in data["model"]["framework"]
    assert "simulator" in data["model"]["executionMode"]

    # Check quantum circuit execution metadata
    assert "quantumExecution" in data
    q_exec = data["quantumExecution"]
    assert q_exec["qubitCount"] == 4
    assert len(q_exec["pauliZExpectations"]) == 4
    assert q_exec["executionTimeMs"] >= 0
    assert q_exec["simulatedRiskLevel"] in ["Low", "Moderate", "High", "Severe"]

    # Check physics and biophysical impacts
    assert "simulatedResults" in data
    assert "kpis" in data
    assert data["kpis"]["avgTemp"]["changeDelta"] == 2.5
    assert data["kpis"]["climateRisk"]["level"] == q_exec["simulatedRiskLevel"]


def test_historical_extrema_and_dates():
    """Verify accurate district-wise historical climate statistics with dates and units."""
    data = get_historical_weather("hyderabad", startDate="2024-05-01", endDate="2024-05-31")
    assert data["districtId"] == "hyderabad"
    assert data["spatialMethod"] == "representative_coordinate"
    assert "statistics" in data
    stats = data["statistics"]

    # Check 4 required historical extrema
    assert "highestTemperature" in stats
    assert stats["highestTemperature"]["unit"] == "°C"
    assert stats["highestTemperature"]["value"] is not None
    assert stats["highestTemperature"]["date"] is not None

    assert "lowestTemperature" in stats
    assert stats["lowestTemperature"]["unit"] == "°C"
    assert stats["lowestTemperature"]["value"] is not None
    assert stats["lowestTemperature"]["date"] is not None

    assert "maximumDailyRainfall" in stats
    assert stats["maximumDailyRainfall"]["unit"] == "mm"
    assert stats["maximumDailyRainfall"]["value"] is not None

    assert "maximumWindSpeed" in stats
    assert stats["maximumWindSpeed"]["unit"] == "km/h"
    assert stats["maximumWindSpeed"]["value"] is not None


def test_district_climate_report_hyderabad():
    """Verify live climate report generation for Hyderabad with all required data sections."""
    data = get_district_report("hyderabad")
    assert data["districtId"] == "hyderabad"
    assert data["name"] == "Hyderabad"
    assert data["coordinates"] == [17.385, 78.4867]

    # A. Report Information
    info = data["reportInfo"]
    assert info["districtName"] == "Hyderabad"
    assert info["timezone"] == "Asia/Kolkata"
    assert "Open-Meteo" in info["dataSources"]
    assert "representative" in info["spatialMethod"].lower()
    assert "not official physical ground CPCB station" in info["disclaimer"]

    # B. Current Climate Conditions
    cur = data["currentWeather"]
    assert cur["temperature"] is not None
    assert cur["relativeHumidity"] is not None
    assert cur["windSpeed"] is not None
    assert cur["rainfall24h"] is not None
    assert cur["units"]["temperature"] == "°C"

    # C. Air Quality Telemetry
    aq = data["airQuality"]
    assert "pollutants" in aq
    assert "indices" in aq
    assert "disclaimer" in aq
    assert "official physical CPCB" in aq["disclaimer"]
    summary = aq["summary"]
    assert summary["cpcbAqi"] is not None
    assert summary["usAqi"] is not None

    # D. Historical Climate Summary
    hist = data["historical"]
    assert "highestTemperature" in hist
    assert "lowestTemperature" in hist
    assert "maximumDailyRainfall" in hist
    assert "maximumWindSpeed" in hist

    # E. Risk Profile & Executive Summary
    assert "executiveSummary" in data
    assert "Hyderabad" in data["executiveSummary"]
    assert "risks" in data
    assert "heatwave" in data["risks"]
    assert "flood" in data["risks"]


def test_district_climate_report_warangal_isolation():
    """Verify district data isolation between Hyderabad and Warangal."""
    hyd_report = get_district_report("hyderabad")
    war_report = get_district_report("warangal")

    assert hyd_report["districtId"] == "hyderabad"
    assert war_report["districtId"] == "warangal_urban"
    assert hyd_report["coordinates"] != war_report["coordinates"]
    assert hyd_report["name"] != war_report["name"]
    assert "Warangal" in war_report["name"]
    assert "Warangal" in war_report["executiveSummary"]
    assert "Hyderabad" not in war_report["executiveSummary"]


def test_district_report_csv_generation():
    """Verify authentic CSV export format and structure."""
    report_data = ClimateReportService.generate_district_report("hyderabad")
    csv_text = ClimateReportService.generate_csv_report(report_data)

    assert "TELANGANA STATE CLIMATE DIGITAL TWIN - OFFICIAL DISTRICT REPORT" in csv_text
    assert "District Name,Hyderabad" in csv_text
    assert "SECTION 1: LIVE CURRENT CLIMATE OBSERVATIONS" in csv_text
    assert "SECTION 2: AIR QUALITY & ATMOSPHERIC COMPOSITION" in csv_text
    assert "SECTION 3: HISTORICAL CLIMATE EXTREMA" in csv_text
    assert "SECTION 4: MULTI-YEAR CLIMATOLOGICAL TRENDS" in csv_text
    assert "SECTION 5: CLIMATE RISK & VULNERABILITY PROFILE" in csv_text
    assert "Asia/Kolkata" in csv_text


def test_all_districts_report_generation():
    """Verify that multiple representative districts generate valid reports."""
    for dist in ["adilabad", "khammam", "nizamabad"]:
        data = get_district_report(dist)
        assert data["districtId"] is not None
        assert data["currentWeather"]["temperature"] is not None
        assert data["airQuality"]["summary"]["cpcbAqi"] is not None


def test_simulation_scenarios_temperature_and_rainfall_direction():
    """Verify that simulation outputs respond in the correct direction for temperature and rainfall changes."""
    # Scenario 1: Hyderabad Temp +2°C
    s1 = run_simulation("hyderabad", SimulationRequest(temperatureChange=2.0, rainfallIncrease=0.0))
    # Scenario 2: Hyderabad Temp -2°C
    s2 = run_simulation("hyderabad", SimulationRequest(temperatureChange=-2.0, rainfallIncrease=0.0))

    assert s1["simulatedResults"]["temperature"] > s2["simulatedResults"]["temperature"]
    assert s1["changesFromBaseline"]["temperatureDelta"] > 0
    assert s2["changesFromBaseline"]["temperatureDelta"] < 0

    # Scenario 3: Warangal Rain +20%
    s3 = run_simulation("warangal", SimulationRequest(temperatureChange=0.0, rainfallIncrease=20.0))
    # Scenario 4: Karimnagar Rain -15%
    s4 = run_simulation("karimnagar", SimulationRequest(temperatureChange=0.0, rainfallIncrease=-15.0))

    assert s3["changesFromBaseline"]["rainfallChangePct"] == 20.0
    assert s4["changesFromBaseline"]["rainfallChangePct"] == -15.0
    assert s3["districtId"] == "warangal_urban"
    assert s4["districtId"] == "karimnagar"


def test_simulation_structured_insights_and_comparison_table():
    """Verify that Simulation Insights data sections (narrative, impacts, comparison table, charts) are populated."""
    res = run_simulation("hyderabad", SimulationRequest(
        temperatureChange=2.5,
        rainfallIncrease=-15.0,
        humidityChange=10.0,
        windSpeedChange=5.0
    ))

    # Check Narrative Explanation
    assert "narrativeExplanation" in res
    assert "Hyderabad" in res["narrativeExplanation"]
    assert "+2.5" in res["narrativeExplanation"]
    assert "-15%" in res["narrativeExplanation"]

    # Check Impact Explanations
    assert "impactExplanations" in res
    assert len(res["impactExplanations"]) >= 4
    impact_names = [imp["name"] for imp in res["impactExplanations"]]
    assert "Thermal & Heat Stress" in impact_names
    assert "Hydrological & Rainfall Conditions" in impact_names
    assert "Water Availability & Drought Risk" in impact_names
    assert "Quantum ML Climate Risk Classification" in impact_names

    # Check Comparison Table
    assert "comparisonTable" in res
    assert len(res["comparisonTable"]) >= 4
    params = [row["parameter"] for row in res["comparisonTable"]]
    assert "Temperature" in params
    assert "Rainfall (24h)" in params
    assert "Relative Humidity" in params

    # Check Dynamic Chart Data
    assert "rainfallChartData" in res
    assert len(res["rainfallChartData"]) == 7
    assert "temperatureChartData" in res
    assert len(res["temperatureChartData"]) == 7


