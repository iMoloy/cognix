"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { UserPlus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

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
      <div>
        <label htmlFor="name" className="text-sm font-semibold text-zinc-300">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          required
          className="mt-2 h-12 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 text-sm text-zinc-50 outline-none transition placeholder:text-zinc-600 focus:border-emerald-300"
          placeholder="Your full name"
        />
      </div>

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
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label htmlFor="photoURL" className="text-sm font-semibold text-zinc-300">
          Photo URL
        </label>
        <input
          id="photoURL"
          name="photoURL"
          type="url"
          value={formData.photoURL}
          onChange={handleChange}
          className="mt-2 h-12 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 text-sm text-zinc-50 outline-none transition placeholder:text-zinc-600 focus:border-emerald-300"
          placeholder="https://example.com/photo.jpg"
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
          placeholder="Minimum 6 characters"
        />
      </div>

      <button
        type="submit"
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-emerald-300 px-5 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-200"
      >
        <UserPlus size={18} />
        Register
      </button>

      <p className="text-center text-sm text-zinc-500">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-zinc-50">
          Login
        </Link>
      </p>
    </form>
  );
}
