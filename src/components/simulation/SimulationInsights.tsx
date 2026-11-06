import React, { useState } from 'react';
import {
  SimulationInsightItem,
  SimulationResultPayload,
  ComparisonParameterRow,
  ImpactExplanationItem
} from '../../types/simulation';
import {
  Lightbulb,
  CloudRain,
  Thermometer,
  Wind,
  AlertTriangle,
  ChevronRight,
  Cpu,
  Layers,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Info,
  CheckCircle2
} from 'lucide-react';

interface Props {
  insights: SimulationInsightItem[];
  simulationResult?: SimulationResultPayload | null;
  isRunning?: boolean;
  selectedDistrictName?: string;
  timePeriod?: string;
}

export const SimulationInsights: React.FC<Props> = ({
  insights,
  simulationResult,
  isRunning = false,
  selectedDistrictName = 'Telangana',
  timePeriod = '7_days'
}) => {
  const [activeTab, setActiveTab] = useState<'impacts' | 'comparison' | 'overview'>('impacts');

  const getIcon = (type: string) => {
    switch (type) {
      case 'rain':
        return <CloudRain size={12} className="text-[#00f0ff]" />;
      case 'temp':
        return <Thermometer size={12} className="text-amber-400" />;
      case 'wind':
        return <Wind size={12} className="text-teal-400" />;
      default:
        return <AlertTriangle size={12} className="text-rose-400" />;
    }
  };

  const periodLabel = timePeriod === '7_days' ? '7 Days' : timePeriod === '14_days' ? '14 Days' : timePeriod === '1_month' ? '1 Month' : '3 Months';

  return (
    <div className="w-full h-full bg-[#051124] rounded-lg border border-[#00f0ff]/15 p-2 flex flex-col justify-between shadow-md overflow-hidden select-none">
      {/* Header with Title and Mode Switcher */}
      <div className="flex items-center justify-between pb-1 border-b border-white/5 shrink-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <Lightbulb size={12} className="text-[#00f0ff] shrink-0" />
          <span className="text-[10px] font-bold text-slate-200 tracking-wider uppercase truncate">
            SIMULATION INSIGHTS
          </span>
        </div>

        {/* Status Pill */}
        <div className="flex items-center gap-1 shrink-0">
          {isRunning ? (
            <span className="flex items-center gap-1 text-[7.5px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              Simulating...
            </span>
          ) : simulationResult ? (
            <span className="flex items-center gap-1 text-[7.5px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
              <Cpu size={9} className="text-cyan-400" />
              VQC Executed ({simulationResult.executionTimeMs}ms)
            </span>
          ) : (
            <span className="text-[7.5px] font-mono px-1.5 py-0.2 rounded bg-white/5 text-slate-400 border border-white/10">
              Baseline Mode
            </span>
          )}
        </div>
      </div>

      {/* View Tabs */}
      <div className="flex items-center gap-1 my-1 shrink-0">
        <button
          onClick={() => setActiveTab('impacts')}
          className={`flex-1 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'impacts'
              ? 'bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/40 shadow-[0_0_8px_rgba(0,240,255,0.2)]'
              : 'bg-white/[0.02] text-slate-400 hover:text-white border border-white/5'
          }`}
        >
          What Will Happen?
        </button>
        <button
          onClick={() => setActiveTab('comparison')}
          className={`flex-1 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'comparison'
              ? 'bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/40 shadow-[0_0_8px_rgba(0,240,255,0.2)]'
              : 'bg-white/[0.02] text-slate-400 hover:text-white border border-white/5'
          }`}
        >
          Comparison
        </button>
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/40 shadow-[0_0_8px_rgba(0,240,255,0.2)]'
              : 'bg-white/[0.02] text-slate-400 hover:text-white border border-white/5'
          }`}
        >
          Overview
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-0.5">
        {/* ── TAB 1: WHAT WILL HAPPEN? (IMPACTS & NARRATIVE) ── */}
        {activeTab === 'impacts' && (
          <div className="flex flex-col gap-1.5 h-full">
            {/* Plain Language Narrative Explanation */}
            {simulationResult?.narrativeExplanation && (
              <div className="p-1.5 rounded bg-cyan-950/30 border border-cyan-500/20 text-[8px] text-cyan-200 leading-relaxed font-sans shrink-0">
                <span className="font-bold text-white uppercase text-[7.5px] block mb-0.5 flex items-center gap-1">
                  <Info size={9} className="text-[#00f0ff]" /> Scenario Synthesis:
                </span>
                {simulationResult.narrativeExplanation}
              </div>
            )}

            {/* Structured Model-Backed Impact Cards */}
            <div className="flex-1 flex flex-col gap-1">
              {(simulationResult?.impactExplanations || []).length > 0 ? (
                simulationResult!.impactExplanations!.map((imp, idx) => (
                  <div
                    key={idx}
                    className="p-1.5 rounded bg-white/[0.02] border border-white/5 flex flex-col gap-0.5 hover:bg-white/5 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[8.5px] font-bold text-white flex items-center gap-1">
                        {imp.name}
                      </span>
                      <span className={`text-[7.5px] font-mono font-bold px-1 py-0.2 rounded ${
                        imp.severity === 'negative'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : imp.severity === 'warning'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {imp.change}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[7.5px] font-mono text-slate-400">
                      <span className="truncate">{imp.baselineCondition}</span>
                      <ArrowRight size={8} className="text-slate-500 shrink-0" />
                      <span className="text-slate-200 font-semibold truncate">{imp.simulatedCondition}</span>
                    </div>

                    <p className="text-[7.5px] text-slate-400 leading-tight">
                      {imp.explanation}
                    </p>
                  </div>
                ))
              ) : (
                /* Fallback default insights list before simulation is run */
                insights.map((item) => (
                  <div
                    key={item.id}
                    className="p-1 rounded bg-white/[0.02] border border-white/5 flex items-center justify-between gap-1.5 hover:bg-white/5 cursor-pointer transition-all"
                  >
                    <div className="flex items-start gap-1.5 min-w-0">
                      <div className="w-4 h-4 rounded-full bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
                        {getIcon(item.iconType)}
                      </div>
                      <p className="text-[7.8px] text-slate-300 leading-tight">
                        {item.text}
                      </p>
                    </div>
                    <ChevronRight size={10} className="text-slate-500 shrink-0" />
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ── TAB 2: BASELINE VS SIMULATED COMPARISON TABLE ── */}
        {activeTab === 'comparison' && (
          <div className="flex flex-col gap-1">
            <span className="text-[8px] font-mono text-slate-400 uppercase tracking-wider block mb-0.5">
              Baseline vs. Simulated Telemetry
            </span>
            <div className="rounded border border-white/10 overflow-hidden">
              <table className="w-full text-left border-collapse text-[7.5px]">
                <thead>
                  <tr className="bg-white/5 text-slate-400 font-mono border-b border-white/10">
                    <th className="p-1">Parameter</th>
                    <th className="p-1">Baseline</th>
                    <th className="p-1">Simulated</th>
                    <th className="p-1">Change</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-sans">
                  {(simulationResult?.comparisonTable || [
                    { parameter: 'Temperature', baseline: '30.0 °C', simulated: '32.0 °C', change: '+2.0 °C', unit: '°C', model: 'RF Regressor' },
                    { parameter: 'Rainfall', baseline: '4.0 mm', simulated: '3.4 mm', change: '-15%', unit: 'mm', model: 'XGBoost Regressor' },
                    { parameter: 'Humidity', baseline: '60.0 %', simulated: '55.0 %', change: '-10%', unit: '%', model: 'Moisture Scale' },
                    { parameter: 'Wind Speed', baseline: '15.0 km/h', simulated: '15.8 km/h', change: '+5%', unit: 'km/h', model: 'Wind Scale' },
                    { parameter: 'Climate Risk', baseline: 'Moderate', simulated: 'Moderate', change: 'Stable', unit: 'Risk Class', model: 'PennyLane VQC' },
                  ]).map((row, i) => (
                    <tr key={i} className="hover:bg-white/[0.03]">
                      <td className="p-1 font-semibold text-white truncate max-w-[80px]">
                        {row.parameter}
                      </td>
                      <td className="p-1 text-slate-400 font-mono">{row.baseline}</td>
                      <td className="p-1 text-cyan-300 font-mono font-bold">{row.simulated}</td>
                      <td className="p-1 font-mono font-bold text-amber-400">{row.change}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {simulationResult && (
              <div className="p-1.5 rounded bg-white/[0.02] border border-white/5 text-[7px] text-slate-400 font-mono mt-1">
                <span className="text-cyan-400 font-bold block mb-0.5">Model Provenance Attribution:</span>
                <span>• Continuous parameters: User Scenario & Atmospheric Physics Engine</span><br/>
                <span>• Risk Classification: PennyLane 4-Qubit Variational Quantum Classifier (VQC)</span>
              </div>
            )}
          </div>
        )}

        {/* ── TAB 3: SCENARIO OVERVIEW ── */}
        {activeTab === 'overview' && (
          <div className="flex flex-col gap-1 text-[8px] font-sans">
            <div className="p-1.5 rounded bg-white/[0.02] border border-white/5 space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-mono">Selected District:</span>
                <span className="font-bold text-white">{simulationResult?.districtName || selectedDistrictName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-mono">Time Horizon:</span>
                <span className="text-cyan-300 font-mono font-semibold">{periodLabel}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-mono">Quantum Framework:</span>
                <span className="text-emerald-400 font-mono font-semibold">PennyLane 0.45 Simulator</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-mono">Quantum Circuit:</span>
                <span className="text-white font-mono">4 Qubits • 2 Layers • Ring CNOTs</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-mono">State Overlap Fidelity:</span>
                <span className="text-amber-400 font-mono font-bold">
                  {simulationResult ? `${((simulationResult.quantumExecution.quantumStateFidelity || 0) * 100).toFixed(1)}%` : '100% (Baseline)'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-mono">VQC Execution Latency:</span>
                <span className="text-white font-mono">
                  {simulationResult ? `${simulationResult.executionTimeMs} ms` : 'Ready'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-mono">Simulation ID:</span>
                <span className="text-slate-400 font-mono text-[7px] truncate max-w-[120px]">
                  {simulationResult?.simulationId || 'Standby'}
                </span>
              </div>
            </div>

            <div className="p-1.5 rounded bg-blue-950/30 border border-blue-500/20 text-[7.5px] text-blue-200">
              <span className="font-bold text-white block mb-0.5">Execution Methodology:</span>
              Quantum ML executes on PennyLane default.qubit simulator encoding climate features via AngleEmbedding and measuring Pauli-Z expectation values across all 4 registers.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
