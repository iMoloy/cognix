import React from "react";
import { Loader2 } from "lucide-react";

export default function Button({ 
  children, 
  variant = "primary", 
  size = "md", 
  className = "", 
  isLoading = false,
  fullWidth = false,
  ...props 
}) {
  const baseStyles = "relative inline-flex items-center justify-center font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "rounded-xl bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-[length:200%_auto] animate-gradient-x text-zinc-950 shadow-md hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(52,211,153,0.3)]",
    secondary: "rounded-xl border border-white/10 bg-white/5 text-white hover:bg-white/10",
    danger: "rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 hover:scale-[1.02]",
    ghost: "rounded-lg text-zinc-400 hover:bg-white/10 hover:text-emerald-400"
  };

  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base"
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
