"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Key, Bookmark, WalletCards, ArrowRight, TrendingUp, Loader2 } from "lucide-react";
import Link from "next/link";
import PromptCard from "@/components/ui/PromptCard";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardOverviewPage() {
  const { user, token } = useAuth();
  const [statsData, setStatsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user || !token) return;
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://cognix-6lqn.onrender.com";
        const res = await fetch(`${apiUrl}/api/users/dashboard-stats/${user.email}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setStatsData(data);
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, [user, token]);

  if (isLoading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-emerald-400" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="space-y-8">
      
      {/* Header & Profile */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Welcome back, {user.name.split(" ")[0]}</h1>
          <p className="mt-2 text-zinc-400">Here&apos;s what&apos;s happening with your prompt engineering arsenal.</p>
        </div>
        
        <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-zinc-900/40 p-4 backdrop-blur-xl">
          <img 
             src={user.photoURL} 
             alt={user.name} 
             className={`h-12 w-12 rounded-full object-cover bg-zinc-800 ${user.subscription === 'premium' ? 'ring-2 ring-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.4)]' : 'border border-white/10'}`}
          />
          <div>
            <div className="font-bold text-white">{user.name}</div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-zinc-400">Member since {statsData?.joinDate}</span>
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                {user.subscription}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-3">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl border border-white/10 bg-zinc-900/40 p-6 backdrop-blur-xl"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <Key size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-zinc-500">Unlocked Prompts</p>
              <h3 className="text-2xl font-extrabold text-white">{statsData?.stats?.unlocked ?? 0}</h3>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="rounded-2xl border border-white/10 bg-zinc-900/40 p-6 backdrop-blur-xl"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
              <Bookmark size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-zinc-500">Saved to Library</p>
              <h3 className="text-2xl font-extrabold text-white">{statsData?.stats?.saved ?? 0}</h3>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="rounded-2xl border border-white/10 bg-zinc-900/40 p-6 backdrop-blur-xl"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
              <WalletCards size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-zinc-500">Total Spend</p>
              <h3 className="text-2xl font-extrabold text-white">${statsData?.stats?.spend ?? 0}</h3>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="rounded-2xl border border-white/10 bg-zinc-900/20 p-6 backdrop-blur-xl md:p-8"
      >
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp size={20} className="text-emerald-400" />
            <h2 className="text-xl font-bold text-white">Recent Activity</h2>
          </div>
          <Link 
            href="/dashboard/prompts" 
            className="group flex items-center gap-2 text-sm font-bold text-zinc-400 transition-colors hover:text-emerald-400"
          >
            View all
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Reuse PromptCard for consistency */}
        <div className="grid gap-6 xl:grid-cols-2">
          {(statsData?.recentActivity || []).length === 0 ? (
            <p className="text-zinc-500 py-6 col-span-2">No recent prompt activity yet.</p>
          ) : (
            (statsData?.recentActivity || []).map((prompt, index) => (
              <PromptCard key={prompt._id} prompt={prompt} index={index} />
            ))
          )}
        </div>
      </motion.div>

    </div>
  );
}
