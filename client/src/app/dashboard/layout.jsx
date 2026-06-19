"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Bookmark, Key, Settings, LifeBuoy } from "lucide-react";
import { motion } from "framer-motion";

const sidebarLinks = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Prompts", href: "/dashboard/prompts", icon: Key },
  { name: "Saved Prompts", href: "/dashboard/saved", icon: Bookmark },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayout({ children }) {
  const pathname = usePathname();

  return (
    <div className="relative min-h-screen bg-[#030303] pt-20">
      {/* Background Orbs */}
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
        <div className="absolute top-0 left-[-10%] h-[600px] w-[600px] rounded-full bg-emerald-500/5 blur-[150px] opacity-20" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-cyan-500/5 blur-[150px] opacity-20" />
      </div>

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 md:flex-row lg:px-8">
        
        {/* Sidebar Navigation */}
        <aside className="relative z-10 w-full shrink-0 md:w-64">
          <nav className="sticky top-28 flex flex-col gap-2 rounded-2xl border border-white/10 bg-zinc-950/50 p-4 shadow-2xl backdrop-blur-2xl">
            <h3 className="mb-2 px-2 text-xs font-bold uppercase tracking-wider text-zinc-500">
              Dashboard
            </h3>
            
            {sidebarLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all ${
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-zinc-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute left-0 top-0 h-full w-1 rounded-full bg-gradient-to-b from-emerald-400 to-cyan-400"
                    />
                  )}
                  <Icon 
                    size={18} 
                    className={isActive ? "text-emerald-400" : "transition-colors group-hover:text-emerald-400"} 
                  />
                  {link.name}
                </Link>
              );
            })}

            <div className="my-2 h-px bg-white/10"></div>

            <Link
              href="/support"
              className="group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-zinc-400 transition-all hover:bg-white/5 hover:text-white"
            >
              <LifeBuoy size={18} className="transition-colors group-hover:text-emerald-400" />
              Support & Help
            </Link>
          </nav>
        </aside>

        {/* Main Dashboard Content Area */}
        <main className="relative z-10 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
