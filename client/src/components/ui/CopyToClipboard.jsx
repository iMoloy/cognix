"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export default function CopyToClipboard({ text }) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    if (!text) return;
    
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all ${
        isCopied
          ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
          : "border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-emerald-400"
      }`}
      aria-label="Copy prompt text"
      title="Copy prompt text"
    >
      {isCopied ? <Check size={18} /> : <Copy size={18} />}
    </button>
  );
}
