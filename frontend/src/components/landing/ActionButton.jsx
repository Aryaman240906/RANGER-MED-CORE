// src/components/landing/ActionButton.jsx
import React from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

/**
 * ⚡ TACTICAL ACTION TRIGGER
 * A high-fidelity, reusable interaction component for the Landing Page.
 * Supports multiple energy signatures (Variants) and holographic physics.
 * * @param {string} label - Button text
 * @param {function} onClick - Click handler
 * @param {string} variant - 'primary' | 'secondary' | 'outline'
 * @param {LucideIcon} icon - Optional icon component
 * @param {string} className - Additional styles
 */
export default function ActionButton({ 
  label, 
  onClick, 
  variant = "primary", 
  icon: Icon, 
  className = "" 
}) {

  // --- THEME CONFIGURATION ---
  const THEMES = {
    primary: {
      container: "bg-cyan-500 hover:bg-cyan-400 border-cyan-400 text-black",
      glow: "shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:shadow-[0_0_35px_rgba(34,211,238,0.6)]",
      shimmer: "from-white/40 via-white/10 to-transparent",
      text: "font-black"
    },
    secondary: {
      container: "bg-emerald-500/10 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-400",
      glow: "shadow-[0_0_15px_rgba(16,185,129,0.1)] hover:shadow-[0_0_25px_rgba(16,185,129,0.3)]",
      shimmer: "from-emerald-400/20 via-emerald-400/5 to-transparent",
      text: "font-bold"
    },
    outline: {
      container: "bg-transparent border-slate-700 text-slate-400 hover:border-cyan-500/50 hover:text-cyan-300 hover:bg-cyan-950/20",
      glow: "hover:shadow-[0_0_15px_rgba(34,211,238,0.1)]",
      shimmer: "from-cyan-400/10 via-transparent to-transparent",
      text: "font-bold"
    }
  };

  const theme = THEMES[variant] || THEMES.primary;

  return (
    <motion.button
      onClick={onClick}
      whileHover="hover"
      whileTap="tap"
      initial="idle"
      variants={{
        idle: { scale: 1 },
        hover: { scale: 1.02 },
        tap: { scale: 0.98 }
      }}
      className={`
        relative group overflow-hidden rounded-lg border px-8 py-4 transition-all duration-300
        flex items-center justify-center gap-3 uppercase tracking-widest text-xs
        ${theme.container} ${theme.glow} ${theme.text} ${className}
      `}
    >
      
      {/* 1. INTERNAL GRID TEXTURE (Subtle Detail) */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none" 
        style={{ 
          backgroundImage: 'linear-gradient(0deg, transparent 24%, currentColor 25%, currentColor 26%, transparent 27%, transparent 74%, currentColor 75%, currentColor 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, currentColor 25%, currentColor 26%, transparent 27%, transparent 74%, currentColor 75%, currentColor 76%, transparent 77%, transparent)', 
          backgroundSize: '4px 4px' 
        }} 
      />

      {/* 2. TRAVELING LIGHT SHIMMER */}
      <motion.div
        variants={{
          idle: { x: "-150%" },
          hover: { x: "150%" }
        }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className={`absolute inset-0 w-2/3 -skew-x-12 bg-gradient-to-r ${theme.shimmer} z-10 pointer-events-none`}
      />

      {/* 3. CONTENT LAYER */}
      <div className="relative z-20 flex items-center gap-2">
        {Icon && (
          <Icon 
            size={18} 
            className={`transition-transform duration-300 group-hover:scale-110 ${variant === 'primary' ? 'fill-current' : ''}`} 
          />
        )}
        
        <span>{label}</span>
        
        {/* Animated Arrow for primary/secondary */}
        {variant !== 'outline' && (
          <motion.span
            variants={{
              idle: { x: 0, opacity: 0.6 },
              hover: { x: 4, opacity: 1 }
            }}
          >
            <ChevronRight size={14} strokeWidth={3} />
          </motion.span>
        )}
      </div>

      {/* 4. PROGRESS BAR DECORATION (Bottom edge) */}
      {variant !== 'primary' && (
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-50 transition-opacity" />
      )}

    </motion.button>
  );
}