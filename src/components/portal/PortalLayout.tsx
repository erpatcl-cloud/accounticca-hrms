import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ThemeToggle } from '../common/ThemeToggle';
import { CompanyProfileModal } from './CompanyProfileModal';
import {
  LayoutDashboard,
  Users2,
  Calendar,
  Briefcase,
  UserCheck,
  Building2,
  Receipt,
  Clock,
  CalendarDays,
  Target,
  GraduationCap,
  FolderLock,
  BarChart3,
  FileText,
  FileSpreadsheet,
  Settings,
  ShieldAlert,
  Bell,
  Globe,
  LogOut,
  LogIn,
  ChevronDown,
  Menu,
  X,
  User,
  ShieldCheck,
} from 'lucide-react';

interface PortalLayoutProps {
  children: React.ReactNode;
}

export const PortalLayout: React.FC<PortalLayoutProps> = ({ children }) => {
  const {
    currentUser,
    setCurrentUser,
    switchRole,
    availableUsers,
    setCurrentView,
    activePortalTab,
    setActivePortalTab,
    setLoginModalOpen,
    logout,
    selectedOrgIdFilter,
    setSelectedOrgIdFilter,
    organizations,
    updateOrganization,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  } = useApp();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [clientProfileOpen, setClientProfileOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Role permissions check for navigation items
  const isSuperAdmin = currentUser.role === 'super_admin';
  const isConsultant = currentUser.role === 'hr_consultant';
  const isClientAdmin = currentUser.role === 'client_admin';
  const isEmployee = currentUser.role === 'employee';

  const navItems = [
    {
      id: 'overview',
      label: 'Dashboard Overview',
      icon: LayoutDashboard,
      roles: ['super_admin', 'hr_consultant', 'recruitment_manager', 'client_admin'],
    },
    {
      id: 'companies',
      label: 'Companies & Tenants',
      icon: Building2,
      badge: 'Tenants',
      roles: ['super_admin'],
    },
    {
      id: 'company_sheet',
      label: 'Company Google Sheet',
      icon: FileSpreadsheet,
      badge: 'Live',
      roles: ['client_admin'],
    },
    {
      id: 'company_profile',
      label: 'My Company Profile',
      icon: Building2,
      badge: 'Settings',
      roles: ['client_admin'],
    },
    {
      id: 'my_portal',
      label: 'My Staff Portal (ESS)',
      icon: User,
      roles: ['employee'],
    },
    {
      id: 'leads',
      label: 'Leads CRM',
      icon: Users2,
      badge: 'CRM',
      roles: ['super_admin', 'hr_consultant'],
    },
    {
      id: 'consultations',
      label: 'Consultation Bookings',
      icon: Calendar,
      roles: ['super_admin', 'hr_consultant'],
    },
    {
      id: 'recruitment',
      label: 'Recruitment & ATS',
      icon: Briefcase,
      badge: 'Pipeline',
      roles: ['super_admin', 'hr_consultant', 'recruitment_manager', 'client_admin'],
    },
    {
      id: 'candidates',
      label: 'Candidates Database',
      icon: UserCheck,
      roles: ['super_admin', 'hr_consultant', 'recruitment_manager', 'client_admin'],
    },
    {
      id: 'employees',
      label: 'Employee Directory',
      icon: Building2,
      roles: ['super_admin', 'hr_consultant', 'client_admin'],
    },
    {
      id: 'payroll',
      label: 'Payroll & Payslips',
      icon: Receipt,
      roles: ['super_admin', 'hr_consultant', 'client_admin'],
    },
    {
      id: 'tax',
      label: 'Income Tax',
      icon: FileText,
      roles: ['super_admin', 'hr_consultant', 'client_admin'],
    },
    {
      id: 'attendance',
      label: 'Attendance & Clock',
      icon: Clock,
      roles: ['super_admin', 'hr_consultant', 'client_admin', 'employee'],
    },
    {
      id: 'leave',
      label: 'Leave Management',
      icon: CalendarDays,
      roles: ['super_admin', 'hr_consultant', 'client_admin', 'employee'],
    },
    {
      id: 'performance',
      label: 'Performance & OKRs',
      icon: Target,
      roles: ['super_admin', 'hr_consultant', 'client_admin', 'employee'],
    },
    {
      id: 'training',
      label: 'Learning & Dev (L&D)',
      icon: GraduationCap,
      roles: ['super_admin', 'hr_consultant', 'client_admin', 'employee'],
    },
    {
      id: 'documents',
      label: 'Documents & Policies',
      icon: FolderLock,
      roles: ['super_admin', 'hr_consultant', 'client_admin', 'employee'],
    },
    {
      id: 'analytics',
      label: 'HR Analytics & Reports',
      icon: BarChart3,
      roles: ['super_admin', 'hr_consultant', 'client_admin'],
    },
    {
      id: 'invoices',
      label: 'Invoices & Billing',
      icon: FileText,
      roles: ['super_admin', 'hr_consultant', 'client_admin'],
    },
    {
      id: 'cms',
      label: 'Website CMS & Blog',
      icon: Settings,
      roles: ['super_admin'],
    },
    {
      id: 'google_workspace',
      label: 'Google Workspace Hub',
      icon: Globe,
      roles: ['super_admin'],
    },
    {
      id: 'audit',
      label: 'Audit & Security Logs',
      icon: ShieldAlert,
      roles: ['super_admin'],
    },
  ];

  const visibleNavItems = navItems.filter((item) => item.roles.includes(currentUser.role));

  const handleTabClick = (tabId: string) => {
    if (tabId === 'company_profile') {
      setClientProfileOpen(true);
      setMobileSidebarOpen(false);
      return;
    }
    setActivePortalTab(tabId);
    setMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6 transition-colors duration-200">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Brand Logo in Portal */}
          <div
            onClick={() => setCurrentView('public')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-700 to-teal-400 p-0.5">
              <div className="w-full h-full bg-white dark:bg-slate-950 rounded-[6px] flex items-center justify-center font-bold font-serif text-teal-600 dark:text-teal-300 text-sm">
                A
              </div>
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-bold text-slate-900 dark:text-white font-serif tracking-tight flex items-center gap-1.5">
                <span>Accounticca</span>
                <span className="text-[10px] px-1 py-0.2 rounded bg-blue-500/15 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/30 dark:border-blue-400/30 uppercase">
                  HRM
                </span>
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Enterprise B2B Suite</div>
            </div>
          </div>
        </div>

        {/* Tenant Filter & Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {(isSuperAdmin || isConsultant) && (
            <div className="hidden md:flex items-center gap-2 bg-slate-100 dark:bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Tenant View:</span>
              <select
                value={selectedOrgIdFilter}
                onChange={(e) => setSelectedOrgIdFilter(e.target.value)}
                className="bg-transparent text-slate-900 dark:text-white font-semibold focus:outline-none cursor-pointer"
              >
                <option value="all" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                  All Organizations ({organizations.length})
                </option>
                {organizations.map((org) => (
                  <option key={org.id} value={org.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                    {org.name} ({org.activePackage})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Client Admin or Employee Tenant Badge */}
          {(isClientAdmin || isEmployee) && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs">
              <Building2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span className="text-slate-900 dark:text-white font-semibold">{currentUser.organizationName}</span>
              <span className="px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/50 text-[10px] text-blue-700 dark:text-blue-300 font-mono">
                Tenant Isolated
              </span>
            </div>
          )}

          {/* Return to Public Website */}
          <button
            onClick={() => setCurrentView('public')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>Public Site</span>
          </button>

          {/* Theme Toggle */}
          <ThemeToggle variant="compact" />

          {/* Notifications Trigger */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors relative border border-slate-200 dark:border-slate-700/60"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-teal-500 text-slate-950 font-bold text-[10px] rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      In-App Notifications
                    </h4>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-teal-500/15 dark:bg-teal-500/20 text-teal-700 dark:text-teal-300 font-semibold">
                      {unreadCount} New
                    </span>
                  </div>
                  <button
                    onClick={markAllNotificationsAsRead}
                    className="text-[11px] text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-medium"
                  >
                    Mark all read
                  </button>
                </div>

                <div className="py-2 space-y-2 max-h-72 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markNotificationAsRead(n.id);
                        if (n.linkAction) setActivePortalTab(n.linkAction);
                        setNotificationsOpen(false);
                      }}
                      className={`p-2.5 rounded-xl transition-all cursor-pointer border ${
                        n.read
                          ? 'bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800/80 text-slate-500 dark:text-slate-400'
                          : 'bg-blue-50/70 dark:bg-slate-800/90 border-blue-300 dark:border-blue-500/30 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-900 dark:text-white mb-0.5">
                        <span className="line-clamp-1">{n.title}</span>
                        <span className="text-[10px] text-slate-500 font-normal">{n.time}</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2.5 p-1.5 pr-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700/60"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 rounded-lg object-cover"
              />
              <div className="text-left hidden md:block">
                <div className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                  {currentUser.role.replace('_', ' ')}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            </button>

            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in">
                <div className="p-2.5 border-b border-slate-200 dark:border-slate-800 text-xs">
                  <div className="font-bold text-slate-900 dark:text-white">{currentUser.name}</div>
                  <div className="text-slate-500 dark:text-slate-400 text-[11px] truncate">{currentUser.email}</div>
                  <div className="text-teal-600 dark:text-teal-400 text-[10px] font-semibold mt-1">
                    {currentUser.designation}
                  </div>
                </div>

                <div className="py-1 max-h-64 overflow-y-auto">
                  <div className="px-2.5 py-1 text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">
                    Switch Active Persona ({availableUsers.length}):
                  </div>
                  {availableUsers.map((u) => {
                    const isSelected = currentUser.id === u.id || currentUser.email === u.email;
                    return (
                      <button
                        key={u.id || u.email}
                        onClick={() => {
                          setCurrentUser(u);
                          if (u.role === 'employee') {
                            setActivePortalTab('my_portal');
                          } else if (u.role === 'client_admin') {
                            setActivePortalTab('overview');
                          }
                          setUserDropdownOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition cursor-pointer ${
                          isSelected
                            ? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        <div className="truncate">
                          <div className="font-semibold truncate">{u.name}</div>
                          <div className="text-[10px] text-slate-500 truncate">
                            {u.role.replace('_', ' ').toUpperCase()} · {u.organizationName}
                          </div>
                        </div>
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 ml-1"></span>}
                      </button>
                    );
                  })}
                </div>

                <div className="pt-1 border-t border-slate-200 dark:border-slate-800 space-y-0.5">
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      setLoginModalOpen(true);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-blue-600 dark:text-teal-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 flex items-center justify-between cursor-pointer"
                  >
                    <span>Switch / Sign In</span>
                    <LogIn className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      logout();
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 flex items-center justify-between cursor-pointer"
                  >
                    <span>Sign Out (Logout)</span>
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Body with Sidebar + Content */}
      <div className="flex-1 flex min-h-0">
        {/* Sidebar Desktop */}
        <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 justify-between transition-colors duration-200">
          <div className="space-y-1 overflow-y-auto max-h-[calc(100vh-8rem)]">
            <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Navigation Menu
            </div>

            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePortalTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 ring-1 ring-blue-400'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-mono uppercase ${
                        isActive ? 'bg-blue-700 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Sidebar bottom card */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-semibold mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Multi-Tenant Isolated</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Role: <strong className="text-slate-900 dark:text-white">{currentUser.role.replace('_', ' ').toUpperCase()}</strong>
            </p>
            <p className="text-[10px] text-slate-500 mt-1 truncate">
              {currentUser.organizationName}
            </p>
          </div>
        </aside>

        {/* Mobile Sidebar Drawer */}
        {mobileSidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-md flex">
            <div className="w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 flex flex-col justify-between h-full animate-in slide-in-from-left duration-200">
              <div className="space-y-1 overflow-y-auto">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Navigation
                  </span>
                  <button onClick={() => setMobileSidebarOpen(false)} className="p-1 text-slate-500 dark:text-slate-400">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {visibleNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activePortalTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleTabClick(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold ${
                        isActive
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => {
                    setMobileSidebarOpen(false);
                    setCurrentView('public');
                  }}
                  className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold"
                >
                  Return to Public Website
                </button>
              </div>
            </div>
            <div className="flex-1" onClick={() => setMobileSidebarOpen(false)} />
          </div>
        )}

        {/* Content Area */}
        <main className="flex-1 min-w-0 overflow-y-auto bg-slate-50 dark:bg-slate-950 p-4 sm:p-5 lg:p-6 transition-colors duration-200">
          <div className="max-w-[1600px] w-full mx-auto min-w-0">{children}</div>
        </main>
      </div>

      {isClientAdmin && (
        <CompanyProfileModal
          organization={organizations.find((o) => o.id === currentUser.organizationId) || null}
          isOpen={clientProfileOpen}
          onClose={() => setClientProfileOpen(false)}
          onSave={(updatedOrg) => updateOrganization(updatedOrg)}
          onOpenGoogleSheet={() => {
            setClientProfileOpen(false);
            setActivePortalTab('company_sheet');
          }}
        />
      )}
    </div>
  );
};
