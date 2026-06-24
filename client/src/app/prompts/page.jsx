"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Search, Filter, SlidersHorizontal, ChevronDown, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import PromptCard from "@/components/ui/PromptCard";
import PromptCardSkeleton from "@/components/ui/PromptCardSkeleton";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import { toast } from "react-toastify";

function MarketplaceContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [searchInput, setSearchInput] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category")?.split(",") || []);
  const [tool, setTool] = useState(searchParams.get("tool")?.split(",") || []);
  const [difficulty, setDifficulty] = useState(searchParams.get("difficulty")?.split(",") || []);
  const [sort, setSort] = useState(searchParams.get("sort") || "Trending");
  const [page, setPage] = useState(parseInt(searchParams.get("page")) || 1);

  const [prompts, setPrompts] = useState([]);
  const [metadata, setMetadata] = useState({ totalPages: 1, currentPage: 1, totalPrompts: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  // Sync state to URL and fetch prompts
  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category.length > 0) params.set("category", category.join(","));
    if (tool.length > 0) params.set("tool", tool.join(","));
    if (difficulty.length > 0) params.set("difficulty", difficulty.join(","));
    if (sort !== "Trending") params.set("sort", sort);
    if (page > 1) params.set("page", page.toString());

    const queryString = params.toString();
    const newUrl = `${pathname}${queryString ? `?${queryString}` : ""}`;
    
    router.replace(newUrl, { scroll: false });

    const fetchPrompts = async () => {
      if (page === 1) setIsLoading(true);
      else setIsFetchingMore(true);

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://cognix-6lqn.onrender.com";
        const res = await fetch(`${apiUrl}/api/prompts${queryString ? `?${queryString}` : ""}`);
        const data = await res.json();
        const promptsArray = Array.isArray(data) ? data : (data.prompts || []);
        
        setPrompts(prev => {
          let newPrompts = page === 1 ? promptsArray : [...prev, ...promptsArray];
          // Deduplicate by _id to handle React Strict Mode or double-fetch race conditions
          newPrompts = newPrompts.filter((p, index, self) => 
            index === self.findIndex((t) => t._id === p._id)
          );
          
          setMetadata({
            totalPages: data.totalPages || 1,
            currentPage: data.currentPage || 1,
            totalPrompts: data.totalPrompts || newPrompts.length
          });
          return newPrompts;
        });
      } catch (error) {
        console.error("Failed to fetch prompts", error);
        toast.error("Failed to fetch prompts");
      } finally {
        setIsLoading(false);
        setIsFetchingMore(false);
      }
    };
    
    // Debounce to prevent rapid refetching while typing or clicking
    const timeoutId = setTimeout(fetchPrompts, 300);
    return () => clearTimeout(timeoutId);
  }, [search, category, tool, difficulty, sort, page, pathname, router]);

  // Infinite Scroll Observer
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 500) {
        if (!isLoading && !isFetchingMore && metadata.currentPage < metadata.totalPages) {
          setPage(prev => prev + 1);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoading, isFetchingMore, metadata.currentPage, metadata.totalPages]);

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleCategoryChange = (cat) => {
    setCategory(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
    setPage(1);
  };

  const handleToolChange = (t) => {
    setTool(prev => prev.includes(t) ? prev.filter(item => item !== t) : [...prev, t]);
    setPage(1);
  };

  const handleDifficultyChange = (d) => {
    setDifficulty(prev => prev.includes(d) ? prev.filter(item => item !== d) : [...prev, d]);
    setPage(1);
  };

  const generatePaginationNumbers = () => {
    const current = metadata.currentPage;
    const total = metadata.totalPages;
    let pages = [];
    
    if (total <= 5) {
      pages = Array.from({ length: total }, (_, i) => i + 1);
    } else {
      if (current <= 3) {
        pages = [1, 2, 3, 4, 5];
      } else if (current >= total - 2) {
        pages = [total - 4, total - 3, total - 2, total - 1, total];
      } else {
        pages = [current - 2, current - 1, current, current + 1, current + 2];
      }
    }
    return pages;
  };

  return (
    <>
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
          <motion.form 
            onSubmit={handleSearchSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="mt-10 flex flex-col sm:flex-row max-w-2xl sm:items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-2 shadow-2xl backdrop-blur-xl transition-all focus-within:border-emerald-500/50 focus-within:bg-white/[0.05]"
          >
            <div className="flex flex-1 items-center px-3 sm:px-0 w-full">
              <Search className="sm:ml-3 mr-3 sm:mr-0 text-zinc-500 shrink-0" size={20} />
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="h-12 flex-1 bg-transparent text-sm sm:text-base text-zinc-100 placeholder-zinc-500 outline-none w-full"
                placeholder="Search by title, keyword, or AI tool..."
              />
            </div>
            <Button type="submit" className="h-12 w-full sm:w-auto px-8 shrink-0">
              Search
            </Button>
          </motion.form>
        </div>
      </section>

      {/* Main Content Area: Sidebar + Grid */}
      <section className="relative z-10 mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
          
          {/* Left Sidebar: Filters */}
          <aside className="w-full shrink-0 lg:sticky lg:top-8 lg:w-64">
            <div className="flex items-center justify-between lg:hidden">
              <span className="text-lg font-bold text-white">Filters</span>
              <Button variant="secondary" size="sm" className="lg:hidden">
                <Filter size={16} className="mr-2" /> Toggle
              </Button>
            </div>

            <div className="hidden space-y-8 lg:block">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-500">
                <SlidersHorizontal size={16} /> Filters
              </div>

              {/* Category Filter */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white">Category</h3>
                <div className="flex flex-col gap-3">
                  {["Engineering", "Marketing", "Design", "Data", "Product", "Education", "Copywriting"].map(cat => (
                    <label key={cat} className="group flex cursor-pointer items-center gap-3 text-sm font-medium text-zinc-400 transition-colors hover:text-emerald-400">
                      <div className="relative flex h-5 w-5 items-center justify-center rounded border border-white/20 bg-white/5 transition-colors group-hover:border-emerald-500/50">
                        <input 
                          type="checkbox" 
                          checked={category.includes(cat)}
                          onChange={() => handleCategoryChange(cat)}
                          className="peer absolute h-full w-full cursor-pointer opacity-0" 
                        />
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
                  {["ChatGPT", "Claude", "Gemini", "Midjourney"].map(t => (
                    <label key={t} className="group flex cursor-pointer items-center gap-3 text-sm font-medium text-zinc-400 transition-colors hover:text-emerald-400">
                      <div className="relative flex h-5 w-5 items-center justify-center rounded border border-white/20 bg-white/5 transition-colors group-hover:border-emerald-500/50">
                        <input 
                          type="checkbox" 
                          checked={tool.includes(t)}
                          onChange={() => handleToolChange(t)}
                          className="peer absolute h-full w-full cursor-pointer opacity-0" 
                        />
                        <div className="h-2.5 w-2.5 rounded-sm bg-emerald-500 opacity-0 transition-opacity peer-checked:opacity-100"></div>
                      </div>
                      {t}
                    </label>
                  ))}
                </div>
              </div>

              <div className="h-px w-full bg-gradient-to-r from-white/10 to-transparent"></div>

              {/* Difficulty Filter */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white">Difficulty</h3>
                <div className="flex flex-col gap-3">
                  {[
                    { label: "Beginner", value: "beginner" },
                    { label: "Intermediate", value: "intermediate" },
                    { label: "Pro", value: "pro" },
                  ].map(({ label, value }) => (
                    <label key={value} className="group flex cursor-pointer items-center gap-3 text-sm font-medium text-zinc-400 transition-colors hover:text-emerald-400">
                      <div className="relative flex h-5 w-5 items-center justify-center rounded border border-white/20 bg-white/5 transition-colors group-hover:border-emerald-500/50">
                        <input 
                          type="checkbox" 
                          checked={difficulty.includes(value)}
                          onChange={() => handleDifficultyChange(value)}
                          className="peer absolute h-full w-full cursor-pointer opacity-0" 
                        />
                        <div className="h-2.5 w-2.5 rounded-sm bg-emerald-500 opacity-0 transition-opacity peer-checked:opacity-100"></div>
                      </div>
                      {label}
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
              <p className="text-sm font-medium text-zinc-400">Showing <span className="font-bold text-white">{metadata.totalPrompts}</span> results</p>
              
              <div className="relative inline-flex">
                <select 
                  value={sort}
                  onChange={(e) => { setSort(e.target.value); setPage(1); }}
                  className="appearance-none rounded-xl border border-white/10 bg-white/5 py-2.5 pl-4 pr-10 text-sm font-medium text-zinc-300 outline-none backdrop-blur-md transition-colors hover:border-white/20 focus:border-emerald-500/50"
                >
                  <option value="Trending" className="bg-zinc-900">Sort by: Trending</option>
                  <option value="Most Copied" className="bg-zinc-900">Sort by: Most Copied</option>
                  <option value="Highest Rated" className="bg-zinc-900">Sort by: Highest Rated</option>
                  <option value="Newest" className="bg-zinc-900">Sort by: Newest</option>
                </select>
                <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500" />
              </div>
            </div>

            {/* Grid Layout */}
            {isLoading && page === 1 ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-2">
                {[...Array(6)].map((_, i) => (
                  <PromptCardSkeleton key={i} />
                ))}
              </div>
            ) : prompts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="rounded-full bg-white/5 p-6 mb-4">
                  <Search size={32} className="text-zinc-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No prompts found</h3>
                <p className="text-zinc-400">Try adjusting your filters or search terms.</p>
                <Button variant="secondary" className="mt-6" onClick={() => {
                  setSearch(""); setSearchInput(""); setCategory([]); setTool([]); setDifficulty([]); setSort("Trending"); setPage(1);
                }}>
                  Clear all filters
                </Button>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-2">
                {prompts.map((prompt, index) => (
                  <PromptCard key={prompt._id} prompt={prompt} index={index} />
                ))}
              </div>
            )}

            {/* Infinite Scroll Loader */}
            {isFetchingMore && (
              <div className="mt-8 flex justify-center pb-8">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
              </div>
            )}
            {!isFetchingMore && metadata.currentPage >= metadata.totalPages && prompts.length > 0 && (
              <div className="mt-8 text-center text-sm text-zinc-500 pb-8">
                You've reached the end of the list.
              </div>
            )}
          </div>

        </div>
      </section>
    </>
  );
}

export default function MarketplacePage() {
  return (
    <main className="relative min-h-screen bg-[#050505] selection:bg-emerald-500/30">
      {/* Premium Background Effects */}
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-emerald-500/5 blur-[150px] opacity-20" />
        <div className="absolute right-[-5%] top-[20%] h-[400px] w-[400px] rounded-full bg-cyan-500/5 blur-[150px] opacity-20" />
      </div>
      
      <Suspense fallback={
        <div className="flex min-h-[60vh] w-full items-center justify-center relative z-10">
          <Loader2 className="h-10 w-10 animate-spin text-emerald-400" />
        </div>
      }>
        <MarketplaceContent />
      </Suspense>
    </main>
  );
}
