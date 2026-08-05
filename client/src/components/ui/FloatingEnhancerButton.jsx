"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import PromptEnhancerModal from "./PromptEnhancerModal";

export default function FloatingEnhancerButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-40 flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold text-xs rounded-2xl shadow-xl shadow-amber-500/20 hover:scale-105 transition-all duration-300 group"
        title="AI Prompt Enhancer & Cost Estimator"
      >
        <div className="w-6 h-6 rounded-full bg-slate-950/20 flex items-center justify-center">
          <Sparkles className="w-3.5 h-3.5 text-slate-950 group-hover:rotate-12 transition-transform" />
        </div>
        <span>AI Prompt Enhancer</span>
      </button>

      <PromptEnhancerModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
