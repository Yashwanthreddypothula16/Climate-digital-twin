import React from 'react';
import { DistrictPredictionData, ForecastHorizon } from '../../types/predictions';
import {
  Sun,
  Cloud,
  CloudRain,
  CloudSun,
  Wind,
  Droplets,
  Activity,
  Eye,
  Thermometer,
  ShieldAlert,
} from 'lucide-react';

interface Props {
  data: DistrictPredictionData;
  forecastHorizon: ForecastHorizon;
  currentLiveTemp?: number | null;
  isLiveLoading?: boolean;
}

export const PredictionSummaryCard: React.FC<Props> = ({
  data,
  forecastHorizon,
  currentLiveTemp,
  isLiveLoading
}) => {
  const { current, predicted, hourly } = data;

  // Resolve current live temperature with loading and unavailable handling
  const liveTemp = currentLiveTemp !== undefined && currentLiveTemp !== null
    ? currentLiveTemp
    : (current?.temp !== undefined && current?.temp !== null ? current.temp : null);

  const currentTempText = isLiveLoading
    ? 'Cur: ...'
    : (liveTemp !== null && !isNaN(liveTemp))
    ? `Cur: ${Number(liveTemp).toFixed(1)}°C`
    : 'Cur: --°C';

  return (
    <div className="w-full h-full flex flex-col gap-1.5 select-none overflow-hidden">
      {/* 1. Main Weather / Forecast Headline Panel */}
      <div className="flex-1 min-h-0 bg-[#051124] rounded-lg border border-[#00f0ff]/20 p-2.5 flex flex-col justify-between shadow-[0_0_15px_rgba(0,0,0,0.5)]">
        {/* Title */}
        <div className="flex items-center justify-between">
          <span className="font-sans text-[11px] font-bold text-slate-200 tracking-wider uppercase">
            {data.districtName} — Predicted Climate ({forecastHorizon.toUpperCase()})
          </span>
          <span className="text-[9px] font-mono text-[#00f0ff] bg-[#00f0ff]/10 border border-[#00f0ff]/30 px-1.5 py-0.5 rounded">
            Conf: {data.confidence.temperature}%
          </span>
        </div>

        {/* Big Temp & Current Weather Overview */}
        <div className="flex items-center justify-between px-2 my-1">
          {/* Big Icon + Condition */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <CloudSun size={48} className="text-[#FFC53A] drop-shadow-[0_0_12px_rgba(255,197,58,0.5)]" />
              <CloudRain size={20} className="absolute -bottom-1 -right-1 text-[#00f0ff] drop-shadow-[0_0_6px_rgba(0,240,255,0.8)]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-black text-white tracking-tight">
                  {Math.round(predicted.temp)}°C
                </span>
                <span
                  className="text-xs font-mono text-slate-400"
                  title="Latest verified current weather observation for selected district"
                >
                  {currentTempText}
                </span>
              </div>
              <span className="text-xs font-semibold text-slate-300">
                {current.condition}
              </span>
            </div>
          </div>

          {/* High, Low, Humidity, Wind */}
          <div className="flex flex-col gap-1 text-[10px] font-mono text-slate-300 bg-white/[0.03] border border-white/5 p-2 rounded-md min-w-[130px]">
            <div className="flex items-center justify-between text-slate-200 font-semibold border-b border-white/5 pb-0.5">
              <span>H: {current.high}°C</span>
              <span>L: {current.low}°C</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1 text-slate-400">
                <Droplets size={11} className="text-[#00f0ff]" /> Humidity:
              </span>
              <span className="text-white font-bold">{predicted.humidity}%</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1 text-slate-400">
                <Wind size={11} className="text-teal-400" /> Wind:
              </span>
              <span className="text-white font-bold">{predicted.windSpeed} km/h</span>
            </div>
          </div>
        </div>

        {/* Hourly Forecast Horizontal Strip */}
        <div className="flex items-center justify-between gap-1 pt-1.5 border-t border-white/10 overflow-x-auto custom-scrollbar">
          {hourly.slice(0, 6).map((h, idx) => (
            <div
              key={idx}
              className={`flex-1 flex flex-col items-center justify-center p-1 rounded transition-colors ${
                idx === 0 ? 'bg-[#00f0ff]/15 border border-[#00f0ff]/40' : 'bg-white/[0.02] border border-white/5'
              }`}
            >
              <span className="text-[8.5px] font-mono font-medium text-slate-400 uppercase">
                {h.time}
              </span>
              <div className="my-0.5">
                {h.icon === 'sun' ? (
                  <Sun size={15} className="text-amber-400" />
                ) : h.icon === 'cloud-rain' ? (
                  <CloudRain size={15} className="text-[#00f0ff]" />
                ) : h.icon === 'cloud' ? (
                  <Cloud size={15} className="text-slate-300" />
                ) : (
                  <CloudSun size={15} className="text-amber-300" />
                )}
              </div>
              <span className="text-[11px] font-bold text-white leading-tight">
                {h.temp}°
              </span>
              <span className="text-[7.5px] font-mono text-[#00f0ff] leading-none">
                {h.pop}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Predicted Parameters (Today) Row of KPI cards */}
      <div className="shrink-0 bg-[#051124] rounded-lg border border-[#00f0ff]/20 p-2 shadow-md">
        <div className="text-[9.5px] font-bold tracking-wider text-slate-300 uppercase mb-1.5 flex items-center justify-between">
          <span>Predicted Parameters (Today)</span>
          <span className="text-[8px] font-mono text-slate-400">Updated: 02:17 PM</span>
        </div>

        <div className="grid grid-cols-4 gap-1.5">
          {/* Rainfall */}
          <div className="flex items-center gap-2 p-1.5 rounded bg-white/[0.02] border border-[#00f0ff]/20">
            <div className="w-6 h-6 rounded-full bg-[#00f0ff]/10 border border-[#00f0ff]/30 flex items-center justify-center text-[#00f0ff] shrink-0">
              <CloudRain size={13} />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[8px] text-slate-400 leading-none truncate">Rainfall</span>
              <span className="text-xs font-bold text-white leading-tight">
                {predicted.rainfall} <span className="text-[8.5px] text-slate-400 font-normal">mm</span>
              </span>
            </div>
          </div>

          {/* Humidity */}
          <div className="flex items-center gap-2 p-1.5 rounded bg-white/[0.02] border border-blue-500/20">
            <div className="w-6 h-6 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
              <Droplets size={13} />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[8px] text-slate-400 leading-none truncate">Humidity</span>
              <span className="text-xs font-bold text-white leading-tight">
                {predicted.humidity} <span className="text-[8.5px] text-slate-400 font-normal">%</span>
              </span>
            </div>
          </div>

          {/* Wind Speed */}
          <div className="flex items-center gap-2 p-1.5 rounded bg-white/[0.02] border border-teal-500/20">
            <div className="w-6 h-6 rounded-full bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0">
              <Wind size={13} />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[8px] text-slate-400 leading-none truncate">Wind Speed</span>
              <span className="text-xs font-bold text-white leading-tight">
                {predicted.windSpeed} <span className="text-[8.5px] text-slate-400 font-normal">km/h</span>
              </span>
            </div>
          </div>

          {/* AQI */}
          <div className="flex items-center gap-2 p-1.5 rounded bg-white/[0.02] border border-emerald-500/20">
            <div className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Activity size={13} />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[8px] text-slate-400 leading-none truncate">AQI</span>
              <span className="text-xs font-bold text-white leading-tight">
                {predicted.aqi} <span className="text-[8.5px] text-emerald-400 font-semibold">{predicted.aqiStatus}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Feels Like & Explanation Strip */}
        <div className="mt-1.5 px-2 py-1 rounded bg-[#00f0ff]/5 border border-[#00f0ff]/15 flex items-center justify-between text-[8.5px] font-sans">
          <div className="flex items-center gap-1.5">
            <Thermometer size={12} className="text-[#FF8C2A]" />
            <span className="text-slate-300 font-medium">
              Feels Like: <b className="text-white">{current.feelsLike}°C</b> (Predicted: <b className="text-[#FF8C2A]">{predicted.feelsLike}°C</b>)
            </span>
          </div>
          <span className="text-[8px] text-slate-400 italic truncate max-w-[280px]">
            {predicted.feelsLikeExplanation}
          </span>
        </div>
      </div>
    </div>
  );
};
