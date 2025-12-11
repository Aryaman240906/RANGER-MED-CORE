// src/pages/DemoMode.jsx
import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Activity, Terminal, ShieldAlert, ChevronLeft, 
  PlayCircle, RotateCcw, Cpu, Radio, Zap 
} from "lucide-react";
import { Link } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// --- STORES ---
import { useDemoStore } from "../store/demoStore";
import { useTutorialStore } from "../store/tutorialStore";

// --- COMPONENTS ---
import ScenarioSlider from "../components/demo/ScenarioSlider";
import DemoControls from "../components/demo/DemoControls"; // 👈 UPDATED
import BottomTabNav from "../components/global/BottomTabNav";
import TutorialOverlay from "../components/tutorial/TutorialOverlay";
import ConfettiListener from "../components/global/Confetti";
import DemoBanner from "../components/demo/DemoBanner"; // 👈 NEW: Persistent Banner

// --- ANIMATION VARIANTS ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

/**
 * 🧪 SIMULATION DECK (SANDBOX)
 * A safe environment to test physics, stress-test the UI, and replay tutorials.
 */
export default function DemoMode() {
  const { 
    stability, readiness, riskScore, confidence, 
    events, assistantMessage, resetSimulation, running, speed 
  } = useDemoStore();
  
  const { showForUser, openTutorial } = useTutorialStore();
  const logEndRef = useRef(null);

  // --- 1. TUTORIAL TRIGGER ---
  useEffect(() => {
    const t = setTimeout(() => {
      showForUser('demo', { mode: 'always' });
    }, 600);
    return () => clearTimeout(t);
  }, [showForUser]);

  // Auto-scroll logs
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [events]);

  return (
    <div className="min-h-screen bg-[#050b14] relative overflow-hidden flex flex-col p-4 md:p-6 pb-28">
      
      {/* 1. ATMOSPHERE */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 hero-grid opacity-20" />
        <div className="absolute inset-0 scanlines opacity-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.05),transparent_60%)]" />
      </div>

      {/* Global Overlays */}
      <ConfettiListener />
      <TutorialOverlay />
      <Toaster position="top-right" />
      <DemoBanner /> {/* 👈 Persistent Status Indicator */}

      {/* 2. MAIN CONTENT */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-7xl mx-auto flex flex-col gap-6 pt-12"
      >
        
        {/* --- HEADER --- */}
        <header 
          data-tour="demo-exit" 
          className="flex items-center justify-between pb-6 border-b border-amber-500/20"
        >
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="p-2 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-400 text-slate-400 hover:text-cyan-400 transition-all">
              <ChevronLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl font-black text-white tracking-widest uppercase drop-shadow-md">
                Simulation Deck
              </h1>
              <div className="flex items-center gap-2 text-[10px] font-mono text-amber-500/80 uppercase tracking-widest">
                <span>Physics Engine Diagnostic</span>
                {running ? (
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                ) : (
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                )}
              </div>
            </div>
          </div>
          
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded bg-amber-950/30 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold tracking-widest">
            <Terminal size={14} />
            SANDBOX ENVIRONMENT
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
          
          {/* LEFT COL: CONTROL MATRIX */}
          <div className="flex flex-col gap-6">
            
            {/* Scenarios */}
            <motion.section 
              variants={itemVariants}
              data-tour="demo-scenarios" 
              className="space-y-3"
            >
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Activity size={14} /> Risk Profiles
              </h2>
              <ScenarioSlider />
            </motion.section>

            {/* Time Dilation */}
            <motion.section 
              variants={itemVariants}
              data-tour="demo-controls" 
              className="space-y-3"
            >
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <ClockIcon /> Temporal Controls
              </h2>
              {/* Uses the new unified panel */}
              <DemoControlsPanel /> 
            </motion.section>

            {/* AI Debugger */}
            <motion.section 
              variants={itemVariants}
              className="p-4 rounded-xl bg-slate-900/60 border border-purple-500/20 backdrop-blur-md relative overflow-hidden min-h-[100px] flex flex-col justify-center"
            >
               <div className="absolute top-0 left-0 w-1 h-full bg-purple-500/50" />
               <h2 className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                 <Cpu size={12} /> AI Cortex Output
               </h2>
               <div className="font-mono text-xs text-purple-100/90 leading-relaxed">
                 <span className="text-purple-500 mr-2">{">"}</span>
                 {assistantMessage || "Awaiting neural telemetry input..."}
                 <span className="inline-block w-1.5 h-3 bg-purple-500 ml-1 animate-pulse" />
               </div>
            </motion.section>

            {/* Action Bar */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => openTutorial('demo', { mode: 'always' })}
                className="flex items-center justify-center gap-2 py-3 rounded-lg border border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-xs font-bold text-slate-300 uppercase tracking-wider transition-all hover:border-white/20"
              >
                <PlayCircle size={16} /> Replay Briefing
              </button>
              <button 
                onClick={resetSimulation}
                className="flex items-center justify-center gap-2 py-3 rounded-lg border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-xs font-bold text-red-400 uppercase tracking-wider transition-all"
              >
                <RotateCcw size={16} /> Reset Physics
              </button>
            </motion.div>
          </div>

          {/* RIGHT COL: TELEMETRY & LOGS */}
          <div className="flex flex-col gap-6">
             
             {/* Live Data Grid */}
             <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
                <DataCard label="Stability" value={Math.round(stability) + "%"} color="cyan" trend={stability > 50 ? 'up' : 'down'} />
                <DataCard label="Readiness" value={Math.round(readiness) + "%"} color="blue" />
                <DataCard label="Risk Score" value={Math.round(riskScore)} color="red" trend={riskScore > 50 ? 'up' : 'down'} />
                <DataCard label="Confidence" value={Math.round(confidence) + "%"} color="emerald" />
             </motion.div>

             {/* Event Stream */}
             <motion.div 
                variants={itemVariants}
                data-tour="timeline" 
                className="flex-1 bg-[#020617] border border-slate-800 rounded-xl overflow-hidden min-h-[300px] flex flex-col shadow-inner relative"
             >
                {/* Scanline Overlay */}
                <div className="absolute inset-0 scanlines opacity-5 pointer-events-none" />
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500/50 via-transparent to-transparent" />
                
                {/* Header */}
                <div className="p-3 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center relative z-10">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Terminal size={12} /> Event Stream Log
                  </span>
                  <div className="flex gap-1.5 items-center">
                    <span className={`w-1.5 h-1.5 rounded-full ${running ? "bg-emerald-500 animate-pulse" : "bg-slate-600"}`} />
                    <span className={`text-[9px] font-mono ${running ? "text-emerald-500" : "text-slate-500"}`}>
                      {running ? `LIVE (${speed}x)` : "PAUSED"}
                    </span>
                  </div>
                </div>

                {/* Log Body */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-[10px] md:text-xs">
                  {events.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center opacity-30 text-slate-500">
                      <Radio size={32} className="mb-2" />
                      <p>NO SIGNAL DETECTED</p>
                    </div>
                  )}
                  
                  <AnimatePresence initial={false}>
                    {events.map((ev) => (
                      <motion.div 
                        key={ev.id}
                        initial={{ opacity: 0, x: -10, height: 0 }}
                        animate={{ opacity: 1, x: 0, height: "auto" }}
                        className={`flex gap-3 pb-2 border-b border-slate-800/30 ${
                          ev.type === 'danger' ? 'text-red-400' : 
                          ev.type === 'warning' ? 'text-amber-400' : 
                          ev.type === 'dose' ? 'text-cyan-300' :
                          ev.type === 'success' ? 'text-emerald-400' : 'text-slate-400'
                        }`}
                      >
                        <span className="opacity-40 select-none w-16 shrink-0">
                          [{new Date(ev.timestamp).toLocaleTimeString([], {hour12: false, hour:'2-digit', minute:'2-digit', second:'2-digit'})}]
                        </span>
                        <div className="flex flex-col">
                           <span className="font-bold">{ev.type === 'danger' && '⚠ '}{ev.label}</span>
                           {ev.description && <span className="opacity-50 text-[9px]">{ev.description}</span>}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  <div ref={logEndRef} />
                </div>
             </motion.div>
          </div>

        </div>
      </motion.div>

      {/* Navigation */}
      <BottomTabNav />

    </div>
  );
}

// Helper: Mini Data Widget
const DataCard = ({ label, value, color, trend }) => {
  const colors = {
    cyan: "text-cyan-400 border-cyan-500/30 bg-cyan-950/20 shadow-cyan-500/10",
    blue: "text-blue-400 border-blue-500/30 bg-blue-950/20 shadow-blue-500/10",
    red: "text-red-400 border-red-500/30 bg-red-950/20 shadow-red-500/10",
    emerald: "text-emerald-400 border-emerald-500/30 bg-emerald-950/20 shadow-emerald-500/10",
  };

  return (
    <div className={`p-4 rounded-xl border flex flex-col items-center justify-center shadow-lg backdrop-blur-sm ${colors[color] || colors.cyan}`}>
      <span className="text-3xl font-bold font-mono tracking-tighter drop-shadow-sm flex items-center gap-1">
        {value}
        {trend && (
           <span className="text-sm opacity-50">{trend === 'up' ? '▲' : '▼'}</span>
        )}
      </span>
      <span className="text-[9px] uppercase opacity-70 mt-1 font-bold tracking-widest">{label}</span>
    </div>
  );
};

// Helper Icon
const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
);