// src/components/global/ThemeSwitcher.jsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Activity } from "lucide-react";

/**
 * THEME MODES CONFIGURATION
 * Defines the visual identity for each mode.
 */
const MODES = {
  dark: {
    id: "dark",
    label: "NIGHT OPS",
    icon: Moon,
    color: "text-cyan-400",
    glow: "shadow-cyan-500/20"
  },
  light: {
    id: "light",
    label: "DAY FIELD",
    icon: Sun,
    color: "text-amber-500",
    glow: "shadow-amber-500/20"
  },
  clinical: {
    id: "clinical",
    label: "CLINICAL",
    icon: Activity,
    color: "text-emerald-500",
    glow: "shadow-emerald-500/20"
  }
};

export default function ThemeSwitcher() {
  // Initialize state from localStorage or default to 'dark'
  const [currentMode, setCurrentMode] = useState(
    localStorage.getItem("ranger_theme") || "dark"
  );
  
  const [showLabel, setShowLabel] = useState(false);

  // --- EFFECT: Update DOM & Storage ---
  useEffect(() => {
    const root = document.documentElement;
    
    // Clean up previous classes
    Object.keys(MODES).forEach((key) => root.classList.remove(key));
    
    // Apply new class
    root.classList.add(currentMode);
    
    // Persist
    localStorage.setItem("ranger_theme", currentMode);

    // Show label momentarily
    setShowLabel(true);
    const timer = setTimeout(() => setShowLabel(false), 1500);
    return () => clearTimeout(timer);
  }, [currentMode]);

  // --- HANDLER: Cycle Modes ---
  const toggleTheme = () => {
    setCurrentMode((prev) => {
      if (prev === "dark") return "light";
      if (prev === "light") return "clinical";
      return "dark";
    });
  };

  const ActiveIcon = MODES[currentMode].icon;

  return (
    <div className="fixed top-6 right-6 z-[9999] flex items-center gap-3">
      
      {/* 1. Floating Mode Label (Appears on change) */}
      <AnimatePresence>
        {showLabel && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="px-2 py-1 bg-slate-900/80 backdrop-blur border border-slate-700 rounded text-[10px] font-mono tracking-widest text-slate-300 uppercase shadow-lg"
          >
            {MODES[currentMode].label}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. The Toggle Button */}
      <button
        onClick={toggleTheme}
        className={`
          relative group p-2.5 rounded-xl border backdrop-blur-md transition-all duration-300
          bg-[#050b14]/80 border-slate-700/50 hover:border-slate-500
          ${MODES[currentMode].glow} hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]
        `}
        aria-label="Toggle Theme"
      >
        <div className="relative w-5 h-5 flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentMode}
              initial={{ y: -20, opacity: 0, rotate: -90 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              exit={{ y: 20, opacity: 0, rotate: 90 }}
              transition={{ duration: 0.2 }}
            >
              <ActiveIcon 
                size={20} 
                className={`transition-colors duration-300 ${MODES[currentMode].color}`} 
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Subtle grid background inside button */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMSkiLz48L3N2Zz4=')] opacity-20 pointer-events-none rounded-xl" />
      </button>
    </div>
  );
}