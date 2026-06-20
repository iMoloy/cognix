"use client";

import { Edit, Trash2, BarChart2, MoreVertical, CheckCircle2, Clock } from "lucide-react";
import Link from "next/link";

const mockMyPrompts = [
  {
    _id: "p1",
    title: "Senior React Developer Interview Simulator",
    aiTool: "ChatGPT",
    status: "approved",
    copyCount: 145,
    dateAdded: "Oct 12, 2026",
  },
  {
    _id: "p2",
    title: "SaaS Landing Page Copywriter",
    aiTool: "Claude",
    status: "pending",
    copyCount: 0,
    dateAdded: "Oct 24, 2026",
  },
  {
    _id: "p3",
    title: "Next.js App Router Master",
    aiTool: "ChatGPT",
    status: "approved",
    copyCount: 89,
    dateAdded: "Nov 01, 2026",
  }
];

export default function MyPromptsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">My Prompts</h1>
          <p className="mt-2 text-zinc-400">Manage and analyze the prompts you have contributed to the marketplace.</p>
        </div>
        
        <Link
          href="/dashboard/add-prompt"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-[length:200%_auto] animate-gradient-x px-6 text-sm font-bold text-zinc-950 shadow-md transition-all hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(52,211,153,0.25)]"
        >
          Add New Prompt
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/40 shadow-2xl backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-400">
            <thead className="border-b border-white/5 bg-white/[0.02] text-[10px] uppercase tracking-widest text-zinc-500">
              <tr>
                <th className="px-6 py-5 font-bold">Prompt Details</th>
                <th className="px-6 py-5 font-bold">AI Model</th>
                <th className="px-6 py-5 font-bold">Status</th>
                <th className="px-6 py-5 font-bold">Metrics</th>
                <th className="px-6 py-5 font-bold">Date Added</th>
                <th className="px-6 py-5 text-right font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {mockMyPrompts.map((prompt) => (
                <tr key={prompt._id} className="group transition-colors hover:bg-white/[0.02]">
                  
                  {/* Title Column (Wraps nicely on desktop) */}
                  <td className="px-6 py-6 w-1/3">
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-white text-base leading-snug group-hover:text-emerald-400 transition-colors">
                        {prompt.title}
                      </span>
                      <span className="text-xs text-zinc-500 md:hidden">
                        Added: {prompt.dateAdded}
                      </span>
                    </div>
                  </td>
                  
                  {/* AI Tool */}
                  <td className="whitespace-nowrap px-6 py-6">
                    <span className="inline-flex items-center rounded-lg border border-white/10 bg-black/40 px-3 py-1.5 text-xs font-medium text-zinc-300 shadow-inner">
                      {prompt.aiTool}
                    </span>
                  </td>
                  
                  {/* Status */}
                  <td className="whitespace-nowrap px-6 py-6">
                    {prompt.status === "approved" ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                        <CheckCircle2 size={12} /> Approved
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-500">
                        <Clock size={12} /> Pending
                      </span>
                    )}
                  </td>
                  
                  {/* Metrics */}
                  <td className="whitespace-nowrap px-6 py-6">
                    <div className="flex flex-col">
                      <span className="font-mono font-bold text-white text-sm">{prompt.copyCount}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Copies</span>
                    </div>
                  </td>
                  
                  {/* Date Added (Hidden on mobile as it's merged with title, shown on tablet/desktop) */}
                  <td className="whitespace-nowrap px-6 py-6 text-sm text-zinc-400 hidden md:table-cell">
                    {prompt.dateAdded}
                  </td>
                  
                  {/* Actions */}
                  <td className="whitespace-nowrap px-6 py-6 text-right">
                    <div className="flex items-center justify-end gap-1 sm:gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                      <button 
                        title="View Analytics"
                        className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-zinc-400 transition-colors hover:bg-cyan-500/10 hover:text-cyan-400 active:scale-95"
                      >
                        <BarChart2 size={16} />
                      </button>
                      <button 
                        title="Edit Prompt"
                        className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-zinc-400 transition-colors hover:bg-emerald-500/10 hover:text-emerald-400 active:scale-95"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        title="Delete Prompt"
                        className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-zinc-400 transition-colors hover:bg-red-500/10 hover:text-red-400 active:scale-95"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
