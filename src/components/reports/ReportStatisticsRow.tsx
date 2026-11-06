import React from 'react';
import {
  FileText,
  Calendar,
  MapPin,
  Lightbulb,
  BarChart2
} from 'lucide-react';

export const ReportStatisticsRow: React.FC = () => {
  const STATS = [
    {
      label: 'Reports Generated',
      value: '128',
      delta: '↑ +18% (vs. last year)',
      icon: FileText,
      color: '#00F0FF',
    },
    {
      label: 'Scheduled Reports',
      value: '12',
      delta: '↑ +33%',
      icon: Calendar,
      color: '#38BDF8',
    },
    {
      label: 'Districts Covered',
      value: '33 / 33',
      delta: '100% coverage',
      icon: MapPin,
      color: '#34D399',
    },
    {
      label: 'Auto Insights',
      value: '256',
      delta: '↑ +42%',
      icon: Lightbulb,
      color: '#FBBF24',
    },
    {
      label: 'Charts Included',
      value: '18',
      delta: 'Average per report',
      icon: BarChart2,
      color: '#A78BFA',
    },
  ];

  return (
    <div className="grid grid-cols-5 gap-1.5 w-full shrink-0 select-none">
      {STATS.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className="p-2 rounded-xl bg-[#030d1d]/85 border border-[#00f0ff]/15 flex items-center gap-2.5 shadow-md"
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border"
              style={{
                backgroundColor: `${item.color}15`,
                borderColor: `${item.color}40`,
                color: item.color,
              }}
            >
              <Icon className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[8.5px] uppercase tracking-wider text-slate-400 block truncate font-medium">
                {item.label}
              </span>
              <span className="text-[14px] font-bold text-white block leading-tight font-sans">
                {item.value}
              </span>
              <span className="text-[7.5px] font-mono text-emerald-400 block truncate">
                {item.delta}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
