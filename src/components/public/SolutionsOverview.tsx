import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Compass,
  Users,
  ShieldCheck,
  Receipt,
  Target,
  Briefcase,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export const SolutionsOverview: React.FC<{ onExploreServices: () => void }> = ({ onExploreServices }) => {
  const { setConsultationModalOpen, setSelectedServiceModal, servicesCatalog } = useApp();

  const pillars = [
    {
      srvId: 'srv_consulting',
      icon: Compass,
      title: 'Strategic HR Consulting',
      tag: 'Governance & Audits',
      desc: 'Organizational restructuring, competency mapping, workforce planning, and turnkey HR department setups aligned with executive targets.',
      highlights: ['Diagnostic HR Gap Audit', 'Org Charts & Grading Bands', 'Leadership Succession Planning'],
    },
    {
      srvId: 'srv_recruitment',
      icon: Users,
      title: 'Talent Acquisition & ATS',
      tag: 'Executive Search & RPO',
      desc: 'High-velocity candidate sourcing, 360 technical evaluation, structured interview scorecards, and 14-day average time-to-hire.',
      highlights: ['Pre-vetted Top 5% Talent', '14-Day Placement Velocity', '90-Day Replacement Guarantee'],
    },
    {
      srvId: 'srv_compliance',
      icon: ShieldCheck,
      title: 'Policy & Labor Compliance',
      tag: 'Legal Protection',
      desc: 'Bespoke employee handbooks, enforceable non-disclosure/IP agreements, anti-harassment (POSH) frameworks, and audit readiness.',
      highlights: ['Master Employee Handbook', 'Anti-Harassment SOPs', '100% Statutory Legal Defense'],
    },
    {
      srvId: 'srv_payroll',
      icon: Receipt,
      title: 'Payroll & Compensation',
      tag: 'Financial Precision',
      desc: 'Automated gross-to-net calculations, configurable tax rules, social security withholdings, digital payslips, and salary benchmarking.',
      highlights: ['100% On-Time Guarantee', 'Configurable Tax Rules', 'Digital Payslips with ESS'],
    },
    {
      srvId: 'srv_performance',
      icon: Target,
      title: 'Performance & OKRs',
      tag: 'High Execution Culture',
      desc: 'Quarterly OKRs, departmental KPIs, 360-degree appraisal cycles, and defensible Performance Improvement Plans (PIPs).',
      highlights: ['Company-to-Staff OKRs', '360 Appraisal Scoring', 'Transparent Merit Ladders'],
    },
    {
      srvId: 'srv_managed',
      icon: Briefcase,
      title: 'Managed HR Outsourcing',
      tag: 'Your Complete Department',
      desc: 'A dedicated senior HR director and team running your day-to-day employee relations, hiring, and compliance for a predictable monthly fee.',
      highlights: ['Dedicated Senior Consultant', 'Full Day-to-Day Administration', 'Saves up to 60% vs In-House'],
    },
  ];

  return (
    <section className="bg-slate-50 dark:bg-slate-950 py-24 border-t border-slate-200 dark:border-slate-800 relative transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30 text-xs font-semibold uppercase tracking-wider mb-3">
              Comprehensive Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white font-serif tracking-tight">
              End-to-End People Infrastructure for Modern Enterprises
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-300 text-base sm:text-lg">
              We replace fragmented vendors and ad-hoc practices with a single, accountable corporate partner.
            </p>
          </div>

          <button
            onClick={onExploreServices}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 text-slate-800 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white font-semibold text-sm transition-all flex-shrink-0 shadow-xs"
          >
            <span>Explore All 9 Services</span>
            <ArrowRight className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            const fullSrv = servicesCatalog.find((s) => s.id === p.srvId);

            return (
              <div
                key={idx}
                className="relative rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/90 hover:border-blue-400 dark:hover:border-blue-500/50 hover:bg-white dark:hover:bg-slate-900 transition-all overflow-hidden flex flex-col justify-between group shadow-md hover:shadow-xl dark:shadow-lg dark:hover:shadow-blue-900/10"
              >
                <div>
                  {fullSrv?.imageUrl && (
                    <div
                      onClick={() => setSelectedServiceModal(fullSrv)}
                      className="relative h-44 w-full overflow-hidden cursor-pointer"
                    >
                      <img
                        src={fullSrv.imageUrl}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />
                      <div className="absolute top-3 left-4 right-4 flex items-center justify-between">
                        <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-900/80 text-white border border-white/15 backdrop-blur-md">
                          {p.tag}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900/75 text-teal-300 border border-teal-400/25">
                          /services/{fullSrv.slug}
                        </span>
                      </div>
                      <div className="absolute bottom-3 left-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-600/95 text-white flex items-center justify-center shadow-lg">
                          <Icon className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="p-7 pb-4">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white font-serif mb-2.5 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">
                      {p.title}
                    </h3>

                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                      {p.desc}
                    </p>

                    <div className="space-y-2 border-t border-slate-200 dark:border-slate-800/80 pt-4">
                      {p.highlights.map((h, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 flex-shrink-0" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="px-7 py-4 bg-slate-50/70 dark:bg-slate-950/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => fullSrv && setSelectedServiceModal(fullSrv)}
                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>View Deliverables & Process</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setConsultationModalOpen(true)}
                    className="text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                  >
                    Consult
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
