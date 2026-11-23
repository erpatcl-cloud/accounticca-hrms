import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import logoImg from '../../assets/images/regenerated_image_1794372178595.png';
import {
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Lock,
  Award,
  X,
} from 'lucide-react';

interface FooterProps {
  onNavigateSection: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateSection }) => {
  const { setConsultationModalOpen, setSelectedServiceModal, servicesCatalog, navigateTo } = useApp();
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [selectedLegalModal, setSelectedLegalModal] = useState<string | null>(null);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
      setEmailInput('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-300 pt-16 pb-12 border-t border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Newsletter & Advisory Banner */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-blue-900 via-blue-950 to-slate-900 dark:from-slate-900 dark:via-blue-950 dark:to-slate-900 border border-blue-800/40 dark:border-slate-800 mb-16 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-semibold uppercase tracking-wider mb-3">
                <Award className="w-3.5 h-3.5 text-blue-400" />
                Executive HR Intelligence
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-white font-serif tracking-tight">
                Stay Ahead of Labor Laws & Talent Trends
              </h3>
              <p className="text-slate-300 dark:text-slate-400 text-sm mt-2 max-w-xl">
                Join 12,000+ CEOs, Directors, and HR Leaders who receive our monthly executive briefing on statutory labor compliance, compensation benchmarks, and talent acquisition strategies.
              </p>
            </div>

            <div className="lg:col-span-5">
              {subscribed ? (
                <div className="flex items-center gap-3 p-4 bg-emerald-950/80 border border-emerald-500/40 rounded-2xl text-emerald-300 text-sm animate-in fade-in">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" />
                  <span>Thank you for subscribing! You will receive our latest Q4 Compliance Dossier shortly.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    required
                    placeholder="Enter corporate email..."
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="flex-1 px-4 py-3 bg-slate-900/90 border border-slate-700 rounded-xl text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <span>Subscribe</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-200 dark:border-slate-800/80">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <img
                  src={logoImg}
                  alt="Accounticca HRM Solutions"
                  className="w-[126px] h-[39px] object-contain"
                  onError={(e) => {
                    // Fallback to text if image fails
                    const parent = (e.target as HTMLElement).parentElement;
                    if (parent) {
                      parent.innerHTML = '<span class="text-xl font-bold tracking-tight text-slate-900 dark:text-white font-serif">Accounticca HRM Solutions</span>';
                    }
                  }}
                />
              </div>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed pr-6">
              "Accounticca HRM Solutions - Your Complete HR Management Partner." Premium management consulting, strategic workforce planning, recruitment ATS, payroll outsourcing, and digital HR transformation for startups, SMEs, and enterprise corporations.
            </p>

            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400 pt-2">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-teal-600 dark:text-teal-400 flex-shrink-0" />
                <span>G-5, BTI Centara Grand, 144-144/1 Green Road, Panthapath, Dhaka-1205</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <span>+88 01335230170-81</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-teal-600 dark:text-teal-400 flex-shrink-0" />
                <span>info@elawyersbd.com | info@accounticca.com</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-3">
              <div className="px-2.5 py-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>ISO 27001 Certified Security</span>
              </div>
              <div className="px-2.5 py-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Strict Confidentiality NDA</span>
              </div>
            </div>
          </div>

          {/* HR Consulting & Services */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 font-serif">
              Core Solutions
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
              {servicesCatalog.slice(0, 5).map((srv) => (
                <li key={srv.id}>
                  <button
                    onClick={() => setSelectedServiceModal(srv)}
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-left"
                  >
                    {srv.title}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => onNavigateSection('services')}
                  className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-semibold pt-1 inline-flex items-center gap-1"
                >
                  View All 9 Services &rarr;
                </button>
              </li>
            </ul>
          </div>

          {/* Industry Verticals */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 font-serif">
              Industries
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <button onClick={() => onNavigateSection('industries')} className="hover:text-blue-600 dark:hover:text-blue-400">
                  Startups & Scaleups
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('industries')} className="hover:text-blue-600 dark:hover:text-blue-400">
                  SMEs & Growing Businesses
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('industries')} className="hover:text-blue-600 dark:hover:text-blue-400">
                  IT & Software Companies
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('industries')} className="hover:text-blue-600 dark:hover:text-blue-400">
                  Manufacturing & Factories
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('industries')} className="hover:text-blue-600 dark:hover:text-blue-400">
                  NGOs & Development Bodies
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('industries')} className="hover:text-blue-600 dark:hover:text-blue-400">
                  Healthcare & Hospitals
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('industries')} className="hover:text-blue-600 dark:hover:text-blue-400">
                  Financial Services & Banking
                </button>
              </li>
            </ul>
          </div>

          {/* HR Packages & Portal */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 font-serif">
              Quick Navigation
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <button onClick={() => onNavigateSection('packages')} className="hover:text-blue-600 dark:hover:text-blue-400">
                  Startup HR Package
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('packages')} className="hover:text-blue-600 dark:hover:text-blue-400">
                  SME HR Package
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('packages')} className="hover:text-blue-600 dark:hover:text-blue-400">
                  Corporate HR Architecture
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('packages')} className="hover:text-blue-600 dark:hover:text-blue-400">
                  Managed HR Services (Outsourced)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('blog')} className="hover:text-blue-600 dark:hover:text-blue-400">
                  Knowledge Hub & Labor Guides
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('case-studies')} className="hover:text-blue-600 dark:hover:text-blue-400">
                  Enterprise Client Case Studies
                </button>
              </li>
              <li className="pt-2">
                <button
                  onClick={() => setConsultationModalOpen(true)}
                  className="w-full py-2 px-3 rounded-lg bg-white dark:bg-slate-900 border border-teal-500/40 text-teal-700 dark:text-teal-300 font-semibold hover:bg-teal-50 dark:hover:bg-slate-800 transition-colors text-center"
                >
                  Book Private Consultation
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>
            &copy; {new Date().getFullYear()} Accounticca HRM Solutions LLC. All rights reserved. Confidentiality guaranteed.
          </p>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <button onClick={() => setSelectedLegalModal('privacy')} className="hover:text-slate-800 dark:hover:text-slate-400 cursor-pointer text-left">Privacy Policy</button>
            <button onClick={() => setSelectedLegalModal('terms')} className="hover:text-slate-800 dark:hover:text-slate-400 cursor-pointer text-left">Terms of Engagement</button>
            <button onClick={() => setSelectedLegalModal('nda')} className="hover:text-slate-800 dark:hover:text-slate-400 cursor-pointer text-left">Confidentiality & Non-Disclosure</button>
            <button onClick={() => setSelectedLegalModal('security')} className="hover:text-slate-800 dark:hover:text-slate-400 cursor-pointer text-left">Security Compliance</button>
            <button onClick={() => setSelectedLegalModal('sitemap')} className="hover:text-slate-800 dark:hover:text-slate-400 cursor-pointer text-left">Sitemap</button>
          </div>
        </div>
      </div>

      {/* Legal & Sitemap Modal */}
      {selectedLegalModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-teal-400 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold font-serif text-slate-900 dark:text-white">
                  {selectedLegalModal === 'privacy' && 'Privacy Policy'}
                  {selectedLegalModal === 'terms' && 'Terms of Engagement'}
                  {selectedLegalModal === 'nda' && 'Confidentiality & Non-Disclosure Agreement'}
                  {selectedLegalModal === 'security' && 'Security Compliance & ISO 27001'}
                  {selectedLegalModal === 'sitemap' && 'Accounticca HRM & eLawyers BD Sitemap'}
                </h3>
              </div>
              <button
                onClick={() => setSelectedLegalModal(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-sm text-slate-600 dark:text-slate-300 space-y-4 leading-relaxed">
              {selectedLegalModal === 'privacy' && (
                <>
                  <p>Accounticca HRM Solutions and eLawyers BD (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) are committed to protecting the privacy and confidentiality of corporate clients, HR leaders, and employees. This Privacy Policy outlines how we collect, process, and secure personal and organizational data in compliance with international data standards and local labor regulations.</p>
                  <h4 className="font-bold text-slate-900 dark:text-white">1. Information Collection</h4>
                  <p>We collect corporate contact information, employee payroll identifiers, tax withholding records, and attendance logs strictly required for B2B HR management consulting, payroll outsourcing, and ATS recruitment.</p>
                  <h4 className="font-bold text-slate-900 dark:text-white">2. Data Security & Isolation</h4>
                  <p>All client data is encrypted at rest and in transit. Tenant isolation mechanisms ensure that client records are strictly partitioned and accessible solely to authorized organizational roles.</p>
                </>
              )}
              {selectedLegalModal === 'terms' && (
                <>
                  <p>These Terms of Engagement govern the provision of executive HR consulting, strategic workforce planning, payroll administration, and software access services provided by Accounticca HRM Solutions.</p>
                  <h4 className="font-bold text-slate-900 dark:text-white">1. Scope of Services</h4>
                  <p>Services are delivered in accordance with agreed statement of work (SOW) documents, retainer schedules, and statutory compliance frameworks of Bangladesh and international jurisdictions.</p>
                  <h4 className="font-bold text-slate-900 dark:text-white">2. Professional Fees & Retainers</h4>
                  <p>Invoices are issued monthly or per project milestones. Payment terms are net 30 days unless specified otherwise in corporate agreements.</p>
                </>
              )}
              {selectedLegalModal === 'nda' && (
                <>
                  <p>Mutual Confidentiality and Non-Disclosure Agreement (NDA) is automatically enforced for all corporate clients engaging with Accounticca HRM Solutions and eLawyers BD.</p>
                  <h4 className="font-bold text-slate-900 dark:text-white">1. Confidential Information</h4>
                  <p>Includes employee compensation data, financial ledgers, proprietary HR workflows, trade secrets, and strategic business plans.</p>
                  <h4 className="font-bold text-slate-900 dark:text-white">2. Non-Disclosure Commitment</h4>
                  <p>Both parties agree not to disclose confidential information to any third party without express written authorization, except as required by statutory law or labor tribunals.</p>
                </>
              )}
              {selectedLegalModal === 'security' && (
                <>
                  <p>Accounticca HRM maintains bank-grade security infrastructure adhering to ISO 27001 security controls and robust data protection protocols.</p>
                  <h4 className="font-bold text-slate-900 dark:text-white">1. Access Control & RBAC</h4>
                  <p>Role-Based Access Control (RBAC) ensures multi-tier permissions for Super Admins, Client Admins, Consultants, and Employees.</p>
                  <h4 className="font-bold text-slate-900 dark:text-white">2. Audit Logging</h4>
                  <p>All system actions, payroll modifications, and document access requests are immutably logged for security auditing and compliance review.</p>
                </>
              )}
              {selectedLegalModal === 'sitemap' && (
                <>
                  <h4 className="font-bold text-slate-900 dark:text-white">Public Corporate Website URLs</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {[
                      { label: 'Home / Executive Overview', path: '/' },
                      { label: 'About Us & Ethos', path: '/about' },
                      { label: 'Leadership Team', path: '/about/team' },
                      { label: 'Client Portfolio', path: '/about/clients' },
                      { label: 'Core HR Services Catalog', path: '/services' },
                      { label: 'End-to-End HR Solutions', path: '/solutions' },
                      { label: 'HR Challenges We Solve', path: '/challenges' },
                      { label: 'Industries Served (10 Sectors)', path: '/industries' },
                      { label: 'HR Packages & Pricing', path: '/packages' },
                      { label: '6-Stage Consulting Process', path: '/process' },
                      { label: 'Digital HRMS & Analytics', path: '/digital-hr' },
                      { label: 'Client Case Studies', path: '/case-studies' },
                      { label: 'Executive Testimonials', path: '/testimonials' },
                      { label: 'Knowledge Hub & Blog', path: '/blog' },
                      { label: 'Book Free Consultation', path: '/consultation' },
                      { label: 'Global Offices & Contact', path: '/contact' },
                    ].map((item) => (
                      <button
                        key={item.path}
                        onClick={() => {
                          setSelectedLegalModal(null);
                          navigateTo(item.path);
                        }}
                        className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/70 hover:bg-blue-50 dark:hover:bg-slate-800 text-left transition-colors cursor-pointer border border-slate-200/70 dark:border-slate-700/60"
                      >
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{item.label}</span>
                        <span className="font-mono text-[10px] text-blue-600 dark:text-teal-400">{item.path}</span>
                      </button>
                    ))}
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white mt-4">Enterprise B2B Portal URLs</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {[
                      { label: 'Executive Dashboard', path: '/portal/overview' },
                      { label: 'Employee Self-Service', path: '/portal/my-portal' },
                      { label: 'Google Workspace Hub', path: '/portal/google-workspace' },
                      { label: 'Leads & Client CRM', path: '/portal/leads' },
                      { label: 'Consultation Bookings', path: '/portal/consultations' },
                      { label: 'Recruitment & ATS', path: '/portal/recruitment' },
                      { label: 'Candidate Pipeline', path: '/portal/candidates' },
                      { label: 'Employee Directory', path: '/portal/employees' },
                      { label: 'Payroll & Payslips', path: '/portal/payroll' },
                      { label: 'Attendance & Shifts', path: '/portal/attendance' },
                      { label: 'Leave Management', path: '/portal/leave' },
                      { label: 'Performance & OKRs', path: '/portal/performance' },
                      { label: 'L&D Training Hub', path: '/portal/training' },
                      { label: 'Policies & Documents', path: '/portal/documents' },
                      { label: 'HR Analytics & Reports', path: '/portal/analytics' },
                      { label: 'Billing & Invoices', path: '/portal/invoices' },
                      { label: 'Website CMS & Blog', path: '/portal/cms' },
                      { label: 'Security & Audit Logs', path: '/portal/audit' },
                    ].map((item) => (
                      <button
                        key={item.path}
                        onClick={() => {
                          setSelectedLegalModal(null);
                          navigateTo(item.path);
                        }}
                        className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/70 hover:bg-blue-50 dark:hover:bg-slate-800 text-left transition-colors cursor-pointer border border-slate-200/70 dark:border-slate-700/60"
                      >
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{item.label}</span>
                        <span className="font-mono text-[10px] text-blue-600 dark:text-teal-400">{item.path}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedLegalModal(null)}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
              >
                Close & Return
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

