"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BrainCircuit, LayoutDashboard, LogOut, Menu, X, Search, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/Button";

const navLinks = [
  { href: "/prompts", label: "Marketplace" },
];

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
            <div className="flex size-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition-all group-hover:scale-105 group-hover:border-emerald-500/30 group-hover:bg-emerald-500/10">
              <BrainCircuit size={18} color="url(#icon-gradient)" />
            </div>
            <div>
              <span className="bg-[length:200%_auto] animate-gradient-x bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-clip-text text-xl font-extrabold tracking-tight text-transparent">Cognix</span>
              <span className="hidden mt-0.5 bg-[length:200%_auto] animate-gradient-x bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-clip-text text-[10px] font-bold uppercase tracking-widest text-transparent sm:block">Premium Prompts</span>
            </div>
          </Link>

          {/* Desktop Links (Next to Logo) */}
          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => {
              const active = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative text-sm font-bold transition-colors ${
                    active ? "text-white" : "text-zinc-500 hover:text-emerald-400"
                  }`}
                >
                  {link.label}
                  {active && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute -bottom-7 left-0 right-0 h-[2px] bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Action Buttons (Desktop Right) */}
        <div className="hidden items-center gap-4 md:flex">
          {isAuthenticated ? (
            <>
              {/* Profile Image Replacing Search Position */}
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
            <>
              <Button
                variant="ghost"
                onClick={() => router.push("/login")}
                className="px-5 py-2.5 text-sm font-bold text-zinc-400 hover:text-emerald-400"
              >
                Login
              </Button>
              <Button
                onClick={() => router.push("/register")}
                className="h-10 px-6 text-sm"
              >
                <Sparkles size={14} className="mr-2" />
                Get Started
              </Button>
            </>
          )}

          {/* Search (Far Right) */}
          <Link
            href="/prompts"
            className="ml-2 flex size-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-400 backdrop-blur-md transition-all hover:scale-[1.02] hover:bg-white/10 hover:text-emerald-400"
            aria-label="Search prompts"
          >
            <Search size={18} />
          </Link>
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
          
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex size-10 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 backdrop-blur-md transition-all active:scale-95"
            aria-label="Open navigation menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
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
              
              <Link 
                href="/prompts" 
                onClick={closeMobileMenu}
                className="flex items-center gap-3 text-lg font-bold text-white hover:text-emerald-400"
              >
                <Search size={20} className="text-zinc-500" /> Explore Marketplace
              </Link>

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
                <div className="flex flex-col gap-3 pt-4 border-t border-white/5">
                  <Button
                    fullWidth
                    variant="ghost"
                    onClick={() => {
                      router.push("/login");
                      setIsMobileMenuOpen(false);
                    }}
                    className="h-12 border border-white/10 bg-white/5"
                  >
                    Login
                  </Button>
                  <Button
                    fullWidth
                    onClick={() => {
                      router.push("/register");
                      setIsMobileMenuOpen(false);
                    }}
                    className="h-12"
                  >
                    <Sparkles size={14} className="mr-2" />
                    Get Started
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </header>
  );
}
