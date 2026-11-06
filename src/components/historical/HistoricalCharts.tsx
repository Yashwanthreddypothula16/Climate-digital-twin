import React, { useState, useEffect } from 'react';
import type { DistrictClimateData } from '../../types/climate';
import ReactECharts from 'echarts-for-react';
import { ChevronDown, RefreshCw, Calendar } from 'lucide-react';
import { climateApiClient, HistoricalResponse } from '../../services/apiClient';

export type PeriodType = 'annual' | '7_days' | '30_days' | '90_days';
export type TempViewType = 'monthly' | 'daily' | 'annual';

interface Props {
  district: DistrictClimateData;
  selectedYear: number;
  period?: PeriodType;
  onPeriodChange?: (p: PeriodType) => void;
  historyData?: HistoricalResponse | null;
  isLoading?: boolean;
}

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-[#0A1320] border border-white/5 rounded-md shadow-lg overflow-hidden flex flex-col ${className}`}>
    {children}
  </div>
);

const SectionTitle: React.FC<{ title: string; right?: React.ReactNode }> = ({ title, right }) => (
  <div className="flex items-center justify-between px-3 py-2 border-b border-white/5 shrink-0">
    <span className="font-sans text-[10px] font-bold tracking-wider text-[#C0D0DE] uppercase">
      {title}
    </span>
    {right}
  </div>
);

export const HistoricalCharts: React.FC<Props> = ({
  district,
  selectedYear,
  period: externalPeriod,
  onPeriodChange,
  historyData: externalHistoryData,
  isLoading: externalLoading
}) => {
  const [localPeriod, setLocalPeriod] = useState<PeriodType>('annual');
  const [tempView, setTempView] = useState<TempViewType>('monthly');
  const [localHistoryData, setLocalHistoryData] = useState<HistoricalResponse | null>(null);
  const [localLoading, setLocalLoading] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  const currentPeriod = externalPeriod ?? localPeriod;
  const currentHistoryData = externalHistoryData !== undefined ? externalHistoryData : localHistoryData;
  const currentLoading = externalLoading !== undefined ? externalLoading : localLoading;

  const handlePeriodChange = (p: PeriodType) => {
    if (onPeriodChange) {
      onPeriodChange(p);
    } else {
      setLocalPeriod(p);
    }
    setShowDropdown(false);
  };

  // Internal fetch fallback only if parent doesn't provide historyData
  useEffect(() => {
    if (externalHistoryData !== undefined) return;
    if (currentPeriod === 'annual') return;

    let isMounted = true;
    const today = new Date();
    let days = 7;
    if (currentPeriod === '30_days') days = 30;
    if (currentPeriod === '90_days') days = 90;

    const end = new Date(today.getTime() - 5 * 86400000);
    const start = new Date(end.getTime() - days * 86400000);

    const sStr = start.toISOString().slice(0, 10);
    const eStr = end.toISOString().slice(0, 10);

    setLocalLoading(true);
    climateApiClient.getHistoricalWeather(district.id, sStr, eStr, currentPeriod)
      .then((res) => {
        if (isMounted && res) {
          setLocalHistoryData(res);
        }
      })
      .catch((err) => {
        console.warn('Historical weather fetch error:', err);
      })
      .finally(() => {
        if (isMounted) setLocalLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [district.id, currentPeriod, externalHistoryData]);

  // Fallback / multi-year baseline from district
  const annualHistorical = district.historical || Array.from({ length: 15 }, (_, i) => ({
    year: 2010 + i,
    tmax: district.temperature + Math.sin(i) * 2,
    rainfall: district.rainfall24h * 30 + Math.random() * 200 - 100,
    lst: district.temperature + 5,
  }));

  // Build Rainfall chart data based on selected period
  let rainfallXAxis: (string | number)[] = [];
  let rainfallValues: number[] = [];
  let rainfallTitlePeriod = 'ANNUAL';

  if (currentPeriod === 'annual' || !currentHistoryData?.dailyRecords?.length) {
    rainfallXAxis = annualHistorical.map(h => h.year);
    rainfallValues = annualHistorical.map(h => Math.round(h.rainfall));
    rainfallTitlePeriod = 'ANNUAL (2010–2024)';
  } else {
    rainfallXAxis = currentHistoryData.dailyRecords.map(r => {
      const parts = r.date.split('-');
      return `${parts[1]}/${parts[2]}`;
    });
    rainfallValues = currentHistoryData.dailyRecords.map(r => Math.round(r.rainfall || 0));
    rainfallTitlePeriod = currentPeriod === '7_days' ? 'LAST 7 DAYS' : currentPeriod === '30_days' ? 'LAST 30 DAYS' : 'LAST 90 DAYS';
  }

  const rainfallOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(7,19,48,0.95)',
      borderColor: '#00f0ff',
      textStyle: { color: '#fff', fontSize: 10 },
      formatter: (params: any) => {
        if (!params || !params[0]) return '';
        const item = params[0];
        return `<div class="font-mono text-xs font-semibold text-[#00f0ff]">${item.name}</div>
                <div class="text-[11px] text-white">Rainfall: <span class="font-bold">${item.value} mm</span></div>`;
      }
    },
    grid: { top: 30, right: 10, bottom: 20, left: 40 },
    xAxis: {
      type: 'category',
      data: rainfallXAxis,
      axisLabel: {
        color: '#8EA5B7',
        fontSize: 9,
        interval: currentPeriod === '90_days' ? 5 : currentPeriod === '30_days' ? 2 : 0,
      },
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } }
    },
    yAxis: {
      type: 'value',
      name: 'mm',
      nameTextStyle: { color: '#8EA5B7', fontSize: 9, align: 'right' },
      axisLabel: { color: '#8EA5B7', fontSize: 9 },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } }
    },
    series: [
      {
        data: rainfallValues.map((val, i) => ({
          value: val,
          itemStyle: {
            color: currentPeriod === 'annual'
              ? (rainfallXAxis[i] === selectedYear ? '#00f0ff' : '#2563eb')
              : val > 5 ? '#00f0ff' : '#1d4ed8'
          }
        })),
        type: 'bar',
        barWidth: currentPeriod === '90_days' ? '50%' : '60%',
        label: {
          show: currentPeriod === 'annual' || currentPeriod === '7_days',
          position: 'top',
          formatter: (params: any) => {
            if (currentPeriod === 'annual') {
              return rainfallXAxis[params.dataIndex] === selectedYear ? `${params.value} mm` : '';
            }
            return params.value > 0 ? `${params.value}` : '';
          },
          color: '#00f0ff',
          fontSize: 8,
          fontWeight: 'bold'
        }
      }
    ]
  };

  // Build Temperature chart data
  let tempXAxis: string[] = [];
  let tempAvg: number[] = [];
  let tempMax: number[] = [];
  let tempMin: number[] = [];

  if (tempView === 'monthly') {
    tempXAxis = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    // Seasonal curve anchored to district's baseline temperature
    const baseT = district.temperature;
    tempAvg = [baseT - 6, baseT - 3, baseT, baseT + 4, baseT + 6, baseT + 2, baseT - 1, baseT - 2, baseT - 1, baseT - 2, baseT - 4, baseT - 7].map(v => +v.toFixed(1));
    tempMax = tempAvg.map(v => +(v + 6.5).toFixed(1));
    tempMin = tempAvg.map(v => +(v - 7.5).toFixed(1));
  } else if (tempView === 'daily' && currentHistoryData?.dailyRecords?.length) {
    tempXAxis = currentHistoryData.dailyRecords.map(r => r.date.slice(5));
    tempMax = currentHistoryData.dailyRecords.map(r => r.tmax !== null && r.tmax !== undefined ? +r.tmax.toFixed(1) : +(district.temperature + 4).toFixed(1));
    tempMin = currentHistoryData.dailyRecords.map(r => r.tmin !== null && r.tmin !== undefined ? +r.tmin.toFixed(1) : +(district.temperature - 6).toFixed(1));
    tempAvg = currentHistoryData.dailyRecords.map(r => r.tmean !== null && r.tmean !== undefined ? +r.tmean.toFixed(1) : +(district.temperature).toFixed(1));
  } else {
    // Annual multi-year temperature trend
    tempXAxis = annualHistorical.map(h => h.year.toString());
    tempMax = annualHistorical.map(h => +(h.tmax).toFixed(1));
    tempAvg = annualHistorical.map(h => +(h.tmax - 6).toFixed(1));
    tempMin = annualHistorical.map(h => +(h.tmax - 14).toFixed(1));
  }

  const tempOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(7,19,48,0.95)',
      borderColor: '#00f0ff',
      textStyle: { color: '#fff', fontSize: 10 }
    },
    legend: {
      data: ['Average', 'Max', 'Min'],
      textStyle: { color: '#C0D0DE', fontSize: 9 },
      icon: 'circle',
      itemWidth: 6,
      itemHeight: 6,
      top: 0,
      left: 10
    },
    grid: { top: 30, right: 30, bottom: 20, left: 30 },
    xAxis: {
      type: 'category',
      data: tempXAxis,
      axisLabel: {
        color: '#8EA5B7',
        fontSize: 9,
        interval: tempXAxis.length > 30 ? 4 : tempXAxis.length > 15 ? 2 : 0
      },
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } }
    },
    yAxis: {
      type: 'value',
      name: '°C',
      nameTextStyle: { color: '#8EA5B7', fontSize: 9 },
      axisLabel: { color: '#8EA5B7', fontSize: 9 },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } },
      min: (value: { min: number }) => Math.floor(Math.max(5, value.min - 2)),
      max: (value: { max: number }) => Math.ceil(Math.min(50, value.max + 2))
    },
    series: [
      {
        name: 'Average',
        type: 'line',
        data: tempAvg,
        itemStyle: { color: '#f59e0b' },
        lineStyle: { width: 2 },
        symbolSize: tempXAxis.length > 30 ? 2 : 4
      },
      {
        name: 'Max',
        type: 'line',
        data: tempMax,
        itemStyle: { color: '#ef4444' },
        lineStyle: { width: 2 },
        symbolSize: tempXAxis.length > 30 ? 2 : 4
      },
      {
        name: 'Min',
        type: 'line',
        data: tempMin,
        itemStyle: { color: '#3b82f6' },
        lineStyle: { width: 2 },
        symbolSize: tempXAxis.length > 30 ? 2 : 4
      }
    ]
  };

  return (
    <div className="flex-1 min-w-0 flex gap-2 h-full">
      {/* Rainfall Chart */}
      <Card className="flex-1 min-w-0 relative">
        <SectionTitle 
          title={`${district.name.toUpperCase()} - HISTORICAL RAINFALL (${rainfallTitlePeriod})`}
          right={
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-1 text-[9px] text-[#C0D0DE] bg-white/5 hover:bg-white/10 px-2 py-0.5 rounded border border-white/10 cursor-pointer transition-colors"
              >
                <Calendar size={10} className="text-[#00f0ff]" />
                <span className="capitalize">{currentPeriod.replace('_', ' ')}</span>
                <ChevronDown size={10} />
              </button>
              {showDropdown && (
                <div className="absolute right-0 top-full mt-1 w-32 bg-[#061126] border border-[#00f0ff]/30 rounded shadow-xl z-30 py-1 font-sans">
                  <button
                    onClick={() => handlePeriodChange('annual')}
                    className={`w-full text-left px-2 py-1 text-[9.5px] hover:bg-[#00f0ff]/10 ${currentPeriod === 'annual' ? 'text-[#00f0ff] font-bold' : 'text-slate-300'}`}
                  >
                    Annual (2010-2024)
                  </button>
                  <button
                    onClick={() => handlePeriodChange('7_days')}
                    className={`w-full text-left px-2 py-1 text-[9.5px] hover:bg-[#00f0ff]/10 ${currentPeriod === '7_days' ? 'text-[#00f0ff] font-bold' : 'text-slate-300'}`}
                  >
                    Last 7 Days
                  </button>
                  <button
                    onClick={() => handlePeriodChange('30_days')}
                    className={`w-full text-left px-2 py-1 text-[9.5px] hover:bg-[#00f0ff]/10 ${currentPeriod === '30_days' ? 'text-[#00f0ff] font-bold' : 'text-slate-300'}`}
                  >
                    Last 30 Days
                  </button>
                  <button
                    onClick={() => handlePeriodChange('90_days')}
                    className={`w-full text-left px-2 py-1 text-[9.5px] hover:bg-[#00f0ff]/10 ${currentPeriod === '90_days' ? 'text-[#00f0ff] font-bold' : 'text-slate-300'}`}
                  >
                    Last 90 Days
                  </button>
                </div>
              )}
            </div>
          }
        />
        <div className="flex-1 min-h-0 p-2 relative">
          {currentLoading && (
            <div className="absolute inset-0 bg-[#0A1320]/70 flex items-center justify-center z-10">
              <RefreshCw size={18} className="animate-spin text-[#00f0ff]" />
            </div>
          )}
          <ReactECharts option={rainfallOption} style={{ height: '100%', width: '100%' }} />
        </div>
      </Card>

      {/* Temp Chart */}
      <Card className="flex-1 min-w-0">
        <SectionTitle 
          title={`${district.name.toUpperCase()} - TEMPERATURE TRENDS`}
          right={
            <div className="flex items-center bg-white/5 p-0.5 rounded border border-white/10">
              <button
                onClick={() => setTempView('monthly')}
                className={`px-2 py-0.5 text-[9px] font-bold rounded transition-colors ${
                  tempView === 'monthly'
                    ? 'text-[#00f0ff] bg-[#00f0ff]/10 border border-[#00f0ff]/30'
                    : 'text-[#8EA5B7] hover:text-white'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setTempView('daily')}
                className={`px-2 py-0.5 text-[9px] rounded transition-colors ${
                  tempView === 'daily'
                    ? 'text-[#00f0ff] bg-[#00f0ff]/10 border border-[#00f0ff]/30 font-bold'
                    : 'text-[#8EA5B7] hover:text-white'
                }`}
              >
                Daily
              </button>
              <button
                onClick={() => setTempView('annual')}
                className={`px-2 py-0.5 text-[9px] rounded transition-colors ${
                  tempView === 'annual'
                    ? 'text-[#00f0ff] bg-[#00f0ff]/10 border border-[#00f0ff]/30 font-bold'
                    : 'text-[#8EA5B7] hover:text-white'
                }`}
              >
                Annual
              </button>
            </div>
          }
        />
        <div className="flex-1 min-h-0 p-2">
          <ReactECharts option={tempOption} style={{ height: '100%', width: '100%' }} />
        </div>
      </Card>
    </div>
  );
};
