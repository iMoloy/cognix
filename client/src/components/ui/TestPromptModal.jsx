"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Loader2, Key, TerminalSquare } from "lucide-react";
import Button from "@/components/ui/Button";

export default function TestPromptModal({ isOpen, onClose, promptContent }) {
  const [provider, setProvider] = useState("gemini");
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("gemini-3.5-flash");
  const [promptInstruction, setPromptInstruction] = useState(promptContent || "");
  const [inputData, setInputData] = useState("");
  const [output, setOutput] = useState("");
  const [isTesting, setIsTesting] = useState(false);

  // Sync prompt instruction whenever modal opens or promptContent changes
  useEffect(() => {
    if (promptContent) {
      const cleanText = promptContent.replace(/<[^>]*>?/gm, '');
      setPromptInstruction(cleanText);
    }
  }, [promptContent, isOpen]);

  // Update default model when provider changes
  const handleProviderChange = (newProvider) => {
    setProvider(newProvider);
    if (newProvider === "openai") {
      setModel("gpt-5.6-sol");
    } else if (newProvider === "anthropic") {
      setModel("claude-sonnet-5");
    } else {
      setModel("gemini-3.5-flash");
    }
  };

  if (!isOpen) return null;

  const handleTest = async () => {
    if (!apiKey) {
      alert(`Please enter a valid ${provider.toUpperCase()} API Key.`);
      return;
    }
    
    setIsTesting(true);
    setOutput("");
    try {
      const fullPrompt = inputData.trim() 
        ? `${promptInstruction}\n\nUser Input / Variables:\n${inputData}`
        : promptInstruction;

      const res = await fetch("/api/ai-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider, apiKey, model, prompt: fullPrompt }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to test prompt.");
      }

      setOutput(data.text);
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
              <Play size={18} className="text-emerald-400" /> Test Prompt Runner
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
            <div className="grid gap-4 sm:grid-cols-2">
              {/* AI Provider */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">AI Provider Engine</label>
                <select
                  value={provider}
                  onChange={(e) => handleProviderChange(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-emerald-500/50"
                >
                  <option value="gemini" className="bg-zinc-900">Google Gemini</option>
                  <option value="openai" className="bg-zinc-900">OpenAI (ChatGPT)</option>
                  <option value="anthropic" className="bg-zinc-900">Anthropic (Claude)</option>
                </select>
              </div>

              {/* AI Model */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Model Name</label>
                <input
                  type="text"
                  list="ai-models-list"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="Select or type model ID (e.g. gemini-3.5-flash)..."
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-colors focus:border-emerald-500/50"
                />
                <datalist id="ai-models-list">
                  {provider === "openai" && (
                    <>
                      <option value="gpt-5.6-sol" label="GPT-5.6 Sol (Flagship)" />
                      <option value="gpt-5.6-terra" label="GPT-5.6 Terra (Balanced)" />
                      <option value="gpt-5.6-luna" label="GPT-5.6 Luna (Fast)" />
                      <option value="gpt-4o" label="GPT-4o" />
                      <option value="gpt-4o-mini" label="GPT-4o Mini" />
                      <option value="o3-mini" label="o3-mini (Reasoning)" />
                    </>
                  )}
                  {provider === "anthropic" && (
                    <>
                      <option value="claude-sonnet-5" label="Claude Sonnet 5 (Recommended)" />
                      <option value="claude-opus-4-8" label="Claude Opus 4.8" />
                      <option value="claude-3-7-sonnet-latest" label="Claude 3.7 Sonnet" />
                      <option value="claude-3-5-sonnet-latest" label="Claude 3.5 Sonnet" />
                      <option value="claude-3-5-haiku-latest" label="Claude 3.5 Haiku" />
                    </>
                  )}
                  {provider === "gemini" && (
                    <>
                      <option value="gemini-3.5-flash" label="Gemini 3.5 Flash (Recommended)" />
                      <option value="gemini-3.6-flash" label="Gemini 3.6 Flash" />
                      <option value="gemini-3.1-pro" label="Gemini 3.1 Pro" />
                      <option value="gemini-3.5-flash-lite" label="Gemini 3.5 Flash-Lite" />
                      <option value="gemini-2.0-flash" label="Gemini 2.0 Flash" />
                    </>
                  )}
                </datalist>
              </div>
            </div>

            {/* API Key */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-2">
                <Key size={14} className="text-amber-400" /> 
                {provider === "openai" ? "Your OpenAI API Key" : provider === "anthropic" ? "Your Anthropic API Key" : "Your Gemini API Key"}
              </label>
              <input 
                type="password" 
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={provider === "openai" ? "sk-proj-..." : provider === "anthropic" ? "sk-ant-..." : "AIzaSy..."}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-colors focus:border-emerald-500/50 font-mono"
              />
              <p className="text-[10px] text-zinc-500">Your API key is processed securely server-side and never saved.</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <TerminalSquare size={14} /> Prompt Instruction (Auto-filled)
              </label>
              <textarea 
                rows={4}
                value={promptInstruction}
                onChange={(e) => setPromptInstruction(e.target.value)}
                placeholder="Prompt payload instruction..."
                className="w-full rounded-xl border border-emerald-500/20 bg-black/50 p-4 text-xs font-mono text-zinc-200 outline-none transition-colors focus:border-emerald-500/50 resize-y"
              />
              <p className="text-[10px] text-zinc-500">Auto-filled from prompt details. You can edit this instruction before running.</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Optional Input Variables / Context</label>
              <textarea 
                rows={2}
                value={inputData}
                onChange={(e) => setInputData(e.target.value)}
                placeholder="Enter any custom variables or context for this test run..."
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
