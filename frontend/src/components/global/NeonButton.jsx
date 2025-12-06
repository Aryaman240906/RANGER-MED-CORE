import React from 'react';
import { motion } from 'framer-motion';

/**
 * NeonButton
 * Reusable neon-styled button with subtle glow + press animation.
 * Props:
 *  - children
 *  - onClick
 *  - className (additional classes)
 */
export default function NeonButton({ children, onClick, className = '' }) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      whileHover={{ scale: 1.02 }}
      className={
        `inline-flex items-center justify-center px-5 py-2 rounded-2xl font-semibold text-white shadow-neon transition-all ` +
        `bg-gradient-to-r from-cyan-500/80 to-blue-500/80 border border-cyan-400/20 ${className}`
      }
      style={{
        boxShadow: '0 6px 30px rgba(34,211,238,0.12), inset 0 -2px 12px rgba(255,255,255,0.02)'
      }}
    >
      {children}
    </motion.button>
  );
}