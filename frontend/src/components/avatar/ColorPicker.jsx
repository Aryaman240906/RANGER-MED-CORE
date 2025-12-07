// src/components/avatar/ColorPicker.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, Check, Plus, Pipette } from "lucide-react";

// --- PRESET PIGMENTS ---
const PRESETS = [
  { hex: "#ef4444", label: "Red" },
  { hex: "#3b82f6", label: "Blue" },
  { hex: "#22c55e", label: "Green" },
  { hex: "#eab308", label: "Gold" },
  { hex: "#ec4899", label: "Pink" },
  { hex: "#f8fafc", label: "White" },
  { hex: "#000000", label: "Stealth" },
];

/**
 * 🎨 SUIT PIGMENT SELECTOR
 * Allows selection of the primary suit color via presets or custom hex input.
 */
export default function ColorPicker({ value, onChange }) {
  
  // Helper to check if current value matches a preset
  const isPreset = PRESETS.some(p => p.hex === value);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <label className="text-[10px] font-mono text-cyan-200/60 uppercase tracking-widest flex items-center gap-2">
          <Palette size={12} className="text-cyan-500" />
          Nano-Fiber Pigment
        </label>
        <span className="text-[9px] font-mono text-slate-500 uppercase bg-black/40 px-1.5 py-0.5 rounded border border-white/5">
          {value.toUpperCase()}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {/* 1. PRESET SWATCHES */}
        {PRESETS.map((color) => {
          const isSelected = value === color.hex;

          return (
            <button
              key={color.hex}
              onClick={() => onChange(color.hex)}
              className="relative group outline-none"
              title={color.label}
              aria-label={`Select ${color.label}`}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`
                  w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all duration-300 relative z-10
                  ${isSelected 
                    ? "border-white shadow-[0_0_15px_rgba(255,255,255,0.4)] scale-110" 
                    : "border-transparent opacity-70 hover:opacity-100 hover:border-white/30"
                  }
                `}
                style={{ backgroundColor: color.hex }}
              >
                {/* Active Indicator */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                    >
                      <Check 
                        size={14} 
                        strokeWidth={4}
                        className={color.hex === "#f8fafc" ? "text-black" : "text-white"} 
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
              
              {/* Hover Glow Behind */}
              <div 
                className="absolute inset-0 rounded-full blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-300"
                style={{ backgroundColor: color.hex }}
              />
            </button>
          );
        })}

        {/* 2. CUSTOM COLOR INJECTOR */}
        <div className="relative group ml-1">
          {/* Hidden Input Layer */}
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
            aria-label="Custom Color Picker"
          />

          {/* Visual Trigger Button */}
          <motion.div
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            className={`
              w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all duration-300 relative z-10
              ${!isPreset 
                ? "border-cyan-400 bg-cyan-500/10 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.3)]" 
                : "border-white/10 bg-white/5 text-slate-500 group-hover:border-white/30 group-hover:text-white"
              }
            `}
          >
            {!isPreset ? <Pipette size={14} /> : <Plus size={16} />}
          </motion.div>

           {/* Tooltip for Custom */}
           <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-[9px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-30">
             CUSTOM
           </div>
        </div>
      </div>
    </div>
  );
}