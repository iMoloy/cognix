"use client";

import { useState } from "react";
import { CheckCircle, XCircle, Search, Clock, FileText, Eye, Star, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// Mock Data for Admin Queue
const initialPrompts = [
  {
    id: "p1",
    title: "Next.js 15 App Router Boilerplate",
    author: "Alex Dev",
    category: "Engineering",
    date: "Just now",
    status: "pending",
    featured: false
  },
  {
    id: "p2",
    title: "Advanced Tailwind Animation Classes",
    author: "Sarah UI",
    category: "Design",
    date: "2 hours ago",
    status: "pending",
    featured: false
  },
  {
    id: "p3",
    title: "MongoDB Aggregation Pipeline Builder",
    author: "DB Wizard",
    category: "Engineering",
    date: "1 day ago",
    status: "approved",
    featured: true
  },
  {
    id: "p4",
    title: "Spammy SEO Keywords List",
    author: "Unknown Hacker",
    category: "Marketing",
    date: "2 days ago",
    status: "rejected",
    featured: false
  }
];

export default function AdminPromptsQueuePage() {
  const [prompts, setPrompts] = useState(initialPrompts);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all"); // 'all', 'pending', 'approved', 'rejected'

  const handleStatusChange = (id, newStatus) => {
    setPrompts(prev => 
      prev.map(prompt => 
        prompt.id === id ? { ...prompt, status: newStatus } : prompt
      )
    );
  };

  const handleToggleFeature = (id) => {
    setPrompts(prev => 
      prev.map(prompt => 
        prompt.id === id ? { ...prompt, featured: !prompt.featured } : prompt
      )
    );
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this prompt?")) {
      setPrompts(prev => prev.filter(prompt => prompt.id !== id));
    }
  };

  const filteredPrompts = prompts.filter(prompt => {
    const matchesSearch = prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          prompt.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === "all" || prompt.status === filter;
    return matchesSearch && matchesFilter;
  });

  const pendingCount = prompts.filter(p => p.status === "pending").length;

  return (
    <div className="space-y-8 pb-20">
      
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <FileText className="text-emerald-400" />
            Prompt Moderation Queue
          </h1>
          <p className="mt-2 text-zinc-400">Review submitted prompts, feature the best ones, and manage marketplace content.</p>
        </div>

        {/* Stats Snippet */}
        <div className="flex items-center gap-4">
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-2 text-sm font-bold text-amber-400 backdrop-blur-md">
            <span className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500"></span>
              </span>
              {pendingCount} Pending Review
            </span>
          </div>
        </div>
      </div>

      {/* Controls: Search & Filter */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-white/10 bg-zinc-900/40 p-4 backdrop-blur-xl">
        <div className="relative w-full sm:max-w-md">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search by title or author..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-zinc-950/50 py-2.5 pl-11 pr-4 text-sm text-white placeholder-zinc-500 outline-none transition-all focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {["all", "pending", "approved", "rejected"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-4 py-2 text-xs font-bold capitalize whitespace-nowrap transition-all ${
                filter === f 
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" 
                  : "bg-white/5 text-zinc-400 border border-transparent hover:bg-white/10 hover:text-white"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Queue List */}
      <div className="rounded-2xl border border-white/10 bg-zinc-900/40 overflow-hidden backdrop-blur-xl shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-400">
            <thead className="border-b border-white/5 bg-white/[0.02] text-xs font-bold uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="px-6 py-4">Prompt Title</th>
                <th className="px-6 py-4">Author</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Featured</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence>
                {filteredPrompts.length === 0 ? (
                  <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <td colSpan={5} className="px-6 py-16 text-center">
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-zinc-800/50 border border-white/5">
                        <CheckCircle size={24} className="text-emerald-500/50" />
                      </div>
                      <h3 className="mt-4 text-lg font-bold text-white">All caught up!</h3>
                      <p className="mt-1 text-sm text-zinc-500">No prompts match your current filters.</p>
                    </td>
                  </motion.tr>
                ) : (
                  filteredPrompts.map((prompt) => (
                    <motion.tr 
                      key={prompt.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="group transition-colors hover:bg-white/[0.02]"
                    >
                      <td className="px-6 py-5">
                        <div className="font-bold text-white flex items-center gap-2">
                          {prompt.title}
                          {prompt.category && (
                            <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-zinc-400">
                              {prompt.category}
                            </span>
                          )}
                        </div>
                        <div className="mt-1 flex items-center gap-1.5 text-xs text-zinc-500">
                          <Clock size={12} /> Submitted {prompt.date}
                        </div>
                      </td>
                      <td className="px-6 py-5 font-medium text-zinc-300">
                        {prompt.author}
                      </td>
                      <td className="px-6 py-5">
                        {prompt.status === "pending" && (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" /> Pending
                          </span>
                        )}
                        {prompt.status === "approved" && (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                            <CheckCircle size={12} /> Approved
                          </span>
                        )}
                        {prompt.status === "rejected" && (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/20 bg-rose-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-rose-400">
                            <XCircle size={12} /> Rejected
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-5">
                        <button 
                          onClick={() => handleToggleFeature(prompt.id)}
                          disabled={prompt.status !== "approved"}
                          className={`flex items-center gap-1 transition-all ${
                            prompt.featured 
                              ? "text-amber-400 hover:text-amber-500" 
                              : prompt.status === "approved" 
                                ? "text-zinc-600 hover:text-amber-400/50"
                                : "text-zinc-800 cursor-not-allowed"
                          }`}
                          title={prompt.status !== "approved" ? "Must be approved to feature" : "Toggle Featured Status"}
                        >
                          <Star size={18} className={prompt.featured ? "fill-amber-400" : ""} />
                          <span className="text-xs font-bold">{prompt.featured ? "Yes" : "No"}</span>
                        </button>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          
                          {/* View Action */}
                          <Link 
                            href={`/prompts/1`} // Assuming ID 1 for preview in UI
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white transition-colors"
                            title="Preview Prompt"
                          >
                            <Eye size={16} />
                          </Link>

                          {/* Approve Action */}
                          {prompt.status !== "approved" && (
                            <button 
                              onClick={() => handleStatusChange(prompt.id, "approved")}
                              title="Approve"
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 transition-all hover:bg-emerald-500/20 hover:scale-110"
                            >
                              <CheckCircle size={16} />
                            </button>
                          )}

                          {/* Reject Action */}
                          {prompt.status !== "rejected" && (
                            <button 
                              onClick={() => handleStatusChange(prompt.id, "rejected")}
                              title="Reject"
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-rose-500/20 bg-rose-500/10 text-rose-400 transition-all hover:bg-rose-500/20 hover:scale-110"
                            >
                              <XCircle size={16} />
                            </button>
                          )}

                          {/* Delete Action */}
                          <button 
                            onClick={() => handleDelete(prompt.id)}
                            title="Delete permanently"
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-zinc-500 transition-colors hover:bg-rose-500/10 hover:text-rose-400 ml-2"
                          >
                            <Trash2 size={16} />
                          </button>
                          
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
