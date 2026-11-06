import React from 'react';
import {
  FileText,
  FileCheck,
  Calendar,
  LayoutTemplate,
  Download,
  ShieldCheck,
  BarChart2,
  AlertTriangle,
  TrendingUp,
  Cpu,
  FileSpreadsheet,
  Presentation,
  CheckCircle2
} from 'lucide-react';
import { ReportSidebarTab, ReportType, GeneratedReportRecord } from '../../types/reports';

interface ReportsSidebarProps {
  activeTab: ReportSidebarTab;
  onSelectTab: (tab: ReportSidebarTab) => void;
  onSelectQuickReport: (type: ReportType) => void;
  recentReports: GeneratedReportRecord[];
  onSelectRecentReport: (report: GeneratedReportRecord) => void;
  onViewAllRecent: () => void;
}

export const ReportsSidebar: React.FC<ReportsSidebarProps> = ({
  activeTab,
  onSelectTab,
  onSelectQuickReport,
  recentReports,
  onSelectRecentReport,
  onViewAllRecent,
}) => {
  const NAV_ITEMS: { id: ReportSidebarTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'builder', label: 'Report Builder', icon: FileText },
    { id: 'generated', label: 'Generated Reports', icon: FileCheck },
    { id: 'scheduled', label: 'Scheduled Reports', icon: Calendar },
    { id: 'templates', label: 'Templates', icon: LayoutTemplate },
    { id: 'export_center', label: 'Export Center', icon: Download },
    { id: 'compliance', label: 'Compliance', icon: ShieldCheck },
  ];

  const QUICK_REPORTS: { title: string; subtitle: string; type: ReportType; icon: React.ComponentType<{ className?: string }> }[] = [
    { title: 'District Climate Summary', subtitle: 'Key climate indicators & trends', type: 'District Climate Summary', icon: FileText },
    { title: 'Annual Rainfall Report', subtitle: 'Rainfall analysis and trends', type: 'Annual Rainfall Report', icon: BarChart2 },
    { title: 'Extreme Events Report', subtitle: 'Heatwaves, floods, droughts', type: 'Extreme Events Report', icon: AlertTriangle },
    { title: 'Prediction Outlook Report', subtitle: 'Future climate projections', type: 'Prediction Outlook Report', icon: TrendingUp },
    { title: 'Simulation Impact Report', subtitle: 'Scenario based impact analysis', type: 'Simulation Impact Report', icon: Cpu },
  ];

  return (
    <div className="w-full h-full flex flex-col bg-[#030914] border-r border-[#00f0ff]/15 text-slate-200 select-none overflow-hidden justify-between">
      {/* ── Section 1: Navigation Modes ── */}
      <div className="p-2 border-b border-white/5 shrink-0">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 block mb-1">
          REPORTS
        </span>
        <div className="space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all text-left cursor-pointer ${
                  isActive
                    ? 'bg-[#00f0ff]/15 border border-[#00f0ff]/40 text-[#00f0ff] shadow-[0_0_12px_rgba(0,240,255,0.2)] font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#00f0ff]' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Section 2: Quick Reports ── */}
      <div className="p-2 border-b border-white/5 flex-1 min-h-0 flex flex-col justify-between">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 block mb-1 shrink-0">
          QUICK REPORTS
        </span>

        <div className="space-y-1 overflow-y-auto pr-0.5 custom-scrollbar flex-1 min-h-0">
          {QUICK_REPORTS.map((qr, idx) => {
            const Icon = qr.icon;
            return (
              <div
                key={idx}
                onClick={() => onSelectQuickReport(qr.type)}
                className="p-1.5 rounded-lg bg-[#051428]/60 hover:bg-[#071f3d] border border-white/5 hover:border-[#00f0ff]/30 flex items-center gap-2 transition-all cursor-pointer"
              >
                <div className="w-6 h-6 rounded bg-[#00f0ff]/10 border border-[#00f0ff]/20 flex items-center justify-center text-[#00f0ff] shrink-0">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0 flex-1 leading-tight">
                  <span className="text-[10px] font-bold text-white block truncate">
                    {qr.title}
                  </span>
                  <span className="text-[8px] text-slate-400 block truncate">
                    {qr.subtitle}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Section 3: Recent Reports ── */}
      <div className="p-2 shrink-0 bg-[#020710]/60">
        <div className="flex items-center justify-between px-2 mb-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            RECENT REPORTS
          </span>
          <button
            onClick={onViewAllRecent}
            className="text-[9px] text-[#00f0ff] hover:underline cursor-pointer"
          >
            View All
          </button>
        </div>

        <div className="space-y-1">
          {recentReports.slice(0, 4).map((rr) => {
            const isPdf = rr.type === 'PDF';
            const isPpt = rr.type === 'PPT';
            const isXlsx = rr.type === 'XLSX';

            return (
              <div
                key={rr.id}
                onClick={() => onSelectRecentReport(rr)}
                className="p-1.5 rounded-lg bg-[#051428]/60 hover:bg-[#071f3d] border border-white/5 hover:border-[#00f0ff]/30 flex items-center justify-between gap-1.5 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className={`w-6 h-6 rounded flex items-center justify-center font-bold text-[8px] shrink-0 ${
                      isPdf
                        ? 'bg-red-500/15 border border-red-500/40 text-red-400'
                        : isPpt
                        ? 'bg-amber-500/15 border border-amber-500/40 text-amber-400'
                        : 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-400'
                    }`}
                  >
                    {rr.type}
                  </div>
                  <div className="min-w-0 leading-tight">
                    <span className="text-[10px] font-bold text-white block truncate">
                      {rr.name}
                    </span>
                    <span className="text-[7.5px] font-mono text-slate-400 block truncate">
                      {rr.date}
                    </span>
                  </div>
                </div>

                <span className="text-[8px] font-bold text-emerald-400 flex items-center gap-0.5 shrink-0">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  Completed
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
