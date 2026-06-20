"use client";

import { CheckCircle2, XCircle, Trash2, Star, Clock } from "lucide-react";
import { useState } from "react";

const mockPrompts = [
  { _id: "p1", title: "Next.js API Route Architect", author: "Alex Dev", status: "pending", featured: false },
  { _id: "p2", title: "SaaS Landing Page Copywriter", author: "Sarah Copy", status: "approved", featured: true },
  { _id: "p3", title: "Python Data Analyst", author: "John Doe", status: "rejected", featured: false },
];

export default function AllPromptsPage() {
  const [prompts, setPrompts] = useState(mockPrompts);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Manage Prompts</h1>
        <p className="mt-2 text-zinc-400">Review submitted prompts, feature the best ones, and manage marketplace content.</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/40 shadow-2xl backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-400">
            <thead className="border-b border-white/5 bg-white/[0.02] text-xs uppercase text-zinc-500">
              <tr>
                <th className="px-6 py-4 font-bold tracking-wider">Prompt Title</th>
                <th className="px-6 py-4 font-bold tracking-wider">Author</th>
                <th className="px-6 py-4 font-bold tracking-wider">Status</th>
                <th className="px-6 py-4 font-bold tracking-wider">Featured</th>
                <th className="px-6 py-4 text-right font-bold tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {prompts.map((prompt) => (
                <tr key={prompt._id} className="transition-colors hover:bg-white/[0.02]">
                  <td className="whitespace-nowrap px-6 py-5 font-bold text-white">
                    {prompt.title}
                  </td>
                  <td className="whitespace-nowrap px-6 py-5">
                    {prompt.author}
                  </td>
                  <td className="whitespace-nowrap px-6 py-5">
                    {prompt.status === "approved" ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                        <CheckCircle2 size={12} /> Approved
                      </span>
                    ) : prompt.status === "rejected" ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/20 bg-red-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-red-400">
                        <XCircle size={12} /> Rejected
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-500">
                        <Clock size={12} /> Pending
                      </span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-5">
                    {prompt.featured ? (
                      <span className="inline-flex items-center gap-1 text-amber-400">
                        <Star size={16} className="fill-amber-400" /> Yes
                      </span>
                    ) : (
                      <span className="text-zinc-500">No</span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        title="Approve"
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-zinc-400 transition-colors hover:bg-emerald-500/10 hover:text-emerald-400"
                      >
                        <CheckCircle2 size={16} />
                      </button>
                      <button 
                        title="Reject"
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-zinc-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
                      >
                        <XCircle size={16} />
                      </button>
                      <button 
                        title="Feature Prompt"
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-zinc-400 transition-colors hover:bg-amber-500/10 hover:text-amber-400"
                      >
                        <Star size={16} />
                      </button>
                      <button 
                        title="Delete"
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
