import React from 'react';
import type { DistrictClimateData } from '../../types/climate';
import { Thermometer, Droplets, Umbrella, Wind, Activity, Sun, MapPin } from 'lucide-react';

interface Props {
  district: DistrictClimateData;
}

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-[#0A1320] border border-white/5 rounded-md shadow-lg overflow-hidden flex flex-col ${className}`}>
    {children}
  </div>
);

const SectionTitle: React.FC<{ title: string; right?: React.ReactNode }> = ({ title, right }) => (
  <div className="flex items-center justify-between px-2 mb-1.5 shrink-0">
    <span className="font-sans text-[10px] font-bold tracking-wider text-[#C0D0DE] uppercase">
      {title}
    </span>
    {right}
  </div>
);

const IconCircle: React.FC<{ color: string; children: React.ReactNode; size?: number }> = ({ color, children, size = 24 }) => (
  <div
    className="shrink-0 flex items-center justify-center rounded-full border"
    style={{
      width: size, height: size, minWidth: size,
      background: `${color}15`,
      borderColor: `${color}30`,
    }}
  >
    {children}
  </div>
);

export const HistoricalRightSidebar: React.FC<Props> = ({ district }) => {
  return (
    <aside className="w-[300px] h-full shrink-0 flex flex-col gap-2 p-1.5 overflow-hidden box-border bg-[#030911] border-l border-white/5">
      
      {/* 1. DISTRICT DETAILS */}
      <div className="flex flex-col shrink-0">
        <SectionTitle 
          title={`DISTRICT DETAILS - ${district.name.toUpperCase()}`} 
          right={<button className="text-[9px] text-[#6A7BF3] hover:text-[#8b9af3]">View All</button>} 
        />
        <Card className="p-2">
          <div className="flex gap-3">
            {/* Thumbnail */}
            <div className="w-16 h-16 rounded overflow-hidden shrink-0 border border-white/10 relative">
              <img 
                src={`https://source.unsplash.com/100x100/?telangana,${district.name}`} 
                alt={district.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1620802051771-46823c914e91?w=100&h=100&fit=crop';
                }}
              />
            </div>
            {/* Info */}
            <div className="flex-1 flex flex-col justify-center">
              <h3 className="font-sans font-bold text-white text-sm leading-tight">{district.name}</h3>
              <div className="text-[9px] text-slate-400 mt-1 font-mono leading-tight">
                {district.center[1].toFixed(4)}° N, {district.center[0].toFixed(4)}° E<br/>
                Area: {Math.floor(Math.random() * 200 + 100)} km²
              </div>
              <div className="mt-1.5">
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-[#00f0ff] text-[8px] font-bold">
                  <MapPin size={8} /> Selected District
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* 2. CURRENT CLIMATE CONDITIONS */}
      <div className="flex flex-col flex-[1.5] min-h-0">
        <SectionTitle title="Current Climate Conditions" />
        <Card className="flex-1 min-h-0 p-2 flex flex-col justify-evenly">
          <div className="grid grid-cols-2 gap-2 h-full">
            {/* Temp */}
            <div className="flex items-center gap-2 p-1.5 rounded bg-white/[0.02] border border-white/5">
              <IconCircle color="#FF8C2A" size={24}><Thermometer size={12} color="#FF8C2A" /></IconCircle>
              <div className="flex flex-col justify-center">
                <span className="text-[9px] text-slate-400 leading-none mb-1">Temperature</span>
                <span className="text-sm font-bold text-white leading-none">{district.temperature.toFixed(1)} <span className="text-[9px] text-slate-400 font-normal">°C</span></span>
              </div>
            </div>
            {/* Humidity */}
            <div className="flex items-center gap-2 p-1.5 rounded bg-white/[0.02] border border-white/5">
              <IconCircle color="#4A9EFF" size={24}><Droplets size={12} color="#4A9EFF" /></IconCircle>
              <div className="flex flex-col justify-center">
                <span className="text-[9px] text-slate-400 leading-none mb-1">Humidity</span>
                <span className="text-sm font-bold text-white leading-none">{district.humidity} <span className="text-[9px] text-slate-400 font-normal">%</span></span>
              </div>
            </div>
            {/* Rainfall */}
            <div className="flex items-center gap-2 p-1.5 rounded bg-white/[0.02] border border-white/5">
              <IconCircle color="#22d3ee" size={24}><Umbrella size={12} color="#22d3ee" /></IconCircle>
              <div className="flex flex-col justify-center">
                <span className="text-[9px] text-slate-400 leading-none mb-1">Rainfall (24h)</span>
                <span className="text-sm font-bold text-white leading-none">{district.rainfall24h.toFixed(1)} <span className="text-[9px] text-slate-400 font-normal">mm</span></span>
              </div>
            </div>
            {/* Wind */}
            <div className="flex items-center gap-2 p-1.5 rounded bg-white/[0.02] border border-white/5">
              <IconCircle color="#2dd4bf" size={24}><Wind size={12} color="#2dd4bf" /></IconCircle>
              <div className="flex flex-col justify-center">
                <span className="text-[9px] text-slate-400 leading-none mb-1">Wind Speed</span>
                <span className="text-sm font-bold text-white leading-none">{district.windSpeed} <span className="text-[9px] text-slate-400 font-normal">km/h</span></span>
              </div>
            </div>
            {/* AQI */}
            <div className="flex items-center gap-2 p-1.5 rounded bg-white/[0.02] border border-white/5">
              <IconCircle color="#28D764" size={24}><Activity size={12} color="#28D764" /></IconCircle>
              <div className="flex flex-col justify-center">
                <span className="text-[9px] text-slate-400 leading-none mb-1">AQI</span>
                <span className="text-sm font-bold text-white leading-none">{district.aqi} <span className="text-[9px] text-[#28D764] font-normal">Good</span></span>
              </div>
            </div>
            {/* UV Index */}
            <div className="flex items-center gap-2 p-1.5 rounded bg-white/[0.02] border border-white/5">
              <IconCircle color="#FFC53A" size={24}><Sun size={12} color="#FFC53A" /></IconCircle>
              <div className="flex flex-col justify-center">
                <span className="text-[9px] text-slate-400 leading-none mb-1">UV Index</span>
                <span className="text-sm font-bold text-white leading-none">8 <span className="text-[9px] text-[#FFC53A] font-normal">High</span></span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* 3. HISTORICAL AVERAGE */}
      <div className="flex flex-col shrink-0">
        <SectionTitle title="Historical Average (2010 - 2024)" />
        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center">
              <span className="text-[9px] text-slate-400 mb-1">Temp.</span>
              <span className="text-sm font-bold text-white">{(district.temperature - 3.7).toFixed(1)} °C</span>
            </div>
            <div className="w-px h-6 bg-white/10" />
            <div className="flex flex-col items-center">
              <span className="text-[9px] text-slate-400 mb-1">Rainfall</span>
              <span className="text-sm font-bold text-white">812 mm</span>
            </div>
            <div className="w-px h-6 bg-white/10" />
            <div className="flex flex-col items-center">
              <span className="text-[9px] text-slate-400 mb-1">Humidity</span>
              <span className="text-sm font-bold text-white">67 %</span>
            </div>
          </div>
        </Card>
      </div>

    </aside>
  );
};
