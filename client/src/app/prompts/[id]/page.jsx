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
import { mockPrompts } from "@/lib/mockData";

export default function PromptDetailsPage() {
  const params = useParams();
  const { user, loading } = useAuth();
  const router = useRouter();

  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  // Auth Protection - Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Find the exact prompt from mockData using params.id
  // If not found (e.g. testing with random ID), fallback to the first one
  const promptId = params?.id || "1";
  const mockPrompt = mockPrompts.find(p => p._id === promptId) || mockPrompts[0];
  
  // Provide a fallback instruction if missing
  if (!mockPrompt.instruction) {
    mockPrompt.instruction = "This is a detailed prompt instruction placeholder. " + mockPrompt.description;
  }

  // Dynamic Access Logic
  const isPremiumUser = user?.subscription === "premium" || user?.role === "admin" || user?.role === "creator";
  const hasAccess = !mockPrompt.isPremium || isPremiumUser;

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#030303]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <main className="relative min-h-screen bg-[#030303] selection:bg-emerald-500/30 pb-20">
      
      {/* Dynamic Background Image from Prompt */}
      <div className="pointer-events-none absolute inset-0 z-0 h-[600px] w-full overflow-hidden">
        {mockPrompt.image && (
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-20 blur-3xl"
            style={{ backgroundImage: `url(${mockPrompt.image})` }}
          />
        )}
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
          {mockPrompt.image && (
            <div className="shrink-0">
              <img 
                src={mockPrompt.image} 
                alt={mockPrompt.title} 
                className="h-48 w-full max-w-[320px] rounded-2xl border border-white/10 object-cover shadow-2xl md:h-64"
              />
            </div>
          )}

          {/* Metadata */}
          <div className="flex-1 space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400 backdrop-blur-md">
                <Sparkles size={12} /> {mockPrompt.category}
              </span>
              <span className="rounded-full border border-zinc-700/50 bg-zinc-800/50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400 backdrop-blur-md">
                {mockPrompt.tool}
              </span>
              {mockPrompt.isPremium && (
                <span className="flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-500">
                  <LockKeyhole size={12} /> Premium
                </span>
              )}
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
              {mockPrompt.title}
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-zinc-400">
              {mockPrompt.description}
            </p>

            {/* Author & Core Stats row */}
            <div className="flex flex-wrap items-center gap-6 pt-4">
              <div className="flex items-center gap-3 pr-6 border-r border-white/10">
                <img 
                  src={mockPrompt.author.avatar} 
                  alt={mockPrompt.author.name} 
                  className="h-10 w-10 rounded-full border border-white/10 bg-zinc-800"
                />
                <div>
                  <h3 className="text-sm font-bold text-white">{mockPrompt.author.name}</h3>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">{mockPrompt.author.role}</p>
                </div>
              </div>

              <div className="flex items-center gap-6 text-sm font-bold text-zinc-300">
                <span className="flex items-center gap-2"><Star size={16} className="text-amber-400" /> {mockPrompt.rating} Rating</span>
                <span className="flex items-center gap-2"><Copy size={16} className="text-zinc-500" /> {mockPrompt.copies} Copies</span>
              </div>
              
              <Button variant="secondary" className="ml-auto px-5 py-2.5 text-sm">
                <BookmarkPlus size={18} className="mr-2" /> Save
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
                {hasAccess && <CopyToClipboard text={mockPrompt.instruction} />}
              </div>

              <div className="relative p-6 min-h-[350px]">
                {/* Paywall Blur Layer */}
                {!hasAccess && mockPrompt.isPremium && (
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
                      Unlock Now for ${mockPrompt.price}
                    </Button>
                  </div>
                )}

                {/* Actual payload */}
                <pre className={`whitespace-pre-wrap font-mono text-sm leading-relaxed text-emerald-50/90 ${!hasAccess && mockPrompt.isPremium ? "blur-[6px] select-none opacity-40" : ""}`}>
                  {mockPrompt.instruction}
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

              {mockPrompt.reviews.length === 0 ? (
                <p className="text-sm text-zinc-500 italic">No reviews yet.</p>
              ) : (
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {mockPrompt.reviews.map((review) => (
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
                  <span className="font-medium text-white">{mockPrompt.createdAt}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Total Views</span>
                  <span className="font-medium text-white">{mockPrompt.views}</span>
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
        promptTitle={mockPrompt.title} 
      />
      
      <ReportModal 
        isOpen={isReportOpen} 
        onClose={() => setIsReportOpen(false)} 
        promptTitle={mockPrompt.title} 
      />
    </main>
  );
}
