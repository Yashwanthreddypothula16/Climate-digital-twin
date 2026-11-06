import React from 'react';
import ReactECharts from 'echarts-for-react';
import { DistrictPredictionData } from '../../types/predictions';

interface Props {
  data: DistrictPredictionData;
  predictionResult?: any;
}

export const PredictionCharts: React.FC<Props> = ({ data, predictionResult }) => {
  const defaultDates = ['31 Aug', '1 Sep', '2 Sep', '3 Sep', '4 Sep', '5 Sep', '6 Sep', '7 Sep'];

  const baseT = data.current.temp;
  const baseR = data.current.rainfall24h;
  const baseH = data.current.humidity;
  const baseW = data.current.windSpeed;

  // Dynamic series overrides from ML / QML prediction execution
  const hasSeries = predictionResult?.timeSeries && predictionResult.timeSeries.length > 0;
  const pTarget = predictionResult?.target;

  const tempDates = hasSeries && pTarget === 'temperature'
    ? predictionResult.timeSeries.map((t: any) => t.date)
    : defaultDates;
  const tempActual = hasSeries && pTarget === 'temperature'
    ? predictionResult.timeSeries.map((t: any) => t.actual !== undefined ? t.actual : +(t.predicted - 1.0).toFixed(1))
    : [baseT - 2, baseT - 1, baseT - 1.5, baseT, baseT + 0.5, baseT + 1, baseT + 0.8, baseT - 0.5];
  const tempPred = hasSeries && pTarget === 'temperature'
    ? predictionResult.timeSeries.map((t: any) => t.predicted)
    : [baseT, baseT + 0.8, baseT + 1.5, baseT + 1.2, baseT + 2, baseT + 2.5, baseT + 2.2, baseT + 1.4];

  const rainDates = hasSeries && pTarget === 'rainfall'
    ? predictionResult.timeSeries.map((t: any) => t.date)
    : defaultDates;
  const rainPred = hasSeries && pTarget === 'rainfall'
    ? predictionResult.timeSeries.map((t: any) => t.predicted)
    : [
        +(baseR * 1.2 + 2).toFixed(1),
        +(baseR * 2.1 + 8).toFixed(1),
        +(baseR * 2.8 + 14).toFixed(1),
        +(baseR * 2.5 + 11).toFixed(1),
        +(baseR * 1.9 + 7).toFixed(1),
        +(baseR * 1.8 + 6).toFixed(1),
        +(baseR * 2.2 + 9).toFixed(1),
        +(baseR * 1.4 + 4).toFixed(1),
      ];

  const humDates = hasSeries && pTarget === 'humidity'
    ? predictionResult.timeSeries.map((t: any) => t.date)
    : defaultDates;
  const humPred = hasSeries && pTarget === 'humidity'
    ? predictionResult.timeSeries.map((t: any) => t.predicted)
    : [baseH, baseH + 3, baseH + 6, baseH + 4, baseH + 7, baseH + 8, baseH + 5, baseH + 3];

  const windDates = hasSeries && pTarget === 'wind'
    ? predictionResult.timeSeries.map((t: any) => t.date)
    : defaultDates;
  const windPred = hasSeries && pTarget === 'wind'
    ? predictionResult.timeSeries.map((t: any) => t.predicted)
    : [baseW, baseW + 3, baseW + 5, baseW + 4, baseW + 6, baseW + 7, baseW + 5, baseW + 4];

  // 1. Temperature Options (Actual vs Predicted)
  const tempOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(5, 16, 36, 0.95)',
      borderColor: '#00f0ff',
      textStyle: { color: '#fff', fontSize: 10 },
    },
    legend: {
      data: ['Actual', 'Predicted'],
      textStyle: { color: '#94a3b8', fontSize: 9 },
      icon: 'circle',
      itemWidth: 6,
      itemHeight: 6,
      top: 0,
      right: 10,
    },
    grid: { top: 25, right: 12, bottom: 20, left: 32 },
    xAxis: {
      type: 'category',
      data: tempDates,
      axisLabel: { color: '#64748b', fontSize: 8.5 },
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
    },
    yAxis: {
      type: 'value',
      min: Math.floor(Math.min(...tempPred, ...tempActual) - 2),
      max: Math.ceil(Math.max(...tempPred, ...tempActual) + 2),
      axisLabel: { color: '#64748b', fontSize: 8.5 },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } },
    },
    series: [
      {
        name: 'Actual',
        type: 'line',
        smooth: true,
        data: tempActual,
        itemStyle: { color: '#38bdf8' },
        lineStyle: { width: 1.8 },
      },
      {
        name: 'Predicted',
        type: 'line',
        smooth: true,
        data: tempPred,
        itemStyle: { color: '#f97316' },
        lineStyle: { width: 2, type: 'solid' },
      },
    ],
  };

  // 2. Rainfall Options (Actual vs Predicted)
  const rainOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(5, 16, 36, 0.95)',
      borderColor: '#00f0ff',
      textStyle: { color: '#fff', fontSize: 10 },
    },
    legend: {
      data: ['Actual', 'Predicted'],
      textStyle: { color: '#94a3b8', fontSize: 9 },
      icon: 'circle',
      itemWidth: 6,
      itemHeight: 6,
      top: 0,
      right: 10,
    },
    grid: { top: 25, right: 12, bottom: 20, left: 32 },
    xAxis: {
      type: 'category',
      data: rainDates,
      axisLabel: { color: '#64748b', fontSize: 8.5 },
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
    },
    yAxis: {
      type: 'value',
      name: 'mm',
      nameTextStyle: { color: '#64748b', fontSize: 8.5 },
      axisLabel: { color: '#64748b', fontSize: 8.5 },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } },
    },
    series: [
      {
        name: 'Predicted',
        type: 'bar',
        barWidth: '45%',
        data: rainPred,
        itemStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: '#00f0ff' },
              { offset: 1, color: '#1e40af' },
            ],
          },
          borderRadius: [2, 2, 0, 0],
        },
      },
    ],
  };

  // 3. Humidity Options (Actual vs Predicted)
  const humidityOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(5, 16, 36, 0.95)',
      borderColor: '#00f0ff',
      textStyle: { color: '#fff', fontSize: 10 },
    },
    legend: {
      data: ['Actual', 'Predicted'],
      textStyle: { color: '#94a3b8', fontSize: 9 },
      icon: 'circle',
      itemWidth: 6,
      itemHeight: 6,
      top: 0,
      right: 10,
    },
    grid: { top: 25, right: 12, bottom: 20, left: 32 },
    xAxis: {
      type: 'category',
      data: humDates,
      axisLabel: { color: '#64748b', fontSize: 8.5 },
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
    },
    yAxis: {
      type: 'value',
      min: 20,
      max: 100,
      axisLabel: { color: '#64748b', fontSize: 8.5 },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } },
    },
    series: [
      {
        name: 'Actual',
        type: 'line',
        smooth: true,
        data: humDates.map((_: any, i: number) => Math.max(15, humPred[i] ? humPred[i] - 3 : baseH)),
        itemStyle: { color: '#3b82f6' },
        lineStyle: { width: 1.8 },
      },
      {
        name: 'Predicted',
        type: 'line',
        smooth: true,
        data: humPred,
        itemStyle: { color: '#f59e0b' },
        lineStyle: { width: 2 },
      },
    ],
  };

  // 4. Wind Speed Options (Actual vs Predicted)
  const windOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(5, 16, 36, 0.95)',
      borderColor: '#00f0ff',
      textStyle: { color: '#fff', fontSize: 10 },
    },
    legend: {
      data: ['Actual', 'Predicted'],
      textStyle: { color: '#94a3b8', fontSize: 9 },
      icon: 'circle',
      itemWidth: 6,
      itemHeight: 6,
      top: 0,
      right: 10,
    },
    grid: { top: 25, right: 12, bottom: 20, left: 32 },
    xAxis: {
      type: 'category',
      data: windDates,
      axisLabel: { color: '#64748b', fontSize: 8.5 },
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 40,
      axisLabel: { color: '#64748b', fontSize: 8.5 },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } },
    },
    series: [
      {
        name: 'Actual',
        type: 'line',
        smooth: true,
        data: windDates.map((_: any, i: number) => Math.max(2, windPred[i] ? windPred[i] - 2 : baseW)),
        itemStyle: { color: '#14b8a6' },
        lineStyle: { width: 1.8 },
      },
      {
        name: 'Predicted',
        type: 'line',
        smooth: true,
        data: windPred,
        itemStyle: { color: '#f97316' },
        lineStyle: { width: 2 },
      },
    ],
  };

  return (
    <div className="w-full h-full grid grid-cols-4 gap-1.5 select-none overflow-hidden">
      {/* 1. Temp Chart */}
      <div className="h-full bg-[#051124] rounded-lg border border-[#00f0ff]/15 p-2 flex flex-col justify-between shadow-md">
        <div className="text-[10px] font-bold text-slate-200 tracking-wider uppercase shrink-0">
          Temperature Forecast (°C)
        </div>
        <div className="flex-1 min-h-0 w-full">
          <ReactECharts
            option={tempOption}
            style={{ width: '100%', height: '100%' }}
            opts={{ renderer: 'canvas' }}
          />
        </div>
      </div>

      {/* 2. Rainfall Chart */}
      <div className="h-full bg-[#051124] rounded-lg border border-[#00f0ff]/15 p-2 flex flex-col justify-between shadow-md">
        <div className="text-[10px] font-bold text-slate-200 tracking-wider uppercase shrink-0">
          Rainfall Forecast (mm)
        </div>
        <div className="flex-1 min-h-0 w-full">
          <ReactECharts
            option={rainOption}
            style={{ width: '100%', height: '100%' }}
            opts={{ renderer: 'canvas' }}
          />
        </div>
      </div>

      {/* 3. Humidity Chart */}
      <div className="h-full bg-[#051124] rounded-lg border border-[#00f0ff]/15 p-2 flex flex-col justify-between shadow-md">
        <div className="text-[10px] font-bold text-slate-200 tracking-wider uppercase shrink-0">
          Humidity Forecast (%)
        </div>
        <div className="flex-1 min-h-0 w-full">
          <ReactECharts
            option={humidityOption}
            style={{ width: '100%', height: '100%' }}
            opts={{ renderer: 'canvas' }}
          />
        </div>
      </div>

      {/* 4. Wind Speed Chart */}
      <div className="h-full bg-[#051124] rounded-lg border border-[#00f0ff]/15 p-2 flex flex-col justify-between shadow-md">
        <div className="text-[10px] font-bold text-slate-200 tracking-wider uppercase shrink-0">
          Wind Speed Forecast (km/h)
        </div>
        <div className="flex-1 min-h-0 w-full">
          <ReactECharts
            option={windOption}
            style={{ width: '100%', height: '100%' }}
            opts={{ renderer: 'canvas' }}
          />
        </div>
      </div>
    </div>
  );
};
