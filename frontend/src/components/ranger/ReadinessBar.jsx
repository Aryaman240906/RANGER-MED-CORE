// src/components/ranger/ReadinessBar.jsx
import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Zap, AlertTriangle, CheckCircle } from "lucide-react";

const ReadinessBar = ({ value = 0 }) => {
  // CONFIG: 20 segments for the bar
  const totalSegments = 20;
  const activeSegments = Math.round((value / 100) * totalSegments);

  // 🎨 DYNAMIC STATUS COLORS & ICONS
  const statusConfig = useMemo(() => {
    if (value >= 80) return { 
      label: "COMBAT READY", 
      color: "bg-cyan-400", 
      glow: "shadow-[0_0_12px_#22d3ee]", 
      icon: CheckCircle, 
      text: "text-cyan-400" 
    };
    if (value >= 50) return { 
      label: "CAUTION", 
      color: "bg-yellow-400", 
      glow: "shadow-[0_0_12px_#facc15]", 
      icon: AlertTriangle, 
      text: "text-yellow-400" 
    };
    return { 
      label: "CRITICAL", 
      color: "bg-red-500", 
      glow: "shadow-[0_0_15px_#ef4444]", 
      icon: Zap, 
      text: "text-red-500" 
    };
  }, [value]);

  const StatusIcon = statusConfig.icon;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full p-5 bg-slate-900/60 border border-slate-700/50 rounded-2xl backdrop-blur-md flex flex-col gap-3 relative overflow-hidden h-full justify-center"
    >
      
      {/* 🛡️ HEADER ROW */}
      <div className="flex justify-between items-end">
        <div className="flex items-center gap-2">
          <StatusIcon size={16} className={statusConfig.text} />
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400 font-bold">
            Mission Readiness
          </span>
        </div>
        
        {/* Numeric Value */}
        <div className="flex items-baseline gap-1">
           <motion.span 
             key={value} // Re-animate on number change
             initial={{ opacity: 0.5, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             className={`text-2xl font-bold font-mono tracking-tighter ${statusConfig.text}`}
           >
             {Math.round(value)}
           </motion.span>
           <span className="text-xs text-slate-500 font-mono">/100</span>
        </div>
      </div>

      {/* 🔋 SEGMENTED BAR CONTAINER */}
      <div className="relative h-6 w-full bg-slate-950 rounded-md border border-slate-800 flex items-center p-1 gap-0.5 overflow-hidden shadow-inner">
        
        {/* Render 20 individual segments */}
        {Array.from({ length: totalSegments }).map((_, i) => {
          const isActive = i < activeSegments;
          return (
            <motion.div
              key={i}
              initial={false}
              animate={{
                opacity: isActive ? 1 : 0.2,
                backgroundColor: isActive ? (value >= 80 ? "#22d3ee" : value >= 50 ? "#facc15" : "#ef4444") : "#334155"
              }}
              transition={{ duration: 0.3, delay: i * 0.01 }} // Stagger effect for liquid fill
              className={`h-full flex-1 rounded-[1px] transition-all duration-300 ${isActive ? statusConfig.glow : ""}`}
            />
          );
        })}

        {/* 🔦 SCANLINE EFFECT (Light passing through) */}
        <motion.div
          animate={{ x: ["-100%", "200%"] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "linear", repeatDelay: 0.5 }}
          className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 pointer-events-none"
        />
      </div>

      {/* 📝 FOOTER STATUS TEXT */}
      <div className="flex justify-between items-center mt-1">
        <div className={`text-[9px] font-bold font-mono tracking-widest px-2 py-0.5 rounded bg-slate-950/50 border border-slate-800 uppercase ${statusConfig.text}`}>
          Condition: {statusConfig.label}
        </div>
        
        {/* Decorative Grid Dots */}
        <div className="flex gap-1 opacity-50">
           {[1,2,3,4].map(d => <div key={d} className="w-1 h-1 rounded-full bg-slate-600" />)}
        </div>
      </div>

    </motion.div>
  );
};

export default ReadinessBar;