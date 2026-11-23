import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LoginModal } from './components/common/LoginModal';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { FloatingCTA } from './components/layout/FloatingCTA';

// Public Sections
import { Hero } from './components/public/Hero';
import { ClientLogos } from './components/public/ClientLogos';
import { ChallengesSection } from './components/public/ChallengesSection';
import { SolutionsOverview } from './components/public/SolutionsOverview';
import { ServicesSection } from './components/public/ServicesSection';
import { ServiceDetailModal } from './components/public/ServiceDetailModal';
import { IndustriesSection } from './components/public/IndustriesSection';
import { PackagesSection } from './components/public/PackagesSection';
import { ProposalModal } from './components/public/ProposalModal';
import { ProcessSection } from './components/public/ProcessSection';
import { DigitalHRSection } from './components/public/DigitalHRSection';
import { StatsSection } from './components/public/StatsSection';
import { TestimonialsSection } from './components/public/TestimonialsSection';
import { CaseStudiesSection } from './components/public/CaseStudiesSection';
import { BlogSection } from './components/public/BlogSection';
import { ConsultationSection } from './components/public/ConsultationSection';
import { ConsultationModal } from './components/public/ConsultationModal';
import { AboutPage } from './components/public/AboutPage';
import { ContactPage } from './components/public/ContactPage';
import { PublicEmployeeInfoFormPage } from './components/public/PublicEmployeeInfoFormPage';

// Portal Components
import { PortalLayout } from './components/portal/PortalLayout';
import { DashboardOverview } from './components/portal/DashboardOverview';
import { LeadsCRM } from './components/portal/LeadsCRM';
import { ConsultationsManager } from './components/portal/ConsultationsManager';
import { RecruitmentATS } from './components/portal/RecruitmentATS';
import { EmployeeDirectory } from './components/portal/EmployeeDirectory';
import { PayrollManager } from './components/portal/PayrollManager';
import { LeaveAttendanceManager } from './components/portal/LeaveAttendanceManager';
import { PerformanceManager } from './components/portal/PerformanceManager';
import { TrainingManager } from './components/portal/TrainingManager';
import { DocumentsManager } from './components/portal/DocumentsManager';
import { AnalyticsDashboard } from './components/portal/AnalyticsDashboard';
import { InvoicesManager } from './components/portal/InvoicesManager';
import { CmsManager } from './components/portal/CmsManager';
import { AuditLogsViewer } from './components/portal/AuditLogsViewer';
import { EmployeeSelfService } from './components/portal/EmployeeSelfService';
import { GoogleWorkspaceHub } from './components/portal/GoogleWorkspaceHub';
import { CompaniesManager } from './components/portal/CompaniesManager';
import TaxManagement from './components/portal/TaxManagement';

const PAGE_BANNER_META: Record<
  string,
  { badge: string; title: string; subtitle: string; bgImage: string }
> = {
  services: {
    badge: 'Core HR Services Catalog',
    title: 'Strategic HR Consulting & Managed People Operations',
    subtitle: 'Explore our 9 specialized HR practice areas designed to eliminate compliance risk, accelerate talent acquisition, and scale organizational performance.',
    bgImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1600',
  },
  solutions: {
    badge: 'Unified HR Ecosystem',
    title: 'End-to-End Human Resource Architecture',
    subtitle: 'How Accounticca bridges strategic executive advisory, talent acquisition, payroll governance, and cloud HRMS automation.',
    bgImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1600',
  },
  challenges: {
    badge: 'Diagnostic & Risk Mitigation',
    title: 'Critical Workforce Challenges We Solve',
    subtitle: 'Diagnosing and eliminating the hidden operational bottlenecks, compliance liabilities, and retention leaks holding back enterprise growth.',
    bgImage: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=1600',
  },
  industries: {
    badge: 'Sector-Specific Expertise',
    title: 'Tailored HR Governance Across 10+ Industries',
    subtitle: 'Every industry faces distinct regulatory, shift, and talent challenges. Explore our vertical-specific HR playbooks and case highlights.',
    bgImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1600',
  },
  packages: {
    badge: 'Flexible Engagement Models',
    title: 'HR Service Packages & Turnkey Retainers',
    subtitle: 'Transparent, SLA-backed HR packages engineered for early-stage startups, scaling SMEs, and multi-national corporations.',
    bgImage: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1600',
  },
  process: {
    badge: 'Proven Delivery Methodology',
    title: 'Our 6-Stage HR Transformation Framework',
    subtitle: 'A disciplined, transparent execution roadmap from initial diagnostic HR audit to continuous quarterly governance.',
    bgImage: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1600',
  },
  'digital-hr': {
    badge: 'Enterprise HR Technology',
    title: 'Cloud HRMS, ATS & Real-Time People Analytics',
    subtitle: 'Empower your workforce with Employee Self-Service (ESS), biometric attendance integration, and automated gross-to-net payroll.',
    bgImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1600',
  },
  'case-studies': {
    badge: 'Verified Client Outcomes',
    title: 'Enterprise HR Case Studies & Measurable ROI',
    subtitle: 'Real-world organizational turnarounds, high-velocity hiring pipelines, and 100% statutory audit compliance across global hubs.',
    bgImage: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=1600',
  },
  testimonials: {
    badge: 'Executive Endorsements',
    title: 'Trusted by CEOs, Founders & People Leaders',
    subtitle: 'Hear directly from executive teams who partnered with Accounticca to modernize their HR infrastructure.',
    bgImage: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=1600',
  },
  blog: {
    badge: 'Knowledge & Research Hub',
    title: 'HR Insights, Labor Law Briefings & Playbooks',
    subtitle: 'Research-backed articles on talent acquisition, statutory compliance, OKR performance frameworks, and digital HR transformation.',
    bgImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1600',
  },
  consultation: {
    badge: 'Complimentary Executive Advisory',
    title: 'Book Your Free 30-Minute HR Diagnostic Session',
    subtitle: 'Speak directly with a Principal HR Consultant to audit your current policies, hiring velocity, and payroll compliance.',
    bgImage: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=1600',
  },
};

const MainAppContent: React.FC = () => {
  const { currentView, activePortalTab, publicSubPage, currentPath, navigateTo } = useApp();

  const handleNavigateSection = (sectionId: string) => {
    if (sectionId === 'hero' || sectionId === 'home') {
      navigateTo('/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const sectionToPathMap: Record<string, string> = {
      services: '/services',
      solutions: '/solutions',
      challenges: '/challenges',
      industries: '/industries',
      packages: '/packages',
      process: '/process',
      'digital-hr': '/digital-hr',
      'case-studies': '/case-studies',
      testimonials: '/testimonials',
      blog: '/blog',
      consultation: '/consultation',
      about: '/about',
      contact: '/contact',
    };

    if (sectionToPathMap[sectionId]) {
      navigateTo(sectionToPathMap[sectionId]);
      return;
    }

    const elem = document.getElementById(`${sectionId}-section`);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const activeBanner = PAGE_BANNER_META[publicSubPage];

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-white dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 selection:bg-blue-600 selection:text-white transition-colors duration-200">
      {currentView === 'public' ? (
        /* Public Corporate Website */
        <>
          <Navbar onNavigateSection={handleNavigateSection} />
          <main className="flex-1">
            {publicSubPage === 'employee-info' && <PublicEmployeeInfoFormPage />}
            {publicSubPage === 'about' && <AboutPage />}
            {publicSubPage === 'contact' && <ContactPage />}

            {activeBanner && (
              <section className="relative bg-slate-950 text-white py-14 lg:py-20 overflow-hidden border-b border-slate-800">
                <div className="absolute inset-0 opacity-20">
                  <img
                    src={activeBanner.bgImage}
                    alt={activeBanner.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-900/75" />
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
                    <div className="flex items-center space-x-2 text-xs font-medium text-slate-400">
                      <button
                        onClick={() => navigateTo('/')}
                        className="hover:text-teal-400 transition-colors cursor-pointer"
                      >
                        Home
                      </button>
                      <span>/</span>
                      <span className="text-teal-400 font-semibold">{activeBanner.badge}</span>
                      <span className="hidden sm:inline-block ml-2 px-2.5 py-0.5 rounded-md bg-slate-800/90 border border-slate-700 text-[11px] font-mono text-slate-300">
                        {currentPath}
                      </span>
                    </div>
                    <button
                      onClick={() => navigateTo('/')}
                      className="text-xs font-semibold text-teal-400 hover:text-teal-300 bg-slate-900/80 border border-slate-800 px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      ← Back to Full Home Overview
                    </button>
                  </div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight max-w-4xl leading-tight mb-4">
                    {activeBanner.title}
                  </h1>
                  <p className="text-slate-300 text-base sm:text-lg max-w-3xl leading-relaxed">
                    {activeBanner.subtitle}
                  </p>
                </div>
              </section>
            )}

            {publicSubPage === 'services' && (
              <>
                <ServicesSection />
                <PackagesSection />
                <ConsultationSection />
              </>
            )}
            {publicSubPage === 'solutions' && (
              <>
                <SolutionsOverview onExploreServices={() => navigateTo('/services')} />
                <ServicesSection />
                <ConsultationSection />
              </>
            )}
            {publicSubPage === 'challenges' && (
              <>
                <ChallengesSection />
                <SolutionsOverview onExploreServices={() => navigateTo('/services')} />
                <ConsultationSection />
              </>
            )}
            {publicSubPage === 'industries' && (
              <>
                <IndustriesSection />
                <CaseStudiesSection />
                <ConsultationSection />
              </>
            )}
            {publicSubPage === 'packages' && (
              <>
                <PackagesSection />
                <ProcessSection />
                <ConsultationSection />
              </>
            )}
            {publicSubPage === 'process' && (
              <>
                <ProcessSection />
                <DigitalHRSection />
                <ConsultationSection />
              </>
            )}
            {publicSubPage === 'digital-hr' && (
              <>
                <DigitalHRSection />
                <StatsSection />
                <ConsultationSection />
              </>
            )}
            {publicSubPage === 'case-studies' && (
              <>
                <CaseStudiesSection />
                <TestimonialsSection />
                <ConsultationSection />
              </>
            )}
            {publicSubPage === 'testimonials' && (
              <>
                <TestimonialsSection />
                <StatsSection />
                <ConsultationSection />
              </>
            )}
            {publicSubPage === 'blog' && (
              <>
                <BlogSection />
                <ConsultationSection />
              </>
            )}
            {publicSubPage === 'consultation' && (
              <>
                <ConsultationSection />
                <StatsSection />
              </>
            )}

            {publicSubPage === 'home' && (
              <>
                <Hero onNavigateSection={handleNavigateSection} />
                <ClientLogos />
                <ChallengesSection />
                <SolutionsOverview onExploreServices={() => navigateTo('/services')} />
                <ServicesSection />
                <IndustriesSection />
                <PackagesSection />
                <ProcessSection />
                <DigitalHRSection />
                <StatsSection />
                <TestimonialsSection />
                <CaseStudiesSection />
                <BlogSection />
                <ConsultationSection />
              </>
            )}
          </main>
          <Footer onNavigateSection={handleNavigateSection} />
          <FloatingCTA />
        </>
      ) : (
        /* B2B SaaS Enterprise Portal */
        <PortalLayout>
          {activePortalTab === 'overview' && <DashboardOverview />}
          {activePortalTab === 'my_portal' && <EmployeeSelfService />}
          {activePortalTab === 'leads' && <LeadsCRM />}
          {activePortalTab === 'consultations' && <ConsultationsManager />}
          {(activePortalTab === 'recruitment' || activePortalTab === 'candidates') && (
            <RecruitmentATS />
          )}
          {activePortalTab === 'employees' && <EmployeeDirectory />}
          {activePortalTab === 'payroll' && <PayrollManager />}
          {activePortalTab === 'tax' && <TaxManagement />}
          {(activePortalTab === 'attendance' || activePortalTab === 'leave') && (
            <LeaveAttendanceManager />
          )}
          {activePortalTab === 'performance' && <PerformanceManager />}
          {activePortalTab === 'training' && <TrainingManager />}
          {activePortalTab === 'documents' && <DocumentsManager />}
          {activePortalTab === 'analytics' && <AnalyticsDashboard />}
          {activePortalTab === 'invoices' && <InvoicesManager />}
          {activePortalTab === 'cms' && <CmsManager />}
          {activePortalTab === 'companies' && <CompaniesManager />}
          {activePortalTab === 'company_sheet' && <GoogleWorkspaceHub isClientAdminMode={true} />}
          {activePortalTab === 'google_workspace' && <GoogleWorkspaceHub />}
          {activePortalTab === 'audit' && <AuditLogsViewer />}
        </PortalLayout>
      )}

      {/* Global Modals */}
      <LoginModal />
      <ConsultationModal />
      <ServiceDetailModal />
      <ProposalModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
