import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import {
  Thermometer,
  CloudRain,
  AlertTriangle,
  Waves,
  CheckCircle,
  FileText,
  Shield,
  Activity,
  Layers,
  BarChart2
} from 'lucide-react';
import { DistrictReportData, GeneratedReportRecord } from '../../types/reports';

interface BottomPanelsProps {
  data: DistrictReportData;
  generatedFiles: GeneratedReportRecord[];
  onSelectFile: (file: GeneratedReportRecord) => void;
  onViewAllFindings: () => void;
  onViewAllVisuals: () => void;
  onViewAllFiles: () => void;
}

export const ReportBottomPanels: React.FC<BottomPanelsProps> = ({
  data,
  generatedFiles,
  onSelectFile,
  onViewAllFindings,
  onViewAllVisuals,
  onViewAllFiles,
}) => {
  // Mini charts for Included Visuals grid
  const miniLineOption = (color: string) => ({
    backgroundColor: 'transparent',
    grid: { top: 4, bottom: 4, left: 4, right: 4 },
    xAxis: { type: 'category', show: false, data: [1, 2, 3, 4, 5, 6, 7] },
    yAxis: { type: 'value', show: false },
    series: [{
      type: 'line',
      data: [20, 24, 22, 28, 25, 30, 32],
      smooth: true,
      showSymbol: false,
      itemStyle: { color },
      lineStyle: { width: 1.5 },
    }],
  });

  const miniBarOption = (color: string) => ({
    backgroundColor: 'transparent',
    grid: { top: 4, bottom: 4, left: 4, right: 4 },
    xAxis: { type: 'category', show: false, data: [1, 2, 3, 4, 5, 6, 7] },
    yAxis: { type: 'value', show: false },
    series: [{
      type: 'bar',
      data: [12, 18, 14, 22, 20, 26, 24],
      itemStyle: { color, borderRadius: [1, 1, 0, 0] },
      barWidth: '55%',
    }],
  });

  return (
    <div className="grid grid-cols-5 gap-1.5 w-full flex-1 min-h-[160px] select-none shrink-0">
      {/* ── 1. KEY FINDINGS ── */}
      <div className="p-2.5 rounded-xl bg-[#030d1d]/85 border border-[#00f0ff]/15 flex flex-col justify-between shadow-md">
        <div className="flex items-center justify-between mb-1 shrink-0">
          <span className="text-[9.5px] font-bold text-slate-200 uppercase tracking-wider font-sans">
            KEY FINDINGS
          </span>
          <button
            onClick={onViewAllFindings}
            className="text-[8.5px] text-[#00f0ff] hover:underline cursor-pointer"
          >
            View All
          </button>
        </div>

        <div className="space-y-1.5 flex-1 min-h-0 overflow-y-auto pr-0.5 custom-scrollbar">
          {data.keyFindings.map((kf) => (
            <div key={kf.id} className="flex items-start gap-1.5 leading-tight">
              <div
                className="w-4 h-4 rounded flex items-center justify-center shrink-0 mt-0.5"
                style={{ backgroundColor: `${kf.color}20`, color: kf.color }}
              >
                {kf.icon === 'temp' && <Thermometer className="w-2.5 h-2.5" />}
                {kf.icon === 'rain' && <CloudRain className="w-2.5 h-2.5" />}
                {kf.icon === 'alert' && <AlertTriangle className="w-2.5 h-2.5" />}
                {kf.icon === 'flood' && <Waves className="w-2.5 h-2.5" />}
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[8.5px] font-bold text-white block truncate">
                  {kf.title}
                </span>
                <span className="text-[7.5px] text-slate-400 line-clamp-2">
                  {kf.description}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 2. INCLUDED VISUALS ── */}
      <div className="p-2.5 rounded-xl bg-[#030d1d]/85 border border-[#00f0ff]/15 flex flex-col justify-between shadow-md">
        <div className="flex items-center justify-between mb-1 shrink-0">
          <span className="text-[9.5px] font-bold text-slate-200 uppercase tracking-wider font-sans">
            INCLUDED VISUALS
          </span>
          <button
            onClick={onViewAllVisuals}
            className="text-[8.5px] text-[#00f0ff] hover:underline cursor-pointer"
          >
            View All
          </button>
        </div>

        {/* 3x2 Miniature Visuals Grid */}
        <div className="grid grid-cols-3 gap-1 flex-1 min-h-0">
          <div className="p-1 rounded bg-[#051428] border border-white/5 flex flex-col">
            <span className="text-[6.5px] text-slate-400 truncate block">Temperature Trend</span>
            <div className="flex-1 min-h-[22px]">
              <ReactECharts option={miniLineOption('#EF4444')} style={{ height: '100%', width: '100%' }} />
            </div>
          </div>

          <div className="p-1 rounded bg-[#051428] border border-white/5 flex flex-col">
            <span className="text-[6.5px] text-slate-400 truncate block">Rainfall Trend</span>
            <div className="flex-1 min-h-[22px]">
              <ReactECharts option={miniBarOption('#00F0FF')} style={{ height: '100%', width: '100%' }} />
            </div>
          </div>

          <div className="p-1 rounded bg-[#051428] border border-white/5 flex flex-col">
            <span className="text-[6.5px] text-slate-400 truncate block">Humidity Analysis</span>
            <div className="flex-1 min-h-[22px]">
              <ReactECharts option={miniLineOption('#10B981')} style={{ height: '100%', width: '100%' }} />
            </div>
          </div>

          <div className="p-1 rounded bg-[#051428] border border-white/5 flex flex-col">
            <span className="text-[6.5px] text-slate-400 truncate block">District Comparison</span>
            <div className="flex-1 min-h-[22px]">
              <ReactECharts option={miniBarOption('#F59E0B')} style={{ height: '100%', width: '100%' }} />
            </div>
          </div>

          <div className="p-1 rounded bg-[#051428] border border-white/5 flex flex-col items-center justify-center relative overflow-hidden">
            <span className="text-[6.5px] text-slate-400 truncate block absolute top-1 left-1">Risk Map</span>
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-500 via-amber-400 to-red-500 opacity-80 mt-2" />
          </div>

          <div className="p-1 rounded bg-[#051428] border border-white/5 flex flex-col">
            <span className="text-[6.5px] text-slate-400 truncate block">Extreme Events</span>
            <div className="flex-1 min-h-[22px]">
              <ReactECharts option={miniBarOption('#EF4444')} style={{ height: '100%', width: '100%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. REPORT SUMMARY ── */}
      <div className="p-2.5 rounded-xl bg-[#030d1d]/85 border border-[#00f0ff]/15 flex flex-col justify-between shadow-md">
        <span className="text-[9.5px] font-bold text-slate-200 uppercase tracking-wider block mb-1 shrink-0 font-sans">
          REPORT SUMMARY
        </span>

        {/* 4 Summary Blocks Grid */}
        <div className="grid grid-cols-2 gap-1.5 flex-1 min-h-0">
          <div className="p-1.5 rounded bg-[#051428]/60 border border-white/5 flex items-center gap-1.5">
            <Thermometer className="w-3.5 h-3.5 text-red-400 shrink-0" />
            <div className="min-w-0">
              <span className="text-[11px] font-bold text-white block leading-none font-sans">
                {data.reportSummary.avgTemp} °C
              </span>
              <span className="text-[7px] text-slate-400 truncate block mt-0.5">
                Avg. Temperature ({data.reportSummary.tempDelta})
              </span>
            </div>
          </div>

          <div className="p-1.5 rounded bg-[#051428]/60 border border-white/5 flex items-center gap-1.5">
            <CloudRain className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <div className="min-w-0">
              <span className="text-[11px] font-bold text-white block leading-none font-sans">
                {data.reportSummary.totalRain} mm
              </span>
              <span className="text-[7px] text-slate-400 truncate block mt-0.5">
                Total Rainfall ({data.reportSummary.rainDelta})
              </span>
            </div>
          </div>

          <div className="p-1.5 rounded bg-[#051428]/60 border border-white/5 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <div className="min-w-0">
              <span className="text-[11px] font-bold text-white block leading-none font-sans">
                {data.reportSummary.extremeEvents}
              </span>
              <span className="text-[7px] text-slate-400 truncate block mt-0.5">
                Extreme Events ({data.reportSummary.extremeDelta})
              </span>
            </div>
          </div>

          <div className="p-1.5 rounded bg-[#051428]/60 border border-white/5 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <div className="min-w-0">
              <span className="text-[11px] font-bold text-amber-400 block leading-none font-sans">
                {data.reportSummary.climateRiskLevel}
              </span>
              <span className="text-[7px] text-slate-400 truncate block mt-0.5">
                Climate Risk Level
              </span>
            </div>
          </div>
        </div>

        {/* 2040 Forecast Strip */}
        <div className="mt-1.5 pt-1.5 border-t border-white/10 flex items-center gap-1.5 text-[8.5px]">
          <span className="text-emerald-400 font-bold font-mono">
            {data.reportSummary.forecast2040}
          </span>
          <span className="text-slate-400 font-sans">
            2040 Forecast ({data.reportSummary.forecastChange})
          </span>
        </div>
      </div>

      {/* ── 4. GENERATED FILES ── */}
      <div className="p-2.5 rounded-xl bg-[#030d1d]/85 border border-[#00f0ff]/15 flex flex-col justify-between shadow-md">
        <div className="flex items-center justify-between mb-1 shrink-0">
          <span className="text-[9.5px] font-bold text-slate-200 uppercase tracking-wider font-sans">
            GENERATED FILES
          </span>
          <button
            onClick={onViewAllFiles}
            className="text-[8.5px] text-[#00f0ff] hover:underline cursor-pointer"
          >
            View All
          </button>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto pr-0.5 custom-scrollbar">
          <table className="w-full text-left text-[8px]">
            <thead className="text-slate-500 font-semibold border-b border-white/10">
              <tr>
                <th className="py-0.5 px-1">File Name</th>
                <th className="py-0.5 px-1">District</th>
                <th className="py-0.5 px-1">Date</th>
                <th className="py-0.5 px-1">Type</th>
                <th className="py-0.5 px-1 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono text-slate-300">
              {generatedFiles.slice(0, 4).map((file) => (
                <tr
                  key={file.id}
                  onClick={() => onSelectFile(file)}
                  className="hover:bg-white/5 cursor-pointer transition-colors"
                >
                  <td className="py-1 px-1 font-sans font-medium text-white truncate max-w-[65px]">
                    {file.name}
                  </td>
                  <td className="py-1 px-1 text-slate-400 truncate max-w-[50px]">
                    {file.district}
                  </td>
                  <td className="py-1 px-1 text-slate-400 truncate">
                    {file.date}
                  </td>
                  <td className="py-1 px-1 text-cyan-400 font-bold">
                    {file.type}
                  </td>
                  <td className="py-1 px-1 text-right text-emerald-400 font-bold">
                    ✓ {file.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 5. COMPLIANCE & VERSION INFO ── */}
      <div className="p-2.5 rounded-xl bg-[#030d1d]/85 border border-[#00f0ff]/15 flex flex-col justify-between shadow-md">
        <span className="text-[9.5px] font-bold text-slate-200 uppercase tracking-wider block mb-1 shrink-0 font-sans">
          COMPLIANCE & VERSION INFO
        </span>

        <div className="grid grid-cols-2 gap-2 text-[8px] flex-1">
          {/* Left Column */}
          <div className="space-y-1.5 font-mono">
            <div>
              <span className="text-slate-400 block font-sans text-[7.5px]">Model Version</span>
              <span className="text-white font-semibold">{data.compliance.modelVersion}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-sans text-[7.5px]">Generated On</span>
              <span className="text-slate-300">{data.compliance.generatedOn}</span>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-1.5 font-mono">
            <div>
              <span className="text-slate-400 block font-sans text-[7.5px]">Data Sources</span>
              <span className="text-cyan-300 text-[7px] leading-tight block">
                {data.compliance.dataSources}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-sans text-[7.5px]">Report Review</span>
              <div className="flex items-center gap-1 text-amber-400 font-semibold font-sans">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                <span>{data.compliance.reviewStatus}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
