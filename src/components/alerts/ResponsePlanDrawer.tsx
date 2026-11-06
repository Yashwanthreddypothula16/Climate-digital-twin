import React, { useState } from 'react';
import { X, CheckSquare, Square, AlertOctagon, CheckCircle2, ArrowUpRight, MessageSquarePlus, ShieldCheck } from 'lucide-react';
import { ClimateAlertRecord } from '../../types/alerts';
import { SEVERITY_COLORS } from '../../services/alertsService';

interface ResponsePlanDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  alert: ClimateAlertRecord;
  onToggleChecklist: (alertId: string, itemId: string) => void;
  onAddNote: (alertId: string, note: string) => void;
  onUpdateStatus: (alertId: string, status: 'Active' | 'Acknowledged' | 'Escalated' | 'Resolved') => void;
}

export const ResponsePlanDrawer: React.FC<ResponsePlanDrawerProps> = ({
  isOpen,
  onClose,
  alert,
  onToggleChecklist,
  onAddNote,
  onUpdateStatus,
}) => {
  const [newNote, setNewNote] = useState('');

  if (!isOpen) return null;

  const sevConfig = SEVERITY_COLORS[alert.severity] || SEVERITY_COLORS.Moderate;

  const handleNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    onAddNote(alert.id, newNote.trim());
    setNewNote('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-end">
      <div className="bg-[#030914] border-l border-[#00f0ff]/30 w-full max-w-xl h-full flex flex-col shadow-[-10px_0_30px_rgba(0,240,255,0.15)] animate-slideLeft">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#00f0ff]/20 bg-[#061220]">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded bg-[#00f0ff]/20 border border-[#00f0ff]/50 flex items-center justify-center text-[#00f0ff]">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <div>
              <h2 className="text-white text-sm font-bold tracking-wide font-mono uppercase">
                EMERGENCY RESPONSE SOP PLAN
              </h2>
              <p className="text-[10px] text-slate-400">
                Action Protocol for <span className="text-[#00f0ff]">{alert.title}</span> ({alert.districts.join(', ')})
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

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {/* Status & Team Card */}
          <div className="bg-[#051120] border border-white/[0.08] rounded p-3 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span
                  style={{
                    backgroundColor: sevConfig.badgeBg,
                    color: sevConfig.bg,
                    border: `1px solid ${sevConfig.border}55`,
                  }}
                  className="px-2 py-0.5 rounded text-[9.5px] font-bold"
                >
                  {alert.severity} Severity
                </span>
                <span className="text-[11px] font-bold text-slate-200">
                  Status: <span className="text-[#00f0ff]">{alert.status}</span>
                </span>
              </div>
              <span className="text-[9.5px] text-slate-400 font-mono">
                Priority: {alert.priority}
              </span>
            </div>

            <div className="text-[10.5px] text-slate-300">
              <span className="text-slate-500 font-semibold">Assigned Incident Team: </span>
              {alert.responseTeam}
            </div>

            <div className="text-[10.5px] text-slate-300 leading-snug">
              <span className="text-slate-500 font-semibold">Official Recommendation: </span>
              {alert.recommendedAction}
            </div>
          </div>

          {/* SOP Checklist */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-200 tracking-wider font-mono uppercase">
                INCIDENT RESPONSE CHECKLIST
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">
                {alert.checklist.filter((c) => c.completed).length} / {alert.checklist.length} Complete
              </span>
            </div>

            <div className="space-y-1.5">
              {alert.checklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onToggleChecklist(alert.id, item.id)}
                  className={`flex items-start space-x-2.5 p-2.5 rounded border cursor-pointer transition-colors ${
                    item.completed
                      ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                      : 'bg-[#061220] border-white/[0.08] text-slate-300 hover:border-[#00f0ff]/30'
                  }`}
                >
                  {item.completed ? (
                    <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className={`text-[11px] font-medium leading-tight ${item.completed ? 'line-through text-slate-400' : ''}`}>
                      {item.task}
                    </div>
                    <div className="flex items-center space-x-2 text-[9px] text-slate-500 mt-1">
                      <span>Role: {item.assignedRole}</span>
                      {item.completedAt && <span className="text-emerald-400">• Completed {item.completedAt}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Incident Timeline */}
          <div>
            <span className="block text-[11px] font-bold text-slate-200 tracking-wider font-mono uppercase mb-2">
              INCIDENT TIMELINE & AUDIT LOG
            </span>
            <div className="space-y-2 border-l border-[#00f0ff]/20 pl-3 ml-1.5">
              {alert.timeline.map((tl, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-[17px] top-1 w-2 h-2 rounded-full bg-[#00f0ff] shadow-[0_0_6px_#00f0ff]" />
                  <div className="text-[9.5px] font-bold text-slate-300">{tl.event}</div>
                  <div className="text-[8.5px] text-slate-500 font-mono">
                    {tl.timestamp} • {tl.actor}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Operational Notes */}
          <div>
            <span className="block text-[11px] font-bold text-slate-200 tracking-wider font-mono uppercase mb-1.5">
              OPERATIONAL NOTES ({alert.notes.length})
            </span>
            <div className="space-y-1.5 max-h-24 overflow-y-auto mb-2">
              {alert.notes.map((n, i) => (
                <div key={i} className="p-2 rounded bg-[#051120] border border-white/[0.06] text-[10px] text-slate-300">
                  {n}
                </div>
              ))}
            </div>
            <form onSubmit={handleNoteSubmit} className="flex space-x-2">
              <input
                type="text"
                placeholder="Log field update or notes..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="flex-1 bg-[#071322] border border-[#00f0ff]/25 rounded px-2.5 py-1 text-slate-100 text-[10.5px] focus:outline-none focus:border-[#00f0ff]"
              />
              <button
                type="submit"
                className="px-3 py-1 bg-[#00f0ff]/20 hover:bg-[#00f0ff]/30 text-[#00f0ff] border border-[#00f0ff]/40 rounded text-[10px] font-bold"
              >
                Add Note
              </button>
            </form>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#00f0ff]/15 bg-[#061220] flex items-center justify-between gap-2">
          <button
            onClick={() => onUpdateStatus(alert.id, 'Acknowledged')}
            className="flex-1 py-1.5 px-2 rounded bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/40 text-amber-300 text-[10.5px] font-bold transition-all text-center cursor-pointer"
          >
            Acknowledge Alert
          </button>

          <button
            onClick={() => onUpdateStatus(alert.id, 'Escalated')}
            className="flex-1 py-1.5 px-2 rounded bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 text-red-300 text-[10.5px] font-bold transition-all text-center cursor-pointer"
          >
            Escalate to State HQ
          </button>

          <button
            onClick={() => onUpdateStatus(alert.id, 'Resolved')}
            className="flex-1 py-1.5 px-2 rounded bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-[10.5px] font-bold transition-all text-center cursor-pointer"
          >
            Resolve Alert
          </button>
        </div>
      </div>
    </div>
  );
};
