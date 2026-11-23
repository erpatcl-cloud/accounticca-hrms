import React from 'react';
import {
  AlertTriangle,
  FileWarning,
  DollarSign,
  UserX,
  Layers,
  ArrowRight,
  TrendingDown,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ChallengesSection: React.FC = () => {
  const { setConsultationModalOpen } = useApp();

  const challenges = [
    {
      icon: UserX,
      title: 'Costly Bad Hires & Prolonged Vacancies',
      desc: 'Filling specialized roles takes an average of 48+ days, resulting in lost revenue, burnt-out managers, and up to 3x salary loss on failed probationary hires.',
      stat: '48 Days',
      statLabel: 'Industry avg. time-to-hire without modern ATS',
    },
    {
      icon: FileWarning,
      title: 'Statutory Labor Non-Compliance Liabilities',
      desc: 'Outdated employment contracts, improper contractor classification, and unclear overtime handling leave businesses exposed to hefty fines and litigation.',
      stat: '1 in 3',
      statLabel: 'Un-audited companies face labor inspection warnings',
    },
    {
      icon: DollarSign,
      title: 'Manual, Error-Prone Payroll & Tax Headaches',
      desc: 'Relying on spreadsheets leads to inaccurate tax deductions, delayed salary disbursements, disaffected employees, and complex regulatory penalties.',
      stat: '18% Error Rate',
      statLabel: 'Reported in manual, non-automated payroll setups',
    },
    {
      icon: Layers,
      title: 'Lack of an Internal HR Department',
      desc: 'Founders, CFOs, and operations leaders spend 25-35% of their working hours troubleshooting routine employee queries, onboarding, and disputes.',
      stat: '30% Time Lost',
      statLabel: 'Leadership focus diverted from commercial growth',
    },
    {
      icon: TrendingDown,
      title: 'Culture Drift & High Attrition in Top 10% Talent',
      desc: 'Without transparent career paths, OKRs, and objective 360 reviews, high-performing employees seek greener pastures while underperformers stagnate.',
      stat: '42% Attrition',
      statLabel: 'Stemming directly from ambiguous promotion criteria',
    },
  ];

  return (
    <section className="bg-white dark:bg-slate-900 py-20 lg:py-28 relative transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30 text-xs font-semibold uppercase tracking-wider mb-3">
            <AlertTriangle className="w-3.5 h-3.5" />
            The Growth Dilemma
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white font-serif tracking-tight">
            Why Growing Organizations Struggle With People Operations
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-300 text-base sm:text-lg">
            As your headcount expands, informal HR habits become your largest liability. Without strategic frameworks, organizations suffer from legal exposure and lost productivity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.slice(0, 3).map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-7 rounded-3xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100/70 dark:hover:bg-slate-950 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white font-serif mb-2.5">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800/80">
                  <div className="text-xl font-bold text-amber-600 dark:text-amber-400">{item.stat}</div>
                  <div className="text-[11px] text-slate-500">{item.statLabel}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {challenges.slice(3, 5).map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-7 rounded-3xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100/70 dark:hover:bg-slate-950 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white font-serif mb-2.5">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800/80">
                  <div className="text-xl font-bold text-amber-600 dark:text-amber-400">{item.stat}</div>
                  <div className="text-[11px] text-slate-500">{item.statLabel}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Transition prompt to solution */}
        <div className="mt-12 text-center">
          <p className="text-slate-600 dark:text-slate-300 text-sm mb-4">
            You don't need to navigate this alone or overhire internal overhead.
          </p>
          <button
            onClick={() => setConsultationModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-600/30"
          >
            <span>Request a Complimentary HR Health Diagnostic</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
