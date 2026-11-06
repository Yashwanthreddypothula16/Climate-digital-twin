import React from 'react';
import { 
  Thermometer, 
  CloudRain, 
  Wind, 
  Droplets, 
  Activity, 
  Sun, 
  Trees, 
  Waves,
  Compass,
  Layers,
  Maximize2
} from 'lucide-react';
import { ClimateLayer } from '../../types/climate';

interface LayerPillBarProps {
  activeLayer: ClimateLayer;
  onSelectLayer: (layer: ClimateLayer) => void;
  viewMode: '3D' | '2D';
  onToggleViewMode: (mode: '3D' | '2D') => void;
  satelliteMode: boolean;
  onToggleSatellite: () => void;
}

export const LayerPillBar: React.FC<LayerPillBarProps> = ({
  activeLayer,
  onSelectLayer,
  viewMode,
  onToggleViewMode,
  satelliteMode,
  onToggleSatellite,
}) => {
  const layerButtons: { id: ClimateLayer; label: string; icon: any }[] = [
    { id: 'Temperature', label: 'Temperature', icon: Thermometer },
    { id: 'Rainfall', label: 'Rainfall', icon: CloudRain },
    { id: 'Wind', label: 'Wind', icon: Wind },
    { id: 'Humidity', label: 'Humidity', icon: Droplets },
    { id: 'AQI', label: 'AQI', icon: Activity },
    { id: 'Drought', label: 'Drought', icon: Sun },
    { id: 'NDVI', label: 'NDVI', icon: Trees },
    { id: 'Flood Risk', label: 'Flood Risk', icon: Waves },
  ];

  return (
    <div className="absolute top-3 left-4 right-4 z-20 flex items-center justify-between pointer-events-auto">
      {/* Center Layer Pills Bar */}
      <div className="flex items-center space-x-1.5 p-1 bg-[#06112d]/85 border border-[#00f0ff]/25 rounded-xl backdrop-blur-md shadow-[0_4px_25px_rgba(0,0,0,0.5)]">
        {layerButtons.map((btn) => {
          const Icon = btn.icon;
          const isActive = activeLayer === btn.id;
          return (
            <button
              key={btn.id}
              onClick={() => onSelectLayer(btn.id)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-tight transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-[#00f0ff]/25 to-blue-600/30 text-white border border-[#00f0ff] shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                  : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#00f0ff]' : 'text-slate-400'}`} />
              <span className="hidden md:inline">{btn.label}</span>
            </button>
          );
        })}
      </div>

      {/* Right Controls: 3D/2D switch + Satellite + Compass */}
      <div className="flex items-center space-x-2">
        {/* 3D / 2D Switcher */}
        <div className="flex items-center p-1 bg-[#06112d]/85 border border-[#00f0ff]/25 rounded-xl backdrop-blur-md">
          <button
            onClick={() => onToggleViewMode('3D')}
            className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
              viewMode === '3D'
                ? 'bg-[#00f0ff] text-black shadow-[0_0_10px_#00f0ff]'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            3D
          </button>
          <button
            onClick={() => onToggleViewMode('2D')}
            className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
              viewMode === '2D'
                ? 'bg-[#00f0ff] text-black shadow-[0_0_10px_#00f0ff]'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            2D
          </button>
          <button
            className="p-1 text-slate-400 hover:text-[#00f0ff] transition-colors ml-1"
            title="Layer Stack"
          >
            <Layers className="w-3.5 h-3.5" />
          </button>
          <button
            className="p-1 text-slate-400 hover:text-[#00f0ff] transition-colors"
            title="Fullscreen Center View"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Compass & Satellite Toggle */}
        <div className="flex items-center space-x-1.5 p-1 bg-[#06112d]/85 border border-[#00f0ff]/25 rounded-xl backdrop-blur-md">
          <button
            onClick={onToggleSatellite}
            className={`px-2 py-1 rounded-lg text-[11px] font-medium flex items-center space-x-1 transition-all ${
              satelliteMode
                ? 'bg-blue-600/30 border border-cyan-400 text-cyan-200'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse mr-0.5" />
            <span>Satellite</span>
          </button>

          {/* Compass North Needle */}
          <div className="w-7 h-7 rounded-full bg-slate-900 border border-cyan-400/40 flex items-center justify-center relative shadow-[0_0_8px_rgba(0,240,255,0.2)]">
            <Compass className="w-4 h-4 text-cyan-400 animate-spin-slow" />
            <span className="absolute -top-1.5 text-[8px] font-black text-cyan-300 font-mono">N</span>
          </div>
        </div>
      </div>
    </div>
  );
};
