import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { 
  ClimateLayer, 
  HistoricalParam, 
  NavigationTab, 
  DistrictClimateData, 
  WhatIfSimulationState,
  ClimateAlert 
} from '../types/climate';
import { DISTRICT_CLIMATE_MAP, calculateSimulatedClimate, STORY_MILESTONES } from '../data/climateData';
import { CLIMATE_ALERTS, DATA_SOURCES } from '../data/alertsData';
import { DEFAULT_AI_QA, getAiResponseForDistrict } from '../data/aiKnowledge';
import { DISTRICTS_LIST } from '../data/telanganaGeo';
import { DISTRICT_DATA } from '../data/districtClimate';
import { climateApiClient, CurrentWeatherResponse, AirQualityResponse } from '../services/apiClient';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export function useClimateState() {
  // Navigation & View Mode
  const [activeTab, setActiveTab] = useState<NavigationTab>('DASHBOARD');
  const [viewMode, setViewMode] = useState<'3D' | '2D'>('3D');
  const [satelliteMode, setSatelliteMode] = useState<boolean>(true);
  
  // District Selection
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('Hyderabad');
  
  // Layer Selection
  const [activeLayer, setActiveLayer] = useState<ClimateLayer>('Temperature');
  
  // Timeline State (2010 to 2035)
  const [timelineYear, setTimelineYear] = useState<number>(2024);
  const [isPlayingTimeline, setIsPlayingTimeline] = useState<boolean>(false);
  
  // Historical Explorer parameter
  const [historicalParam, setHistoricalParam] = useState<HistoricalParam>('Rainfall');
  
  // What-If Simulation State matching reference default values:
  // Temperature Increase: +3.0 °C
  // Rainfall Change: -20 %
  // CO2 Emission: +50 %
  // Forest Cover Change: -30 %
  // Urbanization Increase: +25 %
  // Population Growth: +40 %
  const [whatIfParams, setWhatIfParams] = useState<WhatIfSimulationState>({
    temperatureIncrease: 3.0,
    rainfallChange: -20,
    co2Emission: 50,
    forestCoverChange: -30,
    urbanizationIncrease: 25,
    populationGrowth: 40,
    isSimulating: false,
    hasRun: false,
  });

  // Story Mode State
  const [activeStoryIndex, setActiveStoryIndex] = useState<number>(3); // 2024 index
  const [isStoryPlaying, setIsStoryPlaying] = useState<boolean>(false);

  // AI Assistant Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'user',
      text: DEFAULT_AI_QA.question,
      timestamp: '12:44 PM',
    },
    {
      id: 'msg-2',
      sender: 'ai',
      text: DEFAULT_AI_QA.answer,
      timestamp: '12:45 PM',
    }
  ]);
  const [isAiTyping, setIsAiTyping] = useState<boolean>(false);

  // Weather Map Radar Active Toggles
  const [weatherMapToggles, setWeatherMapToggles] = useState({
    cloudCover: true,
    rainfall: true,
    thunderstorm: true,
    windFlow: true,
  });

  // Selected Alert for modal/inspect
  const [selectedAlert, setSelectedAlert] = useState<ClimateAlert | null>(null);

  // Sound enabled
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);

  // Live Open-Meteo State
  const [liveWeather, setLiveWeather] = useState<CurrentWeatherResponse | null>(null);
  const [liveAqi, setLiveAqi] = useState<AirQualityResponse | null>(null);
  const [isLiveLoading, setIsLiveLoading] = useState<boolean>(false);
  const liveRequestTokenRef = useRef<number>(0);

  // Fetch live Open-Meteo weather and air-quality whenever selectedDistrictId changes
  const fetchLiveDistrictData = useCallback((distId: string) => {
    const token = ++liveRequestTokenRef.current;
    setIsLiveLoading(true);

    Promise.allSettled([
      climateApiClient.getCurrentWeather(distId),
      climateApiClient.getAirQuality(distId),
    ]).then(([wRes, aRes]) => {
      // Race condition protection: ensure this is still the newest request
      if (token !== liveRequestTokenRef.current) return;

      if (wRes.status === 'fulfilled') {
        setLiveWeather(wRes.value);
      }
      if (aRes.status === 'fulfilled') {
        setLiveAqi(aRes.value);
      }
      setIsLiveLoading(false);
    });
  }, []);

  useEffect(() => {
    fetchLiveDistrictData(selectedDistrictId);
  }, [selectedDistrictId, fetchLiveDistrictData]);

  // Compute Current District Data with Simulation & Timeline Year
  // Resolve district: try by exact name, then by id (underscore) form
  const rawDistrictData = useMemo(() => {
    // Try direct lookup (name-based from GeoJSON click)
    const byName = DISTRICT_DATA[selectedDistrictId];
    let base: DistrictClimateData;

    if (byName) {
      const d = byName;
      const existing = DISTRICT_CLIMATE_MAP[d.id] || DISTRICT_CLIMATE_MAP['hyderabad'];
      base = {
        ...existing,
        id: d.id,
        name: d.name,
        center: d.center as [number, number],
        temperature: d.temperature,
        humidity: d.humidity,
        rainfall24h: d.rainfall24h,
        windSpeed: d.windSpeed,
        aqi: d.aqi,
        lst: d.lst,
        aqiStatus: d.aqi <= 50 ? 'Good' : d.aqi <= 100 ? 'Moderate' : 'Poor',
      } as DistrictClimateData;
    } else {
      const byId = Object.values(DISTRICT_DATA).find(d => d.id === selectedDistrictId);
      if (byId) {
        const existing = DISTRICT_CLIMATE_MAP[byId.id] || DISTRICT_CLIMATE_MAP['hyderabad'];
        base = {
          ...existing,
          id: byId.id,
          name: byId.name,
          center: byId.center as [number, number],
          temperature: byId.temperature,
          humidity: byId.humidity,
          rainfall24h: byId.rainfall24h,
          windSpeed: byId.windSpeed,
          aqi: byId.aqi,
          lst: byId.lst,
          aqiStatus: byId.aqi <= 50 ? 'Good' : byId.aqi <= 100 ? 'Moderate' : 'Poor',
        } as DistrictClimateData;
      } else {
        base = { ...DISTRICT_CLIMATE_MAP['hyderabad'] };
      }
    }

    // Overlay live Open-Meteo measurements if available for this district
    if (liveWeather && (
      liveWeather.districtId.toLowerCase() === base.id.toLowerCase() ||
      liveWeather.districtName.toLowerCase() === base.name.toLowerCase()
    )) {
      const liveAqiVal = liveAqi?.indices.indianCpcbEstimate.value ?? liveAqi?.indices.usAqi.value ?? base.aqi;
      const liveAqiCat = (liveAqi?.indices.indianCpcbEstimate.category || (liveAqiVal <= 50 ? 'Good' : liveAqiVal <= 100 ? 'Moderate' : 'Poor')) as any;

      return {
        ...base,
        temperature: liveWeather.temperature,
        humidity: liveWeather.relativeHumidity,
        rainfall24h: liveWeather.rainfall24h,
        windSpeed: liveWeather.windSpeed,
        windDirection: liveWeather.windDirection ?? base.windDirection,
        uvIndex: liveWeather.uvIndex ?? base.uvIndex,
        aqi: liveAqiVal,
        aqiStatus: liveAqiCat,
      };
    }

    return base;
  }, [selectedDistrictId, liveWeather, liveAqi]);

  const activeDistrictData: DistrictClimateData = useMemo(() => {
    // 1. Calculate What-If simulated delta if active
    let modified = rawDistrictData;
    if (whatIfParams.hasRun || whatIfParams.isSimulating) {
      modified = calculateSimulatedClimate(rawDistrictData, whatIfParams);
    }

    // 2. Adjust for timeline year interpolation if not 2024
    if (timelineYear !== 2024) {
      const yearDiff = timelineYear - 2024;
      const tempAdjustment = +(yearDiff * 0.12).toFixed(1);
      const rainAdjustment = -(yearDiff * 1.1);
      
      const newTemp = +(modified.temperature + tempAdjustment).toFixed(1);
      const newRain = +(Math.max(0, modified.rainfall24h + rainAdjustment)).toFixed(1);

      modified = {
        ...modified,
        temperature: newTemp,
        rainfall24h: newRain,
        lst: +(modified.lst + tempAdjustment * 1.2).toFixed(1),
      };
    }

    return modified;
  }, [rawDistrictData, whatIfParams, timelineYear]);

  // Timeline Auto-play Effect
  useEffect(() => {
    let interval: any;
    if (isPlayingTimeline) {
      interval = setInterval(() => {
        setTimelineYear(prev => {
          if (prev >= 2035) return 2015;
          return prev + 1;
        });
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isPlayingTimeline]);

  // Story Mode Auto-play Effect
  useEffect(() => {
    let interval: any;
    if (isStoryPlaying) {
      interval = setInterval(() => {
        setActiveStoryIndex(prev => {
          const next = (prev + 1) % STORY_MILESTONES.length;
          setTimelineYear(STORY_MILESTONES[next].year);
          return next;
        });
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isStoryPlaying]);

  // Update AI context automatically when district changes
  const selectDistrict = useCallback((districtId: string) => {
    setSelectedDistrictId(districtId);
    const dist = DISTRICT_CLIMATE_MAP[districtId] || DISTRICT_CLIMATE_MAP['hyderabad'];
    
    // Add proactive AI notification for selected district
    const insight = getAiResponseForDistrict(dist.name);
    setChatMessages(prev => [
      ...prev.slice(-4), // keep last few
      {
        id: `sys-${Date.now()}`,
        sender: 'ai',
        text: `📍 Focused on **${dist.name} District**: Current Temp ${dist.temperature}°C, AQI ${dist.aqi} (${dist.aqiStatus}). ${insight}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ]);
  }, []);

  // What-If Simulation Trigger
  const runSimulation = useCallback(() => {
    setWhatIfParams(prev => ({ ...prev, isSimulating: true }));
    setTimeout(() => {
      setWhatIfParams(prev => ({ ...prev, isSimulating: false, hasRun: true }));
      // Notify AI Assistant
      setChatMessages(prev => [
        ...prev,
        {
          id: `sim-${Date.now()}`,
          sender: 'ai',
          text: `⚡ **Simulation Execution Complete**: What-If scenario computed (+${whatIfParams.temperatureIncrease}°C, ${whatIfParams.rainfallChange}% Rain, +${whatIfParams.co2Emission}% CO₂). Surface temperatures rose across 33 districts; drought severity index increased significantly.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
    }, 600);
  }, [whatIfParams]);

  const resetSimulation = useCallback(() => {
    setWhatIfParams({
      temperatureIncrease: 3.0,
      rainfallChange: -20,
      co2Emission: 50,
      forestCoverChange: -30,
      urbanizationIncrease: 25,
      populationGrowth: 40,
      isSimulating: false,
      hasRun: false,
    });
  }, []);

  // Send AI Chat Message
  const sendChatMessage = useCallback((text: string) => {
    if (!text.trim()) return;
    const userMsgId = `user-${Date.now()}`;
    const botMsgId = `bot-${Date.now() + 1}`;
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setChatMessages(prev => [...prev, { id: userMsgId, sender: 'user', text, timestamp: timeStr }]);
    setIsAiTyping(true);

    setTimeout(() => {
      const response = getAiResponseForDistrict(activeDistrictData.name, text);
      setIsAiTyping(false);
      setChatMessages(prev => [...prev, { id: botMsgId, sender: 'ai', text: response, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    }, 800);
  }, [activeDistrictData]);

  return {
    activeTab,
    setActiveTab,
    viewMode,
    setViewMode,
    satelliteMode,
    setSatelliteMode,
    selectedDistrictId,
    setSelectedDistrictId: selectDistrict,
    selectDistrict,
    activeDistrict: activeDistrictData,
    activeDistrictData,
    activeLayer,
    setActiveLayer,
    currentYear: timelineYear,
    setCurrentYear: setTimelineYear,
    timelineYear,
    setTimelineYear,
    isPlayingTimeline,
    setIsPlayingTimeline,
    historicalParam,
    setHistoricalParam,
    whatIfParams,
    setWhatIfParams,
    runWhatIfSimulation: runSimulation,
    resetWhatIfSimulation: resetSimulation,
    runSimulation,
    resetSimulation,
    activeStoryIndex,
    setActiveStoryIndex,
    isStoryPlaying,
    setIsStoryPlaying,
    chatMessages,
    isAiTyping,
    sendChatMessage,
    weatherMapToggles,
    setWeatherMapToggles,
    selectedAlert,
    setSelectedAlert,
    soundEnabled,
    setSoundEnabled,
    districtsList: DISTRICTS_LIST,
    alerts: CLIMATE_ALERTS,
    alertsList: CLIMATE_ALERTS,
    dataSources: DATA_SOURCES,
    storyMilestones: STORY_MILESTONES,
    liveWeather,
    liveAqi,
    isLiveLoading,
    refreshLiveWeather: () => fetchLiveDistrictData(selectedDistrictId),
    attribution: "Weather and climate data by Open-Meteo.com under CC-BY 4.0",
  };
}

export const useClimateStore = useClimateState;
export type ClimateState = ReturnType<typeof useClimateState>;
