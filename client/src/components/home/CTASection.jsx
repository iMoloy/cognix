"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function CTASection() {
  const { isAuthenticated } = useAuth();

  return (
    <section className="relative z-10 px-4 py-24 sm:px-6 lg:px-8 border-t border-white/5 bg-[#030303] overflow-hidden">
      {/* Glow behind CTA */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[600px] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none"></div>

      <div className="mx-auto max-w-4xl relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="rounded-3xl border border-emerald-500/20 bg-emerald-950/20 p-10 sm:p-16 text-center backdrop-blur-xl shadow-[0_0_50px_rgba(52,211,153,0.1)]"
        >
          <h2 className="text-3xl font-extrabold leading-tight text-white sm:text-5xl mb-6">
            Ready to supercharge your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">workflows?</span>
          </h2>
          <p className="text-zinc-400 text-lg mb-10 max-w-2xl mx-auto">
            Join thousands of developers, creators, and professionals sharing and discovering the best AI prompts on the internet.
          </p>
          
          {!isAuthenticated ? (
            <Link
              href="/register"
              className="group inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-[length:200%_auto] animate-gradient-x px-8 text-sm font-bold text-zinc-950 shadow-[0_0_20px_rgba(52,211,153,0.3)] transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(52,211,153,0.5)]"
            >
              Get Started for Free
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
          ) : (
            <Link
              href="/prompts"
              className="group inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-[length:200%_auto] animate-gradient-x px-8 text-sm font-bold text-zinc-950 shadow-[0_0_20px_rgba(52,211,153,0.3)] transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(52,211,153,0.5)]"
            >
              Explore Prompts
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
          )}
        </motion.div>
      </div>
    </section>
  );
}
