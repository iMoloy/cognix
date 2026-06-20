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
            <thead className="border-b border-white/5 bg-white/[0.02] text-xs uppercase text-zinc-500">
              <tr>
                <th className="px-6 py-4 font-bold tracking-wider">Prompt Name</th>
                <th className="px-6 py-4 font-bold tracking-wider">AI Tool</th>
                <th className="px-6 py-4 font-bold tracking-wider">Status</th>
                <th className="px-6 py-4 font-bold tracking-wider">Copies</th>
                <th className="px-6 py-4 font-bold tracking-wider">Date Added</th>
                <th className="px-6 py-4 text-right font-bold tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {mockMyPrompts.map((prompt) => (
                <tr key={prompt._id} className="transition-colors hover:bg-white/[0.02]">
                  <td className="whitespace-nowrap px-6 py-5 font-bold text-white">
                    {prompt.title}
                  </td>
                  <td className="whitespace-nowrap px-6 py-5">
                    <span className="inline-flex items-center rounded-lg border border-white/10 bg-black/20 px-2.5 py-1 text-xs font-medium text-zinc-300">
                      {prompt.aiTool}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-5">
                    {prompt.status === "approved" ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                        <CheckCircle2 size={12} /> Approved
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-500">
                        <Clock size={12} /> Pending Review
                      </span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-5 text-zinc-300">
                    <span className="font-mono font-bold">{prompt.copyCount}</span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-5 text-xs text-zinc-500">
                    {prompt.dateAdded}
                  </td>
                  <td className="whitespace-nowrap px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        title="View Analytics"
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-zinc-400 transition-colors hover:bg-cyan-500/10 hover:text-cyan-400"
                      >
                        <BarChart2 size={16} />
                      </button>
                      <button 
                        title="Edit Prompt"
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-zinc-400 transition-colors hover:bg-emerald-500/10 hover:text-emerald-400"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        title="Delete Prompt"
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-zinc-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
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
