// src/components/ranger/CapsuleButton.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Pill, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';
import ConfettiBurst from './ConfettiBurst';

const CapsuleButton = () => {
  const [isPressed, setIsPressed] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [lastDose, setLastDose] = useState(null);

  const handleCapsuleClick = () => {
    setIsPressed(true);
    setShowConfetti(true);
    setLastDose(new Date());
    
    toast.success('Dose logged successfully! 💊', {
      duration: 3000,
      style: {
        background: 'rgba(15, 23, 42, 0.9)',
        color: '#fff',
        border: '1px solid rgba(34, 211, 238, 0.3)',
        borderRadius: '12px',
      },
    });

    setTimeout(() => {
      setIsPressed(false);
      setShowConfetti(false);
    }, 3000);
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-slate-900/50 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-6 hover:border-cyan-500/40 transition-all duration-300"
    >
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Pill className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-semibold text-white">Daily Capsule</h3>
        </div>

        {lastDose && (
          <div className="text-sm text-slate-400 mb-4">
            Last dose: {lastDose.toLocaleTimeString()}
          </div>
        )}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCapsuleClick}
          disabled={isPressed}
          className={`relative w-32 h-32 mx-auto rounded-full border-4 transition-all duration-300 ${
            isPressed
              ? 'border-green-400 bg-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.4)]'
              : 'border-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 hover:shadow-[0_0_30px_rgba(34,211,238,0.3)]'
          }`}
        >
          {/* Animated rings */}
          <motion.div
            animate={isPressed ? { scale: [1, 1.5], opacity: [0.5, 0] } : {}}
            transition={{ duration: 1, repeat: isPressed ? Infinity : 0 }}
            className={`absolute inset-0 rounded-full border-2 ${
              isPressed ? 'border-green-400' : 'border-cyan-400'
            }`}
          />
          
          <motion.div
            animate={isPressed ? { scale: [1, 2], opacity: [0.3, 0] } : {}}
            transition={{ duration: 1.5, repeat: isPressed ? Infinity : 0, delay: 0.2 }}
            className={`absolute inset-0 rounded-full border ${
              isPressed ? 'border-green-400' : 'border-cyan-400'
            }`}
          />

          {/* Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            {isPressed ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Check className="w-12 h-12 text-green-400" />
              </motion.div>
            ) : (
              <Pill className="w-12 h-12 text-cyan-400" />
            )}
          </div>

          {/* Pulse effect */}
          {!isPressed && (
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-2 rounded-full bg-cyan-500/5"
            />
          )}
        </motion.button>

        <motion.p
          animate={{ color: isPressed ? '#4ade80' : '#22d3ee' }}
          className="text-sm font-medium"
        >
          {isPressed ? 'Dose Recorded!' : 'Tap to Log Dose'}
        </motion.p>

        {/* Next dose timer */}
        <div className="text-xs text-slate-500">
          Next dose in: 6h 24m
        </div>
      </div>

      {showConfetti && <ConfettiBurst />}
    </motion.div>
  );
};

export default CapsuleButton;