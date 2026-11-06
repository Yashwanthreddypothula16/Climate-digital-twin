import React from 'react';
import { CheckCircle2, CheckCheck, Clock, TrendingDown } from 'lucide-react';

export const AlertPerformance: React.FC = () => {
  return (
    <div className="bg-[#030914] p-2.5 flex flex-col h-full select-none justify-between">
      <div className="flex items-center space-x-1.5 mb-1.5 shrink-0">
        <span className="text-[11px] font-bold text-slate-200 tracking-wider font-mono uppercase">
          ALERT PERFORMANCE
        </span>
        <span className="text-[9.5px] text-slate-500 font-mono">(Last 30 Days)</span>
      </div>

      <div className="grid grid-cols-4 gap-1.5 flex-1 items-stretch">
        {/* False Positive Rate */}
        <div className="bg-[#061220] border border-white/[0.08] rounded-lg p-2 flex flex-col justify-center h-full">
          <div className="flex items-center space-x-1.5 mb-0.5">
            <div className="w-4 h-4 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
            </div>
            <span className="text-[17px] font-bold text-white font-mono leading-none">5%</span>
          </div>
          <div className="text-[9px] text-slate-400 leading-tight truncate">False Positive Rate</div>
          <div className="text-[8.5px] text-emerald-400 font-medium mt-0.5 font-mono">v -2%</div>
        </div>

        {/* Acknowledgment Rate */}
        <div className="bg-[#061220] border border-white/[0.08] rounded-lg p-2 flex flex-col justify-center h-full">
          <div className="flex items-center space-x-1.5 mb-0.5">
            <div className="w-4 h-4 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <CheckCheck className="w-2.5 h-2.5 text-emerald-400" />
            </div>
            <span className="text-[17px] font-bold text-white font-mono leading-none">87%</span>
          </div>
          <div className="text-[9px] text-slate-400 leading-tight truncate">Acknowledgment Rate</div>
          <div className="text-[8.5px] text-emerald-400 font-medium mt-0.5 font-mono">^ +6%</div>
        </div>

        {/* Avg Resolution Time */}
        <div className="bg-[#061220] border border-white/[0.08] rounded-lg p-2 flex flex-col justify-center h-full">
          <div className="flex items-center space-x-1.5 mb-0.5">
            <div className="w-4 h-4 rounded-full bg-sky-500/10 border border-sky-500/30 flex items-center justify-center shrink-0">
              <Clock className="w-2.5 h-2.5 text-sky-400" />
            </div>
            <span className="text-[16px] font-bold text-white font-mono leading-none">4.2 hrs</span>
          </div>
          <div className="text-[9px] text-slate-400 leading-tight truncate">Avg. Resolution Time</div>
          <div className="text-[8.5px] text-emerald-400 font-medium mt-0.5 font-mono">v -35%</div>
        </div>

        {/* Escalations */}
        <div className="bg-[#061220] border border-white/[0.08] rounded-lg p-2 flex flex-col justify-center h-full">
          <div className="flex items-center space-x-1.5 mb-0.5">
            <div className="w-4 h-4 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <TrendingDown className="w-2.5 h-2.5 text-emerald-400" />
            </div>
            <span className="text-[17px] font-bold text-white font-mono leading-none">12</span>
          </div>
          <div className="text-[9px] text-slate-400 leading-tight truncate">Escalations</div>
          <div className="text-[8.5px] text-emerald-400 font-medium mt-0.5 font-mono">v -25%</div>
        </div>
      </div>
    </div>
  );
};
