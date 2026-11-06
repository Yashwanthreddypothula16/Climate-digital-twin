import React from 'react';
import { Plus, Minus, RotateCcw, Layers, Ruler } from 'lucide-react';

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  onToggleLayerMenu?: () => void;
}

export const MapControls: React.FC<MapControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onResetView,
  onToggleLayerMenu,
}) => {
  return (
    <div className="absolute left-4 top-20 z-20 flex flex-col space-y-1.5 p-1 bg-[#06112d]/85 border border-[#00f0ff]/25 rounded-xl backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
      <button
        onClick={onZoomIn}
        title="Zoom In"
        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
      >
        <Plus className="w-4 h-4" />
      </button>
      <button
        onClick={onZoomOut}
        title="Zoom Out"
        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
      >
        <Minus className="w-4 h-4" />
      </button>
      <div className="w-full h-[1px] bg-[#00f0ff]/20 my-0.5" />
      <button
        onClick={onResetView}
        title="Reset 3D Perspective"
        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-[#00f0ff] hover:bg-white/10 transition-colors"
      >
        <RotateCcw className="w-4 h-4" />
      </button>
      <button
        onClick={onToggleLayerMenu}
        title="Layer Options"
        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-[#00f0ff] hover:bg-white/10 transition-colors"
      >
        <Layers className="w-4 h-4" />
      </button>
      <button
        title="Distance & Area Measurement"
        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-[#00f0ff] hover:bg-white/10 transition-colors"
      >
        <Ruler className="w-4 h-4" />
      </button>
    </div>
  );
};
