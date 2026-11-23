import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Building2,
  Calendar,
  Layers,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

export const ServiceDetailModal: React.FC = () => {
  const { selectedServiceModal, setSelectedServiceModal, setConsultationModalOpen } = useApp();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  if (!selectedServiceModal) return null;

  const srv = selectedServiceModal;

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 dark:bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Modal Top Header with Content-Matched Banner Image */}
        <div className="relative px-6 sm:px-8 py-8 bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between overflow-hidden">
          {srv.imageUrl && (
            <div className="absolute inset-0 opacity-30">
              <img src={srv.imageUrl} alt={srv.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-900/70" />
            </div>
          )}
          <div className="relative z-10">
            <div className="flex flex-wrap items-center gap-2 mb-2.5">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 uppercase tracking-wider">
                {srv.category}
              </span>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-md bg-slate-800/90 text-teal-300 border border-slate-700">
                /services/{srv.slug}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-serif tracking-tight">
              {srv.title}
            </h2>
            <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              {srv.shortDesc}
            </p>
          </div>

          <button
            onClick={() => setSelectedServiceModal(null)}
            className="relative z-10 p-2 rounded-xl text-slate-300 hover:text-white bg-slate-800/70 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 space-y-8 overflow-y-auto flex-1">
          {/* Business Problems & Accounticca Solution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/20">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-sm mb-3">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>Critical Business Problems Solved</span>
              </div>
              <ul className="space-y-2.5">
                {srv.problems.map((prob, i) => (
                  <li key={i} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 dark:bg-amber-400 mt-1.5 flex-shrink-0" />
                    <span>{prob}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-blue-50 dark:bg-blue-500/5 border border-blue-200 dark:border-blue-500/20">
              <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-bold text-sm mb-3">
                <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                <span>Our Solution Architecture</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {srv.solution}
              </p>
              <div className="mt-3 text-[11px] text-teal-700 dark:text-teal-400 font-semibold">
                Guaranteed SLA-backed deliverables with executive sign-off.
              </div>
            </div>
          </div>

          {/* Tangible Deliverables */}
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-serif mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>Concrete Deliverables & Assets Provided</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {srv.deliverables.map((item, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex items-start gap-2.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-800 dark:text-slate-200 font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 4-Step Consulting Process */}
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-serif mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Our Execution Methodology</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {srv.processSteps.map((st, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 relative group"
                >
                  <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">{st.step}</span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1 mb-1.5">{st.title}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{st.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Business Benefits & Industries */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white font-serif mb-3">
                Measurable Business ROI & Benefits
              </h4>
              <ul className="space-y-2">
                {srv.benefits.map((ben, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                    <span>{ben}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white font-serif mb-3 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <span>Industries Served</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {srv.industriesServed.map((ind, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] border border-slate-200 dark:border-slate-700"
                  >
                    {ind}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* FAQs Accordion */}
          {srv.faqs && srv.faqs.length > 0 && (
            <div className="border-t border-slate-200 dark:border-slate-800 pt-6">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white font-serif mb-3 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>Frequently Asked Questions</span>
              </h4>
              <div className="space-y-2">
                {srv.faqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 overflow-hidden"
                  >
                    <button
                      onClick={() => toggleFaq(idx)}
                      className="w-full p-3.5 text-left flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white"
                    >
                      <span>{faq.q}</span>
                      {openFaqIndex === idx ? (
                        <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      )}
                    </button>
                    {openFaqIndex === idx && (
                      <div className="px-3.5 pb-3.5 text-xs text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-900 pt-2 leading-relaxed">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Sticky Bottom Action Footer */}
        <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Have custom requirements or multi-jurisdiction teams?
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => setSelectedServiceModal(null)}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800"
            >
              Close
            </button>
            <button
              onClick={() => {
                setSelectedServiceModal(null);
                setConsultationModalOpen(true);
              }}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-500 hover:to-teal-500 text-white font-semibold text-xs transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Talk to an HR Consultant</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
