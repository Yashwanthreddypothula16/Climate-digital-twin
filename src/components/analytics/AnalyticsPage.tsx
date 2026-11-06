import React, { useState, useMemo } from 'react';
import { useClimateStore } from '../../state/useClimateStore';
import { AnalyticsHeader } from './AnalyticsHeader';
import { AnalyticsSidebar } from './AnalyticsSidebar';
import { ClimateOverview } from './ClimateOverview';
import { TrendAnalysis } from './TrendAnalysis';
import { ExtremeEventsAnalysis } from './ExtremeEventsAnalysis';
import { ComparativeAnalysis } from './ComparativeAnalysis';
import { CorrelationAnalysis } from './CorrelationAnalysis';
import { SpatialInsights } from './SpatialInsights';
import { SectoralImpact } from './SectoralImpact';
import { CustomAnalytics } from './CustomAnalytics';
import {
  AnalyticsTab,
  TimeRangeOption,
  AnalysisParametersState
} from '../../types/analytics';
import { getDistrictAnalyticsData } from '../../services/analyticsDataService';

export const AnalyticsPage: React.FC = () => {
  const store = useClimateStore();

  // Centralized Analytics States
  const [activeAnalysisTab, setActiveAnalysisTab] = useState<AnalyticsTab>('overview');
  const [timeRange, setTimeRange] = useState<TimeRangeOption>('2015-2026');
  const [visualizationMode, setVisualizationMode] = useState<string>('key_indicators');

  const [parameters, setParameters] = useState<AnalysisParametersState>({
    temperature: true,
    rainfall: true,
    humidity: false,
    windSpeed: false,
    aqi: false,
    droughtIndex: false,
    floodRisk: false,
    ndvi: false,
    waterBodies: false,
  });

  const handleToggleParameter = (param: keyof AnalysisParametersState) => {
    setParameters((prev) => ({ ...prev, [param]: !prev[param] }));
  };

  const handleApplyParameters = () => {
    // Parameter filtering applied feedback
  };

  // Derive district data for current district
  const districtData = useMemo(() => {
    return getDistrictAnalyticsData(store.selectedDistrictId, timeRange);
  }, [store.selectedDistrictId, timeRange]);

  // Handle Export Report
  const handleExportReport = () => {
    const reportText = `=====================================================
CLIMATE DIGITAL TWIN - TELANGANA STATE, INDIA
COMPREHENSIVE CLIMATE ANALYTICS EXECUTIVE REPORT
=====================================================
District: ${districtData.name}
Coordinates: ${districtData.coordinates[0]}° N, ${districtData.coordinates[1]}° E
Area: ${districtData.areaKm2} km²
Elevation: ${districtData.elevation} m
Time Period Analyzed: ${timeRange}
Generated: ${new Date().toLocaleString()}

KEY CLIMATE STATISTICS:
- Average Temperature: ${districtData.stats.avgTemp} °C (${districtData.stats.tempVsBaseline})
- Total Annual Rainfall: ${districtData.stats.totalRain} mm (${districtData.stats.rainVsBaseline})
- Average Relative Humidity: ${districtData.stats.avgHumidity} %
- Average Wind Speed: ${districtData.stats.avgWind} km/h
- Decadal Extreme Events: ${districtData.stats.extremeEventsCount}
- Standardized Drought Index: ${districtData.stats.droughtIndex} (${districtData.stats.droughtStatus})

CLIMATE RISK RATINGS:
- Heatwave Risk Score: ${districtData.risks.heat.score}/100 (${districtData.risks.heat.level})
- Flood Vulnerability: ${districtData.risks.flood.score}/100 (${districtData.risks.flood.level})
- Drought Vulnerability: ${districtData.risks.drought.score}/100 (${districtData.risks.drought.level})
- Extreme Wind Vulnerability: ${districtData.risks.wind.score}/100 (${districtData.risks.wind.level})

LAND USE & CANOPY COVERAGE:
- Urban Hardscape: ${districtData.landUse.urban}%
- Agricultural Land: ${districtData.landUse.agriculture}%
- Forest Canopy: ${districtData.landUse.forest}%
- Water Bodies & Reservoirs: ${districtData.landUse.waterBodies}%
- Others: ${districtData.landUse.others}%

KEY COMPUTED INSIGHTS:
${districtData.keyInsights.map((ki, i) => `${i + 1}. [${ki.metric.toUpperCase()}] ${ki.explanation}`).join('\n')}

DATA SOURCES:
- IMD Automatic Weather Station (AWS) Daily Telemetry
- ISRO Bhuvan / Landsat-8 Thermal Surface Radiance (LST)
- Central Ground Water Board (CGWB) Hydrological Profiles
=====================================================`;

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Telangana_Climate_Analytics_${districtData.name}_${timeRange}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col w-full h-full bg-[#050C14] text-slate-100 font-sans select-none overflow-hidden">
      {/* ── Subheader below global navigation ── */}
      <AnalyticsHeader
        activeTab={activeAnalysisTab}
        onSelectTab={setActiveAnalysisTab}
        timeRange={timeRange}
        onSelectTimeRange={setTimeRange}
        visualizationMode={visualizationMode}
        onSelectVisualization={setVisualizationMode}
        onExport={handleExportReport}
      />

      {/* ── Main Layout: Sidebar (16.6%) + Content Area (83.4%) ── */}
      <div className="flex-1 min-h-0 flex overflow-hidden w-full">
        {/* Left Sidebar */}
        <div className="flex-[0_0_16.6%] min-w-0 h-full overflow-hidden">
          <AnalyticsSidebar
            activeTab={activeAnalysisTab}
            onSelectTab={setActiveAnalysisTab}
            selectedDistrictId={store.selectedDistrictId}
            onSelectDistrict={store.setSelectedDistrictId}
            timeRange={timeRange}
            onSelectTimeRange={setTimeRange}
            parameters={parameters}
            onToggleParameter={handleToggleParameter}
            onApplyParameters={handleApplyParameters}
          />
        </div>

        {/* Central Analytical Views */}
        <div className="flex-1 min-w-0 h-full overflow-hidden flex flex-col">
          {activeAnalysisTab === 'overview' && (
            <ClimateOverview
              data={districtData}
              selectedDistrictId={store.selectedDistrictId}
              onSelectDistrict={store.setSelectedDistrictId}
              activeTab={activeAnalysisTab}
              onSelectTab={setActiveAnalysisTab}
            />
          )}

          {activeAnalysisTab === 'trend' && (
            <TrendAnalysis data={districtData} />
          )}

          {activeAnalysisTab === 'extreme' && (
            <ExtremeEventsAnalysis data={districtData} />
          )}

          {activeAnalysisTab === 'comparative' && (
            <ComparativeAnalysis primaryData={districtData} />
          )}

          {activeAnalysisTab === 'correlation' && (
            <CorrelationAnalysis data={districtData} />
          )}

          {activeAnalysisTab === 'spatial' && (
            <SpatialInsights
              data={districtData}
              selectedDistrictId={store.selectedDistrictId}
              onSelectDistrict={store.setSelectedDistrictId}
            />
          )}

          {activeAnalysisTab === 'sectoral' && (
            <SectoralImpact data={districtData} />
          )}

          {activeAnalysisTab === 'custom' && (
            <CustomAnalytics
              data={districtData}
              onSelectDistrict={store.setSelectedDistrictId}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
