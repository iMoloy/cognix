"use client";

import { motion } from "framer-motion";
import PromptCard from "@/components/ui/PromptCard";
import { useState, useEffect } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";

export default function FeaturedPrompts() {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const response = await axios.get(`${API_URL}/api/prompts`);
        // Sort by copies descending and take top 6
        const promptsArray = response.data.prompts || response.data || [];
        const sortedPrompts = promptsArray.sort((a, b) => (b.copies || 0) - (a.copies || 0)).slice(0, 6);
        setPrompts(sortedPrompts);
      } catch (error) {
        console.error("Failed to fetch prompts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPrompts();
  }, []);

  return (
    <section className="relative z-10 px-4 py-24 sm:px-6 lg:px-8 border-t border-white/5 bg-[#030303]">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl">
            Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Prompts</span>
          </h2>
          <p className="mt-4 text-zinc-400 max-w-2xl mx-auto">
            Discover the most highly-rated, battle-tested AI prompts handpicked by our community of creators.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <div className="col-span-full flex justify-center py-20">
              <Loader2 className="animate-spin text-emerald-500" size={32} />
            </div>
          ) : prompts.map((prompt, index) => (
            <PromptCard key={prompt._id} prompt={prompt} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
