import React, { useState } from 'react';
import { X, Search, Filter, ChevronRight } from 'lucide-react';
import { ClimateAlertRecord } from '../../types/alerts';
import { SEVERITY_COLORS } from '../../services/alertsService';

interface ViewAllAlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: ClimateAlertRecord[];
  onSelectAlert: (alert: ClimateAlertRecord) => void;
}

export const ViewAllAlertsModal: React.FC<ViewAllAlertsModalProps> = ({
  isOpen,
  onClose,
  alerts,
  onSelectAlert,
}) => {
  const [search, setSearch] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('all');

  if (!isOpen) return null;

  const filtered = alerts.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.districts.some((d) => d.toLowerCase().includes(search.toLowerCase())) ||
      a.triggerCondition.toLowerCase().includes(search.toLowerCase());
    const matchesSev = filterSeverity === 'all' || a.severity.toLowerCase() === filterSeverity.toLowerCase();
    return matchesSearch && matchesSev;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#030914] border border-[#00f0ff]/40 rounded-lg w-full max-w-4xl max-h-[85vh] flex flex-col shadow-[0_0_30px_rgba(0,240,255,0.2)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#00f0ff]/20 bg-[#061220]">
          <div>
            <h2 className="text-white text-sm font-bold tracking-wide font-mono uppercase">
              ACTIVE CLIMATE ALERTS DIRECTORY ({filtered.length} RECORDS)
            </h2>
            <p className="text-[10px] text-slate-400">
              Statewide Early Warning Registry across Telangana's 33 districts
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded hover:bg-white/[0.08] flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="px-5 py-2.5 bg-[#051120] border-b border-white/[0.08] flex items-center space-x-3 text-xs">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, district, or trigger condition..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#071322] border border-[#00f0ff]/20 rounded pl-8 pr-3 py-1.5 text-slate-200 text-xs focus:outline-none focus:border-[#00f0ff]"
            />
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-slate-400 text-[11px]">Severity:</span>
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="bg-[#071322] border border-[#00f0ff]/20 rounded px-2.5 py-1.5 text-slate-200 text-xs focus:outline-none"
            >
              <option value="all">All Severities</option>
              <option value="severe">Severe</option>
              <option value="high">High</option>
              <option value="moderate">Moderate</option>
              <option value="advisory">Advisory</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>

        {/* Alerts Table */}
        <div className="flex-1 overflow-y-auto p-5 text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.1] text-slate-400 text-[10px] uppercase font-mono">
                <th className="pb-2">Alert ID</th>
                <th className="pb-2">Title / Type</th>
                <th className="pb-2">Districts</th>
                <th className="pb-2">Severity</th>
                <th className="pb-2">Priority</th>
                <th className="pb-2">Issued Time</th>
                <th className="pb-2">Status</th>
                <th className="pb-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {filtered.map((alt) => {
                const sevConfig = SEVERITY_COLORS[alt.severity] || SEVERITY_COLORS.Moderate;
                return (
                  <tr key={alt.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-2.5 font-mono text-slate-400">{alt.id}</td>
                    <td className="py-2.5 font-semibold text-white">{alt.title}</td>
                    <td className="py-2.5 text-slate-300">{alt.districts.join(', ')}</td>
                    <td className="py-2.5">
                      <span
                        style={{
                          backgroundColor: sevConfig.badgeBg,
                          color: sevConfig.bg,
                          border: `1px solid ${sevConfig.border}55`,
                        }}
                        className="px-2 py-0.5 rounded text-[9px] font-bold"
                      >
                        {alt.severity}
                      </span>
                    </td>
                    <td className="py-2.5 font-mono font-bold text-slate-200">{alt.priority}</td>
                    <td className="py-2.5 text-slate-400 font-mono text-[10px]">{alt.issuedTime}</td>
                    <td className="py-2.5">
                      <span className="px-1.5 py-0.2 rounded bg-[#00f0ff]/10 text-[#00f0ff] font-semibold text-[9px]">
                        {alt.status}
                      </span>
                    </td>
                    <td className="py-2.5 text-right">
                      <button
                        onClick={() => {
                          onSelectAlert(alt);
                          onClose();
                        }}
                        className="px-2.5 py-1 rounded bg-[#00f0ff]/20 hover:bg-[#00f0ff]/30 text-[#00f0ff] font-bold text-[10.5px] cursor-pointer"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
