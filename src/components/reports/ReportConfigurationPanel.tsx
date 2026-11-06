import React from 'react';
import {
  Users,
  Layout,
  Lock,
  ChevronDown,
  Check
} from 'lucide-react';
import { ReportConfigurationState } from '../../types/reports';

interface ReportConfigurationPanelProps {
  config: ReportConfigurationState;
  onChangeConfig: (newConfig: ReportConfigurationState) => void;
}

export const ReportConfigurationPanel: React.FC<ReportConfigurationPanelProps> = ({
  config,
  onChangeConfig,
}) => {
  const toggleField = (key: keyof ReportConfigurationState) => {
    onChangeConfig({
      ...config,
      [key]: !config[key],
    });
  };

  const TOGGLE_ITEMS: { key: keyof ReportConfigurationState; label: string }[] = [
    { key: 'includeHistorical', label: 'Include Historical Trends' },
    { key: 'includePredictions', label: 'Include Predictions' },
    { key: 'includeSimulation', label: 'Include Simulation Outputs' },
    { key: 'includeExtremes', label: 'Include Extreme Events' },
    { key: 'includeComparison', label: 'Include District Comparison' },
    { key: 'includeInsights', label: 'Include Key Insights' },
    { key: 'includeMapsCharts', label: 'Include Maps & Charts' },
  ];

  return (
    <div className="w-full h-full rounded-xl overflow-hidden bg-[#030914] border border-[#00f0ff]/20 p-2.5 flex flex-col justify-between shadow-xl select-none">
      {/* ── Title ── */}
      <div>
        <span className="text-[10.5px] font-bold text-slate-200 uppercase tracking-wider block mb-2 font-sans">
          REPORT CONFIGURATION
        </span>

        {/* ── 7 Checkbox + Toggle Switch Rows ── */}
        <div className="space-y-1.5">
          {TOGGLE_ITEMS.map((item) => {
            const isChecked = Boolean(config[item.key]);
            return (
              <div
                key={item.key}
                onClick={() => toggleField(item.key)}
                className="flex items-center justify-between py-1 px-1 rounded hover:bg-white/5 cursor-pointer transition-colors"
              >
                {/* Left: Square Checkbox + Label */}
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className={`w-3.5 h-3.5 rounded-[3px] border flex items-center justify-center transition-all shrink-0 ${
                      isChecked
                        ? 'bg-[#00f0ff] border-[#00f0ff] text-[#020810]'
                        : 'border-[#00f0ff]/40 bg-[#051428]'
                    }`}
                  >
                    {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>
                  <span className="text-[10px] text-slate-200 truncate">
                    {item.label}
                  </span>
                </div>

                {/* Right: Cyan Toggle Switch */}
                <div
                  className={`w-7 h-3.5 rounded-full p-0.5 transition-colors shrink-0 flex items-center ${
                    isChecked ? 'bg-[#00f0ff]' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-2.5 h-2.5 rounded-full bg-white shadow-sm transform transition-transform ${
                      isChecked ? 'translate-x-3.5' : 'translate-x-0'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Dropdowns Row: Audience, Template, Confidentiality ── */}
      <div className="pt-2 border-t border-white/10 space-y-2 mt-1">
        {/* Audience */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-[9.5px] text-slate-400 font-medium shrink-0">Audience</span>
          <div className="relative flex-1 max-w-[170px]">
            <select
              value={config.audience}
              onChange={(e) => onChangeConfig({ ...config, audience: e.target.value as any })}
              className="w-full appearance-none bg-[#051428] border border-[#00f0ff]/30 text-white text-[9.5px] rounded px-2 py-1 pr-6 hover:border-[#00f0ff] focus:outline-none cursor-pointer"
            >
              <option value="Research / Academic">Research / Academic</option>
              <option value="Government / Policy">Government / Policy</option>
              <option value="Disaster Management">Disaster Management</option>
              <option value="General Public">General Public</option>
            </select>
            <ChevronDown className="w-3 h-3 text-cyan-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Template */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-[9.5px] text-slate-400 font-medium shrink-0">Template</span>
          <div className="relative flex-1 max-w-[170px]">
            <select
              value={config.template}
              onChange={(e) => onChangeConfig({ ...config, template: e.target.value as any })}
              className="w-full appearance-none bg-[#051428] border border-[#00f0ff]/30 text-white text-[9.5px] rounded px-2 py-1 pr-6 hover:border-[#00f0ff] focus:outline-none cursor-pointer"
            >
              <option value="Executive">Executive</option>
              <option value="Detailed Technical">Detailed Technical</option>
              <option value="Research Paper">Research Paper</option>
              <option value="Administrative Summary">Administrative Summary</option>
            </select>
            <ChevronDown className="w-3 h-3 text-cyan-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Confidentiality */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-[9.5px] text-slate-400 font-medium shrink-0">Confidentiality</span>
          <div className="relative flex-1 max-w-[170px]">
            <select
              value={config.confidentiality}
              onChange={(e) => onChangeConfig({ ...config, confidentiality: e.target.value as any })}
              className="w-full appearance-none bg-[#051428] border border-[#00f0ff]/30 text-white text-[9.5px] rounded px-2 py-1 pr-6 hover:border-[#00f0ff] focus:outline-none cursor-pointer"
            >
              <option value="Internal Use Only">Internal Use Only</option>
              <option value="Public">Public</option>
              <option value="Restricted">Restricted</option>
            </select>
            <ChevronDown className="w-3 h-3 text-cyan-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
};
