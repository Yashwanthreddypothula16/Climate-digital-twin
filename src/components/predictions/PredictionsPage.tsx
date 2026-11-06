import React, { useState, useEffect } from 'react';
import { useClimateStore } from '../../state/useClimateStore';
import {
  PredictionParameter,
  ForecastHorizon,
} from '../../types/predictions';
import { getDistrictPredictionData, fetchLiveDistrictPredictionData } from '../../services/predictionService';
import { climateApiClient } from '../../services/apiClient';

import { PredictionHeader } from './PredictionHeader';
import { PredictionLeftSidebar } from './PredictionLeftSidebar';
import { PredictionMap } from './PredictionMap';
import { PredictionSummaryCard } from './PredictionSummaryCard';
import { PredictionControlsSidebar } from './PredictionControlsSidebar';
import { PredictionCharts } from './PredictionCharts';
import { PredictionBottomPanels } from './PredictionBottomPanels';
import { PredictionExtendedDetails } from './PredictionExtendedDetails';

export const PredictionsPage: React.FC = () => {
  const store = useClimateStore();

  // Local state for Predictions page (does not mutate Dashboard or Historical state)
  const [activeParameter, setActiveParameter] = useState<PredictionParameter>('rainfall');
  const [forecastHorizon, setForecastHorizon] = useState<ForecastHorizon>('daily');
  const [isRunningPrediction, setIsRunningPrediction] = useState<boolean>(false);
  const [extendedModalSection, setExtendedModalSection] = useState<string | null>(null);

  // Active backend prediction result (stores genuine trained model inference)
  const [predictionResult, setPredictionResult] = useState<any>(null);

  // Current district prediction data (instant baseline + live update)
  const [predictionData, setPredictionData] = useState(() => getDistrictPredictionData(store.selectedDistrictId));

  // Current live temperature derived from verified Open-Meteo store state
  const isMatchingDistrict = store.liveWeather && (
    store.liveWeather.districtId?.toLowerCase() === store.selectedDistrictId?.toLowerCase() ||
    store.liveWeather.districtName?.toLowerCase() === store.selectedDistrictId?.toLowerCase()
  );
  const currentLiveTemp = isMatchingDistrict && store.liveWeather?.temperature !== undefined
    ? store.liveWeather.temperature
    : (predictionData.current?.temp ?? null);
  const isLiveLoading = store.isLiveLoading;

  // Synchronize on district selection change
  useEffect(() => {
    let cancelled = false;

    // Fetch baseline prediction data & execute initial prediction
    fetchLiveDistrictPredictionData(store.selectedDistrictId, activeParameter, forecastHorizon).then((data) => {
      if (!cancelled) setPredictionData(data);
    });

    climateApiClient.getPredictions(store.selectedDistrictId, activeParameter, forecastHorizon).then((res) => {
      if (!cancelled && res) {
        setPredictionResult(res);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [store.selectedDistrictId]);

  // Handle Run Prediction button — sends selected district, parameter, and time period to backend
  const handleRunPrediction = async () => {
    setIsRunningPrediction(true);
    try {
      const res = await climateApiClient.getPredictions(
        store.selectedDistrictId,
        activeParameter,
        forecastHorizon
      );
      if (res) {
        setPredictionResult(res);
      }
      const freshData = await fetchLiveDistrictPredictionData(
        store.selectedDistrictId,
        activeParameter,
        forecastHorizon
      );
      setPredictionData(freshData);
    } catch (err) {
      console.error('Run Prediction failed:', err);
    } finally {
      setIsRunningPrediction(false);
    }
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col p-1 gap-1 overflow-hidden w-full bg-[#050C14] text-slate-100 font-sans select-none">
      {/* 1. Page Header (Sub-header below global navigation) */}
      <PredictionHeader
        districtName={predictionData.districtName}
        coordinates={predictionData.coordinates}
        forecastHorizon={forecastHorizon}
        onSelectHorizon={setForecastHorizon}
        confidence={predictionData.confidence.overall}
      />

      {/* 2. Main Top Row: Left Nav (16%), Map (~38%), Forecast Summary (~28%), Right Controls (18%) */}
      <div className="flex-[4.8] min-h-0 flex gap-1 overflow-hidden w-full">
        {/* Left Column — Navigation & District List (16%) */}
        <div className="flex-[0_0_16%] min-w-0 h-full overflow-hidden">
          <PredictionLeftSidebar
            selectedDistrictId={store.selectedDistrictId}
            onSelectDistrict={store.setSelectedDistrictId}
            onNavigateTab={(tab) => store.setActiveTab(tab as any)}
          />
        </div>

        {/* Center — Map + Weather/Hourly Summary */}
        <div className="flex-1 min-w-0 h-full flex gap-1 overflow-hidden">
          {/* Main Map (~38% of total page width) */}
          <div className="flex-[5.8] min-w-0 h-full">
            <PredictionMap
              selectedDistrictId={store.selectedDistrictId}
              onSelectDistrict={store.setSelectedDistrictId}
              activeParameter={activeParameter}
              forecastHorizon={forecastHorizon}
            />
          </div>

          {/* Forecast Summary Card (~28% of total page width) */}
          <div className="flex-[4.2] min-w-0 h-full">
            <PredictionSummaryCard
              data={predictionData}
              forecastHorizon={forecastHorizon}
              currentLiveTemp={currentLiveTemp}
              isLiveLoading={isLiveLoading}
            />
          </div>
        </div>

        {/* Right Column — Prediction Controls Sidebar (18%) */}
        <div className="flex-[0_0_18%] min-w-0 h-full overflow-hidden">
          <PredictionControlsSidebar
            data={predictionData}
            activeParameter={activeParameter}
            onSelectParameter={setActiveParameter}
            forecastHorizon={forecastHorizon}
            onSelectHorizon={setForecastHorizon}
            onOpenExtendedModal={setExtendedModalSection}
            onRunPrediction={handleRunPrediction}
            isRunningPrediction={isRunningPrediction}
          />
        </div>
      </div>

      {/* 3. Middle Row: 4 Technical Forecast Charts (Temp, Rain, Humidity, Wind) */}
      <div className="flex-[2.6] min-h-0 w-full overflow-hidden">
        <PredictionCharts
          data={predictionData}
          predictionResult={predictionResult}
        />
      </div>

      {/* 4. Bottom Row: District Table, Weekly Forecast, Monthly/Yearly Summary, AI Insights */}
      <div className="flex-[2.6] min-h-0 w-full overflow-hidden">
        <PredictionBottomPanels
          data={predictionData}
          onSelectDistrict={store.setSelectedDistrictId}
          activeParameter={activeParameter}
          forecastHorizon={forecastHorizon}
          predictionResult={predictionResult}
          isRunningPrediction={isRunningPrediction}
        />
      </div>

      {/* 5. Extended Details Modal */}
      {extendedModalSection && (
        <PredictionExtendedDetails
          data={predictionData}
          initialTab={extendedModalSection}
          onClose={() => setExtendedModalSection(null)}
        />
      )}
    </div>
  );
};
