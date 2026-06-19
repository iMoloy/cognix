"use client";

import { BrainCircuit, CheckCircle2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function AuthShell({ title, subtitle, children }) {
  return (
    <main className="relative min-h-[calc(100vh-4rem)] bg-[#030303] px-4 py-12 selection:bg-emerald-500/30 flex items-center justify-center">
      
      {/* Background Orbs */}
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
        <div className="absolute top-0 left-[-10%] h-[600px] w-[600px] rounded-full bg-emerald-500/5 blur-[120px] opacity-50" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-cyan-500/5 blur-[120px] opacity-50" />
      </div>

      <section className="relative z-10 mx-auto grid w-full max-w-6xl overflow-hidden rounded-3xl border border-white/5 bg-zinc-950/50 shadow-2xl backdrop-blur-2xl lg:grid-cols-[1fr_1.1fr]">
        
        {/* Left Side: Branding & Features */}
        <div className="relative hidden lg:flex min-h-[600px] flex-col justify-between overflow-hidden bg-black/40 p-10 text-white border-r border-white/5">
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-[0.05]"></div>
          
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10"
          >
            <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-400 text-zinc-950 shadow-[0_0_20px_rgba(52,211,153,0.3)]">
              <BrainCircuit size={26} strokeWidth={2.5} />
            </div>
            <h1 className="mt-10 max-w-sm text-4xl font-extrabold leading-[1.15] tracking-tight">
              Build your prompt library with <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">confidence.</span>
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-zinc-400">
              Cognix is the premium space for creators to publish, discover, bookmark, review, and monetize battle-tested AI workflows.
            </p>

            <div className="mt-10 space-y-4">
              {[
                "Role-based dashboard access",
                "Premium prompt paywall ready",
                "Search and moderation friendly data"
              ].map((item, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + (i * 0.1) }}
                  key={item} 
                  className="flex items-center gap-4 text-sm font-semibold text-zinc-300"
                >
                  <div className="flex size-6 items-center justify-center rounded-full bg-emerald-500/10">
                    <CheckCircle2 size={14} className="text-emerald-400" />
                  </div>
                  {item}
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="relative z-10 grid grid-cols-3 gap-4"
          >
            <div className="rounded-xl border border-white/5 bg-white/5 p-4 backdrop-blur-md">
              <strong className="block text-2xl font-bold text-white">5+</strong>
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">AI tools</span>
            </div>
            <div className="rounded-xl border border-white/5 bg-white/5 p-4 backdrop-blur-md">
              <strong className="block text-2xl font-bold text-emerald-400">$5</strong>
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Premium</span>
            </div>
            <div className="rounded-xl border border-white/5 bg-white/5 p-4 backdrop-blur-md">
              <strong className="flex items-center gap-1.5 text-2xl font-bold text-white">
                <Sparkles size={18} className="text-cyan-400" />
                RBAC
              </strong>
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Secure roles</span>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Auth Form Container */}
        <div className="flex items-center justify-center bg-transparent p-6 sm:p-10 lg:p-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            <h2 className="text-3xl font-extrabold text-white">{title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">{subtitle}</p>
            <div className="mt-10">{children}</div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
