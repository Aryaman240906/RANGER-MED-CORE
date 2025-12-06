// src/pages/RangerDashboard.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";
import { Beaker, Power, Terminal } from "lucide-react";

// Stores
import { useDemoStore } from "../store/demoStore";

// Components
import Dashboard from "../components/ranger/Dashboard";
import BottomTabNav from "../components/global/BottomTabNav";
import MobileDoseModal from "../components/ranger/MobileDoseModal";
import MobileSymptomModal from "../components/ranger/MobileSymptomModal";
import ScenarioSlider from "../components/demo/ScenarioSlider";
import DemoControls from "../components/demo/DemoControls";
import IntroAnimation from "../components/global/IntroAnimation";
import ConfettiListener from "../components/global/Confetti"; // 👈 NEW IMPORT

const RangerDashboard = () => {
  // Mobile Modal State
  const [doseOpen, setDoseOpen] = useState(false);
  const [symOpen, setSymOpen] = useState(false);

  // Intro Animation State (Default true to show on load)
  const [showIntro, setShowIntro] = useState(true);

  // Demo Store Access
  const demoMode = useDemoStore((s) => s.demoMode);
  const toggleDemoMode = useDemoStore((s) => s.toggleDemoMode);

  // Listener for Sync Worker events (Offline Sync)
  useEffect(() => {
    const handleSync = (e) => {
      if (e.detail?.type === "synced") {
        toast.success("Data synced with Command.", { id: "sync-success" });
      }
    };
    window.addEventListener("syncworker", handleSync);
    return () => window.removeEventListener("syncworker", handleSync);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden pb-28">
      
      {/* 👂 GLOBAL EVENT LISTENERS */}
      <ConfettiListener /> {/* Triggers fireworks on milestones */}

      {/* 🎬 INTRO ANIMATION OVERLAY */}
      {showIntro && <IntroAnimation onComplete={() => setShowIntro(false)} />}

      {/* --- BACKGROUND LAYERS --- */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.15),_rgba(2,6,23,1))]" />
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.18]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%2322d3ee' stroke-opacity='0.08' stroke-width='1'%3E%3Ccircle cx='30' cy='30' r='20'/%3E%3Ccircle cx='30' cy='30' r='10'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* --- CONTENT CONTAINER --- */}
      <motion.div
        // Delay entrance slightly to wait for intro to finish
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 3.5, ease: "easeOut" }}
        className="relative z-10 max-w-7xl mx-auto px-4 pt-6"
      >
        
        {/* --- TOP BAR: DEMO TOGGLE --- */}
        <div className="flex justify-between items-center mb-6">
           {/* Left: Branding */}
           <div className="flex items-center gap-2">
              <div className="w-2 h-8 bg-cyan-500 rounded-full shadow-[0_0_10px_#22d3ee]" />
              <h1 className="text-xl font-bold text-white tracking-widest uppercase hidden sm:block">
                Command <span className="text-cyan-400">Deck</span>
              </h1>
           </div>

           {/* Right: Simulation Toggle */}
           <button
             onClick={toggleDemoMode}
             className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-wider transition-all duration-300
               ${demoMode 
                 ? "bg-amber-500/10 border-amber-500 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]" 
                 : "bg-slate-900/50 border-slate-700 text-slate-500 hover:border-cyan-500/50 hover:text-cyan-400"
               }
             `}
           >
             {demoMode ? <Terminal size={14} /> : <Beaker size={14} />}
             {demoMode ? "Sim Protocol Active" : "Enable Simulation"}
             {demoMode && <span className="flex w-2 h-2 bg-amber-500 rounded-full animate-pulse ml-1" />}
           </button>
        </div>

        {/* --- DEMO CONTROLS DRAWER --- */}
        <AnimatePresence>
          {demoMode && (
            <motion.div
              initial={{ height: 0, opacity: 0, marginBottom: 0 }}
              animate={{ height: "auto", opacity: 1, marginBottom: 24 }}
              exit={{ height: 0, opacity: 0, marginBottom: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-amber-500/20 backdrop-blur-xl relative">
                {/* Decorative Hazard Strip */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <ScenarioSlider />
                  </div>
                  <div className="space-y-2">
                    <DemoControls />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- MAIN DASHBOARD GRID --- */}
        <Dashboard isDemoMode={demoMode} />

      </motion.div>

      {/* --- MOBILE OVERLAYS & NAV --- */}
      <MobileDoseModal open={doseOpen} onClose={() => setDoseOpen(false)} />
      <MobileSymptomModal open={symOpen} onClose={() => setSymOpen(false)} />

      <BottomTabNav 
        onOpenDose={() => setDoseOpen(true)} 
        onOpenSymptom={() => setSymOpen(true)} 
      />

      {/* --- TOAST NOTIFICATIONS --- */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "rgba(15,23,42,0.95)",
            color: "#e0faff",
            border: "1px solid rgba(34,211,238,0.2)",
            borderRadius: "12px",
            backdropFilter: "blur(12px)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
            fontSize: "13px",
          },
        }}
      />
    </div>
  );
};

export default RangerDashboard;