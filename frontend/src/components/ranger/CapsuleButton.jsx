// src/components/ranger/CapsuleButton.jsx
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pill, Check, Zap, Timer } from 'lucide-react';
import { toast } from 'react-hot-toast';

// --- HOOKS & SERVICES ---
import { useDoseActions } from '../../hooks/useDataActions'; // 👈 Section C Hook
import { triggerPop } from '../../services/confetti'; // Direct visual feedback

/**
 * 💊 CAPSULE REACTOR BUTTON
 * The primary interaction point for logging doses.
 * Acts as a "Physical" button with haptic-like visual feedback.
 */
export default function CapsuleButton() {
  // 1. Connect to Central Data Store
  const { takeDose, lastDose, streak } = useDoseActions();
  
  // 2. UI State (Visuals only, data is in store)
  const [isActivating, setIsActivating] = useState(false);

  // 3. Derived Display Data
  const timeSinceDose = useMemo(() => {
    if (!lastDose) return null;
    const diff = Date.now() - new Date(lastDose.timestamp).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${mins}m ago`;
  }, [lastDose]);

  // --- HANDLER ---
  const handlePress = () => {
    if (isActivating) return;

    setIsActivating(true);
    triggerPop(); // Particle burst at cursor

    // Execute Logic (Store handles metrics/history)
    takeDose({ 
      capsuleType: "standard",
      doseAmount: 1.0,
      source: "quick-action" 
    });

    // Feedback
    toast.success(
      <div className="flex flex-col">
        <span className="font-bold text-xs uppercase tracking-widest">Protocol Initiated</span>
        <span className="text-[10px] opacity-80 font-mono">Bio-availability increasing...</span>
      </div>, 
      { icon: "💊" }
    );

    // Reset visual state after animation
    setTimeout(() => setIsActivating(false), 2500);
  };

  return (
    <div className="h-full w-full bg-slate-900/60 border border-slate-700/50 backdrop-blur-xl rounded-2xl p-6 relative overflow-hidden flex flex-col items-center justify-between shadow-lg group">
      
      {/* 1. ATMOSPHERE */}
      <div className="absolute inset-0 scanlines opacity-5 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-transparent opacity-50" />

      {/* 2. HUD HEADER */}
      <div className="w-full flex justify-between items-start z-10">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
            <Zap size={14} className="text-cyan-400 fill-cyan-400" />
            Intake Core
          </h3>
          <p className="text-[10px] text-slate-500 font-mono mt-1">
            Standard Protocol
          </p>
        </div>
        
        {/* Streak Counter */}
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1">
            <span className="text-xl font-bold font-mono text-cyan-400 leading-none">{streak}</span>
            <span className="text-[9px] text-slate-500 uppercase font-bold mt-1">Streak</span>
          </div>
        </div>
      </div>

      {/* 3. THE REACTOR BUTTON */}
      <div className="relative z-20 my-4">
        {/* Outer Rotating Ring */}
        <motion.div
          animate={{ rotate: isActivating ? 360 : 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className={`absolute inset-[-15px] rounded-full border border-dashed border-cyan-500/30 ${isActivating ? 'opacity-100' : 'opacity-30'}`}
        />
        
        <motion.button
          onClick={handlePress}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={isActivating}
          className={`
            relative w-28 h-28 rounded-full flex items-center justify-center border-4 shadow-[0_0_40px_rgba(0,0,0,0.5)] transition-all duration-500
            ${isActivating 
              ? "bg-emerald-500/20 border-emerald-400 shadow-[0_0_50px_rgba(16,185,129,0.4)]" 
              : "bg-[#050b14] border-cyan-500/50 hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(34,211,238,0.3)]"
            }
          `}
        >
          {/* Inner Core Gradient */}
          <div className={`absolute inset-2 rounded-full opacity-30 ${isActivating ? 'bg-emerald-500' : 'bg-cyan-500'}`} />
          
          <AnimatePresence mode="wait">
            {isActivating ? (
              <motion.div
                key="success"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
              >
                <Check size={40} className="text-emerald-400 drop-shadow-lg" strokeWidth={3} />
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="flex flex-col items-center gap-1"
              >
                <Pill size={32} className="text-cyan-400 drop-shadow-lg" />
                <span className="text-[9px] font-bold text-cyan-200 uppercase tracking-widest mt-1">LOG</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pulse Ripple */}
          {!isActivating && (
            <div className="absolute inset-0 rounded-full border border-cyan-400/30 animate-ping opacity-20" />
          )}
        </motion.button>
      </div>

      {/* 4. FOOTER STATUS */}
      <div className="w-full flex justify-center items-center gap-2 z-10">
        <div className={`px-3 py-1 rounded-full border flex items-center gap-2 backdrop-blur-md ${
          isActivating 
            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
            : "bg-slate-950/50 border-slate-700 text-slate-400"
        }`}>
          {isActivating ? (
            <>
              <Check size={12} strokeWidth={3} />
              <span className="text-[10px] font-bold uppercase tracking-wide">Recorded</span>
            </>
          ) : (
            <>
              <Timer size={12} />
              <span className="text-[10px] font-mono uppercase tracking-wide">
                {lastDose ? `Last: ${timeSinceDose}` : "Ready"}
              </span>
            </>
          )}
        </div>
      </div>

    </div>
  );
};