// src/components/ranger/AvatarBuilder.jsx
import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Check, RotateCcw, X, Monitor, ChevronLeft 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

// --- STORES ---
import { useAvatarStore } from "../../store/avatarStore";

// --- SUB-COMPONENTS (From Engineering Bible) ---
import AvatarHologram from "../avatar/AvatarHologram";
import AvatarControls from "../avatar/AvatarControls";

// --- ANIMATION VARIANTS ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.8, ease: "circOut", when: "beforeChildren" }
  },
  exit: { opacity: 0, scale: 1.1, filter: "blur(10px)" }
};

const hudVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, delay: 0.3 } }
};

/**
 * 🛠️ RANGER SUIT CONSTRUCTOR
 * The main orchestration component for the Avatar Builder system.
 * Connects the visual Hologram, the Control HUD, and the Persistence Store.
 */
export default function AvatarBuilder({ onClose }) {
  const navigate = useNavigate();
  
  // --- STORE CONNECTION ---
  const { 
    // State
    suitColor, emblem, aura, glowStrength, silhouette, hasUnsavedChanges,
    // Actions
    setSuitColor, setEmblem, setAura, setGlowStrength, setSilhouette,
    applyAvatar, resetAvatar, cancelChanges, loadFromStorage
  } = useAvatarStore();

  // --- LIFECYCLE ---
  useEffect(() => {
    loadFromStorage(); // Hydrate store from local storage on mount
    
    // Play Intro Sound Effect (Optional placeholder)
    // playSound('morphin_grid_enter');
  }, [loadFromStorage]);

  // --- HANDLERS ---
  const handleSave = () => {
    applyAvatar();
    toast.success("IDENTITY CONFIRMED: Suit Configured", {
      icon: "🛡️",
      style: { background: "#050b14", border: `1px solid ${suitColor}`, color: suitColor }
    });
    if (onClose) onClose();
  };

  const handleExit = () => {
    if (hasUnsavedChanges) {
      if (window.confirm("Abort sequence? Unsaved changes will be lost.")) {
        cancelChanges();
        onClose ? onClose() : navigate(-1);
      }
    } else {
      onClose ? onClose() : navigate(-1);
    }
  };

  return (
    <motion.div 
      className="relative w-full h-full min-h-[600px] flex flex-col overflow-hidden bg-[#020617]"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      
      {/* 1. ATMOSPHERE & GRID */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-20" 
          style={{ 
            backgroundImage: 'linear-gradient(rgba(34,211,238,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.1) 1px, transparent 1px)', 
            backgroundSize: '60px 60px',
            transform: 'perspective(1000px) rotateX(15deg) scale(1.2)'
          }} 
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#020617_90%)]" />
        <div className="absolute inset-0 scanlines opacity-5" />
        
        {/* Reactive Ambient Glow */}
        <motion.div 
          animate={{ backgroundColor: suitColor }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] blur-[120px] opacity-10 rounded-full transition-colors duration-700"
        />
      </div>

      {/* 2. HEADER (Mobile/Desktop) */}
      <div className="absolute top-0 left-0 w-full p-6 z-40 flex justify-between items-start pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto">
          <button 
            onClick={handleExit}
            className="p-2 rounded-full border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            {onClose ? <X size={20} /> : <ChevronLeft size={20} />}
          </button>
          
          <div className="hidden md:block">
            <h1 className="text-white font-bold tracking-[0.2em] text-sm uppercase flex items-center gap-2">
              <Monitor size={14} className="text-cyan-500" />
              Morphin Grid
            </h1>
            <p className="text-[9px] text-cyan-500/60 font-mono">
              Identity Configuration Protocol v5.0
            </p>
          </div>
        </div>

        {/* Unsaved Changes Indicator */}
        <AnimatePresence>
          {hasUnsavedChanges && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="px-3 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-mono font-bold tracking-widest uppercase animate-pulse"
            >
              Unsaved Changes
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3. MAIN WORKSPACE */}
      <div className="relative flex-1 w-full h-full flex flex-col md:flex-row items-center justify-center z-20">
        
        {/* CENTER: THE HOLOGRAM */}
        <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none md:pointer-events-auto">
           <AvatarHologram 
             suitColor={suitColor}
             emblem={emblem}
             aura={aura}
             glowStrength={glowStrength}
             silhouette={silhouette}
           />
        </div>

        {/* PERIPHERY: THE CONTROLS HUD */}
        {/* The controls component handles its own layout (Left/Right split) */}
        <motion.div 
          variants={hudVariants}
          className="w-full h-full z-30 pointer-events-none"
        >
           <AvatarControls 
             avatar={{ suitColor, emblem, aura, glowStrength, silhouette }}
             setSuitColor={setSuitColor}
             setEmblem={setEmblem}
             setAura={setAura}
             setGlowStrength={setGlowStrength}
             setSilhouette={setSilhouette}
           />
        </motion.div>

      </div>

      {/* 4. FOOTER ACTIONS */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 w-full max-w-sm px-6">
        
        <button
          onClick={resetAvatar}
          className="px-4 py-3 rounded-xl border border-white/10 bg-black/60 backdrop-blur-md text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          title="Reset to Default"
        >
          <RotateCcw size={18} />
        </button>

        <button
          onClick={handleSave}
          className="flex-1 h-12 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-black tracking-widest uppercase shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:shadow-[0_0_35px_rgba(34,211,238,0.6)] transition-all flex items-center justify-center gap-2 group"
        >
          <Check size={20} className="stroke-[3px]" />
          <span>Confirm Loadout</span>
          <div className="w-1 h-4 bg-black/20 skew-x-[-12deg] group-hover:translate-x-2 transition-transform" />
        </button>

      </div>

    </motion.div>
  );
}