import React, { useState, useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { GitCompare, ChevronDown, Check, ArrowRight, ShieldCheck, Thermometer, CloudRain, Droplets, Wind } from 'lucide-react';
import { DistrictAnalyticsData } from '../../types/analytics';
import { DISTRICTS_LIST } from '../../data/telanganaGeo';
import { getDistrictAnalyticsData } from '../../services/analyticsDataService';

interface ComparativeAnalysisProps {
  primaryData: DistrictAnalyticsData;
}

export const ComparativeAnalysis: React.FC<ComparativeAnalysisProps> = ({ primaryData }) => {
  const [comparisonMode, setComparisonMode] = useState<'district' | 'state' | 'period'>('district');
  const [secondaryDistrictId, setSecondaryDistrictId] = useState<string>('karimnagar');

  // Secondary district data
  const secondaryData = useMemo(() => {
    return getDistrictAnalyticsData(secondaryDistrictId);
  }, [secondaryDistrictId]);

  // Comparative Temperature Grouped Bar
  const tempCompareOption = useMemo(() => {
    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(5, 14, 28, 0.95)',
        borderColor: '#00F0FF',
        borderWidth: 1,
        textStyle: { color: '#F1F5F9', fontSize: 10 },
      },
      legend: {
        data: [primaryData.name, secondaryData.name],
        top: 0,
        right: 10,
        textStyle: { color: '#94A3B8', fontSize: 9 },
      },
      grid: { top: 28, bottom: 22, left: 32, right: 15 },
      xAxis: {
        type: 'category',
        data: primaryData.temporal.years,
        axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
        axisLabel: { color: '#64748B', fontSize: 8.5 },
      },
      yAxis: {
        type: 'value',
        min: 25,
        max: 33,
        interval: 2,
        splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } },
        axisLabel: { color: '#64748B', fontSize: 8.5, formatter: '{value}°' },
      },
      series: [
        {
          name: primaryData.name,
          type: 'bar',
          data: primaryData.temporal.tempAvg,
          itemStyle: { color: '#00F0FF', borderRadius: [2, 2, 0, 0] },
          barGap: '20%',
        },
        {
          name: secondaryData.name,
          type: 'bar',
          data: secondaryData.temporal.tempAvg,
          itemStyle: { color: '#F59E0B', borderRadius: [2, 2, 0, 0] },
        },
      ],
    };
  }, [primaryData, secondaryData]);

  // Comparative Rainfall Grouped Bar
  const rainCompareOption = useMemo(() => {
    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(5, 14, 28, 0.95)',
        borderColor: '#00F0FF',
        borderWidth: 1,
        textStyle: { color: '#F1F5F9', fontSize: 10 },
      },
      legend: {
        data: [primaryData.name, secondaryData.name],
        top: 0,
        right: 10,
        textStyle: { color: '#94A3B8', fontSize: 9 },
      },
      grid: { top: 28, bottom: 22, left: 38, right: 15 },
      xAxis: {
        type: 'category',
        data: primaryData.temporal.years,
        axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
        axisLabel: { color: '#64748B', fontSize: 8.5 },
      },
      yAxis: {
        type: 'value',
        min: 400,
        max: 1300,
        interval: 300,
        splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } },
        axisLabel: { color: '#64748B', fontSize: 8.5 },
      },
      series: [
        {
          name: primaryData.name,
          type: 'bar',
          data: primaryData.temporal.rainfallActual,
          itemStyle: { color: '#00F0FF', borderRadius: [2, 2, 0, 0] },
          barGap: '20%',
        },
        {
          name: secondaryData.name,
          type: 'bar',
          data: secondaryData.temporal.rainfallActual,
          itemStyle: { color: '#10B981', borderRadius: [2, 2, 0, 0] },
        },
      ],
    };
  }, [primaryData, secondaryData]);

  // Multi-dimensional Climate Risk Radar
  const riskRadarOption = useMemo(() => {
    return {
      backgroundColor: 'transparent',
      tooltip: {
        backgroundColor: 'rgba(5, 14, 28, 0.95)',
        borderColor: '#00F0FF',
        borderWidth: 1,
        textStyle: { color: '#F1F5F9', fontSize: 10 },
      },
      legend: {
        data: [primaryData.name, secondaryData.name],
        top: 0,
        right: 10,
        textStyle: { color: '#94A3B8', fontSize: 9 },
      },
      radar: {
        indicator: [
          { name: 'Heat Risk', max: 100 },
          { name: 'Flood Risk', max: 100 },
          { name: 'Drought Risk', max: 100 },
          { name: 'Wind Extreme', max: 100 },
          { name: 'Water Stress', max: 100 },
        ],
        splitNumber: 4,
        axisName: { color: '#94A3B8', fontSize: 8.5 },
        splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.08)' } },
        splitArea: { show: false },
        axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } },
      },
      series: [
        {
          type: 'radar',
          data: [
            {
              value: [
                primaryData.risks.heat.score,
                primaryData.risks.flood.score,
                primaryData.risks.drought.score,
                primaryData.risks.wind.score,
                70,
              ],
              name: primaryData.name,
              itemStyle: { color: '#00F0FF' },
              areaStyle: { color: 'rgba(0, 240, 255, 0.25)' },
            },
            {
              value: [
                secondaryData.risks.heat.score,
                secondaryData.risks.flood.score,
                secondaryData.risks.drought.score,
                secondaryData.risks.wind.score,
                62,
              ],
              name: secondaryData.name,
              itemStyle: { color: '#F59E0B' },
              areaStyle: { color: 'rgba(245, 158, 11, 0.25)' },
            },
          ],
        },
      ],
    };
  }, [primaryData, secondaryData]);

  // Delta calculations
  const tempDelta = +(primaryData.stats.avgTemp - secondaryData.stats.avgTemp).toFixed(1);
  const rainDelta = primaryData.stats.totalRain - secondaryData.stats.totalRain;
  const rainDeltaPct = +((rainDelta / secondaryData.stats.totalRain) * 100).toFixed(1);

  return (
    <div className="flex-1 min-h-0 flex flex-col gap-2 p-2 select-none overflow-y-auto custom-scrollbar">
      {/* ── Top Header Toolbar ── */}
      <div className="p-2.5 rounded-xl bg-[#030d1d]/90 border border-[#00f0ff]/20 flex items-center justify-between gap-3 shadow-lg shrink-0">
        <div className="flex items-center gap-2">
          <GitCompare className="w-4 h-4 text-[#00f0ff]" />
          <span className="text-[11px] font-bold text-white uppercase tracking-wider">
            CLIMATE COMPARATIVE ANALYSIS WORKSPACE
          </span>
        </div>

        {/* Comparison Targets */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-[#051428] border border-[#00f0ff]/20 rounded-lg p-1">
            <span className="px-2 py-0.5 rounded text-[10.5px] font-bold bg-[#00f0ff] text-[#020810]">
              {primaryData.name} (Primary)
            </span>
            <span className="text-slate-400 font-mono text-[10px]">vs</span>
            <div className="relative">
              <select
                value={secondaryDistrictId}
                onChange={(e) => setSecondaryDistrictId(e.target.value)}
                className="appearance-none bg-[#020b18] border border-[#00f0ff]/30 text-white text-[10.5px] font-semibold rounded px-2.5 py-0.5 pr-6 hover:border-[#00f0ff] focus:outline-none cursor-pointer"
              >
                {DISTRICTS_LIST.filter(d => d.id !== primaryData.id).map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 text-cyan-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Top Summary Difference Cards ── */}
      <div className="grid grid-cols-4 gap-2 shrink-0">
        <div className="p-2.5 rounded-xl bg-[#030d1d]/80 border border-[#00f0ff]/15">
          <span className="text-[9px] text-slate-400 uppercase font-semibold">Mean Temperature Difference</span>
          <span className={`text-[15px] font-bold block mt-0.5 ${tempDelta >= 0 ? 'text-red-400' : 'text-cyan-400'}`}>
            {tempDelta >= 0 ? `+${tempDelta}` : tempDelta} °C
          </span>
          <span className="text-[8px] text-slate-400 font-mono">
            {primaryData.name}: {primaryData.stats.avgTemp}°C vs {secondaryData.name}: {secondaryData.stats.avgTemp}°C
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-[#030d1d]/80 border border-[#00f0ff]/15">
          <span className="text-[9px] text-slate-400 uppercase font-semibold">Precipitation Variance</span>
          <span className={`text-[15px] font-bold block mt-0.5 ${rainDelta >= 0 ? 'text-cyan-400' : 'text-amber-400'}`}>
            {rainDelta >= 0 ? `+${rainDelta}` : rainDelta} mm ({rainDeltaPct}%)
          </span>
          <span className="text-[8px] text-slate-400 font-mono">
            {primaryData.name}: {primaryData.stats.totalRain}mm vs {secondaryData.name}: {secondaryData.stats.totalRain}mm
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-[#030d1d]/80 border border-[#00f0ff]/15">
          <span className="text-[9px] text-slate-400 uppercase font-semibold">Extreme Event Ratio</span>
          <span className="text-[15px] font-bold text-amber-400 block mt-0.5">
            {primaryData.stats.extremeEventsCount} vs {secondaryData.stats.extremeEventsCount} Events
          </span>
          <span className="text-[8px] text-slate-400 font-mono">Decadal recorded threshold events</span>
        </div>

        <div className="p-2.5 rounded-xl bg-[#030d1d]/80 border border-[#00f0ff]/15">
          <span className="text-[9px] text-slate-400 uppercase font-semibold">Elevation & Topography</span>
          <span className="text-[15px] font-bold text-slate-200 block mt-0.5">
            Δ {Math.abs(primaryData.elevation - secondaryData.elevation)} m
          </span>
          <span className="text-[8px] text-slate-400 font-mono">
            {primaryData.name} ({primaryData.elevation}m) • {secondaryData.name} ({secondaryData.elevation}m)
          </span>
        </div>
      </div>

      {/* ── Main Charts (Grouped Bars + Radar) ── */}
      <div className="grid grid-cols-3 gap-2 flex-1 min-h-[300px]">
        {/* Comparative Temperature */}
        <div className="p-2.5 rounded-xl bg-[#030d1d]/85 border border-[#00f0ff]/15 flex flex-col shadow-md">
          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1">
            COMPARATIVE ANNUAL TEMPERATURE (°C)
          </span>
          <div className="flex-1 min-h-0 w-full">
            <ReactECharts option={tempCompareOption} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>

        {/* Comparative Rainfall */}
        <div className="p-2.5 rounded-xl bg-[#030d1d]/85 border border-[#00f0ff]/15 flex flex-col shadow-md">
          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1">
            COMPARATIVE ANNUAL PRECIPITATION (mm)
          </span>
          <div className="flex-1 min-h-0 w-full">
            <ReactECharts option={rainCompareOption} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>

        {/* Climate Risk Radar */}
        <div className="p-2.5 rounded-xl bg-[#030d1d]/85 border border-[#00f0ff]/15 flex flex-col shadow-md">
          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1">
            MULTI-CRITERIA CLIMATE RISK COMPARISON
          </span>
          <div className="flex-1 min-h-0 w-full">
            <ReactECharts option={riskRadarOption} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>
      </div>

      {/* ── Summary Difference Table ── */}
      <div className="p-2.5 rounded-xl bg-[#030d1d]/85 border border-[#00f0ff]/15 flex flex-col shrink-0 min-h-[140px] shadow-md">
        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1">
          CROSS-DISTRICT CLIMATE METRIC COMPARISON MATRIX
        </span>

        <table className="w-full text-left text-[10px]">
          <thead className="bg-[#051428] text-slate-400 font-semibold border-b border-white/10">
            <tr>
              <th className="py-1 px-2">Metric Indicator</th>
              <th className="py-1 px-2 text-[#00f0ff]">{primaryData.name}</th>
              <th className="py-1 px-2 text-[#f59e0b]">{secondaryData.name}</th>
              <th className="py-1 px-2">Net Difference</th>
              <th className="py-1 px-2">Climate Physical Implication</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-mono text-slate-300">
            <tr>
              <td className="py-1.5 px-2 text-white font-sans font-semibold">Annual Rainfall</td>
              <td className="py-1.5 px-2">{primaryData.stats.totalRain} mm</td>
              <td className="py-1.5 px-2">{secondaryData.stats.totalRain} mm</td>
              <td className="py-1.5 px-2 text-cyan-400">{rainDelta >= 0 ? `+${rainDelta}` : rainDelta} mm</td>
              <td className="py-1.5 px-2 text-slate-400 font-sans">Catchment recharge capacity variation</td>
            </tr>
            <tr>
              <td className="py-1.5 px-2 text-white font-sans font-semibold">Mean Daytime Temp</td>
              <td className="py-1.5 px-2">{primaryData.stats.avgTemp} °C</td>
              <td className="py-1.5 px-2">{secondaryData.stats.avgTemp} °C</td>
              <td className="py-1.5 px-2 text-red-400">{tempDelta >= 0 ? `+${tempDelta}` : tempDelta} °C</td>
              <td className="py-1.5 px-2 text-slate-400 font-sans">UHI vs vegetative canopy latent cooling</td>
            </tr>
            <tr>
              <td className="py-1.5 px-2 text-white font-sans font-semibold">Heatwave Vulnerability</td>
              <td className="py-1.5 px-2">{primaryData.risks.heat.score} / 100 ({primaryData.risks.heat.level})</td>
              <td className="py-1.5 px-2">{secondaryData.risks.heat.score} / 100 ({secondaryData.risks.heat.level})</td>
              <td className="py-1.5 px-2 text-amber-400">Δ {primaryData.risks.heat.score - secondaryData.risks.heat.score} pts</td>
              <td className="py-1.5 px-2 text-slate-400 font-sans">Population thermal comfort index differential</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
