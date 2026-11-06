import React from 'react';
import type { DistrictClimateData } from '../../types/climate';
import { ArrowUp, ArrowDown, AlertTriangle, TrendingUp } from 'lucide-react';

interface Props {
  district: DistrictClimateData;
}

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-[#0A1320] border border-white/5 rounded-md shadow-lg overflow-hidden flex flex-col ${className}`}>
    {children}
  </div>
);

const SectionTitle: React.FC<{ title: string; right?: React.ReactNode }> = ({ title, right }) => (
  <div className="flex items-center justify-between px-3 py-1.5 border-b border-white/5 shrink-0">
    <span className="font-sans text-[10px] font-bold tracking-wider text-[#C0D0DE] uppercase">
      {title}
    </span>
    {right}
  </div>
);

export const HistoricalInsights: React.FC<Props> = ({ district }) => {
  return (
    <Card className="w-full shrink-0 mt-2">
      <SectionTitle title={`${district.name.toUpperCase()} - KEY INSIGHTS`} />
      <div className="flex gap-4 p-2.5 min-h-[70px]">
        
        {/* Temperature Trend */}
        <div className="flex-1 flex items-center gap-3 pr-4 border-r border-white/10">
          <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center shrink-0">
            <ArrowUp size={20} color="#06b6d4" />
          </div>
          <div className="flex flex-col shrink-0">
            <span className="text-[10px] text-slate-400">Temperature Trend</span>
            <span className="text-sm font-bold text-red-400 leading-none mt-1">+1.2 °C</span>
            <span className="text-[8px] text-slate-500 mt-1">(2010-2024)</span>
          </div>
          <p className="text-[9px] text-slate-300 ml-2 leading-snug flex-1">
            Gradual increase in average temperature over the past 15 years.
          </p>
        </div>

        {/* Rainfall Trend */}
        <div className="flex-1 flex items-center gap-3 pr-4 border-r border-white/10">
          <div className="w-10 h-10 rounded-full bg-slate-700/30 border border-slate-500/30 flex items-center justify-center shrink-0">
            <ArrowDown size={20} color="#3b82f6" />
          </div>
          <div className="flex flex-col shrink-0">
            <span className="text-[10px] text-slate-400">Rainfall Trend</span>
            <span className="text-sm font-bold text-emerald-400 leading-none mt-1">-8%</span>
            <span className="text-[8px] text-slate-500 mt-1">(2010-2024)</span>
          </div>
          <p className="text-[9px] text-slate-300 ml-2 leading-snug flex-1">
            Slight decreasing trend in annual rainfall.
          </p>
        </div>

        {/* Extreme Events */}
        <div className="flex-1 flex items-center gap-3 pr-4 border-r border-white/10">
          <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center shrink-0">
            <AlertTriangle size={20} color="#ef4444" />
          </div>
          <div className="flex flex-col shrink-0">
            <span className="text-[10px] text-slate-400">Extreme Events</span>
            <span className="text-sm font-bold text-red-400 leading-none mt-1">3 major</span>
            <span className="text-[8px] text-slate-500 mt-1">(2010-2024)</span>
          </div>
          <p className="text-[9px] text-slate-300 ml-2 leading-snug flex-1">
            Heatwaves, heavy rainfall, and droughts observed.
          </p>
        </div>

        {/* Future Outlook */}
        <div className="flex-1 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0">
            <TrendingUp size={20} color="#06b6d4" />
          </div>
          <div className="flex flex-col shrink-0">
            <span className="text-[10px] text-slate-400">Future Outlook</span>
            <span className="text-sm font-bold text-emerald-400 leading-none mt-1">+1.5 °C</span>
            <span className="text-[8px] text-slate-500 mt-1">(by 2030)</span>
          </div>
          <p className="text-[9px] text-slate-300 ml-2 leading-snug flex-1">
            Projected increase in temperature for {district.name}.
          </p>
        </div>

      </div>
    </Card>
  );
};
