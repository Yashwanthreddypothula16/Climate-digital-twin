import React, { useState } from 'react';
import { DISTRICTS_LIST } from '../../data/telanganaGeo';
import {
  LayoutDashboard,
  Map,
  FileSpreadsheet,
  TrendingUp,
  Cpu,
  FileText,
  Search,
  MapPin,
  Leaf,
  Radio,
  CheckCircle2,
} from 'lucide-react';

interface Props {
  selectedDistrictId: string;
  onSelectDistrict: (id: string) => void;
  onNavigateTab?: (tab: string) => void;
}

export const PredictionLeftSidebar: React.FC<Props> = ({
  selectedDistrictId,
  onSelectDistrict,
  onNavigateTab,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDistricts = DISTRICTS_LIST.filter((d) =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const navLinks = [
    { name: 'Overview', icon: LayoutDashboard, tab: 'DASHBOARD' },
    { name: 'Map View', icon: Map, tab: 'DASHBOARD' },
    { name: 'District Details', icon: FileSpreadsheet, tab: 'HISTORICAL' },
    { name: 'Predictions', icon: TrendingUp, tab: 'PREDICTIONS', active: true },
    { name: 'What-if Simulation', icon: Cpu, tab: 'SIMULATION' },
    { name: 'Reports', icon: FileText, tab: 'REPORTS' },
  ];

  const dataSources = [
    { name: 'IMD India', status: 'LIVE' },
    { name: 'ISRO MOSDAC', status: 'LIVE' },
    { name: 'NASA Giovanni', status: 'LIVE' },
    { name: 'ECMWF ERA5', status: 'LIVE' },
    { name: 'Telangana SDMA', status: 'LIVE' },
  ];

  return (
    <aside className="w-full h-full flex flex-col bg-[#020710] border-r border-[#00f0ff]/15 select-none overflow-hidden">
      {/* 1. Quick Navigation links matching screenshot */}
      <div className="p-2 space-y-0.5 border-b border-white/5 shrink-0">
        {navLinks.map((item) => {
          const Icon = item.icon;
          const isActive = item.active;
          return (
            <button
              key={item.name}
              onClick={() => onNavigateTab && onNavigateTab(item.tab)}
              className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-[11px] font-sans font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-[#00f0ff]/20 to-[#00f0ff]/5 text-[#00f0ff] border border-[#00f0ff]/40 shadow-[0_0_12px_rgba(0,240,255,0.2)] font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <Icon size={14} className={isActive ? 'text-[#00f0ff]' : 'text-slate-400'} />
              <span>{item.name}</span>
            </button>
          );
        })}
      </div>

      {/* 2. SELECT DISTRICT SEARCH & LIST (33 Districts) */}
      <div className="flex-1 min-h-0 flex flex-col p-2 overflow-hidden">
        <div className="text-[10px] font-bold tracking-wider text-slate-300 uppercase mb-1.5 flex items-center justify-between">
          <span>SELECT DISTRICT</span>
          <span className="text-[8.5px] font-mono text-[#00f0ff]">33 TOTAL</span>
        </div>

        {/* Search Input */}
        <div className="relative mb-2 shrink-0">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search district..."
            className="w-full pl-8 pr-2 py-1 rounded bg-[#061426] border border-white/10 text-[10px] text-white placeholder-slate-500 focus:outline-none focus:border-[#00f0ff]/60 focus:ring-1 focus:ring-[#00f0ff]/40 transition-all font-sans"
          />
        </div>

        {/* Districts Scrollable List */}
        <div className="flex-1 overflow-y-auto space-y-0.5 pr-1 custom-scrollbar">
          {filteredDistricts.map((d) => {
            const isSelected =
              d.name.toLowerCase() === selectedDistrictId.toLowerCase() ||
              d.id.toLowerCase() === selectedDistrictId.toLowerCase();

            return (
              <button
                key={d.id}
                onClick={() => onSelectDistrict(d.name)}
                className={`w-full flex items-center gap-2 px-2 py-1 rounded text-left text-[10.5px] transition-all ${
                  isSelected
                    ? 'bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/50 shadow-[0_0_8px_rgba(0,240,255,0.25)] font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <MapPin size={11} className={isSelected ? 'text-[#00f0ff]' : 'text-slate-500'} />
                <span className="truncate">{d.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Live Data Sources */}
      <div className="p-2 border-t border-white/5 bg-[#030a17]/50 shrink-0">
        <div className="flex items-center justify-between text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
          <span>DATA SOURCES</span>
          <span className="flex items-center gap-1 text-[8px] text-emerald-400 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            ONLINE
          </span>
        </div>
        <div className="grid grid-cols-2 gap-1 text-[8.5px]">
          {dataSources.map((s) => (
            <div
              key={s.name}
              className="flex items-center justify-between px-1.5 py-0.5 rounded bg-white/[0.02] border border-white/5 text-slate-400"
            >
              <span className="truncate">{s.name}</span>
              <span className="text-[7.5px] text-emerald-400 font-mono">●</span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Brand Quote Card (Bottom left of screenshot) */}
      <div className="p-2.5 border-t border-[#00f0ff]/15 bg-gradient-to-br from-[#061830] to-[#030c1c] shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 shadow-[0_0_10px_rgba(52,211,153,0.2)]">
            <Leaf size={16} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold text-slate-200 leading-snug">
              Smarter predictions
            </span>
            <span className="text-[9px] text-[#00f0ff] font-medium leading-snug">
              for a safer tomorrow
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
