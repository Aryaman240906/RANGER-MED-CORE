// src/components/ranger/StabilityGauge.jsx
import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Activity, Minus } from "lucide-react";

const StabilityGauge = ({ value = 0, trend = "Stable" }) => {
  // --- CONFIGURATION ---
  const radius = 65; // Slightly adjusted size to fit HUD elements
  const strokeWidth = 8;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  // --- DYNAMIC COLOR LOGIC (Ranger Palette) ---
  const statusConfig = useMemo(() => {
    if (value >= 80) return { color: "#22d3ee", text: "text-cyan-400", glow: "drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]" }; // Stable
    if (value >= 50) return { color: "#facc15", text: "text-yellow-400", glow: "drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]" }; // Caution
    return { color: "#ef4444", text: "text-red-500", glow: "drop-shadow-[0_0_15px_rgba(239,68,68,0.6)]" }; // Critical
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative flex flex-col items-center justify-center p-6 bg-slate-900/60 border border-slate-700/50 rounded-2xl backdrop-blur-md overflow-hidden h-full min-h-[240px]"
    >
      
      {/* 🛡️ HUD DECORATIONS (Corners) */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-cyan-500/50 rounded-tl-lg m-2" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-cyan-500/50 rounded-tr-lg m-2" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-cyan-500/50 rounded-bl-lg m-2" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-cyan-500/50 rounded-br-lg m-2" />

      {/* HEADER LABEL */}
      <div className="absolute top-4 left-6 flex items-center gap-2">
        <Activity size={14} className={statusConfig.text} />
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400 font-bold">
          Neural Stability
        </span>
      </div>

      {/* 🌀 GAUGE CONTAINER */}
      <div className="relative flex items-center justify-center mt-4">
        
        {/* Background Rotating Ring (Sci-Fi Effect) */}
        <div className="absolute inset-[-12px] border border-slate-800 rounded-full opacity-40" />
        <div className="absolute inset-[-4px] border border-dashed border-slate-700 rounded-full animate-[spin_12s_linear_infinite] opacity-30" />

        <svg
          height={radius * 2}
          width={radius * 2}
          className="transform -rotate-90 overflow-visible"
        >
          {/* Static Background Track */}
          <circle
            stroke="rgba(30, 41, 59, 0.5)"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            fill="transparent"
          />
          
          {/* Animated Progress Ring */}
          <motion.circle
            stroke={statusConfig.color}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference + " " + circumference}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.6, ease: "easeOut" }} // Fast smooth tween
            className={statusConfig.glow}
          />
        </svg>
        
        {/* 🔢 CENTER CONTENT */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            key={value} // Micro-animation on value change
            initial={{ scale: 0.95, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`text-4xl font-bold font-mono tracking-tighter ${statusConfig.text}`}
          >
            {Math.round(value)}%
          </motion.div>

          {/* TREND PILL */}
          <div className="flex items-center gap-1 mt-2 px-3 py-1 rounded-full bg-slate-950/80 border border-slate-800">
            {trend === "Improving" && <TrendingUp size={12} className="text-emerald-400" />}
            {trend === "Declining" && <TrendingDown size={12} className="text-red-400" />}
            {trend === "Stable" && <Minus size={12} className="text-slate-400" />}
            
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wide">
              {trend}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StabilityGauge;