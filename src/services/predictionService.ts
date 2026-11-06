// Prediction Data Service for Telangana Climate Digital Twin
// Separates mock/demo layer from visual components and prepares for backend API integration.

import { DistrictPredictionData, ForecastHorizon, HourlyForecastItem, DailyForecastItem } from '../types/predictions';
import { DISTRICT_DATA } from '../data/districtClimate';
import { DISTRICT_CLIMATE_MAP } from '../data/climateData';
import { DISTRICTS_LIST } from '../data/telanganaGeo';
import { climateApiClient } from './apiClient';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const MONTH_SHORTS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Helper to determine UV category
function getUvCategory(uv: number): 'Low' | 'Moderate' | 'High' | 'Very High' | 'Extreme' {
  if (uv <= 2) return 'Low';
  if (uv <= 5) return 'Moderate';
  if (uv <= 7) return 'High';
  if (uv <= 10) return 'Very High';
  return 'Extreme';
}

// Generates district prediction data dynamically using base IMD parameters
export function getDistrictPredictionData(districtNameOrId: string): DistrictPredictionData {
  // Normalize lookup
  const cleanKey = districtNameOrId.trim();
  const byExact = DISTRICT_DATA[cleanKey];
  const byId = Object.values(DISTRICT_DATA).find(
    (d) =>
      d.id.toLowerCase() === cleanKey.toLowerCase() ||
      d.name.toLowerCase() === cleanKey.toLowerCase()
  );
  const districtSummary = byExact || byId || DISTRICT_DATA['Hyderabad'];

  const geoMeta =
    DISTRICTS_LIST.find((d) => d.name.toLowerCase() === districtSummary.name.toLowerCase()) ||
    DISTRICTS_LIST.find((d) => d.id === districtSummary.id) ||
    DISTRICTS_LIST[0];

  const climateMapData =
    DISTRICT_CLIMATE_MAP[districtSummary.id] || DISTRICT_CLIMATE_MAP['hyderabad'];

  const baseTemp = districtSummary.temperature;
  const baseRain = districtSummary.rainfall24h;
  const baseHumidity = districtSummary.humidity;
  const baseWind = districtSummary.windSpeed;
  const baseAqi = districtSummary.aqi;

  // Predict short term
  const predictedTemp = +(baseTemp + 0.7).toFixed(1);
  const predictedHumidity = Math.min(95, Math.round(baseHumidity * 1.05));
  const expectedRain = +(baseRain * 1.44 + 5.6).toFixed(1);
  const predictedWind = Math.round(baseWind * 1.15);
  const predictedAqi = Math.round(baseAqi * 1.08);

  const feelsLike = Math.round(baseTemp + (baseHumidity > 60 ? 2 : 1));
  const predictedFeelsLike = feelsLike + 1;

  // 1. Hourly prediction (10 intervals starting from current hour)
  const currentHour = 9;
  const hourly = [
    { time: 'NOW', hour: 9, temp: 28, condition: 'Partly Cloudy', icon: 'cloud-sun' as const, pop: 15, windSpeed: baseWind, humidity: baseHumidity },
    { time: '10 AM', hour: 10, temp: 29, condition: 'Cloudy', icon: 'cloud' as const, pop: 20, windSpeed: baseWind + 2, humidity: baseHumidity - 2 },
    { time: '11 AM', hour: 11, temp: 30, condition: 'Cloudy', icon: 'cloud' as const, pop: 25, windSpeed: baseWind + 3, humidity: baseHumidity - 4 },
    { time: '12 PM', hour: 12, temp: 31, condition: 'Partly Cloudy', icon: 'cloud-sun' as const, pop: 30, windSpeed: baseWind + 4, humidity: baseHumidity - 6 },
    { time: '1 PM', hour: 13, temp: 31, condition: 'Partly Cloudy', icon: 'cloud-sun' as const, pop: 35, windSpeed: baseWind + 5, humidity: baseHumidity - 7 },
    { time: '2 PM', hour: 14, temp: 31, condition: 'Partly Cloudy', icon: 'cloud-sun' as const, pop: 40, windSpeed: baseWind + 6, humidity: baseHumidity - 8 },
    { time: '3 PM', hour: 15, temp: 32, condition: 'Scattered Showers', icon: 'cloud-rain' as const, pop: 55, windSpeed: baseWind + 4, humidity: baseHumidity + 2 },
    { time: '4 PM', hour: 16, temp: 30, condition: 'Showers', icon: 'cloud-rain' as const, pop: 65, windSpeed: baseWind + 3, humidity: baseHumidity + 6 },
    { time: '5 PM', hour: 17, temp: 29, condition: 'Light Rain', icon: 'cloud-rain' as const, pop: 50, windSpeed: baseWind + 2, humidity: baseHumidity + 8 },
    { time: '6 PM', hour: 18, temp: 28, condition: 'Overcast', icon: 'cloud' as const, pop: 35, windSpeed: baseWind, humidity: baseHumidity + 10 },
  ];

  // Adjust hourly temp to district base
  hourly.forEach((h, i) => {
    h.temp = Math.round(baseTemp - 3 + i * 0.4);
    if (h.temp > baseTemp + 2) h.temp = Math.round(baseTemp + 2);
  });

  // 2. 10-day daily climate forecast
  const conditions = [
    'Partly Cloudy', 'Cloudy', 'Scattered Showers', 'Heavy Rain',
    'Thunderstorm', 'Partly Cloudy', 'Sunny', 'Overcast', 'Light Rain', 'Clear Sky'
  ];
  const risksList: ('Low' | 'Moderate' | 'High' | 'Severe')[] = [
    'Moderate', 'Moderate', 'High', 'High', 'Severe', 'Moderate', 'Low', 'Low', 'Moderate', 'Low'
  ];

  const daily = Array.from({ length: 10 }, (_, i) => {
    const d = new Date(2026, 7, 31 + i);
    const dayName = i === 0 ? 'TODAY' : DAY_NAMES[d.getDay()].toUpperCase();
    const dateStr = `${d.getDate()} ${MONTH_SHORTS[d.getMonth()]}`;
    const minT = Math.round(baseTemp - 8 + Math.sin(i) * 1.5);
    const maxT = Math.round(baseTemp + 1 + Math.cos(i) * 2);
    const pop = Math.min(95, Math.max(10, Math.round(45 + Math.sin(i * 1.3) * 35)));
    const cond = conditions[i % conditions.length];
    const risk = risksList[i % risksList.length];

    return {
      day: dayName,
      date: dateStr,
      condition: cond,
      pop,
      minTemp: minT,
      maxTemp: maxT,
      windSpeed: Math.round(baseWind + Math.sin(i) * 5),
      humidity: Math.round(Math.min(90, Math.max(40, baseHumidity + Math.cos(i) * 12))),
      risk,
    };
  });

  const weekly = daily.slice(0, 7);

  // 3. Monthly forecast (12 months of 2026)
  const monthly = MONTH_SHORTS.map((mShort, idx) => {
    // Monsoon peak around Jun-Sep (indices 5 to 8)
    const isMonsoon = idx >= 5 && idx <= 8;
    const isSummer = idx >= 2 && idx <= 4;
    const avgTemp = isSummer ? 36.5 : isMonsoon ? 28.5 : 24.2;
    const rain = isMonsoon ? Math.round(180 + Math.random() * 80) : isSummer ? 25 : 12;
    const hum = isMonsoon ? 78 : isSummer ? 42 : 55;
    const risk: 'Low' | 'Moderate' | 'High' | 'Severe' =
      isMonsoon && rain > 200 ? 'High' : isSummer ? 'Moderate' : 'Low';

    return {
      month: MONTH_NAMES[idx],
      monthShort: mShort,
      avgTemp: +(avgTemp + (Math.sin(idx) * 1.2)).toFixed(1),
      minTemp: +(avgTemp - 7).toFixed(1),
      maxTemp: +(avgTemp + 6).toFixed(1),
      rainfall: rain,
      humidity: hum,
      risk,
      isCurrent: idx === 7, // August
    };
  });

  // 4. Yearly projection (2026 - 2030)
  const yearly = [
    { year: 2026, avgTemp: 29.8, annualRainfall: 840, humidity: 62, extremeHeatRisk: 'Moderate' as const, floodRisk: 'Moderate' as const, droughtRisk: 'Low' as const, projectedTempDelta: 0.4, projectedRainDelta: 2.1 },
    { year: 2027, avgTemp: 30.2, annualRainfall: 815, humidity: 61, extremeHeatRisk: 'Moderate' as const, floodRisk: 'High' as const, droughtRisk: 'Moderate' as const, projectedTempDelta: 0.8, projectedRainDelta: -3.0 },
    { year: 2028, avgTemp: 30.7, annualRainfall: 790, humidity: 59, extremeHeatRisk: 'High' as const, floodRisk: 'Moderate' as const, droughtRisk: 'High' as const, projectedTempDelta: 1.3, projectedRainDelta: -6.0 },
    { year: 2029, avgTemp: 31.1, annualRainfall: 775, humidity: 58, extremeHeatRisk: 'High' as const, floodRisk: 'High' as const, droughtRisk: 'High' as const, projectedTempDelta: 1.7, projectedRainDelta: -8.0 },
    { year: 2030, avgTemp: 31.6, annualRainfall: 752, humidity: 57, extremeHeatRisk: 'Severe' as const, floodRisk: 'High' as const, droughtRisk: 'Severe' as const, projectedTempDelta: 2.2, projectedRainDelta: -10.5 },
  ];

  // 5. Climate risk indicators
  const risks = [
    { name: 'Heat Risk', current: 'Moderate', predicted: 'High', trend: 'increasing' as const, level: 'High' as const, score: 78 },
    { name: 'Flood Risk', current: 'Low', predicted: 'Moderate', trend: 'increasing' as const, level: 'Moderate' as const, score: 62 },
    { name: 'Drought Risk', current: 'Moderate', predicted: 'Moderate', trend: 'stable' as const, level: 'Moderate' as const, score: 55 },
    { name: 'Heavy Rainfall Risk', current: 'Low', predicted: 'Moderate', trend: 'increasing' as const, level: 'Moderate' as const, score: 58 },
    { name: 'Extreme Wind Risk', current: 'Low', predicted: 'Low', trend: 'stable' as const, level: 'Low' as const, score: 28 },
  ];

  // 6. Extreme event outlook
  const extremeEvents = [
    { event: 'Heatwave', probability: 34, expectedPeriod: 'Next 10-14 days', severity: 'Moderate' as const, confidence: 91 },
    { event: 'Heavy Rainfall / Cloudburst', probability: 68, expectedPeriod: 'Next 48-72 hours', severity: 'High' as const, confidence: 87 },
    { event: 'Urban Flood Flash', probability: 45, expectedPeriod: 'Next 3 days', severity: 'Moderate' as const, confidence: 84 },
    { event: 'Agricultural Drought Stress', probability: 22, expectedPeriod: 'Late Post-Monsoon', severity: 'Low' as const, confidence: 89 },
    { event: 'High Wind Squalls', probability: 38, expectedPeriod: 'Next 24 hours', severity: 'Moderate' as const, confidence: 90 },
  ];

  // 7. Dynamic AI insights tailored to district
  const aiPredictionSummary = `${districtSummary.name} is projected to maintain elevated daytime temperatures around ${predictedTemp}°C with convective cloud formation intensifying in the late afternoon. Precipitable water analysis points to a ${Math.round(expectedRain)} mm expected rainfall event within 48 hours, accompanied by wind gusts reaching ${Math.round(baseWind * 1.4)} km/h from the northwest.`;

  const aiInsights = [
    {
      id: 'ins-1',
      title: 'Rainfall Anomaly',
      metric: `+${(expectedRain - baseRain).toFixed(1)} mm`,
      trend: 'up' as const,
      text: `Higher than normal rainfall is forecasted in ${districtSummary.name} district across the upcoming 3-day projection window.`
    },
    {
      id: 'ins-2',
      title: 'Temperature Shift',
      metric: `+0.7 °C`,
      trend: 'up' as const,
      text: `Surface temperature expected to track slightly above the 10-year baseline due to localized thermal retention.`
    },
    {
      id: 'ins-3',
      title: 'Wind Field Velocity',
      metric: `+15 %`,
      trend: 'up' as const,
      text: `Northwesterly wind gusts may increase by 10-15% toward the evening, aiding atmospheric aerosol dispersion.`
    },
    {
      id: 'ins-4',
      title: 'Hydrological Influx',
      metric: `${Math.round(expectedRain * 0.8)} mm`,
      trend: 'neutral' as const,
      text: `Groundwater catchment basins in ${districtSummary.name} will absorb moderate runoff without catastrophic saturation.`
    },
  ];

  return {
    districtId: districtSummary.id,
    districtName: districtSummary.name,
    coordinates: [geoMeta.lat, geoMeta.lng],
    elevation: geoMeta.elevation,
    areaKm2: Math.round(geoMeta.elevation * 3.4 + 1800),

    current: {
      temp: baseTemp,
      condition: 'Partly Cloudy',
      high: Math.round(baseTemp + 2),
      low: Math.round(baseTemp - 7),
      humidity: baseHumidity,
      windSpeed: baseWind,
      windDirectionDeg: 315, // NW
      windDirectionText: 'NW',
      windGust: Math.round(baseWind * 1.45),
      rainfall24h: baseRain,
      aqi: baseAqi,
      aqiStatus: baseAqi <= 50 ? 'Good' : baseAqi <= 100 ? 'Moderate' : 'Poor',
      uvIndex: 8,
      uvCategory: getUvCategory(8),
      feelsLike,
      visibilityKm: 16,
      dewPoint: +(baseTemp - (100 - baseHumidity) / 5).toFixed(1),
    },

    predicted: {
      temp: predictedTemp,
      humidity: predictedHumidity,
      rainfall: expectedRain,
      windSpeed: predictedWind,
      windDirectionDeg: 320,
      windDirectionText: 'NW',
      aqi: predictedAqi,
      aqiStatus: predictedAqi <= 50 ? 'Good' : 'Moderate',
      feelsLike: predictedFeelsLike,
      feelsLikeExplanation: 'Predicted apparent temperature is higher than measured temperature due to elevated atmospheric humidity and solar angle.',
      uvIndex: 9,
      visibilityKm: 14,
      visibilityTrend: 'Stable',
    },

    hourly,
    daily,
    weekly,
    monthly,
    yearly,

    precipitationTotals: {
      last24Hours: baseRain,
      next24Hours: expectedRain,
      next7Days: +(expectedRain * 3.8).toFixed(1),
      monthExpected: Math.round(expectedRain * 8.2 + 80),
      yearExpected: 840,
    },

    precipitationChanceHourly: [
      { time: '12 AM', chance: 10 },
      { time: '3 AM', chance: 15 },
      { time: '6 AM', chance: 20 },
      { time: '9 AM', chance: 25 },
      { time: '12 PM', chance: 35 },
      { time: '3 PM', chance: 60 },
      { time: '6 PM', chance: 55 },
      { time: '9 PM', chance: 30 },
      { time: '12 AM', chance: 20 },
    ],

    risks,
    extremeEvents,

    solar: {
      sunrise: '6:04 AM',
      sunset: '6:14 PM',
      daylight: '12h 10m',
      solarElevationDeg: 62.4,
    },

    pollutants: {
      pm25: +(baseAqi * 0.42).toFixed(1),
      pm10: +(baseAqi * 0.85).toFixed(1),
      no2: +(18 + (baseAqi * 0.12)).toFixed(1),
      so2: +(8 + (baseAqi * 0.05)).toFixed(1),
      o3: +(24 + (baseAqi * 0.15)).toFixed(1),
      co: +(0.6 + (baseAqi * 0.005)).toFixed(2),
    },

    confidence: {
      overall: 92,
      temperature: 94,
      rainfall: 87,
      humidity: 91,
      wind: 89,
      climateRisk: 85,
    },

    modelInfo: {
      architecture: 'Hybrid AI / Quantum ML',
      activeModel: 'VQC-Enhanced XGBoost Ensemble (v4.2)',
      lastTraining: '31 Aug 2026 • 02:17 PM',
      horizon: 'Multi-Horizon (1h - 5y)',
      inputVariables: [
        'ERA5 Reanalysis',
        'INSAT-3D Optical',
        'MODIS Land Surface Temp',
        'Sentinel-2 NDVI',
        'Telangana SDMA Mesonet'
      ],
      confidence: 92,
    },

    aiInsights,
    aiPredictionSummary,

    futureOutlook: {
      tempDelta: '+1.5°C',
      rainDelta: '-8%',
      extremeEventsProjected: 3,
      overallRisk: 'Moderate',
    },

    historicalComparison: [
      {
        parameter: 'Temperature',
        historicalAvg: +(baseTemp - 3.7).toFixed(1),
        currentVal: baseTemp,
        predictedVal: predictedTemp,
        unit: '°C',
      },
      {
        parameter: 'Rainfall (Annual)',
        historicalAvg: 812,
        currentVal: +(baseRain * 30).toFixed(1),
        predictedVal: +(expectedRain * 32).toFixed(1),
        unit: 'mm',
      },
      {
        parameter: 'Humidity',
        historicalAvg: 67,
        currentVal: baseHumidity,
        predictedVal: predictedHumidity,
        unit: '%',
      },
    ],
  };
}

// Async function to fetch and merge live Open-Meteo current weather, forecasts and ML/QML model inferences
export async function fetchLiveDistrictPredictionData(
  districtNameOrId: string,
  target?: string,
  horizon?: string
): Promise<DistrictPredictionData> {
  const base = getDistrictPredictionData(districtNameOrId);

  try {
    const [currentRes, forecastRes, aqiRes, predRes] = await Promise.allSettled([
      climateApiClient.getCurrentWeather(districtNameOrId),
      climateApiClient.getForecast(districtNameOrId, 10),
      climateApiClient.getAirQuality(districtNameOrId),
      climateApiClient.getPredictions(districtNameOrId, target, horizon),
    ]);

    const updated = { ...base };

    // 1. Merge real Current Weather (ensures live temperature matches API exactly)
    if (currentRes.status === 'fulfilled' && currentRes.value) {
      const cur = currentRes.value;
      if (cur.temperature !== undefined && cur.temperature !== null) {
        updated.current.temp = cur.temperature;
      }
      if (cur.apparentTemperature !== undefined && cur.apparentTemperature !== null) {
        updated.current.feelsLike = Math.round(cur.apparentTemperature);
      }
      if (cur.relativeHumidity !== undefined) {
        updated.current.humidity = cur.relativeHumidity;
      }
      if (cur.windSpeed !== undefined) {
        updated.current.windSpeed = cur.windSpeed;
      }
      if (cur.windDirectionText) {
        updated.current.windDirectionText = cur.windDirectionText;
      }
      if (cur.rainfall24h !== undefined) {
        updated.current.rainfall24h = cur.rainfall24h;
      }
      if (cur.weatherCondition) {
        updated.current.condition = cur.weatherCondition;
      }
    }

    // 2. Merge real Open-Meteo forecast
    if (forecastRes.status === 'fulfilled' && forecastRes.value) {
      const f = forecastRes.value;
      if (f.hourly && f.hourly.length > 0) {
        updated.hourly = f.hourly.slice(0, 10).map((h) => ({
          time: h.time,
          hour: h.hour,
          temp: h.temp,
          condition: h.condition,
          icon: (h.icon.includes('rain') ? 'cloud-rain' : h.icon.includes('sun') ? 'cloud-sun' : 'cloud') as any,
          pop: h.pop,
          windSpeed: h.windSpeed,
          humidity: h.humidity,
        }));
      }

      if (f.daily && f.daily.length > 0) {
        const mappedDaily: DailyForecastItem[] = f.daily.map((d) => ({
          day: d.day,
          date: d.date,
          condition: d.condition,
          pop: d.pop,
          minTemp: d.minTemp,
          maxTemp: d.maxTemp,
          windSpeed: d.windSpeed,
          humidity: Math.round(base.current.humidity + (Math.sin(d.pop) * 8)),
          risk: d.risk,
        }));
        updated.daily = mappedDaily;
        updated.weekly = mappedDaily.slice(0, 7);

        // Update solar sunrise/sunset from live daily data
        if (f.daily[0]?.sunrise && f.daily[0]?.sunset) {
          const parseTime = (iso: string) => {
            try {
              const dt = new Date(iso);
              return dt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
            } catch {
              return iso;
            }
          };
          updated.solar = {
            ...updated.solar,
            sunrise: parseTime(f.daily[0].sunrise),
            sunset: parseTime(f.daily[0].sunset),
          };
        }
      }
    }

    // 3. Merge real Air Quality
    if (aqiRes.status === 'fulfilled' && aqiRes.value) {
      const a = aqiRes.value;
      if (a.pollutants) {
        updated.pollutants = {
          pm25: a.pollutants.pm25 ?? base.pollutants.pm25,
          pm10: a.pollutants.pm10 ?? base.pollutants.pm10,
          no2: a.pollutants.nitrogenDioxide ?? base.pollutants.no2,
          so2: a.pollutants.sulphurDioxide ?? base.pollutants.so2,
          o3: a.pollutants.ozone ?? base.pollutants.o3,
          co: a.pollutants.carbonMonoxide ?? base.pollutants.co,
        };
      }
      const cpcbVal = a.indices?.indianCpcbEstimate?.value ?? a.indices?.usAqi?.value;
      if (cpcbVal !== undefined) {
        updated.current.aqi = cpcbVal;
        updated.predicted.aqi = Math.round(cpcbVal * 1.05);
      }
    }

    // 4. Merge real Model Inference (Random Forest, XGBoost, QSVM, VQC)
    if (predRes.status === 'fulfilled' && predRes.value) {
      const p = predRes.value;
      if (p.shortRangePredictions) {
        updated.predicted.temp = p.shortRangePredictions.temperature;
        updated.predicted.rainfall = p.shortRangePredictions.rainfall;
        updated.predicted.feelsLike = p.shortRangePredictions.feelsLike;
      }
      if (p.summary) {
        updated.aiPredictionSummary = p.summary;
      }
      if (p.modelInference) {
        updated.modelInfo = {
          architecture: 'Hybrid AI / Quantum ML',
          activeModel: `${p.modelInference.xgboost.model} + ${p.modelInference.qsvm.model}`,
          lastTraining: 'Chronological Cross-Validation Test Set (2023-2025)',
          horizon: 'Multi-Horizon (1h to 10-day Open-Meteo & Climate Scenarios)',
          inputVariables: [
            'Open-Meteo ECMWF Numerical Weather Prediction',
            'ERA5 Atmospheric Reanalysis',
            'CAMS European Air Quality Composition',
            'Telangana Geographic Coordinates & Elevation',
            'PennyLane Quantum AngleEmbedding (4 Qubits)'
          ],
          confidence: p.modelInference.xgboost.confidence || 92,
        };

        updated.confidence = {
          ...updated.confidence,
          overall: Math.round(p.modelInference.xgboost.confidence || 92),
        };
      }
    }

    return updated;
  } catch (err) {
    return base;
  }
}

export function getStatewideDistrictForecasts(param = 'rainfall'): Array<{
  id: string;
  name: string;
  min: number;
  max: number;
  avg: number;
  status: 'Low' | 'Moderate' | 'High';
  temp: number;
  humidity: number;
  windSpeed: number;
  aqi: number;
}> {
  return DISTRICTS_LIST.map((dist) => {
    const d = DISTRICT_DATA[dist.name] || DISTRICT_DATA['Hyderabad'];
    const minVal = +(d.rainfall24h * 0.65 + 3.2).toFixed(1);
    const maxVal = +(d.rainfall24h * 1.8 + 8.4).toFixed(1);
    const avgVal = +((minVal + maxVal) / 2).toFixed(1);
    const status: 'Low' | 'Moderate' | 'High' =
      avgVal > 12 ? 'High' : avgVal > 9 ? 'Moderate' : 'Low';

    return {
      id: d.id,
      name: d.name,
      min: minVal,
      max: maxVal,
      avg: avgVal,
      status,
      temp: d.temperature,
      humidity: d.humidity,
      windSpeed: d.windSpeed,
      aqi: d.aqi,
    };
  });
}
