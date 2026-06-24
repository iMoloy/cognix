"use client";

import { useState, useEffect } from "react";
import { Star, MessageSquare, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { toast } from "react-toastify";

export default function MyReviewsPage() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchReviews = async () => {
      if (!user?.email) return;
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://cognix-6lqn.onrender.com";
        const res = await fetch(`${apiUrl}/api/reviews/user/${user.email}`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setReviews(data);
        } else {
          toast.error("Failed to fetch your reviews");
        }
      } catch (error) {
        console.error("Failed to fetch user reviews", error);
        toast.error("Failed to fetch your reviews");
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [user]);

  if (loading) return <div className="text-zinc-400">Loading your reviews...</div>;

  const totalPages = Math.ceil(reviews.length / itemsPerPage);
  const currentReviews = reviews.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
        <MessageSquare className="text-emerald-400" />
        My Reviews
      </h1>
      <p className="text-zinc-400">Manage feedback you&apos;ve left on prompts across the marketplace.</p>

      {reviews.length === 0 ? (
        <div className="rounded-2xl border border-white/5 bg-zinc-900/40 p-8 text-center text-zinc-400">
          You haven&apos;t written any reviews yet.
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4">
            {currentReviews.map((review) => (
              <div key={review._id} className="rounded-2xl border border-white/10 bg-zinc-900/40 p-6 backdrop-blur-xl transition-colors hover:bg-white/[0.02]">
              <div className="flex items-center gap-2 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    size={16} 
                    className={star <= review.rating ? "fill-amber-400 text-amber-400" : "text-zinc-600"} 
                  />
                ))}
              </div>
              <p className="text-sm leading-relaxed text-zinc-300">&quot;{review.comment}&quot;</p>
              <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4">
                <span className="text-xs font-medium text-zinc-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
                <Link href={`/prompts/${review.promptId}`} className="text-xs font-bold text-emerald-400 hover:text-emerald-300">
                  View Prompt &rarr;
                </Link>
              </div>
            </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between border-t border-white/5 bg-black/20 px-6 py-4 gap-4 rounded-xl">
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
        </div>
      )}
    </div>
  );
}
