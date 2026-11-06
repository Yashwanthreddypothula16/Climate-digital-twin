import React from 'react';
import { ClimateAlertRecord } from '../../types/alerts';
import { SEVERITY_COLORS } from '../../services/alertsService';

interface DistrictPriorityQueueProps {
  onSelectDistrict: (districtName: string) => void;
  onSelectAlertById: (alertId: string) => void;
  selectedAlertId: string;
  onOpenViewAll: () => void;
}

export const DistrictPriorityQueue: React.FC<DistrictPriorityQueueProps> = ({
  onSelectDistrict,
  onSelectAlertById,
  selectedAlertId,
  onOpenViewAll,
}) => {
  const QUEUE_ITEMS = [
    { rank: 1, id: 'ALT-HYD-01', district: 'Hyderabad', type: 'Heatwave', severity: 'Severe', priority: 'P1' },
    { rank: 2, id: 'ALT-WGL-02', district: 'Warangal', type: 'Heavy Rainfall', severity: 'High', priority: 'P1' },
    { rank: 3, id: 'ALT-KHM-03', district: 'Khammam', type: 'Flood Watch', severity: 'High', priority: 'P1' },
    { rank: 4, id: 'ALT-ADB-04', district: 'Adilabad', type: 'Heatwave', severity: 'High', priority: 'P2' },
    { rank: 5, id: 'ALT-NZB-05', district: 'Nizamabad', type: 'Heavy Rainfall', severity: 'High', priority: 'P2' },
  ];

  return (
    <div className="bg-[#030914] p-2.5 flex flex-col h-full select-none justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-1.5 shrink-0">
        <span className="text-[11px] font-bold text-slate-200 tracking-wider font-mono uppercase">
          DISTRICT PRIORITY QUEUE
        </span>
        <button
          onClick={onOpenViewAll}
          className="text-[10px] text-[#00f0ff] hover:underline font-medium cursor-pointer"
        >
          View All
        </button>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-hidden flex flex-col justify-between">
        <div className="grid grid-cols-[16px_1fr_1.1fr_56px_34px] gap-1.5 text-[9.5px] font-bold text-slate-400 uppercase tracking-wider font-mono border-b border-white/[0.08] pb-1 px-1">
          <div>#</div>
          <div>District</div>
          <div>Alert Type</div>
          <div className="text-center">Severity</div>
          <div className="text-center">Priority</div>
        </div>

        <div className="flex-1 flex flex-col justify-between py-0.5">
          {QUEUE_ITEMS.map((item) => {
            const isSelected = item.id === selectedAlertId;
            const sevConfig = SEVERITY_COLORS[item.severity] || SEVERITY_COLORS.Moderate;
            return (
              <div
                key={item.id}
                onClick={() => {
                  onSelectDistrict(item.district);
                  onSelectAlertById(item.id);
                }}
                className={`grid grid-cols-[16px_1fr_1.1fr_56px_34px] gap-1.5 items-center text-[10px] px-1 py-1 rounded cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-[#00f0ff]/10 border border-[#00f0ff]/30'
                    : 'hover:bg-white/[0.04]'
                }`}
              >
                <div className="text-slate-500 font-mono font-bold">{item.rank}</div>
                <div className="text-slate-200 font-semibold truncate">{item.district}</div>
                <div className="text-slate-300 truncate">{item.type}</div>
                <div className="flex justify-center">
                  <span
                    style={{
                      backgroundColor: sevConfig.badgeBg,
                      color: sevConfig.bg,
                      border: `1px solid ${sevConfig.border}55`,
                    }}
                    className="px-1.5 py-0.2 rounded text-[8.5px] font-bold"
                  >
                    {item.severity}
                  </span>
                </div>
                <div className="col-span-2 flex justify-center">
                  <span
                    className={`px-1.5 py-0.2 rounded text-[8.5px] font-bold ${
                      item.priority === 'P1'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    }`}
                  >
                    {item.priority}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
