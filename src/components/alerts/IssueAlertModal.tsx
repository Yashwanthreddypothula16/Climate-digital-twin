import React, { useState } from 'react';
import { X, AlertTriangle, ShieldCheck, CheckCircle2, ChevronRight } from 'lucide-react';
import { ClimateAlertRecord, AlertCategory, AlertSeverity } from '../../types/alerts';
import { ALL_DISTRICTS } from '../../data/districtClimate';

interface IssueAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onIssueAlert: (alert: ClimateAlertRecord) => void;
  defaultDistrict?: string;
}

export const IssueAlertModal: React.FC<IssueAlertModalProps> = ({
  isOpen,
  onClose,
  onIssueAlert,
  defaultDistrict = 'Hyderabad',
}) => {
  const [title, setTitle] = useState('Extreme Heatwave Warning');
  const [category, setCategory] = useState<AlertCategory>('heatwave');
  const [severity, setSeverity] = useState<AlertSeverity>('Severe');
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([defaultDistrict]);
  const [triggerCondition, setTriggerCondition] = useState('Max temperature > 42°C for 2 consecutive days');
  const [observedValue, setObservedValue] = useState('42.4°C');
  const [threshold, setThreshold] = useState('40.0°C');
  const [expectedDuration, setExpectedDuration] = useState('48 hours (till 02 Sep 2026)');
  const [recommendedAction, setRecommendedAction] = useState('Activate heat shelters, restrict peak noon outdoor work, supply ORS packets');
  const [responseTeam, setResponseTeam] = useState('IMD + TSDMA + District Health Society');
  const [issuer, setIssuer] = useState('Dr. V. Prasad (Duty Director, TSDMA)');
  const [step, setStep] = useState<'form' | 'preview'>('form');

  if (!isOpen) return null;

  const handleDistrictToggle = (d: string) => {
    if (selectedDistricts.includes(d)) {
      if (selectedDistricts.length > 1) {
        setSelectedDistricts(selectedDistricts.filter((x) => x !== d));
      }
    } else {
      setSelectedDistricts([...selectedDistricts, d]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 'form') {
      setStep('preview');
      return;
    }

    const newAlert: ClimateAlertRecord = {
      id: `ALT-${Date.now().toString().slice(-6)}`,
      title,
      category,
      categoryLabel: title,
      severity,
      districts: selectedDistricts,
      primaryDistrict: selectedDistricts[0] || 'Hyderabad',
      lat: 17.3850,
      lon: 78.4867,
      issuedTime: 'Just now (31 Aug 2026)',
      expectedDuration,
      confidence: 95,
      triggerCondition,
      recommendedAction,
      responseTeam,
      status: 'Active',
      priority: severity === 'Severe' ? 'P1' : 'P2',
      calloutType: title,
      calloutValue: observedValue,
      notes: [`Alert officially issued by authorized personnel: ${issuer}`],
      checklist: [
        { id: 'sop1', task: 'Issue official gazette and media release', completed: true, assignedRole: 'State Information Officer' },
        { id: 'sop2', task: 'Mobilize district emergency control centers', completed: false, assignedRole: 'District Collectorate' },
        { id: 'sop3', task: 'Coordinate inter-departmental relief deployment', completed: false, assignedRole: responseTeam },
      ],
      timeline: [
        { timestamp: 'Just now', event: 'Alert issued and synchronized across state digital twin', actor: issuer },
      ],
    };

    onIssueAlert(newAlert);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#030914] border border-[#00f0ff]/40 rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col shadow-[0_0_30px_rgba(0,240,255,0.2)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#00f0ff]/20 bg-[#061220]">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded bg-[#00f0ff]/20 border border-[#00f0ff]/50 flex items-center justify-center text-[#00f0ff]">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
            <div>
              <h2 className="text-white text-sm font-bold tracking-wide font-mono uppercase">
                {step === 'form' ? 'ISSUE NEW CLIMATE ALERT' : 'CONFIRM ALERT ISSUANCE'}
              </h2>
              <p className="text-[10px] text-slate-400">
                Official Telangana State Early Warning & Climate Digital Twin Broadcast
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded hover:bg-white/[0.08] flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {step === 'form' ? (
            <>
              {/* Row 1: Title & Category */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Alert Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-[#071322] border border-[#00f0ff]/25 rounded px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-[#00f0ff]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Alert Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as AlertCategory)}
                    className="w-full bg-[#071322] border border-[#00f0ff]/25 rounded px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-[#00f0ff]"
                  >
                    <option value="heatwave">Heatwave</option>
                    <option value="heavy_rainfall">Heavy Rainfall</option>
                    <option value="flood">Flood</option>
                    <option value="drought">Drought</option>
                    <option value="thunderstorm">Thunderstorm</option>
                    <option value="wind">Wind</option>
                    <option value="air_quality">Air Quality</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Severity & Expected Duration */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Severity Level *
                  </label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as AlertSeverity)}
                    className="w-full bg-[#071322] border border-[#00f0ff]/25 rounded px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-[#00f0ff]"
                  >
                    <option value="Severe">Severe (Red - Critical Danger)</option>
                    <option value="High">High (Orange - Major Risk)</option>
                    <option value="Moderate">Moderate (Amber - Be Prepared)</option>
                    <option value="Advisory">Advisory (Yellow - Watch)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Expected Duration *
                  </label>
                  <input
                    type="text"
                    required
                    value={expectedDuration}
                    onChange={(e) => setExpectedDuration(e.target.value)}
                    className="w-full bg-[#071322] border border-[#00f0ff]/25 rounded px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-[#00f0ff]"
                  />
                </div>
              </div>

              {/* Row 3: Affected Districts Multi-select */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Affected Districts ({selectedDistricts.length} selected) *
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-2 bg-[#051120] border border-white/[0.08] rounded">
                  {ALL_DISTRICTS.map((d) => {
                    const isChecked = selectedDistricts.includes(d);
                    return (
                      <button
                        type="button"
                        key={d}
                        onClick={() => handleDistrictToggle(d)}
                        className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all ${
                          isChecked
                            ? 'bg-[#00f0ff]/25 text-[#00f0ff] border border-[#00f0ff]/60'
                            : 'bg-white/[0.04] text-slate-400 hover:text-white border border-transparent'
                        }`}
                      >
                        {d}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Row 4: Trigger Condition & Values */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Trigger Condition *
                  </label>
                  <input
                    type="text"
                    required
                    value={triggerCondition}
                    onChange={(e) => setTriggerCondition(e.target.value)}
                    className="w-full bg-[#071322] border border-[#00f0ff]/25 rounded px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-[#00f0ff]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Observed Value *
                  </label>
                  <input
                    type="text"
                    required
                    value={observedValue}
                    onChange={(e) => setObservedValue(e.target.value)}
                    className="w-full bg-[#071322] border border-[#00f0ff]/25 rounded px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-[#00f0ff]"
                  />
                </div>
              </div>

              {/* Row 5: Recommended Action */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Recommended Action SOP *
                </label>
                <textarea
                  rows={2}
                  required
                  value={recommendedAction}
                  onChange={(e) => setRecommendedAction(e.target.value)}
                  className="w-full bg-[#071322] border border-[#00f0ff]/25 rounded px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-[#00f0ff]"
                />
              </div>

              {/* Row 6: Responsible Team & Authorized Issuer */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Responsible Response Team *
                  </label>
                  <input
                    type="text"
                    required
                    value={responseTeam}
                    onChange={(e) => setResponseTeam(e.target.value)}
                    className="w-full bg-[#071322] border border-[#00f0ff]/25 rounded px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-[#00f0ff]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Authorized Issuer Signature *
                  </label>
                  <input
                    type="text"
                    required
                    value={issuer}
                    onChange={(e) => setIssuer(e.target.value)}
                    className="w-full bg-[#071322] border border-[#00f0ff]/25 rounded px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-[#00f0ff]"
                  />
                </div>
              </div>
            </>
          ) : (
            /* Preview Step */
            <div className="space-y-3 p-4 bg-[#051120] border border-[#00f0ff]/30 rounded">
              <div className="flex items-center space-x-2 text-[#00f0ff]">
                <ShieldCheck className="w-5 h-5" />
                <span className="font-bold uppercase tracking-wider text-[11px] font-mono">
                  Review Alert Verification
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-slate-300 text-[11px] border-t border-white/[0.08] pt-2">
                <div><span className="text-slate-500">Title:</span> {title}</div>
                <div><span className="text-slate-500">Category:</span> {category}</div>
                <div><span className="text-slate-500">Severity:</span> <span className="font-bold text-red-400">{severity}</span></div>
                <div><span className="text-slate-500">Districts ({selectedDistricts.length}):</span> {selectedDistricts.join(', ')}</div>
                <div><span className="text-slate-500">Trigger:</span> {triggerCondition}</div>
                <div><span className="text-slate-500">Duration:</span> {expectedDuration}</div>
                <div className="col-span-2"><span className="text-slate-500">Recommended Action:</span> {recommendedAction}</div>
                <div className="col-span-2"><span className="text-slate-500">Authorized Issuer:</span> {issuer}</div>
              </div>
              <div className="p-2.5 rounded bg-amber-950/30 border border-amber-500/30 text-amber-300 text-[10px]">
                Note: Issuing this alert will update the state active alert registry, digital twin choropleth, and live alert feed. Real external cellular broadcast requires active emergency gateway credentials.
              </div>
            </div>
          )}

          {/* Footer Controls */}
          <div className="flex items-center justify-between pt-3 border-t border-[#00f0ff]/15">
            {step === 'preview' ? (
              <button
                type="button"
                onClick={() => setStep('form')}
                className="px-4 py-1.5 rounded bg-slate-800 text-slate-200 hover:bg-slate-700 font-medium"
              >
                Back to Edit
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-1.5 rounded bg-slate-800 text-slate-200 hover:bg-slate-700 font-medium"
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              className="flex items-center space-x-1.5 px-5 py-1.5 rounded bg-gradient-to-r from-[#00d9f5] to-[#00f0ff] hover:from-[#00c5df] text-[#020810] font-bold tracking-wide shadow-[0_0_15px_rgba(0,240,255,0.4)] cursor-pointer"
            >
              <span>{step === 'form' ? 'Preview Alert' : 'Confirm & Issue Alert'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
