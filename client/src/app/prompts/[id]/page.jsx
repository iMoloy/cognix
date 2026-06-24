"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, LockKeyhole, Sparkles, Star, Copy, Eye, BookmarkPlus, CalendarDays, TerminalSquare, MessageSquare, AlertTriangle, User as UserIcon } from "lucide-react";
import { motion } from "framer-motion";
import CopyToClipboard from "@/components/ui/CopyToClipboard";
import Button from "@/components/ui/Button";
import { useAuth } from "@/contexts/AuthContext";
import ReviewModal from "@/components/ui/ReviewModal";
import ReportModal from "@/components/ui/ReportModal";
import { toast } from "react-toastify";

export default function PromptDetailsPage() {
  const params = useParams();
  const { user, loading } = useAuth();
  const router = useRouter();

  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  const [prompt, setPrompt] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://cognix-6lqn.onrender.com";

  // Auth Protection - Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const promptId = params?.id;

  useEffect(() => {
    const fetchPrompt = async () => {
      try {
        if (!promptId) return;
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://cognix-6lqn.onrender.com";
        const res = await fetch(`${apiUrl}/api/prompts/${promptId}`);
        if (!res.ok) throw new Error("Prompt not found");
        const data = await res.json();
        
        if (!data.instruction) {
          data.instruction = "This is a detailed prompt instruction placeholder. " + data.description;
        }
        setPrompt(data);

        // Check if user has bookmarked this
        if (user) {
          try {
            const userRes = await fetch(`${apiUrl}/api/users/${user.email}`);
            if (userRes.ok) {
              const userData = await userRes.json();
              setIsBookmarked(userData?.bookmarks?.includes(promptId));
            }
          } catch (e) {
            console.error(e);
          }
        }
      } catch (error) {
        console.error("Failed to fetch prompt details", error);
      } finally {
        setIsFetching(false);
      }
    };
    fetchPrompt();
  }, [promptId, user, apiUrl]);

  const handleCopy = async (text) => {
    try {
      try {
        await navigator.clipboard.writeText(text);
        toast.success("Prompt copied to clipboard!");
      } catch (clipboardError) {
        console.error("Clipboard API failed:", clipboardError);
        toast.info("Prompt selected. Please copy manually.");
      }
      
      // Increment copy count regardless of clipboard API success
      const res = await fetch(`${apiUrl}/api/prompts/${promptId}/copy`, {
        method: "POST"
      });
      if (res.ok) {
        setPrompt(prev => ({ ...prev, copies: (prev.copies || 0) + 1 }));
      }
    } catch (error) {
      toast.error("Failed to copy prompt.");
    }
  };

  const handleBookmark = async () => {
    if (!user) {
      toast.error("Please login to bookmark prompts.");
      router.push("/login");
      return;
    }
    try {
      const res = await fetch(`${apiUrl}/api/users/bookmark`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ promptId })
      });
      
      if (res.ok) {
        const data = await res.json();
        setIsBookmarked(data.isBookmarked);
        if (data.isBookmarked) {
          toast.success("Prompt bookmarked");
        } else {
          toast.success("Bookmark removed");
        }
      } else {
        toast.error("Failed to toggle bookmark");
      }
    } catch (error) {
      toast.error("Error bookmarking prompt");
    }
  };

  const handleReviewSubmit = async ({ rating, review }) => {
    try {
      const res = await fetch(`${apiUrl}/api/reviews`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          promptId,
          rating,
          comment: review,
          userEmail: user.email,
          userName: user.displayName || user.name || "User"
        })
      });
      if (res.ok) {
        toast.success("Review submitted successfully");
        // Refetch prompt to get new reviews
        const promptRes = await fetch(`${apiUrl}/api/prompts/${promptId}`);
        if (promptRes.ok) {
          const data = await promptRes.json();
          setPrompt(data);
        }
      } else {
        toast.error("Failed to submit review");
      }
    } catch (e) {
      toast.error("Error submitting review");
    }
  };

  const handleReportSubmit = async ({ reason, details }) => {
    try {
      const res = await fetch(`${apiUrl}/api/reports`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          promptId,
          promptTitle: prompt?.title,
          reason,
          description: details,
          userEmail: user.email
        })
      });
      if (res.ok) {
        toast.success("Report submitted successfully");
      } else {
        toast.error("Failed to submit report");
      }
    } catch (e) {
      toast.error("Error submitting report");
    }
  };

  // Dynamic Access Logic
  const isPremiumUser = user?.subscription === "premium" || user?.role === "admin" || user?.role === "creator";
  const hasAccess = prompt ? (!prompt.isPremium || isPremiumUser) : false;

  if (loading || isFetching || !user) {
    return (
      <main className="relative min-h-screen bg-[#030303] pb-20">
        <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Navigation Skeleton */}
          <div className="mb-8 h-5 w-32 rounded-md bg-zinc-800/80 animate-pulse" />

          {/* HERO SECTION Skeleton */}
          <div className="flex flex-col gap-8 md:flex-row md:items-start">
            <div className="h-48 w-full max-w-[320px] rounded-2xl bg-zinc-800/80 animate-pulse md:h-64 shrink-0" />
            <div className="flex-1 space-y-5 w-full">
              <div className="flex gap-3">
                <div className="h-6 w-20 rounded-full bg-zinc-800/80 animate-pulse" />
                <div className="h-6 w-16 rounded-full bg-zinc-800/80 animate-pulse" />
              </div>
              <div className="h-10 w-3/4 rounded-md bg-zinc-800/80 animate-pulse" />
              <div className="h-6 w-full rounded-md bg-zinc-800/80 animate-pulse" />
              <div className="h-6 w-5/6 rounded-md bg-zinc-800/80 animate-pulse" />
              <div className="flex gap-6 pt-4">
                <div className="h-10 w-10 rounded-full bg-zinc-800/80 animate-pulse" />
                <div className="h-10 w-24 rounded-md bg-zinc-800/80 animate-pulse" />
              </div>
            </div>
          </div>

          {/* MAIN BODY GRID Skeleton */}
          <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_350px]">
            <div className="h-[400px] w-full rounded-2xl bg-zinc-800/80 animate-pulse" />
            <div className="space-y-6">
              <div className="h-[200px] w-full rounded-2xl bg-zinc-800/80 animate-pulse" />
              <div className="h-[150px] w-full rounded-2xl bg-zinc-800/80 animate-pulse" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!prompt) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#030303] text-white">
        <h2 className="text-2xl font-bold">Prompt Not Found</h2>
        <Button onClick={() => router.push("/prompts")} className="mt-6">Back to Marketplace</Button>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen bg-[#030303] selection:bg-emerald-500/30 pb-20">

      
      {/* Dynamic Background Image from Prompt */}
      <div className="pointer-events-none absolute inset-0 z-0 h-[600px] w-full overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20 blur-3xl"
          style={{ backgroundImage: `url(${prompt.image || "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=800&auto=format&fit=crop"})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#030303]/80 to-[#030303]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Navigation */}
        <div className="mb-8">
          <Link 
            href="/prompts" 
            className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-400 transition-colors hover:text-emerald-400"
          >
            <ArrowLeft size={16} />
            Back to Marketplace
          </Link>
        </div>

        {/* HERO SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-8 md:flex-row md:items-start"
        >
          {/* Cover Image Thumbnail */}
          <div className="shrink-0">
            <img 
              src={prompt.image || "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=800&auto=format&fit=crop"} 
              alt={prompt.title} 
              onError={(e) => {
                e.target.onerror = null; 
                e.target.src = "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=800&auto=format&fit=crop";
              }}
              className="h-48 w-full max-w-[320px] rounded-2xl border border-white/10 object-cover shadow-2xl md:h-64"
            />
          </div>

          {/* Metadata */}
          <div className="flex-1 space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400 backdrop-blur-md">
                <Sparkles size={12} /> {prompt.category}
              </span>
              <span className="rounded-full border border-zinc-700/50 bg-zinc-800/50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400 backdrop-blur-md">
                {prompt.tool}
              </span>
              {prompt.isPremium && (
                <span className="flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-500">
                  <LockKeyhole size={12} /> Premium
                </span>
              )}
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
              {prompt.title}
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-zinc-400">
              {prompt.description}
            </p>

            {/* Author & Core Stats row */}
            <div className="flex flex-wrap items-center gap-6 pt-4">
              <div className="flex items-center gap-3 pr-6 border-r border-white/10">
                <img 
                  src={prompt.creatorImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(prompt.creatorName || 'user')}`} 
                  alt={prompt.creatorName} 
                  className="h-10 w-10 rounded-full border border-white/10 bg-zinc-800 object-cover"
                />
                <div>
                  <h3 className="text-sm font-bold text-white">{prompt.creatorName}</h3>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">AI Prompt Creator</p>
                </div>
              </div>

              <div className="flex items-center gap-6 text-sm font-bold text-zinc-300">
                <span className="flex items-center gap-2"><Star size={16} className="text-amber-400" /> {prompt.rating} Rating</span>
                <span className="flex items-center gap-2"><Copy size={16} className="text-zinc-500" /> {prompt.copies} Copies</span>
              </div>
              
              <Button onClick={handleBookmark} variant={isBookmarked ? "primary" : "secondary"} className="ml-auto px-5 py-2.5 text-sm">
                <BookmarkPlus size={18} className="mr-2" /> {isBookmarked ? "Saved" : "Save"}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* MAIN BODY GRID */}
        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_350px]">
          
          {/* Left Column: Prompt Engine */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-8"
          >
            {/* Prompt Instruction Window */}
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/60 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.02] px-5 py-3">
                <div className="flex items-center gap-2 text-sm font-bold text-zinc-300">
                  <TerminalSquare size={16} className="text-emerald-400" />
                  Prompt Instruction Payload
                </div>
                {hasAccess && (
                  <Button variant="ghost" className="h-8 text-xs font-bold" onClick={() => handleCopy(prompt.instruction)}>
                    <Copy size={14} className="mr-2" /> Copy Prompt
                  </Button>
                )}
              </div>

              <div className="relative p-6 min-h-[350px]">
                {/* Paywall Blur Layer */}
                {!hasAccess && prompt.isPremium && (
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#030303]/80 p-6 backdrop-blur-[8px]">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 shadow-[0_0_30px_rgba(52,211,153,0.3)] ring-1 ring-emerald-500/20">
                      <LockKeyhole size={28} className="text-emerald-400" />
                    </div>
                    <h3 className="mt-6 text-2xl font-bold text-white">Unlock This Premium Prompt</h3>
                    <p className="mt-3 text-center text-sm font-medium text-zinc-400 max-w-sm leading-relaxed">
                      This is a highly optimized, battle-tested prompt. Unlock it to access the full instructions and drastically improve your workflow.
                    </p>
                    <Button 
                      onClick={() => router.push("/payment")}
                      className="mt-8 px-10 py-4 text-base"
                    >
                      Unlock Now for ${prompt.price}
                    </Button>
                  </div>
                )}

                {/* Actual payload */}
                <pre className={`whitespace-pre-wrap font-mono text-sm leading-relaxed text-emerald-50/90 ${!hasAccess && prompt.isPremium ? "blur-[6px] select-none opacity-40" : ""}`}>
                  {prompt.instruction}
                </pre>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Reviews & Extra Actions */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Reviews Section */}
            <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-6 backdrop-blur-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <MessageSquare size={18} className="text-emerald-400" />
                  Reviews
                </h3>
                <Button 
                  variant="ghost"
                  onClick={() => setIsReviewOpen(true)}
                  className="text-xs text-emerald-400 hover:text-emerald-300"
                >
                  + Add Review
                </Button>
              </div>

              {(!prompt.reviews || prompt.reviews.length === 0) ? (
                <p className="text-sm text-zinc-500 italic">No reviews yet.</p>
              ) : (
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {prompt.reviews.map((review) => (
                    <div key={review.id} className="rounded-xl border border-white/5 bg-zinc-950/50 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-bold text-white flex items-center gap-2">
                          <UserIcon size={12} className="text-zinc-500" /> {review.user}
                        </p>
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={10} className={i < review.rating ? "fill-amber-400 text-amber-400" : "text-zinc-700"} />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed">{review.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Meta Info */}
            <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-6 backdrop-blur-2xl">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-4">Prompt Details</h4>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Published</span>
                  <span className="font-medium text-white">{prompt.createdAt}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Total Views</span>
                  <span className="font-medium text-white">{prompt.views}</span>
                </div>
              </div>
            </div>

            {/* Report */}
            <div className="flex justify-center pt-2">
              <Button 
                variant="ghost"
                onClick={() => setIsReportOpen(true)}
                className="text-xs text-zinc-600 hover:text-rose-400"
              >
                <AlertTriangle size={14} className="mr-2" /> Report this prompt
              </Button>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Modals */}
      <ReviewModal 
        isOpen={isReviewOpen} 
        onClose={() => setIsReviewOpen(false)} 
        promptTitle={prompt.title} 
        onSubmit={handleReviewSubmit}
      />
      
      <ReportModal 
        isOpen={isReportOpen} 
        onClose={() => setIsReportOpen(false)} 
        promptTitle={prompt.title} 
        onSubmit={handleReportSubmit}
      />
    </main>
  );
}
