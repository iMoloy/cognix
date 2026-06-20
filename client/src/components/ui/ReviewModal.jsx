"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, MessageSquare } from "lucide-react";
import Button from "@/components/ui/Button";

export default function ReviewModal({ isOpen, onClose, promptTitle }) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [review, setReview] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate API call
    console.log("Submitted Review:", { rating, review });
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.02] px-6 py-4">
            <div className="flex items-center gap-2 text-lg font-bold text-white">
              <MessageSquare size={18} className="text-emerald-400" />
              Write a Review
            </div>
            <button 
              onClick={onClose}
              className="rounded-full p-1.5 text-zinc-500 transition-colors hover:bg-white/10 hover:text-emerald-400"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="p-6">
            <p className="mb-6 text-sm text-zinc-400">
              Share your experience using <span className="font-bold text-zinc-300">{promptTitle}</span>.
            </p>

            {/* Star Rating */}
            <div className="mb-6">
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-500">
                Your Rating
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <Star 
                      size={28} 
                      className={`transition-colors ${
                        star <= (hoveredRating || rating) 
                          ? "fill-amber-400 text-amber-400" 
                          : "text-zinc-600"
                      }`} 
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Review Text */}
            <div className="mb-8">
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-500">
                Your Review
              </label>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="How did this prompt help you? What could be improved?"
                className="min-h-[120px] w-full rounded-xl border border-white/10 bg-zinc-900/50 p-4 text-sm text-white placeholder-zinc-600 outline-none transition-all focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50"
                required
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <Button
                variant="ghost"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!rating || !review.trim()}
              >
                Post Review
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
