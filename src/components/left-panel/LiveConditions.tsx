import React, { useMemo } from 'react';
import { Thermometer, Droplets, Wind, ChevronRight, Activity } from 'lucide-react';
import type { DistrictClimateData } from '../../types/climate';

interface Props {
  district: DistrictClimateData | null | undefined;
  onOpenAqiModal?: () => void;
}

// ── Sparkline ─────────────────────────────────────────────────────────────
const Sparkline: React.FC<{ data: number[]; color: string }> = ({ data, color }) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const W = 52, H = 20;
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * W;
      const y = H - ((v - min) / range) * (H - 4) - 2;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  const lastV = data[data.length - 1];
  const dotX  = W;
  const dotY  = H - ((lastV - min) / range) * (H - 4) - 2;

  return (
    <svg width={W} height={H} style={{ overflow: 'visible', flexShrink: 0, display: 'block' }}>
      <polyline points={`0,${H} ${pts} ${W},${H}`}
        fill={color} fillOpacity={0.07} stroke="none" />
      <polyline points={pts}
        fill="none" stroke={color} strokeWidth={1.3}
        strokeLinecap="round" strokeLinejoin="round" opacity={0.85} />
      <circle cx={dotX} cy={dotY} r={1.8} fill={color} opacity={0.9} />
    </svg>
  );
};

// ── AQI helper ────────────────────────────────────────────────────────────
function getAqiStyle(aqi: number) {
  if (aqi <= 50)  return { label: 'Good',      color: '#22c55e', bg: 'rgba(34,197,94,0.10)' };
  if (aqi <= 100) return { label: 'Moderate',  color: '#eab308', bg: 'rgba(234,179,8,0.10)' };
  if (aqi <= 150) return { label: 'Poor',      color: '#f97316', bg: 'rgba(249,115,22,0.10)' };
  if (aqi <= 200) return { label: 'Unhealthy', color: '#ef4444', bg: 'rgba(239,68,68,0.10)' };
  return             { label: 'Hazardous',  color: '#a855f7', bg: 'rgba(168,85,247,0.10)' };
}

// ── Shared font ───────────────────────────────────────────────────────────
const F = "'Inter','Segoe UI',sans-serif";

// ── Main ──────────────────────────────────────────────────────────────────
export const LiveConditions: React.FC<Props> = ({ district, onOpenAqiModal }) => {
  const sparkData = useMemo(() => {
    if (!district) return { temp: [], hum: [], rain: [], wind: [] };
    const jitter = (base: number, amp: number, n = 14) =>
      Array.from({ length: n }, (_, i) =>
        +(base + amp * Math.sin(i * 0.85 + base) * (0.5 + Math.random() * 0.5)).toFixed(1)
      );
    return {
      temp: jitter(district.temperature, 1.5),
      hum:  jitter(district.humidity, 5),
      rain: jitter(district.rainfall24h, 2),
      wind: jitter(district.windSpeed, 3),
    };
  }, [district?.id]);

  const aqi   = district?.aqi ?? 48;
  const aStyle = getAqiStyle(aqi);

  const fallback = [0, 0.3, 0.6, 0.4, 0.8, 0.5, 0.9, 0.6];

  const rows = [
    {
      key: 'temp', label: 'Temperature',
      value: district ? district.temperature.toFixed(1) : '--', unit: '°C',
      iconColor: '#f87171',
      spark: sparkData.temp.length >= 2 ? sparkData.temp : fallback,
      sColor: '#ef4444',
      icon: <Thermometer size={11} color="#f87171" strokeWidth={2} />,
    },
    {
      key: 'hum', label: 'Humidity',
      value: district ? String(district.humidity) : '--', unit: '%',
      iconColor: '#60a5fa',
      spark: sparkData.hum.length >= 2 ? sparkData.hum : fallback,
      sColor: '#3b82f6',
      icon: <Droplets size={11} color="#60a5fa" strokeWidth={2} />,
    },
    {
      key: 'rain', label: 'Rainfall (24h)',
      value: district ? district.rainfall24h.toFixed(1) : '--', unit: 'mm',
      iconColor: '#22d3ee',
      spark: sparkData.rain.length >= 2 ? sparkData.rain : fallback,
      sColor: '#06b6d4',
      icon: <Droplets size={11} color="#22d3ee" strokeWidth={2} style={{ transform: 'scaleY(-1)' }} />,
    },
    {
      key: 'wind', label: 'Wind Speed',
      value: district ? String(district.windSpeed) : '--', unit: 'km/h',
      iconColor: '#2dd4bf',
      spark: sparkData.wind.length >= 2 ? sparkData.wind : fallback,
      sColor: '#14b8a6',
      icon: <Wind size={11} color="#2dd4bf" strokeWidth={2} />,
    },
  ];

  return (
    <div style={{
      background:    'rgba(5,14,30,0.90)',
      border:        '1px solid rgba(255,255,255,0.08)',
      borderRadius:  8,
      overflow:      'hidden',
      backdropFilter:'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      display:       'flex',
      flexDirection: 'column',
      height:        '100%',
    }}>

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div style={{
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'space-between',
        padding:        '6px 9px 5px',
        borderBottom:   '1px solid rgba(255,255,255,0.06)',
        flexShrink:     0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <Activity size={10} color="#16ccff" strokeWidth={2} />
          <span style={{
            fontFamily: F, fontSize: 9.5, fontWeight: 700,
            letterSpacing: '0.08em', color: '#DDEEF8',
            textTransform: 'uppercase',
          }}>
            Live Conditions
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ fontFamily: F, fontSize: 8, color: '#5A6A7A' }}>
            Real-time
          </span>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 3,
            padding: '1px 5px', borderRadius: 3,
            background: 'rgba(34,197,94,0.10)',
            border: '1px solid rgba(34,197,94,0.32)',
          }}>
            <span style={{
              width: 4.5, height: 4.5, borderRadius: '50%',
              background: '#22c55e',
              boxShadow:  '0 0 4px rgba(34,197,94,0.8)',
              display:    'block',
            }} />
            <span style={{
              fontFamily: F, fontSize: 8, fontWeight: 700,
              color: '#22c55e', letterSpacing: '0.04em',
            }}>
              LIVE
            </span>
          </div>
        </div>
      </div>

      {/* ── District pin ─────────────────────────────────────────────── */}
      {district && (
        <div style={{
          padding: '3px 9px 2px',
          fontFamily: F, fontSize: 8, color: '#16ccff', opacity: 0.7,
          letterSpacing: '0.03em', flexShrink: 0,
          borderBottom: '1px solid rgba(255,255,255,0.04)',
        }}>
          📍 {district.name}
        </div>
      )}

      {/* ── Metric rows ──────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '3px 0' }}>
        {rows.map((row, idx) => (
          <React.Fragment key={row.key}>
            <div style={{
              display: 'flex', alignItems: 'center',
              gap: 7, padding: '4px 9px',
            }}>
              {/* Icon circle */}
              <div style={{
                width: 22, height: 22, minWidth: 22, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: `${row.iconColor}16`,
                border: `1px solid ${row.iconColor}28`,
                flexShrink: 0,
              }}>
                {row.icon}
              </div>

              {/* Label + Value */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: F, fontSize: 8, color: '#5A6A7A', lineHeight: 1.2, marginBottom: 1 }}>
                  {row.label}
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
                  <span style={{ fontFamily: F, fontSize: 14, fontWeight: 700, color: '#E8EEF4', lineHeight: 1 }}>
                    {row.value}
                  </span>
                  <span style={{ fontFamily: F, fontSize: 9, fontWeight: 500, color: '#5A6A7A', lineHeight: 1 }}>
                    {row.unit}
                  </span>
                </div>
              </div>

              {/* Sparkline */}
              <Sparkline data={row.spark} color={row.sColor} />
            </div>

            {/* Row divider */}
            {idx < rows.length - 1 && (
              <div style={{ height: 1, background: 'rgba(255,255,255,0.04)', margin: '0 9px' }} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* ── AQI row ─────────────────────────────────────────────────── */}
      <div
        onClick={onOpenAqiModal}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '5px 9px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          background: aStyle.bg,
          cursor: 'pointer',
          flexShrink: 0,
          transition: 'filter 0.15s ease',
        }}
        onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(1.15)')}
        onMouseLeave={e => (e.currentTarget.style.filter = 'brightness(1)')}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          {/* AQI icon circle */}
          <div style={{
            width: 22, height: 22, minWidth: 22, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: `${aStyle.color}14`,
            border: `1px solid ${aStyle.color}28`,
          }}>
            <svg width={11} height={11} viewBox="0 0 24 24" fill="none"
              stroke={aStyle.color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 22 L12 12" />
              <path d="M12 2 C12 2 22 8 22 14 C22 20 16 22 12 22 C8 22 2 20 2 14 C2 8 12 2 12 2Z" />
            </svg>
          </div>

          <div>
            <div style={{ fontFamily: F, fontSize: 8, color: '#5A6A7A', lineHeight: 1.2, marginBottom: 1 }}>
              AQI (Air Quality)
            </div>
            <span style={{ fontFamily: F, fontSize: 14, fontWeight: 700, color: '#E8EEF4', lineHeight: 1 }}>
              {aqi}
            </span>
          </div>
        </div>

        {/* Badge + chevron */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{
            fontFamily: F, fontSize: 8, fontWeight: 700,
            color: aStyle.color, padding: '2px 6px',
            borderRadius: 8, background: aStyle.bg,
            border: `1px solid ${aStyle.color}45`,
          }}>
            {aStyle.label}
          </span>
          <ChevronRight size={10} color="#5A6A7A" strokeWidth={2} />
        </div>
      </div>
    </div>
  );
};
