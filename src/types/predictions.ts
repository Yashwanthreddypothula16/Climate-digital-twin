// Types for Predictions Page in Climate Digital Twin (Telangana State)

export type ForecastHorizon = 'daily' | 'weekly' | 'monthly' | 'yearly';

export type PredictionParameter =
  | 'rainfall'
  | 'temperature'
  | 'humidity'
  | 'wind'
  | 'aqi'
  | 'climate_risk';

export interface HourlyForecastItem {
  time: string;
  hour: number;
  temp: number;
  condition: string;
  icon: 'sun' | 'cloud' | 'cloud-rain' | 'cloud-sun' | 'wind';
  pop: number; // probability of precipitation (0-100%)
  windSpeed: number;
  humidity: number;
}

export interface DailyForecastItem {
  day: string;
  date: string;
  condition: string;
  pop: number; // %
  minTemp: number;
  maxTemp: number;
  windSpeed: number;
  humidity: number;
  risk: 'Low' | 'Moderate' | 'High' | 'Severe';
}

export interface MonthlyForecastItem {
  month: string;
  monthShort: string;
  avgTemp: number;
  minTemp: number;
  maxTemp: number;
  rainfall: number;
  humidity: number;
  risk: 'Low' | 'Moderate' | 'High' | 'Severe';
  isCurrent?: boolean;
}

export interface YearlyProjectionItem {
  year: number;
  avgTemp: number;
  annualRainfall: number;
  humidity: number;
  extremeHeatRisk: 'Low' | 'Moderate' | 'High' | 'Severe';
  floodRisk: 'Low' | 'Moderate' | 'High' | 'Severe';
  droughtRisk: 'Low' | 'Moderate' | 'High' | 'Severe';
  projectedTempDelta: number;
  projectedRainDelta: number;
}

export interface PrecipitationTotals {
  last24Hours: number;
  next24Hours: number;
  next7Days: number;
  monthExpected: number;
  yearExpected: number;
}

export interface ClimateRiskForecastItem {
  name: string;
  current: string;
  predicted: string;
  trend: 'increasing' | 'stable' | 'decreasing';
  level: 'Low' | 'Moderate' | 'High' | 'Severe';
  score: number;
}

export interface ExtremeEventOutlookItem {
  event: string;
  probability: number; // %
  expectedPeriod: string;
  severity: 'Low' | 'Moderate' | 'High' | 'Severe';
  confidence: number; // %
}

export interface SolarConditions {
  sunrise: string;
  sunset: string;
  daylight: string;
  solarElevationDeg: number;
}

export interface PollutantValues {
  pm25: number;
  pm10: number;
  no2: number;
  so2: number;
  o3: number;
  co: number;
}

export interface DistrictPredictionData {
  districtId: string;
  districtName: string;
  coordinates: [number, number]; // [lat, lng]
  elevation: number;
  areaKm2: number;

  // Current conditions
  current: {
    temp: number;
    condition: string;
    high: number;
    low: number;
    humidity: number;
    windSpeed: number;
    windDirectionDeg: number;
    windDirectionText: string;
    windGust: number;
    rainfall24h: number;
    aqi: number;
    aqiStatus: 'Good' | 'Moderate' | 'Poor' | 'Unhealthy';
    uvIndex: number;
    uvCategory: 'Low' | 'Moderate' | 'High' | 'Very High' | 'Extreme';
    feelsLike: number;
    visibilityKm: number;
    dewPoint: number;
  };

  // Predicted next (short-term)
  predicted: {
    temp: number;
    humidity: number;
    rainfall: number;
    windSpeed: number;
    windDirectionDeg: number;
    windDirectionText: string;
    aqi: number;
    aqiStatus: 'Good' | 'Moderate' | 'Poor' | 'Unhealthy';
    feelsLike: number;
    feelsLikeExplanation: string;
    uvIndex: number;
    visibilityKm: number;
    visibilityTrend: 'Stable' | 'Decreasing' | 'Improving';
  };

  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
  weekly: DailyForecastItem[];
  monthly: MonthlyForecastItem[];
  yearly: YearlyProjectionItem[];

  precipitationTotals: PrecipitationTotals;
  precipitationChanceHourly: { time: string; chance: number }[];

  risks: ClimateRiskForecastItem[];
  extremeEvents: ExtremeEventOutlookItem[];
  solar: SolarConditions;
  pollutants: PollutantValues;

  confidence: {
    overall: number;
    temperature: number;
    rainfall: number;
    humidity: number;
    wind: number;
    climateRisk: number;
  };

  modelInfo: {
    architecture: string;
    activeModel: string;
    lastTraining: string;
    horizon: string;
    inputVariables: string[];
    confidence: number;
  };

  aiInsights: {
    id: string;
    title: string;
    metric: string;
    trend: 'up' | 'down' | 'neutral';
    text: string;
  }[];

  aiPredictionSummary: string;

  futureOutlook: {
    tempDelta: string;
    rainDelta: string;
    extremeEventsProjected: number;
    overallRisk: 'Low' | 'Moderate' | 'High' | 'Severe';
  };

  historicalComparison: {
    parameter: string;
    historicalAvg: number;
    currentVal: number;
    predictedVal: number;
    unit: string;
  }[];
}
