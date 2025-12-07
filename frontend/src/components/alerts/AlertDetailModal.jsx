// src/components/alerts/AlertDetailModal.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, ShieldAlert, CheckCircle2, Siren, 
  MapPin, Clock, User, Fingerprint 
} from "lucide-react";
import { useDemoStore } from "../../store/demoStore";
import { queueAction } from "../../services/localPersistence";
import { toast } from "react-hot-toast";

// --- ANIMATION VARIANTS ---
const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, filter: "blur(10px)" },
  visible: { 
    opacity: 1, 
    scale: 1, 
    filter: "blur(0px)",
    transition: { duration: 0.3, ease: "circOut" }
  },
  exit: { opacity: 0, scale: 0.95, filter: "blur(10px)" }
};

/**
 * 🕵️ ALERT DETAIL OVERLAY
 * Deep dive into incident specifics with tactical resolution options.
 */
export default function AlertDetailModal({ alert, onClose }) {
  const { acknowledgeAlert, resolveAlert } = useDemoStore();
  const [isEscalating, setIsEscalating] = useState(false);

  if (!alert) return null;

  // --- ACTIONS ---
  
  const handleAck = () => {
    acknowledgeAlert(alert.id);
    queueAction("alert_ack", { id: alert.id });
    onClose();
  };

  const handleResolve = () => {
    resolveAlert(alert.id);
    queueAction("alert_resolve", { id: alert.id });
    onClose();
  };

  const handleEscalate = () => {
    setIsEscalating(true);
    // Simulate complex routing
    setTimeout(() => {
      setIsEscalating(false);
      toast.error("INCIDENT ESCALATED: Command Notified", {
        icon: "🚨",
        style: { background: "#050b14", color: "#ef4444", border: "1px solid #ef4444" }
      });
      onClose();
    }, 1500);
  };

  const isCritical = alert.severity === "critical";
  const themeColor = isCritical ? "red" : alert.severity === "warning" ? "amber" : "cyan";

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={modalVariants}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <div 
        className={`
          relative w-full max-w-2xl bg-[#0a1020] border rounded-2xl overflow-hidden shadow-2xl
          ${isCritical ? "border-red-500/50 shadow-red-900/20" : `border-${themeColor}-500/30`}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* 1. TOP SECRET HEADER */}
        <div className={`p-6 border-b flex justify-between items-start bg-gradient-to-r from-${themeColor}-900/20 to-transparent border-${themeColor}-500/20`}>
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl border bg-${themeColor}-500/10 border-${themeColor}-500/30 text-${themeColor}-500 shadow-[0_0_20px_currentColor]`}>
              {isCritical ? <Siren size={28} className="animate-pulse" /> : <ShieldAlert size={28} />}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded bg-${themeColor}-500 text-black uppercase tracking-widest`}>
                  {alert.severity}
                </span>
                <span className="text-[10px] font-mono text-slate-500">ID: {alert.id.slice(0,8).toUpperCase()}</span>
              </div>
              <h2 className="text-xl font-bold text-white tracking-wide uppercase">
                {alert.title}
              </h2>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-slate-500 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* 2. INTEL BODY */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Background Grid */}
          <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

          {/* Left: Metadata */}
          <div className="space-y-4 md:col-span-1 border-r border-white/5 pr-6">
            <MetaRow icon={Clock} label="Timestamp" value={new Date(alert.time).toLocaleTimeString()} />
            <MetaRow icon={User} label="Operative" value={alert.rangerId || "Unknown"} />
            <MetaRow icon={MapPin} label="Vector" value="Sector 7" />
            <MetaRow icon={Fingerprint} label="Signature" value="Bio-Spike" />
          </div>

          {/* Right: Briefing */}
          <div className="md:col-span-2 space-y-4">
            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-2">
                Incident Report
              </span>
              <p className="text-sm text-slate-300 leading-relaxed font-mono bg-black/40 p-4 rounded-lg border border-white/5">
                {alert.message}
              </p>
            </div>

            {/* AI Analysis Mock */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-cyan-900/10 border border-cyan-500/20">
               <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
               <p className="text-xs text-cyan-200/80 font-mono">
                 AI Analysis: Correlates with recent stability drop (-12%). Recommend immediate intervention.
               </p>
            </div>
          </div>
        </div>

        {/* 3. TACTICAL FOOTER */}
        <div className="p-4 bg-black/40 border-t border-white/10 flex justify-end gap-3 backdrop-blur-md">
          
          <button
            onClick={handleEscalate}
            disabled={isEscalating}
            className="px-4 py-3 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
          >
            {isEscalating ? "Transmitting..." : "Escalate Incident"}
          </button>

          <div className="h-full w-[1px] bg-white/10 mx-2" />

          {alert.status !== "resolved" && (
            <button
              onClick={handleResolve}
              className="px-6 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center gap-2"
            >
              <CheckCircle2 size={16} />
              Resolve
            </button>
          )}
          
          {alert.status === "active" && (
            <button
              onClick={handleAck}
              className="px-6 py-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs uppercase tracking-wider"
            >
              Acknowledge
            </button>
          )}

        </div>

      </div>
    </motion.div>
  );
}

const MetaRow = ({ icon: Icon, label, value }) => (
  <div>
    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest flex items-center gap-1 mb-1">
      <Icon size={10} /> {label}
    </span>
    <div className="text-sm font-bold text-white">{value}</div>
  </div>
);