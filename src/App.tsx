import React, { useState } from 'react';
import { useClimateStore } from './state/useClimateStore';
import { Header } from './components/header/Header';
import { LeftSidebar } from './components/left-panel/LeftSidebar';
import { DigitalTwin3D } from './components/center-twin/DigitalTwin3D';
import { AiPredictions } from './components/right-panel/AiPredictions';
import { WhatIfSimulation } from './components/right-panel/WhatIfSimulation';
import { FullViews } from './components/modal-views/FullViews';

import { HistoricalExplorer } from './components/bottom-panels/HistoricalExplorer';
import { CurrentWeatherMap } from './components/bottom-panels/CurrentWeatherMap';
import { ClimateRisks } from './components/bottom-panels/ClimateRisks';
import { CurrentVsFuture } from './components/bottom-panels/CurrentVsFuture';
import { AiAssistant } from './components/bottom-panels/AiAssistant';
import { SmartStoryMode } from './components/bottom-panels/SmartStoryMode';
import { DigitalTwinInfo } from './components/bottom-panels/DigitalTwinInfo';
import { HistoricalPage } from './components/historical/HistoricalPage';
import { PredictionsPage } from './components/predictions/PredictionsPage';
import { SimulationPage } from './components/simulation/SimulationPage';
import { AnalyticsPage } from './components/analytics/AnalyticsPage';
import { ReportsPage } from './components/reports/ReportsPage';
import { AlertsPage } from './components/alerts/AlertsPage';
import { ModelPerformancePage } from './components/predictions/ModelPerformancePage';

export const App: React.FC = () => {
  const {
    activeDistrict,
    selectedDistrictId,
    setSelectedDistrictId,
    activeLayer,
    setActiveLayer,
    activeTab,
    setActiveTab,
    whatIfParams,
    setWhatIfParams,
    runWhatIfSimulation,
    resetWhatIfSimulation,
    currentYear,
    setCurrentYear,
    isPlayingTimeline,
    setIsPlayingTimeline,
    alerts,
    dataSources,
    viewMode,
    setViewMode,
    satelliteMode,
    setSatelliteMode,
    activeStoryIndex,
    setActiveStoryIndex,
    isStoryPlaying,
    setIsStoryPlaying,
    chatMessages,
    isAiTyping,
    sendChatMessage,
  } = useClimateStore();

  return (
    /* Root: full screen, no overflow, strictly screen-fit */
    <div className="w-screen h-screen overflow-hidden flex flex-col bg-[#050C14] text-slate-100 font-sans select-none">

      {/* ── HEADER ──────────────────────────────────────────────────── */}
      <div className="shrink-0 h-[60px]">
        <Header
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          selectedDistrictId={selectedDistrictId}
          onSelectDistrict={setSelectedDistrictId}
          onOpenSettings={() => setActiveTab('SETTINGS')}
        />
      </div>

      {/* ── BODY (Full Screen-Fit Layout) ───────────────────────────── */}
      {activeTab === 'HISTORICAL' ? (
        <HistoricalPage />
      ) : activeTab === 'PREDICTIONS' ? (
        <PredictionsPage />
      ) : activeTab === 'SIMULATION' ? (
        <SimulationPage />
      ) : activeTab === 'ANALYTICS' ? (
        <AnalyticsPage />
      ) : activeTab === 'REPORTS' ? (
        <ReportsPage />
      ) : activeTab === 'ALERTS' ? (
        <AlertsPage />
      ) : activeTab === 'MODEL_PERFORMANCE' ? (
        <ModelPerformancePage />
      ) : (
        <div className="flex-1 min-h-0 flex gap-1 p-1 overflow-hidden w-full">

          {/* 1. LEFT SIDEBAR — Flex Basis 16.6% */}
        <div className="flex-[0_0_16.6%] min-w-0 h-full">
          <LeftSidebar
            district={activeDistrict}
            alerts={alerts}
            sources={dataSources}
            onOpenAqiModal={() => setActiveTab('ANALYTICS')}
            onViewAlerts={() => setActiveTab('ALERTS')}
          />
        </div>

        {/* 2. CENTER — Content (Map + Bottom Panels) */}
        <div className="flex-1 min-w-0 h-full flex flex-col gap-1">
          {/* Top: 3D DIGITAL TWIN (~62%) */}
          <div className="flex-[6.2] min-h-0 min-w-0">
            <DigitalTwin3D
              activeLayer={activeLayer}
              onSelectLayer={setActiveLayer}
              selectedDistrictId={selectedDistrictId}
              onSelectDistrict={setSelectedDistrictId}
              currentYear={currentYear}
              onYearChange={setCurrentYear}
              isPlayingTimeline={isPlayingTimeline}
              onTogglePlayTimeline={() => setIsPlayingTimeline(!isPlayingTimeline)}
              activeDistrictData={activeDistrict}
              viewMode={viewMode}
              onToggleViewMode={setViewMode}
              satelliteMode={satelliteMode}
              onToggleSatellite={() => setSatelliteMode(!satelliteMode)}
            />
          </div>

          {/* Bottom: Dashboard Panels (~38%) */}
          <div className="flex-[3.8] min-h-0 min-w-0 flex flex-col gap-1">
            {/* Row 1 */}
            <div className="flex-[2.2] min-h-0 flex gap-1">
              <div className="flex-[2] min-w-0 h-full">
                <HistoricalExplorer 
                  district={activeDistrict}
                  onViewAll={() => setActiveTab('HISTORICAL')}
                />
              </div>
              <div className="flex-[3] min-w-0 h-full">
                <CurrentWeatherMap 
                  onSelectDistrict={setSelectedDistrictId}
                />
              </div>
              <div className="flex-[3.5] min-w-0 h-full">
                <ClimateRisks 
                  district={activeDistrict} 
                  onViewAll={() => setActiveTab('REPORTS')} 
                />
              </div>
            </div>
            {/* Row 2 */}
            <div className="flex-[1.6] min-h-0 flex gap-1">
              <div className="flex-[3.3] min-w-0 h-full">
                <AiAssistant 
                  chatMessages={chatMessages}
                  isAiTyping={isAiTyping}
                  onSendMessage={sendChatMessage}
                />
              </div>
              <div className="flex-[3.6] min-w-0 h-full">
                <SmartStoryMode 
                  activeStoryIndex={activeStoryIndex}
                  onSelectMilestone={setActiveStoryIndex}
                  isStoryPlaying={isStoryPlaying}
                  onTogglePlayStory={() => setIsStoryPlaying(!isStoryPlaying)}
                />
              </div>
              <div className="flex-[2.35] min-w-0 h-full">
                <DigitalTwinInfo />
              </div>
            </div>
          </div>
        </div>

        {/* 3. RIGHT SIDEBAR — Flex Basis 20.5% */}
        <div className="flex-[0_0_20.5%] min-w-0 h-full flex flex-col gap-1 shrink-0 overflow-hidden">
          <div className="flex-1 min-h-0">
            <AiPredictions
              district={activeDistrict}
              onViewAll={() => setActiveTab('PREDICTIONS')}
            />
          </div>
          <div className="flex-1 min-h-0">
            <WhatIfSimulation
              params={whatIfParams}
              onParamsChange={setWhatIfParams}
              onRunSimulation={runWhatIfSimulation}
              onResetSimulation={resetWhatIfSimulation}
            />
          </div>
          <div className="flex-[1.2] min-h-0">
            <CurrentVsFuture />
          </div>
        </div>
      </div>
      )}

      {/* ── FULL SCREEN MODAL VIEWS ── */}
      <FullViews
        activeTab={activeTab}
        onClose={() => setActiveTab('DASHBOARD')}
        selectedDistrict={activeDistrict}
        onSelectDistrict={setSelectedDistrictId}
        whatIfParams={whatIfParams}
        onParamsChange={setWhatIfParams}
        onRunSimulation={runWhatIfSimulation}
        alerts={alerts}
      />
    </div>
  );
};

export default App;
