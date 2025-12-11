import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Loader2, Database, Terminal } from "lucide-react";

/**
 * Smart Email Diagnostic Component
 * Visualizes:
 * 1. Syntax Validity (Regex check)
 * 2. Availability (Database check)
 * 3. System Status (Loading/Idle)
 */
export default function EmailValidationHint({ email, status }) {
  // Status props expected: 'idle' | 'checking' | 'valid' | 'invalid' | 'taken'

  // Helper to determine config based on status
  const getConfig = () => {
    switch (status) {
      case "checking":
        return {
          color: "text-cyan-400",
          bg: "bg-cyan-500/10",
          border: "border-cyan-500/30",
          icon: <Loader2 size={12} className="animate-spin" />,
          text: "QUERYING DATABASE...",
        };
      case "taken":
        return {
          color: "text-rose-400",
          bg: "bg-rose-500/10",
          border: "border-rose-500/30",
          icon: <Database size={12} />,
          text: "IDENTITY ALREADY REGISTERED",
        };
      case "valid":
        return {
          color: "text-emerald-400",
          bg: "bg-emerald-500/10",
          border: "border-emerald-500/30",
          icon: <Check size={12} />,
          text: "AVAILABLE FOR UPLINK",
        };
      case "invalid":
        return {
          color: "text-amber-400",
          bg: "bg-amber-500/10",
          border: "border-amber-500/30",
          icon: <X size={12} />,
          text: "INVALID SYNTAX FORMAT",
        };
      default:
        return null;
    }
  };

  const config = getConfig();

  return (
    <div className="min-h-[20px] mt-2 relative">
      <AnimatePresence mode="wait">
        {/* State 1: Typing / Regex Hint (Show when idle or invalid but not empty) */}
        {(status === "idle" || (status === "invalid" && email.length > 0)) && (
          <motion.div
            key="syntax-hint"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="flex items-center justify-between text-[10px] font-mono text-slate-500 px-1"
          >
            <span className="flex items-center gap-1.5">
              <Terminal size={10} />
              FORMAT: USER@DOMAIN.EXT
            </span>
            
            {/* Live Syntax Checkers */}
            <div className="flex gap-2">
               <span className={email.includes("@") ? "text-cyan-500" : "text-slate-600"}>@</span>
               <span className={email.includes(".") ? "text-cyan-500" : "text-slate-600"}>.DOT</span>
            </div>
          </motion.div>
        )}

        {/* State 2: Active Validation Feedback (Checking, Taken, Valid) */}
        {config && status !== "invalid" && status !== "idle" && (
          <motion.div
            key="status-feedback"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`
              flex items-center gap-2 px-2 py-1.5 rounded 
              border text-[10px] font-bold font-mono tracking-wider
              ${config.bg} ${config.border} ${config.color}
            `}
          >
            {config.icon}
            <span>{config.text}</span>
            
            {/* Decorative Pulse for 'Valid' state */}
            {status === "valid" && (
              <span className="flex h-1.5 w-1.5 relative ml-auto">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}