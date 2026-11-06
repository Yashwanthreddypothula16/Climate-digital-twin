import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import {
  Thermometer,
  CloudRain,
  Droplets,
  Wind,
  AlertTriangle,
  Sun,
  MapPin,
  Check,
  TrendingUp,
  Sprout,
  Activity,
  Layers,
  Info
} from 'lucide-react';
import { AnalyticsMap } from './AnalyticsMap';
import { DistrictAnalyticsData, AnalyticsTab } from '../../types/analytics';
import { Sparkline } from '../common/Sparkline';
import { CircularGauge } from '../common/CircularGauge';

interface ClimateOverviewProps {
  data: DistrictAnalyticsData;
  selectedDistrictId: string;
  onSelectDistrict: (id: string) => void;
  activeTab: AnalyticsTab;
  onSelectTab: (tab: AnalyticsTab) => void;
}

export const ClimateOverview: React.FC<ClimateOverviewProps> = ({
  data,
  selectedDistrictId,
  onSelectDistrict,
  activeTab,
  onSelectTab,
}) => {
  // ── 1. Temperature Trend Option ───────────────────────────
  const tempTrendOption = useMemo(() => {
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
        data: ['Average', 'Maximum', 'Minimum'],
        top: 0,
        right: 10,
        textStyle: { color: '#94A3B8', fontSize: 9 },
        itemWidth: 10,
        itemHeight: 6,
      },
      grid: { top: 28, bottom: 22, left: 32, right: 15 },
      xAxis: {
        type: 'category',
        data: data.temporal.years,
        axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
        axisLabel: { color: '#64748B', fontSize: 8.5 },
      },
      yAxis: {
        type: 'value',
        min: 10,
        max: 45,
        interval: 10,
        splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } },
        axisLabel: { color: '#64748B', fontSize: 8.5, formatter: '{value}°' },
      },
      series: [
        {
          name: 'Maximum',
          type: 'line',
          data: data.temporal.tempMax,
          smooth: true,
          showSymbol: true,
          symbolSize: 4,
          itemStyle: { color: '#EF4444' },
          lineStyle: { width: 1.8, shadowColor: 'rgba(239,68,68,0.4)', shadowBlur: 4 },
        },
        {
          name: 'Average',
          type: 'line',
          data: data.temporal.tempAvg,
          smooth: true,
          showSymbol: true,
          symbolSize: 4,
          itemStyle: { color: '#F59E0B' },
          lineStyle: { width: 1.8, shadowColor: 'rgba(245,158,11,0.4)', shadowBlur: 4 },
        },
        {
          name: 'Minimum',
          type: 'line',
          data: data.temporal.tempMin,
          smooth: true,
          showSymbol: true,
          symbolSize: 4,
          itemStyle: { color: '#00F0FF' },
          lineStyle: { width: 1.8, shadowColor: 'rgba(0,240,255,0.4)', shadowBlur: 4 },
        },
      ],
    };
  }, [data]);

  // ── 2. Rainfall Analysis Option ───────────────────────────
  const rainfallOption = useMemo(() => {
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
        data: ['Actual', '5-Year Moving Average'],
        top: 0,
        right: 10,
        textStyle: { color: '#94A3B8', fontSize: 9 },
        itemWidth: 10,
        itemHeight: 6,
      },
      grid: { top: 28, bottom: 22, left: 38, right: 15 },
      xAxis: {
        type: 'category',
        data: data.temporal.years,
        axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
        axisLabel: { color: '#64748B', fontSize: 8.5 },
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: 2000,
        interval: 500,
        splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } },
        axisLabel: { color: '#64748B', fontSize: 8.5 },
      },
      series: [
        {
          name: 'Actual',
          type: 'bar',
          data: data.temporal.rainfallActual,
          barWidth: '42%',
          itemStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: '#00F0FF' },
                { offset: 1, color: '#0066CC' },
              ],
            },
            borderRadius: [2, 2, 0, 0],
          },
        },
        {
          name: '5-Year Moving Average',
          type: 'line',
          data: data.temporal.rainfallMovingAvg,
          smooth: true,
          showSymbol: true,
          symbolSize: 4,
          itemStyle: { color: '#F59E0B' },
          lineStyle: { width: 2, shadowColor: 'rgba(245,158,11,0.5)', shadowBlur: 6 },
        },
      ],
    };
  }, [data]);

  // ── 3. Monthly Climate Pattern Option ─────────────────────
  const monthlyPatternOption = useMemo(() => {
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
        data: ['Temperature (°C)', 'Rainfall (mm)', 'Humidity (%)'],
        top: 0,
        right: 10,
        textStyle: { color: '#94A3B8', fontSize: 9 },
        itemWidth: 10,
        itemHeight: 6,
      },
      grid: { top: 28, bottom: 22, left: 32, right: 34 },
      xAxis: {
        type: 'category',
        data: data.temporal.monthlyMonths,
        axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
        axisLabel: { color: '#64748B', fontSize: 8.5 },
      },
      yAxis: [
        {
          type: 'value',
          name: 'Temp',
          min: 0,
          max: 50,
          interval: 10,
          splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } },
          axisLabel: { color: '#64748B', fontSize: 8 },
        },
        {
          type: 'value',
          name: 'Rain / Hum',
          min: 0,
          max: 500,
          interval: 100,
          splitLine: { show: false },
          axisLabel: { color: '#64748B', fontSize: 8 },
        },
      ],
      series: [
        {
          name: 'Temperature (°C)',
          type: 'line',
          data: data.temporal.monthlyTemp,
          smooth: true,
          itemStyle: { color: '#EF4444' },
          lineStyle: { width: 1.8 },
        },
        {
          name: 'Rainfall (mm)',
          type: 'bar',
          yAxisIndex: 1,
          data: data.temporal.monthlyRain,
          barWidth: '45%',
          itemStyle: {
            color: '#00F0FF',
            borderRadius: [2, 2, 0, 0],
          },
        },
        {
          name: 'Humidity (%)',
          type: 'line',
          data: data.temporal.monthlyHumidity,
          smooth: true,
          itemStyle: { color: '#10B981' },
          lineStyle: { width: 1.8 },
        },
      ],
    };
  }, [data]);

  // ── 4. Land Use Donut Option ──────────────────────────────
  const landUseDonutOption = useMemo(() => {
    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c}% ({d}%)',
        backgroundColor: 'rgba(5, 14, 28, 0.95)',
        borderColor: '#00F0FF',
        borderWidth: 1,
        textStyle: { color: '#F1F5F9', fontSize: 10 },
      },
      series: [
        {
          name: 'Land Use',
          type: 'pie',
          radius: ['52%', '80%'],
          center: ['50%', '50%'],
          avoidLabelOverlap: false,
          label: { show: false },
          emphasis: {
            scale: true,
            scaleSize: 4,
          },
          data: [
            { value: data.landUse.urban, name: 'Urban Area', itemStyle: { color: '#00F0FF' } },
            { value: data.landUse.agriculture, name: 'Agriculture', itemStyle: { color: '#F59E0B' } },
            { value: data.landUse.forest, name: 'Forest', itemStyle: { color: '#10B981' } },
            { value: data.landUse.waterBodies, name: 'Water Bodies', itemStyle: { color: '#3B82F6' } },
            { value: data.landUse.others, name: 'Others', itemStyle: { color: '#EC4899' } },
          ],
        },
      ],
    };
  }, [data]);

  // ── 5. NDVI Trend Option ──────────────────────────────────
  const ndviTrendOption = useMemo(() => {
    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(5, 14, 28, 0.95)',
        borderColor: '#10B981',
        borderWidth: 1,
        textStyle: { color: '#F1F5F9', fontSize: 10 },
      },
      grid: { top: 12, bottom: 20, left: 24, right: 10 },
      xAxis: {
        type: 'category',
        data: data.landUse.ndviYears,
        axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
        axisLabel: { color: '#64748B', fontSize: 8 },
      },
      yAxis: {
        type: 'value',
        min: 0.0,
        max: 0.8,
        interval: 0.2,
        splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } },
        axisLabel: { color: '#64748B', fontSize: 8 },
      },
      series: [
        {
          name: 'NDVI',
          type: 'line',
          data: data.landUse.ndviValues,
          smooth: true,
          showSymbol: true,
          symbolSize: 4,
          itemStyle: { color: '#10B981' },
          lineStyle: { width: 1.8, shadowColor: 'rgba(16,185,129,0.5)', shadowBlur: 5 },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(16,185,129,0.3)' },
                { offset: 1, color: 'rgba(16,185,129,0.0)' },
              ],
            },
          },
        },
      ],
    };
  }, [data]);

  return (
    <div className="flex-1 min-h-0 flex flex-col gap-1.5 p-1 select-none overflow-y-auto custom-scrollbar">
      {/* ════════════════════════════════════════════════════════════════
          ROW 1: MAP (LEFT ~56%) + KEY STATS & PHOTO (RIGHT ~44%)
         ════════════════════════════════════════════════════════════════ */}
      <div className="flex-[1.25] min-h-[360px] flex gap-1.5 shrink-0">
        {/* Map Viewport (~56%) */}
        <div className="flex-[5.6] min-w-0 h-full">
          <AnalyticsMap
            selectedDistrictId={selectedDistrictId}
            onSelectDistrict={onSelectDistrict}
            title={`TELANGANA STATE - DISTRICT ANALYTICS (AVERAGE RAINFALL)`}
          />
        </div>

        {/* Right Info Cards (~44%) */}
        <div className="flex-[4.4] min-w-0 h-full flex flex-col gap-1.5">
          {/* Card 1: District Header Card */}
          <div className="p-2.5 rounded-xl bg-[#030d1d]/80 border border-[#00f0ff]/20 flex items-center justify-between gap-3 shadow-lg shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              {/* Photo Thumbnail */}
              <div className="w-14 h-12 rounded-lg overflow-hidden border border-[#00f0ff]/30 shadow shrink-0 bg-[#061428] relative">
                <img
                  src="/building.jpg"
                  alt={data.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback visual if image fails
                    (e.currentTarget as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020b18]/80 to-transparent" />
              </div>

              {/* Title & Coordinates */}
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    DISTRICT ANALYTICS -
                  </span>
                  <span className="text-[12px] uppercase font-extrabold text-[#00f0ff] tracking-wide truncate">
                    {data.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[9.5px] font-mono text-slate-400 mt-0.5">
                  <span>
                    📍 {data.coordinates[0].toFixed(4)}° N, {data.coordinates[1].toFixed(4)}° E
                  </span>
                  <span>•</span>
                  <span>Area: {data.areaKm2} km²</span>
                </div>
              </div>
            </div>

            {/* Selected District Badge & View All */}
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span className="text-[9px] text-[#00f0ff] hover:underline cursor-pointer">
                View All Districts
              </span>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#00f0ff]/15 border border-[#00f0ff]/40 text-[#00f0ff] text-[9.5px] font-bold shadow-[0_0_8px_rgba(0,240,255,0.25)]">
                <Check className="w-3 h-3" />
                <span>Selected District</span>
              </div>
            </div>
          </div>

          {/* Card 2: Key Climate Statistics (2015 - 2026) Grid */}
          <div className="p-2.5 rounded-xl bg-[#030d1d]/80 border border-[#00f0ff]/20 flex flex-col justify-between shadow-lg flex-1 min-h-0">
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block mb-1.5 shrink-0">
              KEY CLIMATE STATISTICS (2015 - 2026)
            </span>

            <div className="grid grid-cols-3 gap-2 flex-1 min-h-0">
              {/* Avg Temp */}
              <div className="p-2 rounded-lg bg-[#051428]/70 border border-white/5 flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-red-500/15 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0">
                  <Thermometer className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[8.5px] text-slate-400 block truncate">Avg. Temperature</span>
                  <span className="text-[13px] font-bold text-white block leading-tight">{data.stats.avgTemp} °C</span>
                  <span className="text-[8px] text-red-400 font-mono block truncate">{data.stats.tempVsBaseline}</span>
                </div>
              </div>

              {/* Total Rain */}
              <div className="p-2 rounded-lg bg-[#051428]/70 border border-white/5 flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-cyan-500/15 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
                  <CloudRain className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[8.5px] text-slate-400 block truncate">Total Rainfall</span>
                  <span className="text-[13px] font-bold text-white block leading-tight">{data.stats.totalRain} mm</span>
                  <span className="text-[8px] text-cyan-400 font-mono block truncate">{data.stats.rainVsBaseline}</span>
                </div>
              </div>

              {/* Avg Humidity */}
              <div className="p-2 rounded-lg bg-[#051428]/70 border border-white/5 flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-blue-500/15 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0">
                  <Droplets className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[8.5px] text-slate-400 block truncate">Avg. Humidity</span>
                  <span className="text-[13px] font-bold text-white block leading-tight">{data.stats.avgHumidity} %</span>
                  <span className="text-[8px] text-emerald-400 font-mono block truncate">{data.stats.humidityVsBaseline}</span>
                </div>
              </div>

              {/* Avg Wind */}
              <div className="p-2 rounded-lg bg-[#051428]/70 border border-white/5 flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-teal-500/15 border border-teal-500/40 flex items-center justify-center text-teal-400 shrink-0">
                  <Wind className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[8.5px] text-slate-400 block truncate">Avg. Wind Speed</span>
                  <span className="text-[13px] font-bold text-white block leading-tight">{data.stats.avgWind} km/h</span>
                  <span className="text-[8px] text-teal-400 font-mono block truncate">{data.stats.windVsBaseline}</span>
                </div>
              </div>

              {/* Extreme Events */}
              <div className="p-2 rounded-lg bg-[#051428]/70 border border-white/5 flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[8.5px] text-slate-400 block truncate">Extreme Events</span>
                  <span className="text-[13px] font-bold text-white block leading-tight">{data.stats.extremeEventsCount}</span>
                  <span className="text-[8px] text-amber-400 font-mono block truncate">{data.stats.extremeVsBaseline}</span>
                </div>
              </div>

              {/* Drought Index */}
              <div className="p-2 rounded-lg bg-[#051428]/70 border border-white/5 flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-yellow-500/15 border border-yellow-500/40 flex items-center justify-center text-yellow-400 shrink-0">
                  <Sun className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[8.5px] text-slate-400 block truncate">Drought Index</span>
                  <span className="text-[13px] font-bold text-white block leading-tight">{data.stats.droughtIndex}</span>
                  <span className="text-[8px] text-yellow-400 font-mono block truncate">{data.stats.droughtStatus}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Recent Trends (Last 5 Years) Sparklines */}
          <div className="p-2.5 rounded-xl bg-[#030d1d]/80 border border-[#00f0ff]/20 shadow-lg shrink-0">
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
              RECENT TRENDS (LAST 5 YEARS)
            </span>

            <div className="grid grid-cols-4 gap-2">
              {/* Temp trend */}
              <div className="p-1.5 rounded bg-[#051428]/60 border border-white/5">
                <span className="text-[8.5px] text-slate-400 block">Temperature</span>
                <span className="text-[10.5px] font-bold text-red-400 block mb-1">{data.recentTrends.tempDelta}</span>
                <Sparkline data={data.recentTrends.tempSpark} color="#EF4444" height={20} width={75} />
              </div>

              {/* Rain trend */}
              <div className="p-1.5 rounded bg-[#051428]/60 border border-white/5">
                <span className="text-[8.5px] text-slate-400 block">Rainfall</span>
                <span className="text-[10.5px] font-bold text-cyan-400 block mb-1">{data.recentTrends.rainDelta}</span>
                <Sparkline data={data.recentTrends.rainSpark} color="#00F0FF" height={20} width={75} />
              </div>

              {/* Humidity trend */}
              <div className="p-1.5 rounded bg-[#051428]/60 border border-white/5">
                <span className="text-[8.5px] text-slate-400 block">Humidity</span>
                <span className="text-[10.5px] font-bold text-emerald-400 block mb-1">{data.recentTrends.humidityDelta}</span>
                <Sparkline data={data.recentTrends.humiditySpark} color="#10B981" height={20} width={75} />
              </div>

              {/* Wind trend */}
              <div className="p-1.5 rounded bg-[#051428]/60 border border-white/5">
                <span className="text-[8.5px] text-slate-400 block">Wind Speed</span>
                <span className="text-[10.5px] font-bold text-teal-400 block mb-1">{data.recentTrends.windDelta}</span>
                <Sparkline data={data.recentTrends.windSpark} color="#14B8A6" height={20} width={75} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          SECONDARY TAB BAR (Quick mode switch matching reference image)
         ════════════════════════════════════════════════════════════════ */}
      <div className="flex items-center gap-1.5 px-1 py-1 rounded-lg bg-[#020712] border border-[#00f0ff]/15 shrink-0 overflow-x-auto">
        {[
          { id: 'overview', label: 'CLIMATE OVERVIEW' },
          { id: 'trend', label: 'TREND ANALYSIS' },
          { id: 'extreme', label: 'EXTREME EVENTS' },
          { id: 'comparative', label: 'COMPARATIVE ANALYSIS' },
          { id: 'correlation', label: 'CORRELATION ANALYSIS' },
          { id: 'spatial', label: 'SPATIAL INSIGHTS' },
          { id: 'sectoral', label: 'SECTORAL IMPACT' },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id as AnalyticsTab)}
              className={`px-3 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-[#00f0ff] text-[#020810] shadow-[0_0_10px_rgba(0,240,255,0.45)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ════════════════════════════════════════════════════════════════
          ROW 2: 3 BOTTOM TEMPORAL CHARTS
         ════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-3 gap-1.5 min-h-[175px] shrink-0">
        {/* Chart 1: Annual Temperature Trend */}
        <div className="p-2 rounded-xl bg-[#030d1d]/85 border border-[#00f0ff]/15 flex flex-col shadow-md">
          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider truncate mb-1">
            ANNUAL TEMPERATURE TREND - {data.name}
          </span>
          <div className="flex-1 min-h-0 w-full">
            <ReactECharts option={tempTrendOption} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>

        {/* Chart 2: Annual Rainfall Analysis */}
        <div className="p-2 rounded-xl bg-[#030d1d]/85 border border-[#00f0ff]/15 flex flex-col shadow-md">
          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider truncate mb-1">
            ANNUAL RAINFALL ANALYSIS - {data.name}
          </span>
          <div className="flex-1 min-h-0 w-full">
            <ReactECharts option={rainfallOption} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>

        {/* Chart 3: Monthly Climate Pattern */}
        <div className="p-2 rounded-xl bg-[#030d1d]/85 border border-[#00f0ff]/15 flex flex-col shadow-md">
          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider truncate mb-1">
            MONTHLY CLIMATE PATTERN (AVERAGE)
          </span>
          <div className="flex-1 min-h-0 w-full">
            <ReactECharts option={monthlyPatternOption} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          ROW 3: CLIMATE RISKS + LAND USE/NDVI + KEY INSIGHTS
         ════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-3 gap-1.5 min-h-[185px] shrink-0">
        {/* Panel 1: Climate Risk Analysis (4 Circular Gauges) */}
        <div className="p-2.5 rounded-xl bg-[#030d1d]/85 border border-[#00f0ff]/15 flex flex-col shadow-md">
          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block mb-2">
            CLIMATE RISK ANALYSIS - {data.name}
          </span>

          <div className="grid grid-cols-4 gap-1.5 flex-1 items-center">
            {/* Heat Risk */}
            <div className="flex flex-col items-center text-center">
              <CircularGauge percentage={data.risks.heat.score} color="#EF4444" glowColor="rgba(239,68,68,0.5)" size={48} />
              <span className="text-[9px] font-bold text-slate-300 mt-1">Heat Risk</span>
              <span className="text-[8.5px] text-red-400 font-semibold">{data.risks.heat.level}</span>
              <span className="text-[7.5px] text-red-400/80 font-mono">↑ {data.risks.heat.change}</span>
            </div>

            {/* Flood Risk */}
            <div className="flex flex-col items-center text-center">
              <CircularGauge percentage={data.risks.flood.score} color="#F59E0B" glowColor="rgba(245,158,11,0.5)" size={48} />
              <span className="text-[9px] font-bold text-slate-300 mt-1">Flood Risk</span>
              <span className="text-[8.5px] text-amber-400 font-semibold">{data.risks.flood.level}</span>
              <span className="text-[7.5px] text-amber-400/80 font-mono">↑ {data.risks.flood.change}</span>
            </div>

            {/* Drought Risk */}
            <div className="flex flex-col items-center text-center">
              <CircularGauge percentage={data.risks.drought.score} color="#10B981" glowColor="rgba(16,185,129,0.5)" size={48} />
              <span className="text-[9px] font-bold text-slate-300 mt-1">Drought Risk</span>
              <span className="text-[8.5px] text-emerald-400 font-semibold">{data.risks.drought.level}</span>
              <span className="text-[7.5px] text-emerald-400/80 font-mono">↓ {data.risks.drought.change}</span>
            </div>

            {/* Wind Risk */}
            <div className="flex flex-col items-center text-center">
              <CircularGauge percentage={data.risks.wind.score} color="#00F0FF" glowColor="rgba(0,240,255,0.5)" size={48} />
              <span className="text-[9px] font-bold text-slate-300 mt-1">Wind Risk</span>
              <span className="text-[8.5px] text-cyan-400 font-semibold">{data.risks.wind.level}</span>
              <span className="text-[7.5px] text-cyan-400/80 font-mono">↑ {data.risks.wind.change}</span>
            </div>
          </div>
        </div>

        {/* Panel 2: Land Use & Environmental Indicators (Donut + NDVI) */}
        <div className="p-2.5 rounded-xl bg-[#030d1d]/85 border border-[#00f0ff]/15 flex flex-col shadow-md">
          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
            LAND USE & ENVIRONMENTAL INDICATORS
          </span>

          <div className="flex-1 min-h-0 flex gap-2">
            {/* Left Donut */}
            <div className="flex-1 min-w-0 flex items-center justify-center relative">
              <div className="w-full h-full">
                <ReactECharts option={landUseDonutOption} style={{ height: '100%', width: '100%' }} />
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[11px] font-bold text-white">{data.areaKm2}</span>
                <span className="text-[7.5px] font-mono text-slate-400">km²</span>
              </div>
            </div>

            {/* Middle Legend */}
            <div className="flex flex-col justify-center text-[8.5px] space-y-1 shrink-0 font-medium">
              <div className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-[#00f0ff]" />
                <span>Urban {data.landUse.urban}%</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-[#f59e0b]" />
                <span>Agri {data.landUse.agriculture}%</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                <span>Forest {data.landUse.forest}%</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-[#3b82f6]" />
                <span>Water {data.landUse.waterBodies}%</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-[#ec4899]" />
                <span>Others {data.landUse.others}%</span>
              </div>
            </div>

            {/* Right: NDVI Trend Mini */}
            <div className="flex-1 min-w-0 flex flex-col">
              <span className="text-[9px] font-bold text-emerald-400 block text-right">NDVI TREND</span>
              <div className="flex-1 min-h-0">
                <ReactECharts option={ndviTrendOption} style={{ height: '100%', width: '100%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Panel 3: Key Insights */}
        <div className="p-2.5 rounded-xl bg-[#030d1d]/85 border border-[#00f0ff]/15 flex flex-col shadow-md">
          <div className="flex items-center justify-between mb-1.5 shrink-0">
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
              KEY INSIGHTS - {data.name}
            </span>
            <span className="text-[9px] text-[#00f0ff] hover:underline cursor-pointer">
              View All
            </span>
          </div>

          <div className="space-y-1.5 flex-1 min-h-0 overflow-y-auto pr-1">
            {data.keyInsights.map((insight) => (
              <div
                key={insight.id}
                className="p-1.5 rounded-lg bg-[#051428]/60 border border-white/5 flex items-start gap-2"
              >
                <div
                  className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5"
                  style={{ backgroundColor: `${insight.color}20`, color: insight.color }}
                >
                  {insight.icon === 'temp' && <Thermometer className="w-3 h-3" />}
                  {insight.icon === 'rain' && <CloudRain className="w-3 h-3" />}
                  {insight.icon === 'alert' && <AlertTriangle className="w-3 h-3" />}
                  {insight.icon === 'sprout' && <Sprout className="w-3 h-3" />}
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[9.5px] text-slate-200 leading-snug block">
                    {insight.explanation}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
