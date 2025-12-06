// frontend/src/components/ranger/MobileSymptomModal.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const MobileSymptomModal = ({ isOpen, onClose }) => {
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState("mild");

  // Logic remains identical
  if (!isOpen) return null;

  const handleSubmit = () => {
    toast.success("Symptom logged successfully", {
      icon: "⚠",
      style: {
        background: "rgba(15, 23, 42, 0.95)",
        color: "#F87171", // Red text for alert
        border: "1px solid rgba(248, 113, 113, 0.3)",
        backdropFilter: "blur(10px)",
      },
    });

    setDescription("");
    setSeverity("mild");
    onClose();
  };

  // Helper to get color based on severity
  const getSeverityColor = (s) => {
    if (s === "mild") return "bg-green-500/20 text-green-400 border-green-500/50";
    if (s === "moderate") return "bg-amber-500/20 text-amber-400 border-amber-500/50";
    if (s === "severe") return "bg-red-500/20 text-red-400 border-red-500/50";
    return "bg-slate-800 border-slate-700";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center pointer-events-none">
      {/* Dark Overlay */}
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
        className="relative w-full max-w-md bg-gradient-to-b from-slate-900 to-slate-950 border-t border-red-500/30 rounded-t-3xl sm:rounded-2xl p-6 shadow-[0_-10px_40px_-15px_rgba(239,68,68,0.2)] pointer-events-auto"
      >
        {/* Drag Handle */}
        <div className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto mb-6 opacity-50" />

        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl text-white font-bold tracking-wide flex items-center gap-2">
              <span className="text-red-500">⚠</span> REPORT SYMPTOM
            </h2>
            <p className="text-xs text-slate-400 mt-1 font-mono uppercase tracking-wider">
              Log anomaly for analysis
            </p>
          </div>
        </div>

        {/* Severity Selector (Replaces <select> for better UI) */}
        <label className="block text-sm text-slate-300 mb-3 font-medium">Severity Level</label>
        <div className="flex gap-2 mb-6">
          {["mild", "moderate", "severe"].map((level) => (
            <motion.button
              key={level}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSeverity(level)}
              className={`flex-1 py-3 rounded-xl border capitalize text-sm font-bold transition-all ${
                severity === level
                  ? getSeverityColor(level) + " shadow-lg"
                  : "bg-slate-900 border-slate-700 text-slate-500 hover:bg-slate-800"
              }`}
            >
              {level}
            </motion.button>
          ))}
        </div>

        {/* Description Input */}
        <label className="block text-sm text-slate-300 mb-2 font-medium">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe physical or cognitive issues..."
          rows={3}
          className="w-full p-4 rounded-xl bg-slate-950/50 text-white border border-slate-700 focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all outline-none placeholder:text-slate-600 resize-none"
        />

        {/* Action Buttons */}
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
            className="flex-[2] py-3.5 rounded-xl bg-red-600 text-white font-bold shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_25px_rgba(220,38,38,0.6)] transition-shadow"
          >
            Submit Report
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default MobileSymptomModal;