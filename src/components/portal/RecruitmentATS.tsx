import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Candidate, CandidateStatus } from '../../types';
import {
  Briefcase,
  Users,
  Plus,
  Star,
  X,
  ChevronRight,
} from 'lucide-react';

export const RecruitmentATS: React.FC = () => {
  const {
    jobs,
    candidates,
    addCandidate,
    updateCandidateStatus,
    updateCandidateScore,
    addJobRequisition,
    currentUser,
    selectedOrgIdFilter,
  } = useApp();

  const isClientAdmin = currentUser.role === 'client_admin';
  const targetOrgId = isClientAdmin ? currentUser.organizationId : selectedOrgIdFilter;

  const filteredJobs = jobs.filter(
    (j) => targetOrgId === 'all' || j.organizationId === targetOrgId
  );

  const [selectedJobId, setSelectedJobId] = useState<string>(filteredJobs[0]?.id || 'all');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [addJobModalOpen, setAddJobModalOpen] = useState(false);
  const [addCandidateModalOpen, setAddCandidateModalOpen] = useState(false);

  // New Candidate form state
  const [candName, setCandName] = useState('');
  const [candEmail, setCandEmail] = useState('');
  const [candPhone, setCandPhone] = useState('');
  const [candEducation] = useState('B.Sc Computer Science');
  const [candExperience] = useState(5);
  const [candCurrentCompany] = useState('CloudScale Tech');
  const [candSkills] = useState('Go, Kubernetes, Postgres');
  const [candExpectedSalary, setCandExpectedSalary] = useState(170000);
  const [candCurrentSalary] = useState(150000);
  const [candNoticePeriod] = useState('30 Days');
  const [candSummary] = useState('Experienced engineer specializing in cloud-native infrastructure.');

  // New Job form state
  const [jobPosition, setJobPosition] = useState('');
  const [jobDepartment, setJobDepartment] = useState('Engineering');
  const [jobLocation, setJobLocation] = useState('Remote (US)');
  const [jobSalaryRange, setJobSalaryRange] = useState('BDT 1,40,000 - 1,70,000');
  const [jobVacancies, setJobVacancies] = useState(1);
  const [jobDescription] = useState('Key strategic engineering role.');
  const [jobSkills, setJobSkills] = useState('TypeScript, React, Cloud');
  const [jobExperience] = useState('5+ Years');
  const [jobDeadline] = useState('2026-11-01');

  // Candidate score updater
  const [scoreRating, setScoreRating] = useState<number>(4.5);
  const [recruiterNotesInput, setRecruiterNotesInput] = useState('');

  const PIPELINE_STAGES: CandidateStatus[] = [
    'Applied',
    'Screening',
    'Shortlisted',
    'Interview',
    'Assessment',
    'Final Interview',
    'Selected',
    'Offer',
    'Hired',
    'Rejected',
  ];

  const visibleCandidates = candidates.filter((c) => {
    const orgMatch = targetOrgId === 'all' || c.organizationId === targetOrgId;
    const jobMatch = selectedJobId === 'all' || c.jobId === selectedJobId;
    return orgMatch && jobMatch;
  });

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    addJobRequisition({
      organizationId: isClientAdmin ? currentUser.organizationId : 'org_apex',
      organizationName: isClientAdmin ? currentUser.organizationName : 'Apex Technologies',
      position: jobPosition,
      department: jobDepartment,
      location: jobLocation,
      employmentType: 'Full-time',
      salaryRange: jobSalaryRange,
      vacancies: jobVacancies,
      description: jobDescription,
      requiredSkills: jobSkills.split(',').map((s) => s.trim()),
      experienceRequired: jobExperience,
      deadline: jobDeadline,
      assignedRecruiter: currentUser.name,
      status: 'Open',
    });
    setAddJobModalOpen(false);
  };

  const handleCreateCandidate = (e: React.FormEvent) => {
    e.preventDefault();
    const targetJob = jobs.find((j) => j.id === selectedJobId) || jobs[0];
    addCandidate({
      organizationId: targetJob.organizationId,
      organizationName: targetJob.organizationName,
      jobId: targetJob.id,
      jobTitle: targetJob.position,
      name: candName,
      email: candEmail,
      phone: candPhone,
      summary: candSummary,
      education: candEducation,
      experienceYears: candExperience,
      currentCompany: candCurrentCompany,
      skills: candSkills.split(',').map((s) => s.trim()),
      expectedSalary: candExpectedSalary,
      currentSalary: candCurrentSalary,
      noticePeriod: candNoticePeriod,
      interviewScore: 4.0,
      recruiterNotes: 'Candidate screened and added to active pipeline.',
      status: 'Screening',
    });
    setAddCandidateModalOpen(false);
    setCandName('');
    setCandEmail('');
    setCandPhone('');
  };

  const advanceStage = (candId: string, nextStage: CandidateStatus) => {
    updateCandidateStatus(candId, nextStage);
    if (selectedCandidate && selectedCandidate.id === candId) {
      setSelectedCandidate({ ...selectedCandidate, status: nextStage });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-serif tracking-tight">
            Recruitment ATS (Applicant Tracking System)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Full 10-stage candidate pipeline, structured scorecards, and requisition tracking
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setAddCandidateModalOpen(true)}
            className="px-3.5 py-2 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-1.5"
          >
            <Users className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>Add Candidate</span>
          </button>

          <button
            onClick={() => setAddJobModalOpen(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-md flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Post New Requisition</span>
          </button>
        </div>
      </div>

      {/* Requisition Selector Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Active Job Filter:</span>
          <select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
          >
            <option value="all">All Open Positions ({visibleCandidates.length} Candidates)</option>
            {filteredJobs.map((j) => (
              <option key={j.id} value={j.id}>
                {j.position} &bull; {j.organizationName} ({j.salaryRange})
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-4">
          <span>
            Total Applicants In View: <strong className="text-teal-600 dark:text-teal-400">{visibleCandidates.length}</strong>
          </span>
          <span className="hidden sm:inline">&bull;</span>
          <span className="hidden sm:inline">
            Active Requisitions: <strong className="text-slate-900 dark:text-white">{filteredJobs.length}</strong>
          </span>
        </div>
      </div>

      {/* 10-Stage Kanban Pipeline */}
      <div className="flex gap-4 overflow-x-auto pb-6">
        {PIPELINE_STAGES.map((stage) => {
          const stageCandidates = visibleCandidates.filter((c) => c.status === stage);

          return (
            <div
              key={stage}
              className="w-72 flex-shrink-0 bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 flex flex-col max-h-[750px]"
            >
              {/* Stage Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 px-1">
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  {stage}
                </span>
                <span className="w-5 h-5 rounded-full bg-white dark:bg-slate-800 text-[10px] text-teal-600 dark:text-teal-300 font-bold flex items-center justify-center border border-slate-200 dark:border-transparent">
                  {stageCandidates.length}
                </span>
              </div>

              {/* Candidates Column */}
              <div className="flex-1 overflow-y-auto space-y-3 pt-3">
                {stageCandidates.map((cand) => (
                  <div
                    key={cand.id}
                    onClick={() => {
                      setSelectedCandidate(cand);
                      setScoreRating(cand.interviewScore);
                      setRecruiterNotesInput(cand.recruiterNotes);
                    }}
                    className="p-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 hover:border-blue-500/50 transition-all cursor-pointer shadow-sm dark:shadow-md group"
                  >
                    <div className="flex items-start justify-between mb-1.5">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">
                        {cand.name}
                      </h4>
                      <div className="flex items-center gap-1 text-[11px] text-amber-500 dark:text-amber-400 font-bold">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{cand.interviewScore.toFixed(1)}</span>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mb-2">
                      {cand.jobTitle}
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 mb-2">
                      <span>{cand.experienceYears}y exp &bull; {cand.currentCompany}</span>
                      <span>Notice: {cand.noticePeriod}</span>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-2">
                      {cand.skills.slice(0, 3).map((s, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.2 rounded text-[9px] bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800"
                        >
                          {s}
                        </span>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-900 flex items-center justify-between text-[10px]">
                      <span className="text-teal-600 dark:text-teal-400 font-mono font-semibold">
                        BDT {(cand.expectedSalary / 1000).toFixed(0)}k Exp.
                      </span>

                      {/* Quick Advance Button */}
                      {stage !== 'Hired' && stage !== 'Rejected' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const currIdx = PIPELINE_STAGES.indexOf(stage);
                            if (currIdx < PIPELINE_STAGES.length - 2) {
                              advanceStage(cand.id, PIPELINE_STAGES[currIdx + 1]);
                            }
                          }}
                          className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 flex items-center gap-0.5"
                        >
                          <span>Advance</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {stageCandidates.length === 0 && (
                  <div className="text-center py-6 text-xs text-slate-400 dark:text-slate-600 border border-dashed border-slate-300 dark:border-slate-800 rounded-xl">
                    No candidates
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Candidate Profile & Scorecard Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[92vh] flex flex-col">
            <div className="p-6 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-500/15 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300">
                    Candidate Dossier
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">&bull; {selectedCandidate.jobTitle}</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-serif">{selectedCandidate.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Applied for {selectedCandidate.organizationName} on {selectedCandidate.appliedDate}
                </p>
              </div>

              <button
                onClick={() => setSelectedCandidate(null)}
                className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-5">
              {/* Pipeline Stage Control */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                  Transition Candidate Stage:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {PIPELINE_STAGES.map((st) => (
                    <button
                      key={st}
                      onClick={() => advanceStage(selectedCandidate.id, st)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                        selectedCandidate.status === st
                          ? 'bg-blue-600 text-white'
                          : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Candidate Info Grid */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-2">
                  <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400">Email:</span>
                    <span className="text-blue-600 dark:text-blue-400 font-medium">{selectedCandidate.email}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400">Phone:</span>
                    <span className="text-slate-900 dark:text-white">{selectedCandidate.phone}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400">Education:</span>
                    <span className="text-slate-900 dark:text-white">{selectedCandidate.education}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400">Current Role:</span>
                    <span className="text-slate-900 dark:text-white">{selectedCandidate.currentCompany}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400">Total Experience:</span>
                    <span className="text-slate-900 dark:text-white font-medium">{selectedCandidate.experienceYears} Years</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400">Current Salary:</span>
                    <span className="text-slate-900 dark:text-white font-mono">BDT {selectedCandidate.currentSalary.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400">Expected Salary:</span>
                    <span className="text-teal-600 dark:text-teal-400 font-bold font-mono">
                      BDT {selectedCandidate.expectedSalary.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400">Notice Period:</span>
                    <span className="text-amber-600 dark:text-amber-400 font-medium">{selectedCandidate.noticePeriod}</span>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1.5">
                  Verified Technical & Soft Skills:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCandidate.skills.map((sk, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-200 text-xs border border-slate-200 dark:border-slate-800 font-mono"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Interview Evaluation Scorecard */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>Structured Interview Scorecard (1 - 5 Scale)</span>
                  </h4>
                  <span className="text-sm font-bold text-amber-600 dark:text-amber-400">{scoreRating.toFixed(1)} / 5.0</span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="1.0"
                    max="5.0"
                    step="0.1"
                    value={scoreRating}
                    onChange={(e) => setScoreRating(Number(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    Recruiter Assessment & Feedback Notes:
                  </label>
                  <textarea
                    rows={3}
                    value={recruiterNotesInput}
                    onChange={(e) => setRecruiterNotesInput(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    updateCandidateScore(selectedCandidate.id, scoreRating, recruiterNotesInput);
                    setSelectedCandidate({
                      ...selectedCandidate,
                      interviewScore: scoreRating,
                      recruiterNotes: recruiterNotesInput,
                    });
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl"
                >
                  Save Scorecard
                </button>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedCandidate(null)}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-white rounded-xl text-xs font-semibold"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Job Requisition Modal */}
      {addJobModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-2xl overflow-hidden my-8">
            <div className="p-5 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-serif">Open New Job Requisition</h3>
              <button onClick={() => setAddJobModalOpen(false)} className="p-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateJob} className="p-6 space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Position Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lead DevOps & Cloud Engineer"
                  value={jobPosition}
                  onChange={(e) => setJobPosition(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Department</label>
                  <input
                    type="text"
                    required
                    placeholder="Engineering / Sales / Ops"
                    value={jobDepartment}
                    onChange={(e) => setJobDepartment(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Location</label>
                  <input
                    type="text"
                    required
                    placeholder="Remote / New York / Hybrid"
                    value={jobLocation}
                    onChange={(e) => setJobLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Salary Range</label>
                  <input
                    type="text"
                    required
                    placeholder="BDT 1,20,000 - 1,50,000"
                    value={jobSalaryRange}
                    onChange={(e) => setJobSalaryRange(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Vacancies</label>
                  <input
                    type="number"
                    min="1"
                    value={jobVacancies}
                    onChange={(e) => setJobVacancies(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Required Skills (Comma separated)</label>
                <input
                  type="text"
                  placeholder="AWS, Docker, CI/CD, Terraform"
                  value={jobSkills}
                  onChange={(e) => setJobSkills(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAddJobModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl"
                >
                  Publish Requisition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Candidate Modal */}
      {addCandidateModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-2xl overflow-hidden my-8">
            <div className="p-5 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-serif">Add Candidate to Pipeline</h3>
              <button onClick={() => setAddCandidateModalOpen(false)} className="p-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCandidate} className="p-6 space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Candidate Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Candidate Name"
                    value={candName}
                    onChange={(e) => setCandName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="cand@example.com"
                    value={candEmail}
                    onChange={(e) => setCandEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Phone</label>
                  <input
                    type="tel"
                    required
                    placeholder="+880 1335-230170"
                    value={candPhone}
                    onChange={(e) => setCandPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Expected Salary (BDT)</label>
                  <input
                    type="number"
                    value={candExpectedSalary}
                    onChange={(e) => setCandExpectedSalary(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAddCandidateModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl"
                >
                  Inject into Pipeline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
