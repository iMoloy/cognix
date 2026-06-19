import Link from "next/link";
import { Copy, Star, LockKeyhole, ArrowUpRight } from "lucide-react";

export default function PromptCard({ prompt }) {
  return (
    <article className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 p-5 transition-all hover:border-zinc-700 hover:shadow-lg hover:shadow-black/50">
      
      {/* Header & Badges */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <span className="rounded bg-zinc-900 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
            {prompt.category}
          </span>
          <span className="rounded bg-zinc-900 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
            {prompt.tool}
          </span>
        </div>
        
        {/* Premium Lock Icon indicator */}
        {prompt.isPremium && (
          <div className="flex items-center gap-1 text-xs font-semibold text-amber-500">
            <LockKeyhole size={14} />
            PRO
          </div>
        )}
      </div>

      {/* Content */}
      <div className="mt-4">
        <h3 className="text-lg font-bold text-zinc-50 group-hover:text-emerald-300 transition-colors">
          {prompt.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-zinc-400">
          {prompt.description}
        </p>
      </div>

      {/* Footer Stats & Action */}
      <div className="mt-6 flex items-center justify-between border-t border-zinc-800/50 pt-4">
        <div className="flex items-center gap-4 text-sm text-zinc-500">
          <span className="flex items-center gap-1.5 font-medium hover:text-zinc-300 transition-colors cursor-pointer">
            <Copy size={16} />
            {prompt.copies}
          </span>
          <span className="flex items-center gap-1.5 font-medium text-amber-400/90">
            <Star size={16} className="fill-amber-400/20" />
            {prompt.rating}
          </span>
        </div>
        
        {/* View Details Link */}
        <Link
          href={`/prompts/${prompt._id}`}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 text-zinc-400 transition-colors group-hover:bg-emerald-300 group-hover:text-zinc-950"
        >
          <ArrowUpRight size={18} />
        </Link>
      </div>
    </article>
  );
}
