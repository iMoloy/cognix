"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, Bookmark, FileText, PlusCircle, 
  Star, UserCircle, LifeBuoy, BarChart3, Users, 
  AlertTriangle, CreditCard, Shield 
} from "lucide-react";
import { motion } from "framer-motion";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const [activeRole, setActiveRole] = useState("admin"); // Default to admin for testing

  const getLinks = () => {
    const userLinks = [
      { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
      { name: "Add Prompt", href: "/dashboard/add-prompt", icon: PlusCircle },
      { name: "My Prompts", href: "/dashboard/my-prompts", icon: FileText },
      { name: "Saved Prompts", href: "/dashboard/saved", icon: Bookmark },
      { name: "My Reviews", href: "/dashboard/reviews", icon: Star },
      { name: "Profile", href: "/dashboard/profile", icon: UserCircle },
    ];

    if (activeRole === "creator") {
      return [
        { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
        ...userLinks
      ];
    }

    if (activeRole === "admin") {
      return [
        { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
        { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
        { name: "All Users", href: "/dashboard/admin/users", icon: Users },
        { name: "All Prompts", href: "/dashboard/admin/prompts", icon: FileText },
        { name: "Reported", href: "/dashboard/admin/reports", icon: AlertTriangle },
        { name: "Payments", href: "/dashboard/admin/payments", icon: CreditCard },
        { name: "Profile", href: "/dashboard/profile", icon: UserCircle },
      ];
    }

    return userLinks;
  };

  const sidebarLinks = getLinks();

  return (
    <div className="flex min-h-screen bg-[#030303]">
      
      {/* Sidebar */}
      <aside className="fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 border-r border-white/10 bg-zinc-950/80 backdrop-blur-xl hidden md:block">
        <div className="flex h-full flex-col p-4">
          
          {/* MOCK ROLE SWITCHER */}
          <div className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3">
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
              <Shield size={14} /> View As
            </div>
            <select 
              value={activeRole} 
              onChange={(e) => setActiveRole(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-black/40 px-2 py-1.5 text-sm font-bold text-white outline-none focus:border-emerald-500/50"
            >
              <option value="user">User</option>
              <option value="creator">Creator</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <nav className="flex-1 space-y-1">
            {sidebarLinks.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className="group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all"
                >
                  {isActive && (
                    <motion.div 
                      layoutId="sidebar-active"
                      className="absolute inset-0 rounded-xl border border-emerald-500/20 bg-emerald-500/10"
                    />
                  )}
                  <link.icon 
                    size={18} 
                    className={`relative z-10 transition-colors ${isActive ? "text-emerald-400" : "text-zinc-500 group-hover:text-emerald-400"}`} 
                  />
                  <span className={`relative z-10 transition-colors ${isActive ? "font-bold text-white" : "text-zinc-400 group-hover:text-white"}`}>
                    {link.name}
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto border-t border-white/10 pt-4">
            <Link
              href="/help"
              className="group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-zinc-400 transition-all hover:bg-white/5 hover:text-white"
            >
              <LifeBuoy size={18} className="text-zinc-500 group-hover:text-emerald-400" />
              Help & Support
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 px-4 py-8 md:ml-64 md:px-8 lg:px-12 mt-16">
        <div className="mx-auto max-w-5xl">
          {children}
        </div>
      </main>

    </div>
  );
}
