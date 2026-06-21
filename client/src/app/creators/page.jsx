"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Copy, Star, Award, Search, Filter, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

export default function CreatorsPage() {
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCreators = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const response = await axios.get(`${API_URL}/api/users/top-creators`);
        setCreators(response.data);
      } catch (error) {
        console.error("Failed to fetch creators:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCreators();
  }, []);

  return (
    <div className="min-h-screen bg-[#030303] pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-extrabold text-white sm:text-5xl">
              Top <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Creators</span>
            </h1>
            <p className="mt-4 text-lg text-zinc-400 max-w-2xl">
              Discover and follow the masterminds behind the most popular AI prompts in our ecosystem.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center gap-3 w-full md:w-auto"
          >
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input
                type="text"
                placeholder="Search creators..."
                className="w-full rounded-xl border border-white/10 bg-zinc-900/50 py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-500 outline-none focus:border-emerald-500/50 focus:bg-white/5 transition-all"
              />
            </div>
            <button className="flex h-[42px] items-center gap-2 rounded-xl border border-white/10 bg-zinc-900/50 px-4 text-sm font-medium text-white transition-all hover:bg-white/5 shrink-0">
              <Filter size={16} />
              <span className="hidden sm:inline">Filter</span>
            </button>
          </motion.div>
        </div>

        {/* Creators Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <div className="col-span-full flex justify-center py-20">
              <Loader2 className="animate-spin text-emerald-500" size={32} />
            </div>
          ) : creators.map((creator, i) => (
            <motion.div
              key={creator._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link
                href={`/creators/${creator._id}`}
                className="group relative flex flex-col items-center rounded-2xl border border-white/5 bg-zinc-900/40 p-8 backdrop-blur-sm transition-all hover:border-emerald-500/30 hover:bg-zinc-900/60 hover:-translate-y-2 h-full"
              >
                <div className="absolute top-0 right-0 p-4">
                  <Award size={22} className="text-amber-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>
                
                <div className="relative mb-6 h-28 w-28 rounded-full border-2 border-white/10 p-1 transition-all duration-500 group-hover:border-emerald-400 group-hover:shadow-[0_0_20px_rgba(52,211,153,0.3)]">
                  <img
                    src={creator.image}
                    alt={creator.name}
                    className="h-full w-full rounded-full object-cover"
                  />
                </div>
                
                <h3 className="text-xl font-bold text-zinc-100 group-hover:text-emerald-300 transition-colors">
                  {creator.name}
                </h3>
                <p className="mt-1 text-sm font-medium text-emerald-500/80 uppercase tracking-wider">
                  {creator.role}
                </p>

                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {creator.specialties && creator.specialties.map(spec => (
                    <span key={spec} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-bold tracking-wider text-zinc-400">
                      {spec}
                    </span>
                  ))}
                </div>
                
                <div className="mt-8 flex w-full items-center justify-between border-t border-white/5 pt-6 px-4">
                  <div className="flex flex-col items-center">
                    <span className="flex items-center gap-1.5 text-base font-bold text-zinc-200">
                      {creator.promptsCount}
                    </span>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Prompts</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="flex items-center gap-1.5 text-base font-bold text-zinc-200">
                      <Copy size={14} className="text-zinc-500" />
                      {creator.copies}
                    </span>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Copies</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="flex items-center gap-1.5 text-base font-bold text-zinc-200">
                      <Star size={14} className="text-amber-500" />
                      {creator.rating}
                    </span>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Rating</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
