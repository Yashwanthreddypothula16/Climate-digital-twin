import React from 'react';

interface CircularGaugeProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  glowColor?: string;
  label?: string;
}

export const CircularGauge: React.FC<CircularGaugeProps> = ({
  percentage,
  size = 54,
  strokeWidth = 4,
  color = '#00F0FF',
  glowColor = 'rgba(0, 240, 255, 0.4)',
  label = 'Confidence',
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center relative select-none">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Glowing active ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          style={{
            filter: `drop-shadow(0 0 4px ${glowColor})`,
            transition: 'stroke-dashoffset 0.8s ease',
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
        <span className="text-[13px] font-bold text-white tracking-tight leading-none font-sans">
          {percentage}%
        </span>
      </div>
      {label && (
        <span className="text-[9px] text-slate-400 mt-1 uppercase tracking-wider font-medium">
          {label}
        </span>
      )}
    </div>
  );
};
