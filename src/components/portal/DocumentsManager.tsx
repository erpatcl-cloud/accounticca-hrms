import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DocumentItem } from '../../types';
import {
  Upload,
  Download,
  Search,
  CheckCircle2,
  X,
} from 'lucide-react';

export const DocumentsManager: React.FC = () => {
  const { documents, uploadDocument, currentUser, selectedOrgIdFilter } = useApp();

  const isClientAdmin = currentUser.role === 'client_admin';
  const targetOrgId = isClientAdmin ? currentUser.organizationId : selectedOrgIdFilter;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [downloadedDocId, setDownloadedDocId] = useState<string | null>(null);

  // Upload form state
  const [docTitle, setDocTitle] = useState('');
  const [docCategory, setDocCategory] = useState<DocumentItem['category']>('HR Policies');
  const [docType, setDocType] = useState<DocumentItem['fileType']>('PDF');
  const [accessRole, setAccessRole] = useState<DocumentItem['accessRole']>('all');

  const categories = [
    'All',
    'Employment Contracts',
    'Appointment Letters',
    'Employee Handbook',
    'HR Policies',
    'Salary Documents',
    'Performance Documents',
    'Compliance Documents',
  ];

  const filteredDocs = documents.filter((doc) => {
    const orgMatch = targetOrgId === 'all' || doc.organizationId === targetOrgId;
    const catMatch = selectedCategory === 'All' || doc.category === selectedCategory;
    const queryMatch = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
    const roleMatch =
      currentUser.role === 'super_admin' ||
      currentUser.role === 'hr_consultant' ||
      doc.accessRole === 'all' ||
      (isClientAdmin && doc.accessRole !== 'consultant_only');

    return orgMatch && catMatch && queryMatch && roleMatch;
  });

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    uploadDocument({
      organizationId: isClientAdmin ? currentUser.organizationId : 'org_apex',
      organizationName: isClientAdmin ? currentUser.organizationName : 'Apex Technologies',
      title: docTitle,
      category: docCategory,
      fileType: docType,
      fileSize: '1.4 MB',
      uploadedBy: currentUser.name,
      version: 'v1.0',
      accessRole,
    });
    setUploadModalOpen(false);
    setDocTitle('');
  };

  const handleDownloadDocument = (doc: DocumentItem) => {
    setDownloadedDocId(doc.id);
    const content = `Accounticca HRM Solutions - Verified Corporate Document
Title: ${doc.title}
Category: ${doc.category}
Organization: ${doc.organizationName}
Version: ${doc.version}
Uploaded By: ${doc.uploadedBy} on ${doc.uploadDate}
Access Policy: ${doc.accessRole.toUpperCase()}
`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc.title.replace(/\s+/g, '_')}_${doc.version}.txt`;
    a.click();
    setTimeout(() => setDownloadedDocId(null), 2500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-serif tracking-tight">
            Document Management System & Policy Repository
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Encrypted repository for employment agreements, regulatory audits, and handbooks
          </p>
        </div>

        <button
          onClick={() => setUploadModalOpen(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-md flex items-center gap-1.5"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search documents by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 dark:text-slate-400">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-slate-700 transition-all flex flex-col justify-between shadow-sm dark:shadow-xl group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/15 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-400/30 uppercase">
                  {doc.category}
                </span>
                <span className="text-xs font-mono font-bold text-teal-600 dark:text-teal-400 bg-slate-50 dark:bg-slate-950 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">
                  {doc.version}
                </span>
              </div>

              <div className="flex items-start gap-3 my-3">
                <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center flex-shrink-0 text-slate-700 dark:text-slate-300 font-bold text-xs">
                  {doc.fileType}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors line-clamp-2">
                    {doc.title}
                  </h3>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Size: {doc.fileSize} &bull; Org: {doc.organizationName}
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 pt-3">
                <div className="flex justify-between">
                  <span>Uploaded by:</span>
                  <span className="text-slate-800 dark:text-slate-200">{doc.uploadedBy}</span>
                </div>
                <div className="flex justify-between">
                  <span>Uploaded on:</span>
                  <span className="text-slate-800 dark:text-slate-200">{doc.uploadDate}</span>
                </div>
                <div className="flex justify-between">
                  <span>Access Permission:</span>
                  <span className="text-teal-600 dark:text-teal-400 font-semibold">{doc.accessRole.toUpperCase()}</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={() => handleDownloadDocument(doc)}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 flex items-center gap-1.5"
              >
                {downloadedDocId === doc.id ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-600 dark:text-emerald-400">Downloaded!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Secure File</span>
                  </>
                )}
              </button>

              <span className="text-[10px] text-slate-500 font-mono">Encrypted</span>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Document Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-2xl overflow-hidden my-8">
            <div className="p-5 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-serif">Upload HR Document</h3>
              <button onClick={() => setUploadModalOpen(false)} className="p-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpload} className="p-6 space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Document Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Remote Work Policy 2026 Addendum"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                  <select
                    value={docCategory}
                    onChange={(e) => setDocCategory(e.target.value as DocumentItem['category'])}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
                  >
                    <option value="HR Policies">HR Policies</option>
                    <option value="Employee Handbook">Employee Handbook</option>
                    <option value="Employment Contracts">Employment Contracts</option>
                    <option value="Salary Documents">Salary Documents</option>
                    <option value="Performance Documents">Performance Documents</option>
                    <option value="Compliance Documents">Compliance Documents</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">File Format</label>
                  <select
                    value={docType}
                    onChange={(e) => setDocType(e.target.value as DocumentItem['fileType'])}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
                  >
                    <option value="PDF">PDF</option>
                    <option value="DOCX">DOCX (Word)</option>
                    <option value="XLSX">XLSX (Excel)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Access Role Permission</label>
                <select
                  value={accessRole}
                  onChange={(e) => setAccessRole(e.target.value as DocumentItem['accessRole'])}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
                >
                  <option value="all">All Organization Staff</option>
                  <option value="admin_only">Client Admin & Super Admin Only</option>
                  <option value="consultant_only">Consultant Advisory Only</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl"
                >
                  Confirm Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
