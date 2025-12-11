// src/components/ranger/ReadinessBar.jsx
import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, AlertTriangle, CheckCircle, BatteryCharging, HelpCircle } from "lucide-react";

// --- COMPONENTS ---
import DemoExplanationModal from "../demo/DemoExplanationModal";

const ReadinessBar = ({ value = 0 }) => {
  const [showExplanation, setShowExplanation] = useState(false);

  // CONFIG: 24 segments for a denser "high-tech" look
  const totalSegments = 24;
  const activeSegments = Math.round((value / 100) * totalSegments);

  // 🎨 TACTICAL STATUS CONFIGURATION
  const statusConfig = useMemo(() => {
    if (value >= 80) return { 
      label: "COMBAT READY", 
      id: "ready",
      color: "#22d3ee", // Cyan
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/30",
      shadow: "shadow-[0_0_15px_rgba(34,211,238,0.3)]",
      barGlow: "shadow-[0_0_8px_#22d3ee]",
      text: "text-cyan-400",
      Icon: CheckCircle
    };
    if (value >= 50) return { 
      label: "CAUTION", 
      id: "caution",
      color: "#facc15", // Yellow
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/30",
      shadow: "shadow-[0_0_15px_rgba(250,204,21,0.3)]",
      barGlow: "shadow-[0_0_8px_#facc15]",
      text: "text-yellow-400",
      Icon: AlertTriangle
    };
    return { 
      label: "CRITICAL", 
      id: "critical",
      color: "#ef4444", // Red
      bg: "bg-red-500/10",
      border: "border-red-500/50",
      shadow: "shadow-[0_0_20px_rgba(239,68,68,0.5)]",
      barGlow: "shadow-[0_0_10px_#ef4444]",
      text: "text-red-500",
      Icon: Zap
    };
  }, [value]);

  const StatusIcon = statusConfig.Icon;

  return (
    <>
      <div 
        className={`relative group w-full p-6 rounded-2xl backdrop-blur-xl border transition-all duration-500 h-full flex flex-col justify-center overflow-hidden ${statusConfig.bg} ${statusConfig.border}`}
        data-tour="readiness-bar" // 👈 Tutorial Target
      >
        
        {/* 1. ATMOSPHERE */}
        <div className="absolute inset-0 scanlines opacity-10 pointer-events-none" />
        <div className={`absolute -right-10 -bottom-10 w-32 h-32 blur-[60px] rounded-full opacity-20 transition-colors duration-500 ${statusConfig.text.replace('text-', 'bg-')}`} />

        {/* 2. HUD BRACKETS */}
        <div className={`absolute top-0 right-0 w-3 h-3 border-t border-r rounded-tr-sm transition-colors duration-300 ${statusConfig.text.replace('text-', 'border-')} opacity-50`} />
        <div className={`absolute bottom-0 left-0 w-3 h-3 border-b border-l rounded-bl-sm transition-colors duration-300 ${statusConfig.text.replace('text-', 'border-')} opacity-50`} />

        {/* 3. HEADER */}
        <div className="relative z-10 flex justify-between items-end mb-3">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <StatusIcon size={14} className={statusConfig.text} />
              <span className={`text-[10px] font-mono uppercase tracking-[0.2em] font-bold ${statusConfig.text} opacity-90`}>
                Mission Readiness
              </span>
              
              {/* Contextual Help Trigger */}
              <button
                onClick={() => setShowExplanation(true)}
                className="text-slate-500 hover:text-white transition-colors p-0.5 ml-1"
                aria-label="What is Readiness?"
              >
                <HelpCircle size={12} />
              </button>
            </div>
            
            <div className={`text-[9px] font-mono text-slate-500 tracking-wide uppercase`}>
              Output Voltage: <span className="text-slate-300">{(value * 0.12).toFixed(1)}kV</span>
            </div>
          </div>
          
          {/* Digital Readout */}
          <div className="text-right">
             <div className="flex items-baseline justify-end gap-1">
               <motion.span 
                 key={value}
                 initial={{ opacity: 0.5, y: 5 }}
                 animate={{ opacity: 1, y: 0 }}
                 className={`text-3xl font-bold font-mono tracking-tighter drop-shadow-md ${statusConfig.text}`}
               >
                 {Math.round(value)}
               </motion.span>
               <span className="text-[10px] text-slate-500 font-mono mb-1">/100</span>
             </div>
          </div>
        </div>

        {/* 4. POWER CELL ARRAY (The Bar) */}
        <div className="relative h-8 w-full bg-[#020617] rounded-sm border border-slate-700/50 p-1 shadow-inner flex gap-[2px]">
          {/* Grid Background inside bar */}
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(90deg, transparent 50%, rgba(255,255,255,0.1) 50%)', backgroundSize: '4px 4px' }} />

          {Array.from({ length: totalSegments }).map((_, i) => {
            const isActive = i < activeSegments;
            return (
              <motion.div
                key={i}
                initial={false}
                animate={{
                  opacity: isActive ? 1 : 0.15,
                  backgroundColor: isActive ? statusConfig.color : "#475569",
                  scaleY: isActive ? 1 : 0.8
                }}
                transition={{ duration: 0.4, delay: i * 0.015 }} // "Domino" fill effect
                className={`h-full flex-1 rounded-[1px] transition-all duration-300 relative ${isActive ? statusConfig.barGlow : ""}`}
              >
                {/* Internal highlight for 3D glass look */}
                {isActive && (
                  <div className="absolute top-0 left-0 right-0 h-[30%] bg-white/40 rounded-t-[1px]" />
                )}
              </motion.div>
            );
          })}

          {/* Scanning Laser Overlay */}
          <motion.div
            animate={{ left: ["-20%", "120%"] }}
            transition={{ repeat: Infinity, duration: 3, ease: "linear", repeatDelay: 1 }}
            className="absolute top-0 bottom-0 w-8 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] pointer-events-none z-10"
          />
        </div>

        {/* 5. FOOTER METADATA */}
        <div className="relative z-10 flex justify-between items-center mt-3">
          <div className={`flex items-center gap-2 px-2 py-0.5 rounded bg-slate-950/40 border border-slate-800 ${statusConfig.text}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${isActive => isActive ? "animate-ping" : ""} ${statusConfig.text.replace('text-', 'bg-')}`} />
            <span className="text-[9px] font-bold font-mono tracking-widest uppercase">
              {statusConfig.label}
            </span>
          </div>
          
          <div className="flex gap-2 text-[9px] font-mono text-slate-600">
             <span>SYS-CHECK</span>
             <BatteryCharging size={12} className={statusConfig.text} />
          </div>
        </div>
        
        {/* Critical Alert Overlay */}
        {value < 40 && (
           <div className="absolute inset-0 bg-red-500/5 animate-pulse pointer-events-none rounded-2xl" />
        )}

      </div>

      {/* --- EXPLANATION MODAL --- */}
      <AnimatePresence>
        {showExplanation && (
          <DemoExplanationModal 
            isOpen={showExplanation} 
            onClose={() => setShowExplanation(false)} 
            // Optional: You could pass a prop to pre-select the 'readiness' tab if the modal supports it
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default ReadinessBar;