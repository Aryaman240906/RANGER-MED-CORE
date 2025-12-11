// src/components/ranger/AICard.jsx
import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, AlertTriangle, CheckCircle, TrendingUp, 
  TrendingDown, Minus, HelpCircle, ScanEye 
} from 'lucide-react';

// --- COMPONENTS ---
import DemoExplanationModal from "../demo/DemoExplanationModal";

/**
 * 🧠 CORTEX PREDICTIVE ENGINE
 * Visualizes the AI's risk assessment and confidence levels.
 */
const AICard = ({ 
  risk = 0, 
  confidence = 0, 
  recommendation = "System nominal. Continue standard protocols.",
  trend = "Stable"
}) => {
  const [showExplanation, setShowExplanation] = useState(false);

  // --- TACTICAL LOGIC ---
  const statusConfig = useMemo(() => {
    if (risk >= 70) return {
      color: "text-red-500",
      bg: "bg-red-500/10",
      border: "border-red-500/30",
      shadow: "shadow-[0_0_20px_rgba(239,68,68,0.2)]",
      label: "CRITICAL RISK",
      barColor: "bg-red-500"
    };
    if (risk >= 40) return {
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/30",
      shadow: "shadow-[0_0_20px_rgba(251,191,36,0.2)]",
      label: "ELEVATED RISK",
      barColor: "bg-amber-400"
    };
    return {
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/30",
      shadow: "shadow-[0_0_20px_rgba(16,185,129,0.2)]",
      label: "OPTIMAL",
      barColor: "bg-emerald-400"
    };
  }, [risk]);

  return (
    <>
      <div 
        className={`relative w-full overflow-hidden rounded-2xl border backdrop-blur-xl transition-all duration-500 group ${statusConfig.bg} ${statusConfig.border}`}
        data-tour="ai-card" // 👈 Tutorial Target
      >
        
        {/* 1. ATMOSPHERE & SYNAPSE ANIMATION */}
        <div className="absolute inset-0 scanlines opacity-10 pointer-events-none" />
        <motion.div
          animate={{ 
            backgroundPosition: ['0% 0%', '100% 100%'],
            opacity: risk > 60 ? [0.1, 0.3, 0.1] : 0.1
          }}
          transition={{ duration: risk > 60 ? 2 : 10, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 pointer-events-none"
          style={{ backgroundSize: '200% 200%' }}
        />

        <div className="relative z-10 p-6">
          
          {/* 2. HEADER */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg border bg-opacity-20 ${statusConfig.border} ${statusConfig.bg}`}>
                <Brain size={20} className={statusConfig.color} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white tracking-wide uppercase flex items-center gap-2">
                  Cortex AI
                  <span className="text-[9px] font-mono text-slate-500 px-1.5 py-0.5 rounded border border-white/10">v9.4</span>
                </h3>
                <p className="text-[10px] text-cyan-500/60 font-mono tracking-wider uppercase">
                  Predictive Analysis Active
                </p>
              </div>
            </div>
            
            {/* Help Trigger */}
            <button
              onClick={() => setShowExplanation(true)}
              className="text-slate-500 hover:text-cyan-400 transition-colors p-2"
              aria-label="How does AI work?"
            >
              <HelpCircle size={18} />
            </button>
          </div>

          {/* 3. METRICS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            
            {/* Risk Score */}
            <div className={`p-3 rounded-xl border bg-black/20 ${statusConfig.border}`}>
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle size={14} className={statusConfig.color} />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Risk Prob.</span>
              </div>
              <div className={`text-2xl font-black font-mono ${statusConfig.color}`}>
                {Math.round(risk)}%
              </div>
            </div>

            {/* Confidence */}
            <div className="p-3 rounded-xl border border-blue-500/20 bg-blue-900/10">
              <div className="flex items-center gap-2 mb-1">
                <ScanEye size={14} className="text-blue-400" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Confidence</span>
              </div>
              <div className="text-2xl font-black font-mono text-blue-400">
                {Math.round(confidence)}%
              </div>
            </div>

            {/* Trend */}
            <div className="p-3 rounded-xl border border-slate-700 bg-slate-900/40">
              <div className="flex items-center gap-2 mb-1">
                {trend === 'Improving' && <TrendingUp size={14} className="text-emerald-400" />}
                {trend === 'Declining' && <TrendingDown size={14} className="text-red-400" />}
                {trend === 'Stable' && <Minus size={14} className="text-slate-400" />}
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Trend</span>
              </div>
              <div className="text-sm font-bold text-white font-mono mt-1">
                {trend.toUpperCase()}
              </div>
            </div>
          </div>

          {/* 4. ANALYSIS READOUT */}
          <div className="space-y-3">
            <div className="p-4 bg-black/40 rounded-xl border border-white/5 relative overflow-hidden">
               <div className={`absolute left-0 top-0 bottom-0 w-1 ${statusConfig.barColor}`} />
               <h4 className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${statusConfig.color}`}>
                 Directive
               </h4>
               <p className="text-sm text-slate-300 font-mono leading-relaxed">
                 <span className="text-cyan-500 mr-2">{">"}</span>
                 {recommendation}
               </p>
            </div>
          </div>

          {/* 5. FOOTER PROGRESS */}
          <div className="mt-5 flex items-center gap-3">
            <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${confidence}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
              />
            </div>
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">
              Processing Telemetry...
            </span>
          </div>

        </div>
      </div>

      {/* --- EXPLANATION MODAL --- */}
      <AnimatePresence>
        {showExplanation && (
          <DemoExplanationModal 
            isOpen={showExplanation} 
            onClose={() => setShowExplanation(false)} 
            // Optional: You could pass a prop to pre-select the 'risk' or 'ai' tab
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default AICard;