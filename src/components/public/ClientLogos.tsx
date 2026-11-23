import React from 'react';

export const ClientLogos: React.FC = () => {
  const clients = [
    { name: 'Apex Technologies', sector: 'Enterprise SaaS' },
    { name: 'Vertex Industrial', sector: 'Heavy Manufacturing' },
    { name: 'Horizon Health', sector: 'Healthcare Systems' },
    { name: 'FinServe Capital', sector: 'Financial Advisory' },
    { name: 'CloudScale AI', sector: 'Artificial Intelligence' },
    { name: 'Pacific Vanguard', sector: 'Supply Chain & Logistics' },
    { name: 'Global Aid Initiative', sector: 'NGO & Development' },
    { name: 'BlueHarbor Resorts', sector: 'Hospitality & Leisure' },
  ];

  return (
    <section className="bg-slate-50 dark:bg-slate-950 py-12 border-y border-slate-200 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400 font-semibold">
            Trusted by Leaders Across Startups, SMEs & Global Enterprises
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 sm:gap-6 items-center">
          {clients.map((client, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 hover:border-blue-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all flex flex-col items-center justify-center text-center group shadow-xs"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 font-serif font-bold text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {client.name.charAt(0)}
              </div>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-300 mt-2 line-clamp-1 group-hover:text-slate-950 dark:group-hover:text-white">
                {client.name}
              </span>
              <span className="text-[10px] text-slate-500 line-clamp-1">{client.sector}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
