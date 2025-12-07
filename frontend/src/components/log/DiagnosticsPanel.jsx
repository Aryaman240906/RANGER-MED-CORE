// src/components/log/DiagnosticsPanel.jsx
import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  TrendingUp, TrendingDown, AlertCircle, ChevronDown, 
  ChevronUp, Activity, BrainCircuit 
} from "lucide-react";
import { useDemoStore } from "../../store/demoStore";

// --- HELPERS ---
const getRiskLevel = (severity) => {
  if (severity >= 8) return { label: "CRITICAL", color: "text-red-500", border: "border-red-500/50", bg: "bg-red-500/10" };
  if (severity >= 5) return { label: "MODERATE", color: "text-amber-400", border: "border-amber-500/50", bg: "bg-amber-500/10" };
  return { label: "STABLE", color: "text-emerald-400", border: "border-emerald-500/50", bg: "bg-emerald-500/10" };
};

const Sparkline = ({ data, color = "#10b981" }) => {
  if (!data || data.length < 2) return null;
  
  const height = 40;
  const width = 120;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * height;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline 
        fill="none" 
        stroke={color} 
        strokeWidth="2" 
        points={points} 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <circle cx={width} cy={height - ((data[data.length-1] - min) / range) * height} r="3" fill={color} className="animate-pulse" />
    </svg>
  );
};

/**
 * 🔬 DIAGNOSTICS PANEL
 * Visualizes health trends and analyzes recent symptom logs.
 */
export default function DiagnosticsPanel() {
  const events = useDemoStore((s) => s.events);
  const stability = useDemoStore((s) => s.stability);
  
  const [expandedId, setExpandedId] = useState(null);

  // --- DATA PROCESSING ---
  const symptomLogs = useMemo(() => 
    events.filter(e => e.type === "symptom").slice(0, 5), 
  [events]);

  // Mock Stability History for Sparkline (Last 10 events)
  const stabilityTrend = useMemo(() => {
    // In a real app, this would come from historical snapshots.
    // Here we simulate a trend ending in current stability.
    return Array.from({ length: 10 }, (_, i) => 
      Math.max(0, Math.min(100, stability + (Math.random() * 10 - 5)))
    );
  }, [stability]); // Re-generate slightly on stability change

  return (
    <div className="flex flex-col h-full gap-4">
      
      {/* 1. VITALS OVERVIEW */}
      <div className="grid grid-cols-2 gap-4">
        {/* Trend Card */}
        <div className="bg-slate-950/30 rounded-xl p-3 border border-white/5 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">Stability Trend</span>
            {stabilityTrend[9] > stabilityTrend[0] ? (
              <TrendingUp size={14} className="text-emerald-400" />
            ) : (
              <TrendingDown size={14} className="text-red-400" />
            )}
          </div>
          <div className="mt-2">
            <Sparkline data={stabilityTrend} color={stability > 50 ? "#10b981" : "#ef4444"} />
          </div>
        </div>

        {/* Prediction Card */}
        <div className="bg-slate-950/30 rounded-xl p-3 border border-white/5 flex flex-col gap-2 relative overflow-hidden">
          <div className="flex items-center gap-2 text-cyan-400">
            <BrainCircuit size={14} />
            <span className="text-[9px] font-bold uppercase tracking-wider">AI Forecast</span>
          </div>
          <div className="flex-1 flex items-center">
             <p className="text-[10px] text-slate-400 leading-tight">
               Based on recent telemetry, a <span className="text-white font-bold">12% recovery</span> is projected within 4 hours if rest is maintained.
             </p>
          </div>
          {/* Decorative scanner line */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-cyan-500/30 animate-[scan_2s_linear_infinite]" />
        </div>
      </div>

      {/* 2. RECENT INCIDENTS LIST */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
        <h4 className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-3 sticky top-0 bg-[#050b14]/0 backdrop-blur-sm py-2 z-10">
          Recent Anomalies
        </h4>
        
        {symptomLogs.length === 0 && (
          <div className="text-center py-8 opacity-40">
            <Activity size={32} className="mx-auto text-slate-600 mb-2" />
            <p className="text-[10px] font-mono text-slate-500">NO ANOMALIES DETECTED</p>
          </div>
        )}

        <div className="space-y-3">
          <AnimatePresence>
            {symptomLogs.map((log) => {
              const risk = getRiskLevel(log.severity);
              const isExpanded = expandedId === log.id;

              return (
                <motion.div
                  key={log.id || log.timestamp}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`
                    rounded-lg border transition-all overflow-hidden
                    ${isExpanded ? "bg-slate-900 border-slate-600" : "bg-slate-900/40 border-slate-800 hover:border-slate-700"}
                  `}
                >
                  {/* Summary Row */}
                  <div 
                    onClick={() => setExpandedId(isExpanded ? null : log.id)}
                    className="p-3 flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-1.5 h-8 rounded-full ${risk.bg.replace('bg-', 'bg-')} ${risk.color.replace('text-', 'bg-')}`} />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white tracking-wide">{log.symptom}</span>
                          <span className={`text-[9px] px-1.5 rounded border ${risk.border} ${risk.color} ${risk.bg} font-mono font-bold`}>
                            LVL {log.severity}
                          </span>
                        </div>
                        <div className="text-[9px] text-slate-500 font-mono mt-0.5">
                          {new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                      </div>
                    </div>
                    {isExpanded ? <ChevronUp size={14} className="text-slate-500" /> : <ChevronDown size={14} className="text-slate-500" />}
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-white/5 bg-black/20 p-3"
                      >
                        <div className="grid grid-cols-2 gap-4 mb-3">
                           <div>
                             <span className="text-[9px] text-slate-500 block mb-1">NOTES</span>
                             <p className="text-xs text-slate-300 italic">"{log.notes || "No context provided."}"</p>
                           </div>
                           {log.tags && log.tags.length > 0 && (
                             <div>
                               <span className="text-[9px] text-slate-500 block mb-1">TAGS</span>
                               <div className="flex flex-wrap gap-1">
                                 {log.tags.map(t => (
                                   <span key={t} className="text-[9px] px-1.5 bg-white/5 rounded text-slate-400">{t}</span>
                                 ))}
                               </div>
                             </div>
                           )}
                        </div>

                        {/* AI Recommendation */}
                        <div className="mt-2 p-2 bg-cyan-900/10 border border-cyan-500/20 rounded flex gap-2">
                           <AlertCircle size={14} className="text-cyan-400 shrink-0 mt-0.5" />
                           <div>
                             <span className="text-[9px] font-bold text-cyan-400 block mb-0.5">RECOMMENDED PROTOCOL</span>
                             <p className="text-[10px] text-cyan-200/80 leading-relaxed">
                               {log.severity > 7 
                                 ? "Immediate cessation of activity. Administer hydration and seek dark environment." 
                                 : "Monitor symptoms for next 2 hours. Log update if severity increases."}
                             </p>
                           </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

    </div>
  );
}