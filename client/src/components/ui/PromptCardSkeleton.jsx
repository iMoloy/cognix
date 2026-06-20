export default function PromptCardSkeleton() {
  return (
    <article className="relative flex flex-col justify-between overflow-hidden rounded-2xl bg-zinc-900/40 p-6 backdrop-blur-2xl border border-white/5">
      {/* Card Image Thumbnail Skeleton */}
      <div className="relative z-10 -mx-6 -mt-6 mb-6 h-40 overflow-hidden border-b border-white/5 bg-zinc-800/50 animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 to-transparent"></div>
      </div>

      {/* Header & Badges Skeleton */}
      <div className="relative z-10 flex items-start justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <div className="h-6 w-20 rounded-full bg-zinc-800/80 animate-pulse"></div>
          <div className="h-6 w-16 rounded-full bg-zinc-800/80 animate-pulse"></div>
        </div>
        <div className="h-7 w-12 rounded-full bg-zinc-800/80 animate-pulse"></div>
      </div>

      {/* Content Skeleton */}
      <div className="relative z-10 mt-6 space-y-3">
        <div className="h-6 w-3/4 rounded-md bg-zinc-800/80 animate-pulse"></div>
        <div className="h-4 w-full rounded-md bg-zinc-800/80 animate-pulse mt-4"></div>
        <div className="h-4 w-5/6 rounded-md bg-zinc-800/80 animate-pulse"></div>
      </div>

      {/* Footer Stats & Action Skeleton */}
      <div className="relative z-10 mt-8 flex items-center justify-between border-t border-white/5 pt-5">
        <div className="flex items-center gap-5">
          <div className="h-4 w-12 rounded-md bg-zinc-800/80 animate-pulse"></div>
          <div className="h-4 w-12 rounded-md bg-zinc-800/80 animate-pulse"></div>
        </div>
        
        {/* View Details Link Skeleton */}
        <div className="h-10 w-10 rounded-full bg-zinc-800/80 animate-pulse"></div>
      </div>
    </article>
  );
}
