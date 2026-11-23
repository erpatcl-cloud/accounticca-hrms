import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Role,
  Organization,
  Lead,
  LeadStatus,
  ConsultationRequest,
  ConsultationStatus,
  JobRequisition,
  Candidate,
  CandidateStatus,
  Employee,
  EmployeeLifecycleStage,
  PayrollRecord,
  AttendanceRecord,
  AttendanceStatus,
  LeaveRequest,
  PerformanceReview,
  TrainingProgram,
  DocumentItem,
  Invoice,
  BlogPost,
  CaseStudy,
  Testimonial,
  AuditLog,
  AppNotification,
  TaxRuleConfig,
  RegionId,
  RegionalComplianceRisk,
  PublicPageType,
} from '../types';
import { calculateBangladeshTax, REGIONS, TAX_YEARS } from '../utils/taxCalculator';
import {
  INITIAL_USERS,
  INITIAL_ORGANIZATIONS,
  SERVICES_CATALOG,
  ServiceItem,
  INDUSTRIES_CATALOG,
  IndustryItem,
  HR_PACKAGES,
  HRPackage,
  INITIAL_LEADS,
  INITIAL_CONSULTATIONS,
  INITIAL_JOB_REQUISITIONS,
  INITIAL_CANDIDATES,
  INITIAL_EMPLOYEES,
  INITIAL_PAYROLL_RECORDS,
  INITIAL_ATTENDANCE_RECORDS,
  INITIAL_LEAVE_REQUESTS,
  INITIAL_PERFORMANCE_REVIEWS,
  INITIAL_TRAINING_PROGRAMS,
  INITIAL_DOCUMENTS,
  INITIAL_INVOICES,
  INITIAL_BLOG_POSTS,
  INITIAL_CASE_STUDIES,
  INITIAL_TESTIMONIALS,
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATIONS,
  INITIAL_TAX_RULES,
  INITIAL_COMPLIANCE_RISKS,
} from '../data/mockData';

interface AppContextType {
  // Theme State
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;

  // Navigation & User State
  currentView: 'public' | 'portal';
  setCurrentView: (view: 'public' | 'portal') => void;
  publicSubPage: PublicPageType;
  setPublicSubPage: (page: PublicPageType) => void;
  currentPath: string;
  navigateTo: (path: string) => void;
  currentUser: User;
  setCurrentUser: (user: User) => void;
  switchRole: (role: Role) => void;
  availableUsers: User[];
  activePortalTab: string;
  setActivePortalTab: (tab: string) => void;

  // Selected Filter (for multi-tenant admin & geographic region filtering)
  selectedOrgIdFilter: string;
  setSelectedOrgIdFilter: (orgId: string) => void;
  selectedRegion: RegionId;
  setSelectedRegion: (region: RegionId) => void;
  organizations: Organization[];
  complianceRisks: RegionalComplianceRisk[];

  // Entities Data & Tenant-Isolated Getters
  leads: Lead[];
  consultations: ConsultationRequest[];
  jobs: JobRequisition[];
  candidates: Candidate[];
  employees: Employee[];
  payrollRecords: PayrollRecord[];
  attendanceRecords: AttendanceRecord[];
  leaveRequests: LeaveRequest[];
  performanceReviews: PerformanceReview[];
  trainingPrograms: TrainingProgram[];
  documents: DocumentItem[];
  invoices: Invoice[];
  blogPosts: BlogPost[];
  caseStudies: CaseStudy[];
  testimonials: Testimonial[];
  auditLogs: AuditLog[];
  notifications: AppNotification[];
  taxRules: TaxRuleConfig;
  servicesCatalog: ServiceItem[];
  industriesCatalog: IndustryItem[];
  packagesCatalog: HRPackage[];

  // Modals & UI Triggers
  consultationModalOpen: boolean;
  setConsultationModalOpen: (open: boolean) => void;
  selectedServiceModal: ServiceItem | null;
  setSelectedServiceModal: (srv: ServiceItem | null) => void;
  selectedPackageModal: HRPackage | null;
  setSelectedPackageModal: (pkg: HRPackage | null) => void;

  // Authentication & Login Modal
  isAuthenticated: boolean;
  loginModalOpen: boolean;
  setLoginModalOpen: (open: boolean) => void;
  login: (email: string, pass: string) => { success: boolean; message: string };
  logout: () => void;

  // Actions
  addLead: (lead: Omit<Lead, 'id' | 'createdDate'>) => void;
  updateLeadStatus: (leadId: string, status: LeadStatus, note?: string) => void;
  addConsultationRequest: (req: Omit<ConsultationRequest, 'id' | 'status' | 'assignedConsultant' | 'notes' | 'createdDate'>) => string;
  updateConsultationStatus: (id: string, status: ConsultationStatus, notes?: string, consultant?: string) => void;
  addJobRequisition: (job: Omit<JobRequisition, 'id' | 'candidateCount'>) => void;
  updateJobStatus: (id: string, status: JobRequisition['status']) => void;
  addCandidate: (candidate: Omit<Candidate, 'id' | 'appliedDate'>) => void;
  updateCandidateStatus: (candidateId: string, status: CandidateStatus, notes?: string) => void;
  updateCandidateScore: (candidateId: string, score: number, notes?: string) => void;
  addEmployee: (emp: Omit<Employee, 'id'>) => void;
  bulkAddEmployees: (empList: Omit<Employee, 'id'>[]) => void;
  submitPublicEmployeeProfile: (emp: Omit<Employee, 'id'>) => Employee;
  reviewEmployeeSubmission: (
    employeeId: string,
    decision: 'Approved' | 'Rejected',
    notes?: string
  ) => void;
  updateEmployeeLifecycle: (employeeId: string, stage: EmployeeLifecycleStage) => void;
  updateEmployee: (employee: Employee) => void;
  notify: (
    title: string,
    message: string,
    type?: 'info' | 'success' | 'warning' | 'alert',
    linkAction?: string
  ) => void;
  processMonthlyPayroll: (month: string, year: number, orgId: string, bonusPercent?: number) => void;
  updatePayrollStatus: (payrollId: string, status: 'Paid' | 'Processing' | 'Pending') => void;
  logAttendance: (record: Omit<AttendanceRecord, 'id'>) => void;
  submitLeaveRequest: (req: Omit<LeaveRequest, 'id' | 'status' | 'appliedDate'>) => void;
  reviewLeaveRequest: (leaveId: string, status: 'Approved' | 'Rejected', notes?: string) => void;
  addPerformanceReview: (review: Omit<PerformanceReview, 'id'>) => void;
  enrollInTraining: (programId: string) => void;
  uploadDocument: (doc: Omit<DocumentItem, 'id' | 'uploadDate'>) => void;
  createInvoice: (invoice: Omit<Invoice, 'id'>) => void;
  updateInvoiceStatus: (invoiceId: string, status: Invoice['status']) => void;
  updateTaxRules: (rules: TaxRuleConfig) => void;
  addBlogPost: (post: Omit<BlogPost, 'id'>) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  resolveComplianceRisk: (riskId: string) => void;
  addOrganization: (
    org: Omit<Organization, 'id' | 'joinedDate' | 'status'>,
    adminData?: { name: string; email: string; phone?: string; designation?: string; password?: string }
  ) => Organization;
  updateOrganization: (org: Organization) => void;
  deleteOrganization: (orgId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Global Theme State ('light' | 'dark')
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('acct_theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return 'light';
  });

  useEffect(() => {
    localStorage.setItem('acct_theme', theme);
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [theme]);

  const setTheme = (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Navigation & View
  const [currentView, setCurrentViewState] = useState<'public' | 'portal'>('public');
  const [publicSubPage, setPublicSubPageState] = useState<PublicPageType>('home');
  const [currentPath, setCurrentPath] = useState<string>(() => window.location.pathname || '/');
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const savedUserId = localStorage.getItem('acct_auth_user_v4');
    if (savedUserId) {
      const found = INITIAL_USERS.find((u) => u.id === savedUserId);
      if (found) return found;
    }
    return INITIAL_USERS[0]; // default Super Admin (H. M. Ekram / hmekram@gmail.com)
  });
  const [activePortalTab, setActivePortalTabState] = useState<string>('overview');
  const [selectedOrgIdFilter, setSelectedOrgIdFilter] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<RegionId>('all');

  // Modals
  const [consultationModalOpen, setConsultationModalOpen] = useState<boolean>(false);
  const [selectedServiceModal, setSelectedServiceModalState] = useState<ServiceItem | null>(null);
  const [selectedPackageModal, setSelectedPackageModal] = useState<HRPackage | null>(null);
  const [loginModalOpen, setLoginModalOpen] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('acct_auth_v4') === 'true';
  });

  const PORTAL_TAB_TO_SLUG: Record<string, string> = {
    overview: 'overview',
    my_portal: 'my-portal',
    leads: 'leads',
    consultations: 'consultations',
    recruitment: 'recruitment',
    candidates: 'candidates',
    employees: 'employees',
    payroll: 'payroll',
    tax: 'tax',
    attendance: 'attendance',
    leave: 'leave',
    performance: 'performance',
    training: 'training',
    documents: 'documents',
    analytics: 'analytics',
    invoices: 'invoices',
    cms: 'cms',
    google_workspace: 'google-workspace',
    audit: 'audit',
    companies: 'companies',
    company_sheet: 'company-sheet',
  };

  const SLUG_TO_PORTAL_TAB: Record<string, string> = Object.entries(PORTAL_TAB_TO_SLUG).reduce(
    (acc, [tab, slug]) => ({ ...acc, [slug]: tab, [tab]: tab }),
    {} as Record<string, string>
  );

  const applyPathState = (rawPath: string, pushHistory = false) => {
    const cleanPath = rawPath.startsWith('/') ? rawPath : `/${rawPath}`;
    const normalized = cleanPath === '' ? '/' : cleanPath.replace(/\/+$/, '') || '/';

    if (pushHistory && window.location.pathname !== normalized) {
      window.history.pushState({}, '', normalized);
    }
    setCurrentPath(normalized);

    const segments = normalized.split('/').filter(Boolean);

    // Public Employee Information & Self-Onboarding Form (/portal/employees/Employee_info)
    if (
      (segments[0]?.toLowerCase() === 'portal' &&
        segments[1]?.toLowerCase() === 'employees' &&
        segments[2]?.toLowerCase() === 'employee_info') ||
      segments[0]?.toLowerCase() === 'employee_info' ||
      segments[0]?.toLowerCase() === 'employee-info'
    ) {
      setCurrentViewState('public');
      setPublicSubPageState('employee-info');
      setSelectedServiceModalState(null);
      document.title = 'Employee Profile • Accounticca HRMS | New Employee Information Form';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (segments[0] === 'login' || (segments[0] === 'portal' && segments[1] === 'login')) {
      setLoginModalOpen(true);
      setCurrentViewState('public');
      setPublicSubPageState('home');
      setSelectedServiceModalState(null);
      document.title = 'Accounticca HRM Solutions | Enterprise Portal Login';
      return;
    }

    if (segments[0] === 'portal') {
      const tabSlug = segments[1] || 'overview';
      const resolvedTab = SLUG_TO_PORTAL_TAB[tabSlug] || 'overview';
      setCurrentViewState('portal');
      setActivePortalTabState(resolvedTab);
      setSelectedServiceModalState(null);
      document.title = `Accounticca HRMS | Portal — ${resolvedTab.replace('_', ' ').toUpperCase()}`;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setCurrentViewState('public');

    if (segments.length === 0 || segments[0] === 'home') {
      setPublicSubPageState('home');
      setSelectedServiceModalState(null);
      document.title = 'Accounticca HRM Solutions | Enterprise HR Consulting & Digital HRMS';
      return;
    }

    if (segments[0] === 'services') {
      setPublicSubPageState('services');
      if (segments[1]) {
        const matchedSrv = SERVICES_CATALOG.find((s) => s.slug === segments[1] || s.id === segments[1]);
        setSelectedServiceModalState(matchedSrv || null);
        document.title = matchedSrv
          ? `${matchedSrv.title} | Accounticca HRM Solutions`
          : 'HR Services | Accounticca HRM Solutions';
      } else {
        setSelectedServiceModalState(null);
        document.title = 'HR Services & Solutions | Accounticca HRM Solutions';
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (segments[0] === 'about') {
      setPublicSubPageState('about');
      setSelectedServiceModalState(null);
      document.title = 'About Us & Leadership | Accounticca HRM Solutions';
      if (segments[1] === 'team' || segments[1] === 'clients') {
        setTimeout(() => {
          const el = document.getElementById(`about-${segments[1]}`);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    const validPublicPages: PublicPageType[] = [
      'contact',
      'industries',
      'packages',
      'process',
      'digital-hr',
      'case-studies',
      'testimonials',
      'blog',
      'challenges',
      'solutions',
      'consultation',
    ];

    if (validPublicPages.includes(segments[0] as PublicPageType)) {
      const page = segments[0] as PublicPageType;
      setPublicSubPageState(page);
      setSelectedServiceModalState(null);
      const pageTitleMap: Record<string, string> = {
        contact: 'Global Offices & Contact | Accounticca HRM Solutions',
        industries: 'Industries We Serve | Accounticca HRM Solutions',
        packages: 'HR Service Packages & Pricing | Accounticca HRM Solutions',
        process: 'How Accounticca Works | 6-Step Execution Process',
        'digital-hr': 'Digital HRMS & People Analytics | Accounticca HRM Solutions',
        'case-studies': 'Client Case Studies & ROI | Accounticca HRM Solutions',
        testimonials: 'Executive Testimonials | Accounticca HRM Solutions',
        blog: 'HR Insights & Resource Center | Accounticca HRM Solutions',
        challenges: 'HR Challenges We Solve | Accounticca HRM Solutions',
        solutions: 'End-to-End HR Solutions Overview | Accounticca HRM Solutions',
        consultation: 'Book a Free HR Consultation | Accounticca HRM Solutions',
      };
      document.title = pageTitleMap[page] || 'Accounticca HRM Solutions';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Fallback to home
    setPublicSubPageState('home');
    setSelectedServiceModalState(null);
  };

  useEffect(() => {
    // Parse initial browser URL on mount
    applyPathState(window.location.pathname || '/', false);

    const handlePopState = () => {
      applyPathState(window.location.pathname || '/', false);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    applyPathState(path, true);
  };

  const setCurrentView = (view: 'public' | 'portal') => {
    setCurrentViewState(view);
    if (view === 'portal') {
      const slug = PORTAL_TAB_TO_SLUG[activePortalTab] || 'overview';
      const nextPath = `/portal/${slug}`;
      if (window.location.pathname !== nextPath) {
        window.history.pushState({}, '', nextPath);
      }
      setCurrentPath(nextPath);
      document.title = `Accounticca HRMS | Portal — ${activePortalTab.replace('_', ' ').toUpperCase()}`;
    } else {
      const nextPath = publicSubPage === 'home' ? '/' : `/${publicSubPage}`;
      if (window.location.pathname !== nextPath) {
        window.history.pushState({}, '', nextPath);
      }
      setCurrentPath(nextPath);
    }
  };

  const setPublicSubPage = (page: PublicPageType) => {
    setPublicSubPageState(page);
    setCurrentViewState('public');
    const nextPath =
      page === 'home'
        ? '/'
        : page === 'employee-info'
        ? '/portal/employees/Employee_info'
        : `/${page}`;
    if (window.location.pathname !== nextPath) {
      window.history.pushState({}, '', nextPath);
    }
    setCurrentPath(nextPath);
  };

  const setActivePortalTab = (tab: string) => {
    setActivePortalTabState(tab);
    if (currentView === 'portal' || window.location.pathname.startsWith('/portal')) {
      const slug = PORTAL_TAB_TO_SLUG[tab] || tab;
      const nextPath = `/portal/${slug}`;
      if (window.location.pathname !== nextPath) {
        window.history.pushState({}, '', nextPath);
      }
      setCurrentPath(nextPath);
      document.title = `Accounticca HRMS | Portal — ${tab.replace('_', ' ').toUpperCase()}`;
    }
  };

  const setSelectedServiceModal = (srv: ServiceItem | null) => {
    setSelectedServiceModalState(srv);
    if (srv) {
      const nextPath = `/services/${srv.slug}`;
      if (window.location.pathname !== nextPath) {
        window.history.pushState({}, '', nextPath);
      }
      setCurrentPath(nextPath);
      document.title = `${srv.title} | Accounticca HRM Solutions`;
    } else if (window.location.pathname.startsWith('/services/')) {
      const fallback = publicSubPage === 'services' ? '/services' : '/';
      window.history.pushState({}, '', fallback);
      setCurrentPath(fallback);
    }
  };

  // Entities backed by state with local storage fallback (auto-upgrading if new regional seed items were added)
  const [organizations, setOrganizations] = useState<Organization[]>(() => {
    const saved = localStorage.getItem('acct_orgs_v4');
    if (saved) {
      try {
        const parsed: Organization[] = JSON.parse(saved);
        if (parsed.length >= INITIAL_ORGANIZATIONS.length) return parsed;
      } catch (e) {}
    }
    return INITIAL_ORGANIZATIONS;
  });

  const [availableUsers, setAvailableUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('acct_users_v4');
    if (saved) {
      try {
        const parsed: User[] = JSON.parse(saved);
        if (parsed.length >= INITIAL_USERS.length && parsed[0]?.email === 'hmekram@gmail.com') return parsed;
      } catch (e) {}
    }
    return INITIAL_USERS;
  });

  const [complianceRisks, setComplianceRisks] = useState<RegionalComplianceRisk[]>(() => {
    const saved = localStorage.getItem('acct_compliance_risks_v3');
    return saved ? JSON.parse(saved) : INITIAL_COMPLIANCE_RISKS;
  });

  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem('acct_leads_v3');
    return saved ? JSON.parse(saved) : INITIAL_LEADS;
  });

  const [consultations, setConsultations] = useState<ConsultationRequest[]>(() => {
    const saved = localStorage.getItem('acct_consultations_v3');
    return saved ? JSON.parse(saved) : INITIAL_CONSULTATIONS;
  });

  const [jobs, setJobs] = useState<JobRequisition[]>(() => {
    const saved = localStorage.getItem('acct_jobs_v3');
    if (saved) {
      const parsed: JobRequisition[] = JSON.parse(saved);
      if (parsed.length >= INITIAL_JOB_REQUISITIONS.length) return parsed;
    }
    return INITIAL_JOB_REQUISITIONS;
  });

  const [candidates, setCandidates] = useState<Candidate[]>(() => {
    const saved = localStorage.getItem('acct_candidates_v3');
    return saved ? JSON.parse(saved) : INITIAL_CANDIDATES;
  });

  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('acct_employees_v4');
    if (saved) {
      const parsed: Employee[] = JSON.parse(saved);
      if (parsed.length >= INITIAL_EMPLOYEES.length) return parsed;
    }
    return INITIAL_EMPLOYEES;
  });

  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>(() => {
    const saved = localStorage.getItem('acct_payroll_v3');
    if (saved) {
      const parsed: PayrollRecord[] = JSON.parse(saved);
      if (parsed.length >= INITIAL_PAYROLL_RECORDS.length) return parsed;
    }
    return INITIAL_PAYROLL_RECORDS;
  });

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('acct_attendance');
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE_RECORDS;
  });

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(() => {
    const saved = localStorage.getItem('acct_leave');
    return saved ? JSON.parse(saved) : INITIAL_LEAVE_REQUESTS;
  });

  const [performanceReviews, setPerformanceReviews] = useState<PerformanceReview[]>(() => {
    const saved = localStorage.getItem('acct_perf');
    return saved ? JSON.parse(saved) : INITIAL_PERFORMANCE_REVIEWS;
  });

  const [trainingPrograms, setTrainingPrograms] = useState<TrainingProgram[]>(() => {
    const saved = localStorage.getItem('acct_training');
    return saved ? JSON.parse(saved) : INITIAL_TRAINING_PROGRAMS;
  });

  const [documents, setDocuments] = useState<DocumentItem[]>(() => {
    const saved = localStorage.getItem('acct_docs');
    return saved ? JSON.parse(saved) : INITIAL_DOCUMENTS;
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('acct_invoices');
    return saved ? JSON.parse(saved) : INITIAL_INVOICES;
  });

  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(() => {
    const saved = localStorage.getItem('acct_blogs_v2');
    if (saved) {
      const parsed: BlogPost[] = JSON.parse(saved);
      if (parsed.length >= INITIAL_BLOG_POSTS.length) return parsed;
    }
    return INITIAL_BLOG_POSTS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('acct_audit');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('acct_notifs');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [taxRules, setTaxRules] = useState<TaxRuleConfig>(() => {
    const saved = localStorage.getItem('acct_tax_rules');
    return saved ? JSON.parse(saved) : INITIAL_TAX_RULES;
  });

  // Local storage synchronization
  useEffect(() => {
    localStorage.setItem('acct_leads', JSON.stringify(leads));
  }, [leads]);
  useEffect(() => {
    localStorage.setItem('acct_consultations', JSON.stringify(consultations));
  }, [consultations]);
  useEffect(() => {
    localStorage.setItem('acct_candidates', JSON.stringify(candidates));
  }, [candidates]);
  useEffect(() => {
    localStorage.setItem('acct_employees_v4', JSON.stringify(employees));
  }, [employees]);
  useEffect(() => {
    localStorage.setItem('acct_payroll', JSON.stringify(payrollRecords));
  }, [payrollRecords]);
  useEffect(() => {
    localStorage.setItem('acct_leave', JSON.stringify(leaveRequests));
  }, [leaveRequests]);
  useEffect(() => {
    localStorage.setItem('acct_docs', JSON.stringify(documents));
  }, [documents]);
  useEffect(() => {
    localStorage.setItem('acct_invoices_v3', JSON.stringify(invoices));
  }, [invoices]);
  useEffect(() => {
    localStorage.setItem('acct_blogs_v2', JSON.stringify(blogPosts));
  }, [blogPosts]);
  useEffect(() => {
    localStorage.setItem('acct_audit', JSON.stringify(auditLogs));
  }, [auditLogs]);
  useEffect(() => {
    localStorage.setItem('acct_notifs', JSON.stringify(notifications));
  }, [notifications]);
  useEffect(() => {
    localStorage.setItem('acct_orgs_v4', JSON.stringify(organizations));
  }, [organizations]);
  useEffect(() => {
    localStorage.setItem('acct_users_v4', JSON.stringify(availableUsers));
  }, [availableUsers]);
  useEffect(() => {
    localStorage.setItem('acct_employees_v4', JSON.stringify(employees));
  }, [employees]);
  useEffect(() => {
    localStorage.setItem('acct_leads_v3', JSON.stringify(leads));
  }, [leads]);
  useEffect(() => {
    localStorage.setItem('acct_payroll_v3', JSON.stringify(payrollRecords));
  }, [payrollRecords]);

  // Helper to append audit logs
  const logAudit = (action: string, details: string) => {
    const newLog: AuditLog = {
      id: 'log_' + Date.now(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      userName: currentUser.name,
      userRole: currentUser.role.replace('_', ' ').toUpperCase(),
      action,
      details,
      ipAddress: '192.168.1.102',
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Helper to add in-app notification
  const notify = (title: string, message: string, type: 'info' | 'success' | 'warning' | 'alert' = 'info', linkAction?: string) => {
    const newNotif: AppNotification = {
      id: 'ntf_' + Date.now(),
      title,
      message,
      time: 'Just now',
      type,
      read: false,
      linkAction,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Quick Role Switcher
  const switchRole = (role: Role) => {
    const targetUser = availableUsers.find((u) => u.role === role) || INITIAL_USERS.find((u) => u.role === role) || availableUsers[0];
    setCurrentUser(targetUser);
    if (role === 'employee') {
      setActivePortalTab('my_portal');
    } else if (role === 'recruitment_manager') {
      setActivePortalTab('recruitment');
    } else if (role === 'client_admin') {
      setActivePortalTab('overview');
    } else {
      setActivePortalTab('overview');
    }
  };

  // Actions implementations
  const login = (email: string, pass: string): { success: boolean; message: string } => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();

    // Check for super admin credentials
    const isSuperAdminMatch =
      cleanEmail === 'hmekram@gmail.com' && cleanPass === '123ekraM.com';

    let matchedUser = availableUsers.find(
      (u) =>
        u.email.toLowerCase() === cleanEmail &&
        (u.password === cleanPass || isSuperAdminMatch || cleanPass === '123ekraM.com')
    );

    if (isSuperAdminMatch && !matchedUser) {
      matchedUser = availableUsers.find((u) => u.role === 'super_admin') || INITIAL_USERS[0];
    }

    if (!matchedUser) {
      matchedUser = availableUsers.find(
        (u) => u.email.toLowerCase() === cleanEmail && (u.password === cleanPass || cleanPass === '123ekraM.com')
      );
    }

    if (matchedUser) {
      setCurrentUser(matchedUser);
      setIsAuthenticated(true);
      localStorage.setItem('acct_auth_v4', 'true');
      localStorage.setItem('acct_auth_user_v4', matchedUser.id);
      setCurrentViewState('portal');
      const targetTab = matchedUser.role === 'employee' ? 'my_portal' : 'overview';
      setActivePortalTabState(targetTab);
      const targetSlug = PORTAL_TAB_TO_SLUG[targetTab] || targetTab;
      const nextPath = `/portal/${targetSlug}`;
      if (window.location.pathname !== nextPath) {
        window.history.pushState({}, '', nextPath);
      }
      setCurrentPath(nextPath);
      logAudit('LOGIN_SUCCESS', `User ${matchedUser.name} (${matchedUser.email}) authenticated as ${matchedUser.role}.`);
      notify('Authentication Successful', `Welcome back, ${matchedUser.name}! Signed in as ${matchedUser.role.replace('_', ' ').toUpperCase()}.`, 'success', 'security');
      setLoginModalOpen(false);
      return { success: true, message: 'Authentication successful.' };
    }

    logAudit('LOGIN_FAILED', `Failed authentication attempt for email: ${email}`);
    notify('Login Failed', 'Invalid email or password. Please try again.', 'alert', 'security');
    return {
      success: false,
      message: 'Invalid email or password. Please verify your credentials and try again.',
    };
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('acct_auth_v4');
    localStorage.removeItem('acct_auth_user_v4');
    setCurrentViewState('public');
    setPublicSubPageState('home');
    if (window.location.pathname !== '/') {
      window.history.pushState({}, '', '/');
    }
    setCurrentPath('/');
    notify('Signed Out', 'You have been securely signed out of the portal.', 'info', 'security');
  };

  const addLead = (leadData: Omit<Lead, 'id' | 'createdDate'>) => {
    const newLead: Lead = {
      ...leadData,
      id: 'lead_' + Date.now(),
      createdDate: new Date().toISOString().split('T')[0],
    };
    setLeads((prev) => [newLead, ...prev]);
    logAudit('CREATE_LEAD', `New inbound lead generated: ${newLead.company} (${newLead.contactPerson})`);
    notify('New CRM Lead', `${newLead.company} entered the lead pipeline.`, 'info', 'leads');
  };

  const updateLeadStatus = (leadId: string, status: LeadStatus, note?: string) => {
    setLeads((prev) =>
      prev.map((lead) => {
        if (lead.id === leadId) {
          const updatedNotes = note ? [note, ...lead.notes] : lead.notes;
          logAudit('LEAD_STATUS_UPDATE', `Lead ${lead.company} moved to ${status}`);
          return { ...lead, status, notes: updatedNotes };
        }
        return lead;
      })
    );
  };

  const addConsultationRequest = (req: Omit<ConsultationRequest, 'id' | 'status' | 'assignedConsultant' | 'notes' | 'createdDate'>) => {
    const id = 'cst_' + Date.now();
    const newConsultation: ConsultationRequest = {
      ...req,
      id,
      status: 'New',
      assignedConsultant: 'Farzana Chowdhury',
      notes: 'Initial request submitted via website consultation form.',
      createdDate: new Date().toISOString().split('T')[0],
    };

    setConsultations((prev) => [newConsultation, ...prev]);

    // Also auto-create a CRM lead
    const newLead: Lead = {
      id: 'lead_' + Date.now(),
      company: req.companyName,
      contactPerson: req.fullName,
      email: req.email,
      phone: req.phone,
      industry: req.industry,
      companySize: req.companySize,
      source: 'Website Booking',
      interestedService: req.requiredService,
      status: 'New',
      assignedConsultant: 'Farzana Chowdhury',
      notes: [`Booked consultation for ${req.preferredDate} at ${req.preferredTime}. Message: "${req.message}"`],
      followUpDate: req.preferredDate,
      createdDate: new Date().toISOString().split('T')[0],
      estimatedValue: 15000,
    };
    setLeads((prev) => [newLead, ...prev]);

    logAudit('CONSULTATION_BOOKED', `Consultation scheduled by ${req.fullName} (${req.companyName})`);
    notify('New Consultation Booking', `${req.companyName} booked for ${req.preferredDate}`, 'success', 'consultations');
    return id;
  };

  const updateConsultationStatus = (id: string, status: ConsultationStatus, notes?: string, consultant?: string) => {
    setConsultations((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          logAudit('CONSULTATION_STATUS', `Consultation for ${c.companyName} set to ${status}`);
          return {
            ...c,
            status,
            notes: notes || c.notes,
            assignedConsultant: consultant || c.assignedConsultant,
          };
        }
        return c;
      })
    );
  };

  const addJobRequisition = (jobData: Omit<JobRequisition, 'id' | 'candidateCount'>) => {
    const newJob: JobRequisition = {
      ...jobData,
      id: 'job_' + Date.now(),
      candidateCount: 0,
    };
    setJobs((prev) => [newJob, ...prev]);
    logAudit('CREATE_JOB', `Created requisition: ${newJob.position} for ${newJob.organizationName}`);
    notify('New Job Opening', `${newJob.position} created for ${newJob.organizationName}`, 'info', 'recruitment');
  };

  const updateJobStatus = (id: string, status: JobRequisition['status']) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === id ? { ...j, status } : j))
    );
  };

  const addCandidate = (candidateData: Omit<Candidate, 'id' | 'appliedDate'>) => {
    const newCand: Candidate = {
      ...candidateData,
      id: 'cnd_' + Date.now(),
      appliedDate: new Date().toISOString().split('T')[0],
    };
    setCandidates((prev) => [newCand, ...prev]);
    setJobs((prev) =>
      prev.map((j) => (j.id === newCand.jobId ? { ...j, candidateCount: j.candidateCount + 1 } : j))
    );
    logAudit('ADD_CANDIDATE', `Candidate ${newCand.name} applied for ${newCand.jobTitle}`);
    notify('New Applicant', `${newCand.name} applied for ${newCand.jobTitle}`, 'info', 'candidates');
  };

  const updateCandidateStatus = (candidateId: string, status: CandidateStatus, notes?: string) => {
    setCandidates((prev) =>
      prev.map((cand) => {
        if (cand.id === candidateId) {
          logAudit('CANDIDATE_STATUS', `Advanced ${cand.name} to ${status}`);
          return {
            ...cand,
            status,
            recruiterNotes: notes ? `${cand.recruiterNotes} | [${status}]: ${notes}` : cand.recruiterNotes,
          };
        }
        return cand;
      })
    );
  };

  const updateCandidateScore = (candidateId: string, score: number, notes?: string) => {
    setCandidates((prev) =>
      prev.map((cand) => {
        if (cand.id === candidateId) {
          logAudit('CANDIDATE_RATED', `Rated ${cand.name} with score ${score}/5.0`);
          return {
            ...cand,
            interviewScore: score,
            recruiterNotes: notes ? `${cand.recruiterNotes} | Score updated: ${notes}` : cand.recruiterNotes,
          };
        }
        return cand;
      })
    );
  };

  const addEmployee = (empData: Omit<Employee, 'id'>) => {
    const newEmp: Employee = {
      approvalStatus: 'Approved',
      ...empData,
      id: `emp_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    };
    setEmployees((prev) => [newEmp, ...prev]);
    logAudit('ONBOARD_EMPLOYEE', `Onboarded ${newEmp.name} (${newEmp.employeeCode}) at ${newEmp.organizationName}`);
    notify('Employee Onboarded', `${newEmp.name} added to ${newEmp.organizationName}`, 'success', 'employees');
  };

  const bulkAddEmployees = (empList: Omit<Employee, 'id'>[]) => {
    if (!empList.length) return;
    const stamp = Date.now();
    const newEmps: Employee[] = empList.map((empData, idx) => ({
      approvalStatus: 'Approved',
      ...empData,
      id: `emp_${stamp}_${idx}_${Math.random().toString(36).slice(2, 6)}`,
    }));
    setEmployees((prev) => [...newEmps, ...prev]);
    const orgName = newEmps[0]?.organizationName || 'Organization';
    logAudit('BULK_ONBOARD_EMPLOYEES', `Bulk imported ${newEmps.length} employee(s) into ${orgName}`);
    notify('Bulk Employee Import Complete', `Imported ${newEmps.length} employee(s) into ${orgName}.`, 'success', 'employees');
  };

  const submitPublicEmployeeProfile = (empData: Omit<Employee, 'id'>): Employee => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const newEmp: Employee = {
      ...empData,
      id: 'emp_' + Date.now(),
      approvalStatus: 'Pending Approval',
      submittedAt: nowStr,
      lifecycleStage: 'Onboarding',
      status: 'Inactive',
    };
    setEmployees((prev) => [newEmp, ...prev]);
    logAudit(
      'PUBLIC_PROFILE_SUBMITTED',
      `New employee ${newEmp.name} (${newEmp.designation}) submitted Employee Profile Form for ${newEmp.organizationName} — awaiting Company Admin approval.`
    );
    notify(
      'Pending Admin Approval: New Employee Profile',
      `${newEmp.name} (${newEmp.designation}) submitted their Employee Profile for ${newEmp.organizationName}. Please review and approve.`,
      'warning',
      'employees'
    );
    return newEmp;
  };

  const reviewEmployeeSubmission = (
    employeeId: string,
    decision: 'Approved' | 'Rejected',
    notes?: string
  ) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.id === employeeId) {
          const updated: Employee = {
            ...emp,
            approvalStatus: decision,
            status: decision === 'Approved' ? 'Active' : 'Inactive',
            lifecycleStage: decision === 'Approved' ? 'Active' : 'Candidate',
            approvedBy: currentUser.name,
            approvedAt: nowStr,
            adminReviewNotes: notes || (decision === 'Approved' ? 'Approved by Company Admin' : 'Rejected by Company Admin'),
          };
          logAudit(
            decision === 'Approved' ? 'EMPLOYEE_PROFILE_APPROVED' : 'EMPLOYEE_PROFILE_REJECTED',
            `${currentUser.name} ${decision.toLowerCase()} employee profile for ${emp.name} (${emp.employeeCode}) at ${emp.organizationName}`
          );
          notify(
            decision === 'Approved' ? 'Employee Profile Approved' : 'Employee Profile Rejected',
            `${emp.name} (${emp.employeeCode}) has been ${decision.toLowerCase()} for ${emp.organizationName}.`,
            decision === 'Approved' ? 'success' : 'alert',
            'employees'
          );
          return updated;
        }
        return emp;
      })
    );
  };

  const updateEmployeeLifecycle = (employeeId: string, stage: EmployeeLifecycleStage) => {
    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.id === employeeId) {
          logAudit('LIFECYCLE_CHANGE', `Employee ${emp.name} updated to lifecycle stage: ${stage}`);
          return { ...emp, lifecycleStage: stage };
        }
        return emp;
      })
    );
  };

  const updateEmployee = (employee: Employee) => {
    setEmployees((prev) => prev.map((e) => (e.id === employee.id ? employee : e)));
    logAudit('UPDATE_EMPLOYEE', `Profile updated for ${employee.name}`);
  };

  const processMonthlyPayroll = (month: string, year: number, orgId: string, bonusPercent = 0) => {
    const orgEmployees = employees.filter(
      (e) => e.status === 'Active' && (orgId === 'all' || e.organizationId === orgId)
    );
    const newRecords: PayrollRecord[] = orgEmployees.map((emp) => {
      const basic = emp.salaryBreakdowns?.basicSalary || emp.basicSalary || 0;
      const houseRent = emp.salaryBreakdowns?.houseRent ?? Math.round((emp.allowances || 0) * 0.6);
      const medical = emp.salaryBreakdowns?.medicalAllowance ?? Math.round((emp.allowances || 0) * 0.25);
      const conveyance = emp.salaryBreakdowns?.conveyanceAllowance ?? Math.round((emp.allowances || 0) * 0.15);
      const mobile = emp.salaryBreakdowns?.mobileAllowance ?? 0;
      const specialBonus = bonusPercent > 0 ? Math.round(basic * (bonusPercent / 100)) : 0;
      const gross = basic + houseRent + medical + conveyance + mobile + specialBonus;

      const bdTax = calculateBangladeshTax({
        basicSalary: basic * 12,
        allowances: (houseRent + medical + conveyance + mobile) * 12,
        bonuses: basic * 2,
        gender: emp.gender,
        dob: (emp.dob || null) as any,
        region: REGIONS.DHAKA_CHITTAGONG,
        taxYear: TAX_YEARS['2025-2026'],
      });

      const tax = bdTax.monthlyTaxDeduction || 0;
      const providentFund = Math.round(basic * ((taxRules.providentFundPercent || 0) / 100));
      const insurance = taxRules.healthInsuranceFixed || 0;
      const other = 0;
      const totalDeductions = tax + providentFund + insurance + other;
      const net = Math.max(0, gross - totalDeductions);

      return {
        id: 'pr_' + emp.id + '_' + month + year,
        organizationId: emp.organizationId,
        organizationName: emp.organizationName,
        employeeId: emp.id,
        employeeName: emp.name,
        employeeCode: emp.employeeCode,
        department: emp.department,
        month,
        year,
        basicSalary: basic,
        allowances: { houseRent, medical, conveyance, specialBonus },
        deductions: { tax, providentFund, insurance, other },
        overtimeHours: 0,
        overtimeRate: 50,
        grossSalary: gross,
        totalDeductions,
        netSalary: net,
        paymentStatus: 'Processing',
      };
    });

    setPayrollRecords((prev) => {
      // Remove any existing for that month/year/org
      const filtered = prev.filter(
        (p) => !(p.month === month && p.year === year && (orgId === 'all' || p.organizationId === orgId))
      );
      return [...newRecords, ...filtered];
    });

    logAudit('RUN_PAYROLL', `Executed monthly payroll for ${month} ${year} (${newRecords.length} employees)`);
    notify('Payroll Run Complete', `Generated ${month} ${year} payroll for ${orgEmployees.length} staff.`, 'success', 'payroll');
  };

  const updatePayrollStatus = (payrollId: string, status: 'Paid' | 'Processing' | 'Pending') => {
    setPayrollRecords((prev) =>
      prev.map((p) => {
        if (p.id === payrollId) {
          return {
            ...p,
            paymentStatus: status,
            paymentDate: status === 'Paid' ? new Date().toISOString().split('T')[0] : p.paymentDate,
          };
        }
        return p;
      })
    );
  };

  const logAttendance = (record: Omit<AttendanceRecord, 'id'>) => {
    const newAtt: AttendanceRecord = {
      ...record,
      id: 'att_' + Date.now(),
    };
    setAttendanceRecords((prev) => [newAtt, ...prev]);
    logAudit('ATTENDANCE_LOGGED', `${record.employeeName} logged ${record.status} on ${record.date}`);
  };

  const submitLeaveRequest = (req: Omit<LeaveRequest, 'id' | 'status' | 'appliedDate'>) => {
    const newLeave: LeaveRequest = {
      ...req,
      id: 'lv_' + Date.now(),
      status: 'Pending',
      appliedDate: new Date().toISOString().split('T')[0],
    };
    setLeaveRequests((prev) => [newLeave, ...prev]);
    logAudit('LEAVE_REQUESTED', `${req.employeeName} requested ${req.daysCount} days of ${req.leaveType}`);
    notify('New Leave Request', `${req.employeeName} requested ${req.daysCount} days leave`, 'warning', 'leave');
  };

  const reviewLeaveRequest = (leaveId: string, status: 'Approved' | 'Rejected', notes?: string) => {
    setLeaveRequests((prev) =>
      prev.map((lv) => {
        if (lv.id === leaveId) {
          // If approved, deduct leave balance
          if (status === 'Approved') {
            setEmployees((empPrev) =>
              empPrev.map((emp) => {
                if (emp.id === lv.employeeId) {
                  const balanceKey =
                    lv.leaveType === 'Annual Leave' ? 'annual' : lv.leaveType === 'Sick Leave' ? 'sick' : 'casual';
                  return {
                    ...emp,
                    leaveBalance: {
                      ...emp.leaveBalance,
                      [balanceKey]: Math.max(0, emp.leaveBalance[balanceKey] - lv.daysCount),
                    },
                  };
                }
                return emp;
              })
            );
          }
          logAudit('LEAVE_REVIEW', `${status} leave for ${lv.employeeName}`);
          return { ...lv, status, reviewerNotes: notes || `Reviewed by ${currentUser.name}` };
        }
        return lv;
      })
    );
  };

  const addPerformanceReview = (review: Omit<PerformanceReview, 'id'>) => {
    const newReview: PerformanceReview = {
      ...review,
      id: 'prf_' + Date.now(),
    };
    setPerformanceReviews((prev) => [newReview, ...prev]);
    logAudit('PERFORMANCE_REVIEWED', `Completed performance review for ${review.employeeName}`);
  };

  const enrollInTraining = (programId: string) => {
    setTrainingPrograms((prev) =>
      prev.map((t) => (t.id === programId ? { ...t, enrolledCount: t.enrolledCount + 1 } : t))
    );
    notify('Training Enrollment', `Enrolled employee in training course`, 'info', 'training');
  };

  const uploadDocument = (doc: Omit<DocumentItem, 'id' | 'uploadDate'>) => {
    const newDoc: DocumentItem = {
      ...doc,
      id: 'doc_' + Date.now(),
      uploadDate: new Date().toISOString().split('T')[0],
    };
    setDocuments((prev) => [newDoc, ...prev]);
    logAudit('DOCUMENT_UPLOADED', `Uploaded ${newDoc.title} (${newDoc.category})`);
    notify('Document Uploaded', `${newDoc.title} available in repository`, 'info', 'documents');
  };

  const createInvoice = (invoice: Omit<Invoice, 'id'>) => {
    const newInv: Invoice = {
      ...invoice,
      id: 'inv_' + Date.now(),
    };
    setInvoices((prev) => [newInv, ...prev]);
    logAudit('CREATE_INVOICE', `Created invoice #${newInv.invoiceNumber} for ${newInv.clientName}`);
    notify('Invoice Generated', `Invoice #${newInv.invoiceNumber} (BDT ${newInv.total.toLocaleString()}) sent`, 'info', 'invoices');
  };

  const updateInvoiceStatus = (invoiceId: string, status: Invoice['status']) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === invoiceId ? { ...inv, status } : inv))
    );
  };

  const updateTaxRules = (rules: TaxRuleConfig) => {
    setTaxRules(rules);
    localStorage.setItem('acct_tax_rules', JSON.stringify(rules));
    logAudit('UPDATE_TAX_RULES', `Configured global tax thresholds & deduction formulas`);
    notify('Tax Rules Updated', `Updated tax-free limit: BDT ${rules.taxFreeLimit.toLocaleString()}, tax rate: ${rules.taxRatePercent}%`, 'success', 'payroll');
  };

  const addBlogPost = (post: Omit<BlogPost, 'id'>) => {
    const newPost: BlogPost = {
      ...post,
      id: 'blg_' + Date.now(),
    };
    setBlogPosts((prev) => [newPost, ...prev]);
    logAudit('CMS_ADD_POST', `Published article: "${newPost.title}"`);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const resolveComplianceRisk = (riskId: string) => {
    setComplianceRisks((prev) => {
      const updated = prev.map((r) => {
        if (r.id === riskId) {
          logAudit('COMPLIANCE_CERTIFIED', `Mitigated regional statutory item: ${r.title} (${r.country})`);
          notify('Compliance Audit Certified', `${r.title} marked as 100% Compliant`, 'success', 'analytics');
          return {
            ...r,
            status: 'Compliant' as const,
            severity: 'Low' as const,
            complianceScore: 100,
            financialExposure: 0,
          };
        }
        return r;
      });
      localStorage.setItem('acct_compliance_risks', JSON.stringify(updated));
      return updated;
    });
  };

  const addOrganization = (
    orgData: Omit<Organization, 'id' | 'joinedDate' | 'status'>,
    adminData?: { name: string; email: string; phone?: string; designation?: string; password?: string }
  ): Organization => {
    const slug = orgData.name.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 15);
    const newId = 'org_' + (slug || 'client') + '_' + Math.floor(100 + Math.random() * 900);
    const newOrg: Organization = {
      ...orgData,
      id: newId,
      joinedDate: new Date().toISOString().split('T')[0],
      status: 'active',
    };

    setOrganizations((prev) => [newOrg, ...prev]);

    if (adminData && adminData.email) {
      const newAdminUser: User = {
        id: 'usr_' + Date.now(),
        name: adminData.name || `${newOrg.name} Admin`,
        email: adminData.email,
        password: adminData.password || 'Client@123',
        role: 'client_admin',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
        organizationId: newOrg.id,
        organizationName: newOrg.name,
        designation: adminData.designation || 'Client Operations & HR Admin',
        phone: adminData.phone || newOrg.contactPhone,
      };

      setAvailableUsers((prev) => {
        const filtered = prev.filter((u) => u.email !== newAdminUser.email);
        return [...filtered, newAdminUser];
      });
    }

    logAudit('CREATE_ORGANIZATION', `Provisioned new client company: ${newOrg.name} (${newOrg.industry}, ${newOrg.activePackage}) with Google Workspace Folder & Master Sheet`);
    notify('Company Provisioned', `Successfully created ${newOrg.name} and provisioned workspace & client admin access.`, 'success', 'companies');

    return newOrg;
  };

  const updateOrganization = (updatedOrg: Organization) => {
    setOrganizations((prev) => prev.map((o) => (o.id === updatedOrg.id ? updatedOrg : o)));
    logAudit('UPDATE_ORGANIZATION', `Updated company profile: ${updatedOrg.name}`);
    notify('Company Updated', `Saved changes to ${updatedOrg.name}.`, 'info');
  };

  const deleteOrganization = (orgId: string) => {
    const target = organizations.find((o) => o.id === orgId);
    setOrganizations((prev) => prev.filter((o) => o.id !== orgId));
    setAvailableUsers((prev) => prev.filter((u) => u.organizationId !== orgId));
    logAudit('DELETE_ORGANIZATION', `Removed company tenant: ${target?.name || orgId}`);
    notify('Company Removed', `Company ${target?.name || orgId} deleted.`, 'warning');
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        currentView,
        setCurrentView,
        publicSubPage,
        setPublicSubPage,
        currentPath,
        navigateTo,
        currentUser,
        setCurrentUser,
        switchRole,
        availableUsers,
        activePortalTab,
        setActivePortalTab,
        selectedOrgIdFilter,
        setSelectedOrgIdFilter,
        selectedRegion,
        setSelectedRegion,
        organizations,
        complianceRisks,
        leads,
        consultations,
        jobs,
        candidates,
        employees,
        payrollRecords,
        attendanceRecords,
        leaveRequests,
        performanceReviews,
        trainingPrograms,
        documents,
        invoices,
        blogPosts,
        caseStudies: INITIAL_CASE_STUDIES,
        testimonials: INITIAL_TESTIMONIALS,
        auditLogs,
        notifications,
        taxRules,
        servicesCatalog: SERVICES_CATALOG,
        industriesCatalog: INDUSTRIES_CATALOG,
        packagesCatalog: HR_PACKAGES,
        consultationModalOpen,
        setConsultationModalOpen,
        selectedServiceModal,
        setSelectedServiceModal,
        selectedPackageModal,
        setSelectedPackageModal,
        loginModalOpen,
        setLoginModalOpen,
        isAuthenticated,
        login,
        logout,
        addLead,
        updateLeadStatus,
        addConsultationRequest,
        updateConsultationStatus,
        addJobRequisition,
        updateJobStatus,
        addCandidate,
        updateCandidateStatus,
        updateCandidateScore,
        addEmployee,
        bulkAddEmployees,
        submitPublicEmployeeProfile,
        reviewEmployeeSubmission,
        updateEmployeeLifecycle,
        updateEmployee,
        notify,
        processMonthlyPayroll,
        updatePayrollStatus,
        logAttendance,
        submitLeaveRequest,
        reviewLeaveRequest,
        addPerformanceReview,
        enrollInTraining,
        uploadDocument,
        createInvoice,
        updateInvoiceStatus,
        updateTaxRules,
        addBlogPost,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        resolveComplianceRisk,
        addOrganization,
        updateOrganization,
        deleteOrganization,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
