"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogIn } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    login(formData);
    router.push("/dashboard");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="email" className="text-sm font-semibold text-zinc-300">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="mt-2 h-12 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 text-sm text-zinc-50 outline-none transition placeholder:text-zinc-600 focus:border-emerald-300"
          placeholder="creator@cognix.dev"
        />
      </div>

      <div>
        <label htmlFor="password" className="text-sm font-semibold text-zinc-300">
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
          className="mt-2 h-12 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 text-sm text-zinc-50 outline-none transition placeholder:text-zinc-600 focus:border-emerald-300"
          placeholder="Enter your password"
        />
      </div>

      <button
        type="submit"
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-emerald-300 px-5 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-200"
      >
        <LogIn size={18} />
        Login
      </button>

      <p className="text-center text-sm text-zinc-500">
        New to Cognix?{" "}
        <Link href="/register" className="font-semibold text-zinc-50">
          Create an account
        </Link>
      </p>
    </form>
  );
}
