// src/components/ranger/AICard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Brain, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';

const AICard = () => {
  const mockAI = {
    risk: 42,
    confidence: 0.78,
    reason: "Mild fatigue spike detected in recent readings",
    recommendation: "Hydrate and take capsule on schedule. Monitor sleep patterns.",
    trend: "improving",
    lastUpdate: "2 minutes ago"
  };

  const getRiskColor = (risk) => {
    if (risk <= 30) return 'text-green-400';
    if (risk <= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getRiskBg = (risk) => {
    if (risk <= 30) return 'bg-green-500/10';
    if (risk <= 60) return 'bg-yellow-500/10';
    return 'bg-red-500/10';
  };

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="bg-slate-900/50 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-6 hover:border-cyan-500/40 transition-all duration-300 relative overflow-hidden"
    >
      {/* Hologram effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5" />
      <motion.div
        animate={{ 
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 opacity-10 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent"
        style={{ backgroundSize: '200% 200%' }}
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="p-2 bg-cyan-500/20 rounded-lg"
            >
              <Brain className="w-6 h-6 text-cyan-400" />
            </motion.div>
            <div>
              <h3 className="text-xl font-semibold text-white">AI Analysis</h3>
              <p className="text-sm text-slate-400">Last updated {mockAI.lastUpdate}</p>
            </div>
          </div>
          
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex items-center gap-2"
          >
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm text-green-400">Active</span>
          </motion.div>
        </div>

        {/* Risk Assessment */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className={`p-4 rounded-xl ${getRiskBg(mockAI.risk)} border border-slate-700/50`}>
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className={`w-4 h-4 ${getRiskColor(mockAI.risk)}`} />
              <span className="text-sm text-slate-300">Risk Score</span>
            </div>
            <div className={`text-2xl font-bold ${getRiskColor(mockAI.risk)}`}>
              {mockAI.risk}%
            </div>
          </div>

          <div className="p-4 rounded-xl bg-blue-500/10 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-slate-300">Confidence</span>
            </div>
            <div className="text-2xl font-bold text-blue-400">
              {Math.round(mockAI.confidence * 100)}%
            </div>
          </div>

          <div className="p-4 rounded-xl bg-green-500/10 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-sm text-slate-300">Trend</span>
            </div>
            <div className="text-2xl font-bold text-green-400 capitalize">
              {mockAI.trend}
            </div>
          </div>
        </div>

        {/* Analysis Details */}
        <div className="space-y-4">
          <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/30">
            <h4 className="text-sm font-semibold text-cyan-400 mb-2">Analysis</h4>
            <p className="text-slate-300 text-sm leading-relaxed">{mockAI.reason}</p>
          </div>

          <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/30">
            <h4 className="text-sm font-semibold text-green-400 mb-2">Recommendation</h4>
            <p className="text-slate-300 text-sm leading-relaxed">{mockAI.recommendation}</p>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="mt-4 flex items-center gap-2">
          <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${mockAI.confidence * 100}%` }}
              transition={{ duration: 1.5, delay: 0.5 }}
              className="h-full bg-gradient-to-r from-cyan-400 to-blue-500"
            />
          </div>
          <span className="text-xs text-slate-400">Processing</span>
        </div>
      </div>
    </motion.div>
  );
};

export default AICard;