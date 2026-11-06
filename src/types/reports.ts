export type ReportSidebarTab = 
  | 'builder' 
  | 'generated' 
  | 'scheduled' 
  | 'templates' 
  | 'export_center' 
  | 'compliance';

export type ReportType = 
  | 'District Climate Summary'
  | 'Annual Rainfall Report'
  | 'Extreme Events Report'
  | 'Prediction Outlook Report'
  | 'Simulation Impact Report'
  | 'Climate Risk Assessment'
  | 'State Climate Summary';

export type ReportFormat = 'pdf' | 'xlsx' | 'ppt' | 'csv';

export interface ReportConfigurationState {
  includeHistorical: boolean;
  includePredictions: boolean;
  includeSimulation: boolean;
  includeExtremes: boolean;
  includeComparison: boolean;
  includeInsights: boolean;
  includeMapsCharts: boolean;
  audience: 'Research / Academic' | 'Government / Policy' | 'Disaster Management' | 'General Public';
  template: 'Executive' | 'Detailed Technical' | 'Research Paper' | 'Administrative Summary';
  confidentiality: 'Internal Use Only' | 'Public' | 'Restricted';
}

export interface GeneratedReportRecord {
  id: string;
  name: string;
  district: string;
  date: string;
  type: 'PDF' | 'PPT' | 'XLSX' | 'CSV';
  status: 'Ready' | 'Completed' | 'Generating' | 'Failed';
  size: string;
  pages: number;
}

export interface ScheduledReportRecord {
  id: string;
  name: string;
  district: string;
  frequency: 'Daily' | 'Weekly' | 'Monthly';
  nextRun: string;
  format: 'PDF' | 'XLSX' | 'PPT' | 'CSV';
  recipients: string;
  active: boolean;
}

export interface ReportTemplateItem {
  id: string;
  name: string;
  category: string;
  description: string;
  pages: number;
  badge: string;
}

export interface DistrictReportData {
  id: string;
  name: string;
  coordinates: [number, number];
  areaKm2: number;
  population: string;
  elevation: number;
  districtType: string;
  executiveSummary: string;
  stats: {
    avgTemp: number;
    tempDelta: string;
    totalRain: number;
    rainDelta: string;
    extremeEvents: number;
    extremeDelta: string;
    populationUhi: string;
    uhiDelta: string;
  };
  tempTrend: {
    years: number[];
    avg: number[];
    max: number[];
    min: number[];
  };
  rainfallTrend: {
    years: number[];
    values: number[];
    peakYear: number;
    peakVal: number;
  };
  risks: {
    heatwave: { level: 'Low' | 'Moderate' | 'High' | 'Critical'; score: number };
    flood: { level: 'Low' | 'Moderate' | 'High' | 'Critical'; score: number };
    drought: { level: 'Low' | 'Moderate' | 'High' | 'Critical'; score: number };
    uhi: { level: 'Low' | 'Moderate' | 'High' | 'Critical'; score: number };
  };
  keyFindings: {
    id: string;
    category: string;
    title: string;
    description: string;
    icon: 'temp' | 'rain' | 'alert' | 'flood';
    color: string;
  }[];
  reportSummary: {
    avgTemp: number;
    tempDelta: string;
    totalRain: number;
    rainDelta: string;
    extremeEvents: number;
    extremeDelta: string;
    climateRiskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
    forecast2040: string;
    forecastChange: string;
  };
  compliance: {
    modelVersion: string;
    generatedOn: string;
    dataSources: string;
    reviewStatus: 'Not Reviewed' | 'Reviewed' | 'Certified';
  };
  reportInfo?: {
    districtName: string;
    districtId: string;
    generationDate: string;
    generationTime: string;
    generationTimestampIso: string;
    retrievalTimestamp: string;
    dataSources: string;
    timezone: string;
    spatialMethod: string;
    disclaimer: string;
  };
  currentWeather?: {
    temperature: number;
    apparentTemperature?: number;
    relativeHumidity: number;
    precipitation?: number;
    rainfall24h: number;
    windSpeed: number;
    windDirection?: number;
    windDirectionText?: string;
    surfacePressure?: number;
    cloudCover?: number;
    weatherCondition: string;
    observationTime: string;
    retrievalTimestamp: string;
    cached?: boolean;
    units?: Record<string, string>;
  };
  airQuality?: {
    pollutants?: Record<string, number | undefined>;
    indices?: Record<string, any>;
    summary?: {
      cpcbAqi?: number;
      cpcbStatus?: string;
      usAqi?: number;
      pm25?: number;
      pm10?: number;
      no2?: number;
      so2?: number;
      co?: number;
      o3?: number;
    };
    disclaimer?: string;
  };
  historical?: {
    baseline: string;
    highestTemperature?: { value?: number; unit?: string; date?: string };
    lowestTemperature?: { value?: number; unit?: string; date?: string };
    maximumDailyRainfall?: { value?: number; unit?: string; date?: string };
    maximumWindSpeed?: { value?: number; unit?: string; date?: string };
    meanTemperature?: number;
    totalRainfall?: number;
    rainDays?: number;
  };
  forecast?: {
    dataSource?: string;
    attribution?: string;
    horizon?: string;
    days?: any[];
  };
  predictions?: any;
}
