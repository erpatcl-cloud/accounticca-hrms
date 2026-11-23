import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Organization } from '../../types';
import { CompanyProfileModal } from './CompanyProfileModal';
import {
  DIVISIONS,
  getDistrictsForDivision,
  getUpazilasForDistrict,
  getPostCodesForUpazila,
} from '../../utils/bangladeshGeo';
import {
  Building2,
  Plus,
  Search,
  Users,
  ShieldCheck,
  FileSpreadsheet,
  FolderOpen,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Mail,
  Phone,
  Globe,
  Briefcase,
  Layers,
  Sparkles,
  LogIn,
  SlidersHorizontal,
  Eye,
  EyeOff,
  KeyRound,
} from 'lucide-react';

export const CompaniesManager: React.FC = () => {
  const {
    organizations,
    addOrganization,
    updateOrganization,
    deleteOrganization,
    availableUsers,
    setCurrentUser,
    setActivePortalTab,
    employees,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [industryFilter, setIndustryFilter] = useState('All');
  const [packageFilter, setPackageFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedOrgForDetails, setSelectedOrgForDetails] = useState<Organization | null>(null);
  const [selectedOrgForProfile, setSelectedOrgForProfile] = useState<Organization | null>(null);

  // New Organization Form State
  const [name, setName] = useState('');
  const [nameBangla, setNameBangla] = useState('');
  const [shortName, setShortName] = useState('');
  const [industry, setIndustry] = useState('IT & Software');
  const [size, setSize] = useState('50-100 Employees');
  const [country, setCountry] = useState('Bangladesh');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [activePackage, setActivePackage] = useState<'Startup HR' | 'SME HR' | 'Corporate HR' | 'Managed HR'>('Corporate HR');
  const [assignedConsultantName, setAssignedConsultantName] = useState('Farzana Chowdhury');

  // Statutory & Head Office Form State
  const [businessType, setBusinessType] = useState('Private Limited Company');
  const [rjscNumber, setRjscNumber] = useState('');
  const [tradeLicenseNumber, setTradeLicenseNumber] = useState('');
  const [binNumber, setBinNumber] = useState('');
  const [tinNumber, setTinNumber] = useState('');
  const [division, setDivision] = useState('Dhaka');
  const [district, setDistrict] = useState('Dhaka');
  const [upazila, setUpazila] = useState('Banani');
  const [postalCode, setPostalCode] = useState('1213');
  const [addressLine1, setAddressLine1] = useState('');

  // Client Admin Provisioning Form State
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPhone, setAdminPhone] = useState('');
  const [adminDesignation, setAdminDesignation] = useState('VP of People & Operations');
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [autoProvisionGoogleSheet, setAutoProvisionGoogleSheet] = useState(true);

  // Filtering
  const filteredOrganizations = organizations.filter((org) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      org.name.toLowerCase().includes(q) ||
      org.industry.toLowerCase().includes(q) ||
      org.country.toLowerCase().includes(q) ||
      org.contactEmail.toLowerCase().includes(q);
    const matchesIndustry = industryFilter === 'All' || org.industry === industryFilter;
    const matchesPackage = packageFilter === 'All' || org.activePackage === packageFilter;
    const matchesStatus = statusFilter === 'All' || org.status === statusFilter;
    return matchesSearch && matchesIndustry && matchesPackage && matchesStatus;
  });

  const industries = ['All', 'IT & Software', 'Manufacturing', 'Finance & Banking', 'Healthcare', 'Logistics', 'Retail', 'Education'];
  const packages: ('All' | 'Startup HR' | 'SME HR' | 'Corporate HR' | 'Managed HR')[] = ['All', 'Startup HR', 'SME HR', 'Corporate HR', 'Managed HR'];

  const totalHeadcount = employees.length;
  const activeTenants = organizations.filter((o) => o.status === 'active').length;
  const corporateTenants = organizations.filter((o) => o.activePackage === 'Corporate HR' || o.activePackage === 'Managed HR').length;

  const handleCreateCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contactEmail.trim() || !adminEmail.trim()) {
      alert('Please fill in Company Name, Contact Email, and Client Admin Email.');
      return;
    }

    addOrganization(
      {
        name: name.trim(),
        nameBangla: nameBangla.trim() || undefined,
        shortName: shortName.trim() || name.trim().slice(0, 4).toUpperCase(),
        industry,
        size,
        country,
        contactEmail: contactEmail.trim(),
        contactPhone: contactPhone.trim() || '+880 1335-230170',
        assignedConsultantId: 'usr_consultant',
        assignedConsultantName,
        activePackage,
        activeServices: ['HR Audit', 'Payroll Outsourcing', 'Recruitment ATS', 'Google Workspace Hub'],
        legalInfo: {
          businessType,
          incorporationDate: new Date().toISOString().split('T')[0],
          registrationNumber: rjscNumber.trim() || `C-${Math.floor(100000 + Math.random() * 899999)}/2026`,
          tradeLicenseNumber: tradeLicenseNumber.trim() || 'TR/DNCC/PENDING',
          tradeLicenseExpiryDate: `${new Date().getFullYear() + 1}-06-30`,
          binNumber: binNumber.trim() || '000000000-0101',
          tinNumber: tinNumber.trim() || '000000000000',
          rjscRegistrationNumber: rjscNumber.trim() || 'RJSC-DHK-NEW',
        },
        contactInfo: {
          corporateEmail: contactEmail.trim(),
          hrEmail: contactEmail.trim(),
          whatsappNumber: contactPhone.trim() || '+880 1335-230170',
        },
        headOffice: {
          name: `${name.trim()} Head Office`,
          addressLine1: addressLine1.trim() || `${upazila}, ${district}`,
          area: upazila,
          city: district,
          district,
          division,
          postalCode,
          country,
        },
        compliance: {
          weeklyHoliday: 'Friday & Saturday',
          workingDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu'],
          startTime: '09:00 AM',
          endTime: '06:00 PM',
          ramadanStartTime: '09:00 AM',
          ramadanEndTime: '03:30 PM',
        },
        payrollSettings: {
          salaryPaymentDate: 5,
          payrollMonthClosingDate: 25,
          overtimePolicy: '2x Basic Hourly Rate',
          bonusPolicy: 'Annual Performance Bonus',
          eidBonusPolicy: '100% Basic Salary (Eid-ul-Fitr & Eid-ul-Adha)',
          festivalBonusPolicy: '20% Boishakhi Allowance',
          incrementPolicy: 'Annual Appraisal',
          taxDeductionPolicy: 'NBR Monthly AIT Slab Deduction',
        },
        securitySettings: {
          superAdminAccess: true,
          hrManagerAccess: true,
          directorReadOnlyAccess: true,
        },
        auditLogs: [
          {
            id: `caud_${Date.now()}`,
            timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
            modifiedBy: 'Super Admin',
            action: 'PROVISIONED_TENANT',
            details: `Provisioned ${name.trim()} (${country}) with Client Admin ${adminEmail.trim()}`,
          },
        ],
      },
      {
        name: adminName.trim() || `${name.trim()} Admin`,
        email: adminEmail.trim(),
        phone: adminPhone.trim() || contactPhone.trim(),
        designation: adminDesignation.trim(),
        password: adminPassword.trim() || undefined,
      }
    );

    // Reset Form
    setName('');
    setNameBangla('');
    setShortName('');
    setRjscNumber('');
    setTradeLicenseNumber('');
    setBinNumber('');
    setTinNumber('');
    setAddressLine1('');
    setContactEmail('');
    setContactPhone('');
    setAdminName('');
    setAdminEmail('');
    setAdminPassword('');
    setShowAdminPassword(false);
    setAdminPhone('');
    setCreateModalOpen(false);
  };

  const handleSwitchToClientAdmin = (org: Organization) => {
    // Find client admin associated with this org
    const clientAdmin = availableUsers.find(
      (u) => u.role === 'client_admin' && (u.organizationId === org.id || u.organizationName === org.name)
    );

    if (clientAdmin) {
      setCurrentUser(clientAdmin);
      setActivePortalTab('overview');
    } else {
      // Create ad-hoc client admin session
      const tempUser = {
        id: 'usr_temp_' + org.id,
        name: `${org.name} Admin`,
        email: org.contactEmail,
        role: 'client_admin' as const,
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
        organizationId: org.id,
        organizationName: org.name,
        designation: 'Client HR Administrator',
        phone: org.contactPhone,
      };
      setCurrentUser(tempUser);
      setActivePortalTab('overview');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 p-6 md:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold uppercase tracking-wider">
              <Building2 className="w-3.5 h-3.5 text-blue-400" />
              Super Admin Multi-Tenant Governance
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Client Companies & Portal Tenants
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Create and manage client organizations, provision dedicated Client Admin accounts, and supervise isolated multi-tenant workspaces with automated Google Sheets synchronization.
            </p>
          </div>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02] cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Provision New Client Company
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Client Companies</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">{organizations.length}</span>
            <span className="text-xs text-emerald-600 font-semibold">{activeTenants} Active</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Multi-tenant client accounts</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Enterprise & Corporate Tiers</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">{corporateTenants}</span>
            <span className="text-xs text-purple-600 font-semibold">SLA Backed</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Full HRMS & Payroll Retainers</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Client Admins Provisioned</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {availableUsers.filter((u) => u.role === 'client_admin').length}
            </span>
            <span className="text-xs text-emerald-600 font-semibold">100% Isolated</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Tenant-scoped access keys</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Managed Workforce</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">{totalHeadcount}</span>
            <span className="text-xs text-slate-500">Employees in DB</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Live payroll & attendance records</p>
        </div>
      </div>

      {/* Control Filter Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search companies, countries, contacts..."
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <select
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {industries.map((ind) => (
                <option key={ind} value={ind}>Industry: {ind}</option>
              ))}
            </select>

            <select
              value={packageFilter}
              onChange={(e) => setPackageFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {packages.map((pkg) => (
                <option key={pkg} value={pkg}>Package: {pkg}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">Status: All</option>
              <option value="active">Active</option>
              <option value="onboarding">Onboarding</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* Companies Master Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Company & Location</th>
                <th className="py-3.5 px-4">Industry & Size</th>
                <th className="py-3.5 px-4">Active Package</th>
                <th className="py-3.5 px-4">Client Admin Account</th>
                <th className="py-3.5 px-4">Google Sheet & Drive</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-200 font-medium">
              {filteredOrganizations.map((org) => {
                const orgAdmin = availableUsers.find(
                  (u) => u.role === 'client_admin' && (u.organizationId === org.id || u.organizationName === org.name)
                );
                const orgEmpCount = employees.filter((e) => e.organizationId === org.id).length;

                return (
                  <tr key={org.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          onClick={() => setSelectedOrgForProfile(org)}
                          className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-black flex items-center justify-center text-sm border border-blue-200 dark:border-blue-800 cursor-pointer hover:ring-2 hover:ring-blue-400 transition"
                          title="Open Company Profile"
                        >
                          {org.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div
                            onClick={() => setSelectedOrgForProfile(org)}
                            className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5 cursor-pointer hover:text-blue-600 dark:hover:text-teal-400 transition"
                          >
                            <span>{org.name}</span>
                            {org.nameBangla && (
                              <span className="text-[11px] font-normal text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 px-1.5 py-0.2 rounded border border-teal-200 dark:border-teal-900">
                                {org.nameBangla}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                            <Globe className="w-3 h-3 text-slate-400" />
                            {org.country} &bull; Joined {org.joinedDate}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 dark:text-slate-100">{org.industry}</div>
                      <div className="text-[11px] text-slate-500">{org.size} ({orgEmpCount} in portal)</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold ${
                        org.activePackage === 'Managed HR'
                          ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                          : org.activePackage === 'Corporate HR'
                          ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                          : org.activePackage === 'SME HR'
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}>
                        <Sparkles className="w-3 h-3" />
                        {org.activePackage}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      {orgAdmin ? (
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                            {orgAdmin.name}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate max-w-[180px]">{orgAdmin.email}</div>
                        </div>
                      ) : (
                        <div>
                          <div className="text-slate-900 dark:text-white font-semibold">Pending Admin</div>
                          <div className="text-[11px] text-slate-500">{org.contactEmail}</div>
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-emerald-600 font-semibold text-[11px]">
                          <FileSpreadsheet className="w-3.5 h-3.5" />
                          Master_Google_Sheet.gsheet
                        </div>
                        <div className="flex items-center gap-1.5 text-blue-600 text-[10px]">
                          <FolderOpen className="w-3 h-3" />
                          /{org.name}/Everyone
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        org.status === 'active'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                          : org.status === 'onboarding'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300'
                      }`}>
                        {org.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedOrgForProfile(org)}
                          title="View & Edit Company Profile & Settings"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 text-blue-700 dark:text-teal-300 font-semibold border border-blue-200 dark:border-blue-800 transition cursor-pointer text-xs shadow-xs"
                        >
                          <Building2 className="w-3.5 h-3.5" />
                          <span>Profile &amp; Settings</span>
                        </button>

                        <button
                          onClick={() => handleSwitchToClientAdmin(org)}
                          title="Simulate Client Admin Perspective"
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-800 transition cursor-pointer text-xs"
                        >
                          <LogIn className="w-3 h-3" />
                          <span>Sign in as Client</span>
                        </button>

                        <button
                          onClick={() => {
                            setActivePortalTab('google_workspace');
                          }}
                          title="Open Master Google Worksheet"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                        >
                          <FileSpreadsheet className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to remove ${org.name}? All tenant associations will be unlinked.`)) {
                              deleteOrganization(org.id);
                            }
                          }}
                          title="Delete Company Tenant"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Provision New Client Company & Admin Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 space-y-5 my-8 max-h-[92vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  Provision Client Company & Client Admin
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Create a dedicated Bangladesh-compliant tenant dossier. The Client Admin will have strict access restricted to this company only.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCompany} className="space-y-5">
              {/* Company Details Section */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" />
                  1. Company & Entity Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Company Name (English) *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Advance Technology Consortium Ltd."
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Bangla Name (বাংলা নাম)</label>
                    <input
                      type="text"
                      value={nameBangla}
                      onChange={(e) => setNameBangla(e.target.value)}
                      placeholder="e.g. অ্যাডভান্সড টেকনোলজি কনসোর্টিয়াম লিমিটেড"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Short Name / Ticker</label>
                    <input
                      type="text"
                      value={shortName}
                      onChange={(e) => setShortName(e.target.value)}
                      placeholder="e.g. ATCL"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Entity Type</label>
                    <select
                      value={businessType}
                      onChange={(e) => setBusinessType(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value="Private Limited Company">Private Limited Company</option>
                      <option value="Public Limited Company">Public Limited Company</option>
                      <option value="Partnership">Partnership</option>
                      <option value="Sole Proprietorship">Sole Proprietorship</option>
                      <option value="Foreign Branch">Foreign Branch / Liaison Office</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Industry Sector</label>
                    <select
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      {industries.filter((i) => i !== 'All').map((ind) => (
                        <option key={ind} value={ind}>{ind}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Headcount Bracket</label>
                    <select
                      value={size}
                      onChange={(e) => setSize(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value="1-25 Employees">1-25 Employees (Startup)</option>
                      <option value="25-50 Employees">25-50 Employees (Growing)</option>
                      <option value="50-150 Employees">50-150 Employees (Mid-Market)</option>
                      <option value="150-500 Employees">150-500 Employees (Enterprise)</option>
                      <option value="500+ Employees">500+ Employees (Global Corp)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Jurisdiction / Country</label>
                    <input
                      type="text"
                      required
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="Bangladesh"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Company Contact Email *</label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="hr@atcl.com.bd"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Contact Phone (+880)</label>
                    <input
                      type="text"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="+880 1819-556751"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">HR Package Retainer</label>
                    <select
                      value={activePackage}
                      onChange={(e) => setActivePackage(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value="Startup HR">Startup HR Retainer</option>
                      <option value="SME HR">SME HR Retainer</option>
                      <option value="Corporate HR">Corporate HR Retainer</option>
                      <option value="Managed HR">Managed HR (Total Outsourcing)</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Assigned Accounticca Consultant</label>
                    <input
                      type="text"
                      value={assignedConsultantName}
                      onChange={(e) => setAssignedConsultantName(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Statutory & Head Office Location (Bangladesh) */}
              <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-teal-600 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  2. Statutory Registration & Head Office (Bangladesh)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">RJSC Reg. No.</label>
                    <input
                      type="text"
                      value={rjscNumber}
                      onChange={(e) => setRjscNumber(e.target.value)}
                      placeholder="C-91823/2011"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Trade License No.</label>
                    <input
                      type="text"
                      value={tradeLicenseNumber}
                      onChange={(e) => setTradeLicenseNumber(e.target.value)}
                      placeholder="TR/DNCC/004321"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">VAT BIN (11-digit)</label>
                    <input
                      type="text"
                      value={binNumber}
                      onChange={(e) => setBinNumber(e.target.value)}
                      placeholder="001245678-0101"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">e-TIN (12-digit)</label>
                    <input
                      type="text"
                      value={tinNumber}
                      onChange={(e) => setTinNumber(e.target.value)}
                      placeholder="482910482910"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Division</label>
                    <select
                      value={division}
                      onChange={(e) => {
                        const div = e.target.value;
                        const dist = getDistrictsForDivision(div)[0];
                        const upa = getUpazilasForDistrict(dist)[0];
                        const pc = getPostCodesForUpazila(upa)[0];
                        setDivision(div);
                        setDistrict(dist);
                        setUpazila(upa);
                        setPostalCode(pc);
                      }}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    >
                      {DIVISIONS.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">District</label>
                    <select
                      value={district}
                      onChange={(e) => {
                        const dist = e.target.value;
                        const upa = getUpazilasForDistrict(dist)[0];
                        const pc = getPostCodesForUpazila(upa)[0];
                        setDistrict(dist);
                        setUpazila(upa);
                        setPostalCode(pc);
                      }}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    >
                      {getDistrictsForDivision(division).map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Upazila / Area</label>
                    <select
                      value={upazila}
                      onChange={(e) => {
                        const upa = e.target.value;
                        const pc = getPostCodesForUpazila(upa)[0];
                        setUpazila(upa);
                        setPostalCode(pc);
                      }}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    >
                      {getUpazilasForDistrict(district).map((u) => (
                        <option key={u} value={u}>{u}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Postal Code</label>
                    <select
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    >
                      {getPostCodesForUpazila(upazila).map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2 lg:col-span-4">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Head Office Street Address</label>
                    <input
                      type="text"
                      value={addressLine1}
                      onChange={(e) => setAddressLine1(e.target.value)}
                      placeholder="e.g. House 42, Road 11, Block F, Banani"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Client Admin Provisioning Section */}
              <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  3. Client Admin Credentials (Multi-Tenant Role)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Client Admin Name *</label>
                    <input
                      type="text"
                      required
                      value={adminName}
                      onChange={(e) => setAdminName(e.target.value)}
                      placeholder="e.g. Ekramul Haque"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Client Admin Official Email *</label>
                    <input
                      type="email"
                      required
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      placeholder="admin@atcl.com.bd"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Client Admin Designation</label>
                    <input
                      type="text"
                      value={adminDesignation}
                      onChange={(e) => setAdminDesignation(e.target.value)}
                      placeholder="Director of Operations / HR Head"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={adminPhone}
                      onChange={(e) => setAdminPhone(e.target.value)}
                      placeholder="+880 1335-230170"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Client Admin Login Password
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const prefix = (shortName || name || 'Acct').replace(/[^a-zA-Z0-9]/g, '').slice(0, 4) || 'Acct';
                          const suffix = Math.floor(1000 + Math.random() * 9000);
                          setAdminPassword(`${prefix}@${suffix}!`);
                          setShowAdminPassword(true);
                        }}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 cursor-pointer"
                      >
                        <KeyRound className="w-3 h-3" />
                        <span>Generate Strong Password</span>
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showAdminPassword ? 'text' : 'password'}
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        placeholder="Leave blank to use default (Client@123)"
                        className="w-full px-3 py-2 pr-10 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowAdminPassword(!showAdminPassword)}
                        className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 cursor-pointer"
                        title={showAdminPassword ? 'Hide password' : 'Show password'}
                      >
                        {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-900/60 flex items-start gap-3 mt-2">
                  <FileSpreadsheet className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                  <div className="space-y-1 text-xs">
                    <label className="flex items-center gap-2 font-bold text-slate-900 dark:text-white cursor-pointer">
                      <input
                        type="checkbox"
                        checked={autoProvisionGoogleSheet}
                        onChange={(e) => setAutoProvisionGoogleSheet(e.target.checked)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      Provision Google Workspace Shared Drive Folder & Master Google Sheet
                    </label>
                    <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                      Automatically creates a dedicated folder <code className="bg-blue-100 dark:bg-blue-900 px-1 py-0.5 rounded text-blue-800 dark:text-blue-200">/{name || 'CompanyName'}/Everyone</code> and provisions <code className="bg-blue-100 dark:bg-blue-900 px-1 py-0.5 rounded text-blue-800 dark:text-blue-200">Master_Google_Sheet.gsheet</code> accessible by Super Admin and the provisioned Client Admin.
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30 transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Provision Client Company & Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Company Profile & Settings Modal (7-Tab Dossier matching ATCL benchmark) */}
      <CompanyProfileModal
        organization={selectedOrgForProfile}
        isOpen={!!selectedOrgForProfile}
        onClose={() => setSelectedOrgForProfile(null)}
        onSave={(updatedOrg) => {
          updateOrganization(updatedOrg);
          setSelectedOrgForProfile(updatedOrg);
        }}
        onOpenGoogleSheet={() => {
          setSelectedOrgForProfile(null);
          setActivePortalTab('google_workspace');
        }}
      />
    </div>
  );
};

