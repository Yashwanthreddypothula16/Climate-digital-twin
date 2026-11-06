import React, { useRef, useEffect, useState, useCallback } from 'react';
import { DISTRICT_DATA } from '../../data/districtClimate';
import { Play, Pause } from 'lucide-react';

const TIMELINE_YEARS = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];

const LABEL_PINS = [
  'Adilabad', 'Nizamabad', 'Karimnagar', 'Sangareddy',
  'Hyderabad', 'Warangal Urban', 'Khammam', 'Mahabubnagar', 'Nalgonda',
];

interface Props {
  selectedDistrictId: string;
  onSelectDistrict: (id: string) => void;
  currentYear: number;
  onYearChange: (y: number) => void;
  isPlayingTimeline: boolean;
  onTogglePlayTimeline: () => void;
}

export const HistoricalMap: React.FC<Props> = ({
  selectedDistrictId,
  onSelectDistrict,
  currentYear,
  onYearChange,
  isPlayingTimeline,
  onTogglePlayTimeline,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [geoData, setGeoData] = useState<any>(null);
  const [hovered, setHovered] = useState('');
  const [pinPos, setPinPos] = useState<Record<string, { x: number; y: number }>>({});
  const animRef = useRef<number>(0);

  useEffect(() => {
    fetch('/telangana.geojson')
      .then((r) => r.json())
      .then(setGeoData)
      .catch(() => console.error('GeoJSON load failed'));
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !geoData) {
      animRef.current = requestAnimationFrame(draw);
      return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;

    // Telangana bounds (WGS84)
    const minLon = 77.0, maxLon = 81.45, minLat = 15.75, maxLat = 20.05;
    const padX = W * 0.06, padY = H * 0.04;

    const project = (lon: number, lat: number): [number, number] => [
      padX + ((lon - minLon) / (maxLon - minLon)) * (W - padX * 2),
      H - padY - ((lat - minLat) / (maxLat - minLat)) * (H - padY * 2),
    ];

    // Background
    ctx.clearRect(0, 0, W, H);
    
    // Ambient glow
    const earthGlow = ctx.createRadialGradient(W * 0.5, H * 0.75, 0, W * 0.5, H * 0.75, W * 0.55);
    earthGlow.addColorStop(0, 'rgba(20,60,160,0.12)');
    earthGlow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = earthGlow;
    ctx.fillRect(0, 0, W, H);

    // Draw polygons
    const newPins: Record<string, { x: number; y: number }> = {};
    for (const feat of geoData.features) {
      const name: string = feat.properties.name;
      const isSelected =
        name === selectedDistrictId ||
        name.toLowerCase().replace(/ /g, '_') === selectedDistrictId;
      const isHovered = name === hovered;

      const d = DISTRICT_DATA[name];
      const temp = d ? d.temperature : 30;
      
      // Calculate heat color based on temperature
      const t = Math.max(0, Math.min(1, (temp - 20) / 25));
      const fill = `rgba(${Math.round(200 * t + 50)}, ${Math.round(200 * (1 - t) + 50)}, 0, ${isSelected ? 0.95 : isHovered ? 0.85 : 0.75})`;

      const geom = feat.geometry;
      const rings = geom.type === 'Polygon' ? geom.coordinates : geom.coordinates.flatMap((p: any) => p);

      let sumX = 0, sumY = 0, cnt = 0;

      for (const ring of rings) {
        ctx.beginPath();
        for (let i = 0; i < ring.length; i++) {
          const [px, py] = project(ring[i][0], ring[i][1]);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
          sumX += px;
          sumY += py;
          cnt++;
        }
        ctx.closePath();

        ctx.fillStyle = fill;
        ctx.fill();

        ctx.shadowBlur = 0;
        if (isSelected) {
          ctx.strokeStyle = '#00f0ff';
          ctx.lineWidth = 2.0;
          ctx.shadowColor = '#00f0ff';
          ctx.shadowBlur = 14;
        } else if (isHovered) {
          ctx.strokeStyle = 'rgba(0,240,255,0.75)';
          ctx.lineWidth = 1.4;
          ctx.shadowColor = 'rgba(0,240,255,0.4)';
          ctx.shadowBlur = 8;
        } else {
          ctx.strokeStyle = 'rgba(0,240,255,0.15)';
          ctx.lineWidth = 0.5;
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
      if (cnt > 0) newPins[name] = { x: sumX / cnt, y: sumY / cnt };
    }
    setPinPos(newPins);

    // Watermark
    ctx.save();
    ctx.font = 'bold 18px Inter,sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.14)';
    ctx.textAlign = 'center';
    ctx.fillText('TELANGANA', W * 0.5, H * 0.5);
    ctx.restore();

    animRef.current = requestAnimationFrame(draw);
  }, [geoData, selectedDistrictId, hovered]);

  useEffect(() => {
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [draw]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !geoData) return;
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (canvas.width / rect.width);
    const my = (e.clientY - rect.top) * (canvas.height / rect.height);
    const W = canvas.width, H = canvas.height;
    const minLon = 77.0, maxLon = 81.45, minLat = 15.75, maxLat = 20.05;
    const padX = W * 0.06, padY = H * 0.04;
    const project = (lon: number, lat: number): [number, number] => [
      padX + ((lon - minLon) / (maxLon - minLon)) * (W - padX * 2),
      H - padY - ((lat - minLat) / (maxLat - minLat)) * (H - padY * 2),
    ];
    for (const feat of geoData.features) {
      const rings = feat.geometry.type === 'Polygon' ? feat.geometry.coordinates : feat.geometry.coordinates.flatMap((p: any) => p);
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
          setHovered(feat.properties.name);
          return;
        }
      }
    }
    setHovered('');
  }, [geoData]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (hovered) {
      onSelectDistrict(hovered);
    }
  }, [hovered, onSelectDistrict]);

  return (
    <div className="relative w-full h-full flex flex-col bg-[#020A14] rounded-xl border border-[#00f0ff]/20 overflow-hidden shadow-[0_0_20px_rgba(0,240,255,0.05)]">
      {/* Top badges */}
      <div className="absolute top-3 left-3 flex items-center gap-2">
        <div className="px-2 py-1 bg-[#071330]/80 rounded border border-white/10 text-[10px] text-slate-300 backdrop-blur-sm flex items-center gap-1">
          🛰 Satellite
        </div>
      </div>

      <div className="absolute top-3 right-3 w-8 h-8 rounded-full border border-[#00f0ff]/25 bg-[#071330]/80 flex items-center justify-center backdrop-blur-sm">
        <span className="text-[9px] text-[#00f0ff] font-bold">N</span>
      </div>

      {/* Canvas Map */}
      <div className="flex-1 min-h-0 relative">
        <canvas
          ref={canvasRef}
          width={800}
          height={400}
          className="w-full h-full cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHovered('')}
          onClick={handleClick}
        />

        {/* Labels */}
        {Object.entries(pinPos).map(([name, pos]) => {
          if (!LABEL_PINS.includes(name)) return null;
          const d = DISTRICT_DATA[name];
          if (!d) return null;
          const canvas = canvasRef.current;
          if (!canvas) return null;
          const xPct = (pos.x / canvas.width) * 100;
          const yPct = (pos.y / canvas.height) * 100;
          const isSelected = name === selectedDistrictId || name.toLowerCase().replace(/ /g, '_') === selectedDistrictId;
          const display = name === 'Warangal Urban' ? 'Warangal' : name.split(' ')[0];
          return (
            <div
              key={name}
              className="absolute pointer-events-none"
              style={{ left: `${xPct}%`, top: `${yPct}%`, transform: 'translate(-50%, -110%)' }}
            >
              <div
                className={`px-2 py-0.5 rounded text-center shadow-lg border whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#00f0ff] text-[#071330] border-white font-bold text-[10px] shadow-[0_0_12px_rgba(0,240,255,0.9)]'
                    : 'bg-[#071330]/85 text-white border-[#00f0ff]/40 text-[10px] backdrop-blur-sm'
                }`}
              >
                {display}
                <br />
                <span className="font-normal opacity-80">{d.temperature.toFixed(1)}°C</span>
              </div>
            </div>
          );
        })}

        {/* Temperature legend */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#071330]/80 rounded border border-white/10 p-2 backdrop-blur-sm">
          <div className="text-[9px] text-slate-400 text-center mb-1.5 font-medium">Temp (°C)</div>
          {[45, 40, 35, 30, 25, 20, 15].map((t, i) => (
            <div key={t} className="flex items-center gap-1.5 mb-1 last:mb-0">
              <div
                className="w-4 h-3 rounded-sm"
                style={{
                  background: `hsl(${Math.max(0, 60 - i * 15)}, 100%, 50%)`,
                  opacity: 0.85,
                }}
              />
              <span className="text-[9px] text-slate-300 w-4">{t}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline Sliders */}
      <div className="shrink-0 px-4 py-3 bg-[#020A14] border-t border-white/5">
        <div className="flex items-center gap-3">
          <button
            onClick={onTogglePlayTimeline}
            className="w-8 h-8 shrink-0 rounded-full bg-[#00f0ff]/15 border border-[#00f0ff]/40 flex items-center justify-center hover:bg-[#00f0ff]/25"
          >
            {isPlayingTimeline ? <Pause className="w-4 h-4 text-[#00f0ff]" /> : <Play className="w-4 h-4 text-[#00f0ff] ml-0.5" />}
          </button>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              {TIMELINE_YEARS.map((y) => (
                <button
                  key={y}
                  onClick={() => onYearChange(y)}
                  className={`text-[10px] font-medium transition-colors ${
                    y === currentYear ? 'text-[#00f0ff] font-bold' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {y}
                </button>
              ))}
              <span className="text-[10px] text-[#00f0ff] font-bold ml-1">Today</span>
            </div>
            <div className="relative h-1.5 bg-white/10 rounded-full">
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
                      ? 'w-3 h-3 bg-[#00f0ff] shadow-[0_0_8px_#00f0ff]'
                      : 'w-2 h-2 bg-white/30 hover:bg-white/60'
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
