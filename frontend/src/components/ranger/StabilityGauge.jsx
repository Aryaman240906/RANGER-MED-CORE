// src/components/ranger/StabilityGauge.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

const StabilityGauge = ({ value = 0 }) => {
  const radius = 80;
  const strokeWidth = 8;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  const getStatusColor = (val) => {
    if (val >= 80) return 'text-green-400';
    if (val >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getGlowColor = (val) => {
    if (val >= 80) return 'drop-shadow-[0_0_15px_rgba(34,197,94,0.6)]';
    if (val >= 60) return 'drop-shadow-[0_0_15px_rgba(234,179,8,0.6)]';
    return 'drop-shadow-[0_0_15px_rgba(239,68,68,0.6)]';
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-slate-900/50 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-6 hover:border-cyan-500/40 transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-400" />
          Stability
        </h3>
        <div className={`text-2xl font-bold ${getStatusColor(value)}`}>
          {value}%
        </div>
      </div>

      <div className="flex items-center justify-center">
        <div className="relative">
          <svg
            height={radius * 2}
            width={radius * 2}
            className="transform -rotate-90"
          >
            {/* Background circle */}
            <circle
              stroke="rgba(148, 163, 184, 0.2)"
              fill="transparent"
              strokeWidth={strokeWidth}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
            {/* Progress circle */}
            <motion.circle
              stroke="currentColor"
              fill="transparent"
              strokeWidth={strokeWidth}
              strokeDasharray={strokeDasharray}
              strokeLinecap="round"
              r={normalizedRadius}
              cx={radius}
              cy={radius}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className={`${getStatusColor(value)} ${getGlowColor(value)}`}
            />
          </svg>
          
          {/* Center content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              className="text-center"
            >
              <div className={`text-3xl font-bold ${getStatusColor(value)}`}>
                {value}
              </div>
              <div className="text-xs text-slate-400 uppercase tracking-wide">
                Stable
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StabilityGauge;