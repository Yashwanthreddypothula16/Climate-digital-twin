import React, { useState } from 'react';
import { ImpactAssessmentTab, ImpactCardItem } from '../../types/simulation';
import { Sprout, ChevronRight } from 'lucide-react';

interface Props {
  impactData: Record<string, ImpactCardItem[]>;
}

export const ImpactAssessment: React.FC<Props> = ({ impactData }) => {
  const [activeTab, setActiveTab] = useState<ImpactAssessmentTab>('agriculture');

  const tabs: { id: ImpactAssessmentTab; label: string }[] = [
    { id: 'agriculture', label: 'Agriculture' },
    { id: 'water_resources', label: 'Water Resources' },
    { id: 'infrastructure', label: 'Infrastructure' },
  ];

  const cards = impactData[activeTab] || impactData['agriculture'];

  return (
    <div className="w-full h-full bg-[#051124] rounded-lg border border-[#00f0ff]/15 p-2 flex flex-col justify-between shadow-md overflow-hidden select-none">
      {/* Header & Tabs */}
      <div className="flex items-center justify-between pb-1 border-b border-white/5 shrink-0">
        <span className="text-[10px] font-bold text-slate-200 tracking-wider uppercase">
          IMPACT ASSESSMENT
        </span>
      </div>

      <div className="flex items-center gap-1 my-1 shrink-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-2 py-0.5 rounded text-[8px] font-semibold transition-all ${
              activeTab === tab.id
                ? 'bg-[#0284c7] text-white border border-[#38bdf8]/40 shadow-sm'
                : 'bg-white/[0.02] text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Cards Area */}
      <div className="flex-1 min-h-0 flex flex-col gap-1 justify-between">
        {/* Main Prominent Metric */}
        {cards[0] && (
          <div className="p-2 rounded bg-white/[0.02] border border-white/5 flex items-center justify-between hover:bg-white/5 cursor-pointer transition-all">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <Sprout size={14} />
              </div>
              <div className="flex flex-col">
                <span className="text-[8.5px] text-slate-400 leading-none">{cards[0].title}</span>
                <span className={`text-sm font-black font-mono mt-0.5 leading-none ${
                  cards[0].status === 'negative' ? 'text-rose-400' : 'text-emerald-400'
                }`}>
                  {cards[0].metric}
                </span>
              </div>
            </div>
            <ChevronRight size={13} className="text-slate-500" />
          </div>
        )}

        {/* 2 Sub-metrics Grid */}
        <div className="grid grid-cols-2 gap-1 shrink-0">
          {cards.slice(1, 3).map((item) => (
            <div
              key={item.id}
              className="p-1.5 rounded bg-white/[0.02] border border-white/5 flex items-center justify-between hover:bg-white/5 cursor-pointer transition-all"
            >
              <div className="flex flex-col min-w-0">
                <span className="text-[7.5px] text-slate-400 truncate">{item.title}</span>
                <span className="text-xs font-mono font-bold text-emerald-400 mt-0.5">
                  {item.metric}
                </span>
              </div>
              <ChevronRight size={11} className="text-slate-500 shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
