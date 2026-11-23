import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Compass,
  Users,
  ShieldCheck,
  Receipt,
  Target,
  GraduationCap,
  Building,
  Cpu,
  Briefcase,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export const ServicesSection: React.FC = () => {
  const { servicesCatalog, setSelectedServiceModal, setConsultationModalOpen } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    'All',
    'Strategic Advisory',
    'Talent Sourcing',
    'Legal & Risk',
    'Financial Operations',
    'Talent Growth',
    'HR Technology',
    'Full Outsourcing',
  ];

  const filteredServices =
    selectedCategory === 'All'
      ? servicesCatalog
      : servicesCatalog.filter((s) => s.category === selectedCategory);

  const getIcon = (name: string) => {
    switch (name) {
      case 'Compass':
        return Compass;
      case 'Users':
        return Users;
      case 'ShieldCheck':
        return ShieldCheck;
      case 'Receipt':
        return Receipt;
      case 'Target':
        return Target;
      case 'GraduationCap':
        return GraduationCap;
      case 'Building':
        return Building;
      case 'Cpu':
        return Cpu;
      case 'Briefcase':
      default:
        return Briefcase;
    }
  };

  return (
    <section id="services-section" className="bg-white dark:bg-slate-900 py-24 relative border-t border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30 text-xs font-semibold uppercase tracking-wider mb-3">
            Our 9 Core Practice Areas
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white font-serif tracking-tight">
            Specialized HR Services Tailored for Commercial Impact
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-300 text-base sm:text-lg">
            Whether you require an executive search partner, a complete statutory compliance overhaul, or turnkey HR department outsourcing, our senior practitioners deliver guaranteed results.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-1 ring-blue-400'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((srv) => {
            const Icon = getIcon(srv.iconName);
            return (
              <div
                key={srv.id}
                className="rounded-3xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 hover:border-blue-400/60 dark:hover:border-blue-600/60 hover:bg-white dark:hover:bg-slate-950 transition-all overflow-hidden flex flex-col justify-between group shadow-sm hover:shadow-xl dark:shadow-lg"
              >
                <div>
                  {/* Content-Matched Service Banner Image */}
                  <div
                    onClick={() => setSelectedServiceModal(srv)}
                    className="relative h-48 w-full overflow-hidden cursor-pointer"
                  >
                    <img
                      src={srv.imageUrl}
                      alt={srv.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent" />
                    <div className="absolute top-3.5 left-4 right-4 flex items-center justify-between">
                      <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-900/80 text-white border border-white/15 backdrop-blur-md">
                        {srv.category}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-900/75 text-teal-300 border border-teal-400/25 backdrop-blur-md">
                        /services/{srv.slug}
                      </span>
                    </div>
                    <div className="absolute bottom-3.5 left-4">
                      <div className="w-11 h-11 rounded-2xl bg-blue-600/95 text-white border border-blue-400/40 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pb-4">
                    <h3
                      onClick={() => setSelectedServiceModal(srv)}
                      className="text-xl font-bold text-slate-900 dark:text-white font-serif mb-2.5 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors cursor-pointer"
                    >
                      {srv.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-5">
                      {srv.shortDesc}
                    </p>

                    <div className="space-y-2 border-t border-slate-200 dark:border-slate-800/80 pt-4">
                      <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold block mb-1">
                        Key Deliverables:
                      </span>
                      {srv.deliverables.slice(0, 3).map((del, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{del}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 bg-slate-100/60 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedServiceModal(srv)}
                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Explore Service Page</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setConsultationModalOpen(true)}
                    className="text-xs font-medium px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer"
                  >
                    Consult
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-blue-50 via-slate-50 to-teal-50 dark:from-blue-950/60 dark:via-slate-900 dark:to-slate-950 border border-blue-200 dark:border-blue-800/40 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white font-serif">
              Need a Custom Cross-Functional HR Scope?
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
              We design modular scopes combining compliance audits, ATS recruiting, and payroll management under a single master SLA.
            </p>
          </div>
          <button
            onClick={() => setConsultationModalOpen(true)}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-md flex-shrink-0"
          >
            Talk to an HR Consultant
          </button>
        </div>
      </div>
    </section>
  );
};
