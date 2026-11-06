import React from 'react';
import type { DistrictClimateData } from '../../types/climate';
import { Sparkles, ExternalLink } from 'lucide-react';

interface Props {
  district: DistrictClimateData | null | undefined;
  onViewAll?: () => void;
}

// Circular confidence gauge (SVG)
const ConfGauge: React.FC<{ pct: number; color: string }> = ({ pct, color }) => {
  const R = 14, C = 2 * Math.PI * R;
  const offset = C - (pct / 100) * C;
  return (
    <div className="relative w-8 h-8 shrink-0">
      <svg width="32" height="32" viewBox="0 0 40 40" className="-rotate-90">
        <circle cx="20" cy="20" r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
        <circle
          cx="20" cy="20" r={R} fill="none"
          stroke={color} strokeWidth="4"
          strokeDasharray={C} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 2px ${color})` }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[9px] font-bold" style={{ color }}>{pct}%</span>
      </div>
    </div>
  );
};

export const AiPredictions: React.FC<Props> = ({ district, onViewAll }) => {
  const p = district?.predictions2030;
  const predictions = [
    {
      label: 'Avg. Temperature',
      value: p ? `${p.tempDelta >= 0 ? '+' : ''}${p.tempDelta} °C` : '+1.8 °C',
      sub: 'from 2024 baseline',
      color: '#ff6b35',
      conf: p?.tempConfidence ?? 94
    },
    {
      label: 'Total Rainfall',
      value: p ? `${p.rainDelta >= 0 ? '+' : ''}${p.rainDelta} %` : '-12 %',
      sub: 'from 2024 baseline',
      color: '#00f0ff',
      conf: p?.rainConfidence ?? 91
    },
    {
      label: 'Extreme Rainfall Days',
      value: p ? `${p.extremeRainDelta >= 0 ? '+' : ''}${p.extremeRainDelta} %` : '+18 %',
      sub: 'from 2024 baseline',
      color: '#ff6b35',
      conf: p?.extremeRainConfidence ?? 88
    },
    {
      label: 'Drought Severity',
      value: p ? `${p.droughtDelta >= 0 ? '+' : ''}${p.droughtDelta} %` : '+23 %',
      sub: 'from 2024 baseline',
      color: '#f59e0b',
      conf: p?.droughtConfidence ?? 89
    },
  ];

  return (
    <div className="h-full bg-[#06112c]/90 border border-[#00f0ff]/15 rounded-xl p-2 flex flex-col backdrop-blur-sm overflow-hidden">
      <div className="flex items-center justify-between mb-1 shrink-0">
        <div className="flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#00f0ff]" />
          <span className="text-[10px] font-bold tracking-widest text-white uppercase">AI Predictions</span>
          <span className="text-[10px] text-[#00f0ff] font-mono">(2030)</span>
        </div>
        <button onClick={onViewAll} className="flex items-center gap-0.5 text-[9px] text-[#00f0ff] hover:underline">
          View All <ExternalLink className="w-2.5 h-2.5" />
        </button>
      </div>

      <div className="flex-1 min-h-0 flex flex-col justify-between gap-1 overflow-hidden mt-2">
        {predictions.map(pred => (
          <div key={pred.label} className="flex items-center justify-between px-2 py-1.5 rounded-lg bg-[#09152a] border border-[#00f0ff]/10 hover:border-[#00f0ff]/20 transition-colors">
            <div className="min-w-0 pr-1">
              <div className="text-[9px] text-slate-400 leading-tight whitespace-nowrap overflow-hidden text-ellipsis">{pred.label}</div>
              <div className="text-[11px] font-black leading-tight mt-0.5 whitespace-nowrap" style={{ color: pred.color }}>
                {pred.value}
              </div>
              <div className="text-[8px] text-slate-500 whitespace-nowrap overflow-hidden text-ellipsis">{pred.sub}</div>
            </div>
            <div className="flex flex-col items-center ml-1 shrink-0">
              <ConfGauge pct={pred.conf} color="#00f0ff" />
              <div className="text-[7px] text-slate-400 mt-0.5">Confidence</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
