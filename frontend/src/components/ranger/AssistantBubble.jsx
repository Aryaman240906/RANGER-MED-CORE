// src/components/ranger/AssistantBubble.jsx
import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bot, Cpu, ChevronRight, X, Sparkles, 
  AlertTriangle, ArrowRight, CheckCircle2 
} from "lucide-react";
import { useNavigate } from "react-router-dom";

/**
 * 🤖 TACTICAL AI ASSISTANT (CORTEX)
 * Intelligent HUD notification that provides context-aware insights
 * and quick-navigation links based on system events.
 */
export default function AssistantBubble({ message, action }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true); 
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // --- 1. CONTEXT ANALYSIS ---
  const context = useMemo(() => {
    const msg = message?.toLowerCase() || "";
    if (msg.includes("warning") || msg.includes("critical") || msg.includes("detect")) {
      return { type: "warning", color: "text-amber-400", bg: "bg-amber-500", border: "border-amber-500", icon: AlertTriangle };
    }
    if (msg.includes("success") || msg.includes("complete") || msg.includes("optimal")) {
      return { type: "success", color: "text-emerald-400", bg: "bg-emerald-500", border: "border-emerald-500", icon: CheckCircle2 };
    }
    return { type: "info", color: "text-cyan-400", bg: "bg-cyan-500", border: "border-cyan-500", icon: Bot };
  }, [message]);

  const ContextIcon = context.icon;

  // --- 2. SMART NAVIGATION ---
  const quickAction = useMemo(() => {
    // If a custom action is passed, use it
    if (action) return action;

    // Otherwise, auto-detect links based on keywords
    const msg = message?.toLowerCase() || "";
    if (msg.includes("dose") || msg.includes("capsule")) return { label: "Open Console", path: "/dose" };
    if (msg.includes("alert") || msg.includes("risk")) return { label: "View Alerts", path: "/alerts" };
    if (msg.includes("symptom") || msg.includes("log") || msg.includes("diagnostic")) return { label: "Log Data", path: "/log" };
    
    return null;
  }, [message, action]);

  // --- 3. TYPEWRITER EFFECT ---
  useEffect(() => {
    if (!message) return;
    
    setIsOpen(true); 
    setDisplayedText("");
    setIsTyping(true);
    
    let i = 0;
    const speed = 20; 

    const interval = setInterval(() => {
      setDisplayedText(message.slice(0, i + 1));
      i++;
      if (i > message.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [message]);

  // --- HANDLERS ---
  const handleAction = () => {
    if (quickAction?.onClick) {
      quickAction.onClick();
    } else if (quickAction?.path) {
      navigate(quickAction.path);
    }
  };

  if (!message) return null;

  return (
    <div className="w-full relative z-30">
      <AnimatePresence mode="wait">
        
        {isOpen ? (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.4, ease: "circOut" }}
            className={`
              w-full bg-[#050b14]/95 border rounded-2xl p-0 backdrop-blur-xl relative overflow-hidden shadow-2xl
              ${context.type === 'warning' ? 'border-amber-500/30 shadow-amber-900/10' : 'border-cyan-500/30 shadow-cyan-900/10'}
            `}
          >
            {/* Atmosphere */}
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-80 ${context.color}`} />
            <div className="absolute inset-0 scanlines opacity-10 pointer-events-none" />
            
            {/* Header */}
            <div className="flex justify-between items-start p-4 pb-2">
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="relative">
                  <div className={`w-10 h-10 rounded-lg border bg-opacity-10 flex items-center justify-center shadow-[0_0_15px_rgba(0,0,0,0.3)] ${context.border} ${context.bg}`}>
                    <ContextIcon size={20} className={context.color} />
                  </div>
                  {/* Status Indicator */}
                  <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${context.bg}`}></span>
                    <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${context.bg}`}></span>
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-white tracking-widest uppercase flex items-center gap-2">
                    CORTEX AI
                    {isTyping && <span className={`text-[9px] font-mono animate-pulse ${context.color}`}>ANALYZING...</span>}
                  </h4>
                  <div className="flex items-center gap-1.5 opacity-60">
                     <Cpu size={10} className={context.color} />
                     <p className={`text-[9px] font-mono uppercase tracking-wider ${context.color}`}>
                       Telemetry Active
                     </p>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-md hover:bg-white/10 text-slate-500 hover:text-white transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            {/* Terminal Body */}
            <div className="px-4 pb-4 pt-2 relative">
              <div className="relative z-10 bg-black/40 rounded-lg p-3 border border-white/5 font-mono text-sm leading-relaxed shadow-inner">
                <p className="relative z-10 text-slate-200">
                  <span className={`font-bold mr-2 ${context.color}`}>{">"}</span>
                  {displayedText}
                  <motion.span 
                    animate={{ opacity: [0, 1, 0] }} 
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className={`inline-block w-1.5 h-3 ml-1 align-middle shadow-[0_0_5px_currentColor] ${context.bg}`} 
                  />
                </p>
              </div>

              {/* Quick Action Button */}
              {quickAction && !isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 flex justify-end"
                >
                  <button
                    onClick={handleAction}
                    className={`
                      flex items-center gap-2 px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider border transition-all
                      ${context.type === 'warning' 
                        ? "bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20" 
                        : "bg-cyan-500/10 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20"
                      }
                    `}
                  >
                    <span>{quickAction.label}</span>
                    <ArrowRight size={12} />
                  </button>
                </motion.div>
              )}
            </div>
            
          </motion.div>
        ) : (
          /* COLLAPSED PILL */
          <motion.button
            key="collapsed"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsOpen(true)}
            className={`
              group w-full flex items-center justify-between border rounded-xl px-4 py-3 shadow-lg transition-colors backdrop-blur-md
              ${context.type === 'warning' 
                ? "bg-amber-950/40 border-amber-500/30 hover:border-amber-500/60" 
                : "bg-[#050b14]/90 border-cyan-500/30 hover:border-cyan-400/60"
              }
            `}
          >
             <div className="flex items-center gap-3">
               <div className={`p-1.5 rounded-md border bg-opacity-10 ${context.border} ${context.bg}`}>
                 <Sparkles size={16} className={context.color} />
               </div>
               <div className="flex flex-col items-start">
                 <span className="text-xs font-bold text-white tracking-wide">CORTEX ONLINE</span>
                 <span className="text-[10px] text-slate-400 font-mono">1 New Insight Available</span>
               </div>
             </div>
             <ChevronRight size={16} className={`${context.color} group-hover:translate-x-1 transition-transform`} />
          </motion.button>
        )}

      </AnimatePresence>
    </div>
  );
}