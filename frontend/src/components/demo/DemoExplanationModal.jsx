// src/components/demo/DemoExplanationModal.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Activity, Zap, ShieldAlert, Clock, 
  Cpu, BookOpen, Terminal, ChevronRight 
} from "lucide-react";

// --- KNOWLEDGE BASE CONTENT ---
const TOPICS = [
  {
    id: 'intro',
    label: 'Overview',
    icon: BookOpen,
    color: 'text-white',
    title: 'Simulation Protocol',
    content: (
      <>
        <p>
          <strong>Demo Mode</strong> is a deterministic physics sandbox designed to stress-test the Ranger Med-Core system.
        </p>
        <p className="mt-2">
          It replaces live biometric data with a <strong>Seeded RNG Engine</strong>, allowing you to observe how the application reacts to various scenarios (Stability Crashes, Recovery Streaks, and Critical Alerts) without real-world consequences.
        </p>
        <div className="mt-4 p-3 bg-white/5 border border-white/10 rounded-lg text-xs font-mono">
          Mathematics: Deterministic (Seed-based)<br/>
          Update Rate: 1000ms / Speed Multiplier
        </div>
      </>
    )
  },
  {
    id: 'stability',
    label: 'Stability',
    icon: Activity,
    color: 'text-cyan-400',
    title: 'Neural Stability',
    content: (
      <>
        <p>
          The primary metric representing the user's biological equilibrium.
        </p>
        <ul className="list-disc list-inside mt-2 space-y-1 text-slate-300">
          <li><strong>Base Score:</strong> 0% (Collapse) to 100% (Optimal).</li>
          <li><strong>Impact:</strong> Capsule intake (+6% to +25%) vs. Symptoms (-3% to -18%).</li>
          <li><strong>Physics:</strong> Subject to "Gravity" (drifts towards 0 if neglected) and "Inertia" (harder to change if trend is strong).</li>
        </ul>
      </>
    )
  },
  {
    id: 'readiness',
    label: 'Readiness',
    icon: Zap,
    color: 'text-amber-400',
    title: 'Mission Readiness',
    content: (
      <>
        <p>
          A derived metric indicating the user's capacity for daily tasks.
        </p>
        <p className="mt-2">
          Unlike Stability (which changes instantly), <strong>Readiness lags behind</strong>. It simulates the body's physical recovery time. Even if you stabilize a crash, your readiness takes time to rebuild.
        </p>
        <div className="mt-4 flex items-center gap-2 text-xs font-mono text-amber-400">
          Formula: (Stability × 0.9) + (Streak Bonus)
        </div>
      </>
    )
  },
  {
    id: 'risk',
    label: 'Risk Score',
    icon: ShieldAlert,
    color: 'text-red-400',
    title: 'Anomaly Risk',
    content: (
      <>
        <p>
          The calculated probability of a critical medical incident.
        </p>
        <p className="mt-2">
          Risk spikes when high-severity symptoms are logged or when doses are missed (Streak = 0). If Risk exceeds 80%, the system triggers a <strong>Mission Alert</strong>.
        </p>
      </>
    )
  },
  {
    id: 'timeline',
    label: 'Timeline',
    icon: Clock,
    color: 'text-emerald-400',
    title: 'Event Stream',
    content: (
      <>
        <p>
          The immutable ledger of all system activity.
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          <div className="p-2 bg-cyan-900/20 border border-cyan-500/20 rounded">
            <span className="font-bold text-cyan-400">DOSE</span><br/>Medication Log
          </div>
          <div className="p-2 bg-fuchsia-900/20 border border-fuchsia-500/20 rounded">
            <span className="font-bold text-fuchsia-400">SYMPTOM</span><br/>Bio-Scan Entry
          </div>
          <div className="p-2 bg-red-900/20 border border-red-500/20 rounded">
            <span className="font-bold text-red-400">ALERT</span><br/>System Warning
          </div>
          <div className="p-2 bg-slate-800 border border-slate-700 rounded">
            <span className="font-bold text-slate-400">INFO</span><br/>Routine Check
          </div>
        </div>
      </>
    )
  },
  {
    id: 'ai',
    label: 'Cortex AI',
    icon: Cpu,
    color: 'text-purple-400',
    title: 'Predictive Engine',
    content: (
      <>
        <p>
          The "Assistant" bubble is powered by a rule-based inference engine (mocked for demo).
        </p>
        <p className="mt-2">
          It analyzes the <strong>Context</strong> (e.g., "3 missed doses") and <strong>Trend</strong> (e.g., "Stability dropping") to offer actionable advice or quick-navigation links.
        </p>
      </>
    )
  }
];

// --- VARIANTS ---
const modalVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "circOut" } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
};

/**
 * 📘 DEMO EXPLANATION MODAL
 * A "Holographic Encyclopedia" that explains the simulation mechanics.
 */
export default function DemoExplanationModal({ isOpen, onClose }) {
  const [activeTabId, setActiveTabId] = useState('intro');
  const activeTab = TOPICS.find(t => t.id === activeTabId) || TOPICS[0];
  const Icon = activeTab.icon;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-[#000000]/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Container */}
      <motion.div 
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="relative w-full max-w-4xl h-[600px] bg-[#0a1020] border border-cyan-500/30 rounded-2xl shadow-2xl flex overflow-hidden ring-1 ring-cyan-500/20"
      >
        
        {/* ATMOSPHERE */}
        <div className="absolute inset-0 hero-grid opacity-10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 pointer-events-none" />

        {/* --- LEFT: NAVIGATION (Cyber-Tabs) --- */}
        <div className="w-64 border-r border-white/10 bg-[#050b14]/50 flex flex-col z-10">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
              <Terminal size={16} className="text-cyan-400" />
              Knowledge Base
            </h2>
          </div>
          
          <div className="flex-1 overflow-y-auto py-4 space-y-1">
            {TOPICS.map((topic) => {
              const isActive = activeTabId === topic.id;
              const TabIcon = topic.icon;
              
              return (
                <button
                  key={topic.id}
                  onClick={() => setActiveTabId(topic.id)}
                  className={`w-full px-6 py-3 flex items-center gap-3 text-xs font-bold uppercase tracking-wider transition-all relative group outline-none
                    ${isActive ? "text-white" : "text-slate-500 hover:text-slate-300"}
                  `}
                >
                  {/* Active Indicator (Sliding Bar) */}
                  {isActive && (
                    <motion.div 
                      layoutId="activeTab"
                      className="absolute left-0 top-0 bottom-0 w-[3px] bg-cyan-500 shadow-[0_0_10px_#22d3ee]" 
                    />
                  )}
                  {/* Active Background Glow */}
                  {isActive && (
                     <motion.div 
                       layoutId="activeTabBg"
                       className="absolute inset-0 bg-white/5"
                     />
                  )}

                  <TabIcon size={16} className={isActive ? topic.color : "opacity-50"} />
                  <span className="relative z-10">{topic.label}</span>
                  {isActive && <ChevronRight size={14} className="ml-auto text-cyan-500" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* --- RIGHT: CONTENT AREA --- */}
        <div className="flex-1 flex flex-col relative z-10">
          
          {/* Header */}
          <div className="p-8 pb-4 flex justify-between items-start">
            <div>
               <motion.div 
                 key={activeTab.id}
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 className="flex items-center gap-3 mb-2"
               >
                 <div className={`p-2 rounded-lg bg-white/5 border border-white/10 ${activeTab.color}`}>
                   <Icon size={24} />
                 </div>
                 <h1 className="text-2xl font-black text-white uppercase tracking-wide">
                   {activeTab.title}
                 </h1>
               </motion.div>
               <div className="h-1 w-24 bg-gradient-to-r from-cyan-500 to-transparent rounded-full" />
            </div>

            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content Body */}
          <div className="flex-1 p-8 pt-4 overflow-y-auto custom-scrollbar">
            <motion.div
              key={activeTab.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-sm text-slate-300 leading-relaxed space-y-4 max-w-lg"
            >
              {activeTab.content}
            </motion.div>
          </div>

          {/* Visual Aid Area (Bottom Right) */}
          <div className="absolute bottom-8 right-8 w-40 h-40 opacity-20 pointer-events-none">
             <Icon size={160} className={activeTab.color} strokeWidth={0.5} />
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-white/5 bg-[#050b14]/80 flex justify-between items-center">
            <span className="text-[10px] text-slate-500 font-mono uppercase">
              Doc ID: {activeTab.id.toUpperCase()}-940
            </span>
            <div className="flex gap-1">
              {[1,2,3].map(i => <div key={i} className="w-1 h-1 bg-cyan-500 rounded-full animate-pulse" />)}
            </div>
          </div>

        </div>

      </motion.div>
    </div>
  );
}