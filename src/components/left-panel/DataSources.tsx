import React from 'react';
import type { DataSourceItem } from '../../types/climate';
import { Database } from 'lucide-react';

interface Props { sources: DataSourceItem[]; }

const SOURCES = [
  { id: 'imd', name: 'IMD', status: 'LIVE', color: '#22c55e' },
  { id: 'isro', name: 'ISRO', status: 'LIVE', color: '#22c55e' },
  { id: 'nasa', name: 'NASA', status: 'LIVE', color: '#22c55e' },
  { id: 'era5', name: 'ERA5', status: 'LIVE', color: '#22c55e' },
  { id: 's2', name: 'Sentinel-2', status: 'LIVE', color: '#22c55e' },
  { id: 'cgiar', name: 'CGIAR', status: 'LIVE', color: '#22c55e' },
  { id: 'cpcb', name: 'CPCB', status: 'LIVE', color: '#22c55e' },
  { id: 'sdma', name: 'Telangana SDMA', status: 'LIVE', color: '#22c55e' },
];

export const DataSources: React.FC<Props> = () => {
  return (
    <div className="h-full bg-[#06112c]/90 border border-[#00f0ff]/15 rounded-xl p-2.5 flex flex-col backdrop-blur-sm overflow-hidden">
      <div className="flex items-center justify-between mb-1.5 shrink-0">
        <div className="flex items-center gap-1.5">
          <Database className="w-3 h-3 text-[#00f0ff]" />
          <span className="text-[10px] font-bold tracking-widest text-white uppercase">Data Sources</span>
        </div>
        <span className="text-[9px] text-[#00f0ff] font-mono">8 NODES</span>
      </div>
      <div className="flex-1 min-h-0 space-y-0.5 overflow-hidden">
        {SOURCES.map(s => (
          <div key={s.id} className="flex items-center justify-between px-1.5 py-0.5 rounded hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: s.color, boxShadow: `0 0 5px ${s.color}` }} />
              <span className="text-[10px] text-slate-300 font-medium truncate">{s.name}</span>
            </div>
            <span className="text-[8px] font-bold px-1 py-px rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 tracking-wider shrink-0">{s.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
