"use client";

import { Shield, Sparkles, User, Copy, Check, ArrowRight, Code2, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/Button";

const demoAccounts = [
  {
    id: "admin",
    role: "Admin Account",
    icon: Shield,
    theme: "fuchsia",
    gradient: "from-fuchsia-500/20 to-purple-600/20",
    borderGlow: "group-hover:border-fuchsia-500/50",
    textGradient: "from-fuchsia-400 to-purple-400",
    description: "Full access to analytics, user moderation, prompt management, and platform configurations.",
    email: "admin@cognix.com",
    password: "password123"
  },
  {
    id: "creator",
    role: "Creator Account",
    icon: Sparkles,
    theme: "cyan",
    gradient: "from-cyan-500/20 to-blue-600/20",
    borderGlow: "group-hover:border-cyan-500/50",
    textGradient: "from-cyan-400 to-blue-400",
    description: "Access to creator dashboard, listing new AI prompts, tracking views, and managing portfolios.",
    email: "creator@cognix.com",
    password: "password123"
  },
  {
    id: "user",
    role: "Standard Account",
    icon: User,
    theme: "emerald",
    gradient: "from-emerald-500/20 to-teal-600/20",
    borderGlow: "group-hover:border-emerald-500/50",
    textGradient: "from-emerald-400 to-teal-400",
    description: "Browse AI prompts, copy to clipboard, save collections, leave reviews, and upgrade to premium.",
    email: "user@cognix.com",
    password: "password123"
  }
];

export default function DemoAccountsPage() {
  const router = useRouter();
  const [copiedField, setCopiedField] = useState(null);
  const [showPassword, setShowPassword] = useState({});

  const copyToClipboard = (text, fieldId) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const togglePassword = (id) => {
    setShowPassword(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-zinc-950 pt-32 pb-24 selection:bg-emerald-500/30">
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Minimalist Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-zinc-300 mb-8 backdrop-blur-md"
          >
            <Code2 size={14} className="text-emerald-400" /> Developer Sandbox
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-white mb-6"
          >
            Experience <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Cognix.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-zinc-400 font-medium"
          >
            Switch perspectives and test different role-based workflows using the demo credentials below.
          </motion.p>
        </div>

        {/* Premium Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {demoAccounts.map((account, index) => (
            <motion.div
              key={account.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + (index * 0.1), duration: 0.5 }}
              className={`group relative flex flex-col overflow-hidden rounded-[2rem] border border-white/5 bg-zinc-900/40 p-8 backdrop-blur-2xl transition-all duration-500 hover:bg-zinc-900/80 hover:-translate-y-1 ${account.borderGlow}`}
            >
              {/* Inner ambient gradient */}
              <div className={`absolute -inset-px bg-gradient-to-br ${account.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-100 rounded-[2rem] pointer-events-none`} />
              
              <div className="relative z-10 flex flex-col h-full">
                
                {/* Card Header */}
                <div className="mb-8 flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-black/50 shadow-inner">
                    <account.icon size={24} className={`text-${account.theme}-400`} />
                  </div>
                  <div className={`text-xs font-bold uppercase tracking-widest bg-gradient-to-r ${account.textGradient} bg-clip-text text-transparent`}>
                    {account.role}
                  </div>
                </div>

                {/* Description */}
                <p className="mb-10 text-sm leading-relaxed text-zinc-400 group-hover:text-zinc-300 transition-colors">
                  {account.description}
                </p>

                {/* Credentials Form */}
                <div className="space-y-4 mb-10 flex-1">
                  
                  {/* Email Field */}
                  <div className="space-y-2 group/field">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1 transition-colors group-focus-within/field:text-zinc-300">Email Address</label>
                    <div className="relative">
                      <input 
                        readOnly 
                        value={account.email}
                        className="h-14 w-full rounded-2xl border border-white/5 bg-black/40 pl-5 pr-14 text-sm font-mono text-zinc-300 outline-none transition-all group-hover:border-white/10 focus:border-white/20 focus:bg-black/60"
                      />
                      <button
                        onClick={() => copyToClipboard(account.email, `${account.id}-email`)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 text-zinc-400 transition-all hover:bg-white/10 hover:text-emerald-400 active:scale-95"
                        title="Copy Email"
                      >
                        <AnimatePresence mode="wait">
                          {copiedField === `${account.id}-email` ? (
                            <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                              <Check size={14} className="text-emerald-400" />
                            </motion.div>
                          ) : (
                            <motion.div key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                              <Copy size={14} />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </button>
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2 group/field">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1 transition-colors group-focus-within/field:text-zinc-300">Password</label>
                    <div className="relative">
                      <input 
                        readOnly 
                        value={account.password}
                        type={showPassword[account.id] ? "text" : "password"}
                        className="h-14 w-full rounded-2xl border border-white/5 bg-black/40 pl-5 pr-24 text-sm font-mono text-zinc-300 outline-none transition-all group-hover:border-white/10 focus:border-white/20 focus:bg-black/60"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                        <button
                          onClick={() => togglePassword(account.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 text-zinc-400 transition-all hover:bg-white/10 hover:text-emerald-400 active:scale-95"
                          title="Toggle Password"
                        >
                          {showPassword[account.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                        <button
                          onClick={() => copyToClipboard(account.password, `${account.id}-password`)}
                          className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 text-zinc-400 transition-all hover:bg-white/10 hover:text-emerald-400 active:scale-95"
                          title="Copy Password"
                        >
                          <AnimatePresence mode="wait">
                            {copiedField === `${account.id}-password` ? (
                              <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                                <Check size={14} className="text-emerald-400" />
                              </motion.div>
                            ) : (
                              <motion.div key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                                <Copy size={14} />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  onClick={() => router.push(`/login?email=${encodeURIComponent(account.email)}&password=${encodeURIComponent(account.password)}`)}
                  className="mt-auto h-14"
                  fullWidth
                >
                  Auto Login <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
