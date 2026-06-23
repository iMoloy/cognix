"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function FloatingPremiumButton() {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  // Do not show while auth is loading
  if (loading) return null;

  // Do not show if the user is not logged in
  if (!user) return null;

  // Do not show if the user is already premium
  if (user?.subscription === "premium") return null;

  // Do not show on the payment page itself or login/register pages
  if (pathname === "/payment" || pathname === "/login" || pathname === "/register") return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 50 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Link
          href="/payment"
          className="group relative flex items-center gap-2 overflow-hidden rounded-full border border-amber-400/50 bg-zinc-950/80 p-1 pr-5 shadow-[0_0_20px_rgba(251,191,36,0.15)] backdrop-blur-xl transition-all hover:scale-105 hover:border-amber-400 hover:shadow-[0_0_30px_rgba(251,191,36,0.3)]"
        >
          <div className="absolute inset-0 z-0 bg-gradient-to-r from-amber-400/0 via-amber-400/10 to-amber-400/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-hover:animate-gradient-x bg-[length:200%_auto]"></div>
          
          <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-amber-500 shadow-inner">
            <Star size={20} className="fill-amber-100 text-amber-100 transition-transform duration-500 group-hover:rotate-[72deg] group-hover:scale-110" />
          </div>
          
          <div className="relative z-10 flex flex-col">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400 transition-colors group-hover:text-amber-300">
              Go Premium
            </span>
            <span className="text-[10px] font-medium text-zinc-400">
              Unlock all prompts
            </span>
          </div>
        </Link>
      </motion.div>
    </AnimatePresence>
  );
}
