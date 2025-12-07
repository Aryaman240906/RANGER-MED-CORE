// src/components/global/IntroAnimation.jsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "./Logo";

/**
 * Cinematic Intro Animation
 * - Features: Decoupled HUD rings, simulated data loading, CRT exit effect.
 * - Props:
 * - onComplete: callback function
 * - duration: total ms (default 3500)
 */
export default function IntroAnimation({ onComplete, duration = 3500 }) {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // 1. Simulate Loading Progress
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const newProgress = Math.min((elapsed / (duration - 500)) * 100, 100); // Finish slightly before exit
      
      setProgress(newProgress);

      if (elapsed >= duration) {
        clearInterval(interval);
        setVisible(false); // Trigger Exit Animation
        setTimeout(() => {
          if (onComplete) onComplete(); // Unmount after exit anim finishes
        }, 800); // Wait for exit transition
      }
    }, 30);

    return () => clearInterval(interval);
  }, [duration, onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="intro-overlay"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050b14] text-cyan-500 overflow-hidden cursor-wait"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            scaleY: 0.005, // CRT Turn-off effect (collapse vertical)
            scaleX: 0,     // Then collapse horizontal
            filter: "brightness(5)", // Flash of light
            transition: { duration: 0.6, ease: "easeInOut" }
          }}
        >
          {/* --- ATMOSPHERE LAYERS --- */}
          
          {/* 1. Vignette Background */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#000_90%)] pointer-events-none z-0" />

          {/* 2. Tactical Grid */}
          <div 
            className="absolute inset-0 opacity-20 pointer-events-none" 
            style={{ 
              backgroundImage: 'linear-gradient(rgba(34,211,238,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.1) 1px, transparent 1px)', 
              backgroundSize: '50px 50px'
            }}
          />

          {/* 3. Scanlines */}
          <div className="absolute inset-0 pointer-events-none z-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-15" />

          {/* --- CENTRAL CONTENT --- */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "backOut" }}
            className="relative z-10 flex flex-col items-center gap-10"
          >
            {/* LOGO HUD CONTAINER */}
            <div className="relative flex items-center justify-center w-64 h-64">
              
              {/* Spinning Ring 1 (Slow Clockwise) */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
                className="absolute inset-0 rounded-full border border-cyan-500/20 border-dashed"
              />

              {/* Spinning Ring 2 (Fast Counter-Clockwise) */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                className="absolute inset-4 rounded-full border-2 border-t-cyan-400/40 border-r-transparent border-b-cyan-400/40 border-l-transparent"
              />
              
              {/* Static Glow Ring */}
              <div className="absolute inset-8 rounded-full bg-cyan-500/5 blur-xl animate-pulse" />

              {/* THE LOGO (Stationary) */}
              <div className="relative z-20 p-6 bg-[#050b14]/80 backdrop-blur-sm rounded-full border border-cyan-500/30 shadow-[0_0_30px_rgba(34,211,238,0.15)]">
                 {/* Pass large size to Logo via className */}
                 <Logo className="w-20 h-20" subtitle={false} />
              </div>
            </div>

            {/* TEXT & LOADING */}
            <div className="flex flex-col items-center gap-3 w-72">
              <h1 className="text-2xl font-black tracking-[0.2em] text-white drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                RANGER MED
              </h1>
              
              {/* Loading Bar Container */}
              <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden relative border border-slate-700">
                <motion.div 
                  className="h-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Status Text & Percentage */}
              <div className="flex justify-between w-full text-[10px] font-mono font-bold tracking-widest text-cyan-400/80">
                <span>
                  {progress < 40 ? "INITIALIZING..." : 
                   progress < 80 ? "LOADING MODULES..." : 
                   "SYSTEM READY"}
                </span>
                <span>{Math.round(progress)}%</span>
              </div>
            </div>
          </motion.div>

          {/* --- BOTTOM DECORATION --- */}
          <div className="absolute bottom-10 text-[9px] text-slate-500 font-mono tracking-[0.4em] opacity-60">
            SECURE CONNECTION ESTABLISHED
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}