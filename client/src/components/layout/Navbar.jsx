"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BrainCircuit, LayoutDashboard, LogOut, Menu, X, Search, Sparkles, Compass, PlusCircle, Users, Bookmark } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/Button";
import { toast } from "react-toastify";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, logout, user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    router.push("/");
    setIsMobileMenuOpen(false);
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header 
      className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${
        isScrolled 
          ? "border-b border-white/5 bg-[#030303]/80 backdrop-blur-2xl shadow-lg" 
          : "border-b border-transparent bg-transparent"
      }`}
    >
      {/* SVG Gradient Definition for Icons */}
      <svg width="0" height="0" className="absolute">
        <linearGradient id="icon-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="50%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#34d399" />
        </linearGradient>
      </svg>
      <nav className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 relative">
        
        {/* Desktop Left Side: Profile & Dashboard */}
        <div className="hidden lg:flex flex-1 items-center gap-4 justify-start">
          {isAuthenticated ? (
            <>
              <Link
                href="/dashboard/profile"
                className="group relative"
                title="View Profile"
              >
                <img 
                  src={user?.image || user?.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`} 
                  alt="Profile" 
                  referrerPolicy="no-referrer"
                  className={`size-10 rounded-xl bg-zinc-800 object-cover transition-all group-hover:scale-105 ${user?.subscription === 'premium' ? 'ring-2 ring-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.4)]' : 'border border-white/10 group-hover:border-emerald-500/50'}`}
                />
              </Link>
              <Button
                onClick={() => router.push("/dashboard/add-prompt")}
                className="h-10 px-5 text-sm bg-gradient-to-r from-emerald-400 to-cyan-400 !text-zinc-950 border-0 hover:scale-[1.02] shadow-lg shadow-emerald-500/20"
              >
                Add Prompt
                <PlusCircle size={16} className="ml-2" />
              </Button>
              <Button
                onClick={() => router.push("/dashboard")}
                className="h-10 px-5 text-sm"
              >
                Dashboard
                <LayoutDashboard size={16} className="ml-2" />
              </Button>
            </>
          ) : (
            <Button
              onClick={() => router.push("/prompts")}
              className="h-10 px-5 text-sm"
            >
              Explore
              <Compass size={16} className="ml-1.5" />
            </Button>
          )}
        </div>

        {/* Brand Logo (Left on Mobile, Center on Desktop) */}
        <div className="flex lg:absolute lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 z-10">
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

        {/* Desktop Right Side: Prompts & Logout/Login */}
        <div className="hidden lg:flex flex-1 items-center gap-4 justify-end">
          {isAuthenticated && (
            <>
              <Button
                onClick={() => router.push("/dashboard/saved")}
                className="h-10 px-5 text-sm"
              >
                Saved
                <Bookmark size={16} className="ml-1.5" />
              </Button>
              <Button
                onClick={() => router.push("/prompts")}
                className="h-10 px-5 text-sm"
              >
                Explore
                <Compass size={16} className="ml-1.5" />
              </Button>
            </>
          )}

          {isAuthenticated ? (
            <Button
              onClick={handleLogout}
              className="!p-0 size-10"
              aria-label="Logout"
            >
              <LogOut size={18} />
            </Button>
          ) : (
            <div className="relative flex h-10 w-40 rounded-xl shadow-sm transition-shadow duration-300 has-[.login-btn:hover]:shadow-[-10px_0_20px_-2px_rgba(52,211,153,0.4)] has-[.register-btn:hover]:shadow-[10px_0_20px_-2px_rgba(52,211,153,0.4)]">
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

        {/* Mobile View Toggle */}
        <div className="flex flex-1 justify-end items-center gap-3 lg:hidden">
          {isAuthenticated && (
            <Link
              href="/dashboard/profile"
              onClick={closeMobileMenu}
              className="group relative"
            >
              <img 
                src={user?.image || user?.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`} 
                alt="Profile" 
                referrerPolicy="no-referrer"
                className={`size-10 rounded-xl bg-zinc-800 object-cover transition-all active:scale-95 ${user?.subscription === 'premium' ? 'ring-2 ring-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.4)]' : 'border border-white/10'}`}
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
            className="absolute left-0 right-0 top-[80px] border-b border-white/10 bg-[#030303]/95 backdrop-blur-3xl shadow-2xl lg:hidden"
          >
            <div className="flex flex-col px-6 py-6 space-y-6">
              
              {isAuthenticated && (
                <Link 
                  href="/dashboard/profile"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10"
                >
                  <img 
                    src={user?.image || user?.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`} 
                    alt="Profile" 
                    referrerPolicy="no-referrer"
                    className={`size-12 rounded-full bg-zinc-800 object-cover ${user?.subscription === 'premium' ? 'ring-2 ring-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.4)]' : 'border border-white/10'}`}
                  />
                  <div className="flex flex-col">
                    <span className="text-base font-bold text-white">{user?.name}</span>
                    <span className="text-sm font-medium text-zinc-500">{user?.email}</span>
                  </div>
                </Link>
              )}

              {/* Grid Menu Items */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="secondary"
                  onClick={() => {
                    router.push("/prompts");
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex-col h-24 gap-2 border-white/5 bg-white/[0.02]"
                >
                  <Compass size={24} className="text-emerald-400" />
                  <span className="text-xs font-semibold text-zinc-300">Explore</span>
                </Button>
                
                {isAuthenticated && (
                  <>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        router.push("/dashboard/saved");
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex-col h-24 gap-2 border-white/5 bg-white/[0.02]"
                    >
                      <Bookmark size={24} className="text-emerald-400" fill="currentColor" />
                      <span className="text-xs font-semibold text-zinc-300">Saved</span>
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        router.push("/dashboard");
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex-col h-24 gap-2 border-white/5 bg-white/[0.02]"
                    >
                      <LayoutDashboard size={24} className="text-cyan-400" />
                      <span className="text-xs font-semibold text-zinc-300">Dashboard</span>
                    </Button>
                    <Button
                      onClick={() => {
                        router.push("/dashboard/add-prompt");
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex-col h-24 gap-2 !shadow-emerald-500/20"
                    >
                      <PlusCircle size={24} className="text-zinc-950" />
                      <span className="text-xs font-extrabold text-zinc-950">Add Prompt</span>
                    </Button>
                  </>
                )}
              </div>

              {isAuthenticated ? (
                <Button
                  variant="danger"
                  fullWidth
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="h-12"
                >
                  <LogOut size={18} className="mr-2" />
                  Sign Out
                </Button>
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
