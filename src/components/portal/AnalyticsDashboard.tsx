import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Download,
  FileText,
  FileSpreadsheet,
  SlidersHorizontal,
  X,
  Check,
  Users,
  DollarSign,
  ShieldCheck,
  ShieldAlert,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Briefcase,
  Layers,
} from 'lucide-react';
import { RegionalSelector } from './RegionalSelector';
import { COUNTRY_TO_REGION, REGIONAL_HUBS } from '../../data/mockData';
import { RegionId, RegionalHubNode } from '../../types';
import {
  AnalyticsExportPayload,
  ExportSectionsConfig,
  generateAnalyticsCsvBlob,
  generateAnalyticsPdfBlob,
  triggerBlobDownload,
} from '../../utils/analyticsExport';

type MapLayerMode = 'headcount' | 'payroll' | 'compliance';

export const AnalyticsDashboard: React.FC = () => {
  const {
    employees,
    payrollRecords,
    jobs,
    candidates,
    organizations,
    complianceRisks,
    resolveComplianceRisk,
    selectedOrgIdFilter,
    selectedRegion,
    setSelectedRegion,
  } = useApp();

  const [dateRange, setDateRange] = useState('Q3 2026');
  const [activeLayer, setActiveLayer] = useState<MapLayerMode>('headcount');
  const [focusedHubId, setFocusedHubId] = useState<string>('hub_sf');
  const [riskSeverityFilter, setRiskSeverityFilter] = useState<'ALL' | 'High' | 'Moderate' | 'Low'>('ALL');

  // Global Export Modal & Feedback State
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<'pdf' | 'csv'>('pdf');
  const [exportSections, setExportSections] = useState<ExportSectionsConfig>({
    kpiSummary: true,
    regionalMatrix: true,
    departmentAndPerformance: true,
    complianceLedger: true,
    employeePayrollRoster: true,
  });
  const [exportSuccessBanner, setExportSuccessBanner] = useState<string | null>(null);

  // Organization -> Region lookup
  const orgRegionMap = useMemo(() => {
    const map: Record<string, Exclude<RegionId, 'all'>> = {};
    organizations.forEach((org) => {
      map[org.id] = COUNTRY_TO_REGION[org.country] || 'North America';
    });
    return map;
  }, [organizations]);

  // Organization -> Country lookup
  const orgCountryMap = useMemo(() => {
    const map: Record<string, string> = {};
    organizations.forEach((org) => {
      map[org.id] = org.country;
    });
    return map;
  }, [organizations]);

  const organizationScopeLabel = useMemo(() => {
    if (selectedOrgIdFilter === 'all') return 'All Client Organizations';
    const found = organizations.find((o) => o.id === selectedOrgIdFilter);
    return found ? found.name : selectedOrgIdFilter;
  }, [organizations, selectedOrgIdFilter]);

  // Filtered datasets based on both selectedOrgIdFilter and selectedRegion
  const filteredEmployees = useMemo(() => {
    return employees.filter((e) => {
      const matchesOrg = selectedOrgIdFilter === 'all' || e.organizationId === selectedOrgIdFilter;
      const empRegion = orgRegionMap[e.organizationId] || 'North America';
      const matchesRegion = selectedRegion === 'all' || empRegion === selectedRegion;
      return matchesOrg && matchesRegion;
    });
  }, [employees, selectedOrgIdFilter, selectedRegion, orgRegionMap]);

  const filteredPayroll = useMemo(() => {
    return payrollRecords.filter((p) => {
      const matchesOrg = selectedOrgIdFilter === 'all' || p.organizationId === selectedOrgIdFilter;
      const payRegion = orgRegionMap[p.organizationId] || 'North America';
      const matchesRegion = selectedRegion === 'all' || payRegion === selectedRegion;
      return matchesOrg && matchesRegion;
    });
  }, [payrollRecords, selectedOrgIdFilter, selectedRegion, orgRegionMap]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((j) => {
      const matchesOrg = selectedOrgIdFilter === 'all' || j.organizationId === selectedOrgIdFilter;
      const jobRegion = orgRegionMap[j.organizationId] || 'North America';
      const matchesRegion = selectedRegion === 'all' || jobRegion === selectedRegion;
      return matchesOrg && matchesRegion;
    });
  }, [jobs, selectedOrgIdFilter, selectedRegion, orgRegionMap]);

  const filteredCandidates = useMemo(() => {
    return candidates.filter((c) => {
      const matchesOrg = selectedOrgIdFilter === 'all' || c.organizationId === selectedOrgIdFilter;
      const candRegion = orgRegionMap[c.organizationId] || 'North America';
      const matchesRegion = selectedRegion === 'all' || candRegion === selectedRegion;
      return matchesOrg && matchesRegion;
    });
  }, [candidates, selectedOrgIdFilter, selectedRegion, orgRegionMap]);

  const filteredRisks = useMemo(() => {
    return complianceRisks.filter((r) => {
      const matchesOrg = selectedOrgIdFilter === 'all' || r.organizationId === selectedOrgIdFilter;
      const matchesRegion = selectedRegion === 'all' || r.region === selectedRegion;
      const matchesSeverity = riskSeverityFilter === 'ALL' || r.severity === riskSeverityFilter;
      return matchesOrg && matchesRegion && matchesSeverity;
    });
  }, [complianceRisks, selectedOrgIdFilter, selectedRegion, riskSeverityFilter]);

  const regionScopedRisks = useMemo(() => {
    return complianceRisks.filter((r) => {
      const matchesOrg = selectedOrgIdFilter === 'all' || r.organizationId === selectedOrgIdFilter;
      const matchesRegion = selectedRegion === 'all' || r.region === selectedRegion;
      return matchesOrg && matchesRegion;
    });
  }, [complianceRisks, selectedOrgIdFilter, selectedRegion]);

  // Aggregate financial & compliance metrics for the active region
  const dateMultiplier = dateRange === 'Full Year 2026' ? 12 : dateRange === 'Q2 2026' ? 3 : 1;
  const periodLabel = dateRange === 'Full Year 2026' ? 'Annualized' : dateRange === 'Q2 2026' ? 'Quarterly' : 'Monthly';

  const monthlyGrossPayroll = useMemo(
    () => filteredPayroll.reduce((sum, r) => sum + r.grossSalary, 0),
    [filteredPayroll]
  );
  const monthlyTaxAndDeductions = useMemo(
    () => filteredPayroll.reduce((sum, r) => sum + r.totalDeductions, 0),
    [filteredPayroll]
  );
  const monthlyNetPayroll = useMemo(
    () => filteredPayroll.reduce((sum, r) => sum + r.netSalary, 0),
    [filteredPayroll]
  );

  const avgCostPerEmployee =
    filteredEmployees.length > 0 ? Math.round(monthlyGrossPayroll / filteredEmployees.length) : 0;

  const avgComplianceScore =
    regionScopedRisks.length > 0
      ? Math.round(regionScopedRisks.reduce((sum, r) => sum + r.complianceScore, 0) / regionScopedRisks.length)
      : 100;

  const totalFinancialExposure = useMemo(
    () => regionScopedRisks.reduce((sum, r) => sum + r.financialExposure, 0),
    [regionScopedRisks]
  );

  const openActionRisksCount = useMemo(
    () => regionScopedRisks.filter((r) => r.status !== 'Compliant').length,
    [regionScopedRisks]
  );

  const avgPerformanceScore =
    filteredEmployees.length > 0
      ? (filteredEmployees.reduce((sum, e) => sum + e.performanceScore, 0) / filteredEmployees.length).toFixed(2)
      : '0.00';

  // Per-Hub computed metrics for the interactive SVG map
  const enrichedHubs = useMemo(() => {
    return REGIONAL_HUBS.map((hub) => {
      const hubEmployees = employees.filter(
        (e) =>
          (selectedOrgIdFilter === 'all' || e.organizationId === selectedOrgIdFilter) &&
          orgCountryMap[e.organizationId] === hub.country
      );
      const hubPayroll = payrollRecords.filter(
        (p) =>
          (selectedOrgIdFilter === 'all' || p.organizationId === selectedOrgIdFilter) &&
          orgCountryMap[p.organizationId] === hub.country
      );
      const hubRisks = complianceRisks.filter(
        (r) =>
          (selectedOrgIdFilter === 'all' || r.organizationId === selectedOrgIdFilter) &&
          r.country === hub.country
      );

      const grossPay = hubPayroll.reduce((s, p) => s + p.grossSalary, 0);
      const compScore =
        hubRisks.length > 0
          ? Math.round(hubRisks.reduce((s, r) => s + r.complianceScore, 0) / hubRisks.length)
          : 100;
      const highestSeverity = hubRisks.some((r) => r.severity === 'High' && r.status !== 'Compliant')
        ? 'High'
        : hubRisks.some((r) => r.severity === 'Moderate' && r.status !== 'Compliant')
        ? 'Moderate'
        : 'Low';
      const exposure = hubRisks.reduce((s, r) => s + r.financialExposure, 0);

      return {
        ...hub,
        headcount: hubEmployees.length,
        monthlyPayroll: grossPay,
        complianceScore: compScore,
        highestSeverity,
        exposure,
      };
    });
  }, [employees, payrollRecords, complianceRisks, orgCountryMap, selectedOrgIdFilter]);

  const activeFocusedHub = useMemo(() => {
    const matchingInRegion =
      selectedRegion !== 'all'
        ? enrichedHubs.find((h) => h.region === selectedRegion && h.id === focusedHubId) ||
          enrichedHubs.find((h) => h.region === selectedRegion)
        : enrichedHubs.find((h) => h.id === focusedHubId);
    return matchingInRegion || enrichedHubs[0];
  }, [enrichedHubs, focusedHubId, selectedRegion]);

  // Regional Matrix Breakdown (4 Regions)
  const regionalBreakdownRows = useMemo(() => {
    const regions: Exclude<RegionId, 'all'>[] = [
      'North America',
      'Europe & UK',
      'Asia-Pacific',
      'Middle East & Africa',
    ];
    return regions.map((reg) => {
      const regEmps = employees.filter(
        (e) =>
          (selectedOrgIdFilter === 'all' || e.organizationId === selectedOrgIdFilter) &&
          orgRegionMap[e.organizationId] === reg
      );
      const regPay = payrollRecords.filter(
        (p) =>
          (selectedOrgIdFilter === 'all' || p.organizationId === selectedOrgIdFilter) &&
          orgRegionMap[p.organizationId] === reg
      );
      const regRisks = complianceRisks.filter(
        (r) =>
          (selectedOrgIdFilter === 'all' || r.organizationId === selectedOrgIdFilter) &&
          r.region === reg
      );
      const gross = regPay.reduce((s, p) => s + p.grossSalary, 0);
      const deductions = regPay.reduce((s, p) => s + p.totalDeductions, 0);
      const score =
        regRisks.length > 0
          ? Math.round(regRisks.reduce((s, r) => s + r.complianceScore, 0) / regRisks.length)
          : 100;
      const riskLevel = regRisks.some((r) => r.severity === 'High' && r.status !== 'Compliant')
        ? 'High'
        : regRisks.some((r) => r.severity === 'Moderate' && r.status !== 'Compliant')
        ? 'Moderate'
        : 'Low';

      return {
        region: reg,
        headcount: regEmps.length,
        grossPayroll: gross,
        deductions,
        avgCost: regEmps.length > 0 ? Math.round(gross / regEmps.length) : 0,
        complianceScore: score,
        riskLevel,
      };
    });
  }, [employees, payrollRecords, complianceRisks, orgRegionMap, selectedOrgIdFilter]);

  const deptCounts: Record<string, number> = {
    Engineering: filteredEmployees.filter((e) => e.department === 'Engineering').length,
    'Product & Design': filteredEmployees.filter((e) => e.department === 'Product & Design').length,
    'Sales & BD': filteredEmployees.filter((e) => e.department === 'Sales & BD').length,
    'Customer Success': filteredEmployees.filter((e) => e.department === 'Customer Success').length,
    Operations: filteredEmployees.filter((e) => e.department === 'Operations').length,
  };

  const performanceBands: Record<string, number> = {
    'Top Tier (4.8 - 5.0)': filteredEmployees.filter((e) => e.performanceScore >= 4.8).length,
    'High Performers (4.5 - 4.7)': filteredEmployees.filter(
      (e) => e.performanceScore >= 4.5 && e.performanceScore < 4.8
    ).length,
    'Solid Contributors (4.0 - 4.4)': filteredEmployees.filter(
      (e) => e.performanceScore >= 4.0 && e.performanceScore < 4.5
    ).length,
    'Development Stage (< 4.0)': filteredEmployees.filter((e) => e.performanceScore < 4.0).length,
  };

  const handleHubClick = (hub: RegionalHubNode) => {
    setFocusedHubId(hub.id);
    if (selectedRegion === hub.region && focusedHubId === hub.id) {
      setSelectedRegion('all');
    } else {
      setSelectedRegion(hub.region);
    }
  };

  const buildExportPayload = (sectionsOverride?: ExportSectionsConfig): AnalyticsExportPayload => ({
    organizationScopeLabel,
    selectedRegion,
    dateRange,
    periodLabel,
    dateMultiplier,
    riskSeverityFilter,
    metrics: {
      activeHeadcount: filteredEmployees.length,
      openRequisitions: filteredJobs.length,
      activeCandidates: filteredCandidates.length,
      periodGrossPayroll: monthlyGrossPayroll * dateMultiplier,
      periodTaxAndDeductions: monthlyTaxAndDeductions * dateMultiplier,
      periodNetPayroll: monthlyNetPayroll * dateMultiplier,
      avgCostPerEmployee,
      avgComplianceScore,
      totalFinancialExposure,
      openActionRisksCount,
      avgPerformanceScore,
    },
    deptCounts,
    performanceBands,
    regionalBreakdownRows,
    filteredEmployees,
    filteredPayroll,
    filteredJobs,
    filteredCandidates,
    filteredRisks,
    sections: sectionsOverride || exportSections,
  });

  const handleTriggerExport = (format: 'pdf' | 'csv', customSections?: ExportSectionsConfig) => {
    const payload = buildExportPayload(customSections);
    const regionSlug =
      selectedRegion === 'all' ? 'Global' : selectedRegion.replace(/[^a-zA-Z0-9]/g, '_');
    const periodSlug = dateRange.replace(/\s+/g, '_');
    const filename = `Accounticca_HR_Analytics_${regionSlug}_${periodSlug}.${format}`;

    if (format === 'pdf') {
      const pdfBlob = generateAnalyticsPdfBlob(payload);
      triggerBlobDownload(pdfBlob, filename);
    } else {
      const csvBlob = generateAnalyticsCsvBlob(payload);
      triggerBlobDownload(csvBlob, filename);
    }

    setExportSuccessBanner(
      `Exported ${format.toUpperCase()} report (${filename}) for ${
        selectedRegion === 'all' ? 'Global Operations' : selectedRegion
      }.`
    );
    setExportModalOpen(false);
    setTimeout(() => {
      setExportSuccessBanner((prev) => (prev && prev.includes(filename) ? null : prev));
    }, 5000);
  };

  const toggleSectionKey = (key: keyof ExportSectionsConfig) => {
    setExportSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-serif tracking-tight">
            Executive HR Analytics & Geospatial Intelligence
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Multi-jurisdiction workforce distribution, regional payroll cost modeling, and statutory compliance risk telemetry
          </p>
        </div>

        {/* Global Period & Export Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            aria-label="Reporting Period"
            className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-medium"
          >
            <option value="Q3 2026">Q3 2026 (Current Monthly Run)</option>
            <option value="Q2 2026">Q2 2026 (Quarterly Aggregate)</option>
            <option value="Full Year 2026">Full Year 2026 (Annualized Run-Rate)</option>
          </select>

          {/* Direct One-Click PDF Export */}
          <button
            type="button"
            onClick={() => handleTriggerExport('pdf')}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Export PDF</span>
          </button>

          {/* Direct One-Click CSV Export */}
          <button
            type="button"
            onClick={() => handleTriggerExport('csv')}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          {/* Custom Export Builder Modal Trigger */}
          <button
            type="button"
            onClick={() => setExportModalOpen(true)}
            className="px-3 py-2 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Configure custom PDF or CSV export sections"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600 dark:text-teal-400" />
            <span>Report Builder</span>
          </button>
        </div>
      </div>

      {/* Export Confirmation Banner */}
      {exportSuccessBanner && (
        <div className="px-4 py-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 flex items-center justify-between gap-3 text-xs text-emerald-800 dark:text-emerald-200">
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{exportSuccessBanner}</span>
          </div>
          <button
            type="button"
            onClick={() => setExportSuccessBanner(null)}
            className="text-emerald-700 dark:text-emerald-300 hover:opacity-75"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* RegionalSelector Component */}
      <RegionalSelector selectedRegion={selectedRegion} onSelectRegion={setSelectedRegion} />

      {/* Primary Region-Filtered KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span>Active Headcount</span>
            <Users className="w-3.5 h-3.5 text-blue-600 dark:text-teal-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono tabular-nums mt-1.5">
            {filteredEmployees.length} <span className="text-xs font-sans font-normal text-slate-500">Staff</span>
          </div>
          <div className="text-[11px] text-teal-600 dark:text-teal-400 mt-1 font-mono tabular-nums">
            {filteredJobs.length} Open Req · {filteredCandidates.length} ATS
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span>{periodLabel} Payroll</span>
            <DollarSign className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono tabular-nums mt-1.5">
            BDT {(monthlyGrossPayroll * dateMultiplier).toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-mono tabular-nums">
            Avg BDT {avgCostPerEmployee.toLocaleString()}/mo per staff
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span>Tax & PF Withheld</span>
            <Briefcase className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 font-mono tabular-nums mt-1.5">
            BDT {(monthlyTaxAndDeductions * dateMultiplier).toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-mono tabular-nums">
            Net: BDT {(monthlyNetPayroll * dateMultiplier).toLocaleString()}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span>Compliance Index</span>
            {avgComplianceScore >= 95 ? (
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            )}
          </div>
          <div
            className={`text-2xl font-bold font-mono tabular-nums mt-1.5 ${
              avgComplianceScore >= 95
                ? 'text-emerald-600 dark:text-emerald-400'
                : avgComplianceScore >= 90
                ? 'text-amber-600 dark:text-amber-400'
                : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {avgComplianceScore}%
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-mono tabular-nums">
            {openActionRisksCount === 0 ? 'Zero Open Deficiencies' : `${openActionRisksCount} Audit Action(s)`}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span>Risk Exposure</span>
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono tabular-nums mt-1.5">
            BDT {totalFinancialExposure.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Statutory variance reserve
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span>Avg Review Score</span>
            <Layers className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
          </div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 font-mono tabular-nums mt-1.5">
            {avgPerformanceScore} <span className="text-xs font-sans font-normal text-slate-500">/ 5.0</span>
          </div>
          <div className="text-[11px] text-teal-600 dark:text-teal-400 mt-1">
            Regional OKR Velocity
          </div>
        </div>
      </div>

      {/* GEOGRAPHIC VISUALIZATION LAYER */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Layer Control Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-teal-300 border border-blue-200/60 dark:border-blue-800/60">
                Geospatial Telemetry Layer
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                {selectedRegion === 'all' ? '5 Active Global Hubs' : `Filtered: ${selectedRegion}`}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-serif mt-1">
              Global Workforce, Payroll Cost & Statutory Risk Map
            </h3>
          </div>

          {/* Metric Layer Switcher */}
          <div className="inline-flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setActiveLayer('headcount')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeLayer === 'headcount'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-teal-400 font-semibold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Headcount Density</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveLayer('payroll')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeLayer === 'payroll'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 font-semibold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Payroll Costs</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveLayer('compliance')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeLayer === 'compliance'
                  ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 font-semibold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Compliance Risks</span>
            </button>
          </div>
        </div>

        {/* Map Canvas + Focused Hub Telemetry Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Interactive SVG Map (8 cols) */}
          <div className="lg:col-span-8 p-4 sm:p-6 bg-slate-50/70 dark:bg-slate-950/60 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between">
            <div className="relative w-full overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800/90 bg-slate-100/80 dark:bg-slate-900/90">
              <svg
                viewBox="0 0 1000 440"
                className="w-full h-[280px] sm:h-[340px] select-none"
                role="img"
                aria-label="Global HR Operations Map"
              >
                <defs>
                  <pattern id="geo-grid" width="50" height="50" patternUnits="userSpaceOnUse">
                    <path
                      d="M 50 0 L 0 0 0 50"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="0.6"
                      className="text-slate-300/60 dark:text-slate-800/80"
                    />
                  </pattern>
                </defs>

                {/* Subtle Coordinate Grid */}
                <rect width="1000" height="440" fill="url(#geo-grid)" />

                {/* Equator & Tropics Reference Lines */}
                <line
                  x1="0"
                  y1="240"
                  x2="1000"
                  y2="240"
                  stroke="currentColor"
                  strokeDasharray="4 4"
                  strokeWidth="0.8"
                  className="text-slate-300 dark:text-slate-800"
                />
                <line
                  x1="0"
                  y1="150"
                  x2="1000"
                  y2="150"
                  stroke="currentColor"
                  strokeDasharray="2 6"
                  strokeWidth="0.6"
                  className="text-slate-300/70 dark:text-slate-800/70"
                />

                {/* Stylized Continental Silhouettes */}
                {/* North America */}
                <path
                  d="M 75 75 L 245 65 L 310 130 L 265 215 L 205 245 L 155 210 L 110 155 Z"
                  onClick={() => setSelectedRegion(selectedRegion === 'North America' ? 'all' : 'North America')}
                  className={`cursor-pointer transition-colors duration-300 ${
                    selectedRegion === 'North America'
                      ? 'fill-blue-200/80 dark:fill-teal-900/50 stroke-blue-500 dark:stroke-teal-400'
                      : 'fill-slate-300/70 dark:fill-slate-800/90 stroke-slate-400/50 dark:stroke-slate-700 hover:fill-slate-300 dark:hover:fill-slate-800'
                  }`}
                  strokeWidth="1.5"
                />
                {/* South America */}
                <path
                  d="M 235 260 L 315 275 L 340 345 L 285 415 L 245 390 L 225 310 Z"
                  className="fill-slate-200/80 dark:fill-slate-800/50 stroke-slate-300 dark:stroke-slate-800"
                  strokeWidth="1"
                />
                {/* Europe & UK */}
                <path
                  d="M 435 80 L 575 70 L 595 155 L 535 180 L 450 175 L 425 130 Z"
                  onClick={() => setSelectedRegion(selectedRegion === 'Europe & UK' ? 'all' : 'Europe & UK')}
                  className={`cursor-pointer transition-colors duration-300 ${
                    selectedRegion === 'Europe & UK'
                      ? 'fill-blue-200/80 dark:fill-teal-900/50 stroke-blue-500 dark:stroke-teal-400'
                      : 'fill-slate-300/70 dark:fill-slate-800/90 stroke-slate-400/50 dark:stroke-slate-700 hover:fill-slate-300 dark:hover:fill-slate-800'
                  }`}
                  strokeWidth="1.5"
                />
                {/* Middle East & Africa */}
                <path
                  d="M 455 195 L 655 190 L 680 255 L 615 385 L 520 390 L 475 305 L 445 245 Z"
                  onClick={() =>
                    setSelectedRegion(selectedRegion === 'Middle East & Africa' ? 'all' : 'Middle East & Africa')
                  }
                  className={`cursor-pointer transition-colors duration-300 ${
                    selectedRegion === 'Middle East & Africa'
                      ? 'fill-blue-200/80 dark:fill-teal-900/50 stroke-blue-500 dark:stroke-teal-400'
                      : 'fill-slate-300/70 dark:fill-slate-800/90 stroke-slate-400/50 dark:stroke-slate-700 hover:fill-slate-300 dark:hover:fill-slate-800'
                  }`}
                  strokeWidth="1.5"
                />
                {/* Asia-Pacific */}
                <path
                  d="M 610 85 L 875 95 L 910 215 L 845 315 L 735 310 L 665 225 L 605 160 Z"
                  onClick={() => setSelectedRegion(selectedRegion === 'Asia-Pacific' ? 'all' : 'Asia-Pacific')}
                  className={`cursor-pointer transition-colors duration-300 ${
                    selectedRegion === 'Asia-Pacific'
                      ? 'fill-blue-200/80 dark:fill-teal-900/50 stroke-blue-500 dark:stroke-teal-400'
                      : 'fill-slate-300/70 dark:fill-slate-800/90 stroke-slate-400/50 dark:stroke-slate-700 hover:fill-slate-300 dark:hover:fill-slate-800'
                  }`}
                  strokeWidth="1.5"
                />
                {/* Oceania / Australia */}
                <path
                  d="M 770 335 L 895 330 L 910 395 L 805 405 Z"
                  onClick={() => setSelectedRegion(selectedRegion === 'Asia-Pacific' ? 'all' : 'Asia-Pacific')}
                  className={`cursor-pointer transition-colors duration-300 ${
                    selectedRegion === 'Asia-Pacific'
                      ? 'fill-blue-200/80 dark:fill-teal-900/50 stroke-blue-500 dark:stroke-teal-400'
                      : 'fill-slate-300/70 dark:fill-slate-800/90 stroke-slate-400/50 dark:stroke-slate-700'
                  }`}
                  strokeWidth="1.2"
                />

                {/* Inter-Hub Network Arcs */}
                <path
                  d="M 185 175 Q 330 95 472 136"
                  fill="none"
                  stroke="currentColor"
                  strokeDasharray="3 3"
                  strokeWidth="1.2"
                  className="text-blue-400/60 dark:text-teal-500/40"
                />
                <path
                  d="M 472 136 Q 560 165 632 222"
                  fill="none"
                  stroke="currentColor"
                  strokeDasharray="3 3"
                  strokeWidth="1.2"
                  className="text-blue-400/60 dark:text-teal-500/40"
                />
                <path
                  d="M 632 222 Q 705 255 775 282"
                  fill="none"
                  stroke="currentColor"
                  strokeDasharray="3 3"
                  strokeWidth="1.2"
                  className="text-blue-400/60 dark:text-teal-500/40"
                />

                {/* Region Watermark Labels */}
                <text
                  x="130"
                  y="110"
                  className="fill-slate-500/70 dark:fill-slate-400/60 text-[10px] font-mono uppercase tracking-widest pointer-events-none"
                >
                  NORTH AMERICA
                </text>
                <text
                  x="460"
                  y="105"
                  className="fill-slate-500/70 dark:fill-slate-400/60 text-[10px] font-mono uppercase tracking-widest pointer-events-none"
                >
                  EUROPE & UK
                </text>
                <text
                  x="515"
                  y="285"
                  className="fill-slate-500/70 dark:fill-slate-400/60 text-[10px] font-mono uppercase tracking-widest pointer-events-none"
                >
                  MEA
                </text>
                <text
                  x="715"
                  y="155"
                  className="fill-slate-500/70 dark:fill-slate-400/60 text-[10px] font-mono uppercase tracking-widest pointer-events-none"
                >
                  ASIA-PACIFIC
                </text>

                {/* Interactive Regional Hub Nodes */}
                {enrichedHubs.map((hub) => {
                  const isRegionSelected = selectedRegion === 'all' || selectedRegion === hub.region;
                  const isFocused = activeFocusedHub?.id === hub.id;

                  // Calculate node radius based on active layer
                  const radius =
                    activeLayer === 'headcount'
                      ? Math.max(10, hub.headcount * 3.2)
                      : activeLayer === 'payroll'
                      ? Math.max(10, Math.round(hub.monthlyPayroll / 3200))
                      : hub.highestSeverity === 'High'
                      ? 18
                      : hub.highestSeverity === 'Moderate'
                      ? 14
                      : 11;

                  // Determine color based on active layer
                  const circleColorClass =
                    activeLayer === 'compliance'
                      ? hub.highestSeverity === 'High'
                        ? 'fill-rose-500/30 stroke-rose-500 dark:fill-rose-500/30 dark:stroke-rose-400'
                        : hub.highestSeverity === 'Moderate'
                        ? 'fill-amber-500/30 stroke-amber-500 dark:fill-amber-500/30 dark:stroke-amber-400'
                        : 'fill-emerald-500/30 stroke-emerald-600 dark:fill-emerald-500/30 dark:stroke-emerald-400'
                      : activeLayer === 'payroll'
                      ? 'fill-emerald-500/25 stroke-emerald-600 dark:fill-emerald-500/30 dark:stroke-emerald-400'
                      : 'fill-blue-500/25 stroke-blue-600 dark:fill-teal-400/25 dark:stroke-teal-400';

                  const badgeText =
                    activeLayer === 'headcount'
                      ? `${hub.headcount} Staff`
                      : activeLayer === 'payroll'
                      ? `BDT ${Math.round((hub.monthlyPayroll * dateMultiplier) / 1000)}k`
                      : `${hub.complianceScore}% (${hub.highestSeverity})`;

                  return (
                    <g
                      key={hub.id}
                      transform={`translate(${hub.coordinates.x}, ${hub.coordinates.y})`}
                      onClick={() => handleHubClick(hub)}
                      className={`cursor-pointer transition-opacity duration-200 ${
                        isRegionSelected ? 'opacity-100' : 'opacity-35 hover:opacity-80'
                      }`}
                    >
                      {/* Outer Proportional Halo */}
                      <circle
                        r={radius + (isFocused ? 5 : 0)}
                        className={`${circleColorClass} transition-all duration-300`}
                        strokeWidth={isFocused ? 2.5 : 1.5}
                      />

                      {/* Inner Core Pin */}
                      <circle
                        r={5}
                        className={
                          activeLayer === 'compliance' && hub.highestSeverity === 'High'
                            ? 'fill-rose-600 dark:fill-rose-400'
                            : activeLayer === 'compliance' && hub.highestSeverity === 'Moderate'
                            ? 'fill-amber-500 dark:fill-amber-400'
                            : activeLayer === 'payroll'
                            ? 'fill-emerald-600 dark:fill-emerald-400'
                            : 'fill-blue-600 dark:fill-teal-400'
                        }
                      />

                      {/* Hub Callout Pill */}
                      <g transform="translate(0, -24)">
                        <rect
                          x="-58"
                          y="-14"
                          width="116"
                          height="20"
                          rx="5"
                          className={`${
                            isFocused
                              ? 'fill-slate-900 dark:fill-white stroke-blue-500 dark:stroke-teal-400'
                              : 'fill-white/95 dark:fill-slate-900/95 stroke-slate-300 dark:stroke-slate-700'
                          }`}
                          strokeWidth="1"
                        />
                        <text
                          x="0"
                          y="-1"
                          textAnchor="middle"
                          className={`text-[9.5px] font-mono font-bold ${
                            isFocused
                              ? 'fill-white dark:fill-slate-900'
                              : 'fill-slate-800 dark:fill-slate-200'
                          }`}
                        >
                          {hub.city.split(',')[0]} · {badgeText}
                        </text>
                      </g>
                    </g>
                  );
                })}
              </svg>

              {/* Map Legend Bar */}
              <div className="px-4 py-2.5 bg-white/90 dark:bg-slate-900/90 border-t border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    Active Layer:{' '}
                    {activeLayer === 'headcount'
                      ? 'Workforce Headcount'
                      : activeLayer === 'payroll'
                      ? `${periodLabel} Gross Payroll`
                      : 'Statutory Risk Severity'}
                  </span>
                  {activeLayer === 'compliance' && (
                    <div className="flex items-center gap-3 font-mono text-[10px]">
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Low Risk
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> Moderate Audit
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" /> High Action Req
                      </span>
                    </div>
                  )}
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Click any regional hub or continent to filter dashboard metrics
                </span>
              </div>
            </div>

            {/* Quick Hub Selector Pills */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mr-1">
                Operating Hubs:
              </span>
              {enrichedHubs.map((hub) => {
                const isSelected = activeFocusedHub?.id === hub.id;
                return (
                  <button
                    key={hub.id}
                    type="button"
                    onClick={() => handleHubClick(hub)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors flex items-center gap-1.5 border ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 dark:bg-teal-500 dark:text-slate-950 dark:border-teal-400 font-semibold'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <MapPin className="w-3 h-3" />
                    <span>{hub.city}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Focused Hub & Regional Breakdown Panel (4 cols) */}
          <div className="lg:col-span-4 p-5 sm:p-6 flex flex-col justify-between space-y-5">
            {activeFocusedHub && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-blue-600 dark:text-teal-400 font-semibold">
                      {activeFocusedHub.region} Hub
                    </span>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white font-serif">
                      {activeFocusedHub.city} ({activeFocusedHub.country})
                    </h4>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                    {activeFocusedHub.currencyCode}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2.5 my-3.5 pt-3 border-t border-slate-200/80 dark:border-slate-700/70 font-mono tabular-nums">
                  <div>
                    <div className="text-[10px] font-sans text-slate-500 dark:text-slate-400">Headcount</div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                      {activeFocusedHub.headcount} Staff
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-sans text-slate-500 dark:text-slate-400">{periodLabel} Pay</div>
                    <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                      BDT {(activeFocusedHub.monthlyPayroll * dateMultiplier).toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-sans text-slate-500 dark:text-slate-400">Compliance</div>
                    <div className="text-sm font-bold text-blue-600 dark:text-teal-400 mt-0.5">
                      {activeFocusedHub.complianceScore}%
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs pt-2 border-t border-slate-200/80 dark:border-slate-700/70">
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Statutory Body:</span>
                    <span className="font-mono font-medium text-slate-800 dark:text-slate-200">
                      {activeFocusedHub.statutoryAuthority}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Employer Statutory Contrib:</span>
                    <span className="font-mono font-medium text-slate-800 dark:text-slate-200">
                      {activeFocusedHub.employerTaxRate}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Hub Time-to-Hire / Turnover:</span>
                    <span className="font-mono font-medium text-teal-600 dark:text-teal-400">
                      {activeFocusedHub.timeToHireDays}d · {activeFocusedHub.turnoverRate}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Regional Comparison Matrix */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Regional Comparison Matrix
                </h4>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  Click row to filter
                </span>
              </div>

              <div className="space-y-2">
                {regionalBreakdownRows.map((row) => {
                  const isSelected = selectedRegion === row.region;
                  return (
                    <button
                      key={row.region}
                      type="button"
                      onClick={() =>
                        setSelectedRegion(selectedRegion === row.region ? 'all' : row.region)
                      }
                      className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between gap-2 ${
                        isSelected
                          ? 'bg-blue-50/80 dark:bg-blue-950/50 border-blue-600 dark:border-teal-400'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {row.region}
                        </div>
                        <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 tabular-nums">
                          {row.headcount} Staff · Avg BDT {row.avgCost.toLocaleString()}/mo
                        </div>
                      </div>

                      <div className="text-right font-mono tabular-nums shrink-0">
                        <div className="text-xs font-bold text-slate-900 dark:text-white">
                          BDT {(row.grossPayroll * dateMultiplier).toLocaleString()}
                        </div>
                        <div
                          className={`text-[10px] font-semibold ${
                            row.riskLevel === 'High'
                              ? 'text-rose-600 dark:text-rose-400'
                              : row.riskLevel === 'Moderate'
                              ? 'text-amber-600 dark:text-amber-400'
                              : 'text-emerald-600 dark:text-emerald-400'
                          }`}
                        >
                          {row.complianceScore}% ({row.riskLevel} Risk)
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* REGIONAL STATUTORY COMPLIANCE & RISK AUDIT LEDGER */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-serif">
              Regional Statutory Compliance & Labor Risk Ledger (
              {selectedRegion === 'all' ? 'Global All-Jurisdictions' : selectedRegion})
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Live regulatory frameworks, payroll tax audits, and labor law risk exposure filtered by active region
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            {(['ALL', 'High', 'Moderate', 'Low'] as const).map((sev) => (
              <button
                key={sev}
                type="button"
                onClick={() => setRiskSeverityFilter(sev)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  riskSeverityFilter === sev
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {sev === 'ALL' ? 'All Severities' : `${sev} Risk`}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-mono uppercase text-slate-400 dark:text-slate-500">
                <th className="py-3 pr-4">Jurisdiction & Client</th>
                <th className="py-3 px-4">Statutory Audit Item & Framework</th>
                <th className="py-3 px-4">Risk Severity</th>
                <th className="py-3 px-4 text-right">Affected Staff</th>
                <th className="py-3 px-4 text-right">Exposure</th>
                <th className="py-3 px-4 text-right">Audit Score</th>
                <th className="py-3 pl-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800/80 text-xs">
              {filteredRisks.map((risk) => (
                <tr
                  key={risk.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3.5 pr-4 align-top">
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-teal-400 shrink-0" />
                      <span>{risk.country}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                      <Building2 className="w-3 h-3 shrink-0" />
                      <span>{risk.organizationName}</span>
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 dark:text-slate-500 mt-0.5">
                      {risk.region}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 align-top max-w-md">
                    <div className="font-semibold text-slate-900 dark:text-white">{risk.title}</div>
                    <div className="text-[11px] font-mono text-blue-600 dark:text-teal-400 mt-0.5">
                      {risk.regulatoryFramework}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      {risk.advisoryNote}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 align-top whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-semibold ${
                        risk.severity === 'High'
                          ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60'
                          : risk.severity === 'Moderate'
                          ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60'
                          : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60'
                      }`}
                    >
                      {risk.severity} · {risk.status}
                    </span>
                    <div className="text-[10px] font-mono text-slate-400 dark:text-slate-500 mt-1">
                      Due: {risk.dueDate}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 align-top text-right font-mono tabular-nums text-slate-800 dark:text-slate-200">
                    {risk.affectedHeadcount} Staff
                  </td>

                  <td className="py-3.5 px-4 align-top text-right font-mono tabular-nums font-semibold text-slate-900 dark:text-white">
                    BDT {risk.financialExposure.toLocaleString()}
                  </td>

                  <td className="py-3.5 px-4 align-top text-right font-mono tabular-nums font-bold">
                    <span
                      className={
                        risk.complianceScore >= 95
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : risk.complianceScore >= 90
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-rose-600 dark:text-rose-400'
                      }
                    >
                      {risk.complianceScore}%
                    </span>
                  </td>

                  <td className="py-3.5 pl-4 align-top text-right whitespace-nowrap">
                    {risk.status === 'Compliant' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Certified
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => resolveComplianceRisk(risk.id)}
                        className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-semibold transition-colors"
                      >
                        Certify & Mitigate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filteredRisks.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-xs text-slate-500 dark:text-slate-400">
                    No compliance risk records match the selected region and severity filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Visual Charts Grid (Synchronized with Regional Filter) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Headcount by Department */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-serif">
                Regional Headcount by Department
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Scope: {selectedRegion === 'all' ? 'Global Operations' : selectedRegion}
              </p>
            </div>
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400 tabular-nums">
              {filteredEmployees.length} Total Staff
            </span>
          </div>

          <div className="space-y-4">
            {Object.entries(deptCounts).map(([dept, count]) => {
              const pct = filteredEmployees.length > 0 ? Math.round((count / filteredEmployees.length) * 100) : 0;
              return (
                <div key={dept}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{dept}</span>
                    <span className="text-teal-600 dark:text-teal-400 font-bold font-mono tabular-nums">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-teal-400 h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Performance Distribution */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-serif">
                Workforce Performance Bell Curve
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Scope: {selectedRegion === 'all' ? 'Global Operations' : selectedRegion}
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold tabular-nums">
              Avg {avgPerformanceScore} / 5.0
            </span>
          </div>

          <div className="space-y-4">
            {Object.entries(performanceBands).map(([band, count]) => {
              const pct = filteredEmployees.length > 0 ? Math.round((count / filteredEmployees.length) * 100) : 0;
              return (
                <div key={band}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{band}</span>
                    <span className="text-amber-600 dark:text-amber-400 font-bold font-mono tabular-nums">
                      {count} Staff ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-teal-400 to-amber-400 h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* GLOBAL REPORT BUILDER MODAL (PDF / CSV) */}
      {exportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white font-serif">
                  Global HR & Geospatial Report Exporter
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Generate formatted executive PDF or structured CSV files for the currently active filters
                </p>
              </div>
              <button
                type="button"
                onClick={() => setExportModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Active Filter Context Summary */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-2">
                <div className="text-[11px] font-mono uppercase tracking-wider text-blue-600 dark:text-teal-400 font-semibold">
                  Active Report Filter Scope
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500">Region</div>
                    <div className="font-semibold text-slate-900 dark:text-white truncate">
                      {selectedRegion === 'all' ? 'Global (All)' : selectedRegion}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500">Organization</div>
                    <div className="font-semibold text-slate-900 dark:text-white truncate">
                      {organizationScopeLabel}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500">Period</div>
                    <div className="font-semibold text-slate-900 dark:text-white truncate">{dateRange}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500">Filtered Records</div>
                    <div className="font-mono font-semibold text-teal-600 dark:text-teal-400">
                      {filteredEmployees.length} Staff · {filteredRisks.length} Risks
                    </div>
                  </div>
                </div>
              </div>

              {/* Format Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Select Export File Format
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setExportFormat('pdf')}
                    className={`p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 ${
                      exportFormat === 'pdf'
                        ? 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-600 dark:border-teal-400'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <FileText
                      className={`w-5 h-5 shrink-0 mt-0.5 ${
                        exportFormat === 'pdf'
                          ? 'text-blue-600 dark:text-teal-400'
                          : 'text-slate-400 dark:text-slate-500'
                      }`}
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        Executive PDF Report (.pdf)
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Board-ready layout with KPI cards, tables, and compliance brief
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setExportFormat('csv')}
                    className={`p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 ${
                      exportFormat === 'csv'
                        ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-600 dark:border-emerald-400'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <FileSpreadsheet
                      className={`w-5 h-5 shrink-0 mt-0.5 ${
                        exportFormat === 'csv'
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-slate-400 dark:text-slate-500'
                      }`}
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        Structured Data Workbook (.csv)
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Raw tabular dataset for Excel, BI tools, and payroll reconciliation
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Included Data Sections */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Included Report Sections
                </label>
                <div className="space-y-2">
                  {(
                    [
                      {
                        key: 'kpiSummary',
                        title: 'Executive KPI Summary',
                        desc: 'Headcount, gross payroll, tax/PF withholdings, compliance score & exposure',
                      },
                      {
                        key: 'regionalMatrix',
                        title: 'Regional Comparison Matrix',
                        desc: 'Side-by-side comparison across North America, Europe & UK, APAC, and MEA',
                      },
                      {
                        key: 'departmentAndPerformance',
                        title: 'Department Headcount & Performance Bell Curve',
                        desc: 'Departmental staffing ratios and Q3 appraisal distribution bands',
                      },
                      {
                        key: 'complianceLedger',
                        title: 'Regional Statutory Compliance & Labor Risk Ledger',
                        desc: `${filteredRisks.length} filtered audit item(s) with regulatory frameworks and due dates`,
                      },
                      {
                        key: 'employeePayrollRoster',
                        title: 'Filtered Workforce & Compensation Roster',
                        desc: `${filteredEmployees.length} active employee record(s) with monthly salary & deductions`,
                      },
                    ] as const
                  ).map((item) => {
                    const checked = exportSections[item.key];
                    return (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => toggleSectionKey(item.key)}
                        className={`w-full p-2.5 rounded-xl border text-left transition-colors flex items-center justify-between gap-3 ${
                          checked
                            ? 'bg-slate-50 dark:bg-slate-800/70 border-slate-300 dark:border-slate-700'
                            : 'bg-white dark:bg-slate-900 border-slate-200/70 dark:border-slate-800/70 opacity-60'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-semibold text-slate-900 dark:text-white">
                            {item.title}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">{item.desc}</div>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                            checked
                              ? 'bg-blue-600 border-blue-600 dark:bg-teal-500 dark:border-teal-500 text-white dark:text-slate-950'
                              : 'border-slate-300 dark:border-slate-700'
                          }`}
                        >
                          {checked && <Check className="w-3.5 h-3.5" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setExportModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleTriggerExport(exportFormat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold text-white flex items-center gap-1.5 transition-colors cursor-pointer ${
                  exportFormat === 'pdf'
                    ? 'bg-blue-600 hover:bg-blue-500'
                    : 'bg-emerald-600 hover:bg-emerald-500'
                }`}
              >
                <Download className="w-3.5 h-3.5" />
                <span>
                  Download {exportFormat.toUpperCase()} Report (
                  {selectedRegion === 'all' ? 'Global' : selectedRegion})
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
