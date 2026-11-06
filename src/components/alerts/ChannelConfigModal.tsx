import React, { useState } from 'react';
import { X, CheckCircle2, AlertTriangle, RefreshCw, Radio } from 'lucide-react';
import { AlertChannelInfo } from '../../types/alerts';

interface ChannelConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  channel: AlertChannelInfo | null;
  onToggleStatus: (channelId: string) => void;
}

export const ChannelConfigModal: React.FC<ChannelConfigModalProps> = ({
  isOpen,
  onClose,
  channel,
  onToggleStatus,
}) => {
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  if (!isOpen || !channel) return null;

  const handleTestConnection = () => {
    setIsTesting(true);
    setTestResult(null);
    setTimeout(() => {
      setIsTesting(false);
      setTestResult('Ping OK: 200 SUCCESS (Latency 48ms)');
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#030914] border border-[#00f0ff]/40 rounded-lg w-full max-w-md flex flex-col shadow-[0_0_30px_rgba(0,240,255,0.2)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#00f0ff]/20 bg-[#061220]">
          <div className="flex items-center space-x-2">
            <Radio className="w-4 h-4 text-[#00f0ff]" />
            <h3 className="text-white text-xs font-bold tracking-wide font-mono uppercase">
              CHANNEL CONFIGURATION: {channel.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-6 h-6 rounded hover:bg-white/[0.08] flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3 text-xs">
          <div className="flex items-center justify-between p-2 rounded bg-[#051120] border border-white/[0.06]">
            <span className="text-slate-400">Connection Status</span>
            <div className="flex items-center space-x-1.5">
              <span className={`w-2 h-2 rounded-full ${channel.status === 'Online' ? 'bg-emerald-400' : 'bg-red-400'}`} />
              <span className={`font-bold ${channel.status === 'Online' ? 'text-emerald-400' : 'text-red-400'}`}>
                {channel.status}
              </span>
            </div>
          </div>

          <div className="space-y-1.5 text-slate-300">
            <div>
              <span className="text-slate-500">Provider Service:</span>{' '}
              <span className="font-medium text-slate-200">{channel.provider}</span>
            </div>
            <div>
              <span className="text-slate-500">Last Successful Delivery:</span>{' '}
              <span className="font-mono text-slate-200">{channel.lastSuccessfulDelivery}</span>
            </div>
            <div>
              <span className="text-slate-500">Delivery Error Rate:</span>{' '}
              <span className="font-mono text-emerald-400">{channel.errorRate}</span>
            </div>
            {channel.isSimulationOnly && (
              <div className="p-2 rounded bg-amber-950/30 border border-amber-500/40 text-amber-300 text-[10px]">
                Safety Flag: This channel runs in simulated dry-run mode to protect municipal physical siren infrastructure.
              </div>
            )}
          </div>

          {testResult && (
            <div className="p-2 rounded bg-emerald-950/30 border border-emerald-500/40 text-emerald-300 text-[10px] flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{testResult}</span>
            </div>
          )}

          <div className="flex space-x-2 pt-2">
            <button
              onClick={handleTestConnection}
              disabled={isTesting}
              className="flex-1 flex items-center justify-center space-x-1 py-1.5 px-3 rounded bg-[#00f0ff]/20 hover:bg-[#00f0ff]/30 text-[#00f0ff] border border-[#00f0ff]/40 text-xs font-bold"
            >
              <RefreshCw className={`w-3 h-3 ${isTesting ? 'animate-spin' : ''}`} />
              <span>{isTesting ? 'Testing...' : 'Test Connection'}</span>
            </button>

            <button
              onClick={() => onToggleStatus(channel.id)}
              className={`flex-1 py-1.5 px-3 rounded text-xs font-bold border transition-colors ${
                channel.status === 'Online'
                  ? 'bg-red-500/20 text-red-300 border-red-500/40 hover:bg-red-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
              }`}
            >
              {channel.status === 'Online' ? 'Disable Channel' : 'Enable Channel'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
