import React, { useState, useEffect, useMemo } from 'react';
import {
  Organization,
  CompanyBranch,
  CompanyBankAccount,
  CompanyVaultDocument,
  CompanyAuditLogEntry,
  CompanySecuritySettings,
} from '../../types';
import { useApp } from '../../context/AppContext';
import {
  DIVISIONS,
  getDistrictsForDivision,
  getUpazilasForDistrict,
  getPostCodesForUpazila,
} from '../../utils/bangladeshGeo';
import {
  Building2,
  X,
  MapPin,
  Landmark,
  ShieldCheck,
  FileText,
  BarChart3,
  Lock,
  Edit3,
  Save,
  Plus,
  ExternalLink,
  CheckCircle2,
  FileSpreadsheet,
  Globe,
  Calendar,
  Layers,
  Award,
  CreditCard,
  Download,
  Upload,
  Sparkles,
  Trash2,
  Power,
  FileDown,
  Image as ImageIcon,
} from 'lucide-react';
import { PERMANENT_GOOGLE_ACCOUNT } from '../../utils/googleAuth';

interface CompanyProfileModalProps {
  organization: Organization | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedOrg: Organization) => void;
  onOpenGoogleSheet?: (org: Organization) => void;
}

type TabId =
  | 'profile'
  | 'locations'
  | 'finance'
  | 'compliance'
  | 'vault'
  | 'analytics'
  | 'security';

const ALL_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DOC_CATEGORIES = [
  'All',
  'Incorporation',
  'Trade License',
  'MOA/AOA',
  'Tax/TIN',
  'VAT/BIN',
  'Bank Solvency',
  'Other',
] as const;

function getTradeLicenseBadge(expiryDate?: string): {
  label: string;
  classes: string;
  detail: string;
} {
  if (!expiryDate) {
    return {
      label: 'Not Set',
      classes: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
      detail: 'No expiry date',
    };
  }
  const exp = new Date(expiryDate);
  if (Number.isNaN(exp.getTime())) {
    return {
      label: 'Valid',
      classes: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
      detail: expiryDate,
    };
  }
  const now = new Date();
  const diffDays = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) {
    return {
      label: 'Expired',
      classes: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
      detail: `Expired ${Math.abs(diffDays)}d ago`,
    };
  }
  if (diffDays <= 60) {
    return {
      label: 'Expiring Soon',
      classes: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
      detail: `${diffDays}d remaining`,
    };
  }
  return {
    label: 'Valid',
    classes: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    detail: `${diffDays}d remaining`,
  };
}

export const CompanyProfileModal: React.FC<CompanyProfileModalProps> = ({
  organization,
  isOpen,
  onClose,
  onSave,
  onOpenGoogleSheet,
}) => {
  const { currentUser, employees, payrollRecords, candidates, jobs } = useApp();

  const [activeTab, setActiveTab] = useState<TabId>('profile');
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState<Organization | null>(organization);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<string | null>(null);

  // Branch Add / Edit modal state
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [editingBranchId, setEditingBranchId] = useState<string | null>(null);
  const [branchForm, setBranchForm] = useState<{
    name: string;
    code: string;
    manager: string;
    division: string;
    district: string;
    upazila: string;
    postCode: string;
    street: string;
    contactNumber: string;
    email: string;
    geofenceRadius: number;
    status: 'Active' | 'Inactive';
  }>({
    name: '',
    code: '',
    manager: '',
    division: 'Dhaka',
    district: 'Dhaka',
    upazila: 'Banani',
    postCode: '1213',
    street: '',
    contactNumber: '+880 ',
    email: '',
    geofenceRadius: 100,
    status: 'Active',
  });

  // Bank Add modal state
  const [showAddBank, setShowAddBank] = useState(false);
  const [newBank, setNewBank] = useState<Partial<CompanyBankAccount>>({
    bankName: 'Al-Arafah Islami Bank Ltd.',
    branchName: 'Corporate Branch',
    accountName: '',
    accountNumber: '',
    routingNumber: '015261184',
    swiftCode: 'AIBLBDDHXXX',
    isPrimary: false,
  });

  // Document Vault Add modal & filter state
  const [vaultFilter, setVaultFilter] = useState<string>('All');
  const [showAddDoc, setShowAddDoc] = useState(false);
  const [newDoc, setNewDoc] = useState<{
    name: string;
    type: string;
    size: string;
    fileData: string;
  }>({
    name: '',
    type: 'Trade License',
    size: '1.8 MB',
    fileData: '',
  });

  useEffect(() => {
    if (organization) {
      setFormData({ ...organization });
      setNewBank((prev) => ({ ...prev, accountName: organization.name }));
      setIsEditMode(false);
    }
  }, [organization]);

  // Live Org Analytics from AppContext
  const liveAnalytics = useMemo(() => {
    if (!organization) {
      return {
        totalEmployees: 0,
        activeEmployees: 0,
        inactiveEmployees: 0,
        monthlyPayrollBdt: 0,
        openPositions: 0,
        pipelineCandidates: 0,
        departments: [] as Array<{ name: string; count: number }>,
      };
    }
    const orgEmps = employees.filter((e) => e.organizationId === organization.id);
    const activeEmps = orgEmps.filter((e) => e.status === 'Active');
    const orgPay = payrollRecords.filter((p) => p.organizationId === organization.id);
    const monthlyPayrollBdt =
      orgPay.length > 0
        ? orgPay.reduce((sum, p) => sum + (p.netSalary || p.grossSalary || 0), 0)
        : orgEmps.reduce((sum, e) => sum + (e.salaryBreakdowns?.grossSalary || 0), 0);
    const orgJobs = jobs.filter(
      (j) => j.organizationId === organization.id && j.status === 'Open'
    );
    const orgCandidates = candidates.filter((c) => c.organizationId === organization.id);

    const deptMap: Record<string, number> = {};
    orgEmps.forEach((e) => {
      const dept = e.department || 'General';
      deptMap[dept] = (deptMap[dept] || 0) + 1;
    });
    const departments = Object.entries(deptMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    return {
      totalEmployees: orgEmps.length,
      activeEmployees: activeEmps.length,
      inactiveEmployees: Math.max(0, orgEmps.length - activeEmps.length),
      monthlyPayrollBdt,
      openPositions: orgJobs.length || organization.recruitment?.openPositions || 0,
      pipelineCandidates: orgCandidates.length || organization.recruitment?.totalApplicants || 0,
      departments,
    };
  }, [organization, employees, payrollRecords, candidates, jobs]);

  if (!isOpen || !organization || !formData) return null;

  const notifySaved = (msg: string) => {
    setSaveSuccessNotice(msg);
    setTimeout(() => setSaveSuccessNotice(null), 3500);
  };

  const withAuditEntry = (
    org: Organization,
    action: string,
    details: string
  ): Organization => {
    const entry: CompanyAuditLogEntry = {
      id: `caud_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      modifiedBy: `${currentUser.name} (${currentUser.role})`,
      action,
      details,
    };
    return {
      ...org,
      auditLogs: [entry, ...(org.auditLogs || [])],
    };
  };

  const handleSaveChanges = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const updated = withAuditEntry(
      formData,
      `UPDATED_${activeTab.toUpperCase()}`,
      `Saved changes in ${activeTab} tab for ${formData.name}`
    );
    setFormData(updated);
    onSave(updated);
    setIsEditMode(false);
    notifySaved('Company profile & settings saved and logged.');
  };

  // --- Branch Handlers ---
  const openAddBranchModal = () => {
    setEditingBranchId(null);
    setBranchForm({
      name: '',
      code: '',
      manager: '',
      division: 'Dhaka',
      district: 'Dhaka',
      upazila: 'Banani',
      postCode: '1213',
      street: '',
      contactNumber: '+880 ',
      email: '',
      geofenceRadius: 100,
      status: 'Active',
    });
    setShowBranchModal(true);
  };

  const openEditBranchModal = (branch: CompanyBranch) => {
    setEditingBranchId(branch.id);
    setBranchForm({
      name: branch.name,
      code: branch.code,
      manager: branch.manager,
      division: 'Dhaka',
      district: 'Dhaka',
      upazila: 'Banani',
      postCode: '1213',
      street: branch.address,
      contactNumber: branch.contactNumber,
      email: branch.email,
      geofenceRadius: branch.geofenceRadius ?? 100,
      status: branch.status,
    });
    setShowBranchModal(true);
  };

  const handleSaveBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!branchForm.name.trim()) return;
    const composedAddress = branchForm.street.includes(branchForm.division)
      ? branchForm.street
      : `${branchForm.street ? branchForm.street + ', ' : ''}${branchForm.upazila}, ${branchForm.district}, ${branchForm.division} - ${branchForm.postCode}`;

    let updatedBranches: CompanyBranch[];
    let actionLabel: string;
    if (editingBranchId) {
      updatedBranches = (formData.branches || []).map((b) =>
        b.id === editingBranchId
          ? {
              ...b,
              name: branchForm.name,
              code: branchForm.code || b.code,
              manager: branchForm.manager || b.manager,
              address: composedAddress,
              contactNumber: branchForm.contactNumber || '+880 1700-000000',
              email: branchForm.email || b.email,
              geofenceRadius: Number(branchForm.geofenceRadius) || 100,
              status: branchForm.status,
            }
          : b
      );
      actionLabel = `Updated branch ${branchForm.name}`;
    } else {
      const created: CompanyBranch = {
        id: `br_${Date.now()}`,
        name: branchForm.name,
        code: branchForm.code || `BR-${Math.floor(10 + Math.random() * 89)}`,
        manager: branchForm.manager || 'Branch Manager',
        address: composedAddress,
        contactNumber: branchForm.contactNumber || '+880 1700-000000',
        email: branchForm.email || `branch@${formData.shortName?.toLowerCase() || 'company'}.com.bd`,
        geofenceRadius: Number(branchForm.geofenceRadius) || 100,
        status: branchForm.status,
      };
      updatedBranches = [...(formData.branches || []), created];
      actionLabel = `Added branch ${created.name} (${created.code})`;
    }

    const updated = withAuditEntry(
      { ...formData, branches: updatedBranches },
      editingBranchId ? 'UPDATED_BRANCH' : 'ADDED_BRANCH',
      actionLabel
    );
    setFormData(updated);
    onSave(updated);
    setShowBranchModal(false);
    notifySaved(actionLabel);
  };

  const handleToggleBranchStatus = (branchId: string) => {
    const target = (formData.branches || []).find((b) => b.id === branchId);
    if (!target) return;
    const nextStatus: 'Active' | 'Inactive' = target.status === 'Active' ? 'Inactive' : 'Active';
    const updated = withAuditEntry(
      {
        ...formData,
        branches: (formData.branches || []).map((b) =>
          b.id === branchId ? { ...b, status: nextStatus } : b
        ),
      },
      'TOGGLED_BRANCH_STATUS',
      `${target.name} marked ${nextStatus}`
    );
    setFormData(updated);
    onSave(updated);
    notifySaved(`${target.name} is now ${nextStatus}.`);
  };

  const handleDeleteBranch = (branchId: string) => {
    const target = (formData.branches || []).find((b) => b.id === branchId);
    const updated = withAuditEntry(
      {
        ...formData,
        branches: (formData.branches || []).filter((b) => b.id !== branchId),
      },
      'DELETED_BRANCH',
      `Removed branch ${target?.name || branchId}`
    );
    setFormData(updated);
    onSave(updated);
    notifySaved('Branch removed.');
  };

  // --- Bank Handlers ---
  const handleAddBank = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBank.bankName || !newBank.accountNumber) return;
    const bank: CompanyBankAccount = {
      id: `bnk_${Date.now()}`,
      bankName: newBank.bankName,
      branchName: newBank.branchName || 'Dhaka Main Branch',
      accountName: newBank.accountName || formData.name,
      accountNumber: newBank.accountNumber,
      routingNumber: newBank.routingNumber || '015261184',
      swiftCode: newBank.swiftCode || 'AIBLBDDHXXX',
      isPrimary: Boolean(newBank.isPrimary),
    };
    const existing = formData.bankAccounts || [];
    const normalized = bank.isPrimary
      ? existing.map((b) => ({ ...b, isPrimary: false }))
      : existing;
    const updated = withAuditEntry(
      { ...formData, bankAccounts: [...normalized, bank] },
      'ADDED_BANK_ACCOUNT',
      `Added ${bank.bankName} (A/C ${bank.accountNumber})`
    );
    setFormData(updated);
    onSave(updated);
    setShowAddBank(false);
    setNewBank({
      bankName: 'Al-Arafah Islami Bank Ltd.',
      branchName: 'Corporate Branch',
      accountName: formData.name,
      accountNumber: '',
      routingNumber: '015261184',
      swiftCode: 'AIBLBDDHXXX',
      isPrimary: false,
    });
    notifySaved('Corporate bank account added.');
  };

  const handleSetPrimaryBank = (bankId: string) => {
    const target = (formData.bankAccounts || []).find((b) => b.id === bankId);
    const updated = withAuditEntry(
      {
        ...formData,
        bankAccounts: (formData.bankAccounts || []).map((b) => ({
          ...b,
          isPrimary: b.id === bankId,
        })),
      },
      'SET_PRIMARY_BANK',
      `Set ${target?.bankName || bankId} as primary disbursement account`
    );
    setFormData(updated);
    onSave(updated);
    notifySaved('Primary disbursement account updated.');
  };

  const handleDeleteBank = (bankId: string) => {
    const target = (formData.bankAccounts || []).find((b) => b.id === bankId);
    const updated = withAuditEntry(
      {
        ...formData,
        bankAccounts: (formData.bankAccounts || []).filter((b) => b.id !== bankId),
      },
      'REMOVED_BANK_ACCOUNT',
      `Removed ${target?.bankName || bankId}`
    );
    setFormData(updated);
    onSave(updated);
    notifySaved('Bank account removed.');
  };

  // --- Vault Handlers ---
  const handleVaultFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
    const sizeLabel =
      Number(sizeMb) < 0.1 ? `${Math.max(1, Math.round(file.size / 1024))} KB` : `${sizeMb} MB`;
    const reader = new FileReader();
    reader.onload = () => {
      setNewDoc((prev) => ({
        ...prev,
        name: prev.name || file.name,
        size: sizeLabel,
        fileData: typeof reader.result === 'string' ? reader.result : '',
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoc.name) return;
    const doc: CompanyVaultDocument = {
      id: `doc_${Date.now()}`,
      name: newDoc.name,
      type: newDoc.type,
      uploadDate: new Date().toISOString().split('T')[0],
      size: newDoc.size || '1.2 MB',
      fileData: newDoc.fileData || undefined,
    };
    const updated = withAuditEntry(
      { ...formData, documents: [...(formData.documents || []), doc] },
      'UPLOADED_VAULT_DOCUMENT',
      `Uploaded ${doc.name} (${doc.type})`
    );
    setFormData(updated);
    onSave(updated);
    setShowAddDoc(false);
    setNewDoc({ name: '', type: 'Trade License', size: '1.8 MB', fileData: '' });
    notifySaved('Document added to corporate vault.');
  };

  const handleDeleteDocument = (docId: string) => {
    const target = (formData.documents || []).find((d) => d.id === docId);
    const updated = withAuditEntry(
      {
        ...formData,
        documents: (formData.documents || []).filter((d) => d.id !== docId),
      },
      'DELETED_VAULT_DOCUMENT',
      `Deleted ${target?.name || docId}`
    );
    setFormData(updated);
    onSave(updated);
    notifySaved('Document removed from vault.');
  };

  const handleDownloadDocument = (doc: CompanyVaultDocument) => {
    if (doc.fileData) {
      const a = document.createElement('a');
      a.href = doc.fileData;
      a.download = doc.name;
      a.click();
      return;
    }
    const summary = `Accounticca HRMS Document Metadata\nCompany: ${formData.name}\nDocument: ${doc.name}\nCategory: ${doc.type}\nUploaded: ${doc.uploadDate}\nSize: ${doc.size}\n`;
    const blob = new Blob([summary], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc.name.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // --- Brand Image Upload Helper ---
  const handleBrandImageUpload = (
    field: 'logoUrl' | 'coverUrl' | 'sealUrl',
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setFormData((prev) => (prev ? { ...prev, [field]: reader.result as string } : prev));
      }
    };
    reader.readAsDataURL(file);
  };

  // --- Security RBAC Toggle ---
  const handleToggleSecurity = (key: keyof CompanySecuritySettings) => {
    const currentVal = Boolean(formData.securitySettings?.[key]);
    const nextSecurity: CompanySecuritySettings = {
      superAdminAccess: formData.securitySettings?.superAdminAccess ?? true,
      hrManagerAccess: formData.securitySettings?.hrManagerAccess ?? true,
      directorReadOnlyAccess: formData.securitySettings?.directorReadOnlyAccess ?? true,
      [key]: !currentVal,
    };
    const updated = withAuditEntry(
      { ...formData, securitySettings: nextSecurity },
      'UPDATED_SECURITY_POLICY',
      `${String(key)} set to ${!currentVal ? 'ENABLED' : 'DISABLED'}`
    );
    setFormData(updated);
    onSave(updated);
    notifySaved(`Security setting "${String(key)}" updated.`);
  };

  // --- Export Dossier ---
  const handleExportDossier = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      name: formData.name,
      nameBangla: formData.nameBangla,
      shortName: formData.shortName,
      legalInfo: formData.legalInfo,
      contactInfo: formData.contactInfo,
      headOffice: formData.headOffice,
      branches: formData.branches,
      businessInfo: formData.businessInfo,
      taxVat: formData.taxVat,
      bankAccounts: formData.bankAccounts,
      compliance: formData.compliance,
      payrollSettings: formData.payrollSettings,
      analytics: liveAnalytics,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(formData.shortName || formData.name).replace(/\s+/g, '_')}_Company_Dossier.json`;
    a.click();
    URL.revokeObjectURL(url);
    notifySaved('Company dossier exported.');
  };

  const tradeBadge = getTradeLicenseBadge(formData.legalInfo?.tradeLicenseExpiryDate);
  const filteredDocs = (formData.documents || []).filter(
    (d) => vaultFilter === 'All' || d.type === vaultFilter
  );

  const tabs: Array<{ id: TabId; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'profile', label: 'Profile & Legal', icon: Building2 },
    { id: 'locations', label: 'Locations & Branches', icon: MapPin },
    { id: 'finance', label: 'Finance & Banking', icon: Landmark },
    { id: 'compliance', label: 'Compliance & Policies', icon: ShieldCheck },
    { id: 'vault', label: 'Document Vault', icon: FileText },
    { id: 'analytics', label: 'Org Analytics', icon: BarChart3 },
    { id: 'security', label: 'Security & Audit', icon: Lock },
  ];

  const hoDiv = formData.headOffice?.division || 'Dhaka';
  const hoDist = formData.headOffice?.district || getDistrictsForDivision(hoDiv)[0];
  const hoUpa = formData.headOffice?.area || getUpazilasForDistrict(hoDist)[0];

  const brDistricts = getDistrictsForDivision(branchForm.division);
  const brUpazilas = getUpazilasForDistrict(branchForm.district);
  const brPostCodes = getPostCodesForUpazila(branchForm.upazila);

  const defaultLegal = {
    businessType: 'Private Limited Company',
    incorporationDate: '',
    registrationNumber: '',
    tradeLicenseNumber: '',
    tradeLicenseExpiryDate: '',
    binNumber: '',
    tinNumber: '',
    rjscRegistrationNumber: '',
  };

  const defaultHeadOffice = {
    name: 'Corporate Head Office',
    addressLine1: '',
    addressLine2: '',
    area: hoUpa,
    city: hoDist,
    district: hoDist,
    division: hoDiv,
    postalCode: '1213',
    country: 'Bangladesh',
  };

  const defaultCompliance = {
    weeklyHoliday: 'Friday & Saturday',
    workingDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu'],
    startTime: '09:00 AM',
    endTime: '06:00 PM',
    ramadanStartTime: '09:00 AM',
    ramadanEndTime: '03:30 PM',
  };

  const defaultPayroll = {
    salaryPaymentDate: 5,
    payrollMonthClosingDate: 25,
    overtimePolicy: '2x Basic Hourly Rate',
    bonusPolicy: 'Annual Performance Bonus',
    eidBonusPolicy: '100% Basic Salary (Eid-ul-Fitr & Eid-ul-Adha)',
    festivalBonusPolicy: '20% Boishakhi Allowance',
    incrementPolicy: 'Annual Appraisal (Up to 15%)',
    taxDeductionPolicy: 'NBR Monthly AIT Slab Deduction',
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-6xl max-h-[94vh] flex flex-col overflow-hidden my-auto">
        {/* Top Corporate Banner */}
        <div className="relative bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white px-6 py-5 border-b border-slate-800 shrink-0">
          {formData.coverUrl && (
            <img
              src={formData.coverUrl}
              alt="Cover"
              className="absolute inset-0 w-full h-full object-cover opacity-15 pointer-events-none"
            />
          )}
          <div className="relative z-10 flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-400 to-blue-600 flex items-center justify-center text-white font-extrabold text-xl shadow-lg border border-white/20 shrink-0 overflow-hidden">
                {formData.logoUrl ? (
                  <img src={formData.logoUrl} alt={formData.name} className="w-full h-full object-cover" />
                ) : (
                  formData.shortName || formData.name.slice(0, 2).toUpperCase()
                )}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight">{formData.name}</h2>
                  {formData.shortName && (
                    <span className="px-2 py-0.5 text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 rounded-md">
                      {formData.shortName}
                    </span>
                  )}
                  <span
                    className={`px-2 py-0.5 text-xs font-semibold rounded-full uppercase ${
                      formData.status === 'active'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {formData.status}
                  </span>
                </div>
                {formData.nameBangla && (
                  <p className="text-sm text-teal-200/90 font-medium mt-0.5">{formData.nameBangla}</p>
                )}
                <p className="text-xs text-slate-300 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span>{formData.industry}</span>
                  <span>•</span>
                  <span>Tier: {formData.activePackage}</span>
                  <span>•</span>
                  <span>{liveAnalytics.totalEmployees} Employees</span>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {onOpenGoogleSheet && (
                <button
                  type="button"
                  onClick={() => onOpenGoogleSheet(formData)}
                  className="px-3 py-1.5 bg-emerald-600/90 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Master Sheet</span>
                </button>
              )}
              <button
                type="button"
                onClick={handleExportDossier}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center space-x-1.5 border border-slate-700 transition-colors cursor-pointer"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>Export Dossier</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  if (isEditMode) {
                    handleSaveChanges();
                  } else {
                    setIsEditMode(true);
                  }
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer ${
                  isEditMode
                    ? 'bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold'
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                }`}
              >
                {isEditMode ? <Save className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
                <span>{isEditMode ? 'Save Changes' : 'Edit Profile'}</span>
              </button>
              {isEditMode && (
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ ...organization });
                    setIsEditMode(false);
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold border border-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {saveSuccessNotice && (
            <div className="relative z-10 mt-3 px-3.5 py-2 bg-emerald-500/20 border border-emerald-400/40 rounded-lg text-xs font-medium text-emerald-200 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{saveSuccessNotice}</span>
            </div>
          )}
        </div>

        {/* 7-Tab Navigation */}
        <div className="bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 px-4 overflow-x-auto shrink-0">
          <div className="flex items-center space-x-1 min-w-max py-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center space-x-2 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white dark:bg-slate-800 text-blue-700 dark:text-teal-400 shadow-sm border border-slate-200 dark:border-slate-700'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white dark:bg-slate-900">
          {/* TAB 1: PROFILE & LEGAL */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span>Bilingual Corporate Identity</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        English Legal Name
                      </label>
                      {isEditMode ? (
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="mt-1 w-full px-3 py-1.5 text-sm border rounded-lg dark:bg-slate-800 dark:border-slate-700"
                        />
                      ) : (
                        <p className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">
                          {formData.name}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        Bangla Name (বাংলা নাম)
                      </label>
                      {isEditMode ? (
                        <input
                          type="text"
                          value={formData.nameBangla || ''}
                          onChange={(e) => setFormData({ ...formData, nameBangla: e.target.value })}
                          className="mt-1 w-full px-3 py-1.5 text-sm border rounded-lg dark:bg-slate-800 dark:border-slate-700"
                        />
                      ) : (
                        <p className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">
                          {formData.nameBangla || '—'}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        Short Name / Ticker
                      </label>
                      {isEditMode ? (
                        <input
                          type="text"
                          value={formData.shortName || ''}
                          onChange={(e) => setFormData({ ...formData, shortName: e.target.value })}
                          className="mt-1 w-full px-3 py-1.5 text-sm border rounded-lg dark:bg-slate-800 dark:border-slate-700"
                        />
                      ) : (
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mt-0.5">
                          {formData.shortName || '—'}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        Corporate Slogan
                      </label>
                      {isEditMode ? (
                        <input
                          type="text"
                          value={formData.slogan || ''}
                          onChange={(e) => setFormData({ ...formData, slogan: e.target.value })}
                          className="mt-1 w-full px-3 py-1.5 text-sm border rounded-lg dark:bg-slate-800 dark:border-slate-700"
                        />
                      ) : (
                        <p className="text-sm italic text-slate-600 dark:text-slate-300 mt-0.5">
                          {formData.slogan ? `"${formData.slogan}"` : '—'}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      Company Overview
                    </label>
                    {isEditMode ? (
                      <textarea
                        rows={3}
                        value={formData.description || ''}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="mt-1 w-full px-3 py-1.5 text-sm border rounded-lg dark:bg-slate-800 dark:border-slate-700"
                      />
                    ) : (
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                        {formData.description || 'Enterprise organization managed on Accounticca HRMS.'}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                    <div>
                      <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        Vision
                      </label>
                      {isEditMode ? (
                        <textarea
                          rows={2}
                          value={formData.vision || ''}
                          onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
                          className="mt-1 w-full px-3 py-1.5 text-xs border rounded-lg dark:bg-slate-800 dark:border-slate-700"
                        />
                      ) : (
                        <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5">
                          {formData.vision || '—'}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        Mission
                      </label>
                      {isEditMode ? (
                        <textarea
                          rows={2}
                          value={formData.mission || ''}
                          onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
                          className="mt-1 w-full px-3 py-1.5 text-xs border rounded-lg dark:bg-slate-800 dark:border-slate-700"
                        />
                      ) : (
                        <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5">
                          {formData.mission || '—'}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      Core Values
                    </label>
                    {isEditMode ? (
                      <input
                        type="text"
                        value={formData.coreValues || ''}
                        onChange={(e) => setFormData({ ...formData, coreValues: e.target.value })}
                        placeholder="Integrity, Innovation, Compliance"
                        className="mt-1 w-full px-3 py-1.5 text-xs border rounded-lg dark:bg-slate-800 dark:border-slate-700"
                      />
                    ) : (
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {(formData.coreValues || 'Integrity, Excellence, Compliance')
                          .split(',')
                          .map((s) => s.trim())
                          .filter(Boolean)
                          .map((val, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-0.5 text-[11px] font-semibold rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                            >
                              {val}
                            </span>
                          ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Legal & Statutory Registrations */}
                <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 space-y-4">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                      <Award className="w-4 h-4 text-teal-600" />
                      <span>Statutory & RJSC Registrations</span>
                    </h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${tradeBadge.classes}`}>
                      Trade License: {tradeBadge.label} ({tradeBadge.detail})
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {[
                      { label: 'Entity Type', key: 'businessType' as const, fallback: 'Private Limited Company' },
                      { label: 'Incorporation Date', key: 'incorporationDate' as const, fallback: '2015-04-12', type: 'date' },
                      { label: 'Incorporation No.', key: 'registrationNumber' as const, fallback: 'C-122845/2015' },
                      { label: 'RJSC Reg. Number', key: 'rjscRegistrationNumber' as const, fallback: 'RJSC-DHK-09821' },
                      { label: 'Trade License No.', key: 'tradeLicenseNumber' as const, fallback: 'TR/DNCC/004321/2025' },
                      { label: 'Trade License Expiry', key: 'tradeLicenseExpiryDate' as const, fallback: '2026-06-30', type: 'date' },
                      { label: 'VAT BIN (11-digit)', key: 'binNumber' as const, fallback: '001245678-0101' },
                      { label: 'e-TIN (12-digit)', key: 'tinNumber' as const, fallback: '482910482910' },
                    ].map((item) => (
                      <div key={item.key} className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <span className="text-[10px] font-semibold uppercase text-slate-400 block">
                          {item.label}
                        </span>
                        {isEditMode ? (
                          <input
                            type={item.type || 'text'}
                            value={formData.legalInfo?.[item.key] || ''}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                legalInfo: {
                                  ...(formData.legalInfo || defaultLegal),
                                  [item.key]: e.target.value,
                                },
                              })
                            }
                            className="mt-1 w-full px-2 py-1 text-xs border rounded dark:bg-slate-800 dark:border-slate-700"
                          />
                        ) : (
                          <span className="font-mono font-semibold text-slate-900 dark:text-white mt-0.5 block">
                            {formData.legalInfo?.[item.key] || item.fallback}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Visual Brand Assets (Logo, Cover, Digital Seal) */}
              <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                  <ImageIcon className="w-4 h-4 text-purple-600" />
                  <span>Visual Brand Assets & Official Digital Seal</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { key: 'logoUrl' as const, label: 'Company Logo' },
                    { key: 'coverUrl' as const, label: 'Header Cover Banner' },
                    { key: 'sealUrl' as const, label: 'Official Digital Seal / Stamp' },
                  ].map((asset) => {
                    const currentVal = formData[asset.key];
                    return (
                      <div
                        key={asset.key}
                        className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                            {asset.label}
                          </span>
                          {currentVal && (
                            <span className="text-[10px] font-semibold text-emerald-600">Configured</span>
                          )}
                        </div>
                        <div className="h-24 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border border-dashed border-slate-300 dark:border-slate-700">
                          {currentVal ? (
                            <img
                              src={currentVal}
                              alt={asset.label}
                              className="max-h-full max-w-full object-contain"
                            />
                          ) : (
                            <span className="text-[11px] text-slate-400">No asset uploaded</span>
                          )}
                        </div>
                        {isEditMode && (
                          <div className="space-y-1.5">
                            <input
                              type="text"
                              placeholder="Paste image URL..."
                              value={currentVal || ''}
                              onChange={(e) => setFormData({ ...formData, [asset.key]: e.target.value })}
                              className="w-full px-2 py-1 text-[11px] border rounded dark:bg-slate-800 dark:border-slate-700"
                            />
                            <label className="inline-flex items-center space-x-1.5 text-[11px] font-semibold text-blue-600 dark:text-teal-400 cursor-pointer hover:underline">
                              <Upload className="w-3 h-3" />
                              <span>Upload Image File</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleBrandImageUpload(asset.key, e)}
                                className="hidden"
                              />
                            </label>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Corporate Communication Channels */}
              <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2 mb-4">
                  <Globe className="w-4 h-4 text-blue-600" />
                  <span>Corporate Communication & Digital Channels</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                  {[
                    { label: 'Corporate Info Email', key: 'corporateEmail' as const, fallback: 'info@company.com.bd' },
                    { label: 'HR Department Email', key: 'hrEmail' as const, fallback: 'hr@company.com.bd' },
                    { label: 'Accounts & Payroll Email', key: 'accountsEmail' as const, fallback: 'accounts@company.com.bd' },
                    { label: 'Support Email', key: 'supportEmail' as const, fallback: 'support@company.com.bd' },
                    { label: 'Official Website', key: 'websiteUrl' as const, fallback: 'https://company.com.bd' },
                    { label: 'Corporate WhatsApp (+880)', key: 'whatsappNumber' as const, fallback: '+880 1711-000000' },
                    { label: '24/7 Hotline', key: 'hotlineNumber' as const, fallback: '+880 9612-000000' },
                    { label: 'LinkedIn URL', key: 'linkedinUrl' as const, fallback: 'https://linkedin.com' },
                  ].map((ch) => (
                    <div
                      key={ch.key}
                      className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                    >
                      <span className="text-[10px] font-semibold uppercase text-slate-400 block">
                        {ch.label}
                      </span>
                      {isEditMode ? (
                        <input
                          type="text"
                          value={formData.contactInfo?.[ch.key] || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              contactInfo: {
                                ...(formData.contactInfo || { corporateEmail: formData.contactEmail }),
                                [ch.key]: e.target.value,
                              },
                            })
                          }
                          className="mt-1 w-full px-2 py-1 text-xs border rounded dark:bg-slate-800 dark:border-slate-700"
                        />
                      ) : (
                        <span className="font-medium text-slate-900 dark:text-slate-200 mt-0.5 block truncate">
                          {formData.contactInfo?.[ch.key] || ch.fallback}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LOCATIONS & BRANCHES */}
          {activeTab === 'locations' && (
            <div className="space-y-6">
              {/* Head Office */}
              <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-rose-500" />
                    <span>Head Office & Geospatial Coordinates</span>
                  </h3>
                  {formData.headOffice?.mapLocation && (
                    <a
                      href={formData.headOffice.mapLocation}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-semibold text-blue-600 hover:underline flex items-center space-x-1"
                    >
                      <span>Open in Google Maps</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                {isEditMode ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                    <div className="sm:col-span-2">
                      <label className="text-[10px] font-semibold uppercase text-slate-400">Address Line 1</label>
                      <input
                        type="text"
                        value={formData.headOffice?.addressLine1 || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            headOffice: { ...(formData.headOffice || defaultHeadOffice), addressLine1: e.target.value },
                          })
                        }
                        className="mt-1 w-full px-2.5 py-1.5 border rounded-lg dark:bg-slate-800 dark:border-slate-700"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-[10px] font-semibold uppercase text-slate-400">Address Line 2</label>
                      <input
                        type="text"
                        value={formData.headOffice?.addressLine2 || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            headOffice: { ...(formData.headOffice || defaultHeadOffice), addressLine2: e.target.value },
                          })
                        }
                        className="mt-1 w-full px-2.5 py-1.5 border rounded-lg dark:bg-slate-800 dark:border-slate-700"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold uppercase text-slate-400">Division</label>
                      <select
                        value={hoDiv}
                        onChange={(e) => {
                          const div = e.target.value;
                          const dist = getDistrictsForDivision(div)[0];
                          const upa = getUpazilasForDistrict(dist)[0];
                          const pc = getPostCodesForUpazila(upa)[0];
                          setFormData({
                            ...formData,
                            headOffice: {
                              ...(formData.headOffice || defaultHeadOffice),
                              division: div,
                              district: dist,
                              city: dist,
                              area: upa,
                              postalCode: pc,
                            },
                          });
                        }}
                        className="mt-1 w-full px-2.5 py-1.5 border rounded-lg dark:bg-slate-800 dark:border-slate-700"
                      >
                        {DIVISIONS.map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold uppercase text-slate-400">District</label>
                      <select
                        value={hoDist}
                        onChange={(e) => {
                          const dist = e.target.value;
                          const upa = getUpazilasForDistrict(dist)[0];
                          const pc = getPostCodesForUpazila(upa)[0];
                          setFormData({
                            ...formData,
                            headOffice: {
                              ...(formData.headOffice || defaultHeadOffice),
                              district: dist,
                              city: dist,
                              area: upa,
                              postalCode: pc,
                            },
                          });
                        }}
                        className="mt-1 w-full px-2.5 py-1.5 border rounded-lg dark:bg-slate-800 dark:border-slate-700"
                      >
                        {getDistrictsForDivision(hoDiv).map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold uppercase text-slate-400">Upazila / Area</label>
                      <select
                        value={hoUpa}
                        onChange={(e) => {
                          const upa = e.target.value;
                          const pc = getPostCodesForUpazila(upa)[0];
                          setFormData({
                            ...formData,
                            headOffice: {
                              ...(formData.headOffice || defaultHeadOffice),
                              area: upa,
                              postalCode: pc,
                            },
                          });
                        }}
                        className="mt-1 w-full px-2.5 py-1.5 border rounded-lg dark:bg-slate-800 dark:border-slate-700"
                      >
                        {getUpazilasForDistrict(hoDist).map((u) => (
                          <option key={u} value={u}>{u}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold uppercase text-slate-400">Postal Code</label>
                      <select
                        value={formData.headOffice?.postalCode || getPostCodesForUpazila(hoUpa)[0]}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            headOffice: {
                              ...(formData.headOffice || defaultHeadOffice),
                              postalCode: e.target.value,
                            },
                          })
                        }
                        className="mt-1 w-full px-2.5 py-1.5 border rounded-lg dark:bg-slate-800 dark:border-slate-700"
                      >
                        {getPostCodesForUpazila(hoUpa).map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold uppercase text-slate-400">Latitude</label>
                      <input
                        type="number"
                        step="0.0001"
                        value={formData.headOffice?.latitude ?? 23.7937}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            headOffice: { ...(formData.headOffice || defaultHeadOffice), latitude: Number(e.target.value) },
                          })
                        }
                        className="mt-1 w-full px-2.5 py-1.5 border rounded-lg dark:bg-slate-800 dark:border-slate-700"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold uppercase text-slate-400">Longitude</label>
                      <input
                        type="number"
                        step="0.0001"
                        value={formData.headOffice?.longitude ?? 90.4066}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            headOffice: { ...(formData.headOffice || defaultHeadOffice), longitude: Number(e.target.value) },
                          })
                        }
                        className="mt-1 w-full px-2.5 py-1.5 border rounded-lg dark:bg-slate-800 dark:border-slate-700"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] uppercase font-semibold text-slate-400">Street Address</span>
                      <p className="font-medium text-slate-900 dark:text-white mt-0.5">
                        {formData.headOffice?.addressLine1 || 'Road 11, Banani'}
                        {formData.headOffice?.addressLine2 ? `, ${formData.headOffice.addressLine2}` : ''}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] uppercase font-semibold text-slate-400">Division / District / Area</span>
                      <p className="font-medium text-slate-900 dark:text-white mt-0.5">
                        {hoUpa}, {hoDist}, {hoDiv} - {formData.headOffice?.postalCode || '1213'}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] uppercase font-semibold text-slate-400">Geo-Coordinates</span>
                      <p className="font-mono font-semibold text-slate-900 dark:text-white mt-0.5">
                        {formData.headOffice?.latitude || '23.7937'}° N, {formData.headOffice?.longitude || '90.4066'}° E
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Multi-Branch Network */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Regional Branches & Geofencing ({(formData.branches || []).length})
                  </h3>
                  <button
                    type="button"
                    onClick={openAddBranchModal}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Branch</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50/80 dark:bg-slate-900 text-slate-500 uppercase text-[10px]">
                      <tr>
                        <th className="px-4 py-3">Branch & Code</th>
                        <th className="px-4 py-3">Manager</th>
                        <th className="px-4 py-3">Address</th>
                        <th className="px-4 py-3">Geofence</th>
                        <th className="px-4 py-3">Contact (+880)</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      {(formData.branches || []).map((branch) => (
                        <tr key={branch.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/30">
                          <td className="px-4 py-3">
                            <p className="font-bold text-slate-900 dark:text-white">{branch.name}</p>
                            <span className="font-mono text-[10px] text-slate-500">{branch.code}</span>
                          </td>
                          <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{branch.manager}</td>
                          <td className="px-4 py-3 text-slate-600 dark:text-slate-400 max-w-xs">{branch.address}</td>
                          <td className="px-4 py-3 font-mono text-blue-600 dark:text-teal-400">
                            {branch.geofenceRadius ?? 100} m
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-slate-800 dark:text-slate-200">{branch.contactNumber}</p>
                            <p className="text-[10px] text-slate-500">{branch.email}</p>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              type="button"
                              onClick={() => handleToggleBranchStatus(branch.id)}
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer ${
                                branch.status === 'Active'
                                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                                  : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                              }`}
                            >
                              {branch.status}
                            </button>
                          </td>
                          <td className="px-4 py-3 text-right whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => openEditBranchModal(branch)}
                              className="text-blue-600 hover:text-blue-800 p-1 cursor-pointer mr-1"
                              title="Edit Branch"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleToggleBranchStatus(branch.id)}
                              className="text-amber-600 hover:text-amber-800 p-1 cursor-pointer mr-1"
                              title="Toggle Active/Inactive"
                            >
                              <Power className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteBranch(branch.id)}
                              className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                              title="Delete Branch"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {(formData.branches || []).length === 0 && (
                        <tr>
                          <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                            No regional branches configured yet. Click "Add Branch" to create one.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: FINANCE & BANKING */}
          {activeTab === 'finance' && (
            <div className="space-y-6">
              {/* Capital & Governance */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {[
                  {
                    label: 'Authorized Capital (৳)',
                    key: 'authorizedCapital' as const,
                    val: formData.businessInfo?.authorizedCapital ?? 50000000,
                    isCurrency: true,
                  },
                  {
                    label: 'Paid-up Capital (৳)',
                    key: 'paidUpCapital' as const,
                    val: formData.businessInfo?.paidUpCapital ?? 25000000,
                    isCurrency: true,
                  },
                  {
                    label: 'Directors',
                    key: 'numDirectors' as const,
                    val: formData.businessInfo?.numDirectors ?? 4,
                    isCurrency: false,
                  },
                  {
                    label: 'Shareholders',
                    key: 'numShareholders' as const,
                    val: formData.businessInfo?.numShareholders ?? 8,
                    isCurrency: false,
                  },
                  {
                    label: 'Departments',
                    key: 'numDepartments' as const,
                    val: formData.businessInfo?.numDepartments ?? 6,
                    isCurrency: false,
                  },
                ].map((stat) => (
                  <div
                    key={stat.key}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30"
                  >
                    <span className="text-[10px] font-semibold uppercase text-slate-400">{stat.label}</span>
                    {isEditMode ? (
                      <input
                        type="number"
                        value={stat.val}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            businessInfo: {
                              ...(formData.businessInfo || {
                                industryType: formData.industry,
                                businessNature: 'Corporate Services',
                                authorizedCapital: 50000000,
                                paidUpCapital: 25000000,
                                numDirectors: 4,
                                numShareholders: 8,
                                numDepartments: 6,
                              }),
                              [stat.key]: Number(e.target.value),
                            },
                          })
                        }
                        className="mt-1 w-full px-2 py-1 text-sm font-bold border rounded dark:bg-slate-800 dark:border-slate-700"
                      />
                    ) : (
                      <p className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">
                        {stat.isCurrency ? `৳ ${stat.val.toLocaleString('en-BD')}` : stat.val}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Corporate Bank Accounts */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                    <CreditCard className="w-4 h-4 text-emerald-600" />
                    <span>Corporate Disbursement Bank Accounts (BDT ৳)</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowAddBank(true)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Bank Account</span>
                  </button>
                </div>

                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(formData.bankAccounts || []).map((bank) => (
                    <div
                      key={bank.id}
                      className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 flex flex-col justify-between space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white">{bank.bankName}</h4>
                            {bank.isPrimary && (
                              <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 rounded-full">
                                Primary
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500">{bank.branchName}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {!bank.isPrimary && (
                            <button
                              type="button"
                              onClick={() => handleSetPrimaryBank(bank.id)}
                              className="text-[11px] font-semibold text-blue-600 hover:underline cursor-pointer"
                            >
                              Set Primary
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDeleteBank(bank.id)}
                            className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
                        <div>
                          <span className="text-[10px] text-slate-400 block">A/C Number</span>
                          <span className="font-mono font-bold text-slate-900 dark:text-white">{bank.accountNumber}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">Routing</span>
                          <span className="font-mono text-slate-700 dark:text-slate-300">{bank.routingNumber}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">SWIFT</span>
                          <span className="font-mono text-slate-700 dark:text-slate-300">{bank.swiftCode || '—'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* NBR Tax/VAT & Payroll SOPs */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 space-y-3">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    NBR Tax & VAT Jurisdiction Profile
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    {[
                      { label: 'Tax Zone', key: 'taxZone' as const, fallback: 'Tax Zone 15, Dhaka' },
                      { label: 'Tax Circle', key: 'taxCircle' as const, fallback: 'Circle 312 (Company)' },
                      { label: 'VAT Circle', key: 'vatCircle' as const, fallback: 'Circle 4, Banani' },
                      { label: 'VAT Commissionerate', key: 'vatCommissionerate' as const, fallback: 'Dhaka North' },
                      { label: 'Tax Representative', key: 'authorizedTaxRepresentative' as const, fallback: 'Chief Financial Officer' },
                      { label: 'Tax Consultant', key: 'taxConsultantInfo' as const, fallback: 'M/S Haque & Associates' },
                    ].map((t) => (
                      <div key={t.key} className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <span className="text-[10px] text-slate-400 block">{t.label}</span>
                        {isEditMode ? (
                          <input
                            type="text"
                            value={formData.taxVat?.[t.key] || ''}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                taxVat: {
                                  ...(formData.taxVat || {
                                    taxZone: '',
                                    taxCircle: '',
                                    vatCircle: '',
                                    vatCommissionerate: '',
                                    authorizedTaxRepresentative: '',
                                    taxConsultantInfo: '',
                                  }),
                                  [t.key]: e.target.value,
                                },
                              })
                            }
                            className="mt-1 w-full px-2 py-1 text-xs border rounded dark:bg-slate-800 dark:border-slate-700"
                          />
                        ) : (
                          <span className="font-semibold text-slate-900 dark:text-white">
                            {formData.taxVat?.[t.key] || t.fallback}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 space-y-3">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Payroll Calendar & Festival Bonus Rules (BDT ৳)
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Salary Payment Date</span>
                      {isEditMode ? (
                        <input
                          type="number"
                          min={1}
                          max={28}
                          value={formData.payrollSettings?.salaryPaymentDate ?? 5}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              payrollSettings: {
                                ...(formData.payrollSettings || defaultPayroll),
                                salaryPaymentDate: Number(e.target.value),
                              },
                            })
                          }
                          className="mt-1 w-full px-2 py-1 text-xs border rounded dark:bg-slate-800 dark:border-slate-700"
                        />
                      ) : (
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {formData.payrollSettings?.salaryPaymentDate ?? 5}th of Month
                        </span>
                      )}
                    </div>
                    <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Month Closing Date</span>
                      {isEditMode ? (
                        <input
                          type="number"
                          min={1}
                          max={31}
                          value={formData.payrollSettings?.payrollMonthClosingDate ?? 25}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              payrollSettings: {
                                ...(formData.payrollSettings || defaultPayroll),
                                payrollMonthClosingDate: Number(e.target.value),
                              },
                            })
                          }
                          className="mt-1 w-full px-2 py-1 text-xs border rounded dark:bg-slate-800 dark:border-slate-700"
                        />
                      ) : (
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {formData.payrollSettings?.payrollMonthClosingDate ?? 25}th of Month
                        </span>
                      )}
                    </div>
                    {[
                      { label: 'Overtime Policy', key: 'overtimePolicy' as const, fallback: '2x Basic Hourly Rate' },
                      { label: 'Eid Bonus Policy', key: 'eidBonusPolicy' as const, fallback: '100% Basic Salary' },
                      { label: 'Festival / Boishakhi', key: 'festivalBonusPolicy' as const, fallback: '20% Boishakhi Allowance' },
                      { label: 'Tax Deduction SOP', key: 'taxDeductionPolicy' as const, fallback: 'NBR Monthly AIT Slab' },
                    ].map((p) => (
                      <div key={p.key} className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <span className="text-[10px] text-slate-400 block">{p.label}</span>
                        {isEditMode ? (
                          <input
                            type="text"
                            value={formData.payrollSettings?.[p.key] || ''}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                payrollSettings: {
                                  ...(formData.payrollSettings || defaultPayroll),
                                  [p.key]: e.target.value,
                                },
                              })
                            }
                            className="mt-1 w-full px-2 py-1 text-xs border rounded dark:bg-slate-800 dark:border-slate-700"
                          />
                        ) : (
                          <span className="font-semibold text-slate-900 dark:text-white">
                            {formData.payrollSettings?.[p.key] || p.fallback}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: COMPLIANCE & POLICIES */}
          {activeTab === 'compliance' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span>Operating Schedule & Ramadan Special Hours</span>
                </h3>

                <div>
                  <span className="text-[11px] font-semibold uppercase text-slate-400 block mb-2">
                    Working Days
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {ALL_DAYS.map((day) => {
                      const activeDays = formData.compliance?.workingDays || ['Sun', 'Mon', 'Tue', 'Wed', 'Thu'];
                      const isWorking = activeDays.includes(day);
                      return (
                        <button
                          key={day}
                          type="button"
                          disabled={!isEditMode}
                          onClick={() => {
                            const nextDays = isWorking
                              ? activeDays.filter((d) => d !== day)
                              : [...activeDays, day];
                            setFormData({
                              ...formData,
                              compliance: {
                                ...(formData.compliance || defaultCompliance),
                                workingDays: nextDays,
                              },
                            });
                          }}
                          className={`px-3 py-1 rounded-lg text-xs font-bold border transition-colors ${
                            isWorking
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white dark:bg-slate-900 text-slate-400 border-slate-200 dark:border-slate-700'
                          } ${isEditMode ? 'cursor-pointer' : 'cursor-default'}`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
                  <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Standard Start / End</span>
                    {isEditMode ? (
                      <div className="flex items-center space-x-1 mt-1">
                        <input
                          type="text"
                          value={formData.compliance?.startTime || '09:00 AM'}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              compliance: { ...(formData.compliance || defaultCompliance), startTime: e.target.value },
                            })
                          }
                          className="w-1/2 px-2 py-1 text-xs border rounded dark:bg-slate-800 dark:border-slate-700"
                        />
                        <input
                          type="text"
                          value={formData.compliance?.endTime || '06:00 PM'}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              compliance: { ...(formData.compliance || defaultCompliance), endTime: e.target.value },
                            })
                          }
                          className="w-1/2 px-2 py-1 text-xs border rounded dark:bg-slate-800 dark:border-slate-700"
                        />
                      </div>
                    ) : (
                      <span className="font-bold text-slate-900 dark:text-white">
                        {formData.compliance?.startTime || '09:00 AM'} – {formData.compliance?.endTime || '06:00 PM'}
                      </span>
                    )}
                  </div>
                  <div className="p-3 rounded-lg bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900">
                    <span className="text-[10px] text-amber-700 dark:text-amber-400 block">Ramadan Special Hours</span>
                    {isEditMode ? (
                      <div className="flex items-center space-x-1 mt-1">
                        <input
                          type="text"
                          value={formData.compliance?.ramadanStartTime || '09:00 AM'}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              compliance: { ...(formData.compliance || defaultCompliance), ramadanStartTime: e.target.value },
                            })
                          }
                          className="w-1/2 px-2 py-1 text-xs border rounded dark:bg-slate-800 dark:border-slate-700"
                        />
                        <input
                          type="text"
                          value={formData.compliance?.ramadanEndTime || '03:30 PM'}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              compliance: { ...(formData.compliance || defaultCompliance), ramadanEndTime: e.target.value },
                            })
                          }
                          className="w-1/2 px-2 py-1 text-xs border rounded dark:bg-slate-800 dark:border-slate-700"
                        />
                      </div>
                    ) : (
                      <span className="font-bold text-amber-900 dark:text-amber-300">
                        {formData.compliance?.ramadanStartTime || '09:00 AM'} – {formData.compliance?.ramadanEndTime || '03:30 PM'}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Policy Manuals */}
              <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 space-y-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                  <Layers className="w-4 h-4 text-teal-600" />
                  <span>Corporate Policy Manuals (Bangladesh Labor Act Compliant)</span>
                </h3>
                <div className="space-y-2 text-xs">
                  {[
                    { label: 'Employee Handbook', key: 'employeeHandbookUrl' as const },
                    { label: 'HR & Recruitment Policy', key: 'hrPolicyUrl' as const },
                    { label: 'Code of Conduct & Ethics', key: 'codeOfConductUrl' as const },
                    { label: 'Leave & Attendance Policy', key: 'leavePolicyUrl' as const },
                  ].map((pol) => {
                    const urlVal = formData.compliance?.[pol.key] || '#';
                    return (
                      <div
                        key={pol.key}
                        className="flex items-center justify-between gap-3 p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                      >
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{pol.label}</span>
                        {isEditMode ? (
                          <input
                            type="text"
                            value={urlVal}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                compliance: {
                                  ...(formData.compliance || defaultCompliance),
                                  [pol.key]: e.target.value,
                                },
                              })
                            }
                            className="w-48 px-2 py-1 text-xs border rounded dark:bg-slate-800 dark:border-slate-700"
                          />
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 text-[10px] font-bold">
                            Active
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: DOCUMENT VAULT */}
          {activeTab === 'vault' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-1.5">
                  {DOC_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setVaultFilter(cat)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                        vaultFilter === cat
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddDoc(true)}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Document</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDocs.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 flex flex-col justify-between space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start space-x-3">
                        <div className="p-2.5 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white break-words">
                            {doc.name}
                          </h4>
                          <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded">
                            {doc.type}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteDocument(doc.id)}
                        className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                        title="Delete Document"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200 dark:border-slate-800">
                      <span>
                        {doc.uploadDate} • {doc.size}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDownloadDocument(doc)}
                        className="text-blue-600 dark:text-teal-400 font-semibold flex items-center space-x-1 hover:underline cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                ))}
                {filteredDocs.length === 0 && (
                  <div className="col-span-full py-10 text-center text-xs text-slate-400 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl">
                    No documents found in "{vaultFilter}" category.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 6: ORG ANALYTICS (LIVE APPCONTEXT) */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-blue-50/40 dark:bg-blue-950/20">
                  <span className="text-[11px] font-semibold uppercase text-blue-600 dark:text-blue-400">
                    Active Workforce
                  </span>
                  <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                    {liveAnalytics.activeEmployees}
                  </p>
                  <span className="text-[11px] text-slate-500">
                    Total Roster: {liveAnalytics.totalEmployees}
                  </span>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-emerald-50/40 dark:bg-emerald-950/20">
                  <span className="text-[11px] font-semibold uppercase text-emerald-600 dark:text-emerald-400">
                    Monthly Payroll (৳)
                  </span>
                  <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                    ৳ {liveAnalytics.monthlyPayrollBdt.toLocaleString('en-BD')}
                  </p>
                  <span className="text-[11px] text-slate-500">Computed from live records</span>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-purple-50/40 dark:bg-purple-950/20">
                  <span className="text-[11px] font-semibold uppercase text-purple-600 dark:text-purple-400">
                    Open Requisitions
                  </span>
                  <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                    {liveAnalytics.openPositions}
                  </p>
                  <span className="text-[11px] text-slate-500">
                    Pipeline: {liveAnalytics.pipelineCandidates} applicants
                  </span>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-amber-50/40 dark:bg-amber-950/20">
                  <span className="text-[11px] font-semibold uppercase text-amber-600 dark:text-amber-400">
                    Corporate Assets
                  </span>
                  <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                    {formData.assetsSummary?.total ?? 0}
                  </p>
                  <span className="text-[11px] text-slate-500">
                    Assigned: {formData.assetsSummary?.assigned ?? 0} • Available: {formData.assetsSummary?.available ?? 0}
                  </span>
                </div>
              </div>

              <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 space-y-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Live Department Distribution
                </h3>
                {liveAnalytics.departments.length > 0 ? (
                  <div className="space-y-2.5">
                    {liveAnalytics.departments.map((d) => {
                      const pct = Math.round((d.count / Math.max(1, liveAnalytics.totalEmployees)) * 100);
                      return (
                        <div key={d.name} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="font-semibold text-slate-700 dark:text-slate-300">{d.name}</span>
                            <span className="font-mono text-slate-500">
                              {d.count} ({pct}%)
                            </span>
                          </div>
                          <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-600 to-teal-500 rounded-full"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">
                    No department roster records linked to this tenant yet.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* TAB 7: SECURITY & AUDIT LOGS */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 space-y-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-rose-500" />
                  <span>Tenant Security & RBAC Governance Controls</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { key: 'superAdminAccess' as const, label: 'Super Admin Oversight Access' },
                    { key: 'hrManagerAccess' as const, label: 'HR Manager Full Write Access' },
                    { key: 'directorReadOnlyAccess' as const, label: 'Director Read-Only Board View' },
                  ].map((item) => {
                    const enabled = Boolean(formData.securitySettings?.[item.key]);
                    return (
                      <div
                        key={item.key}
                        className="p-3.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                      >
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                          {item.label}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleToggleSecurity(item.key)}
                          className={`w-11 h-6 rounded-full transition-colors p-0.5 cursor-pointer ${
                            enabled ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                              enabled ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="px-5 py-3 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Company Audit Trail ({(formData.auditLogs || []).length})
                  </h3>
                </div>
                <div className="overflow-x-auto max-h-72">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-900 text-[10px] uppercase text-slate-500">
                      <tr>
                        <th className="px-4 py-2.5">Timestamp</th>
                        <th className="px-4 py-2.5">Modified By</th>
                        <th className="px-4 py-2.5">Action</th>
                        <th className="px-4 py-2.5">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      {(formData.auditLogs || []).map((log) => (
                        <tr key={log.id}>
                          <td className="px-4 py-2.5 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                            {log.timestamp}
                          </td>
                          <td className="px-4 py-2.5 font-semibold text-slate-800 dark:text-slate-200">
                            {log.modifiedBy}
                          </td>
                          <td className="px-4 py-2.5 font-medium text-blue-600 dark:text-teal-400">
                            {log.action}
                          </td>
                          <td className="px-4 py-2.5 text-slate-600 dark:text-slate-400">{log.details}</td>
                        </tr>
                      ))}
                      {(formData.auditLogs || []).length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-4 py-6 text-center text-slate-400">
                            No company-level audit entries yet. Mutations will be logged automatically.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 shrink-0">
          <span>
            Google Workspace Master Account:{' '}
            <strong className="text-slate-700 dark:text-slate-300">
              {PERMANENT_GOOGLE_ACCOUNT.email}
            </strong>
          </span>
          <div className="flex items-center space-x-2">
            {isEditMode && (
              <button
                type="button"
                onClick={handleSaveChanges}
                className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold cursor-pointer"
              >
                Save All Changes
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg font-semibold cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* SUB-MODAL: ADD / EDIT BRANCH WITH BANGLADESH GEO CASCADING */}
      {showBranchModal && (
        <div className="fixed inset-0 z-[60] bg-slate-950/70 flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveBranch}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                {editingBranchId ? 'Edit Branch Office' : 'Add Regional Branch'}
              </h4>
              <button type="button" onClick={() => setShowBranchModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-semibold text-slate-600 dark:text-slate-300">Branch Name *</label>
                <input
                  required
                  type="text"
                  value={branchForm.name}
                  onChange={(e) => setBranchForm({ ...branchForm, name: e.target.value })}
                  placeholder="Chattogram Regional Office"
                  className="mt-1 w-full px-3 py-1.5 border rounded-lg dark:bg-slate-800 dark:border-slate-700"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-600 dark:text-slate-300">Branch Code</label>
                <input
                  type="text"
                  value={branchForm.code}
                  onChange={(e) => setBranchForm({ ...branchForm, code: e.target.value })}
                  placeholder="CTG-01"
                  className="mt-1 w-full px-3 py-1.5 border rounded-lg dark:bg-slate-800 dark:border-slate-700"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-600 dark:text-slate-300">Branch Manager</label>
                <input
                  type="text"
                  value={branchForm.manager}
                  onChange={(e) => setBranchForm({ ...branchForm, manager: e.target.value })}
                  placeholder="Tariqul Islam"
                  className="mt-1 w-full px-3 py-1.5 border rounded-lg dark:bg-slate-800 dark:border-slate-700"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-600 dark:text-slate-300">Geofence Radius (m)</label>
                <input
                  type="number"
                  value={branchForm.geofenceRadius}
                  onChange={(e) => setBranchForm({ ...branchForm, geofenceRadius: Number(e.target.value) })}
                  className="mt-1 w-full px-3 py-1.5 border rounded-lg dark:bg-slate-800 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-600 dark:text-slate-300">Division</label>
                <select
                  value={branchForm.division}
                  onChange={(e) => {
                    const div = e.target.value;
                    const dist = getDistrictsForDivision(div)[0];
                    const upa = getUpazilasForDistrict(dist)[0];
                    const pc = getPostCodesForUpazila(upa)[0];
                    setBranchForm({ ...branchForm, division: div, district: dist, upazila: upa, postCode: pc });
                  }}
                  className="mt-1 w-full px-3 py-1.5 border rounded-lg dark:bg-slate-800 dark:border-slate-700"
                >
                  {DIVISIONS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-semibold text-slate-600 dark:text-slate-300">District</label>
                <select
                  value={branchForm.district}
                  onChange={(e) => {
                    const dist = e.target.value;
                    const upa = getUpazilasForDistrict(dist)[0];
                    const pc = getPostCodesForUpazila(upa)[0];
                    setBranchForm({ ...branchForm, district: dist, upazila: upa, postCode: pc });
                  }}
                  className="mt-1 w-full px-3 py-1.5 border rounded-lg dark:bg-slate-800 dark:border-slate-700"
                >
                  {brDistricts.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-semibold text-slate-600 dark:text-slate-300">Upazila / Area</label>
                <select
                  value={branchForm.upazila}
                  onChange={(e) => {
                    const upa = e.target.value;
                    const pc = getPostCodesForUpazila(upa)[0];
                    setBranchForm({ ...branchForm, upazila: upa, postCode: pc });
                  }}
                  className="mt-1 w-full px-3 py-1.5 border rounded-lg dark:bg-slate-800 dark:border-slate-700"
                >
                  {brUpazilas.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-semibold text-slate-600 dark:text-slate-300">Post Code</label>
                <select
                  value={branchForm.postCode}
                  onChange={(e) => setBranchForm({ ...branchForm, postCode: e.target.value })}
                  className="mt-1 w-full px-3 py-1.5 border rounded-lg dark:bg-slate-800 dark:border-slate-700"
                >
                  {brPostCodes.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="font-semibold text-slate-600 dark:text-slate-300">Street / Holding</label>
                <input
                  type="text"
                  value={branchForm.street}
                  onChange={(e) => setBranchForm({ ...branchForm, street: e.target.value })}
                  placeholder="House 42, Road 3"
                  className="mt-1 w-full px-3 py-1.5 border rounded-lg dark:bg-slate-800 dark:border-slate-700"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-600 dark:text-slate-300">Phone (+880)</label>
                <input
                  type="text"
                  value={branchForm.contactNumber}
                  onChange={(e) => setBranchForm({ ...branchForm, contactNumber: e.target.value })}
                  className="mt-1 w-full px-3 py-1.5 border rounded-lg dark:bg-slate-800 dark:border-slate-700"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-600 dark:text-slate-300">Email</label>
                <input
                  type="email"
                  value={branchForm.email}
                  onChange={(e) => setBranchForm({ ...branchForm, email: e.target.value })}
                  className="mt-1 w-full px-3 py-1.5 border rounded-lg dark:bg-slate-800 dark:border-slate-700"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowBranchModal(false)}
                className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
              >
                {editingBranchId ? 'Update Branch' : 'Create Branch'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SUB-MODAL: ADD BANK ACCOUNT */}
      {showAddBank && (
        <div className="fixed inset-0 z-[60] bg-slate-950/70 flex items-center justify-center p-4">
          <form
            onSubmit={handleAddBank}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md p-6 space-y-4 shadow-2xl text-xs"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-base font-bold text-slate-900 dark:text-white">Add Corporate Bank Account</h4>
              <button type="button" onClick={() => setShowAddBank(false)} className="text-slate-400 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="font-semibold">Bank Name *</label>
                <input
                  required
                  type="text"
                  value={newBank.bankName || ''}
                  onChange={(e) => setNewBank({ ...newBank, bankName: e.target.value })}
                  className="mt-1 w-full px-3 py-1.5 border rounded-lg dark:bg-slate-800 dark:border-slate-700"
                />
              </div>
              <div>
                <label className="font-semibold">Branch Name</label>
                <input
                  type="text"
                  value={newBank.branchName || ''}
                  onChange={(e) => setNewBank({ ...newBank, branchName: e.target.value })}
                  className="mt-1 w-full px-3 py-1.5 border rounded-lg dark:bg-slate-800 dark:border-slate-700"
                />
              </div>
              <div>
                <label className="font-semibold">Account Number (13–17 digits) *</label>
                <input
                  required
                  type="text"
                  value={newBank.accountNumber || ''}
                  onChange={(e) => setNewBank({ ...newBank, accountNumber: e.target.value })}
                  placeholder="0141120094958"
                  className="mt-1 w-full px-3 py-1.5 border rounded-lg dark:bg-slate-800 dark:border-slate-700 font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold">Routing Number</label>
                  <input
                    type="text"
                    value={newBank.routingNumber || ''}
                    onChange={(e) => setNewBank({ ...newBank, routingNumber: e.target.value })}
                    className="mt-1 w-full px-3 py-1.5 border rounded-lg dark:bg-slate-800 dark:border-slate-700 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold">SWIFT Code</label>
                  <input
                    type="text"
                    value={newBank.swiftCode || ''}
                    onChange={(e) => setNewBank({ ...newBank, swiftCode: e.target.value })}
                    className="mt-1 w-full px-3 py-1.5 border rounded-lg dark:bg-slate-800 dark:border-slate-700 font-mono"
                  />
                </div>
              </div>
              <label className="flex items-center space-x-2 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(newBank.isPrimary)}
                  onChange={(e) => setNewBank({ ...newBank, isPrimary: e.target.checked })}
                />
                <span className="font-semibold">Set as Primary Salary Disbursement Account</span>
              </label>
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddBank(false)}
                className="px-4 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold cursor-pointer"
              >
                Save Account
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SUB-MODAL: UPLOAD DOCUMENT */}
      {showAddDoc && (
        <div className="fixed inset-0 z-[60] bg-slate-950/70 flex items-center justify-center p-4">
          <form
            onSubmit={handleAddDocument}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md p-6 space-y-4 shadow-2xl text-xs"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-base font-bold text-slate-900 dark:text-white">Upload to Document Vault</h4>
              <button type="button" onClick={() => setShowAddDoc(false)} className="text-slate-400 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="font-semibold">Select File (PDF, PNG, DOCX)</label>
                <input
                  type="file"
                  onChange={handleVaultFileSelect}
                  className="mt-1 w-full text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 file:font-semibold"
                />
              </div>
              <div>
                <label className="font-semibold">Document Title *</label>
                <input
                  required
                  type="text"
                  value={newDoc.name}
                  onChange={(e) => setNewDoc({ ...newDoc, name: e.target.value })}
                  placeholder="Trade_License_2026.pdf"
                  className="mt-1 w-full px-3 py-1.5 border rounded-lg dark:bg-slate-800 dark:border-slate-700"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold">Category</label>
                  <select
                    value={newDoc.type}
                    onChange={(e) => setNewDoc({ ...newDoc, type: e.target.value })}
                    className="mt-1 w-full px-3 py-1.5 border rounded-lg dark:bg-slate-800 dark:border-slate-700"
                  >
                    {DOC_CATEGORIES.filter((c) => c !== 'All').map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold">File Size</label>
                  <input
                    type="text"
                    value={newDoc.size}
                    onChange={(e) => setNewDoc({ ...newDoc, size: e.target.value })}
                    className="mt-1 w-full px-3 py-1.5 border rounded-lg dark:bg-slate-800 dark:border-slate-700"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddDoc(false)}
                className="px-4 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold cursor-pointer"
              >
                Add to Vault
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
