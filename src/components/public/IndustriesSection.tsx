import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  Rocket,
  Cpu,
  Factory,
  HeartHandshake,
  Stethoscope,
  UtensilsCrossed,
  ShoppingBag,
  Landmark,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Award,
} from 'lucide-react';

export const IndustriesSection: React.FC = () => {
  const { industriesCatalog, setConsultationModalOpen } = useApp();
  const [activeIndustryId, setActiveIndustryId] = useState<string>(industriesCatalog[0]?.id || 'ind_startups');

  const activeIndustry =
    industriesCatalog.find((i) => i.id === activeIndustryId) || industriesCatalog[0];

  const getIndustryIcon = (id: string) => {
    switch (id) {
      case 'ind_startups':
        return Rocket;
      case 'ind_smes':
        return Building2;
      case 'ind_corporate':
        return Landmark;
      case 'ind_it':
        return Cpu;
      case 'ind_mfg':
        return Factory;
      case 'ind_ngo':
        return HeartHandshake;
      case 'ind_healthcare':
        return Stethoscope;
      case 'ind_hospitality':
        return UtensilsCrossed;
      case 'ind_retail':
        return ShoppingBag;
      case 'ind_finance':
      default:
        return Landmark;
    }
  };

  return (
    <section id="industries-section" className="bg-slate-50 dark:bg-slate-950 py-24 border-t border-slate-200 dark:border-slate-800 relative transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-500/30 text-xs font-semibold uppercase tracking-wider mb-3">
            Industry Specialization
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white font-serif tracking-tight">
            Tailored HR Solutions Across 10 Core Industry Sectors
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-300 text-base sm:text-lg">
            Human resources cannot follow a generic template. We deploy industry-specific legal templates, compensation benchmarks, and compliance protocols for your sector.
          </p>
        </div>

        {/* Industry Selector Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mb-10">
          {industriesCatalog.map((ind) => {
            const Icon = getIndustryIcon(ind.id);
            const isSelected = ind.id === activeIndustryId;
            return (
              <button
                key={ind.id}
                onClick={() => setActiveIndustryId(ind.id)}
                className={`p-3.5 rounded-2xl flex flex-col items-center justify-center text-center transition-all border ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-500 dark:border-blue-400 shadow-lg shadow-blue-600/30'
                    : 'bg-white dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 mb-2 ${isSelected ? 'text-white' : 'text-blue-600 dark:text-blue-400'}`} />
                <span className="text-xs font-semibold line-clamp-1">{ind.name}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Industry Detail Card */}
        {activeIndustry && (
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 overflow-hidden shadow-xl dark:shadow-2xl animate-in fade-in duration-150">
            {/* Industry Visual Hero Banner */}
            <div className="relative h-64 sm:h-72 w-full overflow-hidden">
              <img
                src={activeIndustry.imageUrl}
                alt={activeIndustry.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/65 to-slate-950/20" />
              <div className="absolute bottom-6 left-6 right-6 sm:left-10 sm:right-10 flex flex-col lg:flex-row lg:items-end justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 border border-teal-400/30 text-xs font-bold uppercase tracking-wider text-teal-300 backdrop-blur-md">
                      Sector Blueprint
                    </span>
                    <span className="text-xs font-mono text-slate-300 bg-slate-900/80 px-2.5 py-0.5 rounded-md border border-slate-700">
                      /industries#{activeIndustry.slug}
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white font-serif">
                    {activeIndustry.name}
                  </h3>
                  <p className="text-sm sm:text-base text-slate-200 mt-1.5 max-w-2xl">
                    {activeIndustry.tagline}
                  </p>
                </div>

                <button
                  onClick={() => setConsultationModalOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-500 hover:to-teal-500 text-white font-semibold text-xs transition-all shadow-lg flex-shrink-0 cursor-pointer"
                >
                  <span>Schedule {activeIndustry.name} Consultation</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-6 sm:p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Challenges */}
                <div className="p-6 rounded-2xl bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/20">
                  <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-sm mb-4">
                    <AlertCircle className="w-4 h-4" />
                    <span>Sector-Specific HR Challenges</span>
                  </div>
                  <ul className="space-y-3">
                    {activeIndustry.challenges.map((ch, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 dark:bg-amber-400 mt-1.5 flex-shrink-0" />
                        <span>{ch}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Accounticca Solutions */}
                <div className="p-6 rounded-2xl bg-blue-50 dark:bg-blue-500/5 border border-blue-200 dark:border-blue-500/20">
                  <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-bold text-sm mb-4">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Accounticca Customized Frameworks</span>
                  </div>
                  <ul className="space-y-3">
                    {activeIndustry.solutions.map((sol, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-600 dark:bg-teal-400 mt-1.5 flex-shrink-0" />
                        <span>{sol}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Case Highlight */}
              <div className="mt-8 p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
                <Award className="w-5 h-5 text-teal-600 dark:text-teal-400 flex-shrink-0" />
                <div className="text-xs text-slate-700 dark:text-slate-300">
                  <strong className="text-slate-900 dark:text-white font-semibold mr-1">Proven Result:</strong>
                  {activeIndustry.caseHighlight}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
