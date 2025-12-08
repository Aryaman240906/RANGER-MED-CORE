// src/pages/LogPage.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Activity, ClipboardPlus, Stethoscope, FileText } from "lucide-react";
import { Toaster } from "react-hot-toast";

// --- STORES ---
import { useDemoStore } from "../store/demoStore";
import { useAuthStore } from "../store/authStore";
import { useTutorialStore } from "../store/tutorialStore"; // 👈 NEW

// --- COMPONENTS ---
import BioScanForm from "../components/log/BioScanForm";
import DiagnosticsPanel from "../components/log/DiagnosticsPanel";
import AssistantBubble from "../components/ranger/AssistantBubble";
import TutorialOverlay from "../components/tutorial/TutorialOverlay"; // 👈 NEW
import ConfettiListener from "../components/global/Confetti";

// --- ANIMATION VARIANTS ---
const pageVariants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.5, ease: "circOut", staggerChildren: 0.15 }
  },
  exit: { opacity: 0, scale: 0.98 }
};

const panelVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
};

/**
 * 📝 LOG PAGE (BIO-DIAGNOSTICS)
 * Interface for logging symptoms, viewing biological trends, and receiving AI triage.
 */
export default function LogPage() {
  const { user } = useAuthStore();
  const { events, demoMode } = useDemoStore();
  const showTutorial = useTutorialStore((s) => s.showForUser); // 👈 NEW
  
  // Compute recent symptom context for the assistant
  const [assistantMessage, setAssistantMessage] = useState("Diagnostics Module Initialized. Awaiting Input.");

  // --- 1. TUTORIAL TRIGGER ---
  useEffect(() => {
    const t = setTimeout(() => {
      showTutorial('log', { mode: demoMode ? 'always' : 'once' });
    }, 500);
    return () => clearTimeout(t);
  }, [demoMode, showTutorial]);

  // --- 2. ASSISTANT LOGIC ---
  useEffect(() => {
    const lastSymptom = events.find(e => e.type === 'symptom');
    if (lastSymptom) {
      if (lastSymptom.severity > 7) {
        setAssistantMessage(`CRITICAL: ${lastSymptom.symptom} detected at high severity. Rest protocols advised immediately.`);
      } else if (lastSymptom.severity > 4) {
        setAssistantMessage(`Analysis: ${lastSymptom.symptom} recorded. Monitor vitals for escalation.`);
      } else {
        setAssistantMessage("Minor anomaly logged. Systems nominal.");
      }
    }
  }, [events]);

  return (
    <div className="min-h-screen bg-[#050b14] relative overflow-hidden flex flex-col p-4 md:p-6 lg:p-8">
      
      {/* 1. ATMOSPHERE */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 hero-grid opacity-10" />
        <div className="absolute inset-0 scanlines opacity-5" />
        {/* Bio-tinted background gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.05),transparent_80%)]" />
      </div>

      {/* Global Overlays */}
      <ConfettiListener />
      <TutorialOverlay /> {/* 👈 Tutorial Layer */}
      <Toaster position="top-right" />

      {/* 2. MAIN CONTENT GRID */}
      <motion.div 
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="relative z-10 w-full max-w-7xl mx-auto flex flex-col gap-6"
      >
        
        {/* --- HEADER HUD --- */}
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-emerald-500/20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-900/20 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.1)]">
              <ClipboardPlus size={24} className="text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-widest uppercase drop-shadow-md">
                Bio-Diagnostics
              </h1>
              <div className="flex items-center gap-3 text-[10px] font-mono text-emerald-500/70 uppercase tracking-[0.2em]">
                <span>Subject: {user?.name || "Ranger"}</span>
                <span className="w-1 h-1 bg-emerald-500 rounded-full" />
                <span>Scanner: Active</span>
              </div>
            </div>
          </div>

          {/* Quick Stat */}
          <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-black/40 border border-slate-700/50 backdrop-blur-md">
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Health Status</span>
              <span className="text-xl font-mono font-bold text-cyan-400 leading-none">
                OPTIMAL
              </span>
            </div>
            <Activity size={28} className="text-cyan-500 opacity-80" />
          </div>
        </header>


        {/* --- WORKSPACE --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
          
          {/* LEFT COLUMN: INPUT TERMINAL (40%) */}
          <motion.div 
            variants={panelVariants} 
            className="lg:col-span-5 flex flex-col gap-6"
          >
            <div 
              data-tour="log-severity" // 👈 Tutorial Target (Scanning Interface)
              className="bg-slate-900/60 border border-slate-700/50 backdrop-blur-xl rounded-2xl p-1 relative overflow-hidden shadow-2xl"
            >
               {/* Decorative Header Bar */}
               <div className="h-1 w-full bg-gradient-to-r from-emerald-500/50 via-cyan-500/50 to-transparent absolute top-0 left-0" />
               <BioScanForm />
            </div>

            {/* AI Assistant Context */}
            <div className="hidden lg:block">
              <AssistantBubble message={assistantMessage} />
            </div>
          </motion.div>


          {/* RIGHT COLUMN: DIAGNOSTICS & TRENDS (60%) */}
          <motion.div 
            variants={panelVariants} 
            className="lg:col-span-7 flex flex-col h-full min-h-[500px]"
          >
            <div 
              data-tour="log-diagnostics" // 👈 Tutorial Target (Analysis Panel)
              className="flex-1 bg-slate-900/60 border border-slate-700/50 backdrop-blur-xl rounded-2xl overflow-hidden relative shadow-lg flex flex-col"
            >
              
              <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
                <div className="flex items-center gap-2">
                  <Stethoscope size={16} className="text-emerald-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-widest">System Analysis</span>
                </div>
                <div className="flex items-center gap-2 px-2 py-1 rounded bg-black/40 border border-white/10">
                  <FileText size={12} className="text-emerald-400" />
                  <span className="text-[10px] font-mono text-slate-400">HISTORY</span>
                </div>
              </div>

              {/* The Diagnostics Panel Component */}
              <div className="flex-1 relative overflow-hidden p-4">
                <DiagnosticsPanel />
              </div>

            </div>
          </motion.div>

        </div>
      </motion.div>
    </div>
  );
}