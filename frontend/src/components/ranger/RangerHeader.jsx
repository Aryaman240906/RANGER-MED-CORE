// src/components/ranger/RangerHeader.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Star } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const RangerHeader = () => {
  const { user } = useAuthStore();
  
  const rangerData = {
    callSign: user?.name || 'RANGER-001',
    status: 'ACTIVE',
    rank: 'SPECIALIST',
    missionTime: '127 days',
    efficiency: 94
  };

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative bg-slate-900/50 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-6 overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-blue-500/5" />
      
      {/* Animated grid pattern */}
      <motion.div
        animate={{ 
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 opacity-5 bg-[linear-gradient(45deg,transparent_24%,rgba(34,211,238,.2)_25%,rgba(34,211,238,.2)_26%,transparent_27%,transparent_74%,rgba(34,211,238,.2)_75%,rgba(34,211,238,.2)_76%,transparent_77%,transparent)]"
        style={{ backgroundSize: '20px 20px' }}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between">
          {/* Left side - Ranger info */}
          <div className="flex items-center gap-4">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="p-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl border border-cyan-500/30"
            >
              <Shield className="w-8 h-8 text-cyan-400" />
            </motion.div>
            
            <div>
              <motion.h1
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-3xl font-bold text-white mb-1"
              >
                {rangerData.callSign}
              </motion.h1>
              
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="flex items-center gap-3"
              >
                <span className="text-cyan-400 font-medium">{rangerData.rank}</span>
                <div className="w-1 h-1 bg-slate-600 rounded-full" />
                <span className="text-slate-400">{rangerData.missionTime}</span>
              </motion.div>
            </div>
          </div>

          {/* Right side - Status */}
          <div className="text-right">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex items-center gap-2 mb-2"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-3 h-3 bg-green-400 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.6)]"
              />
              <span className="text-green-400 font-semibold text-lg">
                {rangerData.status}
              </span>
            </motion.div>
            
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="flex items-center gap-1 justify-end"
            >
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400 font-medium">
                {rangerData.efficiency}% Efficiency
              </span>
            </motion.div>
          </div>
        </div>

        {/* Status bar */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-6 h-1 bg-slate-800 rounded-full overflow-hidden"
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${rangerData.efficiency}%` }}
            transition={{ delay: 1, duration: 1.5, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 relative"
          >
            {/* Animated shine effect */}
            <motion.div
              animate={{ x: ['-100%', '100%'] }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "linear",
                delay: 2
              }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-1/3"
            />
          </motion.div>
        </motion.div>

        {/* Neon underline effect */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-4 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent"
        />
      </div>
    </motion.div>
  );
};

export default RangerHeader;