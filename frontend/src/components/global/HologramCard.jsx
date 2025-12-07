// src/components/global/HologramCard.jsx
import React from 'react';
import { motion } from 'framer-motion';

/**
 * HologramCard Component
 * A tactical container with glassmorphism, scanlines, and reactive borders.
 * * Props:
 * - title: Main header text
 * - subtitle: Smaller mono-spaced subtext
 * - icon: Optional Lucide icon component for the top right
 * - children: Card content
 */
export default function HologramCard({ 
  title, 
  subtitle, 
  icon: Icon, 
  children, 
  className = '' 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`relative group rounded-2xl p-5 overflow-hidden backdrop-blur-xl bg-[#050b14]/80 border border-cyan-500/20 shadow-lg ${className}`}
    >
      {/* --- 1. BACKGROUND TEXTURES --- */}
      {/* Subtle Gradient Wash */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-transparent pointer-events-none" />
      
      {/* Scanline Overlay (Uses your global scanlines class) */}
      <div className="absolute inset-0 scanlines opacity-5 pointer-events-none" />
      
      {/* --- 2. REACTIVE HUD CORNERS --- */}
      {/* Top Right Corner */}
      <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-cyan-500/40 rounded-tr-xl opacity-60 transition-all duration-500 group-hover:w-10 group-hover:h-10 group-hover:opacity-100 group-hover:border-cyan-400" />
      
      {/* Bottom Left Corner */}
      <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-cyan-500/40 rounded-bl-xl opacity-60 transition-all duration-500 group-hover:w-10 group-hover:h-10 group-hover:opacity-100 group-hover:border-cyan-400" />

      {/* --- 3. HEADER SECTION --- */}
      {(title || subtitle) && (
        <div className="relative z-10 flex items-start justify-between mb-4 pb-3 border-b border-cyan-500/10">
          <div>
            {title && (
              <h3 className="text-white text-lg font-bold tracking-wide uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                {title}
              </h3>
            )}
            {subtitle && (
              <div className="flex items-center gap-2 mt-1">
                <span className="w-1 h-3 bg-cyan-500/50 rounded-full" />
                <p className="text-cyan-400/70 text-[10px] font-mono tracking-widest uppercase">
                  {subtitle}
                </p>
              </div>
            )}
          </div>

          {/* Holographic Status Node / Icon */}
          <div className="w-9 h-9 rounded-lg bg-slate-900/60 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.05)] group-hover:border-cyan-500/50 group-hover:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all duration-300">
            {Icon ? (
              <Icon size={16} strokeWidth={2} />
            ) : (
              // Default pulsing dot if no icon
              <div className="relative flex items-center justify-center">
                 <span className="w-2 h-2 bg-cyan-400 rounded-full z-10" />
                 <span className="absolute w-full h-full bg-cyan-400 rounded-full animate-ping opacity-75" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- 4. BODY CONTENT --- */}
      <div className="relative z-10 text-slate-300/90 text-sm leading-relaxed">
        {children}
      </div>
    </motion.div>
  );
}