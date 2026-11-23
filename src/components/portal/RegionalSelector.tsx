import React from 'react';
import { Globe, MapPin, ShieldAlert, ShieldCheck, RotateCcw } from 'lucide-react';
import { RegionId } from '../../types';
import { useApp } from '../../context/AppContext';
import { COUNTRY_TO_REGION } from '../../data/mockData';

export interface RegionSummaryStat {
  id: RegionId;
  label: string;
  shortCode: string;
  jurisdictions: string;
  headcount: number;
  monthlyPayroll: number;
  complianceScore: number;
  highRiskCount: number;
}

interface RegionalSelectorProps {
  selectedRegion?: RegionId;
  onSelectRegion?: (region: RegionId) => void;
  compact?: boolean;
}

export const REGION_OPTIONS: {
  id: RegionId;
  label: string;
  shortCode: string;
  jurisdictions: string;
}[] = [
  {
    id: 'all',
    label: 'Global Operations',
    shortCode: 'GLB',
    jurisdictions: 'All 5 Jurisdictions',
  },
  {
    id: 'North America',
    label: 'North America',
    shortCode: 'NAM',
    jurisdictions: 'US & Canada',
  },
  {
    id: 'Europe & UK',
    label: 'Europe & UK',
    shortCode: 'EUR',
    jurisdictions: 'United Kingdom',
  },
  {
    id: 'Asia-Pacific',
    label: 'Asia-Pacific',
    shortCode: 'APAC',
    jurisdictions: 'Singapore',
  },
  {
    id: 'Middle East & Africa',
    label: 'Middle East & Africa',
    shortCode: 'MEA',
    jurisdictions: 'UAE (GCC)',
  },
];

export const RegionalSelector: React.FC<RegionalSelectorProps> = ({
  selectedRegion: propSelectedRegion,
  onSelectRegion: propOnSelectRegion,
  compact = false,
}) => {
  const {
    selectedRegion: contextSelectedRegion,
    setSelectedRegion: contextSetSelectedRegion,
    organizations,
    employees,
    payrollRecords,
    complianceRisks,
    selectedOrgIdFilter,
  } = useApp();

  const activeRegion = propSelectedRegion ?? contextSelectedRegion;
  const handleSelect = propOnSelectRegion ?? contextSetSelectedRegion;

  // Map organizationId -> Region
  const orgRegionMap = React.useMemo(() => {
    const map: Record<string, Exclude<RegionId, 'all'>> = {};
    organizations.forEach((org) => {
      map[org.id] = COUNTRY_TO_REGION[org.country] || 'North America';
    });
    return map;
  }, [organizations]);

  // Compute summary stats per region option
  const regionStats: RegionSummaryStat[] = React.useMemo(() => {
    const orgFilteredEmployees = employees.filter(
      (e) => selectedOrgIdFilter === 'all' || e.organizationId === selectedOrgIdFilter
    );
    const orgFilteredPayroll = payrollRecords.filter(
      (p) => selectedOrgIdFilter === 'all' || p.organizationId === selectedOrgIdFilter
    );
    const orgFilteredRisks = complianceRisks.filter(
      (r) => selectedOrgIdFilter === 'all' || r.organizationId === selectedOrgIdFilter
    );

    return REGION_OPTIONS.map((opt) => {
      const regEmployees =
        opt.id === 'all'
          ? orgFilteredEmployees
          : orgFilteredEmployees.filter((e) => orgRegionMap[e.organizationId] === opt.id);

      const regPayroll =
        opt.id === 'all'
          ? orgFilteredPayroll
          : orgFilteredPayroll.filter((p) => orgRegionMap[p.organizationId] === opt.id);

      const regRisks =
        opt.id === 'all'
          ? orgFilteredRisks
          : orgFilteredRisks.filter((r) => r.region === opt.id);

      const monthlyPayroll = regPayroll.reduce((sum, p) => sum + p.grossSalary, 0);
      const avgScore =
        regRisks.length > 0
          ? Math.round(regRisks.reduce((sum, r) => sum + r.complianceScore, 0) / regRisks.length)
          : 100;
      const highRiskCount = regRisks.filter(
        (r) => r.severity === 'High' || r.status === 'Action Required'
      ).length;

      return {
        ...opt,
        headcount: regEmployees.length,
        monthlyPayroll,
        complianceScore: avgScore,
        highRiskCount,
      };
    });
  }, [employees, payrollRecords, complianceRisks, orgRegionMap, selectedOrgIdFilter]);

  if (compact) {
    return (
      <div className="inline-flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80">
        {regionStats.map((reg) => {
          const isActive = activeRegion === reg.id;
          return (
            <button
              key={reg.id}
              type="button"
              onClick={() => handleSelect(reg.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-teal-400 shadow-xs border border-slate-200/80 dark:border-slate-700 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {reg.id === 'all' ? <Globe className="w-3.5 h-3.5" /> : <MapPin className="w-3.5 h-3.5" />}
              <span>{reg.label}</span>
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 tabular-nums">
                {reg.headcount}
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/60 flex items-center justify-center text-blue-600 dark:text-teal-400">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Geographic Jurisdiction Filter
              </h3>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                Active: {activeRegion === 'all' ? 'Global All-Regions' : activeRegion}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Select a regional operating theatre to filter workforce headcount, gross payroll liabilities, and statutory compliance risks
            </p>
          </div>
        </div>

        {activeRegion !== 'all' && (
          <button
            type="button"
            onClick={() => handleSelect('all')}
            className="self-start sm:self-auto px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/70 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Global View</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
        {regionStats.map((reg) => {
          const isActive = activeRegion === reg.id;
          return (
            <button
              key={reg.id}
              type="button"
              onClick={() => handleSelect(reg.id)}
              className={`text-left p-3 rounded-xl border transition-all ${
                isActive
                  ? 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-600 dark:border-teal-400 ring-1 ring-blue-600/20 dark:ring-teal-400/20'
                  : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100/60 dark:hover:bg-slate-800/70'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span
                  className={`text-xs font-bold truncate ${
                    isActive ? 'text-blue-700 dark:text-teal-300' : 'text-slate-900 dark:text-white'
                  }`}
                >
                  {reg.label}
                </span>
                <span
                  className={`text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded ${
                    isActive
                      ? 'bg-blue-600 text-white dark:bg-teal-500 dark:text-slate-950'
                      : 'bg-slate-200/80 dark:bg-slate-700/80 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {reg.shortCode}
                </span>
              </div>

              <div className="text-[11px] text-slate-500 dark:text-slate-400 mb-2.5 truncate">
                {reg.jurisdictions}
              </div>

              <div className="grid grid-cols-3 gap-1 pt-2 border-t border-slate-200/70 dark:border-slate-700/60 text-[11px] font-mono tabular-nums">
                <div>
                  <div className="text-[9px] uppercase text-slate-400 dark:text-slate-500 font-sans">Staff</div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">{reg.headcount}</div>
                </div>
                <div>
                  <div className="text-[9px] uppercase text-slate-400 dark:text-slate-500 font-sans">Payroll</div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">
                    ${Math.round(reg.monthlyPayroll / 1000)}k
                  </div>
                </div>
                <div>
                  <div className="text-[9px] uppercase text-slate-400 dark:text-slate-500 font-sans">Audit</div>
                  <div className="flex items-center gap-0.5 font-bold">
                    {reg.highRiskCount > 0 ? (
                      <span className="text-amber-600 dark:text-amber-400 flex items-center gap-0.5">
                        <ShieldAlert className="w-3 h-3" />
                        {reg.complianceScore}%
                      </span>
                    ) : (
                      <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                        <ShieldCheck className="w-3 h-3" />
                        {reg.complianceScore}%
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
