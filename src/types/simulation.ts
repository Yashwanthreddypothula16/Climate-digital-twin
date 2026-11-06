// Simulation types for Climate Digital Twin (Telangana State)

export type SimulationScenario =
  | 'normal'
  | 'heat_wave'
  | 'heavy_rainfall'
  | 'drought'
  | 'urban_heat_island';

export type SimulationTimePeriod =
  | '7_days'
  | '14_days'
  | '1_month'
  | '3_months';

export type ImpactAssessmentTab =
  | 'agriculture'
  | 'water_resources'
  | 'infrastructure';

export interface SimulationParameters {
  rainfallIncrease: number; // e.g. +50%
  temperatureChange: number; // e.g. +1.5°C
  windSpeedChange: number; // e.g. +20%
  humidityChange: number; // e.g. +15%
  includeClimateChangeFactor: boolean;
}

export interface ScenarioSummaryData {
  scenarioName: string;
  scenarioSubtitle: string;
  avgRainfallIncrease: string;
  maxTempChange: string;
  windRiskDistricts: number;
  affectedPopulation: string;
  keyImpacts: string[];
}

export interface SimulationKpiData {
  totalRainfall: { value: number; changePct: number };
  avgTemp: { value: number; changeDelta: number };
  maxWind: { value: number; changePct: number };
  humidity: { value: number; changePct: number };
  climateRisk: { level: 'Low' | 'Moderate' | 'High' | 'Severe'; affectedCount: number };
}

export interface ChartDayData {
  date: string;
  historical: number;
  simulated: number;
}

export interface ImpactCardItem {
  id: string;
  title: string;
  metric: string;
  unit?: string;
  status: 'positive' | 'warning' | 'negative' | 'neutral';
  description?: string;
}

export interface SimulationInsightItem {
  id: string;
  title: string;
  iconType: 'rain' | 'temp' | 'wind' | 'risk';
  text: string;
}

export interface RecentSimulationItem {
  id: string;
  title: string;
  date: string;
  status: 'Completed' | 'Running' | 'Archived';
  scenario: SimulationScenario;
  district: string;
}

export interface ComparisonParameterRow {
  parameter: string;
  baseline: string | number;
  simulated: string | number;
  change: string;
  unit: string;
  model: string;
}

export interface ImpactExplanationItem {
  name: string;
  baselineCondition: string;
  simulatedCondition: string;
  change: string;
  explanation: string;
  severity: 'positive' | 'warning' | 'negative' | 'neutral';
}

export interface SimulationResultPayload {
  simulationId: string;
  districtId: string;
  districtName: string;
  status: string;
  model: {
    name: string;
    type: string;
    framework: string;
    executionMode: string;
  };
  quantumExecution: {
    modelName: string;
    framework: string;
    executionMode: string;
    qubitCount: number;
    circuitLayers: number;
    quantumGates: string;
    measurement: string;
    pauliZExpectations: number[];
    quantumStateFidelity: number;
    simulatedRiskLevel: 'Low' | 'Moderate' | 'High' | 'Severe';
    baselineRiskLevel: 'Low' | 'Moderate' | 'High' | 'Severe';
    qsvmRiskClassification: string;
    executionTimeMs: number;
  };
  inputParameters: {
    temperatureChange: number;
    rainfallIncrease: number;
    windSpeedChange: number;
    humidityChange: number;
    includeClimateChangeFactor?: boolean;
  };
  baseline: {
    temperature: number;
    rainfall24h: number;
    windSpeed: number;
    relativeHumidity: number;
    riskLevel: string;
  };
  simulatedResults: {
    temperature: number;
    rainfall24h: number;
    windSpeed: number;
    relativeHumidity: number;
    quantumRiskLevel: string;
    qsvmRiskLevel: string;
    pauliZExpectations?: number[];
    quantumStateFidelity?: number;
    landSurfaceTemperature?: number;
    urbanHeatIslandIntensity?: string;
    runoffCoefficient?: number;
    droughtSeverityIndex?: number;
  };
  changesFromBaseline: {
    temperatureDelta: number;
    rainfallChangePct: number;
    windSpeedChangePct: number;
    humidityChangePct: number;
    riskLevelShift: string;
  };
  kpis: SimulationKpiData;
  narrativeExplanation?: string;
  impactExplanations?: ImpactExplanationItem[];
  comparisonTable?: ComparisonParameterRow[];
  rainfallChartData?: ChartDayData[];
  temperatureChartData?: ChartDayData[];
  sectoralImpacts?: any;
  executionTimeMs: number;
  completedAt: string;
}

