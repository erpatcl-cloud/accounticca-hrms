import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Employee, EmployeeLifecycleStage } from '../../types';
import {
  Search,
  Plus,
  X,
  Eye,
  Briefcase,
  User,
  Phone,
  Landmark,
  Building2,
  Calendar,
  CreditCard,
  FileBadge,
  MapPin,
  CheckCircle2,
  Clock,
  GraduationCap,
  Sparkles,
  FileSpreadsheet,
  Download,
  ExternalLink,
  RefreshCw,
  Upload,
  AlertCircle,
} from 'lucide-react';
import {
  PERMANENT_GOOGLE_ACCOUNT,
  getRealOAuthToken,
  googleSignIn,
  hasRealOAuthToken,
} from '../../utils/googleAuth';
import {
  MASTER_EMPLOYEE_SHEET_HEADERS,
  ParsedSheetEmployee,
  fetchGoogleSheetRows,
  mapSheetRowsToEmployees,
} from '../../services/googleHrmWorkspace';

export const EmployeeDirectory: React.FC = () => {
  const {
    employees,
    addEmployee,
    bulkAddEmployees,
    reviewEmployeeSubmission,
    updateEmployeeLifecycle,
    currentUser,
    selectedOrgIdFilter,
    organizations,
    setActivePortalTab,
    navigateTo,
    notify,
  } = useApp();

  const isClientAdmin = currentUser.role === 'client_admin';
  const targetOrgId = isClientAdmin ? currentUser.organizationId : selectedOrgIdFilter;

  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [lifecycleFilter, setLifecycleFilter] = useState('All');
  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(null);
  const [activeTab, setActiveTab] = useState<'official' | 'personal' | 'contact' | 'finance'>('official');
  const [addEmployeeModalOpen, setAddEmployeeModalOpen] = useState(false);

  // Bulk Upload from Google Sheet state
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [bulkSheetUrl, setBulkSheetUrl] = useState('');
  const [bulkTabName, setBulkTabName] = useState('Sheet1');
  const [bulkOrgId, setBulkOrgId] = useState<string>(() => {
    if (isClientAdmin) return currentUser.organizationId;
    return organizations[0]?.id || 'org_apex';
  });
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkError, setBulkError] = useState<string | null>(null);
  const [bulkMeta, setBulkMeta] = useState<{ title: string; sheetName: string } | null>(null);
  const [parsedRows, setParsedRows] = useState<ParsedSheetEmployee[]>([]);
  const [skipDuplicates, setSkipDuplicates] = useState(true);
  const [oauthConnected, setOauthConnected] = useState(() => hasRealOAuthToken());

  // Google Sheet update & synchronization states
  const [isSyncingSheet, setIsSyncingSheet] = useState(false);
  const [sheetSyncBanner, setSheetSyncBanner] = useState<{
    count: number;
    orgName: string;
    orgId: string;
    timestamp: string;
  } | null>(null);
  const [individualSyncNotice, setIndividualSyncNotice] = useState<string | null>(null);

  // New employee form state
  const [modalOrgId, setModalOrgId] = useState<string>(() => {
    if (isClientAdmin) return currentUser.organizationId;
    return organizations[0]?.id || 'org_apex';
  });
  const [name, setName] = useState('');
  const [fullNameBangla, setFullNameBangla] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [designation, setDesignation] = useState('Software Engineer');
  const [employmentType] = useState<Employee['employmentType']>('Full-time');
  const [joiningDate, setJoiningDate] = useState('2026-10-01');
  const [manager, setManager] = useState('Sophia Vance');
  const [basicSalary, setBasicSalary] = useState(70000);
  const [intercom, setIntercom] = useState('115');
  const [educationalQualification, setEducationalQualification] = useState('B.Sc in Computer Science');

  const LIFECYCLE_STAGES: EmployeeLifecycleStage[] = [
    'Candidate',
    'Onboarding',
    'Active',
    'Probation',
    'Confirmed',
    'Resigned',
    'Exit',
  ];

  const filteredEmployees = employees.filter((emp) => {
    const orgMatch = targetOrgId === 'all' || emp.organizationId === targetOrgId;
    const query = searchQuery.toLowerCase();
    const queryMatch =
      emp.name.toLowerCase().includes(query) ||
      (emp.fullNameBangla && emp.fullNameBangla.includes(searchQuery)) ||
      emp.email.toLowerCase().includes(query) ||
      emp.designation.toLowerCase().includes(query) ||
      emp.employeeCode.toLowerCase().includes(query);
    const deptMatch = departmentFilter === 'All' || emp.department === departmentFilter;
    const lifeMatch = lifecycleFilter === 'All' || emp.lifecycleStage === lifecycleFilter;
    return orgMatch && queryMatch && deptMatch && lifeMatch;
  });

  const departments = [
    'All',
    ...Array.from(
      new Set([
        'Engineering',
        'Product & Design',
        'Sales & BD',
        'Customer Success',
        'Operations',
        ...employees.map((e) => e.department).filter(Boolean),
      ])
    ),
  ];

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    const codeNumber = Math.floor(1000 + Math.random() * 9000);
    const chosenOrg = isClientAdmin
      ? organizations.find((o) => o.id === currentUser.organizationId) || { id: currentUser.organizationId, name: currentUser.organizationName }
      : organizations.find((o) => o.id === modalOrgId) || organizations[0];

    const orgName = chosenOrg?.name || 'Client Organization';
    const orgId = chosenOrg?.id || 'org_apex';

    const bSalary = Number(basicSalary) || 60000;
    const houseRent = Math.round(bSalary * 0.4);
    const medAllowance = Math.round(bSalary * 0.1);
    const convAllowance = Math.round(bSalary * 0.08);
    const mobAllowance = 3000;
    const grossSalary = bSalary + houseRent + medAllowance + convAllowance + mobAllowance;

    addEmployee({
      organizationId: orgId,
      organizationName: orgName,
      employeeCode: `APX-${codeNumber}`,
      name,
      fullNameBangla: fullNameBangla || undefined,
      email,
      phone: phone.startsWith('+') ? phone : `+880 ${phone}`,
      emergencyContact: emergencyContact || 'Spouse / Family Contact',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      department,
      designation,
      joiningDate,
      employmentType,
      lifecycleStage: 'Onboarding',
      manager,
      basicSalary: bSalary,
      allowances: houseRent + medAllowance + convAllowance + mobAllowance,
      deductions: Math.round(bSalary * 0.12),
      leaveBalance: { annual: 15, sick: 10, casual: 5 },
      performanceScore: 4.5,
      status: 'Active',
      intercom: intercom || '100',
      educationalQualification: educationalQualification || 'Graduation Degree',
      dob: '1992-01-01',
      gender: 'male',
      bloodGroup: 'B+',
      maritalStatus: 'Married',
      nationality: 'Bangladeshi',
      nid: `1992${Math.floor(1000000000000 + Math.random() * 9000000000000)}`,
      passportNumber: `BK0${Math.floor(100000 + Math.random() * 900000)}`,
      fatherName: `Father of ${name}`,
      motherName: `Mother of ${name}`,
      nominee: `Nominee of ${name}`,
      personalMobileNumber: '+880 1819-000000',
      personalEmailAddress: `${name.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
      presentAddress: 'Dhaka, Bangladesh',
      permanentAddress: 'Bangladesh',
      salaryBreakdowns: {
        basicSalary: bSalary,
        houseRent,
        medicalAllowance: medAllowance,
        conveyanceAllowance: convAllowance,
        mobileAllowance: mobAllowance,
        grossSalary,
      },
      bankingProfile: {
        bankName: 'Al-Arafah Islami Bank Ltd.',
        bankAccountNo: `01411200${Math.floor(10000 + Math.random() * 90000)}`,
        bankBranchCode: '014',
        bankProductCode: '014',
        tin: `780${Math.floor(100000000 + Math.random() * 900000000)}`,
        taxZone: 'Zone 15',
        taxCircle: 'Circle 1',
      },
    });

    setAddEmployeeModalOpen(false);
    setName('');
    setFullNameBangla('');
    setEmail('');
    setPhone('');
  };

  // Google Sheet Synchronize & Update Handler
  const handleUpdateGoogleSheet = () => {
    setIsSyncingSheet(true);

    const targetOrg = isClientAdmin
      ? organizations.find((o) => o.id === currentUser.organizationId) || organizations[0]
      : organizations.find((o) => o.id === (targetOrgId === 'all' ? organizations[0]?.id : targetOrgId)) || organizations[0];

    const targetEmployees = employees.filter(
      (e) => (targetOrgId === 'all' ? true : e.organizationId === targetOrg?.id)
    );

    setTimeout(() => {
      const headers = [
        'Employee Code',
        'Full Name (English)',
        'বাংলা নাম (Bangla Name)',
        'Department',
        'Designation',
        'Status',
        'Intercom',
        'Official Mobile',
        'Official Email',
        'NID',
        'Monthly Basic (BDT)',
        'Allowances (BDT)',
        'Gross Salary (BDT)',
        'Deductions (BDT)',
        'Net Pay (BDT)',
        'Bank Account (AIBL)',
        'e-TIN',
      ];

      const rows = targetEmployees.map((emp) => {
        const basic = emp.salaryBreakdowns?.basicSalary || emp.basicSalary || 60000;
        const allow = emp.allowances || Math.round(basic * 0.35);
        const gross = emp.salaryBreakdowns?.grossSalary || (basic + allow);
        const ded = emp.deductions || Math.round(basic * 0.12);
        const net = gross - ded;
        return [
          emp.employeeCode,
          emp.name,
          emp.fullNameBangla || '—',
          emp.department,
          emp.designation,
          emp.status || 'Active',
          emp.intercom || '—',
          emp.phone,
          emp.email,
          emp.nid || '—',
          basic.toLocaleString(),
          allow.toLocaleString(),
          gross.toLocaleString(),
          ded.toLocaleString(),
          net.toLocaleString(),
          emp.bankingProfile?.bankAccountNo || '0141120094958',
          emp.bankingProfile?.tin || '—',
        ];
      });

      // Update localStorage for Google Workspace Hub
      try {
        const saved = localStorage.getItem('acct_google_sheets_v1');
        const parsed = saved ? JSON.parse(saved) : {};
        parsed[targetOrg?.id || 'org_apex'] = [headers, ...rows];
        localStorage.setItem('acct_google_sheets_v1', JSON.stringify(parsed));
      } catch (e) {}

      setIsSyncingSheet(false);
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setSheetSyncBanner({
        count: targetEmployees.length,
        orgName: targetOrg?.name || 'Company',
        orgId: targetOrg?.id || 'org_apex',
        timestamp: timeStr,
      });

      notify(
        'Google Sheet Updated',
        `Master Worksheet for ${targetOrg?.name} updated with ${targetEmployees.length} employee records under ${PERMANENT_GOOGLE_ACCOUNT.email}.`,
        'success',
        'google_workspace'
      );
    }, 450);
  };

  // Direct CSV Export from updated Google Sheet
  const handleDownloadCSV = () => {
    const targetOrg = organizations.find((o) => o.id === (targetOrgId === 'all' ? organizations[0]?.id : targetOrgId)) || organizations[0];
    const targetEmployees = employees.filter(
      (e) => (targetOrgId === 'all' ? true : e.organizationId === targetOrg?.id)
    );

    const headers = [
      'Employee Code',
      'Full Name (English)',
      'বাংলা নাম (Bangla Name)',
      'Department',
      'Designation',
      'Status',
      'Intercom',
      'Official Mobile',
      'Official Email',
      'NID',
      'Monthly Basic (BDT)',
      'Allowances (BDT)',
      'Gross Salary (BDT)',
      'Deductions (BDT)',
      'Net Pay (BDT)',
      'Bank Account (AIBL)',
      'e-TIN',
    ];

    const rows = targetEmployees.map((emp) => {
      const basic = emp.salaryBreakdowns?.basicSalary || emp.basicSalary || 60000;
      const allow = emp.allowances || Math.round(basic * 0.35);
      const gross = emp.salaryBreakdowns?.grossSalary || (basic + allow);
      const ded = emp.deductions || Math.round(basic * 0.12);
      const net = gross - ded;
      return [
        emp.employeeCode,
        emp.name,
        emp.fullNameBangla || '',
        emp.department,
        emp.designation,
        emp.status || 'Active',
        emp.intercom || '',
        emp.phone,
        emp.email,
        emp.nid || '',
        basic,
        allow,
        gross,
        ded,
        net,
        emp.bankingProfile?.bankAccountNo || '0141120094958',
        emp.bankingProfile?.tin || '',
      ];
    });

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers, ...rows]
        .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${targetOrg?.name.replace(/[^a-zA-Z0-9]/g, '_')}_Master_Google_Sheet.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Update Individual Employee in Master Google Sheet
  const handleUpdateIndividualInSheet = (emp: Employee) => {
    setIndividualSyncNotice(`Syncing ${emp.name} to Master Google Sheet...`);
    setTimeout(() => {
      handleUpdateGoogleSheet();
      setIndividualSyncNotice(`✓ ${emp.name} updated in Master Google Sheet under ${PERMANENT_GOOGLE_ACCOUNT.email}`);
      setTimeout(() => setIndividualSyncNotice(null), 3500);
    }, 300);
  };

  const getBulkTargetOrg = () => {
    const id = isClientAdmin ? currentUser.organizationId : bulkOrgId;
    return (
      organizations.find((o) => o.id === id) || {
        id,
        name: currentUser.organizationName || 'Client Organization',
      }
    );
  };

  const handleConnectGoogleForBulk = async (): Promise<string> => {
    const existing = getRealOAuthToken();
    if (existing) {
      setOauthConnected(true);
      return existing;
    }
    const { accessToken } = await googleSignIn();
    setOauthConnected(true);
    return accessToken;
  };

  const handleFetchBulkSheet = async () => {
    setBulkError(null);
    setBulkLoading(true);
    try {
      const token = await handleConnectGoogleForBulk();
      const res = await fetchGoogleSheetRows(token, bulkSheetUrl, bulkTabName);
      const targetOrg = getBulkTargetOrg();
      const mapped = mapSheetRowsToEmployees(
        res.headers,
        res.rows,
        { id: targetOrg.id, name: targetOrg.name },
        employees
      );
      if (mapped.length === 0) {
        throw new Error('No employee rows found in the selected Google Sheet.');
      }
      setBulkMeta({ title: res.title, sheetName: res.sheetName });
      setParsedRows(mapped);
    } catch (err) {
      setBulkError(err instanceof Error ? err.message : 'Failed to fetch Google Sheet rows.');
    } finally {
      setBulkLoading(false);
    }
  };

  const handleCsvFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBulkError(null);
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = String(reader.result || '');
        const lines = text
          .split(/\r?\n/)
          .map((l) => l.trim())
          .filter(Boolean);
        if (lines.length < 2) {
          setBulkError('CSV file must include a header row and at least one employee row.');
          return;
        }
        const parseCsvLine = (line: string) => {
          const out: string[] = [];
          let cur = '';
          let inQuotes = false;
          for (let i = 0; i < line.length; i++) {
            const ch = line[i];
            if (ch === '"') {
              if (inQuotes && line[i + 1] === '"') {
                cur += '"';
                i++;
              } else {
                inQuotes = !inQuotes;
              }
            } else if (ch === ',' && !inQuotes) {
              out.push(cur);
              cur = '';
            } else {
              cur += ch;
            }
          }
          out.push(cur);
          return out;
        };
        const headers = parseCsvLine(lines[0]);
        const rows = lines.slice(1).map(parseCsvLine);
        const targetOrg = getBulkTargetOrg();
        const mapped = mapSheetRowsToEmployees(
          headers,
          rows,
          { id: targetOrg.id, name: targetOrg.name },
          employees
        );
        if (mapped.length === 0) {
          setBulkError('No valid employee rows parsed from CSV.');
          return;
        }
        setBulkMeta({ title: file.name, sheetName: 'CSV Import' });
        setParsedRows(mapped);
      } catch (err) {
        setBulkError(err instanceof Error ? err.message : 'Failed to parse CSV file.');
      }
    };
    reader.readAsText(file);
  };

  const handleDownloadBulkTemplate = () => {
    const csv = `${MASTER_EMPLOYEE_SHEET_HEADERS.map((h) => `"${h}"`).join(',')}\n`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Master_Employee_Information_Template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleConfirmBulkImport = () => {
    const targetOrg = getBulkTargetOrg();
    const existingCodes = new Set(
      employees
        .filter((e) => e.organizationId === targetOrg.id)
        .map((e) => e.employeeCode.trim().toLowerCase())
    );
    const normalized = parsedRows.map((r) => ({
      ...r,
      employee: {
        ...r.employee,
        organizationId: targetOrg.id,
        organizationName: targetOrg.name,
      },
      isDuplicate: existingCodes.has(r.employee.employeeCode.trim().toLowerCase()),
    }));
    const toImport = skipDuplicates
      ? normalized.filter((r) => !r.isDuplicate)
      : normalized;
    if (toImport.length === 0) {
      setBulkError('All parsed rows are already present for this organization (duplicate HR IDs). Uncheck "Skip duplicate HR IDs" to import anyway.');
      return;
    }

    bulkAddEmployees(toImport.map((r) => r.employee));
    setBulkModalOpen(false);
    setParsedRows([]);
    setBulkMeta(null);
    setBulkError(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-serif tracking-tight">
            Employee Directory &amp; Lifecycle Management
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Comprehensive workforce roster, lifecycle stages, and detailed official, personal, contact &amp; banking profiles
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
          {/* Public Employee Info Form Link Button */}
          <button
            onClick={() => navigateTo('/portal/employees/Employee_info')}
            className="px-3.5 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
            title="Open Public Employee Profile Onboarding Form (/portal/employees/Employee_info)"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Public Employee Info Form</span>
          </button>

          {/* Update Google Sheet Action Button */}
          <button
            onClick={handleUpdateGoogleSheet}
            disabled={isSyncingSheet}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-75"
            title={`Synchronize Master Google Sheet with employee records under ${PERMANENT_GOOGLE_ACCOUNT.email}`}
          >
            <FileSpreadsheet className={`w-4 h-4 ${isSyncingSheet ? 'animate-spin' : ''}`} />
            <span>{isSyncingSheet ? 'Updating Google Sheet...' : 'Update Google Sheet'}</span>
          </button>

          {/* Bulk Upload from Google Sheet */}
          <button
            onClick={() => {
              setBulkError(null);
              if (!isClientAdmin) {
                const preferred =
                  selectedOrgIdFilter !== 'all'
                    ? selectedOrgIdFilter
                    : organizations.find((o) => o.name.toLowerCase().includes('advanced'))?.id ||
                      organizations[0]?.id ||
                      'org_apex';
                setBulkOrgId(preferred);
              }
              setBulkModalOpen(true);
            }}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
            title="Import multiple employees directly from a Google Sheet (Master_Employee_Information format)"
          >
            <Upload className="w-4 h-4" />
            <span>Bulk Upload (Google Sheet)</span>
          </button>

          <button
            onClick={() => setAddEmployeeModalOpen(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Onboard New Employee</span>
          </button>
        </div>
      </div>

      {/* Google Sheet Sync Confirmation Banner */}
      {sheetSyncBanner && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50/50 to-blue-50/50 dark:from-emerald-950/40 dark:via-slate-900 dark:to-blue-950/40 border border-emerald-300 dark:border-emerald-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-600/20">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-xs text-slate-900 dark:text-white">
                  Master Google Sheet Updated Successfully!
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-mono text-[11px] font-bold border border-emerald-200 dark:border-emerald-800">
                  {sheetSyncBanner.count} Records Synced
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  at {sheetSyncBanner.timestamp}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                Target: <code className="text-emerald-700 dark:text-emerald-300 font-semibold">/{sheetSyncBanner.orgName}/Master_Google_Sheet.gsheet</code> &bull; Google Owner: <strong className="text-emerald-800 dark:text-emerald-200 font-mono">{PERMANENT_GOOGLE_ACCOUNT.email}</strong>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setActivePortalTab('google_workspace')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition cursor-pointer shadow-xs"
            >
              <span>View in Portal Hub</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleDownloadCSV}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs border border-slate-200 dark:border-slate-700 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => setSheetSyncBanner(null)}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              title="Dismiss Notice"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Pending Admin Approvals Queue (Submitted via Public Employee Info Form) */}
      {filteredEmployees.some((e) => e.approvalStatus === 'Pending Approval') && (
        <div className="p-5 rounded-2xl bg-amber-50/90 dark:bg-amber-950/30 border-2 border-amber-300 dark:border-amber-800 shadow-md space-y-3 animate-in fade-in">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white font-serif flex items-center gap-2">
                  <span>Pending Company Admin Approvals</span>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200">
                    {filteredEmployees.filter((e) => e.approvalStatus === 'Pending Approval').length}{' '}
                    Awaiting Review
                  </span>
                </h3>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  New employee profiles submitted via the public{' '}
                  <code className="font-mono font-bold text-amber-800 dark:text-amber-300">
                    /portal/employees/Employee_info
                  </code>{' '}
                  form awaiting Admin approval.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredEmployees
              .filter((e) => e.approvalStatus === 'Pending Approval')
              .map((pendingEmp) => (
                <div
                  key={pendingEmp.id}
                  className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={pendingEmp.photo}
                      alt={pendingEmp.name}
                      className="w-11 h-11 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                    />
                    <div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="font-bold text-xs text-slate-900 dark:text-white">
                          {pendingEmp.name}
                        </span>
                        {pendingEmp.fullNameBangla && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                            {pendingEmp.fullNameBangla}
                          </span>
                        )}
                        <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold">
                          {pendingEmp.employeeCode}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400">
                        {pendingEmp.designation} &bull; {pendingEmp.department}
                      </p>
                      <p className="text-[10px] text-teal-600 dark:text-teal-400 font-medium">
                        {pendingEmp.organizationName}{' '}
                        {pendingEmp.submittedAt && `• Submitted: ${pendingEmp.submittedAt}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedEmp(pendingEmp);
                        setActiveTab('official');
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-semibold cursor-pointer transition"
                    >
                      Review Form
                    </button>
                    <button
                      type="button"
                      onClick={() => reviewEmployeeSubmission(pendingEmp.id, 'Approved')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer shadow-xs transition"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => reviewEmployeeSubmission(pendingEmp.id, 'Rejected')}
                      className="px-2.5 py-1.5 rounded-lg bg-rose-100 dark:bg-rose-950/60 hover:bg-rose-200 text-rose-700 dark:text-rose-300 text-[11px] font-semibold cursor-pointer transition"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Filters and search */}
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search by English name, বাংলা নাম, ID, role, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 font-sans"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span>Department:</span>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none cursor-pointer"
            >
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span>Lifecycle:</span>
            <select
              value={lifecycleFilter}
              onChange={(e) => setLifecycleFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none cursor-pointer"
            >
              <option value="All">All Stages</option>
              {LIFECYCLE_STAGES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Employee Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm dark:shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-950/80 text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-4 py-3 font-semibold">Employee</th>
                <th className="px-4 py-3 font-semibold">Code / Org</th>
                <th className="px-4 py-3 font-semibold">Department</th>
                <th className="px-4 py-3 font-semibold">Lifecycle Stage</th>
                <th className="px-4 py-3 font-semibold">Manager</th>
                <th className="px-4 py-3 font-semibold">Leave Balance</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
              {filteredEmployees.map((emp) => (
                <tr
                  key={emp.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={emp.photo}
                        alt={emp.name}
                        className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-xs"
                      />
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>{emp.name}</span>
                          {emp.fullNameBangla && (
                            <span className="text-[11px] font-normal text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 px-1.5 py-0.2 rounded border border-teal-200 dark:border-teal-900/50">
                              {emp.fullNameBangla}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">{emp.designation}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-teal-600 dark:text-teal-400 font-bold bg-teal-50 dark:bg-teal-950/30 px-2 py-0.5 rounded border border-teal-200/50 dark:border-teal-900/40 text-[11px]">
                      {emp.employeeCode}
                    </span>
                    <span className="block text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{emp.organizationName}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-800 dark:text-slate-200 font-medium">{emp.department}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                          emp.lifecycleStage === 'Confirmed'
                            ? 'bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                            : emp.lifecycleStage === 'Probation'
                            ? 'bg-amber-500/15 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30'
                            : emp.lifecycleStage === 'Onboarding'
                            ? 'bg-blue-500/15 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 border border-blue-500/30'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {emp.lifecycleStage}
                      </span>
                      {emp.approvalStatus === 'Pending Approval' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                          Pending Admin Approval
                        </span>
                      )}
                      {emp.approvalStatus === 'Rejected' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
                          Rejected
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{emp.manager}</td>
                  <td className="px-4 py-3">
                    <span className="font-bold text-slate-900 dark:text-white">{emp.leaveBalance.annual} Days</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 block">
                      Sick: {emp.leaveBalance.sick} &bull; Casual: {emp.leaveBalance.casual}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => {
                        setSelectedEmp(emp);
                        setActiveTab('official');
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 font-semibold text-xs border border-blue-200 dark:border-blue-900/60 shadow-xs transition-all cursor-pointer"
                      title="View Detailed Profile"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Profile Modal (Triggered by View) */}
      {selectedEmp && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in"
        >
          <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col">
            {/* Top Accent Gradient Bar */}
            <div className="h-2 w-full bg-gradient-to-r from-blue-600 via-teal-500 to-indigo-600"></div>

            {/* Modal Header */}
            <div className="p-6 pb-4 bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 flex flex-col gap-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={selectedEmp.photo}
                    alt={selectedEmp.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-white dark:border-slate-800 shadow-md ring-2 ring-blue-500/20"
                  />
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white font-serif">{selectedEmp.name}</h3>
                      {selectedEmp.fullNameBangla && (
                        <span className="text-sm font-medium text-teal-700 dark:text-teal-400 font-sans bg-teal-100/70 dark:bg-teal-950/60 px-2 py-0.5 rounded-lg border border-teal-200 dark:border-teal-900">
                          {selectedEmp.fullNameBangla}
                        </span>
                      )}
                      <span className="font-mono text-xs px-2.5 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800">
                        {selectedEmp.employeeCode}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedEmp.designation}</span> &bull; {selectedEmp.department}
                    </p>
                    <p className="text-[11px] text-teal-600 dark:text-teal-400 font-medium">
                      {selectedEmp.organizationName}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedEmp(null)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Close Profile"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Admin Approval Banner inside Profile Modal when Pending Approval */}
              {selectedEmp.approvalStatus === 'Pending Approval' && (
                <div className="p-3.5 bg-amber-50 dark:bg-amber-950/50 rounded-2xl border border-amber-300 dark:border-amber-800 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs">
                    <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                    <div>
                      <span className="font-bold text-amber-900 dark:text-amber-200">
                        Awaiting Company Admin Approval
                      </span>
                      <span className="text-amber-700 dark:text-amber-300 ml-1.5 text-[11px]">
                        Submitted via Public Employee Info Form
                        {selectedEmp.submittedAt ? ` on ${selectedEmp.submittedAt}` : ''}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        reviewEmployeeSubmission(selectedEmp.id, 'Approved');
                        setSelectedEmp({
                          ...selectedEmp,
                          approvalStatus: 'Approved',
                          status: 'Active',
                          lifecycleStage: 'Active',
                        });
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve Employee Profile</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        reviewEmployeeSubmission(selectedEmp.id, 'Rejected');
                        setSelectedEmp({
                          ...selectedEmp,
                          approvalStatus: 'Rejected',
                          status: 'Inactive',
                        });
                      }}
                      className="px-3 py-1.5 rounded-xl bg-rose-100 dark:bg-rose-950 hover:bg-rose-200 text-rose-700 dark:text-rose-300 text-xs font-semibold cursor-pointer transition"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              )}

              {/* Lifecycle Stage Switcher */}
              <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400">
                  <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                  <span>Lifecycle Stage:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {LIFECYCLE_STAGES.map((st) => (
                    <button
                      key={st}
                      onClick={() => {
                        updateEmployeeLifecycle(selectedEmp.id, st);
                        setSelectedEmp({ ...selectedEmp, lifecycleStage: st });
                      }}
                      className={`px-3 py-1 rounded-xl text-[11px] font-semibold transition-all cursor-pointer ${
                        selectedEmp.lifecycleStage === st
                          ? 'bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-sm ring-2 ring-blue-500/30'
                          : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Functional Tabs Navigation */}
              <div className="flex items-center gap-1 border-b border-slate-200 dark:border-slate-800 -mb-4 pt-1 overflow-x-auto">
                <button
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
            </div>

            {/* Modal Body / Tab Panes */}
            <div className="p-6 overflow-y-auto flex-1">
              {/* TAB 1: Official Information */}
              {activeTab === 'official' && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 space-y-3">
                      <div>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block">
                          English Name:
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white text-sm">{selectedEmp.name}</span>
                      </div>

                      <div>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block">
                          Bangla Name:
                        </span>
                        <span className="font-semibold text-teal-700 dark:text-teal-400 text-sm">
                          {selectedEmp.fullNameBangla || '—'}
                        </span>
                      </div>

                      <div>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block">
                          Department:
                        </span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedEmp.department}</span>
                      </div>

                      <div>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block">
                          Designation:
                        </span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedEmp.designation}</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 space-y-3">
                      <div>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block">
                          Joining Date:
                        </span>
                        <span className="font-semibold text-slate-900 dark:text-white font-mono">{selectedEmp.joiningDate}</span>
                      </div>

                      <div>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block">
                          Status:
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                            selectedEmp.status === 'Active'
                              ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800'
                              : 'bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-800'
                          }`}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          {selectedEmp.status || 'Active'}
                        </span>
                      </div>

                      <div>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block">
                          Intercom Extension:
                        </span>
                        <span className="font-mono font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 px-2 py-0.5 rounded border border-teal-200 dark:border-teal-900">
                          {selectedEmp.intercom || '102'}
                        </span>
                      </div>

                      <div>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block">
                          Educational Qualification:
                        </span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {selectedEmp.educationalQualification || 'Graduation / Post-Graduation Degree'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Additional Administrative details */}
                  <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Direct Supervisor / Manager:</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{selectedEmp.manager}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Employment Type:</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{selectedEmp.employmentType}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Performance Score:</span>
                      <span className="font-bold text-amber-600 dark:text-amber-400">{selectedEmp.performanceScore} / 5.0</span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: Personal Particulars */}
              {activeTab === 'personal' && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 space-y-3">
                      <div>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block">
                          Date of Birth (dob):
                        </span>
                        <span className="font-semibold text-slate-900 dark:text-white font-mono">
                          {selectedEmp.dob || '1990-01-01'}
                        </span>
                      </div>

                      <div>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block">
                          Gender:
                        </span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 capitalize">
                          {selectedEmp.gender || 'Male'}
                        </span>
                      </div>

                      <div>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block">
                          Blood Group:
                        </span>
                        <span className="font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-900/50">
                          {selectedEmp.bloodGroup || 'O+'}
                        </span>
                      </div>

                      <div>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block">
                          Marital Status:
                        </span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {selectedEmp.maritalStatus || 'Married'}
                        </span>
                      </div>

                      <div>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block">
                          Nationality:
                        </span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {selectedEmp.nationality || 'Bangladeshi'}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 space-y-3">
                      <div>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block">
                          National ID (NID):
                        </span>
                        <span className="font-mono font-bold text-slate-900 dark:text-white">
                          {selectedEmp.nid || '8208873573'}
                        </span>
                      </div>

                      <div>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block">
                          Passport:
                        </span>
                        <span className="font-mono text-slate-800 dark:text-slate-200">
                          {selectedEmp.passportNumber || 'N/A'}
                        </span>
                      </div>

                      <div>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block">
                          Father's Name:
                        </span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {selectedEmp.fatherName || `Father of ${selectedEmp.name}`}
                        </span>
                      </div>

                      <div>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block">
                          Mother's Name:
                        </span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {selectedEmp.motherName || `Mother of ${selectedEmp.name}`}
                        </span>
                      </div>

                      <div>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block">
                          Nominee:
                        </span>
                        <span className="font-semibold text-teal-600 dark:text-teal-400">
                          {selectedEmp.nominee || 'Spouse / Legal Beneficiary'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-900/50 text-xs">
                    <span className="text-amber-800 dark:text-amber-300 font-bold block mb-1">
                      Emergency Contact Particulars:
                    </span>
                    <span className="text-slate-900 dark:text-slate-100 font-medium">
                      {selectedEmp.emergencyContact || 'Direct Contact Person — Relationship & Phone'}
                    </span>
                  </div>
                </div>
              )}

              {/* TAB 3: Contact Particulars */}
              {activeTab === 'contact' && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 space-y-3">
                      <div>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block">
                          Official Mobile:
                        </span>
                        <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-sm">
                          {selectedEmp.phone}
                        </span>
                      </div>

                      <div>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block">
                          Official E-Mail:
                        </span>
                        <span className="font-mono text-slate-900 dark:text-white font-medium">
                          {selectedEmp.email}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 space-y-3">
                      <div>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block">
                          Personal Mobile:
                        </span>
                        <span className="font-mono text-slate-800 dark:text-slate-200 font-medium text-sm">
                          {selectedEmp.personalMobileNumber || '+880 1819-556751'}
                        </span>
                      </div>

                      <div>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block">
                          Personal E-Mail:
                        </span>
                        <span className="font-mono text-slate-800 dark:text-slate-200">
                          {selectedEmp.personalEmailAddress || `${selectedEmp.name.toLowerCase().replace(/\s+/g, '.')}@gmail.com`}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80">
                      <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white mb-2">
                        <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                        <span>Present Address</span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                        {selectedEmp.presentAddress || 'Division: Dhaka, District: Dhaka, Upazila: Dhanmondi, Post Code: 1205, Street: House #12, Road #4'}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80">
                      <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white mb-2">
                        <MapPin className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                        <span>Permanent Address</span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                        {selectedEmp.permanentAddress || 'Village/Street: Rampur, Upazila: Sonargaon, District: Narayanganj, Post Code: 1440'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: Financial & Banking Particulars (Finance Tab) */}
              {activeTab === 'finance' && (
                <div className="space-y-6 animate-in fade-in">
                  {/* Salary Breakdowns Card */}
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                        <h4 className="font-bold text-slate-900 dark:text-white font-serif text-sm">
                          Monthly Salary Breakdowns (৳ / BDT)
                        </h4>
                      </div>
                      <div className="font-mono text-xs px-2.5 py-1 rounded-lg bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-bold border border-teal-200 dark:border-teal-900">
                        Gross: ৳ {selectedEmp.salaryBreakdowns?.grossSalary?.toLocaleString() || (selectedEmp.basicSalary + selectedEmp.allowances).toLocaleString()}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-mono">
                      <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                        <span className="text-[11px] text-slate-500 font-sans block mb-1">Basic Salary:</span>
                        <span className="font-bold text-slate-900 dark:text-white text-sm">
                          ৳ {selectedEmp.salaryBreakdowns?.basicSalary?.toLocaleString() || selectedEmp.basicSalary.toLocaleString()}
                        </span>
                      </div>

                      <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                        <span className="text-[11px] text-slate-500 font-sans block mb-1">House Rent Allowance:</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                          ৳ {selectedEmp.salaryBreakdowns?.houseRent?.toLocaleString() || Math.round(selectedEmp.basicSalary * 0.4).toLocaleString()}
                        </span>
                      </div>

                      <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                        <span className="text-[11px] text-slate-500 font-sans block mb-1">Medical Allowance:</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                          ৳ {selectedEmp.salaryBreakdowns?.medicalAllowance?.toLocaleString() || Math.round(selectedEmp.basicSalary * 0.1).toLocaleString()}
                        </span>
                      </div>

                      <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                        <span className="text-[11px] text-slate-500 font-sans block mb-1">Conveyance Allowance:</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                          ৳ {selectedEmp.salaryBreakdowns?.conveyanceAllowance?.toLocaleString() || Math.round(selectedEmp.basicSalary * 0.08).toLocaleString()}
                        </span>
                      </div>

                      <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                        <span className="text-[11px] text-slate-500 font-sans block mb-1">Mobile Allowance:</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                          ৳ {selectedEmp.salaryBreakdowns?.mobileAllowance?.toLocaleString() || '3,000'}
                        </span>
                      </div>

                      <div className="p-3 bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-950/40 dark:to-emerald-950/40 rounded-xl border border-teal-200 dark:border-teal-800">
                        <span className="text-[11px] text-teal-700 dark:text-teal-300 font-sans font-semibold block mb-1">
                          Gross Salary:
                        </span>
                        <span className="font-bold text-teal-700 dark:text-teal-300 text-base">
                          ৳ {selectedEmp.salaryBreakdowns?.grossSalary?.toLocaleString() || (selectedEmp.basicSalary + selectedEmp.allowances).toLocaleString()}
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
                        <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800">
                          <span className="text-slate-500 dark:text-slate-400">Designated Bank:</span>
                          <span className="font-bold text-slate-900 dark:text-white">
                            {selectedEmp.bankingProfile?.bankName || 'Al-Arafah Islami Bank Ltd.'}
                          </span>
                        </div>

                        <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800">
                          <span className="text-slate-500 dark:text-slate-400">Account Number:</span>
                          <span className="font-mono font-bold text-teal-600 dark:text-teal-400">
                            {selectedEmp.bankingProfile?.bankAccountNo || '0141120094958'}
                          </span>
                        </div>

                        <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800">
                          <span className="text-slate-500 dark:text-slate-400">Branch Code:</span>
                          <span className="font-mono text-slate-900 dark:text-white">
                            {selectedEmp.bankingProfile?.bankBranchCode || '014'}
                          </span>
                        </div>

                        <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800">
                          <span className="text-slate-500 dark:text-slate-400">Product Code:</span>
                          <span className="font-mono text-slate-900 dark:text-white">
                            {selectedEmp.bankingProfile?.bankProductCode || '014'}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800">
                          <span className="text-slate-500 dark:text-slate-400">e-TIN Number:</span>
                          <span className="font-mono font-bold text-slate-900 dark:text-white">
                            {selectedEmp.bankingProfile?.tin || '780303412459'}
                          </span>
                        </div>

                        <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800">
                          <span className="text-slate-500 dark:text-slate-400">Tax Zone:</span>
                          <span className="font-medium text-slate-900 dark:text-white">
                            {selectedEmp.bankingProfile?.taxZone || 'Zone 15'}
                          </span>
                        </div>

                        <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800">
                          <span className="text-slate-500 dark:text-slate-400">Tax Circle:</span>
                          <span className="font-medium text-slate-900 dark:text-white">
                            {selectedEmp.bankingProfile?.taxCircle || 'Circle 1'}
                          </span>
                        </div>

                        <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800">
                          <span className="text-slate-500 dark:text-slate-400">Salary Disbursement:</span>
                          <span className="font-medium text-emerald-600 dark:text-emerald-400">AIBL Corporate BEFTN</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Google Sheet Direct Synchronization Card */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50/60 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-200/80 dark:border-emerald-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                        <FileSpreadsheet className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>Master Google Sheet Integration</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                            Permanent Sync
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400">
                          Target: <code className="text-emerald-700 dark:text-emerald-300 font-semibold">/{selectedEmp.organizationName}/Master_Google_Sheet.gsheet</code> &bull; Google Owner: <span className="font-mono text-emerald-800 dark:text-emerald-300">{PERMANENT_GOOGLE_ACCOUNT.email}</span>
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleUpdateIndividualInSheet(selectedEmp)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition cursor-pointer shadow-xs shrink-0 self-start sm:self-auto"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Sync Record to Google Sheet</span>
                    </button>
                  </div>

                  {/* Leave Balances Cards */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                      Remaining Statutory Leave Balances
                    </h4>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center">
                        <div className="text-xl font-bold text-teal-600 dark:text-teal-400">{selectedEmp.leaveBalance.annual}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Annual Leave (Days)</div>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center">
                        <div className="text-xl font-bold text-blue-600 dark:text-blue-400">{selectedEmp.leaveBalance.sick}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Sick Leave (Days)</div>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center">
                        <div className="text-xl font-bold text-amber-600 dark:text-amber-400">{selectedEmp.leaveBalance.casual}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Casual Leave (Days)</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {individualSyncNotice ? (
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 animate-pulse">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    {individualSyncNotice}
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-400">
                    Employee Profile &bull; Accounticca HRMS
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleUpdateIndividualInSheet(selectedEmp)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
                  title={`Update ${selectedEmp.name} in Master Google Sheet (${PERMANENT_GOOGLE_ACCOUNT.email})`}
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Update in Google Sheet</span>
                </button>

                <button
                  onClick={() => setSelectedEmp(null)}
                  className="px-5 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors"
                >
                  Close Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Employee Modal */}
      {addEmployeeModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
          <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-2xl overflow-hidden my-8">
            <div className="p-5 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-serif">Onboard New Employee</h3>
              <button onClick={() => setAddEmployeeModalOpen(false)} className="p-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddEmployee} className="p-6 space-y-3.5 text-xs">
              {!isClientAdmin && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Select Client Organization *</label>
                  <select
                    value={modalOrgId}
                    onChange={(e) => setModalOrgId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white font-medium cursor-pointer"
                  >
                    {organizations.map((org) => (
                      <option key={org.id} value={org.id}>
                        {org.name} ({org.country})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">English Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tanvir Ahmed"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Bangla Name (বাংলা নাম)</label>
                  <input
                    type="text"
                    placeholder="যেমন: তানভীর আহমেদ"
                    value={fullNameBangla}
                    onChange={(e) => setFullNameBangla(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Corporate Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="tanvir@apextech.io"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Official Mobile (+880)</label>
                  <input
                    type="tel"
                    required
                    placeholder="+880 1819-556751"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Department</label>
                  <input
                    type="text"
                    required
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Designation</label>
                  <input
                    type="text"
                    required
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Intercom Extension</label>
                  <input
                    type="text"
                    placeholder="105"
                    value={intercom}
                    onChange={(e) => setIntercom(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Educational Qualification</label>
                  <input
                    type="text"
                    placeholder="e.g. M.Sc in CSE"
                    value={educationalQualification}
                    onChange={(e) => setEducationalQualification(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Basic Monthly Salary (৳ / BDT)</label>
                  <input
                    type="number"
                    required
                    value={basicSalary}
                    onChange={(e) => setBasicSalary(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Joining Date</label>
                  <input
                    type="date"
                    required
                    value={joiningDate}
                    onChange={(e) => setJoiningDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Manager</label>
                  <input
                    type="text"
                    value={manager}
                    onChange={(e) => setManager(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Emergency Contact Info</label>
                  <input
                    type="text"
                    placeholder="Contact Name, Relationship & Phone"
                    value={emergencyContact}
                    onChange={(e) => setEmergencyContact(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAddEmployeeModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl cursor-pointer transition-colors shadow-sm"
                >
                  Save &amp; Trigger Onboarding
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Upload from Google Sheet Modal */}
      {bulkModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-emerald-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FileSpreadsheet className="w-5 h-5" />
                <div>
                  <h3 className="text-base font-bold font-serif">
                    Bulk Upload Employees from Google Sheet
                  </h3>
                  <p className="text-[11px] text-indigo-100">
                    Supports the 28-column Master_Employee_Information Google Sheet format
                  </p>
                </div>
              </div>
              <button
                onClick={() => setBulkModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/20 transition-colors cursor-pointer"
                aria-label="Close bulk upload modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto text-xs flex-1">
              {bulkError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{bulkError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {!isClientAdmin && (
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Target Organization
                    </label>
                    <select
                      value={bulkOrgId}
                      onChange={(e) => setBulkOrgId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    >
                      {organizations.map((o) => (
                        <option key={o.id} value={o.id}>
                          {o.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className={isClientAdmin ? 'md:col-span-2' : 'md:col-span-1'}>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Google Sheet URL or Spreadsheet ID
                  </label>
                  <input
                    type="text"
                    value={bulkSheetUrl}
                    onChange={(e) => setBulkSheetUrl(e.target.value)}
                    placeholder="https://docs.google.com/spreadsheets/d/..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Sheet Tab Name
                  </label>
                  <input
                    type="text"
                    value={bulkTabName}
                    onChange={(e) => setBulkTabName(e.target.value)}
                    placeholder="Sheet1"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleFetchBulkSheet}
                    disabled={bulkLoading || !bulkSheetUrl.trim()}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${bulkLoading ? 'animate-spin' : ''}`} />
                    <span>
                      {bulkLoading
                        ? 'Reading Google Sheet...'
                        : oauthConnected
                        ? 'Fetch Google Sheet Rows'
                        : 'Connect Google & Fetch Rows'}
                    </span>
                  </button>

                  <label className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold flex items-center gap-1.5 cursor-pointer border border-slate-200 dark:border-slate-700">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Or Upload CSV</span>
                    <input
                      type="file"
                      accept=".csv,text/csv"
                      onChange={handleCsvFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <button
                  type="button"
                  onClick={handleDownloadBulkTemplate}
                  className="px-3 py-2 rounded-xl text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 font-semibold flex items-center gap-1.5 cursor-pointer hover:bg-emerald-100 dark:hover:bg-emerald-900/50"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download 28-Col Template</span>
                </button>
              </div>

              {parsedRows.length > 0 && (
                <div className="space-y-2.5 pt-2">
                  <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {bulkMeta?.title} ({bulkMeta?.sheetName}) — {parsedRows.length} row(s) parsed
                      </span>
                    </div>
                    <label className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={skipDuplicates}
                        onChange={(e) => setSkipDuplicates(e.target.checked)}
                        className="rounded border-slate-300"
                      />
                      <span>Skip duplicate HR IDs</span>
                    </label>
                  </div>

                  <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-x-auto max-h-64">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-slate-100 dark:bg-slate-800 text-[11px] uppercase text-slate-600 dark:text-slate-300 sticky top-0">
                        <tr>
                          <th className="px-3 py-2">HR ID</th>
                          <th className="px-3 py-2">Full Name</th>
                          <th className="px-3 py-2">Department</th>
                          <th className="px-3 py-2">Gross Salary</th>
                          <th className="px-3 py-2">Official Email</th>
                          <th className="px-3 py-2">Bank Account</th>
                          <th className="px-3 py-2">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {parsedRows.map((item, i) => (
                          <tr
                            key={`${item.employee.employeeCode}-${i}`}
                            className={item.isDuplicate ? 'bg-amber-50/50 dark:bg-amber-950/20' : ''}
                          >
                            <td className="px-3 py-2 font-mono font-semibold">{item.employee.employeeCode}</td>
                            <td className="px-3 py-2 font-medium">{item.employee.name}</td>
                            <td className="px-3 py-2">{item.employee.department}</td>
                            <td className="px-3 py-2">
                              ৳{(item.employee.salaryBreakdowns?.grossSalary || 0).toLocaleString()}
                            </td>
                            <td className="px-3 py-2">{item.employee.email}</td>
                            <td className="px-3 py-2 font-mono">
                              {item.employee.bankingProfile?.bankAccountNo || '—'}
                            </td>
                            <td className="px-3 py-2">
                              {item.isDuplicate ? (
                                <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 text-[10px] font-semibold">
                                  Duplicate HR ID
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 text-[10px] font-semibold">
                                  Ready
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex items-center justify-between gap-2">
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                {parsedRows.length > 0
                  ? `${(skipDuplicates ? parsedRows.filter((r) => !r.isDuplicate) : parsedRows).length} employee(s) will be imported`
                  : 'Paste a Google Sheet link or upload a CSV to preview rows'}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setBulkModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmBulkImport}
                  disabled={
                    (skipDuplicates ? parsedRows.filter((r) => !r.isDuplicate) : parsedRows).length === 0
                  }
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl cursor-pointer disabled:opacity-50"
                >
                  Import Employees
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
