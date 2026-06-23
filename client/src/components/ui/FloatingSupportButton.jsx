"use client";

import Link from "next/link";
import { LifeBuoy } from "lucide-react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function FloatingSupportButton() {
  const pathname = usePathname();

  // Do not show on the help page itself or login/register pages
  if (pathname === "/dashboard/help" || pathname === "/login" || pathname === "/register") return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 50 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 1 }}
        className="fixed bottom-6 left-6 z-50"
      >
        <Link
          href="/dashboard/help"
          className="group relative flex items-center justify-center h-12 w-12 sm:w-auto sm:h-auto sm:gap-2 overflow-hidden rounded-full border border-cyan-400/30 bg-zinc-950/80 sm:p-1 sm:pr-5 shadow-[0_0_20px_rgba(34,211,238,0.15)] backdrop-blur-xl transition-all hover:scale-105 hover:border-cyan-400/60 hover:shadow-[0_0_30px_rgba(34,211,238,0.3)]"
          aria-label="Help & Support"
        >
          <div className="absolute inset-0 z-0 bg-gradient-to-r from-cyan-400/0 via-cyan-400/10 to-cyan-400/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-hover:animate-gradient-x bg-[length:200%_auto]"></div>
          
          <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-500/10 transition-colors group-hover:bg-cyan-500/20">
            <LifeBuoy size={20} className="text-cyan-400 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" />
          </div>
          
          <div className="relative z-10 hidden flex-col sm:flex">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 transition-colors group-hover:text-cyan-300">
              Support
            </span>
            <span className="text-[10px] font-medium text-zinc-400">
              Need help?
            </span>
          </div>
        </Link>
      </motion.div>
    </AnimatePresence>
  );
}
