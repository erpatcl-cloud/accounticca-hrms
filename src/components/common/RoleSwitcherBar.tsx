import React from 'react';
import { useApp } from '../../context/AppContext';
import { Role } from '../../types';
import { ShieldCheck, UserCheck, Briefcase, Building2, User, Globe, ArrowRight } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export const RoleSwitcherBar: React.FC = () => {
  const { currentView, currentUser, switchRole, currentPath, navigateTo } = useApp();

  const roles: { role: Role; label: string; name: string; org: string; icon: any }[] = [
    {
      role: 'super_admin',
      label: 'Super Admin',
      name: 'H. M. Ekram',
      org: 'Accounticca HQ',
      icon: ShieldCheck,
    },
    {
      role: 'hr_consultant',
      label: 'HR Consultant',
      name: 'Farzana Chowdhury',
      org: 'Senior Advisory',
      icon: Briefcase,
    },
    {
      role: 'recruitment_manager',
      label: 'Recruiter (ATS)',
      name: 'Tariq Al-Mansoor',
      org: 'Talent Acquisition',
      icon: UserCheck,
    },
    {
      role: 'client_admin',
      label: 'Client Admin',
      name: 'Sophia Vance',
      org: 'Apex Tech (Client)',
      icon: Building2,
    },
    {
      role: 'employee',
      label: 'Employee (ESS)',
      name: 'Marcus Chen',
      org: 'Staff Portal',
      icon: User,
    },
  ];

  return (
    <aside
      aria-label="Demo environment switcher"
      className="bg-slate-100/95 dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 py-1.5 px-3 text-center relative z-50 transition-colors"
    >
      <div className="w-full max-w-none ml-[0px] mr-[0px] pl-[0px] pr-[0px] flex flex-nowrap items-center justify-center gap-2 whitespace-nowrap overflow-x-auto">
        <div className="flex flex-nowrap items-center gap-1.5 shrink-0">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700/50 font-semibold tracking-wide uppercase text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400 animate-pulse"></span>
            Demo RBAC Switcher
          </span>
          <span className="text-slate-500 dark:text-slate-400 hidden 2xl:inline">
            Experience multi-tenant isolation across roles:
          </span>
        </div>

        <div className="flex flex-nowrap items-center gap-1 shrink-0">
          {roles.map((r) => {
            const Icon = r.icon;
            const isActive = currentView === 'portal' && currentUser.role === r.role;
            return (
              <button
                key={r.role}
                onClick={() => {
                  switchRole(r.role);
                  const targetPath =
                    r.role === 'employee'
                      ? '/portal/my-portal'
                      : r.role === 'recruitment_manager'
                      ? '/portal/recruitment'
                      : '/portal/overview';
                  navigateTo(targetPath);
                }}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all font-medium cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-500 dark:ring-blue-400'
                    : 'bg-white dark:bg-slate-800 hover:bg-slate-200/70 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200/80 dark:border-transparent'
                }`}
                title={`Switch to ${r.label} (${r.name})`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-200' : 'text-blue-600 dark:text-blue-300'}`} />
                <span>{r.label}</span>
              </button>
            );
          })}

          <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-1 hidden sm:block"></div>

          <button
            onClick={() => navigateTo(currentView === 'public' ? '/portal/overview' : '/')}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md transition-all font-semibold cursor-pointer ${
              currentView === 'public'
                ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-500 dark:ring-emerald-400'
                : 'bg-white dark:bg-slate-800 hover:bg-slate-200/70 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-transparent'
            }`}
          >
            {currentView === 'public' ? (
              <>
                <Globe className="w-3.5 h-3.5" />
                <span>Public Website</span>
              </>
            ) : (
              <>
                <span>View Public Site</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>

          <span
            title="Current Active Page URL"
            className="hidden md:inline-flex items-center px-2 py-0.5 rounded bg-slate-200/80 dark:bg-slate-800 text-[10px] font-mono text-slate-600 dark:text-teal-400 border border-slate-300/70 dark:border-slate-700"
          >
            {currentPath}
          </span>

          <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-1 hidden sm:block"></div>

          <ThemeToggle variant="pill" />
        </div>
      </div>
    </aside>
  );
};
