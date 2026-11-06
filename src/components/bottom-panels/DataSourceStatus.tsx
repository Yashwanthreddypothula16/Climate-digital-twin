import React from 'react';
import { Radio, Globe, Satellite, Cpu, Layers, ShieldCheck } from 'lucide-react';

interface SourceStatus {
  id: string;
  name: string;
  sub: string;
  icon: React.ReactNode;
  status: 'Live' | 'Syncing' | 'Offline';
  color: string;
}

const SOURCES: SourceStatus[] = [
  { id: 'imd', name: 'IMD', sub: 'AWS Network', icon: <Radio size={16} />, status: 'Live', color: '#00f0ff' },
  { id: 'isro', name: 'ISRO', sub: 'MOSDAC / Bhuvan', icon: <Satellite size={16} />, status: 'Live', color: '#00f0ff' },
  { id: 'nasa', name: 'NASA', sub: 'POWER / GPM', icon: <Globe size={16} />, status: 'Live', color: '#00f0ff' },
  { id: 'era5', name: 'ERA5', sub: 'ECMWF Reanalysis', icon: <Cpu size={16} />, status: 'Live', color: '#00f0ff' },
  { id: 's2', name: 'Sentinel-2', sub: 'Copernicus MSI', icon: <Layers size={16} />, status: 'Live', color: '#00f0ff' },
  { id: 'sdma', name: 'Telangana SDMA', sub: 'State Telemetry', icon: <ShieldCheck size={16} />, status: 'Live', color: '#eab308' },
];

export const DataSourceStatus: React.FC = () => {
  return (
    <div className="h-full bg-[#06112c]/90 border border-[#00f0ff]/15 rounded-xl p-2.5 flex flex-col backdrop-blur-sm overflow-hidden select-none">
      <div className="flex items-center justify-between mb-1.5 shrink-0">
        <span className="text-[10px] font-bold tracking-widest text-white uppercase">
          DATA SOURCE STATUS
        </span>
        <span className="text-[9px] text-emerald-400 font-semibold flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          ALL ACTIVE
        </span>
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-6 gap-1.5 items-center">
        {SOURCES.map((s) => (
          <div
            key={s.id}
            className="flex flex-col items-center justify-center p-1 rounded-lg bg-white/[0.02] border border-white/5 hover:border-[#00f0ff]/30 transition-colors h-full"
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center mb-1 shrink-0"
              style={{
                background: 'rgba(0, 240, 255, 0.08)',
                border: '1px solid rgba(0, 240, 255, 0.25)',
                color: s.color,
              }}
            >
              {s.icon}
            </div>
            <span className="text-[9px] font-bold text-slate-200 text-center leading-tight truncate w-full">
              {s.name}
            </span>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="w-1 h-1 rounded-full bg-emerald-400" />
              <span className="text-[8px] text-emerald-400 font-medium">{s.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
