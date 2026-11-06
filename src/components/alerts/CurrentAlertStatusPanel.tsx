import React from 'react';
import { 
  Bell, 
  AlertTriangle, 
  Users, 
  Clock, 
  ShieldCheck, 
  Thermometer, 
  ChevronRight,
  MapPin
} from 'lucide-react';
import { ClimateAlertRecord } from '../../types/alerts';
import { SEVERITY_COLORS } from '../../services/alertsService';

interface CurrentAlertStatusPanelProps {
  selectedDistrict: string;
  selectedAlert?: ClimateAlertRecord;
  onViewDistrictDetails: () => void;
}

export const CurrentAlertStatusPanel: React.FC<CurrentAlertStatusPanelProps> = ({
  selectedDistrict,
  selectedAlert,
  onViewDistrictDetails,
}) => {
  const sevConfig = selectedAlert ? SEVERITY_COLORS[selectedAlert.severity] : SEVERITY_COLORS.Severe;

  // District Area & Coordinates lookup
  const DISTRICT_META: Record<string, { lat: string; lon: string; area: string; pop: string }> = {
    Hyderabad: { lat: '17.3850° N', lon: '78.4867° E', area: '217 km²', pop: '8.4 million' },
    Warangal: { lat: '17.9689° N', lon: '79.5941° E', area: '1,805 km²', pop: '1.2 million' },
    Adilabad: { lat: '19.6641° N', lon: '78.5320° E', area: '4,153 km²', pop: '710,000' },
    Khammam: { lat: '17.2473° N', lon: '80.1514° E', area: '4,361 km²', pop: '1.4 million' },
    Nizamabad: { lat: '18.6725° N', lon: '78.0941° E', area: '4,288 km²', pop: '1.5 million' },
    Karimnagar: { lat: '18.4386° N', lon: '79.1288° E', area: '2,128 km²', pop: '1.0 million' },
    Nalgonda: { lat: '17.0575° N', lon: '79.2684° E', area: '7,122 km²', pop: '1.6 million' },
    Mahabubnagar: { lat: '16.7488° N', lon: '77.9845° E', area: '5,286 km²', pop: '1.4 million' },
  };

  const meta = DISTRICT_META[selectedDistrict] || {
    lat: '17.8000° N',
    lon: '78.9000° E',
    area: '3,200 km²',
    pop: '950,000',
  };

  return (
    <div className="bg-[#030914] p-3 flex flex-col space-y-2.5 select-none shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-[11.5px] font-bold text-slate-200 tracking-wider font-mono uppercase">
          CURRENT ALERT STATUS
        </span>
        <button
          onClick={onViewDistrictDetails}
          className="text-[10.5px] text-[#00f0ff] hover:underline flex items-center font-medium cursor-pointer"
        >
          <span>View District Details</span>
          <ChevronRight className="w-3 h-3 ml-0.5" />
        </button>
      </div>

      {/* District Identity Card */}
      <div className="flex items-center justify-between bg-[#061220] border border-white/[0.08] rounded-lg p-2.5">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-10 rounded-md overflow-hidden border border-[#00f0ff]/30 shrink-0 bg-[#0c1f36]">
            <img
              src="/building.jpg"
              alt={selectedDistrict}
              className="w-full h-full object-cover opacity-90"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h2 className="text-[14px] font-bold text-white tracking-wide">
                {selectedDistrict}
              </h2>
            </div>
            <p className="text-[10px] text-[#00f0ff] font-semibold">Telangana</p>
            <div className="text-[9px] text-slate-400 font-mono mt-0.5">
              Lat: {meta.lat}, {meta.lon} • Area: {meta.area}
            </div>
          </div>
        </div>

        {/* Small District Polygon Icon */}
        <div className="w-8 h-8 rounded-lg bg-[#020b17] border border-[#00f0ff]/30 flex items-center justify-center text-[#00f0ff] shrink-0">
          <MapPin className="w-4 h-4 text-[#00f0ff]" />
        </div>
      </div>

      {/* Warning Banner */}
      <div className="flex items-center justify-between p-2.5 rounded-lg bg-red-950/30 border border-red-500/40">
        <div className="flex items-center space-x-2.5">
          <div className="w-6 h-6 rounded-full bg-red-500/20 border border-red-500/60 flex items-center justify-center shrink-0">
            <Thermometer className="w-3.5 h-3.5 text-red-400" />
          </div>
          <div>
            <div className="text-[11.5px] font-bold text-white leading-tight">
              {selectedAlert ? selectedAlert.title : 'Heatwave Warning'}
            </div>
            <div className="text-[9px] text-slate-400 mt-0.5">
              {selectedAlert ? selectedAlert.issuedTime : 'Since 31 Aug 2026, 01:45 PM'}
            </div>
          </div>
        </div>
        <span
          style={{
            backgroundColor: sevConfig.badgeBg,
            color: sevConfig.text === '#000000' ? '#fde047' : sevConfig.bg,
            border: `1px solid ${sevConfig.border}66`,
          }}
          className="px-2.5 py-0.5 rounded text-[10px] font-bold shrink-0"
        >
          {selectedAlert ? selectedAlert.severity : 'Severe'}
        </span>
      </div>

      {/* 6 KPI Metric Cards (2 columns x 3 rows) */}
      <div className="grid grid-cols-2 gap-2 pt-0.5">
        {/* Active Alerts */}
        <div className="bg-[#061220] border border-white/[0.08] rounded-lg p-2.5 flex flex-col justify-between">
          <div className="flex items-center space-x-1.5 text-slate-400 mb-1">
            <div className="w-4 h-4 rounded-full bg-[#00f0ff]/10 flex items-center justify-center">
              <Bell className="w-2.5 h-2.5 text-[#00f0ff]" />
            </div>
            <span className="text-[9.5px] font-medium uppercase font-mono">Active Alerts</span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-[19px] font-bold text-white font-mono leading-none">24</span>
            <span className="text-[9px] font-medium text-emerald-400">+8 vs last 24h</span>
          </div>
        </div>

        {/* Severe Alerts */}
        <div className="bg-[#061220] border border-white/[0.08] rounded-lg p-2.5 flex flex-col justify-between">
          <div className="flex items-center space-x-1.5 text-slate-400 mb-1">
            <div className="w-4 h-4 rounded-full bg-red-500/10 flex items-center justify-center">
              <AlertTriangle className="w-2.5 h-2.5 text-red-400" />
            </div>
            <span className="text-[9.5px] font-medium uppercase font-mono">Severe Alerts</span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-[19px] font-bold text-white font-mono leading-none">6</span>
            <span className="text-[9px] font-medium text-red-400">v +2</span>
          </div>
        </div>

        {/* Affected Districts */}
        <div className="bg-[#061220] border border-white/[0.08] rounded-lg p-2.5 flex flex-col justify-between">
          <div className="flex items-center space-x-1.5 text-slate-400 mb-1">
            <div className="w-4 h-4 rounded-full bg-sky-500/10 flex items-center justify-center">
              <Bell className="w-2.5 h-2.5 text-sky-400" />
            </div>
            <span className="text-[9.5px] font-medium uppercase font-mono">Affected Districts</span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-[17px] font-bold text-white font-mono leading-none">14 / 33</span>
            <span className="text-[9px] font-medium text-red-400">v +5</span>
          </div>
        </div>

        {/* At-Risk Population */}
        <div className="bg-[#061220] border border-white/[0.08] rounded-lg p-2.5 flex flex-col justify-between">
          <div className="flex items-center space-x-1.5 text-slate-400 mb-1">
            <div className="w-4 h-4 rounded-full bg-[#38bdf8]/10 flex items-center justify-center">
              <Users className="w-2.5 h-2.5 text-[#38bdf8]" />
            </div>
            <span className="text-[9.5px] font-medium uppercase font-mono">At-Risk Population</span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-[16px] font-bold text-white font-mono leading-none">{meta.pop}</span>
            <span className="text-[9px] font-medium text-red-400">^ +12%</span>
          </div>
        </div>

        {/* Avg Response Time */}
        <div className="bg-[#061220] border border-white/[0.08] rounded-lg p-2.5 flex flex-col justify-between">
          <div className="flex items-center space-x-1.5 text-slate-400 mb-1">
            <div className="w-4 h-4 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <Clock className="w-2.5 h-2.5 text-emerald-400" />
            </div>
            <span className="text-[9.5px] font-medium uppercase font-mono">Avg Response Time</span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-[18px] font-bold text-white font-mono leading-none">28 min</span>
            <span className="text-[9px] font-medium text-emerald-400">v -12 min</span>
          </div>
        </div>

        {/* Sensor Confidence */}
        <div className="bg-[#061220] border border-white/[0.08] rounded-lg p-2.5 flex flex-col justify-between">
          <div className="flex items-center space-x-1.5 text-slate-400 mb-1">
            <div className="w-4 h-4 rounded-full bg-[#00f0ff]/10 flex items-center justify-center">
              <ShieldCheck className="w-2.5 h-2.5 text-[#00f0ff]" />
            </div>
            <span className="text-[9.5px] font-medium uppercase font-mono">Sensor Confidence</span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-[19px] font-bold text-white font-mono leading-none">92%</span>
            <span className="text-[9px] font-medium text-emerald-400">^ +3%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
