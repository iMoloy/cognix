"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service if needed
    console.error("Global Error Caught:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#030303] px-4">
      <div className="w-full max-w-lg rounded-2xl border border-red-500/20 bg-zinc-900/50 p-8 shadow-2xl backdrop-blur-xl text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 mb-6">
          <AlertTriangle size={32} className="text-red-500" />
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-3">Something went wrong!</h1>
        <p className="text-zinc-400 mb-8 text-sm leading-relaxed">
          We encountered an unexpected error while trying to process your request. Please try again or return to the homepage.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => reset()}
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-zinc-800 px-6 py-3 font-semibold text-white transition-all hover:bg-zinc-700"
          >
            <RefreshCcw size={18} />
            Try Again
          </button>
          
          <Link
            href="/"
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-3 font-semibold text-white transition-all hover:opacity-90"
          >
            <Home size={18} />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
