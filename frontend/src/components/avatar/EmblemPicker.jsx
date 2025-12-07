// src/components/avatar/EmblemPicker.jsx
import React from "react";
import { motion } from "framer-motion";
import { 
  Shield,     // Falcon (Guardian)
  Crosshair,  // Wolf (Hunter)
  Zap,        // Thunder (Power)
  Flame,      // Phoenix (Fire)
  Skull,      // Dino (Primal)
  Activity,   // Samurai (Discipline)
  Hexagon     // Decorative bg
} from "lucide-react";

// --- DATA MAPPING ---
const EMBLEMS = [
  { id: "falcon",  label: "FALCON",  icon: Shield,    desc: "Guardian Class" },
  { id: "wolf",    label: "WOLF",    icon: Crosshair, desc: "Stealth Ops" },
  { id: "thunder", label: "THUNDER", icon: Zap,       desc: "Shock Trooper" },
  { id: "phoenix", label: "PHOENIX", icon: Flame,     desc: "Heavy Assault" },
  { id: "dino",    label: "DINO",    icon: Skull,     desc: "Primal Force" },
  { id: "samurai", label: "SAMURAI", icon: Activity,  desc: "Tactical Lead" },
];

/**
 * 🛡️ EMBLEM SELECTOR GRID
 * High-tech grid for selecting the chest insignia.
 * Features:
 * - Fluid layout transition for selection marker
 * - Holographic hover states
 * - Contextual accent coloring
 */
export default function EmblemPicker({ selected, onChange, accentColor = "#22d3ee" }) {
  
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <label className="text-[10px] font-mono text-cyan-200/60 uppercase tracking-widest flex items-center gap-2">
          <Hexagon size={12} className="text-cyan-500" />
          Squadron Insignia
        </label>
        <span className="text-[9px] font-mono text-slate-500 uppercase">
          {EMBLEMS.find(e => e.id === selected)?.desc || "Select Class"}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {EMBLEMS.map((item) => {
          const isSelected = selected === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className="relative group outline-none"
              aria-label={`Select ${item.label} Emblem`}
            >
              {/* 1. SELECTION HIGHLIGHT (Motion Layout) */}
              {isSelected && (
                <motion.div
                  layoutId="emblem-active-bg"
                  className="absolute inset-0 rounded-lg opacity-20 border border-white/50"
                  style={{ backgroundColor: accentColor }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              )}

              {/* 2. BUTTON CONTAINER */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  relative h-14 w-full rounded-lg border flex flex-col items-center justify-center gap-1 transition-all duration-300 z-10
                  ${isSelected 
                    ? "border-white/40 bg-white/5 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]" 
                    : "border-white/5 bg-black/20 text-slate-500 hover:border-white/20 hover:bg-white/5 hover:text-cyan-200"
                  }
                `}
              >
                {/* Icon */}
                <Icon 
                  size={20} 
                  strokeWidth={isSelected ? 2.5 : 2}
                  className={`transition-all duration-300 ${isSelected ? "drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" : ""}`}
                />
                
                {/* Label (Tiny) */}
                <span className={`text-[8px] font-bold tracking-widest ${isSelected ? "text-white" : "text-slate-600 group-hover:text-cyan-200/50"}`}>
                  {item.label}
                </span>

                {/* 3. CORNER ACCENT (Tactical Marker) */}
                {isSelected && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: accentColor, boxShadow: `0 0 10px ${accentColor}` }}
                  />
                )}
              </motion.div>
            </button>
          );
        })}
      </div>
    </div>
  );
}