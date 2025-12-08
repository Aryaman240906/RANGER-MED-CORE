// src/pages/AlertsPage.jsx
import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldAlert, Radio, CheckCircle2, 
  Trash2, Filter, AlertTriangle 
} from "lucide-react";
import { Toaster } from "react-hot-toast";

// --- STORES ---
import { useDemoStore } from "../store/demoStore";
import { useTutorialStore } from "../store/tutorialStore"; // 👈 NEW

// --- COMPONENTS ---
import AlertCenter from "../components/alerts/AlertCenter";
import AlertDetailModal from "../components/alerts/AlertDetailModal";
import AssistantBubble from "../components/ranger/AssistantBubble";
import TutorialOverlay from "../components/tutorial/TutorialOverlay"; // 👈 NEW
import ConfettiListener from "../components/global/Confetti";

// --- ANIMATION VARIANTS ---
const pageVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { staggerChildren: 0.1 }
  },
  exit: { opacity: 0 }
};

/**
 * 🚨 ALERTS PAGE (MISSION CONTROL)
 * Central command for reviewing system warnings, anomalies, and directives.
 */
export default function AlertsPage() {
  const { alerts, alertsUnacknowledged, demoMode } = useDemoStore();
  const showTutorial = useTutorialStore((s) => s.showForUser);
  
  // Local State
  const [filter, setFilter] = useState("all"); // all, critical, warning, info
  const [selectedAlertId, setSelectedAlertId] = useState(null);

  // --- 1. TUTORIAL TRIGGER ---
  useEffect(() => {
    // Delay slightly to allow the "Mission Control" animations to settle
    const t = setTimeout(() => {
      showTutorial('alerts', { mode: demoMode ? 'always' : 'once' });
    }, 500);
    return () => clearTimeout(t);
  }, [demoMode, showTutorial]);

  // --- DERIVED STATE ---
  const filteredAlerts = useMemo(() => {
    if (filter === "all") return alerts;
    return alerts.filter(a => a.severity === filter);
  }, [alerts, filter]);

  const activeAlert = alerts.find(a => a.id === selectedAlertId);

  // --- ASSISTANT CONTEXT ---
  const assistantMessage = useMemo(() => {
    if (alertsUnacknowledged > 0) {
      return `ATTENTION: ${alertsUnacknowledged} unacknowledged alerts require immediate review.`;
    }
    return "All systems nominal. Monitoring secure channels.";
  }, [alertsUnacknowledged]);

  return (
    <div className="min-h-screen bg-[#050b14] relative overflow-hidden flex flex-col p-4 md:p-6 lg:p-8">
      
      {/* 1. ATMOSPHERE */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 hero-grid opacity-20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(239,68,68,0.05),transparent_60%)]" />
      </div>

      {/* Global Overlays */}
      <ConfettiListener />
      <TutorialOverlay /> {/* 👈 Tutorial Layer */}
      <Toaster position="top-right" />

      {/* 2. MAIN CONTENT */}
      <motion.div 
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="relative z-10 w-full max-w-6xl mx-auto flex flex-col gap-6 h-full"
      >
        
        {/* --- HEADER --- */}
        <header className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 pb-4 border-b border-red-500/20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-900/20 border border-red-500/30 flex items-center justify-center relative overflow-hidden shadow-[0_0_20px_rgba(239,68,68,0.2)]">
              <ShieldAlert size={24} className="text-red-500 z-10 relative" />
              <div className="absolute inset-0 bg-red-500/10 animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-widest uppercase drop-shadow-md flex items-center gap-3">
                Mission Control
                {alertsUnacknowledged > 0 && (
                  <span className="text-[10px] bg-red-500 text-black px-2 py-0.5 rounded font-bold animate-pulse">
                    {alertsUnacknowledged} NEW
                  </span>
                )}
              </h1>
              <div className="flex items-center gap-2 text-[10px] font-mono text-red-400/80 uppercase tracking-widest">
                <Radio size={12} className="animate-pulse" />
                <span>Scanning Frequencies...</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            {["all", "critical", "warning"].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`
                  px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-wider transition-all
                  ${filter === f 
                    ? "bg-red-500 text-black border-red-500 shadow-lg shadow-red-500/20" 
                    : "bg-black/40 border-slate-800 text-slate-500 hover:text-white hover:border-slate-600"
                  }
                `}
              >
                {f}
              </button>
            ))}
          </div>
        </header>

        {/* --- ALERT LIST --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          
          {/* LEFT: LIST FEED (2/3 width) */}
          <div className="lg:col-span-2 flex flex-col gap-4 relative">
            <div 
              data-tour="alert-feed" // 👈 Tutorial Target
              className="flex-1 bg-slate-900/60 border border-slate-700/50 backdrop-blur-xl rounded-2xl overflow-hidden relative shadow-lg flex flex-col"
            >
               {/* List Component */}
               <AlertCenter 
                 alerts={filteredAlerts} 
                 onSelect={setSelectedAlertId} 
               />
            </div>
            
            {/* Assistant pinned to bottom on mobile, inside grid on desktop */}
            <div className="hidden lg:block">
              <AssistantBubble message={assistantMessage} />
            </div>
          </div>

          {/* RIGHT: DETAILS PANEL (1/3 width - Desktop Only preview) */}
          <div className="hidden lg:flex flex-col gap-4">
             <div 
               data-tour="alert-card" // 👈 Tutorial Target
               className="flex-1 bg-black/40 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-4"
             >
                <AlertTriangle size={48} className="text-slate-700 opacity-50" />
                <div>
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Secure Terminal</h3>
                  <p className="text-xs text-slate-600 mt-2 max-w-[200px] mx-auto">
                    Select an alert vector to initialize detailed analysis protocols.
                  </p>
                </div>
             </div>
          </div>

        </div>

      </motion.div>

      {/* --- MODAL (For mobile & detailed view) --- */}
      <AnimatePresence>
        {selectedAlertId && (
          <AlertDetailModal 
            alert={activeAlert} 
            onClose={() => setSelectedAlertId(null)} 
          />
        )}
      </AnimatePresence>

    </div>
  );
}