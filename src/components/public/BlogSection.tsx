import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BlogPost } from '../../types';
import {
  BookOpen,
  Calendar,
  Clock,
  ArrowRight,
  X,
  Tag,
} from 'lucide-react';

export const BlogSection: React.FC = () => {
  const { blogPosts, currentPath, navigateTo } = useApp();
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(() => {
    const parts = window.location.pathname.split('/').filter(Boolean);
    if (parts[0] === 'blog' && parts[1]) {
      return blogPosts.find((p) => p.slug === parts[1] || p.id === parts[1]) || null;
    }
    return null;
  });
  const [activeCategory, setActiveCategory] = useState<string>('All');

  React.useEffect(() => {
    const parts = currentPath.split('/').filter(Boolean);
    if (parts[0] === 'blog' && parts[1]) {
      const matched = blogPosts.find((p) => p.slug === parts[1] || p.id === parts[1]);
      if (matched) setSelectedPost(matched);
    } else if (selectedPost && !currentPath.startsWith('/blog/')) {
      setSelectedPost(null);
    }
  }, [currentPath, blogPosts]);

  const handleOpenPost = (post: BlogPost) => {
    setSelectedPost(post);
    const nextPath = `/blog/${post.slug}`;
    if (window.location.pathname !== nextPath) {
      window.history.pushState({}, '', nextPath);
    }
  };

  const handleClosePost = () => {
    setSelectedPost(null);
    if (window.location.pathname.startsWith('/blog/')) {
      navigateTo('/blog');
    }
  };

  const categories = [
    'All',
    'Recruitment & Talent Acquisition',
    'Labour & Compliance',
    'Performance Management',
    'Digital HR',
  ];

  const filteredPosts =
    activeCategory === 'All'
      ? blogPosts
      : blogPosts.filter((p) => p.category === activeCategory);

  return (
    <section id="blog-section" className="bg-white dark:bg-slate-900 py-24 border-t border-slate-200 dark:border-slate-800 relative transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30 text-xs font-semibold uppercase tracking-wider mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            Knowledge & Advisory Hub
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white font-serif tracking-tight">
            Strategic Insights on People, Labor Law & Talent
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-300 text-base sm:text-lg">
            Authored by our practicing legal consultants, senior recruiters, and compensation architects.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  activeCategory === cat
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              onClick={() => handleOpenPost(post)}
              className="rounded-3xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 hover:border-blue-400/60 dark:hover:border-blue-600/60 hover:bg-white dark:hover:bg-slate-950 transition-all overflow-hidden flex flex-col justify-between group cursor-pointer shadow-md hover:shadow-xl dark:shadow-lg"
            >
              <div>
                <div className="h-56 overflow-hidden relative">
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md text-[11px] font-semibold text-teal-300 border border-teal-500/30">
                      {post.category}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-950/75 text-[10px] font-mono text-slate-300 border border-slate-700">
                      /blog/{post.slug}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                      <span>{post.publishDate}</span>
                    </span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                      <span>{post.readTime}</span>
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white font-serif mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed mb-4">
                    {post.summary}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2 border-t border-slate-200 dark:border-slate-900 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={post.authorAvatar}
                    alt={post.author}
                    className="w-7 h-7 rounded-full object-cover border border-slate-300 dark:border-slate-700"
                  />
                  <div>
                    <span className="text-xs font-semibold text-slate-900 dark:text-white block">{post.author}</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block">{post.authorRole}</span>
                  </div>
                </div>

                <span className="text-xs font-semibold text-teal-600 dark:text-teal-400 group-hover:text-teal-700 dark:group-hover:text-teal-300 flex items-center gap-1">
                  <span>Read</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Article Reader Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 dark:bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
            <div className="p-6 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30 text-xs font-semibold">
                {selectedPost.category}
              </span>
              <button
                onClick={handleClosePost}
                className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-serif">
                {selectedPost.title}
              </h2>

              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedPost.authorAvatar}
                    alt={selectedPost.author}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-white">{selectedPost.author}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{selectedPost.authorRole}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div>{selectedPost.publishDate}</div>
                  <div>{selectedPost.readTime}</div>
                </div>
              </div>

              <div className="rounded-2xl overflow-hidden h-64">
                <img
                  src={selectedPost.featuredImage}
                  alt={selectedPost.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-4 whitespace-pre-line">
                {selectedPost.content}
              </div>

              <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" />
                  <span>Tags:</span>
                </span>
                {selectedPost.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 text-[11px] border border-slate-200 dark:border-slate-800"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end">
              <button
                onClick={handleClosePost}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
