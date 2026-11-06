import React, { useState, useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { Map, Layers, Trophy, Compass, ArrowUpDown } from 'lucide-react';
import { AnalyticsMap } from './AnalyticsMap';
import { DistrictAnalyticsData, SpatialLayerType } from '../../types/analytics';
import { getAllDistrictsList } from '../../services/analyticsDataService';

interface SpatialInsightsProps {
  data: DistrictAnalyticsData;
  selectedDistrictId: string;
  onSelectDistrict: (id: string) => void;
}

export const SpatialInsights: React.FC<SpatialInsightsProps> = ({
  data,
  selectedDistrictId,
  onSelectDistrict,
}) => {
  const [selectedLayer, setSelectedLayer] = useState<SpatialLayerType>('rainfall');

  const allDistricts = useMemo(() => getAllDistrictsList(), []);

  // Sorted rankings
  const sortedDistricts = useMemo(() => {
    return [...allDistricts].sort((a, b) => b.rainfall - a.rainfall);
  }, [allDistricts]);

  const top5 = sortedDistricts.slice(0, 5);
  const bottom5 = sortedDistricts.slice(-5).reverse();

  // Regional variation breakdown
  const regionalData = useMemo(() => {
    return [
      { region: 'Northern Forest (Adilabad/KB Asifabad)', avgRain: '1020 mm', avgTemp: '29.2 °C', risk: 'River Surge' },
      { region: 'Eastern Godavari Basin (Khammam/Bhadradri)', avgRain: '1080 mm', avgTemp: '30.1 °C', risk: 'Monsoon Flood' },
      { region: 'Central Urban/Deccan (Hyderabad/Warangal)', avgRain: '820 mm', avgTemp: '28.8 °C', risk: 'Urban Heat Island' },
      { region: 'Southern Semi-Arid (Mahabubnagar/Jogulamba)', avgRain: '660 mm', avgTemp: '31.4 °C', risk: 'Drought Deficit' },
    ];
  }, []);

  return (
    <div className="flex-1 min-h-0 flex flex-col gap-2 p-2 select-none overflow-y-auto custom-scrollbar">
      {/* ── Top Header Toolbar ── */}
      <div className="p-2.5 rounded-xl bg-[#030d1d]/90 border border-[#00f0ff]/20 flex items-center justify-between gap-3 shadow-lg shrink-0">
        <div className="flex items-center gap-2">
          <Map className="w-4 h-4 text-[#00f0ff]" />
          <span className="text-[11px] font-bold text-white uppercase tracking-wider">
            GEOSPATIAL CLIMATE DISTRIBUTION & DISTRICT RANKINGS — TELANGANA STATE
          </span>
        </div>

        {/* Spatial Layer Toggles */}
        <div className="flex items-center gap-1 bg-[#051428] border border-[#00f0ff]/20 rounded-lg p-1">
          {[
            { id: 'rainfall', label: 'Rainfall' },
            { id: 'temperature', label: 'Temperature' },
            { id: 'humidity', label: 'Humidity' },
            { id: 'drought', label: 'Drought Risk' },
            { id: 'flood', label: 'Flood Risk' },
            { id: 'ndvi', label: 'NDVI Vegetation' },
            { id: 'lst', label: 'LST' },
          ].map((l) => (
            <button
              key={l.id}
              onClick={() => setSelectedLayer(l.id as SpatialLayerType)}
              className={`px-2 py-0.5 rounded text-[9.5px] font-semibold transition-all cursor-pointer ${
                selectedLayer === l.id
                  ? 'bg-[#00f0ff] text-[#020810] shadow-[0_0_8px_rgba(0,240,255,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Main Layout: Map (60%) + Spatial Statistics (40%) ── */}
      <div className="flex-1 min-h-[460px] flex gap-2">
        {/* Full Interactive Canvas Map */}
        <div className="flex-[6] min-w-0 h-full">
          <AnalyticsMap
            selectedDistrictId={selectedDistrictId}
            onSelectDistrict={onSelectDistrict}
            activeParameter={selectedLayer as any}
            title={`TELANGANA STATEWIDE SPATIAL LAYER: ${selectedLayer.toUpperCase()}`}
          />
        </div>

        {/* Spatial Stats & Rankings Column */}
        <div className="flex-[4] min-w-0 h-full flex flex-col gap-2">
          {/* Card 1: Selected District Relative Percentile */}
          <div className="p-2.5 rounded-xl bg-[#030d1d]/85 border border-[#00f0ff]/20 shadow-md shrink-0">
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
              STATEWIDE DISTRIBUTION POSITION — {data.name}
            </span>
            <div className="flex items-center justify-between text-[11px] font-mono mt-1">
              <span className="text-slate-400">Rainfall Percentile:</span>
              <span className="text-[#00f0ff] font-bold">72nd Percentile (Above State Mean)</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-800 mt-1.5 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#00f0ff] to-[#10b981] rounded-full" style={{ width: '72%' }} />
            </div>
            <div className="flex justify-between text-[8px] font-mono text-slate-500 mt-1">
              <span>Lowest: Jogulamba (630mm)</span>
              <span>State Mean: 795mm</span>
              <span>Highest: Bhadradri (1140mm)</span>
            </div>
          </div>

          {/* Card 2: District Rankings (Top 5 vs Bottom 5) */}
          <div className="p-2.5 rounded-xl bg-[#030d1d]/85 border border-[#00f0ff]/20 shadow-md flex-1 min-h-0 flex flex-col">
            <div className="flex items-center justify-between mb-1.5 shrink-0">
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-[#f59e0b]" />
                DISTRICT PRECIPITATION RANKINGS
              </span>
              <span className="text-[8.5px] font-mono text-slate-400">All 33 Districts</span>
            </div>

            <div className="grid grid-cols-2 gap-2 flex-1 min-h-0">
              {/* Top 5 */}
              <div className="p-2 rounded-lg bg-[#051428]/60 border border-white/5 flex flex-col">
                <span className="text-[9px] font-bold text-cyan-400 uppercase tracking-wider block mb-1">
                  Highest Rainfall (Top 5)
                </span>
                <div className="space-y-1 flex-1 min-h-0 overflow-y-auto pr-1 text-[9.5px]">
                  {top5.map((d, idx) => (
                    <div
                      key={d.id}
                      onClick={() => onSelectDistrict(d.id)}
                      className={`flex items-center justify-between px-1.5 py-0.5 rounded cursor-pointer transition-all ${
                        selectedDistrictId.toLowerCase() === d.id.toLowerCase() ? 'bg-[#00f0ff]/20 text-[#00f0ff] font-bold' : 'hover:bg-white/5 text-slate-300'
                      }`}
                    >
                      <span>{idx + 1}. {d.name}</span>
                      <span className="font-mono text-cyan-400">{d.rainfall} mm</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom 5 */}
              <div className="p-2 rounded-lg bg-[#051428]/60 border border-white/5 flex flex-col">
                <span className="text-[9px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                  Lowest Rainfall (Bottom 5)
                </span>
                <div className="space-y-1 flex-1 min-h-0 overflow-y-auto pr-1 text-[9.5px]">
                  {bottom5.map((d, idx) => (
                    <div
                      key={d.id}
                      onClick={() => onSelectDistrict(d.id)}
                      className={`flex items-center justify-between px-1.5 py-0.5 rounded cursor-pointer transition-all ${
                        selectedDistrictId.toLowerCase() === d.id.toLowerCase() ? 'bg-[#00f0ff]/20 text-[#00f0ff] font-bold' : 'hover:bg-white/5 text-slate-300'
                      }`}
                    >
                      <span>{idx + 1}. {d.name}</span>
                      <span className="font-mono text-amber-400">{d.rainfall} mm</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Regional Variation Breakdown */}
          <div className="p-2.5 rounded-xl bg-[#030d1d]/85 border border-[#00f0ff]/20 shadow-md shrink-0">
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
              AGRO-CLIMATIC REGIONAL CHARACTERIZATION
            </span>
            <div className="space-y-1 text-[9px] font-mono">
              {regionalData.map((reg, idx) => (
                <div key={idx} className="p-1 rounded bg-[#051428]/50 flex items-center justify-between text-slate-300">
                  <span className="font-sans font-medium text-white">{reg.region}</span>
                  <span className="text-cyan-400">{reg.avgRain}</span>
                  <span className="text-red-400">{reg.avgTemp}</span>
                  <span className="text-amber-400">{reg.risk}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
