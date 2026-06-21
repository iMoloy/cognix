"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, CreditCard, ShieldCheck, Lock, ChevronRight, Loader2, Sparkles } from "lucide-react";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "@/components/ui/CheckoutForm";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_placeholder");

const benefits = [
  "Instant access to all Private / Premium Prompts",
  "Unlimited prompt copying and saving",
  "Exclusive 'Pro Builder' profile badge",
  "Priority support from our moderation team",
  "One-time payment of $5. No hidden recurring fees."
];

export default function PaymentPage() {
  const { user, token, upgradeToPremium } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // Fetch client secret when component mounts
  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/payments/create-intent`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ price: 500 }), // $5.00
        });
        const data = await res.json();
        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error("Failed to fetch payment intent:", error);
      }
    };
    if (token) {
      fetchClientSecret();
    }
  }, [token, apiUrl]);

  const handleSuccess = async (transactionId) => {
    try {
      const res = await fetch(`${apiUrl}/api/payments/success`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          email: user?.email,
          transactionId,
          amount: 500
        })
      });
      if (res.ok) {
        setIsSuccess(true);
        toast.success("Payment Successful! You are now a Premium user.");
        upgradeToPremium();
      }
    } catch (e) {
      toast.error("Failed to process payment success");
    }
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

              {clientSecret ? (
                <Elements stripe={stripePromise} options={{ 
                  clientSecret,
                  appearance: {
                    theme: 'night',
                    variables: {
                      colorPrimary: '#34d399',
                      colorBackground: '#18181b',
                      colorText: '#ffffff',
                      colorDanger: '#ef4444',
                      fontFamily: 'ui-sans-serif, system-ui, sans-serif',
                      borderRadius: '8px',
                    }
                  } 
                }}>
                  <CheckoutForm 
                    onSuccess={handleSuccess} 
                    isProcessing={isProcessing} 
                    setIsProcessing={setIsProcessing} 
                  />
                </Elements>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="animate-spin text-emerald-500 mb-4" size={32} />
                  <p className="text-zinc-400 text-sm">Preparing secure payment...</p>
                </div>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
