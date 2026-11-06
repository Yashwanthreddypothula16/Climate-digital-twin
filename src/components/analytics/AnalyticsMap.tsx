import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { Compass, RotateCcw, ZoomIn, ZoomOut, Layers, MapPin } from 'lucide-react';
import { DISTRICT_DATA } from '../../data/districtClimate';

interface AnalyticsMapProps {
  selectedDistrictId: string;
  onSelectDistrict: (districtId: string) => void;
  activeParameter?: 'rainfall' | 'temperature' | 'humidity' | 'drought' | 'ndvi' | 'lst';
  title?: string;
}

export const AnalyticsMap: React.FC<AnalyticsMapProps> = ({
  selectedDistrictId,
  onSelectDistrict,
  activeParameter = 'rainfall',
  title = 'TELANGANA STATE - DISTRICT ANALYTICS (AVERAGE RAINFALL)',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [geoData, setGeoData] = useState<any>(null);
  const [satelliteMode, setSatelliteMode] = useState<boolean>(false);
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  // Pan and zoom states
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const isDraggingRef = useRef<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const hasMovedRef = useRef<boolean>(false);

  // Read-only GeoJSON loading
  useEffect(() => {
    fetch('/telangana.geojson')
      .then((res) => res.json())
      .then(setGeoData)
      .catch((err) => console.error('Failed to load Telangana GeoJSON for Analytics:', err));
  }, []);

  // Compute exact bounding box of all 33 districts
  const geoBounds = useMemo(() => {
    if (!geoData || !geoData.features || geoData.features.length === 0) {
      return { minLon: 77.15, maxLon: 81.45, minLat: 15.8, maxLat: 19.95 };
    }
    let minLon = Infinity, maxLon = -Infinity, minLat = Infinity, maxLat = -Infinity;
    for (const feat of geoData.features) {
      const geom = feat.geometry;
      if (!geom) continue;
      const rings = geom.type === 'Polygon' ? geom.coordinates : geom.coordinates.flatMap((p: any) => p);
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

  // Rainfall amounts for districts
  const getDistrictValue = useCallback((name: string) => {
    const clean = name.toLowerCase();
    const RAINFALL_VALS: Record<string, number> = {
      hyderabad: 812, adilabad: 912, nizamabad: 723, karimnagar: 864,
      sangareddy: 742, warangal: 901, khammam: 1034, mahabubnagar: 698,
      nalgonda: 776, bhadradri: 1140, jagtial: 840, jangaon: 785,
      jayashankar: 980, jogulamba: 630, kamareddy: 760, komaram_bheem: 1020,
      mahabubabad: 890, mancherial: 940, medak: 755, medchal: 795,
      mulugu: 1120, nagarkurnool: 670, narayanpet: 620, nirmal: 870,
      peddapalli: 895, rajanna: 790, rangareddy: 780, siddipet: 775,
      suryapet: 810, vikarabad: 730, wanaparthy: 650, yadadri: 765, hanamkonda: 880
    };
    return RAINFALL_VALS[clean] || 780;
  }, []);

  // Compute color matching the image vibrant choropleth
  const getDistrictFill = useCallback(
    (districtName: string, isSelected: boolean, isHovered: boolean) => {
      const val = getDistrictValue(districtName);

      // Value normalized 0 to 1200+
      const norm = Math.max(0, Math.min(1, (val - 500) / 700));

      let r = 0, g = 0, b = 0;
      // Vibrant spectrum: Deep Blue -> Cyan -> Green -> Yellow -> Orange -> Crimson Red
      if (norm < 0.2) {
        // 500 - 640 mm: Blue to Cyan
        const t = norm / 0.2;
        r = Math.round(15 + t * 0);
        g = Math.round(100 + t * 120);
        b = Math.round(220 + t * 35);
      } else if (norm < 0.45) {
        // 640 - 815 mm: Cyan to Emerald Green
        const t = (norm - 0.2) / 0.25;
        r = Math.round(0 + t * 30);
        g = Math.round(220 + t * 25);
        b = Math.round(255 - t * 180);
      } else if (norm < 0.7) {
        // 815 - 990 mm: Green to Yellow-Lime
        const t = (norm - 0.45) / 0.25;
        r = Math.round(30 + t * 200);
        g = Math.round(245 - t * 15);
        b = Math.round(75 - t * 55);
      } else if (norm < 0.88) {
        // 990 - 1115 mm: Yellow to Bright Orange
        const t = (norm - 0.7) / 0.18;
        r = Math.round(230 + t * 25);
        g = Math.round(230 - t * 90);
        b = Math.round(20 - t * 10);
      } else {
        // 1115+ mm: Orange to Flame Red
        const t = (norm - 0.88) / 0.12;
        r = Math.round(255);
        g = Math.round(140 - t * 80);
        b = Math.round(10 + t * 20);
      }

      if (satelliteMode) {
        // In satellite mode, blend with deep earth tone
        r = Math.round(r * 0.7 + 10);
        g = Math.round(g * 0.7 + 25);
        b = Math.round(b * 0.7 + 35);
      }

      const alpha = isSelected ? 0.95 : isHovered ? 0.88 : 0.72;
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    },
    [getDistrictValue, satelliteMode]
  );

  // Exact projection: fit all 33 districts with 6% padding
  const getProjection = useCallback(
    (cssW: number, cssH: number) => {
      const { minLon, maxLon, minLat, maxLat } = geoBounds;
      const centerLon = (minLon + maxLon) / 2;
      const centerLat = (minLat + maxLat) / 2;
      const cosLat = Math.cos((centerLat * Math.PI) / 180);

      const geoWidth = (maxLon - minLon) * cosLat;
      const geoHeight = maxLat - minLat;

      const padRatio = 0.06;
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

  // Key callout districts to match the reference image exactly
  const KEY_LABELS = useMemo(() => [
    { name: 'Hyderabad', id: 'hyderabad', val: '812 mm', lat: 17.3850, lon: 78.4867 },
    { name: 'Adilabad', id: 'adilabad', val: '912 mm', lat: 19.6641, lon: 78.5320 },
    { name: 'Nizamabad', id: 'nizamabad', val: '723 mm', lat: 18.6725, lon: 78.0941 },
    { name: 'Karimnagar', id: 'karimnagar', val: '864 mm', lat: 18.4386, lon: 79.1288 },
    { name: 'Warangal', id: 'warangal', val: '901 mm', lat: 17.9689, lon: 79.5941 },
    { name: 'Khammam', id: 'khammam', val: '1034 mm', lat: 17.2473, lon: 80.1514 },
    { name: 'Mahabubnagar', id: 'mahabubnagar', val: '698 mm', lat: 16.7488, lon: 77.9845 },
    { name: 'Nalgonda', id: 'nalgonda', val: '776 mm', lat: 17.0575, lon: 79.2684 },
    { name: 'Sangareddy', id: 'sangareddy', val: '742 mm', lat: 17.6190, lon: 78.0816 },
  ], []);

  // Redraw canvas
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
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, cssW, cssH);

    // Deep dark grid/space background
    const bgGrad = ctx.createRadialGradient(cssW / 2, cssH / 2, 20, cssW / 2, cssH / 2, cssW * 0.7);
    bgGrad.addColorStop(0, '#061325');
    bgGrad.addColorStop(0.6, '#040d1a');
    bgGrad.addColorStop(1, '#02070e');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, cssW, cssH);

    // Technical grid dots
    ctx.fillStyle = 'rgba(0, 240, 255, 0.05)';
    const gridStep = 32;
    for (let gx = gridStep; gx < cssW; gx += gridStep) {
      for (let gy = gridStep; gy < cssH; gy += gridStep) {
        ctx.fillRect(gx - 0.5, gy - 0.5, 1, 1);
      }
    }

    const project = getProjection(cssW, cssH);

    // Render all 33 districts
    for (const feat of geoData.features) {
      const name = feat.properties?.name || feat.id || '';
      const featId = (feat.id || name).toLowerCase();
      const isSelected = selectedDistrictId.toLowerCase() === featId || selectedDistrictId.toLowerCase() === name.toLowerCase();
      const isHovered = hoveredDistrict?.toLowerCase() === name.toLowerCase();

      const geom = feat.geometry;
      if (!geom) continue;

      const ringsList: number[][][] =
        geom.type === 'Polygon' ? [geom.coordinates[0]] : geom.coordinates.map((c: any) => c[0]);

      for (const ring of ringsList) {
        if (!ring || ring.length < 3) continue;

        ctx.beginPath();
        const [startX, startY] = project(ring[0][0], ring[0][1]);
        ctx.moveTo(startX, startY);
        for (let i = 1; i < ring.length; i++) {
          const [px, py] = project(ring[i][0], ring[i][1]);
          ctx.lineTo(px, py);
        }
        ctx.closePath();

        // Fill with choropleth gradient
        ctx.fillStyle = getDistrictFill(name, isSelected, isHovered);
        ctx.fill();

        // Outer border
        if (isSelected) {
          ctx.strokeStyle = '#00F0FF';
          ctx.lineWidth = 2.4;
          ctx.shadowColor = '#00F0FF';
          ctx.shadowBlur = 12;
          ctx.stroke();
          ctx.shadowBlur = 0;
        } else if (isHovered) {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.lineWidth = 1.6;
          ctx.stroke();
        } else {
          ctx.strokeStyle = 'rgba(0, 240, 255, 0.28)';
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }

    // Render Key District Badges
    for (const badge of KEY_LABELS) {
      const isSelected = selectedDistrictId.toLowerCase() === badge.id || selectedDistrictId.toLowerCase() === badge.name.toLowerCase();
      const [bx, by] = project(badge.lon, badge.lat);

      if (bx < 10 || bx > cssW - 10 || by < 10 || by > cssH - 10) continue;

      const labelText = badge.name;
      const subText = badge.val;

      ctx.save();

      if (isSelected) {
        // Beacon pulse ring
        ctx.beginPath();
        ctx.arc(bx, by, 10, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 240, 255, 0.25)';
        ctx.fill();

        // Pin marker
        ctx.beginPath();
        ctx.arc(bx, by, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = '#00F0FF';
        ctx.shadowColor = '#00F0FF';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Elevated callout box
        const boxW = 86;
        const boxH = 36;
        const rx = bx - boxW / 2;
        const ry = by - boxH - 12;

        ctx.fillStyle = 'rgba(3, 14, 30, 0.92)';
        ctx.strokeStyle = '#00F0FF';
        ctx.lineWidth = 1.4;
        ctx.shadowColor = 'rgba(0, 240, 255, 0.5)';
        ctx.shadowBlur = 10;

        // Rounded rect
        ctx.beginPath();
        ctx.roundRect(rx, ry, boxW, boxH, 6);
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Pointer triangle
        ctx.beginPath();
        ctx.moveTo(bx - 5, ry + boxH);
        ctx.lineTo(bx + 5, ry + boxH);
        ctx.lineTo(bx, ry + boxH + 6);
        ctx.closePath();
        ctx.fillStyle = 'rgba(3, 14, 30, 0.92)';
        ctx.fill();
        ctx.strokeStyle = '#00F0FF';
        ctx.stroke();

        // Text
        ctx.font = 'bold 11px Inter, sans-serif';
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'center';
        ctx.fillText(labelText, bx, ry + 15);

        ctx.font = '500 10px monospace';
        ctx.fillStyle = '#00F0FF';
        ctx.fillText(subText, bx, ry + 29);
      } else {
        // Standard pill label
        ctx.font = '600 9.5px Inter, sans-serif';
        const tw = Math.max(ctx.measureText(labelText).width, ctx.measureText(subText).width);
        const pw = tw + 14;
        const ph = 26;
        const px = bx - pw / 2;
        const py = by - ph / 2;

        ctx.fillStyle = 'rgba(2, 10, 22, 0.78)';
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.35)';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.roundRect(px, py, pw, ph, 4);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#F1F5F9';
        ctx.textAlign = 'center';
        ctx.fillText(labelText, bx, py + 10);

        ctx.font = '400 8.5px monospace';
        ctx.fillStyle = '#94A3B8';
        ctx.fillText(subText, bx, py + 21);
      }

      ctx.restore();
    }

    ctx.restore();
  }, [geoData, selectedDistrictId, hoveredDistrict, getProjection, getDistrictFill, KEY_LABELS]);

  // Request redraw on state change
  useEffect(() => {
    let animId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animId);
  }, [draw]);

  // Window resize observer
  useEffect(() => {
    const handleResize = () => draw();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [draw]);

  // Mouse hit test to detect district under cursor
  const getDistrictAtScreenPos = useCallback(
    (clientX: number, clientY: number): string | null => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container || !geoData) return null;

      const rect = container.getBoundingClientRect();
      const sx = clientX - rect.left;
      const sy = clientY - rect.top;
      const project = getProjection(rect.width, rect.height);

      for (const feat of geoData.features) {
        const geom = feat.geometry;
        if (!geom) continue;
        const ringsList: number[][][] =
          geom.type === 'Polygon' ? [geom.coordinates[0]] : geom.coordinates.map((c: any) => c[0]);

        for (const ring of ringsList) {
          let inside = false;
          for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
            const [xi, yi] = project(ring[i][0], ring[i][1]);
            const [xj, yj] = project(ring[j][0], ring[j][1]);
            const intersect = yi > sy !== yj > sy && sx < ((xj - xi) * (sy - yi)) / (yj - yi) + xi;
            if (intersect) inside = !inside;
          }
          if (inside) {
            return feat.properties?.name || feat.id;
          }
        }
      }
      return null;
    },
    [geoData, getProjection]
  );

  // Mouse event handlers for pan & click
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    hasMovedRef.current = false;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDraggingRef.current) {
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        hasMovedRef.current = true;
      }
      setPanOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
      dragStartRef.current = { x: e.clientX, y: e.clientY };
    } else {
      const d = getDistrictAtScreenPos(e.clientX, e.clientY);
      setHoveredDistrict(d);
      setMousePos({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!hasMovedRef.current) {
      const clicked = getDistrictAtScreenPos(e.clientX, e.clientY);
      if (clicked) {
        const found = Object.values(DISTRICT_DATA).find(
          (d) => d.name.toLowerCase() === clicked.toLowerCase() || d.id === clicked.toLowerCase()
        );
        onSelectDistrict(found ? found.id : clicked.toLowerCase());
      }
    }
    isDraggingRef.current = false;
  };

  const handleMouseLeave = () => {
    isDraggingRef.current = false;
    setHoveredDistrict(null);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.12 : 0.88;
    setZoomLevel((prev) => Math.max(0.7, Math.min(4.5, prev * zoomFactor)));
  };

  const handleReset = () => {
    setZoomLevel(1.0);
    setPanOffset({ x: 0, y: 0 });
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full rounded-xl overflow-hidden bg-[#030914] border border-[#00f0ff]/20 select-none flex flex-col"
      onWheel={handleWheel}
    >
      {/* ── Top Header Toolbar matching reference image ── */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-3 py-2 bg-gradient-to-b from-[#020712]/95 via-[#020712]/75 to-transparent pointer-events-none">
        <span className="text-[11px] font-bold text-slate-200 tracking-wider uppercase font-sans">
          {title}
        </span>

        {/* Map / Satellite switch */}
        <div className="flex items-center gap-1 bg-[#051428]/80 border border-[#00f0ff]/25 rounded-md p-0.5 pointer-events-auto">
          <button
            onClick={() => setSatelliteMode(false)}
            className={`px-2.5 py-0.5 text-[10px] font-semibold rounded transition-all ${
              !satelliteMode
                ? 'bg-[#00f0ff] text-[#020810] shadow-[0_0_8px_rgba(0,240,255,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Map
          </button>
          <button
            onClick={() => setSatelliteMode(true)}
            className={`px-2.5 py-0.5 text-[10px] font-semibold rounded transition-all ${
              satelliteMode
                ? 'bg-[#00f0ff] text-[#020810] shadow-[0_0_8px_rgba(0,240,255,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Satellite
          </button>
        </div>
      </div>

      {/* ── Top Right Controls: Compass + Zoom + Reset ── */}
      <div className="absolute top-10 right-3 z-20 flex flex-col items-center gap-1.5">
        {/* Compass */}
        <div
          title="North Indicator"
          className="w-7 h-7 rounded-full bg-[#051428]/80 border border-[#00f0ff]/30 flex items-center justify-center text-[#00f0ff] shadow-lg backdrop-blur-md"
        >
          <Compass className="w-4 h-4" />
        </div>

        {/* Zoom Controls */}
        <div className="flex flex-col bg-[#051428]/80 border border-[#00f0ff]/30 rounded-lg overflow-hidden shadow-lg backdrop-blur-md">
          <button
            onClick={() => setZoomLevel((prev) => Math.min(4.5, prev * 1.2))}
            title="Zoom In"
            className="w-7 h-7 flex items-center justify-center text-slate-300 hover:text-[#00f0ff] hover:bg-[#00f0ff]/10 border-b border-white/10 transition-colors"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel((prev) => Math.max(0.7, prev / 1.2))}
            title="Zoom Out"
            className="w-7 h-7 flex items-center justify-center text-slate-300 hover:text-[#00f0ff] hover:bg-[#00f0ff]/10 border-b border-white/10 transition-colors"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleReset}
            title="Reset View"
            className="w-7 h-7 flex items-center justify-center text-slate-300 hover:text-[#00f0ff] hover:bg-[#00f0ff]/10 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ── Main Canvas Viewport ── */}
      <div
        className="flex-1 w-full h-full cursor-grab active:cursor-grabbing relative"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      {/* ── Bottom-Left Legend matching reference image ── */}
      <div className="absolute bottom-2.5 left-3 z-20 p-2 rounded-lg bg-[#030d1d]/90 border border-[#00f0ff]/20 backdrop-blur-md shadow-lg pointer-events-none">
        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
          Rainfall (mm)
        </span>
        <div className="w-48 h-2 rounded bg-gradient-to-r from-[#1055db] via-[#00f0ff] via-[#10b981] via-[#f59e0b] to-[#ef4444] shadow-[0_0_8px_rgba(0,240,255,0.3)]" />
        <div className="flex justify-between text-[8px] font-mono text-slate-400 mt-1">
          <span>0</span>
          <span>200</span>
          <span>400</span>
          <span>600</span>
          <span>800</span>
          <span>1000</span>
          <span>1200+</span>
        </div>
      </div>

      {/* Hover tooltip */}
      {hoveredDistrict && (
        <div className="absolute bottom-3 right-3 z-20 px-2.5 py-1 rounded bg-[#020b18]/90 border border-[#00f0ff]/40 text-[10px] text-white shadow-xl pointer-events-none">
          <span className="text-[#00f0ff] font-bold">{hoveredDistrict}</span>
          <span className="text-slate-400 ml-1.5 font-mono">{getDistrictValue(hoveredDistrict)} mm</span>
        </div>
      )}
    </div>
  );
};
