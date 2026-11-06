import React from 'react';
import ReactECharts from 'echarts-for-react';
import { ChartDayData } from '../../types/simulation';

interface Props {
  data: ChartDayData[];
}

export const RainfallComparisonChart: React.FC<Props> = ({ data }) => {
  const dates = data.map((d) => d.date);
  const historical = data.map((d) => d.historical);
  const simulated = data.map((d) => d.simulated);

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(5, 16, 36, 0.95)',
      borderColor: '#00f0ff',
      textStyle: { color: '#fff', fontSize: 10 },
    },
    legend: {
      data: ['Historical', 'Simulated'],
      textStyle: { color: '#94a3b8', fontSize: 8.5 },
      top: 0,
      right: 5,
      itemWidth: 6,
      itemHeight: 6,
    },
    grid: { top: 22, right: 12, bottom: 20, left: 32 },
    xAxis: {
      type: 'category',
      data: dates,
      axisLabel: { color: '#64748b', fontSize: 8 },
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
    },
    yAxis: {
      type: 'value',
      name: 'mm',
      nameTextStyle: { color: '#64748b', fontSize: 8 },
      max: 200,
      axisLabel: { color: '#64748b', fontSize: 8 },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } },
    },
    series: [
      {
        name: 'Historical',
        type: 'bar',
        barWidth: '35%',
        data: historical,
        itemStyle: { color: '#0284c7', borderRadius: [2, 2, 0, 0] },
      },
      {
        name: 'Simulated',
        type: 'bar',
        barWidth: '35%',
        data: simulated,
        itemStyle: { color: '#f97316', borderRadius: [2, 2, 0, 0] },
      },
    ],
  };

  return (
    <div className="w-full h-full bg-[#051124] rounded-lg border border-[#00f0ff]/15 p-2 flex flex-col justify-between shadow-md overflow-hidden select-none">
      <div className="flex items-center gap-1.5 pb-0.5 border-b border-white/5 shrink-0">
        <span className="w-2 h-2 rounded-full border border-[#00f0ff] shrink-0" />
        <span className="text-[10px] font-bold text-slate-200 tracking-wider uppercase truncate">
          RAINFALL COMPARISON
        </span>
      </div>
      <div className="flex-1 min-h-0 w-full">
        <ReactECharts
          option={option}
          style={{ width: '100%', height: '100%' }}
          opts={{ renderer: 'canvas' }}
        />
      </div>
    </div>
  );
};
