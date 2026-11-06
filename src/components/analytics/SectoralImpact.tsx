import React, { useState, useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { Building2, Sprout, Droplet, Hammer, HeartPulse, ShieldAlert, CheckCircle, AlertCircle } from 'lucide-react';
import { DistrictAnalyticsData, SectorType } from '../../types/analytics';

interface SectoralImpactProps {
  data: DistrictAnalyticsData;
}

export const SectoralImpact: React.FC<SectoralImpactProps> = ({ data }) => {
  const [selectedSector, setSelectedSector] = useState<SectorType>('agriculture');

  const sectorMeta: { id: SectorType; label: string; icon: React.ComponentType<{ className?: string }>; color: string }[] = [
    { id: 'agriculture', label: 'Agriculture & Crops', icon: Sprout, color: '#10B981' },
    { id: 'water', label: 'Water Resources', icon: Droplet, color: '#00F0FF' },
    { id: 'infrastructure', label: 'Urban Infrastructure', icon: Hammer, color: '#F59E0B' },
    { id: 'health', label: 'Public Health', icon: HeartPulse, color: '#EF4444' },
  ];

  const currentSector = data.sectoral[selectedSector];

  // Indicator Bar Chart
  const indicatorBarOption = useMemo(() => {
    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: 'rgba(5, 14, 28, 0.95)',
        borderColor: '#00F0FF',
        borderWidth: 1,
        textStyle: { color: '#F1F5F9', fontSize: 10 },
      },
      legend: {
        data: ['Observed Vulnerability Index', 'State Resilience Benchmark'],
        top: 0,
        right: 10,
        textStyle: { color: '#94A3B8', fontSize: 9 },
      },
      grid: { top: 25, bottom: 20, left: 140, right: 25 },
      xAxis: {
        type: 'value',
        min: 0,
        max: 100,
        interval: 20,
        splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } },
        axisLabel: { color: '#64748B', fontSize: 8.5 },
      },
      yAxis: {
        type: 'category',
        data: currentSector.indicators.map(i => i.name),
        axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
        axisLabel: { color: '#94A3B8', fontSize: 9 },
      },
      series: [
        {
          name: 'Observed Vulnerability Index',
          type: 'bar',
          data: currentSector.indicators.map(i => i.score),
          itemStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 1, y2: 0,
              colorStops: [
                { offset: 0, color: '#00F0FF' },
                { offset: 1, color: '#EF4444' },
              ],
            },
            borderRadius: [0, 3, 3, 0],
          },
        },
        {
          name: 'State Resilience Benchmark',
          type: 'bar',
          data: currentSector.indicators.map(i => i.benchmark),
          itemStyle: { color: 'rgba(255,255,255,0.2)', borderRadius: [0, 3, 3, 0] },
        },
      ],
    };
  }, [currentSector]);

  return (
    <div className="flex-1 min-h-0 flex flex-col gap-2 p-2 select-none overflow-y-auto custom-scrollbar">
      {/* ── Top Header Toolbar ── */}
      <div className="p-2.5 rounded-xl bg-[#030d1d]/90 border border-[#00f0ff]/20 flex items-center justify-between gap-3 shadow-lg shrink-0">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-[#00f0ff]" />
          <span className="text-[11px] font-bold text-white uppercase tracking-wider">
            CLIMATE IMPACT & VULNERABILITY EVALUATION BY SECTOR — {data.name}
          </span>
        </div>

        {/* Sector Switcher */}
        <div className="flex items-center gap-1 bg-[#051428] border border-[#00f0ff]/20 rounded-lg p-1">
          {sectorMeta.map((s) => {
            const Icon = s.icon;
            const isActive = selectedSector === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setSelectedSector(s.id)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[10.5px] font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#00f0ff] text-[#020810] shadow-[0_0_10px_rgba(0,240,255,0.4)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Sector Specific KPIs Strip ── */}
      <div className="grid grid-cols-4 gap-2 shrink-0">
        {currentSector.kpis.map((kpi, idx) => (
          <div key={idx} className="p-2.5 rounded-xl bg-[#030d1d]/80 border border-[#00f0ff]/15">
            <span className="text-[9px] text-slate-400 uppercase font-semibold">{kpi.label}</span>
            <span className="text-[16px] font-bold text-white block mt-0.5">{kpi.value}</span>
            <span
              className={`text-[8px] font-mono block ${
                kpi.status === 'alert'
                  ? 'text-red-400'
                  : kpi.status === 'warning'
                  ? 'text-amber-400'
                  : 'text-emerald-400'
              }`}
            >
              {kpi.delta}
            </span>
          </div>
        ))}
      </div>

      {/* ── Middle: Indicators Horizontal Bar Chart ── */}
      <div className="p-2.5 rounded-xl bg-[#030d1d]/85 border border-[#00f0ff]/15 flex flex-col flex-1 min-h-[260px] shadow-md">
        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1">
          VULNERABILITY INDICATORS VS STATE RESILIENCE BENCHMARKS
        </span>
        <div className="flex-1 min-h-0 w-full">
          <ReactECharts option={indicatorBarOption} style={{ height: '100%', width: '100%' }} />
        </div>
      </div>

      {/* ── Bottom: Climatological Narrative & Adaptation Priorities ── */}
      <div className="grid grid-cols-2 gap-2 shrink-0 min-h-[140px]">
        {/* Narrative */}
        <div className="p-2.5 rounded-xl bg-[#030d1d]/85 border border-[#00f0ff]/15 flex flex-col">
          <span className="text-[10px] font-bold text-white uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            CLIMATE EXPOSURE DIAGNOSTIC NARRATIVE
          </span>
          <p className="text-[9.5px] text-slate-300 leading-relaxed mt-1 flex-1">
            {currentSector.narrative}
          </p>
          <div className="text-[8px] font-mono text-slate-500 mt-1">
            Integrated multi-criteria assessment based on IMD data & ISRO Bhuvan satellite observations.
          </div>
        </div>

        {/* Adaptation Priorities */}
        <div className="p-2.5 rounded-xl bg-[#030d1d]/85 border border-[#00f0ff]/15 flex flex-col">
          <span className="text-[10px] font-bold text-[#00f0ff] uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-[#00f0ff]" />
            KEY ADAPTATION & ACTIONABLE POLICY PRIORITIES
          </span>
          <div className="space-y-1.5 flex-1 mt-1 text-[9.5px]">
            {currentSector.adaptationPriorities.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2 text-slate-200">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] shrink-0 mt-1.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
