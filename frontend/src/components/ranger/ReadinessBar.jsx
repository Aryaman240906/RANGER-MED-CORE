// src/components/ranger/ReadinessBar.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

const ReadinessBar = ({ value = 0 }) => {
  const getStatusText = (val) => {
    if (val >= 90) return 'Optimal';
    if (val >= 70) return 'Ready';
    if (val >= 50) return 'Moderate';
    return 'Low';
  };

  const getBarColor = (val) => {
    if (val >= 80) return 'from-green-400 to-emerald-500';
    if (val >= 60) return 'from-yellow-400 to-orange-500';
    return 'from-red-400 to-pink-500';
  };

  return (
    <motion.div
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-slate-900/50 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-6 hover:border-cyan-500/40 transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Zap className="w-5 h-5 text-cyan-400" />
          Readiness
        </h3>
        <div className="text-right">
          <div className="text-2xl font-bold text-cyan-400">{value}%</div>
          <div className="text-sm text-slate-400">{getStatusText(value)}</div>
        </div>
      </div>

      <div className="space-y-3">
        {/* Main Progress Bar */}
        <div className="relative h-4 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${value}%` }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className={`h-full bg-gradient-to-r ${getBarColor(value)} relative`}
          >
            {/* Animated shine effect */}
            <motion.div
              animate={{ x: ['0%', '100%'] }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "linear" 
              }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-1/3"
            />
          </motion.div>
          
          {/* Glow effect */}
          <div className={`absolute inset-0 bg-gradient-to-r ${getBarColor(value)} blur-sm opacity-30`} 
               style={{ width: `${value}%` }} />
        </div>

        {/* Mini indicators */}
        <div className="flex justify-between text-xs text-slate-500">
          <span>0</span>
          <span>25</span>
          <span>50</span>
          <span>75</span>
          <span>100</span>
        </div>
      </div>

      {/* Pulse animation for high readiness */}
      {value >= 80 && (
        <motion.div
          animate={{ 
            boxShadow: [
              '0 0 0 0 rgba(34, 211, 238, 0.4)',
              '0 0 0 10px rgba(34, 211, 238, 0)',
            ]
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute inset-0 rounded-2xl pointer-events-none"
        />
      )}
    </motion.div>
  );
};

export default ReadinessBar;