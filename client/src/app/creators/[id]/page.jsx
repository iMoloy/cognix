"use client";

import { motion } from "framer-motion";
import { Copy, Star, MapPin, Globe, Mail, ShieldCheck, Link as LinkIcon, Loader2 } from "lucide-react";
import PromptCard from "@/components/ui/PromptCard";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function CreatorDetailsPage() {
  const params = useParams();
  const creatorId = params.id;
  
  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCreatorDetails = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const response = await axios.get(`${API_URL}/api/users/creator/${creatorId}`);
        setCreator(response.data);
      } catch (error) {
        console.error("Failed to fetch creator details:", error);
        toast.error("Failed to fetch creator details");
      } finally {
        setLoading(false);
      }
    };
    
    if (creatorId) {
      fetchCreatorDetails();
    }
  }, [creatorId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#030303] flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-500" size={48} />
      </main>
    );
  }

  if (!creator) {
    return (
      <main className="min-h-screen bg-[#030303] flex items-center justify-center">
        <h1 className="text-2xl text-white font-bold">Creator not found</h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#030303] pb-24">
      {/* Cover Image Banner */}
      <div className="relative h-64 sm:h-80 w-full overflow-hidden">
        <img 
          src={creator.coverImage} 
          alt="Cover" 
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-[#030303]/60 to-transparent"></div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-24 sm:-mt-32 flex flex-col sm:flex-row gap-6 sm:gap-10">
          
          {/* Profile Image & Quick Actions */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center sm:items-start shrink-0"
          >
            <div className="relative h-32 w-32 sm:h-48 sm:w-48 rounded-full border-4 border-[#030303] bg-zinc-900 overflow-hidden shadow-2xl">
              <img src={creator.image} alt={creator.name} className="h-full w-full object-cover" />
            </div>
            <button className="mt-6 w-full rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 px-6 py-3 text-sm font-bold text-zinc-950 shadow-[0_0_20px_rgba(52,211,153,0.3)] transition-all hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(52,211,153,0.5)]">
              Follow Creator
            </button>
            <div className="mt-4 flex w-full justify-center gap-4 text-zinc-400">
              <button className="hover:text-emerald-400 transition-colors"><Globe size={20} /></button>
              <button className="hover:text-emerald-400 transition-colors"><LinkIcon size={20} /></button>
              <button className="hover:text-emerald-400 transition-colors"><Mail size={20} /></button>
            </div>
          </motion.div>

          {/* Profile Details */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex-1 pt-4 sm:pt-32"
          >
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white">{creator.name}</h1>
              {creator.verified && (
                <ShieldCheck className="text-emerald-400 mt-1 sm:mt-2" size={28} />
              )}
            </div>
            <p className="mt-2 text-lg sm:text-xl font-medium text-emerald-400">{creator.role}</p>
            
            <div className="mt-4 flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-zinc-400">
              <span className="flex items-center gap-1.5"><MapPin size={16} /> {creator.location}</span>
              <span className="flex items-center gap-1.5"><Globe size={16} /> {creator.website}</span>
              <span className="text-zinc-500">{creator.joinedDate}</span>
            </div>

            <p className="mt-6 max-w-3xl text-base leading-relaxed text-zinc-300">
              {creator.bio}
            </p>

            {/* Stats Grid */}
            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl">
              <div className="rounded-2xl border border-white/5 bg-zinc-900/40 p-5 backdrop-blur-md">
                <p className="text-2xl font-bold text-white">{creator.promptsCount}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-zinc-500">Prompts</p>
              </div>
              <div className="rounded-2xl border border-white/5 bg-zinc-900/40 p-5 backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <Copy size={20} className="text-zinc-400" />
                  <p className="text-2xl font-bold text-white">{creator.copies}</p>
                </div>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-zinc-500">Total Copies</p>
              </div>
              <div className="rounded-2xl border border-white/5 bg-zinc-900/40 p-5 backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <Star size={20} className="text-amber-500" />
                  <p className="text-2xl font-bold text-white">{creator.rating}</p>
                </div>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-zinc-500">Avg Rating</p>
              </div>
              <div className="rounded-2xl border border-white/5 bg-zinc-900/40 p-5 backdrop-blur-md">
                <p className="text-2xl font-bold text-white">{creator.followers}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-zinc-500">Followers</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Creator's Prompts Tab */}
        <div className="mt-20 border-t border-white/10 pt-10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">Prompts by {creator.name}</h2>
            <div className="flex gap-2">
              <button className="rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20 transition-colors">Latest</button>
              <button className="rounded-lg bg-transparent px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors">Popular</button>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {creator.prompts && creator.prompts.length > 0 ? creator.prompts.map((prompt, index) => (
              <PromptCard key={prompt._id} prompt={prompt} index={index} />
            )) : (
              <p className="text-zinc-500 col-span-full">This creator has not published any prompts yet.</p>
            )}
          </div>
        </div>

      </div>
    </main>
  );
}
