// src/components/demo/DemoBanner.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Terminal, X, HelpCircle, AlertTriangle, Radio 
} from "lucide-react";
import { useDemoStore } from "../../store/demoStore";
import DemoExplanationModal from "./DemoExplanationModal";

/**
 * 🚧 DEMO MODE HUD BANNER
 * A persistent status bar indicating that the application is running in Simulation Mode.
 * * Features:
 * - Hazard stripe texture (CSS background)
 * - Live pulse indicator
 * - Quick access to explanation modal
 */
export default function DemoBanner() {
  const { demoMode, toggleDemoMode, scenario, speed } = useDemoStore();
  const [showExplanation, setShowExplanation] = useState(false);

  // Only render if simulation is active
  if (!demoMode) return null;

  return (
    <>
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="fixed top-0 left-0 right-0 z-[100] pointer-events-none flex justify-center pt-2 px-4"
        role="status"
        aria-live="polite"
      >
        <div className="pointer-events-auto relative overflow-hidden bg-[#0f172a] border border-amber-500/40 rounded-full shadow-[0_4px_20px_rgba(245,158,11,0.2)] backdrop-blur-md max-w-xl w-full flex items-center justify-between py-1.5 px-2 pl-4 group">
          
          {/* 1. HAZARD STRIPE TEXTURE */}
          <div 
            className="absolute inset-0 opacity-10 pointer-events-none" 
            style={{ 
              backgroundImage: 'repeating-linear-gradient(45deg, #f59e0b 0, #f59e0b 2px, transparent 0, transparent 8px)',
              backgroundSize: '12px 12px' 
            }} 
          />

          {/* 2. STATUS INDICATOR */}
          <div className="flex items-center gap-3 relative z-10">
            <div className="relative">
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
              <div className="absolute inset-0 bg-amber-500 rounded-full animate-ping opacity-50" />
            </div>
            
            <div className="flex flex-col leading-none">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1">
                <Terminal size={10} />
                SIMULATION ACTIVE
              </span>
              <span className="text-[9px] font-mono text-slate-400">
                SCENARIO: {scenario.toUpperCase()} • {speed}x SPEED
              </span>
            </div>
          </div>

          {/* 3. ACTIONS */}
          <div className="flex items-center gap-1 relative z-10">
            
            {/* Explain Button */}
            <button
              onClick={() => setShowExplanation(true)}
              className="p-1.5 rounded-full hover:bg-amber-500/10 text-slate-400 hover:text-amber-300 transition-colors group/tooltip relative"
              aria-label="What is this?"
            >
              <HelpCircle size={16} />
              {/* Tooltip */}
              <span className="absolute top-full right-0 mt-2 px-2 py-1 bg-black border border-slate-800 rounded text-[9px] text-white opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                What does this mean?
              </span>
            </button>

            <div className="w-[1px] h-4 bg-white/10 mx-1" />

            {/* Close Button */}
            <button
              onClick={toggleDemoMode}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 hover:text-amber-300 border border-amber-500/20 hover:border-amber-500/40 transition-all text-[10px] font-bold uppercase tracking-wider"
            >
              <span>Exit Sim</span>
              <X size={12} />
            </button>
          </div>

        </div>
      </motion.div>

      {/* Explanation Modal (Lazy Loaded Logic handled by component internal state) */}
      <AnimatePresence>
        {showExplanation && (
          <DemoExplanationModal 
            isOpen={showExplanation} 
            onClose={() => setShowExplanation(false)} 
          />
        )}
      </AnimatePresence>
    </>
  );
}