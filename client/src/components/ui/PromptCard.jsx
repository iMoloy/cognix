"use client";

import Link from "next/link";
import { Copy, Star, LockKeyhole, ArrowUpRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function PromptCard({ prompt, index = 0 }) {
  return (
    <motion.article 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-zinc-900/40 p-6 backdrop-blur-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_15px_30px_rgba(16,185,129,0.1),0_20px_45px_-15px_rgba(0,0,0,0.6)]"
    >
      {/* Animated gradient border effect */}
      <div className="absolute inset-0 z-0 rounded-2xl border border-white/5 transition-colors duration-500 group-hover:border-emerald-500/20"></div>
      
      {/* Subtle background glow on hover */}
      <div className="absolute inset-0 z-0 rounded-2xl bg-gradient-to-br from-emerald-500/0 via-transparent to-emerald-500/0 opacity-0 transition-opacity duration-700 group-hover:from-emerald-500/10 group-hover:to-transparent group-hover:opacity-40"></div>

      {/* Card Image Thumbnail */}
      <div className="relative z-10 -mx-6 -mt-6 mb-6 h-40 overflow-hidden border-b border-white/5">
        <img 
          src={prompt.image || "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=800&auto=format&fit=crop"} 
          alt={prompt.title} 
          onError={(e) => {
            e.target.onerror = null; 
            e.target.src = "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=800&auto=format&fit=crop";
          }}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 to-transparent"></div>
      </div>

      {/* Header & Badges */}
      <div className="relative z-10 flex items-start justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.1)] backdrop-blur-md">
            <Sparkles size={12} className="text-emerald-400" />
            {prompt.category}
          </span>
          <span className="rounded-full border border-zinc-700/50 bg-zinc-800/50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400 backdrop-blur-md">
            {prompt.tool}
          </span>
        </div>
        
        {/* Premium Lock Icon indicator */}
        {prompt.isPremium && (
          <div className="flex h-7 items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.15)] ring-1 ring-amber-500/30">
            <LockKeyhole size={13} />
            PRO
          </div>
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 mt-6">
        <h3 className="text-xl font-bold tracking-tight text-zinc-100 transition-colors duration-300 group-hover:text-emerald-300">
          {prompt.title}
        </h3>
        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-zinc-400/90 font-medium">
          {prompt.description}
        </p>
      </div>

      {/* Footer Stats & Action */}
      <div className="relative z-10 mt-8 flex items-center justify-between border-t border-white/5 pt-5">
        <div className="flex items-center gap-5 text-sm font-semibold text-zinc-500">
          <span className="group/copy flex cursor-pointer items-center gap-2 transition-colors hover:text-zinc-200">
            <Copy size={16} className="text-zinc-600 transition-colors group-hover/copy:text-zinc-300" />
            {prompt.copies}
          </span>
          <span className="flex items-center gap-2 text-amber-400/90">
            <Star size={16} className="fill-amber-400/30 text-amber-500" />
            {prompt.rating}
          </span>
        </div>
        
        {/* View Details Link */}
        <Link
          href={`/prompts/${prompt._id}`}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-700/50 bg-zinc-800/50 text-zinc-400 transition-all duration-300 group-hover:scale-110 group-hover:bg-emerald-400 group-hover:text-zinc-950 group-hover:shadow-[0_0_10px_rgba(52,211,153,0.2)]"
        >
          <ArrowUpRight size={18} strokeWidth={2.5} />
        </Link>
      </div>
    </motion.article>
  );
}
