// src/components/ranger/StabilityGauge.jsx
import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Activity, Minus, ShieldCheck, AlertTriangle } from "lucide-react";

const StabilityGauge = ({ value = 0, trend = "Stable" }) => {
  // --- CONFIGURATION ---
  const radius = 70; // Increased slightly for detail space
  const strokeWidth = 6;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  // --- TACTICAL COLOR LOGIC ---
  const statusConfig = useMemo(() => {
    if (value >= 80) return { 
      id: "stable",
      colors: ["#22d3ee", "#0ea5e9"], // Cyan to Blue
      text: "text-cyan-400", 
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/30",
      shadow: "shadow-[0_0_20px_rgba(34,211,238,0.2)]",
      Icon: ShieldCheck
    };
    if (value >= 50) return { 
      id: "caution",
      colors: ["#facc15", "#eab308"], // Yellow to Gold
      text: "text-yellow-400", 
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/30",
      shadow: "shadow-[0_0_20px_rgba(250,204,21,0.2)]",
      Icon: Activity
    };
    return { 
      id: "critical",
      colors: ["#ef4444", "#b91c1c"], // Red to Dark Red
      text: "text-red-500", 
      bg: "bg-red-500/10",
      border: "border-red-500/50",
      shadow: "shadow-[0_0_30px_rgba(239,68,68,0.4)]",
      Icon: AlertTriangle
    };
  }, [value]);

  return (
    <div className={`relative group flex flex-col items-center justify-center p-6 rounded-2xl overflow-hidden backdrop-blur-xl border transition-colors duration-500 h-full min-h-[260px] ${statusConfig.bg} ${statusConfig.border}`}>
      
      {/* 1. ATMOSPHERE */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
      <div className="absolute inset-0 scanlines opacity-10 pointer-events-none" />

      {/* 2. REACTIVE CORNERS (HUD Effect) */}
      <div className={`absolute top-0 left-0 w-4 h-4 border-t border-l rounded-tl-lg transition-colors duration-300 ${statusConfig.text.replace('text-', 'border-')} opacity-60`} />
      <div className={`absolute bottom-0 right-0 w-4 h-4 border-b border-r rounded-br-lg transition-colors duration-300 ${statusConfig.text.replace('text-', 'border-')} opacity-60`} />

      {/* 3. HEADER LABEL */}
      <div className="absolute top-4 left-5 flex items-center justify-between w-[calc(100%-40px)]">
        <div className="flex items-center gap-2">
          <statusConfig.Icon size={14} className={statusConfig.text} />
          <span className={`text-[10px] font-mono uppercase tracking-[0.2em] font-bold ${statusConfig.text} opacity-80`}>
            NEURAL STABILITY
          </span>
        </div>
        {/* Blinking Status Dot */}
        <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${statusConfig.text.replace('text-', 'bg-')}`} />
      </div>

      {/* 4. GAUGE ASSEMBLY */}
      <div className="relative flex items-center justify-center mt-6">
        
        {/* A. Rotating Mechanical Rings */}
        <div className="absolute inset-[-15px] border border-dashed border-slate-700/50 rounded-full animate-[spin_20s_linear_infinite] opacity-40" />
        <div className={`absolute inset-[-5px] border border-dotted rounded-full animate-[spin_10s_linear_infinite_reverse] opacity-30 ${statusConfig.text.replace('text-', 'border-')}`} />

        {/* B. SVG Gauge */}
        <svg
          height={radius * 2}
          width={radius * 2}
          className="transform -rotate-90 overflow-visible"
        >
          {/* Gradient Definition */}
          <defs>
            <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={statusConfig.colors[0]} />
              <stop offset="100%" stopColor={statusConfig.colors[1]} />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Track Background */}
          <circle
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            fill="transparent"
          />

          {/* Value Arc */}
          <motion.circle
            stroke="url(#gaugeGrad)"
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference + " " + circumference}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            filter="url(#glow)"
          />
          
          {/* Decorative Ticks */}
          {[...Array(12)].map((_, i) => (
             <line 
               key={i}
               x1={radius + (normalizedRadius - 10) * Math.cos(i * 30 * (Math.PI/180))}
               y1={radius + (normalizedRadius - 10) * Math.sin(i * 30 * (Math.PI/180))}
               x2={radius + (normalizedRadius - 16) * Math.cos(i * 30 * (Math.PI/180))}
               y2={radius + (normalizedRadius - 16) * Math.sin(i * 30 * (Math.PI/180))}
               stroke={i < (value / 100) * 12 ? statusConfig.colors[0] : "rgba(255,255,255,0.1)"}
               strokeWidth="2"
             />
          ))}
        </svg>
        
        {/* C. Center Data */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          <motion.div
            key={value}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`text-5xl font-bold font-mono tracking-tighter drop-shadow-lg ${statusConfig.text}`}
          >
            {Math.round(value)}<span className="text-xl align-top opacity-50">%</span>
          </motion.div>

          {/* Tactical Trend Pill */}
          <div className="flex items-center gap-2 mt-2 px-3 py-1 rounded bg-[#050b14]/60 border border-slate-700/50 backdrop-blur-md">
            {trend === "Improving" && <TrendingUp size={12} className="text-emerald-400" />}
            {trend === "Declining" && <TrendingDown size={12} className="text-red-400" />}
            {trend === "Stable" && <Minus size={12} className="text-slate-400" />}
            
            <span className="text-[10px] uppercase font-bold text-slate-300 tracking-wider">
              {trend}
            </span>
          </div>
        </div>
      </div>
      
      {/* 5. CRITICAL OVERLAY (Flashes red if low stability) */}
      {value < 50 && (
         <div className="absolute inset-0 bg-red-500/5 animate-pulse pointer-events-none rounded-2xl" />
      )}
    </div>
  );
};

export default StabilityGauge;