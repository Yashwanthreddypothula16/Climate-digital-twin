import React from 'react';
import type { ClimateAlert } from '../../types/climate';
import { AlertTriangle, Bell } from 'lucide-react';

interface Props {
  alerts: ClimateAlert[];
  onSelectAlert: (a: ClimateAlert) => void;
  onViewAll: () => void;
}

// Hardcoded exactly as in reference image
const ALERTS = [
  {
    id: '1', icon: '🔴', color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)',
    title: 'Heatwave Warning',
    places: 'Hyderabad, Rangareddy, Medchal, Sangareddy',
    time: '17 May 2024 – 11:00 AM',
  },
  {
    id: '2', icon: '🟠', color: '#f97316', bg: 'rgba(249,115,22,0.1)', border: 'rgba(249,115,22,0.3)',
    title: 'Thunderstorm Alert',
    places: 'Adilabad, Asifabad, Komuram Bheem',
    time: '17 May 2024 – 10:45 AM',
  },
  {
    id: '3', icon: '🟡', color: '#eab308', bg: 'rgba(234,179,8,0.1)', border: 'rgba(234,179,8,0.3)',
    title: 'High UV Index',
    places: 'Entire State',
    time: '17 May 2024 – 09:00 AM',
  },
  {
    id: '4', icon: '🟢', color: '#22c55e', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.3)',
    title: 'No Drought Conditions',
    places: 'All Districts',
    time: '17 May 2024 – 08:30 AM',
  },
];

export const AlertsWarnings: React.FC<Props> = ({ onViewAll }) => {
  return (
    <div className="h-full bg-[#06112c]/90 border border-[#00f0ff]/15 rounded-xl p-2.5 flex flex-col backdrop-blur-sm overflow-hidden">
      <div className="flex items-center justify-between mb-1.5 shrink-0">
        <div className="flex items-center gap-1.5">
          <Bell className="w-3 h-3 text-orange-400" />
          <span className="text-[10px] font-bold tracking-widest text-white uppercase">Alerts & Warnings</span>
        </div>
        <button onClick={onViewAll} className="text-[9px] text-[#00f0ff] hover:underline">View All</button>
      </div>

      <div className="flex-1 min-h-0 space-y-1 overflow-hidden">
        {ALERTS.map(a => (
          <div
            key={a.id}
            className="flex items-start gap-1.5 p-1.5 rounded-lg border cursor-pointer hover:opacity-90 transition-opacity"
            style={{ background: a.bg, borderColor: a.border }}
          >
            <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" style={{ color: a.color }} />
            <div className="min-w-0">
              <div className="text-[10px] font-bold leading-tight" style={{ color: a.color }}>{a.title}</div>
              <div className="text-[9px] text-slate-300 leading-tight truncate">{a.places}</div>
              <div className="text-[8px] text-slate-500 leading-tight">{a.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
