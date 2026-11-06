import React, { useState, useMemo } from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  AlertTriangle,
  GitCompare,
  ScatterChart,
  Map,
  Building2,
  Sliders,
  Search,
  MapPin,
  Check,
  ChevronDown
} from 'lucide-react';
import { AnalyticsTab, TimeRangeOption, AnalysisParametersState } from '../../types/analytics';
import { DISTRICTS_LIST } from '../../data/telanganaGeo';

interface AnalyticsSidebarProps {
  activeTab: AnalyticsTab;
  onSelectTab: (tab: AnalyticsTab) => void;
  selectedDistrictId: string;
  onSelectDistrict: (id: string) => void;
  timeRange: TimeRangeOption;
  onSelectTimeRange: (tr: TimeRangeOption) => void;
  parameters: AnalysisParametersState;
  onToggleParameter: (param: keyof AnalysisParametersState) => void;
  onApplyParameters: () => void;
}

export const AnalyticsSidebar: React.FC<AnalyticsSidebarProps> = ({
  activeTab,
  onSelectTab,
  selectedDistrictId,
  onSelectDistrict,
  timeRange,
  onSelectTimeRange,
  parameters,
  onToggleParameter,
  onApplyParameters,
}) => {
  const [districtSearch, setDistrictSearch] = useState('');

  // Nav items with icons
  const NAV_ITEMS: { id: AnalyticsTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'overview', label: 'Climate Overview', icon: LayoutDashboard },
    { id: 'trend', label: 'Trend Analysis', icon: TrendingUp },
    { id: 'extreme', label: 'Extreme Events', icon: AlertTriangle },
    { id: 'comparative', label: 'Comparative Analysis', icon: GitCompare },
    { id: 'correlation', label: 'Correlation Analysis', icon: ScatterChart },
    { id: 'spatial', label: 'Spatial Insights', icon: Map },
    { id: 'sectoral', label: 'Sectoral Impact', icon: Building2 },
    { id: 'custom', label: 'Custom Analytics', icon: Sliders },
  ];

  // Filter districts
  const filteredDistricts = useMemo(() => {
    const list = DISTRICTS_LIST.map((d) => ({ id: d.id, name: d.name }));
    if (!districtSearch.trim()) return list;
    return list.filter((d) => d.name.toLowerCase().includes(districtSearch.toLowerCase().trim()));
  }, [districtSearch]);

  return (
    <div className="w-full h-full flex flex-col bg-[#030914] border-r border-[#00f0ff]/15 text-slate-200 select-none overflow-hidden">
      {/* ── 1. Top Section: Analytics Modes Navigation ── */}
      <div className="p-2 border-b border-white/5 shrink-0">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 block mb-1">
          ANALYTICS
        </span>
        <div className="space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all text-left cursor-pointer ${
                  isActive
                    ? 'bg-[#00f0ff]/15 border border-[#00f0ff]/40 text-[#00f0ff] shadow-[0_0_12px_rgba(0,240,255,0.2)] font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#00f0ff]' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 2. Middle Section: District Selector ── */}
      <div className="flex-1 min-h-0 flex flex-col p-2 border-b border-white/5">
        <div className="flex items-center justify-between px-2 mb-1 shrink-0">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            SELECT DISTRICT
          </span>
          <span className="text-[9px] font-mono text-[#00f0ff]/80">33 Districts</span>
        </div>

        {/* Search input */}
        <div className="relative mb-1.5 shrink-0">
          <input
            type="text"
            placeholder="Search district..."
            value={districtSearch}
            onChange={(e) => setDistrictSearch(e.target.value)}
            className="w-full bg-[#051428] border border-[#00f0ff]/25 rounded-md pl-6 pr-2 py-1 text-[10.5px] text-white placeholder-slate-500 focus:outline-none focus:border-[#00f0ff] transition-all"
          />
          <Search className="w-3 h-3 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Scrollable list of all 33 districts */}
        <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-0.5 custom-scrollbar">
          {/* All Districts Option */}
          <button
            onClick={() => onSelectDistrict('all')}
            className={`w-full flex items-center justify-between px-2 py-1 rounded text-[10.5px] transition-all text-left cursor-pointer ${
              selectedDistrictId === 'all'
                ? 'bg-[#00f0ff]/20 border border-[#00f0ff]/50 text-[#00f0ff] font-semibold shadow-[0_0_8px_rgba(0,240,255,0.25)]'
                : 'text-slate-300 hover:bg-white/5 border border-transparent'
            }`}
          >
            <div className="flex items-center gap-1.5 truncate">
              <MapPin className="w-3 h-3 shrink-0 text-[#00f0ff]" />
              <span className="truncate">All Districts (State Avg)</span>
            </div>
            {selectedDistrictId === 'all' && <Check className="w-3 h-3 shrink-0 text-[#00f0ff]" />}
          </button>

          {filteredDistricts.map((d) => {
            const isSelected = selectedDistrictId.toLowerCase() === d.id.toLowerCase() || selectedDistrictId.toLowerCase() === d.name.toLowerCase();
            return (
              <button
                key={d.id}
                onClick={() => onSelectDistrict(d.id)}
                className={`w-full flex items-center justify-between px-2 py-1 rounded text-[10.5px] transition-all text-left cursor-pointer ${
                  isSelected
                    ? 'bg-[#00f0ff]/20 border border-[#00f0ff]/50 text-[#00f0ff] font-semibold shadow-[0_0_8px_rgba(0,240,255,0.25)]'
                    : 'text-slate-300 hover:bg-white/5 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-1.5 truncate">
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isSelected ? 'bg-[#00f0ff]' : 'bg-slate-600'}`} />
                  <span className="truncate">{d.name}</span>
                </div>
                {isSelected && <Check className="w-3 h-3 shrink-0 text-[#00f0ff]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 3. Bottom Section: Time Range & Analysis Parameters ── */}
      <div className="p-2 shrink-0 space-y-2 bg-[#020710]/60">
        {/* Time range */}
        <div>
          <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            TIME RANGE
          </span>
          <div className="relative">
            <select
              value={timeRange}
              onChange={(e) => onSelectTimeRange(e.target.value as TimeRangeOption)}
              className="w-full appearance-none bg-[#051428] border border-[#00f0ff]/30 text-white text-[10.5px] rounded-md px-2.5 py-1 pr-6 hover:border-[#00f0ff]/60 focus:outline-none focus:border-[#00f0ff] cursor-pointer"
            >
              <option value="2015-2026">2015 - 2026</option>
              <option value="2010-2026">2010 - 2026</option>
              <option value="2020-2026">2020 - 2026</option>
              <option value="2010-2020">2010 - 2020</option>
            </select>
            <ChevronDown className="w-3 h-3 text-cyan-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Analysis parameters checklist */}
        <div>
          <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            ANALYSIS PARAMETERS
          </span>
          <div className="space-y-1 text-[10px]">
            <label className="flex items-center gap-1.5 text-slate-300 hover:text-white cursor-pointer">
              <input
                type="checkbox"
                checked={parameters.temperature}
                onChange={() => onToggleParameter('temperature')}
                className="w-3 h-3 accent-[#00f0ff] rounded bg-[#051428] border border-[#00f0ff]/40 cursor-pointer"
              />
              <span>Temperature (°C)</span>
            </label>

            <label className="flex items-center gap-1.5 text-slate-300 hover:text-white cursor-pointer">
              <input
                type="checkbox"
                checked={parameters.rainfall}
                onChange={() => onToggleParameter('rainfall')}
                className="w-3 h-3 accent-[#00f0ff] rounded bg-[#051428] border border-[#00f0ff]/40 cursor-pointer"
              />
              <span>Rainfall (mm)</span>
            </label>

            <label className="flex items-center gap-1.5 text-slate-300 hover:text-white cursor-pointer">
              <input
                type="checkbox"
                checked={parameters.humidity}
                onChange={() => onToggleParameter('humidity')}
                className="w-3 h-3 accent-[#00f0ff] rounded bg-[#051428] border border-[#00f0ff]/40 cursor-pointer"
              />
              <span>Humidity (%)</span>
            </label>

            <label className="flex items-center gap-1.5 text-slate-300 hover:text-white cursor-pointer">
              <input
                type="checkbox"
                checked={parameters.windSpeed}
                onChange={() => onToggleParameter('windSpeed')}
                className="w-3 h-3 accent-[#00f0ff] rounded bg-[#051428] border border-[#00f0ff]/40 cursor-pointer"
              />
              <span>Wind Speed (km/h)</span>
            </label>

            <label className="flex items-center gap-1.5 text-slate-300 hover:text-white cursor-pointer">
              <input
                type="checkbox"
                checked={parameters.aqi}
                onChange={() => onToggleParameter('aqi')}
                className="w-3 h-3 accent-[#00f0ff] rounded bg-[#051428] border border-[#00f0ff]/40 cursor-pointer"
              />
              <span>AQI</span>
            </label>

            <label className="flex items-center gap-1.5 text-slate-300 hover:text-white cursor-pointer">
              <input
                type="checkbox"
                checked={parameters.droughtIndex}
                onChange={() => onToggleParameter('droughtIndex')}
                className="w-3 h-3 accent-[#00f0ff] rounded bg-[#051428] border border-[#00f0ff]/40 cursor-pointer"
              />
              <span>Drought Index</span>
            </label>

            <label className="flex items-center gap-1.5 text-slate-300 hover:text-white cursor-pointer">
              <input
                type="checkbox"
                checked={parameters.floodRisk}
                onChange={() => onToggleParameter('floodRisk')}
                className="w-3 h-3 accent-[#00f0ff] rounded bg-[#051428] border border-[#00f0ff]/40 cursor-pointer"
              />
              <span>Flood Risk</span>
            </label>

            <label className="flex items-center gap-1.5 text-slate-300 hover:text-white cursor-pointer">
              <input
                type="checkbox"
                checked={parameters.ndvi}
                onChange={() => onToggleParameter('ndvi')}
                className="w-3 h-3 accent-[#00f0ff] rounded bg-[#051428] border border-[#00f0ff]/40 cursor-pointer"
              />
              <span>NDVI</span>
            </label>

            <label className="flex items-center gap-1.5 text-slate-300 hover:text-white cursor-pointer">
              <input
                type="checkbox"
                checked={parameters.waterBodies}
                onChange={() => onToggleParameter('waterBodies')}
                className="w-3 h-3 accent-[#00f0ff] rounded bg-[#051428] border border-[#00f0ff]/40 cursor-pointer"
              />
              <span>Water Bodies</span>
            </label>
          </div>
        </div>

        {/* Apply Analysis button */}
        <button
          onClick={onApplyParameters}
          className="w-full py-1 text-center bg-[#071d3a] hover:bg-[#0b2852] border border-[#00f0ff]/30 text-[#00f0ff] font-bold text-[10.5px] rounded shadow transition-all cursor-pointer"
        >
          Apply Analysis
        </button>
      </div>
    </div>
  );
};
