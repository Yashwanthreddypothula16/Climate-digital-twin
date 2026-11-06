import React, { useState } from 'react';
import { Radio, Plus, Search, Filter, ShieldAlert, ArrowRight, CheckCircle2, AlertTriangle, Eye } from 'lucide-react';
import { EarlyWarningItem, AlertCategory } from '../../types/alerts';
import { EARLY_WARNINGS_DATA } from '../../services/alertsService';

interface EarlyWarningsViewProps {
  onPromoteToAlert: (item: EarlyWarningItem) => void;
  onSelectDistrict: (d: string) => void;
}

export const EarlyWarningsView: React.FC<EarlyWarningsViewProps> = ({
  onPromoteToAlert,
  onSelectDistrict,
}) => {
  const [warnings, setWarnings] = useState<EarlyWarningItem[]>(EARLY_WARNINGS_DATA);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<EarlyWarningItem | null>(warnings[0] || null);

  const filtered = warnings.filter((w) => {
    const matchesSearch =
      w.district.toLowerCase().includes(search.toLowerCase()) ||
      w.categoryLabel.toLowerCase().includes(search.toLowerCase()) ||
      w.forecastSource.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCat === 'all' || w.category === selectedCat;
    return matchesSearch && matchesCat;
  });

  const handleDismiss = (id: string) => {
    setWarnings(warnings.filter((w) => w.id !== id));
    if (selectedItem?.id === id) {
      setSelectedItem(warnings[1] || null);
    }
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-[#030914] p-3 space-y-3 overflow-hidden select-none">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-2 border-b border-[#00f0ff]/15">
        <div>
          <h2 className="text-white text-sm font-bold tracking-wider font-mono uppercase flex items-center space-x-2">
            <Radio className="w-4 h-4 text-[#00f0ff] animate-pulse" />
            <span>CLIMATE EARLY WARNINGS WORKSPACE</span>
          </h2>
          <p className="text-[10.5px] text-slate-400">
            Predictive AI & IMD Meteorological Ensemble Forecasting for Telangana's 33 Districts
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <input
            type="text"
            placeholder="Search warnings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-[#071322] border border-[#00f0ff]/20 rounded px-2.5 py-1 text-slate-200 text-xs focus:outline-none focus:border-[#00f0ff]"
          />
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="bg-[#071322] border border-[#00f0ff]/20 rounded px-2.5 py-1 text-slate-200 text-xs focus:outline-none"
          >
            <option value="all">All Warning Categories</option>
            <option value="heatwave">Heatwave</option>
            <option value="heavy_rainfall">Heavy Rainfall</option>
            <option value="flood">Flood Risk</option>
            <option value="thunderstorm">Thunderstorm</option>
            <option value="drought">Drought</option>
            <option value="air_quality">Air Quality</option>
          </select>
        </div>
      </div>

      {/* Main split: List on Left, Detail & Actions on Right */}
      <div className="flex-1 min-h-0 flex gap-3 overflow-hidden">
        {/* Left: Cards List */}
        <div className="flex-[5] flex flex-col overflow-y-auto space-y-2 pr-1 custom-scrollbar">
          {filtered.map((item) => {
            const isSelected = selectedItem?.id === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className={`p-3 rounded border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#091b2e] border-[#00f0ff] shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                    : 'bg-[#061220] border-white/[0.08] hover:border-[#00f0ff]/40'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-ping" />
                    <span className="text-[12px] font-bold text-white">{item.categoryLabel}</span>
                    <span className="text-[11px] text-[#00f0ff] font-semibold">• {item.district}</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      item.estimatedSeverity === 'Severe'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                        : item.estimatedSeverity === 'High'
                        ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    }`}
                  >
                    Est. {item.estimatedSeverity}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-300 mt-2">
                  <div>
                    <span className="text-slate-500">Predicted Onset: </span>
                    <span className="font-mono text-slate-200">{item.predictedOnset}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Duration: </span>
                    <span className="text-slate-200">{item.expectedDuration}</span>
                  </div>
                </div>

                <div className="text-[9.5px] text-slate-400 mt-1.5 truncate">
                  Model: {item.forecastSource} (Confidence: {item.confidence}%)
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Selected Early Warning Workspace */}
        {selectedItem && (
          <div className="flex-[6] bg-[#061220] border border-[#00f0ff]/25 rounded p-4 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-3 text-xs">
              <div className="flex items-start justify-between pb-2 border-b border-white/[0.08]">
                <div>
                  <h3 className="text-base font-bold text-white">{selectedItem.categoryLabel}</h3>
                  <div className="text-[11px] text-[#00f0ff] font-semibold mt-0.5">
                    District Target: {selectedItem.district}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] font-bold text-emerald-400 font-mono">
                    Model Confidence: {selectedItem.confidence}%
                  </div>
                  <div className="text-[9.5px] text-slate-400">{selectedItem.forecastSource}</div>
                </div>
              </div>

              <div className="space-y-2 text-slate-300 text-[11px]">
                <div>
                  <span className="text-slate-500 font-semibold block mb-0.5">Predicted Onset & Duration:</span>
                  <div className="bg-[#030a14] p-2 rounded border border-white/[0.05] font-mono text-[10.5px]">
                    {selectedItem.predictedOnset} • Expected Duration: {selectedItem.expectedDuration}
                  </div>
                </div>

                <div>
                  <span className="text-slate-500 font-semibold block mb-0.5">Forecast Threshold Criteria:</span>
                  <div className="bg-[#030a14] p-2 rounded border border-white/[0.05] text-slate-200">
                    {selectedItem.warningThreshold}
                  </div>
                </div>

                <div>
                  <span className="text-slate-500 font-semibold block mb-0.5">Recommended Preparedness SOP:</span>
                  <div className="bg-[#030a14] p-2 rounded border border-white/[0.05] text-slate-200 leading-relaxed">
                    {selectedItem.recommendedAction}
                  </div>
                </div>
              </div>

              <div className="p-2.5 rounded bg-sky-950/20 border border-sky-500/30 text-sky-300 text-[10.5px]">
                Note: Early Warnings represent model simulations prior to formal ministerial alert publication. Clicking "Issue Official Alert" converts this draft warning into an officially issued alert.
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2 pt-4 border-t border-white/[0.08]">
              <button
                onClick={() => onPromoteToAlert(selectedItem)}
                className="flex-1 py-2 px-3 rounded bg-gradient-to-r from-[#00d9f5] to-[#00f0ff] hover:from-[#00c5df] text-[#020810] font-bold text-xs shadow-[0_0_12px_rgba(0,240,255,0.3)] transition-all cursor-pointer flex items-center justify-center space-x-1.5"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Issue Official Alert</span>
              </button>

              <button
                onClick={() => handleDismiss(selectedItem.id)}
                className="py-2 px-3 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs cursor-pointer"
              >
                Dismiss Draft
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
