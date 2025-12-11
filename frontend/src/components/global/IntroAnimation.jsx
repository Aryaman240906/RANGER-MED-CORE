import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck } from "lucide-react"; // Make sure to install lucide-react if not present
import Logo from "./Logo";

/**
 * Cinematic Intro Animation & Identity Verification
 * * PHASE 1: Loading Screen (HUD, Progress Bar, Logo)
 * PHASE 2: CRT Turn-off Exit
 * PHASE 3: Identity Verified Popup (Appears on Landing Page)
 */
export default function IntroAnimation({ onComplete }) {
  const [phase, setPhase] = useState("LOADING"); // Phases: LOADING -> EXITING -> POPUP -> DONE
  const [progress, setProgress] = useState(0);
  
  // Ref to ensure we don't trigger completion multiple times
  const completedRef = useRef(false);

  // --- PHASE 1: LOADING LOGIC ---
  useEffect(() => {
    if (phase !== "LOADING") return;

    const duration = 2500; // Total loading time (ms)
    const startTime = performance.now();

    const animateLoad = (currentTime) => {
      const elapsed = currentTime - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      
      setProgress(newProgress);

      if (elapsed < duration) {
        requestAnimationFrame(animateLoad);
      } else {
        // Loading finished, start exit sequence
        setPhase("EXITING");
      }
    };

    requestAnimationFrame(animateLoad);
  }, [phase]);

  // --- PHASE 2 & 3: TRANSITION LOGIC ---
  useEffect(() => {
    if (phase === "EXITING") {
      // Allow CRT animation to play (600ms), then switch to popup
      const timer = setTimeout(() => {
        setPhase("POPUP");
      }, 800);
      return () => clearTimeout(timer);
    }

    if (phase === "POPUP") {
      // Show "Identity Verified" for 2.5 seconds, then finish completely
      const timer = setTimeout(() => {
        if (!completedRef.current) {
          completedRef.current = true;
          if (onComplete) onComplete(); // This unmounts the component from LandingPage
        }
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [phase, onComplete]);

  return (
    <>
      <AnimatePresence>
        {/* === PHASE 1 & 2: FULL SCREEN LOADER === */}
        {(phase === "LOADING" || phase === "EXITING") && (
          <motion.div
            key="loader"
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050b14] text-cyan-500 overflow-hidden cursor-wait"
            exit={{ 
              scaleY: 0.005, // CRT Collapse Vertical
              scaleX: 0,     // CRT Collapse Horizontal
              opacity: 0,
              filter: "brightness(2)", // Flash
              transition: { duration: 0.6, ease: "easeInOut" }
            }}
          >
            {/* ATMOSPHERE */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#000_90%)] pointer-events-none" />
            <div className="absolute inset-0 opacity-20 pointer-events-none bg-[linear-gradient(rgba(34,211,238,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />
            <div className="absolute inset-0 pointer-events-none opacity-10 bg-[length:100%_4px] bg-[linear-gradient(rgba(0,0,0,0)_50%,rgba(0,0,0,0.5)_50%)]" />

            {/* CENTER CONTENT */}
            <motion.div className="relative z-10 flex flex-col items-center gap-10">
              
              {/* HUD RINGS */}
              <div className="relative flex items-center justify-center w-64 h-64">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                  className="absolute inset-0 rounded-full border border-cyan-500/20 border-dashed"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
                  className="absolute inset-4 rounded-full border-2 border-t-cyan-400/50 border-transparent"
                />
                <div className="relative z-20 p-6 bg-[#050b14]/90 backdrop-blur-md rounded-full border border-cyan-500/30 shadow-[0_0_40px_rgba(34,211,238,0.2)]">
                   <Logo className="w-20 h-20" subtitle={false} />
                </div>
              </div>

              {/* PROGRESS BAR & TEXT */}
              <div className="flex flex-col items-center gap-3 w-72">
                <h1 className="text-2xl font-black tracking-[0.2em] text-white drop-shadow-[0_0_15px_rgba(34,211,238,0.6)]">
                  RANGER MED
                </h1>
                
                <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden relative border border-slate-700">
                  <motion.div 
                    className="h-full bg-cyan-400 shadow-[0_0_15px_#22d3ee]"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="flex justify-between w-full text-[10px] font-mono font-bold tracking-widest text-cyan-400/80">
                  <span className="animate-pulse">
                    {progress < 40 ? "INITIALIZING KERNEL..." : 
                     progress < 80 ? "LOADING TACTICAL MODULES..." : 
                     "SYSTEM READY"}
                  </span>
                  <span>{Math.round(progress)}%</span>
                </div>
              </div>
            </motion.div>

            <div className="absolute bottom-10 text-[10px] text-slate-600 font-mono tracking-[0.3em]">
              BIO-SYNC NEURAL GRID v5.0
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* === PHASE 3: IDENTITY POPUP === */}
      {/* This renders after the big loader is gone, overlaying the Landing Page */}
      <AnimatePresence>
        {phase === "POPUP" && (
          <motion.div 
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 50, opacity: 0, transition: { duration: 0.5 } }}
            className="fixed top-24 right-6 z-50 pointer-events-none"
          >
            <div className="bg-[#0b1221]/90 backdrop-blur-md border-l-4 border-cyan-500 p-4 rounded shadow-[0_0_30px_rgba(0,0,0,0.5)] flex items-center gap-4 max-w-sm">
               <div className="bg-cyan-500/10 p-2 rounded-full">
                 <ShieldCheck size={24} className="text-cyan-400" />
               </div>
               <div>
                  <h3 className="font-bold text-cyan-100 text-sm tracking-wide">IDENTITY VERIFIED</h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    Clearance Level: <span className="text-emerald-400">COMMANDER</span>
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Welcome back, Ranger.
                  </p>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}