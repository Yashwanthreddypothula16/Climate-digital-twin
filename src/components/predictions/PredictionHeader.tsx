import React from 'react';
import { ForecastHorizon } from '../../types/predictions';
import { MapPin, Calendar, ChevronLeft, ChevronRight, Cpu, ShieldCheck } from 'lucide-react';

interface Props {
  districtName: string;
  coordinates: [number, number];
  forecastHorizon: ForecastHorizon;
  onSelectHorizon: (h: ForecastHorizon) => void;
  confidence: number;
}

export const PredictionHeader: React.FC<Props> = ({
  districtName,
  coordinates,
  forecastHorizon,
  onSelectHorizon,
  confidence,
}) => {
  const horizons: ForecastHorizon[] = ['daily', 'weekly', 'monthly', 'yearly'];

  return (
    <div className="shrink-0 h-[48px] px-3 flex items-center justify-between bg-[#040C16] border-b border-[#00f0ff]/15 select-none">
      {/* Left: District Title & Coordinates */}
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-7 h-7 rounded-md bg-[#00f0ff]/10 border border-[#00f0ff]/40 flex items-center justify-center text-[#00f0ff] shrink-0 shadow-[0_0_10px_rgba(0,240,255,0.2)]">
          <MapPin size={16} />
        </div>
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="font-sans font-bold text-xs tracking-wider text-white uppercase truncate">
              PREDICTIONS — {districtName.toUpperCase()} DISTRICT
            </h1>
            <span className="px-1.5 py-0.2 rounded bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-[#00f0ff] font-mono text-[9px] font-semibold uppercase">
              AI TWIN
            </span>
          </div>
          <div className="text-[9.5px] text-slate-400 font-mono tracking-tight truncate">
            Telangana State &nbsp;|&nbsp; {coordinates[0].toFixed(4)}° N, {coordinates[1].toFixed(4)}° E
          </div>
        </div>
      </div>

      {/* Center: Forecast Horizon Pills */}
      <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[#07152B] border border-white/10">
        {horizons.map((h) => {
          const isActive = forecastHorizon === h;
          return (
            <button
              key={h}
              onClick={() => onSelectHorizon(h)}
              className={`px-3 py-1 rounded-md text-[10.5px] font-sans font-semibold capitalize transition-all duration-150 ${
                isActive
                  ? 'bg-[#00f0ff]/15 text-[#00f0ff] border border-[#00f0ff]/50 shadow-[0_0_10px_rgba(0,240,255,0.25)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              {h}
            </button>
          );
        })}
      </div>

      {/* Right: Date selector, Model info & Confidence */}
      <div className="flex items-center gap-3">
        {/* Date Selector */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#07152B] border border-white/10 text-slate-200">
          <Calendar size={13} className="text-[#00f0ff]" />
          <span className="font-mono text-[10px] font-medium tracking-wide">31 Aug 2026</span>
          <div className="flex items-center text-slate-400 ml-1">
            <button className="hover:text-white p-0.5"><ChevronLeft size={12} /></button>
            <button className="hover:text-white p-0.5"><ChevronRight size={12} /></button>
          </div>
        </div>

        {/* Model Badge */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#00f0ff]/5 border border-[#00f0ff]/20">
          <Cpu size={12} className="text-[#00f0ff]" />
          <div className="flex flex-col leading-none">
            <span className="text-[8px] text-slate-400 uppercase font-mono">Model Architecture</span>
            <span className="text-[9.5px] text-white font-semibold font-mono">Hybrid AI / QML</span>
          </div>
        </div>

        {/* Confidence Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30">
          <ShieldCheck size={13} className="text-emerald-400" />
          <div className="flex flex-col leading-none">
            <span className="text-[8px] text-emerald-300 uppercase font-mono">Confidence</span>
            <span className="text-[9.5px] text-emerald-400 font-bold font-mono">{confidence}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
