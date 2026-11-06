import React from 'react';
import { Play, Pause, RotateCcw, FastForward } from 'lucide-react';

interface TimelineSliderProps {
  currentYear: number;
  onYearChange: (year: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export const TimelineSlider: React.FC<TimelineSliderProps> = ({
  currentYear,
  onYearChange,
  isPlaying,
  onTogglePlay,
}) => {
  const years = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2026, 2028, 2030, 2035];

  return (
    <div className="absolute bottom-3 left-6 right-6 z-20 flex items-center space-x-3 px-4 py-2 bg-[#06112d]/90 border border-[#00f0ff]/30 rounded-xl backdrop-blur-md shadow-[0_4px_25px_rgba(0,0,0,0.6)]">
      {/* Play/Pause Button */}
      <button
        onClick={onTogglePlay}
        title={isPlaying ? "Pause Timeline Animation" : "Play Timeline Animation"}
        className="w-8 h-8 rounded-full bg-gradient-to-r from-[#00f0ff] to-blue-600 flex items-center justify-center text-slate-950 font-bold hover:scale-105 transition-all shadow-[0_0_12px_rgba(0,240,255,0.6)] flex-shrink-0"
      >
        {isPlaying ? (
          <Pause className="w-4 h-4 fill-slate-950" />
        ) : (
          <Play className="w-4 h-4 fill-slate-950 ml-0.5" />
        )}
      </button>

      {/* Scrub Bar with Markers */}
      <div className="flex-1 flex flex-col justify-center relative py-1">
        {/* Track Line */}
        <div className="w-full h-1.5 bg-[#091a42] rounded-full relative overflow-visible border border-white/10">
          {/* Active progress highlight */}
          <div
            className="h-full bg-gradient-to-r from-blue-600 via-[#00f0ff] to-cyan-300 rounded-full transition-all duration-300 shadow-[0_0_8px_#00f0ff]"
            style={{
              width: `${((currentYear - 2015) / (2035 - 2015)) * 100}%`,
            }}
          />
        </div>

        {/* Year Markers Grid */}
        <div className="flex justify-between w-full mt-2 relative">
          {years.map((year) => {
            const isSelected = currentYear === year;
            const isToday = year === 2024;
            const isFuture = year > 2024;

            return (
              <button
                key={year}
                onClick={() => onYearChange(year)}
                className={`flex flex-col items-center group transition-all ${
                  isSelected ? 'scale-110' : 'opacity-70 hover:opacity-100'
                }`}
              >
                {/* Year dot */}
                <span
                  className={`w-2 h-2 rounded-full mb-1 transition-all ${
                    isSelected
                      ? 'bg-[#00f0ff] ring-4 ring-[#00f0ff]/30 shadow-[0_0_8px_#00f0ff]'
                      : isToday
                      ? 'bg-blue-400'
                      : 'bg-slate-600 group-hover:bg-slate-300'
                  }`}
                />
                {/* Year label */}
                <span
                  className={`text-[10px] font-mono tracking-tighter ${
                    isSelected
                      ? 'text-[#00f0ff] font-bold text-xs'
                      : isToday
                      ? 'text-white font-bold'
                      : isFuture
                      ? 'text-purple-300'
                      : 'text-slate-400'
                  }`}
                >
                  {year}
                </span>
                {isToday && (
                  <span className="text-[8px] text-cyan-300 uppercase tracking-widest font-sans font-bold -mt-0.5">
                    Today
                  </span>
                )}
                {isSelected && !isToday && (
                  <span className="text-[8px] text-amber-300 uppercase tracking-widest font-sans font-bold -mt-0.5">
                    {year > 2024 ? 'Projected' : 'Historical'}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Reset to Today button */}
      <button
        onClick={() => onYearChange(2024)}
        title="Reset to 2024 Today"
        className="px-2.5 py-1 rounded-md bg-[#091a42] border border-[#00f0ff]/20 text-[10px] font-mono text-cyan-300 hover:border-[#00f0ff] hover:text-white transition-all flex items-center space-x-1 flex-shrink-0"
      >
        <RotateCcw className="w-3 h-3" />
        <span>Today</span>
      </button>
    </div>
  );
};
