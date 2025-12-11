// src/components/landing/StartTutorialModal.jsx
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  X, Play, ShieldCheck, Activity, 
  Radio, Zap, ChevronRight 
} from "lucide-react";

// --- STORE ---
import { useTutorialStore } from "../../store/tutorialStore";

// --- ANIMATION VARIANTS ---
const modalVariants = {
  hidden: { opacity: 0, scale: 0.9, filter: "blur(12px)" },
  visible: { 
    opacity: 1, 
    scale: 1, 
    filter: "blur(0px)",
    transition: { duration: 0.4, ease: "circOut", when: "beforeChildren", staggerChildren: 0.15 }
  },
  exit: { opacity: 0, scale: 0.95, filter: "blur(10px)" }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } }
};

/**
 * 🎓 MISSION BRIEFING MODAL
 * The onboarding gateway. Explains the "Why" before showing the "How".
 */
export default function StartTutorialModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { openTutorial } = useTutorialStore();

  if (!isOpen) return null;

  const handleStart = () => {
    // 1. Close Modal
    onClose();
    // 2. Navigate to Dashboard
    navigate("/dashboard");
    // 3. Trigger the first sequence (The store will auto-detect 'once' mode)
    // Note: We rely on the Dashboard's internal useEffect to pick up the start trigger,
    // or we can force it here if using a global 'tutorial active' flag.
    // For this architecture, navigating to dashboard where 'showForUser' is called is sufficient,
    // but we can set a flag if needed.
    setTimeout(() => {
        openTutorial('dashboard', { mode: 'always', force: true });
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* BACKDROP */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-[#020617]/90 backdrop-blur-md"
        onClick={onClose}
      />

      {/* MODAL FRAME */}
      <motion.div 
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="relative w-full max-w-lg bg-[#0a1020] border border-cyan-500/30 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(34,211,238,0.15)] flex flex-col"
      >
        
        {/* DECORATIVE HEADER LINE */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
        <div className="absolute top-0 right-0 p-4 opacity-50">
            <Radio size={48} className="text-cyan-900/20 animate-ping absolute" />
        </div>

        {/* HEADER */}
        <div className="p-8 pb-4 relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-2 py-1 rounded border border-cyan-500/30 bg-cyan-500/10 text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-3"
              >
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
                Training Protocol Active
              </motion.div>
              <h2 className="text-2xl font-black text-white uppercase tracking-wide">
                Welcome, Ranger.
              </h2>
            </div>
            <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
              <X size={24} />
            </button>
          </div>
          <p className="mt-2 text-sm text-slate-400 leading-relaxed font-light">
            Before deployment, you must calibrate your understanding of the <span className="text-cyan-200">Bio-Sync Neural Grid</span>. This briefing covers three critical systems:
          </p>
        </div>

        {/* MODULE LIST */}
        <div className="px-8 pb-4 space-y-3 relative z-10">
          
          <motion.div variants={itemVariants} className="p-4 rounded-xl bg-slate-900/50 border border-white/5 flex items-center gap-4 group hover:border-cyan-500/30 transition-colors">
            <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-110 transition-transform">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Vitals Monitoring</h4>
              <p className="text-[10px] text-slate-500 font-mono">Stability & Readiness Metrics</p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="p-4 rounded-xl bg-slate-900/50 border border-white/5 flex items-center gap-4 group hover:border-fuchsia-500/30 transition-colors">
            <div className="p-2.5 rounded-lg bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20 group-hover:scale-110 transition-transform">
              <Activity size={20} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Diagnostics</h4>
              <p className="text-[10px] text-slate-500 font-mono">Symptom Logging & Risk Analysis</p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="p-4 rounded-xl bg-slate-900/50 border border-white/5 flex items-center gap-4 group hover:border-amber-500/30 transition-colors">
            <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:scale-110 transition-transform">
              <Zap size={20} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Intervention</h4>
              <p className="text-[10px] text-slate-500 font-mono">Capsule Intake & Alert Response</p>
            </div>
          </motion.div>

        </div>

        {/* FOOTER ACTION */}
        <div className="p-8 pt-4 bg-[#050b14]/50 border-t border-white/5">
          <button
            onClick={handleStart}
            className="group relative w-full h-14 overflow-hidden rounded-xl bg-cyan-500 hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_40px_rgba(34,211,238,0.5)] flex items-center justify-center gap-3"
          >
            {/* Sliding Shine */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
            
            <span className="text-sm font-black text-black tracking-[0.2em] uppercase">
              Begin Calibration
            </span>
            <div className="bg-black/20 p-1 rounded-full group-hover:translate-x-1 transition-transform">
               <ChevronRight size={16} className="text-black" strokeWidth={3} />
            </div>
          </button>
          
          <div className="mt-4 text-center text-[9px] font-mono text-slate-600">
            ESTIMATED TIME: 45 SECONDS
          </div>
        </div>

      </motion.div>
    </div>
  );
}