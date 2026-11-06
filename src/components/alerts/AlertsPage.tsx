import React, { useState, useMemo } from 'react';
import { useClimateStore } from '../../state/useClimateStore';
import { AlertsHeader } from './AlertsHeader';
import { AlertsSidebar } from './AlertsSidebar';
import { AlertsMap } from './AlertsMap';
import { CurrentAlertStatusPanel } from './CurrentAlertStatusPanel';
import { SelectedAlertDetailsPanel } from './SelectedAlertDetailsPanel';
import { AlertTrendChart } from './AlertTrendChart';
import { RiskByCategory } from './RiskByCategory';
import { DistrictPriorityQueue } from './DistrictPriorityQueue';
import { ResponseInsights } from './ResponseInsights';
import { AlertPerformance } from './AlertPerformance';

// Dedicated Workspace Views
import { EarlyWarningsView } from './EarlyWarningsView';
import { RiskZonesView } from './RiskZonesView';
import { AlertRulesView } from './AlertRulesView';
import { EmergencyContactsView } from './EmergencyContactsView';
import { AlertHistoryView } from './AlertHistoryView';

// Modals & Drawers
import { IssueAlertModal } from './IssueAlertModal';
import { SendNotificationModal } from './SendNotificationModal';
import { ResponsePlanDrawer } from './ResponsePlanDrawer';
import { ChannelConfigModal } from './ChannelConfigModal';
import { ViewAllAlertsModal } from './ViewAllAlertsModal';

import { 
  AlertsSidebarTab, 
  AlertSeverityFilter, 
  AlertCategory, 
  TimeRangeOption, 
  ClimateAlertRecord, 
  AlertChannelInfo,
  EarlyWarningItem
} from '../../types/alerts';
import { INITIAL_ALERTS, ALERT_CHANNELS } from '../../services/alertsService';

export const AlertsPage: React.FC = () => {
  const { selectedDistrictId, setSelectedDistrictId, setActiveTab } = useClimateStore();

  // Navigation & Filter States
  const [activeSidebarTab, setActiveSidebarTab] = useState<AlertsSidebarTab>('active');
  const [severityFilter, setSeverityFilter] = useState<AlertSeverityFilter>('all');
  const [selectedCategory, setSelectedCategory] = useState<AlertCategory>('all');
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRangeOption>('7d');

  // Master Data
  const [alerts, setAlerts] = useState<ClimateAlertRecord[]>(INITIAL_ALERTS);
  const [channels, setChannels] = useState<AlertChannelInfo[]>(ALERT_CHANNELS);

  // Selected Alert ID (defaults to Hyderabad Heatwave)
  const [selectedAlertId, setSelectedAlertId] = useState<string>('ALT-HYD-01');

  // Modals & Drawers
  const [isIssueModalOpen, setIsIssueModalOpen] = useState<boolean>(false);
  const [isSendNotificationOpen, setIsSendNotificationOpen] = useState<boolean>(false);
  const [isResponsePlanOpen, setIsResponsePlanOpen] = useState<boolean>(false);
  const [activeChannelConfig, setActiveChannelConfig] = useState<AlertChannelInfo | null>(null);
  const [isViewAllOpen, setIsViewAllOpen] = useState<boolean>(false);

  // Filtered Alerts for the sidebar feed
  const filteredAlerts = useMemo(() => {
    return alerts.filter((a) => {
      // Severity Filter
      if (severityFilter === 'severe' && a.severity !== 'Severe') return false;
      if (severityFilter === 'moderate' && a.severity !== 'Moderate') return false;
      if (severityFilter === 'advisory' && a.severity !== 'Advisory') return false;
      if (severityFilter === 'resolved' && a.severity !== 'Resolved') return false;

      // Category Dropdown
      if (selectedCategory !== 'all' && a.category !== selectedCategory) return false;

      return true;
    });
  }, [alerts, severityFilter, selectedCategory]);

  // Authoritative Selected Alert Object
  const currentSelectedAlert = useMemo(() => {
    return alerts.find((a) => a.id === selectedAlertId) || alerts[0];
  }, [alerts, selectedAlertId]);

  // Authoritative Selected District Name
  const currentDistrictName = useMemo(() => {
    return currentSelectedAlert.primaryDistrict || selectedDistrictId || 'Hyderabad';
  }, [currentSelectedAlert, selectedDistrictId]);

  // Synchronize District selection
  const handleSelectDistrict = (districtName: string) => {
    setSelectedDistrictId(districtName);
    const matchingAlert = alerts.find((a) =>
      a.districts.some((d) => d.toLowerCase() === districtName.toLowerCase())
    );
    if (matchingAlert) {
      setSelectedAlertId(matchingAlert.id);
    }
  };

  // Synchronize Alert selection
  const handleSelectAlert = (alert: ClimateAlertRecord) => {
    setSelectedAlertId(alert.id);
    if (alert.primaryDistrict) {
      setSelectedDistrictId(alert.primaryDistrict);
    }
  };

  const handleSelectAlertById = (alertId: string) => {
    setSelectedAlertId(alertId);
    const found = alerts.find((a) => a.id === alertId);
    if (found?.primaryDistrict) {
      setSelectedDistrictId(found.primaryDistrict);
    }
  };

  // Issue Alert Handler
  const handleIssueAlert = (newAlert: ClimateAlertRecord) => {
    setAlerts([newAlert, ...alerts]);
    setSelectedAlertId(newAlert.id);
    if (newAlert.primaryDistrict) {
      setSelectedDistrictId(newAlert.primaryDistrict);
    }
    setActiveSidebarTab('active');
  };

  // Convert Early Warning to Issue Alert
  const handlePromoteEarlyWarning = (ew: EarlyWarningItem) => {
    const promotedAlert: ClimateAlertRecord = {
      id: `ALT-EW-${Date.now().toString().slice(-4)}`,
      title: `${ew.categoryLabel} Warning`,
      category: ew.category,
      categoryLabel: `${ew.categoryLabel} Warning`,
      severity: ew.estimatedSeverity,
      districts: [ew.district],
      primaryDistrict: ew.district,
      lat: 17.3850,
      lon: 78.4867,
      issuedTime: 'Just now (Promoted from Early Warning)',
      expectedDuration: ew.expectedDuration,
      confidence: ew.confidence,
      triggerCondition: ew.warningThreshold,
      recommendedAction: ew.recommendedAction,
      responseTeam: 'TSDMA + District Emergency Cell',
      status: 'Active',
      priority: ew.estimatedSeverity === 'Severe' ? 'P1' : 'P2',
      calloutType: ew.categoryLabel,
      calloutValue: 'Warning Active',
      notes: [`Promoted from Early Warning model: ${ew.forecastSource}`],
      checklist: [
        { id: 'ew1', task: 'Issue gazette early warning notification', completed: true, assignedRole: 'State Liaison' },
        { id: 'ew2', task: 'Deploy emergency monitoring units', completed: false, assignedRole: 'District Collectorate' },
      ],
      timeline: [
        { timestamp: 'Just now', event: 'Promoted from Early Warning to Active Alert', actor: 'TSDMA Duty Officer' },
      ],
    };

    setAlerts([promotedAlert, ...alerts]);
    setSelectedAlertId(promotedAlert.id);
    setSelectedDistrictId(ew.district);
    setActiveSidebarTab('active');
  };

  // SOP Checklist Toggle
  const handleToggleChecklist = (alertId: string, itemId: string) => {
    setAlerts((prev) =>
      prev.map((a) => {
        if (a.id !== alertId) return a;
        return {
          ...a,
          checklist: a.checklist.map((item) =>
            item.id === itemId
              ? {
                  ...item,
                  completed: !item.completed,
                  completedAt: !item.completed ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined,
                }
              : item
          ),
        };
      })
    );
  };

  // Add Operational Note
  const handleAddNote = (alertId: string, note: string) => {
    setAlerts((prev) =>
      prev.map((a) => {
        if (a.id !== alertId) return a;
        return {
          ...a,
          notes: [...a.notes, `${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}: ${note}`],
        };
      })
    );
  };

  // Update Status (Acknowledge / Escalate / Resolve)
  const handleUpdateStatus = (alertId: string, status: 'Active' | 'Acknowledged' | 'Escalated' | 'Resolved') => {
    setAlerts((prev) =>
      prev.map((a) => {
        if (a.id !== alertId) return a;
        return {
          ...a,
          status,
          timeline: [
            ...a.timeline,
            {
              timestamp: 'Just now',
              event: `Alert status transitioned to ${status}`,
              actor: 'Authorized Officer',
            },
          ],
        };
      })
    );
  };

  // Dispatch Notification
  const handleDispatchNotification = (alertId: string, summary: string) => {
    setAlerts((prev) =>
      prev.map((a) => {
        if (a.id !== alertId) return a;
        return {
          ...a,
          timeline: [
            ...a.timeline,
            {
              timestamp: 'Just now',
              event: `Notification Broadcast: ${summary}`,
              actor: 'Emergency Broadcast Gateway',
            },
          ],
        };
      })
    );
  };

  // Channel Toggle
  const handleToggleChannelStatus = (channelId: string) => {
    setChannels((prev) =>
      prev.map((c) =>
        c.id === channelId
          ? { ...c, status: c.status === 'Online' ? 'Offline' : 'Online' }
          : c
      )
    );
    if (activeChannelConfig && activeChannelConfig.id === channelId) {
      setActiveChannelConfig((prev) =>
        prev ? { ...prev, status: prev.status === 'Online' ? 'Offline' : 'Online' } : null
      );
    }
  };

  return (
    <div className="w-full h-full p-2 bg-[#02070f] text-slate-100 overflow-hidden select-none">
      {/* ── 3-Column Workspace Matching Target Reference ── */}
      <div className="w-full h-full grid grid-cols-[260px_minmax(0,1fr)_385px] gap-2 min-h-0 overflow-hidden">
        
        {/* ── COLUMN 1: LEFT ALERTS SIDEBAR (260px) ── */}
        <div className="h-full min-h-0 overflow-hidden rounded-lg border border-[#00f0ff]/15 bg-[#030914]">
          <AlertsSidebar
            activeTab={activeSidebarTab}
            onSelectTab={setActiveSidebarTab}
            severityFilter={severityFilter}
            onSelectSeverityFilter={setSeverityFilter}
            alerts={filteredAlerts}
            selectedAlertId={selectedAlertId}
            onSelectAlert={handleSelectAlert}
            channels={channels}
            onOpenChannelConfig={(chan) => setActiveChannelConfig(chan)}
            onOpenViewAll={() => setIsViewAllOpen(true)}
          />
        </div>

        {/* ── COLUMN 2: CENTER WORKSPACE (minmax(0, 1fr)) ── */}
        {activeSidebarTab === 'active' ? (
          <div className="h-full min-h-0 flex flex-col gap-2 overflow-hidden">
            {/* 1. Climate Alert Monitoring Center Toolbar */}
            <div className="shrink-0 rounded-lg border border-[#00f0ff]/15 bg-[#030914] overflow-hidden">
              <AlertsHeader
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                selectedSeverity={severityFilter}
                onSelectSeverity={setSeverityFilter}
                selectedTimeRange={selectedTimeRange}
                onSelectTimeRange={setSelectedTimeRange}
                onOpenIssueModal={() => setIsIssueModalOpen(true)}
              />
            </div>

            {/* 2. Large Telangana Active Alert Map (~57% height) */}
            <div className="flex-[5.7] min-h-0 min-w-0 rounded-lg border border-[#00f0ff]/15 overflow-hidden bg-[#030914]">
              <AlertsMap
                selectedDistrict={currentDistrictName}
                onSelectDistrict={handleSelectDistrict}
                selectedAlertId={selectedAlertId}
                onSelectAlertById={handleSelectAlertById}
                alerts={alerts}
              />
            </div>

            {/* 3. Middle 3 Analytics Cards Row (~24% height) */}
            <div className="flex-[2.4] min-h-0 min-w-0 grid grid-cols-[1.1fr_0.95fr_1fr] gap-2">
              <div className="h-full min-h-0 rounded-lg border border-[#00f0ff]/15 overflow-hidden">
                <AlertTrendChart />
              </div>
              <div className="h-full min-h-0 rounded-lg border border-[#00f0ff]/15 overflow-hidden">
                <RiskByCategory
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                  selectedDistrict={currentDistrictName}
                />
              </div>
              <div className="h-full min-h-0 rounded-lg border border-[#00f0ff]/15 overflow-hidden">
                <DistrictPriorityQueue
                  onSelectDistrict={handleSelectDistrict}
                  onSelectAlertById={handleSelectAlertById}
                  selectedAlertId={selectedAlertId}
                  onOpenViewAll={() => setIsViewAllOpen(true)}
                />
              </div>
            </div>

            {/* 4. Bottom Row: Response Insights & Alert Performance (~19% height) */}
            <div className="flex-[1.9] min-h-0 min-w-0 grid grid-cols-[1.6fr_1fr] gap-2">
              <div className="h-full min-h-0 rounded-lg border border-[#00f0ff]/15 overflow-hidden">
                <ResponseInsights onSelectDistrict={handleSelectDistrict} />
              </div>
              <div className="h-full min-h-0 rounded-lg border border-[#00f0ff]/15 overflow-hidden">
                <AlertPerformance />
              </div>
            </div>
          </div>
        ) : activeSidebarTab === 'early_warnings' ? (
          <div className="h-full min-h-0 rounded-lg border border-[#00f0ff]/15 overflow-hidden">
            <EarlyWarningsView
              onPromoteToAlert={handlePromoteEarlyWarning}
              onSelectDistrict={handleSelectDistrict}
            />
          </div>
        ) : activeSidebarTab === 'risk_zones' ? (
          <div className="h-full min-h-0 rounded-lg border border-[#00f0ff]/15 overflow-hidden">
            <RiskZonesView
              selectedDistrict={currentDistrictName}
              onSelectDistrict={handleSelectDistrict}
              alerts={alerts}
            />
          </div>
        ) : activeSidebarTab === 'rules' ? (
          <div className="h-full min-h-0 rounded-lg border border-[#00f0ff]/15 overflow-hidden">
            <AlertRulesView />
          </div>
        ) : activeSidebarTab === 'contacts' ? (
          <div className="h-full min-h-0 rounded-lg border border-[#00f0ff]/15 overflow-hidden">
            <EmergencyContactsView />
          </div>
        ) : (
          <div className="h-full min-h-0 rounded-lg border border-[#00f0ff]/15 overflow-hidden">
            <AlertHistoryView
              alerts={alerts}
              onSelectAlert={(a) => {
                handleSelectAlert(a);
                setActiveSidebarTab('active');
              }}
            />
          </div>
        )}

        {/* ── COLUMN 3: RIGHT PANEL (385px) ── */}
        <div className="h-full min-h-0 flex flex-col gap-2 overflow-y-auto custom-scrollbar">
          {/* Current Alert Status */}
          <div className="rounded-lg border border-[#00f0ff]/15 bg-[#030914] overflow-hidden shrink-0">
            <CurrentAlertStatusPanel
              selectedDistrict={currentDistrictName}
              selectedAlert={currentSelectedAlert}
              onViewDistrictDetails={() => setActiveTab('ANALYTICS')}
            />
          </div>

          {/* Selected Alert Details */}
          <div className="flex-1 min-h-0 rounded-lg border border-[#00f0ff]/15 bg-[#030914] overflow-hidden flex flex-col">
            <SelectedAlertDetailsPanel
              alert={currentSelectedAlert}
              onOpenSendNotification={() => setIsSendNotificationOpen(true)}
              onOpenResponsePlan={() => setIsResponsePlanOpen(true)}
              onOpenViewAll={() => setIsViewAllOpen(true)}
            />
          </div>
        </div>
      </div>

      {/* ── Modals & Drawers ── */}
      <IssueAlertModal
        isOpen={isIssueModalOpen}
        onClose={() => setIsIssueModalOpen(false)}
        onIssueAlert={handleIssueAlert}
        defaultDistrict={currentDistrictName}
      />

      <SendNotificationModal
        isOpen={isSendNotificationOpen}
        onClose={() => setIsSendNotificationOpen(false)}
        alert={currentSelectedAlert}
        onDispatchNotification={handleDispatchNotification}
      />

      <ResponsePlanDrawer
        isOpen={isResponsePlanOpen}
        onClose={() => setIsResponsePlanOpen(false)}
        alert={currentSelectedAlert}
        onToggleChecklist={handleToggleChecklist}
        onAddNote={handleAddNote}
        onUpdateStatus={handleUpdateStatus}
      />

      <ChannelConfigModal
        isOpen={activeChannelConfig !== null}
        onClose={() => setActiveChannelConfig(null)}
        channel={activeChannelConfig}
        onToggleStatus={handleToggleChannelStatus}
      />

      <ViewAllAlertsModal
        isOpen={isViewAllOpen}
        onClose={() => setIsViewAllOpen(false)}
        alerts={alerts}
        onSelectAlert={handleSelectAlert}
      />
    </div>
  );
};
