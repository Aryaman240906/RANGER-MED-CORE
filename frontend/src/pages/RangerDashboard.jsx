// src/pages/RangerDashboard.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";
import { Beaker, Terminal, Radio } from "lucide-react";

// --- STORES ---
import { useDemoStore } from "../store/demoStore";
import { useTutorialStore } from "../store/tutorialStore";

// --- COMPONENTS ---
import Dashboard from "../components/ranger/Dashboard";
import BottomTabNav from "../components/global/BottomTabNav";
import ScenarioSlider from "../components/demo/ScenarioSlider";

// 👇 FIX: Import 'HeroAnimation' and rename it to 'DemoControlsPanel' for use in this file
// Note: This matches the default export from your new HeroAnimation file.
import DemoControlsPanel from "../components/landing/HeroAnimation"; 

import DemoBanner from "../components/demo/DemoBanner";
import IntroAnimation from "../components/global/IntroAnimation";
import ConfettiListener from "../components/global/Confetti";
import TutorialOverlay from "../components/tutorial/TutorialOverlay";

const RangerDashboard = () => {
  // Intro State
  const [showIntro, setShowIntro] = useState(true);

  // Store Access
  const demoMode = useDemoStore((s) => s.demoMode);
  const toggleDemoMode = useDemoStore((s) => s.toggleDemoMode);
  const showTutorial = useTutorialStore((s) => s.showForUser);

  // --- 1. SEQUENCE ORCHESTRATOR ---
  // Called when the Intro Animation finishes (approx 3-4s)
  const handleIntroComplete = () => {
    setShowIntro(false);
    
    // Launch Briefing (Tutorial) after a beat
    setTimeout(() => {
      showTutorial('dashboard', { mode: demoMode ? 'always' : 'once' });
    }, 800);
  };

  // --- 2. SYNC LISTENER ---
  useEffect(() => {
    const handleSync = (e) => {
      if (e.detail?.type === "synced") {
        toast.success(
          <div className="flex flex-col">
            <span className="font-bold text-xs uppercase tracking-widest">Uplink Established</span>
            <span className="text-[10px] opacity-80 font-mono">Telemetry Synced with Command</span>
          </div>,
          { 
            id: "sync-success", 
            icon: "📡",
            style: { background: "#050b14", border: "1px solid #22d3ee", color: "#22d3ee" }
          }
        );
      }
    };
    window.addEventListener("syncworker", handleSync);
    return () => window.removeEventListener("syncworker", handleSync);
  }, []);

  return (
    <div className="min-h-screen bg-[#050b14] relative overflow-hidden pb-28">
      
      {/* 👂 GLOBAL LAYERS */}
      <ConfettiListener /> 
      <TutorialOverlay /> 
      <DemoBanner /> {/* 👈 Persistent Simulation Status */}

      {/* 🎬 INTRO ANIMATION */}
      <AnimatePresence>
        {showIntro && <IntroAnimation onComplete={handleIntroComplete} />}
      </AnimatePresence>

      {/* --- BACKGROUND ATMOSPHERE --- */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.15),_transparent_70%)]" />
        <div className="absolute inset-0 hero-grid opacity-20" />
        <div className="absolute inset-0 scanlines opacity-10" />
      </div>

      {/* --- CONTENT CONTAINER --- */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showIntro ? 0 : 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-10 max-w-7xl mx-auto px-4 pt-12" // Increased pt for banner
      >
        
        {/* --- TOP BAR: COMMAND HEADER --- */}
        <div className="flex justify-between items-center mb-6">
           {/* Branding */}
           <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-2 h-8 bg-cyan-500 rounded-full shadow-[0_0_10px_#22d3ee]" />
                <div className="absolute top-0 w-2 h-8 bg-cyan-400 blur-md animate-pulse" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-white tracking-widest uppercase leading-none">
                  Command <span className="text-cyan-400">Deck</span>
                </h1>
                <p className="text-[9px] font-mono text-slate-500 tracking-[0.3em] mt-1">
                  UNIT MONITORING ONLINE
                </p>
              </div>
           </div>

           {/* Simulation Toggle */}
           <button
             onClick={toggleDemoMode}
             data-tour="demo-toggle" 
             className={`
               group relative overflow-hidden flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-wider transition-all duration-300
               ${demoMode 
                 ? "bg-amber-900/20 border-amber-500/50 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]" 
                 : "bg-slate-900/50 border-slate-700 text-slate-500 hover:border-cyan-500/50 hover:text-cyan-400"
               }
             `}
           >
             {demoMode ? <Terminal size={14} /> : <Beaker size={14} />}
             <span className="relative z-10">
               {demoMode ? "Sim Protocol Active" : "Enable Simulation"}
             </span>
             
             {/* Active Indicator */}
             {demoMode && (
               <span className="flex h-2 w-2 relative ml-1">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
               </span>
             )}
           </button>
        </div>

        {/* --- DEMO DRAWER (Collapsible) --- */}
        <AnimatePresence>
          {demoMode && (
            <motion.div
              initial={{ height: 0, opacity: 0, marginBottom: 0 }}
              animate={{ height: "auto", opacity: 1, marginBottom: 24 }}
              exit={{ height: 0, opacity: 0, marginBottom: 0 }}
              transition={{ duration: 0.4, ease: "circOut" }}
              className="overflow-hidden"
            >
              <div className="p-1 rounded-2xl bg-gradient-to-r from-amber-500/20 via-transparent to-amber-500/20">
                <div className="p-5 rounded-xl bg-[#0a1020] border border-amber-500/30 relative overflow-hidden">
                  {/* Stripes Texture */}
                  <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #f59e0b 0, #f59e0b 1px, transparent 0, transparent 50%)', backgroundSize: '10px 10px' }} />
                  
                  <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                    <div className="space-y-1">
                      <h3 className="text-amber-400 font-bold tracking-widest text-sm flex items-center gap-2">
                        <Radio size={16} className="animate-pulse" />
                        SIMULATION CONTROLS
                      </h3>
                      <p className="text-[10px] font-mono text-amber-500/60">
                        Adjust parameters to stress-test system resilience. Data is local to this session.
                      </p>
                    </div>
                    
                    <div className="flex flex-col gap-4">
                      {/* Integrated Control Panel */}
                      <DemoControlsPanel />
                      <ScenarioSlider />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- MAIN DASHBOARD VISUALIZATION --- */}
        <Dashboard isDemoMode={demoMode} />

      </motion.div>

      {/* --- NAVIGATION DECK --- */}
      <BottomTabNav />

      {/* --- NOTIFICATIONS --- */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "rgba(5, 11, 20, 0.95)",
            color: "#e0faff",
            border: "1px solid rgba(34,211,238,0.2)",
            borderRadius: "12px",
            backdropFilter: "blur(12px)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
            fontSize: "13px",
            fontFamily: "monospace",
          },
        }}
      />
    </div>
  );
};

export default RangerDashboard;