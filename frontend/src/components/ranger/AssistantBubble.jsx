// src/components/ranger/AssistantBubble.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Cpu, ChevronRight, X, Sparkles } from "lucide-react";

/**
 * 🤖 TACTICAL AI ASSISTANT
 * Provides real-time mission insights with a typewriter effect.
 */
export default function AssistantBubble({ message }) {
  const [isOpen, setIsOpen] = useState(true); 
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // ⌨️ TYPEWRITER LOGIC
  useEffect(() => {
    if (!message) return;
    
    setIsOpen(true); // Auto-open on new message to grab attention
    setDisplayedText("");
    setIsTyping(true);
    
    let i = 0;
    const speed = 25; // Faster typing for tactical feel

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
    <div className="w-full relative z-30">
      <AnimatePresence mode="wait">
        
        {isOpen ? (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "circOut" }}
            className="w-full bg-[#050b14]/90 border border-cyan-500/30 rounded-2xl p-0 backdrop-blur-xl relative overflow-hidden shadow-2xl"
          >
            {/* 1. ATMOSPHERE */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-80" />
            <div className="absolute inset-0 scanlines opacity-10 pointer-events-none" />
            
            {/* 2. HEADER */}
            <div className="flex justify-between items-center p-4 bg-cyan-950/20 border-b border-cyan-500/10">
              <div className="flex items-center gap-3">
                {/* AI Avatar */}
                <div className="relative">
                  <div className="w-10 h-10 rounded-lg bg-cyan-900/40 border border-cyan-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.1)]">
                    <Bot size={20} className="text-cyan-400" />
                  </div>
                  {/* Status Indicator */}
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isTyping ? "bg-cyan-400" : "bg-emerald-400"}`}></span>
                    <span className={`relative inline-flex rounded-full h-3 w-3 ${isTyping ? "bg-cyan-500" : "bg-emerald-500"}`}></span>
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white tracking-widest uppercase flex items-center gap-2">
                    CORTEX AI
                    {isTyping && <span className="text-[10px] text-cyan-400 font-mono animate-pulse">PROCESSING...</span>}
                  </h4>
                  <div className="flex items-center gap-1.5 opacity-60">
                     <Cpu size={10} className="text-cyan-300" />
                     <p className="text-[10px] text-cyan-300 font-mono uppercase tracking-wider">
                       Link Established
                     </p>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-md hover:bg-white/10 text-slate-500 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* 3. TERMINAL CONTENT */}
            <div className="p-4 relative">
              <div className="relative z-10 bg-black/40 rounded-lg p-4 border border-white/5 min-h-[80px] font-mono text-sm leading-relaxed shadow-inner">
                {/* Grid Pattern inside terminal */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                
                <p className="relative z-10 text-cyan-100/90">
                  <span className="text-cyan-500 font-bold mr-2">{">"}</span>
                  {displayedText || "Awaiting neural telemetry..."}
                  <motion.span 
                    animate={{ opacity: [0, 1, 0] }} 
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="inline-block w-2 h-4 bg-cyan-500 ml-1 align-middle shadow-[0_0_8px_#22d3ee]" 
                  />
                </p>
              </div>
            </div>

            {/* 4. FOOTER */}
            <div className="px-4 pb-3 flex justify-between items-center opacity-50">
               <div className="flex gap-1">
                 {[1,2,3].map(i => <div key={i} className="w-1 h-1 bg-cyan-500 rounded-full" />)}
               </div>
               <span className="text-[9px] text-cyan-500 font-mono tracking-widest uppercase">
                 SECURE CHANNEL v9.0
               </span>
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
            className="group w-full flex items-center justify-between bg-[#050b14]/90 border border-cyan-500/30 rounded-xl px-4 py-3 shadow-lg hover:border-cyan-400/60 transition-colors backdrop-blur-md"
          >
             <div className="flex items-center gap-3">
               <div className="p-1.5 bg-cyan-500/10 rounded-md border border-cyan-500/20 group-hover:border-cyan-500/50">
                 <Sparkles size={16} className="text-cyan-400" />
               </div>
               <div className="flex flex-col items-start">
                 <span className="text-xs font-bold text-white tracking-wide">AI ALERTS</span>
                 <span className="text-[10px] text-slate-400 font-mono">1 New Insight Available</span>
               </div>
             </div>
             <ChevronRight size={16} className="text-cyan-500 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        )}

      </AnimatePresence>
    </div>
  );
}