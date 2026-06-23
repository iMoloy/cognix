"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { 
  LayoutDashboard, 
  Settings, 
  Bookmark, 
  FileText, 
  BarChart3,
  Shield,
  LifeBuoy,
  Users,
  AlertTriangle,
  CreditCard,
  ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const [isNavOpen, setIsNavOpen] = useState(false);

  const activeRole = user?.role || "user";

  // Dynamic role-based links
  const getLinks = () => {
    const baseLinks = [
      { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
      { name: "Profile", href: "/dashboard/profile", icon: Settings },
      { name: "Saved Prompts", href: "/dashboard/saved", icon: Bookmark },
      { name: "My Prompts", href: "/dashboard/my-prompts", icon: FileText },
    ];

    if (activeRole === "creator") {
      baseLinks.splice(2, 0, { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 });
    }

    if (activeRole === "admin") {
      return [
        { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
        { name: "Profile", href: "/dashboard/profile", icon: Settings },
        { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
        { name: "Manage Users", href: "/dashboard/admin/users", icon: Users },
        { name: "All Prompts", href: "/dashboard/admin/prompts", icon: FileText },
        { name: "Reported", href: "/dashboard/admin/reports", icon: AlertTriangle },
        { name: "Payments", href: "/dashboard/admin/payments", icon: CreditCard },
      ];
    }

    return baseLinks;
  };

  const sidebarLinks = getLinks();
  const activeLink = sidebarLinks.find(link => pathname === link.href || (link.href !== "/dashboard" && pathname.startsWith(link.href))) || sidebarLinks[0];

  return (
    <div className="relative min-h-[80vh] w-full pt-24 pb-20">
      {/* Background Orbs */}
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
        <div className="absolute top-0 left-[10%] h-[500px] w-[500px] rounded-full bg-emerald-500/5 blur-[150px] opacity-20" />
      </div>

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 sm:px-6 md:flex-row lg:px-8">
        
        {/* Sidebar Navigation */}
        <aside className="relative z-20 w-full shrink-0 md:w-64">
          <div className="md:sticky md:top-28 flex flex-col gap-6">

            {/* MOBILE NAVIGATION DROPDOWN */}
            <div className="relative md:hidden">
              <button
                onClick={() => setIsNavOpen(!isNavOpen)}
                className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-zinc-950/80 px-4 py-4 text-sm font-bold text-white shadow-xl backdrop-blur-xl"
              >
                <div className="flex items-center gap-3">
                  {activeLink && <activeLink.icon size={18} className="text-emerald-400" />}
                  {activeLink?.name}
                </div>
                <ChevronDown size={18} className={`text-zinc-400 transition-transform ${isNavOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {isNavOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 rounded-2xl border border-white/10 bg-zinc-950/95 p-2 shadow-2xl backdrop-blur-3xl"
                  >
                    <div className="flex flex-col gap-1">
                      {sidebarLinks.map((link) => {
                        const isActive = pathname === link.href || (link.href !== "/dashboard" && pathname.startsWith(link.href));
                        return (
                          <Link
                            key={link.name}
                            href={link.href}
                            onClick={() => setIsNavOpen(false)}
                            className="group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all"
                          >
                            {isActive && (
                              <motion.div 
                                layoutId="mobile-sidebar-active"
                                className="absolute inset-0 rounded-xl border border-emerald-500/20 bg-emerald-500/10"
                              />
                            )}
                            <link.icon 
                              size={18} 
                              className={`relative z-10 transition-colors ${isActive ? "text-emerald-400" : "text-zinc-500"}`} 
                            />
                            <span className={`relative z-10 transition-colors ${isActive ? "font-bold text-white" : "text-zinc-400"}`}>
                              {link.name}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* DESKTOP NAVIGATION */}
            <nav className="hidden rounded-2xl border border-white/10 bg-zinc-950/50 p-2 shadow-2xl backdrop-blur-2xl md:block">
              <div className="flex flex-col">
                {sidebarLinks.map((link) => {
                  const isActive = pathname === link.href || (link.href !== "/dashboard" && pathname.startsWith(link.href));
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all"
                    >
                      {isActive && (
                        <motion.div 
                          layoutId="desktop-sidebar-active"
                          className="absolute inset-0 rounded-xl border border-emerald-500/20 bg-emerald-500/10"
                        />
                      )}
                      <link.icon 
                        size={18} 
                        className={`relative z-10 transition-colors ${isActive ? "text-emerald-400" : "text-zinc-500 group-hover:text-emerald-400"}`} 
                      />
                      <span className={`relative z-10 transition-colors ${isActive ? "font-bold text-white" : "text-zinc-400 group-hover:text-emerald-400"}`}>
                        {link.name}
                      </span>
                    </Link>
                  );
                })}
              </div>

              <div className="mt-2 border-t border-white/10 pt-2">
                <Link
                  href="/dashboard/help"
                  className={`group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${pathname === "/dashboard/help" ? "text-white" : "text-zinc-400 hover:bg-white/5 hover:text-emerald-400"}`}
                >
                  {pathname === "/dashboard/help" && (
                    <motion.div 
                      layoutId="desktop-sidebar-help-active"
                      className="absolute inset-0 rounded-xl border border-emerald-500/20 bg-emerald-500/10"
                    />
                  )}
                  <LifeBuoy size={18} className={`relative z-10 transition-colors ${pathname === "/dashboard/help" ? "text-emerald-400" : "text-zinc-500 group-hover:text-emerald-400"}`} />
                  <span className="relative z-10">Help & Support</span>
                </Link>
              </div>
            </nav>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="relative z-10 flex-1 overflow-hidden min-w-0">
          {children}
        </main>

      </div>
    </div>
  );
}
