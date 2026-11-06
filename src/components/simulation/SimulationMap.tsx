import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { SimulationScenario, SimulationParameters } from '../../types/simulation';
import { getDistrictSimulatedValue } from '../../services/simulationService';
import { Plus, Minus, Compass, RotateCcw } from 'lucide-react';

interface Props {
  selectedDistrictId: string;
  onSelectDistrict: (id: string) => void;
  scenario: SimulationScenario;
  parameters: SimulationParameters;
}

// Major pin districts matching the reference screenshot
const SIM_PINS = [
  'Adilabad',
  'Nizamabad',
  'Karimnagar',
  'Sangareddy',
  'Hyderabad',
  'Warangal Urban',
  'Khammam',
  'Mahabubnagar',
  'Nalgonda',
];

export const SimulationMap: React.FC<Props> = ({
  selectedDistrictId,
  onSelectDistrict,
  scenario,
  parameters,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [geoData, setGeoData] = useState<any>(null);
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [mapMode, setMapMode] = useState<'map' | 'satellite'>('map');
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const isDraggingRef = useRef<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const hasMovedRef = useRef<boolean>(false);

  // Load existing Dashboard Telangana GeoJSON (READ ONLY)
  useEffect(() => {
    fetch('/telangana.geojson')
      .then((r) => r.json())
      .then(setGeoData)
      .catch((err) => console.error('Failed to load Telangana GeoJSON:', err));
  }, []);

  // Compute exact bounding box of the loaded Telangana GeoJSON
  const geoBounds = useMemo(() => {
    if (!geoData || !geoData.features || geoData.features.length === 0) {
      return { minLon: 77.20, maxLon: 81.35, minLat: 15.80, maxLat: 19.95 };
    }
    let minLon = Infinity, maxLon = -Infinity, minLat = Infinity, maxLat = -Infinity;
    for (const feat of geoData.features) {
      const geom = feat.geometry;
      if (!geom) continue;
      const rings =
        geom.type === 'Polygon' ? geom.coordinates : geom.coordinates.flatMap((p: any) => p);
      for (const ring of rings) {
        for (const [lon, lat] of ring) {
          if (lon < minLon) minLon = lon;
          if (lon > maxLon) maxLon = lon;
          if (lat < minLat) minLat = lat;
          if (lat > maxLat) maxLat = lat;
        }
      }
    }
    return { minLon, maxLon, minLat, maxLat };
  }, [geoData]);

  // Compute color fill based on simulation rainfall/intensity
  const getDistrictFill = useCallback(
    (districtName: string, isSelected: boolean, isHovered: boolean) => {
      const val = getDistrictSimulatedValue(districtName, scenario, parameters);

      // Rainfall scale 0 to 200+ mm (blue -> cyan -> green -> yellow -> orange -> red/magenta)
      const norm = Math.max(0, Math.min(1, val / 180));
      let r = 0, g = 200, b = 255;

      if (scenario === 'heat_wave') {
        // High thermal: orange to deep red
        r = Math.round(200 + norm * 55);
        g = Math.round(180 * (1 - norm));
        b = Math.round(40 * (1 - norm));
      } else if (scenario === 'drought') {
        // Arid yellow/brown to amber
        r = Math.round(180 + norm * 60);
        g = Math.round(140 + norm * 40);
        b = Math.round(40);
      } else {
        // Rainfall simulation heatmap (blue-cyan-green-yellow-orange-red matching screenshot)
        if (norm < 0.2) {
          const t = norm / 0.2;
          r = Math.round(10 + t * 0);
          g = Math.round(100 + t * 110);
          b = Math.round(220 + t * 35);
        } else if (norm < 0.45) {
          const t = (norm - 0.2) / 0.25;
          r = Math.round(0 + t * 40);
          g = Math.round(210 + t * 45);
          b = Math.round(255 - t * 180);
        } else if (norm < 0.7) {
          const t = (norm - 0.45) / 0.25;
          r = Math.round(40 + t * 215);
          g = Math.round(255 - t * 70);
          b = Math.round(75 - t * 75);
        } else {
          const t = (norm - 0.7) / 0.3;
          r = Math.round(255 - t * 50);
          g = Math.round(185 - t * 140);
          b = Math.round(0 + t * 200);
        }
      }

      const alpha = isSelected ? 0.96 : isHovered ? 0.88 : 0.72;
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    },
    [scenario, parameters]
  );

  // Exact Fit-to-Bounds Projection: preserves geographic aspect ratio and guarantees ALL 33 districts fit
  const getProjection = useCallback(
    (cssW: number, cssH: number) => {
      const { minLon, maxLon, minLat, maxLat } = geoBounds;
      const centerLon = (minLon + maxLon) / 2;
      const centerLat = (minLat + maxLat) / 2;
      const rad = (centerLat * Math.PI) / 180;
      const cosLat = Math.cos(rad);

      const geoWidth = (maxLon - minLon) * cosLat;
      const geoHeight = maxLat - minLat;

      const padRatio = 0.07;
      const availW = Math.max(50, cssW * (1 - padRatio * 2));
      const availH = Math.max(50, cssH * (1 - padRatio * 2));

      const baseScale = Math.min(availW / geoWidth, availH / geoHeight);

      const midX = cssW / 2;
      const midY = cssH / 2;

      return (lon: number, lat: number): [number, number] => {
        const xOffset = (lon - centerLon) * cosLat * baseScale;
        const yOffset = (lat - centerLat) * baseScale;

        const baseX = midX + xOffset;
        const baseY = midY - yOffset;

        const zx = midX + (baseX - midX) * zoomLevel + panOffset.x;
        const zy = midY + (baseY - midY) * zoomLevel + panOffset.y;
        return [zx, zy];
      };
    },
    [geoBounds, zoomLevel, panOffset]
  );

  // Draw canvas
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || !geoData) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = container.getBoundingClientRect();
    const cssW = rect.width;
    const cssH = rect.height;
    if (cssW <= 0 || cssH <= 0) return;

    const dpr = window.devicePixelRatio || 1;

    if (canvas.width !== Math.round(cssW * dpr) || canvas.height !== Math.round(cssH * dpr)) {
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
      canvas.style.width = `${cssW}px`;
      canvas.style.height = `${cssH}px`;
    }

    ctx.save();
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, cssW, cssH);

    // Deep space dark background
    ctx.fillStyle = mapMode === 'satellite' ? '#02050b' : '#030914';
    ctx.fillRect(0, 0, cssW, cssH);

    // Subtle technical grid
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.025)';
    ctx.lineWidth = 1;
    const gridSize = 28;
    for (let x = 0; x < cssW; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, cssH);
      ctx.stroke();
    }
    for (let y = 0; y < cssH; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(cssW, y);
      ctx.stroke();
    }

    // Radial atmospheric glow
    const glow = ctx.createRadialGradient(cssW * 0.5, cssH * 0.5, 20, cssW * 0.5, cssH * 0.5, cssW * 0.55);
    glow.addColorStop(0, 'rgba(0, 180, 255, 0.12)');
    glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, cssW, cssH);

    const project = getProjection(cssW, cssH);
    const labelCandidates: { name: string; x: number; y: number; isSelected: boolean }[] = [];

    // Draw all 33 district polygons
    for (const feat of geoData.features) {
      const name: string = feat.properties.name || feat.id;
      const isSelected =
        name.toLowerCase() === selectedDistrictId.toLowerCase() ||
        name.toLowerCase().replace(/ /g, '_') === selectedDistrictId.toLowerCase();
      const isHovered = name === hoveredDistrict;

      const fill = getDistrictFill(name, isSelected, isHovered);
      const geom = feat.geometry;
      if (!geom) continue;
      const rings =
        geom.type === 'Polygon' ? geom.coordinates : geom.coordinates.flatMap((p: any) => p);

      let sumX = 0, sumY = 0, ptCount = 0;

      for (const ring of rings) {
        ctx.beginPath();
        for (let i = 0; i < ring.length; i++) {
          const [px, py] = project(ring[i][0], ring[i][1]);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
          sumX += px;
          sumY += py;
          ptCount++;
        }
        ctx.closePath();

        ctx.fillStyle = fill;
        ctx.fill();

        if (isSelected) {
          ctx.strokeStyle = '#00F0FF';
          ctx.lineWidth = 2.2;
          ctx.shadowColor = '#00F0FF';
          ctx.shadowBlur = 10;
          ctx.stroke();
          ctx.shadowBlur = 0;
        } else if (isHovered) {
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 1.8;
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = 6;
          ctx.stroke();
          ctx.shadowBlur = 0;
        } else {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      if (ptCount > 0) {
        labelCandidates.push({
          name,
          x: sumX / ptCount,
          y: sumY / ptCount,
          isSelected,
        });
      }
    }

    // Draw Labels & Selected District Pin
    for (const item of labelCandidates) {
      const isMajor = SIM_PINS.some(
        (p) => p.toLowerCase() === item.name.toLowerCase()
      );
      if (!isMajor && !item.isSelected) continue;

      const val = getDistrictSimulatedValue(item.name, scenario, parameters);
      const valText = `${val} mm`;

      if (item.isSelected) {
        // Glowing cyan/amber pin
        ctx.beginPath();
        ctx.arc(item.x, item.y - 10, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = '#00F0FF';
        ctx.shadowColor = '#00F0FF';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Label pill
        const title = item.name.replace(' Urban', '').toUpperCase();
        ctx.font = 'bold 9px Inter, sans-serif';
        const tw1 = ctx.measureText(title).width;
        ctx.font = '7.5px monospace';
        const tw2 = ctx.measureText(valText).width;
        const boxW = Math.max(tw1, tw2) + 14;
        const boxH = 24;

        ctx.fillStyle = 'rgba(4, 14, 28, 0.94)';
        ctx.strokeStyle = '#00F0FF';
        ctx.lineWidth = 1.2;
        ctx.shadowColor = 'rgba(0, 240, 255, 0.6)';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.roundRect(item.x - boxW / 2, item.y - 38, boxW, boxH, 4);
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 8.5px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(title, item.x, item.y - 26);

        ctx.fillStyle = '#00F0FF';
        ctx.font = 'bold 7.5px monospace';
        ctx.fillText(valText, item.x, item.y - 17);
      } else {
        // Compact label for other major districts
        ctx.fillStyle = 'rgba(2, 6, 12, 0.72)';
        ctx.beginPath();
        ctx.roundRect(item.x - 28, item.y - 11, 56, 19, 3);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = 0.5;
        ctx.stroke();

        ctx.fillStyle = '#E2E8F0';
        ctx.font = '500 7.5px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(item.name.replace(' Urban', ''), item.x, item.y - 2);

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 7px monospace';
        ctx.fillText(valText, item.x, item.y + 6);
      }
    }

    ctx.restore();
  }, [geoData, selectedDistrictId, hoveredDistrict, getProjection, scenario, parameters, getDistrictFill, mapMode]);

  // Window & container resize observer
  useEffect(() => {
    const handleResize = () => draw();
    window.addEventListener('resize', handleResize);
    const ro = new ResizeObserver(() => draw());
    if (containerRef.current) ro.observe(containerRef.current);

    return () => {
      window.removeEventListener('resize', handleResize);
      ro.disconnect();
    };
  }, [draw]);

  useEffect(() => {
    draw();
  }, [draw]);

  // Point-in-polygon detector
  const findDistrictAtPoint = (clientX: number, clientY: number): string | null => {
    const container = containerRef.current;
    if (!container || !geoData) return null;
    const rect = container.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const project = getProjection(rect.width, rect.height);

    for (const feat of geoData.features) {
      const name: string = feat.properties.name || feat.id;
      const geom = feat.geometry;
      if (!geom) continue;
      const rings =
        geom.type === 'Polygon' ? [geom.coordinates[0]] : geom.coordinates.map((p: any) => p[0]);

      for (const ring of rings) {
        let inside = false;
        for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
          const [xi, yi] = project(ring[i][0], ring[i][1]);
          const [xj, yj] = project(ring[j][0], ring[j][1]);
          const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
          if (intersect) inside = !inside;
        }
        if (inside) return name;
      }
    }
    return null;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      isDraggingRef.current = true;
      hasMovedRef.current = false;
      dragStartRef.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDraggingRef.current) {
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) hasMovedRef.current = true;
      setPanOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
      dragStartRef.current = { x: e.clientX, y: e.clientY };
      return;
    }

    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }

    const district = findDistrictAtPoint(e.clientX, e.clientY);
    setHoveredDistrict(district);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    const wasDragging = isDraggingRef.current && hasMovedRef.current;
    isDraggingRef.current = false;

    if (!wasDragging) {
      const district = findDistrictAtPoint(e.clientX, e.clientY);
      if (district) {
        onSelectDistrict(district);
      }
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.88;
    setZoomLevel((prev) => Math.min(3.5, Math.max(0.7, prev * zoomFactor)));
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoomLevel(1.0);
    setPanOffset({ x: 0, y: 0 });
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex flex-col bg-[#030914] rounded-lg border border-[#00f0ff]/20 overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.6)] cursor-default select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
    >
      {/* Title */}
      <div className="absolute top-2 left-3 z-20 flex items-center gap-2 pointer-events-none">
        <span className="font-sans text-[10.5px] font-bold tracking-wider text-slate-100 uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          TELANGANA STATE — SIMULATION ({scenario === 'heat_wave' ? 'TEMPERATURE' : 'RAINFALL'})
        </span>
      </div>

      {/* Map / Satellite Mode Toggle (Top-Left matching screenshot) */}
      <div className="absolute top-7 left-3 z-20 flex items-center gap-1 bg-[#051329]/85 backdrop-blur-md border border-white/10 rounded p-0.5 pointer-events-auto">
        <button
          onClick={() => setMapMode('map')}
          className={`px-2 py-0.5 rounded text-[8.5px] font-semibold transition-all ${
            mapMode === 'map'
              ? 'bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/40 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Map
        </button>
        <button
          onClick={() => setMapMode('satellite')}
          className={`px-2 py-0.5 rounded text-[8.5px] font-semibold transition-all ${
            mapMode === 'satellite'
              ? 'bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/40 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Satellite
        </button>
      </div>

      {/* Compass & Zoom Controls (Top-Right) */}
      <div className="absolute top-2.5 right-2.5 z-20 flex flex-col items-center gap-1.5 pointer-events-auto">
        <div
          title="North Indicator"
          className="w-6 h-6 rounded-full bg-[#051329]/85 border border-[#00f0ff]/30 backdrop-blur-md flex items-center justify-center text-[#00f0ff] shadow-lg pointer-events-none"
        >
          <Compass size={13} />
        </div>
        <div className="flex flex-col rounded bg-[#051329]/85 border border-[#00f0ff]/30 backdrop-blur-md overflow-hidden shadow-lg">
          <button
            onClick={(e) => { e.stopPropagation(); setZoomLevel((z) => Math.min(3.5, z + 0.25)); }}
            title="Zoom In"
            className="p-1.5 text-slate-300 hover:text-[#00f0ff] hover:bg-white/5 transition-colors border-b border-white/10"
          >
            <Plus size={12} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setZoomLevel((z) => Math.max(0.7, z - 0.25)); }}
            title="Zoom Out"
            className="p-1.5 text-slate-300 hover:text-[#00f0ff] hover:bg-white/5 transition-colors border-b border-white/10"
          >
            <Minus size={12} />
          </button>
          <button
            onClick={handleReset}
            title="Reset to Full Telangana State View"
            className="p-1.5 text-slate-300 hover:text-[#00f0ff] hover:bg-white/5 transition-colors"
          >
            <RotateCcw size={11} />
          </button>
        </div>
      </div>

      {/* Canvas */}
      <canvas ref={canvasRef} className="w-full h-full block" />

      {/* Hover Tooltip */}
      {hoveredDistrict && mousePos && (
        <div
          className="absolute z-30 pointer-events-none px-2 py-1 rounded bg-[#040E1E]/95 border border-[#00f0ff]/60 backdrop-blur-md shadow-2xl text-[9.5px] text-white flex flex-col gap-0.5"
          style={{
            left: Math.min(mousePos.x + 12, (containerRef.current?.clientWidth || 400) - 120),
            top: Math.max(mousePos.y - 40, 10),
          }}
        >
          <div className="font-bold text-[#00f0ff] tracking-wide">{hoveredDistrict}</div>
          <div className="text-[8px] text-slate-300">
            Simulated: {getDistrictSimulatedValue(hoveredDistrict, scenario, parameters)} mm
          </div>
        </div>
      )}

      {/* Map Legend (Bottom-Left matching reference) */}
      <div className="absolute bottom-2 left-2.5 z-20 bg-[#051329]/85 backdrop-blur-md border border-[#00f0ff]/20 px-2 py-1 rounded flex flex-col gap-0.5 shadow-lg pointer-events-none">
        <div className="flex items-center justify-between text-[7.5px] font-mono text-slate-300">
          <span>{scenario === 'heat_wave' ? 'Temperature (°C)' : 'Rainfall (mm)'}</span>
        </div>
        <div className="w-36 h-1.5 rounded-sm overflow-hidden border border-white/10 bg-gradient-to-r from-blue-700 via-cyan-400 via-emerald-400 via-amber-400 to-rose-600" />
        <div className="flex items-center justify-between text-[7px] font-mono text-slate-400">
          <span>0</span>
          <span>25</span>
          <span>50</span>
          <span>75</span>
          <span>100</span>
          <span>150</span>
          <span>200+</span>
        </div>
      </div>
    </div>
  );
};
