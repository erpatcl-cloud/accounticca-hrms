import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Employee } from '../../types';
import {
  Briefcase,
  User,
  Phone,
  Landmark,
  MapPin,
  CreditCard,
  CheckCircle2,
  Sparkles,
  Upload,
  Send,
  Building2,
  ShieldCheck,
  Clock,
  ArrowRight,
  ArrowLeft,
  Layers,
  Copy,
  Check,
  FileCheck2,
  ExternalLink,
} from 'lucide-react';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
];

export const PublicEmployeeInfoFormPage: React.FC = () => {
  const { organizations, submitPublicEmployeeProfile, navigateTo, setCurrentView, setActivePortalTab } =
    useApp();

  // Check if URL has ?org=...
  const initialOrgId = useMemo(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const orgParam = params.get('org');
      if (orgParam && organizations.some((o) => o.id === orgParam)) {
        return orgParam;
      }
    }
    return organizations[0]?.id || 'org_apex';
  }, [organizations]);

  const [activeTab, setActiveTab] = useState<'official' | 'personal' | 'contact' | 'finance'>('official');
  const [viewAllSections, setViewAllSections] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [submittedEmployee, setSubmittedEmployee] = useState<Employee | null>(null);

  // Form State matching Employee Profile • Accounticca HRMS
  const [organizationId, setOrganizationId] = useState<string>(initialOrgId);
  const [employeeCode] = useState<string>(() => `EMP-${Math.floor(1000 + Math.random() * 9000)}`);
  const [photo, setPhoto] = useState<string>(PRESET_AVATARS[0]);

  // 1. Official Information
  const [name, setName] = useState<string>('');
  const [fullNameBangla, setFullNameBangla] = useState<string>('');
  const [department, setDepartment] = useState<string>('Engineering');
  const [designation, setDesignation] = useState<string>('');
  const [joiningDate, setJoiningDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [employmentType, setEmploymentType] = useState<Employee['employmentType']>('Full-time');
  const [manager, setManager] = useState<string>('HR & Department Lead');
  const [intercom, setIntercom] = useState<string>('105');
  const [educationalQualification, setEducationalQualification] = useState<string>('');

  // 2. Personal Particulars
  const [dob, setDob] = useState<string>('1995-01-15');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [bloodGroup, setBloodGroup] = useState<string>('O+');
  const [maritalStatus, setMaritalStatus] = useState<'Single' | 'Married' | 'Divorced'>('Single');
  const [nationality, setNationality] = useState<string>('Bangladeshi');
  const [nid, setNid] = useState<string>('');
  const [passportNumber, setPassportNumber] = useState<string>('');
  const [fatherName, setFatherName] = useState<string>('');
  const [motherName, setMotherName] = useState<string>('');
  const [nominee, setNominee] = useState<string>('');
  const [emergencyContact, setEmergencyContact] = useState<string>('');

  // 3. Contact Particulars
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [personalMobileNumber, setPersonalMobileNumber] = useState<string>('');
  const [personalEmailAddress, setPersonalEmailAddress] = useState<string>('');
  const [presentAddress, setPresentAddress] = useState<string>('');
  const [permanentAddress, setPermanentAddress] = useState<string>('');

  // 4. Financial & Banking Particulars
  const [basicSalary, setBasicSalary] = useState<number>(50000);
  const [bankName, setBankName] = useState<string>('Al-Arafah Islami Bank Ltd.');
  const [bankAccountNo, setBankAccountNo] = useState<string>('');
  const [bankBranchCode, setBankBranchCode] = useState<string>('014');
  const [bankProductCode, setBankProductCode] = useState<string>('014');
  const [tin, setTin] = useState<string>('');
  const [taxZone, setTaxZone] = useState<string>('Zone 15');
  const [taxCircle, setTaxCircle] = useState<string>('Circle 1');

  const selectedOrg =
    organizations.find((o) => o.id === organizationId) ||
    organizations[0] || { id: 'org_apex', name: 'Apex FinTech Solutions Ltd.' };

  // Salary Breakdown Calculations (matching Employee Profile • Accounticca HRMS)
  const bSalary = Number(basicSalary) || 0;
  const houseRent = Math.round(bSalary * 0.4);
  const medicalAllowance = Math.round(bSalary * 0.1);
  const conveyanceAllowance = Math.round(bSalary * 0.08);
  const mobileAllowance = 3000;
  const grossSalary = bSalary + houseRent + medicalAllowance + conveyanceAllowance + mobileAllowance;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPhoto(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCopyPublicLink = () => {
    const url = `${window.location.origin}/portal/employees/Employee_info`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleSubmitProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setActiveTab('official');
      alert('Please enter your English Full Name in 1. Official Information.');
      return;
    }

    const formattedPhone = phone.trim()
      ? phone.trim().startsWith('+')
        ? phone.trim()
        : `+880 ${phone.trim()}`
      : '+880 1700-000000';

    const created = submitPublicEmployeeProfile({
      organizationId: selectedOrg.id,
      organizationName: selectedOrg.name,
      employeeCode,
      name: name.trim(),
      fullNameBangla: fullNameBangla.trim() || undefined,
      email: email.trim() || `${name.trim().toLowerCase().replace(/\s+/g, '.')}@company.com`,
      phone: formattedPhone,
      emergencyContact: emergencyContact.trim() || 'Family Emergency Contact',
      photo,
      department: department.trim() || 'Operations',
      designation: designation.trim() || 'Executive',
      joiningDate,
      employmentType,
      lifecycleStage: 'Onboarding',
      manager: manager.trim() || 'HR Manager',
      basicSalary: bSalary,
      allowances: houseRent + medicalAllowance + conveyanceAllowance + mobileAllowance,
      deductions: Math.round(bSalary * 0.12),
      leaveBalance: { annual: 15, sick: 10, casual: 5 },
      performanceScore: 4.5,
      status: 'Inactive',
      intercom: intercom.trim() || '100',
      educationalQualification: educationalQualification.trim() || 'Graduation Degree',
      dob,
      gender,
      bloodGroup,
      maritalStatus,
      nationality: nationality.trim() || 'Bangladeshi',
      nid: nid.trim() || 'Pending Verification',
      passportNumber: passportNumber.trim() || 'N/A',
      fatherName: fatherName.trim() || `Father of ${name.trim()}`,
      motherName: motherName.trim() || `Mother of ${name.trim()}`,
      nominee: nominee.trim() || 'Spouse / Legal Beneficiary',
      personalMobileNumber: personalMobileNumber.trim() || formattedPhone,
      personalEmailAddress:
        personalEmailAddress.trim() ||
        `${name.trim().toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
      presentAddress: presentAddress.trim() || 'Dhaka, Bangladesh',
      permanentAddress: permanentAddress.trim() || 'Bangladesh',
      salaryBreakdowns: {
        basicSalary: bSalary,
        houseRent,
        medicalAllowance,
        conveyanceAllowance,
        mobileAllowance,
        grossSalary,
      },
      bankingProfile: {
        bankName: bankName.trim() || 'Al-Arafah Islami Bank Ltd.',
        bankAccountNo: bankAccountNo.trim() || 'Pending Bank Account',
        bankBranchCode: bankBranchCode.trim() || '014',
        bankProductCode: bankProductCode.trim() || '014',
        tin: tin.trim() || 'Pending e-TIN',
        taxZone: taxZone.trim() || 'Zone 15',
        taxCircle: taxCircle.trim() || 'Circle 1',
      },
    });

    setSubmittedEmployee(created);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-100/80 dark:bg-slate-950 py-8 sm:py-12 px-3 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Public Portal Banner */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-teal-500 text-white flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  Public Employee Self-Onboarding Portal
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  Public Access • No Login Required
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Fill out your Employee Profile below. Upon submission, it is routed directly to the{' '}
                <strong className="text-slate-700 dark:text-slate-200">Company Admin</strong> for approval.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyPublicLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition cursor-pointer"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Link Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Share Form Link</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setCurrentView('portal');
                setActivePortalTab('employees');
                navigateTo('/portal/employees');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 text-xs font-semibold transition cursor-pointer"
            >
              <span>Admin Approval Queue</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Submission Success Receipt Card */}
        {submittedEmployee ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in">
            <div className="h-2.5 w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-600" />
            <div className="p-8 text-center space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center mx-auto shadow-md">
                <FileCheck2 className="w-8 h-8" />
              </div>

              <div className="space-y-1.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                  <Clock className="w-3.5 h-3.5" />
                  Submitted to Company Admin for Approval
                </span>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-serif">
                  Employee Profile Submitted Successfully!
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
                  Thank you, <strong className="text-slate-900 dark:text-white">{submittedEmployee.name}</strong>. Your{' '}
                  <strong>Employee Profile • Accounticca HRMS</strong> dossier has been sent to the Admin of{' '}
                  <strong className="text-teal-600 dark:text-teal-400">
                    {submittedEmployee.organizationName}
                  </strong>{' '}
                  for verification and onboarding approval.
                </p>
              </div>

              {/* Submitted Summary Card */}
              <div className="max-w-2xl mx-auto p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-left grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="flex items-center gap-3 sm:col-span-2 pb-3 border-b border-slate-200 dark:border-slate-800">
                  <img
                    src={submittedEmployee.photo}
                    alt={submittedEmployee.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-300 dark:border-slate-700"
                  />
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-base text-slate-900 dark:text-white font-serif">
                        {submittedEmployee.name}
                      </span>
                      {submittedEmployee.fullNameBangla && (
                        <span className="text-xs px-2 py-0.5 rounded bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-medium">
                          {submittedEmployee.fullNameBangla}
                        </span>
                      )}
                      <span className="font-mono text-xs px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold">
                        {submittedEmployee.employeeCode}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400">
                      {submittedEmployee.designation} &bull; {submittedEmployee.department}
                    </p>
                    <p className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold">
                      {submittedEmployee.organizationName}
                    </p>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">Official Email & Mobile:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {submittedEmployee.email} &bull; {submittedEmployee.phone}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">NID & Blood Group:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    NID: {submittedEmployee.nid} &bull; Blood: {submittedEmployee.bloodGroup}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Joining Date & Type:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {submittedEmployee.joiningDate} ({submittedEmployee.employmentType})
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Approval Status:</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">
                    Pending Admin Approval ({submittedEmployee.submittedAt})
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSubmittedEmployee(null);
                    setName('');
                    setFullNameBangla('');
                    setDesignation('');
                    setEmail('');
                    setPhone('');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-xs font-semibold transition cursor-pointer"
                >
                  Submit Another Employee Form
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCurrentView('portal');
                    setActivePortalTab('employees');
                    navigateTo('/portal/employees');
                  }}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-500 hover:to-teal-500 text-white text-xs font-bold shadow-md flex items-center gap-2 transition cursor-pointer"
                >
                  <span>Open Company Admin Approval Panel</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Main Employee Profile • Accounticca HRMS Form Card */
          <form
            onSubmit={handleSubmitProfile}
            className="relative w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Top Accent Gradient Bar (Exact Employee Profile • Accounticca HRMS style) */}
            <div className="h-2.5 w-full bg-gradient-to-r from-blue-600 via-teal-500 to-indigo-600" />

            {/* Profile Form Header */}
            <div className="p-6 pb-4 bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start sm:items-center gap-4">
                  <div className="relative group shrink-0">
                    <img
                      src={photo}
                      alt={name || 'New Employee'}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-white dark:border-slate-800 shadow-md ring-2 ring-blue-500/20"
                    />
                    <label
                      title="Upload Employee Photo"
                      className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-xl bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-md cursor-pointer transition"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-teal-400">
                        Employee Profile &bull; Accounticca HRMS
                      </span>
                      <span className="font-mono text-xs px-2.5 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800">
                        {employeeCode}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-0.5">
                      <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-serif">
                        {name.trim() || 'New Employee Onboarding Form'}
                      </h1>
                      {fullNameBangla.trim() && (
                        <span className="text-sm font-medium text-teal-700 dark:text-teal-400 font-sans bg-teal-100/70 dark:bg-teal-950/60 px-2 py-0.5 rounded-lg border border-teal-200 dark:border-teal-900">
                          {fullNameBangla}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {designation.trim() || 'Designation'}
                      </span>{' '}
                      &bull; {department || 'Department'}
                    </p>
                    <p className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold mt-0.5">
                      {selectedOrg.name}
                    </p>
                  </div>
                </div>

                {/* Company Selector & View Mode Toggle */}
                <div className="flex flex-col sm:items-end gap-2">
                  <div className="w-full sm:w-64">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-1">
                      <Building2 className="w-3 h-3 text-blue-500" />
                      <span>Submitting To Company (Admin Approval):</span>
                    </label>
                    <select
                      value={organizationId}
                      onChange={(e) => setOrganizationId(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                      {organizations.map((org) => (
                        <option key={org.id} value={org.id}>
                          {org.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={() => setViewAllSections((prev) => !prev)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:border-blue-500 transition cursor-pointer"
                  >
                    <Layers className="w-3.5 h-3.5 text-teal-500" />
                    <span>
                      {viewAllSections
                        ? 'Switch to Tabbed View (1–4)'
                        : 'Show All 4 Sections on One Page'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Workflow Stage Banner (Matching Lifecycle Stage bar in Employee Profile) */}
              <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400">
                  <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                  <span>Onboarding Approval Workflow:</span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-semibold">
                  <span className="px-3 py-1 rounded-xl bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-xs">
                    1. Employee Fills Profile Form
                  </span>
                  <span className="text-slate-400">&rarr;</span>
                  <span className="px-3 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                    2. Company Admin Reviews &amp; Approves
                  </span>
                  <span className="text-slate-400">&rarr;</span>
                  <span className="px-3 py-1 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800">
                    3. Active in HRMS &amp; Master Sheet
                  </span>
                </div>
              </div>

              {/* Functional Tabs Navigation (1. Official, 2. Personal, 3. Contact, 4. Finance) */}
              {!viewAllSections && (
                <div className="flex items-center gap-1 border-b border-slate-200 dark:border-slate-800 -mb-4 pt-1 overflow-x-auto">
                  <button
                    type="button"
                    onClick={() => setActiveTab('official')}
                    className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                      activeTab === 'official'
                        ? 'border-blue-600 text-blue-600 dark:text-teal-400 bg-white/60 dark:bg-slate-900/60 rounded-t-xl'
                        : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    <Briefcase className="w-4 h-4" />
                    <span>1. Official Information</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('personal')}
                    className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                      activeTab === 'personal'
                        ? 'border-blue-600 text-blue-600 dark:text-teal-400 bg-white/60 dark:bg-slate-900/60 rounded-t-xl'
                        : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    <span>2. Personal Particulars</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('contact')}
                    className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                      activeTab === 'contact'
                        ? 'border-blue-600 text-blue-600 dark:text-teal-400 bg-white/60 dark:bg-slate-900/60 rounded-t-xl'
                        : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    <Phone className="w-4 h-4" />
                    <span>3. Contact Particulars</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('finance')}
                    className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                      activeTab === 'finance'
                        ? 'border-blue-600 text-blue-600 dark:text-teal-400 bg-white/60 dark:bg-slate-900/60 rounded-t-xl'
                        : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    <Landmark className="w-4 h-4" />
                    <span>4. Financial &amp; Banking Particulars</span>
                  </button>
                </div>
              )}
            </div>

            {/* Form Body / Tab Panes */}
            <div className="p-6 space-y-8">
              {/* =========================================================
                  TAB 1: OFFICIAL INFORMATION
              ========================================================= */}
              {(viewAllSections || activeTab === 'official') && (
                <div className="space-y-5 animate-in fade-in">
                  {viewAllSections && (
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
                      <Briefcase className="w-4 h-4 text-blue-600 dark:text-teal-400" />
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white font-serif">
                        1. Official Information
                      </h3>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    {/* Left Card */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 space-y-3.5">
                      <div>
                        <label className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block mb-1">
                          English Full Name: <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Tanvir Ahmed"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block mb-1">
                          Bangla Name (বাংলা নাম):
                        </label>
                        <input
                          type="text"
                          placeholder="যেমন: তানভীর আহমেদ"
                          value={fullNameBangla}
                          onChange={(e) => setFullNameBangla(e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-teal-700 dark:text-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block mb-1">
                          Department: <span className="text-rose-500">*</span>
                        </label>
                        <select
                          value={department}
                          onChange={(e) => setDepartment(e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                        >
                          <option value="Engineering">Engineering</option>
                          <option value="Product & Design">Product &amp; Design</option>
                          <option value="Sales & BD">Sales &amp; BD</option>
                          <option value="Customer Success">Customer Success</option>
                          <option value="Operations">Operations</option>
                          <option value="Finance & Accounts">Finance &amp; Accounts</option>
                          <option value="Human Resources">Human Resources</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block mb-1">
                          Designation: <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Senior Software Engineer"
                          value={designation}
                          onChange={(e) => setDesignation(e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    {/* Right Card */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 space-y-3.5">
                      <div>
                        <label className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block mb-1">
                          Joining Date: <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="date"
                          required
                          value={joiningDate}
                          onChange={(e) => setJoiningDate(e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block mb-1">
                          Status:
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Pending Admin Approval (New Onboarding)
                        </span>
                      </div>

                      <div>
                        <label className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block mb-1">
                          Intercom Extension:
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 105"
                          value={intercom}
                          onChange={(e) => setIntercom(e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold text-teal-600 dark:text-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block mb-1">
                          Educational Qualification: <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. B.Sc in Computer Science & Engineering"
                          value={educationalQualification}
                          onChange={(e) => setEducationalQualification(e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Additional Administrative Details */}
                  <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="text-slate-500 dark:text-slate-400 block text-[11px] mb-1">
                        Direct Supervisor / Manager:
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Sophia Vance"
                        value={manager}
                        onChange={(e) => setManager(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="text-slate-500 dark:text-slate-400 block text-[11px] mb-1">
                        Employment Type:
                      </label>
                      <select
                        value={employmentType}
                        onChange={(e) =>
                          setEmploymentType(e.target.value as Employee['employmentType'])
                        }
                        className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-900 dark:text-white cursor-pointer"
                      >
                        <option value="Full-time">Full-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Intern">Intern</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-slate-500 dark:text-slate-400 block text-[11px] mb-1">
                        Choose Quick Avatar or Upload:
                      </label>
                      <div className="flex items-center gap-2 pt-0.5">
                        {PRESET_AVATARS.map((av, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setPhoto(av)}
                            className={`w-7 h-7 rounded-full overflow-hidden border-2 transition cursor-pointer ${
                              photo === av
                                ? 'border-blue-600 scale-110 shadow-xs'
                                : 'border-transparent opacity-70 hover:opacity-100'
                            }`}
                          >
                            <img src={av} alt={`Avatar ${idx + 1}`} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* =========================================================
                  TAB 2: PERSONAL PARTICULARS
              ========================================================= */}
              {(viewAllSections || activeTab === 'personal') && (
                <div className="space-y-5 animate-in fade-in">
                  {viewAllSections && (
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
                      <User className="w-4 h-4 text-blue-600 dark:text-teal-400" />
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white font-serif">
                        2. Personal Particulars
                      </h3>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    {/* Left Personal Card */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 space-y-3.5">
                      <div>
                        <label className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block mb-1">
                          Date of Birth (dob): <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="date"
                          required
                          value={dob}
                          onChange={(e) => setDob(e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-900 dark:text-white font-mono"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block mb-1">
                            Gender:
                          </label>
                          <select
                            value={gender}
                            onChange={(e) =>
                              setGender(e.target.value as 'male' | 'female' | 'other')
                            }
                            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer"
                          >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block mb-1">
                            Blood Group:
                          </label>
                          <select
                            value={bloodGroup}
                            onChange={(e) => setBloodGroup(e.target.value)}
                            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 cursor-pointer"
                          >
                            {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((bg) => (
                              <option key={bg} value={bg}>
                                {bg}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block mb-1">
                            Marital Status:
                          </label>
                          <select
                            value={maritalStatus}
                            onChange={(e) =>
                              setMaritalStatus(
                                e.target.value as 'Single' | 'Married' | 'Divorced'
                              )
                            }
                            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer"
                          >
                            <option value="Single">Single</option>
                            <option value="Married">Married</option>
                            <option value="Divorced">Divorced</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block mb-1">
                            Nationality:
                          </label>
                          <input
                            type="text"
                            value={nationality}
                            onChange={(e) => setNationality(e.target.value)}
                            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Right Personal Card */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 space-y-3.5">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block mb-1">
                            National ID (NID): <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. 1995269000000"
                            value={nid}
                            onChange={(e) => setNid(e.target.value)}
                            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block mb-1">
                            Passport Number:
                          </label>
                          <input
                            type="text"
                            placeholder="Optional"
                            value={passportNumber}
                            onChange={(e) => setPassportNumber(e.target.value)}
                            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-800 dark:text-slate-200"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block mb-1">
                            Father&apos;s Name: <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Father's Full Name"
                            value={fatherName}
                            onChange={(e) => setFatherName(e.target.value)}
                            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block mb-1">
                            Mother&apos;s Name: <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Mother's Full Name"
                            value={motherName}
                            onChange={(e) => setMotherName(e.target.value)}
                            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block mb-1">
                          Nominee (Name &amp; Relationship):
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Ayesha Siddiqua (Spouse)"
                          value={nominee}
                          onChange={(e) => setNominee(e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-teal-600 dark:text-teal-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Emergency Contact Particulars */}
                  <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-900/50 text-xs">
                    <label className="text-amber-800 dark:text-amber-300 font-bold block mb-1.5">
                      Emergency Contact Particulars (Name, Relationship &amp; Active Mobile):{' '}
                      <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Md. Rafiqul Islam (Father) — +880 1711-000000"
                      value={emergencyContact}
                      onChange={(e) => setEmergencyContact(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-800 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100"
                    />
                  </div>
                </div>
              )}

              {/* =========================================================
                  TAB 3: CONTACT PARTICULARS
              ========================================================= */}
              {(viewAllSections || activeTab === 'contact') && (
                <div className="space-y-5 animate-in fade-in">
                  {viewAllSections && (
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
                      <Phone className="w-4 h-4 text-blue-600 dark:text-teal-400" />
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white font-serif">
                        3. Contact Particulars
                      </h3>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 space-y-3.5">
                      <div>
                        <label className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block mb-1">
                          Official Mobile: <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="+880 1819-556751"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold text-blue-600 dark:text-blue-400"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block mb-1">
                          Official E-Mail: <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="employee@company.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 space-y-3.5">
                      <div>
                        <label className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block mb-1">
                          Personal Mobile:
                        </label>
                        <input
                          type="tel"
                          placeholder="+880 1711-000000"
                          value={personalMobileNumber}
                          onChange={(e) => setPersonalMobileNumber(e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-800 dark:text-slate-200"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block mb-1">
                          Personal E-Mail:
                        </label>
                        <input
                          type="email"
                          placeholder="personal.name@gmail.com"
                          value={personalEmailAddress}
                          onChange={(e) => setPersonalEmailAddress(e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-800 dark:text-slate-200"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80">
                      <label className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white mb-2">
                        <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                        <span>Present Address: *</span>
                      </label>
                      <textarea
                        rows={3}
                        required
                        placeholder="House, Road, Area, Thana/Upazila, District, Post Code"
                        value={presentAddress}
                        onChange={(e) => setPresentAddress(e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-700 dark:text-slate-300"
                      />
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80">
                      <label className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white mb-2">
                        <MapPin className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                        <span>Permanent Address: *</span>
                      </label>
                      <textarea
                        rows={3}
                        required
                        placeholder="Village/Street, Post Office, Upazila, District, Post Code"
                        value={permanentAddress}
                        onChange={(e) => setPermanentAddress(e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-700 dark:text-slate-300"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* =========================================================
                  TAB 4: FINANCIAL & BANKING PARTICULARS
              ========================================================= */}
              {(viewAllSections || activeTab === 'finance') && (
                <div className="space-y-5 animate-in fade-in">
                  {viewAllSections && (
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
                      <Landmark className="w-4 h-4 text-blue-600 dark:text-teal-400" />
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white font-serif">
                        4. Financial &amp; Banking Particulars
                      </h3>
                    </div>
                  )}

                  {/* Salary Breakdowns Card */}
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                    <div className="flex flex-wrap items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-4 gap-2">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                        <h4 className="font-bold text-slate-900 dark:text-white font-serif text-sm">
                          Monthly Salary Breakdowns (৳ / BDT)
                        </h4>
                      </div>
                      <div className="font-mono text-xs px-2.5 py-1 rounded-lg bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-bold border border-teal-200 dark:border-teal-900">
                        Gross: ৳ {grossSalary.toLocaleString()}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-mono">
                      <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-blue-300 dark:border-blue-800">
                        <label className="text-[11px] text-slate-500 font-sans block mb-1">
                          Basic Salary (Enter ৳):
                        </label>
                        <input
                          type="number"
                          value={basicSalary}
                          onChange={(e) => setBasicSalary(Number(e.target.value) || 0)}
                          className="w-full px-2 py-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg font-bold text-slate-900 dark:text-white text-sm"
                        />
                      </div>

                      <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                        <span className="text-[11px] text-slate-500 font-sans block mb-1">
                          House Rent Allowance (40%):
                        </span>
                        <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                          ৳ {houseRent.toLocaleString()}
                        </span>
                      </div>

                      <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                        <span className="text-[11px] text-slate-500 font-sans block mb-1">
                          Medical Allowance (10%):
                        </span>
                        <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                          ৳ {medicalAllowance.toLocaleString()}
                        </span>
                      </div>

                      <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                        <span className="text-[11px] text-slate-500 font-sans block mb-1">
                          Conveyance Allowance (8%):
                        </span>
                        <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                          ৳ {conveyanceAllowance.toLocaleString()}
                        </span>
                      </div>

                      <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                        <span className="text-[11px] text-slate-500 font-sans block mb-1">
                          Mobile Allowance:
                        </span>
                        <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                          ৳ {mobileAllowance.toLocaleString()}
                        </span>
                      </div>

                      <div className="p-3 bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-950/40 dark:to-emerald-950/40 rounded-xl border border-teal-200 dark:border-teal-800">
                        <span className="text-[11px] text-teal-700 dark:text-teal-300 font-sans font-semibold block mb-1">
                          Gross Salary:
                        </span>
                        <span className="font-bold text-teal-700 dark:text-teal-300 text-base">
                          ৳ {grossSalary.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Banking & Tax Profile Card */}
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
                      <Landmark className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <h4 className="font-bold text-slate-900 dark:text-white font-serif text-sm">
                        Banking &amp; Tax Profile
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-3">
                        <div>
                          <label className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">
                            Designated Bank:
                          </label>
                          <input
                            type="text"
                            value={bankName}
                            onChange={(e) => setBankName(e.target.value)}
                            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-slate-900 dark:text-white"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">
                            Bank Account Number:
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. 0141120094958"
                            value={bankAccountNo}
                            onChange={(e) => setBankAccountNo(e.target.value)}
                            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-mono font-bold text-teal-600 dark:text-teal-400"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">
                              Branch Code:
                            </label>
                            <input
                              type="text"
                              value={bankBranchCode}
                              onChange={(e) => setBankBranchCode(e.target.value)}
                              className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-slate-900 dark:text-white"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">
                              Product Code:
                            </label>
                            <input
                              type="text"
                              value={bankProductCode}
                              onChange={(e) => setBankProductCode(e.target.value)}
                              className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-slate-900 dark:text-white"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">
                            e-TIN Number:
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. 780303412459"
                            value={tin}
                            onChange={(e) => setTin(e.target.value)}
                            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-mono font-bold text-slate-900 dark:text-white"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">
                              Tax Zone:
                            </label>
                            <input
                              type="text"
                              value={taxZone}
                              onChange={(e) => setTaxZone(e.target.value)}
                              className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">
                              Tax Circle:
                            </label>
                            <input
                              type="text"
                              value={taxCircle}
                              onChange={(e) => setTaxCircle(e.target.value)}
                              className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                            />
                          </div>
                        </div>

                        <div className="p-2.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 flex justify-between items-center">
                          <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                            Salary Disbursement Channel:
                          </span>
                          <span className="font-semibold text-emerald-700 dark:text-emerald-400 text-[11px]">
                            Corporate BEFTN (Upon Admin Approval)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Form Footer (Matching Employee Profile • Accounticca HRMS Footer) */}
            <div className="p-4 sm:px-6 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Employee Profile &bull; Accounticca HRMS
                </span>
                <span className="hidden sm:inline-block text-[11px] text-slate-400">
                  | Submits to <strong>{selectedOrg.name}</strong> Admin for approval
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {!viewAllSections && activeTab !== 'official' && (
                  <button
                    type="button"
                    onClick={() => {
                      const order: ('official' | 'personal' | 'contact' | 'finance')[] = [
                        'official',
                        'personal',
                        'contact',
                        'finance',
                      ];
                      const idx = order.indexOf(activeTab);
                      if (idx > 0) setActiveTab(order[idx - 1]);
                    }}
                    className="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Previous Section</span>
                  </button>
                )}

                {!viewAllSections && activeTab !== 'finance' && (
                  <button
                    type="button"
                    onClick={() => {
                      const order: ('official' | 'personal' | 'contact' | 'finance')[] = [
                        'official',
                        'personal',
                        'contact',
                        'finance',
                      ];
                      const idx = order.indexOf(activeTab);
                      if (idx < order.length - 1) setActiveTab(order[idx + 1]);
                    }}
                    className="px-4 py-2 bg-blue-100 dark:bg-blue-950 hover:bg-blue-200 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition"
                  >
                    <span>Next Section</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit to Company Admin for Approval</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
