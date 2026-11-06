import React from 'react';
import { ClimateLayer } from '../../types/climate';

interface HeatmapLegendProps {
  layer: ClimateLayer;
}

export const HeatmapLegend: React.FC<HeatmapLegendProps> = ({ layer }) => {
  const getLegendData = () => {
    switch (layer) {
      case 'Rainfall':
        return {
          title: 'Rainfall (mm)',
          gradient: 'linear-gradient(to bottom, #001155, #0055ff, #00d4ff, #00ff88, #ffff00, #ff5500)',
          ticks: ['150', '120', '90', '60', '30', '15', '0'],
        };
      case 'Wind':
        return {
          title: 'Wind Speed (km/h)',
          gradient: 'linear-gradient(to bottom, #ff0055, #ff8800, #ffff00, #00ffcc, #0066ff)',
          ticks: ['50', '40', '30', '20', '15', '10', '0'],
        };
      case 'Humidity':
        return {
          title: 'Humidity (%)',
          gradient: 'linear-gradient(to bottom, #0033cc, #0099ff, #00f0ff, #80ffea, #ffffff)',
          ticks: ['100', '85', '70', '55', '40', '25', '10'],
        };
      case 'AQI':
        return {
          title: 'AQI Level',
          gradient: 'linear-gradient(to bottom, #880000, #ff0000, #ff7a00, #ffcc00, #00e575)',
          ticks: ['300+', '200', '150', '100', '50', '25', '0'],
        };
      case 'NDVI':
        return {
          title: 'NDVI Vegetation',
          gradient: 'linear-gradient(to bottom, #005500, #00aa00, #55ff55, #ffff55, #aa5500)',
          ticks: ['0.9', '0.7', '0.5', '0.4', '0.3', '0.2', '0.1'],
        };
      case 'Drought':
        return {
          title: 'Drought Index',
          gradient: 'linear-gradient(to bottom, #770000, #cc3300, #ff9900, #ffcc33, #66cc33)',
          ticks: ['Extreme', 'Severe', 'Moderate', 'Mild', 'Normal'],
        };
      case 'Flood Risk':
        return {
          title: 'Flood Hazard',
          gradient: 'linear-gradient(to bottom, #7f00ff, #0033ff, #00ccff, #00ff88, #555555)',
          ticks: ['Critical', 'High', 'Moderate', 'Low', 'Very Low'],
        };
      case 'Temperature':
      default:
        return {
          title: 'Temperature (°C)',
          gradient: 'linear-gradient(to bottom, #ff0044, #ff4400, #ffaa00, #00e575, #00d4ff, #2b00ff)',
          ticks: ['45', '40', '35', '30', '25', '20', '15'],
        };
    }
  };

  const { title, gradient, ticks } = getLegendData();

  return (
    <div className="absolute right-4 top-24 z-20 flex flex-col items-center p-2.5 bg-[#06112d]/85 border border-[#00f0ff]/25 rounded-xl backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.5)] select-none">
      <span className="text-[10px] font-bold text-slate-300 tracking-tight mb-2 whitespace-nowrap">
        {title}
      </span>
      
      <div className="flex items-center space-x-2">
        {/* Gradient Vertical Bar */}
        <div
          className="w-3.5 h-44 rounded-full border border-white/20 shadow-inner"
          style={{ background: gradient }}
        />
        
        {/* Value Ticks */}
        <div className="flex flex-col justify-between h-44 text-[9px] font-mono font-semibold text-slate-300 py-0.5">
          {ticks.map((t, idx) => (
            <span key={idx} className="leading-none">
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
