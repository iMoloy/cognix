"use client";

import { useState } from "react";
import { UploadCloud, Image as ImageIcon, Send, Sparkles } from "lucide-react";
import Button from "@/components/ui/Button";

export default function AddPromptPage() {
  const [dragActive, setDragActive] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // Mocking image selection
      setSelectedImage(e.dataTransfer.files[0].name);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0].name);
    }
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Add New Prompt</h1>
        <p className="mt-2 text-zinc-400">Share your best AI prompts with the community. All submissions are reviewed by moderators.</p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-6 backdrop-blur-xl md:p-8">
        <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
          
          {/* Title & AI Tool */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-bold text-white">Prompt Title</label>
              <input 
                type="text" 
                placeholder="e.g., Next.js 14 API Architect"
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition-all focus:border-emerald-500/50 focus:bg-white/[0.02]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-white">AI Tool</label>
              <select className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition-all focus:border-emerald-500/50 appearance-none">
                <option value="chatgpt">ChatGPT</option>
                <option value="claude">Claude 3</option>
                <option value="gemini">Gemini</option>
                <option value="midjourney">Midjourney</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-white">Description</label>
            <textarea 
              rows={3}
              placeholder="Briefly describe what this prompt does..."
              className="w-full resize-none rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition-all focus:border-emerald-500/50 focus:bg-white/[0.02]"
            />
          </div>

          {/* Prompt Content */}
          <div className="space-y-2">
            <label className="text-sm font-bold flex items-center justify-between text-white">
              <span>Prompt Content</span>
              <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                <Sparkles size={10} /> Secret Payload
              </span>
            </label>
            <textarea 
              rows={6}
              placeholder="Paste the actual prompt here..."
              className="w-full resize-y rounded-xl border border-white/10 bg-black/40 px-4 py-3 font-mono text-sm text-white placeholder-zinc-600 outline-none transition-all focus:border-emerald-500/50 focus:bg-black"
            />
          </div>

          {/* Dropdowns: Category, Difficulty, Visibility */}
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-bold text-white">Category</label>
              <select className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition-all focus:border-emerald-500/50 appearance-none">
                <option value="engineering">Engineering</option>
                <option value="marketing">Marketing</option>
                <option value="design">Design</option>
                <option value="writing">Writing</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-white">Difficulty</label>
              <select className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition-all focus:border-emerald-500/50 appearance-none">
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="pro">Pro</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-white">Visibility</label>
              <select className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition-all focus:border-emerald-500/50 appearance-none">
                <option value="public">Public (Free)</option>
                <option value="private">Private (Premium)</option>
              </select>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-white">Tags (Comma separated)</label>
            <input 
              type="text" 
              placeholder="react, nextjs, typescript..."
              className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition-all focus:border-emerald-500/50 focus:bg-white/[0.02]"
            />
          </div>

          {/* Thumbnail Image Upload */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-white">Thumbnail Image</label>
            <div 
              className={`relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 transition-all ${
                dragActive ? "border-emerald-400 bg-emerald-500/5" : "border-zinc-700 bg-black/20 hover:border-emerald-500/30 hover:bg-white/[0.02]"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input 
                type="file" 
                accept="image/*"
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                onChange={handleChange}
              />
              
              {selectedImage ? (
                <div className="flex flex-col items-center gap-2 text-emerald-400">
                  <ImageIcon size={40} className="opacity-80" />
                  <span className="text-sm font-bold">{selectedImage}</span>
                  <span className="text-xs text-emerald-500/70">Click or drag to replace</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 text-zinc-400">
                  <div className="rounded-full bg-white/5 p-4 ring-1 ring-white/10">
                    <UploadCloud size={32} />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-white">Click to upload or drag and drop</p>
                    <p className="mt-1 text-xs text-zinc-500">SVG, PNG, JPG or GIF (max. 2MB)</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-white/10">
            <Button 
              className="w-full sm:w-auto px-10 py-4 text-base"
            >
              <Send size={18} className="mr-2" />
              Submit Prompt for Review
            </Button>
            <p className="mt-3 text-xs text-zinc-500">
              By submitting, you agree to our prompt quality guidelines. Approvals usually take 24 hours.
            </p>
          </div>

        </form>
      </div>
    </div>
  );
}
