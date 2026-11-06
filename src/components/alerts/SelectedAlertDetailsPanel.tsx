import React from 'react';
import { Send, FileText, CheckCircle2 } from 'lucide-react';
import { ClimateAlertRecord } from '../../types/alerts';
import { SEVERITY_COLORS } from '../../services/alertsService';

interface SelectedAlertDetailsPanelProps {
  alert: ClimateAlertRecord;
  onOpenSendNotification: () => void;
  onOpenResponsePlan: () => void;
  onOpenViewAll: () => void;
}

export const SelectedAlertDetailsPanel: React.FC<SelectedAlertDetailsPanelProps> = ({
  alert,
  onOpenSendNotification,
  onOpenResponsePlan,
  onOpenViewAll,
}) => {
  const sevConfig = SEVERITY_COLORS[alert.severity] || SEVERITY_COLORS.Moderate;

  return (
    <div className="bg-[#030914] p-3 flex flex-col justify-between h-full space-y-3 select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-1.5 border-b border-[#00f0ff]/10 shrink-0">
        <span className="text-[11.5px] font-bold text-slate-200 tracking-wider font-mono uppercase">
          SELECTED ALERT DETAILS
        </span>
        <button
          onClick={onOpenViewAll}
          className="text-[10.5px] text-[#00f0ff] hover:underline font-medium cursor-pointer"
        >
          View All Alerts
        </button>
      </div>

      {/* Details List */}
      <div className="space-y-2 text-[11px] overflow-y-auto pr-1 custom-scrollbar flex-1">
        {/* Category */}
        <div className="flex items-start justify-between">
          <span className="text-slate-400 w-32 shrink-0">Category</span>
          <span className="font-bold text-red-400 text-right flex-1 truncate">
            {alert.title}
          </span>
        </div>

        {/* District */}
        <div className="flex items-start justify-between">
          <span className="text-slate-400 w-32 shrink-0">District</span>
          <span className="font-semibold text-slate-200 text-right flex-1 truncate">
            {alert.districts.join(', ')}
          </span>
        </div>

        {/* Issued Time */}
        <div className="flex items-start justify-between">
          <span className="text-slate-400 w-32 shrink-0">Issued Time</span>
          <span className="font-mono text-slate-300 text-right flex-1 text-[10.5px]">
            {alert.issuedTime}
          </span>
        </div>

        {/* Expected Duration */}
        <div className="flex items-start justify-between">
          <span className="text-slate-400 w-32 shrink-0">Expected Duration</span>
          <span className="text-slate-200 text-right flex-1">
            {alert.expectedDuration}
          </span>
        </div>

        {/* Severity */}
        <div className="flex items-center justify-between">
          <span className="text-slate-400 w-32 shrink-0">Severity</span>
          <span
            style={{
              backgroundColor: sevConfig.badgeBg,
              color: sevConfig.text === '#000000' ? '#fde047' : sevConfig.bg,
              border: `1px solid ${sevConfig.border}66`,
            }}
            className="px-2.5 py-0.5 rounded text-[9.5px] font-bold"
          >
            {alert.severity}
          </span>
        </div>

        {/* Confidence */}
        <div className="flex items-center justify-between">
          <span className="text-slate-400 w-32 shrink-0">Confidence</span>
          <span className="font-bold text-emerald-400 font-mono text-[11.5px]">
            {alert.confidence}%
          </span>
        </div>

        {/* Trigger Condition */}
        <div className="flex items-start justify-between">
          <span className="text-slate-400 w-32 shrink-0">Trigger Condition</span>
          <span className="text-slate-300 text-right flex-1 leading-snug">
            {alert.triggerCondition}
          </span>
        </div>

        {/* Recommended Action */}
        <div className="flex items-start justify-between">
          <span className="text-slate-400 w-32 shrink-0">Recommended Action</span>
          <span className="text-slate-300 text-right flex-1 leading-snug">
            {alert.recommendedAction}
          </span>
        </div>

        {/* Response Team */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-slate-400 w-32 shrink-0">Response Team</span>
          <div className="flex items-center space-x-1.5 text-right">
            <span className="text-slate-200 font-medium text-[10.5px]">{alert.responseTeam}</span>
            <span className="flex items-center space-x-0.5 px-1.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/40 text-[9px] text-emerald-400 font-bold">
              <CheckCircle2 className="w-2.5 h-2.5" />
              <span>Active</span>
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#00f0ff]/10 shrink-0">
        {/* SEND NOTIFICATION */}
        <button
          onClick={onOpenSendNotification}
          className="h-[38px] flex items-center justify-center space-x-2 px-3 rounded-lg bg-gradient-to-r from-[#00d9f5] to-[#00f0ff] hover:from-[#00c5df] hover:to-[#00d9f5] text-[#020810] font-bold text-[11px] tracking-wide shadow-[0_0_15px_rgba(0,240,255,0.4)] active:scale-95 transition-all cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
          <span>SEND NOTIFICATION</span>
        </button>

        {/* VIEW RESPONSE PLAN */}
        <button
          onClick={onOpenResponsePlan}
          className="h-[38px] flex items-center justify-center space-x-2 px-3 rounded-lg bg-[#061424] hover:bg-[#0a1e35] text-slate-100 border border-[#00f0ff]/40 hover:border-[#00f0ff] font-bold text-[11px] tracking-wide shadow-[0_0_10px_rgba(0,240,255,0.15)] active:scale-95 transition-all cursor-pointer"
        >
          <FileText className="w-3.5 h-3.5 text-[#00f0ff]" />
          <span>VIEW RESPONSE PLAN</span>
        </button>
      </div>
    </div>
  );
};
