"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Copy, Star, Award, ArrowRight, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

export default function TopCreators() {
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopCreators = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const response = await axios.get(`${API_URL}/api/users/top-creators`);
        setCreators(response.data.slice(0, 4)); // Only show top 4 on home page
      } catch (error) {
        console.error("Failed to fetch top creators:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTopCreators();
  }, []);

  return (
    <section className="relative z-10 px-4 py-24 sm:px-6 lg:px-8 border-t border-white/5 bg-[#030303]">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6"
        >
          <div>
            <h2 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl">
              Top <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Creators</span>
            </h2>
            <p className="mt-4 text-zinc-400 max-w-xl">
              Meet the brilliant minds behind the most popular prompts on Cognix.
            </p>
          </div>
          <Link 
            href="/creators"
            className="group flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-[length:200%_auto] animate-gradient-x px-6 text-sm font-bold text-zinc-950 shadow-[0_0_20px_rgba(52,211,153,0.3)] transition-all hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(52,211,153,0.5)] shrink-0 w-fit"
          >
            View All Creators
            <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {loading ? (
            <div className="col-span-full flex justify-center py-20">
              <Loader2 className="animate-spin text-emerald-500" size={32} />
            </div>
          ) : creators.map((creator, i) => (
            <motion.div
              key={creator._id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link
                href={`/creators/${creator._id}`}
                className="group relative flex h-full flex-col items-center rounded-2xl border border-white/5 bg-zinc-900/40 p-8 backdrop-blur-sm transition-all hover:border-emerald-500/30 hover:bg-zinc-900/60 hover:-translate-y-2"
              >
                <div className="absolute top-0 right-0 p-4">
                  <Award size={20} className="text-amber-500 opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <div className="relative mb-6 h-24 w-24 rounded-full border-2 border-white/10 p-1 transition-all group-hover:border-emerald-400">
                  <img
                    src={creator.image}
                    alt={creator.name}
                    className="h-full w-full rounded-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-bold text-zinc-100 group-hover:text-emerald-300 transition-colors">
                  {creator.name}
                </h3>
                <p className="mt-1 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  {creator.role}
                </p>
                
                <div className="mt-6 flex items-center justify-center gap-6 border-t border-white/5 pt-6 w-full">
                  <div className="flex flex-col items-center">
                    <span className="flex items-center gap-1.5 text-sm font-bold text-zinc-300">
                      <Copy size={14} className="text-zinc-500" />
                      {creator.copies}
                    </span>
                    <span className="text-[10px] text-zinc-600 uppercase tracking-widest mt-1">Copies</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="flex items-center gap-1.5 text-sm font-bold text-zinc-300">
                      <Star size={14} className="text-amber-500" />
                      {creator.rating}
                    </span>
                    <span className="text-[10px] text-zinc-600 uppercase tracking-widest mt-1">Rating</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
