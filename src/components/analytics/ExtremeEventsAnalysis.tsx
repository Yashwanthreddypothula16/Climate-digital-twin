import React, { useState, useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { AlertTriangle, Flame, CloudLightning, Waves, SunMedium, Wind, ShieldAlert, Clock, Calendar } from 'lucide-react';
import { DistrictAnalyticsData, ExtremeEventType } from '../../types/analytics';

interface ExtremeEventsAnalysisProps {
  data: DistrictAnalyticsData;
}

export const ExtremeEventsAnalysis: React.FC<ExtremeEventsAnalysisProps> = ({ data }) => {
  const [selectedCategory, setSelectedCategory] = useState<ExtremeEventType>('heatwaves');

  const categoryMeta: { id: ExtremeEventType; label: string; icon: React.ComponentType<{ className?: string }>; color: string }[] = [
    { id: 'heatwaves', label: 'Heatwaves', icon: Flame, color: '#EF4444' },
    { id: 'heavy_rainfall', label: 'Heavy Rainfall', icon: CloudLightning, color: '#00F0FF' },
    { id: 'floods', label: 'Floods', icon: Waves, color: '#3B82F6' },
    { id: 'droughts', label: 'Droughts', icon: SunMedium, color: '#F59E0B' },
    { id: 'extreme_wind', label: 'Extreme Wind', icon: Wind, color: '#10B981' },
  ];

  const currentExtreme = data.extremes[selectedCategory];

  // Frequency by Year chart
  const frequencyOption = useMemo(() => {
    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(5, 14, 28, 0.95)',
        borderColor: '#00F0FF',
        borderWidth: 1,
        textStyle: { color: '#F1F5F9', fontSize: 10 },
      },
      grid: { top: 20, bottom: 22, left: 28, right: 15 },
      xAxis: {
        type: 'category',
        data: currentExtreme.annualFrequency.map(f => f.year),
        axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
        axisLabel: { color: '#64748B', fontSize: 8.5 },
      },
      yAxis: {
        type: 'value',
        interval: 1,
        splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } },
        axisLabel: { color: '#64748B', fontSize: 8.5 },
      },
      series: [
        {
          name: 'Recorded Events',
          type: 'bar',
          data: currentExtreme.annualFrequency.map(f => f.count),
          barWidth: '45%',
          itemStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: '#EF4444' },
                { offset: 1, color: '#991B1B' },
              ],
            },
            borderRadius: [3, 3, 0, 0],
          },
        },
      ],
    };
  }, [currentExtreme]);

  // Severity Distribution Pie
  const severityOption = useMemo(() => {
    const sev = currentExtreme.severityDistribution;
    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c}%',
        backgroundColor: 'rgba(5, 14, 28, 0.95)',
        borderColor: '#00F0FF',
        borderWidth: 1,
        textStyle: { color: '#F1F5F9', fontSize: 10 },
      },
      series: [
        {
          name: 'Severity',
          type: 'pie',
          radius: ['45%', '72%'],
          center: ['50%', '50%'],
          label: {
            show: true,
            position: 'outside',
            formatter: '{b}\n{c}%',
            color: '#94A3B8',
            fontSize: 8.5,
          },
          data: [
            { value: sev.mild, name: 'Mild', itemStyle: { color: '#10B981' } },
            { value: sev.moderate, name: 'Moderate', itemStyle: { color: '#F59E0B' } },
            { value: sev.severe, name: 'Severe', itemStyle: { color: '#F97316' } },
            { value: sev.extreme, name: 'Critical', itemStyle: { color: '#EF4444' } },
          ],
        },
      ],
    };
  }, [currentExtreme]);

  return (
    <div className="flex-1 min-h-0 flex flex-col gap-2 p-2 select-none overflow-y-auto custom-scrollbar">
      {/* ── Category Switcher Toolbar ── */}
      <div className="p-2.5 rounded-xl bg-[#030d1d]/90 border border-[#00f0ff]/20 flex items-center justify-between gap-3 shadow-lg shrink-0">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-[#00f0ff]" />
          <span className="text-[11px] font-bold text-white uppercase tracking-wider">
            EXTREME CLIMATE EVENTS — {data.name}
          </span>
        </div>

        <div className="flex items-center gap-1 bg-[#051428] border border-[#00f0ff]/20 rounded-lg p-1">
          {categoryMeta.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[10.5px] font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#00f0ff] text-[#020810] shadow-[0_0_10px_rgba(0,240,255,0.4)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 4 KPI Summary Cards for Selected Extreme ── */}
      <div className="grid grid-cols-4 gap-2 shrink-0">
        <div className="p-2.5 rounded-xl bg-[#030d1d]/80 border border-[#00f0ff]/15">
          <span className="text-[9px] text-slate-400 uppercase font-semibold">Total Recorded Events</span>
          <span className="text-[16px] font-bold text-white block mt-0.5">{currentExtreme.totalRecorded} Episodes</span>
          <span className="text-[8px] font-mono text-cyan-400">Recorded since 2015 IMD telemetry</span>
        </div>

        <div className="p-2.5 rounded-xl bg-[#030d1d]/80 border border-[#00f0ff]/15">
          <span className="text-[9px] text-slate-400 uppercase font-semibold">Peak Historical Record</span>
          <span className="text-[16px] font-bold text-red-400 block mt-0.5">{currentExtreme.highestRecorded}</span>
          <span className="text-[8px] font-mono text-slate-400">Station verified measurement</span>
        </div>

        <div className="p-2.5 rounded-xl bg-[#030d1d]/80 border border-[#00f0ff]/15">
          <span className="text-[9px] text-slate-400 uppercase font-semibold">Recurrence Interval</span>
          <span className="text-[16px] font-bold text-amber-400 block mt-0.5">Every {currentExtreme.recurrenceInterval}</span>
          <span className="text-[8px] font-mono text-slate-400">Poisson return probability</span>
        </div>

        <div className="p-2.5 rounded-xl bg-[#030d1d]/80 border border-[#00f0ff]/15">
          <span className="text-[9px] text-slate-400 uppercase font-semibold">Event Definition Threshold</span>
          <span className="text-[11px] font-bold text-slate-200 block mt-0.5 truncate">{currentExtreme.threshold}</span>
          <span className="text-[8px] font-mono text-emerald-400">IMD Standard Criterion</span>
        </div>
      </div>

      {/* ── Charts Row (Frequency Bar + Severity Pie) ── */}
      <div className="grid grid-cols-2 gap-2 min-h-[220px] shrink-0">
        <div className="p-2.5 rounded-xl bg-[#030d1d]/85 border border-[#00f0ff]/15 flex flex-col shadow-md">
          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1">
            ANNUAL EVENT FREQUENCY (2015 - 2026)
          </span>
          <div className="flex-1 min-h-0 w-full">
            <ReactECharts option={frequencyOption} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-[#030d1d]/85 border border-[#00f0ff]/15 flex flex-col shadow-md">
          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1">
            EVENT SEVERITY DISTRIBUTION PROFILE
          </span>
          <div className="flex-1 min-h-0 w-full">
            <ReactECharts option={severityOption} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>
      </div>

      {/* ── Historical Event Timeline Table ── */}
      <div className="p-2.5 rounded-xl bg-[#030d1d]/85 border border-[#00f0ff]/15 flex flex-col flex-1 min-h-[160px] shadow-md">
        <div className="flex items-center justify-between mb-1.5 shrink-0">
          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
            HISTORICAL EVENT TIMELINE & IMPACTED MANDALS — {data.name}
          </span>
          <span className="text-[8.5px] font-mono text-slate-400">IMD AWS Telemetry Archive</span>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto pr-1">
          <table className="w-full text-left text-[10px]">
            <thead className="bg-[#051428] text-slate-400 font-semibold border-b border-white/10 sticky top-0">
              <tr>
                <th className="py-1 px-2">Date</th>
                <th className="py-1 px-2">Intensity Measured</th>
                <th className="py-1 px-2">Duration</th>
                <th className="py-1 px-2">Classification</th>
                <th className="py-1 px-2">Impacted Watersheds / Mandals</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono text-slate-300">
              {currentExtreme.timeline.map((evt) => (
                <tr key={evt.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-1.5 px-2 text-white font-bold">{evt.date}</td>
                  <td className="py-1.5 px-2 text-[#00f0ff]">{evt.intensity}</td>
                  <td className="py-1.5 px-2 text-slate-400">{evt.duration}</td>
                  <td className="py-1.5 px-2">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[8.5px] font-bold uppercase ${
                        evt.severity === 'Critical'
                          ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                          : evt.severity === 'Severe'
                          ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40'
                          : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40'
                      }`}
                    >
                      {evt.severity}
                    </span>
                  </td>
                  <td className="py-1.5 px-2 text-slate-300">{evt.impactedAreas}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
