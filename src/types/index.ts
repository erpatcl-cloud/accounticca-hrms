export type Role = 'super_admin' | 'hr_consultant' | 'recruitment_manager' | 'client_admin' | 'employee';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: Role;
  avatar: string;
  organizationId: string;
  organizationName: string;
  designation: string;
  phone?: string;
}

export interface CompanyLegalInfo {
  businessType: string;
  incorporationDate: string;
  registrationNumber: string;
  certificateIncorporationUrl?: string;
  tradeLicenseNumber: string;
  tradeLicenseExpiryDate: string;
  tradeLicenseCopyUrl?: string;
  binNumber: string;
  binCertificateUrl?: string;
  tinNumber: string;
  tinCertificateUrl?: string;
  rjscRegistrationNumber: string;
  rjscDocumentsUrl?: string;
}

export interface CompanyContactInfo {
  corporateEmail: string;
  supportEmail?: string;
  hrEmail?: string;
  accountsEmail?: string;
  websiteUrl?: string;
  facebookUrl?: string;
  linkedinUrl?: string;
  youtubeUrl?: string;
  whatsappNumber?: string;
  hotlineNumber?: string;
  faxNumber?: string;
}

export interface CompanyHeadOffice {
  name: string;
  addressLine1: string;
  addressLine2?: string;
  area: string;
  city: string;
  district: string;
  division: string;
  postalCode: string;
  country: string;
  mapLocation?: string;
  latitude?: number;
  longitude?: number;
}

export interface CompanyBranch {
  id: string;
  name: string;
  code: string;
  manager: string;
  address: string;
  latitude?: number;
  longitude?: number;
  geofenceRadius?: number;
  contactNumber: string;
  email: string;
  status: 'Active' | 'Inactive';
}

export interface CompanyBusinessInfo {
  industryType: string;
  businessNature: string;
  products?: string;
  services?: string;
  authorizedCapital: number;
  paidUpCapital: number;
  numDirectors: number;
  numShareholders: number;
  numDepartments: number;
}

export interface CompanyComplianceInfo {
  weeklyHoliday: string;
  workingDays: string[];
  startTime: string;
  endTime: string;
  ramadanStartTime: string;
  ramadanEndTime: string;
  leavePolicyUrl?: string;
  hrPolicyUrl?: string;
  employeeHandbookUrl?: string;
  codeOfConductUrl?: string;
}

export interface CompanyPayrollSettings {
  salaryPaymentDate: number;
  payrollMonthClosingDate: number;
  overtimePolicy: string;
  bonusPolicy: string;
  eidBonusPolicy: string;
  festivalBonusPolicy: string;
  incrementPolicy: string;
  taxDeductionPolicy: string;
}

export interface CompanyTaxVatInfo {
  taxZone: string;
  taxCircle: string;
  vatCircle: string;
  vatCommissionerate: string;
  authorizedTaxRepresentative: string;
  taxConsultantInfo: string;
}

export interface CompanyBankAccount {
  id: string;
  bankName: string;
  branchName: string;
  accountName: string;
  accountNumber: string;
  routingNumber: string;
  swiftCode?: string;
  certificateUrl?: string;
  isPrimary?: boolean;
}

export interface CompanyVaultDocument {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  fileData?: string;
}

export interface CompanyAssetsSummary {
  total: number;
  assigned: number;
  available: number;
  maintenance: number;
  retired: number;
}

export interface CompanyRecruitmentSummary {
  openPositions: number;
  totalApplicants: number;
  underReview: number;
  interviewsScheduled: number;
  hiredThisQuarter: number;
}

export interface CompanySecuritySettings {
  superAdminAccess: boolean;
  hrManagerAccess: boolean;
  directorReadOnlyAccess: boolean;
}

export interface CompanyAuditLogEntry {
  id: string;
  timestamp: string;
  modifiedBy: string;
  action: string;
  details: string;
}

export interface Organization {
  id: string;
  name: string;
  nameBangla?: string;
  shortName?: string;
  slogan?: string;
  description?: string;
  vision?: string;
  mission?: string;
  coreValues?: string;
  logoUrl?: string;
  coverUrl?: string;
  sealUrl?: string;
  industry: string;
  size: string;
  country: string;
  contactEmail: string;
  contactPhone: string;
  assignedConsultantId: string;
  assignedConsultantName: string;
  activePackage: 'Startup HR' | 'SME HR' | 'Corporate HR' | 'Managed HR';
  activeServices: string[];
  joinedDate: string;
  status: 'active' | 'onboarding' | 'suspended';

  // Rich Corporate Profiles matching ATCL benchmark
  legalInfo?: CompanyLegalInfo;
  contactInfo?: CompanyContactInfo;
  headOffice?: CompanyHeadOffice;
  branches?: CompanyBranch[];
  businessInfo?: CompanyBusinessInfo;
  compliance?: CompanyComplianceInfo;
  payrollSettings?: CompanyPayrollSettings;
  taxVat?: CompanyTaxVatInfo;
  bankAccounts?: CompanyBankAccount[];
  documents?: CompanyVaultDocument[];
  assetsSummary?: CompanyAssetsSummary;
  recruitment?: CompanyRecruitmentSummary;
  securitySettings?: CompanySecuritySettings;
  auditLogs?: CompanyAuditLogEntry[];
}

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Won' | 'Lost';

export interface Lead {
  id: string;
  company: string;
  contactPerson: string;
  email: string;
  phone: string;
  industry: string;
  companySize: string;
  source: 'Website Booking' | 'Referral' | 'LinkedIn' | 'Direct Inbound' | 'Event';
  interestedService: string;
  status: LeadStatus;
  assignedConsultant: string;
  notes: string[];
  followUpDate: string;
  createdDate: string;
  estimatedValue: number;
}

export type ConsultationStatus = 'New' | 'Contacted' | 'Consultation Scheduled' | 'Completed' | 'Proposal Sent' | 'Converted' | 'Closed';

export interface ConsultationRequest {
  id: string;
  fullName: string;
  companyName: string;
  designation: string;
  email: string;
  phone: string;
  industry: string;
  companySize: string;
  requiredService: string;
  preferredDate: string;
  preferredTime: string;
  message: string;
  status: ConsultationStatus;
  assignedConsultant: string;
  notes: string;
  createdDate: string;
}

export type CandidateStatus =
  | 'Applied'
  | 'Screening'
  | 'Shortlisted'
  | 'Interview'
  | 'Assessment'
  | 'Final Interview'
  | 'Selected'
  | 'Offer'
  | 'Hired'
  | 'Rejected';

export interface Candidate {
  id: string;
  organizationId: string;
  organizationName: string;
  jobId: string;
  jobTitle: string;
  name: string;
  email: string;
  phone: string;
  cvUrl?: string;
  summary: string;
  education: string;
  experienceYears: number;
  currentCompany: string;
  skills: string[];
  expectedSalary: number;
  currentSalary: number;
  noticePeriod: string;
  interviewScore: number; // 1-5
  recruiterNotes: string;
  status: CandidateStatus;
  appliedDate: string;
}

export interface JobRequisition {
  id: string;
  organizationId: string;
  organizationName: string;
  position: string;
  department: string;
  location: string;
  employmentType: 'Full-time' | 'Part-time' | 'Contract' | 'Remote';
  salaryRange: string;
  vacancies: number;
  description: string;
  requiredSkills: string[];
  experienceRequired: string;
  deadline: string;
  assignedRecruiter: string;
  status: 'Open' | 'Interviewing' | 'Filled' | 'On Hold';
  candidateCount: number;
}

export type EmployeeLifecycleStage =
  | 'Candidate'
  | 'Onboarding'
  | 'Active'
  | 'Probation'
  | 'Confirmed'
  | 'Resigned'
  | 'Exit';

export interface EmployeeSalaryBreakdown {
  basicSalary: number;
  houseRent: number;
  medicalAllowance: number;
  conveyanceAllowance: number;
  mobileAllowance: number;
  grossSalary: number;
}

export interface EmployeeBankingProfile {
  bankName: string;
  bankAccountNo: string;
  bankBranchCode?: string;
  bankProductCode?: string;
  tin?: string;
  taxZone?: string;
  taxCircle?: string;
}

export interface Employee {
  id: string;
  organizationId: string;
  organizationName: string;
  employeeCode: string;
  name: string;
  fullNameBangla?: string;
  email: string;
  phone: string;
  emergencyContact: string;
  photo: string;
  department: string;
  designation: string;
  joiningDate: string;
  employmentType: 'Full-time' | 'Contract' | 'Part-time' | 'Intern';
  lifecycleStage: EmployeeLifecycleStage;
  manager: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  leaveBalance: {
    annual: number;
    sick: number;
    casual: number;
  };
  performanceScore: number;
  status: 'Active' | 'On Leave' | 'Terminated' | 'Resigned' | 'Inactive';

  // Rich Official & Personal Particulars
  intercom?: string;
  educationalQualification?: string;
  dob?: string;
  gender?: 'male' | 'female' | 'other';
  bloodGroup?: string;
  maritalStatus?: 'Single' | 'Married' | 'Divorced';
  nationality?: string;
  nid?: string;
  passportNumber?: string;
  fatherName?: string;
  motherName?: string;
  nominee?: string;
  nomineePhone?: string;
  nomineeDob?: string;

  // Contact Particulars
  personalMobileNumber?: string;
  requestedPhoneNumbers?: string;
  personalEmailAddress?: string;
  presentAddress?: string;
  permanentAddress?: string;

  // Document & Media Links (Master Employee Information Sheet)
  nidCopyLink?: string;
  passportCopyLink?: string;
  nomineePhotoLink?: string;
  nomineeIdLink?: string;

  // Financial Breakdown & Banking
  salaryBreakdowns?: EmployeeSalaryBreakdown;
  bankingProfile?: EmployeeBankingProfile;

  // Public Onboarding & Admin Approval Workflow
  approvalStatus?: 'Pending Approval' | 'Approved' | 'Rejected';
  submittedAt?: string;
  approvedBy?: string;
  approvedAt?: string;
  adminReviewNotes?: string;
}

export interface PayrollRecord {
  id: string;
  organizationId: string;
  organizationName: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  department: string;
  month: string;
  year: number;
  basicSalary: number;
  allowances: {
    houseRent: number;
    medical: number;
    conveyance: number;
    specialBonus: number;
  };
  deductions: {
    tax: number;
    providentFund: number;
    insurance: number;
    other: number;
  };
  overtimeHours: number;
  overtimeRate: number;
  grossSalary: number;
  totalDeductions: number;
  netSalary: number;
  paymentStatus: 'Paid' | 'Processing' | 'Pending';
  paymentDate?: string;
}

export type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Half Day' | 'Remote' | 'On Leave';

export interface AttendanceRecord {
  id: string;
  organizationId: string;
  employeeId: string;
  employeeName: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: AttendanceStatus;
  workHours: number;
  notes?: string;
}

export type LeaveType = 'Annual Leave' | 'Sick Leave' | 'Casual Leave' | 'Maternity/Paternity' | 'Unpaid Leave';
export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';

export interface LeaveRequest {
  id: string;
  organizationId: string;
  organizationName: string;
  employeeId: string;
  employeeName: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  daysCount: number;
  reason: string;
  status: LeaveStatus;
  appliedDate: string;
  reviewerNotes?: string;
}

export interface PerformanceReview {
  id: string;
  organizationId: string;
  organizationName: string;
  employeeId: string;
  employeeName: string;
  department: string;
  reviewPeriod: string;
  kpis: { title: string; target: string; achieved: string; weightage: number; score: number }[];
  okrs: { objective: string; keyResult: string; progress: number }[];
  selfScore: number;
  managerScore: number;
  finalScore: number;
  strengths: string;
  improvements: string;
  recommendation: 'Promotion Ready' | 'Exceeds Expectations' | 'Meets Expectations' | 'Needs Improvement (PIP)';
  status: 'Completed' | 'In Review' | 'Draft';
  reviewDate: string;
}

export interface TrainingProgram {
  id: string;
  title: string;
  category: 'Leadership' | 'Compliance' | 'Technical' | 'Soft Skills' | 'Management';
  trainer: string;
  durationHours: number;
  targetAudience: string;
  enrolledCount: number;
  completionRate: number;
  status: 'Upcoming' | 'In Progress' | 'Completed';
  startDate: string;
  description: string;
}

export interface DocumentItem {
  id: string;
  organizationId: string;
  organizationName: string;
  title: string;
  category:
    | 'Employment Contracts'
    | 'Appointment Letters'
    | 'Employee Handbook'
    | 'HR Policies'
    | 'Salary Documents'
    | 'Performance Documents'
    | 'Compliance Documents';
  fileType: 'PDF' | 'DOCX' | 'XLSX';
  fileSize: string;
  uploadedBy: string;
  uploadDate: string;
  version: string;
  expiryDate?: string;
  accessRole: 'all' | 'admin_only' | 'consultant_only';
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  organizationId: string;
  clientName: string;
  service: string;
  issueDate: string;
  dueDate: string;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discount: number;
  total: number;
  status: 'Draft' | 'Sent' | 'Paid' | 'Partially Paid' | 'Overdue' | 'Cancelled';
  paymentMethod?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  summary: string;
  content: string;
  author: string;
  authorRole: string;
  authorAvatar: string;
  publishDate: string;
  readTime: string;
  tags: string[];
  featuredImage: string;
}

export type PublicPageType =
  | 'home'
  | 'about'
  | 'team'
  | 'clients'
  | 'services'
  | 'solutions'
  | 'challenges'
  | 'industries'
  | 'packages'
  | 'process'
  | 'digital-hr'
  | 'case-studies'
  | 'testimonials'
  | 'blog'
  | 'consultation'
  | 'contact'
  | 'employee-info';

export interface CaseStudy {
  id: string;
  slug?: string;
  title: string;
  clientType: string;
  industry: string;
  imageUrl?: string;
  challenge: string;
  solution: string;
  metrics: { label: string; value: string }[];
  quote: string;
  quoteAuthor: string;
}

export interface Testimonial {
  id: string;
  name: string;
  position: string;
  company: string;
  industry: string;
  avatar: string;
  content: string;
  rating: number;
  metricHighlight: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userName: string;
  userRole: string;
  action: string;
  details: string;
  ipAddress: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  read: boolean;
  linkAction?: string;
}

export interface TaxRuleConfig {
  taxFreeLimit: number;
  taxRatePercent: number;
  providentFundPercent: number;
  healthInsuranceFixed: number;
  socialSecurityPercent: number;
}

export type RegionId = 'all' | 'North America' | 'Europe & UK' | 'Asia-Pacific' | 'Middle East & Africa';

export type ComplianceRiskSeverity = 'Low' | 'Moderate' | 'High';

export interface RegionalComplianceRisk {
  id: string;
  region: Exclude<RegionId, 'all'>;
  country: string;
  hubCity: string;
  organizationId: string;
  organizationName: string;
  title: string;
  regulatoryFramework: string;
  severity: ComplianceRiskSeverity;
  complianceScore: number; // 0 - 100
  affectedHeadcount: number;
  financialExposure: number;
  dueDate: string;
  status: 'Compliant' | 'Action Required' | 'In Audit';
  advisoryNote: string;
}

export interface RegionalHubNode {
  id: string;
  region: Exclude<RegionId, 'all'>;
  country: string;
  city: string;
  coordinates: { x: number; y: number }; // Percentage/SVG viewBox (0-1000 x 0-500)
  currencyCode: string;
  statutoryAuthority: string;
  employerTaxRate: string;
  timeToHireDays: number;
  turnoverRate: string;
  enpsScore: number;
}

