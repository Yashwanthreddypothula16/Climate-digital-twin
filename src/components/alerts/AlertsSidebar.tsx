import React from 'react';
import { 
  Bell, 
  Radio, 
  ShieldAlert, 
  Sliders, 
  PhoneCall, 
  History, 
  Thermometer, 
  CloudRain, 
  Waves, 
  Zap, 
  Sprout, 
  Wind,
  CheckCircle2,
  ChevronRight,
  MessageSquare,
  Mail,
  Smartphone,
  LayoutDashboard,
  Volume2
} from 'lucide-react';
import { 
  AlertsSidebarTab, 
  AlertSeverityFilter, 
  ClimateAlertRecord, 
  AlertChannelInfo 
} from '../../types/alerts';
import { SEVERITY_COLORS } from '../../services/alertsService';

interface AlertsSidebarProps {
  activeTab: AlertsSidebarTab;
  onSelectTab: (tab: AlertsSidebarTab) => void;
  severityFilter: AlertSeverityFilter;
  onSelectSeverityFilter: (filter: AlertSeverityFilter) => void;
  alerts: ClimateAlertRecord[];
  selectedAlertId: string;
  onSelectAlert: (alert: ClimateAlertRecord) => void;
  channels: AlertChannelInfo[];
  onOpenChannelConfig: (channel: AlertChannelInfo) => void;
  onOpenViewAll: () => void;
}

export const AlertsSidebar: React.FC<AlertsSidebarProps> = ({
  activeTab,
  onSelectTab,
  severityFilter,
  onSelectSeverityFilter,
  alerts,
  selectedAlertId,
  onSelectAlert,
  channels,
  onOpenChannelConfig,
  onOpenViewAll,
}) => {
  // Navigation tabs definition
  const NAV_ITEMS: { id: AlertsSidebarTab; label: string; icon: any }[] = [
    { id: 'active', label: 'Active Alerts', icon: Bell },
    { id: 'early_warnings', label: 'Early Warnings', icon: Radio },
    { id: 'risk_zones', label: 'Risk Zones', icon: ShieldAlert },
    { id: 'rules', label: 'Alert Rules', icon: Sliders },
    { id: 'contacts', label: 'Emergency Contacts', icon: PhoneCall },
    { id: 'history', label: 'Alert History', icon: History },
  ];

  // Helper for Category Icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'heatwave':
        return <Thermometer className="w-4 h-4 text-red-400 shrink-0" />;
      case 'heavy_rainfall':
        return <CloudRain className="w-4 h-4 text-sky-400 shrink-0" />;
      case 'flood':
        return <Waves className="w-4 h-4 text-cyan-400 shrink-0" />;
      case 'thunderstorm':
        return <Zap className="w-4 h-4 text-yellow-400 shrink-0" />;
      case 'drought':
        return <Sprout className="w-4 h-4 text-amber-400 shrink-0" />;
      case 'air_quality':
        return <Wind className="w-4 h-4 text-emerald-400 shrink-0" />;
      default:
        return <Bell className="w-4 h-4 text-cyan-400 shrink-0" />;
    }
  };

  // Helper for Channel Icon
  const getChannelIcon = (id: string) => {
    switch (id) {
      case 'sms': return <MessageSquare className="w-3.5 h-3.5 text-slate-400" />;
      case 'email': return <Mail className="w-3.5 h-3.5 text-slate-400" />;
      case 'push': return <Smartphone className="w-3.5 h-3.5 text-slate-400" />;
      case 'dashboard': return <LayoutDashboard className="w-3.5 h-3.5 text-slate-400" />;
      case 'siren': return <Volume2 className="w-3.5 h-3.5 text-slate-400" />;
      default: return <Bell className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#030914] select-none overflow-hidden">
      {/* ── Top Header Title ── */}
      <div className="px-3 pt-2.5 pb-2 flex items-center justify-between border-b border-[#00f0ff]/10">
        <span className="text-[12px] font-bold tracking-wider text-slate-100 font-mono uppercase">
          ALERTS
        </span>
      </div>

      {/* ── 6 Sidebar Navigation Options ── */}
      <div className="px-2.5 py-2 flex flex-col space-y-1 border-b border-[#00f0ff]/10 shrink-0">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg transition-all text-left text-[11.5px] font-medium cursor-pointer ${
                isActive
                  ? 'bg-[#00f0ff]/15 text-[#00f0ff] border border-[#00f0ff] shadow-[0_0_12px_rgba(0,240,255,0.25)] font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.04] border border-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#00f0ff]' : 'text-slate-400'}`} />
              <span className="flex-1 truncate">{item.label}</span>
              {isActive && <div className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-ping" />}
            </button>
          );
        })}
      </div>

      {/* ── Quick Filters ── */}
      <div className="px-2.5 py-2.5 border-b border-[#00f0ff]/10 shrink-0">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-1 font-mono">
          QUICK FILTERS
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {/* All 24 */}
          <button
            onClick={() => onSelectSeverityFilter('all')}
            className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[10.5px] font-medium transition-all cursor-pointer ${
              severityFilter === 'all'
                ? 'bg-[#0284c7] text-white border border-[#38bdf8] shadow-[0_0_8px_rgba(14,165,233,0.4)]'
                : 'bg-[#071322] text-slate-300 hover:bg-[#0c1f36] border border-[#00f0ff]/15'
            }`}
          >
            <span>All</span>
            <span className="px-2 py-0.2 rounded-full text-[9px] bg-black/40 font-bold">24</span>
          </button>

          {/* Severe 6 */}
          <button
            onClick={() => onSelectSeverityFilter('severe')}
            className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[10.5px] font-medium transition-all cursor-pointer ${
              severityFilter === 'severe'
                ? 'bg-[#dc2626] text-white border border-[#f87171] shadow-[0_0_8px_rgba(220,38,38,0.4)]'
                : 'bg-[#180a0a] text-slate-300 hover:bg-[#251010] border border-red-500/30'
            }`}
          >
            <div className="flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              <span>Severe</span>
            </div>
            <span className="px-2 py-0.2 rounded-full text-[9px] bg-red-950/80 text-red-200 font-bold">6</span>
          </button>

          {/* Moderate 9 */}
          <button
            onClick={() => onSelectSeverityFilter('moderate')}
            className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[10.5px] font-medium transition-all cursor-pointer ${
              severityFilter === 'moderate'
                ? 'bg-[#d97706] text-white border border-[#fbbf24] shadow-[0_0_8px_rgba(217,119,6,0.4)]'
                : 'bg-[#191105] text-slate-300 hover:bg-[#261a07] border border-amber-500/30'
            }`}
          >
            <div className="flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span>Moderate</span>
            </div>
            <span className="px-2 py-0.2 rounded-full text-[9px] bg-amber-950/80 text-amber-200 font-bold">9</span>
          </button>

          {/* Advisory 6 */}
          <button
            onClick={() => onSelectSeverityFilter('advisory')}
            className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[10.5px] font-medium transition-all cursor-pointer ${
              severityFilter === 'advisory'
                ? 'bg-[#ca8a04] text-white border border-[#fde047] shadow-[0_0_8px_rgba(202,138,4,0.4)]'
                : 'bg-[#191605] text-slate-300 hover:bg-[#252107] border border-yellow-500/30'
            }`}
          >
            <div className="flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
              <span>Advisory</span>
            </div>
            <span className="px-2 py-0.2 rounded-full text-[9px] bg-yellow-950/80 text-yellow-200 font-bold">6</span>
          </button>
        </div>

        {/* Resolved 3 (full width bottom) */}
        <button
          onClick={() => onSelectSeverityFilter('resolved')}
          className={`w-full mt-1.5 flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[10.5px] font-medium transition-all cursor-pointer ${
            severityFilter === 'resolved'
              ? 'bg-[#059669] text-white border border-[#34d399] shadow-[0_0_8px_rgba(5,150,105,0.4)]'
              : 'bg-[#061711] text-slate-300 hover:bg-[#0a231a] border border-emerald-500/30'
          }`}
        >
          <div className="flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Resolved</span>
          </div>
          <span className="px-2 py-0.2 rounded-full text-[9px] bg-emerald-950/80 text-emerald-200 font-bold">3</span>
        </button>
      </div>

      {/* ── Live Alert Feed ── */}
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden px-2.5 pt-2 pb-1 border-b border-[#00f0ff]/10">
        <div className="flex items-center justify-between px-1 mb-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
            LIVE ALERT FEED
          </span>
          <button
            onClick={onOpenViewAll}
            className="text-[10.5px] text-[#00f0ff] hover:underline font-medium cursor-pointer"
          >
            View All
          </button>
        </div>

        {/* Alert List Container */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-0.5 custom-scrollbar">
          {alerts.length === 0 ? (
            <div className="p-4 text-center text-slate-500 text-[11px]">
              No alerts match selected filter.
            </div>
          ) : (
            alerts.map((alt) => {
              const isSelected = alt.id === selectedAlertId;
              const sevConfig = SEVERITY_COLORS[alt.severity] || SEVERITY_COLORS.Moderate;
              const borderLeftColor =
                alt.severity === 'Severe'
                  ? '#EF4444'
                  : alt.severity === 'High'
                  ? '#F97316'
                  : alt.severity === 'Moderate'
                  ? '#F59E0B'
                  : alt.severity === 'Advisory'
                  ? '#EAB308'
                  : '#10B981';

              return (
                <div
                  key={alt.id}
                  onClick={() => onSelectAlert(alt)}
                  style={{ borderLeftColor }}
                  className={`p-2.5 rounded-lg cursor-pointer transition-all border border-white/[0.06] border-l-[3.5px] ${
                    isSelected
                      ? 'bg-[#091f35] border-[#00f0ff] border-l-[3.5px] border-l-[#00f0ff] shadow-[0_0_10px_rgba(0,240,255,0.25)]'
                      : 'bg-[#06111f] hover:bg-[#0a1829] hover:border-[#00f0ff]/30'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-1.5 min-w-0">
                      {getCategoryIcon(alt.category)}
                      <span className="text-[11.5px] font-bold text-white truncate">
                        {alt.title}
                      </span>
                    </div>
                    {/* Severity Pill */}
                    <span
                      style={{
                        backgroundColor: sevConfig.badgeBg,
                        color: sevConfig.text === '#000000' ? '#fef08a' : sevConfig.bg,
                        border: `1px solid ${sevConfig.border}55`,
                      }}
                      className="px-2 py-0.5 rounded text-[9px] font-bold shrink-0 ml-1"
                    >
                      {alt.severity}
                    </span>
                  </div>

                  <div className="text-[10px] text-slate-400 mt-1 truncate">
                    {alt.districts.join(', ')}
                  </div>
                  <div className="text-[9.5px] text-[#7E8FA0] font-mono mt-0.5">
                    {alt.issuedTime}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── Alert Channels ── */}
      <div className="px-3 py-2.5 shrink-0 bg-[#02070f]">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 font-mono">
          ALERT CHANNELS
        </div>
        <div className="space-y-1.5">
          {channels.map((chan) => (
            <div
              key={chan.id}
              onClick={() => onOpenChannelConfig(chan)}
              className="flex items-center justify-between py-1 px-1.5 rounded hover:bg-white/[0.04] cursor-pointer transition-colors"
            >
              <div className="flex items-center space-x-2">
                {getChannelIcon(chan.id)}
                <span className="text-[11px] text-slate-300 font-medium">
                  {chan.name}
                </span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_4px_#34d399]" />
                <span className="text-[10px] text-emerald-400 font-medium">
                  {chan.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
