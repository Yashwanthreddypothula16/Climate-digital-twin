import React from 'react';
import type { WhatIfSimulationState } from '../../types/climate';
import { RotateCcw, Play } from 'lucide-react';

interface Props {
  params: WhatIfSimulationState;
  onParamsChange: (p: WhatIfSimulationState) => void;
  onRunSimulation: () => void;
  onResetSimulation: () => void;
}

const SLIDERS = [
  { key: 'temperatureIncrease', label: 'Temperature Increase', unit: '°C', min: 0, max: 6, step: 0.5, color: '#f97316', fmt: (v: number) => `+${v.toFixed(1)}` },
  { key: 'rainfallChange',      label: 'Rainfall Change',      unit: '%',  min: -50, max: 50, step: 5, color: '#3b82f6', fmt: (v: number) => v >= 0 ? `+${v}` : `${v}` },
  { key: 'co2Emission',         label: 'CO₂ Emission',         unit: '%',  min: 0, max: 100, step: 5, color: '#a855f7', fmt: (v: number) => `+${v}` },
  { key: 'forestCoverChange',   label: 'Forest Cover Change',  unit: '%',  min: -60, max: 0, step: 5, color: '#3b82f6', fmt: (v: number) => `${v}` },
  { key: 'urbanizationIncrease',label: 'Urbanization Increase',unit: '%',  min: 0, max: 60, step: 5, color: '#f59e0b', fmt: (v: number) => `+${v}` },
  { key: 'populationGrowth',    label: 'Population Growth',    unit: '%',  min: 0, max: 80, step: 5, color: '#f59e0b', fmt: (v: number) => `+${v}` },
];

export const WhatIfSimulation: React.FC<Props> = ({
  params, onParamsChange, onRunSimulation, onResetSimulation
}) => {
  const update = (key: string, value: number) =>
    onParamsChange({ ...params, [key]: value });

  return (
    <div className="h-full bg-[#06112c]/90 border border-[#00f0ff]/15 rounded-xl p-2 flex flex-col backdrop-blur-sm overflow-hidden">
      <div className="flex items-center justify-between mb-1 shrink-0">
        <span className="text-[10px] font-bold tracking-widest text-white uppercase">What-If Simulation</span>
        <button onClick={onResetSimulation} className="flex items-center gap-0.5 text-[9px] text-[#00f0ff] hover:underline">
          <RotateCcw className="w-2.5 h-2.5" /> Reset
        </button>
      </div>

      <div className="flex-1 min-h-0 flex flex-col justify-between gap-0.5 overflow-hidden">
        {SLIDERS.map(s => {
          const val = (params as any)[s.key] as number;
          const pct = ((val - s.min) / (s.max - s.min)) * 100;
          return (
            <div key={s.key} className="flex items-center gap-1">
              <div className="text-[8px] text-slate-400 w-24 shrink-0 truncate">{s.label}</div>
              <div className="flex-1 relative h-1.5 bg-white/8 rounded-full">
                <div
                  className="absolute left-0 top-0 h-full rounded-full"
                  style={{ width: `${Math.max(0, Math.min(100, pct))}%`, background: '#3b82f6', opacity: 0.8 }}
                />
                <input
                  type="range"
                  min={s.min} max={s.max} step={s.step}
                  value={val}
                  onChange={e => update(s.key, parseFloat(e.target.value))}
                  className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-2 rounded-full border border-white"
                  style={{ left: `${Math.max(0, Math.min(100, pct))}%`, background: '#3b82f6', boxShadow: `0 0 5px #3b82f6` }}
                />
              </div>
              <div className="text-[8px] font-bold w-10 shrink-0 text-right" style={{ color: '#00f0ff' }}>
                {s.fmt(val)} {s.unit}
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={onRunSimulation}
        className="mt-1 mb-1 shrink-0 w-full py-1 rounded-lg flex items-center justify-center gap-1.5 text-[11px] font-bold text-[#071330] transition-all active:scale-95"
        style={{
          background: 'linear-gradient(135deg, #00f0ff 0%, #0080ff 100%)',
          boxShadow: '0 0 12px rgba(0,240,255,0.4)',
        }}
      >
        <Play className="w-3 h-3" />
        RUN SIMULATION
      </button>
    </div>
  );
};
