import React from 'react';
import {
  FileText,
  FileSpreadsheet,
  Presentation,
  FileCode,
  Download,
  Mail,
  Share2,
  CheckCircle,
  ChevronDown
} from 'lucide-react';
import { ReportFormat, DistrictReportData, ReportConfigurationState } from '../../types/reports';

interface ExportDeliveryPanelProps {
  selectedFormat: ReportFormat;
  onSelectFormat: (format: ReportFormat) => void;
  fileName: string;
  onFileNameChange: (name: string) => void;
  destination: string;
  onDestinationChange: (dest: string) => void;
  schedule: string;
  onScheduleChange: (sch: string) => void;
  emailRecipients: string;
  onEmailChange: (emails: string) => void;
  onExport: () => void;
  onQuickAction: (action: 'email' | 'share' | 'download') => void;
  data: DistrictReportData;
  isGenerating?: boolean;
}

export const ExportDeliveryPanel: React.FC<ExportDeliveryPanelProps> = ({
  selectedFormat,
  onSelectFormat,
  fileName,
  onFileNameChange,
  destination,
  onDestinationChange,
  schedule,
  onScheduleChange,
  emailRecipients,
  onEmailChange,
  onExport,
  onQuickAction,
  data,
  isGenerating = false,
}) => {
  const FORMATS: { id: ReportFormat; title: string; subtitle: string; icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>; color: string }[] = [
    { id: 'pdf', title: 'PDF', subtitle: 'Report', icon: FileText, color: '#EF4444' },
    { id: 'xlsx', title: 'XLSX', subtitle: 'Data Tables', icon: FileSpreadsheet, color: '#10B981' },
    { id: 'ppt', title: 'PPT', subtitle: 'Presentation', icon: Presentation, color: '#F59E0B' },
    { id: 'csv', title: 'CSV', subtitle: 'Raw Data', icon: FileCode, color: '#00F0FF' },
  ];

  return (
    <div className="w-full h-full rounded-xl overflow-hidden bg-[#030914] border border-[#00f0ff]/20 p-2.5 flex flex-col justify-between shadow-xl select-none">
      {/* ── Title ── */}
      <div>
        <span className="text-[10.5px] font-bold text-slate-200 uppercase tracking-wider block mb-2 font-sans">
          EXPORT & DELIVERY
        </span>

        {/* ── 4 Format Cards Row ── */}
        <div className="grid grid-cols-4 gap-1.5 mb-2.5">
          {FORMATS.map((fmt) => {
            const Icon = fmt.icon;
            const isSelected = selectedFormat === fmt.id;
            return (
              <button
                key={fmt.id}
                onClick={() => onSelectFormat(fmt.id)}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#00f0ff]/15 border-[#00f0ff] shadow-[0_0_12px_rgba(0,240,255,0.3)]'
                    : 'bg-[#051428] border-white/10 hover:border-white/20'
                }`}
              >
                <Icon className="w-4 h-4 mb-1" style={{ color: fmt.color }} />
                <span className="text-[10.5px] font-bold text-white leading-none">
                  {fmt.title}
                </span>
                <span className="text-[7.5px] text-slate-400 mt-0.5 leading-none">
                  {fmt.subtitle}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── File Name Input ── */}
        <div className="mb-2">
          <label className="text-[8.5px] uppercase tracking-wider text-slate-400 font-medium block mb-0.5">
            File Name
          </label>
          <input
            type="text"
            value={fileName}
            onChange={(e) => onFileNameChange(e.target.value)}
            className="w-full bg-[#051428] border border-[#00f0ff]/30 rounded px-2.5 py-1 text-[10px] text-white focus:outline-none focus:border-[#00f0ff] font-mono"
          />
        </div>

        {/* ── Destination & Schedule Row ── */}
        <div className="grid grid-cols-2 gap-2 mb-2">
          <div>
            <label className="text-[8.5px] uppercase tracking-wider text-slate-400 font-medium block mb-0.5">
              Destination
            </label>
            <div className="relative">
              <select
                value={destination}
                onChange={(e) => onDestinationChange(e.target.value)}
                className="w-full appearance-none bg-[#051428] border border-[#00f0ff]/30 text-white text-[9.5px] rounded px-2 py-1 pr-5 hover:border-[#00f0ff] cursor-pointer"
              >
                <option value="Local Download">Local Download</option>
                <option value="Cloud Archive">Cloud Archive</option>
                <option value="Direct Webhook">Direct Webhook</option>
              </select>
              <ChevronDown className="w-3 h-3 text-cyan-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="text-[8.5px] uppercase tracking-wider text-slate-400 font-medium block mb-0.5">
              Schedule (Optional)
            </label>
            <div className="relative">
              <select
                value={schedule}
                onChange={(e) => onScheduleChange(e.target.value)}
                className="w-full appearance-none bg-[#051428] border border-[#00f0ff]/30 text-white text-[9.5px] rounded px-2 py-1 pr-5 hover:border-[#00f0ff] cursor-pointer"
              >
                <option value="No Schedule">No Schedule</option>
                <option value="Daily 08:00 AM">Daily</option>
                <option value="Weekly (Monday)">Weekly</option>
                <option value="Monthly (1st)">Monthly</option>
              </select>
              <ChevronDown className="w-3 h-3 text-cyan-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* ── Email Recipients ── */}
        <div className="mb-2">
          <label className="text-[8.5px] uppercase tracking-wider text-slate-400 font-medium block mb-0.5">
            Email Recipients (Optional)
          </label>
          <input
            type="email"
            placeholder="Enter email addresses (comma separated)"
            value={emailRecipients}
            onChange={(e) => onEmailChange(e.target.value)}
            className="w-full bg-[#051428] border border-[#00f0ff]/30 rounded px-2.5 py-1 text-[9.5px] text-white placeholder-slate-500 focus:outline-none focus:border-[#00f0ff]"
          />
        </div>

        {/* ── Quick Action Buttons: Email, Share Link, Download ── */}
        <div className="grid grid-cols-3 gap-1.5 mb-2.5">
          <button
            onClick={() => onQuickAction('email')}
            className="py-1 px-2 rounded bg-[#051428] hover:bg-[#082244] border border-[#00f0ff]/30 text-slate-200 text-[9.5px] font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
          >
            <Mail className="w-3 h-3 text-[#00f0ff]" />
            <span>Email</span>
          </button>

          <button
            onClick={() => onQuickAction('share')}
            className="py-1 px-2 rounded bg-[#051428] hover:bg-[#082244] border border-[#00f0ff]/30 text-slate-200 text-[9.5px] font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
          >
            <Share2 className="w-3 h-3 text-[#00f0ff]" />
            <span>Share Link</span>
          </button>

          <button
            onClick={() => onQuickAction('download')}
            className="py-1 px-2 rounded bg-[#051428] hover:bg-[#082244] border border-[#00f0ff]/30 text-slate-200 text-[9.5px] font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
          >
            <Download className="w-3 h-3 text-[#00f0ff]" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* ── Status Card + Main Export Button ── */}
      <div className="space-y-2 pt-1 border-t border-white/10">
        {/* Status card */}
        <div className="p-2 rounded-lg bg-[#051428]/80 border border-white/10 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#00f0ff]/15 border border-[#00f0ff]/30 flex items-center justify-center text-[#00f0ff] shrink-0">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[8.5px] flex-1">
            <span className="text-slate-400 truncate">Last Generated:</span>
            <span className="text-white font-mono font-medium truncate">02:17 PM, 31 Aug 2026</span>
            <span className="text-slate-400 truncate">Status:</span>
            <span className="text-emerald-400 font-bold truncate">Ready</span>
            <span className="text-slate-400 truncate">Pages:</span>
            <span className="text-white font-mono truncate">14</span>
            <span className="text-slate-400 truncate">Size:</span>
            <span className="text-white font-mono truncate">4.8 MB</span>
          </div>
        </div>

        {/* Primary Export Button */}
        <button
          onClick={onExport}
          disabled={isGenerating}
          className="w-full py-2 bg-gradient-to-r from-[#00b4d8] to-[#00f0ff] hover:from-[#0096c7] hover:to-[#00d4ff] text-[#020810] font-extrabold text-[11px] rounded-lg shadow-[0_0_15px_rgba(0,240,255,0.4)] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{isGenerating ? 'GENERATING REPORT...' : 'EXPORT REPORT'}</span>
        </button>
      </div>
    </div>
  );
};
