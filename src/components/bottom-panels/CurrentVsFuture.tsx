import React, { useRef, useEffect, useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  selectedDistrictId?: string;
  onSelectDistrict?: (id: string) => void;
}

let cachedGeoData: any = null;

function tempToRGB(t: number): string {
  // 0 (15) -> 1 (45)
  // Stops: Deep Purple(0), Blue(0.16), Cyan(0.33), Green(0.5), Yellow(0.66), Orange(0.83), Red(1)
  if (t <= 0.16) return 'rgb(26,11,46)'; // Purple
  if (t <= 0.33) return 'rgb(0,0,255)';   // Blue
  if (t <= 0.5) return 'rgb(0,240,255)';  // Cyan
  if (t <= 0.66) return 'rgb(0,255,0)';   // Green
  if (t <= 0.83) return 'rgb(255,255,0)'; // Yellow
  if (t <= 1) return 'rgb(255,100,0)';    // Orange
  return 'rgb(255,0,0)';                  // Red
}

function drawMiniMap(
  ctx: CanvasRenderingContext2D,
  W: number, H: number,
  futureDelta: number, // 0 = current 2024, 1 = future max heat
  geoData: any
) {
  ctx.fillStyle = '#06112c';
  ctx.fillRect(0, 0, W, H);

  if (!geoData) return;

  // Extract all polygons
  const polys: number[][][][] = [];
  geoData.features.forEach((f: any) => {
    if (f.geometry.type === 'Polygon') {
      polys.push(f.geometry.coordinates);
    } else if (f.geometry.type === 'MultiPolygon') {
      f.geometry.coordinates.forEach((c: any) => polys.push(c));
    }
  });

  // Calculate bounding box
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  polys.forEach(poly => {
    poly.forEach(ring => {
      ring.forEach(([x, y]) => {
        if (x < minX) minX = x; if (x > maxX) maxX = x;
        if (y < minY) minY = y; if (y > maxY) maxY = y;
      });
    });
  });

  const rangeX = maxX - minX;
  const rangeY = maxY - minY;
  // Uniform scale to fit within 90% of canvas
  const scale = Math.min((W * 0.9) / rangeX, (H * 0.9) / rangeY);
  const offsetX = (W - rangeX * scale) / 2;
  const offsetY = (H - rangeY * scale) / 2;

  const clip = new Path2D();
  polys.forEach(poly => {
    poly.forEach(ring => {
      ring.forEach(([x, y], i) => {
        const px = offsetX + (x - minX) * scale;
        // Invert Y
        const py = offsetY + (maxY - y) * scale;
        if (i === 0) clip.moveTo(px, py);
        else clip.lineTo(px, py);
      });
      clip.closePath();
    });
  });

  ctx.save();
  ctx.clip(clip);

  // Background map base color
  ctx.fillStyle = futureDelta > 0 ? '#4a1505' : '#0a2a1b'; 
  ctx.fill(clip);

  // Paint heatmap blobs
  const SAMPLES = 40;
  for (let i = 0; i < SAMPLES; i++) {
    // Random points distributed within bounding box
    // Using a pseudo-random seed based on i so it doesn't flicker
    const nx = Math.abs(Math.sin(i * 12.34));
    const ny = Math.abs(Math.cos(i * 56.78));
    const baseHeat = Math.abs(Math.sin(i * 90.12)); // 0..1
    
    const cx = offsetX + (rangeX * nx) * scale;
    const cy = offsetY + (rangeY * (1 - ny)) * scale;
    
    // Future map runs much hotter
    const heat = Math.min(1, baseHeat * 0.5 + futureDelta * 0.7);
    const r = 15 + heat * 30;
    
    const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    // Base colors: Blue/Cyan/Green for current, Red/Orange/Yellow for future
    let centerColor = '';
    if (futureDelta > 0) {
      centerColor = heat > 0.8 ? 'rgba(255,50,0,0.8)' : (heat > 0.5 ? 'rgba(255,150,0,0.6)' : 'rgba(200,50,0,0.4)');
    } else {
      centerColor = heat > 0.6 ? 'rgba(0,255,100,0.8)' : (heat > 0.3 ? 'rgba(0,200,255,0.6)' : 'rgba(0,100,255,0.4)');
    }
    
    grd.addColorStop(0, centerColor);
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    
    ctx.globalCompositeOperation = 'screen';
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();

  // Glow Border
  ctx.strokeStyle = futureDelta > 0 ? 'rgba(255,100,50,0.5)' : 'rgba(0,255,150,0.5)';
  ctx.lineWidth = 1.5;
  ctx.stroke(clip);
}

const CURRENT_YEARS = [2022, 2023, 2024];
const FUTURE_YEARS  = [2030, 2035, 2040];

export const CurrentVsFuture: React.FC<Props> = () => {
  const curRef = useRef<HTMLCanvasElement>(null);
  const futRef = useRef<HTMLCanvasElement>(null);
  const [curYear, setCurYear] = useState(2024);
  const [futYear, setFutYear] = useState(2035);
  const [geoData, setGeoData] = useState<any>(null);

  useEffect(() => {
    if (cachedGeoData) {
      setGeoData(cachedGeoData);
      return;
    }
    fetch('/telangana.geojson')
      .then(r => r.json())
      .then(data => {
        cachedGeoData = data;
        setGeoData(data);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!geoData) return;
    [curRef, futRef].forEach((ref, idx) => {
      const canvas = ref.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const delta = idx === 0 ? 0 : 0.8;
      drawMiniMap(ctx, canvas.width, canvas.height, delta, geoData);
    });
  }, [curYear, futYear, geoData]);

  // Temperature legend stops
  const legendStops = [15, 20, 25, 30, 35, 40, 45];

  return (
    <div className="bg-[#06112c]/90 border border-[#00f0ff]/15 rounded-xl p-2 h-full flex flex-col backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-center mb-1 shrink-0">
        <span className="text-[10px] font-bold tracking-widest text-white uppercase">CURRENT vs FUTURE COMPARISON</span>
      </div>

      {/* Year selectors (Top row) */}
      <div className="flex items-center justify-center gap-2 mb-2 shrink-0">
        <div className="flex items-center gap-1">
          <span className="text-[9px] text-slate-400">Current:</span>
          <select
            value={curYear}
            onChange={e => setCurYear(Number(e.target.value))}
            className="text-[10px] bg-transparent border border-white/20 rounded px-1 py-0.5 text-white outline-none cursor-pointer"
          >
            {CURRENT_YEARS.map(y => <option key={y} value={y} className="bg-[#071330]">{y}</option>)}
          </select>
        </div>
        
        <span className="text-[9px] text-slate-400 font-bold mx-1">vs</span>

        <div className="flex items-center gap-1">
          <span className="text-[9px] text-slate-400">Future:</span>
          <select
            value={futYear}
            onChange={e => setFutYear(Number(e.target.value))}
            className="text-[10px] bg-transparent border border-white/20 rounded px-1 py-0.5 text-white outline-none cursor-pointer"
          >
            {FUTURE_YEARS.map(y => <option key={y} value={y} className="bg-[#071330]">{y}</option>)}
          </select>
        </div>
      </div>

      {/* Maps */}
      <div className="flex items-stretch gap-1.5 flex-1 min-h-0 mb-2 px-1">
        {/* Current map */}
        <div className="flex-1 min-h-0 rounded-lg overflow-hidden border border-white/10 relative shadow-[0_0_15px_rgba(0,0,0,0.5)]">
          <div className="absolute top-1 left-1.5 z-10 flex flex-col pointer-events-none">
            <span className="text-[11px] font-bold text-white drop-shadow-md">{curYear}</span>
          </div>
          <canvas ref={curRef} width={150} height={130} className="w-full h-full object-cover" />
        </div>

        {/* Arrow */}
        <div className="flex flex-col items-center justify-center gap-1 shrink-0">
          <div className="flex items-center bg-white/5 rounded-full px-0.5 py-1 border border-white/10">
            <ChevronLeft  className="w-2.5 h-2.5 text-slate-400" />
            <ChevronRight className="w-2.5 h-2.5 text-white" />
          </div>
        </div>

        {/* Future map */}
        <div className="flex-1 min-h-0 rounded-lg overflow-hidden border border-white/10 relative shadow-[0_0_15px_rgba(0,0,0,0.5)]">
          <div className="absolute top-1 left-1.5 z-10 flex flex-col pointer-events-none leading-tight">
            <span className="text-[11px] font-bold text-white drop-shadow-md">{futYear}</span>
            <span className="text-[8px] text-slate-300 drop-shadow-md">(Predicted)</span>
          </div>
          <canvas ref={futRef} width={150} height={130} className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Temperature legend */}
      <div className="shrink-0 px-2 pb-1">
        <div className="text-[8px] text-slate-400 text-center mb-0.5">Temperature (°C)</div>
        <div className="flex items-center gap-0 w-full h-1.5 rounded-full overflow-hidden border border-white/10" style={{ background: 'linear-gradient(90deg, rgb(26,11,46) 0%, rgb(0,0,255) 16%, rgb(0,240,255) 33%, rgb(0,255,0) 50%, rgb(255,255,0) 66%, rgb(255,100,0) 83%, rgb(255,0,0) 100%)' }}>
          {/* Solid gradient bar instead of segments to match the image */}
        </div>
        <div className="flex justify-between mt-1 px-1">
          {legendStops.map(v => (
            <span key={v} className="text-[8px] text-slate-400 font-mono">{v}</span>
          ))}
        </div>
      </div>
    </div>
  );
};
