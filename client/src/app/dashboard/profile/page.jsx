"use client";

import { CheckCircle2, Shield, User, Crown, Key } from "lucide-react";
import Link from "next/link";

const mockProfile = {
  name: "Sarah Developer",
  email: "sarah@example.com",
  photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
  role: "Creator", // User, Creator, Admin
  totalPrompts: 12,
  subscription: "Free", // Free or Premium
};

export default function ProfilePage() {
  const isPremium = mockProfile.subscription === "Premium";

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Profile Settings</h1>
        <p className="mt-2 text-zinc-400">Manage your account identity and subscription preferences.</p>
      </div>

      {/* Profile Identity Card */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/40 shadow-2xl backdrop-blur-xl">
        <div className="border-b border-white/5 bg-white/[0.02] px-8 py-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <User size={18} className="text-emerald-400" /> Identity Details
          </h2>
        </div>
        
        <div className="p-8 flex flex-col sm:flex-row gap-8 items-start sm:items-center">
          <div className="relative">
            <img 
              src={mockProfile.photo} 
              alt="Profile" 
              className="h-32 w-32 rounded-full border-4 border-white/5 bg-zinc-800 object-cover"
            />
            <div className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-zinc-950 ring-4 ring-[#030303]">
              <CheckCircle2 size={16} />
            </div>
          </div>
          
          <div className="flex-1 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Full Name</span>
                <p className="font-bold text-white">{mockProfile.name}</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Email Address</span>
                <p className="font-medium text-zinc-300">{mockProfile.email}</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Account Role</span>
                <div className="mt-1 inline-flex items-center gap-1.5 rounded-md bg-white/5 px-2 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20">
                  <Shield size={12} /> {mockProfile.role}
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Total Prompts</span>
                <p className="font-mono font-bold text-zinc-300">{mockProfile.totalPrompts}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Card */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/40 shadow-2xl backdrop-blur-xl">
        <div className="border-b border-white/5 bg-white/[0.02] px-8 py-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Crown size={18} className="text-amber-400" /> Subscription Plan
          </h2>
        </div>
        
        <div className="p-8 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-extrabold text-white">{mockProfile.subscription} Plan</span>
              {isPremium && (
                <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-emerald-400 ring-1 ring-emerald-500/30">
                  Active
                </span>
              )}
            </div>
            <p className="mt-2 text-sm text-zinc-400 max-w-md">
              {isPremium 
                ? "You have full access to all premium private prompts in the marketplace." 
                : "Upgrade to premium for a one-time payment of $5 to unlock all private, high-quality prompts."}
            </p>
          </div>
          
          {!isPremium && (
            <Link 
              href="/payment"
              className="shrink-0 group flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-[length:200%_auto] animate-gradient-x px-8 text-sm font-bold text-zinc-950 shadow-md transition-all hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(52,211,153,0.25)]"
            >
              <Key size={16} className="transition-transform group-hover:scale-110" />
              Upgrade for $5
            </Link>
          )}
        </div>
      </div>

    </div>
  );
}
