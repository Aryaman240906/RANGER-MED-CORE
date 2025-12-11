/// src/components/demo/ScenarioSlider.jsx
import React from "react";
import { useDemoStore } from "../../store/demoStore";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Waves, Zap, AlertOctagon } from "lucide-react";

// --- CONFIGURATION ---
const SCENARIOS = [
  { 
    id: "calm", 
    label: "CALM", 
    icon: Waves,
    color: "text-emerald-400", 
    bg: "bg-emerald-500", 
    border: "border-emerald-500",
    stats: { volatility: "5%", events: "Low", bias: "+5%" }
  },
  { 
    id: "normal", 
    label: "NORMAL", 
    icon: Activity,
    color: "text-cyan-400", 
    bg: "bg-cyan-500", 
    border: "border-cyan-500",
    stats: { volatility: "20%", events: "Med", bias: "0%" }
  },
  { 
    id: "aggressive", 
    label: "AGGRESSIVE", 
    icon: Zap,
    color: "text-amber-400", 
    bg: "bg-amber-500", 
    border: "border-amber-500",
    stats: { volatility: "65%", events: "High", bias: "-15%" }
  },
  { 
    id: "unstable", 
    label: "UNSTABLE", 
    icon: AlertOctagon,
    color: "text-red-500", 
    bg: "bg-red-500", 
    border: "border-red-500",
    stats: { volatility: "100%", events: "Crit", bias: "-40%" }
  },
];

export default function ScenarioSlider() {
  const { scenario, setScenario } = useDemoStore();
  const activeConfig = SCENARIOS.find(s => s.id === scenario) || SCENARIOS[1];

  return (
    <div className="w-full bg-slate-900/60 border border-white/10 rounded-xl p-4 backdrop-blur-md relative overflow-hidden group">
      
      {/* 1. HEADER */}
      <div className="flex justify-between items-center mb-3 relative z-10">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          Simulation Profile
        </span>
        <div className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-black/40 border border-white/10 ${activeConfig.color}`}>
          {activeConfig.label} PROTOCOL
        </div>
      </div>

      {/* 2. SLIDER TRACK */}
      <div className="relative flex p-1 bg-black/40 rounded-lg border border-white/5 z-10">
        {SCENARIOS.map((scen) => {
          const isActive = scenario === scen.id;
          const Icon = scen.icon;

          return (
            <button
              key={scen.id}
              onClick={() => setScenario(scen.id)}
              className={`
                relative flex-1 py-2 flex flex-col items-center gap-1 z-10 outline-none transition-all duration-300
                ${isActive ? "text-white" : "text-slate-500 hover:text-slate-300"}
              `}
            >
              {/* Active Slide Background */}
              {isActive && (
                <motion.div
                  layoutId="active-scenario-bg"
                  className={`absolute inset-0 rounded-md border ${scen.border} ${scen.bg} bg-opacity-20 shadow-[0_0_15px_rgba(0,0,0,0.3)]`}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-50 rounded-md`} />
                </motion.div>
              )}

              {/* Icon & Label */}
              <div className="relative z-20 flex flex-col items-center">
                <Icon size={14} className={`mb-1 ${isActive ? "drop-shadow-md" : ""}`} />
                <span className="text-[8px] font-bold uppercase tracking-wider">{scen.label}</span>
              </div>

              {/* Active Pulse Dot (Only for active item) */}
              {isActive && (
                <motion.div 
                  layoutId="active-dot"
                  className={`absolute -bottom-1 w-8 h-1 rounded-t-full ${scen.bg} blur-[2px]`}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* 3. PHYSICS READOUT (Dynamic Footer) */}
      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-white/5 pt-3 relative z-10">
        <StatItem label="Volatility" value={activeConfig.stats.volatility} color={activeConfig.color} />
        <StatItem label="Event Rate" value={activeConfig.stats.events} color={activeConfig.color} />
        <StatItem label="Stability Drift" value={activeConfig.stats.bias} color={activeConfig.color} />
      </div>

      {/* Background Ambience (Glow based on selection) */}
      <div 
        className={`absolute -bottom-10 -right-10 w-32 h-32 blur-[60px] opacity-10 transition-colors duration-700 pointer-events-none z-0 ${activeConfig.bg}`} 
      />
    </div>
  );
}

// Helper for Footer Stats
const StatItem = ({ label, value, color }) => (
  <div className="flex flex-col items-center">
    <span className="text-[8px] text-slate-500 uppercase tracking-wider font-bold mb-0.5">{label}</span>
    <AnimatePresence mode="wait">
      <motion.span
        key={value}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -5 }}
        className={`text-xs font-mono font-bold ${color}`}
      >
        {value}
      </motion.span>
    </AnimatePresence>
  </div>
);