"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BrainCircuit, LayoutDashboard, LogOut, Menu, Search, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";

const navLinks = [
  { href: "/prompts", label: "Marketplace" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#030303]/80 backdrop-blur-2xl">
      <nav className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left Side: Logo + Links */}
        <div className="flex items-center gap-10">
          {/* Brand Logo */}
          <Link href="/" className="group flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-400 text-zinc-950 shadow-[0_0_15px_rgba(52,211,153,0.3)] transition-transform group-hover:scale-105">
              <BrainCircuit size={22} strokeWidth={2.5} />
            </div>
            <div>
              <span className="block text-xl font-extrabold leading-none text-white tracking-tight">Cognix</span>
              <span className="hidden text-[10px] font-bold uppercase tracking-widest text-emerald-500 sm:block mt-0.5">Premium Prompts</span>
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
                    active ? "text-white" : "text-zinc-500 hover:text-white"
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

        {/* Action Buttons (Right) */}
        <div className="hidden items-center gap-4 md:flex">
          <Link
            href="/prompts"
            className="flex size-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-400 backdrop-blur-md transition-all hover:scale-[1.02] hover:bg-white/10 hover:text-white"
            aria-label="Search prompts"
          >
            <Search size={18} />
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link
                href="/dashboard"
                className="flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 text-sm font-bold text-white backdrop-blur-md transition-all hover:scale-[1.02] hover:bg-white/10"
              >
                <LayoutDashboard size={16} className="text-emerald-400" />
                Dashboard
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 text-sm font-bold text-white backdrop-blur-md transition-all hover:scale-[1.02] hover:bg-white/10"
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-xl px-5 py-2.5 text-sm font-bold text-zinc-400 transition-colors hover:text-white"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="group flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 px-6 text-sm font-bold text-zinc-950 shadow-[0_0_20px_rgba(52,211,153,0.3)] transition-all hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(52,211,153,0.5)]"
              >
                <Sparkles size={14} className="transition-transform group-hover:scale-125" />
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          className="flex size-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-300 md:hidden backdrop-blur-md"
          aria-label="Open navigation menu"
        >
          <Menu size={20} />
        </button>
      </nav>

      {/* Mobile Authenticated Status */}
      {isAuthenticated && (
        <div className="border-t border-white/5 bg-[#030303] px-4 py-2 text-center text-xs font-semibold text-emerald-400 md:hidden">
          Signed in as {user?.email}
        </div>
      )}
    </header>
  );
}
