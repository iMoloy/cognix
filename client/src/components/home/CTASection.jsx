"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function CTASection() {
  const { isAuthenticated } = useAuth();

  return (
    <section className="relative z-10 px-4 py-24 sm:px-6 lg:px-8 border-t border-white/5 bg-[#030303] overflow-hidden">
      {/* Background Effects */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[800px] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none"></div>

      <div className="mx-auto max-w-5xl relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#09090b] px-6 py-16 sm:px-16 sm:py-24 text-center shadow-2xl"
        >
          {/* Subtle noise/grid overlay inside the card */}
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.02] pointer-events-none"></div>
          
          {/* Top highlight line */}
          <div className="absolute top-0 left-1/2 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>

          <div className="relative z-10 flex flex-col items-center">
            {/* Operational Tag */}
            <div className="mb-8 flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-emerald-400 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              All systems operational
            </div>

            <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl mb-6 max-w-3xl">
              Supercharge your <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-zinc-500">AI workflows today.</span>
            </h2>
            
            <p className="text-zinc-400 text-lg sm:text-xl mb-10 max-w-2xl font-medium">
              Join top developers and creators. Publish, review, and monetize battle-tested AI prompts on the most advanced marketplace.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              {!isAuthenticated ? (
                <Link
                  href="/register"
                  className="group flex h-14 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-[length:200%_auto] animate-gradient-x px-8 text-base font-bold text-zinc-950 shadow-[0_0_20px_rgba(52,211,153,0.3)] transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(52,211,153,0.5)] w-full sm:w-auto"
                >
                  Get Started for Free
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </Link>
              ) : (
                <Link
                  href="/prompts"
                  className="group flex h-14 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-[length:200%_auto] animate-gradient-x px-8 text-base font-bold text-zinc-950 shadow-[0_0_20px_rgba(52,211,153,0.3)] transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(52,211,153,0.5)] w-full sm:w-auto"
                >
                  Explore Prompts
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </Link>
              )}
              
              <Link
                href="/creators"
                className="group flex h-14 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-8 text-base font-bold text-white backdrop-blur-md transition-all hover:bg-white/10 hover:border-emerald-500/30 w-full sm:w-auto"
              >
                Meet the Creators
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1 text-zinc-400 group-hover:text-emerald-400" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
