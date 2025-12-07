// src/components/avatar/AvatarControls.jsx
import React from "react";
import { motion } from "framer-motion";
import { 
  Users, Sliders, Zap, LayoutTemplate, MousePointer2 
} from "lucide-react";

// --- COMPONENTS ---
import ColorPicker from "./ColorPicker";
import EmblemPicker from "./EmblemPicker";
import AuraPicker from "./AuraPicker";
import { AVATAR_PRESETS } from "../../utils/avatarPresets";

/**
 * 🎛️ AVATAR CONTROLS (THE HUD)
 * Manages the user input panels for the Morphin Grid.
 * * Layout Strategy:
 * - Desktop: Split into Left (Identity) and Right (Energy) floating panels.
 * - Mobile: Stacked vertically below the hologram.
 */
export default function AvatarControls({
  avatar,
  setSuitColor,
  setEmblem,
  setAura,
  setGlowStrength,
  setSilhouette,
}) {

  // --- PRESET LOGIC ---
  const handlePresetClick = (key) => {
    const preset = AVATAR_PRESETS[key];
    if (preset) {
      setSuitColor(preset.suitColor);
      setEmblem(preset.emblem);
      setAura(preset.aura);
      setGlowStrength(preset.glowStrength);
      setSilhouette(preset.silhouette);
    }
  };

  return (
    <div className="w-full h-full relative flex flex-col md:block pointer-events-none">
      
      {/* =========================================================
          LEFT PANEL: IDENTITY MATRIX
          (Suit Color, Emblem, Gender)
      ========================================================= */}
      <motion.div 
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="
          pointer-events-auto
          relative md:absolute md:left-8 md:top-1/2 md:-translate-y-1/2 
          w-full md:w-80 
          bg-[#050b14]/90 backdrop-blur-xl 
          border-y md:border border-cyan-500/20 md:rounded-2xl 
          p-6 space-y-8
          shadow-[0_0_30px_rgba(0,0,0,0.5)]
        "
      >
        {/* Panel Header */}
        <div className="flex items-center gap-2 border-b border-cyan-500/10 pb-3">
          <LayoutTemplate size={16} className="text-cyan-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-[0.2em]">
            Identity Matrix
          </h3>
        </div>

        {/* 1. SILHOUETTE SELECTOR */}
        <div className="space-y-3">
          <label className="text-[10px] font-mono text-cyan-200/60 uppercase tracking-widest flex items-center gap-2">
            <Users size={12} />
            Body Type
          </label>
          <div className="flex gap-2 p-1 bg-black/40 rounded-lg border border-white/5">
            {['male', 'female'].map((type) => (
              <button
                key={type}
                onClick={() => setSilhouette(type)}
                className={`
                  flex-1 py-2 rounded-md text-xs font-bold uppercase tracking-wide transition-all
                  ${avatar.silhouette === type 
                    ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/20" 
                    : "text-slate-500 hover:text-white hover:bg-white/5"
                  }
                `}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* 2. COLOR PICKER */}
        <div className="space-y-3">
          <ColorPicker 
            value={avatar.suitColor} 
            onChange={setSuitColor} 
          />
        </div>

        {/* 3. EMBLEM PICKER */}
        <div className="space-y-3">
           <EmblemPicker 
             selected={avatar.emblem} 
             onChange={setEmblem} 
             accentColor={avatar.suitColor}
           />
        </div>

        {/* Decorative Corner */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-cyan-500/50 rounded-tl-xl opacity-50" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-cyan-500/50 rounded-br-xl opacity-50" />
      </motion.div>


      {/* =========================================================
          RIGHT PANEL: ENERGY DYNAMICS
          (Aura, Glow Strength, Presets)
      ========================================================= */}
      <motion.div 
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="
          pointer-events-auto
          relative md:absolute md:right-8 md:top-1/2 md:-translate-y-1/2 
          w-full md:w-80 
          bg-[#050b14]/90 backdrop-blur-xl 
          border-y md:border border-cyan-500/20 md:rounded-2xl 
          p-6 space-y-8
          mt-4 md:mt-0
          shadow-[0_0_30px_rgba(0,0,0,0.5)]
        "
      >
        {/* Panel Header */}
        <div className="flex items-center gap-2 border-b border-cyan-500/10 pb-3">
          <Zap size={16} className="text-cyan-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-[0.2em]">
            Energy Dynamics
          </h3>
        </div>

        {/* 4. AURA SELECTOR */}
        <div className="space-y-3">
          <AuraPicker 
            value={avatar.aura} 
            onChange={setAura} 
            color={avatar.suitColor}
          />
        </div>

        {/* 5. GLOW STRENGTH SLIDER */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-mono text-cyan-200/60 uppercase tracking-widest flex items-center gap-2">
              <Sliders size={12} />
              Core Intensity
            </label>
            <span className="text-[10px] font-mono text-cyan-400">
              {Math.round(avatar.glowStrength * 100)}%
            </span>
          </div>
          
          <div className="relative h-6 flex items-center">
            <input
              type="range"
              min="0.2"
              max="1"
              step="0.05"
              value={avatar.glowStrength}
              onChange={(e) => setGlowStrength(parseFloat(e.target.value))}
              className="
                w-full h-1 bg-slate-800 rounded-full appearance-none cursor-pointer z-20
                focus:outline-none focus:ring-0
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:w-4
                [&::-webkit-slider-thumb]:h-4
                [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:bg-white
                [&::-webkit-slider-thumb]:shadow-[0_0_10px_white]
                [&::-webkit-slider-thumb]:transition-transform
                [&::-webkit-slider-thumb]:hover:scale-125
              "
            />
            {/* Dynamic Fill Bar */}
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 rounded-full z-10 pointer-events-none opacity-80"
              style={{ 
                width: `${((avatar.glowStrength - 0.2) / 0.8) * 100}%`,
                backgroundColor: avatar.suitColor,
                boxShadow: `0 0 10px ${avatar.suitColor}`
              }} 
            />
          </div>
        </div>

        {/* 6. QUICK PRESETS */}
        <div className="space-y-3 pt-4 border-t border-white/5">
          <label className="text-[10px] font-mono text-cyan-200/60 uppercase tracking-widest flex items-center gap-2">
            <MousePointer2 size={12} />
            Quick Access
          </label>
          <div className="grid grid-cols-3 gap-2">
            <PresetButton 
              label="RED" 
              color="#ff3b3b" 
              onClick={() => handlePresetClick('redRanger')} 
            />
            <PresetButton 
              label="BLUE" 
              color="#4da6ff" 
              onClick={() => handlePresetClick('blueRanger')} 
            />
            <PresetButton 
              label="PINK" 
              color="#ff66cc" 
              onClick={() => handlePresetClick('pinkRanger')} 
            />
          </div>
        </div>
        
        {/* Decorative Corner */}
        <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-cyan-500/50 rounded-tr-xl opacity-50" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-cyan-500/50 rounded-bl-xl opacity-50" />

      </motion.div>
    </div>
  );
}

/**
 * Sub-component for Preset Buttons
 */
const PresetButton = ({ label, color, onClick }) => (
  <button
    onClick={onClick}
    className="
      relative overflow-hidden group rounded px-2 py-2 border border-white/10 bg-white/5
      hover:bg-white/10 hover:border-white/30 transition-all
    "
  >
    <div className="flex items-center justify-center gap-1.5 z-10 relative">
      <div 
        className="w-2 h-2 rounded-full shadow-[0_0_5px_currentColor]" 
        style={{ backgroundColor: color, color: color }} 
      />
      <span className="text-[9px] font-bold text-slate-300 group-hover:text-white">{label}</span>
    </div>
  </button>
);