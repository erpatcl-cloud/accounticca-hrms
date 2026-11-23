/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Folder,
  FileSpreadsheet,
  Users,
  Search,
  Upload,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Plus,
  FileText,
  CheckCircle2,
  Lock,
  Globe,
  ChevronRight,
  FolderOpen,
  UserCheck,
  Building,
  Download,
  Filter,
  Mail,
} from 'lucide-react';
import {
  PERMANENT_GOOGLE_ACCOUNT,
  ACCOUNTICCA_CLIENT_DATA_FOLDER_URL,
  getAccessToken,
  getRealOAuthToken,
  googleSignIn,
  hasRealOAuthToken,
  initAuth,
} from '../../utils/googleAuth';
import {
  EMPLOYEE_HRM_TABS,
  EmployeeWorkspaceRecord,
  MASTER_EMPLOYEE_SHEET_HEADERS,
  buildMasterEmployeeRow,
  provisionEmployeeHrmWorkspace,
} from '../../services/googleHrmWorkspace';

interface GoogleWorkspaceHubProps {
  isClientAdminMode?: boolean;
}

export const GoogleWorkspaceHub: React.FC<GoogleWorkspaceHubProps> = ({ isClientAdminMode = false }) => {
  const {
    employees,
    payrollRecords,
    attendanceRecords,
    leaveRequests,
    performanceReviews,
    documents,
    organizations,
    currentUser,
  } = useApp();

  const isClientAdmin = currentUser.role === 'client_admin' || isClientAdminMode;
  const lockedOrgId = isClientAdmin ? currentUser.organizationId : null;

  const [activeTab, setActiveTab] = useState<'employees_ws' | 'sheets' | 'drive' | 'contacts'>('employees_ws');
  const [accessToken, setAccessToken] = useState<string | null>(() => getRealOAuthToken());
  const [empWorkspaces, setEmpWorkspaces] = useState<Record<string, EmployeeWorkspaceRecord>>(() => {
    try {
      const saved = localStorage.getItem('acct_employee_gws_v1');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [syncingEmployeeId, setSyncingEmployeeId] = useState<string | null>(null);
  const [isBatchSyncing, setIsBatchSyncing] = useState(false);
  const [workspaceError, setWorkspaceError] = useState<string | null>(null);

  // Selected client folder in hierarchy (default to user's org if client admin, otherwise first org)
  const [selectedClientId, setSelectedClientId] = useState<string>(() => {
    if (lockedOrgId) return lockedOrgId;
    return organizations[0]?.id || 'org_apex';
  });

  useEffect(() => {
    if (lockedOrgId) {
      setSelectedClientId(lockedOrgId);
    }
  }, [lockedOrgId]);

  // Sheets state per client: initialize dynamically from live employees & payroll
  const [clientSheets, setClientSheets] = useState<Record<string, any[][]>>({});
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

  // Modal to add a new row to the sheet
  const [addRowModalOpen, setAddRowModalOpen] = useState(false);
  const [newRowCode, setNewRowCode] = useState('');
  const [newRowName, setNewRowName] = useState('');
  const [newRowDept, setNewRowDept] = useState('Engineering');
  const [newRowDesignation, setNewRowDesignation] = useState('Senior Associate');
  const [newRowGross, setNewRowGross] = useState('8500');
  const [newRowAllowances, setNewRowAllowances] = useState('2100');
  const [newRowDeductions, setNewRowDeductions] = useState('1450');
  const [newRowNet, setNewRowNet] = useState('9150');
  const [newRowStatus, setNewRowStatus] = useState('Active');

  // Contacts search
  const [contactSearch, setContactSearch] = useState('');

  // Re-generate clientSheets dynamically when organizations or employees update
  const generateLiveSheetForOrg = (orgId: string) => {
    const org = organizations.find((o) => o.id === orgId);
    const orgEmployees = employees.filter((e) => e.organizationId === orgId);

    const headers = [...MASTER_EMPLOYEE_SHEET_HEADERS];

    if (orgEmployees.length === 0) {
      return [
        headers,
        [
          'EMP-001',
          `${org?.name || 'Company'} Admin`,
          'Operations & HR',
          'Al-Arafah Islami Bank PLC',
          '0141',
          '0141120094958',
          'SB-01',
          '95,000',
          new Date().toISOString().slice(0, 10),
          '—',
          '+880 1819-000000',
          '—',
          '—',
          '—',
          `admin@${org?.name.toLowerCase().replace(/[^a-z0-9]/g, '') || 'company'}.com`,
          '—',
          '—',
          '—',
          '—',
          '—',
          '—',
          '—',
          '—',
          '—',
          '—',
          '—',
          '—',
          '—',
        ],
      ];
    }

    const rows = orgEmployees.map((emp) => buildMasterEmployeeRow(emp));

    return [headers, ...rows];
  };

  useEffect(() => {
    const saved = localStorage.getItem('acct_google_sheets_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          setClientSheets(parsed);
          return;
        }
      } catch (e) {}
    }
    const initialSheets: Record<string, any[][]> = {};
    organizations.forEach((org) => {
      initialSheets[org.id] = generateLiveSheetForOrg(org.id);
    });
    setClientSheets(initialSheets);
  }, [organizations, employees]);

  useEffect(() => {
    if (Object.keys(clientSheets).length > 0) {
      localStorage.setItem('acct_google_sheets_v2', JSON.stringify(clientSheets));
    }
  }, [clientSheets]);

  useEffect(() => {
    initAuth((_user, token) => {
      setAccessToken(token);
    });
  }, []);

  const selectedOrg = organizations.find((o) => o.id === selectedClientId) || organizations[0];

  const handleSyncLiveSheet = () => {
    const updated = generateLiveSheetForOrg(selectedClientId);
    setClientSheets((prev) => ({
      ...prev,
      [selectedClientId]: updated,
    }));
    setSyncNotice(`Master Sheet for "${selectedOrg?.name}" synchronized with live HR records.`);
    setTimeout(() => setSyncNotice(null), 4000);
  };

  const handleExportCSV = () => {
    const currentSheet = clientSheets[selectedClientId] || generateLiveSheetForOrg(selectedClientId);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      currentSheet.map((e) => e.map((cell: any) => `"${cell}"`).join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${selectedOrg?.name.replace(/[^a-zA-Z0-9]/g, '_')}_Master_Google_Sheet.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddSheetRow = (e: React.FormEvent) => {
    e.preventDefault();
    const newRow = [
      newRowCode || `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
      newRowName || '—',
      newRowDept || '—',
      '—',
      '—',
      '—',
      '—',
      Number(newRowGross || 0).toLocaleString(),
      new Date().toISOString().slice(0, 10),
      '—',
      '—',
      '—',
      '—',
      '—',
      '—',
      '—',
      '—',
      '—',
      '—',
      '—',
      '—',
      '—',
      '—',
      '—',
      '—',
      '—',
      '—',
      '—',
    ];

    setClientSheets((prev) => {
      const current = prev[selectedClientId] || generateLiveSheetForOrg(selectedClientId);
      return {
        ...prev,
        [selectedClientId]: [...current, newRow],
      };
    });

    setAddRowModalOpen(false);
    setNewRowCode('');
    setNewRowName('');
    setSyncNotice(`Added row for ${newRowName} to Master Google Sheet.`);
    setTimeout(() => setSyncNotice(null), 4000);
  };

  // Contacts for active organization
  const activeOrgEmployees = useMemo(() => {
    return employees.filter(
      (e) => e.organizationId === selectedOrg?.id || e.organizationName === selectedOrg?.name
    );
  }, [employees, selectedOrg]);

  const filteredContacts = activeOrgEmployees.filter(
    (e) =>
      e.name.toLowerCase().includes(contactSearch.toLowerCase()) ||
      e.email.toLowerCase().includes(contactSearch.toLowerCase()) ||
      e.department.toLowerCase().includes(contactSearch.toLowerCase())
  );

  const activeSheetRows = clientSheets[selectedClientId] || generateLiveSheetForOrg(selectedClientId);

  const persistEmpWorkspaces = (next: Record<string, EmployeeWorkspaceRecord>) => {
    setEmpWorkspaces(next);
    try {
      localStorage.setItem('acct_employee_gws_v1', JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  const ensureToken = async (): Promise<string> => {
    const existing = getRealOAuthToken();
    if (existing) {
      setAccessToken(existing);
      return existing;
    }
    const res = await googleSignIn();
    setAccessToken(res.accessToken);
    return res.accessToken;
  };

  const handleProvisionEmployee = async (emp: (typeof activeOrgEmployees)[number]) => {
    if (!selectedOrg) return;
    setWorkspaceError(null);
    setSyncingEmployeeId(emp.id);
    try {
      const token = await ensureToken();
      const record = await provisionEmployeeHrmWorkspace(
        token,
        selectedOrg,
        emp,
        {
          payrollRecords,
          attendanceRecords,
          leaveRequests,
          performanceReviews,
          documents,
        },
        empWorkspaces[emp.id]
      );
      persistEmpWorkspaces({ ...empWorkspaces, [emp.id]: record });
      setSyncNotice(`Synced folder & 5-tab Master HRM Sheet for ${emp.employeeCode} (${emp.name}).`);
      setTimeout(() => setSyncNotice(null), 4000);
    } catch (err) {
      setWorkspaceError(err instanceof Error ? err.message : 'Failed to provision Google Drive/Sheet.');
    } finally {
      setSyncingEmployeeId(null);
    }
  };

  const handleProvisionAllEmployees = async () => {
    if (!selectedOrg || activeOrgEmployees.length === 0) return;
    setWorkspaceError(null);
    setIsBatchSyncing(true);
    try {
      const token = await ensureToken();
      const nextMap = { ...empWorkspaces };
      for (const emp of activeOrgEmployees) {
        setSyncingEmployeeId(emp.id);
        const rec = await provisionEmployeeHrmWorkspace(
          token,
          selectedOrg,
          emp,
          {
            payrollRecords,
            attendanceRecords,
            leaveRequests,
            performanceReviews,
            documents,
          },
          nextMap[emp.id]
        );
        nextMap[emp.id] = rec;
        persistEmpWorkspaces({ ...nextMap });
      }
      setSyncNotice(`Provisioned & synced all ${activeOrgEmployees.length} employee folders & Master HRM Sheets under Accounticca Client Data.`);
      setTimeout(() => setSyncNotice(null), 5000);
    } catch (err) {
      setWorkspaceError(err instanceof Error ? err.message : 'Batch sync failed.');
    } finally {
      setSyncingEmployeeId(null);
      setIsBatchSyncing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">
              {isClientAdmin ? 'Client Company Portal' : 'Super Admin Master Hub'}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              Google Workspace Drive &amp; Sheets Synced
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-serif tracking-tight mt-1">
            {isClientAdmin
              ? `${selectedOrg?.name} — Master Google Sheet & Drive`
              : 'Google Workspace Enterprise Hub'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {isClientAdmin
              ? `Real-time synchronization for ${selectedOrg?.name}. Only your organization's employees, payroll, and shared folders are accessible.`
              : 'Master Directory → Client Folders → Everyone Subfolders → Client Master Sheets & Separate Organization Contact Lists'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {syncNotice && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-700 dark:text-emerald-300 font-semibold animate-pulse">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{syncNotice}</span>
            </div>
          )}

          {/* Permanently Connected Google Account Pill */}
          <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 text-xs shadow-xs">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span className="font-semibold text-slate-700 dark:text-slate-300">Google Mail:</span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {PERMANENT_GOOGLE_ACCOUNT.email}
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 uppercase tracking-wider ml-1">
                Permanent
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Permanent Google Connection Status Banner */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50/60 to-blue-50/60 dark:from-emerald-950/40 dark:via-slate-900 dark:to-blue-950/40 border border-emerald-200/80 dark:border-emerald-800/60 rounded-2xl p-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-600/20">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  Permanently Connected Google Workspace Account:
                </span>
                <span className="px-2.5 py-0.5 rounded-lg bg-emerald-600 text-white font-mono font-bold text-xs tracking-tight shadow-2xs">
                  {PERMANENT_GOOGLE_ACCOUNT.email}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-100/80 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-300/60 dark:border-emerald-700/60">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  Always Active · No Sign-in/Sign-out Required
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                All cloud folders (<code className="text-blue-700 dark:text-blue-300 font-semibold">/{selectedOrg?.name}/Everyone</code>), Master Worksheets (<code className="text-emerald-700 dark:text-emerald-300 font-semibold">/{selectedOrg?.name}/Master_Google_Sheet.gsheet</code>), and Organization Contacts are persistently synchronized under <strong>{PERMANENT_GOOGLE_ACCOUNT.email}</strong>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto text-xs text-slate-600 dark:text-slate-400 font-mono shrink-0">
            <span className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold flex items-center gap-1.5 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Drive + Sheets + Contacts Synced
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Sidebar Hierarchy + Right Main Content */}
      <div className={`grid grid-cols-1 ${isClientAdmin ? 'lg:grid-cols-1' : 'lg:grid-cols-4'} gap-6`}>
        {/* Left Sidebar: Shown only to Super Admin for multi-tenant switching */}
        {!isClientAdmin && (
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
              <FolderOpen className="w-5 h-5 text-blue-600 dark:text-teal-400" />
              <div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                  Master Workspace Root
                </h4>
                <p className="text-[10px] text-slate-500">Google Drive &amp; Sheets Directory</p>
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-[10px] font-mono uppercase text-slate-400 px-2">Client Companies ({organizations.length})</div>
              {organizations.map((org) => {
                const isSelected = selectedClientId === org.id;
                return (
                  <button
                    key={org.id}
                    onClick={() => setSelectedClientId(org.id)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-teal-300 border border-blue-200 dark:border-blue-800 shadow-sm'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Folder className={`w-4 h-4 ${isSelected ? 'text-blue-600 dark:text-teal-400' : 'text-slate-400'}`} />
                      <span className="truncate">{org.name}</span>
                    </div>
                    <ChevronRight className={`w-3.5 h-3.5 ${isSelected ? 'text-blue-600 dark:text-teal-400' : 'text-slate-400'}`} />
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
              <div className="text-[10px] font-mono uppercase text-slate-400 px-2">Tenant Scope Rules</div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-[11px] text-slate-600 dark:text-slate-300 space-y-1.5 leading-relaxed">
                <div className="font-bold text-slate-900 dark:text-white">Role-Based Boundary:</div>
                <div>• <strong className="text-blue-600">Super Admin</strong>: full coverage across all client sheets.</div>
                <div>• <strong className="text-emerald-600">Client Admin</strong>: locked strictly to assigned organization.</div>
                <div>• <strong className="text-purple-600">Employee</strong>: self-service payslip and leave only.</div>
              </div>
            </div>
          </div>
        )}

        {/* Right Main Content */}
        <div className={`${isClientAdmin ? 'col-span-1' : 'lg:col-span-3'} space-y-4`}>
          {/* Active Client Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-teal-600 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-xl">
                {selectedOrg?.name.charAt(0)}
              </div>
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-blue-200">
                  {isClientAdmin ? 'Your Verified Organization' : 'Active Multi-Tenant View'}
                </div>
                <h3 className="text-xl font-bold">{selectedOrg?.name}</h3>
                <div className="text-xs text-blue-100 flex items-center gap-2 mt-0.5">
                  <span>{selectedOrg?.industry}</span>
                  <span>•</span>
                  <span>{selectedOrg?.country}</span>
                  <span>•</span>
                  <span>Package: {selectedOrg?.activePackage}</span>
                </div>
              </div>
            </div>

            {/* Tab navigation pills */}
            <div className="flex flex-wrap items-center gap-1.5 bg-black/20 p-1.5 rounded-xl self-start sm:self-center backdrop-blur-xs">
              <button
                onClick={() => setActiveTab('employees_ws')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'employees_ws'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <FolderOpen className="w-3.5 h-3.5" />
                <span>Employee Folders ({activeOrgEmployees.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('sheets')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'sheets'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Master Sheet</span>
              </button>
              <button
                onClick={() => setActiveTab('drive')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'drive'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <Folder className="w-3.5 h-3.5" />
                <span>Drive Folders</span>
              </button>
              <button
                onClick={() => setActiveTab('contacts')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'contacts'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Contacts Directory</span>
              </button>
            </div>
          </div>

          {/* TAB 1: MASTER GOOGLE WORKSHEET */}
          {activeTab === 'sheets' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      /{selectedOrg?.name}/Master_Google_Sheet.gsheet
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Synchronized register: Total {activeSheetRows.length - 1} employee &amp; payroll rows.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleSyncLiveSheet}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 font-semibold text-xs border border-emerald-200 dark:border-emerald-800 transition cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Sync Live HR</span>
                  </button>

                  <button
                    onClick={handleExportCSV}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-blue-700 dark:text-blue-300 font-semibold text-xs border border-blue-200 dark:border-blue-800 transition cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export CSV</span>
                  </button>

                  <button
                    onClick={() => setAddRowModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-xs transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Row</span>
                  </button>
                </div>
              </div>

              {/* Linked Google Spreadsheet Permanent URL Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between px-3.5 py-2 bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/80 rounded-xl text-xs text-emerald-900 dark:text-emerald-200 gap-2 shadow-2xs">
                <div className="flex items-center gap-2 truncate">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                  <span className="font-bold">Permanent Google Sheet Link:</span>
                  <span className="font-mono text-[11px] text-emerald-700 dark:text-emerald-300 truncate">
                    https://docs.google.com/spreadsheets/d/1Ekram_MasterSheet_{selectedOrg?.id}/edit
                  </span>
                </div>
                <div className="text-[11px] font-mono text-slate-600 dark:text-slate-400 shrink-0">
                  Google Owner: <strong className="text-emerald-800 dark:text-emerald-200">{PERMANENT_GOOGLE_ACCOUNT.email}</strong>
                </div>
              </div>

              {/* Master Sheet Table */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto max-h-[500px]">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-100 dark:bg-slate-800 sticky top-0 border-b border-slate-200 dark:border-slate-700 z-10 text-slate-600 dark:text-slate-300 uppercase tracking-wider font-bold">
                      <tr>
                        {activeSheetRows[0]?.map((col: string, idx: number) => (
                          <th key={idx} className="py-3 px-4 whitespace-nowrap">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                      {activeSheetRows.slice(1).map((row: any[], rIdx: number) => (
                        <tr key={rIdx} className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition">
                          {row.map((cell: any, cIdx: number) => (
                            <td key={cIdx} className="py-2.5 px-4 whitespace-nowrap">
                              {cIdx === row.length - 1 ? (
                                <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                                  cell === 'Active'
                                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                                    : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                                }`}>
                                  {cell}
                                </span>
                              ) : (
                                cell
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GOOGLE DRIVE FOLDERS */}
          {activeTab === 'drive' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-teal-400 flex items-center justify-center">
                    <Folder className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      /{selectedOrg?.name}/Everyone
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Cloud shared workspace accessible by verified staff and administrators.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => alert(`New file uploaded to /${selectedOrg?.name}/Everyone`)}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Upload File to Everyone</span>
                </button>
              </div>

              {/* Linked Google Drive Folder Permanent URL Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between px-3.5 py-2 bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800/80 rounded-xl text-xs text-blue-900 dark:text-blue-200 gap-2 shadow-2xs">
                <div className="flex items-center gap-2 truncate">
                  <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></span>
                  <span className="font-bold">Permanent Google Drive Folder:</span>
                  <span className="font-mono text-[11px] text-blue-700 dark:text-blue-300 truncate">
                    https://drive.google.com/drive/folders/1Ekram_{selectedOrg?.id}_Everyone
                  </span>
                </div>
                <div className="text-[11px] font-mono text-slate-600 dark:text-slate-400 shrink-0">
                  Google Owner: <strong className="text-blue-800 dark:text-blue-200">{PERMANENT_GOOGLE_ACCOUNT.email}</strong>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { name: `${selectedOrg?.name}_Employee_Handbook_2026.pdf`, type: 'PDF Document', size: '2.4 MB', date: '2026-11-01' },
                  { name: `${selectedOrg?.name}_Q4_Benefits_Compensation.docx`, type: 'Google Doc', size: '820 KB', date: '2026-10-15' },
                  { name: `${selectedOrg?.name}_Statutory_Labor_Compliance.pdf`, type: 'PDF Document', size: '1.8 MB', date: '2026-09-10' },
                ].map((file, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
                    <div className="flex items-center justify-between">
                      <FileText className="w-5 h-5 text-blue-600 dark:text-teal-400" />
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {file.type}
                      </span>
                    </div>
                    <h5 className="font-bold text-xs text-slate-900 dark:text-white truncate" title={file.name}>
                      {file.name}
                    </h5>
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                      <span>{file.size}</span>
                      <span className="text-blue-600 dark:text-teal-400 font-semibold cursor-pointer hover:underline">Download</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CONTACTS DIRECTORY */}
          {activeTab === 'contacts' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Google Contacts — {selectedOrg?.name} Directory
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Separate synced address book for this organization ({activeOrgEmployees.length} Contacts).
                  </p>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={contactSearch}
                    onChange={(e) => setContactSearch(e.target.value)}
                    placeholder="Search contacts..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Linked Google Contacts Permanent URL Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between px-3.5 py-2 bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/80 rounded-xl text-xs text-indigo-900 dark:text-indigo-200 gap-2 shadow-2xs">
                <div className="flex items-center gap-2 truncate">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0"></span>
                  <span className="font-bold">Permanent Google Contacts Directory:</span>
                  <span className="font-mono text-[11px] text-indigo-700 dark:text-indigo-300 truncate">
                    Google People API — Linked to {PERMANENT_GOOGLE_ACCOUNT.email}
                  </span>
                </div>
                <div className="text-[11px] font-mono text-slate-600 dark:text-slate-400 shrink-0">
                  Total Synced: <strong className="text-indigo-800 dark:text-indigo-200">{filteredContacts.length} Contacts</strong>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredContacts.map((emp) => (
                  <div
                    key={emp.id}
                    className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={emp.photo}
                        alt={emp.name}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                      />
                      <div className="min-w-0">
                        <div className="font-bold text-xs text-slate-900 dark:text-white truncate">{emp.name}</div>
                        <div className="text-[11px] text-slate-500 truncate">{emp.designation}</div>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                      <div className="truncate">✉ {emp.email}</div>
                      <div>☎ {emp.phone}</div>
                      <div className="font-semibold text-blue-600 dark:text-blue-400 text-[10px] uppercase">
                        {emp.department}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 0: One Employee = One Dedicated Folder + One Master Google Sheet + 5 HRM Tabs */}
          {activeTab === 'employees_ws' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Folder className="w-4 h-4 text-emerald-600" />
                    <span>One Employee = One Dedicated Folder + One 5-Tab Master HRM Sheet</span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Root:{' '}
                    <a
                      href={ACCOUNTICCA_CLIENT_DATA_FOLDER_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                    >
                      Accounticca Client Data
                      <ExternalLink className="w-3 h-3" />
                    </a>{' '}
                    → <span className="font-semibold">{selectedOrg?.name}</span> → <span className="font-mono">Employees</span>
                  </div>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {EMPLOYEE_HRM_TABS.map((t) => (
                      <span key={t} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {!hasRealOAuthToken() && !accessToken && (
                    <button
                      type="button"
                      onClick={() => ensureToken().catch((e) => setWorkspaceError(e instanceof Error ? e.message : 'OAuth failed'))}
                      className="px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-white hover:bg-slate-50 cursor-pointer"
                    >
                      Connect Google OAuth ({PERMANENT_GOOGLE_ACCOUNT.email})
                    </button>
                  )}
                  <button
                    type="button"
                    disabled={isBatchSyncing || activeOrgEmployees.length === 0}
                    onClick={handleProvisionAllEmployees}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isBatchSyncing ? 'animate-spin' : ''}`} />
                    <span>{isBatchSyncing ? 'Syncing All Employees...' : `Provision & Sync All (${activeOrgEmployees.length})`}</span>
                  </button>
                </div>
              </div>

              {workspaceError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 font-medium">
                  {workspaceError}
                </div>
              )}

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                    <tr>
                      <th className="px-4 py-3 text-left">Employee</th>
                      <th className="px-4 py-3 text-left">Department &amp; Role</th>
                      <th className="px-4 py-3 text-left">Dedicated Folder</th>
                      <th className="px-4 py-3 text-left">Master HRM Sheet (5 Tabs)</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {activeOrgEmployees.map((emp) => {
                      const rec = empWorkspaces[emp.id];
                      const busy = syncingEmployeeId === emp.id;
                      return (
                        <tr key={emp.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                          <td className="px-4 py-3">
                            <div className="font-semibold text-slate-900 dark:text-white">{emp.name}</div>
                            <div className="text-[11px] font-mono text-slate-500">{emp.employeeCode}</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-slate-800 dark:text-slate-200">{emp.department}</div>
                            <div className="text-[11px] text-slate-500">{emp.designation}</div>
                          </td>
                          <td className="px-4 py-3">
                            {rec ? (
                              <a
                                href={rec.employeeFolderUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline font-medium"
                              >
                                <Folder className="w-3.5 h-3.5" />
                                <span>Open Folder</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            ) : (
                              <span className="text-slate-400">Not provisioned</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {rec ? (
                              <a
                                href={rec.spreadsheetUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 hover:underline font-semibold"
                              >
                                <FileSpreadsheet className="w-3.5 h-3.5" />
                                <span>Open Master Sheet</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            ) : (
                              <span className="text-slate-400">5 tabs ready</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              type="button"
                              disabled={busy || isBatchSyncing}
                              onClick={() => handleProvisionEmployee(emp)}
                              className="px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 text-white text-[11px] font-semibold inline-flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                            >
                              <RefreshCw className={`w-3 h-3 ${busy ? 'animate-spin' : ''}`} />
                              <span>{busy ? 'Syncing...' : rec ? 'Re-Sync' : 'Create & Sync'}</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Sheet Row Modal */}
      {addRowModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                Add Record to Master Google Sheet
              </h3>
              <button
                onClick={() => setAddRowModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSheetRow} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Employee Code</label>
                  <input
                    type="text"
                    value={newRowCode}
                    onChange={(e) => setNewRowCode(e.target.value)}
                    placeholder="e.g. EMP-1099"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newRowName}
                    onChange={(e) => setNewRowName(e.target.value)}
                    placeholder="e.g. Johnathan Doe"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Department</label>
                  <input
                    type="text"
                    value={newRowDept}
                    onChange={(e) => setNewRowDept(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Designation</label>
                  <input
                    type="text"
                    value={newRowDesignation}
                    onChange={(e) => setNewRowDesignation(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Monthly Basic (BDT)</label>
                  <input
                    type="number"
                    value={newRowGross}
                    onChange={(e) => setNewRowGross(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Allowances (BDT)</label>
                  <input
                    type="number"
                    value={newRowAllowances}
                    onChange={(e) => setNewRowAllowances(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Deductions (BDT)</label>
                  <input
                    type="number"
                    value={newRowDeductions}
                    onChange={(e) => setNewRowDeductions(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setAddRowModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white"
                >
                  Append Row to Sheet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
