import Link from "next/link";
import { BrainCircuit, Globe, MessageSquare, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-[#030303] py-10 overflow-hidden">
      {/* Super subtle glowing top border edge */}
      <div className="absolute top-0 left-1/2 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent"></div>
      
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-6 px-4 sm:flex-row sm:px-6 lg:px-8">
        
        {/* Brand & Copyright */}
        <div className="flex flex-col items-center gap-3 sm:items-start">
          <Link href="/" className="group flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-emerald-400 transition-colors group-hover:border-emerald-500/30 group-hover:bg-emerald-500/10">
              <BrainCircuit size={14} />
            </div>
            <span className="text-sm font-extrabold tracking-tight text-white transition-colors group-hover:text-emerald-400">Cognix</span>
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
            
            <div className="h-3 w-px bg-white/10"></div>
            
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
    </footer>
  );
}
