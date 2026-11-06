import React from 'react';
import ReactECharts from 'echarts-for-react';

export const AlertTrendChart: React.FC = () => {
  const dates = ['25 Aug', '26 Aug', '27 Aug', '28 Aug', '29 Aug', '30 Aug', '31 Aug'];

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#030a14',
      borderColor: '#00f0ff',
      borderWidth: 1,
      textStyle: { color: '#ffffff', fontSize: 10.5 },
      axisPointer: { type: 'cross', label: { backgroundColor: '#00f0ff' } },
    },
    legend: {
      data: ['Severe', 'Moderate', 'Advisory'],
      textStyle: { color: '#94a3b8', fontSize: 10 },
      top: 0,
      right: 0,
      itemWidth: 10,
      itemHeight: 8,
    },
    grid: {
      left: '3%',
      right: '3%',
      top: '20%',
      bottom: '6%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: dates,
      axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.15)' } },
      axisLabel: { color: '#94a3b8', fontSize: 9 },
    },
    yAxis: {
      type: 'value',
      name: 'Number of Alerts',
      nameTextStyle: { color: '#64748b', fontSize: 9 },
      splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.05)' } },
      axisLabel: { color: '#94a3b8', fontSize: 9 },
      max: 20,
    },
    series: [
      {
        name: 'Severe',
        type: 'bar',
        barWidth: 7,
        itemStyle: { color: '#EF4444', borderRadius: [2, 2, 0, 0] },
        data: [2, 3, 3, 4, 5, 5, 6],
      },
      {
        name: 'Moderate',
        type: 'bar',
        barWidth: 7,
        itemStyle: { color: '#F97316', borderRadius: [2, 2, 0, 0] },
        data: [4, 5, 6, 7, 8, 8, 9],
      },
      {
        name: 'Advisory',
        type: 'bar',
        barWidth: 7,
        itemStyle: { color: '#EAB308', borderRadius: [2, 2, 0, 0] },
        data: [3, 4, 4, 5, 6, 6, 6],
      },
      {
        name: 'Severe',
        type: 'line',
        smooth: true,
        showSymbol: false,
        lineStyle: { width: 1.8, color: '#f87171' },
        data: [2, 3, 3, 4, 5, 5, 6],
      },
    ],
  };

  return (
    <div className="bg-[#030914] p-2.5 flex flex-col h-full select-none justify-between">
      <div className="text-[11px] font-bold text-slate-200 tracking-wider font-mono uppercase mb-1 shrink-0">
        ALERT TREND (7 DAYS)
      </div>
      <div className="flex-1 min-h-0 w-full">
        <ReactECharts option={option} style={{ width: '100%', height: '100%' }} />
      </div>
    </div>
  );
};
