import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PerformanceReview } from '../../types';
import {
  Award,
  Star,
  AlertTriangle,
  X,
} from 'lucide-react';

export const PerformanceManager: React.FC = () => {
  const { performanceReviews, currentUser, selectedOrgIdFilter } = useApp();

  const isClientAdmin = currentUser.role === 'client_admin';
  const isEmployee = currentUser.role === 'employee';
  const targetOrgId = isClientAdmin ? currentUser.organizationId : selectedOrgIdFilter;

  const [selectedReview, setSelectedReview] = useState<PerformanceReview | null>(null);

  const filteredReviews = performanceReviews.filter((p) => {
    if (isEmployee) {
      return p.employeeId === currentUser.id || p.employeeName === currentUser.name;
    }
    return targetOrgId === 'all' || p.organizationId === targetOrgId;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-serif tracking-tight">
            Performance Management, OKRs & 360 Appraisals
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Quarterly objectives, KRA weighting rubrics, and defensible promotion & PIP ladders
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Average Org Performance</span>
            <div className="w-8 h-8 rounded-lg bg-blue-600/10 dark:bg-blue-600/15 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Star className="w-4 h-4 fill-blue-500 dark:fill-blue-400" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white font-serif">4.75 / 5.0</div>
          <div className="text-[11px] text-teal-600 dark:text-teal-400 mt-1">94% OKR completion velocity</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Promotion Ready Candidates</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-600/10 dark:bg-emerald-600/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-serif">2 Identified</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Recommended for senior leadership</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Active PIPs (Improvement)</span>
            <div className="w-8 h-8 rounded-lg bg-amber-600/10 dark:bg-amber-600/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 font-serif">0 Under PIP</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">All employees meeting or exceeding SLAs</div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((rev) => (
          <div
            key={rev.id}
            onClick={() => setSelectedReview(rev)}
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-slate-700 transition-all cursor-pointer shadow-sm dark:shadow-xl space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/15 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center font-serif">
                  {rev.employeeName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{rev.employeeName}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {rev.department} &bull; {rev.reviewPeriod}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                  {rev.recommendation}
                </span>
                <span className="text-sm font-bold text-amber-600 dark:text-amber-400 font-mono">
                  Score: {rev.finalScore} / 5.0
                </span>
              </div>
            </div>

            {/* OKR Progress Bars */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Active Strategic Objectives & Key Results (OKRs):
              </span>
              {rev.okrs.map((okr, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-900 dark:text-white font-medium">{okr.objective}</span>
                    <span className="text-teal-600 dark:text-teal-400 font-bold font-mono">{okr.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden mb-1.5">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-teal-400 h-1.5 rounded-full"
                      style={{ width: `${okr.progress}%` }}
                    />
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">{okr.keyResult}</div>
                </div>
              ))}
            </div>

            {/* Key Strengths Feedback */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-semibold block mb-0.5">Executive Review Summary:</span>
              <p className="text-slate-700 dark:text-slate-300 italic">{rev.strengths}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Review Detail Modal */}
      {selectedReview && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-2xl overflow-hidden my-8 p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white font-serif">{selectedReview.employeeName}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Formal Appraisal Dossier &bull; {selectedReview.reviewPeriod}</p>
              </div>
              <button onClick={() => setSelectedReview(null)} className="p-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Detailed KPIs Score table */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                Evaluated Key Performance Indicators (KPIs)
              </h4>
              <div className="space-y-2">
                {selectedReview.kpis.map((kpi, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">{kpi.title}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Target: {kpi.target} &bull; Achieved: <strong className="text-teal-600 dark:text-teal-400">{kpi.achieved}</strong>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-slate-900 dark:text-white">{kpi.score}%</div>
                      <div className="text-[10px] text-slate-500">Weight: {kpi.weightage}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 block mb-1">Self Assessment Score:</span>
                <span className="text-base font-bold text-blue-600 dark:text-blue-400 font-mono">{selectedReview.selfScore} / 5.0</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 block mb-1">Manager Assessment Score:</span>
                <span className="text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono">{selectedReview.managerScore} / 5.0</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs space-y-1">
              <span className="font-bold text-teal-600 dark:text-teal-400 block">Promotion Recommendation:</span>
              <p className="text-slate-800 dark:text-slate-200">{selectedReview.recommendation}</p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedReview(null)}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-white rounded-xl text-xs font-semibold"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
