import React from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, FileText } from 'lucide-react';

export const FloatingCTA: React.FC = () => {
  const { setConsultationModalOpen, setSelectedPackageModal, packagesCatalog } = useApp();

  return (
    <div className="fixed bottom-4 right-4 z-40 sm:bottom-6 sm:right-6">
      <div className="flex items-center gap-2 bg-white/95 dark:bg-slate-950/90 backdrop-blur-md p-1.5 sm:p-2 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-2xl transition-colors">
        <button
          onClick={() => {
            setSelectedPackageModal(packagesCatalog[3]); // Managed HR as default recommendation
          }}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700"
        >
          <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>Request Proposal</span>
        </button>

        <button
          onClick={() => setConsultationModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-blue-600 via-blue-500 to-teal-500 hover:from-blue-500 hover:to-teal-400 transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-[0.98]"
        >
          <Calendar className="w-4 h-4 text-teal-100 animate-pulse" />
          <span>Book Consultation</span>
        </button>
      </div>
    </div>
  );
};
