// src/components/profile/AvatarPreview.jsx
import React from "react";
import { motion } from "framer-motion";
import { 
  Shield, Zap, Activity, Flame, Skull, Crosshair, User 
} from "lucide-react";

// --- EMBLEM MAPPING ---
// Connects string keys to visual Icons
const EMBLEM_ICONS = {
  falcon: Shield,
  wolf: Crosshair,
  thunder: Zap,
  phoenix: Flame,
  dino: Skull,
  samurai: Activity,
  default: User
};

/**
 * 🆔 AVATAR PREVIEW UNIT
 * Displays the current Ranger Identity in a compact, holographic form.
 * * @param {Object} avatar - The configuration object { suitColor, emblem, silhouette, etc. }
 * @param {string} size - 'sm' | 'md' | 'lg' | 'xl'
 * @param {string} className - Optional tailwind classes overrides
 */
export default function AvatarPreview({ avatar, size = "md", className = "" }) {
  
  // 1. SAFE DEFAULTS (Prevents crashes if data is missing)
  const config = {
    color: avatar?.suitColor || "#22d3ee",
    emblem: avatar?.emblem || "default",
    silhouette: avatar?.silhouette || "male",
    glow: avatar?.glowStrength || 0.7
  };

  const EmblemIcon = EMBLEM_ICONS[config.emblem] || EMBLEM_ICONS.default;

  // 2. SIZE MAPS
  const sizes = {
    sm: "w-8 h-8 p-1.5",
    md: "w-12 h-12 p-2",
    lg: "w-24 h-24 p-4",
    xl: "w-40 h-40 p-6" // For the main profile display
  };

  const iconSizes = {
    sm: 14,
    md: 20,
    lg: 40,
    xl: 64
  };

  // 3. DYNAMIC GLOW STYLES
  const containerStyle = {
    borderColor: config.color,
    boxShadow: `0 0 ${20 * config.glow}px ${config.color}40, inset 0 0 ${10 * config.glow}px ${config.color}20`
  };

  const bgGradient = {
    background: `radial-gradient(circle at center, ${config.color}20 0%, transparent 70%)`
  };

  return (
    <div className={`relative group ${className}`}>
      
      {/* A. ROTATING RINGS (Only visible on larger sizes) */}
      {(size === 'lg' || size === 'xl') && (
        <>
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
            className="absolute inset-[-10%] rounded-full border border-dashed opacity-30 pointer-events-none"
            style={{ borderColor: config.color }}
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
            className="absolute inset-[-20%] rounded-full border border-dotted opacity-20 pointer-events-none"
            style={{ borderColor: config.color }}
          />
        </>
      )}

      {/* B. MAIN AVATAR CONTAINER */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        className={`relative rounded-full border-2 bg-slate-950 flex items-center justify-center overflow-hidden z-10 ${sizes[size]}`}
        style={containerStyle}
      >
        {/* Internal Atmosphere */}
        <div className="absolute inset-0 z-0" style={bgGradient} />
        
        {/* Silhouette Base */}
        <div className="absolute inset-0 flex items-center justify-center opacity-30 z-0">
           {/* Simple SVG Shape representing the suit base */}
           <svg viewBox="0 0 100 100" className="w-full h-full fill-current" style={{ color: config.color }}>
             <path d="M50 20 C35 20 25 35 25 50 C25 80 35 100 50 100 C65 100 75 80 75 50 C75 35 65 20 50 20 Z" />
           </svg>
        </div>

        {/* The Emblem Overlay */}
        <div className="relative z-10 drop-shadow-[0_0_5px_rgba(0,0,0,0.8)]">
          <EmblemIcon 
            size={iconSizes[size]} 
            color={config.color} 
            strokeWidth={2.5}
            className="drop-shadow-md"
          />
        </div>

        {/* Gloss Effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none rounded-full" />
      </motion.div>

    </div>
  );
}