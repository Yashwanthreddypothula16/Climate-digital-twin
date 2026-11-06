export type ClimateLayer = 
  | 'Temperature'
  | 'Rainfall'
  | 'Wind'
  | 'Humidity'
  | 'AQI'
  | 'Drought'
  | 'NDVI'
  | 'Flood Risk'
  | 'Tmax'
  | 'Tmin'
  | 'LST'
  | 'Soil Moisture';

export type HistoricalParam = 'Rainfall' | 'Tmax' | 'Tmin' | 'LST' | 'NDVI';

export type NavigationTab = 
  | 'DASHBOARD'
  | 'HISTORICAL'
  | 'PREDICTIONS'
  | 'SIMULATION'
  | 'ANALYTICS'
  | 'REPORTS'
  | 'ALERTS'
  | 'SETTINGS'
  | 'MODEL_PERFORMANCE';

export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export interface DistrictClimateData {
  id: string;
  name: string;
  teluguName?: string;
  center: [number, number]; // [lat, lng]
  temperature: number; // in °C
  humidity: number; // in %
  rainfall24h: number; // in mm
  windSpeed: number; // in km/h
  windDirection: number; // in degrees
  aqi: number; // 0-500
  aqiStatus: 'Good' | 'Moderate' | 'Poor' | 'Unhealthy' | 'Hazardous';
  uvIndex: number;
  lst: number; // Land Surface Temp
  ndvi: number; // 0 to 1 vegetation index
  soilMoisture: number; // in %
  
  // Historical data 2010 to 2024
  historical: {
    year: number;
    rainfall: number; // mm
    tmax: number; // °C
    tmin: number; // °C
    lst: number; // °C
    ndvi: number; // 0-1
  }[];

  // Predictions for 2030 & 2035
  predictions2030: {
    tempDelta: number; // +1.8 °C
    tempConfidence: number; // 94%
    rainDelta: number; // -12%
    rainConfidence: number; // 91%
    extremeRainDelta: number; // +18%
    extremeRainConfidence: number; // 88%
    droughtDelta: number; // +23%
    droughtConfidence: number; // 89%
  };

  // Risks
  risks: {
    flood: { level: RiskLevel; score: number };
    heat: { level: RiskLevel; score: number };
    drought: { level: RiskLevel; score: number };
    airQuality: { level: RiskLevel; score: number };
    waterStress: { level: RiskLevel; score: number };
    wildfire: { level: RiskLevel; score: number };
  };

  // Live sparklines (array of 10 points)
  sparklines: {
    temperature: number[];
    humidity: number[];
    rainfall: number[];
    windSpeed: number[];
    aqi: number[];
  };

  description: string;
  vulnerabilityFactor: string;
}

export interface ClimateAlert {
  id: string;
  type: 'Heatwave' | 'Thunderstorm' | 'High UV' | 'Flood' | 'Drought' | 'Cyclone';
  severity: 'Warning' | 'Alert' | 'Advisory' | 'Safe';
  title: string;
  affectedDistricts: string[];
  timestamp: string;
  timeAgo: string;
  color: 'red' | 'orange' | 'yellow' | 'green' | 'blue';
  description: string;
}

export interface DataSourceItem {
  id: string;
  name: string;
  fullName: string;
  type: 'Satellite' | 'Radar' | 'Reanalysis' | 'Ground Station' | 'Agency';
  status: 'LIVE' | 'SYNCING' | 'MAINTENANCE';
  latency: string;
  lastSync: string;
  iconName: string;
}

export interface WhatIfSimulationState {
  temperatureIncrease: number; // e.g. +3.0 °C
  rainfallChange: number; // e.g. -20 %
  co2Emission: number; // e.g. +50 %
  forestCoverChange: number; // e.g. -30 %
  urbanizationIncrease: number; // e.g. +25 %
  populationGrowth: number; // e.g. +40 %
  isSimulating: boolean;
  hasRun: boolean;
}

export interface StoryMilestone {
  year: number;
  phase: string;
  badge: string;
  headline: string;
  description: string;
  avgTemp: number;
  annualRainfall: number;
  extremeEvents: number;
  ndvi: number;
}
