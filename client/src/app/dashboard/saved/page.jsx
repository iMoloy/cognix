"use client";

import PromptCard from "@/components/ui/PromptCard";
import { Bookmark } from "lucide-react";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";

export default function SavedPromptsPage() {
  const { user } = useAuth();
  const [savedPrompts, setSavedPrompts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      if (!user?.email) return;
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://cognix-6lqn.onrender.com";
        const token = localStorage.getItem("cognix_token");
        const res = await fetch(`${apiUrl}/api/users/bookmarks/${user.email}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setSavedPrompts(data);
        } else {
          toast.error("Failed to fetch saved prompts");
        }
      } catch (e) {
        console.error("Failed to fetch saved prompts", e);
        toast.error("Failed to fetch saved prompts");
      } finally {
        setLoading(false);
      }
    };
    fetchBookmarks();
  }, [user]);

  if (loading) return <div className="text-zinc-400">Loading saved prompts...</div>;

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
            You haven&apos;t saved any prompts yet. Explore the marketplace and bookmark your favorites to access them here.
          </p>
        </div>
      )}
    </div>
  );
}
