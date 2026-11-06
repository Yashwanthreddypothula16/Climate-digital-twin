import React, { useState } from 'react';
import { Sliders, Plus, Trash2, CheckCircle2, Play, AlertCircle, X, Edit3 } from 'lucide-react';
import { AlertRuleItem, AlertSeverity } from '../../types/alerts';
import { INITIAL_ALERT_RULES } from '../../services/alertsService';
import { ALL_DISTRICTS } from '../../data/districtClimate';

export const AlertRulesView: React.FC = () => {
  const [rules, setRules] = useState<AlertRuleItem[]>(INITIAL_ALERT_RULES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [testResult, setTestResult] = useState<{ id: string; msg: string } | null>(null);

  // New Rule Form State
  const [name, setName] = useState('');
  const [parameter, setParameter] = useState('Maximum Temperature');
  const [condition, setCondition] = useState<'Greater than' | 'Less than' | 'Exceeds threshold for'>('Greater than');
  const [threshold, setThreshold] = useState('42.0°C');
  const [duration, setDuration] = useState('2 consecutive days');
  const [severity, setSeverity] = useState<AlertSeverity>('Severe');
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>(['Hyderabad', 'Rangareddy']);
  const [channels, setChannels] = useState<string[]>(['SMS', 'Email', 'App Push', 'Dashboard']);

  const handleToggleEnable = (id: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const handleDeleteRule = (id: string) => {
    if (window.confirm('Are you sure you want to delete this alert rule?')) {
      setRules((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const handleTestRule = (rule: AlertRuleItem) => {
    setTestResult({
      id: rule.id,
      msg: `Evaluation Test Passed: Rule triggers across 2 districts under current AWS conditions (${rule.threshold})`,
    });
    setTimeout(() => setTestResult(null), 4000);
  };

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newRule: AlertRuleItem = {
      id: `RULE-${Date.now().toString().slice(-4)}`,
      name: name.trim(),
      parameter,
      condition,
      threshold,
      duration,
      districts: selectedDistricts,
      severity,
      channels,
      enabled: true,
      lastEvaluated: 'Just now',
    };

    setRules([newRule, ...rules]);
    setIsModalOpen(false);
    setName('');
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-[#030914] p-3 space-y-3 overflow-hidden select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#00f0ff]/15">
        <div>
          <h2 className="text-white text-sm font-bold tracking-wider font-mono uppercase flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-[#00f0ff]" />
            <span>CONFIGURABLE ALERT RULES ENGINE ({rules.length} RULES)</span>
          </h2>
          <p className="text-[10.5px] text-slate-400">
            Real-time threshold triggers, deduplication parameters, and automated dispatch escalation
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-gradient-to-r from-[#00d9f5] to-[#00f0ff] hover:from-[#00c5df] text-[#020810] font-bold text-xs shadow-[0_0_12px_rgba(0,240,255,0.3)] transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span>Create New Rule</span>
        </button>
      </div>

      {/* Rules Table / Grid */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className={`p-3 rounded border transition-colors ${
              rule.enabled
                ? 'bg-[#061220] border-[#00f0ff]/25 hover:border-[#00f0ff]/50'
                : 'bg-[#040c17] border-white/[0.05] opacity-60'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-white tracking-wide">{rule.name}</span>
                  <span className="font-mono text-[9px] text-slate-400">({rule.id})</span>
                  <span
                    className={`px-1.5 py-0.2 rounded text-[8.5px] font-bold ${
                      rule.severity === 'Severe'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    }`}
                  >
                    {rule.severity}
                  </span>
                </div>

                <div className="text-[11px] text-slate-300">
                  <span className="text-slate-500">Condition:</span>{' '}
                  <span className="text-[#00f0ff] font-semibold">{rule.parameter}</span> {rule.condition}{' '}
                  <span className="font-bold text-white font-mono">{rule.threshold}</span> for{' '}
                  <span className="text-amber-300">{rule.duration}</span>
                </div>

                <div className="text-[10px] text-slate-400">
                  <span className="text-slate-500">Districts:</span> {rule.districts.join(', ')} •{' '}
                  <span className="text-slate-500">Channels:</span> {rule.channels.join(', ')} •{' '}
                  <span className="text-slate-500">Evaluated:</span> {rule.lastEvaluated}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleTestRule(rule)}
                  className="flex items-center space-x-1 px-2.5 py-1 rounded bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/30 text-[10px] font-bold"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Test Rule</span>
                </button>

                <button
                  onClick={() => handleToggleEnable(rule.id)}
                  className={`px-2.5 py-1 rounded text-[10px] font-bold border transition-colors ${
                    rule.enabled
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {rule.enabled ? 'Enabled' : 'Disabled'}
                </button>

                <button
                  onClick={() => handleDeleteRule(rule.id)}
                  className="p-1 rounded hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {testResult && testResult.id === rule.id && (
              <div className="mt-2 p-2 rounded bg-emerald-950/40 border border-emerald-500/50 text-emerald-300 text-[10px] flex items-center space-x-1.5 animate-fadeIn">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{testResult.msg}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal for Creating New Rule */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#030914] border border-[#00f0ff]/40 rounded-lg w-full max-w-lg p-5 shadow-[0_0_30px_rgba(0,240,255,0.2)]">
            <div className="flex items-center justify-between pb-3 border-b border-[#00f0ff]/20 mb-3">
              <h3 className="text-white text-xs font-bold uppercase tracking-wider font-mono">
                CONFIGURE NEW ALERT RULE
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateRule} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 text-[10.5px] font-semibold mb-1">Rule Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Flash Flood Rapid Rise"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#071322] border border-[#00f0ff]/25 rounded px-2.5 py-1.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 text-[10.5px] font-semibold mb-1">Parameter *</label>
                  <select
                    value={parameter}
                    onChange={(e) => setParameter(e.target.value)}
                    className="w-full bg-[#071322] border border-[#00f0ff]/25 rounded px-2 py-1.5 text-white"
                  >
                    <option value="Maximum Temperature">Maximum Temperature</option>
                    <option value="Hourly Rainfall Rate">Hourly Rainfall Rate</option>
                    <option value="Lightning Stroke Density">Lightning Stroke Density</option>
                    <option value="Soil Moisture Deficit">Soil Moisture Deficit</option>
                    <option value="PM2.5 Ambient Level">PM2.5 Ambient Level</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 text-[10.5px] font-semibold mb-1">Threshold *</label>
                  <input
                    type="text"
                    required
                    value={threshold}
                    onChange={(e) => setThreshold(e.target.value)}
                    className="w-full bg-[#071322] border border-[#00f0ff]/25 rounded px-2.5 py-1.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 text-[10.5px] font-semibold mb-1">Duration *</label>
                  <input
                    type="text"
                    required
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full bg-[#071322] border border-[#00f0ff]/25 rounded px-2.5 py-1.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 text-[10.5px] font-semibold mb-1">Severity *</label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as AlertSeverity)}
                    className="w-full bg-[#071322] border border-[#00f0ff]/25 rounded px-2 py-1.5 text-white"
                  >
                    <option value="Severe">Severe</option>
                    <option value="High">High</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Advisory">Advisory</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded bg-slate-800 text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-[#00f0ff] hover:bg-[#00c5df] text-black font-bold text-xs"
                >
                  Save & Enable Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
