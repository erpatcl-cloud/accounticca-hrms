import React from 'react';
import { useApp } from '../../context/AppContext';
import { Star } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const { testimonials } = useApp();

  return (
    <section className="bg-white dark:bg-slate-900 py-24 border-t border-slate-200 dark:border-slate-800 relative transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-500/30 text-xs font-semibold uppercase tracking-wider mb-3">
            Client Endorsements
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white font-serif tracking-tight">
            Trusted by Chief Executives & People Leaders
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-300 text-base sm:text-lg">
            Read how Accounticca HRM Solutions transforms growing organizations into high-retention workplaces.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((tst) => (
            <div
              key={tst.id}
              className="rounded-3xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 p-8 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-md dark:shadow-xl relative group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(tst.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30">
                    {tst.metricHighlight}
                  </span>
                </div>

                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed italic mb-6">
                  "{tst.content}"
                </p>
              </div>

              <div className="flex items-center gap-3.5 pt-4 border-t border-slate-200 dark:border-slate-800/80">
                <img
                  src={tst.avatar}
                  alt={tst.name}
                  className="w-12 h-12 rounded-full object-cover border border-slate-300 dark:border-slate-700 shadow-sm"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white font-serif">{tst.name}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {tst.position}, <strong className="text-slate-800 dark:text-slate-300">{tst.company}</strong>
                  </p>
                  <p className="text-[10px] text-teal-600 dark:text-teal-400 font-medium">{tst.industry}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
