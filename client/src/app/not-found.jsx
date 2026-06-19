"use client";

import Link from "next/link";
import { ArrowRight, Home } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#030303]">
      
      {/* Massive Background 404 Outline */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none">
        <h1 className="text-[35vw] font-black leading-none text-transparent opacity-[0.03] [-webkit-text-stroke:4px_#34d399]">
          404
        </h1>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-16 md:flex-row md:items-center md:justify-between">
          
          {/* Left Content */}
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400 backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                System Error
              </div>
              
              <h2 className="text-5xl font-extrabold tracking-tight text-white sm:text-7xl">
                Signal lost.
              </h2>
              
              <p className="mt-6 text-lg leading-relaxed text-zinc-400">
                The prompt or endpoint you are trying to access has been deleted, moved, or never existed in our database.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/"
                  className="group flex h-14 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-[length:200%_auto] animate-gradient-x px-8 text-sm font-bold text-zinc-950 shadow-md transition-all hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(52,211,153,0.25)]"
                >
                  <Home size={18} className="transition-transform group-hover:-translate-y-0.5" />
                  Back to Homepage
                </Link>
                <Link
                  href="/prompts"
                  className="group flex h-14 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-8 text-sm font-bold text-white backdrop-blur-md transition-all hover:scale-[1.02] hover:bg-white/10"
                >
                  Marketplace
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Right Visual Element (Abstract spinning rings) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden md:block"
          >
            <div className="relative h-64 w-64 md:h-96 md:w-96">
              <div className="absolute inset-0 rounded-full border border-dashed border-emerald-500/30 animate-[spin_20s_linear_infinite]"></div>
              <div className="absolute inset-8 rounded-full border border-cyan-500/20 animate-[spin_15s_linear_infinite_reverse]"></div>
              <div className="absolute inset-16 rounded-full border border-white/5 backdrop-blur-3xl flex items-center justify-center bg-zinc-900/30 shadow-2xl">
                <div className="flex flex-col items-center">
                  <div className="h-1 w-10 rounded-full bg-emerald-500/50 mb-2"></div>
                  <span className="text-zinc-600 font-mono text-xs tracking-widest">ERR_404</span>
                  <div className="h-1 w-10 rounded-full bg-cyan-500/50 mt-2"></div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
