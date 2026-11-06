import React from 'react';
import { Layers, RefreshCw, MapPin, Clock, Leaf } from 'lucide-react';

export const DigitalTwinInfo: React.FC = () => {
  return (
    <div className="rounded-xl bg-[#09173a]/80 border border-[#00f0ff]/20 p-2 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.4)] flex flex-col justify-between h-full">
      {/* Header */}
      <h2 className="text-xs font-bold uppercase tracking-wider text-slate-100 font-display mb-1">
        DIGITAL TWIN INFO
      </h2>

      {/* Main Content: Left Stack Diagram + Center Metadata + Right Goal Card */}
      <div className="grid grid-cols-12 gap-1.5 items-center flex-1 min-h-0">
        {/* Left 3D Holographic Stack Graphic */}
        <div className="col-span-3 flex items-center justify-center">
          <div className="relative w-12 h-14 flex flex-col items-center justify-between">
            {/* Top Plane */}
            <div className="w-10 h-4 rounded bg-gradient-to-r from-cyan-400/40 to-blue-500/30 border border-[#00f0ff] transform -skew-y-12 shadow-[0_0_10px_rgba(0,240,255,0.4)]" />
            {/* Middle Plane */}
            <div className="w-10 h-4 rounded bg-gradient-to-r from-blue-500/40 to-indigo-600/30 border border-blue-400 transform -skew-y-12 shadow-[0_0_8px_rgba(37,99,235,0.3)]" />
            {/* Bottom Plane */}
            <div className="w-10 h-4 rounded bg-gradient-to-r from-indigo-700/50 to-purple-800/40 border border-indigo-500 transform -skew-y-12 shadow-[0_0_6px_rgba(99,102,241,0.3)]" />
          </div>
        </div>

        {/* Center Metadata Specs */}
        <div className="col-span-4 space-y-1 text-[9px] min-w-0">
          <div>
            <span className="text-slate-400 block text-[8px] whitespace-nowrap overflow-hidden text-ellipsis">Model Resolution</span>
            <span className="text-white font-mono font-semibold whitespace-nowrap overflow-hidden text-ellipsis block">1 km x 1 km</span>
          </div>

          <div>
            <span className="text-slate-400 block text-[8px] whitespace-nowrap overflow-hidden text-ellipsis">Update Frequency</span>
            <span className="text-cyan-300 font-mono font-semibold whitespace-nowrap overflow-hidden text-ellipsis block">Every 1 Hour</span>
          </div>

          <div>
            <span className="text-slate-400 block text-[8px] whitespace-nowrap overflow-hidden text-ellipsis">Spatial Extent</span>
            <span className="text-white font-mono font-semibold whitespace-nowrap overflow-hidden text-ellipsis block">33 Districts</span>
          </div>

          <div>
            <span className="text-slate-400 block text-[8px] whitespace-nowrap overflow-hidden text-ellipsis">Last Updated</span>
            <span className="text-slate-300 font-mono text-[8px] whitespace-nowrap overflow-hidden text-ellipsis block">17 May 2024</span>
          </div>
        </div>

        {/* Right "Our Goal" Sustainable Card matching reference photo */}
        <div 
          className="col-span-5 relative rounded-lg overflow-hidden border border-emerald-500/30 p-1.5 flex flex-col justify-between h-full shadow-[0_0_15px_rgba(16,185,129,0.15)]"
          style={{
            backgroundImage: 'linear-gradient(to bottom right, rgba(6,36,30,0.8), rgba(4,18,26,0.9)), url(/building.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {/* Top Eco Badge */}
          <div className="flex items-center justify-between relative z-10">
            <span className="text-[10px] font-bold text-white tracking-tight flex items-center space-x-1">
              <span>Our Goal</span>
            </span>
            <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
              <Leaf className="w-3 h-3" />
            </div>
          </div>

          {/* Goal Narrative Text */}
          <p className="text-[8px] text-emerald-100/95 font-medium leading-tight my-0.5 line-clamp-3 overflow-hidden relative z-10">
            A resilient Telangana through data, AI and sustainable action.
          </p>

          <div className="text-[8px] font-mono text-emerald-300/80 relative z-10">
            Vision 2047 Initiative
          </div>
        </div>
      </div>
    </div>
  );
};
