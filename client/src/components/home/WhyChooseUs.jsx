"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Zap, LockKeyhole, Search, Users, Coins } from "lucide-react";

const FEATURES = [
  {
    icon: <Search className="text-emerald-400" size={24} />,
    title: "Advanced Search & Filters",
    description: "Instantly find the perfect prompt with powerful category, tool, and difficulty filters powered by MongoDB."
  },
  {
    icon: <LockKeyhole className="text-cyan-400" size={24} />,
    title: "Premium Content Gate",
    description: "Exclusive premium prompts remain securely blurred until unlocked via our Stripe payment integration."
  },
  {
    icon: <ShieldCheck className="text-emerald-400" size={24} />,
    title: "Admin Moderation Queue",
    description: "Every submitted prompt goes through a strict review process by admins to ensure high quality."
  },
  {
    icon: <Users className="text-cyan-400" size={24} />,
    title: "Creator Community",
    description: "Join top prompt engineers. Build your portfolio, gather reviews, and track your bookmark analytics."
  },
  {
    icon: <Coins className="text-emerald-400" size={24} />,
    title: "One-Time Premium Unlock",
    description: "Pay just $5 once to get lifetime access to all premium prompts and advanced dashboard features."
  },
  {
    icon: <Zap className="text-cyan-400" size={24} />,
    title: "Framer Motion Animations",
    description: "Enjoy a butter-smooth user experience with beautiful animations, transitions, and hover effects."
  }
];

export default function WhyChooseUs() {
  return (
    <section className="relative z-10 px-4 py-24 sm:px-6 lg:px-8 border-t border-white/5 bg-[#030303]/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="inline-block rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">
            Platform Benefits
          </p>
          <h2 className="mt-6 text-3xl font-extrabold leading-tight text-white sm:text-4xl">
            Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Cognix?</span>
          </h2>
        </motion.div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative overflow-hidden rounded-2xl border border-white/5 bg-zinc-900/30 p-8 backdrop-blur-sm transition-all hover:border-white/10 hover:bg-zinc-900/50"
            >
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-emerald-500/10 blur-[30px] transition-all group-hover:bg-emerald-500/20"></div>
              
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 border border-white/10">
                {feature.icon}
              </div>
              <h3 className="mb-3 text-lg font-bold text-zinc-100 group-hover:text-emerald-300 transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-zinc-400">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
