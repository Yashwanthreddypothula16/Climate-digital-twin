import React, { useRef, useEffect, useState } from 'react';
import type { DistrictClimateData } from '../../types/climate';
import { ChevronDown, Layout, Shield } from 'lucide-react';

type Param = 'Rainfall' | 'Tmax' | 'Tmin';

interface Props {
  district: DistrictClimateData | null | undefined;
  selectedParam?: Param;
  onParamChange?: (p: Param) => void;
  onViewAll?: () => void;
}

// 2010 to 2024
const YEARS = [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];
const RAINFALL = [800, 1180, 1220, 1180, 1200, 1300, 1120, 928, 1200, 1020, 1100, 880, 1200, 1300, 0];
const TMAX = [38.2, 39.1, 40.5, 38.8, 41.2, 40.1, 39.5, 40.8, 41.5, 42.1, 39.0, 38.5, 41.0, 40.2, 39.9];
const TMIN = [20.1, 19.8, 21.2, 20.5, 22.1, 21.8, 20.9, 22.0, 22.8, 23.2, 21.0, 20.5, 22.5, 21.5, 21.8];

const DATA_MAP: Record<Param, number[]> = {
  Rainfall: RAINFALL,
  Tmax: TMAX,
  Tmin: TMIN,
};

const UNIT_MAP: Record<Param, string> = {
  Rainfall: 'mm',
  Tmax: '°C',
  Tmin: '°C',
};

export const HistoricalExplorer: React.FC<Props> = ({
  district,
  selectedParam = 'Rainfall',
  onParamChange,
  onViewAll,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Interactive index
  const [selectedIdx, setSelectedIdx] = useState<number>(7); // index 7 is 2017

  // Use selected district's historical record if present, falling back to canonical baseline
  const years = district?.historical?.length ? district.historical.map(h => h.year) : YEARS;
  const rainfallData = district?.historical?.length ? district.historical.map(h => Math.round(h.rainfall)) : RAINFALL;
  const tmaxData = district?.historical?.length ? district.historical.map(h => +h.tmax.toFixed(1)) : TMAX;
  const tminData = district?.historical?.length ? district.historical.map(h => +(h.tmin || (h.tmax - 18)).toFixed(1)) : TMIN;

  const dataMap: Record<Param, number[]> = {
    Rainfall: rainfallData,
    Tmax: tmaxData,
    Tmin: tminData,
  };
  
  const data = dataMap[selectedParam] || rainfallData;
  const unit = UNIT_MAP[selectedParam];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Handle high DPI displays
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    const W = rect.width;
    const H = rect.height;
    
    ctx.clearRect(0, 0, W, H);

    const padL = 32, padR = 10, padT = 20, padB = 20;
    const chartW = W - padL - padR;
    const chartH = H - padT - padB;
    
    const minVal = 0;
    const maxVal = selectedParam === 'Rainfall' ? 1500 : Math.max(...data) * 1.2;

    // Y-axis
    const yTicks = selectedParam === 'Rainfall' ? [0, 500, 1000, 1500] : [0, Math.round(maxVal/2), Math.round(maxVal)];
    
    ctx.font = '9px "Inter", sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    
    yTicks.forEach(tick => {
      const y = padT + chartH - ((tick - minVal) / (maxVal - minVal)) * chartH;
      
      // Grid line
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255,255,255,0.04)';
      ctx.lineWidth = 1;
      ctx.moveTo(padL, y);
      ctx.lineTo(W - padR, y);
      ctx.stroke();
      
      // Label
      ctx.fillStyle = '#64748B'; // muted gray/blue
      ctx.fillText(tick.toString(), padL - 6, y);
    });

    // Bars
    const barW = Math.max(12, Math.floor(chartW / data.length) - 2);
    
    data.forEach((val, i) => {
      if (val === 0 && i === data.length - 1) return; // skip 2024 if 0
      
      const barH = ((val - minVal) / (maxVal - minVal)) * chartH;
      const spacePerBar = chartW / data.length;
      const x = padL + i * spacePerBar + (spacePerBar - barW) / 2;
      const y = padT + chartH - barH;
      
      const isSelected = i === selectedIdx;
      
      ctx.beginPath();
      
      if (isSelected) {
        ctx.shadowColor = 'rgba(34, 197, 94, 0.5)';
        ctx.shadowBlur = 8;
        ctx.fillStyle = '#4ADE80'; // brighter green
      } else {
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#334155'; // muted blue/gray for unselected
      }
      
      ctx.roundRect(x, y, barW, barH, [2, 2, 0, 0]);
      ctx.fill();
      
      // Value label above selected bar
      if (isSelected) {
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#4ADE80';
        ctx.font = '600 10px "Inter", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillText(Math.round(val).toString(), x + barW / 2, y - 4);
      }
    });
    
    // Reset shadow for text
    ctx.shadowBlur = 0;
    
    // X-axis (Years)
    ctx.fillStyle = '#64748B';
    ctx.font = '9px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    
    years.forEach((yr, i) => {
      // Show every 2 years starting from 2010
      if (i % 2 === 0) {
        const spacePerBar = chartW / data.length;
        const x = padL + i * spacePerBar + spacePerBar / 2;
        ctx.fillText(yr.toString(), x, padT + chartH + 6);
      }
    });

  }, [data, selectedIdx, selectedParam, years]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    
    const padL = 32;
    const padR = 10;
    const chartW = rect.width - padL - padR;
    const spacePerBar = chartW / data.length;
    
    const idx = Math.floor((mx - padL) / spacePerBar);
    if (idx >= 0 && idx < data.length) {
      setSelectedIdx(idx);
    }
  };

  const selectedYear = years[selectedIdx] ?? years[years.length - 1];
  const selectedValue = data[selectedIdx] ?? data[data.length - 1];

  return (
    <div className="bg-[#050C1A]/95 border border-[#1E3A5F]/60 rounded-[12px] p-2 h-full flex flex-col shadow-[inset_0_1px_4px_rgba(255,255,255,0.02),0_4px_12px_rgba(0,0,0,0.5)]">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-1.5 shrink-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-[10px] font-bold tracking-wider text-white whitespace-nowrap">
            HISTORICAL EXPLORER
          </span>
        </div>
        <button 
          onClick={onViewAll} 
          className="text-[11px] text-[#60A5FA] hover:text-[#93C5FD] transition-colors"
        >
          View All
        </button>
      </div>

      {/* Parameter Row */}
      <div className="flex items-center justify-between mb-1.5 shrink-0">
        <div className="flex items-center gap-1 bg-[#0B1B3D] border border-[#1E3A5F] rounded px-1.5 py-0.5 max-w-[65%]">
          <span className="text-[10px] text-[#94A3B8]">Parameter:</span>
          <div className="relative flex-1 min-w-0">
            <select
              value={selectedParam}
              onChange={e => onParamChange?.(e.target.value as Param)}
              className="appearance-none bg-transparent text-[10px] text-[#F1F5F9] pr-3 focus:outline-none cursor-pointer w-full"
            >
              <option value="Rainfall">Rainfall</option>
              <option value="Tmax">Tmax</option>
              <option value="Tmin">Tmin</option>
            </select>
            <ChevronDown className="w-3 h-3 text-[#64748B] absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
        
        <div className="flex items-center gap-1.5">
          <button className="p-1 rounded flex items-center justify-center text-[#64748B] hover:text-[#F1F5F9] transition-colors">
            <Layout className="w-3.5 h-3.5" />
          </button>
          <button className="p-1 rounded flex items-center justify-center text-[#64748B] hover:text-[#F1F5F9] transition-colors">
            <Shield className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Subtle Divider */}
      <div className="w-full h-px bg-[#1E3A5F]/40 mb-1.5 shrink-0"></div>

      {/* Main Value Area */}
      <div className="mb-1 shrink-0">
        <div className="text-[10px] text-[#94A3B8] mb-0.5 whitespace-nowrap overflow-hidden text-ellipsis">
          Annual {selectedParam} ({unit})
        </div>
        <div className="flex items-baseline gap-2">
          <div className="text-[24px] font-bold text-[#4ADE80] leading-none whitespace-nowrap">
            {Math.round(selectedValue)} <span className="text-[14px] font-normal">{unit}</span>
          </div>
          <div className="text-[18px] text-[#E2E8F0] leading-none whitespace-nowrap">
            {selectedYear}
          </div>
        </div>
      </div>

      {/* Bar Chart Canvas */}
      <div className="flex-1 min-h-0 w-full relative">
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-crosshair"
          onMouseMove={handleMouseMove}
        />
      </div>
      
    </div>
  );
};
