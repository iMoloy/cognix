"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, CreditCard, ShieldCheck, Lock, ChevronRight, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";

const benefits = [
  "Instant access to all Private / Premium Prompts",
  "Unlimited prompt copying and saving",
  "Exclusive 'Pro Builder' profile badge",
  "Priority support from our moderation team",
  "One-time payment of $5. No hidden recurring fees."
];

export default function PaymentPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  const handlePayment = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate API call to Stripe
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
    }, 2500);
  };

  if (isSuccess) {
    return (
      <div className="relative flex min-h-[80vh] items-center justify-center py-20">
        <div className="relative z-10 mx-auto w-full max-w-md px-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="overflow-hidden rounded-3xl border border-emerald-500/30 bg-zinc-900/50 p-8 text-center shadow-2xl backdrop-blur-2xl"
          >
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500/10 ring-4 ring-emerald-500/20">
              <CheckCircle2 size={48} className="text-emerald-400" />
            </div>
            <h2 className="text-3xl font-extrabold text-white">Payment Successful!</h2>
            <p className="mt-4 text-lg text-zinc-400">
              Welcome to the <span className="font-bold text-emerald-400">Pro Builder</span> tier. You now have unlimited access to the entire marketplace.
            </p>
            <Link
              href="/dashboard"
              className="mt-8 flex h-14 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-[length:200%_auto] animate-gradient-x px-8 text-sm font-bold text-zinc-950 shadow-md transition-all hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(52,211,153,0.25)]"
            >
              Go to Dashboard <ChevronRight size={18} />
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[80vh] py-20 bg-[#030303]">
      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
        <div className="absolute left-[10%] top-[20%] h-[500px] w-[500px] rounded-full bg-emerald-500/5 blur-[150px] opacity-20" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8">
          
          {/* Left Column: Plan Details */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400 backdrop-blur-md">
              <Sparkles size={14} />
              Upgrade to Premium
            </div>
            
            <h1 className="text-5xl font-black tracking-tight text-white sm:text-6xl">
              Unlock the Vault.
            </h1>
            
            <div className="mt-8 flex items-baseline gap-2">
              <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">$5</span>
              <span className="text-xl font-bold text-zinc-500">/ one-time</span>
            </div>
            
            <p className="mt-6 text-lg leading-relaxed text-zinc-400 max-w-md">
              Stop writing prompts from scratch. Get lifetime access to our premium vault of battle-tested, highly engineered AI prompts.
            </p>

            <ul className="mt-10 space-y-5">
              {benefits.map((benefit, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                    <CheckCircle2 size={14} />
                  </div>
                  <span className="text-zinc-300 font-medium">{benefit}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Right Column: Stripe Form */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative lg:ml-auto w-full max-w-md"
          >
            {/* Decorative Glow behind the form */}
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 blur-xl opacity-50"></div>
            
            <div className="relative rounded-3xl border border-white/10 bg-zinc-950/80 p-8 shadow-2xl backdrop-blur-2xl">
              <div className="mb-8 flex items-center justify-between border-b border-white/5 pb-6">
                <h3 className="text-xl font-bold text-white">Payment Details</h3>
                <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-zinc-500">
                  <Lock size={12} /> Secure
                </div>
              </div>

              <form onSubmit={handlePayment} className="space-y-6">
                
                {/* Email Address */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Email Address</label>
                  <input 
                    type="email" 
                    required
                    placeholder="sarah@example.com"
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-all focus:border-emerald-500/50 focus:bg-white/[0.02]"
                  />
                </div>

                {/* Card Number */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Card Information</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-zinc-500">
                      <CreditCard size={18} />
                    </div>
                    <input 
                      type="text" 
                      required
                      value={cardNumber}
                      onChange={(e) => {
                        let val = e.target.value.replace(/\D/g, "").slice(0, 16);
                        // Optional: Format with spaces for better UX
                        let formatted = val;
                        if (val.length > 0) {
                          formatted = val.match(/.{1,4}/g).join(" ");
                        }
                        setCardNumber(formatted);
                      }}
                      placeholder="0000 0000 0000 0000"
                      className="w-full rounded-xl border border-white/10 bg-black/40 py-3 pl-12 pr-4 font-mono text-sm text-white placeholder-zinc-600 outline-none transition-all focus:border-emerald-500/50 focus:bg-white/[0.02]"
                    />
                  </div>
                </div>

                {/* Expiry & CVC */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Expiry Date</label>
                    <input 
                      type="text" 
                      required
                      value={expiry}
                      onChange={(e) => {
                        let val = e.target.value.replace(/\D/g, "").slice(0, 4);
                        
                        if (val.length >= 2) {
                          let month = parseInt(val.slice(0, 2), 10);
                          if (month > 12) month = 12;
                          if (month === 0 && val.length === 2) month = 1;
                          
                          let monthStr = month.toString().padStart(2, "0");
                          val = val.length > 2 ? `${monthStr}${val.slice(2)}` : monthStr;
                        }

                        let formatted = val;
                        if (val.length >= 3) {
                          formatted = `${val.slice(0, 2)}/${val.slice(2, 4)}`;
                        }
                        setExpiry(formatted);
                      }}
                      placeholder="MM/YY"
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 font-mono text-sm text-white placeholder-zinc-600 outline-none transition-all focus:border-emerald-500/50 focus:bg-white/[0.02]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">CVC</label>
                    <input 
                      type="text" 
                      required
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      placeholder="123"
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 font-mono text-sm text-white placeholder-zinc-600 outline-none transition-all focus:border-emerald-500/50 focus:bg-white/[0.02]"
                    />
                  </div>
                </div>

                {/* Name on Card */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Name on Card</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Sarah Developer"
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-all focus:border-emerald-500/50 focus:bg-white/[0.02]"
                  />
                </div>

                <div className="pt-4">
                  <button 
                    disabled={isProcessing}
                    className="group relative flex h-14 w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-[length:200%_auto] px-8 text-sm font-bold text-zinc-950 shadow-md transition-all hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(52,211,153,0.25)] disabled:opacity-70 disabled:hover:scale-100"
                  >
                    <div className={`flex items-center gap-2 transition-all ${isProcessing ? "opacity-0" : "opacity-100 animate-gradient-x"}`}>
                      <ShieldCheck size={18} className="transition-transform group-hover:scale-110" />
                      Pay $5.00
                    </div>
                    
                    {isProcessing && (
                      <div className="absolute inset-0 flex items-center justify-center bg-emerald-500">
                        <Loader2 size={24} className="animate-spin text-zinc-950" />
                      </div>
                    )}
                  </button>
                  <p className="mt-4 text-center text-xs font-medium text-zinc-500 flex items-center justify-center gap-1.5">
                    <Lock size={10} /> Payments are secure and encrypted.
                  </p>
                </div>

              </form>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
