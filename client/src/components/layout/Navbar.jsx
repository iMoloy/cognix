"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BrainCircuit, LayoutDashboard, LogOut, Menu, Search } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/prompts", label: "All Prompts" },
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
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-md bg-emerald-300 text-zinc-950">
            <BrainCircuit size={22} />
          </span>
          <span>
            <span className="block text-lg font-bold leading-none text-zinc-50">Cognix</span>
            <span className="hidden text-xs font-medium text-zinc-500 sm:block">Prompt marketplace</span>
          </span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => {
            const active = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-semibold transition ${
                  active ? "text-zinc-50" : "text-zinc-500 hover:text-zinc-200"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/prompts"
            className="inline-flex size-10 items-center justify-center rounded-lg border border-zinc-800 text-zinc-400 transition hover:border-zinc-700 hover:bg-zinc-900 hover:text-zinc-50"
            aria-label="Search prompts"
          >
            <Search size={18} />
          </Link>
          {isAuthenticated ? (
            <>
              <Link
                href="/dashboard"
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-zinc-800 px-4 text-sm font-semibold text-zinc-200 transition hover:border-zinc-700 hover:bg-zinc-900"
              >
                <LayoutDashboard size={16} />
                Dashboard
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-emerald-300 px-4 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-200"
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg px-4 py-2 text-sm font-semibold text-zinc-300 transition hover:bg-zinc-900 hover:text-zinc-50"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="inline-flex h-10 items-center rounded-md bg-emerald-300 px-4 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-200"
              >
                Register
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-lg border border-zinc-800 text-zinc-300 md:hidden"
          aria-label="Open navigation menu"
        >
          <Menu size={20} />
        </button>
      </nav>

      {isAuthenticated && (
        <div className="border-t border-zinc-800 bg-zinc-900 px-4 py-2 text-center text-xs font-medium text-zinc-400 md:hidden">
          Signed in as {user?.email}
        </div>
      )}
    </header>
  );
}
