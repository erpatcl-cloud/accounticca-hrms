import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Calendar,
  Lock,
  ChevronRight,
} from 'lucide-react';

interface HeroProps {
  onNavigateSection: (sectionId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigateSection }) => {
  const { setConsultationModalOpen, navigateTo } = useApp();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 text-slate-900 dark:text-white py-14 sm:py-20 lg:py-24 transition-colors">
      {/* Background ambient decorative glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-blue-600/10 to-teal-500/10 dark:from-blue-600/20 dark:to-teal-500/15 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute -top-10 right-0 w-96 h-96 bg-blue-500/10 blur-[90px] pointer-events-none rounded-full" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* Main Copy */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-sm backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-teal-500 dark:bg-teal-400 animate-pulse"></span>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                Management Consulting &bull; Digital HR &bull; Payroll
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-950 dark:text-white font-serif leading-[1.12]">
              Transform Your People.{' '}
              <span className="block mt-1 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-teal-600 to-emerald-600 dark:from-blue-400 dark:via-teal-300 dark:to-emerald-400">
                Strengthen Your Business.
              </span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              End-to-end HR management, recruitment, compliance, payroll and digital HR solutions designed to help organizations build stronger teams and better workplaces.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={() => setConsultationModalOpen(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl font-bold text-base text-white bg-gradient-to-r from-blue-600 via-blue-500 to-teal-600 hover:from-blue-500 hover:to-teal-500 shadow-xl shadow-blue-600/30 hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <Calendar className="w-5 h-5 text-teal-100" />
                <span>Book a Consultation</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                onClick={() => navigateTo('/services')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold text-base text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 shadow-sm transition-all hover:text-slate-950 dark:hover:text-white cursor-pointer"
              >
                <span>Explore Our Services</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* Trust checkmarks */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>Zero Legal Non-Compliance Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>100% Confidential NDA Execution</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>Proprietary Cloud HRMS & ATS</span>
              </div>
            </div>

            {/* Executive Team Preview Strip */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 border-t border-slate-200/80 dark:border-slate-800/80">
              <div className="flex -space-x-2.5">
                <img
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200"
                  alt="Ekramul Haque"
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-white dark:ring-slate-900"
                />
                <img
                  src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200"
                  alt="Farzana Chowdhury"
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-white dark:ring-slate-900"
                />
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200"
                  alt="Tariq Al-Mansoor"
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-white dark:ring-slate-900"
                />
                <img
                  src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200"
                  alt="Dr. Oliver Kensington"
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-white dark:ring-slate-900"
                />
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400">
                <span className="font-bold text-slate-900 dark:text-white">450+ Enterprise Clients</span> managed by certified SHRM & statutory labor specialists.
              </div>
            </div>
          </div>

          {/* Interactive Feature & Metric Showcase Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer decorative card */}
              <div className="relative rounded-3xl bg-white/95 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700/70 overflow-hidden shadow-2xl backdrop-blur-xl">
                {/* Visual Executive Consulting Banner Image */}
                <div className="relative h-44 w-full overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=1000"
                    alt="Accounticca Executive HR Advisory & Digital People Operations"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
                  <div className="absolute bottom-3 left-5 right-5 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-blue-600/90 text-white flex items-center justify-center shadow-md">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white font-serif">
                          Executive HR Health Index
                        </h4>
                        <p className="text-[11px] text-slate-300">Accounticca Governance Suite</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[11px] font-semibold backdrop-blur-md">
                      Optimal (99.4%)
                    </span>
                  </div>
                </div>

                <div className="p-6 sm:p-7">
                  {/* Key indicators */}
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-slate-700 dark:text-slate-300 font-medium">Statutory Labor Law Compliance</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">100% Fully Compliant</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-500 to-emerald-400 h-2 rounded-full w-full"></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-slate-700 dark:text-slate-300 font-medium">ATS Recruitment Velocity (Avg. Time to Hire)</span>
                        <span className="text-blue-600 dark:text-blue-400 font-bold">14 Days (Industry Avg: 48d)</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-500 to-teal-400 h-2 rounded-full w-[88%]"></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-slate-700 dark:text-slate-300 font-medium">Payroll Accuracy & On-Time Rate</span>
                        <span className="text-teal-600 dark:text-teal-300 font-bold">100.0% Error-Free</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div className="bg-teal-500 dark:bg-teal-400 h-2 rounded-full w-full"></div>
                      </div>
                    </div>
                  </div>

                  {/* Highlight badges grid */}
                  <div className="grid grid-cols-2 gap-3 pt-5">
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                      <div className="text-xs text-slate-500 dark:text-slate-400">Active Retainer Clients</div>
                      <div className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">450+ Orgs</div>
                      <div className="text-[10px] text-teal-600 dark:text-teal-400 mt-0.5">Across 10 key sectors</div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                      <div className="text-xs text-slate-500 dark:text-slate-400">Monthly Payroll Disbursed</div>
                      <div className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">BDT 18M+ /mo</div>
                      <div className="text-[10px] text-blue-600 dark:text-blue-400 mt-0.5">Withholding & Tax automated</div>
                    </div>
                  </div>

                  {/* Card CTA trigger */}
                  <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-ping" />
                      <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                        Consultants available today
                      </span>
                    </div>
                    <button
                      onClick={() => navigateTo('/consultation')}
                      className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>Check Availability</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Floating mini badge 1 */}
              <div className="hidden sm:flex items-center gap-3 absolute -bottom-5 -left-6 bg-white dark:bg-slate-900/95 border border-slate-200 dark:border-slate-700 p-3 rounded-2xl shadow-xl backdrop-blur-md">
                <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
                  96%
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">First-Year Retention</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Pre-screened ATS candidates</div>
                </div>
              </div>

              {/* Floating mini badge 2 */}
              <div className="hidden sm:flex items-center gap-2.5 absolute -top-4 -right-4 bg-white dark:bg-slate-900/95 border border-slate-200 dark:border-slate-700 p-2.5 px-3.5 rounded-2xl shadow-xl backdrop-blur-md">
                <Lock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Bank-Grade Data Isolation</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
