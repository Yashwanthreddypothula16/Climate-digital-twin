import React, { useState } from 'react';
import { X, Send, ShieldAlert, CheckCircle2, MessageSquare, Mail, Smartphone, Volume2, Info } from 'lucide-react';
import { ClimateAlertRecord } from '../../types/alerts';

interface SendNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  alert: ClimateAlertRecord;
  onDispatchNotification: (alertId: string, summary: string) => void;
}

export const SendNotificationModal: React.FC<SendNotificationModalProps> = ({
  isOpen,
  onClose,
  alert,
  onDispatchNotification,
}) => {
  const [subject, setSubject] = useState(`[CRITICAL ALERT] ${alert.title} - ${alert.districts.join(', ')}`);
  const [message, setMessage] = useState(
    `TELANGANA STATE CLIMATE ALERT: ${alert.title.toUpperCase()} issued for ${alert.districts.join(', ')}. Trigger: ${alert.triggerCondition}. Actions: ${alert.recommendedAction}. Follow TSDMA advisories.`
  );
  const [selectedGroups, setSelectedGroups] = useState<string[]>([
    'District Administration',
    'Disaster Response Teams',
    'Emergency Contacts',
  ]);
  const [selectedChannels, setSelectedChannels] = useState<string[]>([
    'SMS',
    'Email',
    'App Push',
    'Dashboard',
  ]);
  const [isDispatched, setIsDispatched] = useState(false);

  if (!isOpen) return null;

  const GROUPS = [
    { id: 'District Administration', label: 'District Administration & Collectors', count: '14 officials' },
    { id: 'Disaster Response Teams', label: 'Disaster Response (SDRF & NDRF)', count: '45 commanders' },
    { id: 'Emergency Contacts', label: 'Registered Emergency Contacts Directory', count: '180 focal points' },
    { id: 'Subscribed Public', label: 'Public Early Warning Subscribers', count: '1,42,800 citizens' },
  ];

  const CHANNELS = [
    { id: 'SMS', label: 'SMS Notifications', icon: MessageSquare, isReal: true },
    { id: 'Email', label: 'Email Bulletins', icon: Mail, isReal: true },
    { id: 'App Push', label: 'App Push Notifications', icon: Smartphone, isReal: true },
    { id: 'Dashboard', label: 'Dashboard Live Stream', icon: CheckCircle2, isReal: true },
    { id: 'Siren', label: 'Siren Warning Array (Simulation)', icon: Volume2, isReal: false },
  ];

  const toggleGroup = (id: string) => {
    setSelectedGroups((prev) =>
      prev.includes(id) ? (prev.length > 1 ? prev.filter((g) => g !== id) : prev) : [...prev, id]
    );
  };

  const toggleChannel = (id: string) => {
    setSelectedChannels((prev) =>
      prev.includes(id) ? (prev.length > 1 ? prev.filter((c) => c !== id) : prev) : [...prev, id]
    );
  };

  const handleSend = () => {
    setIsDispatched(true);
    setTimeout(() => {
      onDispatchNotification(
        alert.id,
        `Dispatched via ${selectedChannels.join(', ')} to ${selectedGroups.length} recipient groups`
      );
      setIsDispatched(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#030914] border border-[#00f0ff]/40 rounded-lg w-full max-w-xl flex flex-col shadow-[0_0_30px_rgba(0,240,255,0.2)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#00f0ff]/20 bg-[#061220]">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded bg-[#00f0ff]/20 border border-[#00f0ff]/50 flex items-center justify-center text-[#00f0ff]">
              <Send className="w-3.5 h-3.5" />
            </div>
            <div>
              <h2 className="text-white text-sm font-bold tracking-wide font-mono uppercase">
                SEND CLIMATE NOTIFICATION
              </h2>
              <p className="text-[10px] text-slate-400">
                Multi-channel broadcast composition for: <span className="text-[#00f0ff] font-semibold">{alert.title}</span> ({alert.districts.join(', ')})
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

        {/* Body */}
        <div className="p-5 space-y-3.5 text-xs overflow-y-auto max-h-[80vh]">
          {/* Notification Title / Subject */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">
              Notification Subject / Headline
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-[#071322] border border-[#00f0ff]/25 rounded px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-[#00f0ff]"
            />
          </div>

          {/* Message Content */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">
              Broadcast Message Content ({message.length} chars)
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-[#071322] border border-[#00f0ff]/25 rounded px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-[#00f0ff]"
            />
          </div>

          {/* Recipient Groups */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">
              Authorized Recipient Groups
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {GROUPS.map((grp) => {
                const isSelected = selectedGroups.includes(grp.id);
                return (
                  <div
                    key={grp.id}
                    onClick={() => toggleGroup(grp.id)}
                    className={`flex items-start justify-between p-2 rounded cursor-pointer border transition-colors ${
                      isSelected
                        ? 'bg-[#00f0ff]/15 border-[#00f0ff]/50 text-white'
                        : 'bg-[#051120] border-white/[0.08] text-slate-400 hover:bg-white/[0.03]'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-[10.5px] leading-tight">{grp.label}</div>
                      <div className="text-[9px] text-[#00f0ff] font-mono mt-0.5">{grp.count}</div>
                    </div>
                    <div
                      className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected ? 'bg-[#00f0ff] border-[#00f0ff] text-black' : 'border-slate-500'
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Delivery Channels */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">
              Active Delivery Channels
            </label>
            <div className="flex flex-wrap gap-2">
              {CHANNELS.map((chan) => {
                const Icon = chan.icon;
                const isSelected = selectedChannels.includes(chan.id);
                return (
                  <button
                    key={chan.id}
                    type="button"
                    onClick={() => toggleChannel(chan.id)}
                    className={`flex items-center space-x-1.5 px-2.5 py-1 rounded text-[10px] font-medium border transition-all ${
                      isSelected
                        ? 'bg-[#00f0ff]/20 text-[#00f0ff] border-[#00f0ff]/60'
                        : 'bg-white/[0.03] text-slate-400 border-white/[0.08] hover:text-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{chan.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Safety & Demonstration Mode Guard */}
          <div className="p-3 rounded bg-amber-950/25 border border-amber-500/30 flex items-start space-x-2 text-amber-300 text-[10px] leading-relaxed">
            <Info className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
            <div>
              <span className="font-bold">Public Warning Safety Protocol:</span> In accordance with National Disaster Management guidelines, simulated testing mode is active for Siren Systems and broad public SMS gateways. Delivery will be logged to the state digital twin audit trail.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-[#00f0ff]/15 bg-[#061220]">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 font-medium text-xs cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={handleSend}
            disabled={isDispatched}
            className="flex items-center space-x-1.5 px-5 py-1.5 rounded bg-gradient-to-r from-[#00d9f5] to-[#00f0ff] hover:from-[#00c5df] text-[#020810] font-bold text-xs tracking-wide shadow-[0_0_15px_rgba(0,240,255,0.4)] cursor-pointer disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isDispatched ? 'Broadcasting...' : 'Authorize & Broadcast'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
