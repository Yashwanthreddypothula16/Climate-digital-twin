import React from 'react';
import { ScenarioSummaryData } from '../../types/simulation';
import { CloudRain, Droplets, Thermometer, Wind, Users, FileText, ChevronRight } from 'lucide-react';

interface Props {
  summary: ScenarioSummaryData;
  onViewReport: () => void;
}

export const ScenarioSummary: React.FC<Props> = ({ summary, onViewReport }) => {
  return (
    <div className="w-full h-full flex flex-col justify-between bg-[#051124] rounded-lg border border-[#00f0ff]/20 p-2.5 shadow-[0_0_15px_rgba(0,0,0,0.5)] select-none overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between pb-1 border-b border-white/10 shrink-0">
        <span className="font-sans text-[11px] font-bold text-slate-100 uppercase tracking-wider">
          SCENARIO SUMMARY
        </span>
      </div>

      {/* Scenario Headline Card */}
      <div className="flex items-center gap-2.5 p-2 rounded-md bg-white/[0.02] border border-[#00f0ff]/20 my-1 shrink-0">
        <div className="w-8 h-8 rounded-full bg-[#00f0ff]/15 border border-[#00f0ff]/30 flex items-center justify-center text-[#00f0ff] shrink-0 shadow-[0_0_10px_rgba(0,240,255,0.2)]">
          <CloudRain size={16} />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-[11px] font-bold text-white leading-tight truncate">
            {summary.scenarioName}
          </span>
          <span className="text-[8.5px] font-mono text-slate-400 leading-tight truncate">
            {summary.scenarioSubtitle}
          </span>
        </div>
      </div>

      {/* Metrics Grid (2x2) */}
      <div className="grid grid-cols-2 gap-1.5 shrink-0 my-1">
        {/* Metric 1 */}
        <div className="p-1.5 rounded bg-white/[0.02] border border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Droplets size={12} className="text-[#00f0ff]" />
            <span className="text-[8px] text-slate-400">Avg. Rainfall Increase</span>
          </div>
          <span className="text-xs font-mono font-bold text-[#00f0ff]">
            {summary.avgRainfallIncrease}
          </span>
        </div>

        {/* Metric 2 */}
        <div className="p-1.5 rounded bg-white/[0.02] border border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Thermometer size={12} className="text-amber-400" />
            <span className="text-[8px] text-slate-400">Max. Temp. Change</span>
          </div>
          <span className="text-xs font-mono font-bold text-amber-400">
            {summary.maxTempChange}
          </span>
        </div>

        {/* Metric 3 */}
        <div className="p-1.5 rounded bg-white/[0.02] border border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Wind size={12} className="text-rose-400" />
            <span className="text-[8px] text-slate-400">Wind Risk Districts</span>
          </div>
          <span className="text-xs font-mono font-bold text-rose-400">
            {summary.windRiskDistricts}
          </span>
        </div>

        {/* Metric 4 */}
        <div className="p-1.5 rounded bg-white/[0.02] border border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Users size={12} className="text-emerald-400" />
            <span className="text-[8px] text-slate-400">Affected Population</span>
          </div>
          <span className="text-xs font-mono font-bold text-white">
            {summary.affectedPopulation}
          </span>
        </div>
      </div>

      {/* Key Impacts List */}
      <div className="flex-1 min-h-0 flex flex-col justify-between gap-1 py-1">
        <div className="text-[8.5px] font-bold text-slate-400 uppercase tracking-wider">
          Key Impacts
        </div>
        <div className="space-y-1 overflow-y-auto custom-scrollbar pr-0.5">
          {summary.keyImpacts.map((impact, i) => (
            <div key={i} className="flex items-start gap-1.5 text-[8.5px] text-slate-300 leading-snug">
              <span className="text-[#00f0ff] mt-0.5">•</span>
              <span>{impact}</span>
            </div>
          ))}
        </div>
      </div>

      {/* View Detailed Report Button */}
      <button
        onClick={onViewReport}
        className="w-full py-1.5 rounded bg-[#07152B] hover:bg-[#00f0ff]/10 border border-white/15 hover:border-[#00f0ff]/40 text-slate-200 hover:text-white text-[10px] font-sans font-semibold flex items-center justify-center gap-1.5 transition-all shrink-0 mt-1"
      >
        <FileText size={12} className="text-[#00f0ff]" />
        <span>View Detailed Report</span>
        <ChevronRight size={11} className="text-slate-400" />
      </button>
    </div>
  );
};
