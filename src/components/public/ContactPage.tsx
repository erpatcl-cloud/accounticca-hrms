import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  ShieldCheck,
  Building,
  Globe,
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { addConsultationRequest } = useApp();

  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [designation, setDesignation] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [industry, setIndustry] = useState('IT & Software');
  const [companySize, setCompanySize] = useState('50-100 Employees');
  const [requiredService, setRequiredService] = useState('HR Consulting & Strategic Architecture');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('10:00 AM - 11:00 AM EST');
  const [message, setMessage] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !companyName) return;

    addConsultationRequest({
      fullName,
      companyName,
      designation: designation || 'Executive / Founder',
      email,
      phone: phone || '+880 1335-230170',
      industry,
      companySize,
      requiredService,
      preferredDate: preferredDate || new Date().toISOString().split('T')[0],
      preferredTime,
      message: message || 'Inquiry submitted via Contact Page.',
    });

    setSubmittedSuccess(true);
  };

  const offices = [
    {
      city: 'Dhaka HQ (Main Office)',
      address: 'G-5, BTI Centara Grand, 144-144/1 Green Road, Panthapath, Dhaka-1205',
      phone: '+880 1335-230170',
      email: 'info@elawyersbd.com | info@accounticca.com',
      region: 'Bangladesh & Global',
      imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=700',
    },
    {
      city: 'London Office',
      address: '25 Bank Street, Canary Wharf, London E14 5JP, United Kingdom',
      phone: '+880 1746-091200',
      email: 'london@accounticca-hrm.com',
      region: 'Europe & UK',
      imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&q=80&w=700',
    },
    {
      city: 'Singapore Hub',
      address: 'Marina Bay Financial Centre, Tower 3, Singapore 018982',
      phone: '+880 1789-012300',
      email: 'singapore@accounticca-hrm.com',
      region: 'Asia-Pacific',
      imageUrl: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&q=80&w=700',
    },
    {
      city: 'Dubai Office',
      address: 'Emirates Towers, Sheikh Zayed Road, Dubai, UAE',
      phone: '+880 1312-880000',
      email: 'dubai@accounticca-hrm.com',
      region: 'Middle East & Africa',
      imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=700',
    },
  ];

  return (
    <div className="space-y-16 pb-20 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Hero Header */}
      <section className="relative pt-16 pb-16 bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-xs font-semibold text-blue-700 dark:text-blue-300 mb-4">
            <Phone className="w-3.5 h-3.5" />
            <span>Get in Touch with Our HR Principals</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight font-serif text-slate-950 dark:text-white max-w-3xl mx-auto leading-tight">
            Let&apos;s Build a Stronger Workplace Together
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Whether you need a full HR audit, payroll outsourcing, or executive headhunting, our senior consultants are ready to assist you.
          </p>
        </div>
      </section>

      {/* Main Content Grid: Form & Contact Info */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left: Contact Info & Global Offices */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <h2 className="text-xs font-mono uppercase tracking-wider text-blue-600 dark:text-teal-400 font-semibold">
                Direct Communication Channels
              </h2>
              <h3 className="text-2xl font-bold font-serif text-slate-900 dark:text-white">
                How to Reach Accounticca
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Our advisors respond to all enterprise inquiries within 4 hours during business days. All consultations are bound by strict NDA confidentiality.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Main Helpline</div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white font-mono mt-0.5">
                    +88 01335230170-81
                  </div>
                  <div className="text-[11px] text-teal-600 dark:text-teal-400 mt-0.5">Sat-Thu: 9:00 AM - 6:00 PM BST</div>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Enterprise Inquiries</div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white font-mono mt-0.5">
                    info@elawyersbd.com | info@accounticca.com
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Encrypted & Confidential</div>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Consultation Response SLA</div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white font-mono mt-0.5">
                    Guaranteed within 4 Hours
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Dedicated Senior Consultant assigned</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Consultation / Contact Form */}
          <div className="lg:col-span-7">
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl">
              {submittedSuccess ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold font-serif text-slate-900 dark:text-white">
                    Consultation Request Successfully Received!
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                    Thank you, <span className="font-semibold">{fullName}</span>. Our Senior HR Principal Farzana Chowdhury has been assigned to your request and will contact you shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmittedSuccess(false);
                      setFullName('');
                      setCompanyName('');
                      setEmail('');
                      setPhone('');
                      setMessage('');
                    }}
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors mt-4"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                    <div>
                      <h3 className="text-lg font-bold font-serif text-slate-900 dark:text-white">
                        Book a Strategic HR Consultation
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Fill out your details below to schedule a session with our leadership team
                      </p>
                    </div>
                    <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-teal-300 font-semibold">
                      Secure Form
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Sophia Vance"
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Company Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="e.g. Apex Technologies"
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Work Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. sophia@apextech.io"
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. +880 1335-230170"
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Industry
                      </label>
                      <select
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                      >
                        <option value="IT & Software">IT & Software</option>
                        <option value="Manufacturing">Manufacturing</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Financial Services">Financial Services</option>
                        <option value="Hospitality">Hospitality</option>
                        <option value="Startup / Scaleup">Startup / Scaleup</option>
                        <option value="NGO / Non-Profit">NGO / Non-Profit</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Company Size
                      </label>
                      <select
                        value={companySize}
                        onChange={(e) => setCompanySize(e.target.value)}
                        className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                      >
                        <option value="1-20 Employees">1-20 Employees</option>
                        <option value="20-50 Employees">20-50 Employees</option>
                        <option value="50-150 Employees">50-150 Employees</option>
                        <option value="150-500 Employees">150-500 Employees</option>
                        <option value="500+ Employees">500+ Employees</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Required Service
                      </label>
                      <select
                        value={requiredService}
                        onChange={(e) => setRequiredService(e.target.value)}
                        className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                      >
                        <option value="HR Consulting & Strategic Architecture">HR Consulting & Audit</option>
                        <option value="Recruitment & Talent Acquisition (ATS)">Recruitment & ATS</option>
                        <option value="HR Policy & Compliance">HR Policy & Compliance</option>
                        <option value="Payroll Outsourcing & Compensation">Payroll Outsourcing</option>
                        <option value="Performance Management & OKRs">Performance & OKRs</option>
                        <option value="Managed HR Services">Managed HR (Virtual Dept)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Preferred Date
                      </label>
                      <input
                        type="date"
                        value={preferredDate}
                        onChange={(e) => setPreferredDate(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Preferred Time Window
                      </label>
                      <select
                        value={preferredTime}
                        onChange={(e) => setPreferredTime(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                      >
                        <option value="09:00 AM - 10:00 AM EST">09:00 AM - 10:00 AM EST</option>
                        <option value="10:00 AM - 11:00 AM EST">10:00 AM - 11:00 AM EST</option>
                        <option value="02:00 PM - 03:00 PM EST">02:00 PM - 03:00 PM EST</option>
                        <option value="04:00 PM - 05:00 PM EST">04:00 PM - 05:00 PM EST</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Project Details or Specific HR Challenges
                    </label>
                    <textarea
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Briefly describe your workforce size, current bottlenecks, or compliance goals..."
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-500 hover:to-teal-500 shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Schedule Confidential Consultation</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Global Offices Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-xs font-mono uppercase tracking-wider text-blue-600 dark:text-teal-400 font-semibold mb-2">
            Global Office Locations
          </h2>
          <h3 className="text-2xl font-bold font-serif text-slate-900 dark:text-white">
            Where to Find Our Advisory Hubs
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {offices.map((office, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-lg transition-all group"
            >
              <div className="relative h-40 w-full overflow-hidden">
                <img
                  src={office.imageUrl}
                  alt={office.city}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-slate-900/85 text-teal-300 border border-teal-400/30 font-semibold backdrop-blur-md">
                    {office.region}
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-blue-600/90 text-white flex items-center justify-center">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
              <div className="p-5 space-y-3">
                <h4 className="font-bold text-base text-slate-900 dark:text-white font-serif">
                  {office.city}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {office.address}
                </p>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1 text-xs font-mono text-slate-600 dark:text-slate-300">
                  <div>{office.phone}</div>
                  <div className="text-blue-600 dark:text-teal-400 truncate">{office.email}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
