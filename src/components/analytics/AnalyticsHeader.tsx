import React from 'react';
import { Activity, Download, ChevronDown, Check } from 'lucide-react';
import { AnalyticsTab, TimeRangeOption } from '../../types/analytics';

interface AnalyticsHeaderProps {
  activeTab: AnalyticsTab;
  onSelectTab: (tab: AnalyticsTab) => void;
  timeRange: TimeRangeOption;
  onSelectTimeRange: (range: TimeRangeOption) => void;
  visualizationMode: string;
  onSelectVisualization: (v: string) => void;
  onExport: () => void;
}

const TAB_LABELS: Record<AnalyticsTab, string> = {
  overview: 'Climate Overview',
  trend: 'Trend Analysis',
  extreme: 'Extreme Events',
  comparative: 'Comparative Analysis',
  correlation: 'Correlation Analysis',
  spatial: 'Spatial Insights',
  sectoral: 'Sectoral Impact',
  custom: 'Custom Analytics',
};

export const AnalyticsHeader: React.FC<AnalyticsHeaderProps> = ({
  activeTab,
  onSelectTab,
  timeRange,
  onSelectTimeRange,
  visualizationMode,
  onSelectVisualization,
  onExport,
}) => {
  return (
    <div className="shrink-0 h-[52px] px-3 bg-[#030914] border-b border-[#00f0ff]/15 flex items-center justify-between gap-4 select-none">
      {/* ── Left Title with Pulse Icon ── */}
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-8 h-8 rounded-lg bg-[#00f0ff]/10 border border-[#00f0ff]/40 flex items-center justify-center text-[#00f0ff] shadow-[0_0_12px_rgba(0,240,255,0.25)] shrink-0">
          <Activity className="w-4 h-4 animate-pulse" />
        </div>
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-[14px] font-bold text-white tracking-wide leading-none font-sans">
              CLIMATE ANALYTICS
            </h1>
            <span className="px-1.5 py-0.5 rounded text-[8.5px] font-bold uppercase tracking-wider bg-[#00f0ff]/15 border border-[#00f0ff]/40 text-[#00f0ff]">
              INTERPRETATIVE ANALYSIS
            </span>
          </div>
          <span className="text-[10px] text-slate-400 truncate mt-0.5 font-normal">
            Interpreting climate records through trends, correlations, district comparisons, spatial patterns, and risk analysis
          </span>
        </div>
      </div>

      {/* ── Right Controls ── */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Analysis Type Dropdown */}
        <div className="flex flex-col">
          <label className="text-[8.5px] uppercase tracking-wider text-slate-400 font-medium -mb-0.5">
            Analysis Type
          </label>
          <div className="relative">
            <select
              value={activeTab}
              onChange={(e) => onSelectTab(e.target.value as AnalyticsTab)}
              className="appearance-none bg-[#051428] border border-[#00f0ff]/30 text-white text-[11px] font-medium rounded-md px-2.5 py-1 pr-6 hover:border-[#00f0ff]/60 focus:outline-none focus:border-[#00f0ff] cursor-pointer transition-all"
            >
              <option value="overview">Climate Overview</option>
              <option value="trend">Trend Analysis</option>
              <option value="extreme">Extreme Events</option>
              <option value="comparative">Comparative Analysis</option>
              <option value="correlation">Correlation Analysis</option>
              <option value="spatial">Spatial Insights</option>
              <option value="sectoral">Sectoral Impact</option>
              <option value="custom">Custom Analytics</option>
            </select>
            <ChevronDown className="w-3 h-3 text-cyan-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Time Period Dropdown */}
        <div className="flex flex-col">
          <label className="text-[8.5px] uppercase tracking-wider text-slate-400 font-medium -mb-0.5">
            Time Period
          </label>
          <div className="relative">
            <select
              value={timeRange}
              onChange={(e) => onSelectTimeRange(e.target.value as TimeRangeOption)}
              className="appearance-none bg-[#051428] border border-[#00f0ff]/30 text-white text-[11px] font-medium rounded-md px-2.5 py-1 pr-6 hover:border-[#00f0ff]/60 focus:outline-none focus:border-[#00f0ff] cursor-pointer transition-all"
            >
              <option value="2015-2026">2015 - 2026</option>
              <option value="2010-2026">2010 - 2026</option>
              <option value="2020-2026">2020 - 2026</option>
              <option value="2010-2020">2010 - 2020</option>
            </select>
            <ChevronDown className="w-3 h-3 text-cyan-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Visualization Dropdown */}
        <div className="flex flex-col">
          <label className="text-[8.5px] uppercase tracking-wider text-slate-400 font-medium -mb-0.5">
            Visualization
          </label>
          <div className="relative">
            <select
              value={visualizationMode}
              onChange={(e) => onSelectVisualization(e.target.value)}
              className="appearance-none bg-[#051428] border border-[#00f0ff]/30 text-white text-[11px] font-medium rounded-md px-2.5 py-1 pr-6 hover:border-[#00f0ff]/60 focus:outline-none focus:border-[#00f0ff] cursor-pointer transition-all"
            >
              <option value="key_indicators">Key Indicators</option>
              <option value="multi_temporal">Multi-Temporal View</option>
              <option value="risk_matrix">Risk & Exposure</option>
              <option value="sectoral_exposure">Sectoral Impact</option>
            </select>
            <ChevronDown className="w-3 h-3 text-cyan-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Export Report Button */}
        <button
          onClick={onExport}
          className="mt-3.5 flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-[#00b4d8] to-[#00f0ff] hover:from-[#0096c7] hover:to-[#00d4ff] text-[#030d1d] font-bold text-[11px] rounded-md shadow-[0_0_12px_rgba(0,240,255,0.35)] transition-all cursor-pointer shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Report</span>
        </button>
      </div>
    </div>
  );
};
