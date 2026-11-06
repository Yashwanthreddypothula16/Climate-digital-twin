import React, { useState, useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { Sliders, Play, Download, Table, Check, ChevronDown, RefreshCw } from 'lucide-react';
import { DistrictAnalyticsData } from '../../types/analytics';
import { DISTRICTS_LIST } from '../../data/telanganaGeo';

interface CustomAnalyticsProps {
  data: DistrictAnalyticsData;
  onSelectDistrict: (id: string) => void;
}

export const CustomAnalytics: React.FC<CustomAnalyticsProps> = ({ data, onSelectDistrict }) => {
  const [selectedParam, setSelectedParam] = useState<string>('rainfall');
  const [selectedRange, setSelectedRange] = useState<string>('2015-2026');
  const [aggregation, setAggregation] = useState<'Monthly' | 'Seasonal' | 'Annual'>('Annual');
  const [chartType, setChartType] = useState<'Line' | 'Bar' | 'Area'>('Line');
  const [baseline, setBaseline] = useState<'None' | 'Baseline (2010-2014)' | 'State Average'>('Baseline (2010-2014)');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [hasExecuted, setHasExecuted] = useState<boolean>(true);

  const handleRun = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setHasExecuted(true);
    }, 450);
  };

  // Export CSV
  const handleExportCSV = () => {
    const years = data.temporal.years;
    let values = data.temporal.rainfallActual;
    if (selectedParam === 'temperature') values = data.temporal.tempAvg;
    if (selectedParam === 'humidity') values = data.temporal.monthlyHumidity;

    let csv = `Year,${selectedParam.toUpperCase()},District\n`;
    years.forEach((yr, i) => {
      csv += `${yr},${values[i] || values[0]},${data.name}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.name}_custom_analytics.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Generate chart options based on custom configuration
  const customChartOption = useMemo(() => {
    const years = data.temporal.years;
    let mainData = data.temporal.rainfallActual;
    let unit = 'mm';
    let color = '#00F0FF';

    if (selectedParam === 'temperature') {
      mainData = data.temporal.tempAvg;
      unit = '°C';
      color = '#EF4444';
    } else if (selectedParam === 'humidity') {
      mainData = data.temporal.years.map((_, i) => data.stats.avgHumidity + Math.round(Math.sin(i) * 5));
      unit = '%';
      color = '#10B981';
    } else if (selectedParam === 'windSpeed') {
      mainData = data.temporal.years.map((_, i) => data.stats.avgWind + Math.round(Math.cos(i) * 3));
      unit = 'km/h';
      color = '#14B8A6';
    }

    const baselineVal = baseline === 'State Average' ? (selectedParam === 'rainfall' ? 795 : 28.5) : (selectedParam === 'rainfall' ? 760 : 27.5);

    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(5, 14, 28, 0.95)',
        borderColor: color,
        borderWidth: 1,
        textStyle: { color: '#F1F5F9', fontSize: 10 },
      },
      legend: {
        data: [`${data.name} (${selectedParam})`, baseline !== 'None' ? baseline : ''],
        top: 0,
        right: 10,
        textStyle: { color: '#94A3B8', fontSize: 9 },
      },
      grid: { top: 28, bottom: 22, left: 38, right: 15 },
      xAxis: {
        type: 'category',
        data: years,
        axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
        axisLabel: { color: '#64748B', fontSize: 8.5 },
      },
      yAxis: {
        type: 'value',
        scale: true,
        splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } },
        axisLabel: { color: '#64748B', fontSize: 8.5, formatter: `{value} ${unit}` },
      },
      series: [
        {
          name: `${data.name} (${selectedParam})`,
          type: chartType === 'Bar' ? 'bar' : 'line',
          data: mainData,
          smooth: true,
          itemStyle: { color },
          lineStyle: { width: 2, shadowColor: color, shadowBlur: 6 },
          areaStyle: chartType === 'Area' ? {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: `${color}80` },
                { offset: 1, color: `${color}05` },
              ],
            },
          } : undefined,
        },
        ...(baseline !== 'None' ? [{
          name: baseline,
          type: 'line',
          data: years.map(() => baselineVal),
          itemStyle: { color: '#F59E0B' },
          lineStyle: { width: 1.5, type: 'dashed' },
          showSymbol: false,
        }] : []),
      ],
    };
  }, [data, selectedParam, chartType, baseline]);

  return (
    <div className="flex-1 min-h-0 flex flex-col gap-2 p-2 select-none overflow-y-auto custom-scrollbar">
      {/* ── Top Header Toolbar ── */}
      <div className="p-2.5 rounded-xl bg-[#030d1d]/90 border border-[#00f0ff]/20 flex items-center justify-between gap-3 shadow-lg shrink-0">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-[#00f0ff]" />
          <span className="text-[11px] font-bold text-white uppercase tracking-wider">
            CUSTOM CLIMATE ANALYTICS BUILDER — {data.name}
          </span>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-1 px-3 py-1 bg-[#051428] hover:bg-[#071f3d] border border-[#00f0ff]/30 text-white rounded text-[10px] font-semibold transition-all cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-[#00f0ff]" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* ── Query Parameter Builder Row ── */}
      <div className="p-3 rounded-xl bg-[#030d1d]/85 border border-[#00f0ff]/15 grid grid-cols-6 gap-2 shrink-0">
        {/* District */}
        <div className="flex flex-col">
          <label className="text-[8.5px] uppercase tracking-wider text-slate-400 font-medium mb-0.5">District</label>
          <div className="relative">
            <select
              value={data.id}
              onChange={(e) => onSelectDistrict(e.target.value)}
              className="w-full appearance-none bg-[#051428] border border-[#00f0ff]/30 text-white text-[10.5px] rounded px-2 py-1 pr-6 hover:border-[#00f0ff] cursor-pointer"
            >
              {DISTRICTS_LIST.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 text-cyan-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Climate Parameter */}
        <div className="flex flex-col">
          <label className="text-[8.5px] uppercase tracking-wider text-slate-400 font-medium mb-0.5">Parameter</label>
          <div className="relative">
            <select
              value={selectedParam}
              onChange={(e) => setSelectedParam(e.target.value)}
              className="w-full appearance-none bg-[#051428] border border-[#00f0ff]/30 text-white text-[10.5px] rounded px-2 py-1 pr-6 hover:border-[#00f0ff] cursor-pointer"
            >
              <option value="rainfall">Rainfall (mm)</option>
              <option value="temperature">Temperature (°C)</option>
              <option value="humidity">Humidity (%)</option>
              <option value="windSpeed">Wind Speed (km/h)</option>
            </select>
            <ChevronDown className="w-3 h-3 text-cyan-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Date Range */}
        <div className="flex flex-col">
          <label className="text-[8.5px] uppercase tracking-wider text-slate-400 font-medium mb-0.5">Date Range</label>
          <div className="relative">
            <select
              value={selectedRange}
              onChange={(e) => setSelectedRange(e.target.value)}
              className="w-full appearance-none bg-[#051428] border border-[#00f0ff]/30 text-white text-[10.5px] rounded px-2 py-1 pr-6 hover:border-[#00f0ff] cursor-pointer"
            >
              <option value="2015-2026">2015 - 2026</option>
              <option value="2010-2026">2010 - 2026</option>
              <option value="2020-2026">2020 - 2026</option>
            </select>
            <ChevronDown className="w-3 h-3 text-cyan-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Aggregation */}
        <div className="flex flex-col">
          <label className="text-[8.5px] uppercase tracking-wider text-slate-400 font-medium mb-0.5">Aggregation</label>
          <div className="relative">
            <select
              value={aggregation}
              onChange={(e) => setAggregation(e.target.value as any)}
              className="w-full appearance-none bg-[#051428] border border-[#00f0ff]/30 text-white text-[10.5px] rounded px-2 py-1 pr-6 hover:border-[#00f0ff] cursor-pointer"
            >
              <option value="Annual">Annual Average</option>
              <option value="Seasonal">Seasonal Sum</option>
              <option value="Monthly">Monthly Breakdown</option>
            </select>
            <ChevronDown className="w-3 h-3 text-cyan-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Chart Type */}
        <div className="flex flex-col">
          <label className="text-[8.5px] uppercase tracking-wider text-slate-400 font-medium mb-0.5">Chart Type</label>
          <div className="relative">
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value as any)}
              className="w-full appearance-none bg-[#051428] border border-[#00f0ff]/30 text-white text-[10.5px] rounded px-2 py-1 pr-6 hover:border-[#00f0ff] cursor-pointer"
            >
              <option value="Line">Smooth Line</option>
              <option value="Bar">Vertical Bar</option>
              <option value="Area">Gradient Area</option>
            </select>
            <ChevronDown className="w-3 h-3 text-cyan-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Run Analysis Action Button */}
        <div className="flex flex-col justify-end">
          <button
            onClick={handleRun}
            disabled={isRunning}
            className="w-full py-1.5 flex items-center justify-center gap-1.5 bg-gradient-to-r from-[#00b4d8] to-[#00f0ff] hover:from-[#0096c7] hover:to-[#00d4ff] text-[#020810] font-bold text-[10.5px] rounded shadow-[0_0_10px_rgba(0,240,255,0.4)] transition-all cursor-pointer"
          >
            {isRunning ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isRunning ? 'EXECUTING...' : 'RUN ANALYSIS'}</span>
          </button>
        </div>
      </div>

      {/* ── Dynamic Chart Viewport ── */}
      <div className="p-2.5 rounded-xl bg-[#030d1d]/85 border border-[#00f0ff]/15 flex flex-col flex-1 min-h-[360px] shadow-md">
        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1">
          GENERATED ANALYTICAL OUTPUT: {selectedParam.toUpperCase()} ({selectedRange})
        </span>
        <div className="flex-1 min-h-0 w-full">
          <ReactECharts option={customChartOption} style={{ height: '100%', width: '100%' }} />
        </div>
      </div>
    </div>
  );
};
