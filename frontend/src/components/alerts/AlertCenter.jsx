// src/components/alerts/AlertCenter.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldAlert, AlertTriangle, Info, CheckCircle, 
  Trash2, Radar, ChevronRight 
} from "lucide-react";
import { useDemoStore } from "../../store/demoStore";
import { queueAction } from "../../services/localPersistence";

// --- CONFIG ---
const SEVERITY_CONFIG = {
  critical: {
    icon: ShieldAlert,
    color: "text-red-500",
    border: "border-red-500",
    bg: "bg-red-500/10",
    shadow: "shadow-[0_0_15px_rgba(239,68,68,0.2)]"
  },
  warning: {
    icon: AlertTriangle,
    color: "text-amber-400",
    border: "border-amber-500",
    bg: "bg-amber-500/10",
    shadow: "shadow-[0_0_15px_rgba(251,191,36,0.2)]"
  },
  info: {
    icon: Info,
    color: "text-cyan-400",
    border: "border-cyan-500",
    bg: "bg-cyan-500/10",
    shadow: "shadow-[0_0_15px_rgba(34,211,238,0.2)]"
  }
};

/**
 * 🚨 ALERT CENTER FEED
 * The live stream of system warnings. Handles quick actions.
 */
export default function AlertCenter({ alerts, onSelect }) {
  const { acknowledgeAlert, resolveAlert } = useDemoStore();
  const [swipedId, setSwipedId] = useState(null);

  // --- ACTIONS ---
  const handleAck = (e, id) => {
    e.stopPropagation();
    acknowledgeAlert(id);
    queueAction("alert_ack", { id });
  };

  const handleResolve = (e, id) => {
    e.stopPropagation();
    resolveAlert(id);
    queueAction("alert_resolve", { id });
  };

  return (
    <div className="flex flex-col h-full relative">
      
      {/* 1. FEED HEADER */}
      <div className="p-4 border-b border-white/5 bg-black/20 flex justify-between items-center sticky top-0 z-20 backdrop-blur-md">
        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
          INCOMING TRANSMISSIONS
        </span>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[10px] font-bold text-red-500">LIVE</span>
        </div>
      </div>

      {/* 2. SCROLLABLE LIST */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3 relative">
        
        {/* Empty State: Radar Scan */}
        {alerts.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center opacity-40">
            <div className="relative">
              <Radar size={64} className="text-slate-700 animate-spin-slow" />
              <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/20 to-transparent w-full h-1/2 bottom-1/2 animate-[scan_3s_linear_infinite] origin-bottom" />
            </div>
            <p className="mt-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
              Sector Clear
            </p>
            <p className="text-[10px] text-slate-600 font-mono">No active threats detected.</p>
          </div>
        )}

        <AnimatePresence mode="popLayout">
          {alerts.map((alert) => {
            const theme = SEVERITY_CONFIG[alert.severity] || SEVERITY_CONFIG.info;
            const Icon = theme.icon;
            const isAck = alert.status === "acknowledged";

            return (
              <motion.div
                key={alert.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onClick={() => onSelect(alert.id)}
                className={`
                  relative group rounded-xl border backdrop-blur-sm cursor-pointer overflow-hidden transition-all duration-300
                  ${isAck ? "bg-slate-900/40 border-slate-800 grayscale opacity-60" : `bg-[#0a1020] ${theme.border} border-opacity-30 hover:border-opacity-60`}
                `}
              >
                {/* Critical Pulse Overlay */}
                {!isAck && alert.severity === 'critical' && (
                  <div className={`absolute inset-0 bg-red-500/5 animate-pulse pointer-events-none`} />
                )}

                <div className="p-4 flex items-start gap-4 relative z-10">
                  
                  {/* Icon Badge */}
                  <div className={`
                    w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border border-white/5
                    ${isAck ? "bg-slate-800 text-slate-500" : `${theme.bg} ${theme.color} ${theme.shadow}`}
                  `}>
                    <Icon size={20} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className={`text-sm font-bold truncate pr-4 ${isAck ? "text-slate-400" : "text-white"}`}>
                        {alert.title}
                      </h4>
                      <span className="text-[9px] font-mono text-slate-500 whitespace-nowrap">
                        {new Date(alert.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                    
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {alert.message}
                    </p>

                    {/* Quick Actions (Slide Up on Hover) */}
                    {!isAck && (
                      <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-y-2 group-hover:translate-y-0">
                        <button 
                          onClick={(e) => handleAck(e, alert.id)}
                          className="px-3 py-1.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold hover:bg-emerald-500/20 transition-colors flex items-center gap-1"
                        >
                          <CheckCircle2 size={12} /> ACKNOWLEDGE
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Arrow Hint */}
                  <ChevronRight size={16} className="text-slate-600 self-center group-hover:translate-x-1 transition-transform" />
                </div>

                {/* Progress Bar Decoration */}
                {!isAck && (
                  <div className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-current to-transparent w-full opacity-50" style={{ color: theme.color.replace('text-', '') }} />
                )}

              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}