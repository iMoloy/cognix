"use client";

import { Star, MessageSquare } from "lucide-react";
import Link from "next/link";

const mockReviews = [
  {
    _id: "r1",
    promptTitle: "Next.js App Router Master",
    promptId: "p3",
    rating: 5,
    date: "Nov 02, 2026",
    comment: "This prompt perfectly structured my API routes with Zod validation. Exactly what I needed!"
  },
  {
    _id: "r2",
    promptTitle: "SaaS Landing Page Copywriter",
    promptId: "p2",
    rating: 4,
    date: "Oct 25, 2026",
    comment: "Great copy, but I had to tweak the tone slightly to sound less robotic. Still a huge time saver."
  }
];

export default function MyReviewsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
          <Star size={28} className="text-emerald-400" />
          My Reviews
        </h1>
        <p className="mt-2 text-zinc-400">View and manage all the reviews you have left on the marketplace.</p>
      </div>

      {mockReviews.length > 0 ? (
        <div className="space-y-4">
          {mockReviews.map((review) => (
            <div 
              key={review._id} 
              className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-zinc-900/40 p-6 backdrop-blur-xl sm:flex-row sm:items-start sm:justify-between"
            >
              <div className="space-y-3">
                <div>
                  <Link 
                    href={`/prompts/${review.promptId}`}
                    className="text-lg font-bold text-white transition-colors hover:text-emerald-400"
                  >
                    {review.promptTitle}
                  </Link>
                  <p className="text-xs text-zinc-500 mt-1">Reviewed on {review.date}</p>
                </div>
                
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={14} 
                      className={i < review.rating ? "fill-amber-400 text-amber-400" : "fill-zinc-800 text-zinc-700"} 
                    />
                  ))}
                </div>
                
                <p className="text-sm text-zinc-300 leading-relaxed max-w-2xl">
                  &quot;{review.comment}&quot;
                </p>
              </div>
              
              <button className="text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-red-400 transition-colors">
                Delete
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-zinc-900/40 py-32 text-center backdrop-blur-xl">
          <div className="rounded-full bg-white/5 p-6 mb-4">
            <MessageSquare size={40} className="text-zinc-500" />
          </div>
          <h3 className="text-xl font-bold text-white">No reviews yet</h3>
          <p className="mt-2 max-w-sm text-sm text-zinc-400">
            You haven&apos;t reviewed any prompts. Help the community by rating the prompts you try!
          </p>
        </div>
      )}
    </div>
  );
}
