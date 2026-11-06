export type AlertsSidebarTab = 
  | 'active'
  | 'early_warnings'
  | 'risk_zones'
  | 'rules'
  | 'contacts'
  | 'history';

export type AlertSeverityFilter = 'all' | 'severe' | 'moderate' | 'advisory' | 'resolved';

export type AlertSeverity = 'Severe' | 'High' | 'Moderate' | 'Advisory' | 'Resolved';

export type AlertCategory = 
  | 'all'
  | 'heatwave'
  | 'heavy_rainfall'
  | 'flood'
  | 'drought'
  | 'thunderstorm'
  | 'wind'
  | 'air_quality';

export type TimeRangeOption = '24h' | '7d' | '30d' | 'custom';

export interface SOPChecklistItem {
  id: string;
  task: string;
  completed: boolean;
  assignedRole: string;
  completedAt?: string;
}

export interface AlertTimelineEvent {
  timestamp: string;
  event: string;
  actor: string;
  note?: string;
}

export interface ClimateAlertRecord {
  id: string;
  title: string;
  category: AlertCategory;
  categoryLabel: string;
  severity: AlertSeverity;
  districts: string[];
  primaryDistrict: string;
  lat: number;
  lon: number;
  issuedTime: string;
  expectedDuration: string;
  confidence: number;
  triggerCondition: string;
  recommendedAction: string;
  responseTeam: string;
  status: 'Active' | 'Acknowledged' | 'Escalated' | 'Resolved';
  priority: 'P1' | 'P2' | 'P3';
  calloutValue: string; // e.g. "38.4°C" or "112 mm" or "High Risk"
  calloutType: string;  // e.g. "Heatwave" or "Heavy Rainfall"
  notes: string[];
  checklist: SOPChecklistItem[];
  timeline: AlertTimelineEvent[];
}

export interface EarlyWarningItem {
  id: string;
  category: AlertCategory;
  categoryLabel: string;
  district: string;
  predictedOnset: string;
  expectedDuration: string;
  estimatedSeverity: AlertSeverity;
  forecastSource: string;
  confidence: number;
  warningThreshold: string;
  recommendedAction: string;
}

export interface AlertRuleItem {
  id: string;
  name: string;
  parameter: string;
  condition: 'Greater than' | 'Less than' | 'Exceeds threshold for';
  threshold: string;
  duration: string;
  districts: string[];
  severity: AlertSeverity;
  channels: string[];
  enabled: boolean;
  lastEvaluated: string;
}

export interface EmergencyContactItem {
  id: string;
  name: string;
  organization: string;
  role: string;
  district: string;
  mobile: string;
  email: string;
  responsibility: string;
  priority: 'P1' | 'P2' | 'P3';
  supportedChannels: string[];
  active: boolean;
}

export interface AlertChannelInfo {
  id: string;
  name: string;
  status: 'Online' | 'Offline' | 'Not Configured' | 'Degraded';
  provider: string;
  lastSuccessfulDelivery: string;
  errorRate: string;
  isSimulationOnly: boolean;
}
