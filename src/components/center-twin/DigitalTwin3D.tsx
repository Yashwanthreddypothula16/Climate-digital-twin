import React, { useRef, useEffect, useState, useCallback } from 'react';
import type { ClimateLayer, DistrictClimateData } from '../../types/climate';
import { DISTRICT_DATA } from '../../data/districtClimate';
import { Play, Pause, Layers, RotateCcw, ZoomIn, ZoomOut, Map as MapIcon } from 'lucide-react';

// ── Layer pill bar ────────────────────────────────────────────────────────────
const LAYERS: { id: ClimateLayer; label: string; emoji: string }[] = [
  { id: 'Temperature', label: 'Temperature', emoji: '🌡' },
  { id: 'Rainfall',    label: 'Rainfall',    emoji: '🌧' },
  { id: 'Wind',        label: 'Wind',        emoji: '💨' },
  { id: 'Humidity',    label: 'Humidity',    emoji: '💧' },
  { id: 'AQI',         label: 'AQI',         emoji: '🌫' },
  { id: 'Drought',     label: 'Drought',     emoji: '☀' },
  { id: 'NDVI',        label: 'NDVI',        emoji: '🌿' },
  { id: 'Flood Risk',  label: 'Flood Risk',  emoji: '🌊' },
];

const TIMELINE_YEARS = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];

// District label pins (matching reference image)
const LABEL_PINS = [
  'Adilabad', 'Nizamabad', 'Karimnagar', 'Sangareddy',
  'Hyderabad', 'Warangal Urban', 'Khammam', 'Mahabubnagar', 'Nalgonda',
];

// Temperature to thermal color (15°C = cool blue → 45°C = hot red)
function tempColor(temp: number, alpha = 0.88): string {
  const t = Math.max(0, Math.min(1, (temp - 15) / 30));
  let r, g, b;
  if (t < 0.2)       { const x = t/0.2;         r=0;   g=Math.round(x*80);   b=255; }
  else if (t < 0.4)  { const x=(t-0.2)/0.2;     r=0;   g=80+Math.round(x*120); b=Math.round((1-x)*255); }
  else if (t < 0.6)  { const x=(t-0.4)/0.2;     r=Math.round(x*255); g=200; b=0; }
  else if (t < 0.8)  { const x=(t-0.6)/0.2;     r=255; g=Math.round((1-x)*200); b=0; }
  else               { const x=(t-0.8)/0.2;     r=255; g=0; b=Math.round(x*80); }
  return `rgba(${r},${g},${b},${alpha})`;
}

function layerColor(layer: ClimateLayer, districtName: string, alpha = 0.85): string {
  const d = DISTRICT_DATA[districtName];
  if (!d) return `rgba(60,100,160,${alpha})`;
  switch (layer) {
    case 'Temperature': return tempColor(d.temperature, alpha);
    case 'Rainfall': {
      const t = Math.min(1, d.rainfall24h / 40);
      return `rgba(${Math.round(20+t*20)},${Math.round(80+t*100)},${Math.round(200+t*55)},${alpha})`;
    }
    case 'Humidity': {
      const t = d.humidity / 100;
      return `rgba(0,${Math.round(100+t*120)},${Math.round(180+t*75)},${alpha})`;
    }
    case 'AQI':
      if (d.aqi < 50)  return `rgba(34,197,94,${alpha})`;
      if (d.aqi < 100) return `rgba(234,179,8,${alpha})`;
      return `rgba(239,68,68,${alpha})`;
    case 'NDVI':      return `rgba(${Math.round(20+d.humidity*.2)},${Math.round(110+d.humidity*.8)},${Math.round(30+d.humidity*.2)},${alpha})`;
    case 'Drought':   return `rgba(${Math.round(180+d.aqi*.3)},${Math.round(100-d.humidity*.5)},20,${alpha})`;
    case 'Flood Risk':return `rgba(0,${Math.round(80+d.rainfall24h*2)},${Math.round(180+d.rainfall24h*2)},${alpha})`;
    case 'Wind':      return `rgba(${Math.round(60+d.windSpeed*3)},200,240,${alpha})`;
    default:          return `rgba(60,120,200,${alpha})`;
  }
}

interface Props {
  activeLayer: ClimateLayer;
  onSelectLayer: (l: ClimateLayer) => void;
  selectedDistrictId: string;
  onSelectDistrict: (id: string) => void;
  currentYear: number;
  onYearChange: (y: number) => void;
  isPlayingTimeline: boolean;
  onTogglePlayTimeline: () => void;
  activeDistrictData?: DistrictClimateData | null;
  viewMode: '3D' | '2D';
  onToggleViewMode: (m: '3D' | '2D') => void;
  satelliteMode: boolean;
  onToggleSatellite: () => void;
}

export const DigitalTwin3D: React.FC<Props> = ({
  activeLayer, onSelectLayer,
  selectedDistrictId, onSelectDistrict,
  currentYear, onYearChange,
  isPlayingTimeline, onTogglePlayTimeline,
  viewMode, onToggleViewMode,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [geoData, setGeoData] = useState<any>(null);
  const [hovered, setHovered]  = useState('');
  const [pinPos,  setPinPos]   = useState<Record<string, { x: number; y: number }>>({});
  const animRef  = useRef<number>(0);
  const projectRef = useRef<(lon: number, lat: number, W: number, H: number) => [number, number]>(
    () => [0, 0]
  );

  // Cloud state — pre-seeded so they don't jump
  const cloudsRef = useRef(
    Array.from({ length: 14 }, (_, i) => ({
      x:   0.05 + (i * 0.14) % 0.9,
      y:   0.08 + (i * 0.073) % 0.55,
      r:   38 + (i * 17) % 55,
      dx:  0.00008 + (i % 3) * 0.00004,
      dy:  0.00003 - (i % 2) * 0.00003,
      alpha: 0.12 + (i % 4) * 0.06,
    }))
  );

  // Stars (fixed)
  const starsRef = useRef(
    Array.from({ length: 120 }, (_, i) => ({
      x: Math.abs(Math.sin(i * 137.5 + 1) * 0.95),
      y: Math.abs(Math.cos(i * 137.5 + 2) * 0.95),
      r: 0.5 + (i % 3) * 0.5,
      a: 0.3 + (i % 4) * 0.18,
    }))
  );

  useEffect(() => {
    fetch('/telangana.geojson')
      .then(r => r.json())
      .then(setGeoData)
      .catch(() => console.error('GeoJSON load failed'));
  }, []);

  const draw = useCallback((ts: number) => {
    const canvas = canvasRef.current;
    if (!canvas || !geoData) { animRef.current = requestAnimationFrame(draw); return; }
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;

    // Telangana bounds (WGS84)
    const minLon = 77.0, maxLon = 81.45, minLat = 15.75, maxLat = 20.05;
    const padX = W * 0.06, padY = H * 0.04;

    const project = (lon: number, lat: number): [number, number] => [
      padX + (lon - minLon) / (maxLon - minLon) * (W - padX * 2),
      H - padY - (lat - minLat) / (maxLat - minLat) * (H - padY * 2),
    ];
    projectRef.current = (lon, lat) => project(lon, lat);

    // ── 1. BACKGROUND: deep space / satellite night ──────────────────
    const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
    bgGrad.addColorStop(0, '#010810');
    bgGrad.addColorStop(0.4, '#020d1c');
    bgGrad.addColorStop(1, '#030f20');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // ── 2. STARS ──────────────────────────────────────────────────────
    starsRef.current.forEach(s => {
      ctx.beginPath();
      ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${s.a})`;
      ctx.fill();
    });

    // ── 3. EARTH AMBIENT GLOW below map ──────────────────────────────
    const earthGlow = ctx.createRadialGradient(W*0.5, H*0.75, 0, W*0.5, H*0.75, W*0.55);
    earthGlow.addColorStop(0, 'rgba(20,60,160,0.18)');
    earthGlow.addColorStop(0.5, 'rgba(10,30,80,0.10)');
    earthGlow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = earthGlow;
    ctx.fillRect(0, 0, W, H);

    // ── 4. CITY LIGHTS glow spots (at district centres) ──────────────
    Object.values(DISTRICT_DATA).forEach(d => {
      const [cx, cy] = project(d.center[1], d.center[0]);
      // Only draw if inside canvas
      if (cx < 0 || cx > W || cy < 0 || cy > H) return;
      const intensity = d.aqi > 40 ? 0.25 : 0.12;
      const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, 20);
      grd.addColorStop(0, `rgba(255,210,100,${intensity})`);
      grd.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(cx, cy, 20, 0, Math.PI * 2);
      ctx.fill();
    });

    // ── 5. OUTER GLOW around Telangana ───────────────────────────────
    const cx = W * 0.5, cy = H * 0.5;
    const outerGlow = ctx.createRadialGradient(cx, cy, H * 0.08, cx, cy, H * 0.62);
    outerGlow.addColorStop(0, 'rgba(0,220,255,0.07)');
    outerGlow.addColorStop(0.6, 'rgba(0,100,255,0.04)');
    outerGlow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = outerGlow;
    ctx.fillRect(0, 0, W, H);

    // ── 6. DRAW DISTRICT POLYGONS ─────────────────────────────────────
    const newPins: Record<string, { x: number; y: number }> = {};

    for (const feat of geoData.features) {
      const name: string = feat.properties.name;
      const isSelected = name === selectedDistrictId
        || name.toLowerCase().replace(/ /g, '_') === selectedDistrictId;
      const isHovered  = name === hovered;
      const fill       = layerColor(activeLayer, name, isSelected ? 0.95 : isHovered ? 0.92 : 0.82);

      const geom = feat.geometry;
      const rings = geom.type === 'Polygon'
        ? geom.coordinates
        : geom.coordinates.flatMap((p: any) => p);

      let sumX = 0, sumY = 0, cnt = 0;

      for (const ring of rings) {
        ctx.beginPath();
        for (let i = 0; i < ring.length; i++) {
          const [px, py] = project(ring[i][0], ring[i][1]);
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
          sumX += px; sumY += py; cnt++;
        }
        ctx.closePath();

        // Fill
        ctx.fillStyle = fill;
        ctx.fill();

        // Border + glow
        ctx.shadowBlur = 0;
        if (isSelected) {
          ctx.strokeStyle = '#00f0ff';
          ctx.lineWidth = 2.0;
          ctx.shadowColor = '#00f0ff';
          ctx.shadowBlur  = 14;
        } else if (isHovered) {
          ctx.strokeStyle = 'rgba(0,240,255,0.75)';
          ctx.lineWidth = 1.4;
          ctx.shadowColor = 'rgba(0,240,255,0.4)';
          ctx.shadowBlur  = 8;
        } else {
          ctx.strokeStyle = 'rgba(0,240,255,0.28)';
          ctx.lineWidth   = 0.7;
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      if (cnt > 0) newPins[name] = { x: sumX / cnt, y: sumY / cnt };
    }
    setPinPos(newPins);

    // ── 7. ANIMATED CLOUD LAYER ───────────────────────────────────────
    const clouds = cloudsRef.current;
    clouds.forEach(c => {
      // Drift
      c.x += c.dx;
      c.y += c.dy;
      if (c.x > 1.1) c.x = -0.1;
      if (c.y > 0.8) c.y = 0.0;
      if (c.y < 0.0) c.y = 0.8;

      const cx2 = c.x * W, cy2 = c.y * H;
      const r = c.r;

      // Multi-blob cloud
      const offsets = [
        [0, 0, 1.0], [-r * 0.45, r * 0.12, 0.75],
        [r * 0.45, r * 0.08, 0.75], [r * 0.1, -r * 0.3, 0.65],
        [-r * 0.2, r * 0.25, 0.55],
      ];

      offsets.forEach(([ox, oy, scale]) => {
        const grd = ctx.createRadialGradient(
          cx2 + ox, cy2 + oy, 0,
          cx2 + ox, cy2 + oy, r * (scale as number)
        );
        grd.addColorStop(0, `rgba(210,230,255,${c.alpha * 0.85})`);
        grd.addColorStop(0.5, `rgba(180,210,240,${c.alpha * 0.45})`);
        grd.addColorStop(1,   'rgba(0,0,0,0)');
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(cx2 + ox, cy2 + oy, r * (scale as number), 0, Math.PI * 2);
        ctx.fill();
      });
    });

    // ── 8. WIND STREAMLINES (if Wind layer) ──────────────────────────
    if (activeLayer === 'Wind') {
      const t = ts * 0.001;
      ctx.save();
      for (let i = 0; i < 16; i++) {
        const sx = W * 0.05 + (i / 16) * W * 0.9;
        const sy = H * 0.2 + Math.sin(t + i * 0.55) * H * 0.25;
        const len = 30 + Math.sin(t * 1.5 + i) * 15;
        const angle = Math.PI * 0.1 + Math.sin(t * 0.5 + i * 0.3) * 0.3;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx + Math.cos(angle) * len, sy + Math.sin(angle) * len);
        const a = 0.25 + 0.35 * Math.abs(Math.sin(t + i));
        ctx.strokeStyle = `rgba(120,240,255,${a})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
        // arrowhead
        ctx.beginPath();
        ctx.moveTo(sx + Math.cos(angle)*len, sy + Math.sin(angle)*len);
        ctx.lineTo(sx + Math.cos(angle)*len - 5*Math.cos(angle-0.4), sy + Math.sin(angle)*len - 5*Math.sin(angle-0.4));
        ctx.stroke();
      }
      ctx.restore();
    }

    // ── 9. RAIN PARTICLES (if Rainfall layer) ────────────────────────
    if (activeLayer === 'Rainfall') {
      const t = ts * 0.0015;
      ctx.save();
      for (let i = 0; i < 90; i++) {
        const px = Math.abs(Math.sin(i * 127.3)) * W;
        const py = ((t * 0.4 + i * 0.028) % 1) * H;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px - 1.5, py + 9);
        ctx.strokeStyle = `rgba(50,150,255,${0.2 + 0.2 * Math.abs(Math.sin(i))})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
      ctx.restore();
    }

    // ── 10. TELANGANA watermark text ─────────────────────────────────
    ctx.save();
    ctx.font = 'bold 18px Inter,sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.14)';
    ctx.textAlign = 'center';
    ctx.fillText('TELANGANA', W * 0.5, H * 0.5);
    ctx.restore();

    animRef.current = requestAnimationFrame(draw);
  }, [geoData, activeLayer, selectedDistrictId, hovered]);

  useEffect(() => {
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [draw]);

  // Hit-test for hover
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !geoData) return;
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (canvas.width / rect.width);
    const my = (e.clientY - rect.top)  * (canvas.height / rect.height);

    const W = canvas.width, H = canvas.height;
    const minLon = 77.0, maxLon = 81.45, minLat = 15.75, maxLat = 20.05;
    const padX = W * 0.06, padY = H * 0.04;
    const project = (lon: number, lat: number): [number, number] => [
      padX + (lon - minLon) / (maxLon - minLon) * (W - padX * 2),
      H - padY - (lat - minLat) / (maxLat - minLat) * (H - padY * 2),
    ];

    for (const feat of geoData.features) {
      const rings = feat.geometry.type === 'Polygon'
        ? feat.geometry.coordinates
        : feat.geometry.coordinates.flatMap((p: any) => p);
      const offscreen = document.createElement('canvas');
      offscreen.width = W; offscreen.height = H;
      const c2 = offscreen.getContext('2d')!;
      for (const ring of rings) {
        c2.beginPath();
        ring.forEach((pt: number[], i: number) => {
          const [px, py] = project(pt[0], pt[1]);
          if (i === 0) c2.moveTo(px, py); else c2.lineTo(px, py);
        });
        c2.closePath();
        if (c2.isPointInPath(mx, my)) { setHovered(feat.properties.name); return; }
      }
    }
    setHovered('');
  }, [geoData]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !geoData) return;
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (canvas.width / rect.width);
    const my = (e.clientY - rect.top)  * (canvas.height / rect.height);
    const W = canvas.width, H = canvas.height;
    const minLon = 77.0, maxLon = 81.45, minLat = 15.75, maxLat = 20.05;
    const padX = W * 0.06, padY = H * 0.04;
    const project = (lon: number, lat: number): [number, number] => [
      padX + (lon - minLon) / (maxLon - minLon) * (W - padX * 2),
      H - padY - (lat - minLat) / (maxLat - minLat) * (H - padY * 2),
    ];
    for (const feat of geoData.features) {
      const rings = feat.geometry.type === 'Polygon'
        ? feat.geometry.coordinates
        : feat.geometry.coordinates.flatMap((p: any) => p);
      const offscreen = document.createElement('canvas');
      offscreen.width = W; offscreen.height = H;
      const c2 = offscreen.getContext('2d')!;
      for (const ring of rings) {
        c2.beginPath();
        ring.forEach((pt: number[], i: number) => {
          const [px, py] = project(pt[0], pt[1]);
          if (i === 0) c2.moveTo(px, py); else c2.lineTo(px, py);
        });
        c2.closePath();
        if (c2.isPointInPath(mx, my)) {
          onSelectDistrict(feat.properties.name);
          return;
        }
      }
    }
  }, [geoData, onSelectDistrict]);

  // Temperature legend
  const legendGrad = [
    { t: 45, c: '#ff0050' }, { t: 40, c: '#ff6600' }, { t: 35, c: '#ffee00' },
    { t: 30, c: '#00ff80' }, { t: 25, c: '#00ccff' }, { t: 20, c: '#0066ff' }, { t: 15, c: '#0000cc' },
  ];

  return (
    <div className="relative w-full h-full flex flex-col bg-[#010810] rounded-xl overflow-hidden border border-[#00f0ff]/20 shadow-[0_0_30px_rgba(0,240,255,0.06)]">

      {/* ── Layer Pill Bar ─────────────────────────────────────────── */}
      <div className="shrink-0 flex items-center justify-between px-2 pt-1.5 pb-1">
        <div className="flex items-center gap-1 flex-wrap">
          {LAYERS.map(l => (
            <button
              key={l.id}
              onClick={() => onSelectLayer(l.id)}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border transition-all ${
                activeLayer === l.id
                  ? 'bg-[#00f0ff]/20 border-[#00f0ff] text-white shadow-[0_0_8px_rgba(0,240,255,0.5)]'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-[#00f0ff]/40'
              }`}
            >
              <span className="text-[10px]">{l.emoji}</span>
              <span className="hidden xl:inline">{l.label}</span>
              <span className="xl:hidden">{l.label.slice(0, 4)}</span>
            </button>
          ))}
        </div>

        {/* 3D / 2D toggle + controls */}
        <div className="flex items-center gap-1 ml-2 shrink-0">
          <button
            onClick={() => onToggleViewMode(viewMode === '3D' ? '2D' : '3D')}
            className="px-2 py-0.5 rounded text-[10px] font-bold border border-[#00f0ff]/40 text-[#00f0ff] bg-[#00f0ff]/10"
          >3D</button>
          <button
            onClick={() => onToggleViewMode(viewMode === '3D' ? '2D' : '3D')}
            className="px-2 py-0.5 rounded text-[10px] font-bold border border-white/15 text-slate-400"
          >2D</button>
          <div className="w-px h-3 bg-white/10 mx-0.5" />
          <button className="p-1 rounded border border-white/10 text-slate-500 hover:text-[#00f0ff]"><Layers className="w-3 h-3" /></button>
          <button className="p-1 rounded border border-white/10 text-slate-500 hover:text-[#00f0ff]"><RotateCcw className="w-3 h-3" /></button>
          <button className="p-1 rounded border border-white/10 text-slate-500 hover:text-[#00f0ff]"><ZoomIn className="w-3 h-3" /></button>
          <button className="p-1 rounded border border-white/10 text-slate-500 hover:text-[#00f0ff]"><ZoomOut className="w-3 h-3" /></button>
          <button className="p-1 rounded border border-white/10 text-slate-500 hover:text-[#00f0ff]"><MapIcon className="w-3 h-3" /></button>
        </div>
      </div>

      {/* ── Canvas Map ──────────────────────────────────────────────── */}
      <div className="relative flex-1 min-h-0 overflow-hidden">
        <canvas
          ref={canvasRef}
          width={860}
          height={460}
          className="w-full h-full cursor-crosshair block"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHovered('')}
          onClick={handleClick}
        />

        {/* District label pins */}
        {Object.entries(pinPos).map(([name, pos]) => {
          if (!LABEL_PINS.includes(name)) return null;
          const d = DISTRICT_DATA[name];
          if (!d) return null;
          const canvas = canvasRef.current;
          if (!canvas) return null;
          const xPct = (pos.x / canvas.width)  * 100;
          const yPct = (pos.y / canvas.height) * 100;
          const isSelected = name === selectedDistrictId
            || name.toLowerCase().replace(/ /g,'_') === selectedDistrictId;
          const display = name === 'Warangal Urban' ? 'Warangal' : name.split(' ')[0];
          return (
            <div
              key={name}
              className="absolute pointer-events-none"
              style={{ left: `${xPct}%`, top: `${yPct}%`, transform: 'translate(-50%, -110%)' }}
            >
              <div className={`px-1.5 py-0.5 rounded text-center shadow-lg border whitespace-nowrap ${
                isSelected
                  ? 'bg-[#00f0ff] text-[#071330] border-white font-black text-[9px] shadow-[0_0_12px_rgba(0,240,255,0.9)]'
                  : 'bg-[#071330]/85 text-white border-[#00f0ff]/40 text-[9px] backdrop-blur-sm'
              }`}>
                {display}<br />
                <span className="font-normal opacity-80">{d.temperature.toFixed(1)}°C</span>
              </div>
              <div className={`mx-auto w-0 h-0 border-l-[4px] border-r-[4px] border-t-[5px] border-l-transparent border-r-transparent ${
                isSelected ? 'border-t-[#00f0ff]' : 'border-t-[#071330]'
              }`} />
            </div>
          );
        })}

        {/* Compass */}
        <div className="absolute top-2 right-2 w-9 h-9 rounded-full border border-[#00f0ff]/25 bg-[#071330]/75 flex items-center justify-center backdrop-blur-sm">
          <div className="relative w-full h-full flex items-center justify-center">
            <svg viewBox="0 0 32 32" className="w-5 h-5">
              <polygon points="16,4 18,14 16,13 14,14" fill="#00f0ff" />
              <polygon points="16,28 18,18 16,19 14,18" fill="#666" />
              <polygon points="4,16 14,14 13,16 14,18" fill="#666" />
              <polygon points="28,16 18,14 19,16 18,18" fill="#666" />
            </svg>
            <span className="absolute top-0.5 text-[7px] text-[#00f0ff] font-bold leading-none">N</span>
          </div>
        </div>

        {/* Satellite badge */}
        <div className="absolute top-2 left-2 flex items-center gap-1 px-1.5 py-0.5 bg-[#071330]/75 rounded border border-white/10 text-[9px] text-slate-300 backdrop-blur-sm">
          🛰 Satellite
        </div>

        {/* Temperature legend */}
        {activeLayer === 'Temperature' && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#071330]/80 rounded border border-white/10 p-1.5 backdrop-blur-sm">
            <div className="text-[8px] text-slate-400 text-center mb-1 font-medium">Temp (°C)</div>
            {legendGrad.map(({ t, c }) => (
              <div key={t} className="flex items-center gap-1 mb-0.5">
                <div className="w-4 h-3 rounded-sm" style={{ background: c, opacity: 0.85 }} />
                <span className="text-[8px] text-slate-300 w-4">{t}</span>
              </div>
            ))}
          </div>
        )}

        {/* Hover tooltip */}
        {hovered && DISTRICT_DATA[hovered] && (
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 pointer-events-none z-10 bg-[#071330]/95 border border-[#00f0ff]/40 rounded-lg px-2.5 py-1.5 text-[11px] shadow-xl backdrop-blur-sm">
            <span className="font-bold text-[#00f0ff]">{hovered}</span>
            <span className="text-slate-300 ml-2">
              {DISTRICT_DATA[hovered].temperature.toFixed(1)}°C · {DISTRICT_DATA[hovered].humidity}% RH · AQI {DISTRICT_DATA[hovered].aqi}
            </span>
          </div>
        )}

        {/* Loading */}
        {!geoData && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#010810]">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-[#00f0ff]/30 border-t-[#00f0ff] rounded-full animate-spin mx-auto mb-2" />
              <div className="text-[#00f0ff] text-xs">Loading Telangana map…</div>
            </div>
          </div>
        )}
      </div>

      {/* ── Timeline Slider ─────────────────────────────────────────── */}
      <div className="shrink-0 px-3 py-1.5 bg-[#010810] border-t border-white/5">
        <div className="flex items-center gap-2">
          <button
            onClick={onTogglePlayTimeline}
            className="w-7 h-7 shrink-0 rounded-full bg-[#00f0ff]/15 border border-[#00f0ff]/40 flex items-center justify-center hover:bg-[#00f0ff]/25"
          >
            {isPlayingTimeline
              ? <Pause className="w-3 h-3 text-[#00f0ff]" />
              : <Play  className="w-3 h-3 text-[#00f0ff] ml-0.5" />}
          </button>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-0.5">
              {TIMELINE_YEARS.map(y => (
                <button
                  key={y}
                  onClick={() => onYearChange(y)}
                  className={`text-[9px] font-medium transition-colors ${
                    y === currentYear ? 'text-[#00f0ff] font-bold' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >{y}</button>
              ))}
              <span className="text-[9px] text-slate-500 ml-1">Today</span>
            </div>

            <div className="relative h-1 bg-white/8 rounded-full">
              <div
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-[#00f0ff] rounded-full transition-all"
                style={{ width: `${((currentYear - 2015) / 9) * 100}%` }}
              />
              {TIMELINE_YEARS.map((y, i) => (
                <button
                  key={y}
                  onClick={() => onYearChange(y)}
                  style={{ left: `${(i / 9) * 100}%` }}
                  className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full transition-all ${
                    y === currentYear
                      ? 'w-2.5 h-2.5 bg-[#00f0ff] shadow-[0_0_6px_#00f0ff]'
                      : 'w-1.5 h-1.5 bg-white/25 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
