"use client";

import { Search, Filter, SlidersHorizontal, ChevronDown } from "lucide-react";
import PromptCard from "@/components/ui/PromptCard";
import { motion } from "framer-motion";

import { mockPrompts } from "@/lib/mockData";

export default function MarketplacePage() {
  return (
    <main className="relative min-h-screen bg-[#050505] selection:bg-emerald-500/30">
      
      {/* Premium Background Effects */}
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-emerald-500/5 blur-[150px] opacity-20" />
        <div className="absolute right-[-5%] top-[20%] h-[400px] w-[400px] rounded-full bg-cyan-500/5 blur-[150px] opacity-20" />
      </div>

      {/* Page Header */}
      <section className="relative z-10 border-b border-white/5 bg-[#050505]/80 px-4 py-16 backdrop-blur-2xl sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold tracking-wide text-emerald-400 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              MARKETPLACE
            </div>
            
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Premium</span> Prompts
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-zinc-400">
              Unlock high-quality AI workflows curated by top engineers, designers, and marketers. Stop typing, start building.
            </p>
          </motion.div>
          
          {/* Main Search Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="mt-10 flex max-w-2xl items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-2 shadow-2xl backdrop-blur-xl transition-all focus-within:border-emerald-500/50 focus-within:bg-white/[0.05]"
          >
            <Search className="ml-3 text-zinc-500" size={22} />
            <input
              className="h-12 flex-1 bg-transparent text-base text-zinc-100 placeholder-zinc-500 outline-none"
              placeholder="Search by title, keyword, or AI tool..."
            />
            <button className="h-12 rounded-xl bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-[length:200%_auto] animate-gradient-x px-8 text-sm font-bold text-zinc-950 shadow-md transition-all hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(52,211,153,0.25)]">
              Search
            </button>
          </motion.div>
        </div>
      </section>

      {/* Main Content Area: Sidebar + Grid */}
      <section className="relative z-10 mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
          
          {/* Left Sidebar: Filters */}
          <aside className="w-full shrink-0 lg:sticky lg:top-8 lg:w-64">
            <div className="flex items-center justify-between lg:hidden">
              <span className="text-lg font-bold text-white">Filters</span>
              <button className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-zinc-300 backdrop-blur-md">
                <Filter size={16} /> Toggle
              </button>
            </div>

            <div className="hidden space-y-8 lg:block">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-500">
                <SlidersHorizontal size={16} /> Filters
              </div>

              {/* Category Filter */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white">Category</h3>
                <div className="flex flex-col gap-3">
                  {["Engineering", "Marketing", "Design", "Data", "Product"].map(cat => (
                    <label key={cat} className="group flex cursor-pointer items-center gap-3 text-sm font-medium text-zinc-400 transition-colors hover:text-white">
                      <div className="relative flex h-5 w-5 items-center justify-center rounded border border-white/20 bg-white/5 transition-colors group-hover:border-emerald-500/50">
                        <input type="checkbox" className="peer absolute h-full w-full cursor-pointer opacity-0" />
                        <div className="h-2.5 w-2.5 rounded-sm bg-emerald-500 opacity-0 transition-opacity peer-checked:opacity-100"></div>
                      </div>
                      {cat}
                    </label>
                  ))}
                </div>
              </div>

              <div className="h-px w-full bg-gradient-to-r from-white/10 to-transparent"></div>

              {/* Tool Filter */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white">AI Engine</h3>
                <div className="flex flex-col gap-3">
                  {["ChatGPT", "Claude", "Gemini", "Midjourney"].map(tool => (
                    <label key={tool} className="group flex cursor-pointer items-center gap-3 text-sm font-medium text-zinc-400 transition-colors hover:text-white">
                      <div className="relative flex h-5 w-5 items-center justify-center rounded border border-white/20 bg-white/5 transition-colors group-hover:border-emerald-500/50">
                        <input type="checkbox" className="peer absolute h-full w-full cursor-pointer opacity-0" />
                        <div className="h-2.5 w-2.5 rounded-sm bg-emerald-500 opacity-0 transition-opacity peer-checked:opacity-100"></div>
                      </div>
                      {tool}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Right Content: Prompt Grid */}
          <div className="flex-1">
            {/* Sorting Header */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-medium text-zinc-400">Showing <span className="font-bold text-white">24</span> results</p>
              
              <div className="relative inline-flex">
                <select className="appearance-none rounded-xl border border-white/10 bg-white/5 py-2.5 pl-4 pr-10 text-sm font-medium text-zinc-300 outline-none backdrop-blur-md transition-colors hover:border-white/20 focus:border-emerald-500/50">
                  <option className="bg-zinc-900">Sort by: Most Copied</option>
                  <option className="bg-zinc-900">Sort by: Highest Rated</option>
                  <option className="bg-zinc-900">Sort by: Newest</option>
                </select>
                <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500" />
              </div>
            </div>

            {/* Grid Layout */}
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-2">
              {mockPrompts.map((prompt, index) => (
                <PromptCard key={prompt._id} prompt={prompt} index={index} />
              ))}
            </div>

            {/* Pagination Draft */}
            <div className="mt-16 flex justify-center">
              <div className="flex items-center gap-2 rounded-full border border-white/5 bg-white/5 p-1 backdrop-blur-md">
                <button className="flex h-10 items-center justify-center rounded-full px-5 text-sm font-medium text-zinc-500 transition-colors hover:bg-white/5 hover:text-zinc-300">Previous</button>
                <button className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20 text-sm font-bold text-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.2)]">1</button>
                <button className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium text-zinc-400 transition-colors hover:bg-white/10 hover:text-white">2</button>
                <button className="flex h-10 items-center justify-center rounded-full px-5 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/10 hover:text-white">Next</button>
              </div>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
