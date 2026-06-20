"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, LockKeyhole, Sparkles, Star, Copy, Eye, BookmarkPlus, CalendarDays, TerminalSquare } from "lucide-react";
import { motion } from "framer-motion";
import CopyToClipboard from "@/components/ui/CopyToClipboard";
import { useAuth } from "@/contexts/AuthContext";

// Mock Data
const mockPrompt = {
  _id: "1",
  title: "Senior React Developer Interview Simulator",
  description: "Acts as a technical interviewer asking advanced questions on React hooks, fiber architecture, and performance optimization. It adapts to your answers and provides feedback.",
  instruction: `You are to act as a Senior React Engineering Manager conducting a technical interview.
Your goal is to assess my knowledge of advanced React concepts.

Follow these rules strictly:
1. Ask me one question at a time.
2. Wait for my response before proceeding.
3. If my answer is incorrect or incomplete, gently correct me and explain the underlying architecture (e.g., how the Fiber tree reconciliation actually works).
4. Start by asking me to explain the difference between useMemo and React.memo under the hood.`,
  category: "Engineering",
  tool: "ChatGPT",
  copies: 342,
  views: 1205,
  rating: 4.9,
  isPremium: true,
  price: 5,
  author: {
    name: "Alex Dev",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    role: "Senior Staff Engineer"
  },
  createdAt: "Oct 12, 2026"
};

export default function PromptDetailsPage({ params }) {
  const { user } = useAuth();
  const router = useRouter();

  // Dynamic Access Logic
  const isPremiumUser = user?.subscription === "premium" || user?.role === "admin" || user?.role === "creator";
  const hasAccess = !mockPrompt.isPremium || isPremiumUser;

  return (
    <main className="relative min-h-screen bg-[#030303] selection:bg-emerald-500/30">
      
      {/* Background Orbs */}
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-emerald-500/5 blur-[150px] opacity-20" />
        <div className="absolute right-[-5%] top-[20%] h-[400px] w-[400px] rounded-full bg-cyan-500/5 blur-[150px] opacity-20" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        
        {/* Navigation */}
        <div className="mb-10 flex items-center justify-between">
          <Link 
            href="/prompts" 
            className="flex items-center gap-2 text-sm font-semibold text-zinc-400 transition-colors hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to Marketplace
          </Link>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
          
          {/* Left Column: Prompt Details & Execution */}
          <div className="space-y-8">
            
            {/* Header Area */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400 backdrop-blur-md">
                  <Sparkles size={12} className="text-emerald-400" />
                  {mockPrompt.category}
                </span>
                <span className="rounded-full border border-zinc-700/50 bg-zinc-800/50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400 backdrop-blur-md">
                  {mockPrompt.tool}
                </span>
              </div>
              <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                {mockPrompt.title}
              </h1>
              <p className="mt-4 text-base leading-relaxed text-zinc-400">
                {mockPrompt.description}
              </p>
            </motion.div>

            {/* Prompt Engine Window */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/50 shadow-2xl backdrop-blur-xl"
            >
              {/* Window Header */}
              <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.02] px-5 py-3">
                <div className="flex items-center gap-2 text-sm font-bold text-zinc-300">
                  <TerminalSquare size={16} className="text-emerald-400" />
                  Prompt Instruction
                </div>
                {hasAccess && <CopyToClipboard text={mockPrompt.instruction} />}
              </div>

              {/* Window Body (Payload) */}
              <div className="relative p-6">
                
                {/* Paywall Blur Layer */}
                {!hasAccess && mockPrompt.isPremium && (
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 p-6 backdrop-blur-md">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 shadow-[0_0_30px_rgba(52,211,153,0.3)] ring-1 ring-emerald-500/20">
                      <LockKeyhole size={28} className="text-emerald-400" />
                    </div>
                    <h3 className="mt-6 text-xl font-bold text-white">Premium Prompt</h3>
                    <p className="mt-2 text-center text-sm font-medium text-zinc-400 max-w-xs">
                      This is a highly optimized, battle-tested prompt. Unlock it forever to access the full instruction payload.
                    </p>
                    <button 
                      onClick={() => router.push("/payment")}
                      className="mt-8 rounded-xl bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-[length:200%_auto] animate-gradient-x px-8 py-3.5 text-sm font-bold text-zinc-950 shadow-md transition-all hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(52,211,153,0.25)]"
                    >
                      Unlock for ${mockPrompt.price}
                    </button>
                  </div>
                )}

                {/* The actual text */}
                <pre className={`whitespace-pre-wrap font-mono text-sm leading-relaxed text-emerald-50/90 ${!hasAccess && mockPrompt.isPremium ? "blur-[6px] select-none opacity-40" : ""}`}>
                  {mockPrompt.instruction}
                </pre>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Sidebar Stats & Author */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Stats Card */}
            <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-6 backdrop-blur-2xl">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-500"><Copy size={14} /> Copies</span>
                  <span className="mt-2 block text-xl font-extrabold text-white">{mockPrompt.copies}</span>
                </div>
                <div>
                  <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-500"><Star size={14} /> Rating</span>
                  <span className="mt-2 block text-xl font-extrabold text-amber-400">{mockPrompt.rating}</span>
                </div>
                <div>
                  <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-500"><Eye size={14} /> Views</span>
                  <span className="mt-2 block text-xl font-extrabold text-white">{mockPrompt.views}</span>
                </div>
                <div>
                  <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-500"><CalendarDays size={14} /> Added</span>
                  <span className="mt-2 block text-sm font-extrabold text-white pt-1">{mockPrompt.createdAt}</span>
                </div>
              </div>

              <div className="mt-8 border-t border-white/5 pt-6">
                <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-3.5 text-sm font-bold text-white backdrop-blur-md transition-all hover:bg-white/10 hover:scale-[1.02]">
                  <BookmarkPlus size={16} /> Save to Library
                </button>
              </div>
            </div>

            {/* Author Card */}
            <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-6 backdrop-blur-2xl">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-4">Creator</h4>
              <div className="flex items-center gap-4">
                <img 
                  src={mockPrompt.author.avatar} 
                  alt={mockPrompt.author.name} 
                  className="h-12 w-12 rounded-full border border-white/10 bg-zinc-800"
                />
                <div>
                  <h3 className="font-bold text-white">{mockPrompt.author.name}</h3>
                  <p className="text-xs font-medium text-zinc-400">{mockPrompt.author.role}</p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </main>
  );
}
