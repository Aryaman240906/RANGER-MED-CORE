// src/components/ranger/Timeline.jsx
import React, { useMemo, useRef, useEffect, useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { 
  CheckCircle, AlertTriangle, Info, 
  Zap, Clock, ShieldAlert, Activity, Pill, 
  Terminal, ChevronDown, Database 
} from "lucide-react";

/**
 * 🎨 TACTICAL EVENT STYLES
 * Maps simulation event types to visual themes.
 */
const getEventStyle = (type) => {
  switch (type) {
    case "success":
      return { 
        icon: CheckCircle, 
        color: "text-emerald-400", 
        border: "border-emerald-500/30",
        bg: "bg-emerald-900/10",
        shadow: "shadow-[0_0_15px_rgba(16,185,129,0.15)]",
        line: "from-emerald-500"
      };
    case "dose": 
      return { 
        icon: Pill, 
        color: "text-cyan-400", 
        border: "border-cyan-500/30", 
        bg: "bg-cyan-900/10",
        shadow: "shadow-[0_0_15px_rgba(34,211,238,0.2)]",
        line: "from-cyan-500"
      };
    case "symptom": 
      return { 
        icon: Activity, 
        color: "text-fuchsia-400", 
        border: "border-fuchsia-500/30", 
        bg: "bg-fuchsia-900/10",
        shadow: "shadow-[0_0_15px_rgba(232,121,249,0.15)]",
        line: "from-fuchsia-500"
      };
    case "alert": 
    case "danger":
      return { 
        icon: ShieldAlert, 
        color: "text-red-400", 
        border: "border-red-500/40", 
        bg: "bg-red-900/10",
        shadow: "shadow-[0_0_20px_rgba(248,113,113,0.3)]",
        line: "from-red-500"
      };
    case "warning":
      return { 
        icon: AlertTriangle, 
        color: "text-amber-400", 
        border: "border-amber-500/30", 
        bg: "bg-amber-900/10",
        shadow: "shadow-[0_0_15px_rgba(251,191,36,0.15)]",
        line: "from-amber-500"
      };
    default:
      return { 
        icon: Info, 
        color: "text-slate-400", 
        border: "border-slate-700", 
        bg: "bg-slate-800/20",
        shadow: "shadow-none",
        line: "from-slate-500"
      };
  }
};

/**
 * 📜 MISSION TIMELINE (DEEP LOG)
 * Real-time event stream with expandable data payloads.
 */
export default function Timeline({ events = [], filter = "all" }) {
  const scrollRef = useRef(null);
  const [expandedId, setExpandedId] = useState(null);
  
  // 📊 Auto-scroll to top on new event
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [events.length]); // Only scroll if count changes

  // 🔍 Filter Logic
  const filteredEvents = useMemo(() => {
    if (filter === "all") return events;
    return events.filter(e => e.type === filter);
  }, [events, filter]);

  // 📊 Stats
  const stats = useMemo(() => ({
    doses: events.filter(e => e.type === 'dose').length,
    logs: events.filter(e => e.type === 'symptom').length,
    alerts: events.filter(e => e.type === 'alert' || e.type === 'danger').length
  }), [events]);

  const toggleExpand = (id) => {
    setExpandedId(prev => prev === id ? null : id);
  };

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
        {filteredEvents.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-slate-600 space-y-3 opacity-50">
            <Activity size={32} className="text-cyan-900" />
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-800">
              Awaiting Telemetry...
            </span>
          </div>
        )}

        {/* The Neon Rail (Circuit Trace) */}
        {filteredEvents.length > 0 && (
           <div className="absolute left-[23px] top-6 bottom-0 w-[1px] bg-gradient-to-b from-slate-700 via-slate-800 to-transparent" />
        )}

        <LayoutGroup>
          <AnimatePresence initial={false} mode="popLayout">
            {filteredEvents.map((event, index) => {
              const style = getEventStyle(event.type);
              const Icon = style.icon;
              const isLatest = index === 0;
              const isExpanded = expandedId === event.id;

              return (
                <motion.div
                  layout
                  key={event.id || index}
                  initial={{ opacity: 0, x: -10, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  className="relative pl-10 pb-3 group"
                  data-tour={isLatest ? "timeline-latest" : undefined}
                >
                  
                  {/* Connector Node */}
                  <div className="absolute left-[16px] top-3.5 z-10">
                     {/* Outer Glow Ring */}
                     <div className={`w-4 h-4 rounded-full border bg-[#050b14] flex items-center justify-center transition-colors duration-300 ${style.border} ${isLatest ? style.shadow : ''}`}>
                        {/* Inner Dot */}
                        <div className={`w-1.5 h-1.5 rounded-full ${isLatest ? "animate-pulse" : ""} ${style.color.replace('text-', 'bg-')}`} />
                     </div>
                     {/* Active Beam Connection */}
                     {isLatest && (
                        <div className={`absolute -top-6 left-1/2 -translate-x-1/2 w-[1px] h-6 bg-gradient-to-t ${style.line} to-transparent opacity-80`} />
                     )}
                  </div>

                  {/* Data Card */}
                  <motion.div 
                    layout
                    onClick={() => toggleExpand(event.id)}
                    className={`
                      relative rounded-r-lg rounded-bl-lg border-l-2 backdrop-blur-sm transition-all duration-300 cursor-pointer
                      ${isExpanded ? 'bg-slate-900/80 border-l-4' : 'hover:bg-white/5 hover:translate-x-1'}
                      ${style.bg} ${style.border} ${style.color.replace('text-', 'border-l-')}
                    `}
                  >
                    {/* Technical Corner Clip */}
                    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/10 rounded-tr-sm" />

                    <div className="p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 w-full">
                          <div className={`mt-0.5 opacity-80 ${style.color}`}>
                             <Icon size={14} />
                          </div>
                          
                          <div className="flex flex-col w-full">
                            <div className="flex justify-between items-center w-full">
                              <span className={`text-xs font-bold tracking-wide ${style.color} drop-shadow-sm`}>
                                {event.label}
                              </span>
                              <span className="text-[9px] font-mono text-slate-500 opacity-60 whitespace-nowrap ml-2">
                                {event.time}
                              </span>
                            </div>
                            
                            {event.description && (
                               <div className="text-[10px] text-slate-400 mt-0.5 font-mono leading-tight flex items-center gap-2">
                                 {event.description}
                                 {isLatest && (
                                   <span className="bg-white/10 text-white text-[8px] px-1 rounded animate-pulse">NEW</span>
                                 )}
                               </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* EXPANDED PAYLOAD (Section C Requirement: Deep Data) */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-white/5 bg-black/20 overflow-hidden"
                        >
                          <div className="p-3 grid grid-cols-2 gap-2 text-[9px] font-mono">
                            <div className="flex flex-col">
                              <span className="text-slate-500 uppercase tracking-widest">ID Hash</span>
                              <span className="text-slate-300 font-bold">{event.id?.slice(0,8) || "UNKNOWN"}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-slate-500 uppercase tracking-widest">Source</span>
                              <span className="text-slate-300 font-bold uppercase">{event.source || "System"}</span>
                            </div>
                            
                            {/* Conditional Metadata Display */}
                            {event.capsuleType && (
                              <div className="col-span-2 mt-1 pt-1 border-t border-white/5">
                                <span className="text-cyan-500 uppercase tracking-widest block mb-1">Payload Config</span>
                                <div className="flex justify-between text-slate-300">
                                  <span>Type: {event.capsuleType}</span>
                                  <span>Qty: {event.doseAmount}x</span>
                                </div>
                              </div>
                            )}
                            
                            {event.severity && (
                              <div className="col-span-2 mt-1 pt-1 border-t border-white/5">
                                <span className="text-fuchsia-500 uppercase tracking-widest block mb-1">Bio-Metric Data</span>
                                <div className="flex justify-between text-slate-300">
                                  <span>Severity: {event.severity}/10</span>
                                  <span>Notes: {event.notes ? "Attached" : "None"}</span>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <div className="px-3 pb-2 flex justify-end">
                             <ChevronDown size={10} className="text-slate-600 rotate-180" />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                  </motion.div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </LayoutGroup>
      </div>

      {/* 4. FOOTER STATS DECK */}
      <div className="grid grid-cols-3 border-t border-cyan-900/30 bg-[#020617] divide-x divide-cyan-900/30">
         <StatBlock label="DOSES" value={stats.doses} color="text-cyan-400" />
         <StatBlock label="LOGS" value={stats.logs} color="text-fuchsia-400" />
         <StatBlock label="ALERTS" value={stats.alerts} color="text-red-400" />
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