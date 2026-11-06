import {
  SimulationScenario,
  SimulationTimePeriod,
  SimulationParameters,
  ScenarioSummaryData,
  SimulationKpiData,
  ChartDayData,
  ImpactCardItem,
  SimulationInsightItem,
  RecentSimulationItem,
} from '../types/simulation';
import { DISTRICT_DATA } from '../data/districtClimate';

export const SCENARIO_PRESETS: Record<SimulationScenario, SimulationParameters> = {
  heavy_rainfall: {
    rainfallIncrease: 50,
    temperatureChange: 1.5,
    windSpeedChange: 20,
    humidityChange: 15,
    includeClimateChangeFactor: true,
  },
  heat_wave: {
    rainfallIncrease: -35,
    temperatureChange: 4.0,
    windSpeedChange: 10,
    humidityChange: -25,
    includeClimateChangeFactor: true,
  },
  drought: {
    rainfallIncrease: -60,
    temperatureChange: 2.5,
    windSpeedChange: 5,
    humidityChange: -40,
    includeClimateChangeFactor: true,
  },
  urban_heat_island: {
    rainfallIncrease: 10,
    temperatureChange: 3.2,
    windSpeedChange: -15,
    humidityChange: -10,
    includeClimateChangeFactor: true,
  },
  normal: {
    rainfallIncrease: 0,
    temperatureChange: 0,
    windSpeedChange: 0,
    humidityChange: 0,
    includeClimateChangeFactor: false,
  },
};

export const RECENT_SIMULATIONS_LIST: RecentSimulationItem[] = [
  {
    id: 'sim-1',
    title: 'Heavy Rainfall — Hyderabad',
    date: '28 Aug 2026',
    status: 'Completed',
    scenario: 'heavy_rainfall',
    district: 'Hyderabad',
  },
  {
    id: 'sim-2',
    title: 'Heat Wave — Warangal',
    date: '25 Aug 2026',
    status: 'Completed',
    scenario: 'heat_wave',
    district: 'Warangal Urban',
  },
  {
    id: 'sim-3',
    title: 'Drought — Nalgonda',
    date: '22 Aug 2026',
    status: 'Completed',
    scenario: 'drought',
    district: 'Nalgonda',
  },
  {
    id: 'sim-4',
    title: 'Normal — Telangana',
    date: '18 Aug 2026',
    status: 'Completed',
    scenario: 'normal',
    district: 'Telangana',
  },
];

// District baseline rainfall factors for simulation display
const DISTRICT_BASE_FACTOR: Record<string, number> = {
  Hyderabad: 142,
  Warangal: 134,
  'Warangal Urban': 134,
  'Warangal Rural': 126,
  Nalgonda: 118,
  Khammam: 112,
  Karimnagar: 108,
  Adilabad: 98,
  Sangareddy: 86,
  Nizamabad: 76,
  Mahabubnagar: 72,
  'Bhadradri Kothagudem': 130,
  'Jayashankar': 115,
  'Jagtial': 92,
  'Jangoan': 110,
  'Jogulamba Gadwal': 68,
  'Kamareddy': 80,
  'Kumuram Bheem Asifabad': 105,
  'Mahabubabad': 120,
  'Mancherial': 99,
  'Medak': 88,
  'Medchal Malkajgiri': 138,
  'Mulugu': 128,
  'Nagarkurnool': 74,
  'Narayanpet': 65,
  'Nirmal': 85,
  'Peddapalli': 102,
  'Rajanna Sircilla': 94,
  'Ranga Reddy': 135,
  'Siddipet': 106,
  'Suryapet': 116,
  'Vikarabad': 82,
  'Wanaparthy': 70,
  'Yadadri Bhuvanagiri': 122,
};

// Calculate simulated metrics for any district and parameter set
export function getSimulationResults(
  scenario: SimulationScenario,
  params: SimulationParameters,
  targetDistrict: string,
  timePeriod: SimulationTimePeriod
) {
  const isAll = targetDistrict === 'Telangana';
  const cleanName = isAll ? 'Hyderabad' : targetDistrict;
  const dData = DISTRICT_DATA[cleanName] || DISTRICT_DATA['Hyderabad'];

  const baseRain = DISTRICT_BASE_FACTOR[cleanName] || 110;
  const rainMultiplier = 1 + params.rainfallIncrease / 100;
  const simulatedRain = Math.max(10, Math.round(baseRain * (rainMultiplier > 0 ? rainMultiplier : 0.3)));

  const baseTemp = dData ? dData.temperature : 30.5;
  const simulatedTemp = +(baseTemp + params.temperatureChange).toFixed(1);

  const baseWind = dData ? dData.windSpeed : 22;
  const simulatedWind = Math.round(baseWind * (1 + params.windSpeedChange / 100));

  const baseHum = dData ? dData.humidity : 65;
  const simulatedHumidity = Math.min(98, Math.max(20, Math.round(baseHum * (1 + params.humidityChange / 100))));

  // Risk count and severity
  let riskLevel: 'Low' | 'Moderate' | 'High' | 'Severe' = 'Moderate';
  let affectedDistricts = 5;

  if (scenario === 'heavy_rainfall' || params.rainfallIncrease >= 40) {
    riskLevel = 'High';
    affectedDistricts = 8;
  } else if (scenario === 'heat_wave' || params.temperatureChange >= 3.0) {
    riskLevel = 'Severe';
    affectedDistricts = 14;
  } else if (scenario === 'drought' || params.rainfallIncrease <= -40) {
    riskLevel = 'High';
    affectedDistricts = 11;
  } else if (scenario === 'normal') {
    riskLevel = 'Low';
    affectedDistricts = 2;
  }

  // 1. KPI Data
  const kpiData: SimulationKpiData = {
    totalRainfall: {
      value: simulatedRain,
      changePct: params.rainfallIncrease > 0 ? Math.round(params.rainfallIncrease * 1.24) : params.rainfallIncrease,
    },
    avgTemp: {
      value: simulatedTemp,
      changeDelta: params.temperatureChange,
    },
    maxWind: {
      value: simulatedWind,
      changePct: params.windSpeedChange,
    },
    humidity: {
      value: simulatedHumidity,
      changePct: params.humidityChange,
    },
    climateRisk: {
      level: riskLevel,
      affectedCount: affectedDistricts,
    },
  };

  // 2. Scenario Summary
  const scenarioNames: Record<SimulationScenario, string> = {
    heavy_rainfall: 'Heavy Rainfall Scenario',
    heat_wave: 'Heat Wave Scenario',
    drought: 'Drought Scenario',
    urban_heat_island: 'Urban Heat Island Scenario',
    normal: 'Normal Baseline Scenario',
  };

  const periodLabels: Record<SimulationTimePeriod, string> = {
    '7_days': '7 Day Simulation',
    '14_days': '14 Day Simulation',
    '1_month': '1 Month Simulation',
    '3_months': '3 Month Simulation',
  };

  const keyImpactsMap: Record<SimulationScenario, string[]> = {
    heavy_rainfall: [
      'Increased flood risk in low-lying areas',
      'Higher soil moisture levels across central basins',
      'Potential impact on harvest readiness in agriculture',
      'Moderate to high risk of urban waterlogging',
    ],
    heat_wave: [
      'High thermal stress and critical wet-bulb conditions',
      'Peak power grid strain from air conditioning demand',
      'Evaporative water loss in surface irrigation canals',
      'Heightened livestock health advisories in rural mandals',
    ],
    drought: [
      'Accelerated groundwater table depletion in southern districts',
      'Agricultural crop yield deficit requiring emergency canal release',
      'Soil moisture deficit exceeding 40% threshold',
      'Increased forest fire susceptibility in deciduous belts',
    ],
    urban_heat_island: [
      'Localized nighttime temperature anomalies in dense urban zones',
      'Aerosol stagnation and photochemical smog escalation',
      'Elevated peak ambient cooling consumption in Hyderabad core',
      'Heat reflection from concrete surfaces aggravating micro-districts',
    ],
    normal: [
      'Seasonal baseline temperatures consistent with 10-year mean',
      'Adequate reservoir inflows without flash flood risk',
      'Optimal soil moisture for ongoing cropping cycles',
      'Normal municipal water distribution schedules maintained',
    ],
  };

  const scenarioSummary: ScenarioSummaryData = {
    scenarioName: scenarioNames[scenario],
    scenarioSubtitle: `${periodLabels[timePeriod]} | ${targetDistrict}`,
    avgRainfallIncrease: `${params.rainfallIncrease >= 0 ? '+' : ''}${Math.round(params.rainfallIncrease * 1.24)}%`,
    maxTempChange: `${params.temperatureChange >= 0 ? '+' : ''}${params.temperatureChange.toFixed(1)}°C`,
    windRiskDistricts: affectedDistricts,
    affectedPopulation: isAll ? '2.4M' : '1.1M',
    keyImpacts: keyImpactsMap[scenario],
  };

  // 3. 7-Day Rainfall Comparison Chart Data
  const rainfallDates = ['Aug 31', 'Sep 01', 'Sep 02', 'Sep 03', 'Sep 04', 'Sep 05', 'Sep 06'];
  const baseHistRain = [20, 35, 50, 60, 40, 45, 65];
  const rainfallChartData: ChartDayData[] = rainfallDates.map((date, i) => {
    const hist = baseHistRain[i];
    const mult = Math.max(0.2, 1 + params.rainfallIncrease / 100);
    const sim = Math.round(hist * mult);
    return { date, historical: hist, simulated: sim };
  });

  // 4. 7-Day Temperature Trend Chart Data
  const baseHistTemp = [28.2, 28.8, 29.5, 30.4, 30.1, 29.3, 28.5];
  const temperatureChartData: ChartDayData[] = rainfallDates.map((date, i) => {
    const hist = baseHistTemp[i];
    const sim = +(hist + params.temperatureChange).toFixed(1);
    return { date, historical: hist, simulated: sim };
  });

  // 5. Impact Assessment Cards
  const impactAssessment: Record<string, ImpactCardItem[]> = {
    agriculture: [
      {
        id: 'ag-1',
        title: 'Crop Yield Impact',
        metric: params.rainfallIncrease > 40 ? '-12%' : params.temperatureChange > 3 ? '-18%' : '+4%',
        status: params.rainfallIncrease > 40 || params.temperatureChange > 3 ? 'negative' : 'positive',
      },
      {
        id: 'ag-2',
        title: 'Soil Moisture',
        metric: `${params.rainfallIncrease >= 0 ? '+' : ''}${Math.round(params.rainfallIncrease * 0.36)}%`,
        status: params.rainfallIncrease > 0 ? 'positive' : 'warning',
      },
      {
        id: 'ag-3',
        title: 'Water Availability',
        metric: `${params.rainfallIncrease >= 0 ? '+' : ''}${Math.round(params.rainfallIncrease * 0.44)}%`,
        status: params.rainfallIncrease > 0 ? 'positive' : 'negative',
      },
    ],
    water_resources: [
      {
        id: 'wr-1',
        title: 'Reservoir Inflow',
        metric: `${params.rainfallIncrease >= 0 ? '+' : ''}${Math.round(params.rainfallIncrease * 0.56)}%`,
        status: params.rainfallIncrease > 0 ? 'positive' : 'negative',
      },
      {
        id: 'wr-2',
        title: 'Groundwater Recharge',
        metric: `${params.rainfallIncrease >= 0 ? '+' : ''}${Math.round(params.rainfallIncrease * 0.32)}%`,
        status: 'positive',
      },
      {
        id: 'wr-3',
        title: 'Runoff Volume',
        metric: `${params.rainfallIncrease >= 0 ? '+' : ''}${Math.round(params.rainfallIncrease * 0.72)}%`,
        status: params.rainfallIncrease > 30 ? 'warning' : 'neutral',
      },
    ],
    infrastructure: [
      {
        id: 'inf-1',
        title: 'Drainage System Stress',
        metric: params.rainfallIncrease > 40 ? '+55% (High)' : '+15% (Low)',
        status: params.rainfallIncrease > 40 ? 'negative' : 'neutral',
      },
      {
        id: 'inf-2',
        title: 'Road Flooding Vulnerability',
        metric: params.rainfallIncrease > 30 ? 'Moderate to High' : 'Low',
        status: params.rainfallIncrease > 30 ? 'warning' : 'positive',
      },
      {
        id: 'inf-3',
        title: 'Grid Resilience',
        metric: params.windSpeedChange > 30 ? 'Elevated Squall Risk' : 'Normal',
        status: params.windSpeedChange > 30 ? 'warning' : 'positive',
      },
    ],
  };

  // 6. Simulation Insights
  const simulationInsights: SimulationInsightItem[] = [
    {
      id: 'ins-rain',
      title: 'Heavy Rainfall',
      iconType: 'rain',
      text: `Rainfall is expected to be ${Math.max(0, Math.round(params.rainfallIncrease * 1.24))}% higher than the normal range, increasing flood risk in low-lying areas.`,
    },
    {
      id: 'ins-temp',
      title: 'Temperature',
      iconType: 'temp',
      text: `Temperature may rise by ${params.temperatureChange.toFixed(1)}°C, which could affect crop productivity and soil evapotranspiration.`,
    },
    {
      id: 'ins-wind',
      title: 'Wind Speed',
      iconType: 'wind',
      text: `Wind speed is likely to increase by ${params.windSpeedChange}%, raising the risk of squalls and localized storm damage.`,
    },
    {
      id: 'ins-risk',
      title: 'Climate Risk',
      iconType: 'risk',
      text: `Overall climate risk is evaluated as ${riskLevel.toLowerCase()} for ${affectedDistricts} districts including Hyderabad, Warangal and Khammam.`,
    },
  ];

  return {
    kpiData,
    scenarioSummary,
    rainfallChartData,
    temperatureChartData,
    impactAssessment,
    simulationInsights,
    simulatedRain,
    simulatedTemp,
  };
}

// Get simulated value for a specific district feature on the map
export function getDistrictSimulatedValue(
  districtName: string,
  scenario: SimulationScenario,
  params: SimulationParameters
): number {
  const base = DISTRICT_BASE_FACTOR[districtName] || 95;
  const mult = 1 + params.rainfallIncrease / 100;
  return Math.max(12, Math.round(base * (mult > 0 ? mult : 0.25)));
}
