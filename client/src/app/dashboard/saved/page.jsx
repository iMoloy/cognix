"use client";

import PromptCard from "@/components/ui/PromptCard";
import { Bookmark, ChevronLeft, ChevronRight } from "lucide-react";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";

export default function SavedPromptsPage() {
  const { user } = useAuth();
  const [savedPrompts, setSavedPrompts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchBookmarks = async () => {
      if (!user?.email) return;
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://cognix-6lqn.onrender.com";
        const res = await fetch(`${apiUrl}/api/users/bookmarks/${user.email}`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setSavedPrompts(data);
        } else {
          toast.error("Failed to fetch saved prompts");
        }
      } catch (e) {
        console.error("Failed to fetch saved prompts", e);
        toast.error("Failed to fetch saved prompts");
      } finally {
        setLoading(false);
      }
    };
    fetchBookmarks();
  }, [user]);

  if (loading) return <div className="text-zinc-400">Loading saved prompts...</div>;

  const totalPages = Math.ceil(savedPrompts.length / itemsPerPage);
  const currentPrompts = savedPrompts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const generatePaginationNumbers = () => {
    const current = currentPage;
    const total = totalPages;
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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
          <Bookmark size={28} className="text-cyan-400" />
          Saved Library
        </h1>
        <p className="mt-2 text-zinc-400">All your bookmarked and favorite prompts in one place.</p>
      </div>

      {savedPrompts.length > 0 ? (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {currentPrompts.map((prompt, index) => (
              <PromptCard key={prompt._id} prompt={prompt} index={index} />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between border-t border-white/5 bg-black/20 px-6 py-4 gap-4 rounded-xl">
              <div className="text-xs text-zinc-500 font-medium">
                Showing Page <span className="font-bold text-white">{currentPage}</span> of <span className="font-bold text-white">{totalPages}</span>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-white/5 bg-white/5 p-1 backdrop-blur-md">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className="flex h-8 items-center justify-center rounded-full px-3 text-xs font-medium text-zinc-400 transition-colors hover:bg-white/5 hover:text-emerald-400 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-zinc-400"
                >
                  <ChevronLeft size={14} className="mr-1" /> Prev
                </button>
                
                <div className="flex items-center gap-1">
                  {generatePaginationNumbers().map(p => (
                    <button 
                      key={p}
                      onClick={() => setCurrentPage(p)}
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
                        p === currentPage 
                          ? "bg-[length:200%_auto] animate-gradient-x bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 text-zinc-950 shadow-[0_0_15px_rgba(52,211,153,0.4)]" 
                          : "text-zinc-400 hover:bg-white/10 hover:text-emerald-400"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <button 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className="flex h-8 items-center justify-center rounded-full px-3 text-xs font-medium text-zinc-400 transition-colors hover:bg-white/5 hover:text-emerald-400 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-zinc-400"
                >
                  Next <ChevronRight size={14} className="ml-1" />
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-zinc-900/40 py-32 text-center backdrop-blur-xl">
          <div className="rounded-full bg-white/5 p-6 mb-4">
            <Bookmark size={40} className="text-zinc-500" />
          </div>
          <h3 className="text-xl font-bold text-white">Your library is empty</h3>
          <p className="mt-2 max-w-sm text-sm text-zinc-400">
            You haven&apos;t saved any prompts yet. Explore the marketplace and bookmark your favorites to access them here.
          </p>
        </div>
      )}
    </div>
  );
}
