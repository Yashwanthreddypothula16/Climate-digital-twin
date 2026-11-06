import React from 'react';
import { SimulationKpiData } from '../../types/simulation';
import { CloudRain, Thermometer, Wind, Droplets, ShieldAlert, ArrowUp, ArrowDown } from 'lucide-react';

interface Props {
  kpis: SimulationKpiData;
}

export const SimulationKPIs: React.FC<Props> = ({ kpis }) => {
  return (
    <div className="w-full h-full grid grid-cols-5 gap-1.5 select-none overflow-hidden">
      {/* 1. Total Rainfall */}
      <div className="h-full bg-[#051124] rounded-lg border border-[#00f0ff]/15 p-2 flex items-center gap-2.5 shadow-md">
        <div className="w-8 h-8 rounded-full bg-[#00f0ff]/10 border border-[#00f0ff]/30 flex items-center justify-center text-[#00f0ff] shrink-0">
          <CloudRain size={16} />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-[8px] text-slate-400 font-mono uppercase truncate">
            TOTAL RAINFALL (7 DAYS)
          </span>
          <span className="text-base font-black text-white leading-tight">
            {kpis.totalRainfall.value} <span className="text-[10px] text-slate-400 font-normal">mm</span>
          </span>
          <span className="text-[8px] font-mono font-semibold text-[#00f0ff] flex items-center gap-0.5 leading-none mt-0.5">
            <ArrowUp size={8} /> {kpis.totalRainfall.changePct}% vs. normal
          </span>
        </div>
      </div>

      {/* 2. Avg Temperature */}
      <div className="h-full bg-[#051124] rounded-lg border border-amber-500/20 p-2 flex items-center gap-2.5 shadow-md">
        <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
          <Thermometer size={16} />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-[8px] text-slate-400 font-mono uppercase truncate">
            AVG. TEMPERATURE
          </span>
          <span className="text-base font-black text-white leading-tight">
            {kpis.avgTemp.value}°C
          </span>
          <span className="text-[8px] font-mono font-semibold text-amber-400 flex items-center gap-0.5 leading-none mt-0.5">
            <ArrowUp size={8} /> {kpis.avgTemp.changeDelta >= 0 ? '+' : ''}{kpis.avgTemp.changeDelta}°C vs. normal
          </span>
        </div>
      </div>

      {/* 3. Max Wind Speed */}
      <div className="h-full bg-[#051124] rounded-lg border border-teal-500/20 p-2 flex items-center gap-2.5 shadow-md">
        <div className="w-8 h-8 rounded-full bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0">
          <Wind size={16} />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-[8px] text-slate-400 font-mono uppercase truncate">
            MAX. WIND SPEED
          </span>
          <span className="text-base font-black text-white leading-tight">
            {kpis.maxWind.value} <span className="text-[10px] text-slate-400 font-normal">km/h</span>
          </span>
          <span className="text-[8px] font-mono font-semibold text-teal-400 flex items-center gap-0.5 leading-none mt-0.5">
            <ArrowUp size={8} /> {kpis.maxWind.changePct}% vs. normal
          </span>
        </div>
      </div>

      {/* 4. Humidity */}
      <div className="h-full bg-[#051124] rounded-lg border border-blue-500/20 p-2 flex items-center gap-2.5 shadow-md">
        <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
          <Droplets size={16} />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-[8px] text-slate-400 font-mono uppercase truncate">
            HUMIDITY
          </span>
          <span className="text-base font-black text-white leading-tight">
            {kpis.humidity.value}%
          </span>
          <span className="text-[8px] font-mono font-semibold text-blue-400 flex items-center gap-0.5 leading-none mt-0.5">
            <ArrowUp size={8} /> {kpis.humidity.changePct}% vs. normal
          </span>
        </div>
      </div>

      {/* 5. Climate Risk Level */}
      <div className="h-full bg-[#051124] rounded-lg border border-rose-500/20 p-2 flex items-center gap-2.5 shadow-md">
        <div className="w-8 h-8 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
          <ShieldAlert size={16} />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-[8px] text-slate-400 font-mono uppercase truncate">
            CLIMATE RISK LEVEL
          </span>
          <span className={`text-base font-black leading-tight ${
            kpis.climateRisk.level === 'Severe' || kpis.climateRisk.level === 'High' ? 'text-rose-400' : 'text-amber-400'
          }`}>
            {kpis.climateRisk.level}
          </span>
          <span className="text-[8px] font-mono text-slate-400 leading-none mt-0.5">
            in {kpis.climateRisk.affectedCount} districts
          </span>
        </div>
      </div>
    </div>
  );
};
