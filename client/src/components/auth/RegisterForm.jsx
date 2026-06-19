"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { UserPlus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";

export default function RegisterForm() {
  const router = useRouter();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    photoURL: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    register(formData);
    router.push("/dashboard");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-zinc-400">
          Full Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          required
          className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-medium text-white outline-none backdrop-blur-md transition-all placeholder:text-zinc-600 focus:border-emerald-500/50 focus:bg-white/10 focus:shadow-[0_0_20px_rgba(52,211,153,0.15)]"
          placeholder="John Doe"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-zinc-400">
          Email Address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-medium text-white outline-none backdrop-blur-md transition-all placeholder:text-zinc-600 focus:border-emerald-500/50 focus:bg-white/10 focus:shadow-[0_0_20px_rgba(52,211,153,0.15)]"
          placeholder="you@example.com"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="photoURL" className="text-xs font-bold uppercase tracking-widest text-zinc-400">
          Photo URL <span className="text-zinc-600">(Optional)</span>
        </label>
        <input
          id="photoURL"
          name="photoURL"
          type="url"
          value={formData.photoURL}
          onChange={handleChange}
          className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-medium text-white outline-none backdrop-blur-md transition-all placeholder:text-zinc-600 focus:border-emerald-500/50 focus:bg-white/10 focus:shadow-[0_0_20px_rgba(52,211,153,0.15)]"
          placeholder="https://example.com/avatar.jpg"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-xs font-bold uppercase tracking-widest text-zinc-400">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
          minLength={6}
          className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-medium text-white outline-none backdrop-blur-md transition-all placeholder:text-zinc-600 focus:border-emerald-500/50 focus:bg-white/10 focus:shadow-[0_0_20px_rgba(52,211,153,0.15)]"
          placeholder="Minimum 6 characters"
        />
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        className="group relative mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 px-5 text-sm font-bold text-zinc-950 shadow-[0_0_20px_rgba(52,211,153,0.3)] transition-all hover:shadow-[0_0_30px_rgba(52,211,153,0.5)]"
      >
        <UserPlus size={18} className="transition-transform group-hover:scale-110" />
        Create Account
      </motion.button>

      <p className="mt-6 text-center text-sm font-medium text-zinc-500">
        Already have an account?{" "}
        <Link href="/login" className="font-bold text-emerald-400 transition-colors hover:text-emerald-300">
          Log in
        </Link>
      </p>
    </form>
  );
}
