// src/components/global/IntroAnimation.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Fingerprint, Cpu, CheckCircle } from "lucide-react";

export default function IntroAnimation({ onComplete }) {
  const [step, setStep] = useState(0);

  // Orchestrate the animation timeline
  useEffect(() => {
    const timeouts = [
      setTimeout(() => setStep(1), 800),  // Start Bioscan
      setTimeout(() => setStep(2), 2200), // Access Granted
      setTimeout(() => setStep(3), 3200), // Exit
      setTimeout(() => onComplete && onComplete(), 3800) // Cleanup
    ];
    return () => timeouts.forEach((t) => clearTimeout(t));
  }, [onComplete]);

  return (
    <AnimatePresence>
      {step < 3 && (
        <motion.div
          key="intro-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] bg-slate-950 flex flex-col items-center justify-center overflow-hidden cursor-wait"
        >
          {/* 🌌 BACKGROUND GRID */}
          <div 
            className="absolute inset-0 opacity-20" 
            style={{ 
              backgroundImage: 'radial-gradient(circle, #22d3ee 1px, transparent 1px)', 
              backgroundSize: '30px 30px' 
            }}
          />

          {/* 🛡️ CENTRAL HOLOGRAM */}
          <div className="relative mb-12">
            {/* Spinning Rings */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
              className="absolute inset-[-40px] border border-cyan-500/20 rounded-full border-dashed"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
              className="absolute inset-[-25px] border border-cyan-400/30 rounded-full"
            />

            {/* Icon Morphing */}
            <div className="relative z-10 w-24 h-24 flex items-center justify-center bg-slate-900 rounded-full border border-cyan-500/50 shadow-[0_0_50px_rgba(34,211,238,0.3)]">
              <AnimatePresence mode="wait">
                {step === 0 && (
                  <motion.div
                    key="cpu"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                  >
                    <Cpu size={40} className="text-cyan-400" />
                  </motion.div>
                )}
                {step === 1 && (
                  <motion.div
                    key="bio"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                  >
                    <Fingerprint size={40} className="text-cyan-400 animate-pulse" />
                  </motion.div>
                )}
                {step === 2 && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                  >
                    <ShieldCheck size={48} className="text-emerald-400" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* 📝 STATUS TEXT */}
          <div className="text-center space-y-2 h-16 relative z-10">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-cyan-400 font-mono text-sm tracking-[0.2em] uppercase font-bold"
            >
              {step === 0 && "Initializing Core Systems..."}
              {step === 1 && "Verifying Ranger Biometrics..."}
              {step === 2 && <span className="text-emerald-400">Identity Confirmed. Welcome.</span>}
            </motion.div>

            {/* Loading Bar */}
            <div className="w-64 h-1 bg-slate-800 rounded-full overflow-hidden mx-auto mt-4 relative">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: step >= 2 ? "100%" : step === 1 ? "70%" : "30%" }}
                transition={{ duration: 0.5 }}
                className={`h-full ${step === 2 ? "bg-emerald-500" : "bg-cyan-500"} shadow-[0_0_10px_currentColor]`}
              />
            </div>
          </div>

          {/* 💾 FOOTER DECORATION */}
          <div className="absolute bottom-10 text-[10px] text-slate-600 font-mono tracking-widest uppercase">
            Ranger Med-Core v5.0.1 // Secure Connection
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}