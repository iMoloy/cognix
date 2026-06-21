"use client";

import { useState } from "react";
import { UploadCloud, Image as ImageIcon, Send, Sparkles, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { uploadImage } from "@/utils/uploadImage";
import { useAuth } from "@/contexts/AuthContext";

export default function AddPromptPage() {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageMode, setImageMode] = useState("local"); // "local" or "url"
  const [imageURL, setImageURL] = useState("");

  const { user, token } = useAuth();
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    tool: "chatgpt",
    description: "",
    instruction: "", // Maps to "Prompt Content"
    category: "engineering",
    level: "beginner",
    visibility: "public",
    tags: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

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
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !token) {
      alert("You must be logged in.");
      return;
    }

    setIsSubmitting(true);
    try {
      let finalImageURL = "";
      if (imageMode === "local" && selectedFile) {
        finalImageURL = await uploadImage(selectedFile);
      } else if (imageMode === "url" && imageURL) {
        finalImageURL = imageURL;
      }

      // Format payload
      const tagsArray = formData.tags.split(",").map(t => t.trim()).filter(Boolean);
      const price = formData.visibility === "private" ? 4.99 : 0; // Simple pricing logic

      const payload = {
        title: formData.title,
        tool: formData.tool,
        description: formData.description,
        instruction: formData.instruction,
        category: formData.category,
        level: formData.level,
        price,
        tags: tagsArray,
        image: finalImageURL || "https://images.unsplash.com/photo-1620712943543-bcc4688e7485", // Fallback image
        creatorId: user._id,
        author: {
          name: user.name,
          image: user.photoURL || `https://ui-avatars.com/api/?name=${user.name}`
        }
      };

      const res = await fetch(`${API_URL}/api/prompts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Failed to submit prompt");

      router.push("/dashboard/my-prompts");
    } catch (error) {
      console.error(error);
      alert("Failed to submit prompt");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Add New Prompt</h1>
        <p className="mt-2 text-zinc-400">Share your best AI prompts with the community. All submissions are reviewed by moderators.</p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-6 backdrop-blur-xl md:p-8">
        <form className="space-y-8" onSubmit={handleSubmit}>
          
          {/* Title & AI Tool */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-bold text-white">Prompt Title</label>
              <input 
                type="text" 
                name="title"
                required
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Next.js 14 API Architect"
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition-all focus:border-emerald-500/50 focus:bg-white/[0.02]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-white">AI Tool</label>
              <select 
                name="tool"
                value={formData.tool}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition-all focus:border-emerald-500/50 appearance-none"
              >
                <option value="chatgpt" className="bg-zinc-900 text-white">ChatGPT</option>
                <option value="claude" className="bg-zinc-900 text-white">Claude 3</option>
                <option value="gemini" className="bg-zinc-900 text-white">Gemini</option>
                <option value="midjourney" className="bg-zinc-900 text-white">Midjourney</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-white">Description</label>
            <textarea 
              rows={3}
              name="description"
              required
              value={formData.description}
              onChange={handleInputChange}
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
              name="instruction"
              required
              value={formData.instruction}
              onChange={handleInputChange}
              placeholder="Paste the actual prompt here..."
              className="w-full resize-y rounded-xl border border-white/10 bg-black/40 px-4 py-3 font-mono text-sm text-white placeholder-zinc-600 outline-none transition-all focus:border-emerald-500/50 focus:bg-black"
            />
          </div>

          {/* Dropdowns: Category, Difficulty, Visibility */}
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-bold text-white">Category</label>
              <select 
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition-all focus:border-emerald-500/50 appearance-none"
              >
                <option value="engineering" className="bg-zinc-900 text-white">Engineering</option>
                <option value="marketing" className="bg-zinc-900 text-white">Marketing</option>
                <option value="design" className="bg-zinc-900 text-white">Design</option>
                <option value="writing" className="bg-zinc-900 text-white">Writing</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-white">Difficulty</label>
              <select 
                name="level"
                value={formData.level}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition-all focus:border-emerald-500/50 appearance-none"
              >
                <option value="beginner" className="bg-zinc-900 text-white">Beginner</option>
                <option value="intermediate" className="bg-zinc-900 text-white">Intermediate</option>
                <option value="pro" className="bg-zinc-900 text-white">Pro</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-white">Visibility</label>
              <select 
                name="visibility"
                value={formData.visibility}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition-all focus:border-emerald-500/50 appearance-none"
              >
                <option value="public" className="bg-zinc-900 text-white">Public (Free)</option>
                <option value="private" className="bg-zinc-900 text-white">Private (Premium)</option>
              </select>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-white">Tags (Comma separated)</label>
            <input 
              type="text" 
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              placeholder="react, nextjs, typescript..."
              className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition-all focus:border-emerald-500/50 focus:bg-white/[0.02]"
            />
          </div>

          {/* Thumbnail Image Upload */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-white">Thumbnail Image</label>
              <div className="flex gap-2">
                <button type="button" onClick={() => setImageMode("local")} className={`text-[10px] px-2 py-1 rounded-md font-bold uppercase transition-colors ${imageMode === "local" ? "bg-emerald-500/20 text-emerald-400" : "bg-white/5 text-zinc-500 hover:text-zinc-300"}`}>Upload</button>
                <button type="button" onClick={() => setImageMode("url")} className={`text-[10px] px-2 py-1 rounded-md font-bold uppercase transition-colors ${imageMode === "url" ? "bg-emerald-500/20 text-emerald-400" : "bg-white/5 text-zinc-500 hover:text-zinc-300"}`}>URL</button>
              </div>
            </div>
            
            {imageMode === "local" ? (
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
                
                {selectedFile ? (
                  <div className="flex flex-col items-center gap-2 text-emerald-400">
                    <img 
                      src={URL.createObjectURL(selectedFile)} 
                      alt="Preview" 
                      className="h-20 w-20 object-cover rounded-lg border border-emerald-500/30"
                    />
                    <span className="text-sm font-bold truncate max-w-[200px]">{selectedFile.name}</span>
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
            ) : (
              <input 
                type="url" 
                value={imageURL}
                onChange={(e) => setImageURL(e.target.value)}
                placeholder="https://example.com/thumbnail.jpg"
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition-all focus:border-emerald-500/50 focus:bg-white/[0.02]"
              />
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-white/10">
            <Button 
              type="submit"
              isLoading={isSubmitting}
              className="w-full sm:w-auto px-10 py-4 text-base"
            >
              <Send size={18} className="mr-2" />
              {isSubmitting ? "Uploading..." : "Submit Prompt for Review"}
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
