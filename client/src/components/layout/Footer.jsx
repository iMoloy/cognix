import Link from "next/link";
import { BrainCircuit, Globe, MessageSquare, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-[#030303] py-10 overflow-hidden">
      {/* SVG Gradient Definition */}
      <svg width="0" height="0" className="absolute">
        <linearGradient id="icon-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="50%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#34d399" />
        </linearGradient>
      </svg>

      {/* Super subtle glowing top border edge */}
      <div className="absolute top-0 left-1/2 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent"></div>
      
      <div className="mx-auto flex w-full max-w-7xl flex-col px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row pb-8 border-b border-white/5">
          {/* Brand & Copyright */}
          <div className="flex flex-col items-center gap-3 sm:items-start">
            <Link href="/" className="group flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-lg border border-white/10 bg-white/5 transition-colors group-hover:border-emerald-500/30 group-hover:bg-emerald-500/10">
                <BrainCircuit size={14} color="url(#icon-gradient)" />
              </div>
              <span className="bg-[length:200%_auto] animate-gradient-x bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-clip-text text-sm font-extrabold tracking-tight text-transparent">Cognix</span>
            </Link>
            <p className="text-xs font-medium text-zinc-500">
              © {new Date().getFullYear()} Cognix Platform. All rights reserved.
            </p>
          </div>

          {/* Links & Socials */}
          <div className="flex flex-col items-center gap-5 sm:items-end">
            <div className="flex items-center gap-6 text-xs font-semibold text-zinc-500">
              <Link href="/privacy" className="transition-colors hover:text-white">Privacy Policy</Link>
              <Link href="/terms" className="transition-colors hover:text-white">Terms of Service</Link>
              
              <div className="h-3 w-px bg-white/10 hidden sm:block"></div>
              
              <div className="flex items-center gap-4">
                <a href="#" className="transition-colors hover:text-white" aria-label="Website"><Globe size={15} /></a>
                <a href="#" className="transition-colors hover:text-white" aria-label="Community"><MessageSquare size={15} /></a>
                <a href="#" className="transition-colors hover:text-white" aria-label="Support"><Mail size={15} /></a>
              </div>
            </div>
            
            <div className="flex items-center gap-2 rounded-full border border-emerald-500/10 bg-emerald-500/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              </span>
              All systems operational
            </div>
          </div>
        </div>

        {/* Platform Links Row (Centered at the bottom) */}
        <div className="flex flex-wrap justify-center items-center gap-4 mt-8 text-xs font-bold text-zinc-500">
          <Link href="/prompts" className="hover:text-emerald-400 transition-colors">All Prompts</Link>
          <div className="h-1 w-1 rounded-full bg-white/10"></div>
          <Link href="/prompts" className="hover:text-emerald-400 transition-colors">Trending Prompts</Link>
          <div className="h-1 w-1 rounded-full bg-white/10"></div>
          <Link href="/login" className="hover:text-emerald-400 transition-colors">Login</Link>
          <div className="h-1 w-1 rounded-full bg-white/10"></div>
          <Link href="/register" className="hover:text-emerald-400 transition-colors">Register</Link>
          <div className="h-1 w-1 rounded-full bg-white/10"></div>
          <Link href="/demo" className="hover:text-emerald-400 transition-colors">Demo User</Link>
        </div>

      </div>
    </footer>
  );
}
