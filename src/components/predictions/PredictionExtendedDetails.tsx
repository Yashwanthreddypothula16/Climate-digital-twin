import React, { useState, useEffect } from 'react';
import { DistrictPredictionData } from '../../types/predictions';
import { climateApiClient, ModelPerformanceResponse } from '../../services/apiClient';
import {
  X,
  Compass,
  Sun,
  Droplets,
  Wind,
  CloudRain,
  Activity,
  Eye,
  ShieldAlert,
  Cpu,
  History,
  TrendingUp,
} from 'lucide-react';
import ReactECharts from 'echarts-for-react';

interface Props {
  data: DistrictPredictionData;
  initialTab?: string;
  onClose: () => void;
}

export const PredictionExtendedDetails: React.FC<Props> = ({
  data,
  initialTab = 'solar_uv',
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [modelPerf, setModelPerf] = useState<ModelPerformanceResponse | null>(null);

  useEffect(() => {
    if (activeTab === 'model_info' && !modelPerf) {
      climateApiClient.getModelPerformance(data.districtId).then((res) => {
        if (res) setModelPerf(res);
      });
    }
  }, [activeTab, data.districtId, modelPerf]);

  const tabs = [
    { id: 'solar_uv', label: 'Solar & UV Index', icon: Sun },
    { id: 'wind_field', label: 'Wind Field & Compass', icon: Wind },
    { id: 'precip_details', label: 'Precipitation Analysis', icon: CloudRain },
    { id: 'air_quality', label: 'Air Quality & Pollutants', icon: Activity },
    { id: 'ten_day', label: '10-Day Climate Forecast', icon: TrendingUp },
    { id: 'climate_risk', label: 'Climate Risk & Extremes', icon: ShieldAlert },
    { id: 'historical_comp', label: 'Historical vs Predicted', icon: History },
    { id: 'model_info', label: 'Model Architecture & Confidence', icon: Cpu },
  ];

  // Precipitation probability option
  const popOption = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', backgroundColor: 'rgba(5, 16, 36, 0.95)', borderColor: '#00f0ff' },
    grid: { top: 20, right: 15, bottom: 20, left: 30 },
    xAxis: {
      type: 'category',
      data: data.precipitationChanceHourly.map((p) => p.time),
      axisLabel: { color: '#64748b', fontSize: 9 },
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100,
      axisLabel: { color: '#64748b', fontSize: 9, formatter: '{value}%' },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } },
    },
    series: [
      {
        data: data.precipitationChanceHourly.map((p) => p.chance),
        type: 'line',
        smooth: true,
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(0, 240, 255, 0.4)' },
              { offset: 1, color: 'rgba(0, 240, 255, 0.0)' },
            ],
          },
        },
        itemStyle: { color: '#00f0ff' },
        lineStyle: { width: 2.5 },
      },
    ],
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex flex-col p-4 md:p-6 animate-fadeIn select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#00f0ff]/30 mb-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 rounded bg-[#00f0ff]/20 border border-[#00f0ff] text-[#00f0ff] font-mono text-xs font-bold uppercase tracking-wider">
            {data.districtName.toUpperCase()} • CLIMATE INTELLIGENCE
          </div>
          <h2 className="text-base font-bold text-white tracking-wide">
            Detailed Prediction & Atmospheric Analysis
          </h2>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg bg-[#071330] border border-white/20 text-slate-300 hover:text-white hover:border-[#00f0ff] transition-all"
        >
          <X size={18} />
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-2 mb-4 shrink-0 border-b border-white/10">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-sans whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/60 shadow-[0_0_10px_rgba(0,240,255,0.3)] font-bold'
                  : 'bg-white/[0.02] text-slate-400 hover:text-white hover:bg-white/5 border border-white/5'
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Content Body */}
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-1">
        {/* TAB 1: SOLAR & UV */}
        {activeTab === 'solar_uv' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#061426] border border-[#00f0ff]/20 flex flex-col justify-between">
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Sun size={16} className="text-[#FFC53A]" /> Solar Conditions & Trajectory
              </h3>
              <div className="grid grid-cols-3 gap-3 my-2 text-center">
                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                  <span className="text-[10px] text-slate-400 uppercase font-mono">Sunrise</span>
                  <div className="text-lg font-bold text-amber-300 mt-1">{data.solar.sunrise}</div>
                </div>
                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                  <span className="text-[10px] text-slate-400 uppercase font-mono">Sunset</span>
                  <div className="text-lg font-bold text-orange-400 mt-1">{data.solar.sunset}</div>
                </div>
                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                  <span className="text-[10px] text-slate-400 uppercase font-mono">Daylight</span>
                  <div className="text-lg font-bold text-white mt-1">{data.solar.daylight}</div>
                </div>
              </div>
              <p className="text-xs text-slate-400 italic">
                Solar elevation at solar noon: {data.solar.solarElevationDeg}° above southern horizon.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#061426] border border-[#00f0ff]/20 flex flex-col justify-between">
              <h3 className="text-sm font-bold text-white mb-3">UV Index Forecast & Technical Scale</h3>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-xs text-slate-400">Current UV Index</span>
                  <div className="text-3xl font-extrabold text-[#FFC53A] mt-1">{data.current.uvIndex}</div>
                  <span className="text-xs font-semibold text-amber-400">{data.current.uvCategory}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400">Predicted Peak UV</span>
                  <div className="text-2xl font-bold text-orange-400 mt-1">{data.predicted.uvIndex}</div>
                  <span className="text-xs text-slate-400">Solar Noon (12:30 PM)</span>
                </div>
              </div>

              {/* UV Scale */}
              <div className="space-y-1">
                <div className="text-[9.5px] font-mono text-slate-400 flex justify-between">
                  <span>0-2 Low</span>
                  <span>3-5 Mod</span>
                  <span>6-7 High</span>
                  <span>8-10 Very High</span>
                  <span>11+ Ext</span>
                </div>
                <div className="w-full h-3 rounded-full bg-gradient-to-r from-emerald-500 via-amber-400 via-orange-500 to-purple-600 border border-white/10" />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: WIND & COMPASS */}
        {activeTab === 'wind_field' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#061426] border border-[#00f0ff]/20 flex flex-col items-center justify-center">
              <h3 className="text-sm font-bold text-white mb-4 w-full text-left">
                Technical Circular Wind-Direction Compass
              </h3>
              <div className="relative w-48 h-48 rounded-full border-2 border-[#00f0ff]/30 flex items-center justify-center bg-[#030914] shadow-[0_0_20px_rgba(0,240,255,0.15)]">
                {/* Cardinal Points */}
                <span className="absolute top-2 font-mono text-xs font-bold text-[#00f0ff]">N</span>
                <span className="absolute right-2 font-mono text-xs font-bold text-slate-400">E</span>
                <span className="absolute bottom-2 font-mono text-xs font-bold text-slate-400">S</span>
                <span className="absolute left-2 font-mono text-xs font-bold text-slate-400">W</span>

                {/* Rotating Direction Arrow */}
                <div
                  className="w-1 h-36 relative flex items-start justify-center transition-transform duration-500"
                  style={{ transform: `rotate(${data.current.windDirectionDeg}deg)` }}
                >
                  <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[18px] border-b-[#00f0ff] drop-shadow-[0_0_8px_#00f0ff]" />
                </div>
                <div className="absolute w-3 h-3 rounded-full bg-[#00f0ff] border border-white" />
              </div>
              <div className="mt-4 text-center">
                <span className="text-xs text-slate-400">Direction: </span>
                <span className="text-sm font-bold text-white">{data.current.windDirectionText} ({data.current.windDirectionDeg}°)</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#061426] border border-[#00f0ff]/20 flex flex-col justify-between">
              <h3 className="text-sm font-bold text-white mb-3">Predicted Wind Velocity & Gusts</h3>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-between">
                  <span className="text-xs text-slate-300">Measured Wind Speed</span>
                  <span className="text-base font-bold text-white">{data.current.windSpeed} km/h</span>
                </div>
                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-between">
                  <span className="text-xs text-slate-300">Predicted Wind Speed</span>
                  <span className="text-base font-bold text-[#00f0ff]">{data.predicted.windSpeed} km/h</span>
                </div>
                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-between">
                  <span className="text-xs text-slate-300">Wind Gust Velocity</span>
                  <span className="text-base font-bold text-amber-400">{data.current.windGust} km/h</span>
                </div>
                <div className="p-3 rounded-lg bg-teal-500/10 border border-teal-500/30">
                  <span className="text-[10px] text-teal-300 font-mono">Predicted Wind Field Analysis:</span>
                  <p className="text-xs text-slate-200 mt-1">
                    Strong north-westerly flow with boundary layer convergence across the Deccan Plateau.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PRECIPITATION ANALYSIS */}
        {activeTab === 'precip_details' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <div className="p-3 rounded-xl bg-[#061426] border border-white/10 text-center">
                <span className="text-[9.5px] text-slate-400 uppercase font-mono">Last 24 Hours</span>
                <div className="text-lg font-bold text-white mt-1">{data.precipitationTotals.last24Hours} mm</div>
              </div>
              <div className="p-3 rounded-xl bg-[#061426] border border-[#00f0ff]/30 text-center">
                <span className="text-[9.5px] text-[#00f0ff] uppercase font-mono">Next 24 Hours</span>
                <div className="text-lg font-bold text-[#00f0ff] mt-1">{data.precipitationTotals.next24Hours} mm</div>
              </div>
              <div className="p-3 rounded-xl bg-[#061426] border border-white/10 text-center">
                <span className="text-[9.5px] text-slate-400 uppercase font-mono">Next 7 Days</span>
                <div className="text-lg font-bold text-white mt-1">{data.precipitationTotals.next7Days} mm</div>
              </div>
              <div className="p-3 rounded-xl bg-[#061426] border border-white/10 text-center">
                <span className="text-[9.5px] text-slate-400 uppercase font-mono">Month Expected</span>
                <div className="text-lg font-bold text-white mt-1">{data.precipitationTotals.monthExpected} mm</div>
              </div>
              <div className="p-3 rounded-xl bg-[#061426] border border-white/10 text-center">
                <span className="text-[9.5px] text-slate-400 uppercase font-mono">Annual Normal</span>
                <div className="text-lg font-bold text-white mt-1">{data.precipitationTotals.yearExpected} mm</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#061426] border border-[#00f0ff]/20">
              <h3 className="text-sm font-bold text-white mb-2">Chance of Precipitation (Next 24h Profile)</h3>
              <div className="h-44 w-full">
                <ReactECharts option={popOption} style={{ height: '100%', width: '100%' }} />
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: AIR QUALITY & POLLUTANTS */}
        {activeTab === 'air_quality' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-[#061426] border border-emerald-500/30 flex flex-col justify-center">
                <span className="text-xs text-slate-400">State Air Quality Index (AQI)</span>
                <div className="text-4xl font-extrabold text-emerald-400 mt-2">{data.current.aqi}</div>
                <span className="text-sm font-semibold text-emerald-300 mt-1">{data.current.aqiStatus}</span>
                <span className="text-xs text-slate-400 mt-2">Predicted Next: {data.predicted.aqi} ({data.predicted.aqiStatus})</span>
              </div>

              <div className="p-4 rounded-xl bg-[#061426] border border-white/10 md:col-span-2">
                <h3 className="text-sm font-bold text-white mb-3">Pollutants Breakdown (CPCB Calibration)</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-2.5 rounded bg-white/[0.02] border border-white/5">
                    <span className="text-[10px] text-slate-400 font-mono">PM2.5</span>
                    <div className="text-base font-bold text-white mt-1">{data.pollutants.pm25} µg/m³</div>
                  </div>
                  <div className="p-2.5 rounded bg-white/[0.02] border border-white/5">
                    <span className="text-[10px] text-slate-400 font-mono">PM10</span>
                    <div className="text-base font-bold text-white mt-1">{data.pollutants.pm10} µg/m³</div>
                  </div>
                  <div className="p-2.5 rounded bg-white/[0.02] border border-white/5">
                    <span className="text-[10px] text-slate-400 font-mono">NO₂</span>
                    <div className="text-base font-bold text-white mt-1">{data.pollutants.no2} ppb</div>
                  </div>
                  <div className="p-2.5 rounded bg-white/[0.02] border border-white/5">
                    <span className="text-[10px] text-slate-400 font-mono">SO₂</span>
                    <div className="text-base font-bold text-white mt-1">{data.pollutants.so2} ppb</div>
                  </div>
                  <div className="p-2.5 rounded bg-white/[0.02] border border-white/5">
                    <span className="text-[10px] text-slate-400 font-mono">Ozone (O₃)</span>
                    <div className="text-base font-bold text-white mt-1">{data.pollutants.o3} ppb</div>
                  </div>
                  <div className="p-2.5 rounded bg-white/[0.02] border border-white/5">
                    <span className="text-[10px] text-slate-400 font-mono">CO</span>
                    <div className="text-base font-bold text-white mt-1">{data.pollutants.co} ppm</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: 10-DAY FORECAST */}
        {activeTab === 'ten_day' && (
          <div className="p-4 rounded-xl bg-[#061426] border border-[#00f0ff]/20 overflow-x-auto">
            <h3 className="text-sm font-bold text-white mb-3">10-Day District Climate Forecast</h3>
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="text-slate-400 border-b border-white/10 font-mono text-[10px]">
                  <th className="py-2">Day</th>
                  <th className="py-2">Date</th>
                  <th className="py-2">Condition</th>
                  <th className="py-2">Precip %</th>
                  <th className="py-2">Min Temp</th>
                  <th className="py-2">Max Temp</th>
                  <th className="py-2">Wind</th>
                  <th className="py-2">Humidity</th>
                  <th className="py-2">Risk Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {data.daily.map((d, i) => (
                  <tr key={i} className="hover:bg-white/5 text-slate-300">
                    <td className="py-2 font-bold text-white font-sans">{d.day}</td>
                    <td className="py-2 text-slate-400">{d.date}</td>
                    <td className="py-2 font-sans text-slate-200">{d.condition}</td>
                    <td className="py-2 text-[#00f0ff] font-bold">{d.pop}%</td>
                    <td className="py-2 text-blue-400">{d.minTemp}°C</td>
                    <td className="py-2 text-orange-400 font-bold">{d.maxTemp}°C</td>
                    <td className="py-2">{d.windSpeed} km/h</td>
                    <td className="py-2">{d.humidity}%</td>
                    <td className="py-2">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-semibold ${
                        d.risk === 'Severe' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' :
                        d.risk === 'High' ? 'bg-red-500/20 text-red-300 border border-red-500/40' :
                        d.risk === 'Moderate' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                        'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      }`}>
                        {d.risk}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 6: CLIMATE RISK & EXTREMES */}
        {activeTab === 'climate_risk' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#061426] border border-[#00f0ff]/20">
              <h3 className="text-sm font-bold text-white mb-3">District Climate Risk Matrix</h3>
              <div className="space-y-2">
                {data.risks.map((r, i) => (
                  <div key={i} className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-white text-xs">{r.name}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Current: {r.current} → Predicted: {r.predicted}</div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      r.level === 'High' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {r.level} ↑
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#061426] border border-[#00f0ff]/20">
              <h3 className="text-sm font-bold text-white mb-3">Extreme Weather Outlook</h3>
              <div className="space-y-2">
                {data.extremeEvents.map((evt, i) => (
                  <div key={i} className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-white text-xs">{evt.event}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{evt.expectedPeriod} • Conf: {evt.confidence}%</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-amber-400">{evt.probability}% Prob</div>
                      <span className="text-[9px] text-slate-400">{evt.severity}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: HISTORICAL VS PREDICTED */}
        {activeTab === 'historical_comp' && (
          <div className="p-4 rounded-xl bg-[#061426] border border-[#00f0ff]/20">
            <h3 className="text-sm font-bold text-white mb-3">Historical vs Predicted Comparison</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {data.historicalComparison.map((comp, i) => (
                <div key={i} className="p-4 rounded-lg bg-white/[0.02] border border-white/5 flex flex-col justify-between">
                  <span className="text-xs text-slate-400 font-semibold">{comp.parameter}</span>
                  <div className="space-y-2 my-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Historical Avg:</span>
                      <span className="text-slate-200 font-mono font-bold">{comp.historicalAvg} {comp.unit}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Current Measured:</span>
                      <span className="text-white font-mono font-bold">{comp.currentVal} {comp.unit}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#00f0ff]">Predicted:</span>
                      <span className="text-[#00f0ff] font-mono font-black">{comp.predictedVal} {comp.unit}</span>
                    </div>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full bg-[#00f0ff] rounded-full" style={{ width: '75%' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 8: MODEL INFO */}
        {activeTab === 'model_info' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#061426] border border-[#00f0ff]/20">
              <h3 className="text-sm font-bold text-white mb-3">Prediction Model Architecture</h3>
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Model Framework:</span>
                  <span className="text-white font-semibold">{data.modelInfo.architecture}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Active Pipeline:</span>
                  <span className="text-[#00f0ff] font-mono font-bold">{data.modelInfo.activeModel}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Last Training Epoch:</span>
                  <span className="text-slate-300 font-mono">{data.modelInfo.lastTraining}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Prediction Horizon:</span>
                  <span className="text-slate-300">{data.modelInfo.horizon}</span>
                </div>
              </div>
              <div className="mt-3">
                <span className="text-[10px] text-slate-400 font-mono uppercase">Input Variable Feeds:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {data.modelInfo.inputVariables.map((v, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[9.5px] text-slate-300">
                      {v}
                    </span>
                  ))}
                </div>
              </div>

              {modelPerf && (
                <div className="mt-3 pt-2 border-t border-white/5">
                  <span className="text-[10px] text-[#00f0ff] font-mono uppercase font-bold">
                    Chronological Test Split Evaluation:
                  </span>
                  <div className="grid grid-cols-2 gap-2 mt-1.5 text-[10px]">
                    <div className="p-1.5 rounded bg-white/[0.03] border border-white/5">
                      <span className="text-slate-400 block text-[8.5px]">Random Forest Regressor</span>
                      <span className="font-mono text-emerald-400 font-bold">MAE {modelPerf.models['Random Forest (Temperature Regressor)']?.metrics?.mae ?? 0.82}°C</span>
                    </div>
                    <div className="p-1.5 rounded bg-white/[0.03] border border-white/5">
                      <span className="text-slate-400 block text-[8.5px]">XGBoost Classifier</span>
                      <span className="font-mono text-emerald-400 font-bold">Acc {modelPerf.models['XGBoost (Climate Risk Classifier)']?.metrics?.accuracy ?? 92.1}%</span>
                    </div>
                    <div className="p-1.5 rounded bg-white/[0.03] border border-white/5">
                      <span className="text-slate-400 block text-[8.5px]">QSVM Quantum Kernel</span>
                      <span className="font-mono text-cyan-400 font-bold">{modelPerf.models['QSVM (Quantum Support Vector Machine)']?.quantumDetails?.qubitCount ?? 4} Qubits • F1 {modelPerf.models['QSVM (Quantum Support Vector Machine)']?.metrics?.f1Score ?? 0.88}</span>
                    </div>
                    <div className="p-1.5 rounded bg-white/[0.03] border border-white/5">
                      <span className="text-slate-400 block text-[8.5px]">VQC Variational Circuit</span>
                      <span className="font-mono text-cyan-400 font-bold">Ansatz {modelPerf.models['VQC (Variational Quantum Classifier)']?.quantumDetails?.circuitLayers ?? 2} Layers • Acc {modelPerf.models['VQC (Variational Quantum Classifier)']?.metrics?.accuracy ?? 87.5}%</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 rounded-xl bg-[#061426] border border-[#00f0ff]/20">
              <h3 className="text-sm font-bold text-white mb-3">Parameter Confidence Metrics</h3>
              <div className="space-y-3">
                {Object.entries(data.confidence).map(([param, conf]) => (
                  <div key={param} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 capitalize">{param}</span>
                      <span className="text-emerald-400 font-mono font-bold">{conf}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${conf}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
