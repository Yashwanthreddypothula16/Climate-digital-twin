import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ArcGaugeProps {
  title: string;
  level: 'Low' | 'Medium' | 'High' | 'Critical';
  score: number; // 0 to 100
  icon: LucideIcon;
  size?: number;
}

export const ArcGauge: React.FC<ArcGaugeProps> = ({
  title,
  level,
  score,
  icon: Icon,
  size = 110,
}) => {
  // Define color palette based on risk level
  const getColor = () => {
    switch (level) {
      case 'Critical':
      case 'High':
        return {
          stroke: '#EF4444', // Red
          glow: 'rgba(239, 68, 68, 0.6)',
          text: 'text-red-400',
          badgeBg: 'bg-red-500/10 border-red-500/30 text-red-300',
        };
      case 'Medium':
        return {
          stroke: '#F59E0B', // Amber
          glow: 'rgba(245, 158, 11, 0.6)',
          text: 'text-amber-400',
          badgeBg: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
        };
      case 'Low':
      default:
        return {
          stroke: '#10B981', // Green
          glow: 'rgba(16, 185, 129, 0.6)',
          text: 'text-emerald-400',
          badgeBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
        };
    }
  };

  const colors = getColor();
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  // Arc parameters: 220 degree arc from 160 deg to 380 deg
  const startAngle = 145;
  const endAngle = 395;
  const totalAngle = endAngle - startAngle;
  const arcLength = (totalAngle / 360) * (2 * Math.PI * radius);
  const currentArcLength = (score / 100) * arcLength;

  // Polar to Cartesian conversion
  const polarToCartesian = (centerX: number, centerY: number, r: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + r * Math.cos(angleInRadians),
      y: centerY + r * Math.sin(angleInRadians),
    };
  };

  const describeArc = (x: number, y: number, r: number, start: number, end: number) => {
    const startPoint = polarToCartesian(x, y, r, end);
    const endPoint = polarToCartesian(x, y, r, start);
    const largeArcFlag = end - start <= 180 ? '0' : '1';
    return [
      'M', startPoint.x, startPoint.y,
      'A', r, r, 0, largeArcFlag, 0, endPoint.x, endPoint.y
    ].join(' ');
  };

  const bgPath = describeArc(size / 2, size / 2, radius, startAngle, endAngle);
  const activeEndAngle = startAngle + (totalAngle * (score / 100));
  const activePath = describeArc(size / 2, size / 2, radius, startAngle, activeEndAngle);

  return (
    <div className="flex flex-col items-center justify-between p-2 rounded-lg bg-[#071330]/50 border border-white/5 hover:border-[#00f0ff]/20 transition-all">
      {/* Title */}
      <span className="text-[11px] font-medium text-slate-300 tracking-tight text-center mb-1">
        {title}
      </span>

      {/* Arc SVG & Level in Center */}
      <div className="relative flex items-center justify-center my-1" style={{ width: size, height: size * 0.72 }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
          {/* Background Arc */}
          <path
            d={bgPath}
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Active Glowing Arc */}
          <path
            d={activePath}
            fill="none"
            stroke={colors.stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            style={{
              filter: `drop-shadow(0 0 6px ${colors.glow})`,
              transition: 'd 0.8s ease',
            }}
          />
        </svg>

        {/* Center Level text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center top-2">
          <span className={`text-[13px] font-bold ${colors.text} tracking-tight`}>
            {level}
          </span>
        </div>
      </div>

      {/* Bottom Icon */}
      <div className="mt-[-6px] flex items-center justify-center text-slate-400">
        <Icon className={`w-4 h-4 ${colors.text}`} />
      </div>
    </div>
  );
};
