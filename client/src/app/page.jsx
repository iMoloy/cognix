"use client";

import Link from "next/link";
import { ArrowRight, Bookmark, CheckCircle2, Copy, LockKeyhole, Search, ShieldCheck, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

const promptRows = [
  {
    title: "Product Launch Planner",
    category: "Marketing",
    tool: "ChatGPT",
    level: "Intermediate",
    copies: "1,842",
    rating: "4.9",
  },
  {
    title: "UX Audit Assistant",
    category: "Design",
    tool: "Claude",
    level: "Pro",
    copies: "936",
    rating: "4.8",
  },
  {
    title: "Lesson Plan Builder",
    category: "Education",
    tool: "Gemini",
    level: "Beginner",
    copies: "721",
    rating: "4.7",
  },
];

const workflowItems = [
  "Submit prompts into a moderation queue",
  "Discover approved public prompts with filters",
  "Unlock premium private prompts after payment",
  "Track copies, bookmarks, reviews, and creator growth",
];

export default function Home() {
  const { isAuthenticated } = useAuth();
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030303] selection:bg-emerald-500/30">
      
      {/* Premium Hero Background Effects */}
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
        <div className="absolute top-[-20%] left-[10%] h-[700px] w-[700px] rounded-full bg-emerald-500/5 blur-[150px] opacity-20" />
        <div className="absolute right-[-10%] top-[30%] h-[500px] w-[500px] rounded-full bg-cyan-500/5 blur-[150px] opacity-20" />
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-[0.03]"></div>
      </div>

      <section className="relative z-10 border-b border-white/5 bg-transparent px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto grid w-full max-w-7xl gap-16 lg:grid-cols-[1fr_1fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold tracking-[0.2em] text-zinc-400 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              COGNIX PLATFORM
            </div>
            
            <h1 className="mt-6 max-w-3xl text-4xl font-extrabold leading-[1.1] text-white sm:text-6xl lg:text-[4rem]">
              Curated Prompts <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 animate-gradient-x">
                Worth Reusing.
              </span>
            </h1>
            
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-400 font-medium">
              A premium marketplace built for modern engineering and design teams. Publish, review, bookmark, and monetize battle-tested AI workflows.
            </p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-10 flex max-w-xl items-center gap-2 sm:gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-1.5 sm:p-2 shadow-2xl backdrop-blur-xl focus-within:border-emerald-500/50 focus-within:bg-white/[0.05] transition-all"
            >
              <Search className="ml-2 sm:ml-3 shrink-0 text-zinc-500" size={20} />
              <input
                className="h-10 sm:h-12 min-w-0 flex-1 bg-transparent text-sm sm:text-base text-zinc-100 placeholder-zinc-500 outline-none"
                placeholder="Search prompt templates..."
                aria-label="Search prompts"
              />
              <Link
                href="/prompts"
                className="flex h-10 sm:h-12 items-center justify-center rounded-xl bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-[length:200%_auto] animate-gradient-x px-4 sm:px-8 text-xs sm:text-sm font-bold text-zinc-950 shadow-[0_0_20px_rgba(52,211,153,0.3)] transition-all hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(52,211,153,0.5)] whitespace-nowrap shrink-0"
              >
                Search
              </Link>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"
            >
              {!isAuthenticated && (
                <Link
                  href="/register"
                  className="group flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-[length:200%_auto] animate-gradient-x px-8 text-sm font-bold text-zinc-950 shadow-[0_0_20px_rgba(52,211,153,0.3)] transition-all hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(52,211,153,0.5)]"
                >
                  Create account
                  <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
                </Link>
              )}
              <Link
                href="/prompts"
                className="flex h-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-8 text-sm font-bold text-white backdrop-blur-md transition-all hover:scale-[1.02] hover:bg-white/10"
              >
                Browse marketplace
              </Link>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="mt-10 sm:mt-14 grid max-w-xl grid-cols-3 divide-x divide-white/10 border-t border-white/10 pt-6 sm:pt-8"
            >
              <div className="pr-2 sm:pr-0">
                <strong className="block text-xl sm:text-3xl font-extrabold text-white">3</strong>
                <span className="mt-1 block text-[9px] sm:text-xs font-semibold uppercase tracking-wider text-zinc-500">User roles</span>
              </div>
              <div className="px-3 sm:pl-6 sm:pr-0">
                <strong className="block text-xl sm:text-3xl font-extrabold text-white">$5</strong>
                <span className="mt-1 block text-[9px] sm:text-xs font-semibold uppercase tracking-wider text-zinc-500">Premium unlock</span>
              </div>
              <div className="pl-3 sm:pl-6">
                <strong className="block text-xl sm:text-3xl font-extrabold text-white">2+</strong>
                <span className="mt-1 block text-[9px] sm:text-xs font-semibold uppercase tracking-wider text-zinc-500">Data Views</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95, rotateY: -10 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="perspective-1000 relative"
          >
            {/* Glowing orb behind the card */}
            <div className="absolute inset-0 left-1/2 top-1/2 h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[120px] opacity-20"></div>
            
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/40 shadow-2xl backdrop-blur-2xl">
              <div className="border-b border-white/5 bg-white/[0.02] px-6 py-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-white">Live Queue</h2>
                    <p className="mt-1 text-xs font-medium text-zinc-500">Top engaged prompts this week</p>
                  </div>
                  <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400 ring-1 ring-emerald-500/30">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                    Trending
                  </span>
                </div>
              </div>

              <div className="divide-y divide-white/5">
                {promptRows.map((prompt, i) => (
                  <motion.article 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 + (i * 0.1) }}
                    key={prompt.title} 
                    className="group flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between transition-colors hover:bg-white/[0.02]"
                  >
                    <div>
                      <h3 className="font-bold text-zinc-100 group-hover:text-emerald-300 transition-colors">{prompt.title}</h3>
                      <div className="mt-2 flex flex-wrap gap-2 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                        <span className="text-emerald-500/80">{prompt.category}</span>
                        <span>·</span>
                        <span>{prompt.tool}</span>
                        <span>·</span>
                        <span>{prompt.level}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-5 text-sm font-semibold text-zinc-400">
                      <span className="flex items-center gap-1.5">
                        <Copy size={15} className="text-zinc-600" />
                        {prompt.copies}
                      </span>
                      <span className="flex items-center gap-1.5 text-amber-400/90">
                        <Star size={15} className="fill-amber-400/30 text-amber-500" />
                        {prompt.rating}
                      </span>
                    </div>
                  </motion.article>
                ))}
              </div>

              <div className="grid gap-4 border-t border-white/5 bg-white/[0.01] p-6 sm:grid-cols-2">
                <div className="rounded-xl border border-white/5 bg-black/20 p-5 backdrop-blur-md">
                  <div className="flex items-center gap-2 text-sm font-bold text-white">
                    <LockKeyhole size={16} className="text-emerald-400" />
                    Premium Gate
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-zinc-500 font-medium">
                    Private prompts remain blurred securely until payment is verified via Stripe.
                  </p>
                </div>
                <div className="rounded-xl border border-white/5 bg-black/20 p-5 backdrop-blur-md">
                  <div className="flex items-center gap-2 text-sm font-bold text-white">
                    <Bookmark size={16} className="text-cyan-400" />
                    Smart Library
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-zinc-500 font-medium">
                    One-click bookmarks without cluttering the database with duplicate records.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative z-10 px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-full max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="inline-block rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">
              Product Architecture
            </p>
            <h2 className="mt-6 text-3xl font-extrabold leading-tight text-white sm:text-4xl">
              Engineered for moderation, discovery, and scale.
            </h2>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2">
            {workflowItems.map((item, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                key={item} 
                className="group flex gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-6 transition-all hover:bg-white/[0.04] hover:border-white/10 hover:shadow-xl hover:-translate-y-1"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
                  <CheckCircle2 className="text-emerald-400" size={18} />
                </div>
                <p className="text-sm font-semibold leading-relaxed text-zinc-300 group-hover:text-emerald-400 transition-colors">{item}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
