"use client";

import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Search, Clock, FileText, Eye, Star, Trash2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";

export default function AdminPromptsQueuePage() {
  const [prompts, setPrompts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  
  // Rejection Modal State
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectingPromptId, setRejectingPromptId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const { token } = useAuth();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const fetchPrompts = async () => {
    try {
      const res = await fetch(`${API_URL}/api/prompts/admin/all`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const mappedData = data.map(p => ({
          ...p,
          id: p._id,
          author: p.author?.name || "Unknown",
          date: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "N/A",
          status: p.status || "approved", // legacy prompts without status are approved
          featured: p.featured || false
        }));
        setPrompts(mappedData);
      } else {
        toast.error("Failed to fetch prompts");
      }
    } catch (error) {
      console.error("Failed to fetch admin prompts", error);
      toast.error("Failed to fetch admin prompts");
    } finally {
      setIsLoading(false);
    }
  };

  /* eslint-disable */
  useEffect(() => {
    if (token) fetchPrompts();
  }, [token]);
  /* eslint-enable */

  const handleStatusChange = async (id, newStatus, reason = "") => {
    const prevPrompts = [...prompts];
    setPrompts(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
    
    try {
      const payload = { status: newStatus };
      if (newStatus === "rejected" && reason) {
        payload.rejectionReason = reason;
      }

      const res = await fetch(`${API_URL}/api/prompts/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Failed");
      toast.success(`Prompt marked as ${newStatus}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update prompt status");
      setPrompts(prevPrompts);
    }
  };

  const handleRejectSubmit = () => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a rejection reason.");
      return;
    }
    handleStatusChange(rejectingPromptId, "rejected", rejectionReason);
    setIsRejectModalOpen(false);
    setRejectingPromptId(null);
    setRejectionReason("");
  };

  const closeRejectModal = () => {
    setIsRejectModalOpen(false);
    setRejectingPromptId(null);
    setRejectionReason("");
  };

  const handleToggleFeature = async (id) => {
    const promptToToggle = prompts.find(p => p.id === id);
    if (!promptToToggle || promptToToggle.status !== "approved") return;

    const newFeatured = !promptToToggle.featured;
    const prevPrompts = [...prompts];
    
    setPrompts(prev => prev.map(p => p.id === id ? { ...p, featured: newFeatured } : p));
    
    try {
      const res = await fetch(`${API_URL}/api/prompts/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ featured: newFeatured })
      });
      if (!res.ok) throw new Error("Failed");
      toast.success(newFeatured ? "Prompt featured!" : "Prompt unfeatured");
    } catch (error) {
      console.error(error);
      toast.error("Failed to toggle feature status");
      setPrompts(prevPrompts);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this prompt?")) return;
    
    try {
      const res = await fetch(`${API_URL}/api/prompts/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        setPrompts(prev => prev.filter(p => p.id !== id));
        toast.success("Prompt deleted successfully");
      } else {
        toast.error("Failed to delete prompt");
      }
    } catch (error) {
      console.error("Failed to delete", error);
      toast.error("Failed to delete prompt");
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
                  : "bg-white/5 text-zinc-400 border border-transparent hover:bg-white/10 hover:text-emerald-400"
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
                {isLoading ? (
                  <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <td colSpan={5} className="px-6 py-16 text-center">
                      <Loader2 className="mx-auto h-8 w-8 animate-spin text-emerald-500 mb-4" />
                      <h3 className="text-lg font-bold text-white">Loading Queue...</h3>
                    </td>
                  </motion.tr>
                ) : filteredPrompts.length === 0 ? (
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
                            href={`/prompts/${prompt.id}`}
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-emerald-400 transition-colors"
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
                              onClick={() => {
                                setRejectingPromptId(prompt.id);
                                setIsRejectModalOpen(true);
                              }}
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

      {/* Rejection Modal */}
      <AnimatePresence>
        {isRejectModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0a0a0a] shadow-2xl p-6"
            >
              <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <XCircle className="text-rose-500" />
                Reject Prompt
              </h3>
              <p className="text-sm text-zinc-400 mb-6">
                Please provide a reason for rejecting this prompt. The creator will see this feedback.
              </p>
              
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. Prompt instructions are too vague..."
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none focus:border-rose-500/50 min-h-[100px] resize-y mb-6"
              />
              
              <div className="flex justify-end gap-3">
                <button 
                  onClick={closeRejectModal}
                  className="px-4 py-2 text-sm font-bold text-zinc-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleRejectSubmit}
                  className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-sm font-bold shadow-lg shadow-rose-500/20 transition-all hover:scale-105"
                >
                  Confirm Rejection
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
