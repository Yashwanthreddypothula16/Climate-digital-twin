import React, { useState } from 'react';
import { Thermometer, CloudRain, Waves, Sprout, Wind, ChevronDown } from 'lucide-react';
import { AlertCategory } from '../../types/alerts';

interface RiskByCategoryProps {
  onSelectCategory?: (cat: AlertCategory) => void;
  selectedCategory?: AlertCategory;
  selectedDistrict: string;
}

export const RiskByCategory: React.FC<RiskByCategoryProps> = ({
  onSelectCategory,
  selectedCategory,
  selectedDistrict,
}) => {
  const [districtScope, setDistrictScope] = useState<'all' | 'selected'>('all');

  const CATEGORIES = [
    { id: 'heatwave', label: 'Heatwave', count: districtScope === 'all' ? 8 : 1, max: 10, color: '#EF4444', icon: Thermometer },
    { id: 'heavy_rainfall', label: 'Rainfall', count: districtScope === 'all' ? 6 : 0, max: 10, color: '#0284c7', icon: CloudRain },
    { id: 'flood', label: 'Flood', count: districtScope === 'all' ? 4 : 0, max: 10, color: '#f59e0b', icon: Waves },
    { id: 'drought', label: 'Drought', count: districtScope === 'all' ? 3 : 0, max: 10, color: '#f97316', icon: Sprout },
    { id: 'air_quality', label: 'Air Quality', count: districtScope === 'all' ? 2 : 1, max: 10, color: '#10B981', icon: Wind },
    { id: 'wind', label: 'Wind', count: districtScope === 'all' ? 1 : 0, max: 10, color: '#06b6d4', icon: Wind },
  ];

  return (
    <div className="bg-[#030914] p-2.5 flex flex-col h-full select-none justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-1.5 shrink-0">
        <span className="text-[11px] font-bold text-slate-200 tracking-wider font-mono uppercase">
          RISK BY CATEGORY
        </span>
        <div className="relative">
          <select
            value={districtScope}
            onChange={(e) => setDistrictScope(e.target.value as 'all' | 'selected')}
            className="appearance-none bg-[#071322] border border-[#00f0ff]/20 text-slate-300 text-[10px] font-medium rounded px-2.5 py-0.5 pr-5 cursor-pointer hover:border-[#00f0ff]/40 focus:outline-none"
          >
            <option value="all">All Districts</option>
            <option value="selected">{selectedDistrict}</option>
          </select>
          <ChevronDown className="w-2.5 h-2.5 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Category Bars */}
      <div className="flex-1 flex flex-col justify-between space-y-1">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;
          const pct = Math.max(5, (cat.count / cat.max) * 100);

          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory && onSelectCategory(cat.id as AlertCategory)}
              className={`flex items-center space-x-2 px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                isSelected ? 'bg-[#00f0ff]/10 border border-[#00f0ff]/30' : 'hover:bg-white/[0.03]'
              }`}
            >
              <div className="flex items-center space-x-1.5 w-24 shrink-0">
                <Icon className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[10px] text-slate-300 font-medium truncate">{cat.label}</span>
              </div>

              {/* Bar track */}
              <div className="flex-1 h-2.5 bg-[#091829] rounded-full overflow-hidden border border-white/[0.05]">
                <div
                  style={{
                    width: `${pct}%`,
                    backgroundColor: cat.color,
                    boxShadow: `0 0 6px ${cat.color}66`,
                  }}
                  className="h-full rounded-full transition-all duration-300"
                />
              </div>

              {/* Number Count */}
              <span className="text-[10.5px] font-mono font-bold text-slate-300 w-4 text-right">
                {cat.count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
