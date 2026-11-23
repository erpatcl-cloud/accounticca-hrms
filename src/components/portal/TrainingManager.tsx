import React from 'react';
import { useApp } from '../../context/AppContext';

export const TrainingManager: React.FC = () => {
  const { trainingPrograms, enrollInTraining } = useApp();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-serif tracking-tight">
            Learning & Development (L&D)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Corporate masterclasses, leadership transition workshops, and mandatory compliance certifications
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {trainingPrograms.map((prog) => (
          <div
            key={prog.id}
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-slate-700 transition-all flex flex-col justify-between shadow-sm dark:shadow-xl"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-500/15 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-400/30 uppercase">
                  {prog.category}
                </span>
                <span className="text-xs font-semibold text-teal-600 dark:text-teal-400">{prog.status}</span>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white font-serif mb-2">{prog.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">{prog.description}</p>

              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 border-t border-slate-200 dark:border-slate-800 pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Instructor:</span>
                  <span className="font-medium text-slate-900 dark:text-white">{prog.trainer}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Duration:</span>
                  <span className="font-mono">{prog.durationHours} Hours</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Target Audience:</span>
                  <span className="truncate max-w-[150px]">{prog.targetAudience}</span>
                </div>
              </div>

              {/* Completion Progress Bar */}
              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800">
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-500 dark:text-slate-400">Cohort Completion:</span>
                  <span className="text-teal-600 dark:text-teal-400 font-bold font-mono">{prog.completionRate}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-teal-400 h-1.5 rounded-full"
                    style={{ width: `${prog.completionRate}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {prog.enrolledCount} Staff Enrolled
              </span>

              <button
                onClick={() => enrollInTraining(prog.id)}
                className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all shadow-md"
              >
                Enroll Staff
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
