import React, { useRef, useEffect, useState } from 'react';
import { Cloud, Droplets, Zap, Wind, Map } from 'lucide-react';
import { DISTRICT_DATA, ALL_DISTRICTS } from '../../data/districtClimate';
import { climateApiClient } from '../../services/apiClient';

interface Props {
  onSelectDistrict?: (id: string) => void;
}

const OVERLAY_OPTS = [
  { key: 'cloud',    label: 'Cloud Cover',  Icon: Cloud,    color: '#94a3b8' },
  { key: 'rainfall', label: 'Rainfall',     Icon: Droplets, color: '#3b82f6' },
  { key: 'storm',    label: 'Thunderstorm', Icon: Zap,      color: '#f59e0b' },
  { key: 'wind',     label: 'Wind Flow',    Icon: Wind,     color: '#06b6d4' },
];

// Districts shown as pins on radar map
const RADAR_PINS = [
  'Adilabad', 'Nizamabad', 'Karimnagar',
  'Warangal Urban', 'Khammam', 'Hyderabad',
  'Mahabubnagar', 'Nalgonda',
];

// Telangana bounding box
const BOUNDS = { minLon: 77.0, maxLon: 81.4, minLat: 15.8, maxLat: 20.0 };

function geoToCanvas(lat: number, lon: number, W: number, H: number): [number, number] {
  const padX = W * 0.08, padY = H * 0.08;
  const x = padX + (lon - BOUNDS.minLon) / (BOUNDS.maxLon - BOUNDS.minLon) * (W - padX * 2);
  const y = H - padY - (lat - BOUNDS.minLat) / (BOUNDS.maxLat - BOUNDS.minLat) * (H - padY * 2);
  return [x, y];
}

export const CurrentWeatherMap: React.FC<Props> = ({ onSelectDistrict }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef   = useRef<number>(0);
  const [overlays, setOverlays] = useState({ cloud: true, rainfall: true, storm: true, wind: true });
  const [time, setTime] = useState('12:30 PM');
  const [bulkData, setBulkData] = useState<Record<string, any>>({});

  // Fetch live Open-Meteo bulk conditions across all 33 districts
  useEffect(() => {
    let isMounted = true;
    climateApiClient.getBulkCurrent()
      .then(res => {
        if (isMounted && res) {
          setBulkData(res);
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  // Radar sweep animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let angle = 0;

    const render = (ts: number) => {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // Dark background
      ctx.fillStyle = '#030c1e';
      ctx.fillRect(0, 0, W, H);

      // Concentric rings
      const cx = W / 2, cy = H / 2;
      for (let r = 20; r < Math.max(W, H); r += 30) {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(0,240,255,0.06)';
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // Cross-hairs
      ctx.strokeStyle = 'rgba(0,240,255,0.08)';
      ctx.lineWidth = 0.5;
      ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, H); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(W, cy); ctx.stroke();

      // Rainfall / cloud blobs per district if overlays enabled
      if (overlays.rainfall || overlays.cloud) {
        ALL_DISTRICTS.forEach(name => {
          const d = DISTRICT_DATA[name];
          if (!d) return;
          const live = bulkData[name.toLowerCase()] || bulkData[name];
          const [x, y] = geoToCanvas(d.center[0], d.center[1], W, H);
          const rainVal = live ? (live.rainfall24h ?? d.rainfall24h) : d.rainfall24h;
          const intensity = rainVal / 30;
          if (intensity < 0.05) return;
          const grd = ctx.createRadialGradient(x, y, 0, x, y, 18 + intensity * 20);
          grd.addColorStop(0, `rgba(0,100,255,${Math.min(0.6, intensity * 0.8)})`);
          grd.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = grd;
          ctx.beginPath();
          ctx.arc(x, y, 18 + intensity * 20, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // Storm markers
      if (overlays.storm) {
        const stormDistricts = ALL_DISTRICTS.filter(n => {
          const live = bulkData[n.toLowerCase()];
          const aqiVal = live ? (live.usAqi || 40) : (DISTRICT_DATA[n]?.aqi ?? 0);
          return aqiVal > 45;
        });
        stormDistricts.slice(0, 3).forEach(name => {
          const d = DISTRICT_DATA[name];
          if (!d) return;
          const [x, y] = geoToCanvas(d.center[0], d.center[1], W, H);
          const pulse = 0.5 + 0.5 * Math.sin(ts * 0.003 + d.center[0]);
          ctx.fillStyle = `rgba(255,200,0,${0.3 + pulse * 0.3})`;
          ctx.beginPath();
          ctx.arc(x, y, 6 + pulse * 4, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // Wind flow streamlines
      if (overlays.wind) {
        const t = ts * 0.001;
        for (let i = 0; i < 12; i++) {
          const sx = (W * 0.1) + (i * W * 0.07);
          const sy = H * 0.15 + Math.sin(t + i * 0.6) * H * 0.25;
          const ex = sx + W * 0.07;
          const ey = sy + Math.cos(t + i * 0.4) * H * 0.05;
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(ex, ey);
          ctx.strokeStyle = `rgba(100,220,255,${0.2 + 0.2 * Math.sin(t * 2 + i)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // Radar sweep
      angle = (angle + 0.015) % (Math.PI * 2);
      const sweepR = Math.max(W, H);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, sweepR, angle - 0.6, angle);
      ctx.closePath();
      const sweep = ctx.createLinearGradient(cx, cy, cx + Math.cos(angle) * sweepR, cy + Math.sin(angle) * sweepR);
      sweep.addColorStop(0, 'rgba(0,240,255,0.0)');
      sweep.addColorStop(1, 'rgba(0,240,255,0.12)');
      ctx.fillStyle = sweep;
      ctx.fill();

      // District name labels
      RADAR_PINS.forEach(name => {
        const d = DISTRICT_DATA[name];
        if (!d) return;
        const [x, y] = geoToCanvas(d.center[0], d.center[1], W, H);
        const shortName = name === 'Warangal Urban' ? 'Warangal' : name.split(' ')[0];
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.font = '7px Inter,sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(shortName, x, y - 4);
        ctx.beginPath();
        ctx.arc(x, y + 2, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,240,255,0.8)';
        ctx.fill();
      });

      animRef.current = requestAnimationFrame(render);
    };
    animRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animRef.current);
  }, [overlays, bulkData]);

  // Click on canvas to select nearest district
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !onSelectDistrict) return;
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (canvas.width / rect.width);
    const my = (e.clientY - rect.top) * (canvas.height / rect.height);

    let nearest = '';
    let minDist = 30; // within 30px threshold

    RADAR_PINS.forEach(name => {
      const d = DISTRICT_DATA[name];
      if (!d) return;
      const [x, y] = geoToCanvas(d.center[0], d.center[1], canvas.width, canvas.height);
      const dist = Math.hypot(mx - x, my - y);
      if (dist < minDist) {
        minDist = dist;
        nearest = name;
      }
    });

    if (nearest) {
      onSelectDistrict(nearest);
    }
  };

  // Update clock every minute
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    tick();
    const id = setInterval(tick, 60000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="bg-[#06112c]/90 border border-[#00f0ff]/15 rounded-xl p-2 h-full flex flex-col backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-1 shrink-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <Map className="w-3.5 h-3.5 text-[#00f0ff] shrink-0" />
          <span className="text-[10px] font-bold tracking-tight text-white uppercase whitespace-nowrap overflow-hidden text-ellipsis">Current Weather Map</span>
        </div>
        <button className="w-5 h-5 border border-white/15 rounded text-slate-400 hover:text-white text-xs flex items-center justify-center shrink-0 ml-1">⤢</button>
      </div>

      {/* Overlay toggles */}
      <div className="flex flex-wrap gap-1 mb-1 shrink-0">
        {OVERLAY_OPTS.map(({ key, label, Icon, color }) => (
          <button
            key={key}
            onClick={() => setOverlays(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))}
            className={`flex items-center gap-1 px-1 py-0.5 rounded text-[8px] border transition-all whitespace-nowrap ${
              overlays[key as keyof typeof overlays]
                ? 'bg-white/10 border-white/20 text-white'
                : 'bg-transparent border-white/10 text-slate-500'
            }`}
          >
            <Icon className="w-2.5 h-2.5 shrink-0" style={{ color: overlays[key as keyof typeof overlays] ? color : undefined }} />
            {label}
          </button>
        ))}
      </div>

      {/* Radar Canvas */}
      <div className="flex-1 min-h-0 rounded overflow-hidden border border-white/5 relative">
        <canvas
          ref={canvasRef}
          width={300}
          height={140}
          onClick={handleCanvasClick}
          className="w-full h-full cursor-crosshair"
        />
      </div>

      {/* Footer */}
      <div className="flex items-center gap-1.5 mt-1 shrink-0 pt-0.5 border-t border-white/5">
        <button className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center text-white shrink-0 hover:bg-white/20 transition-colors">
          <span className="text-[8px] ml-0.5">▷</span>
        </button>
        <div className="text-[9px] text-slate-400 font-mono shrink-0">12:30 PM</div>
        
        {/* Timeline Slider */}
        <div className="flex-1 h-1 bg-[#091a42] rounded-full relative mx-1">
          <div className="absolute left-0 top-0 bottom-0 w-3/4 bg-blue-500 rounded-full"></div>
          <div className="absolute left-3/4 top-1/2 -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-[#00f0ff] rounded-full shadow-[0_0_5px_#00f0ff] border-2 border-white/80"></div>
        </div>
      </div>
    </div>
  );
};
