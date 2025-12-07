// src/components/ranger/Timeline.jsx
import React, { useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle, AlertTriangle, Info, 
  Zap, Clock, ShieldAlert, Activity, FileText 
} from "lucide-react";

/**
 * 🎨 TACTICAL EVENT STYLES
 */
const getEventStyle = (type) => {
  switch (type) {
    case "success":
      return { 
        icon: CheckCircle, 
        color: "text-emerald-400", 
        border: "border-emerald-500/30",
        shadow: "shadow-[0_0_10px_rgba(16,185,129,0.1)]",
        bg: "bg-emerald-900/10"
      };
    case "warning":
      return { 
        icon: AlertTriangle, 
        color: "text-amber-400", 
        border: "border-amber-500/30",
        shadow: "shadow-[0_0_10px_rgba(251,191,36,0.1)]",
        bg: "bg-amber-900/10"
      };
    case "danger":
      return { 
        icon: ShieldAlert, 
        color: "text-red-400", 
        border: "border-red-500/40",
        shadow: "shadow-[0_0_15px_rgba(248,113,113,0.2)]",
        bg: "bg-red-900/10"
      };
    case "capsule": 
      return { 
        icon: Zap, 
        color: "text-cyan-400", 
        border: "border-cyan-500/30",
        shadow: "shadow-[0_0_10px_rgba(34,211,238,0.1)]",
        bg: "bg-cyan-900/10"
      };
    default:
      return { 
        icon: Info, 
        color: "text-slate-400", 
        border: "border-slate-700",
        shadow: "shadow-none",
        bg: "bg-slate-800/20"
      };
  }
};

export default function Timeline({ events = [] }) {
  const scrollRef = useRef(null);
  
  // 📊 Auto-scroll to top when new events arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [events]);

  // 📊 Stats Calculation
  const stats = useMemo(() => ({
    success: events.filter(e => e.type === 'success').length,
    alerts: events.filter(e => e.type === 'warning' || e.type === 'danger').length,
    total: events.length
  }), [events]);

  return (
    <div className="flex flex-col h-full min-h-[420px] rounded-2xl bg-[#050b14]/80 border border-slate-700/50 backdrop-blur-xl overflow-hidden relative shadow-lg">
      
      {/* 1. ATMOSPHERE */}
      <div className="absolute inset-0 scanlines opacity-5 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none" />

      {/* 2. HEADER HUD */}
      <div className="flex items-center justify-between p-4 border-b border-cyan-500/20 bg-slate-950/50 relative z-10">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-cyan-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-[0.2em]">
            Mission Log
          </h3>
        </div>
        <div className="flex items-center gap-2 px-2 py-0.5 rounded border border-cyan-900/50 bg-cyan-950/30">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_5px_#10b981]" />
          <span className="text-[9px] font-mono text-cyan-500/80 tracking-widest">LIVE FEED</span>
        </div>
      </div>

      {/* 3. SCROLLABLE DATA STREAM */}
      <div 
        ref={scrollRef}
        className="flex-1 relative overflow-y-auto custom-scrollbar p-4 space-y-0 scroll-smooth"
      >
        {/* Empty State */}
        {events.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-slate-600 space-y-3 opacity-50">
            <Activity size={32} className="text-cyan-900" />
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-800">
              Awaiting Telemetry...
            </span>
          </div>
        )}

        {/* The Neon Rail */}
        {events.length > 0 && (
           <div className="absolute left-[23px] top-4 bottom-0 w-[1px] bg-gradient-to-b from-cyan-500/50 via-slate-800 to-transparent" />
        )}

        <AnimatePresence initial={false} mode="popLayout">
          {events.map((event, index) => {
            const style = getEventStyle(event.type);
            const Icon = style.icon;

            return (
              <motion.div
                key={event.id || index}
                layout
                initial={{ opacity: 0, x: -10, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                className="relative pl-10 pb-3 group"
              >
                
                {/* Connector Node */}
                <div className="absolute left-[16px] top-3.5 z-10">
                   {/* Outer Glow Ring */}
                   <div className={`w-4 h-4 rounded-full border bg-[#050b14] flex items-center justify-center transition-colors duration-300 ${style.border}`}>
                      {/* Inner Dot */}
                      <div className={`w-1.5 h-1.5 rounded-full ${index === 0 ? "animate-pulse" : ""} ${style.color.replace('text-', 'bg-')}`} />
                   </div>
                   {/* Vertical Beam for first item */}
                   {index === 0 && (
                      <div className={`absolute -top-4 left-1/2 -translate-x-1/2 w-[1px] h-4 bg-gradient-to-t from-${style.color.split('-')[1]}-500 to-transparent opacity-50`} />
                   )}
                </div>

                {/* Data Card */}
                <div className={`
                  relative p-3 rounded-r-lg rounded-bl-lg border-l-2 backdrop-blur-sm transition-all duration-300
                  hover:bg-white/5 hover:translate-x-1
                  ${style.bg} ${style.border} ${style.color.replace('text-', 'border-l-')}
                `}>
                  {/* Technical Corner Clip */}
                  <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/10 rounded-tr-sm" />

                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 opacity-80 ${style.color}`}>
                         <Icon size={14} />
                      </div>
                      
                      <div className="flex flex-col">
                        <span className={`text-xs font-bold tracking-wide ${style.color} drop-shadow-sm`}>
                          {event.label}
                        </span>
                        {event.description && (
                           <span className="text-[10px] text-slate-400 mt-0.5 font-mono leading-tight">
                             {event.description}
                           </span>
                        )}
                      </div>
                    </div>

                    <span className="text-[9px] font-mono text-slate-500 bg-black/20 px-1.5 py-0.5 rounded border border-white/5 whitespace-nowrap">
                      {event.time}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* 4. FOOTER STATS DECK */}
      <div className="grid grid-cols-3 border-t border-cyan-900/30 bg-[#020617] divide-x divide-cyan-900/30">
         <StatBlock label="EVENTS" value={stats.success} color="text-emerald-400" />
         <StatBlock label="ALERTS" value={stats.alerts} color="text-amber-400" />
         <StatBlock label="TOTAL" value={stats.total} color="text-cyan-400" />
      </div>

    </div>
  );
}

// Micro-Component for Footer Stats
const StatBlock = ({ label, value, color }) => (
  <div className="p-2 flex flex-col items-center justify-center hover:bg-white/5 transition-colors cursor-default group">
    <div className={`text-sm font-bold font-mono group-hover:scale-110 transition-transform ${color}`}>
      {value}
    </div>
    <div className="flex items-center gap-1 mt-0.5">
      <div className={`w-1 h-1 rounded-full opacity-50 ${color.replace('text-', 'bg-')}`} />
      <div className="text-[8px] text-slate-500 uppercase tracking-wider font-bold">
        {label}
      </div>
    </div>
  </div>
);