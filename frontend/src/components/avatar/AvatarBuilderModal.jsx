// src/components/avatar/AvatarBuilderModal.jsx
import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, RotateCcw, Monitor } from "lucide-react";
import { useAvatarStore } from "../../store/avatarStore";

// --- COMPONENTS ---
import AvatarHologram from "./AvatarHologram";
import AvatarControls from "./AvatarControls";

// --- ANIMATION VARIANTS ---
const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, filter: "blur(10px)" },
  visible: { 
    opacity: 1, 
    scale: 1, 
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: "circOut" }
  },
  exit: { 
    opacity: 0, 
    scale: 1.05, 
    filter: "blur(20px)",
    transition: { duration: 0.3, ease: "easeInOut" }
  }
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { delay: 0.1 } }
};

/**
 * 🌌 AVATAR BUILDER MODAL (THE MORPHIN GRID)
 * Full-screen immersive environment for customizing the Ranger Identity.
 * * Layout Strategy:
 * - Z-Index 0: Background Atmosphere (Grid, Scanlines, Vignette)
 * - Z-Index 10: AvatarHologram (Centered 3D/2D visual)
 * - Z-Index 20: AvatarControls (HUD overlay with Left/Right panels)
 * - Z-Index 30: Footer Actions (Apply/Reset/Close)
 */
export default function AvatarBuilderModal({ isOpen, onClose }) {
  
  // --- STORE CONNECTION ---
  // We subscribe to the specific pieces of state needed for the Hologram
  // and the setters needed for the Controls.
  const { 
    suitColor, emblem, aura, glowStrength, silhouette,
    setSuitColor, setEmblem, setAura, setGlowStrength, setSilhouette,
    applyAvatar, resetAvatar, cancelChanges
  } = useAvatarStore();

  // --- EVENT HANDLERS ---
  
  const handleClose = () => {
    cancelChanges(); // Revert any unsaved drafts
    onClose();
  };

  const handleApply = () => {
    applyAvatar(); // Commit to persistent storage
    onClose();     // Exit the grid
  };

  const handleReset = () => {
    resetAvatar(); // Reset draft to defaults
  };

  // Close on Escape Key
  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && handleClose();
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-black"
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* 1. IMMERSIVE BACKGROUND OVERLAY */}
          <motion.div 
            variants={overlayVariants}
            className="absolute inset-0 pointer-events-none"
          >
            {/* Deep Space Base */}
            <div className="absolute inset-0 bg-[#020617]" />
            
            {/* Tactical Grid (Perspective Floor) */}
            <div 
              className="absolute inset-0 opacity-20" 
              style={{ 
                backgroundImage: 'linear-gradient(rgba(34,211,238,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.2) 1px, transparent 1px)', 
                backgroundSize: '40px 40px',
                transform: 'perspective(500px) rotateX(20deg) scale(1.5)',
                transformOrigin: 'bottom center'
              }} 
            />
            
            {/* Vignette & CRT Scanlines */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000_90%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-10" />
            
            {/* Ambient Reactive Glow (Based on suit color) */}
            <motion.div 
              animate={{ backgroundColor: suitColor }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] blur-[150px] opacity-10 rounded-full transition-colors duration-700"
            />
          </motion.div>

          {/* 2. MODAL CONTAINER (Full Screen) */}
          <motion.div 
            variants={modalVariants}
            className="relative w-full h-full max-w-[1920px] mx-auto flex flex-col md:flex-row items-center justify-center p-4 md:p-8 lg:p-12"
          >
            
            {/* --- HEADER (Mobile Only / Minimal Desktop) --- */}
            <div className="absolute top-6 left-6 md:left-12 z-40 flex items-center gap-3 opacity-80">
              <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md">
                <Monitor size={20} className="text-cyan-400" />
              </div>
              <div>
                <h1 className="text-white font-bold tracking-[0.2em] text-sm uppercase">Morphin Grid</h1>
                <p className="text-[10px] text-cyan-500 font-mono">Identity Configuration Protocol</p>
              </div>
            </div>

            {/* --- CLOSE BUTTON (Top Right) --- */}
            <button 
              onClick={handleClose}
              className="absolute top-6 right-6 md:right-12 z-50 p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-all group"
            >
              <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
            </button>


            {/* --- LAYOUT GRID --- */}
            <div className="w-full h-full flex flex-col md:flex-row relative z-20">
              
              {/* CENTER: THE HOLOGRAM (Absolute centered on desktop to allow controls to float around it) */}
              <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none md:pointer-events-auto">
                 <AvatarHologram 
                   suitColor={suitColor}
                   emblem={emblem}
                   aura={aura}
                   glowStrength={glowStrength}
                   silhouette={silhouette}
                 />
              </div>

              {/* PERIPHERY: THE CONTROLS (Rendered via AvatarControls wrapper) */}
              {/* We pass the state/setters down. The Controls component handles the Left/Right split UI visually. */}
              <div className="relative z-20 w-full h-full pointer-events-none">
                 {/* The Controls component will have pointer-events-auto on its interactive children */}
                 <AvatarControls 
                   avatar={{ suitColor, emblem, aura, glowStrength, silhouette }}
                   setSuitColor={setSuitColor}
                   setEmblem={setEmblem}
                   setAura={setAura}
                   setGlowStrength={setGlowStrength}
                   setSilhouette={setSilhouette}
                 />
              </div>

            </div>

            {/* --- FOOTER ACTIONS (Bottom Center) --- */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 w-full max-w-md px-4">
              
              {/* Reset */}
              <button
                onClick={handleReset}
                className="px-6 py-3 rounded-xl border border-white/10 bg-black/40 text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/30 backdrop-blur-md transition-all flex items-center gap-2"
              >
                <RotateCcw size={16} />
                <span className="text-xs font-bold tracking-widest uppercase">Reset</span>
              </button>

              {/* Apply (Primary) */}
              <button
                onClick={handleApply}
                className="flex-1 h-12 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-black tracking-widest uppercase shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:shadow-[0_0_40px_rgba(34,211,238,0.6)] transition-all flex items-center justify-center gap-2 group"
              >
                <Check size={20} className="stroke-[3px]" />
                <span>Initialize Suit</span>
                <div className="w-1 h-4 bg-black/20 skew-x-[-12deg] group-hover:translate-x-2 transition-transform" />
              </button>

            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}