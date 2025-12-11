// src/components/demo/DemoControlsPanel.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, Pause, RotateCcw, Zap, Activity, 
  Settings, ChevronUp, ChevronDown, Monitor, Download, FileJson 
} from "lucide-react";
import { toast } from "react-hot-toast";

// --- LOGIC ---
import { useDemoStore } from "../../store/demoStore";
import { seedEngine } from "../../services/demoEngine";
import { saveDemoConfig, loadDemoConfig } from "../../services/demoPersistence";

/**
 * 🎛️ DEMO CONTROLS PANEL
 * The primary interface for manipulating the simulation physics.
 * Includes Timeline manipulation, Risk Profile switching, and State Export.
 */
export default function DemoControls() {
  const navigate = useNavigate();
  
  // Store Access
  const { 
    running, speed, scenario, 
    startSimulation, pauseSimulation, resetSimulation, 
    setSpeed, setScenario, exportSnapshot 
  } = useDemoStore();

  const [isExpanded, setIsExpanded] = useState(true);

  // --- PERSISTENCE SYNC ---
  // 1. Hydrate from local storage on mount
  useEffect(() => {
    const saved = loadDemoConfig();
    if (saved) {
      if (saved.speed) setSpeed(saved.speed);
      if (saved.scenario) setScenario(saved.scenario);
    }
  }, [setSpeed, setScenario]);

  // 2. Persist changes to local storage
  useEffect(() => {
    saveDemoConfig({ running, speed, scenario });
  }, [running, speed, scenario]);

  // --- ACTIONS ---

  const handleReset = () => {
    const newSeed = Date.now();
    seedEngine(newSeed); // Re-seed the RNG physics for a fresh timeline
    resetSimulation();   // Clear store history
    toast.success("Physics Engine Reset & Re-Seeded", {
      icon: "🧬",
      style: { background: "#0f172a", color: "#22d3ee", border: "1px solid #22d3ee" }
    });
  };

  const handleExport = () => {
    const json = exportSnapshot();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    // Trigger download
    const a = document.createElement("a");
    a.href = url;
    a.download = `ranger-sim-snapshot-${Date.now()}.json`;
    a.click();
    
    toast.success("Telemetry Snapshot Exported", {
      icon: "💾",
      style: { background: "#0f172a", color: "#facc15", border: "1px solid #facc15" }
    });
  };

  return (
    <div className="w-full max-w-sm mx-auto md:mx-0">
      <motion.div 
        layout
        className="bg-[#0f172a]/95 backdrop-blur-xl border border-amber-500/20 rounded-2xl overflow-hidden shadow-2xl relative"
      >
        {/* Decorative Hazard Stripe */}
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amber-500/50 to-transparent" />

        {/* HEADER */}
        <div 
          className="flex justify-between items-center p-4 cursor-pointer bg-gradient-to-r from-amber-500/10 to-transparent hover:bg-amber-500/5 transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-3">
            <div className={`p-1.5 rounded-lg border ${running ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-amber-500/10 border-amber-500/30 text-amber-400"}`}>
              <Activity size={16} className={running ? "animate-pulse" : ""} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-widest">Physics Engine</h3>
              <p className="text-[9px] font-mono text-slate-400">
                STATUS: {running ? "RUNNING" : "PAUSED"}
              </p>
            </div>
          </div>
          {isExpanded ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
        </div>

        {/* EXPANDABLE BODY */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-4 pb-4 space-y-5"
            >
              
              {/* 1. PLAYBACK SECTOR */}
              <div className="flex items-center gap-3 mt-2">
                {running ? (
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={pauseSimulation}
                    className="flex-1 h-12 rounded-xl bg-amber-500/10 border border-amber-500/40 text-amber-300 font-bold flex items-center justify-center gap-2 hover:bg-amber-500/20 hover:shadow-[0_0_15px_rgba(245,158,11,0.2)] transition-all uppercase tracking-wider text-xs"
                  >
                    <Pause size={16} fill="currentColor" /> Halt System
                  </motion.button>
                ) : (
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={startSimulation}
                    className="flex-1 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 font-bold flex items-center justify-center gap-2 hover:bg-emerald-500/20 hover:shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-all uppercase tracking-wider text-xs"
                  >
                    <Play size={16} fill="currentColor" /> Initiate
                  </motion.button>
                )}

                <motion.button
                  whileTap={{ scale: 0.9, rotate: -45 }}
                  onClick={handleReset}
                  className="w-12 h-12 rounded-xl border border-slate-700 bg-slate-800 text-slate-400 hover:text-white hover:border-slate-500 flex items-center justify-center transition-all shadow-inner"
                  title="Reset Physics & Seed"
                >
                  <RotateCcw size={18} />
                </motion.button>
              </div>

              {/* 2. TEMPORAL SECTOR (Time Dilation) */}
              <div>
                <label className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                  <Zap size={10} /> Time Dilation
                </label>
                <div className="flex bg-black/40 p-1 rounded-lg border border-white/5">
                  {[1, 2, 4].map((val) => (
                    <button
                      key={val}
                      onClick={() => setSpeed(val)}
                      className={`
                        flex-1 py-1.5 rounded-md text-[10px] font-bold transition-all duration-300 relative
                        ${speed === val 
                          ? "text-black bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.4)]" 
                          : "text-slate-500 hover:text-white hover:bg-white/5"
                        }
                      `}
                    >
                      {val}x
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. RISK PROFILE SECTOR */}
              <div>
                <label className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                  <Settings size={10} /> Risk Profile
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['calm', 'normal', 'aggressive', 'unstable'].map((scen) => (
                    <button
                      key={scen}
                      onClick={() => setScenario(scen)}
                      className={`
                        py-2 px-2 rounded-lg border text-[10px] font-bold uppercase transition-all
                        ${scenario === scen
                          ? "border-cyan-500 bg-cyan-500/10 text-cyan-400 shadow-inner"
                          : "border-slate-800 bg-slate-900/50 text-slate-500 hover:border-slate-600 hover:text-slate-300"
                        }
                      `}
                    >
                      {scen}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. I/O SECTOR (Export & Nav) */}
              <div className="pt-4 border-t border-white/5 grid grid-cols-2 gap-2">
                <button
                  onClick={handleExport}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] font-bold text-slate-300 transition-all border border-transparent hover:border-white/10 group"
                >
                  <Download size={14} className="group-hover:text-amber-400 transition-colors" /> 
                  <span>EXPORT [JSON]</span>
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] font-bold text-slate-300 transition-all border border-transparent hover:border-white/10 group"
                >
                   <Monitor size={14} className="group-hover:text-cyan-400 transition-colors" />
                   <span>COMMAND DECK</span>
                </button>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}