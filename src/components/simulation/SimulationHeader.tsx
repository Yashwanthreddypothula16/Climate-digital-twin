import React from 'react';
import { SimulationScenario, SimulationTimePeriod } from '../../types/simulation';
import { RefreshCw, Play, ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  scenario: SimulationScenario;
  onSelectScenario: (s: SimulationScenario) => void;
  timePeriod: SimulationTimePeriod;
  onSelectTimePeriod: (t: SimulationTimePeriod) => void;
  onRunSimulation: () => void;
  isRunningSimulation: boolean;
}

export const SimulationHeader: React.FC<Props> = ({
  scenario,
  onSelectScenario,
  timePeriod,
  onSelectTimePeriod,
  onRunSimulation,
  isRunningSimulation,
}) => {
  return (
    <div className="shrink-0 h-[48px] px-3 flex items-center justify-between bg-[#040C16] border-b border-[#00f0ff]/15 select-none">
      {/* Left: Title & Subtitle */}
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-7 h-7 rounded-md bg-[#00f0ff]/10 border border-[#00f0ff]/40 flex items-center justify-center text-[#00f0ff] shrink-0 shadow-[0_0_10px_rgba(0,240,255,0.2)]">
          <RefreshCw size={15} />
        </div>
        <div className="flex flex-col min-w-0">
          <h1 className="font-sans font-bold text-xs tracking-wider text-white uppercase truncate">
            CLIMATE SIMULATION
          </h1>
          <p className="text-[9.5px] text-slate-400 font-sans tracking-tight truncate">
            Explore future scenarios and assess potential impacts across Telangana
          </p>
        </div>
      </div>

      {/* Right Controls: Scenario, Time Period, Date, Run Button */}
      <div className="flex items-center gap-2.5">
        {/* Scenario Dropdown */}
        <div className="flex flex-col">
          <span className="text-[8px] text-slate-400 font-mono uppercase">Scenario</span>
          <div className="relative">
            <select
              value={scenario}
              onChange={(e) => onSelectScenario(e.target.value as SimulationScenario)}
              className="px-2.5 py-1 pr-6 rounded bg-[#07152B] border border-white/15 text-[10.5px] font-sans text-white appearance-none focus:outline-none focus:border-[#00f0ff] cursor-pointer"
            >
              <option value="heavy_rainfall">Heavy Rainfall</option>
              <option value="heat_wave">Heat Wave</option>
              <option value="drought">Drought</option>
              <option value="urban_heat_island">Urban Heat Island</option>
              <option value="normal">Normal Conditions</option>
            </select>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[8px]">
              ▼
            </div>
          </div>
        </div>

        {/* Time Period Dropdown */}
        <div className="flex flex-col">
          <span className="text-[8px] text-slate-400 font-mono uppercase">Time Period</span>
          <div className="relative">
            <select
              value={timePeriod}
              onChange={(e) => onSelectTimePeriod(e.target.value as SimulationTimePeriod)}
              className="px-2.5 py-1 pr-6 rounded bg-[#07152B] border border-white/15 text-[10.5px] font-sans text-white appearance-none focus:outline-none focus:border-[#00f0ff] cursor-pointer"
            >
              <option value="7_days">7 Days</option>
              <option value="14_days">14 Days</option>
              <option value="1_month">1 Month</option>
              <option value="3_months">3 Months</option>
            </select>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[8px]">
              ▼
            </div>
          </div>
        </div>

        {/* Date Range Navigation */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#07152B] border border-white/15 text-slate-200 mt-2.5">
          <button className="text-slate-400 hover:text-white"><ChevronLeft size={12} /></button>
          <span className="font-mono text-[9.5px] font-medium tracking-wide">31 Aug 2026 – 06 Sep 2026</span>
          <button className="text-slate-400 hover:text-white"><ChevronRight size={12} /></button>
        </div>

        {/* Run Simulation Action Button */}
        <button
          onClick={onRunSimulation}
          disabled={isRunningSimulation}
          className="mt-2.5 px-3.5 py-1 rounded bg-gradient-to-r from-[#00d8f0] to-[#0094ff] hover:from-[#33e2f5] hover:to-[#1cb1ff] text-[#030914] font-sans font-black text-[11px] uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,216,240,0.35)] transition-all active:scale-[0.98]"
        >
          {isRunningSimulation ? (
            <>
              <span className="w-3 h-3 rounded-full border-2 border-[#030914] border-t-transparent animate-spin" />
              <span>Simulating...</span>
            </>
          ) : (
            <>
              <Play size={11} fill="#030914" />
              <span>Run Simulation</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
