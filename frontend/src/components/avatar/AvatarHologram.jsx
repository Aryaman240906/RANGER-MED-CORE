// src/components/avatar/AvatarHologram.jsx
import React from "react";
import { motion } from "framer-motion";
import { 
  Shield, Zap, Activity, Flame, Skull, Crosshair, User 
} from "lucide-react";

// --- ASSETS: SILHOUETTE PATHS ---
// Stylized vector paths for the Ranger Body Suits
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
  // Calculates opacity and blur based on the slider
  const coreGlow = `drop-shadow(0 0 ${15 * glowStrength}px ${suitColor})`;
  const outerGlow = `0 0 ${40 * glowStrength}px ${suitColor}60`; // Hex opacity 60
  
  return (
    <div className="relative w-full h-[500px] md:h-[600px] flex items-center justify-center pointer-events-none perspective-[1000px]">
      
      {/* 1. ATMOSPHERIC LIGHTING (Based on Suit Color) */}
      <motion.div 
        animate={{ backgroundColor: suitColor }}
        className="absolute inset-0 opacity-10 blur-[100px] transition-colors duration-500"
      />

      {/* 2. THE HOLOGRAM ASSEMBLY (Floats up and down) */}
      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
        className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px] flex items-center justify-center"
      >
        
        {/* --- AURA EFFECTS (Behind Avatar) --- */}
        <div className="absolute inset-0 flex items-center justify-center z-0">
          
          {/* TYPE: PULSE */}
          {aura === 'pulse' && (
            <motion.div
              animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.2, 0.6, 0.2] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-64 h-64 rounded-full blur-2xl transition-colors duration-500"
              style={{ backgroundColor: suitColor }}
            />
          )}

          {/* TYPE: RING */}
          {aura === 'ring' && (
            <>
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  initial={{ width: "100px", height: "100px", opacity: 0.8 }}
                  animate={{ width: "400px", height: "400px", opacity: 0 }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.6 }}
                  className="absolute rounded-full border-2"
                  style={{ borderColor: suitColor }}
                />
              ))}
            </>
          )}

          {/* TYPE: GLOW (Static Intense) */}
          {aura === 'glow' && (
            <motion.div
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="w-72 h-72 rounded-full blur-3xl transition-colors duration-500"
              style={{ backgroundColor: suitColor }}
            />
          )}
        </div>


        {/* --- GYROSCOPIC RINGS (Surrounding Avatar) --- */}
        <div className="absolute inset-0 z-10">
          {/* Ring 1: Large Outer */}
          <motion.div
            animate={{ rotate: 360, rotateX: 10, rotateY: 10 }}
            transition={{ duration: 20, ease: "linear", repeat: Infinity }}
            className="absolute inset-[-10%] rounded-full border border-dashed border-white/20 opacity-50 transition-colors duration-500"
            style={{ borderColor: `${suitColor}40`, boxShadow: outerGlow }}
          />
          
          {/* Ring 2: Medium Counter-Rotate */}
          <motion.div
            animate={{ rotate: -360, rotateX: -20 }}
            transition={{ duration: 15, ease: "linear", repeat: Infinity }}
            className="absolute inset-[5%] rounded-full border border-dotted border-white/30 opacity-60 transition-colors duration-500"
            style={{ borderColor: `${suitColor}60` }}
          />
          
          {/* Ring 3: Small Fast Inner */}
          <motion.div
            animate={{ rotate: 360, rotateY: 45 }}
            transition={{ duration: 8, ease: "linear", repeat: Infinity }}
            className="absolute inset-[20%] rounded-full border border-white/40 opacity-40 transition-colors duration-500"
            style={{ borderColor: suitColor }}
          />
        </div>


        {/* --- THE SUIT SILHOUETTE (SVG) --- */}
        <div className="relative z-20 w-48 h-48 md:w-64 md:h-64 filter drop-shadow-2xl">
          <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
            
            {/* Defs for gradients */}
            <defs>
              <linearGradient id="suitGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={suitColor} stopOpacity={0.8 * glowStrength} />
                <stop offset="100%" stopColor={suitColor} stopOpacity={0.1} />
              </linearGradient>
              <filter id="hologramGlitch">
                <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="1" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
              </filter>
            </defs>

            {/* The Suit Body */}
            <motion.path
              d={pathData}
              fill="url(#suitGrad)"
              stroke={suitColor}
              strokeWidth={1 + (glowStrength * 2)}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ filter: coreGlow }}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
            
            {/* Scanning Line Effect */}
            <motion.rect
              x="0" y="0" width="100" height="2"
              fill={suitColor}
              className="opacity-50 blur-[2px]"
              animate={{ y: [0, 100, 0], opacity: [0, 0.8, 0] }}
              transition={{ duration: 3, ease: "linear", repeat: Infinity }}
            />
          </svg>

          {/* Emblem Overlay (Chest) */}
          <div className="absolute top-[22%] left-1/2 -translate-x-1/2 w-12 h-12 flex items-center justify-center">
            <motion.div
              key={emblem} // Triggers pop animation on change
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="text-white drop-shadow-lg"
              style={{ color: "#fff", filter: `drop-shadow(0 0 10px ${suitColor})` }}
            >
              <EmblemIcon size={silhouette === 'male' ? 32 : 28} strokeWidth={2.5} />
            </motion.div>
          </div>
        </div>

      </motion.div>

      {/* 3. BASE PROJECTOR (Floor Emitter) */}
      <div className="absolute bottom-10 md:bottom-20 flex flex-col items-center">
        {/* Light Cone */}
        <div 
          className="w-48 h-24 bg-gradient-to-t from-transparent to-transparent opacity-30 blur-xl"
          style={{ background: `conic-gradient(from 180deg at 50% 100%, transparent -40deg, ${suitColor}30 0deg, transparent 40deg)` }}
        />
        {/* Emitter Disc */}
        <div className="w-32 h-8 rounded-[100%] border border-white/20 bg-black/50 backdrop-blur-md relative shadow-2xl flex items-center justify-center">
           <div className="w-24 h-4 rounded-[100%] bg-white/10" />
           <div className="absolute inset-0 rounded-[100%] border border-t-white/30 border-b-transparent animate-pulse opacity-50" />
           <div className="absolute w-2 h-2 rounded-full bg-white shadow-[0_0_10px_white]" />
        </div>
        <div className="mt-2 text-[9px] font-mono text-cyan-500/50 uppercase tracking-[0.3em]">
          Holo-Emitter v9.0
        </div>
      </div>

    </div>
  );
}