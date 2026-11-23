import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { calculateBangladeshTax, REGIONS, TAX_YEARS } from '../../utils/taxCalculator';
import {
  Receipt,
  Printer,
  Settings,
  Download,
  FileSpreadsheet,
  Play,
  X,
  TrendingUp,
  Users,
  Landmark,
  CheckCircle2,
} from 'lucide-react';

const BONUS_TYPES = [
  { id: 'None', name: 'No Bonus Active' },
  { id: 'Eid-ul-Fitr', name: 'Eid-ul-Fitr Bonus' },
  { id: 'Ramadan', name: 'Ramadan Allowance' },
  { id: 'Eid-ul-Adha', name: 'Eid-ul-Adha Bonus' },
  { id: 'Durga Puja', name: 'Durga Puja Bonus' },
  { id: 'New Year Festival', name: 'Festival Bonus' },
];

interface ProcessedPayrollRow {
  employeeId: string;
  employeeCode: string;
  name: string;
  department: string;
  designation: string;
  bankName: string;
  branchCode: string;
  bankAccountNo: string;
  basicSalary: number;
  houseRent: number;
  medicalAllowance: number;
  conveyanceAllowance: number;
  mobileAllowance: number;
  bonusPay: number;
  grossSalary: number;
  taxDeduction: number;
  providentFund: number;
  insurance: number;
  totalDeductions: number;
  netSalary: number;
}

interface PayrollRun {
  month: string;
  orgId: string;
  bonusType: string;
  bonusPercent: number;
  processedAt: string;
  employeeCount: number;
  totalDisbursed: number;
  rows: ProcessedPayrollRow[];
}

interface SalaryRevisionLog {
  id: string;
  employeeId: string;
  employeeCode: string;
  name: string;
  previousGross: number;
  newGross: number;
  reason: string;
  approvedBy: string;
  effectiveDate: string;
}

function downloadCsv(filename: string, rows: Record<string, string | number>[]) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(','),
    ...rows.map((r) => headers.map((h) => `"${String(r[h] ?? '').replace(/"/g, '""')}"`).join(',')),
  ].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export const PayrollManager: React.FC = () => {
  const {
    employees,
    payrollRecords,
    processMonthlyPayroll,
    updatePayrollStatus,
    updateEmployee,
    taxRules,
    updateTaxRules,
    currentUser,
    selectedOrgIdFilter,
    notify,
  } = useApp();

  const isClientAdmin = currentUser.role === 'client_admin';
  const targetOrgId = isClientAdmin ? currentUser.organizationId : selectedOrgIdFilter;

  const activeEmployees = useMemo(
    () =>
      employees.filter(
        (e) => e.status === 'Active' && (targetOrgId === 'all' || e.organizationId === targetOrgId)
      ),
    [employees, targetOrgId]
  );

  const [activeTab, setActiveTab] = useState<'process' | 'history'>('process');
  const [processMonth, setProcessMonth] = useState('2026-06');
  const [bonusType, setBonusType] = useState('None');
  const [bonusPercent, setBonusPercent] = useState(50);
  const [runMsg, setRunMsg] = useState('');

  const [payrollRuns, setPayrollRuns] = useState<PayrollRun[]>(() => {
    try {
      const saved = localStorage.getItem('acct_payroll_runs_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [revisions, setRevisions] = useState<SalaryRevisionLog[]>(() => {
    try {
      const saved = localStorage.getItem('acct_salary_revisions_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [revEmpCode, setRevEmpCode] = useState(() => activeEmployees[0]?.employeeCode || '');
  const [revNewGross, setRevNewGross] = useState(60000);
  const [revReason, setRevReason] = useState('');
  const [revMsg, setRevMsg] = useState('');

  const [activePayslip, setActivePayslip] = useState<ProcessedPayrollRow | null>(null);
  const [taxConfigOpen, setTaxConfigOpen] = useState(false);

  const [taxFreeLimit, setTaxFreeLimit] = useState(taxRules.taxFreeLimit);
  const [taxRatePercent, setTaxRatePercent] = useState(taxRules.taxRatePercent);
  const [providentFundPercent, setProvidentFundPercent] = useState(taxRules.providentFundPercent);
  const [healthInsuranceFixed, setHealthInsuranceFixed] = useState(taxRules.healthInsuranceFixed);
  const [socialSecurityPercent, setSocialSecurityPercent] = useState(taxRules.socialSecurityPercent);

  const activeRun = payrollRuns.find(
    (run) => run.month === processMonth && run.orgId === targetOrgId
  );

  const getEmployeeGross = (emp: (typeof employees)[number]) => {
    const basic = emp.salaryBreakdowns?.basicSalary || emp.basicSalary || 0;
    const allow = emp.allowances || 0;
    return emp.salaryBreakdowns?.grossSalary || basic + allow;
  };

  const formatMonthLabel = (ym: string) => {
    const [y, m] = ym.split('-');
    const dt = new Date(Number(y), Number(m) - 1, 1);
    return Number.isNaN(dt.getTime())
      ? ym
      : dt.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  };

  const handleProcessPayroll = (e: React.FormEvent) => {
    e.preventDefault();
    const activeBonusPct = bonusType !== 'None' ? bonusPercent : 0;

    const rows: ProcessedPayrollRow[] = activeEmployees.map((emp) => {
      const basicSalary = emp.salaryBreakdowns?.basicSalary || emp.basicSalary || 0;
      const houseRent =
        emp.salaryBreakdowns?.houseRent ?? Math.round((emp.allowances || 0) * 0.6);
      const medicalAllowance =
        emp.salaryBreakdowns?.medicalAllowance ?? Math.round((emp.allowances || 0) * 0.25);
      const conveyanceAllowance =
        emp.salaryBreakdowns?.conveyanceAllowance ?? Math.round((emp.allowances || 0) * 0.15);
      const mobileAllowance = emp.salaryBreakdowns?.mobileAllowance ?? 0;

      const bonusPay = Math.round(basicSalary * (activeBonusPct / 100));
      const baseGross =
        basicSalary + houseRent + medicalAllowance + conveyanceAllowance + mobileAllowance;
      const grossSalary = baseGross + bonusPay;

      const bdTax = calculateBangladeshTax({
        basicSalary: basicSalary * 12,
        allowances: (houseRent + medicalAllowance + conveyanceAllowance + mobileAllowance) * 12,
        bonuses: basicSalary * 2,
        gender: emp.gender,
        dob: (emp.dob || null) as any,
        region: REGIONS.DHAKA_CHITTAGONG,
        taxYear: TAX_YEARS['2025-2026'],
      });

      const taxDeduction = bdTax.monthlyTaxDeduction || 0;
      const providentFund = Math.round(basicSalary * ((taxRules.providentFundPercent || 0) / 100));
      const insurance = taxRules.healthInsuranceFixed || 0;
      const totalDeductions = taxDeduction + providentFund + insurance;
      const netSalary = Math.max(0, grossSalary - totalDeductions);

      return {
        employeeId: emp.id,
        employeeCode: emp.employeeCode,
        name: emp.name,
        department: emp.department,
        designation: emp.designation,
        bankName: emp.bankingProfile?.bankName || 'Al-Arafah Islami Bank PLC',
        branchCode: emp.bankingProfile?.bankBranchCode || '014',
        bankAccountNo: emp.bankingProfile?.bankAccountNo || '—',
        basicSalary,
        houseRent,
        medicalAllowance,
        conveyanceAllowance,
        mobileAllowance,
        bonusPay,
        grossSalary,
        taxDeduction,
        providentFund,
        insurance,
        totalDeductions,
        netSalary,
      };
    });

    const totalDisbursed = rows.reduce((sum, r) => sum + r.netSalary, 0);
    const newRun: PayrollRun = {
      month: processMonth,
      orgId: targetOrgId,
      bonusType,
      bonusPercent: activeBonusPct,
      processedAt: new Date().toISOString(),
      employeeCount: rows.length,
      totalDisbursed,
      rows,
    };

    const updated = [
      newRun,
      ...payrollRuns.filter((r) => !(r.month === processMonth && r.orgId === targetOrgId)),
    ];
    setPayrollRuns(updated);
    localStorage.setItem('acct_payroll_runs_v1', JSON.stringify(updated));

    const [yStr, mStr] = processMonth.split('-');
    const yearNum = Number(yStr) || new Date().getFullYear();
    const monthDt = new Date(yearNum, (Number(mStr) || 1) - 1, 1);
    const monthName = Number.isNaN(monthDt.getTime())
      ? processMonth
      : monthDt.toLocaleString('en-US', { month: 'long' });
    processMonthlyPayroll(monthName, yearNum, targetOrgId, activeBonusPct);

    const msg = `Monthly payroll for ${formatMonthLabel(processMonth)} processed for ${rows.length} employee(s).`;
    setRunMsg(msg);
    notify('Payroll Processed', msg, 'success', 'payroll');
    setTimeout(() => setRunMsg(''), 5000);
  };

  const handleExportBankTransfer = () => {
    if (!activeRun) return;
    downloadCsv(
      `Bank_Transfer_Advice_${processMonth}.csv`,
      activeRun.rows.map((r, idx) => ({
        'SL': idx + 1,
        'Employee Code': r.employeeCode,
        'Account Holder Name': r.name,
        'Bank Name': r.bankName,
        'Branch Code': r.branchCode,
        'Account Number': r.bankAccountNo,
        'Net Payable (BDT)': r.netSalary,
        'Salary Period': formatMonthLabel(processMonth),
      }))
    );
  };

  const handleExportPayrollSummary = () => {
    if (!activeRun) return;
    downloadCsv(
      `Payroll_Summary_${processMonth}.csv`,
      activeRun.rows.map((r) => ({
        'Employee Code': r.employeeCode,
        'Name': r.name,
        'Designation': r.designation,
        'Department': r.department,
        'Basic Salary (BDT)': r.basicSalary,
        'House Rent (BDT)': r.houseRent,
        'Medical (BDT)': r.medicalAllowance,
        'Conveyance (BDT)': r.conveyanceAllowance,
        'Mobile (BDT)': r.mobileAllowance,
        'Bonus Pay (BDT)': r.bonusPay,
        'Gross Salary (BDT)': r.grossSalary,
        'TDS Tax Deduction (BDT)': r.taxDeduction,
        'Provident Fund (BDT)': r.providentFund,
        'Insurance (BDT)': r.insurance,
        'Total Deductions (BDT)': r.totalDeductions,
        'Net Salary (BDT)': r.netSalary,
      }))
    );
  };

  const handleReviseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emp =
      activeEmployees.find((item) => item.employeeCode === revEmpCode) || activeEmployees[0];
    if (!emp) return;

    const previousGross = getEmployeeGross(emp);
    const basicSalary = Math.round(revNewGross * 0.6);
    const houseRent = Math.round(revNewGross * 0.25);
    const medicalAllowance = Math.round(revNewGross * 0.1);
    const conveyanceAllowance = Math.max(0, revNewGross - basicSalary - houseRent - medicalAllowance);
    const allowances = houseRent + medicalAllowance + conveyanceAllowance;

    updateEmployee({
      ...emp,
      basicSalary,
      allowances,
      salaryBreakdowns: {
        basicSalary,
        houseRent,
        medicalAllowance,
        conveyanceAllowance,
        mobileAllowance: 0,
        grossSalary: revNewGross,
      },
    });

    const entry: SalaryRevisionLog = {
      id: `rev_${Date.now()}`,
      employeeId: emp.id,
      employeeCode: emp.employeeCode,
      name: emp.name,
      previousGross,
      newGross: revNewGross,
      reason: revReason.trim(),
      approvedBy: currentUser.name,
      effectiveDate: new Date().toISOString().slice(0, 10),
    };

    const nextRevs = [entry, ...revisions];
    setRevisions(nextRevs);
    localStorage.setItem('acct_salary_revisions_v1', JSON.stringify(nextRevs));

    const msg = `Salary of ${emp.name} revised from ৳${previousGross.toLocaleString()} to ৳${revNewGross.toLocaleString()}.`;
    setRevMsg(msg);
    setRevReason('');
    notify('Salary Revised', msg, 'success', 'payroll');
    setTimeout(() => setRevMsg(''), 5000);
  };

  const handleSaveTaxRules = (e: React.FormEvent) => {
    e.preventDefault();
    updateTaxRules({
      taxFreeLimit,
      taxRatePercent,
      providentFundPercent,
      healthInsuranceFixed,
      socialSecurityPercent,
    });
    setTaxConfigOpen(false);
  };

  const totalTDS = activeRun
    ? activeRun.rows.reduce((sum, r) => sum + r.taxDeduction, 0)
    : 0;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-serif tracking-tight">
            Payroll &amp; Compensation Processing
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Monthly payroll run, festival bonus computation, BD TDS integration, bank advice export &amp; salary revisions
          </p>
        </div>

        <div className="flex items-center gap-2">
          {currentUser.role === 'super_admin' && (
            <button
              onClick={() => setTaxConfigOpen(true)}
              className="px-3.5 py-2 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 cursor-pointer"
            >
              <Settings className="w-4 h-4 text-slate-500" />
              <span>Configure Payroll Rules</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('process')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'process'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          Process Payroll
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'history'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          Salary Revision Logs
        </button>
      </div>

      {activeTab === 'process' && (
        <div className="space-y-6">
          {/* Salary Processing Dashboard */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-blue-700 dark:text-blue-400 font-serif">
              Salary Processing Dashboard
            </h3>
            <form
              onSubmit={handleProcessPayroll}
              className="flex flex-wrap items-end gap-4 text-xs"
            >
              <div className="min-w-[160px]">
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Target Salary Month
                </label>
                <input
                  type="month"
                  value={processMonth}
                  onChange={(e) => setProcessMonth(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="min-w-[200px]">
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Activate Festival Bonus
                </label>
                <select
                  value={bonusType}
                  onChange={(e) => setBonusType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  {BONUS_TYPES.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              {bonusType !== 'None' && (
                <div className="min-w-[140px]">
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Bonus (% of Basic)
                  </label>
                  <input
                    type="number"
                    min={10}
                    max={150}
                    value={bonusPercent}
                    onChange={(e) => setBonusPercent(parseInt(e.target.value, 10) || 0)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              )}

              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Process Salaries</span>
              </button>

              {activeRun && (
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleExportBankTransfer}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export Bank Advice</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleExportPayrollSummary}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 cursor-pointer"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Export Sheet</span>
                  </button>
                </div>
              )}
            </form>

            {runMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{runMsg}</span>
              </div>
            )}
          </div>

          {/* Processed Salaries */}
          {activeRun ? (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      Total Disbursed Amount
                    </div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                      ৳{Math.round(activeRun.totalDisbursed).toLocaleString()}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {formatMonthLabel(processMonth)} payouts
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Landmark className="w-5 h-5" />
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      TDS Tax Deducted
                    </div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                      ৳{Math.round(totalTDS).toLocaleString()}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      To deposit to BD Treasury
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                    <Receipt className="w-5 h-5" />
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      Employees Paid
                    </div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                      {activeRun.employeeCount}
                    </div>
                    <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">
                      100% active payroll
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-x-auto shadow-sm">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/80 text-[11px] uppercase text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-4 py-3">Employee Code</th>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Department</th>
                      <th className="px-4 py-3">Designation</th>
                      <th className="px-4 py-3">Basic Salary</th>
                      <th className="px-4 py-3">Gross Salary</th>
                      <th className="px-4 py-3">Bonus Pay</th>
                      <th className="px-4 py-3">TDS Tax</th>
                      <th className="px-4 py-3">PF ({taxRules.providentFundPercent}%)</th>
                      <th className="px-4 py-3">Net Salary</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Payslip</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {activeRun.rows.map((row) => {
                      const [yStr, mStr] = processMonth.split('-');
                      const yearNum = Number(yStr) || new Date().getFullYear();
                      const monthDt = new Date(yearNum, (Number(mStr) || 1) - 1, 1);
                      const monthName = Number.isNaN(monthDt.getTime())
                        ? processMonth
                        : monthDt.toLocaleString('en-US', { month: 'long' });
                      const recordId = `pr_${row.employeeId}_${monthName}${yearNum}`;
                      const liveRecord = payrollRecords.find((p) => p.id === recordId);
                      const status = liveRecord?.paymentStatus || 'Processing';
                      return (
                      <tr key={row.employeeCode} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                        <td className="px-4 py-3 font-mono font-bold text-slate-900 dark:text-white">
                          {row.employeeCode}
                        </td>
                        <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-200">
                          {row.name}
                        </td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                          {row.department}
                        </td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                          {row.designation}
                        </td>
                        <td className="px-4 py-3">৳{row.basicSalary.toLocaleString()}</td>
                        <td className="px-4 py-3">৳{row.grossSalary.toLocaleString()}</td>
                        <td className="px-4 py-3">৳{row.bonusPay.toLocaleString()}</td>
                        <td className="px-4 py-3 text-rose-600 dark:text-rose-400">
                          ৳{row.taxDeduction.toLocaleString()}
                        </td>
                        <td className="px-4 py-3">৳{row.providentFund.toLocaleString()}</td>
                        <td className="px-4 py-3 font-bold text-blue-600 dark:text-blue-400">
                          ৳{row.netSalary.toLocaleString()}
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={status}
                            onChange={(e) =>
                              updatePayrollStatus(
                                recordId,
                                e.target.value as 'Paid' | 'Processing' | 'Pending'
                              )
                            }
                            className={`px-2 py-1 rounded-lg text-[11px] font-semibold border cursor-pointer ${
                              status === 'Paid'
                                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                                : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                            }`}
                          >
                            <option value="Processing">Processing</option>
                            <option value="Paid">Paid</option>
                            <option value="Pending">Pending</option>
                          </select>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => setActivePayslip(row)}
                            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] font-semibold cursor-pointer"
                          >
                            PDF Payslip
                          </button>
                        </td>
                      </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="p-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
              No payroll processed yet for {formatMonthLabel(processMonth)}. Adjust festival bonus if needed and click <strong>Process Salaries</strong> to calculate.
            </div>
          )}

          {/* Salary Bracket Distribution */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-base font-bold text-blue-700 dark:text-blue-400 font-serif">
              Salary Bracket Distribution
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Active employee count by gross salary band
            </p>
            <div className="space-y-3">
              {[
                { label: 'Below ৳20,000', min: 0, max: 20000 },
                { label: '৳20,000–40,000', min: 20000, max: 40000 },
                { label: '৳40,000–60,000', min: 40000, max: 60000 },
                { label: '৳60,000–80,000', min: 60000, max: 80000 },
                { label: 'Above ৳80,000', min: 80000, max: Infinity },
              ].map((b) => {
                const total = activeEmployees.length || 1;
                const count = activeEmployees.filter((e) => {
                  const g = getEmployeeGross(e);
                  return g >= b.min && g < b.max;
                }).length;
                const pct = Math.round((count / total) * 100);
                return (
                  <div key={b.label} className="flex items-center gap-3 text-xs">
                    <span className="w-32 shrink-0 font-medium text-slate-700 dark:text-slate-300">
                      {b.label}
                    </span>
                    <div className="flex-1 h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-600 to-teal-500 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-8 text-right font-semibold">{count}</span>
                    <span className="w-10 text-right text-slate-400">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revise Form */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-base font-bold text-blue-700 dark:text-blue-400 font-serif mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span>Revise Salary (Increment / Adjustment)</span>
            </h3>
            <form onSubmit={handleReviseSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Select Employee
                </label>
                <select
                  value={revEmpCode}
                  onChange={(e) => setRevEmpCode(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  {activeEmployees.map((emp) => (
                    <option key={emp.employeeCode} value={emp.employeeCode}>
                      {emp.employeeCode} — {emp.name} (Current Gross: ৳
                      {getEmployeeGross(emp).toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  New Monthly Gross Salary (BDT)
                </label>
                <input
                  type="number"
                  required
                  min={12000}
                  value={revNewGross}
                  onChange={(e) => setRevNewGross(parseInt(e.target.value, 10) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Reason for Revision *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="e.g. Annual Merit Increment / Promotion"
                  value={revReason}
                  onChange={(e) => setRevReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold cursor-pointer"
              >
                Apply Revision
              </button>

              {revMsg && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-semibold">
                  {revMsg}
                </div>
              )}
            </form>
          </div>

          {/* Revision Logs */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-base font-bold text-blue-700 dark:text-blue-400 font-serif">
              Salary Revision History Audit
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Audit trails of adjustments made to employees&apos; compensation packages.
            </p>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {revisions.length === 0 ? (
                <div className="py-10 text-center text-xs text-slate-400">
                  No salary revisions processed yet.
                </div>
              ) : (
                revisions.map((rev) => {
                  const pct =
                    rev.previousGross > 0
                      ? Math.round(((rev.newGross - rev.previousGross) / rev.previousGross) * 100)
                      : 0;
                  return (
                    <div
                      key={rev.id}
                      className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-xs"
                    >
                      <div className="flex items-center justify-between font-semibold mb-1">
                        <span>
                          {rev.employeeCode} — {rev.name}
                        </span>
                        <span className="text-emerald-600 dark:text-emerald-400">
                          {pct >= 0 ? `+${pct}%` : `${pct}%`} Adjust
                        </span>
                      </div>
                      <div>
                        <strong>Gross adjusted:</strong> ৳{rev.previousGross.toLocaleString()} &rarr; ৳
                        {rev.newGross.toLocaleString()}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                        <strong>Reason:</strong> {rev.reason} | <strong>Approved By:</strong>{' '}
                        {rev.approvedBy} • {rev.effectiveDate}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Payslip Modal */}
      {activePayslip && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold font-serif">
                  Digital Payslip — {formatMonthLabel(processMonth)}
                </h3>
                <p className="text-slate-500">
                  {activePayslip.name} ({activePayslip.employeeCode}) • {activePayslip.designation}
                </p>
              </div>
              <button
                onClick={() => setActivePayslip(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 space-y-1.5">
                <div className="font-bold text-slate-700 dark:text-slate-200">Earnings</div>
                <div className="flex justify-between">
                  <span>Basic Salary</span>
                  <span>৳{activePayslip.basicSalary.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>House Rent</span>
                  <span>৳{activePayslip.houseRent.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Medical</span>
                  <span>৳{activePayslip.medicalAllowance.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Conveyance</span>
                  <span>৳{activePayslip.conveyanceAllowance.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Festival Bonus</span>
                  <span>৳{activePayslip.bonusPay.toLocaleString()}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 space-y-1.5">
                <div className="font-bold text-slate-700 dark:text-slate-200">Deductions</div>
                <div className="flex justify-between text-rose-600">
                  <span>Income Tax (TDS)</span>
                  <span>৳{activePayslip.taxDeduction.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Provident Fund</span>
                  <span>৳{activePayslip.providentFund.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Health Insurance</span>
                  <span>৳{activePayslip.insurance.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold border-t border-slate-200 dark:border-slate-700 pt-1.5 mt-2">
                  <span>Net Payable</span>
                  <span className="text-blue-600">৳{activePayslip.netSalary.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Save PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Configure Payroll Rules Modal */}
      {taxConfigOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold font-serif">Configure Statutory Payroll Rules</h3>
              <button
                onClick={() => setTaxConfigOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveTaxRules} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Tax-Free Limit (BDT)</label>
                <input
                  type="number"
                  value={taxFreeLimit}
                  onChange={(e) => setTaxFreeLimit(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Default Tax Rate (%)</label>
                <input
                  type="number"
                  value={taxRatePercent}
                  onChange={(e) => setTaxRatePercent(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Provident Fund (% of Basic)</label>
                <input
                  type="number"
                  value={providentFundPercent}
                  onChange={(e) => setProvidentFundPercent(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Health Insurance Fixed (BDT)</label>
                <input
                  type="number"
                  value={healthInsuranceFixed}
                  onChange={(e) => setHealthInsuranceFixed(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Social Security (%)</label>
                <input
                  type="number"
                  value={socialSecurityPercent}
                  onChange={(e) => setSocialSecurityPercent(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setTaxConfigOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold cursor-pointer"
                >
                  Save Rules
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
