import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  CheckCircle2,
  ArrowRight,
  Clock,
} from 'lucide-react';

export const PackagesSection: React.FC = () => {
  const { packagesCatalog, setSelectedPackageModal, setConsultationModalOpen } = useApp();

  return (
    <section id="packages-section" className="bg-white dark:bg-slate-900 py-24 border-t border-slate-200 dark:border-slate-800 relative transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30 text-xs font-semibold uppercase tracking-wider mb-3">
            Engagement Models
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white font-serif tracking-tight">
            Flexible HR Packages Designed to Scale With Your Headcount
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-300 text-base sm:text-lg">
            No fixed rigid fees. Every engagement is scoped to your exact organizational headcount, required service modules, and SLA speed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {packagesCatalog.map((pkg) => {
            const isFeatured = pkg.id === 'pkg_managed' || pkg.id === 'pkg_sme';
            return (
              <div
                key={pkg.id}
                className={`relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all shadow-lg dark:shadow-xl ${
                  pkg.id === 'pkg_managed'
                    ? 'bg-gradient-to-b from-teal-50/70 via-white to-slate-50 dark:from-blue-950 dark:via-slate-900 dark:to-slate-950 border-2 border-teal-500/60 shadow-teal-500/10'
                    : isFeatured
                    ? 'bg-slate-50 dark:bg-slate-950 border-2 border-blue-500/60 shadow-blue-500/10'
                    : 'bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {pkg.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-md ${
                        pkg.id === 'pkg_managed'
                          ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950'
                          : 'bg-blue-600 text-white'
                      }`}
                    >
                      {pkg.badge}
                    </span>
                  </div>
                )}

                <div>
                  {/* Package Visual Banner */}
                  <div className="relative h-36 -mx-6 -mt-6 sm:-mx-7 sm:-mt-7 mb-5 rounded-t-3xl overflow-hidden">
                    <img
                      src={pkg.imageUrl}
                      alt={pkg.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/35 to-transparent" />
                    <div className="absolute bottom-3 left-5 right-5">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900/80 text-teal-300 border border-slate-700">
                        /packages#{pkg.slug}
                      </span>
                      <h3 className="text-xl font-bold text-white font-serif mt-1">{pkg.name}</h3>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs text-slate-500 dark:text-slate-400">{pkg.subtitle}</p>
                    <div className="mt-2.5 inline-block px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-300 text-[11px] font-semibold border border-slate-200 dark:border-slate-800">
                      {pkg.targetCompany}
                    </div>
                  </div>

                  <div className="my-4 p-3 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/80">
                    <div className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                      <strong className="text-slate-900 dark:text-slate-200 block mb-0.5">Value Focus:</strong>
                      {pkg.highlight}
                    </div>
                  </div>

                  <div className="space-y-2.5 pt-2">
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 block">
                      Included Capabilities:
                    </span>
                    {pkg.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800/80 space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>SLA Response:</span>
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-300">{pkg.slaResponse}</span>
                  </div>

                  <button
                    onClick={() => setSelectedPackageModal(pkg)}
                    className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 ${
                      pkg.id === 'pkg_managed'
                        ? 'bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950'
                        : 'bg-blue-600 hover:bg-blue-500 text-white'
                    }`}
                  >
                    <span>Request a Proposal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="text-center">
                    <button
                      onClick={() => setConsultationModalOpen(true)}
                      className="text-[11px] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
                    >
                      Or Book Discovery Call &rarr;
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Managed HR Deep-Dive Banner */}
        <div className="mt-14 p-8 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
              Flagship Managed Partnership
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-serif">
              "Your HR Department, Managed by Us."
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
              No need to hire an in-house HR Director, recruiter, and payroll clerk separately. We assign a dedicated senior consultant and operational team running recruitment, contracts, employee handbooks, monthly payroll, and disciplinary hearings with complete accountability.
            </p>
          </div>

          <button
            onClick={() => setSelectedPackageModal(packagesCatalog[3])}
            className="px-6 py-3.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-teal-500/20 flex-shrink-0"
          >
            Explore Managed HR Proposal
          </button>
        </div>
      </div>
    </section>
  );
};
