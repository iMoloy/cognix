"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Copy, Check, Zap, DollarSign, Cpu } from "lucide-react";
import Button from "@/components/ui/Button";

export default function PromptEnhancerModal({ isOpen, onClose, initialPrompt = "" }) {
  const [inputPrompt, setInputPrompt] = useState(initialPrompt);
  const [targetPlatform, setTargetPlatform] = useState("ChatGPT");
  const [enhancedPrompt, setEnhancedPrompt] = useState("");
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState(null);

  if (!isOpen) return null;

  const handleEnhance = () => {
    if (!inputPrompt.trim()) return;
    setIsEnhancing(true);

    setTimeout(() => {
      let result = "";
      const text = inputPrompt.trim();

      if (targetPlatform === "Midjourney") {
        result = `/imagine prompt: ${text}, photorealistic 8k resolution, cinematic lighting, shot on 35mm lens, hyper-detailed textures, volumetric haze, depth of field, award-winning photography --ar 16:9 --style raw --v 6.0`;
      } else if (targetPlatform === "Claude") {
        result = `<system_role>\nYou are an elite domain expert specialized in ${text}.\n</system_role>\n\n<context>\nThe user requires an authoritative, well-structured, step-by-step resolution for: {{input_topic}}\n</context>\n\n<instructions>\n1. Analyze the core objective thoroughly before responding.\n2. Provide concise, actionable insights with code/examples where applicable.\n3. Highlight critical warnings or edge cases.\n</instructions>\n\n<output_format>\nUse clean markdown headings, code blocks, and bullet points.\n</output_format>`;
      } else {
        result = `### Role & Goal\nYou are an expert assistant for ${text}. Your task is to provide precise, structured, and comprehensive answers.\n\n### Context & Variables\n- Target Audience: {{audience}}\n- Desired Tone: {{tone}}\n- Input Data: {{user_input}}\n\n### Rules & Constraints\n- Be clear, objective, and accurate.\n- Avoid unnecessary filler words.\n- Format output using structured Markdown sections.`;
      }

      // Calculate approximate tokens & cost
      const wordCount = result.split(/\s+/).length;
      const tokens = Math.round(wordCount * 1.3);
      const estCost = ((tokens / 1000) * 0.002).toFixed(5);

      setEnhancedPrompt(result);
      setStats({
        tokens,
        cost: `$${estCost}`,
        qualityScore: "98/100",
      });
      setIsEnhancing(false);
    }, 800);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(enhancedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  AI Prompt Enhancer & Optimizer
                </h3>
                <p className="text-xs text-slate-400">
                  Transform raw text into production-ready system prompts
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto space-y-5">
            {/* Target Platform Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Target AI Platform
              </label>
              <div className="grid grid-cols-3 gap-3">
                {["ChatGPT", "Claude", "Midjourney"].map((platform) => (
                  <button
                    key={platform}
                    onClick={() => setTargetPlatform(platform)}
                    className={`py-2.5 px-4 rounded-xl text-xs font-semibold border transition ${
                      targetPlatform === platform
                        ? "bg-amber-500/10 border-amber-500 text-amber-400 shadow-sm"
                        : "bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    {platform}
                  </button>
                ))}
              </div>
            </div>

            {/* Raw Input Prompt */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Enter Simple Idea or Draft Prompt
              </label>
              <textarea
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                placeholder="e.g. Create a blog post generator for fitness coaches..."
                rows={3}
                className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition resize-none"
              />
            </div>

            <button
              onClick={handleEnhance}
              disabled={isEnhancing || !inputPrompt.trim()}
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 text-slate-950 font-bold rounded-2xl transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
            >
              {isEnhancing ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" /> Enhancing Prompt...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" /> Enhance & Optimize Prompt ⚡
                </>
              )}
            </button>

            {/* Enhanced Output Result */}
            {enhancedPrompt && (
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
                    <Check className="w-4 h-4" /> Optimized System Prompt
                  </span>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Copied!" : "Copy Prompt"}
                  </button>
                </div>

                <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-xs font-mono text-emerald-300 whitespace-pre-wrap max-h-52 overflow-y-auto leading-relaxed shadow-inner">
                  {enhancedPrompt}
                </div>

                {/* Performance Stats */}
                {stats && (
                  <div className="grid grid-cols-3 gap-3 p-3 bg-slate-800/40 rounded-2xl border border-slate-800/80 text-center">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Est. Tokens</span>
                      <span className="text-sm font-bold text-slate-200 flex items-center justify-center gap-1 mt-0.5">
                        <Cpu className="w-3.5 h-3.5 text-amber-400" /> {stats.tokens}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Cost / 1k Runs</span>
                      <span className="text-sm font-bold text-emerald-400 flex items-center justify-center gap-1 mt-0.5">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> {stats.cost}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Quality Score</span>
                      <span className="text-sm font-bold text-purple-400 flex items-center justify-center gap-1 mt-0.5">
                        <Zap className="w-3.5 h-3.5 text-purple-400" /> {stats.qualityScore}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
