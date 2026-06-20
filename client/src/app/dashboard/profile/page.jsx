"use client";

import { CheckCircle2, Shield, User, Crown, Key, Camera, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  
  const [formData, setFormData] = useState({
    name: user?.name || "",
    photoURL: user?.photoURL || "",
  });

  if (!user) return null;

  const isPremium = user.subscription === "premium";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg("");
    
    setTimeout(() => {
      updateProfile(formData);
      setIsSaving(false);
      setSuccessMsg("Profile settings updated successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    }, 800);
  };

  return (
    <div className="max-w-3xl space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Profile Settings</h1>
        <p className="mt-2 text-zinc-400">Manage your account identity, profile image, and subscription preferences.</p>
      </div>

      {/* Profile Identity Card */}
      <form onSubmit={handleSubmit} className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/40 shadow-2xl backdrop-blur-xl">
        <div className="border-b border-white/5 bg-white/[0.02] px-8 py-6 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <User size={18} className="text-emerald-400" /> Identity Details
          </h2>
          {successMsg && (
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 size={14} /> {successMsg}
            </span>
          )}
        </div>
        
        <div className="p-8">
          <div className="flex flex-col sm:flex-row gap-8 items-start">
            
            {/* Avatar Section */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative group">
                <img 
                  src={formData.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}`} 
                  alt="Profile" 
                  className="h-32 w-32 rounded-full border-4 border-white/5 bg-zinc-800 object-cover transition-opacity group-hover:opacity-50"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <Camera size={24} className="text-white" />
                </div>
                <div className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-zinc-950 ring-4 ring-[#030303]">
                  <CheckCircle2 size={16} />
                </div>
              </div>
              <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Profile Picture</p>
            </div>
            
            {/* Form Fields */}
            <div className="flex-1 w-full space-y-5">
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 ml-1">Full Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="h-12 w-full rounded-xl border border-white/10 bg-black/40 px-4 text-sm font-medium text-white outline-none transition-colors focus:border-emerald-500/50 focus:bg-black/60"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 ml-1">Profile Image URL</label>
                <input 
                  type="url" 
                  name="photoURL"
                  value={formData.photoURL}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="h-12 w-full rounded-xl border border-white/10 bg-black/40 px-4 text-sm font-medium text-white outline-none transition-colors focus:border-emerald-500/50 focus:bg-black/60"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 ml-1">Email Address</label>
                  <input 
                    type="email" 
                    disabled
                    value={user.email}
                    className="h-12 w-full rounded-xl border border-white/5 bg-white/5 px-4 text-sm font-medium text-zinc-500 cursor-not-allowed"
                    title="Email cannot be changed"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 ml-1">Account Role</label>
                  <div className="h-12 w-full flex items-center rounded-xl border border-white/5 bg-white/5 px-4 text-sm font-medium text-zinc-400 capitalize">
                    <Shield size={14} className="mr-2 text-emerald-400" /> {user.role}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex h-11 items-center justify-center gap-2 rounded-xl bg-white text-sm font-bold text-zinc-950 px-6 transition-all hover:bg-zinc-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>

            </div>
          </div>
        </div>
      </form>

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
              <span className="text-2xl font-extrabold text-white capitalize">{user.subscription} Plan</span>
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
