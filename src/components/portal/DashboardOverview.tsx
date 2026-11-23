import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Briefcase,
  Calendar,
  DollarSign,
  Receipt,
  Clock,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  UserCheck,
  PlusCircle,
} from 'lucide-react';

export const DashboardOverview: React.FC = () => {
  const {
    currentUser,
    setActivePortalTab,
    leads,
    consultations,
    jobs,
    candidates,
    employees,
    payrollRecords,
    leaveRequests,
    selectedOrgIdFilter,
  } = useApp();

  const isSuperAdmin = currentUser.role === 'super_admin';
  const isConsultant = currentUser.role === 'hr_consultant';
  const isClientAdmin = currentUser.role === 'client_admin';

  // Apply tenant isolation
  const targetOrgId = isClientAdmin ? currentUser.organizationId : selectedOrgIdFilter;

  const filteredEmployees = employees.filter(
    (e) => targetOrgId === 'all' || e.organizationId === targetOrgId
  );
  const filteredJobs = jobs.filter(
    (j) => targetOrgId === 'all' || j.organizationId === targetOrgId
  );
  const filteredCandidates = candidates.filter(
    (c) => targetOrgId === 'all' || c.organizationId === targetOrgId
  );
  const filteredLeave = leaveRequests.filter(
    (l) => targetOrgId === 'all' || l.organizationId === targetOrgId
  );
  const filteredPayroll = payrollRecords.filter(
    (p) => targetOrgId === 'all' || p.organizationId === targetOrgId
  );

  const pendingConsultationsCount = consultations.filter((c) => c.status === 'New').length;
  const pendingLeaveCount = filteredLeave.filter((l) => l.status === 'Pending').length;
  const activeCandidatesCount = filteredCandidates.filter(
    (c) => c.status !== 'Hired' && c.status !== 'Rejected'
  ).length;

  const totalPayrollCost = filteredPayroll
    .filter((p) => p.month === 'September' && p.year === 2026)
    .reduce((acc, curr) => acc + curr.grossSalary, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-50 via-white to-slate-50 dark:from-blue-950 dark:via-slate-900 dark:to-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm dark:shadow-xl">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/15 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-400/30 uppercase">
              {currentUser.role.replace('_', ' ')}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">&bull; {currentUser.organizationName}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-serif tracking-tight">
            Welcome back, {currentUser.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl">
            {isSuperAdmin
              ? 'Accounticca master console. Overseeing 450+ client accounts, ATS pipelines, and multi-tenant payroll operations.'
              : isConsultant
                ? 'Your assigned client advisory portal. Review active HR requests, pending audits, and strategic talent pipelines.'
                : isClientAdmin
                  ? `Client HR operations console for ${currentUser.organizationName}. Managed under Corporate HR SLA.`
                  : 'Recruitment & Talent Acquisition ATS workspace. Review candidate stages, scorecards, and openings.'}
          </p>
        </div>

        {/* Quick actions buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {(isSuperAdmin || isConsultant) && (
            <button
              onClick={() => setActivePortalTab('leads')}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add CRM Lead</span>
            </button>
          )}

          <button
            onClick={() => setActivePortalTab('recruitment')}
            className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 flex items-center gap-1.5"
          >
            <Briefcase className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>Open Requisitions ({filteredJobs.length})</span>
          </button>

          {(isSuperAdmin || isConsultant || isClientAdmin) && (
            <button
              onClick={() => setActivePortalTab('payroll')}
              className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 flex items-center gap-1.5"
            >
              <Receipt className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Payroll Console</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1 */}
        <div
          onClick={() => setActivePortalTab('employees')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer group shadow-sm dark:shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Workforce</span>
            <div className="w-9 h-9 rounded-xl bg-blue-600/10 dark:bg-blue-600/15 border border-blue-500/25 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white font-serif">{filteredEmployees.length} Staff</div>
          <div className="flex items-center gap-1 text-[11px] text-teal-600 dark:text-teal-400 mt-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>100% Onboarding verified</span>
          </div>
        </div>

        {/* Card 2 */}
        <div
          onClick={() => setActivePortalTab('recruitment')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer group shadow-sm dark:shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">ATS Active Pipeline</span>
            <div className="w-9 h-9 rounded-xl bg-teal-600/10 dark:bg-teal-600/15 border border-teal-500/25 flex items-center justify-center text-teal-600 dark:text-teal-400 group-hover:scale-105 transition-transform">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white font-serif">{activeCandidatesCount} Candidates</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Across {filteredJobs.length} open job positions
          </div>
        </div>

        {/* Card 3 */}
        <div
          onClick={() => setActivePortalTab(isSuperAdmin || isConsultant ? 'consultations' : 'leave')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer group shadow-sm dark:shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {isSuperAdmin || isConsultant ? 'Pending Consultations' : 'Pending Leave Requests'}
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-105 transition-transform">
              {isSuperAdmin || isConsultant ? <Calendar className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white font-serif">
            {isSuperAdmin || isConsultant ? pendingConsultationsCount : pendingLeaveCount} Action Items
          </div>
          <div className="text-[11px] text-amber-600 dark:text-amber-400 mt-1">Requires review & response</div>
        </div>

        {/* Card 4 */}
        <div
          onClick={() => setActivePortalTab('payroll')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer group shadow-sm dark:shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Monthly Gross Payroll</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-600/10 dark:bg-emerald-600/15 border border-emerald-500/25 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white font-serif">
            BDT {totalPayrollCost > 0 ? totalPayrollCost.toLocaleString() : '51,170'}
          </div>
          <div className="text-[11px] text-teal-600 dark:text-teal-400 mt-1">Processed for Sept 2026</div>
        </div>
      </div>

      {/* Main split sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Recent Activities & Candidate Pipeline */}
        <div className="lg:col-span-8 space-y-6">
          {/* Active Job Openings Preview */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white font-serif">
                  Active Recruitment Projects (ATS)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Current positions accepting candidate screening</p>
              </div>
              <button
                onClick={() => setActivePortalTab('recruitment')}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 flex items-center gap-1"
              >
                <span>View ATS Board</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {filteredJobs.map((job) => (
                <div
                  key={job.id}
                  onClick={() => setActivePortalTab('recruitment')}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 hover:border-blue-400 dark:hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">{job.position}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700 font-semibold">
                        {job.status}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {job.department} &bull; {job.location} &bull; Salary: {job.salaryRange}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <div className="text-right">
                      <div className="font-bold text-teal-600 dark:text-teal-400">{job.candidateCount} Applicants</div>
                      <div className="text-[10px] text-slate-500">Recruiter: {job.assignedRecruiter}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Leaves & Approvals */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white font-serif">
                  Leave Requests & Time-Off Approvals
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Employee balance check & supervisor review</p>
              </div>
              <button
                onClick={() => setActivePortalTab('leave')}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 flex items-center gap-1"
              >
                <span>Leave Center</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {filteredLeave.map((lv) => (
                <div
                  key={lv.id}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-600/15 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
                      {lv.employeeName.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-900 dark:text-white">{lv.employeeName}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {lv.leaveType} &bull; {lv.daysCount} Day(s) ({lv.startDate} to {lv.endDate})
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] px-2.5 py-1 rounded-full font-semibold ${lv.status === 'Approved'
                        ? 'bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                        : lv.status === 'Rejected'
                          ? 'bg-rose-500/15 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 border border-rose-500/30'
                          : 'bg-amber-500/15 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30'
                      }`}
                  >
                    {lv.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: CRM Leads / Org Info / SLA Status */}
        <div className="lg:col-span-4 space-y-6">
          {/* Organization Profile Badge (For Client Admin or Super Admin) */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              Account Status & SLA
            </h3>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 space-y-2.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">Active Package:</span>
                <span className="text-teal-600 dark:text-teal-400 font-bold">Corporate HR Suite</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">Senior Lead Advisor:</span>
                <span className="text-slate-900 dark:text-white font-medium">Farzana Chowdhury</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">Statutory Compliance:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  100% Certified
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">Confidentiality Agreement:</span>
                <span className="text-blue-600 dark:text-blue-300 font-mono text-[11px]">NDA-2025-V4</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs text-slate-500 dark:text-slate-400">
              <span>Next Review: Oct 15, 2026</span>
              <button
                onClick={() => setActivePortalTab('documents')}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-semibold"
              >
                View Documents &rarr;
              </button>
            </div>
          </div>

          {/* CRM Leads Quick Pipeline (If Admin / Consultant) */}
          {(isSuperAdmin || isConsultant) && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white font-serif">Inbound CRM Pipeline</h3>
                <button
                  onClick={() => setActivePortalTab('leads')}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-semibold"
                >
                  View All &rarr;
                </button>
              </div>

              <div className="space-y-2.5">
                {leads.slice(0, 4).map((lead) => (
                  <div
                    key={lead.id}
                    onClick={() => setActivePortalTab('leads')}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 hover:border-blue-400 dark:hover:border-slate-700 cursor-pointer transition-all"
                  >
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-900 dark:text-white">
                      <span className="truncate">{lead.company}</span>
                      <span className="text-teal-600 dark:text-teal-400">BDT {lead.estimatedValue.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      <span>{lead.contactPerson}</span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-mono text-[10px]">
                        {lead.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
