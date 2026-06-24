"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { LogIn, Eye, EyeOff } from "lucide-react";
import Button from "@/components/ui/Button";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, googleSignIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    email: searchParams.get("email") || "",
    password: searchParams.get("password") || "",
  });

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      if (errorParam === "oauth_failed" || errorParam === "true") {
        toast.error("Google authentication failed. Please try again.");
      } else {
        toast.error(`Authentication error: ${errorParam.replace(/_/g, " ")}`);
      }
      router.replace("/login");
    }
  }, [searchParams, router]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      await login(formData);
      toast.success("Welcome back! Logged in successfully.");
      router.push("/dashboard");
    } catch (err) {
      toast.error(err.message || "Failed to login. Check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await googleSignIn();
      toast.success("Logged in with Google!");
      router.push("/dashboard");
    } catch (err) {
      toast.error("Google sign-in failed.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
          className="h-14 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-medium text-white outline-none backdrop-blur-md transition-all placeholder:text-zinc-600 focus:border-emerald-500/50 focus:bg-white/10 focus:shadow-[0_0_20px_rgba(52,211,153,0.15)]"
          placeholder="creator@cognix.dev"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-xs font-bold uppercase tracking-widest text-zinc-400">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
            className="h-14 w-full rounded-xl border border-white/10 bg-white/5 pl-4 pr-12 text-sm font-medium text-white outline-none backdrop-blur-md transition-all placeholder:text-zinc-600 focus:border-emerald-500/50 focus:bg-white/10 focus:shadow-[0_0_20px_rgba(52,211,153,0.15)]"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-emerald-400 transition-colors"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      <div className="space-y-4 pt-2">
        <Button 
          type="submit" 
          fullWidth 
          isLoading={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>

        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-white/10"></div>
          <span className="shrink-0 px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">or continue with</span>
          <div className="flex-grow border-t border-white/10"></div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={handleGoogleLogin}
          className="flex h-14 w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 px-5 text-sm font-bold text-white transition-all hover:bg-white/10"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            <path fill="none" d="M1 1h22v22H1z" />
          </svg>
          Google
        </motion.button>
      </div>

      <p className="mt-8 text-center text-sm font-medium text-zinc-500">
        New to Cognix?{" "}
        <Link href="/register" className="bg-[length:200%_auto] animate-gradient-x bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-clip-text font-bold text-transparent">
          Create an account
        </Link>
      </p>
    </form>
  );
}
