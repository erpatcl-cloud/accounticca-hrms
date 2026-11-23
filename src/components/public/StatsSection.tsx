import React from 'react';
import { Award, TrendingUp, Users, DollarSign, Clock, ShieldCheck } from 'lucide-react';

export const StatsSection: React.FC = () => {
  const stats = [
    {
      label: 'Corporate Clients Retained',
      value: '450+',
      sub: 'Across 10 key industries',
      icon: Users,
    },
    {
      label: 'Monthly Payroll Processed',
      value: 'BDT 18M+',
      sub: '100% on-time disbursement',
      icon: DollarSign,
    },
    {
      label: 'Average Time-to-Hire',
      value: '14 Days',
      sub: 'vs 48 days industry average',
      icon: Clock,
    },
    {
      label: 'Labor Audit Compliance',
      value: '99.4%',
      sub: 'Zero statutory penalties',
      icon: ShieldCheck,
    },
    {
      label: 'Professional Hires Placed',
      value: '4,200+',
      sub: '96% 1st-year retention',
      icon: Award,
    },
    {
      label: 'Client Retention Rate',
      value: '98.7%',
      sub: 'Annual recurring partnerships',
      icon: TrendingUp,
    },
  ];

  return (
    <section className="bg-slate-50 dark:bg-slate-950 py-16 border-y border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {stats.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div key={idx} className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 text-center shadow-xs">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-600/15 border border-blue-200 dark:border-blue-500/25 flex items-center justify-center mx-auto mb-2.5 text-blue-600 dark:text-blue-400">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-serif tracking-tight">
                  {s.value}
                </div>
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">{s.label}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{s.sub}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
