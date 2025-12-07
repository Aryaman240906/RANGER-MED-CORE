// src/components/dose/DoseConsole.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Pill, Zap, AlertTriangle, Check, ChevronsRight, 
  Thermometer, Clock, X, ShieldAlert 
} from "lucide-react";
import { toast } from "react-hot-toast";

// --- STORES ---
import { useDemoStore } from "../../store/demoStore";
import { queueAction } from "../../services/localPersistence"; // Direct persistence

// --- ASSETS / CONFIG ---
const CAPSULES = [
  {
    id: "standard",
    label: "Stabilizer",
    sub: "Routine Maintenance",
    icon: Pill,
    color: "#22d3ee", // Cyan
    border: "border-cyan-500",
    bg: "bg-cyan-500/10",
    shadow: "shadow-cyan-500/20",
    effect: "+6 Stability"
  },
  {
    id: "booster",
    label: "Neuro-Boost",
    sub: "Performance Spike",
    icon: Zap,
    color: "#d946ef", // Magenta
    border: "border-fuchsia-500",
    bg: "bg-fuchsia-500/10",
    shadow: "shadow-fuchsia-500/20",
    effect: "+12 Stability"
  },
  {
    id: "emergency",
    label: "Adrenaline",
    sub: "Critical Override",
    icon: ShieldAlert,
    color: "#ef4444", // Red
    border: "border-red-500",
    bg: "bg-red-500/10",
    shadow: "shadow-red-500/20",
    effect: "+25 Stability",
    restricted: true // Logic handles this
  }
];

export default function DoseConsole() {
  const { addDose, stability } = useDemoStore();
  
  // Local State
  const [selectedId, setSelectedId] = useState("standard");
  const [amount, setAmount] = useState(1.0); // 0.5 to 2.0
  const [isConfirming, setIsConfirming] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const activeCapsule = CAPSULES.find(c => c.id === selectedId);
  const isCritical = stability < 40; // Unlock emergency stim if critical

  // --- ACTIONS ---

  const initiateSequence = () => {
    setIsConfirming(true);
  };

  const confirmDose = async () => {
    setIsProcessing(true);

    // Simulate Network/Processing Delay
    setTimeout(() => {
      const payload = {
        capsuleType: selectedId,
        doseAmount: amount,
        timestamp: new Date().toISOString(),
        source: "manual"
      };

      // 1. Update State
      addDose(payload);
      
      // 2. Persist Offline
      queueAction("dose", payload);

      // 3. Feedback
      toast.custom((t) => (
        <div className="bg-[#050b14] border border-emerald-500/50 p-4 rounded-xl shadow-[0_0_30px_rgba(16,185,129,0.3)] flex items-center gap-3 backdrop-blur-md">
          <div className="p-2 bg-emerald-500/20 rounded-full text-emerald-400">
            <Check size={20} />
          </div>
          <div>
            <div className="text-emerald-400 font-bold tracking-wider text-sm">SEQUENCE COMPLETE</div>
            <div className="text-slate-400 text-xs font-mono">Bio-availability increasing...</div>
          </div>
        </div>
      ));

      // Reset
      setIsProcessing(false);
      setIsConfirming(false);
      setAmount(1.0);
    }, 1200);
  };

  return (
    <div className="relative w-full bg-slate-900/60 border border-slate-700/50 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl p-6 flex flex-col gap-6">
      
      {/* 1. CAPSULE SELECTOR GRID */}
      <div>
        <label className="text-[10px] font-mono text-cyan-500/70 uppercase tracking-widest mb-3 block font-bold">
          Select Payload
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {CAPSULES.map((cap) => {
            const isSelected = selectedId === cap.id;
            const isLocked = cap.restricted && !isCritical; // Only unlock red if critical

            return (
              <button
                key={cap.id}
                onClick={() => !isLocked && setSelectedId(cap.id)}
                disabled={isLocked}
                className={`
                  relative group p-3 rounded-xl border transition-all duration-300 flex flex-col items-start gap-2 overflow-hidden text-left
                  ${isSelected ? `${cap.bg} ${cap.border} shadow-[0_0_15px_rgba(0,0,0,0.5)]` : "bg-black/20 border-white/5 hover:bg-white/5"}
                  ${isLocked ? "opacity-40 cursor-not-allowed grayscale" : "opacity-100"}
                `}
              >
                {/* Active Indicator Glow */}
                {isSelected && (
                  <motion.div 
                    layoutId="active-glow"
                    className={`absolute inset-0 opacity-20 ${cap.bg}`} 
                  />
                )}

                <div className="flex justify-between items-start w-full relative z-10">
                  <cap.icon size={20} style={{ color: isLocked ? "#aaa" : cap.color }} />
                  {isSelected && <div className={`w-2 h-2 rounded-full shadow-[0_0_5px_currentColor]`} style={{ backgroundColor: cap.color }} />}
                  {isLocked && <AlertTriangle size={14} className="text-amber-500" />}
                </div>

                <div className="relative z-10">
                  <div className={`text-sm font-bold tracking-wide ${isSelected ? "text-white" : "text-slate-400"}`}>
                    {cap.label}
                  </div>
                  <div className="text-[9px] font-mono text-slate-500 uppercase mt-0.5">
                    {cap.sub}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. QUANTITY THROTTLE */}
      <div className="bg-black/20 rounded-xl p-4 border border-white/5">
        <div className="flex justify-between items-center mb-4">
          <label className="text-[10px] font-mono text-cyan-500/70 uppercase tracking-widest font-bold flex items-center gap-2">
            <Thermometer size={12} /> Dosage Intensity
          </label>
          <span className="text-xl font-mono font-bold text-white tracking-tighter">
            {amount.toFixed(1)}<span className="text-sm text-slate-500">x</span>
          </span>
        </div>

        <div className="relative h-8 flex items-center">
          {/* Custom Track */}
          <div className="absolute w-full h-1 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 transition-all duration-100"
              style={{ width: `${((amount - 0.5) / 1.5) * 100}%` }}
            />
          </div>
          
          {/* Native Input (Hidden but Functional) */}
          <input
            type="range"
            min="0.5"
            max="2.0"
            step="0.1"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value))}
            className="
              absolute w-full h-full opacity-0 cursor-pointer z-20
            "
          />

          {/* Custom Thumb (Visual) */}
          <motion.div 
            className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-[#050b14] border-2 border-cyan-400 rounded-full shadow-[0_0_15px_#22d3ee] flex items-center justify-center pointer-events-none z-10"
            style={{ left: `calc(${((amount - 0.5) / 1.5) * 100}% - 12px)` }}
          >
            <div className="w-1.5 h-1.5 bg-white rounded-full" />
          </motion.div>
        </div>

        {/* Ticks */}
        <div className="flex justify-between mt-2 text-[9px] font-mono text-slate-600">
          <span>0.5x</span>
          <span>1.0x</span>
          <span>1.5x</span>
          <span>2.0x</span>
        </div>
      </div>

      {/* 3. INITIATE BUTTON */}
      <button
        onClick={initiateSequence}
        className="
          group relative w-full h-14 rounded-lg overflow-hidden
          bg-cyan-500 hover:bg-cyan-400 transition-colors shadow-[0_0_20px_rgba(34,211,238,0.3)]
        "
      >
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%] hover:animate-[shine_1s_infinite] opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative z-10 flex items-center justify-center gap-3 text-black font-black tracking-[0.2em] uppercase text-sm">
          <span>Initiate Protocol</span>
          <ChevronsRight size={18} className="animate-pulse" />
        </div>
      </button>


      {/* =========================================================
          CONFIRMATION MODAL (OVERLAY)
      ========================================================= */}
      <AnimatePresence>
        {isConfirming && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center"
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              className="w-full max-w-sm bg-[#0a1020] border border-cyan-500/30 rounded-xl p-6 shadow-2xl relative overflow-hidden"
            >
              {/* Spinning Ring */}
              <div className="absolute top-[-50px] right-[-50px] w-32 h-32 rounded-full border border-dashed border-cyan-500/20 animate-[spin_10s_linear_infinite]" />

              <div className="relative z-10">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/50 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.2)]">
                    <activeCapsule.icon size={32} style={{ color: activeCapsule.color }} />
                  </div>
                </div>

                <h3 className="text-white font-bold tracking-widest text-lg mb-1">
                  CONFIRM INTAKE
                </h3>
                <p className="text-cyan-500/60 font-mono text-xs uppercase mb-6">
                  {activeCapsule.label} • {amount}x Dose
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => setIsConfirming(false)}
                    className="flex-1 py-3 rounded-lg border border-slate-700 hover:bg-white/5 text-slate-400 font-bold text-xs uppercase tracking-wider"
                  >
                    Abort
                  </button>
                  <button
                    onClick={confirmDose}
                    disabled={isProcessing}
                    className="flex-1 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <span className="animate-pulse">Processing...</span>
                    ) : (
                      <>
                        <span>Engage</span>
                        <Zap size={14} className="fill-black" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}