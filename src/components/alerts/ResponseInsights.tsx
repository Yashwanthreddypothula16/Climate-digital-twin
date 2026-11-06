import React from 'react';
import { Waves, Thermometer, CloudRain, Wind } from 'lucide-react';

interface ResponseInsightsProps {
  onSelectDistrict?: (dName: string) => void;
}

export const ResponseInsights: React.FC<ResponseInsightsProps> = ({ onSelectDistrict }) => {
  const INSIGHTS = [
    {
      id: 'ins-1',
      icon: Waves,
      iconColor: '#06b6d4',
      bgGlow: 'rgba(6, 182, 212, 0.15)',
      headline: 'Flood risk rising',
      text: 'in low-lying areas of Warangal due to continued heavy rainfall.',
      district: 'Warangal',
    },
    {
      id: 'ins-2',
      icon: Thermometer,
      iconColor: '#ef4444',
      bgGlow: 'rgba(239, 68, 68, 0.15)',
      headline: 'Heat stress likely',
      text: 'to intensify in Hyderabad over the next 24 hours.',
      district: 'Hyderabad',
    },
    {
      id: 'ins-3',
      icon: CloudRain,
      iconColor: '#38bdf8',
      bgGlow: 'rgba(56, 189, 248, 0.15)',
      headline: 'Heavy rainfall impact',
      text: 'expected in Khammam with risk of localized flooding.',
      district: 'Khammam',
    },
    {
      id: 'ins-4',
      icon: Wind,
      iconColor: '#10b981',
      bgGlow: 'rgba(16, 185, 129, 0.15)',
      headline: 'AQI degradation',
      text: 'observed in urban districts. Sensitive groups may be affected.',
      district: 'Hyderabad',
    },
  ];

  return (
    <div className="bg-[#030914] p-2.5 flex flex-col h-full select-none justify-between">
      <div className="text-[11px] font-bold text-slate-200 tracking-wider font-mono uppercase mb-1.5 shrink-0">
        RESPONSE INSIGHTS
      </div>

      <div className="grid grid-cols-4 gap-2 flex-1 items-stretch">
        {INSIGHTS.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              onClick={() => onSelectDistrict && onSelectDistrict(item.district)}
              className="flex items-center space-x-2.5 bg-[#061220] border border-white/[0.08] hover:border-[#00f0ff]/30 p-2 rounded-lg cursor-pointer transition-colors h-full"
            >
              <div
                style={{ backgroundColor: item.bgGlow, borderColor: item.iconColor }}
                className="w-8 h-8 rounded-full border flex items-center justify-center shrink-0"
              >
                <Icon style={{ color: item.iconColor }} className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[11px] font-bold text-white leading-tight">
                  {item.headline}
                </div>
                <div className="text-[9.5px] text-slate-400 line-clamp-2 leading-tight mt-0.5">
                  {item.text}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
