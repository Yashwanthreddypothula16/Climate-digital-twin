import React, { useState } from 'react';
import { History, Download, Search, Filter, Calendar, FileText, CheckCircle2 } from 'lucide-react';
import { ClimateAlertRecord } from '../../types/alerts';
import { SEVERITY_COLORS } from '../../services/alertsService';
import { ALL_DISTRICTS } from '../../data/districtClimate';

interface AlertHistoryViewProps {
  alerts: ClimateAlertRecord[];
  onSelectAlert: (alert: ClimateAlertRecord) => void;
}

export const AlertHistoryView: React.FC<AlertHistoryViewProps> = ({ alerts, onSelectAlert }) => {
  const [search, setSearch] = useState('');
  const [districtFilter, setDistrictFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');

  const filtered = alerts.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.districts.some((d) => d.toLowerCase().includes(search.toLowerCase())) ||
      a.id.toLowerCase().includes(search.toLowerCase());
    const matchesDist = districtFilter === 'all' || a.districts.some((d) => d.toLowerCase() === districtFilter.toLowerCase());
    const matchesSev = severityFilter === 'all' || a.severity.toLowerCase() === severityFilter.toLowerCase();
    return matchesSearch && matchesDist && matchesSev;
  });

  const handleExportCSV = () => {
    const headers = ['Alert ID', 'Title', 'Districts', 'Severity', 'Issued Time', 'Status', 'Trigger Condition'];
    const rows = filtered.map((a) => [
      a.id,
      `"${a.title}"`,
      `"${a.districts.join('; ')}"`,
      a.severity,
      `"${a.issuedTime}"`,
      a.status,
      `"${a.triggerCondition}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `telangana_climate_alerts_audit_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-[#030914] p-3 space-y-3 overflow-hidden select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#00f0ff]/15">
        <div>
          <h2 className="text-white text-sm font-bold tracking-wider font-mono uppercase flex items-center space-x-2">
            <History className="w-4 h-4 text-[#00f0ff]" />
            <span>CLIMATE ALERT AUDIT & HISTORICAL ARCHIVE ({filtered.length} RECORDS)</span>
          </h2>
          <p className="text-[10.5px] text-slate-400">
            Immutable lifecycle ledger of warning issuances, acknowledgements, escalations, and incident resolutions
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search audit archive..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-[#071322] border border-[#00f0ff]/20 rounded pl-7 pr-2.5 py-1 text-slate-200 text-xs focus:outline-none"
            />
          </div>

          <select
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="bg-[#071322] border border-[#00f0ff]/20 rounded px-2.5 py-1 text-slate-200 text-xs focus:outline-none"
          >
            <option value="all">All Districts</option>
            {ALL_DISTRICTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-[#071322] border border-[#00f0ff]/20 rounded px-2.5 py-1 text-slate-200 text-xs focus:outline-none"
          >
            <option value="all">All Severities</option>
            <option value="severe">Severe</option>
            <option value="high">High</option>
            <option value="moderate">Moderate</option>
            <option value="advisory">Advisory</option>
            <option value="resolved">Resolved</option>
          </select>

          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-1.5 px-3 py-1 rounded bg-[#00f0ff]/20 hover:bg-[#00f0ff]/30 text-[#00f0ff] border border-[#00f0ff]/40 font-bold text-xs transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Audit Table */}
      <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-white/[0.1] text-slate-400 text-[10px] uppercase font-mono bg-[#051120]">
              <th className="py-2 px-3">Alert ID</th>
              <th className="py-2 px-3">Category / Title</th>
              <th className="py-2 px-3">Districts</th>
              <th className="py-2 px-3">Severity</th>
              <th className="py-2 px-3">Issued Time</th>
              <th className="py-2 px-3">Lifecycle Status</th>
              <th className="py-2 px-3">Response Team</th>
              <th className="py-2 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.05]">
            {filtered.map((item) => {
              const sevConfig = SEVERITY_COLORS[item.severity] || SEVERITY_COLORS.Moderate;
              return (
                <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-2.5 px-3 font-mono text-[#00f0ff]">{item.id}</td>
                  <td className="py-2.5 px-3 font-semibold text-white">{item.title}</td>
                  <td className="py-2.5 px-3 text-slate-300">{item.districts.join(', ')}</td>
                  <td className="py-2.5 px-3">
                    <span
                      style={{
                        backgroundColor: sevConfig.badgeBg,
                        color: sevConfig.bg,
                        border: `1px solid ${sevConfig.border}55`,
                      }}
                      className="px-2 py-0.5 rounded text-[8.5px] font-bold"
                    >
                      {item.severity}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[10px] text-slate-400">{item.issuedTime}</td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`px-1.5 py-0.2 rounded text-[9px] font-semibold ${
                        item.status === 'Resolved'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : item.status === 'Escalated'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-[#00f0ff]/10 text-[#00f0ff]'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-400 text-[10.5px]">{item.responseTeam}</td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => onSelectAlert(item)}
                      className="px-2.5 py-1 rounded bg-[#00f0ff]/15 hover:bg-[#00f0ff]/25 text-[#00f0ff] text-[10px] font-bold"
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
  );
};
