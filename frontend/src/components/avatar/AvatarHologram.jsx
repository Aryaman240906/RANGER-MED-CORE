// src/components/avatar/AvatarHologram.jsx
import React from "react";
import { motion } from "framer-motion";
import { 
  Shield, Zap, Activity, Flame, Skull, Crosshair, User 
} from "lucide-react";

// --- ASSETS: SILHOUETTE PATHS ---
const SILHOUETTES = {
  male: "M50,10 C42,10 38,16 38,24 C38,30 42,34 50,34 C58,34 62,30 62,24 C62,16 58,10 50,10 M35,40 C30,42 20,45 15,55 L15,85 L25,85 L28,55 L38,90 L48,90 L48,60 L52,60 L52,90 L62,90 L72,55 L75,85 L85,85 L85,55 C80,45 70,42 65,40 L35,40 Z",
  female: "M50,12 C44,12 40,17 40,24 C40,29 44,33 50,33 C56,33 60,29 60,24 C60,17 56,12 50,12 M38,38 C32,40 25,42 20,50 L20,85 L28,85 L32,60 L40,90 L48,90 L48,60 L52,60 L52,90 L60,90 L68,60 L72,85 L80,85 L80,50 C75,42 68,40 62,38 L38,38 Z"
};

// --- ASSETS: EMBLEM MAP ---
const EMBLEMS = {
  falcon: Shield,
  wolf: Crosshair,
  thunder: Zap,
  phoenix: Flame,
  dino: Skull,
  samurai: Activity,
  default: User
};

/**
 * 🔮 AVATAR HOLOGRAM
 * The centerpiece of the Morphin Grid.
 * Renders the suit configuration as a floating light projection.
 */
export default function AvatarHologram({ 
  suitColor = "#22d3ee", 
  emblem = "falcon", 
  aura = "pulse", 
  glowStrength = 0.7, 
  silhouette = "male" 
}) {
  
  const EmblemIcon = EMBLEMS[emblem] || EMBLEMS.default;
  const pathData = SILHOUETTES[silhouette] || SILHOUETTES.male;

  // --- DYNAMIC STYLES ---
  const coreGlow = `drop-shadow(0 0 ${20 * glowStrength}px ${suitColor})`;
  const outerGlow = `0 0 ${50 * glowStrength}px ${suitColor}40`; 
  
  return (
    <div className="relative w-full h-[500px] md:h-[600px] flex items-center justify-center pointer-events-none perspective-[1200px]">
      
      {/* 1. ATMOSPHERIC LIGHTING (Based on Suit Color) */}
      <motion.div 
        animate={{ backgroundColor: suitColor }}
        className="absolute inset-0 opacity-15 blur-[120px] transition-colors duration-700"
      />

      {/* 2. THE HOLOGRAM ASSEMBLY (Floats up and down) */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 8, ease: "easeInOut", repeat: Infinity }}
        className="relative w-[320px] h-[320px] md:w-[420px] md:h-[420px] flex items-center justify-center"
      >
        
        {/* --- AURA EFFECTS (Behind Avatar) --- */}
        <div className="absolute inset-0 flex items-center justify-center z-0">
          
          {/* TYPE: PULSE */}
          {aura === 'pulse' && (
            <motion.div
              animate={{ 
                scale: [0.9, 1.3, 0.9], 
                opacity: [0.1, 0.4, 0.1],
                borderWidth: ["1px", "4px", "1px"]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="w-72 h-72 rounded-full border border-dashed blur-md transition-colors duration-500"
              style={{ borderColor: suitColor, backgroundColor: `${suitColor}10` }}
            />
          )}

          {/* TYPE: RING */}
          {aura === 'ring' && (
            <>
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  initial={{ width: "120px", height: "120px", opacity: 0.6, rotateX: 60 }}
                  animate={{ 
                    width: "450px", 
                    height: "450px", 
                    opacity: 0,
                    rotateX: 60 
                  }}
                  transition={{ duration: 4, repeat: Infinity, delay: i * 1.3, ease: "easeOut" }}
                  className="absolute rounded-full border-[3px]"
                  style={{ borderColor: suitColor }}
                />
              ))}
            </>
          )}

          {/* TYPE: GLOW (Static Intense) */}
          {aura === 'glow' && (
            <motion.div
              animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.05, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="w-80 h-80 rounded-full blur-[60px] transition-colors duration-500"
              style={{ backgroundColor: suitColor }}
            />
          )}
        </div>


        {/* --- GYROSCOPIC RINGS (Surrounding Avatar) --- */}
        <div className="absolute inset-0 z-10">
          {/* Ring 1: Large Outer (Slow) */}
          <motion.div
            animate={{ rotate: 360, rotateX: 5, rotateY: 5 }}
            transition={{ duration: 25, ease: "linear", repeat: Infinity }}
            className="absolute inset-[-12%] rounded-full border border-dashed border-white/10 opacity-60 transition-colors duration-500"
            style={{ borderColor: `${suitColor}30`, boxShadow: outerGlow }}
          />
          
          {/* Ring 2: Medium Counter-Rotate (Medium) */}
          <motion.div
            animate={{ rotate: -360, rotateX: -15, rotateY: 10 }}
            transition={{ duration: 18, ease: "linear", repeat: Infinity }}
            className="absolute inset-[2%] rounded-full border border-dotted border-white/20 opacity-70 transition-colors duration-500"
            style={{ borderColor: `${suitColor}50` }}
          />
          
          {/* Ring 3: Small Fast Inner (Fast) */}
          <motion.div
            animate={{ rotate: 360, rotateY: 60 }}
            transition={{ duration: 10, ease: "linear", repeat: Infinity }}
            className="absolute inset-[18%] rounded-full border border-white/30 opacity-50 transition-colors duration-500"
            style={{ borderColor: suitColor }}
          />
        </div>


        {/* --- THE SUIT SILHOUETTE (SVG) --- */}
        <div className="relative z-20 w-52 h-52 md:w-72 md:h-72 filter drop-shadow-2xl">
          <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
            
            {/* Defs for gradients & filters */}
            <defs>
              <linearGradient id="suitGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={suitColor} stopOpacity={0.9 * glowStrength} />
                <stop offset="100%" stopColor={suitColor} stopOpacity={0.05} />
              </linearGradient>
              
              {/* Holographic Scanline Filter */}
              <pattern id="scanPattern" width="4" height="4" patternUnits="userSpaceOnUse">
                <rect width="4" height="1" fill={suitColor} fillOpacity="0.1" />
              </pattern>
            </defs>

            {/* The Suit Body */}
            <motion.path
              d={pathData}
              fill="url(#suitGrad)"
              stroke={suitColor}
              strokeWidth={1.5 + (glowStrength * 2)}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ filter: coreGlow }}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
            
            {/* Internal Texture Overlay */}
            <motion.path
              d={pathData}
              fill="url(#scanPattern)"
              stroke="none"
              opacity="0.3"
            />
            
            {/* Scanning Laser Effect */}
            <motion.rect
              x="-20" y="-10" width="140" height="2"
              fill={suitColor}
              className="opacity-40 blur-[4px]"
              animate={{ y: [0, 110, 0], opacity: [0, 0.6, 0] }}
              transition={{ duration: 4, ease: "linear", repeat: Infinity }}
            />
          </svg>

          {/* Emblem Overlay (Chest) */}
          <div className="absolute top-[22%] left-1/2 -translate-x-1/2 w-16 h-16 flex items-center justify-center">
            <motion.div
              key={emblem} // Triggers pop animation on change
              initial={{ scale: 0, opacity: 0, rotate: -45 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="text-white drop-shadow-xl z-30 relative"
              style={{ 
                color: "#fff", 
                filter: `drop-shadow(0 0 15px ${suitColor}) drop-shadow(0 0 5px ${suitColor})` 
              }}
            >
              <EmblemIcon size={silhouette === 'male' ? 36 : 32} strokeWidth={2.5} />
              
              {/* Emblem Glow Pulse */}
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-white blur-xl rounded-full -z-10"
              />
            </motion.div>
          </div>
        </div>

      </motion.div>

      {/* 3. BASE PROJECTOR (Floor Emitter) */}
      <div className="absolute bottom-16 md:bottom-24 flex flex-col items-center z-0">
        {/* Light Cone */}
        <div 
          className="w-64 h-32 bg-gradient-to-t from-transparent to-transparent opacity-40 blur-2xl pointer-events-none"
          style={{ background: `conic-gradient(from 180deg at 50% 100%, transparent -30deg, ${suitColor}40 0deg, transparent 30deg)` }}
        />
        
        {/* Emitter Disc */}
        <div className="w-40 h-10 rounded-[100%] border border-white/10 bg-black/60 backdrop-blur-xl relative shadow-2xl flex items-center justify-center overflow-hidden">
           
           {/* Internal Mechanics */}
           <div className="w-32 h-5 rounded-[100%] bg-white/5 border border-white/5" />
           <div className="absolute inset-0 rounded-[100%] border-t border-white/20 animate-pulse opacity-60" />
           
           {/* Center Lens */}
           <div className="absolute w-3 h-3 rounded-full bg-white shadow-[0_0_20px_white] z-10" />
           
           {/* Rotating Ring (FIXED: Explicitly set border widths to avoid conflict) */}
           <motion.div 
             animate={{ rotate: 360 }}
             transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
             className="absolute inset-[-5px] border-2 border-transparent border-l-white/20 rounded-full w-full h-full"
           />
        </div>
        
        <div className="mt-3 text-[9px] font-mono text-cyan-500/40 uppercase tracking-[0.4em] flex items-center gap-2">
          <span className="w-1 h-1 bg-cyan-500 rounded-full animate-pulse" />
          Holo-Emitter v9.2
          <span className="w-1 h-1 bg-cyan-500 rounded-full animate-pulse" />
        </div>
      </div>

    </div>
  );
}