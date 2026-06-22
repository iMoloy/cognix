"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Shield, ShieldAlert, ShieldCheck, ExternalLink, Search, Trash2, CheckCircle2, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";

export default function AdminReportsPage() {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const { token } = useAuth();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const fetchReports = async () => {
    try {
      const res = await fetch(`${API_URL}/api/reports`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setReports(data);
      } else {
        toast.error("Failed to load reports");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load reports");
    } finally {
      setIsLoading(false);
    }
  };

  /* eslint-disable */
  useEffect(() => {
    if (token) fetchReports();
  }, [token]);
  /* eslint-enable */

  const handleDismiss = async (reportId) => {
    try {
      const res = await fetch(`${API_URL}/api/reports/${reportId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        setReports(prev => prev.filter(r => r._id !== reportId));
        toast.success("Report dismissed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to dismiss report");
    }
  };

  const handleRemovePrompt = async (promptId, reportId) => {
    if (!confirm("Are you sure you want to completely remove this prompt from the platform?")) return;
    
    try {
      // 1. Delete the prompt
      const delRes = await fetch(`${API_URL}/api/prompts/${promptId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      
      if (!delRes.ok) throw new Error("Failed to delete prompt");

      // 2. Delete the report
      await fetch(`${API_URL}/api/reports/${reportId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      setReports(prev => prev.filter(r => r._id !== reportId));
      toast.success("Prompt removed and report resolved");
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove prompt");
    }
  };

  const filteredReports = reports.filter(r => 
    r.reason.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (r.promptId && r.promptId.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
          <AlertTriangle size={28} className="text-red-500" />
          Reported Prompts
        </h1>
        <p className="mt-2 text-zinc-400">Review prompts reported by users for violating marketplace guidelines.</p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search reports by reason or ID..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/40 py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-500 outline-none transition-all focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/50"
          />
        </div>
      </div>

      <div className="grid gap-6">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-zinc-900/20 py-20 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
              <ShieldCheck size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">All Clear!</h3>
            <p className="text-zinc-500 max-w-md">There are no pending reports. The community is safe and guidelines are being followed.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredReports.map((report) => (
              <div key={report._id} className="group relative overflow-hidden rounded-2xl border border-rose-500/10 bg-zinc-900/40 p-6 transition-all hover:border-rose-500/30 hover:bg-zinc-900/60">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/20 bg-rose-500/10 px-2.5 py-1 text-xs font-bold text-rose-400 uppercase tracking-wider">
                        <AlertTriangle size={14} />
                        {report.reason}
                      </span>
                      <span className="text-xs text-zinc-500">
                        Reported {new Date(report.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        Prompt ID: {report.promptId}
                        <button className="text-zinc-500 hover:text-white transition-colors">
                          <ExternalLink size={14} />
                        </button>
                      </h3>
                      <p className="mt-1 text-sm text-zinc-400">
                        <span className="font-medium text-zinc-300">Reported by {report.userEmail}:</span> {report.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 md:flex-col lg:flex-row">
                    <button 
                      onClick={() => handleDismiss(report._id)}
                      className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 rounded-xl bg-white/5 px-4 py-2.5 text-sm font-bold text-white transition-all hover:bg-white/10"
                    >
                      <CheckCircle2 size={16} className="text-emerald-400" />
                      Dismiss
                    </button>
                    <button 
                      onClick={() => handleRemovePrompt(report.promptId, report._id)}
                      className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 rounded-xl bg-rose-500 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-rose-500/20 transition-all hover:bg-rose-600 hover:scale-105"
                    >
                      <Trash2 size={16} />
                      Remove Prompt
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
