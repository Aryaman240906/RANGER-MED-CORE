import React from 'react';
import { motion } from 'framer-motion';

/**
 * HologramCard
 * Small card with hologram-like border + subtle animated gradient.
 * Accepts children for flexible content (AI summary, metrics, etc.)
 */
export default function HologramCard({ title, subtitle, children, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className={`relative rounded-2xl p-4 backdrop-blur-md border border-cyan-500/20 bg-gradient-to-t from-slate-900/40 to-slate-900/30 ${className}`}
      style={{
        boxShadow: '0 12px 40px rgba(2,6,23,0.6), 0 2px 10px rgba(34,211,238,0.03)'
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          {title && <h3 className="text-white text-lg font-semibold">{title}</h3>}
          {subtitle && <p className="text-cyan-200/80 text-xs mt-1 font-mono">{subtitle}</p>}
        </div>
        <div className="w-10 h-10 rounded-full border border-cyan-500/20 bg-slate-900/40 flex items-center justify-center text-cyan-300">
          {/* small hologram dot */}
          <div style={{ width: 8, height: 8, borderRadius: 999, background: 'rgba(34,211,238,0.9)' }} />
        </div>
      </div>
      <div>{children}</div>
    </motion.div>
  );
}