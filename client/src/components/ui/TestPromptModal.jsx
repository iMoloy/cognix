"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Loader2, Key } from "lucide-react";
import Button from "@/components/ui/Button";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function TestPromptModal({ isOpen, onClose, promptContent }) {
  const [apiKey, setApiKey] = useState("");
  const [inputData, setInputData] = useState("");
  const [output, setOutput] = useState("");
  const [isTesting, setIsTesting] = useState(false);

  if (!isOpen) return null;

  const handleTest = async () => {
    if (!apiKey) {
      alert("Please enter a valid Gemini API Key.");
      return;
    }
    
    setIsTesting(true);
    setOutput("");
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const fullPrompt = `${promptContent}\n\nUser Input: ${inputData}`;
      
      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      const text = response.text();
      
      setOutput(text);
    } catch (error) {
      console.error(error);
      setOutput(`Error: ${error.message || "Failed to test prompt."}`);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#030303]/80 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 shadow-2xl flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.02] px-6 py-4 shrink-0">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Play size={18} className="text-emerald-400" /> Test Prompt with Gemini
            </h2>
            <button 
              onClick={onClose}
              className="rounded-full p-2 text-zinc-500 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-2">
                <Key size={14} className="text-amber-400" /> Your Gemini API Key
              </label>
              <input 
                type="password" 
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-colors focus:border-emerald-500/50"
              />
              <p className="text-[10px] text-zinc-500">Your key is never stored and only used locally for this test request.</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Test Input Data (Variables)</label>
              <textarea 
                rows={3}
                value={inputData}
                onChange={(e) => setInputData(e.target.value)}
                placeholder="Enter any context or variables the prompt expects..."
                className="w-full rounded-xl border border-white/10 bg-black/40 p-4 text-sm text-white placeholder-zinc-600 outline-none transition-colors focus:border-emerald-500/50 resize-none"
              />
            </div>

            <div className="flex justify-end">
              <Button onClick={handleTest} disabled={isTesting || !apiKey}>
                {isTesting ? <><Loader2 size={16} className="mr-2 animate-spin" /> Running...</> : <><Play size={16} className="mr-2" /> Run Prompt</>}
              </Button>
            </div>

            {output && (
              <div className="mt-4 space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-emerald-400">AI Output</label>
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-sm text-zinc-300 whitespace-pre-wrap">
                  {output}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
