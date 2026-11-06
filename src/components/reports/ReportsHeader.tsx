import React from 'react';
import {
  FileText,
  FileSpreadsheet,
  Presentation,
  FileCode,
  Calendar,
  Sparkles,
  ChevronDown,
  Layers,
  FileDown
} from 'lucide-react';
import { ReportType, ReportFormat } from '../../types/reports';
import { DISTRICTS_LIST } from '../../data/telanganaGeo';

interface ReportsHeaderProps {
  reportType: ReportType;
  onSelectReportType: (t: ReportType) => void;
  selectedDistrictId: string;
  onSelectDistrict: (id: string) => void;
  timePeriod: string;
  onSelectTimePeriod: (p: string) => void;
  dateRange: string;
  onDateRangeChange: (r: string) => void;
  selectedFormat: ReportFormat;
  onSelectFormat: (f: ReportFormat) => void;
  onAutoInsights: () => void;
  onGenerateReport: () => void;
  isGenerating?: boolean;
}

export const ReportsHeader: React.FC<ReportsHeaderProps> = ({
  reportType,
  onSelectReportType,
  selectedDistrictId,
  onSelectDistrict,
  timePeriod,
  onSelectTimePeriod,
  dateRange,
  onDateRangeChange,
  selectedFormat,
  onSelectFormat,
  onAutoInsights,
  onGenerateReport,
  isGenerating = false,
}) => {
  return (
    <div className="shrink-0 px-3 py-2 bg-[#030914] border-b border-[#00f0ff]/15 flex items-center justify-between gap-3 select-none">
      {/* ── Left Title with Circular Cyan Emblem ── */}
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-8 h-8 rounded-lg bg-[#00f0ff]/10 border border-[#00f0ff]/40 flex items-center justify-center text-[#00f0ff] shadow-[0_0_12px_rgba(0,240,255,0.25)] shrink-0">
          <FileText className="w-4 h-4 text-[#00f0ff]" />
        </div>
        <div className="flex flex-col min-w-0">
          <h1 className="text-[13.5px] font-bold text-white tracking-wide leading-none font-sans">
            CLIMATE REPORTING CENTER
          </h1>
          <span className="text-[9.5px] text-slate-400 truncate mt-0.5 font-normal">
            Generate, review, and export district and state climate intelligence reports
          </span>
        </div>
      </div>

      {/* ── Right Controls (Two-Row Stack Matching Screenshot) ── */}
      <div className="flex flex-col gap-1.5 shrink-0">
        {/* Row 1: Dropdowns for Report Type, District, Time Period, Date Range */}
        <div className="flex items-center gap-2">
          {/* Report Type */}
          <div className="flex flex-col">
            <label className="text-[8px] uppercase tracking-wider text-slate-400 font-medium -mb-0.5">
              Report Type
            </label>
            <div className="relative">
              <select
                value={reportType}
                onChange={(e) => onSelectReportType(e.target.value as ReportType)}
                className="appearance-none bg-[#051428] border border-[#00f0ff]/30 text-white text-[10px] font-semibold rounded px-2.5 py-0.5 pr-6 hover:border-[#00f0ff] focus:outline-none cursor-pointer"
              >
                <option value="District Climate Summary">District Climate Summary</option>
                <option value="Annual Rainfall Report">Annual Rainfall Report</option>
                <option value="Extreme Events Report">Extreme Events Report</option>
                <option value="Prediction Outlook Report">Prediction Outlook Report</option>
                <option value="Simulation Impact Report">Simulation Impact Report</option>
                <option value="Climate Risk Assessment">Climate Risk Assessment</option>
                <option value="State Climate Summary">State Climate Summary</option>
              </select>
              <ChevronDown className="w-3 h-3 text-cyan-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* District */}
          <div className="flex flex-col">
            <label className="text-[8px] uppercase tracking-wider text-slate-400 font-medium -mb-0.5">
              District
            </label>
            <div className="relative">
              <select
                value={selectedDistrictId}
                onChange={(e) => onSelectDistrict(e.target.value)}
                className="appearance-none bg-[#051428] border border-[#00f0ff]/30 text-white text-[10px] font-semibold rounded px-2.5 py-0.5 pr-6 hover:border-[#00f0ff] focus:outline-none cursor-pointer"
              >
                <option value="all">All Districts (State Avg)</option>
                {DISTRICTS_LIST.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 text-cyan-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Time Period */}
          <div className="flex flex-col">
            <label className="text-[8px] uppercase tracking-wider text-slate-400 font-medium -mb-0.5">
              Time Period
            </label>
            <div className="relative">
              <select
                value={timePeriod}
                onChange={(e) => onSelectTimePeriod(e.target.value)}
                className="appearance-none bg-[#051428] border border-[#00f0ff]/30 text-white text-[10px] font-semibold rounded px-2.5 py-0.5 pr-6 hover:border-[#00f0ff] focus:outline-none cursor-pointer"
              >
                <option value="2010 - 2024">2010 - 2024</option>
                <option value="2015 - 2024">2015 - 2024</option>
                <option value="2020 - 2024">2020 - 2024</option>
                <option value="2010 - 2026">2010 - 2026</option>
              </select>
              <ChevronDown className="w-3 h-3 text-cyan-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Date Range Input */}
          <div className="flex flex-col">
            <label className="text-[8px] uppercase tracking-wider text-slate-400 font-medium -mb-0.5">
              Date Range
            </label>
            <div className="flex items-center gap-1.5 bg-[#051428] border border-[#00f0ff]/30 rounded px-2 py-0.5 text-[10px] text-white">
              <Calendar className="w-3 h-3 text-cyan-400 shrink-0" />
              <input
                type="text"
                value={dateRange}
                onChange={(e) => onDateRangeChange(e.target.value)}
                className="bg-transparent border-none text-white text-[9.5px] focus:outline-none font-mono w-[160px]"
              />
            </div>
          </div>
        </div>

        {/* Row 2: Format Buttons + Auto Insights + Generate Report Button */}
        <div className="flex items-center justify-end gap-2">
          {/* Format label & 4 buttons */}
          <span className="text-[9px] text-slate-400 uppercase font-medium">Format:</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onSelectFormat('pdf')}
              className={`px-2 py-0.5 rounded text-[9.5px] font-bold flex items-center gap-1 border transition-all cursor-pointer ${
                selectedFormat === 'pdf'
                  ? 'bg-red-500/20 border-red-500 text-red-300 shadow-[0_0_8px_rgba(239,68,68,0.3)]'
                  : 'bg-[#051428] border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-2.5 h-2.5 text-red-400" />
              <span>PDF</span>
            </button>

            <button
              onClick={() => onSelectFormat('xlsx')}
              className={`px-2 py-0.5 rounded text-[9.5px] font-bold flex items-center gap-1 border transition-all cursor-pointer ${
                selectedFormat === 'xlsx'
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.3)]'
                  : 'bg-[#051428] border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              <FileSpreadsheet className="w-2.5 h-2.5 text-emerald-400" />
              <span>XLSX</span>
            </button>

            <button
              onClick={() => onSelectFormat('ppt')}
              className={`px-2 py-0.5 rounded text-[9.5px] font-bold flex items-center gap-1 border transition-all cursor-pointer ${
                selectedFormat === 'ppt'
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.3)]'
                  : 'bg-[#051428] border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              <Presentation className="w-2.5 h-2.5 text-amber-400" />
              <span>PPT</span>
            </button>

            <button
              onClick={() => onSelectFormat('csv')}
              className={`px-2 py-0.5 rounded text-[9.5px] font-bold flex items-center gap-1 border transition-all cursor-pointer ${
                selectedFormat === 'csv'
                  ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-[0_0_8px_rgba(0,240,255,0.3)]'
                  : 'bg-[#051428] border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              <FileCode className="w-2.5 h-2.5 text-cyan-400" />
              <span>CSV</span>
            </button>
          </div>

          {/* Auto Insights button */}
          <button
            onClick={onAutoInsights}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#071d3a] hover:bg-[#0b2b54] border border-[#00f0ff]/30 text-[#00f0ff] font-bold text-[10px] transition-all cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-[#00f0ff]" />
            <span>Auto Insights</span>
          </button>

          {/* Primary Generate Report button */}
          <button
            onClick={onGenerateReport}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-gradient-to-r from-[#00b4d8] to-[#00f0ff] hover:from-[#0096c7] hover:to-[#00d4ff] text-[#020810] font-extrabold text-[10.5px] shadow-[0_0_12px_rgba(0,240,255,0.4)] transition-all cursor-pointer"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>{isGenerating ? 'GENERATING...' : 'Generate Report'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
