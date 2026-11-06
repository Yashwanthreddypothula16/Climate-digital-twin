import React from 'react';
import { SimulationParameters } from '../../types/simulation';
import { DISTRICTS_LIST } from '../../data/telanganaGeo';
import { MapPin, Play, Sliders, CloudRain, Thermometer, Wind, Droplets } from 'lucide-react';

interface Props {
  selectedDistrictId: string;
  onSelectDistrict: (d: string) => void;
  parameters: SimulationParameters;
  onParamsChange: (p: SimulationParameters) => void;
  onRunSimulation: () => void;
  isRunningSimulation: boolean;
}

export const SimulationControls: React.FC<Props> = ({
  selectedDistrictId,
  onSelectDistrict,
  parameters,
  onParamsChange,
  onRunSimulation,
  isRunningSimulation,
}) => {
  return (
    <div className="w-full h-full flex flex-col justify-between bg-[#051124] rounded-lg border border-[#00f0ff]/20 p-2.5 shadow-[0_0_15px_rgba(0,0,0,0.5)] select-none overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between pb-1 border-b border-white/10 shrink-0">
        <span className="font-sans text-[11px] font-bold text-slate-100 uppercase tracking-wider">
          SIMULATION CONTROLS
        </span>
        <Sliders size={13} className="text-[#00f0ff]" />
      </div>

      {/* Target District Selector */}
      <div className="flex flex-col gap-0.5 shrink-0 my-1">
        <label className="text-[8.5px] text-slate-400 uppercase font-mono font-semibold">
          Target District
        </label>
        <div className="relative">
          <select
            value={DISTRICTS_LIST.find(d => d.id === selectedDistrictId.toLowerCase() || d.name.toLowerCase() === selectedDistrictId.toLowerCase())?.id || 'hyderabad'}
            onChange={(e) => onSelectDistrict(e.target.value)}
            className="w-full pl-7 pr-6 py-1 rounded bg-[#07152B] border border-[#00f0ff]/30 text-white text-[10.5px] font-sans font-semibold appearance-none focus:outline-none focus:border-[#00f0ff] cursor-pointer"
          >
            {DISTRICTS_LIST.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
          <MapPin size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-[#00f0ff] pointer-events-none" />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[8px]">
            ▼
          </div>
        </div>
      </div>

      {/* Sliders Container */}
      <div className="flex-1 min-h-0 flex flex-col justify-evenly gap-1 py-1">
        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
          Simulation Parameters
        </div>

        {/* 1. Rainfall Increase */}
        <div className="space-y-0.5">
          <div className="flex items-center justify-between text-[9px]">
            <span className="flex items-center gap-1.5 text-slate-300">
              <CloudRain size={11} className="text-[#00f0ff]" /> Rainfall Increase
            </span>
            <span className="font-mono font-bold text-[#00f0ff]">
              {parameters.rainfallIncrease >= 0 ? '+' : ''}{parameters.rainfallIncrease}%
            </span>
          </div>
          <input
            type="range"
            min="-100"
            max="100"
            step="5"
            value={parameters.rainfallIncrease}
            onChange={(e) => onParamsChange({ ...parameters, rainfallIncrease: Number(e.target.value) })}
            className="w-full h-1 bg-[#0a1f3d] rounded-lg appearance-none cursor-pointer accent-[#00f0ff]"
          />
        </div>

        {/* 2. Temperature Change */}
        <div className="space-y-0.5">
          <div className="flex items-center justify-between text-[9px]">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Thermometer size={11} className="text-[#FF8C2A]" /> Temperature Change
            </span>
            <span className="font-mono font-bold text-[#FF8C2A]">
              {parameters.temperatureChange >= 0 ? '+' : ''}{parameters.temperatureChange.toFixed(1)}°C
            </span>
          </div>
          <input
            type="range"
            min="-3"
            max="8"
            step="0.5"
            value={parameters.temperatureChange}
            onChange={(e) => onParamsChange({ ...parameters, temperatureChange: Number(e.target.value) })}
            className="w-full h-1 bg-[#0a1f3d] rounded-lg appearance-none cursor-pointer accent-[#FF8C2A]"
          />
        </div>

        {/* 3. Wind Speed Change */}
        <div className="space-y-0.5">
          <div className="flex items-center justify-between text-[9px]">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Wind size={11} className="text-teal-400" /> Wind Speed Change
            </span>
            <span className="font-mono font-bold text-teal-400">
              {parameters.windSpeedChange >= 0 ? '+' : ''}{parameters.windSpeedChange}%
            </span>
          </div>
          <input
            type="range"
            min="-50"
            max="100"
            step="5"
            value={parameters.windSpeedChange}
            onChange={(e) => onParamsChange({ ...parameters, windSpeedChange: Number(e.target.value) })}
            className="w-full h-1 bg-[#0a1f3d] rounded-lg appearance-none cursor-pointer accent-teal-400"
          />
        </div>

        {/* 4. Humidity Change */}
        <div className="space-y-0.5">
          <div className="flex items-center justify-between text-[9px]">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Droplets size={11} className="text-blue-400" /> Humidity Change
            </span>
            <span className="font-mono font-bold text-blue-400">
              {parameters.humidityChange >= 0 ? '+' : ''}{parameters.humidityChange}%
            </span>
          </div>
          <input
            type="range"
            min="-50"
            max="50"
            step="5"
            value={parameters.humidityChange}
            onChange={(e) => onParamsChange({ ...parameters, humidityChange: Number(e.target.value) })}
            className="w-full h-1 bg-[#0a1f3d] rounded-lg appearance-none cursor-pointer accent-blue-400"
          />
        </div>
      </div>

      {/* Checkbox: Include Climate Change Factor */}
      <div className="flex items-center gap-2 py-1 border-t border-white/5 shrink-0">
        <input
          type="checkbox"
          id="climate_factor"
          checked={parameters.includeClimateChangeFactor}
          onChange={(e) => onParamsChange({ ...parameters, includeClimateChangeFactor: e.target.checked })}
          className="rounded border-white/20 bg-[#07152B] text-[#00f0ff] focus:ring-0 cursor-pointer w-3.5 h-3.5"
        />
        <label htmlFor="climate_factor" className="text-[9px] text-slate-300 cursor-pointer">
          Include Climate Change Factor
        </label>
      </div>

      {/* Run Simulation Button */}
      <button
        onClick={onRunSimulation}
        disabled={isRunningSimulation}
        className="w-full py-2 rounded-md bg-gradient-to-r from-[#00d8f0] to-[#0094ff] hover:from-[#33e2f5] hover:to-[#1cb1ff] text-[#030914] font-sans font-black text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(0,216,240,0.35)] transition-all active:scale-[0.98] shrink-0 mt-1"
      >
        {isRunningSimulation ? (
          <>
            <span className="w-3 h-3 rounded-full border-2 border-[#030914] border-t-transparent animate-spin" />
            <span>Simulating Engine...</span>
          </>
        ) : (
          <>
            <Play size={11} fill="#030914" />
            <span>Run Simulation</span>
          </>
        )}
      </button>
    </div>
  );
};
