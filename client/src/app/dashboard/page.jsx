"use client";

import { motion } from "framer-motion";
import { Key, Bookmark, WalletCards, ArrowRight, TrendingUp } from "lucide-react";
import Link from "next/link";
import PromptCard from "@/components/ui/PromptCard";

// Mock Data for Dashboard
const mockUser = {
  name: "Sarah Developer",
  email: "sarah@example.com",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
  joinDate: "June 2026",
  plan: "Pro Builder",
  stats: {
    unlocked: 12,
    saved: 45,
    spend: 60
  }
};

const mockRecentActivity = [
  {
    _id: "101",
    title: "Senior React Developer Interview Simulator",
    description: "Acts as a technical interviewer asking advanced questions on React hooks, fiber architecture, and performance optimization.",
    category: "Engineering",
    tool: "ChatGPT",
    rating: 4.9,
    price: 5,
    author: { name: "Alex Dev", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" },
    isPremium: true
  },
  {
    _id: "102",
    title: "Next.js 14 API Architect",
    description: "Generate secure, perfectly typed Next.js App Router API endpoints with built-in Zod validation and error handling.",
    category: "Architecture",
    tool: "Claude 3.5 Sonnet",
    rating: 5.0,
    price: 0,
    author: { name: "Vercel Master", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vercel" },
    isPremium: false
  }
];

export default function DashboardOverviewPage() {
  return (
    <div className="space-y-8">
      
      {/* Header & Profile */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Welcome back, {mockUser.name.split(" ")[0]}</h1>
          <p className="mt-2 text-zinc-400">Here's what's happening with your prompt engineering arsenal.</p>
        </div>
        
        <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-zinc-900/40 p-4 backdrop-blur-xl">
          <img 
            src={mockUser.avatar} 
            alt={mockUser.name} 
            className="h-12 w-12 rounded-full border border-white/10 bg-zinc-800"
          />
          <div>
            <div className="font-bold text-white">{mockUser.name}</div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-zinc-400">Member since {mockUser.joinDate}</span>
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                {mockUser.plan}
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
              <h3 className="text-2xl font-extrabold text-white">{mockUser.stats.unlocked}</h3>
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
              <h3 className="text-2xl font-extrabold text-white">{mockUser.stats.saved}</h3>
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
              <h3 className="text-2xl font-extrabold text-white">${mockUser.stats.spend}</h3>
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
          {mockRecentActivity.map((prompt, index) => (
            <PromptCard key={prompt._id} prompt={prompt} index={index} />
          ))}
        </div>
      </motion.div>

    </div>
  );
}
