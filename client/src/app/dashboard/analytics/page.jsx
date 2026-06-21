"use client";

import { useState, useEffect } from "react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';
import { Users, FileText, Bookmark, Eye, TrendingUp, Loader2, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";

export default function AnalyticsPage() {
  const { user, token, loading: authLoading } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use the actual user role instead of mock state
  // Fallback to "creator" if user is "creator" or "admin", but here admin is separate.
  const activeRole = user?.role || "user";

  useEffect(() => {
    const fetchAnalytics = async () => {
      // Don't try fetching until auth is completely resolved
      if (authLoading) return;
      
      // If no user or token after auth resolves, we can't fetch
      if (!user || !token) {
        setLoading(false);
        setError("You must be logged in to view analytics.");
        return;
      }
      
      try {
        setLoading(true);
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        
        let url = `${API_URL}/api/analytics`;
        // If user is creator, fetch their specific stats. If admin, fetch global stats.
        if (activeRole === "creator") {
          url += `?creatorId=${user._id}`;
        }

        const res = await fetch(url, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (res.ok) {
          const result = await res.json();
          setData(result);
          setError(null);
        } else {
          const errData = await res.json().catch(() => ({}));
          console.error("Failed to fetch analytics", res.status, errData);
          const errorMsg = `Failed to fetch analytics (Status ${res.status})`;
          setError(errorMsg);
          toast.error(errorMsg);
        }
      } catch (err) {
        console.error("Error fetching analytics:", err);
        const errorMsg = "Network error or server unreachable";
        setError(errorMsg);
        toast.error(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [user, token, activeRole, authLoading]);

  if (loading) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-emerald-400" />
          <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest animate-pulse">Loading Analytics</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
          </div>
          <h2 className="text-xl font-bold text-white">Error Loading Analytics</h2>
          <p className="text-zinc-400">{error || "No data received from server."}</p>
        </div>
      </div>
    );
  }

  const renderCreatorAnalytics = () => (
    <div className="space-y-8">
      {/* Creator Summary Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-400">Total Prompts</h3>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <FileText size={20} />
            </div>
          </div>
          <p className="mt-4 text-3xl font-black text-white">{data.totalPrompts || 0}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-400">Total Copies</h3>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
              <Eye size={20} />
            </div>
          </div>
          <p className="mt-4 text-3xl font-black text-white">{data.totalCopies || 0}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-400">Total Bookmarks</h3>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
              <Bookmark size={20} />
            </div>
          </div>
          <p className="mt-4 text-3xl font-black text-white">{data.totalBookmarks || 0}</p>
        </div>
      </div>

      {/* Creator Charts */}
      <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-6 backdrop-blur-xl">
        <h3 className="mb-6 text-lg font-bold text-white">Prompt Growth (Mocked)</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.promptGrowthData || []}>
              <defs>
                <linearGradient id="colorPrompts" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34d399" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
              <XAxis dataKey="name" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#18181b', borderColor: '#ffffff20', borderRadius: '12px' }}
                itemStyle={{ color: '#34d399', fontWeight: 'bold' }}
              />
              <Area type="monotone" dataKey="prompts" stroke="#34d399" strokeWidth={3} fillOpacity={1} fill="url(#colorPrompts)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderAdminAnalytics = () => (
    <div className="space-y-8">
      {/* Admin Summary Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-400">Total Users</h3>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
              <Users size={20} />
            </div>
          </div>
          <p className="mt-4 text-3xl font-black text-white">{data.totalUsers || 0}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-400">Total Prompts</h3>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <FileText size={20} />
            </div>
          </div>
          <p className="mt-4 text-3xl font-black text-white">{data.totalPrompts || 0}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-400">Total Revenue</h3>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
              <span className="font-bold">$</span>
            </div>
          </div>
          <p className="mt-4 text-3xl font-black text-white">${data.totalRevenue || 0}</p>
        </div>
      </div>

      {/* Admin Charts */}
      <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-6 backdrop-blur-xl">
        <h3 className="mb-6 text-lg font-bold text-white">Platform Activity Overview (Mocked)</h3>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.platformActivityData || []} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
              <XAxis dataKey="name" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#18181b', borderColor: '#ffffff20', borderRadius: '12px' }}
                cursor={{ fill: '#ffffff05' }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar dataKey="users" name="New Users" fill="#a855f7" radius={[4, 4, 0, 0]} />
              <Bar dataKey="prompts" name="New Prompts" fill="#34d399" radius={[4, 4, 0, 0]} />
              <Bar dataKey="reviews" name="New Reviews" fill="#22d3ee" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  if (activeRole === "user") {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <div className="text-center space-y-4">
          <Shield className="mx-auto h-12 w-12 text-zinc-500" />
          <h2 className="text-xl font-bold text-white">Access Denied</h2>
          <p className="text-zinc-400">You must be a Creator or Admin to view analytics.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Analytics</h1>
          <p className="mt-2 text-zinc-400">Analyze performance and track key metrics.</p>
        </div>
        
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2">
          <span className="text-sm font-bold text-emerald-400 capitalize">{activeRole} View Active</span>
        </div>
      </div>

      {activeRole === "creator" ? renderCreatorAnalytics() : renderAdminAnalytics()}
    </div>
  );
}
