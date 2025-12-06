// src/components/demo/ScenarioSlider.jsx
import React from "react";
import { useDemoStore } from "../../store/demoStore";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const SCENARIOS = [
  { 
    key: "calm", 
    label: "CALM", 
    color: "text-emerald-300", 
    glow: "bg-emerald-500/20", 
    border: "border-emerald-500/50",
    desc: "Drift: Low • Healing Active"
  },
  { 
    key: "normal", 
    label: "NORMAL", 
    color: "text-cyan-300", 
    glow: "bg-cyan-500/20", 
    border: "border-cyan-500/50",
    desc: "Drift: Nominal • Standard Ops"
  },
  { 
    key: "aggressive", 
    label: "AGGRESSIVE", 
    color: "text-amber-300", 
    glow: "bg-amber-500/20", 
    border: "border-amber-500/50",
    desc: "Drift: High • Stress Rising"
  },
  { 
    key: "unstable", 
    label: "UNSTABLE", 
    color: "text-red-400", 
    glow: "bg-red-600/20", 
    border: "border-red-500/60",
    desc: "⚠ WARNING: Critical Volatility"
  },
];

export default function ScenarioSlider() {
  const scenario = useDemoStore((s) => s.scenario);
  const setScenario = useDemoStore((s) => s.setScenario);

  // Find active config for dynamic styling
  const activeConfig = SCENARIOS.find(s => s.key === scenario) || SCENARIOS[1];

  return (
    <div className="w-full p-4 rounded-xl bg-slate-900/80 border border-slate-700/50 backdrop-blur-md shadow-lg">
      <div className="flex justify-between items-center mb-3">
        <div className="text-[10px] text-slate-400 font-mono tracking-[0.2em] uppercase">
          Simulation Parameters
        </div>
        {/* Dynamic Description Fade In/Out */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeConfig.key}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className={twMerge("text-[10px] font-mono font-bold uppercase", activeConfig.color)}
          >
            {activeConfig.desc}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="relative flex p-1 bg-slate-950/80 rounded-lg border border-slate-800">
        {SCENARIOS.map((opt) => {
          const isActive = scenario === opt.key;

          return (
            <button
              key={opt.key}
              onClick={() => setScenario(opt.key)}
              className="relative flex-1 py-2 text-center text-xs font-bold uppercase tracking-wider z-10 outline-none"
            >
              {/* Foreground Text */}
              <span
                className={clsx(
                  "transition-colors duration-300 relative z-20",
                  isActive ? opt.color : "text-slate-500 hover:text-slate-300"
                )}
              >
                {opt.label}
              </span>

              {/* SLIDING BACKGROUND (The "Glass" Effect) */}
              {isActive && (
                <motion.div
                  layoutId="active-scenario-pill"
                  className={twMerge(
                    "absolute inset-0 rounded-md border shadow-[0_0_15px_rgba(0,0,0,0.3)] z-10",
                    opt.glow,
                    opt.border
                  )}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}