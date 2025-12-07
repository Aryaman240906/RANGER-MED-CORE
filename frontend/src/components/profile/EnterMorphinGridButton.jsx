// src/components/profile/EnterMorphinGridButton.jsx
import React from "react";
import { motion } from "framer-motion";
import { Grid, ChevronRight, Zap } from "lucide-react";

/**
 * ⚡ ENTER MORPHIN GRID BUTTON
 * A high-fidelity, cinematic call-to-action that launches the Avatar Builder.
 * Features:
 * - Holographic glassmorphism
 * - Traveling light shimmer effect
 * - Reactive hover state
 * - "Breathing" neon glow
 */
export default function EnterMorphinGridButton({ onOpen }) {
  return (
    <div className="relative w-full flex justify-center group">
      
      {/* 1. AMBIENT GLOW BEHIND BUTTON */}
      <div className="absolute inset-0 bg-cyan-500/30 blur-xl rounded-lg opacity-50 group-hover:opacity-100 group-hover:blur-2xl transition-all duration-500" />

      <motion.button
        onClick={onOpen}
        whileHover="hover"
        whileTap="tap"
        initial="idle"
        variants={{
          idle: { scale: 1 },
          hover: { scale: 1.02 },
          tap: { scale: 0.98 }
        }}
        className="relative w-full max-w-md overflow-hidden rounded-xl border border-cyan-400/50 bg-slate-900/80 backdrop-blur-md shadow-[0_0_20px_rgba(34,211,238,0.2)] group-hover:shadow-[0_0_40px_rgba(34,211,238,0.5)] group-hover:border-cyan-400 transition-all duration-300"
      >
        
        {/* 2. ANIMATED SHIMMER OVERLAY */}
        <motion.div
          variants={{
            idle: { x: "-100%" },
            hover: { x: "100%" }
          }}
          transition={{ duration: 1, ease: "easeInOut", repeat: Infinity, repeatDelay: 1 }}
          className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg] z-0"
        />

        {/* 3. GRID TEXTURE BACKGROUND */}
        <div 
          className="absolute inset-0 opacity-10 z-0 pointer-events-none" 
          style={{ 
            backgroundImage: 'linear-gradient(#22d3ee 1px, transparent 1px), linear-gradient(90deg, #22d3ee 1px, transparent 1px)', 
            backgroundSize: '20px 20px' 
          }} 
        />

        {/* 4. BUTTON CONTENT */}
        <div className="relative z-10 flex items-center justify-between px-6 py-5">
          
          {/* Left: Icon & Text */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                <Grid size={24} className="text-cyan-400" />
              </div>
              {/* Little spark indicator */}
              <motion.div 
                variants={{
                  idle: { opacity: 0, scale: 0 },
                  hover: { opacity: 1, scale: 1 }
                }}
                className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow-[0_0_10px_white]"
              >
                <Zap size={8} className="text-cyan-600 fill-cyan-600" />
              </motion.div>
            </div>

            <div className="text-left">
              <h3 className="text-lg font-black text-white italic tracking-wider uppercase drop-shadow-md">
                Enter Morphin Grid
              </h3>
              <p className="text-[10px] font-mono text-cyan-200/70 tracking-[0.2em] uppercase">
                Customize Ranger Identity
              </p>
            </div>
          </div>

          {/* Right: Arrow */}
          <motion.div
            variants={{
              idle: { x: 0 },
              hover: { x: 5 }
            }}
            className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center bg-white/5"
          >
            <ChevronRight size={18} className="text-white" />
          </motion.div>
        </div>

        {/* 5. BOTTOM PROGRESS BAR DECORATION */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-800">
           <motion.div 
             className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500"
             variants={{
               idle: { width: "30%" },
               hover: { width: "100%" }
             }}
             transition={{ duration: 0.4 }}
           />
        </div>

      </motion.button>
    </div>
  );
}