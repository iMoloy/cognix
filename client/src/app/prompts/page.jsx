import { Search, Filter, SlidersHorizontal } from "lucide-react";
import PromptCard from "@/components/ui/PromptCard";

// Mock Data for UI building (We will replace this with an API call later)
const mockPrompts = [
  {
    _id: "1",
    title: "Senior React Developer Interview Simulator",
    description: "Acts as a technical interviewer asking advanced questions on React hooks, fiber architecture, and performance optimization.",
    category: "Engineering",
    tool: "ChatGPT",
    copies: 342,
    rating: 4.9,
    isPremium: true,
  },
  {
    _id: "2",
    title: "High-Converting Landing Page Copywriter",
    description: "Generates PAS (Problem-Agitation-Solution) structured copy tailored for SaaS landing pages with strong CTAs.",
    category: "Marketing",
    tool: "Claude",
    copies: 1205,
    rating: 4.7,
    isPremium: false,
  },
  {
    _id: "3",
    title: "SQL Query Optimizer & Explainer",
    description: "Analyzes slow database queries, explains execution plans, and provides optimized index recommendations.",
    category: "Data",
    tool: "Gemini",
    copies: 89,
    rating: 5.0,
    isPremium: false,
  },
  {
    _id: "4",
    title: "Product Requirements Document (PRD) Generator",
    description: "Transforms rough feature ideas into structured PRDs ready for engineering estimation.",
    category: "Product",
    tool: "ChatGPT",
    copies: 567,
    rating: 4.8,
    isPremium: true,
  }
];

export default function MarketplacePage() {
  return (
    <main className="min-h-screen bg-zinc-950">
      
      {/* Page Header */}
      <section className="border-b border-zinc-800 bg-zinc-900 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold text-zinc-50 sm:text-4xl">Prompt Marketplace</h1>
          <p className="mt-3 text-zinc-400">Discover and unlock high-quality AI prompts curated by the community.</p>
          
          {/* Main Search Bar */}
          <div className="mt-8 flex max-w-2xl items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-950 p-2 shadow-sm">
            <Search className="ml-2 text-zinc-500" size={20} />
            <input
              className="h-11 flex-1 bg-transparent text-sm text-zinc-50 outline-none"
              placeholder="Search by title, keyword, or AI tool..."
            />
            <button className="h-11 rounded-md bg-zinc-800 px-6 text-sm font-semibold text-zinc-200 hover:bg-zinc-700 transition">
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area: Sidebar + Grid */}
      <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          
          {/* Left Sidebar: Filters */}
          <aside className="w-full shrink-0 space-y-6 lg:w-64">
            <div className="flex items-center justify-between text-zinc-50 lg:hidden">
              <span className="font-semibold text-lg">Filters</span>
              <button className="flex items-center gap-2 rounded bg-zinc-900 px-3 py-1.5 text-sm text-zinc-400 border border-zinc-800">
                <Filter size={16} /> Toggle
              </button>
            </div>

            <div className="hidden space-y-6 lg:block">
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-zinc-500">
                <SlidersHorizontal size={16} /> Filters
              </div>

              {/* Category Filter */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-zinc-50">Category</h3>
                <div className="flex flex-col gap-2">
                  {["Engineering", "Marketing", "Design", "Data", "Product"].map(cat => (
                    <label key={cat} className="flex items-center gap-3 text-sm text-zinc-400 hover:text-zinc-300">
                      <input type="checkbox" className="rounded border-zinc-700 bg-zinc-900 text-emerald-500 focus:ring-emerald-500/20" />
                      {cat}
                    </label>
                  ))}
                </div>
              </div>

              {/* Tool Filter */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-zinc-50">AI Tool</h3>
                <div className="flex flex-col gap-2">
                  {["ChatGPT", "Claude", "Gemini", "Midjourney"].map(tool => (
                    <label key={tool} className="flex items-center gap-3 text-sm text-zinc-400 hover:text-zinc-300">
                      <input type="checkbox" className="rounded border-zinc-700 bg-zinc-900 text-emerald-500 focus:ring-emerald-500/20" />
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
            <div className="mb-6 flex items-center justify-between border-b border-zinc-800 pb-4">
              <p className="text-sm text-zinc-400">Showing <span className="font-bold text-zinc-50">24</span> results</p>
              <select className="bg-zinc-950 text-sm text-zinc-300 outline-none border border-zinc-800 rounded p-1.5">
                <option>Sort by: Most Copied</option>
                <option>Sort by: Highest Rated</option>
                <option>Sort by: Newest</option>
              </select>
            </div>

            {/* Grid Layout */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {mockPrompts.map((prompt) => (
                <PromptCard key={prompt._id} prompt={prompt} />
              ))}
            </div>

            {/* Pagination Draft */}
            <div className="mt-12 flex justify-center">
              <div className="flex items-center gap-2">
                <button className="h-10 px-4 rounded border border-zinc-800 text-sm text-zinc-500 cursor-not-allowed">Previous</button>
                <button className="h-10 w-10 rounded bg-emerald-500/10 border border-emerald-500/50 text-sm font-bold text-emerald-400">1</button>
                <button className="h-10 w-10 rounded border border-zinc-800 text-sm text-zinc-400 hover:bg-zinc-900">2</button>
                <button className="h-10 px-4 rounded border border-zinc-800 text-sm text-zinc-200 hover:bg-zinc-900 transition">Next</button>
              </div>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
