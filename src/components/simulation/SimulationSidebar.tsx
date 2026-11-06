import React, { useState } from 'react';
import { SimulationScenario, RecentSimulationItem } from '../../types/simulation';
import { RECENT_SIMULATIONS_LIST } from '../../services/simulationService';
import {
  Sliders,
  HelpCircle,
  BarChart3,
  ShieldCheck,
  BookmarkCheck,
  Sun,
  Thermometer,
  CloudRain,
  Flame,
  Building2,
  Plus,
  CheckCircle2,
} from 'lucide-react';

interface Props {
  activeScenario: SimulationScenario;
  onSelectScenario: (s: SimulationScenario) => void;
  onSelectDistrict: (d: string) => void;
}

export const SimulationSidebar: React.FC<Props> = ({
  activeScenario,
  onSelectScenario,
  onSelectDistrict,
}) => {
  const [activeNav, setActiveNav] = useState('builder');

  const navItems = [
    { id: 'builder', label: 'Scenario Builder', icon: Sliders },
    { id: 'what_if', label: 'What-If Analysis', icon: HelpCircle },
    { id: 'impact', label: 'Impact Assessment', icon: BarChart3 },
    { id: 'resilience', label: 'Climate Resilience', icon: ShieldCheck },
    { id: 'save', label: 'Save & Compare', icon: BookmarkCheck },
  ];

  const quickScenarios: { id: SimulationScenario; name: string; desc: string; icon: any; color: string }[] = [
    {
      id: 'normal',
      name: 'Normal Conditions',
      desc: 'Baseline climate scenario',
      icon: Sun,
      color: '#eab308',
    },
    {
      id: 'heat_wave',
      name: 'Heat Wave',
      desc: 'Extreme temperature scenario',
      icon: Thermometer,
      color: '#ef4444',
    },
    {
      id: 'heavy_rainfall',
      name: 'Heavy Rainfall',
      desc: 'High precipitation scenario',
      icon: CloudRain,
      color: '#00f0ff',
    },
    {
      id: 'drought',
      name: 'Drought',
      desc: 'Low rainfall scenario',
      icon: Flame,
      color: '#f97316',
    },
    {
      id: 'urban_heat_island',
      name: 'Urban Heat Island',
      desc: 'Urban temperature increase',
      icon: Building2,
      color: '#38bdf8',
    },
  ];

  return (
    <aside className="w-full h-full flex flex-col bg-[#020710] border-r border-[#00f0ff]/15 select-none overflow-hidden">
      {/* 1. Simulation Navigation */}
      <div className="p-2 border-b border-white/5 space-y-0.5 shrink-0">
        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1">
          SIMULATION
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeNav === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-[11px] font-sans transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-[#00f0ff]/20 to-[#00f0ff]/5 text-[#00f0ff] border border-[#00f0ff]/40 shadow-[0_0_12px_rgba(0,240,255,0.2)] font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <Icon size={14} className={isActive ? 'text-[#00f0ff]' : 'text-slate-400'} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* 2. Quick Scenarios */}
      <div className="p-2 border-b border-white/5 flex flex-col gap-1 shrink-0">
        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider px-1 mb-0.5">
          QUICK SCENARIOS
        </div>
        <div className="space-y-1">
          {quickScenarios.map((sc) => {
            const Icon = sc.icon;
            const isSelected = activeScenario === sc.id;
            return (
              <button
                key={sc.id}
                onClick={() => onSelectScenario(sc.id)}
                className={`w-full flex items-center gap-2.5 p-1.5 rounded-md text-left transition-all ${
                  isSelected
                    ? 'bg-[#00f0ff]/15 border border-[#00f0ff]/50 shadow-[0_0_10px_rgba(0,240,255,0.25)]'
                    : 'bg-white/[0.02] border border-white/5 hover:bg-white/5 hover:border-white/10'
                }`}
              >
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 border"
                  style={{
                    backgroundColor: `${sc.color}15`,
                    borderColor: `${sc.color}40`,
                  }}
                >
                  <Icon size={13} style={{ color: sc.color }} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className={`text-[10.5px] font-bold truncate ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                    {sc.name}
                  </span>
                  <span className="text-[8px] text-slate-400 truncate">
                    {sc.desc}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Recent Simulations */}
      <div className="flex-1 min-h-0 p-2 overflow-y-auto custom-scrollbar flex flex-col gap-1">
        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider px-1 mb-0.5">
          RECENT SIMULATIONS
        </div>
        <div className="space-y-1">
          {RECENT_SIMULATIONS_LIST.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                onSelectScenario(item.scenario);
                onSelectDistrict(item.district);
              }}
              className="p-1.5 rounded-md bg-white/[0.02] border border-white/5 hover:bg-white/5 hover:border-[#00f0ff]/30 cursor-pointer transition-all"
            >
              <div className="flex items-center gap-1.5 text-[9.5px] font-bold text-white truncate">
                <CloudRain size={11} className="text-[#00f0ff] shrink-0" />
                <span className="truncate">{item.title}</span>
              </div>
              <div className="flex items-center justify-between mt-1 text-[8px] text-slate-400 font-mono">
                <span>{item.date}</span>
                <span className="text-emerald-400 font-semibold">{item.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Bottom Button: + New Simulation */}
      <div className="p-2 border-t border-white/5 bg-[#030a17]/50 shrink-0">
        <button
          onClick={() => onSelectScenario('normal')}
          className="w-full py-1.5 rounded-md bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 border border-[#00f0ff]/30 text-[#00f0ff] text-[10px] font-sans font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm"
        >
          <Plus size={13} />
          <span>New Simulation</span>
        </button>
      </div>
    </aside>
  );
};
