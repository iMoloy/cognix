"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle } from "lucide-react";

export default function ReportModal({ isOpen, onClose, promptTitle }) {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate API call
    console.log("Submitted Report:", { reason, details });
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md overflow-hidden rounded-2xl border border-rose-500/20 bg-[#0a0a0a] shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/5 bg-rose-500/5 px-6 py-4">
            <div className="flex items-center gap-2 text-lg font-bold text-rose-500">
              <AlertTriangle size={18} />
              Report Prompt
            </div>
            <button 
              onClick={onClose}
              className="rounded-full p-1.5 text-zinc-500 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="p-6">
            <p className="mb-6 text-sm text-zinc-400">
              Reporting <span className="font-bold text-zinc-300">{promptTitle}</span>. Our moderation team will review this shortly.
            </p>

            {/* Reason Select */}
            <div className="mb-6">
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-500">
                Reason for reporting
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-zinc-900/50 px-4 py-3 text-sm text-white outline-none transition-all focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/50"
                required
              >
                <option value="" disabled>Select a reason...</option>
                <option value="broken">Broken or incorrect instruction</option>
                <option value="inappropriate">Inappropriate content</option>
                <option value="spam">Spam or misleading</option>
                <option value="plagiarism">Plagiarism / Stolen Prompt</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Details Text */}
            <div className="mb-8">
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-500">
                Additional Details
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Please provide more context to help us investigate..."
                className="min-h-[100px] w-full rounded-xl border border-white/10 bg-zinc-900/50 p-4 text-sm text-white placeholder-zinc-600 outline-none transition-all focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/50"
                required
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl px-5 py-2.5 text-sm font-bold text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!reason || !details.trim()}
                className="rounded-xl bg-rose-500 px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-rose-600 disabled:opacity-50 disabled:hover:bg-rose-500"
              >
                Submit Report
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
