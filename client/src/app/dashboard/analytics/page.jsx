"use client";

import { useState } from "react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';
import { Users, FileText, Bookmark, Eye, TrendingUp, Shield } from "lucide-react";

// Mock Data
const promptGrowthData = [
  { name: 'Mon', prompts: 4 },
  { name: 'Tue', prompts: 7 },
  { name: 'Wed', prompts: 12 },
  { name: 'Thu', prompts: 18 },
  { name: 'Fri', prompts: 25 },
  { name: 'Sat', prompts: 30 },
  { name: 'Sun', prompts: 42 },
];

const platformActivityData = [
  { name: 'Week 1', users: 120, prompts: 45, reviews: 30 },
  { name: 'Week 2', users: 250, prompts: 80, reviews: 65 },
  { name: 'Week 3', users: 400, prompts: 150, reviews: 110 },
  { name: 'Week 4', users: 600, prompts: 220, reviews: 180 },
];

export default function AnalyticsPage() {
  const [activeRole, setActiveRole] = useState("admin"); // Mock role state for preview

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
          <p className="mt-4 text-3xl font-black text-white">42</p>
          <div className="mt-2 flex items-center gap-1 text-xs font-bold text-emerald-400">
            <TrendingUp size={14} /> +12% from last week
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-400">Total Copies</h3>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
              <Eye size={20} />
            </div>
          </div>
          <p className="mt-4 text-3xl font-black text-white">1,248</p>
          <div className="mt-2 flex items-center gap-1 text-xs font-bold text-emerald-400">
            <TrendingUp size={14} /> +8% from last week
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-400">Total Bookmarks</h3>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
              <Bookmark size={20} />
            </div>
          </div>
          <p className="mt-4 text-3xl font-black text-white">356</p>
          <div className="mt-2 flex items-center gap-1 text-xs font-bold text-emerald-400">
            <TrendingUp size={14} /> +24% from last week
          </div>
        </div>
      </div>

      {/* Creator Charts */}
      <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-6 backdrop-blur-xl">
        <h3 className="mb-6 text-lg font-bold text-white">Prompt Growth (Last 7 Days)</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={promptGrowthData}>
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
          <p className="mt-4 text-3xl font-black text-white">1,842</p>
          <div className="mt-2 flex items-center gap-1 text-xs font-bold text-emerald-400">
            <TrendingUp size={14} /> +18% this month
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-400">Total Prompts</h3>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <FileText size={20} />
            </div>
          </div>
          <p className="mt-4 text-3xl font-black text-white">4,209</p>
          <div className="mt-2 flex items-center gap-1 text-xs font-bold text-emerald-400">
            <TrendingUp size={14} /> +32% this month
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-400">Total Revenue</h3>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
              <span className="font-bold">$</span>
            </div>
          </div>
          <p className="mt-4 text-3xl font-black text-white">$4,500</p>
          <div className="mt-2 flex items-center gap-1 text-xs font-bold text-emerald-400">
            <TrendingUp size={14} /> +15% this month
          </div>
        </div>
      </div>

      {/* Admin Charts */}
      <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-6 backdrop-blur-xl">
        <h3 className="mb-6 text-lg font-bold text-white">Platform Activity Overview</h3>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={platformActivityData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
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

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Analytics</h1>
          <p className="mt-2 text-zinc-400">Analyze performance and track key metrics.</p>
        </div>
        
        {/* Local Role Switcher for Analytics Page Demo */}
        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-zinc-900/40 p-1 backdrop-blur-md">
          <button 
            onClick={() => setActiveRole("creator")}
            className={`rounded-lg px-4 py-2 text-sm font-bold transition-all ${activeRole === "creator" ? "bg-emerald-500/20 text-emerald-400" : "text-zinc-500 hover:text-emerald-400"}`}
          >
            Creator View
          </button>
          <button 
            onClick={() => setActiveRole("admin")}
            className={`rounded-lg px-4 py-2 text-sm font-bold transition-all ${activeRole === "admin" ? "bg-emerald-500/20 text-emerald-400" : "text-zinc-500 hover:text-emerald-400"}`}
          >
            Admin View
          </button>
        </div>
      </div>

      {activeRole === "creator" ? renderCreatorAnalytics() : renderAdminAnalytics()}
    </div>
  );
}
