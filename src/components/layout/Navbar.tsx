import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ChevronDown,
  Menu,
  X,
  PhoneCall,
  LogIn,
  LayoutDashboard,
  ShieldCheck,
  UserPlus,
  Sparkles,
} from 'lucide-react';
import { ThemeToggle } from '../common/ThemeToggle';

interface NavbarProps {
  onNavigateSection: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigateSection }) => {
  const {
    setConsultationModalOpen,
    setLoginModalOpen,
    servicesCatalog,
    setSelectedServiceModal,
    publicSubPage,
    currentPath,
    navigateTo,
    isAuthenticated,
    currentUser,
  } = useApp();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [resourcesDropdownOpen, setResourcesDropdownOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [portalDropdownOpen, setPortalDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeAllMenus = () => {
    setMobileMenuOpen(false);
    setServicesDropdownOpen(false);
    setResourcesDropdownOpen(false);
    setAboutDropdownOpen(false);
    setPortalDropdownOpen(false);
  };

  const handleRouteClick = (path: string) => {
    closeAllMenus();
    navigateTo(path);
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-lg shadow-slate-900/5 border-b border-slate-200/90 dark:border-slate-800'
          : 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/70'
      }`}
    >
      {/* Top Signature Gradient Accent Line */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-teal-500 to-indigo-600" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 w-full gap-4">
          {/* Logo & Brand Identity */}
          <div
            onClick={() => handleRouteClick('/')}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <img
              src="https://i.ibb.co/B80P15W/BLUE.png"
              onError={(e) => {
                const target = e.currentTarget;
                if (target.src !== 'https://i.ibb.co.com/B80P15W/BLUE.png') {
                  target.src = 'https://i.ibb.co.com/B80P15W/BLUE.png';
                }
              }}
              alt="Accounticca HRM Solutions"
              className="h-11 sm:h-12 w-auto object-contain group-hover:scale-105 transition-transform duration-200"
            />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 whitespace-nowrap">
            <button
              onClick={() => handleRouteClick('/')}
              className={`px-3 py-2 text-sm font-medium rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                publicSubPage === 'home' && currentPath === '/'
                  ? 'text-blue-600 dark:text-teal-400 font-semibold bg-blue-50/80 dark:bg-blue-950/50 shadow-2xs'
                  : 'text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
              }`}
            >
              Home
            </button>

            {/* About Dropdown (About Us, Our Team, Our Client) */}
            <div
              className="relative"
              onMouseEnter={() => setAboutDropdownOpen(true)}
              onMouseLeave={() => setAboutDropdownOpen(false)}
            >
              <button
                type="button"
                onClick={() => handleRouteClick('/about')}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  publicSubPage === 'about'
                    ? 'text-blue-600 dark:text-teal-400 font-semibold bg-blue-50/80 dark:bg-blue-950/50 shadow-2xs'
                    : 'text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
                }`}
              >
                <span>About</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                    aboutDropdownOpen ? 'rotate-180 text-blue-600 dark:text-teal-400' : ''
                  }`}
                />
              </button>

              {aboutDropdownOpen && (
                <div className="absolute top-full left-0 pt-2 w-64 z-50">
                  <div className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-2xl shadow-2xl flex flex-col gap-1 animate-in fade-in duration-150">
                    <button
                      onClick={() => handleRouteClick('/about')}
                      className="w-full text-left px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-white rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/95 transition-colors cursor-pointer"
                    >
                      <div className="font-semibold flex items-center justify-between">
                        <span>About Us</span>
                        <span className="text-[10px] font-mono text-slate-400">/about</span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Our vision, mission &amp; enterprise ethos
                      </div>
                    </button>

                    <button
                      onClick={() => handleRouteClick('/about/team')}
                      className="w-full text-left px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-white rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/95 transition-colors cursor-pointer"
                    >
                      <div className="font-semibold flex items-center justify-between">
                        <span>Our Leadership Team</span>
                        <span className="text-[10px] font-mono text-slate-400">/about/team</span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Senior HR principals &amp; advisors
                      </div>
                    </button>

                    <button
                      onClick={() => handleRouteClick('/about/clients')}
                      className="w-full text-left px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-white rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/95 transition-colors cursor-pointer"
                    >
                      <div className="font-semibold flex items-center justify-between">
                        <span>Our Clients</span>
                        <span className="text-[10px] font-mono text-slate-400">/about/clients</span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Trusted enterprise partners &amp; proof
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Services Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setServicesDropdownOpen(true)}
              onMouseLeave={() => setServicesDropdownOpen(false)}
            >
              <button
                onClick={() => handleRouteClick('/services')}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  publicSubPage === 'services' || currentPath.startsWith('/services')
                    ? 'text-blue-600 dark:text-teal-400 font-semibold bg-blue-50/80 dark:bg-blue-950/50 shadow-2xs'
                    : 'text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
                }`}
              >
                <span>Services</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                    servicesDropdownOpen ? 'rotate-180 text-blue-600 dark:text-teal-400' : ''
                  }`}
                />
              </button>

              {servicesDropdownOpen && (
                <div className="absolute top-full left-0 pt-2 w-[640px] z-50">
                  <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-2xl shadow-2xl grid grid-cols-2 gap-2.5 animate-in fade-in duration-150 whitespace-normal">
                    {servicesCatalog.map((service) => (
                      <div
                        key={service.id}
                        onClick={() => {
                          closeAllMenus();
                          setSelectedServiceModal(service);
                        }}
                        className="p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/90 transition-all cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700 group flex items-start gap-3"
                      >
                        <img
                          src={service.imageUrl}
                          alt={service.title}
                          className="w-12 h-12 rounded-lg object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300">
                            {service.category}
                          </div>
                          <div className="text-xs font-bold text-slate-900 dark:text-slate-200 group-hover:text-blue-950 dark:group-hover:text-white line-clamp-1">
                            {service.title}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                            {service.shortDesc}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="col-span-2 pt-2.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span>9 Specialized Enterprise Divisions</span>
                      <button
                        onClick={() => handleRouteClick('/services')}
                        className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-semibold inline-flex items-center gap-1 cursor-pointer"
                      >
                        View All Services Page (/services) &rarr;
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Industries */}
            <button
              onClick={() => handleRouteClick('/industries')}
              className={`px-3 py-2 text-sm font-medium rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                publicSubPage === 'industries'
                  ? 'text-blue-600 dark:text-teal-400 font-semibold bg-blue-50/80 dark:bg-blue-950/50 shadow-2xs'
                  : 'text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
              }`}
            >
              Industries
            </button>

            {/* Packages */}
            <button
              onClick={() => handleRouteClick('/packages')}
              className={`px-3 py-2 text-sm font-medium rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                publicSubPage === 'packages'
                  ? 'text-blue-600 dark:text-teal-400 font-semibold bg-blue-50/80 dark:bg-blue-950/50 shadow-2xs'
                  : 'text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
              }`}
            >
              HR Packages
            </button>

            {/* Grouped Resources Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setResourcesDropdownOpen(true)}
              onMouseLeave={() => setResourcesDropdownOpen(false)}
            >
              <button
                type="button"
                onClick={() => setResourcesDropdownOpen((prev) => !prev)}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  [
                    'process',
                    'digital-hr',
                    'case-studies',
                    'blog',
                    'testimonials',
                    'employee-info',
                  ].includes(publicSubPage)
                    ? 'text-blue-600 dark:text-teal-400 font-semibold bg-blue-50/80 dark:bg-blue-950/50 shadow-2xs'
                    : 'text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
                }`}
              >
                <span>Resources</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                    resourcesDropdownOpen ? 'rotate-180 text-blue-600 dark:text-teal-400' : ''
                  }`}
                />
              </button>

              {resourcesDropdownOpen && (
                <div className="absolute top-full right-0 pt-2 w-72 z-50">
                  <div className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-2xl shadow-2xl flex flex-col gap-1 animate-in fade-in duration-150 whitespace-normal">
                    <button
                      onClick={() => handleRouteClick('/portal/employees/Employee_info')}
                      className="w-full text-left px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-white rounded-xl bg-teal-50/60 dark:bg-teal-950/30 hover:bg-teal-100/70 dark:hover:bg-teal-950/60 border border-teal-200/60 dark:border-teal-900/60 transition-colors cursor-pointer"
                    >
                      <div className="font-bold text-teal-700 dark:text-teal-300 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>New Employee Info Form</span>
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200">
                          Public
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Employee Profile • Accounticca HRMS onboarding form
                      </div>
                    </button>

                    <button
                      onClick={() => handleRouteClick('/process')}
                      className="w-full text-left px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-white rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/90 transition-colors cursor-pointer"
                    >
                      <div className="font-semibold flex items-center justify-between">
                        <span>Methodology &amp; Process</span>
                        <span className="text-[10px] font-mono text-slate-400">/process</span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Our 6-stage consulting framework
                      </div>
                    </button>

                    <button
                      onClick={() => handleRouteClick('/digital-hr')}
                      className="w-full text-left px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-white rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/90 transition-colors cursor-pointer"
                    >
                      <div className="font-semibold flex items-center justify-between">
                        <span>Digital HRMS Platform</span>
                        <span className="text-[10px] font-mono text-slate-400">/digital-hr</span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Cloud HRMS, ATS &amp; People Analytics
                      </div>
                    </button>

                    <button
                      onClick={() => handleRouteClick('/case-studies')}
                      className="w-full text-left px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-white rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/90 transition-colors cursor-pointer"
                    >
                      <div className="font-semibold flex items-center justify-between">
                        <span>Case Studies</span>
                        <span className="text-[10px] font-mono text-slate-400">/case-studies</span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Measurable enterprise HR outcomes
                      </div>
                    </button>

                    <button
                      onClick={() => handleRouteClick('/blog')}
                      className="w-full text-left px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-white rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/90 transition-colors cursor-pointer"
                    >
                      <div className="font-semibold flex items-center justify-between">
                        <span>Knowledge Hub &amp; Blog</span>
                        <span className="text-[10px] font-mono text-slate-400">/blog</span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Executive HR &amp; compliance insights
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Contact Page Link */}
            <button
              onClick={() => handleRouteClick('/contact')}
              className={`px-3 py-2 text-sm font-medium rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                publicSubPage === 'contact'
                  ? 'text-blue-600 dark:text-teal-400 font-semibold bg-blue-50/80 dark:bg-blue-950/50 shadow-2xs'
                  : 'text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
              }`}
            >
              Contact
            </button>
          </nav>

          {/* Enhanced Right Action CTAs (Unified Single Portal Button + Book a Consultation) */}
          <div className="hidden sm:flex items-center gap-2.5 shrink-0 whitespace-nowrap">
            <ThemeToggle variant="compact" />

            {/* Unified Single "Client Portal" / "Sign In" Button with Quick Menu */}
            <div
              className="relative"
              onMouseEnter={() => setPortalDropdownOpen(true)}
              onMouseLeave={() => setPortalDropdownOpen(false)}
            >
              <button
                type="button"
                onClick={() => {
                  if (isAuthenticated) {
                    handleRouteClick('/portal/overview');
                  } else {
                    setLoginModalOpen(true);
                  }
                }}
                className="group inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-800 dark:text-slate-100 bg-slate-100/90 dark:bg-slate-800/90 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-teal-400 rounded-xl transition-all border border-slate-200/90 dark:border-slate-700/80 hover:border-blue-300 dark:hover:border-teal-500/50 shadow-2xs cursor-pointer whitespace-nowrap"
                title="Sign In or Launch Enterprise Client Portal"
              >
                <span className="w-6 h-6 rounded-lg bg-blue-600/10 dark:bg-teal-500/15 text-blue-600 dark:text-teal-400 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  {isAuthenticated ? (
                    <LayoutDashboard className="w-3.5 h-3.5" />
                  ) : (
                    <LogIn className="w-3.5 h-3.5" />
                  )}
                </span>
                <span>{isAuthenticated ? 'Client Portal' : 'Portal Sign In'}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                    portalDropdownOpen ? 'rotate-180 text-blue-600 dark:text-teal-400' : ''
                  }`}
                />
              </button>

              {/* Unified Portal Quick-Access Dropdown */}
              {portalDropdownOpen && (
                <div className="absolute top-full right-0 pt-2 w-72 z-50">
                  <div className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-2xl shadow-2xl flex flex-col gap-1.5 animate-in fade-in duration-150 whitespace-normal">
                    <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Accounticca HRMS Access
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                        <Sparkles className="w-3 h-3" />
                        RBAC Ready
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        closeAllMenus();
                        setLoginModalOpen(true);
                      }}
                      className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-blue-50/80 dark:hover:bg-slate-800 transition-colors flex items-start gap-3 cursor-pointer group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <LogIn className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">
                          Sign In with Credentials
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          Super Admin, Client Admin &amp; Staff login
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRouteClick('/portal/overview')}
                      className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-teal-50/80 dark:hover:bg-slate-800 transition-colors flex items-start gap-3 cursor-pointer group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                        <LayoutDashboard className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">
                          Launch Client Portal
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          Open HRMS Dashboard ({currentUser.name})
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRouteClick('/portal/employees/Employee_info')}
                      className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-indigo-50/80 dark:hover:bg-slate-800 transition-colors flex items-start gap-3 cursor-pointer group border-t border-slate-100 dark:border-slate-800 pt-2.5"
                    >
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <UserPlus className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">
                          Public Employee Info Form
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          New employee onboarding profile form
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setConsultationModalOpen(true)}
              className="relative inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-500 hover:to-teal-500 shadow-lg shadow-blue-600/25 hover:shadow-blue-500/40 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer whitespace-nowrap shrink-0"
            >
              <PhoneCall className="w-4 h-4 shrink-0" />
              <span>Book a Consultation</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex sm:hidden items-center gap-2 shrink-0">
            <ThemeToggle variant="compact" />
            <button
              onClick={() => setLoginModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 whitespace-nowrap"
            >
              <LogIn className="w-3.5 h-3.5 text-blue-600 dark:text-teal-400" />
              <span>Portal</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 pt-2 pb-6 space-y-1.5 animate-in fade-in duration-200">
          <button
            onClick={() => handleRouteClick('/')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between"
          >
            <span>Home</span>
            <span className="text-[10px] font-mono text-slate-400">/</span>
          </button>
          <button
            onClick={() => handleRouteClick('/about')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between"
          >
            <span>About Us &amp; Leadership</span>
            <span className="text-[10px] font-mono text-slate-400">/about</span>
          </button>
          <button
            onClick={() => handleRouteClick('/services')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between"
          >
            <span>All 9 Services Catalog</span>
            <span className="text-[10px] font-mono text-slate-400">/services</span>
          </button>
          <button
            onClick={() => handleRouteClick('/industries')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between"
          >
            <span>Industries Served (10 Sectors)</span>
            <span className="text-[10px] font-mono text-slate-400">/industries</span>
          </button>
          <button
            onClick={() => handleRouteClick('/packages')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between"
          >
            <span>HR Packages &amp; Pricing</span>
            <span className="text-[10px] font-mono text-slate-400">/packages</span>
          </button>
          <button
            onClick={() => handleRouteClick('/portal/employees/Employee_info')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-teal-700 dark:text-teal-300 bg-teal-50/70 dark:bg-teal-950/40 hover:bg-teal-100 dark:hover:bg-teal-900/50 flex items-center justify-between"
          >
            <span>Public Employee Info Form</span>
            <span className="text-[10px] font-mono text-teal-600 dark:text-teal-400">
              /portal/employees/Employee_info
            </span>
          </button>
          <button
            onClick={() => handleRouteClick('/contact')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between"
          >
            <span>Contact &amp; Global Offices</span>
            <span className="text-[10px] font-mono text-slate-400">/contact</span>
          </button>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setLoginModalOpen(true);
              }}
              className="w-full py-2.5 px-4 text-center rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-md flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Portal Sign In / Client Portal</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setConsultationModalOpen(true);
              }}
              className="w-full py-2.5 px-4 text-center rounded-xl bg-gradient-to-r from-blue-600 to-teal-600 text-white font-semibold text-sm shadow-md"
            >
              Book a Consultation
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
