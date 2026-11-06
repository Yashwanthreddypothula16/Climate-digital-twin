import React, { useState } from 'react';
import { 
  NavigationTab, 
  DistrictClimateData, 
  WhatIfSimulationState, 
  ClimateAlert 
} from '../../types/climate';
import { 
  X, 
  Download, 
  Share2, 
  TrendingUp, 
  AlertTriangle, 
  Cpu, 
  FileText, 
  Sparkles, 
  Play,
  Layers,
  BarChart3,
  Calendar,
  CheckCircle
} from 'lucide-react';
import ReactECharts from 'echarts-for-react';
import { DISTRICTS_LIST } from '../../data/telanganaGeo';
import { DISTRICT_CLIMATE_MAP } from '../../data/climateData';

interface FullViewsProps {
  activeTab: NavigationTab;
  onClose: () => void;
  selectedDistrict: DistrictClimateData;
  onSelectDistrict: (id: string) => void;
  whatIfParams: WhatIfSimulationState;
  onParamsChange: (p: WhatIfSimulationState) => void;
  onRunSimulation: () => void;
  alerts: ClimateAlert[];
}

export const FullViews: React.FC<FullViewsProps> = ({
  activeTab,
  onClose,
  selectedDistrict,
  onSelectDistrict,
  whatIfParams,
  onParamsChange,
  onRunSimulation,
  alerts,
}) => {
  if (activeTab === 'DASHBOARD' || activeTab === 'HISTORICAL' || activeTab === 'PREDICTIONS' || activeTab === 'SIMULATION' || activeTab === 'ANALYTICS' || activeTab === 'REPORTS' || activeTab === 'ALERTS' || activeTab === 'MODEL_PERFORMANCE') return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex flex-col p-4 md:p-6 animate-fadeIn overflow-y-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#00f0ff]/30 mb-6">
        <div className="flex items-center space-x-3">
          <div className="px-3 py-1 rounded bg-[#00f0ff]/20 border border-[#00f0ff] text-[#00f0ff] font-mono text-xs font-bold uppercase tracking-wider">
            {activeTab} VIEW
          </div>
          <h1 className="text-xl font-bold text-white tracking-wide font-display">
            Telangana Climate Digital Twin • {activeTab}
          </h1>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-lg bg-[#071330] border border-white/20 text-slate-300 hover:text-white hover:border-[#00f0ff] transition-all"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Dynamic Tab Body */}
      <div className="flex-1">
        {(activeTab as string) === 'SETTINGS' && (
          <div className="p-6 rounded-xl bg-[#09173a]/90 border border-[#00f0ff]/20 max-w-2xl mx-auto space-y-4">
            <h3 className="text-lg font-bold text-white">System Settings & Data Preferences</h3>
            <p className="text-xs text-slate-300">
              Configure telemetry refresh intervals, Open-Meteo cache policies, model evaluation criteria, and district alert thresholds.
            </p>
            <div className="p-4 rounded-lg bg-[#071330] text-xs text-slate-300 space-y-2">
              <div className="flex justify-between items-center py-1 border-b border-white/5">
                <span>Open-Meteo Cache Expiry:</span>
                <span className="font-mono text-[#00f0ff]">15 Minutes (Live) / 24 Hours (Historical)</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-white/5">
                <span>Default Timezone:</span>
                <span className="font-mono text-[#00f0ff]">Asia/Kolkata (IST, UTC+5:30)</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-white/5">
                <span>Inference Engine:</span>
                <span className="font-mono text-[#00f0ff]">Hybrid AI / Quantum ML (Qiskit + XGBoost)</span>
              </div>
            </div>
          </div>
        )}

        {(activeTab as string) === 'ANALYTICS' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#09173a]/80 border border-[#00f0ff]/20">
              <h3 className="text-sm font-bold text-white mb-2">Telangana State Climate Resilience Index</h3>
              <p className="text-xs text-slate-300">
                Multi-criteria geospatial analysis incorporating 33 district administrative boundaries, ISRO Landsat-8 thermal bands, ERA5 atmospheric reanalysis, and CGWB groundwater monitoring telemetry.
              </p>
            </div>
          </div>
        )}

        {(activeTab as string) === 'REPORTS' && (
          <div className="p-6 rounded-xl bg-[#09173a]/90 border border-[#00f0ff]/20 max-w-2xl mx-auto space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Telangana Climate Twin Executive Summary</h3>
                <span className="text-xs text-slate-400 font-mono">Report ID: TC-DT-2024-0517</span>
              </div>
              <button
                onClick={() => alert("Downloading PDF Climate Summary...")}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#00f0ff] text-slate-950 text-xs font-bold"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export PDF</span>
              </button>
            </div>
            <div className="p-4 rounded-lg bg-[#071330] text-xs text-slate-300 space-y-2 leading-relaxed">
              <p><strong>District in Focus:</strong> {selectedDistrict.name}</p>
              <p><strong>Current Temperature:</strong> {selectedDistrict.temperature}°C | <strong>Humidity:</strong> {selectedDistrict.humidity}%</p>
              <p><strong>Vulnerability Factor:</strong> {selectedDistrict.vulnerabilityFactor}</p>
              <p><strong>2030 Projections:</strong> +{selectedDistrict.predictions2030.tempDelta}°C mean warming, {selectedDistrict.predictions2030.rainDelta}% precipitation change.</p>
            </div>
          </div>
        )}

        {(activeTab as string) === 'ALERTS' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {alerts.map((al) => (
                <div key={al.id} className="p-4 rounded-xl bg-[#09173a]/90 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">{al.title}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-500/20 text-red-300">{al.severity}</span>
                  </div>
                  <p className="text-xs text-slate-300">{al.description}</p>
                  <div className="text-[10px] text-cyan-300 font-mono">Affected: {al.affectedDistricts.join(', ')} • {al.timestamp}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
