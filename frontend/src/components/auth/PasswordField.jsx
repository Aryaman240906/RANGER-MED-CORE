import React, { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff, ShieldCheck, AlertTriangle, ShieldAlert, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PasswordField({ 
  name, 
  placeholder = "Password", 
  value, 
  onChange, 
  showStrength = false,
  disabled = false
}) {
  const [show, setShow] = useState(false);
  const [strength, setStrength] = useState(0);
  const [feedback, setFeedback] = useState("");

  // --- 1. ROBUST STRENGTH ALGORITHM ---
  useEffect(() => {
    if (!showStrength) return;
    
    let score = 0;
    if (!value) {
      setStrength(0);
      return;
    }

    // Criteria Check
    if (value.length > 7) score++;             // Length > 7
    if (/[A-Z]/.test(value)) score++;          // Uppercase
    if (/[0-9]/.test(value)) score++;          // Number
    if (/[^A-Za-z0-9]/.test(value)) score++;   // Special Char

    setStrength(score);

    // Contextual Feedback Text
    switch (score) {
      case 0: setFeedback("Too Short"); break;
      case 1: setFeedback("Weak - Add numbers"); break;
      case 2: setFeedback("Fair - Mix cases"); break;
      case 3: setFeedback("Good - Add symbols"); break;
      case 4: setFeedback("Maximum Security"); break;
      default: setFeedback("");
    }
  }, [value, showStrength]);

  // --- 2. NEON PALETTE CONFIG ---
  // Returns styling config based on current strength score
  const getStatusConfig = () => {
    switch (strength) {
      case 0: // Idle / Start
      case 1: // ROSE (Weak)
        return {
          color: "text-rose-400",
          bg: "bg-rose-500",
          border: "focus:border-rose-500/50 focus:ring-rose-500/20",
          shadow: "shadow-[0_0_10px_#f43f5e]",
          icon: <AlertTriangle size={12} className="text-rose-400" />
        };
      case 2: // AMBER (Fair)
        return {
          color: "text-amber-400",
          bg: "bg-amber-400",
          border: "focus:border-amber-400/50 focus:ring-amber-400/20",
          shadow: "shadow-[0_0_10px_#fbbf24]",
          icon: <ShieldAlert size={12} className="text-amber-400" />
        };
      case 3: // EMERALD (Good)
        return {
          color: "text-emerald-400",
          bg: "bg-emerald-400",
          border: "focus:border-emerald-400/50 focus:ring-emerald-400/20",
          shadow: "shadow-[0_0_15px_#34d399]",
          icon: <Shield size={12} className="text-emerald-400" />
        };
      case 4: // CYAN (Strong)
        return {
          color: "text-cyan-400",
          bg: "bg-cyan-400",
          border: "focus:border-cyan-400/50 focus:ring-cyan-400/20",
          shadow: "shadow-[0_0_20px_#22d3ee]",
          icon: <ShieldCheck size={12} className="text-cyan-400" />
        };
      default:
        return {
          color: "text-slate-400",
          bg: "bg-slate-700",
          border: "focus:border-cyan-500/50 focus:ring-cyan-500/20",
          shadow: "shadow-none",
          icon: null
        };
    }
  };

  const status = getStatusConfig();
  const getWidth = () => (!value ? "0%" : `${(strength / 4) * 100}%`);

  return (
    <div className="space-y-2">
      {/* --- INPUT WRAPPER --- */}
      <div className="relative group">
        {/* Left Icon (Lock) - Dynamically colored based on strength */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Lock 
            size={18} 
            className={`transition-colors duration-500 ${
              showStrength && value.length > 0 ? status.color : "text-slate-500 group-focus-within:text-cyan-400"
            }`} 
          />
        </div>
        
        {/* The Input */}
        <input 
          type={show ? "text" : "password"} 
          name={name} 
          required 
          disabled={disabled}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`
            w-full bg-[#050b14]/50 border rounded-lg pl-10 pr-12 py-3 
            text-sm text-white placeholder-slate-600 font-sans transition-all duration-300
            focus:outline-none focus:ring-1 
            disabled:opacity-50 disabled:cursor-not-allowed
            ${showStrength && value.length > 0 ? status.border : "border-slate-700 focus:border-cyan-500 focus:ring-cyan-500/20"}
          `} 
        />
        
        {/* Right Toggle Button (Eye) */}
        <button
          type="button"
          onClick={() => setShow(!show)}
          disabled={disabled}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-cyan-400 transition-colors disabled:opacity-50"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {/* --- STRENGTH METER (Real-time Visual Feedback) --- */}
      <AnimatePresence>
        {showStrength && value.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-1.5 px-1 overflow-hidden"
          >
            {/* 1. The Neon Bar */}
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
              <motion.div 
                className={`h-full ${status.bg} ${status.shadow}`}
                initial={{ width: 0 }}
                animate={{ width: getWidth() }}
                transition={{ duration: 0.4, type: "spring", bounce: 0, damping: 12 }}
              />
            </div>

            {/* 2. Text Feedback */}
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-mono font-bold uppercase tracking-wider transition-colors duration-300 ${status.color}`}>
                {strength < 4 ? "Security Level:" : "Top Secret"}
              </span>
              
              <motion.span 
                key={feedback} // Triggers animation on text change
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[10px] text-slate-400 font-mono flex items-center gap-1.5"
              >
                {status.icon}
                {feedback}
              </motion.span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}