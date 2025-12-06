// frontend/src/components/ranger/MobileDoseModal.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const MobileDoseModal = ({ isOpen, onClose }) => {
  const [notes, setNotes] = useState("");

  // Logic remains identical, but wrapped in AnimatePresence in parent is recommended for exit animations
  if (!isOpen) return null;

  const handleSubmit = () => {
    // Local mock success (Phase 11 style)
    toast.success("Dose logged successfully", {
      icon: "💊",
      style: {
        background: "rgba(15, 23, 42, 0.9)",
        color: "#22D3EE",
        border: "1px solid rgba(34, 211, 238, 0.3)",
        backdropFilter: "blur(10px)",
      },
    });

    setNotes("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center pointer-events-none">
      {/* Dark Overlay with Blur */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm pointer-events-auto"
      />

      {/* Main Modal Card */}
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-md bg-gradient-to-b from-slate-900 to-slate-950 border-t border-cyan-500/30 rounded-t-3xl sm:rounded-2xl p-6 shadow-[0_-10px_40px_-15px_rgba(34,211,238,0.2)] pointer-events-auto"
      >
        {/* Drag Handle Indicator */}
        <div className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto mb-6 opacity-50" />

        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl text-white font-bold tracking-wide flex items-center gap-2">
              <span className="text-cyan-400">💊</span> LOG DOSE
            </h2>
            <p className="text-xs text-slate-400 mt-1 font-mono uppercase tracking-wider">
              {navigator.onLine ? "● System Online" : "○ Offline Mode Enabled"}
            </p>
          </div>
          <div className="text-xs font-mono text-cyan-500/70 border border-cyan-500/20 px-2 py-1 rounded">
            ID: {Math.floor(Math.random() * 9000) + 1000}
          </div>
        </div>

        <label className="block text-sm text-slate-300 mb-2 font-medium">
          Field Notes <span className="text-slate-500 text-xs">(Optional)</span>
        </label>
        
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. Taken with food, mild fatigue..."
          rows={3}
          className="w-full p-4 rounded-xl bg-slate-950/50 text-white border border-slate-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all outline-none placeholder:text-slate-600 resize-none"
        />

        <div className="flex gap-3 mt-6">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            className="flex-1 py-3.5 rounded-xl border border-slate-700 text-slate-400 font-medium hover:bg-slate-800 transition-colors"
          >
            Cancel
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            className="flex-[2] py-3.5 rounded-xl bg-cyan-500 text-slate-950 font-bold shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_25px_rgba(34,211,238,0.5)] transition-shadow"
          >
            Confirm & Log
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default MobileDoseModal;