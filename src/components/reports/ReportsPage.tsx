import React, { useState, useMemo } from 'react';
import { useClimateStore } from '../../state/useClimateStore';
import { ReportsHeader } from './ReportsHeader';
import { ReportsSidebar } from './ReportsSidebar';
import { ReportPreviewPanel } from './ReportPreviewPanel';
import { ReportConfigurationPanel } from './ReportConfigurationPanel';
import { ExportDeliveryPanel } from './ExportDeliveryPanel';
import { ReportStatisticsRow } from './ReportStatisticsRow';
import { ReportBottomPanels } from './ReportBottomPanels';
import { ReportsAlternativeViews } from './ReportsAlternativeViews';
import {
  ReportSidebarTab,
  ReportType,
  ReportFormat,
  ReportConfigurationState,
  GeneratedReportRecord,
  DistrictReportData
} from '../../types/reports';
import {
  getDistrictReportData,
  fetchLiveDistrictReportData,
  INITIAL_GENERATED_REPORTS
} from '../../services/reportsDataService';
import { downloadReportFile } from '../../services/reportExportService';

export const ReportsPage: React.FC = () => {
  const store = useClimateStore();

  // Navigation & Selection States
  const [activeSidebarTab, setActiveSidebarTab] = useState<ReportSidebarTab>('builder');
  const [reportType, setReportType] = useState<ReportType>('District Climate Summary');
  const [timePeriod, setTimePeriod] = useState<string>('2010 - 2024');
  const [dateRange, setDateRange] = useState<string>('31 Aug 2010 - 31 Dec 2024');
  const [selectedFormat, setSelectedFormat] = useState<ReportFormat>('pdf');
  const [destination, setDestination] = useState<string>('Local Download');
  const [schedule, setSchedule] = useState<string>('No Schedule');
  const [emailRecipients, setEmailRecipients] = useState<string>('');

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(14);

  // Configuration Toggles
  const [reportConfig, setReportConfig] = useState<ReportConfigurationState>({
    includeHistorical: true,
    includePredictions: true,
    includeSimulation: false,
    includeExtremes: true,
    includeComparison: true,
    includeInsights: true,
    includeMapsCharts: true,
    audience: 'Research / Academic',
    template: 'Executive',
    confidentiality: 'Internal Use Only',
  });

  // Generated Files Archive
  const [generatedReports, setGeneratedReports] = useState<GeneratedReportRecord[]>(INITIAL_GENERATED_REPORTS);

  // District Report Data state
  const [reportData, setReportData] = useState<DistrictReportData>(() =>
    getDistrictReportData(store.selectedDistrictId)
  );

  // Fetch live district report data on district change with race-condition guard
  React.useEffect(() => {
    let active = true;
    const currentDistrict = store.selectedDistrictId;

    // Immediately set local fallback so UI updates instantly without blank screen
    setReportData(getDistrictReportData(currentDistrict));

    fetchLiveDistrictReportData(currentDistrict).then((live) => {
      if (active && store.selectedDistrictId === currentDistrict) {
        setReportData(live);
      }
    });

    return () => {
      active = false;
    };
  }, [store.selectedDistrictId]);

  // Dynamic suggested filename: {DistrictName}_Climate_Report_{YYYY-MM-DD}
  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [customFileName, setCustomFileName] = useState<string>(() => `${reportData.name}_Climate_Report_${todayStr}`);

  // Sync filename when district changes
  React.useEffect(() => {
    const formattedDistrict = reportData.name.replace(/\s+/g, '_');
    setCustomFileName(`${formattedDistrict}_Climate_Report_${todayStr}`);
  }, [reportData.name, todayStr]);

  // Handle Generate Report action (Fetches fresh live data & triggers download)
  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      const freshData = await fetchLiveDistrictReportData(store.selectedDistrictId, true);
      setReportData(freshData);

      // Add to generated reports archive
      const newReport: GeneratedReportRecord = {
        id: `gr-${Date.now()}`,
        name: customFileName,
        district: freshData.name,
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        type: selectedFormat.toUpperCase() as any,
        status: 'Ready',
        size: selectedFormat === 'pdf' ? '4.8 MB' : selectedFormat === 'ppt' ? '12.4 MB' : '2.1 MB',
        pages: 14,
      };

      setGeneratedReports(prev => [newReport, ...prev]);

      // Download report with latest live data
      downloadReportFile(freshData, selectedFormat, customFileName, reportConfig);
    } catch (err) {
      console.error('Error generating live report:', err);
      downloadReportFile(reportData, selectedFormat, customFileName, reportConfig);
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle Export / Download action
  const handleExport = async () => {
    setIsGenerating(true);
    try {
      const freshData = await fetchLiveDistrictReportData(store.selectedDistrictId, false);
      setReportData(freshData);
      downloadReportFile(freshData, selectedFormat, customFileName, reportConfig);
    } catch (e) {
      downloadReportFile(reportData, selectedFormat, customFileName, reportConfig);
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle Quick Action
  const handleQuickAction = (action: 'email' | 'share' | 'download') => {
    if (action === 'download') {
      handleExport();
    } else if (action === 'email') {
      if (!emailRecipients.trim()) {
        alert('Please enter recipient email addresses to dispatch report.');
      } else {
        alert(`Climate Report dispatched successfully to: ${emailRecipients}`);
      }
    } else if (action === 'share') {
      navigator.clipboard?.writeText(window.location.href);
      alert('Secure report reference link copied to clipboard!');
    }
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col w-full h-full bg-[#050C14] text-slate-100 font-sans select-none overflow-hidden">
      {/* ── Subheader below global navigation ── */}
      <ReportsHeader
        reportType={reportType}
        onSelectReportType={setReportType}
        selectedDistrictId={store.selectedDistrictId}
        onSelectDistrict={store.setSelectedDistrictId}
        timePeriod={timePeriod}
        onSelectTimePeriod={setTimePeriod}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        selectedFormat={selectedFormat}
        onSelectFormat={setSelectedFormat}
        onAutoInsights={() => alert('Auto Insights compiled 18 new climate anomalies across Telangana.')}
        onGenerateReport={handleGenerateReport}
        isGenerating={isGenerating}
      />

      {/* ── Main Layout: Sidebar (16.6%) + Content Area (83.4%) ── */}
      <div className="flex-1 min-h-0 flex overflow-hidden w-full">
        {/* Left Sidebar */}
        <div className="flex-[0_0_16.6%] min-w-0 h-full overflow-hidden">
          <ReportsSidebar
            activeTab={activeSidebarTab}
            onSelectTab={setActiveSidebarTab}
            onSelectQuickReport={(type) => {
              setReportType(type);
              setActiveSidebarTab('builder');
            }}
            recentReports={generatedReports}
            onSelectRecentReport={(rep) => {
              const matched = rep.district.toLowerCase();
              store.setSelectedDistrictId(matched);
              setActiveSidebarTab('builder');
            }}
            onViewAllRecent={() => setActiveSidebarTab('generated')}
          />
        </div>

        {/* Central Workspace */}
        <div className="flex-1 min-w-0 h-full overflow-hidden flex flex-col p-1.5 gap-1.5 custom-scrollbar">
          {activeSidebarTab === 'builder' ? (
            <>
              {/* ══════════════════════════════════════════════════════
                  UPPER WORKSPACE: PREVIEW (54%) + CONFIG (21%) + EXPORT (25%)
                 ══════════════════════════════════════════════════════ */}
              <div className="flex-[5.8] min-h-[380px] flex gap-1.5 shrink-0 overflow-hidden">
                {/* 1. Report Preview Centerpiece (~54%) */}
                <div className="flex-[5.4] min-w-0 h-full overflow-hidden">
                  <ReportPreviewPanel
                    data={reportData}
                    config={reportConfig}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>

                {/* 2. Report Configuration (~21%) */}
                <div className="flex-[2.1] min-w-0 h-full overflow-hidden">
                  <ReportConfigurationPanel
                    config={reportConfig}
                    onChangeConfig={setReportConfig}
                  />
                </div>

                {/* 3. Export & Delivery (~25%) */}
                <div className="flex-[2.5] min-w-0 h-full overflow-hidden">
                  <ExportDeliveryPanel
                    selectedFormat={selectedFormat}
                    onSelectFormat={setSelectedFormat}
                    fileName={customFileName}
                    onFileNameChange={setCustomFileName}
                    destination={destination}
                    onDestinationChange={setDestination}
                    schedule={schedule}
                    onScheduleChange={setSchedule}
                    emailRecipients={emailRecipients}
                    onEmailChange={setEmailRecipients}
                    onExport={handleExport}
                    onQuickAction={handleQuickAction}
                    data={reportData}
                    isGenerating={isGenerating}
                  />
                </div>
              </div>

              {/* ══════════════════════════════════════════════════════
                  STATISTICS ROW: 5 COMPACT METRIC CARDS
                 ══════════════════════════════════════════════════════ */}
              <ReportStatisticsRow />

              {/* ══════════════════════════════════════════════════════
                  LOWER INFORMATION PANELS (5 PANELS ROW)
                 ══════════════════════════════════════════════════════ */}
              <ReportBottomPanels
                data={reportData}
                generatedFiles={generatedReports}
                onSelectFile={(f) => {
                  store.setSelectedDistrictId(f.district.toLowerCase());
                }}
                onViewAllFindings={() => alert('Displaying all 14 computed district findings.')}
                onViewAllVisuals={() => alert('Displaying high-resolution visual catalog.')}
                onViewAllFiles={() => setActiveSidebarTab('generated')}
              />
            </>
          ) : (
            <ReportsAlternativeViews
              activeTab={activeSidebarTab}
              onUseTemplate={(t) => {
                setReportConfig(prev => ({ ...prev, template: t as any }));
                setActiveSidebarTab('builder');
              }}
              onDownloadFile={(name, type) => {
                handleExport();
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
