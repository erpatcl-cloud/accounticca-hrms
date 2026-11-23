import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, BookOpen, Star, X } from 'lucide-react';

export const CmsManager: React.FC = () => {
  const { blogPosts, addBlogPost, testimonials } = useApp();
  const [modalOpen, setModalOpen] = useState(false);

  // New Blog form
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Recruitment & Talent Acquisition');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [readTime] = useState('5 min read');

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    addBlogPost({
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category,
      summary,
      content,
      author: 'Ekramul Haque',
      authorRole: 'Managing Director & Principal Consultant',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      publishDate: new Date().toISOString().split('T')[0],
      readTime,
      tags: ['HR Strategy', 'Compliance', 'Executive Advisory'],
      featuredImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800',
    });
    setModalOpen(false);
    setTitle('');
    setSummary('');
    setContent('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-serif tracking-tight">
            Website Content Management System (CMS)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage public advisory articles, case studies, and corporate testimonials without code
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-md flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Publish New Knowledge Article</span>
        </button>
      </div>

      {/* Published Blog Articles */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm dark:shadow-none">
        <h3 className="text-base font-bold text-slate-900 dark:text-white font-serif flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          <span>Live Knowledge Hub Articles ({blogPosts.length})</span>
        </h3>

        <div className="space-y-3">
          {blogPosts.map((post) => (
            <div
              key={post.id}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4"
            >
              <div>
                <span className="text-[10px] font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider block">
                  {post.category}
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{post.title}</h4>
                <div className="text-xs text-slate-500 mt-1">
                  By {post.author} &bull; {post.publishDate} &bull; {post.readTime}
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
                Live & Indexed
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials Management */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm dark:shadow-none">
        <h3 className="text-base font-bold text-slate-900 dark:text-white font-serif flex items-center gap-2">
          <Star className="w-4 h-4 text-amber-500 dark:text-amber-400" />
          <span>Approved Client Testimonials ({testimonials.length})</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testimonials.map((t) => (
            <div key={t.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-900 dark:text-white">{t.name} ({t.position})</span>
                <span className="text-amber-600 dark:text-amber-400 font-bold">{t.rating} Stars</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 italic">"{t.content}"</p>
              <div className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold">{t.company} ({t.industry})</div>
            </div>
          ))}
        </div>
      </div>

      {/* New Blog Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
          <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-2xl overflow-hidden my-8">
            <div className="p-5 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-serif">Publish Advisory Article</h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="p-6 space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Article Headline *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Navigating Multi-Jurisdiction Remote Worker Contracts"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
                >
                  <option value="Recruitment & Talent Acquisition">Recruitment & Talent Acquisition</option>
                  <option value="Labour & Compliance">Labour & Compliance</option>
                  <option value="Performance Management">Performance Management</option>
                  <option value="Payroll & Compensation">Payroll & Compensation</option>
                  <option value="Digital HR">Digital HR</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Executive Summary *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Short 2-line summary for preview cards..."
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Full Article Body *</label>
                <textarea
                  rows={5}
                  required
                  placeholder="Write the full strategic guidance..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white font-sans leading-relaxed"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl"
                >
                  Publish Live
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
