import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Compass,
  Cpu,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export const ProcessSection: React.FC = () => {
  const { setConsultationModalOpen } = useApp();

  const steps = [
    {
      num: '01',
      icon: Search,
      title: 'Diagnostic HR & Risk Audit',
      timeline: 'Days 1 - 7',
      desc: 'We conduct a comprehensive audit of employment contracts, handbook policies, payroll registers, and labor law exposures to identify structural gaps.',
      deliverable: 'Executive HR Maturity & Risk Gap Matrix',
    },
    {
      num: '02',
      icon: Compass,
      title: 'Strategic People Architecture',
      timeline: 'Days 8 - 15',
      desc: 'We formulate tailored organizational charts, job grading bands, compliant employee handbooks, and clear KRA / OKR performance rubrics.',
      deliverable: 'Master HR Blueprint & Policy Governance Handbook',
    },
    {
      num: '03',
      icon: Cpu,
      title: 'Digital HRMS & ATS Deployment',
      timeline: 'Days 16 - 22',
      desc: 'We migrate employee records to our cloud portal, configure automated payroll rules, set up biometric shift syncing, and launch active candidate pipelines.',
      deliverable: 'Live Cloud Portal & Active ATS Sourcing Channels',
    },
    {
      num: '04',
      icon: ShieldCheck,
      title: 'Dedicated Operational Takeover',
      timeline: 'Day 23 Onward',
      desc: 'Your dedicated Senior HR Consultant and team take over day-to-day employee inquiries, disciplinary matters, recruiting, and monthly payroll.',
      deliverable: '100% On-Time Payroll & Direct Staff Support Channel',
    },
    {
      num: '05',
      icon: TrendingUp,
      title: 'Continuous Governance & Reporting',
      timeline: 'Monthly & Quarterly',
      desc: 'Executive board presentations on headcount costs, retention metrics, statutory compliance changes, and talent pipeline health.',
      deliverable: 'Monthly C-Suite People Analytics Report',
    },
  ];

  return (
    <section id="process-section" className="bg-slate-50 dark:bg-slate-950 py-24 border-t border-slate-200 dark:border-slate-800 relative transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-500/30 text-xs font-semibold uppercase tracking-wider mb-3">
            Structured Methodology
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white font-serif tracking-tight">
            Our 5-Step Engagement & Onboarding Process
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-300 text-base sm:text-lg">
            We follow a rigorous, battle-tested consulting roadmap ensuring seamless transitions with zero interruption to your daily business operations.
          </p>
        </div>

        <div className="relative">
          {/* Desktop timeline connector line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 via-teal-500 to-blue-600 -translate-y-12 z-0 opacity-40" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 relative z-10">
            {steps.map((st, idx) => {
              const Icon = st.icon;
              return (
                <div
                  key={idx}
                  className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between hover:border-teal-500/50 hover:bg-slate-50 dark:hover:bg-slate-900/90 transition-all shadow-md dark:shadow-xl group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500 dark:from-blue-400 dark:to-teal-300">
                        {st.num}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {st.timeline}
                      </span>
                    </div>

                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-600/15 border border-blue-200 dark:border-blue-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white font-serif mb-2">
                      {st.title}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                      {st.desc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80">
                    <div className="flex items-start gap-1.5 text-[11px] text-teal-600 dark:text-teal-400 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                      <span>{st.deliverable}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-14 text-center">
          <button
            onClick={() => setConsultationModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-500 hover:to-teal-500 text-white font-semibold text-xs transition-all shadow-md shadow-blue-600/30"
          >
            <span>Start Step 1: Request Your Diagnostic Audit</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
