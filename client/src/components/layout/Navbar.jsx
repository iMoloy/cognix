"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BrainCircuit, LayoutDashboard, LogOut, Menu, X, Search, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/Button";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, logout, user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/");
    setIsMobileMenuOpen(false);
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#030303]/80 backdrop-blur-2xl">
      {/* SVG Gradient Definition for Icons */}
      <svg width="0" height="0" className="absolute">
        <linearGradient id="icon-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="50%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#34d399" />
        </linearGradient>
      </svg>
      <nav className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left Side: Logo + Links */}
        <div className="flex items-center gap-10">
          {/* Brand Logo */}
          <Link href="/" className="group flex items-center gap-3" onClick={closeMobileMenu}>
            <div className="flex size-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition-all group-hover:scale-105 group-hover:border-emerald-500/30 group-hover:bg-emerald-500/10">
              <BrainCircuit size={26} color="url(#icon-gradient)" />
            </div>
            <div className="flex flex-col justify-center">
              <span className="bg-[length:200%_auto] animate-gradient-x bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-clip-text text-2xl font-extrabold tracking-tight text-transparent block leading-none">Cognix</span>
              <span className="hidden mt-1 bg-[length:200%_auto] animate-gradient-x bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-clip-text text-[8px] font-bold uppercase tracking-[0.25em] text-transparent sm:block leading-none">Premium Prompts</span>
            </div>
          </Link>

        </div>

        {/* Action Buttons (Desktop Right) */}
        <div className="hidden items-center gap-4 md:flex">
          {/* Prompts Button (First item on right side) */}
          <Button
            onClick={() => router.push("/prompts")}
            className="h-9 px-1 text-sm"
          >
            Prompts
            <Search size={16} className="ml-1.5" />
          </Button>

          {isAuthenticated ? (
            <>
              {/* Profile Image */}
              <Link
                href="/dashboard/profile"
                className="group relative"
                title="View Profile"
              >
                <img 
                  src={user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} 
                  alt="Profile" 
                  className="size-10 rounded-xl border border-white/10 bg-zinc-800 object-cover transition-all group-hover:scale-105 group-hover:border-emerald-500/50"
                />
              </Link>
              
              <Button
                onClick={() => router.push("/dashboard")}
                className="h-10 px-5 text-sm"
              >
                <LayoutDashboard size={16} className="mr-2" />
                Dashboard
              </Button>
              <Button
                onClick={handleLogout}
                className="h-10 px-5 text-sm"
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </Button>
            </>
          ) : (
              <div className="relative flex h-9 w-36 rounded-xl shadow-sm transition-shadow duration-300 has-[.login-btn:hover]:shadow-[-10px_0_20px_-2px_rgba(52,211,153,0.4)] has-[.register-btn:hover]:shadow-[10px_0_20px_-2px_rgba(52,211,153,0.4)]">
                
                {/* Base Green Gradient */}
                <div className="absolute inset-0 z-0 rounded-xl bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-[length:200%_auto] animate-gradient-x"></div>
                
                {/* Left Button */}
                <button
                  onClick={() => router.push("/login")}
                  className="login-btn peer/left group/btnL relative z-10 flex h-full w-[43%] items-center justify-center text-sm font-bold text-zinc-950 outline-none"
                >
                  <span className="inline-block transition-transform duration-300 group-hover/btnL:scale-[1.12]">Login</span>
                </button>

                {/* Divider */}
                <div className="absolute left-[43%] top-2 bottom-2 w-[1.5px] -translate-x-1/2 -skew-x-12 bg-zinc-950 pointer-events-none z-20 rounded-full"></div>

                {/* Right Button */}
                <button
                  onClick={() => router.push("/register")}
                  className="register-btn peer/right group/btnR relative z-10 flex h-full w-[57%] items-center justify-center text-sm font-bold text-zinc-950 outline-none"
                >
                  <span className="inline-block transition-transform duration-300 group-hover/btnR:scale-[1.12]">Register</span>
                </button>

                {/* Clipped Hover Backgrounds (Bright Overlays) */}
                <div className="absolute inset-0 z-0 overflow-hidden rounded-xl pointer-events-none">
                  <div className="absolute bottom-0 right-[57%] top-0 w-[200%] origin-right -skew-x-12 opacity-0 transition-opacity duration-300 peer-hover/left:opacity-100 bg-white/20"></div>
                  <div className="absolute bottom-0 left-[43%] top-0 w-[200%] origin-left -skew-x-12 opacity-0 transition-opacity duration-300 peer-hover/right:opacity-100 bg-white/20"></div>
                </div>

              </div>
          )}
        </div>

        {/* Mobile Menu & Profile */}
        <div className="flex items-center gap-3 md:hidden">
          {isAuthenticated && (
            <Link
              href="/dashboard/profile"
              onClick={closeMobileMenu}
              className="group relative"
            >
              <img 
                src={user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} 
                alt="Profile" 
                className="size-10 rounded-xl border border-white/10 bg-zinc-800 object-cover transition-all active:scale-95"
              />
            </Link>
          )}
          
          <Button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="!p-0 size-10 active:scale-95"
            aria-label="Open navigation menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute left-0 right-0 top-[80px] border-b border-white/10 bg-[#030303]/95 backdrop-blur-3xl shadow-2xl md:hidden"
          >
            <div className="flex flex-col px-6 py-8 space-y-6">
              
              <Button
                fullWidth
                onClick={() => {
                  router.push("/prompts");
                  setIsMobileMenuOpen(false);
                }}
                className="h-11 text-sm"
              >
                Prompts
                <Search size={18} className="ml-2" />
              </Button>

              {isAuthenticated ? (
                <>
                  <Button
                    fullWidth
                    onClick={() => {
                      router.push("/dashboard");
                      setIsMobileMenuOpen(false);
                    }}
                    className="h-12"
                  >
                    <LayoutDashboard size={16} className="mr-2" />
                    Dashboard
                  </Button>
                  <Button
                    fullWidth
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="h-12"
                  >
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </Button>
                  
                  {/* Mobile Dropdown User Profile Card */}
                  <Link 
                    href="/dashboard/profile"
                    onClick={closeMobileMenu}
                    className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10"
                  >
                    <img 
                      src={user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} 
                      alt="Profile" 
                      className="size-10 rounded-full border border-white/10 bg-zinc-800 object-cover"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-white">{user?.name}</span>
                      <span className="text-xs font-medium text-zinc-500">{user?.email}</span>
                    </div>
                  </Link>
                </>
              ) : (
                <div className="pt-4 border-t border-white/5">
                  <div className="relative flex h-11 w-full rounded-xl shadow-sm transition-shadow duration-300 has-[.login-btn:hover]:shadow-[-10px_0_20px_-2px_rgba(52,211,153,0.4)] has-[.register-btn:hover]:shadow-[10px_0_20px_-2px_rgba(52,211,153,0.4)]">
                    
                    {/* Base Green Gradient */}
                    <div className="absolute inset-0 z-0 rounded-xl bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-[length:200%_auto] animate-gradient-x"></div>

                    {/* Left Button */}
                    <button
                      onClick={() => {
                        router.push("/login");
                        setIsMobileMenuOpen(false);
                      }}
                      className="login-btn peer/left group/btnL relative z-10 flex h-full w-[43%] items-center justify-center text-sm font-bold text-zinc-950 outline-none"
                    >
                      <span className="inline-block transition-transform duration-300 group-hover/btnL:scale-[1.12]">Login</span>
                    </button>

                    {/* Divider */}
                    <div className="absolute left-[43%] top-2.5 bottom-2.5 w-[1.5px] -translate-x-1/2 -skew-x-12 bg-zinc-950 pointer-events-none z-20 rounded-full"></div>

                    {/* Right Button */}
                    <button
                      onClick={() => {
                        router.push("/register");
                        setIsMobileMenuOpen(false);
                      }}
                      className="register-btn peer/right group/btnR relative z-10 flex h-full w-[57%] items-center justify-center text-sm font-bold text-zinc-950 outline-none"
                    >
                      <span className="inline-block transition-transform duration-300 group-hover/btnR:scale-[1.12]">Register</span>
                    </button>

                    {/* Clipped Hover Backgrounds (Bright Overlays) */}
                    <div className="absolute inset-0 z-0 overflow-hidden rounded-xl pointer-events-none">
                      <div className="absolute bottom-0 right-[57%] top-0 w-[200%] origin-right -skew-x-12 opacity-0 transition-opacity duration-300 peer-hover/left:opacity-100 bg-white/20"></div>
                      <div className="absolute bottom-0 left-[43%] top-0 w-[200%] origin-left -skew-x-12 opacity-0 transition-opacity duration-300 peer-hover/right:opacity-100 bg-white/20"></div>
                    </div>

                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </header>
  );
}
