// src/components/avatar/AuraPicker.jsx
import React from "react";
import { motion } from "framer-motion";
import { RadioReceiver, Activity, Zap, CircleDashed } from "lucide-react";

// --- AURA DEFINITIONS ---
const AURAS = [
  { 
    id: "pulse", 
    label: "PULSE", 
    icon: Activity, 
    desc: "Rhythmic Energy",
    renderPreview: (color) => (
      <motion.div
        animate={{ scale: [0.6, 1, 0.6], opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="w-8 h-8 rounded-full blur-md"
        style={{ backgroundColor: color }}
      />
    )
  },
  { 
    id: "glow", 
    label: "CORE", 
    icon: Zap, 
    desc: "Static Intensity",
    renderPreview: (color) => (
      <motion.div
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="w-6 h-6 rounded-full blur-lg"
        style={{ backgroundColor: color, boxShadow: `0 0 15px ${color}` }}
      />
    )
  },
  { 
    id: "ring", 
    label: "FIELD", 
    icon: CircleDashed, 
    desc: "Orbital Defense",
    renderPreview: (color) => (
      <div className="relative flex items-center justify-center w-full h-full">
         <motion.div
           animate={{ width: ["10%", "90%"], height: ["10%", "90%"], opacity: [1, 0] }}
           transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
           className="absolute rounded-full border-2"
           style={{ borderColor: color }}
         />
      </div>
    )
  }
];

/**
 * ⚛️ AURA FIELD SELECTOR
 * Selects the type of energy emission surrounding the avatar.
 * Features live miniature previews of the physics effects.
 */
export default function AuraPicker({ value, onChange, color = "#22d3ee" }) {
  
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <label className="text-[10px] font-mono text-cyan-200/60 uppercase tracking-widest flex items-center gap-2">
          <RadioReceiver size={12} className="text-cyan-500" />
          Energy Signature
        </label>
      </div>

      <div className="flex gap-3">
        {AURAS.map((item) => {
          const isSelected = value === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className="group relative flex-1 outline-none"
              title={item.desc}
            >
              {/* 1. SELECTION GLOW (Behind) */}
              <div 
                className={`
                  absolute inset-0 rounded-xl blur-md transition-opacity duration-500
                  ${isSelected ? "opacity-40" : "opacity-0 group-hover:opacity-20"}
                `}
                style={{ backgroundColor: color }}
              />

              {/* 2. CARD CONTAINER */}
              <motion.div
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  relative w-full h-24 rounded-xl border flex flex-col items-center justify-center overflow-hidden transition-all duration-300
                  ${isSelected 
                    ? "bg-[#0a1020] border-white/40 shadow-inner" 
                    : "bg-black/40 border-white/5 hover:bg-white/5 hover:border-white/20"
                  }
                `}
              >
                {/* 3. LIVE PREVIEW (Mini Animation) */}
                <div className="flex-1 w-full flex items-center justify-center relative z-10">
                  {item.renderPreview(color)}
                </div>

                {/* 4. LABEL FOOTER */}
                <div className={`
                  w-full py-1.5 text-center text-[9px] font-bold tracking-widest uppercase border-t transition-colors
                  ${isSelected 
                    ? "bg-white/10 border-white/10 text-white" 
                    : "bg-black/20 border-white/5 text-slate-500 group-hover:text-cyan-200"
                  }
                `}>
                  {item.label}
                </div>

                {/* Selection Corner Indicator */}
                {isSelected && (
                  <motion.div
                    layoutId="aura-corner"
                    className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }}
                  />
                )}
              </motion.div>
            </button>
          );
        })}
      </div>
      
      {/* Description Text Helper */}
      <div className="mt-2 text-right">
        <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">
           Mode: <span style={{ color: color }}>{AURAS.find(a => a.id === value)?.desc}</span>
        </span>
      </div>

    </div>
  );
}