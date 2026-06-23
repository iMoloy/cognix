"use client";

import { useState, useEffect } from "react";
import { Star, MessageSquare } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { toast } from "react-toastify";

export default function MyReviewsPage() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!user?.email) return;
      try {
        const token = localStorage.getItem("cognix_token");
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${apiUrl}/api/reviews/user/${user.email}`, {
          headers: { Authorization: `Bearer ${token}` }
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
        <div className="grid gap-4">
          {reviews.map((review) => (
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
      )}
    </div>
  );
}
