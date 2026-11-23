import React from 'react';
import { useApp } from '../../context/AppContext';
import { TrendingUp, Quote } from 'lucide-react';

export const CaseStudiesSection: React.FC = () => {
  const { caseStudies, setConsultationModalOpen } = useApp();

  return (
    <section id="case-studies-section" className="bg-slate-50 dark:bg-slate-950 py-24 border-t border-slate-200 dark:border-slate-800 relative transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30 text-xs font-semibold uppercase tracking-wider mb-3">
            Real Proof & Metrics
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white font-serif tracking-tight">
            Proven Results in High-Stakes Business Environments
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-300 text-base sm:text-lg">
            See how Accounticca helped our clients eliminate operational bloat, survive regulatory audits, and scale top-tier talent.
          </p>
        </div>

        <div className="space-y-12">
          {caseStudies.map((cs) => (
            <div
              key={cs.id}
              id={cs.slug}
              className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl dark:shadow-2xl"
            >
              {/* Content-Matched Case Study Banner Image */}
              {cs.imageUrl && (
                <div className="relative h-56 sm:h-64 w-full overflow-hidden">
                  <img
                    src={cs.imageUrl}
                    alt={cs.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
                  <div className="absolute bottom-5 left-6 right-6 sm:left-10 sm:right-10">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-xs font-semibold px-3 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30 backdrop-blur-md">
                        {cs.industry}
                      </span>
                      <span className="text-xs text-slate-300">&bull; {cs.clientType}</span>
                      {cs.slug && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900/80 text-slate-300 border border-slate-700">
                          /case-studies#{cs.slug}
                        </span>
                      )}
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-white font-serif tracking-tight">
                      {cs.title}
                    </h3>
                  </div>
                </div>
              )}

              <div className="p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-4">
                  {!cs.imageUrl && (
                    <>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-500/30">
                          {cs.industry}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">&bull; {cs.clientType}</span>
                      </div>

                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-serif tracking-tight">
                        {cs.title}
                      </h3>
                    </>
                  )}

                  <div className="space-y-3">
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80">
                      <strong className="text-xs text-amber-600 dark:text-amber-400 block mb-1">The Operational Challenge:</strong>
                      <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{cs.challenge}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80">
                      <strong className="text-xs text-blue-600 dark:text-blue-400 block mb-1">Accounticca Solution Deployed:</strong>
                      <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{cs.solution}</p>
                    </div>
                  </div>

                  <div className="pt-2 flex items-start gap-3">
                    <Quote className="w-5 h-5 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-1 opacity-60" />
                    <div>
                      <p className="text-xs sm:text-sm italic text-slate-700 dark:text-slate-300">"{cs.quote}"</p>
                      <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-1 block">
                        — {cs.quoteAuthor}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between h-full">
                  <h4 className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    <span>Audited Performance Metrics</span>
                  </h4>

                  <div className="space-y-4">
                    {cs.metrics.map((m, i) => (
                      <div key={i} className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <div className="text-xs text-slate-500 dark:text-slate-400">{m.label}</div>
                        <div className="text-xl font-extrabold text-teal-600 dark:text-teal-300 font-serif mt-0.5">
                          {m.value}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 text-center">
                    <button
                      onClick={() => setConsultationModalOpen(true)}
                      className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-md cursor-pointer"
                    >
                      Achieve Similar Results for Your Business
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
