import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Compass } from 'lucide-react';

interface ReportMiniMapProps {
  selectedDistrictId: string;
  selectedDistrictName: string;
}

export const ReportMiniMap: React.FC<ReportMiniMapProps> = ({
  selectedDistrictId,
  selectedDistrictName,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [geoData, setGeoData] = useState<any>(null);

  // Load existing Dashboard Telangana GeoJSON (READ ONLY)
  useEffect(() => {
    fetch('/telangana.geojson')
      .then((res) => res.json())
      .then(setGeoData)
      .catch((err) => console.error('Failed to load Telangana GeoJSON for Report MiniMap:', err));
  }, []);

  // Compute exact bounds
  const bounds = useMemo(() => {
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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !geoData) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    // Light subtle background for the paper map
    ctx.fillStyle = '#EBF4FF';
    ctx.fillRect(0, 0, W, H);

    const { minLon, maxLon, minLat, maxLat } = bounds;
    const centerLon = (minLon + maxLon) / 2;
    const centerLat = (minLat + maxLat) / 2;
    const cosLat = Math.cos((centerLat * Math.PI) / 180);

    const geoWidth = (maxLon - minLon) * cosLat;
    const geoHeight = maxLat - minLat;

    const padRatio = 0.08;
    const availW = W * (1 - padRatio * 2);
    const availH = H * (1 - padRatio * 2);
    const scale = Math.min(availW / geoWidth, availH / geoHeight);

    const midX = W / 2;
    const midY = H / 2;

    const project = (lon: number, lat: number): [number, number] => {
      const x = midX + (lon - centerLon) * cosLat * scale;
      const y = midY - (lat - centerLat) * scale;
      return [x, y];
    };

    let selectedCenter: [number, number] | null = null;

    // Draw districts
    for (const feat of geoData.features) {
      const name = feat.properties?.name || feat.id || '';
      const featId = (feat.id || name).toLowerCase();
      const isSelected = selectedDistrictId.toLowerCase() === featId || selectedDistrictName.toLowerCase() === name.toLowerCase();

      const geom = feat.geometry;
      if (!geom) continue;

      const ringsList: number[][][] =
        geom.type === 'Polygon' ? [geom.coordinates[0]] : geom.coordinates.map((c: any) => c[0]);

      for (const ring of ringsList) {
        if (!ring || ring.length < 3) continue;

        ctx.beginPath();
        const [startX, startY] = project(ring[0][0], ring[0][1]);
        ctx.moveTo(startX, startY);
        let sumX = 0, sumY = 0;
        for (let i = 0; i < ring.length; i++) {
          const [px, py] = project(ring[i][0], ring[i][1]);
          if (i > 0) ctx.lineTo(px, py);
          sumX += px;
          sumY += py;
        }
        ctx.closePath();

        if (isSelected) {
          ctx.fillStyle = '#2563EB'; // Vibrant royal blue
          selectedCenter = [sumX / ring.length, sumY / ring.length];
        } else {
          ctx.fillStyle = '#60A5FA'; // Light blue polygon
        }
        ctx.fill();

        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = isSelected ? 1.5 : 0.6;
        ctx.stroke();
      }
    }

    // Draw Selected Marker & Callout Label
    if (selectedCenter) {
      const [cx, cy] = selectedCenter;

      // Glow beacon
      const grad = ctx.createRadialGradient(cx, cy, 2, cx, cy, 18);
      grad.addColorStop(0, 'rgba(34, 197, 94, 0.9)'); // Green beacon
      grad.addColorStop(0.5, 'rgba(34, 197, 94, 0.35)');
      grad.addColorStop(1, 'rgba(34, 197, 94, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, 18, 0, Math.PI * 2);
      ctx.fill();

      // Pin center
      ctx.beginPath();
      ctx.arc(cx, cy, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#10B981';
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Label box
      const boxW = 56;
      const boxH = 18;
      const bx = cx - boxW / 2;
      const by = cy - 28;

      ctx.fillStyle = '#0F172A';
      ctx.beginPath();
      ctx.roundRect(bx, by, boxW, boxH, 3);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(cx - 3, by + boxH);
      ctx.lineTo(cx + 3, by + boxH);
      ctx.lineTo(cx, by + boxH + 3);
      ctx.closePath();
      ctx.fillStyle = '#0F172A';
      ctx.fill();

      ctx.font = 'bold 8px Inter, sans-serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.fillText(selectedDistrictName, cx, by + 12);
    }
  }, [geoData, bounds, selectedDistrictId, selectedDistrictName]);

  return (
    <div className="relative w-full h-full rounded border border-blue-200 overflow-hidden bg-[#EBF4FF]">
      {/* North Compass */}
      <div className="absolute top-1 right-1 flex flex-col items-center pointer-events-none">
        <Compass className="w-3.5 h-3.5 text-blue-800" />
        <span className="text-[7.5px] font-bold text-blue-900 leading-none">N</span>
      </div>

      <canvas ref={canvasRef} width={280} height={190} className="w-full h-full block" />
    </div>
  );
};
