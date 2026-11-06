import React, { useState, useEffect } from 'react';
import { useClimateStore } from '../../state/useClimateStore';
import { climateApiClient, HistoricalResponse } from '../../services/apiClient';

import { LeftSidebar } from '../left-panel/LeftSidebar';
import { HistoricalMap } from './HistoricalMap';
import { HistoricalRightSidebar } from './HistoricalRightSidebar';
import { HistoricalCharts } from './HistoricalCharts';
import { HistoricalExtremes } from './HistoricalExtremes';
import { HistoricalInsights } from './HistoricalInsights';

type PeriodType = 'annual' | '7_days' | '30_days' | '90_days';

export const HistoricalPage: React.FC = () => {
  const store = useClimateStore();
  const [period, setPeriod] = useState<PeriodType>('annual');
  const [historyData, setHistoryData] = useState<HistoricalResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Fetch real Open-Meteo ERA5 reanalysis whenever district, period, or timeline year changes
  useEffect(() => {
    let isMounted = true;
    const today = new Date();
    let sStr: string;
    let eStr: string;

    if (period === 'annual') {
      const year = store.timelineYear || 2024;
      sStr = `${year}-01-01`;
      eStr = `${year}-12-31`;
    } else {
      let days = 7;
      if (period === '30_days') days = 30;
      if (period === '90_days') days = 90;

      // Account for ERA5 ~5 day latency
      const end = new Date(today.getTime() - 5 * 86400000);
      const start = new Date(end.getTime() - days * 86400000);
      sStr = start.toISOString().slice(0, 10);
      eStr = end.toISOString().slice(0, 10);
    }

    setIsLoading(true);
    climateApiClient.getHistoricalWeather(store.activeDistrict.id, sStr, eStr, period)
      .then((res) => {
        if (isMounted && res) {
          setHistoryData(res);
        }
      })
      .catch((err) => {
        console.warn('Historical weather fetch error:', err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [store.activeDistrict.id, period, store.timelineYear]);

  const periodLabel = period === 'annual'
    ? `${store.timelineYear || 2024}`
    : period.replace('_', ' ').toUpperCase();

  return (
    <div className="flex-1 min-h-0 flex flex-col p-2 gap-2 overflow-hidden w-full bg-[#050C14] text-slate-100 font-sans select-none">
      
      {/* Top Row: Left, Map, Right */}
      <div className="flex-[1.2] min-h-0 flex gap-2">
        <div className="flex-[0_0_16.6%] min-w-0 h-full">
          <LeftSidebar
            district={store.activeDistrict}
            alerts={store.alerts}
            sources={store.dataSources}
          />
        </div>
        <div className="flex-1 min-w-0 h-full">
          <HistoricalMap
            selectedDistrictId={store.selectedDistrictId}
            onSelectDistrict={store.setSelectedDistrictId}
            currentYear={store.timelineYear}
            onYearChange={store.setTimelineYear}
            isPlayingTimeline={store.isPlayingTimeline}
            onTogglePlayTimeline={() => store.setIsPlayingTimeline(!store.isPlayingTimeline)}
          />
        </div>
        <HistoricalRightSidebar district={store.activeDistrict} />
      </div>

      {/* Bottom Section */}
      <div className="flex-1 shrink-0 flex flex-col min-h-0">
        {/* Row 1: Charts & Extremes */}
        <div className="flex-1 min-h-0 flex gap-2">
          <HistoricalCharts
            district={store.activeDistrict}
            selectedYear={store.timelineYear}
            period={period}
            onPeriodChange={setPeriod}
            historyData={historyData}
            isLoading={isLoading}
          />
          <HistoricalExtremes
            district={store.activeDistrict}
            historyData={historyData}
            periodLabel={periodLabel}
            isLoading={isLoading}
          />
        </div>
        {/* Row 2: Insights */}
        <HistoricalInsights district={store.activeDistrict} />
      </div>

    </div>
  );
};
