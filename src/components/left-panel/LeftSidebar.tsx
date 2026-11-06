import React, { useMemo } from 'react';
import {
  Thermometer, Droplets, Wind, ChevronRight,
  AlertTriangle, CloudLightning, Sun, Leaf, Activity,
  Radio, Satellite, Globe, Cpu, Layers, ShieldCheck, Umbrella, Map
} from 'lucide-react';
import type { DistrictClimateData, ClimateAlert, DataSourceItem } from '../../types/climate';

/* ═══════════════════════════════════════════════════════════════════════════
   DESIGN TOKENS - MICRO COMPACT (Strictly Fits Any Screen)
   ═══════════════════════════════════════════════════════════════════════════ */
const T = {
  W:          '100%',
  BG:         '#030911',
  CARD_BG:    '#0A1320', 
  BORDER:     '1px solid rgba(255,255,255,0.06)',
  RADIUS:     6,
  CARD_SHADOW:'0 2px 8px rgba(0,0,0,0.4)',
  // Typography - Reduced for clear visibility on small screens
  F:         "'Inter','Segoe UI',sans-serif",
  H_SIZE:    10,
  H_WEIGHT:  700,
  H_LS:      '0.06em',
  H_COLOR:   '#C0D0DE',
  P_SIZE:    9,
  P_WEIGHT:  500,
  P_COLOR:   '#A0B0C0',
  V_SIZE:    14,
  V_WEIGHT:  600,
  V_COLOR:   '#FFFFFF',
  U_SIZE:    9,
  U_COLOR:   '#8090A0',
  SEP:       'rgba(255,255,255,0.05)',
  // Colors
  CYAN:      '#19D8FF',
  GREEN:     '#28D764',
  ORANGE:    '#FF8C2A',
  RED:       '#FF5555',
  YELLOW:    '#FFC53A',
};

/* ── Sparkline ───────────────────────────────────────────────────────────── */
const Sparkline: React.FC<{ data: number[]; color: string }> = ({ data, color }) => {
  const W = 40, H = 14;
  const safe = data && data.length >= 2 ? data : [0, 0.4, 0.2, 0.7, 0.5, 0.9, 0.6, 0.8];
  const mn = Math.min(...safe), mx = Math.max(...safe);
  const rng = mx - mn || 1;
  const pts = safe.map((v, i) => {
    const x = (i / (safe.length - 1)) * W;
    const y = H - ((v - mn) / rng) * (H - 4) - 2;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  const lastV = safe[safe.length - 1];
  const dotY  = H - ((lastV - mn) / rng) * (H - 4) - 2;
  return (
    <svg width={W} height={H} style={{ overflow: 'visible', flexShrink: 0, display: 'block' }}>
      <polyline points={`0,${H} ${pts} ${W},${H}`} fill={color} fillOpacity={0.1} stroke="none" />
      <polyline points={pts} fill="none" stroke={color} strokeWidth={1.2} strokeLinecap="round" opacity={0.9} />
      <circle cx={W} cy={dotY} r={1.5} fill={color} />
    </svg>
  );
};

const SectionTitle: React.FC<{ label: string; right?: React.ReactNode }> = ({ label, right }) => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 2px', marginBottom: 4, flexShrink: 0,
  }}>
    <span style={{
      fontFamily: T.F, fontSize: T.H_SIZE, fontWeight: T.H_WEIGHT,
      letterSpacing: T.H_LS, color: T.H_COLOR, textTransform: 'uppercase',
    }}>{label}</span>
    {right}
  </div>
);

/* ── Card Wrapper ────────────────────────────────────────────────────────── */
const Card: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{
    background:    T.CARD_BG,
    border:        T.BORDER,
    borderRadius:  T.RADIUS,
    boxShadow:     T.CARD_SHADOW,
    overflow:      'hidden',
    display:       'flex',
    flexDirection: 'column',
    ...style,
  }}>
    {children}
  </div>
);

/* ── Icon Circle ─────────────────────────────────────────────────────────── */
const IconCircle: React.FC<{ color: string; children: React.ReactNode; size?: number }> = ({ color, children, size = 18 }) => (
  <div style={{
    width: size, height: size, minWidth: size, borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: `${color}15`,
    border: `1px solid ${color}30`,
    flexShrink: 0,
  }}>
    {children}
  </div>
);

/* ── AQI helper ──────────────────────────────────────────────────────────── */
function aqiStyle(v: number) {
  if (v <= 50)  return { label: 'Good',      color: T.GREEN,  bg: `${T.GREEN}10`  };
  if (v <= 100) return { label: 'Moderate',  color: T.YELLOW, bg: `${T.YELLOW}10` };
  if (v <= 150) return { label: 'Poor',      color: T.ORANGE, bg: `${T.ORANGE}10` };
  if (v <= 200) return { label: 'Unhealthy', color: T.RED,    bg: `${T.RED}10`    };
  return             { label: 'Hazardous',  color: '#a855f7', bg: 'rgba(168,85,247,0.08)' };
}

/* ═══════════════════════════════════════════════════════════════════════════
   1. LIVE CONDITIONS CARD
   ═══════════════════════════════════════════════════════════════════════════ */
interface LiveConditionsProps {
  district: DistrictClimateData | null | undefined;
  onOpenAqiModal?: () => void;
}

const LiveConditionsCard: React.FC<LiveConditionsProps> = ({ district, onOpenAqiModal }) => {
  const sparkData = useMemo(() => {
    if (!district) return { temp: [], hum: [], rain: [], wind: [] };
    const j = (b: number, a: number, n = 12) =>
      Array.from({ length: n }, (_, i) =>
        +(b + a * Math.sin(i * 0.85 + b) * (0.5 + Math.random() * 0.5)).toFixed(1));
    return {
      temp: j(district.temperature, 1.5),
      hum:  j(district.humidity,    5),
      rain: j(district.rainfall24h, 2),
      wind: j(district.windSpeed,   3),
    };
  }, [district?.id]);

  const aqi = district?.aqi ?? 48;
  const ai  = aqiStyle(aqi);

  const rows = [
    {
      key: 'temp', label: 'Temperature',
      val: district ? district.temperature.toFixed(1) : '32.4', unit: '°C',
      icon: <Thermometer size={10} color={T.ORANGE} strokeWidth={2}/>,
      iconColor: T.ORANGE, spark: sparkData.temp, sc: T.ORANGE,
    },
    {
      key: 'hum', label: 'Humidity',
      val: district ? String(district.humidity) : '58', unit: '%',
      icon: <Droplets size={10} color="#4A9EFF" strokeWidth={2}/>,
      iconColor: '#4A9EFF', spark: sparkData.hum, sc: '#3b82f6',
    },
    {
      key: 'rain', label: 'Rainfall (24h)',
      val: district ? district.rainfall24h.toFixed(1) : '12.8', unit: 'mm',
      icon: <Umbrella size={10} color="#22d3ee" strokeWidth={2}/>,
      iconColor: '#22d3ee', spark: sparkData.rain, sc: '#22d3ee',
    },
    {
      key: 'wind', label: 'Wind Speed',
      val: district ? String(district.windSpeed) : '18', unit: 'km/h',
      icon: <Wind size={10} color="#2dd4bf" strokeWidth={2}/>,
      iconColor: '#2dd4bf', spark: sparkData.wind, sc: '#14b8a6',
    },
  ];

  return (
    <Card style={{ flex: '1 1 auto', minHeight: 0 }}>
      {district && (
        <div style={{ padding: '2px 8px', fontFamily: T.F, fontSize: 8, color: T.CYAN, opacity: 0.8, borderBottom: `1px solid ${T.SEP}`, flexShrink: 0 }}>
          📍 {district.name}
        </div>
      )}

      {/* 4 Metric rows */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, justifyContent: 'space-evenly' }}>
        {rows.map((r, i) => (
          <React.Fragment key={r.key}>
            <div style={{
              display: 'flex', alignItems: 'center',
              gap: 8, padding: '2px 8px', flex: 1, minHeight: 0
            }}>
              <IconCircle color={r.iconColor} size={20}>{r.icon}</IconCircle>
              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ fontFamily: T.F, fontSize: T.P_SIZE, fontWeight: T.P_WEIGHT, color: T.P_COLOR, lineHeight: 1, marginBottom: 1 }}>{r.label}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
                  <span style={{ fontFamily: T.F, fontSize: T.V_SIZE, fontWeight: T.V_WEIGHT, color: T.V_COLOR, lineHeight: 1 }}>{r.val}</span>
                  <span style={{ fontFamily: T.F, fontSize: T.U_SIZE, color: T.U_COLOR }}>{r.unit}</span>
                </div>
              </div>
              <Sparkline data={r.spark} color={r.sc}/>
            </div>
            {i < rows.length - 1 && <div style={{ height: 1, background: T.SEP, margin: '0 8px', flexShrink: 0 }}/>}
          </React.Fragment>
        ))}
      </div>

      {/* AQI row */}
      <div style={{ height: 1, background: T.SEP, margin: '0 8px', flexShrink: 0 }}/>
      <div
        onClick={onOpenAqiModal}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '4px 8px',
          cursor: 'pointer',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <IconCircle color={ai.color} size={20}>
            <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke={ai.color} strokeWidth={2.5} strokeLinecap="round">
              <circle cx="7" cy="7" r="3"/><circle cx="17" cy="17" r="3"/><circle cx="17" cy="7" r="3"/><circle cx="7" cy="17" r="3"/>
            </svg>
          </IconCircle>
          <div>
            <div style={{ fontFamily: T.F, fontSize: T.P_SIZE, fontWeight: T.P_WEIGHT, color: T.P_COLOR, lineHeight: 1, marginBottom: 1 }}>AQI (Air Quality)</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span style={{ fontFamily: T.F, fontSize: T.V_SIZE, fontWeight: T.V_WEIGHT, color: T.V_COLOR, lineHeight: 1 }}>{aqi}</span>
              <span style={{ fontFamily: T.F, fontSize: 9, fontWeight: 600, color: ai.color }}>{ai.label}</span>
            </div>
          </div>
        </div>
        <ChevronRight size={12} color="#6E7F90" strokeWidth={2}/>
      </div>
    </Card>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   2. DATA SOURCES CARD
   ═══════════════════════════════════════════════════════════════════════════ */
const SOURCES = [
  'IMD', 'ISRO', 'NASA', 'ERA5', 'Sentinel-2', 'CGIAR', 'CPCB', 'Telangana SDMA',
];

const DataSourcesCard: React.FC<{ sources?: DataSourceItem[] }> = () => (
  <Card style={{ flex: '1 1 auto', minHeight: 0 }}>
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, justifyContent: 'space-evenly', padding: '2px 0' }}>
      {SOURCES.map((name, i) => (
        <div key={name} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 8px', flex: '1 1 auto', minHeight: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {name === 'Telangana SDMA' ? (
              <Map size={9} color={T.GREEN} />
            ) : (
              <span style={{
                width: 4, height: 4, borderRadius: '50%',
                background: T.GREEN, flexShrink: 0,
                boxShadow: `0 0 3px ${T.GREEN}`,
                display: 'block',
              }}/>
            )}
            <span style={{ fontFamily: T.F, fontSize: 10, fontWeight: 500, color: '#C0D0DE' }}>{name}</span>
          </div>
          <span style={{
            fontFamily: T.F, fontSize: 8, fontWeight: 700, letterSpacing: '0.04em',
            color: T.GREEN, padding: '1px 4px', borderRadius: 2,
            background: 'rgba(40,215,100,0.1)',
            border: '1px solid rgba(40,215,100,0.2)',
          }}>LIVE</span>
        </div>
      ))}
    </div>
  </Card>
);

/* ═══════════════════════════════════════════════════════════════════════════
   3. ALERTS & WARNINGS CARD
   ═══════════════════════════════════════════════════════════════════════════ */
const ALERTS_DATA = [
  {
    id: '1', title: 'Heatwave Warning', places: 'Hyderabad, Rangareddy, Medchal, Sangareddy', time: '17 May 2024 • 11:30 AM',
    color: T.RED, bg: `linear-gradient(90deg, ${T.RED}15 0%, transparent 100%)`, icon: <AlertTriangle size={12} strokeWidth={2}/>,
  },
  {
    id: '2', title: 'Thunderstorm Alert', places: 'Adilabad, Nirmal, Komaram Bheem Asifabad', time: '17 May 2024 • 10:45 AM',
    color: T.ORANGE, bg: `linear-gradient(90deg, ${T.ORANGE}15 0%, transparent 100%)`, icon: <CloudLightning size={12} strokeWidth={2}/>,
  },
  {
    id: '3', title: 'High UV Index', places: 'Entire State', time: '17 May 2024 • 09:00 AM',
    color: T.YELLOW, bg: `linear-gradient(90deg, ${T.YELLOW}15 0%, transparent 100%)`, icon: <Sun size={12} strokeWidth={2}/>,
  },
  {
    id: '4', title: 'No Drought Conditions', places: 'All Districts', time: '17 May 2024 • 08:30 AM',
    color: T.GREEN, bg: `linear-gradient(90deg, ${T.GREEN}15 0%, transparent 100%)`, icon: <Leaf size={12} strokeWidth={2}/>,
  },
];

const AlertsCard: React.FC<{ onViewAll?: () => void }> = ({ onViewAll }) => (
  <Card style={{ flex: '1 1 auto', minHeight: 0 }}>
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, justifyContent: 'space-evenly', padding: '2px' }}>
      {ALERTS_DATA.map(a => (
        <div
          key={a.id}
          onClick={onViewAll}
          style={{
            display: 'flex', alignItems: 'flex-start', gap: 6,
            padding: '4px 6px',
            borderRadius: 4,
            background: a.bg,
            border: `1px solid ${a.color}25`,
            cursor: 'pointer',
            flex: '1 1 auto',
            minHeight: 0,
            margin: '1px',
          }}
        >
          <div style={{ marginTop: 2, color: a.color, flexShrink: 0 }}>
            {a.icon}
          </div>
          <div style={{ minWidth: 0, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontFamily: T.F, fontSize: 10, fontWeight: 600, color: a.color, marginBottom: 1, lineHeight: 1.1 }}>
              {a.title}
            </div>
            <div style={{ fontFamily: T.F, fontSize: 9, color: '#C0D0DE', marginBottom: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: 1 }}>
              {a.places}
            </div>
            <div style={{ fontFamily: T.F, fontSize: 8, color: '#8090A0', fontWeight: 500, lineHeight: 1 }}>
              {a.time}
            </div>
          </div>
        </div>
      ))}
    </div>
  </Card>
);

/* ═══════════════════════════════════════════════════════════════════════════
   4. DATA SOURCE STATUS
   ═══════════════════════════════════════════════════════════════════════════ */
const STATUS_SOURCES = [
  { id: 'imd',      name: 'IMD',      icon: <Radio size={10} color="#00f0ff" />, bg: '#00f0ff15', border: '#00f0ff40' },
  { id: 'isro',     name: 'ISRO',     icon: <Satellite size={10} color="#60a5fa" />, bg: '#60a5fa15', border: '#60a5fa40' },
  { id: 'nasa',     name: 'NASA',     icon: <Globe size={10} color="#3b82f6" />, bg: '#3b82f615', border: '#3b82f640' },
  { id: 'era5',     name: 'ERA5',     icon: <Cpu size={10} color="#22c55e" />, bg: '#22c55e15', border: '#22c55e40' },
  { id: 'sentinel', name: 'Sentinel-2', icon: <Layers size={10} color="#94a3b8" />, bg: '#94a3b815', border: '#94a3b840' },
  { id: 'sdma',     name: 'Telangana\nSDMA',  icon: <ShieldCheck size={10} color="#f97316" />, bg: '#f9731615', border: '#f9731640' },
];

const DataSourceStatusCard: React.FC = () => (
  <Card style={{ padding: '4px 2px', flexShrink: 0 }}>
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 1,
    }}>
      {STATUS_SOURCES.map(s => (
        <div key={s.id} style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
        }}>
          <div style={{
            width: 20, height: 20, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: s.bg, border: `1px solid ${s.border}`,
          }}>
            {s.icon}
          </div>
          <span style={{
            fontFamily: T.F, fontSize: 7, fontWeight: 500, color: '#8EA5B7',
            textAlign: 'center', lineHeight: 1.1, height: 16, whiteSpace: 'pre-wrap'
          }}>{s.name}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <span style={{ width: 3, height: 3, borderRadius: '50%', background: T.GREEN, display: 'block', boxShadow: `0 0 2px ${T.GREEN}` }}/>
            <span style={{ fontFamily: T.F, fontSize: 7, color: T.GREEN, fontWeight: 700 }}>Live</span>
          </div>
        </div>
      ))}
    </div>
  </Card>
);

/* ═══════════════════════════════════════════════════════════════════════════
   LEFT SIDEBAR — Main Export
   ═══════════════════════════════════════════════════════════════════════════ */
interface LeftSidebarProps {
  district: DistrictClimateData | null | undefined;
  alerts?: ClimateAlert[];
  sources?: DataSourceItem[];
  onOpenAqiModal?: () => void;
  onViewAlerts?: () => void;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  district, alerts, sources, onOpenAqiModal, onViewAlerts,
}) => (
  <aside style={{
    width:          '100%',
    height:         '100%',
    background:     T.BG,
    borderRight:    '1px solid rgba(255,255,255,0.06)',
    display:        'flex',
    flexDirection:  'column',
    gap:            '6px',
    padding:        '6px',
    overflow:       'hidden', // Non-scrollable strict layout
    boxSizing:      'border-box',
  }}>

    {/* 1. LIVE CONDITIONS */}
    <div style={{ display: 'flex', flexDirection: 'column', flex: '0 0 auto' }}>
      <SectionTitle label="LIVE CONDITIONS" right={
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ fontFamily: T.F, fontSize: 9, color: '#5A6A7A' }}>( Real-time )</span>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 3,
            padding: '2px 4px', borderRadius: 4,
            background: 'rgba(40,215,100,0.15)',
          }}>
            <span style={{
              width: 4, height: 4, borderRadius: '50%',
              background: T.GREEN, display: 'block',
              boxShadow: `0 0 4px ${T.GREEN}`,
            }}/>
            <span style={{ fontFamily: T.F, fontSize: 8, fontWeight: 700, color: T.GREEN, textTransform: 'uppercase' }}>LIVE</span>
          </div>
        </div>
      } />
      <LiveConditionsCard district={district} onOpenAqiModal={onOpenAqiModal} />
    </div>

    {/* 2. DATA SOURCES */}
    <div style={{ display: 'flex', flexDirection: 'column', flex: '0 0 auto' }}>
      <SectionTitle label="DATA SOURCES" />
      <DataSourcesCard sources={sources} />
    </div>

    {/* 3. ALERTS & WARNINGS */}
    <div style={{ display: 'flex', flexDirection: 'column', flex: '0 0 auto' }}>
      <SectionTitle
        label="ALERTS & WARNINGS"
        right={
          <button
            onClick={onViewAlerts}
            style={{ fontFamily: T.F, fontSize: 9, color: '#6A7BF3', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            View All
          </button>
        }
      />
      <AlertsCard onViewAll={onViewAlerts} />
    </div>

    {/* 4. DATA SOURCE STATUS */}
    <div style={{ display: 'flex', flexDirection: 'column', flexShrink: 0, marginTop: 'auto' }}>
      <SectionTitle label="DATA SOURCE STATUS" />
      <DataSourceStatusCard />
    </div>

  </aside>
);

/* Backward compatibility exports */
export const LiveConditions = LiveConditionsCard;
export const DataSources    = DataSourcesCard;
export const AlertsWarnings = AlertsCard;
