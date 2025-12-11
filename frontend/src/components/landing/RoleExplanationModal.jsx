// src/components/landing/RoleExplanationModal.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, User, Stethoscope, ShieldAlert, Lock, 
  CheckCircle2, ScanFace, Database 
} from "lucide-react";

// --- ROLE DEFINITIONS ---
const ROLES = [
  {
    id: "ranger",
    title: "RANGER OPERATIVE",
    icon: User,
    status: "active",
    clearance: "LEVEL 1",
    color: "cyan",
    desc: "Primary field unit. Responsible for personal bio-sync monitoring, medication adherence, and symptom logging.",
    features: ["Vital Tracking", "Capsule Console", "AI Stability Analysis"]
  },
  {
    id: "doctor",
    title: "MEDICAL COMMAND",
    icon: Stethoscope,
    status: "locked",
    clearance: "LEVEL 5",
    color: "emerald",
    desc: "Overseer of unit telemetry. Capable of remote diagnostics and intervention protocols.",
    subtext: "System Upgrade in Progress (v6.0)",
    features: ["Fleet Monitoring", "Triage Dashboard", "Remote Directive"]
  },
  {
    id: "admin",
    title: "SYSTEM ADMIN",
    icon: ShieldAlert,
    status: "restricted",
    clearance: "OMNI",
    color: "red",
    desc: "Core system architecture maintenance. Access to global rule engines and security audits.",
    subtext: "Restricted to High Command",
    features: ["User Management", "Audit Logs", "System Config"]
  }
];

// --- ANIMATION VARIANTS ---
const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, filter: "blur(10px)" },
  visible: { 
    opacity: 1, 
    scale: 1, 
    filter: "blur(0px)",
    transition: { duration: 0.3, ease: "circOut", when: "beforeChildren", staggerChildren: 0.1 }
  },
  exit: { opacity: 0, scale: 0.95, filter: "blur(10px)" }
};

const cardVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
};

/**
 * 🔐 ROLE EXPLANATION MODAL
 * Displays the hierarchy of user access levels within the Ranger Med-Core system.
 */
export default function RoleExplanationModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* 1. BACKDROP (Dimmed) */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-[#020617]/90 backdrop-blur-md"
        onClick={onClose}
      />

      {/* 2. MODAL CONTAINER */}
      <motion.div 
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="relative w-full max-w-4xl bg-[#0a1020] border border-cyan-500/30 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        
        {/* ATMOSPHERE */}
        <div className="absolute inset-0 hero-grid opacity-10 pointer-events-none" />
        <div className="absolute inset-0 scanlines opacity-5 pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-transparent" />

        {/* HEADER */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
              <Database size={20} className="text-cyan-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white uppercase tracking-widest">
                Identity Classification
              </h2>
              <p className="text-[10px] font-mono text-cyan-500/60">
                ACCESS_LEVEL_MATRIX // DECLASSIFIED
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* BODY: ROLE GRID */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ROLES.map((role) => (
              <RoleCard key={role.id} role={role} />
            ))}
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t border-white/10 bg-[#050b14]/80 flex justify-between items-center text-[10px] font-mono text-slate-500 relative z-10">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            SECURE CONNECTION ESTABLISHED
          </span>
          <span>AUTH_PROTOCOL_V5</span>
        </div>

      </motion.div>
    </div>
  );
}

// --- SUB-COMPONENT: ROLE CARD ---
function RoleCard({ role }) {
  const Icon = role.icon;
  const isLocked = role.status !== "active";

  const theme = {
    cyan: "border-cyan-500/40 bg-cyan-900/10 text-cyan-400 shadow-cyan-500/10",
    emerald: "border-emerald-500/30 bg-emerald-900/5 text-emerald-500 shadow-emerald-500/5",
    red: "border-red-500/30 bg-red-900/5 text-red-500 shadow-red-500/5"
  }[role.color];

  return (
    <motion.div
      variants={cardVariants}
      className={`
        relative group rounded-xl border p-5 flex flex-col h-full transition-all duration-300
        ${isLocked ? "border-slate-800 bg-slate-900/20 grayscale opacity-80 hover:opacity-100 hover:grayscale-0 hover:border-slate-600" : `${theme} hover:shadow-lg hover:border-opacity-60 hover:bg-opacity-20`}
      `}
    >
      {/* Locked Overlay Pattern */}
      {isLocked && (
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L3N2Zz4=')] opacity-20 pointer-events-none" />
      )}

      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-lg border bg-opacity-20 ${isLocked ? "bg-slate-800 border-slate-700 text-slate-500" : theme}`}>
          <Icon size={24} />
        </div>
        <div className="flex flex-col items-end">
          <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${isLocked ? "border-slate-700 text-slate-500 bg-slate-800" : "border-white/20 bg-white/5 text-white"}`}>
            {role.clearance}
          </span>
          {isLocked && <Lock size={12} className="text-slate-500 mt-1" />}
        </div>
      </div>

      {/* Title & Desc */}
      <h3 className={`text-sm font-bold tracking-widest uppercase mb-2 ${isLocked ? "text-slate-400" : "text-white"}`}>
        {role.title}
      </h3>
      <p className="text-xs text-slate-400 leading-relaxed mb-4 flex-grow font-mono">
        {role.desc}
      </p>

      {/* Feature List */}
      <div className="space-y-2 mb-4">
        {role.features.map((feat, i) => (
          <div key={i} className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-wide">
            {isLocked ? (
              <div className="w-1 h-1 bg-slate-600 rounded-full" />
            ) : (
              <CheckCircle2 size={10} className="text-cyan-400" />
            )}
            {feat}
          </div>
        ))}
      </div>

      {/* Footer Status */}
      <div className={`mt-auto pt-3 border-t ${isLocked ? "border-slate-800" : "border-white/10"}`}>
        {isLocked ? (
          <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
            <Lock size={10} />
            <span className="uppercase">{role.subtext}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-400">
            <ScanFace size={10} className="animate-pulse" />
            <span className="uppercase">Clearance Granted</span>
          </div>
        )}
      </div>

      {/* Hover Scan Effect (Active Only) */}
      {!isLocked && (
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/5 to-transparent translate-y-[-100%] group-hover:translate-y-[100%] transition-transform duration-1000 pointer-events-none" />
      )}

    </motion.div>
  );
}