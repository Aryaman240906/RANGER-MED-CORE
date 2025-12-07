// src/pages/DosePage.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Pill, Activity, ShieldCheck, History, Terminal } from "lucide-react";
import { Toaster } from "react-hot-toast";

// --- STORES & SERVICES ---
import { useDemoStore } from "../store/demoStore";
import { useAuthStore } from "../store/authStore";

// --- COMPONENTS ---
import DoseConsole from "../components/dose/DoseConsole";
import CapsuleHistoryTable from "../components/dose/CapsuleHistoryTable";
import ConfettiListener from "../components/global/Confetti"; 
import AssistantBubble from "../components/ranger/AssistantBubble";

// --- ANIMATION VARIANTS ---
const pageVariants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.6, ease: "circOut", staggerChildren: 0.1 }
  },
  exit: { opacity: 0, scale: 0.98 }
};

const panelVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
};

/**
 * 💊 CAPSULE COMMAND DECK
 * The central hub for medication intake, streak tracking, and dosage history.
 */
export default function DosePage() {
  const { user } = useAuthStore();
  const { doseStreak, stability } = useDemoStore();
  
  // Local state for UI feedback
  const [assistantMessage, setAssistantMessage] = useState("");

  // Determine Assist Message based on stability/streak
  useEffect(() => {
    if (stability < 50) {
      setAssistantMessage("WARNING: Neural stability critical. Immediate dosage recommended.");
    } else if (doseStreak > 3) {
      setAssistantMessage(`Streak Active: ${doseStreak} Days. Keep momentum, Ranger.`);
    } else {
      setAssistantMessage("Capsule Systems Online. Ready for intake.");
    }
  }, [stability, doseStreak]);

  return (
    <div className="min-h-screen bg-[#050b14] relative overflow-hidden flex flex-col p-4 md:p-6 lg:p-8">
      
      {/* 1. ATMOSPHERE LAYERS */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 hero-grid opacity-20" />
        <div className="absolute inset-0 scanlines opacity-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.08),transparent_70%)]" />
      </div>

      {/* Global Event Listeners */}
      <ConfettiListener /> 
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
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-cyan-500/20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-900/20 border border-cyan-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.1)]">
              <Pill size={24} className="text-cyan-400" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-widest uppercase drop-shadow-md">
                Capsule Console
              </h1>
              <div className="flex items-center gap-3 text-[10px] font-mono text-cyan-500/70 uppercase tracking-[0.2em]">
                <span>Unit: {user?.name || "Ranger"}</span>
                <span className="w-1 h-1 bg-cyan-500 rounded-full" />
                <span>Sys: v9.2</span>
              </div>
            </div>
          </div>

          {/* Streak Badge */}
          <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-black/40 border border-slate-700/50 backdrop-blur-md">
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Current Streak</span>
              <span className="text-xl font-mono font-bold text-emerald-400 leading-none">
                {doseStreak} <span className="text-xs text-emerald-600">DAYS</span>
              </span>
            </div>
            <ShieldCheck size={28} className="text-emerald-500 opacity-80" />
          </div>
        </header>


        {/* --- WORKSPACE --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
          
          {/* LEFT COLUMN: INTERACTIVE CONSOLE (40% width on large) */}
          <motion.div 
            variants={panelVariants} 
            className="lg:col-span-5 flex flex-col gap-6"
          >
            {/* The Main Action Panel */}
            <DoseConsole />

            {/* AI Assistant Context */}
            <div className="hidden lg:block">
              <AssistantBubble message={assistantMessage} />
            </div>
          </motion.div>


          {/* RIGHT COLUMN: DATA LOGS (60% width on large) */}
          <motion.div 
            variants={panelVariants} 
            className="lg:col-span-7 flex flex-col h-full min-h-[500px]"
          >
            <div className="flex-1 bg-slate-900/60 border border-slate-700/50 backdrop-blur-xl rounded-2xl overflow-hidden relative shadow-lg flex flex-col">
              
              {/* Table Header Decoration */}
              <div className="h-1 w-full bg-gradient-to-r from-cyan-500/50 via-blue-500/50 to-transparent" />
              
              <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
                <div className="flex items-center gap-2">
                  <History size={16} className="text-cyan-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-widest">Intake History</span>
                </div>
                <div className="flex items-center gap-2 px-2 py-1 rounded bg-black/40 border border-white/10">
                  <Activity size={12} className="text-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-mono text-slate-400">SYNCED</span>
                </div>
              </div>

              {/* The History Table Component */}
              <div className="flex-1 relative overflow-hidden">
                <CapsuleHistoryTable />
              </div>

              {/* Footer Decoration */}
              <div className="p-2 bg-black/40 border-t border-white/5 flex justify-between items-center text-[9px] font-mono text-slate-600 uppercase tracking-wider">
                <span>Secure Log: Encrypted</span>
                <Terminal size={10} />
              </div>
            </div>
          </motion.div>

        </div>
      </motion.div>
    </div>
  );
}