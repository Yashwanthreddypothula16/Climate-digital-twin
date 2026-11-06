import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { Compass, RotateCcw, ZoomIn, ZoomOut, Thermometer, CloudRain, Waves, Zap, Sprout } from 'lucide-react';
import { ClimateAlertRecord } from '../../types/alerts';

interface AlertsMapProps {
  selectedDistrict: string;
  onSelectDistrict: (districtName: string) => void;
  selectedAlertId?: string;
  onSelectAlertById?: (alertId: string) => void;
  alerts: ClimateAlertRecord[];
}

export const AlertsMap: React.FC<AlertsMapProps> = ({
  selectedDistrict,
  onSelectDistrict,
  selectedAlertId,
  onSelectAlertById,
  alerts,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [geoData, setGeoData] = useState<any>(null);
  const [satelliteMode, setSatelliteMode] = useState<boolean>(false);
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);

  // Zoom & Pan
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const isDraggingRef = useRef<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const hasMovedRef = useRef<boolean>(false);

  // Load read-only GeoJSON
  useEffect(() => {
    fetch('/telangana.geojson')
      .then((res) => res.json())
      .then(setGeoData)
      .catch((err) => console.error('Failed to load Telangana GeoJSON for Alerts map:', err));
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

  // District severity score mapping to match screenshot choropleth
  const getDistrictSeverityScore = useCallback((name: string) => {
    const clean = name.toLowerCase().replace(/[^a-z]/g, '');
    // Specific severity values matching the reference visual gradient
    const SEV_MAP: Record<string, number> = {
      hyderabad: 1.0,      // Severe (Red)
      adilabad: 0.95,      // Severe (Red)
      warangal: 0.92,      // Severe/High (Red-Orange)
      khammam: 0.88,       // High (Orange)
      bhadradrikothagudem: 0.85,
      bhadradri: 0.85,
      nizamabad: 0.75,     // High/Moderate (Orange-Yellow)
      karimnagar: 0.65,    // Moderate (Yellow)
      nalgonda: 0.58,      // Moderate (Yellow)
      mahabubnagar: 0.72,  // High Risk drought (Orange)
      rangareddy: 0.82,
      medchal: 0.78,
      sangareddy: 0.70,
      jagtial: 0.60,
      kamareddy: 0.62,
      siddipet: 0.55,
      peddapalli: 0.52,
      mancherial: 0.68,
      mulugu: 0.84,
      jayashankar: 0.76,
      jogulamba: 0.45,     // Low-Mod (Yellow-Green)
      wanaparthy: 0.40,
      nagarkurnool: 0.48,
      narayanpet: 0.42,
      vikarabad: 0.35,     // Low (Green)
      nirmal: 0.50,
      asifabad: 0.78,
      komarambheem: 0.78,
      jangaon: 0.46,
      mahabubabad: 0.64,
      suryapet: 0.52,
      yadadri: 0.38,
      rajanna: 0.42,
      hanamkonda: 0.86,
    };
    return SEV_MAP[clean] || 0.45;
  }, []);

  // Compute fill color for district polygon
  const getDistrictFill = useCallback(
    (districtName: string, isSelected: boolean, isHovered: boolean) => {
      const score = getDistrictSeverityScore(districtName);

      let r = 0, g = 0, b = 0;
      // Gradient: Green (0.3) -> Lime/Yellow (0.55) -> Amber/Orange (0.75) -> Flame Red (1.0)
      if (score < 0.45) {
        // Low: Deep Emerald to Fresh Green
        const t = score / 0.45;
        r = Math.round(25 + t * 45);
        g = Math.round(140 + t * 75);
        b = Math.round(45 - t * 20);
      } else if (score < 0.65) {
        // Moderate: Green to Golden Yellow
        const t = (score - 0.45) / 0.20;
        r = Math.round(70 + t * 155);
        g = Math.round(215 + t * 20);
        b = Math.round(25 - t * 15);
      } else if (score < 0.85) {
        // High: Yellow to Rich Orange
        const t = (score - 0.65) / 0.20;
        r = Math.round(225 + t * 25);
        g = Math.round(235 - t * 115);
        b = Math.round(10 - t * 5);
      } else {
        // Severe: Bright Orange to Deep Crimson
        const t = (score - 0.85) / 0.15;
        r = Math.round(250 + t * 5);
        g = Math.round(120 - t * 75);
        b = Math.round(15 + t * 20);
      }

      if (satelliteMode) {
        r = Math.round(r * 0.75 + 15);
        g = Math.round(g * 0.75 + 25);
        b = Math.round(b * 0.75 + 30);
      }

      const alpha = isSelected ? 0.95 : isHovered ? 0.88 : 0.75;
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    },
    [getDistrictSeverityScore, satelliteMode]
  );

  // Exact geographic projection
  const getProjection = useCallback(
    (cssW: number, cssH: number) => {
      const { minLon, maxLon, minLat, maxLat } = geoBounds;
      const centerLon = (minLon + maxLon) / 2;
      const centerLat = (minLat + maxLat) / 2;
      const cosLat = Math.cos((centerLat * Math.PI) / 180);

      const geoWidth = (maxLon - minLon) * cosLat;
      const geoHeight = maxLat - minLat;

      const padRatio = 0.02;
      const availW = Math.max(50, cssW * (1 - padRatio * 2));
      const availH = Math.max(50, cssH * (1 - padRatio * 2));

      const baseScale = Math.min(availW / geoWidth, availH / geoHeight) * 1.04;
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

  // Callout badges matching screenshot
  const CALLOUTS = useMemo(() => [
    {
      id: 'ALT-ADB-04',
      district: 'Adilabad',
      type: 'Heatwave',
      val: '39.2°C',
      lat: 19.3500,
      lon: 78.5320,
      color: '#EF4444',
      icon: 'heat',
    },
    {
      id: 'ALT-NZB-05',
      district: 'Nizamabad',
      type: 'Heavy Rainfall',
      val: '78 mm',
      lat: 18.6725,
      lon: 78.0941,
      color: '#0284c7',
      icon: 'rain',
    },
    {
      id: 'ALT-KRM-06',
      district: 'Karimnagar',
      type: 'Thunderstorm',
      val: '65 km/h',
      lat: 18.4386,
      lon: 79.1288,
      color: '#eab308',
      icon: 'storm',
    },
    {
      id: 'ALT-HYD-01',
      district: 'Hyderabad',
      type: 'Heatwave',
      val: '38.4°C',
      lat: 17.3850,
      lon: 78.4867,
      color: '#EF4444',
      icon: 'heat',
      isPrimary: true,
    },
    {
      id: 'ALT-WGL-02',
      district: 'Warangal',
      type: 'Heavy Rainfall',
      val: '112 mm',
      lat: 17.9689,
      lon: 79.5941,
      color: '#0284c7',
      icon: 'rain',
    },
    {
      id: 'ALT-KHM-03',
      district: 'Khammam',
      type: 'Flood Watch',
      val: 'High Risk',
      lat: 17.2473,
      lon: 80.1514,
      color: '#0284c7',
      icon: 'flood',
    },
    {
      id: 'ALT-NLG-07',
      district: 'Nalgonda',
      type: 'Flood Risk',
      val: 'Moderate',
      lat: 17.0575,
      lon: 79.2684,
      color: '#0284c7',
      icon: 'flood',
    },
    {
      id: 'ALT-MBN-08',
      district: 'Mahabubnagar',
      type: 'Drought',
      val: 'High Risk',
      lat: 16.7488,
      lon: 77.9845,
      color: '#f97316',
      icon: 'drought',
    },
  ], []);

  // Main Canvas Render
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

    // Deep dark background matching the image
    ctx.fillStyle = satelliteMode ? '#030811' : '#040b15';
    ctx.fillRect(0, 0, cssW, cssH);

    // Subtle technical grid
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.03)';
    ctx.lineWidth = 1;
    for (let x = 0; x < cssW; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, cssH);
      ctx.stroke();
    }
    for (let y = 0; y < cssH; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(cssW, y);
      ctx.stroke();
    }

    // Neighboring States Text
    ctx.font = '700 11px Inter, sans-serif';
    ctx.fillStyle = 'rgba(100, 116, 139, 0.45)';
    ctx.letterSpacing = '2px';
    ctx.fillText('MAHARASHTRA', cssW * 0.16, cssH * 0.22);
    ctx.fillText('CHHATTISGARH', cssW * 0.72, cssH * 0.23);
    ctx.fillText('ANDHRA PRADESH', cssW * 0.65, cssH * 0.78);
    ctx.fillText('KARNATAKA', cssW * 0.08, cssH * 0.72);

    const project = getProjection(cssW, cssH);

    // Render 33 District Polygons
    if (geoData && geoData.features) {
      for (const feat of geoData.features) {
        const props = feat.properties || {};
        const dName = props.district || props.DISTRICT || props.name || props.NAME_2 || '';
        const isSelected = dName.toLowerCase() === selectedDistrict.toLowerCase();
        const isHovered = dName.toLowerCase() === (hoveredDistrict || '').toLowerCase();

        const geom = feat.geometry;
        if (!geom) continue;

        const multi = geom.type === 'MultiPolygon' ? geom.coordinates : [geom.coordinates];

        ctx.beginPath();
        for (const poly of multi) {
          for (let rIdx = 0; rIdx < poly.length; rIdx++) {
            const ring = poly[rIdx];
            for (let i = 0; i < ring.length; i++) {
              const [x, y] = project(ring[i][0], ring[i][1]);
              if (i === 0) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
            }
          }
        }

        // Fill
        ctx.fillStyle = getDistrictFill(dName, isSelected, isHovered);
        ctx.fill();

        // Stroke
        if (isSelected) {
          ctx.strokeStyle = '#00f0ff';
          ctx.lineWidth = 2.5;
          ctx.shadowColor = '#00f0ff';
          ctx.shadowBlur = 12;
          ctx.stroke();
          ctx.shadowBlur = 0; // reset
        } else if (isHovered) {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        } else {
          ctx.strokeStyle = 'rgba(4, 20, 36, 0.85)';
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    // Render Callout Badges
    for (const callout of CALLOUTS) {
      const [cx, cy] = project(callout.lon, callout.lat);
      if (cx < -50 || cx > cssW + 50 || cy < -50 || cy > cssH + 50) continue;

      const isSelected = callout.district.toLowerCase() === selectedDistrict.toLowerCase();

      // Card Dimensions
      const cardW = 104;
      const cardH = 38;
      const cardX = cx - cardW / 2;
      const cardY = cy - cardH / 2;

      // Draw Badge Container
      ctx.save();
      if (isSelected) {
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 14;
      }

      // Rounded Rect Path
      ctx.beginPath();
      const r = 6;
      ctx.moveTo(cardX + r, cardY);
      ctx.lineTo(cardX + cardW - r, cardY);
      ctx.quadraticCurveTo(cardX + cardW, cardY, cardX + cardW, cardY + r);
      ctx.lineTo(cardX + cardW, cardY + cardH - r);
      ctx.quadraticCurveTo(cardX + cardW, cardY + cardH, cardX + cardW - r, cardY + cardH);
      ctx.lineTo(cardX + r, cardY + cardH);
      ctx.quadraticCurveTo(cardX, cardY + cardH, cardX, cardY + cardH - r);
      ctx.lineTo(cardX, cardY + r);
      ctx.quadraticCurveTo(cardX, cardY, cardX + r, cardY);
      ctx.closePath();

      // Dark card surface with slight red/blue accent
      ctx.fillStyle = '#06111ee8';
      ctx.fill();

      // Border
      if (isSelected) {
        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = 2.0;
      } else {
        ctx.strokeStyle = callout.color + 'aa';
        ctx.lineWidth = 1.0;
      }
      ctx.stroke();
      ctx.restore();

      // Left Accent Strip / Icon Indicator
      ctx.fillStyle = callout.color;
      ctx.beginPath();
      ctx.arc(cardX + 11, cardY + 19, 4.5, 0, Math.PI * 2);
      ctx.fill();

      // Badge Typography
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '700 10.5px Inter, sans-serif';
      ctx.fillText(callout.district, cardX + 22, cardY + 14);

      ctx.font = '600 8.5px Inter, sans-serif';
      ctx.fillStyle = callout.color === '#EF4444' ? '#fca5a5' : callout.color === '#eab308' ? '#fde047' : '#93c5fd';
      ctx.fillText(callout.type, cardX + 22, cardY + 24);

      ctx.font = '700 9px "JetBrains Mono", monospace';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(callout.val, cardX + 22, cardY + 33);
    }

    // Scale Bar in bottom-left
    const sbX = 25;
    const sbY = cssH - 25;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(sbX, sbY);
    ctx.lineTo(sbX + 140, sbY);
    ctx.moveTo(sbX, sbY - 4);
    ctx.lineTo(sbX, sbY + 4);
    ctx.moveTo(sbX + 35, sbY - 3);
    ctx.lineTo(sbX + 35, sbY + 3);
    ctx.moveTo(sbX + 70, sbY - 3);
    ctx.lineTo(sbX + 70, sbY + 3);
    ctx.moveTo(sbX + 105, sbY - 3);
    ctx.lineTo(sbX + 105, sbY + 3);
    ctx.moveTo(sbX + 140, sbY - 4);
    ctx.lineTo(sbX + 140, sbY + 4);
    ctx.stroke();

    ctx.fillStyle = '#94a3b8';
    ctx.font = '8px "JetBrains Mono", monospace';
    ctx.fillText('0', sbX - 2, sbY - 6);
    ctx.fillText('50', sbX + 30, sbY - 6);
    ctx.fillText('100', sbX + 63, sbY - 6);
    ctx.fillText('150', sbX + 98, sbY - 6);
    ctx.fillText('200 km', sbX + 130, sbY - 6);

    ctx.restore();
  }, [
    geoData,
    satelliteMode,
    selectedDistrict,
    hoveredDistrict,
    getProjection,
    getDistrictFill,
    CALLOUTS,
  ]);

  // Request Animation Frame trigger
  useEffect(() => {
    let animId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animId);
  }, [draw]);

  // Resize Observer
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver(() => draw());
    obs.observe(el);
    return () => obs.disconnect();
  }, [draw]);

  // Point in polygon hit testing
  const pointInPolygon = (pt: [number, number], ring: [number, number][]) => {
    let inside = false;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const xi = ring[i][0], yi = ring[i][1];
      const xj = ring[j][0], yj = ring[j][1];
      const intersect = ((yi > pt[1]) !== (yj > pt[1])) &&
        (pt[0] < ((xj - xi) * (pt[1] - yi)) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  };

  // Find district under cursor
  const findDistrictAt = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas || !geoData || !geoData.features) return null;
    const rect = canvas.getBoundingClientRect();
    const cssX = clientX - rect.left;
    const cssY = clientY - rect.top;

    const project = getProjection(rect.width, rect.height);

    for (const feat of geoData.features) {
      const geom = feat.geometry;
      if (!geom) continue;
      const multi = geom.type === 'MultiPolygon' ? geom.coordinates : [geom.coordinates];
      for (const poly of multi) {
        for (const ring of poly) {
          const screenRing: [number, number][] = ring.map((pt: [number, number]) => project(pt[0], pt[1]));
          if (pointInPolygon([cssX, cssY], screenRing)) {
            const props = feat.properties || {};
            return props.district || props.DISTRICT || props.name || props.NAME_2 || null;
          }
        }
      }
    }
    return null;
  }, [geoData, getProjection]);

  // Mouse handlers for pan & click
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    hasMovedRef.current = false;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDraggingRef.current) {
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
        hasMovedRef.current = true;
        setPanOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
        dragStartRef.current = { x: e.clientX, y: e.clientY };
      }
    } else {
      const dName = findDistrictAt(e.clientX, e.clientY);
      setHoveredDistrict(dName);
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    isDraggingRef.current = false;
    if (!hasMovedRef.current) {
      // Check if user clicked a callout badge
      const canvas = canvasRef.current;
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        const cssX = e.clientX - rect.left;
        const cssY = e.clientY - rect.top;
        const project = getProjection(rect.width, rect.height);

        for (const callout of CALLOUTS) {
          const [cx, cy] = project(callout.lon, callout.lat);
          if (Math.abs(cssX - cx) <= 50 && Math.abs(cssY - cy) <= 18) {
            onSelectDistrict(callout.district);
            if (onSelectAlertById) onSelectAlertById(callout.id);
            return;
          }
        }
      }

      // Check if clicked inside a district polygon
      const dName = findDistrictAt(e.clientX, e.clientY);
      if (dName) {
        onSelectDistrict(dName);
      }
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.12 : -0.12;
    setZoomLevel((prev) => Math.max(0.7, Math.min(3.5, prev + delta)));
  };

  const handleReset = () => {
    setZoomLevel(1.0);
    setPanOffset({ x: 0, y: 0 });
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-[#030914] overflow-hidden select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
    >
      <canvas ref={canvasRef} className="w-full h-full block cursor-grab active:cursor-grabbing" />

      {/* ── Top Left: Title & Map Controls ── */}
      <div className="absolute top-3 left-3 flex flex-col space-y-2 pointer-events-auto">
        <div className="text-[11px] font-bold text-slate-200 tracking-wider font-mono uppercase bg-[#030a14]/80 px-2.5 py-1 rounded border border-[#00f0ff]/20 backdrop-blur-md">
          TELANGANA STATE — ACTIVE ALERT MAP
        </div>

        {/* Map / Satellite Toggle */}
        <div className="flex items-center space-x-1 bg-[#051120]/90 p-0.5 rounded border border-[#00f0ff]/20 backdrop-blur-md w-fit">
          <button
            onClick={() => setSatelliteMode(false)}
            className={`px-2.5 py-0.5 rounded text-[10px] font-medium transition-all ${
              !satelliteMode
                ? 'bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/40 shadow-[0_0_8px_rgba(0,240,255,0.2)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Map
          </button>
          <button
            onClick={() => setSatelliteMode(true)}
            className={`px-2.5 py-0.5 rounded text-[10px] font-medium transition-all ${
              satelliteMode
                ? 'bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/40 shadow-[0_0_8px_rgba(0,240,255,0.2)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Satellite
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex flex-col space-y-1 bg-[#051120]/90 p-1 rounded border border-[#00f0ff]/20 backdrop-blur-md w-fit">
          <button
            onClick={() => setZoomLevel((z) => Math.min(3.5, z + 0.25))}
            title="Zoom In"
            className="w-6 h-6 flex items-center justify-center text-slate-300 hover:text-[#00f0ff] hover:bg-white/[0.05] rounded text-sm font-bold"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.25))}
            title="Zoom Out"
            className="w-6 h-6 flex items-center justify-center text-slate-300 hover:text-[#00f0ff] hover:bg-white/[0.05] rounded text-sm font-bold"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleReset}
            title="Reset View"
            className="w-6 h-6 flex items-center justify-center text-slate-300 hover:text-[#00f0ff] hover:bg-white/[0.05] rounded text-sm font-bold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ── Top Right: Compass ── */}
      <div className="absolute top-3 right-3 pointer-events-none">
        <div className="w-8 h-8 rounded-full bg-[#051120]/80 border border-[#00f0ff]/25 backdrop-blur-md flex items-center justify-center text-[#00f0ff] shadow-[0_0_10px_rgba(0,240,255,0.15)]">
          <Compass className="w-5 h-5 animate-spin-slow" />
        </div>
      </div>

      {/* ── Bottom Right: Alert Severity Legend ── */}
      <div className="absolute bottom-3 right-3 pointer-events-auto bg-[#040e1b]/90 border border-[#00f0ff]/20 rounded p-2 backdrop-blur-md">
        <div className="text-[9px] font-bold text-slate-300 uppercase tracking-wider mb-1 font-mono">
          ALERT SEVERITY
        </div>
        <div className="flex flex-col space-y-1">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            <span className="text-[9.5px] text-slate-300 font-medium">Low</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
            <span className="text-[9.5px] text-slate-300 font-medium">Moderate</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#F97316]" />
            <span className="text-[9.5px] text-slate-300 font-medium">High</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
            <span className="text-[9.5px] text-slate-300 font-medium">Severe</span>
          </div>
        </div>
      </div>
    </div>
  );
};
