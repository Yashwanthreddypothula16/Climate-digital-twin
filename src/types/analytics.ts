export type AnalyticsTab = 
  | 'overview' 
  | 'trend' 
  | 'extreme' 
  | 'comparative' 
  | 'correlation' 
  | 'spatial' 
  | 'sectoral' 
  | 'custom';

export type TimeRangeOption = '2015-2026' | '2010-2026' | '2020-2026' | '2010-2020';

export type ExtremeEventType = 'heatwaves' | 'heavy_rainfall' | 'floods' | 'droughts' | 'extreme_wind';

export type SpatialLayerType = 'rainfall' | 'temperature' | 'humidity' | 'drought' | 'flood' | 'ndvi' | 'lst';

export type SectorType = 'agriculture' | 'water' | 'infrastructure' | 'health';

export interface AnalysisParametersState {
  temperature: boolean;
  rainfall: boolean;
  humidity: boolean;
  windSpeed: boolean;
  aqi: boolean;
  droughtIndex: boolean;
  floodRisk: boolean;
  ndvi: boolean;
  waterBodies: boolean;
}

export interface CustomAnalysisConfig {
  selectedDistrict: string;
  parameters: string[];
  dateRange: string;
  aggregation: 'Monthly' | 'Seasonal' | 'Annual' | 'Decadal';
  chartType: 'Line' | 'Bar' | 'Area' | 'Scatter' | 'Heatmap';
  baseline: 'None' | '2010-2014 Baseline' | 'State Average';
}

export interface KeyInsightItem {
  id: string;
  icon: 'temp' | 'rain' | 'alert' | 'sprout' | 'wind' | 'droplet';
  metric: string;
  explanation: string;
  direction: 'up' | 'down' | 'neutral';
  color: string;
}

export interface ExtremeEventDetail {
  id: string;
  date: string;
  category: ExtremeEventType | string;
  intensity: string;
  severity: 'Moderate' | 'Severe' | 'Critical' | string;
  duration: string;
  impactedAreas: string;
}

export interface DistrictAnalyticsData {
  id: string;
  name: string;
  coordinates: [number, number]; // [lat, lng]
  areaKm2: number;
  elevation: number;
  stats: {
    avgTemp: number;
    tempVsBaseline: string;
    totalRain: number;
    rainVsBaseline: string;
    avgHumidity: number;
    humidityVsBaseline: string;
    avgWind: number;
    windVsBaseline: string;
    extremeEventsCount: number;
    extremeVsBaseline: string;
    droughtIndex: number;
    droughtStatus: string;
  };
  recentTrends: {
    tempDelta: string;
    tempSpark: number[];
    rainDelta: string;
    rainSpark: number[];
    humidityDelta: string;
    humiditySpark: number[];
    windDelta: string;
    windSpark: number[];
  };
  temporal: {
    years: number[];
    tempAvg: number[];
    tempMax: number[];
    tempMin: number[];
    rainfallActual: number[];
    rainfallMovingAvg: number[];
    monthlyMonths: string[];
    monthlyTemp: number[];
    monthlyRain: number[];
    monthlyHumidity: number[];
    monthlyWind: number[];
  };
  risks: {
    heat: { score: number; level: string; change: string };
    flood: { score: number; level: string; change: string };
    drought: { score: number; level: string; change: string };
    wind: { score: number; level: string; change: string };
  };
  landUse: {
    urban: number;
    agriculture: number;
    forest: number;
    waterBodies: number;
    others: number;
    ndviYears: number[];
    ndviValues: number[];
  };
  keyInsights: KeyInsightItem[];
  extremes: {
    heatwaves: {
      totalRecorded: number;
      highestRecorded: string;
      threshold: string;
      recurrenceInterval: string;
      annualFrequency: { year: number; count: number }[];
      severityDistribution: { mild: number; moderate: number; severe: number; extreme: number };
      timeline: ExtremeEventDetail[];
    };
    heavy_rainfall: {
      totalRecorded: number;
      highestRecorded: string;
      threshold: string;
      recurrenceInterval: string;
      annualFrequency: { year: number; count: number }[];
      severityDistribution: { mild: number; moderate: number; severe: number; extreme: number };
      timeline: ExtremeEventDetail[];
    };
    floods: {
      totalRecorded: number;
      highestRecorded: string;
      threshold: string;
      recurrenceInterval: string;
      annualFrequency: { year: number; count: number }[];
      severityDistribution: { mild: number; moderate: number; severe: number; extreme: number };
      timeline: ExtremeEventDetail[];
    };
    droughts: {
      totalRecorded: number;
      highestRecorded: string;
      threshold: string;
      recurrenceInterval: string;
      annualFrequency: { year: number; count: number }[];
      severityDistribution: { mild: number; moderate: number; severe: number; extreme: number };
      timeline: ExtremeEventDetail[];
    };
    extreme_wind: {
      totalRecorded: number;
      highestRecorded: string;
      threshold: string;
      recurrenceInterval: string;
      annualFrequency: { year: number; count: number }[];
      severityDistribution: { mild: number; moderate: number; severe: number; extreme: number };
      timeline: ExtremeEventDetail[];
    };
  };
  correlations: {
    variables: string[];
    matrix: number[][]; // N x N values between -1 and +1
    paired: Record<string, {
      xVar: string;
      yVar: string;
      pearson: number;
      spearman: number;
      r2: number;
      pValue: number;
      sampleSize: number;
      points: [number, number][]; // [x, y]
      trendLine: [number, number][]; // [[x1, y1], [x2, y2]]
      interpretation: string;
    }>;
  };
  sectoral: Record<SectorType, {
    exposureScore: number;
    vulnerabilityLevel: 'Low' | 'Moderate' | 'High' | 'Severe';
    kpis: { label: string; value: string; delta: string; status: 'good' | 'warning' | 'alert' }[];
    indicators: { name: string; score: number; benchmark: number }[];
    narrative: string;
    adaptationPriorities: string[];
  }>;
}
