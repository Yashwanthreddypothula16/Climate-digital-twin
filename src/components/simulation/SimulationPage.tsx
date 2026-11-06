import React, { useState, useMemo } from 'react';
import { useClimateStore } from '../../state/useClimateStore';
import {
  SimulationScenario,
  SimulationTimePeriod,
  SimulationParameters,
} from '../../types/simulation';
import { SCENARIO_PRESETS, getSimulationResults } from '../../services/simulationService';
import { climateApiClient } from '../../services/apiClient';

import { SimulationHeader } from './SimulationHeader';
import { SimulationSidebar } from './SimulationSidebar';
import { SimulationMap } from './SimulationMap';
import { SimulationControls } from './SimulationControls';
import { ScenarioSummary } from './ScenarioSummary';
import { SimulationKPIs } from './SimulationKPIs';
import { RainfallComparisonChart } from './RainfallComparisonChart';
import { TemperatureTrendChart } from './TemperatureTrendChart';
import { ImpactAssessment } from './ImpactAssessment';
import { SimulationInsights } from './SimulationInsights';

export const SimulationPage: React.FC = () => {
  const store = useClimateStore();

  // Local state for Simulation (preserves Dashboard and Historical states)
  const [activeScenario, setActiveScenario] = useState<SimulationScenario>('heavy_rainfall');
  const [timePeriod, setTimePeriod] = useState<SimulationTimePeriod>('7_days');
  const [parameters, setParameters] = useState<SimulationParameters>(SCENARIO_PRESETS['heavy_rainfall']);
  const [isRunningSimulation, setIsRunningSimulation] = useState<boolean>(false);
  const [backendSimResult, setBackendSimResult] = useState<any>(null);

  // When scenario changes, load its preset parameters
  const handleSelectScenario = (sc: SimulationScenario) => {
    setActiveScenario(sc);
    setParameters(SCENARIO_PRESETS[sc]);
    setBackendSimResult(null);
  };

  // Run simulation trigger connecting to backend physical and quantum simulation engine
  const handleRunSimulation = async () => {
    setIsRunningSimulation(true);
    try {
      const res = await climateApiClient.runSimulation(store.selectedDistrictId, {
        scenario: activeScenario,
        timePeriod,
        parameters: {
          rainfallIncrease: parameters.rainfallIncrease,
          temperatureChange: parameters.temperatureChange,
          windSpeedChange: parameters.windSpeedChange,
          humidityChange: parameters.humidityChange,
          includeClimateChangeFactor: parameters.includeClimateChangeFactor,
        },
        rainfallIncrease: parameters.rainfallIncrease,
        temperatureChange: parameters.temperatureChange,
        windSpeedChange: parameters.windSpeedChange,
        humidityChange: parameters.humidityChange,
        includeClimateChangeFactor: parameters.includeClimateChangeFactor,
      });
      if (res && res.kpis) {
        setBackendSimResult(res);
      }
    } catch (err) {
      console.warn("Backend simulation API invocation error:", err);
    } finally {
      setIsRunningSimulation(false);
    }
  };

  // Clear previous simulation result on district change
  React.useEffect(() => {
    setBackendSimResult(null);
  }, [store.selectedDistrictId]);

  // Compute dynamic simulation outputs merged with quantum model execution
  const simResults = useMemo(() => {
    const base = getSimulationResults(
      activeScenario,
      parameters,
      store.selectedDistrictId,
      timePeriod
    );

    if (backendSimResult?.kpis) {
      const q = backendSimResult.quantumExecution;
      const qSubtitle = q
        ? `${backendSimResult.districtName} • VQC (${q.executionTimeMs}ms, PennyLane simulator)`
        : base.scenarioSummary.scenarioSubtitle;

      const qImpacts = (backendSimResult.impactExplanations || []).map((imp: any) => `${imp.name}: ${imp.change} (${imp.explanation})`);

      // Dynamic Sectoral Impacts Mapping
      const sec = backendSimResult.sectoralImpacts;
      const updatedImpactAssessment = sec ? {
        agriculture: [
          {
            id: 'ag-1',
            title: 'Crop Thermal Stress',
            metric: `${sec.agriculture?.cropThermalStressDays || 0} Days`,
            status: (sec.agriculture?.cropThermalStressDays || 0) > 20 ? 'negative' as const : 'warning' as const,
          },
          {
            id: 'ag-2',
            title: 'Irrigation Demand Delta',
            metric: `${sec.agriculture?.irrigationDemandDelta || '+0%'}`,
            status: sec.agriculture?.irrigationDemandDelta?.startsWith('+') ? 'warning' as const : 'positive' as const,
          },
          {
            id: 'ag-3',
            title: 'Yield Impact Estimate',
            metric: `${sec.agriculture?.yieldImpactEstimate || '0%'}`,
            status: sec.agriculture?.yieldImpactEstimate?.startsWith('-') ? 'negative' as const : 'positive' as const,
          },
        ],
        water_resources: [
          {
            id: 'wr-1',
            title: 'Reservoir Evaporative Loss',
            metric: `${sec.waterResources?.reservoirEvaporativeLossDelta || '+0%'}`,
            status: 'warning' as const,
          },
          {
            id: 'wr-2',
            title: 'Groundwater Stress Level',
            metric: `${sec.waterResources?.groundwaterStressLevel || 'Normal'}`,
            status: sec.waterResources?.groundwaterStressLevel === 'Critical' ? 'negative' as const : 'neutral' as const,
          },
          {
            id: 'wr-3',
            title: 'Peak Runoff Surge',
            metric: `${sec.waterResources?.floodRiskPeakRunoff || '+0%'}`,
            status: sec.waterResources?.floodRiskPeakRunoff?.startsWith('+') ? 'warning' as const : 'neutral' as const,
          },
        ],
        infrastructure: [
          {
            id: 'inf-1',
            title: 'Urban Heat Island Intensity',
            metric: `${backendSimResult.simulatedResults?.urbanHeatIslandIntensity || '+1.5°C'}`,
            status: 'warning' as const,
          },
          {
            id: 'inf-2',
            title: 'Runoff Coefficient',
            metric: `${backendSimResult.simulatedResults?.runoffCoefficient || 0.35}`,
            status: (backendSimResult.simulatedResults?.runoffCoefficient || 0.35) > 0.45 ? 'negative' as const : 'neutral' as const,
          },
          {
            id: 'inf-3',
            title: 'Peak Summer Heat Index',
            metric: `${sec.health?.peakSummerHeatIndex || 32}°C`,
            status: (sec.health?.peakSummerHeatIndex || 32) > 38 ? 'negative' as const : 'warning' as const,
          },
        ],
      } : base.impactAssessment;

      return {
        ...base,
        kpiData: backendSimResult.kpis,
        rainfallChartData: backendSimResult.rainfallChartData || base.rainfallChartData,
        temperatureChartData: backendSimResult.temperatureChartData || base.temperatureChartData,
        impactAssessment: updatedImpactAssessment,
        scenarioSummary: {
          scenarioName: base.scenarioSummary.scenarioName,
          scenarioSubtitle: qSubtitle,
          avgRainfallIncrease: `${backendSimResult.inputParameters?.rainfallIncrease >= 0 ? '+' : ''}${backendSimResult.inputParameters?.rainfallIncrease}%`,
          maxTempChange: `${backendSimResult.inputParameters?.temperatureChange >= 0 ? '+' : ''}${backendSimResult.inputParameters?.temperatureChange.toFixed(1)}°C`,
          windRiskDistricts: backendSimResult.kpis?.climateRisk?.affectedCount || base.scenarioSummary.windRiskDistricts,
          affectedPopulation: `${((backendSimResult.simulatedOutputs?.vulnerablePopulationAtRisk || 1200000) / 1000000).toFixed(1)}M`,
          keyImpacts: qImpacts.length > 0 ? qImpacts : base.scenarioSummary.keyImpacts,
        }
      };
    }

    return base;
  }, [activeScenario, parameters, store.selectedDistrictId, timePeriod, backendSimResult]);

  return (
    <div className="flex-1 min-h-0 flex flex-col p-1 gap-1 overflow-hidden w-full bg-[#050C14] text-slate-100 font-sans select-none">
      {/* 1. Simulation Sub-Header Toolbar */}
      <SimulationHeader
        scenario={activeScenario}
        onSelectScenario={handleSelectScenario}
        timePeriod={timePeriod}
        onSelectTimePeriod={setTimePeriod}
        onRunSimulation={handleRunSimulation}
        isRunningSimulation={isRunningSimulation}
      />

      {/* 2. Main Top Row: Left Sidebar (16.6%), Map (47.4%), Controls & Summary (36%) */}
      <div className="flex-[5.4] min-h-0 flex gap-1 overflow-hidden w-full">
        {/* Left Column — Navigation & Quick Scenarios */}
        <div className="flex-[0_0_16.6%] min-w-0 h-full overflow-hidden">
          <SimulationSidebar
            activeScenario={activeScenario}
            onSelectScenario={handleSelectScenario}
            onSelectDistrict={store.setSelectedDistrictId}
          />
        </div>

        {/* Center — Complete Telangana Simulation Map */}
        <div className="flex-[4.74] min-w-0 h-full overflow-hidden">
          <SimulationMap
            selectedDistrictId={store.selectedDistrictId}
            onSelectDistrict={store.setSelectedDistrictId}
            scenario={activeScenario}
            parameters={parameters}
          />
        </div>

        {/* Right — Simulation Controls & Scenario Summary */}
        <div className="flex-[3.6] min-w-0 h-full flex gap-1 overflow-hidden">
          <div className="flex-1 min-w-0 h-full overflow-hidden">
            <SimulationControls
              selectedDistrictId={store.selectedDistrictId}
              onSelectDistrict={store.setSelectedDistrictId}
              parameters={parameters}
              onParamsChange={setParameters}
              onRunSimulation={handleRunSimulation}
              isRunningSimulation={isRunningSimulation}
            />
          </div>
          <div className="flex-1 min-w-0 h-full overflow-hidden">
            <ScenarioSummary
              summary={simResults.scenarioSummary}
              onViewReport={() => {}}
            />
          </div>
        </div>
      </div>

      {/* 3. Middle Row: 5 KPI Metric Cards */}
      <div className="flex-[1.1] min-h-0 w-full overflow-hidden">
        <SimulationKPIs kpis={simResults.kpiData} />
      </div>

      {/* 4. Bottom Row: 4 Panels (Rainfall, Temp, Impact, Insights) */}
      <div className="flex-[3.5] min-h-0 w-full grid grid-cols-4 gap-1 overflow-hidden">
        <div className="h-full min-w-0 overflow-hidden">
          <RainfallComparisonChart data={simResults.rainfallChartData} />
        </div>
        <div className="h-full min-w-0 overflow-hidden">
          <TemperatureTrendChart data={simResults.temperatureChartData} />
        </div>
        <div className="h-full min-w-0 overflow-hidden">
          <ImpactAssessment impactData={simResults.impactAssessment} />
        </div>
        <div className="h-full min-w-0 overflow-hidden">
          <SimulationInsights
            insights={simResults.simulationInsights}
            simulationResult={backendSimResult}
            isRunning={isRunningSimulation}
            selectedDistrictName={backendSimResult?.districtName || store.selectedDistrictId}
            timePeriod={timePeriod}
          />
        </div>
      </div>
    </div>
  );
};
