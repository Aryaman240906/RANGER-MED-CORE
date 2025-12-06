// src/components/ranger/Timeline.jsx
import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle, AlertTriangle, Info, 
  Zap, Clock, ShieldAlert, Activity 
} from "lucide-react";

/**
 * 🎨 Helper to get icon and color based on event type
 */
const getEventStyle = (type) => {
  switch (type) {
    case "success":
      return { 
        icon: CheckCircle, 
        color: "text-emerald-400", 
        bg: "bg-emerald-500/10", 
        border: "border-emerald-500/30",
        dot: "bg-emerald-500"
      };
    case "warning":
      return { 
        icon: AlertTriangle, 
        color: "text-amber-400", 
        bg: "bg-amber-500/10", 
        border: "border-amber-500/30",
        dot: "bg-amber-500"
      };
    case "danger":
      return { 
        icon: ShieldAlert, 
        color: "text-red-400", 
        bg: "bg-red-500/10", 
        border: "border-red-500/30",
        dot: "bg-red-500"
      };
    case "capsule": // Special case for doses
      return { 
        icon: Zap, 
        color: "text-cyan-400", 
        bg: "bg-cyan-500/10", 
        border: "border-cyan-500/30",
        dot: "bg-cyan-400"
      };
    default: // info
      return { 
        icon: Info, 
        color: "text-slate-400", 
        bg: "bg-slate-800", 
        border: "border-slate-700",
        dot: "bg-slate-500"
      };
  }
};

export default function Timeline({ events = [] }) {
  
  // 📊 Calculate Stats on the fly
  const stats = useMemo(() => ({
    success: events.filter(e => e.type === 'success').length,
    alerts: events.filter(e => e.type === 'warning' || e.type === 'danger').length,
    total: events.length
  }), [events]);

  return (
    <div className="flex flex-col h-full min-h-[400px] rounded-2xl bg-slate-900/60 border border-slate-700/50 backdrop-blur-md overflow-hidden">
      
      {/* 📡 HEADER */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/30">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-cyan-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-widest">
            Mission Log
          </h3>
        </div>
        <div className="flex items-center gap-2 px-2 py-1 rounded bg-slate-900 border border-slate-800">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] font-mono text-slate-400">LIVE FEED</span>
        </div>
      </div>

      {/* 📜 SCROLLABLE AREA */}
      <div className="flex-1 relative overflow-y-auto custom-scrollbar p-4 space-y-0">
        
        {/* Empty State */}
        {events.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-slate-600 space-y-3 opacity-50">
            <Activity size={32} />
            <span className="text-xs font-mono uppercase tracking-widest">Waiting for Telemetry...</span>
          </div>
        )}

        {/* Continuous Vertical Rail */}
        {events.length > 0 && (
           <div className="absolute left-[27px] top-4 bottom-0 w-[2px] bg-slate-800/50" />
        )}

        <AnimatePresence initial={false}>
          {events.map((event, index) => {
            const style = getEventStyle(event.type);
            const Icon = style.icon;

            return (
              <motion.div
                key={event.id || index} 
                layout // 🪄 Magic: Automatically animates position changes
                initial={{ opacity: 0, x: -20, height: 0 }}
                animate={{ opacity: 1, x: 0, height: "auto" }}
                exit={{ opacity: 0, x: -20, height: 0 }}
                transition={{ duration: 0.3 }}
                className="relative pl-12 pb-4 group"
              >
                {/* 💍 CONNECTOR NODE */}
                <div className={`absolute left-[20px] top-3 w-4 h-4 rounded-full border-2 bg-slate-950 z-10 transition-colors duration-300 flex items-center justify-center ${style.border} ${style.color}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${index === 0 ? "animate-pulse" : ""} ${style.dot}`} />
                </div>

                {/* 📄 EVENT CARD */}
                <div className={`p-3 rounded-lg border backdrop-blur-sm transition-all hover:brightness-110 flex items-start justify-between gap-3 ${style.bg} ${style.border}`}>
                  
                  <div className="flex items-start gap-3">
                    {/* Compact Icon */}
                    <div className={`mt-0.5 p-1 rounded bg-slate-950/30 ${style.color}`}>
                       <Icon size={14} />
                    </div>
                    
                    <div className="flex flex-col">
                      <span className={`text-xs font-bold ${style.color}`}>
                        {event.label}
                      </span>
                      {event.description && (
                         <span className="text-[10px] text-slate-400 mt-0.5 leading-tight">{event.description}</span>
                      )}
                    </div>
                  </div>

                  <span className="text-[10px] font-mono text-slate-500 bg-slate-950/50 px-1.5 py-0.5 rounded border border-slate-800 whitespace-nowrap">
                    {event.time}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* 📊 FOOTER STATS */}
      <div className="grid grid-cols-3 border-t border-slate-800 bg-slate-950/50 divide-x divide-slate-800">
         <div className="p-3 text-center">
            <div className="text-sm font-bold text-emerald-400 font-mono">{stats.success}</div>
            <div className="text-[9px] text-slate-500 uppercase tracking-wider">Events</div>
         </div>
         <div className="p-3 text-center">
            <div className="text-sm font-bold text-amber-400 font-mono">{stats.alerts}</div>
            <div className="text-[9px] text-slate-500 uppercase tracking-wider">Alerts</div>
         </div>
         <div className="p-3 text-center">
            <div className="text-sm font-bold text-cyan-400 font-mono">{stats.total}</div>
            <div className="text-[9px] text-slate-500 uppercase tracking-wider">Total</div>
         </div>
      </div>

    </div>
  );
}