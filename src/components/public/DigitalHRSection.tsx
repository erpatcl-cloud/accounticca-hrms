import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Cpu,
  Laptop,
  Users2,
  Receipt,
  Clock,
  BarChart3,
  Lock,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export const DigitalHRSection: React.FC = () => {
  const { switchRole, navigateTo } = useApp();

  const features = [
    {
      icon: Users2,
      title: 'Integrated ATS Candidate Pipeline',
      desc: 'Drag-and-drop candidate management, automated resume scoring, and structured interview rubrics.',
    },
    {
      icon: Receipt,
      title: 'Automated Gross-to-Net Payroll Engine',
      desc: 'Dynamic tax bracket calculations, instant encrypted payslip generation, and compliant direct deposits.',
    },
    {
      icon: Clock,
      title: 'Biometric & Geo-Fenced Attendance',
      desc: 'Real-time shift clock-in, automated overtime tracking, and single-click leave request approvals.',
    },
    {
      icon: Laptop,
      title: 'Employee Self-Service (ESS) Portal',
      desc: 'Staff can download tax slips, request leave, review company policies, and view OKRs from mobile or web.',
    },
    {
      icon: BarChart3,
      title: 'Executive People Analytics & Reports',
      desc: 'Live headcount cost breakdowns, department turnover indices, and exportable audit documentation.',
    },
    {
      icon: Lock,
      title: 'Bank-Grade Tenant Security & RBAC',
      desc: 'Role-based access control, isolated multi-tenant schemas, and comprehensive audit logging.',
    },
  ];

  return (
    <section className="bg-white dark:bg-slate-900 py-24 border-t border-slate-200 dark:border-slate-800 relative overflow-hidden transition-colors">
      {/* Decorative gradient glow */}
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Tech Overview */}
          <div className="lg:col-span-5 space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30 text-xs font-semibold uppercase tracking-wider">
              <Cpu className="w-3.5 h-3.5" />
              Proprietary Cloud HR Platform
            </span>

            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white font-serif tracking-tight leading-tight">
              Enterprise HR Technology Included With Every Engagement
            </h2>

            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
              Why pay tens of thousands in separate software subscriptions for Workday, BambooHR, and Greenhouse? Accounticca clients receive full access to our integrated cloud HRMS, ATS, payroll engine, and Employee Self-Service platform.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 flex-shrink-0" />
                <span>Zero additional software licensing fees for client organizations</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 flex-shrink-0" />
                <span>Instant employee onboarding with automatic login credentials</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 flex-shrink-0" />
                <span>Strict multi-tenant data isolation and exportable audit logs</span>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  switchRole('client_admin');
                  navigateTo('/portal/overview');
                }}
                className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <span>Open Client Admin Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  switchRole('employee');
                  navigateTo('/portal/my-portal');
                }}
                className="px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
              >
                View Employee Portal (/portal/my-portal)
              </button>
            </div>
          </div>

          {/* Right Column: Visual Platform Banner + Feature Cards Grid */}
          <div className="lg:col-span-7 space-y-5">
            <div className="relative h-52 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200"
                alt="Accounticca Cloud HRMS & People Analytics Suite"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent flex items-center p-6 sm:p-8">
                <div className="max-w-md space-y-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30 text-[11px] font-semibold">
                    Live Cloud HRMS Platform
                  </span>
                  <h3 className="text-xl font-bold text-white font-serif">
                    Unified Cloud HRMS, ATS & Payroll Dashboard
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Real-time multi-tenant analytics, automated payslips, and employee self-service accessible at <span className="font-mono text-teal-300">/portal</span>.
                  </p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100/60 dark:hover:bg-slate-950 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-600/15 border border-blue-200 dark:border-blue-500/30 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white font-serif mb-1.5">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
