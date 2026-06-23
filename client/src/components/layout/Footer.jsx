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
            <Link href="/" className="group flex items-center gap-3">
              <div className="flex size-7 items-center justify-center rounded-lg border border-white/10 bg-white/5 transition-colors group-hover:border-emerald-500/30 group-hover:bg-emerald-500/10">
                <BrainCircuit size={14} color="url(#icon-gradient)" />
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-[length:200%_auto] animate-gradient-x bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-clip-text text-2xl font-extrabold tracking-tight text-transparent leading-none">Cognix</span>
                <span className="text-zinc-600/80 text-base leading-none">|</span>
                <span className="text-zinc-500 text-xs font-medium">Premium Prompts</span>
              </div>
            </Link>
            <p className="text-xs font-medium text-zinc-500">
              © {new Date().getFullYear()} Cognix Platform. All rights reserved.
            </p>
          </div>

          {/* Links & Socials */}
            <div className="flex flex-col items-center gap-5 sm:items-end">
            <div className="flex items-center gap-6 text-xs font-semibold text-zinc-500">
              <Link href="/privacy" className="transition-colors hover:text-emerald-400">Privacy Policy</Link>
              <Link href="/terms" className="transition-colors hover:text-emerald-400">Terms of Service</Link>
              
              <div className="h-3 w-px bg-white/10 hidden sm:block"></div>
              
              <div className="flex items-center gap-4">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-emerald-400" aria-label="Facebook">
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path>
                  </svg>
                </a>
                <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-emerald-400" aria-label="X">
                  <svg viewBox="0 0 24 24" aria-hidden="true" width="15" height="15" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.008 5.964H5.078z"></path>
                  </svg>
                </a>
                <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-emerald-400" aria-label="Discord">
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
                    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z"></path>
                  </svg>
                </a>
              </div>
            </div>
            
            <div className="text-xs font-medium text-zinc-400">
              Created with <span className="text-red-500 animate-pulse inline-block mx-0.5">❤️</span> by <a href="https://moloy.is-a.dev" target="_blank" rel="noopener noreferrer" className="font-bold text-white tracking-wide hover:text-emerald-400 transition-colors">Moloy</a>
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
