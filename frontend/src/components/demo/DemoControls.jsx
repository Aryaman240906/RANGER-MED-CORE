// src/components/demo/DemoControls.jsx
import React from "react";
import { useDemoStore } from "../../store/demoStore";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, Zap, Activity } from "lucide-react";

export default function DemoControls() {
  // Selectors aligned with the Powered-Up demoStore.js
  const running = useDemoStore((s) => s.running);
  const speed = useDemoStore((s) => s.speed);
  const startSimulation = useDemoStore((s) => s.startSimulation);
  const pauseSimulation = useDemoStore((s) => s.pauseSimulation);
  const resetSimulation = useDemoStore((s) => s.resetSimulation);
  const setSpeed = useDemoStore((s) => s.setSpeed);

  return (
    <div className="w-full p-5 bg-slate-900/80 border border-slate-700/50 rounded-xl backdrop-blur-md shadow-lg relative overflow-hidden group">
      
      {/* BACKGROUND DECORATION (Subtle Grid) */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(circle, #22d3ee 1px, transparent 1px)', backgroundSize: '16px 16px' }}
      />

      {/* HEADER & STATUS READOUT */}
      <div className="flex justify-between items-center mb-4 relative z-10">
        <div className="text-[10px] text-cyan-400 font-mono tracking-[0.2em] uppercase flex items-center gap-2">
          <Activity size={12} className={running ? "animate-pulse" : "opacity-50"} />
          Engine Control
        </div>
        <div className={`text-[10px] font-mono font-bold uppercase transition-colors duration-300 ${running ? "text-green-400" : "text-slate-500"}`}>
          {running ? `Running • ${speed}X` : "System Paused"}
        </div>
      </div>

      {/* MAIN PLAYBACK CONTROLS */}
      <div className="flex items-center gap-3 mb-4 relative z-10">
        <AnimatePresence mode="wait">
          {running ? (
            <motion.button
              key="pause"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileTap={{ scale: 0.95 }}
              onClick={pauseSimulation}
              className="flex-1 py-3 rounded-lg bg-amber-500/10 border border-amber-500/40 text-amber-300 font-bold flex items-center justify-center gap-2 hover:bg-amber-500/20 hover:shadow-[0_0_15px_rgba(245,158,11,0.2)] transition-all"
            >
              <Pause size={18} fill="currentColor" />
              <span>HALT</span>
            </motion.button>
          ) : (
            <motion.button
              key="play"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileTap={{ scale: 0.95 }}
              onClick={startSimulation}
              className="flex-1 py-3 rounded-lg bg-cyan-500/20 border border-cyan-400 text-cyan-300 font-bold flex items-center justify-center gap-2 hover:bg-cyan-500/30 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all"
            >
              <Play size={18} fill="currentColor" />
              <span>ENGAGE</span>
            </motion.button>
          )}
        </AnimatePresence>

        {/* RESET BUTTON */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ rotate: 90 }}
          onClick={resetSimulation}
          className="p-3 rounded-lg bg-slate-800 border border-slate-600 text-slate-400 hover:text-white hover:border-slate-400 hover:bg-slate-700 transition-all"
          title="Reset Simulation"
        >
          <RotateCcw size={18} />
        </motion.button>
      </div>

      {/* SPEED SELECTOR (Segmented Control) */}
      <div className="relative z-10 bg-slate-950/50 p-1 rounded-lg border border-slate-800 flex gap-1">
        {[1, 2, 4].map((val) => {
          const isActive = speed === val;
          return (
            <button
              key={val}
              onClick={() => setSpeed(val)}
              className={`flex-1 relative py-1.5 rounded-md flex items-center justify-center gap-1.5 text-xs font-bold transition-all duration-300
                ${isActive 
                  ? "text-cyan-950 bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.4)]" 
                  : "text-slate-500 hover:text-slate-300 hover:bg-slate-800"
                }
              `}
            >
              <Zap size={12} className={isActive ? "fill-cyan-950" : ""} />
              {val}x
            </button>
          );
        })}
      </div>

    </div>
  );
}