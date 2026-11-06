import React, { useState } from 'react';
import {
  PredictionParameter,
  ForecastHorizon,
  DistrictPredictionData,
} from '../../types/predictions';
import {
  Play,
  CheckCircle,
  Thermometer,
  CloudRain,
  Droplets,
  Wind,
  Activity,
  ShieldAlert,
  Sun,
  Cpu,
  ChevronRight,
  MapPin,
  Sparkles,
} from 'lucide-react';

interface Props {
  data: DistrictPredictionData;
  activeParameter: PredictionParameter;
  onSelectParameter: (p: PredictionParameter) => void;
  forecastHorizon: ForecastHorizon;
  onSelectHorizon: (h: ForecastHorizon) => void;
  onOpenExtendedModal: (section: string) => void;
  onRunPrediction: () => void;
  isRunningPrediction: boolean;
}

export const PredictionControlsSidebar: React.FC<Props> = ({
  data,
  activeParameter,
  onSelectParameter,
  forecastHorizon,
  onSelectHorizon,
  onOpenExtendedModal,
  onRunPrediction,
  isRunningPrediction,
}) => {
  const parameters: { id: PredictionParameter; label: string; icon: any; color: string }[] = [
    { id: 'temperature', label: 'Temperature', icon: Thermometer, color: '#FF8C2A' },
    { id: 'rainfall', label: 'Rainfall', icon: CloudRain, color: '#00f0ff' },
    { id: 'humidity', label: 'Humidity', icon: Droplets, color: '#3b82f6' },
    { id: 'wind', label: 'Wind Speed', icon: Wind, color: '#14b8a6' },
    { id: 'aqi', label: 'AQI', icon: Activity, color: '#22c55e' },
    { id: 'climate_risk', label: 'Climate Risk', icon: ShieldAlert, color: '#ef4444' },
  ];

  const horizons: ForecastHorizon[] = ['daily', 'weekly', 'monthly', 'yearly'];

  return (
    <aside className="w-full h-full flex flex-col bg-[#030913] border-l border-[#00f0ff]/15 select-none overflow-y-auto custom-scrollbar p-2.5 gap-2.5">
      {/* 1. Header */}
      <div className="flex items-center justify-between pb-1.5 border-b border-white/10 shrink-0">
        <span className="font-sans text-[11px] font-bold text-slate-100 uppercase tracking-wider">
          Prediction Controls
        </span>
        <span className="flex items-center gap-1 text-[8.5px] font-mono text-[#00f0ff]">
          <Sparkles size={11} /> AI Active
        </span>
      </div>

      {/* 2. District Indicator */}
      <div className="flex flex-col gap-1 shrink-0">
        <label className="text-[9px] text-slate-400 uppercase font-mono font-semibold">
          District
        </label>
        <div className="flex items-center justify-between px-2.5 py-1.5 rounded-md bg-[#07152B] border border-[#00f0ff]/30 text-white text-[11px] font-semibold">
          <div className="flex items-center gap-2">
            <MapPin size={13} className="text-[#00f0ff]" />
            <span>{data.districtName}</span>
          </div>
          <span className="text-[8.5px] font-mono text-slate-400">Selected</span>
        </div>
      </div>

      {/* 3. Parameter Selector */}
      <div className="flex flex-col gap-1 shrink-0">
        <label className="text-[9px] text-slate-400 uppercase font-mono font-semibold">
          Parameter
        </label>
        <div className="relative">
          <select
            value={activeParameter}
            onChange={(e) => onSelectParameter(e.target.value as PredictionParameter)}
            className="w-full px-2.5 py-1.5 rounded-md bg-[#07152B] border border-white/15 text-white text-[11px] font-sans appearance-none focus:outline-none focus:border-[#00f0ff] cursor-pointer"
          >
            <option value="rainfall">Rainfall</option>
            <option value="temperature">Temperature</option>
            <option value="humidity">Humidity</option>
            <option value="wind">Wind Speed</option>
            <option value="aqi">Air Quality Index (AQI)</option>
            <option value="climate_risk">Climate Risk</option>
          </select>
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">
            ▼
          </div>
        </div>
      </div>

      {/* 4. Time Period Selector */}
      <div className="flex flex-col gap-1 shrink-0">
        <label className="text-[9px] text-slate-400 uppercase font-mono font-semibold">
          Time Period
        </label>
        <div className="relative">
          <select
            value={forecastHorizon}
            onChange={(e) => onSelectHorizon(e.target.value as ForecastHorizon)}
            className="w-full px-2.5 py-1.5 rounded-md bg-[#07152B] border border-white/15 text-white text-[11px] font-sans appearance-none focus:outline-none focus:border-[#00f0ff] cursor-pointer capitalize"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">
            ▼
          </div>
        </div>
      </div>

      {/* 5. Big Cyan Action Button: [ RUN PREDICTION ] */}
      <button
        onClick={onRunPrediction}
        disabled={isRunningPrediction}
        className="w-full py-2.5 px-3 rounded-md bg-gradient-to-r from-[#00d8f0] to-[#00a3ff] hover:from-[#33e2f5] hover:to-[#1cb1ff] text-[#030914] font-sans font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,216,240,0.4)] transition-all duration-200 active:scale-[0.98] shrink-0"
      >
        {isRunningPrediction ? (
          <>
            <span className="w-3.5 h-3.5 rounded-full border-2 border-[#030914] border-t-transparent animate-spin" />
            <span>COMPUTING MODEL...</span>
          </>
        ) : (
          <>
            <Play size={13} fill="#030914" />
            <span>RUN PREDICTION</span>
          </>
        )}
      </button>

      {/* 6. Forecast Horizon Pills */}
      <div className="flex flex-col gap-1 shrink-0">
        <label className="text-[9px] text-slate-400 uppercase font-mono font-semibold">
          Forecast Horizon
        </label>
        <div className="grid grid-cols-4 gap-1 p-0.5 rounded-md bg-[#061426] border border-white/10">
          {horizons.map((h) => {
            const isActive = forecastHorizon === h;
            return (
              <button
                key={h}
                onClick={() => onSelectHorizon(h)}
                className={`py-1 text-[9.5px] font-sans font-bold capitalize rounded transition-all ${
                  isActive
                    ? 'bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/50 shadow-[0_0_8px_rgba(0,240,255,0.3)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {h}
              </button>
            );
          })}
        </div>
      </div>

      {/* 7. Quick View List */}
      <div className="flex-1 flex flex-col gap-1 shrink-0">
        <label className="text-[9px] text-slate-400 uppercase font-mono font-semibold">
          Quick View
        </label>
        <div className="space-y-1">
          {parameters.map((p) => {
            const Icon = p.icon;
            const isSelected = activeParameter === p.id;
            return (
              <button
                key={p.id}
                onClick={() => onSelectParameter(p.id)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-[10.5px] transition-all ${
                  isSelected
                    ? 'bg-[#00f0ff]/15 text-white border border-[#00f0ff]/40 shadow-[0_0_8px_rgba(0,240,255,0.2)] font-semibold'
                    : 'bg-white/[0.02] text-slate-300 hover:text-white hover:bg-white/5 border border-white/5'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon size={13} style={{ color: p.color }} />
                  <span>{p.label}</span>
                </div>
                <ChevronRight size={12} className="text-slate-500" />
              </button>
            );
          })}

          {/* Extended Analysis Modals */}
          <button
            onClick={() => onOpenExtendedModal('solar_uv')}
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md bg-white/[0.02] text-slate-300 hover:text-white hover:bg-white/5 border border-white/5 text-[10.5px] transition-all"
          >
            <div className="flex items-center gap-2">
              <Sun size={13} className="text-[#FFC53A]" />
              <span>Solar & UV Scale</span>
            </div>
            <ChevronRight size={12} className="text-slate-500" />
          </button>

          <button
            onClick={() => onOpenExtendedModal('model_info')}
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md bg-white/[0.02] text-slate-300 hover:text-white hover:bg-white/5 border border-white/5 text-[10.5px] transition-all"
          >
            <div className="flex items-center gap-2">
              <Cpu size={13} className="text-[#00f0ff]" />
              <span>Model & Confidence</span>
            </div>
            <ChevronRight size={12} className="text-slate-500" />
          </button>
        </div>
      </div>
    </aside>
  );
};
