import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Users,
  Building,
  Award,
  CheckCircle2,
  ArrowRight,
  Globe,
  Sparkles,
  Briefcase,
  Star,
} from 'lucide-react';
import { ClientLogos } from './ClientLogos';
import { TestimonialsSection } from './TestimonialsSection';
import { StatsSection } from './StatsSection';
import { CaseStudiesSection } from './CaseStudiesSection';

export const AboutPage: React.FC = () => {
  const { setConsultationModalOpen } = useApp();

  const leadershipTeam = [
    {
      name: 'Ekramul Haque',
      role: 'Managing Director & Principal Consultant',
      bio: '22+ years in executive HR architecture, organizational transformation, and corporate labor compliance across global enterprises.',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400',
    },
    {
      name: 'Farzana Chowdhury',
      role: 'Senior Lead HR Consultant & Legal Advisor',
      bio: 'Expert in labor law compliance, POSH frameworks, employee handbook governance, and multi-jurisdiction employment contracts.',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400',
    },
    {
      name: 'Tariq Al-Mansoor',
      role: 'Head of Talent Acquisition & ATS',
      bio: 'Spearheads technical headhunting, executive search, and rigorous competency evaluation for high-growth tech and engineering companies.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    },
    {
      name: 'Dr. Oliver Kensington',
      role: 'Director of Clinical & Healthcare HR',
      bio: 'Specializes in medical credential verification, 24/7 rostering compliance, and workforce retention for hospital networks.',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
    },
  ];

  return (
    <div className="space-y-16 pb-20 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Hero Header */}
      <section className="relative pt-16 pb-20 bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-xs font-semibold text-blue-700 dark:text-blue-300 mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>About Accounticca HRM Solutions</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight font-serif text-slate-950 dark:text-white max-w-3xl mx-auto leading-tight">
            Your Complete HR Management & Solutions Partner
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            We empower startups, SMEs, and global corporations to transform their people operations, ensure ironclad labor compliance, and scale high-performance workplaces.
          </p>
        </div>
      </section>

      {/* Group 1: About Us (Mission, Vision, Values) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-6">
            <h2 className="text-xs font-mono uppercase tracking-wider text-blue-600 dark:text-teal-400 font-semibold">
              Our Vision & Core Ethos
            </h2>
            <h3 className="text-3xl font-bold font-serif text-slate-900 dark:text-white leading-snug">
              Bridging Strategic Management Consulting with Modern HR Technology
            </h3>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Founded on the belief that human capital is an organization&apos;s most vital asset, Accounticca delivers end-to-end HR management consulting. We remove administrative friction so founders and executives can focus entirely on core business growth.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <ShieldCheck className="w-6 h-6 text-teal-600 dark:text-teal-400 mb-2" />
                <h4 className="font-bold text-sm text-slate-900 dark:text-white font-serif">100% Compliance Rigor</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Zero labor violations across international jurisdictions.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <Award className="w-6 h-6 text-blue-600 dark:text-blue-400 mb-2" />
                <h4 className="font-bold text-sm text-slate-900 dark:text-white font-serif">Elite Executive Retention</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">94%+ first-year placement retention warranty.</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800"
                alt="Accounticca Consulting Boardroom"
                className="w-full h-[380px] object-cover"
              />
              <div className="p-6 bg-white dark:bg-slate-900 space-y-2">
                <div className="text-xs font-mono uppercase tracking-wider text-teal-600 dark:text-teal-400 font-semibold">
                  Global Enterprise Footprint
                </div>
                <div className="text-lg font-bold font-serif text-slate-900 dark:text-white">
                  Managing over BDT 18M+ in monthly payroll across 450+ client organizations
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <StatsSection />

      {/* Group 2: Our Team */}
      <section id="about-team" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-xs font-mono uppercase tracking-wider text-blue-600 dark:text-teal-400 font-semibold mb-2">
            Leadership & Advisory Squad
          </h2>
          <h3 className="text-3xl font-bold font-serif text-slate-900 dark:text-white">
            Meet Our Senior HR Consultants & Subject Matter Experts
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            Decades of combined multidisciplinary expertise spanning employment law, executive search, and payroll engineering.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {leadershipTeam.map((member, idx) => (
            <div
              key={idx}
              className="rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden group hover:border-blue-500/50 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="h-64 overflow-hidden">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 space-y-2">
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white font-serif">
                    {member.name}
                  </h4>
                  <div className="text-xs font-semibold text-blue-600 dark:text-teal-400">
                    {member.role}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pt-1">
                    {member.bio}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Group 3: Our Client & Trusted Partners */}
      <section id="about-clients" className="space-y-12 scroll-mt-24">
        <div className="text-center max-w-3xl mx-auto px-4">
          <h2 className="text-xs font-mono uppercase tracking-wider text-blue-600 dark:text-teal-400 font-semibold mb-2">
            Our Valued Clients
          </h2>
          <h3 className="text-3xl font-bold font-serif text-slate-900 dark:text-white">
            Trusted by Industry Leaders Worldwide
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            From hyper-growth tech unicorns to manufacturing plants and healthcare institutions.
          </p>
        </div>

        <ClientLogos />

        <TestimonialsSection />

        <CaseStudiesSection />
      </section>

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-blue-900 via-slate-900 to-teal-950 text-white p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.15),transparent_50%)] pointer-events-none" />
          <div className="relative max-w-2xl mx-auto space-y-6">
            <h3 className="text-3xl sm:text-4xl font-bold font-serif tracking-tight">
              Ready to Partner with Accounticca?
            </h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Schedule a confidential HR diagnostic consultation with our principal leadership team today.
            </p>
            <button
              onClick={() => setConsultationModalOpen(true)}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-sm text-slate-950 bg-teal-400 hover:bg-teal-300 shadow-xl transition-all hover:scale-105"
            >
              <span>Book Your Consultation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
