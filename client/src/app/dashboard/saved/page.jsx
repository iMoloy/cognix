"use client";

import PromptCard from "@/components/ui/PromptCard";
import { Bookmark } from "lucide-react";

// Local mock data for saved prompts
const savedPrompts = [
  {
    _id: "1",
    title: "Next.js API Route Architect",
    description: "Generate secure, perfectly typed Next.js App Router API endpoints with built-in Zod validation, error handling, and rate limiting.",
    category: "Architecture",
    tool: "ChatGPT-4",
    rating: 4.9,
    price: 5,
    author: { name: "Alex Dev", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" },
    isPremium: true
  },
  {
    _id: "2",
    title: "SaaS Landing Page Copywriter",
    description: "High-converting copy for B2B SaaS landing pages targeting enterprise clients.",
    category: "Marketing",
    tool: "Claude 3",
    rating: 4.8,
    price: 0,
    author: { name: "Sarah Copy", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" },
    isPremium: false
  }
];

export default function SavedPromptsPage() {

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
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {savedPrompts.map((prompt, index) => (
            <PromptCard key={prompt._id} prompt={prompt} index={index} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-zinc-900/40 py-32 text-center backdrop-blur-xl">
          <div className="rounded-full bg-white/5 p-6 mb-4">
            <Bookmark size={40} className="text-zinc-500" />
          </div>
          <h3 className="text-xl font-bold text-white">Your library is empty</h3>
          <p className="mt-2 max-w-sm text-sm text-zinc-400">
            You haven't saved any prompts yet. Explore the marketplace and bookmark your favorites to access them here.
          </p>
        </div>
      )}
    </div>
  );
}
