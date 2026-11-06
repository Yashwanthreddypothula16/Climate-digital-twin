import React, { useState, useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { ScatterChart, ChevronDown, Info, HelpCircle, Activity } from 'lucide-react';
import { DistrictAnalyticsData } from '../../types/analytics';

interface CorrelationAnalysisProps {
  data: DistrictAnalyticsData;
}

export const CorrelationAnalysis: React.FC<CorrelationAnalysisProps> = ({ data }) => {
  const [selectedPairKey, setSelectedPairKey] = useState<string>('Temperature_vs_Rainfall');

  const pairOptions = [
    { key: 'Temperature_vs_Rainfall', label: 'Temperature vs Rainfall' },
    { key: 'Temperature_vs_Humidity', label: 'Temperature vs Humidity' },
    { key: 'Rainfall_vs_NDVI', label: 'Rainfall vs NDVI' },
    { key: 'LST_vs_NDVI', label: 'Land Surface Temp (LST) vs NDVI' },
  ];

  const currentPair = data.correlations.paired[selectedPairKey] || data.correlations.paired['Temperature_vs_Rainfall'];

  // 1. Correlation Heatmap Matrix
  const heatmapOption = useMemo(() => {
    const vars = data.correlations.variables;
    const matrix = data.correlations.matrix;

    // ECharts heatmap format: [[xIndex, yIndex, value], ...]
    const heatmapData: [number, number, number][] = [];
    for (let r = 0; r < matrix.length; r++) {
      for (let c = 0; c < matrix[r].length; c++) {
        heatmapData.push([c, r, matrix[r][c]]);
      }
    }

    return {
      backgroundColor: 'transparent',
      tooltip: {
        position: 'top',
        formatter: (params: any) => {
          const xName = vars[params.value[0]];
          const yName = vars[params.value[1]];
          const val = params.value[2];
          return `<div style="font-size:10px"><b>${xName}</b> vs <b>${yName}</b><br/>Pearson r: <b style="color:#00F0FF">${val.toFixed(2)}</b></div>`;
        },
        backgroundColor: 'rgba(5, 14, 28, 0.95)',
        borderColor: '#00F0FF',
        borderWidth: 1,
        textStyle: { color: '#F1F5F9' },
      },
      grid: { top: 20, bottom: 45, left: 95, right: 25 },
      xAxis: {
        type: 'category',
        data: vars,
        splitArea: { show: true },
        axisLabel: { color: '#94A3B8', fontSize: 8.5, rotate: 25 },
        axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
      },
      yAxis: {
        type: 'category',
        data: vars,
        splitArea: { show: true },
        axisLabel: { color: '#94A3B8', fontSize: 8.5 },
        axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
      },
      visualMap: {
        min: -1,
        max: 1,
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: 0,
        itemWidth: 10,
        itemHeight: 120,
        textStyle: { color: '#64748B', fontSize: 8 },
        inRange: {
          color: ['#EF4444', '#7F1D1D', '#0A1E3D', '#0284C7', '#00F0FF'],
        },
      },
      series: [
        {
          name: 'Correlation',
          type: 'heatmap',
          data: heatmapData,
          label: {
            show: true,
            formatter: (p: any) => p.value[2].toFixed(2),
            fontSize: 8.5,
            color: '#FFFFFF',
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(0, 240, 255, 0.5)',
            },
          },
        },
      ],
    };
  }, [data]);

  // 2. High-resolution Scatter Plot with Linear Regression Line
  const scatterOption = useMemo(() => {
    return {
      backgroundColor: 'transparent',
      tooltip: {
        formatter: (params: any) => {
          if (params.seriesName === 'Observations') {
            return `<div style="font-size:10px">${currentPair.xVar}: <b>${params.value[0]}</b><br/>${currentPair.yVar}: <b>${params.value[1]}</b></div>`;
          }
          return 'Regression Trend Line';
        },
        backgroundColor: 'rgba(5, 14, 28, 0.95)',
        borderColor: '#00F0FF',
        borderWidth: 1,
        textStyle: { color: '#F1F5F9' },
      },
      grid: { top: 25, bottom: 25, left: 45, right: 25 },
      xAxis: {
        name: currentPair.xVar,
        nameLocation: 'middle',
        nameGap: 18,
        nameTextStyle: { color: '#94A3B8', fontSize: 9 },
        type: 'value',
        scale: true,
        splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } },
        axisLabel: { color: '#64748B', fontSize: 8.5 },
      },
      yAxis: {
        name: currentPair.yVar,
        nameTextStyle: { color: '#94A3B8', fontSize: 9 },
        type: 'value',
        scale: true,
        splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } },
        axisLabel: { color: '#64748B', fontSize: 8.5 },
      },
      series: [
        {
          name: 'Observations',
          type: 'scatter',
          data: currentPair.points,
          symbolSize: 8,
          itemStyle: {
            color: '#00F0FF',
            shadowBlur: 6,
            shadowColor: '#00F0FF',
          },
        },
        {
          name: 'Trend Line',
          type: 'line',
          data: currentPair.trendLine,
          showSymbol: false,
          lineStyle: {
            color: '#EF4444',
            width: 2,
            type: 'dashed',
          },
        },
      ],
    };
  }, [currentPair]);

  return (
    <div className="flex-1 min-h-0 flex flex-col gap-2 p-2 select-none overflow-y-auto custom-scrollbar">
      {/* ── Top Header Toolbar ── */}
      <div className="p-2.5 rounded-xl bg-[#030d1d]/90 border border-[#00f0ff]/20 flex items-center justify-between gap-3 shadow-lg shrink-0">
        <div className="flex items-center gap-2">
          <ScatterChart className="w-4 h-4 text-[#00f0ff]" />
          <span className="text-[11px] font-bold text-white uppercase tracking-wider">
            CLIMATE PARAMETER CORRELATION & CO-VARIATION — {data.name}
          </span>
        </div>

        {/* Pair selector */}
        <div className="flex items-center gap-2">
          <span className="text-[9.5px] text-slate-400 uppercase">Paired Observation:</span>
          <div className="relative">
            <select
              value={selectedPairKey}
              onChange={(e) => setSelectedPairKey(e.target.value)}
              className="appearance-none bg-[#051428] border border-[#00f0ff]/30 text-white text-[10.5px] font-semibold rounded-md px-2.5 py-1 pr-6 hover:border-[#00f0ff] focus:outline-none cursor-pointer"
            >
              {pairOptions.map(p => (
                <option key={p.key} value={p.key}>{p.label}</option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 text-cyan-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* ── Statistical Coefficients Strip ── */}
      <div className="grid grid-cols-4 gap-2 shrink-0">
        <div className="p-2.5 rounded-xl bg-[#030d1d]/80 border border-[#00f0ff]/15">
          <span className="text-[9px] text-slate-400 uppercase font-semibold">Pearson Correlation (r)</span>
          <span className={`text-[16px] font-bold block mt-0.5 ${currentPair.pearson < 0 ? 'text-red-400' : 'text-cyan-400'}`}>
            {currentPair.pearson > 0 ? `+${currentPair.pearson}` : currentPair.pearson}
          </span>
          <span className="text-[8px] font-mono text-slate-400">Linear association strength (-1 to +1)</span>
        </div>

        <div className="p-2.5 rounded-xl bg-[#030d1d]/80 border border-[#00f0ff]/15">
          <span className="text-[9px] text-slate-400 uppercase font-semibold">Spearman Rank (ρ)</span>
          <span className={`text-[16px] font-bold block mt-0.5 ${currentPair.spearman < 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
            {currentPair.spearman > 0 ? `+${currentPair.spearman}` : currentPair.spearman}
          </span>
          <span className="text-[8px] font-mono text-slate-400">Monotonic non-parametric rank</span>
        </div>

        <div className="p-2.5 rounded-xl bg-[#030d1d]/80 border border-[#00f0ff]/15">
          <span className="text-[9px] text-slate-400 uppercase font-semibold">Coefficient of Determination (R²)</span>
          <span className="text-[16px] font-bold text-white block mt-0.5">{currentPair.r2}</span>
          <span className="text-[8px] font-mono text-slate-400">{Math.round(currentPair.r2 * 100)}% variance explained</span>
        </div>

        <div className="p-2.5 rounded-xl bg-[#030d1d]/80 border border-[#00f0ff]/15">
          <span className="text-[9px] text-slate-400 uppercase font-semibold">Statistical Significance (p-value)</span>
          <span className="text-[16px] font-bold text-emerald-400 block mt-0.5">p = {currentPair.pValue}</span>
          <span className="text-[8px] font-mono text-cyan-400">Sample size n = {currentPair.sampleSize} years (p &lt; 0.05)</span>
        </div>
      </div>

      {/* ── Main Charts (Heatmap Matrix + Scatter Plot) ── */}
      <div className="grid grid-cols-2 gap-2 flex-1 min-h-[350px]">
        {/* Heatmap Matrix */}
        <div className="p-2.5 rounded-xl bg-[#030d1d]/85 border border-[#00f0ff]/15 flex flex-col shadow-md">
          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1">
            TELANGANA CLIMATE PARAMETER CORRELATION MATRIX (PEARSON R)
          </span>
          <div className="flex-1 min-h-0 w-full">
            <ReactECharts option={heatmapOption} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>

        {/* Scatter Plot */}
        <div className="p-2.5 rounded-xl bg-[#030d1d]/85 border border-[#00f0ff]/15 flex flex-col shadow-md">
          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1">
            SCATTER PLOT & REGRESSION FIT: {currentPair.xVar} VS {currentPair.yVar}
          </span>
          <div className="flex-1 min-h-0 w-full">
            <ReactECharts option={scatterOption} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>
      </div>

      {/* ── Scientific Interpretation Panel ── */}
      <div className="p-2.5 rounded-xl bg-[#030d1d]/85 border border-[#00f0ff]/15 flex items-start gap-2.5 shadow-md shrink-0">
        <div className="w-7 h-7 rounded-lg bg-[#00f0ff]/10 border border-[#00f0ff]/40 flex items-center justify-center text-[#00f0ff] shrink-0 mt-0.5">
          <Info className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <span className="text-[10px] font-bold text-white uppercase tracking-wider block">
            SCIENTIFIC CLIMATOLOGICAL INTERPRETATION
          </span>
          <p className="text-[9.5px] text-slate-300 leading-relaxed mt-0.5">
            {currentPair.interpretation}
          </p>
        </div>
      </div>
    </div>
  );
};
