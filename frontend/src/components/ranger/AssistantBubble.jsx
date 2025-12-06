// src/components/ranger/AssistantBubble.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Cpu, ChevronRight, X } from "lucide-react";

/**
 * 🤖 AI Assistant Widget
 * Displays real-time insights from the Demo Engine or Backend.
 * Replaces the old floating button with an embedded dashboard widget.
 */
export default function AssistantBubble({ message }) {
  // Default to open since it sits in the dashboard grid now
  const [isOpen, setIsOpen] = useState(true); 
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // ⌨️ TYPEWRITER EFFECT
  useEffect(() => {
    if (!message) return;
    
    setDisplayedText("");
    setIsTyping(true);
    
    let i = 0;
    const speed = 30; // ms per char

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

  return (
    <div className="w-full relative group">
      <AnimatePresence mode="wait">
        
        {isOpen ? (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="w-full bg-slate-900/80 border border-cyan-500/30 rounded-2xl p-4 backdrop-blur-md relative overflow-hidden shadow-[0_0_20px_rgba(34,211,238,0.1)]"
          >
            {/* 🛡️ BACKGROUND EFFECTS (Scanlines) */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />
            <div 
              className="absolute inset-0 opacity-10 pointer-events-none" 
              style={{ backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(34, 211, 238, .3) 25%, rgba(34, 211, 238, .3) 26%, transparent 27%, transparent 74%, rgba(34, 211, 238, .3) 75%, rgba(34, 211, 238, .3) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(34, 211, 238, .3) 25%, rgba(34, 211, 238, .3) 26%, transparent 27%, transparent 74%, rgba(34, 211, 238, .3) 75%, rgba(34, 211, 238, .3) 76%, transparent 77%, transparent)', backgroundSize: '30px 30px' }}
            />

            {/* HEADER */}
            <div className="flex justify-between items-start mb-3 relative z-10">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-cyan-950 border border-cyan-500/50 flex items-center justify-center">
                    <Bot size={20} className="text-cyan-400" />
                  </div>
                  {/* Status Dot */}
                  <span className={`absolute -bottom-0.5 -right-0.5 flex h-3 w-3`}>
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isTyping ? "bg-cyan-400" : "bg-emerald-400"}`}></span>
                    <span className={`relative inline-flex rounded-full h-3 w-3 ${isTyping ? "bg-cyan-500" : "bg-emerald-500"}`}></span>
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white tracking-wide">AI OVERWATCH</h4>
                  <p className="text-[10px] text-cyan-400 font-mono uppercase tracking-wider">
                    {isTyping ? "PROCESSING STREAM..." : "SYSTEM MONITORING"}
                  </p>
                </div>
              </div>
              
              <button 
                onClick={() => setIsOpen(false)}
                className="text-slate-500 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* MESSAGE CONTENT */}
            <div className="relative z-10 bg-slate-950/50 rounded-lg p-3 border border-slate-800 min-h-[60px]">
              <p className="text-sm text-cyan-50 font-mono leading-relaxed">
                <span className="text-cyan-500 mr-2">{">"}</span>
                {displayedText || "Waiting for neural input..."}
                {isTyping && <span className="animate-pulse inline-block w-2 h-4 bg-cyan-400 ml-1 align-middle" />}
              </p>
            </div>

            {/* FOOTER ACTIONS */}
            <div className="mt-3 flex justify-end items-center gap-2 relative z-10">
               <span className="text-[10px] text-slate-500 font-mono">
                 SECURE CHANNEL v5.0
               </span>
            </div>
            
          </motion.div>
        ) : (
          /* COLLAPSED STATE (Pill Button) */
          <motion.button
            key="collapsed"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-3 bg-slate-900 border border-cyan-500/40 rounded-full px-4 py-3 shadow-[0_0_15px_rgba(34,211,238,0.2)] hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all w-full justify-center"
          >
             <Cpu size={18} className="text-cyan-400 animate-pulse" />
             <span className="text-xs font-bold text-cyan-100">AI NOTIFICATION</span>
             <ChevronRight size={14} className="text-slate-400" />
          </motion.button>
        )}

      </AnimatePresence>
    </div>
  );
}