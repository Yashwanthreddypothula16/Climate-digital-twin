import React, { useMemo, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Thermometer,
  CloudRain,
  AlertTriangle,
  Users,
  Flame,
  Waves,
  Sprout,
  Building2,
  MapPin,
  TrendingUp,
  Layers,
  FileText
} from 'lucide-react';
import { DistrictReportData, ReportConfigurationState } from '../../types/reports';
import { ReportMiniMap } from './ReportMiniMap';

interface ReportPreviewPanelProps {
  data: DistrictReportData;
  config: ReportConfigurationState;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const ReportPreviewPanel: React.FC<ReportPreviewPanelProps> = ({
  data,
  config,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Mini Temperature Trend chart for report document
  const tempChartOption = useMemo(() => {
    return {
      backgroundColor: 'transparent',
      tooltip: { trigger: 'axis', textStyle: { fontSize: 8 } },
      grid: { top: 16, bottom: 18, left: 24, right: 10 },
      xAxis: {
        type: 'category',
        data: data.tempTrend.years,
        axisLine: { lineStyle: { color: '#94A3B8' } },
        axisLabel: { color: '#475569', fontSize: 7 },
      },
      yAxis: {
        type: 'value',
        min: 15,
        max: 45,
        interval: 10,
        splitLine: { lineStyle: { color: '#E2E8F0' } },
        axisLabel: { color: '#475569', fontSize: 7 },
      },
      series: [
        {
          name: 'Maximum',
          type: 'line',
          data: data.tempTrend.max,
          smooth: true,
          showSymbol: false,
          itemStyle: { color: '#EF4444' },
          lineStyle: { width: 1.5 },
        },
        {
          name: 'Average',
          type: 'line',
          data: data.tempTrend.avg,
          smooth: true,
          showSymbol: false,
          itemStyle: { color: '#F59E0B' },
          lineStyle: { width: 1.5 },
        },
        {
          name: 'Minimum',
          type: 'line',
          data: data.tempTrend.min,
          smooth: true,
          showSymbol: false,
          itemStyle: { color: '#0284C7' },
          lineStyle: { width: 1.5 },
        },
      ],
    };
  }, [data]);

  // Mini Rainfall Trend chart for report document
  const rainfallChartOption = useMemo(() => {
    return {
      backgroundColor: 'transparent',
      tooltip: { trigger: 'axis', textStyle: { fontSize: 8 } },
      grid: { top: 16, bottom: 18, left: 28, right: 10 },
      xAxis: {
        type: 'category',
        data: data.rainfallTrend.years,
        axisLine: { lineStyle: { color: '#94A3B8' } },
        axisLabel: { color: '#475569', fontSize: 7 },
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: 1500,
        interval: 500,
        splitLine: { lineStyle: { color: '#E2E8F0' } },
        axisLabel: { color: '#475569', fontSize: 7 },
      },
      series: [
        {
          name: 'Rainfall',
          type: 'bar',
          data: data.rainfallTrend.values,
          barWidth: '45%',
          itemStyle: {
            color: '#0284C7',
            borderRadius: [2, 2, 0, 0],
          },
        },
      ],
    };
  }, [data]);

  return (
    <div className={`relative rounded-xl overflow-hidden bg-[#030914] border border-[#00f0ff]/20 flex flex-col shadow-xl select-none ${
      isExpanded ? 'fixed inset-4 z-50' : 'w-full h-full'
    }`}>
      {/* ── Top Header Bar ── */}
      <div className="shrink-0 px-3 py-1.5 bg-gradient-to-r from-[#030d1d] to-[#04152d] border-b border-[#00f0ff]/15 flex items-center justify-between">
        <span className="text-[10.5px] font-bold text-slate-200 uppercase tracking-wider font-sans">
          REPORT PREVIEW — {data.name} DISTRICT
        </span>
        <span className="text-[9px] font-mono text-[#00f0ff]/80">
          Executive Climatology Template
        </span>
      </div>

      {/* ── Center Document Viewport ── */}
      <div className="flex-1 min-h-0 bg-[#020710] p-3 overflow-y-auto overflow-x-hidden flex items-start justify-center custom-scrollbar">
        {/* Printable White Report Page Container */}
        <div
          style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
          className="w-full max-w-[640px] bg-[#FFFFFF] text-slate-800 rounded-md shadow-2xl p-4 flex flex-col gap-2.5 transition-transform duration-200"
        >
          {/* Document Header */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center shadow-sm">
                <span className="text-[10px] font-extrabold text-[#050C14]">☀️</span>
              </div>
              <div className="leading-tight">
                <span className="text-[9.5px] font-extrabold text-blue-950 uppercase tracking-wide block">
                  CLIMATE DIGITAL TWIN
                </span>
                <span className="text-[7.5px] font-semibold text-blue-700 tracking-wider block">
                  TELANGANA STATE, INDIA
                </span>
              </div>
            </div>

            <div className="text-right leading-tight">
              <span className="text-[9px] font-bold text-slate-800 block">
                District Climate Summary Report
              </span>
              <span className="text-[8px] font-mono text-slate-500 block">
                2010 – 2024
              </span>
            </div>
          </div>

          {/* Hero Banner with Skyline Photo */}
          <div className="relative rounded-lg overflow-hidden h-[125px] w-full bg-[#0a2342] shadow-md flex flex-col justify-end p-3">
            {/* Background image */}
            <img
              src="/building.jpg"
              alt={data.name}
              className="absolute inset-0 w-full h-full object-cover opacity-85"
              onError={(e) => {
                // Fallback graceful gradient if image missing
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
            {/* Dark overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#020b18]/95 via-[#020b18]/50 to-transparent" />

            {/* Banner text & metadata */}
            <div className="relative z-10">
              <h2 className="text-[17px] font-extrabold text-white tracking-wide uppercase leading-tight font-sans drop-shadow-md">
                {data.name} DISTRICT
              </h2>
              <span className="text-[10px] text-cyan-300 font-medium block drop-shadow">
                Climate Analysis & Risk Assessment
              </span>

              {/* Metadata row */}
              <div className="flex items-center gap-3 mt-1.5 pt-1.5 border-t border-white/20 text-[8.5px] font-mono text-slate-200">
                <span className="flex items-center gap-1">
                  📐 <strong>Area:</strong> {data.areaKm2} km²
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  👥 <strong>Population:</strong> {data.population}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  ⛰️ <strong>Elevation:</strong> {data.elevation} m
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  🏙️ <strong>District Type:</strong> {data.districtType}
                </span>
              </div>
            </div>
          </div>

          {/* Executive Summary + MiniMap & Stats Row */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* Executive Summary */}
            <div className="p-2 rounded bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div>
                <span className="text-[8.5px] font-extrabold text-blue-900 uppercase tracking-wider block mb-1">
                  EXECUTIVE SUMMARY
                </span>
                <p className="text-[8px] text-slate-700 leading-relaxed font-sans">
                  {data.executiveSummary}
                </p>
              </div>
              <div className="mt-2 pt-1 border-t border-slate-200 text-[7.5px] text-slate-500 font-mono">
                Source: IMD AWS Network • ISRO LST Telemetry
              </div>
            </div>

            {/* MiniMap + Key Stats */}
            <div className="grid grid-cols-2 gap-1.5">
              {/* Map */}
              <div className="flex flex-col">
                <span className="text-[8px] font-bold text-slate-700 uppercase tracking-wider block mb-0.5">
                  DISTRICT MAP — {data.name}
                </span>
                <div className="flex-1 min-h-[90px]">
                  <ReportMiniMap selectedDistrictId={data.id} selectedDistrictName={data.name} />
                </div>
              </div>

              {/* Key Statistics */}
              <div className="flex flex-col justify-between bg-blue-50/50 p-1.5 rounded border border-blue-100">
                <span className="text-[8px] font-extrabold text-blue-950 uppercase tracking-wider block">
                  KEY STATISTICS
                </span>

                <div className="space-y-1 text-[8px] font-sans">
                  <div>
                    <span className="text-red-700 font-extrabold text-[9px] block">
                      🌡️ {data.stats.avgTemp} °C
                    </span>
                    <span className="text-slate-600 block text-[7px] -mt-0.5">
                      Avg. Temperature ({data.stats.tempDelta})
                    </span>
                  </div>

                  <div>
                    <span className="text-blue-700 font-extrabold text-[9px] block">
                      💧 {data.stats.totalRain} mm
                    </span>
                    <span className="text-slate-600 block text-[7px] -mt-0.5">
                      Total Annual Rainfall ({data.stats.rainDelta})
                    </span>
                  </div>

                  <div>
                    <span className="text-amber-700 font-extrabold text-[9px] block">
                      ⚠️ {data.stats.extremeEvents}
                    </span>
                    <span className="text-slate-600 block text-[7px] -mt-0.5">
                      Extreme Events ({data.stats.extremeDelta})
                    </span>
                  </div>

                  <div>
                    <span className="text-emerald-700 font-extrabold text-[9px] block">
                      👥 {data.stats.populationUhi}
                    </span>
                    <span className="text-slate-600 block text-[7px] -mt-0.5">
                      Population Exposure ({data.stats.uhiDelta})
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Temperature & Rainfall Mini Charts */}
          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200">
            {/* Temperature Trend */}
            <div className="p-1.5 rounded bg-slate-50 border border-slate-200 flex flex-col">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-[8px] font-bold text-slate-800 uppercase tracking-wider">
                  TEMPERATURE TREND (2010 - 2024)
                </span>
                <div className="flex items-center gap-1 text-[6.5px] font-mono text-slate-500">
                  <span className="text-amber-600 font-bold">• Avg</span>
                  <span className="text-red-600 font-bold">• Max</span>
                  <span className="text-blue-600 font-bold">• Min</span>
                </div>
              </div>
              <div className="h-[75px] w-full">
                <ReactECharts option={tempChartOption} style={{ height: '100%', width: '100%' }} />
              </div>
            </div>

            {/* Annual Rainfall Trend */}
            <div className="p-1.5 rounded bg-slate-50 border border-slate-200 flex flex-col relative">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-[8px] font-bold text-slate-800 uppercase tracking-wider">
                  ANNUAL RAINFALL TREND (2010 - 2024)
                </span>
                <span className="px-1 py-0.2 rounded bg-emerald-600 text-white text-[6.5px] font-bold font-mono">
                  {data.stats.totalRain} mm
                </span>
              </div>
              <div className="h-[75px] w-full">
                <ReactECharts option={rainfallChartOption} style={{ height: '100%', width: '100%' }} />
              </div>
            </div>
          </div>

          {/* Climate Risk Summary Cards */}
          <div className="pt-1 border-t border-slate-200">
            <span className="text-[8px] font-bold text-slate-800 uppercase tracking-wider block mb-1">
              CLIMATE RISK SUMMARY
            </span>
            <div className="grid grid-cols-4 gap-1.5">
              <div className="p-1.5 rounded bg-[#0A192F] text-white flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <div className="leading-tight">
                  <span className="text-[6.5px] text-slate-400 uppercase block">Heatwave Risk</span>
                  <span className="text-[8.5px] font-bold text-red-400">{data.risks.heatwave.level}</span>
                </div>
              </div>

              <div className="p-1.5 rounded bg-[#0A192F] text-white flex items-center gap-1.5">
                <Waves className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <div className="leading-tight">
                  <span className="text-[6.5px] text-slate-400 uppercase block">Flood Risk</span>
                  <span className="text-[8.5px] font-bold text-amber-400">{data.risks.flood.level}</span>
                </div>
              </div>

              <div className="p-1.5 rounded bg-[#0A192F] text-white flex items-center gap-1.5">
                <Sprout className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <div className="leading-tight">
                  <span className="text-[6.5px] text-slate-400 uppercase block">Drought Risk</span>
                  <span className="text-[8.5px] font-bold text-emerald-400">{data.risks.drought.level}</span>
                </div>
              </div>

              <div className="p-1.5 rounded bg-[#0A192F] text-white flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <div className="leading-tight">
                  <span className="text-[6.5px] text-slate-400 uppercase block">Urban Heat Island</span>
                  <span className="text-[8.5px] font-bold text-rose-400">{data.risks.uhi.level}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Document Footer */}
          <div className="mt-1 pt-1.5 border-t border-slate-200 flex items-center justify-between text-[7px] text-slate-500 font-mono">
            <span>Data Sources: IMD | ISRO | NASA | ERA5 | Sentinel-2 | Telangana SDMA</span>
            <span>Report Generated: {data.compliance.generatedOn}</span>
            <span>Page {currentPage} of {totalPages}</span>
          </div>
        </div>
      </div>

      {/* ── Document Bottom Controls Toolbar ── */}
      <div className="shrink-0 px-3 py-1 bg-[#020710] border-t border-[#00f0ff]/15 flex items-center justify-center gap-3 text-[10px] text-slate-400">
        {/* Pagination */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            className="w-5 h-5 flex items-center justify-center rounded hover:bg-white/10 text-slate-300 hover:text-white"
          >
            <ChevronLeft className="w-3 h-3" />
          </button>
          <span className="font-mono text-[9.5px] text-slate-300 px-1">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            className="w-5 h-5 flex items-center justify-center rounded hover:bg-white/10 text-slate-300 hover:text-white"
          >
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <span className="text-white/20">|</span>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setZoomLevel((prev) => Math.max(60, prev - 10))}
            className="w-5 h-5 flex items-center justify-center rounded hover:bg-white/10 text-slate-300 hover:text-white"
          >
            <ZoomOut className="w-3 h-3" />
          </button>
          <span className="font-mono text-[9.5px] text-[#00f0ff] min-w-[36px] text-center">
            {zoomLevel}%
          </span>
          <button
            onClick={() => setZoomLevel((prev) => Math.min(160, prev + 10))}
            className="w-5 h-5 flex items-center justify-center rounded hover:bg-white/10 text-slate-300 hover:text-white"
          >
            <ZoomIn className="w-3 h-3" />
          </button>
        </div>

        <span className="text-white/20">|</span>

        {/* Fit / Expand Preview */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-white/10 text-slate-300 hover:text-[#00f0ff] transition-colors"
        >
          {isExpanded ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
          <span className="text-[9px]">{isExpanded ? 'Restore' : 'Expand'}</span>
        </button>
      </div>
    </div>
  );
};
