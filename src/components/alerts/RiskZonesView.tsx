import React, { useState } from 'react';
import { ShieldAlert, Layers, ZoomIn, ZoomOut, RotateCcw, AlertTriangle, ChevronRight, BarChart2 } from 'lucide-react';
import { AlertsMap } from './AlertsMap';
import { ClimateAlertRecord } from '../../types/alerts';
import { ALL_DISTRICTS } from '../../data/districtClimate';

interface RiskZonesViewProps {
  selectedDistrict: string;
  onSelectDistrict: (d: string) => void;
  alerts: ClimateAlertRecord[];
}

export const RiskZonesView: React.FC<RiskZonesViewProps> = ({
  selectedDistrict,
  onSelectDistrict,
  alerts,
}) => {
  const [riskType, setRiskType] = useState('heat');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [timePeriod, setTimePeriod] = useState('current');

  const RISK_TYPES = [
    { id: 'heat', label: 'Heat-Risk Zones', color: '#EF4444' },
    { id: 'rainfall', label: 'Heavy-Rainfall Zones', color: '#0284c7' },
    { id: 'flood', label: 'Flood-Risk Zones', color: '#06b6d4' },
    { id: 'drought', label: 'Drought-Risk Zones', color: '#f97316' },
    { id: 'wind', label: 'Wind-Risk Zones', color: '#eab308' },
    { id: 'air_quality', label: 'Air Quality Risk Zones', color: '#10b981' },
  ];

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-[#030914] p-3 space-y-3 overflow-hidden select-none">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-2 border-b border-[#00f0ff]/15">
        <div>
          <h2 className="text-white text-sm font-bold tracking-wider font-mono uppercase flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-[#00f0ff]" />
            <span>CLIMATE RISK ZONES GEOGRAPHIC ANALYSIS</span>
          </h2>
          <p className="text-[10.5px] text-slate-400">
            Spatial hazard vulnerability modeling across all 33 Telangana administrative zones
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-2 text-xs">
          <select
            value={riskType}
            onChange={(e) => setRiskType(e.target.value)}
            className="bg-[#071322] border border-[#00f0ff]/20 rounded px-2.5 py-1 text-slate-200 text-xs focus:outline-none"
          >
            {RISK_TYPES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>

          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-[#071322] border border-[#00f0ff]/20 rounded px-2.5 py-1 text-slate-200 text-xs focus:outline-none"
          >
            <option value="all">All Severities</option>
            <option value="severe">High / Severe Only</option>
            <option value="moderate">Moderate & Low</option>
          </select>

          <select
            value={selectedDistrict}
            onChange={(e) => onSelectDistrict(e.target.value)}
            className="bg-[#071322] border border-[#00f0ff]/20 rounded px-2.5 py-1 text-slate-200 text-xs focus:outline-none"
          >
            {ALL_DISTRICTS.map((d) => (
              <option key={d} value={d}>
                District: {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Content: Map on left, District Risk Summary on Right */}
      <div className="flex-1 min-h-0 flex gap-3 overflow-hidden">
        {/* Map Panel */}
        <div className="flex-[7] rounded border border-[#00f0ff]/20 overflow-hidden relative">
          <AlertsMap
            selectedDistrict={selectedDistrict}
            onSelectDistrict={onSelectDistrict}
            alerts={alerts}
          />
        </div>

        {/* Right Info Panel */}
        <div className="flex-[4] bg-[#061220] border border-[#00f0ff]/20 rounded p-4 flex flex-col justify-between overflow-y-auto space-y-3">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
              <div>
                <h3 className="text-base font-bold text-white uppercase font-mono">{selectedDistrict}</h3>
                <span className="text-[11px] text-[#00f0ff]">Hazard Risk Profile</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/40 text-[9.5px] font-bold">
                Zone Tier 1 High Risk
              </span>
            </div>

            <div className="mt-3 space-y-2 text-xs">
              <div className="bg-[#030a14] p-2.5 rounded border border-white/[0.06]">
                <div className="text-slate-400 text-[10.5px]">Dominant Hazard Class</div>
                <div className="text-white font-bold text-[12px] capitalize mt-0.5">
                  {riskType === 'heat' ? 'Extreme Surface Thermal Stress' : `${riskType} Hazard`}
                </div>
              </div>

              <div className="bg-[#030a14] p-2.5 rounded border border-white/[0.06]">
                <div className="text-slate-400 text-[10.5px]">Historical Recurrence Interval</div>
                <div className="text-white font-mono font-bold text-[12px] mt-0.5">
                  1 in 4.2 years (18.4% annual probability)
                </div>
              </div>

              <div className="bg-[#030a14] p-2.5 rounded border border-white/[0.06]">
                <div className="text-slate-400 text-[10.5px]">Population Exposure Index</div>
                <div className="text-white font-mono font-bold text-[12px] mt-0.5">
                  High Density Urban Agglomeration (Rank 1/33)
                </div>
              </div>

              <div className="bg-[#030a14] p-2.5 rounded border border-white/[0.06]">
                <div className="text-slate-400 text-[10.5px]">Infrastructure Vulnerability</div>
                <div className="text-white text-[11px] mt-0.5 leading-snug">
                  Grid strain during daytime peaks; surface drainage chokepoints along arterial corridors.
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 rounded bg-[#00f0ff]/10 border border-[#00f0ff]/25 text-[#00f0ff] text-[10.5px] leading-relaxed">
            State Climate Twin Layer is actively calibrated against 14 years of district sensor telemetry.
          </div>
        </div>
      </div>
    </div>
  );
};
