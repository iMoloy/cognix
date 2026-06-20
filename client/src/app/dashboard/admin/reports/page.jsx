"use client";

import { AlertTriangle, Trash2, CheckCircle2, MessageSquareWarning } from "lucide-react";
import { useState } from "react";

const mockReports = [
  { _id: "r1", promptTitle: "Crypto Trading Bot", reportedBy: "John Doe", reason: "Scam/Spam content", status: "pending" },
  { _id: "r2", promptTitle: "Bypass ChatGPT Restrictions", reportedBy: "Emma Smith", reason: "Violates safety guidelines", status: "pending" },
];

export default function ReportedPromptsPage() {
  const [reports, setReports] = useState(mockReports);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
          <AlertTriangle size={28} className="text-red-500" />
          Reported Prompts
        </h1>
        <p className="mt-2 text-zinc-400">Review prompts reported by users for violating marketplace guidelines.</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/40 shadow-2xl backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-400">
            <thead className="border-b border-white/5 bg-white/[0.02] text-xs uppercase text-zinc-500">
              <tr>
                <th className="px-6 py-4 font-bold tracking-wider">Prompt Title</th>
                <th className="px-6 py-4 font-bold tracking-wider">Reported By</th>
                <th className="px-6 py-4 font-bold tracking-wider">Reason</th>
                <th className="px-6 py-4 text-right font-bold tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {reports.map((report) => (
                <tr key={report._id} className="transition-colors hover:bg-white/[0.02]">
                  <td className="whitespace-nowrap px-6 py-5 font-bold text-white">
                    {report.promptTitle}
                  </td>
                  <td className="whitespace-nowrap px-6 py-5">
                    {report.reportedBy}
                  </td>
                  <td className="whitespace-nowrap px-6 py-5 text-red-400">
                    {report.reason}
                  </td>
                  <td className="whitespace-nowrap px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        title="Dismiss Report"
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-zinc-400 transition-colors hover:bg-emerald-500/10 hover:text-emerald-400"
                      >
                        <CheckCircle2 size={16} />
                      </button>
                      <button 
                        title="Warn Creator"
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-zinc-400 transition-colors hover:bg-amber-500/10 hover:text-amber-400"
                      >
                        <MessageSquareWarning size={16} />
                      </button>
                      <button 
                        title="Remove Prompt"
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
