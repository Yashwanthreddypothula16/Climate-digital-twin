import React, { useState } from 'react';
import {
  FileText,
  Download,
  Calendar,
  Clock,
  LayoutTemplate,
  ShieldCheck,
  Search,
  CheckCircle,
  ExternalLink,
  Plus,
  Play,
  RotateCcw
} from 'lucide-react';
import {
  ReportSidebarTab,
  GeneratedReportRecord,
  ScheduledReportRecord,
  ReportTemplateItem
} from '../../types/reports';
import {
  INITIAL_GENERATED_REPORTS,
  INITIAL_SCHEDULED_REPORTS,
  REPORT_TEMPLATES
} from '../../services/reportsDataService';

interface AlternativeViewsProps {
  activeTab: ReportSidebarTab;
  onUseTemplate: (templateName: string) => void;
  onDownloadFile: (fileName: string, type: string) => void;
}

export const ReportsAlternativeViews: React.FC<AlternativeViewsProps> = ({
  activeTab,
  onUseTemplate,
  onDownloadFile,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [scheduledList, setScheduledList] = useState<ScheduledReportRecord[]>(INITIAL_SCHEDULED_REPORTS);

  const toggleSchedule = (id: string) => {
    setScheduledList(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s));
  };

  // 1. GENERATED REPORTS VIEW
  if (activeTab === 'generated') {
    return (
      <div className="flex-1 min-h-0 flex flex-col p-3 gap-2 overflow-y-auto custom-scrollbar select-none">
        <div className="flex items-center justify-between pb-2 border-b border-[#00f0ff]/20">
          <div>
            <h2 className="text-[13px] font-bold text-white uppercase tracking-wider">
              GENERATED CLIMATE REPORTS ARCHIVE
            </h2>
            <span className="text-[9.5px] text-slate-400">
              Browse, filter, preview, and download previously compiled district reports
            </span>
          </div>
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search by district or report name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#051428] border border-[#00f0ff]/30 rounded-md px-2.5 py-1 text-[10px] text-white focus:outline-none focus:border-[#00f0ff]"
            />
            <Search className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto rounded-xl bg-[#030d1d]/85 border border-[#00f0ff]/15 p-2 shadow-md">
          <table className="w-full text-left text-[10px]">
            <thead className="bg-[#051428] text-slate-400 font-semibold border-b border-white/10 sticky top-0">
              <tr>
                <th className="py-2 px-2.5">Report Title</th>
                <th className="py-2 px-2.5">District</th>
                <th className="py-2 px-2.5">Date Created</th>
                <th className="py-2 px-2.5">Format</th>
                <th className="py-2 px-2.5">Pages</th>
                <th className="py-2 px-2.5">Size</th>
                <th className="py-2 px-2.5">Status</th>
                <th className="py-2 px-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono text-slate-300">
              {INITIAL_GENERATED_REPORTS.filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase()) || r.district.toLowerCase().includes(searchTerm.toLowerCase())).map((report) => (
                <tr key={report.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-2 px-2.5 font-sans font-medium text-white flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#00f0ff]" />
                    <span>{report.name}</span>
                  </td>
                  <td className="py-2 px-2.5 text-slate-300 font-sans">{report.district}</td>
                  <td className="py-2 px-2.5 text-slate-400">{report.date}</td>
                  <td className="py-2 px-2.5 text-cyan-400 font-bold">{report.type}</td>
                  <td className="py-2 px-2.5 text-slate-400">{report.pages}</td>
                  <td className="py-2 px-2.5 text-slate-400">{report.size}</td>
                  <td className="py-2 px-2.5 text-emerald-400 font-bold">✓ {report.status}</td>
                  <td className="py-2 px-2.5 text-right">
                    <button
                      onClick={() => onDownloadFile(report.name, report.type)}
                      className="px-2 py-0.5 rounded bg-[#00f0ff]/15 hover:bg-[#00f0ff]/25 border border-[#00f0ff]/30 text-[#00f0ff] text-[9px] font-bold cursor-pointer"
                    >
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // 2. SCHEDULED REPORTS VIEW
  if (activeTab === 'scheduled') {
    return (
      <div className="flex-1 min-h-0 flex flex-col p-3 gap-2 overflow-y-auto custom-scrollbar select-none">
        <div className="flex items-center justify-between pb-2 border-b border-[#00f0ff]/20">
          <div>
            <h2 className="text-[13px] font-bold text-white uppercase tracking-wider">
              AUTOMATED REPORT SCHEDULING DISPATCHER
            </h2>
            <span className="text-[9.5px] text-slate-400">
              Configure recurring district climate intelligence reports dispatched automatically
            </span>
          </div>
          <button className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-[#00b4d8] to-[#00f0ff] text-[#020810] rounded text-[10px] font-bold shadow cursor-pointer">
            <Plus className="w-3 h-3" />
            <span>Create New Schedule</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 flex-1 min-h-0">
          {scheduledList.map((sch) => (
            <div key={sch.id} className="p-3 rounded-xl bg-[#030d1d]/85 border border-[#00f0ff]/15 flex flex-col justify-between shadow-md">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-white">{sch.name}</span>
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase bg-blue-500/20 text-cyan-300 border border-blue-500/30">
                    {sch.frequency}
                  </span>
                </div>
                <div className="space-y-1 text-[9px] text-slate-300 font-mono mt-2">
                  <div><strong>District:</strong> {sch.district}</div>
                  <div><strong>Format:</strong> {sch.format}</div>
                  <div><strong>Next Execution:</strong> {sch.nextRun}</div>
                  <div className="truncate"><strong>Recipients:</strong> {sch.recipients}</div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/10 mt-3">
                <span className="text-[8.5px] text-slate-400 font-medium">
                  Status: {sch.active ? <strong className="text-emerald-400">Active</strong> : <strong className="text-slate-500">Paused</strong>}
                </span>
                <button
                  onClick={() => toggleSchedule(sch.id)}
                  className={`px-2.5 py-1 rounded text-[9.5px] font-bold transition-all cursor-pointer ${
                    sch.active ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  {sch.active ? 'Pause Schedule' : 'Activate'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 3. TEMPLATES VIEW
  if (activeTab === 'templates') {
    return (
      <div className="flex-1 min-h-0 flex flex-col p-3 gap-2 overflow-y-auto custom-scrollbar select-none">
        <div className="pb-2 border-b border-[#00f0ff]/20">
          <h2 className="text-[13px] font-bold text-white uppercase tracking-wider">
            REPORT TEMPLATE VAULT
          </h2>
          <span className="text-[9.5px] text-slate-400">
            Pre-configured layouts optimized for cabinet briefings, disaster risk reduction, and research papers
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5 flex-1 min-h-0">
          {REPORT_TEMPLATES.map((tmpl) => (
            <div key={tmpl.id} className="p-3.5 rounded-xl bg-[#030d1d]/85 border border-[#00f0ff]/15 flex flex-col justify-between shadow-md">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11.5px] font-bold text-white">{tmpl.name}</span>
                  <span className="px-1.5 py-0.5 rounded text-[8.5px] font-bold uppercase bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/40">
                    {tmpl.badge}
                  </span>
                </div>
                <p className="text-[9.5px] text-slate-300 leading-relaxed font-sans mt-1">
                  {tmpl.description}
                </p>
                <span className="text-[8.5px] font-mono text-slate-400 mt-2 block">
                  Standard Length: {tmpl.pages} Pages
                </span>
              </div>

              <div className="pt-2 border-t border-white/10 mt-3 flex justify-end">
                <button
                  onClick={() => onUseTemplate(tmpl.category)}
                  className="px-3 py-1 rounded bg-[#00f0ff] text-[#020810] font-bold text-[10px] hover:bg-cyan-300 shadow cursor-pointer"
                >
                  Apply Template to Builder
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 4. EXPORT CENTER VIEW
  if (activeTab === 'export_center') {
    return (
      <div className="flex-1 min-h-0 flex flex-col p-3 gap-2 overflow-y-auto custom-scrollbar select-none">
        <div className="pb-2 border-b border-[#00f0ff]/20">
          <h2 className="text-[13px] font-bold text-white uppercase tracking-wider">
            DIRECT EXPORT &amp; DOWNLOAD CENTER
          </h2>
          <span className="text-[9.5px] text-slate-400">
            High-speed single-click download repository for state datasets and multi-format reports
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          <div className="p-3 rounded-xl bg-[#030d1d]/85 border border-red-500/30 flex flex-col justify-between">
            <div>
              <span className="text-red-400 font-bold text-[11px] block">PDF Reports</span>
              <p className="text-[8.5px] text-slate-400 mt-1">Formatted publication-ready documents with maps and charts.</p>
            </div>
            <button
              onClick={() => onDownloadFile('Telangana_State_Executive', 'PDF')}
              className="mt-3 py-1 px-2 rounded bg-red-500/20 border border-red-500/40 text-red-300 font-bold text-[9.5px] hover:bg-red-500/30 cursor-pointer"
            >
              Download Latest PDF
            </button>
          </div>

          <div className="p-3 rounded-xl bg-[#030d1d]/85 border border-emerald-500/30 flex flex-col justify-between">
            <div>
              <span className="text-emerald-400 font-bold text-[11px] block">XLSX Workbooks</span>
              <p className="text-[8.5px] text-slate-400 mt-1">Structured multi-tab workbooks with verified historical observations.</p>
            </div>
            <button
              onClick={() => onDownloadFile('Telangana_Observations', 'XLSX')}
              className="mt-3 py-1 px-2 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-[9.5px] hover:bg-emerald-500/30 cursor-pointer"
            >
              Download Latest XLSX
            </button>
          </div>

          <div className="p-3 rounded-xl bg-[#030d1d]/85 border border-amber-500/30 flex flex-col justify-between">
            <div>
              <span className="text-amber-400 font-bold text-[11px] block">PPT Briefings</span>
              <p className="text-[8.5px] text-slate-400 mt-1">Formatted slides for conference and cabinet presentations.</p>
            </div>
            <button
              onClick={() => onDownloadFile('State_Briefing_Deck', 'PPT')}
              className="mt-3 py-1 px-2 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-[9.5px] hover:bg-amber-500/30 cursor-pointer"
            >
              Download Latest PPT
            </button>
          </div>

          <div className="p-3 rounded-xl bg-[#030d1d]/85 border border-cyan-500/30 flex flex-col justify-between">
            <div>
              <span className="text-cyan-400 font-bold text-[11px] block">CSV Raw Telemetry</span>
              <p className="text-[8.5px] text-slate-400 mt-1">Clean tabular data for scientific R/Python analytics workflows.</p>
            </div>
            <button
              onClick={() => onDownloadFile('Telangana_33Districts_Telemetry', 'CSV')}
              className="mt-3 py-1 px-2 rounded bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-bold text-[9.5px] hover:bg-cyan-500/30 cursor-pointer"
            >
              Download Latest CSV
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 5. COMPLIANCE & AUDIT VIEW
  return (
    <div className="flex-1 min-h-0 flex flex-col p-3 gap-2 overflow-y-auto custom-scrollbar select-none">
      <div className="pb-2 border-b border-[#00f0ff]/20">
        <h2 className="text-[13px] font-bold text-white uppercase tracking-wider">
          COMPLIANCE, DATA GOVERNANCE &amp; SENSOR AUDIT
        </h2>
        <span className="text-[9.5px] text-slate-400">
          Sensor calibration records, provenance verification, and climate simulation model versioning
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <div className="p-3 rounded-xl bg-[#030d1d]/85 border border-[#00f0ff]/15 space-y-2">
          <span className="text-[11px] font-bold text-white uppercase tracking-wider block">
            Integrated Data Sources &amp; Telemetry
          </span>
          <div className="space-y-1 text-[9.5px] text-slate-300 font-mono">
            <div>• <strong>IMD:</strong> India Meteorological Department Automated Weather Stations (AWS)</div>
            <div>• <strong>ISRO Bhuvan:</strong> Landsat-8 / Sentinel-2 Thermal Radiance (LST &amp; NDVI)</div>
            <div>• <strong>CGWB:</strong> Central Ground Water Board Piezometric Telemetry</div>
            <div>• <strong>CPCB:</strong> National Ambient Air Quality Index (NAAQI) Continuous Monitoring</div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#030d1d]/85 border border-[#00f0ff]/15 space-y-2">
          <span className="text-[11px] font-bold text-white uppercase tracking-wider block">
            Digital Twin Model Architecture
          </span>
          <div className="space-y-1 text-[9.5px] text-slate-300 font-mono">
            <div>• <strong>Core Model:</strong> Climate Digital Twin v2.1.0</div>
            <div>• <strong>Spatial Resolution:</strong> 1 km² Downscaled Ensemble</div>
            <div>• <strong>Temporal Extent:</strong> 2010–2024 Observational Baseline</div>
            <div>• <strong>Review State:</strong> Verified Scientific Climatology</div>
          </div>
        </div>
      </div>
    </div>
  );
};
