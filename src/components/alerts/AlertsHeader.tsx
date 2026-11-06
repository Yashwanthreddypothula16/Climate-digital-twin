import React from 'react';
import { Radio, Plus, ChevronDown } from 'lucide-react';
import { AlertCategory, AlertSeverityFilter, TimeRangeOption } from '../../types/alerts';

interface AlertsHeaderProps {
  selectedCategory: AlertCategory;
  onSelectCategory: (cat: AlertCategory) => void;
  selectedSeverity: AlertSeverityFilter;
  onSelectSeverity: (sev: AlertSeverityFilter) => void;
  selectedTimeRange: TimeRangeOption;
  onSelectTimeRange: (range: TimeRangeOption) => void;
  onOpenIssueModal: () => void;
}

export const AlertsHeader: React.FC<AlertsHeaderProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedSeverity,
  onSelectSeverity,
  selectedTimeRange,
  onSelectTimeRange,
  onOpenIssueModal,
}) => {
  return (
    <div className="h-[42px] px-3 flex items-center justify-between border-b border-[#00f0ff]/15 bg-[#030914] shrink-0">
      {/* Title & Subtitle */}
      <div className="flex items-center space-x-2.5 min-w-0 pr-3">
        <div className="w-7 h-7 rounded-full bg-[#00f0ff]/10 border border-[#00f0ff]/40 flex items-center justify-center text-[#00f0ff] shrink-0 shadow-[0_0_10px_rgba(0,240,255,0.2)]">
          <Radio className="w-3.5 h-3.5 animate-pulse text-[#00f0ff]" />
        </div>
        <div className="min-w-0">
          <h1 className="text-white text-[12.5px] font-bold tracking-wider font-mono uppercase whitespace-nowrap">
            CLIMATE ALERT MONITORING CENTER
          </h1>
          <p className="text-[9.5px] text-[#7E8FA0] truncate leading-none mt-0.5">
            Real-time early warning intelligence and district-level risk monitoring across Telangana
          </p>
        </div>
      </div>

      {/* Right Filters & Issue Alert Button */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Dropdown 1: Alert Types */}
        <div className="relative">
          <select
            value={selectedCategory}
            onChange={(e) => onSelectCategory(e.target.value as AlertCategory)}
            className="appearance-none bg-[#071322] border border-[#00f0ff]/20 text-slate-200 text-[10.5px] font-medium rounded px-2.5 py-1 pr-6 cursor-pointer hover:border-[#00f0ff]/40 focus:outline-none focus:border-[#00f0ff]"
          >
            <option value="all">All Alert Types</option>
            <option value="heatwave">Heatwave</option>
            <option value="heavy_rainfall">Heavy Rainfall</option>
            <option value="flood">Flood</option>
            <option value="drought">Drought</option>
            <option value="thunderstorm">Thunderstorm</option>
            <option value="wind">Wind</option>
            <option value="air_quality">Air Quality</option>
          </select>
          <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Dropdown 2: Severities */}
        <div className="relative">
          <select
            value={selectedSeverity}
            onChange={(e) => onSelectSeverity(e.target.value as AlertSeverityFilter)}
            className="appearance-none bg-[#071322] border border-[#00f0ff]/20 text-slate-200 text-[10.5px] font-medium rounded px-2.5 py-1 pr-6 cursor-pointer hover:border-[#00f0ff]/40 focus:outline-none focus:border-[#00f0ff]"
          >
            <option value="all">All Severities</option>
            <option value="severe">Severe</option>
            <option value="moderate">Moderate</option>
            <option value="advisory">Advisory</option>
            <option value="resolved">Resolved</option>
          </select>
          <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Dropdown 3: Time Range */}
        <div className="relative">
          <select
            value={selectedTimeRange}
            onChange={(e) => onSelectTimeRange(e.target.value as TimeRangeOption)}
            className="appearance-none bg-[#071322] border border-[#00f0ff]/20 text-slate-200 text-[10.5px] font-medium rounded px-2.5 py-1 pr-6 cursor-pointer hover:border-[#00f0ff]/40 focus:outline-none focus:border-[#00f0ff]"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="custom">Custom Range</option>
          </select>
          <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* + ISSUE ALERT BUTTON */}
        <button
          onClick={onOpenIssueModal}
          className="flex items-center space-x-1.5 px-3 py-1 rounded-md bg-gradient-to-r from-[#00d9f5] to-[#00f0ff] hover:from-[#00c5df] text-[#020810] font-bold text-[11px] tracking-wide shadow-[0_0_12px_rgba(0,240,255,0.35)] transition-all active:scale-95 cursor-pointer whitespace-nowrap shrink-0"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span>ISSUE ALERT</span>
        </button>
      </div>
    </div>
  );
};
