import React from 'react';
import { Play, Pause, CloudRain, Thermometer, AlertTriangle, MapPin, CloudLightning } from 'lucide-react';
import { STORY_MILESTONES } from '../../data/climateData';

interface SmartStoryModeProps {
  activeStoryIndex: number;
  onSelectMilestone: (index: number) => void;
  isStoryPlaying: boolean;
  onTogglePlayStory: () => void;
}

export const SmartStoryMode: React.FC<SmartStoryModeProps> = ({
  activeStoryIndex,
  onSelectMilestone,
  isStoryPlaying,
  onTogglePlayStory,
}) => {
  return (
    <div className="rounded-xl bg-[#09173a]/80 border border-[#00f0ff]/20 p-2 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.4)] flex flex-col justify-between h-full">
      {/* Header & Subtitle */}
      <div>
        <div className="flex items-center space-x-1.5 mb-0.5">
          <span className="w-1.5 h-1.5 bg-[#00f0ff] rounded-full shadow-[0_0_6px_#00f0ff]" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-100 font-display">
            SMART STORY MODE
          </h2>
        </div>
        <p className="text-[10px] text-slate-400">
          Explore climate change journey
        </p>
      </div>

      {/* 5 Milestone Cards matching reference */}
      <div className="grid grid-cols-5 gap-1.5 my-1 flex-1 min-h-0">
        {STORY_MILESTONES.map((item, idx) => {
          const isActive = activeStoryIndex === idx;
          return (
            <div
              key={item.year}
              onClick={() => onSelectMilestone(idx)}
              className={`p-0.5 rounded-md cursor-pointer transition-all flex flex-col items-center justify-center text-center ${
                isActive
                  ? 'bg-gradient-to-b from-[#0e2a5c] to-[#071738] border border-[#00f0ff] shadow-[0_0_15px_rgba(0,240,255,0.4)] scale-105'
                  : 'bg-[#071330]/70 border border-white/5 hover:border-white/20'
              }`}
            >
              {idx === 0 && <CloudRain className={`w-3.5 h-3.5 mb-1 ${isActive ? 'text-cyan-300' : 'text-slate-400'}`} />}
              {idx === 1 && <Thermometer className={`w-3.5 h-3.5 mb-1 ${isActive ? 'text-cyan-300' : 'text-slate-400'}`} />}
              {idx === 2 && <AlertTriangle className={`w-3.5 h-3.5 mb-1 ${isActive ? 'text-cyan-300' : 'text-slate-400'}`} />}
              {idx === 3 && <MapPin className={`w-3.5 h-3.5 mb-1 ${isActive ? 'text-cyan-300' : 'text-slate-400'}`} />}
              {idx === 4 && <CloudLightning className={`w-3.5 h-3.5 mb-1 ${isActive ? 'text-cyan-300' : 'text-slate-400'}`} />}
              <div className="text-[10px] font-black text-white font-mono">
                {item.year}
              </div>
              <div
                className={`text-[7px] font-medium leading-tight mt-0.5 w-full px-0.5 whitespace-nowrap overflow-hidden text-ellipsis ${
                  isActive ? 'text-cyan-300' : 'text-slate-400'
                }`}
              >
                {item.phase}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Mini Timeline Scrub & Play Trigger */}
      <div className="flex items-center space-x-2 pt-1 mt-1 border-t border-white/5 shrink-0">
        <button
          onClick={onTogglePlayStory}
          className="w-5 h-5 rounded-full bg-[#00f0ff] flex items-center justify-center text-slate-950 font-bold hover:scale-110 transition-transform flex-shrink-0"
        >
          {isStoryPlaying ? (
            <Pause className="w-2.5 h-2.5 fill-slate-950" />
          ) : (
            <Play className="w-2.5 h-2.5 fill-slate-950 ml-0.5" />
          )}
        </button>

        {/* Progress track */}
        <div className="flex-1 h-1 bg-[#091a42] rounded-full relative">
          <div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-[#00f0ff] transition-all duration-500 rounded-full"
            style={{ width: `${((activeStoryIndex + 1) / STORY_MILESTONES.length) * 100}%` }}
          />
          <div 
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#00f0ff] shadow-[0_0_5px_#00f0ff] border border-white transition-all duration-500"
            style={{ left: `${((activeStoryIndex + 1) / STORY_MILESTONES.length) * 100}%` }}
          />
        </div>

        <span className="text-[9px] font-mono text-cyan-300">
          {STORY_MILESTONES[activeStoryIndex].year}
        </span>
      </div>
    </div>
  );
};
