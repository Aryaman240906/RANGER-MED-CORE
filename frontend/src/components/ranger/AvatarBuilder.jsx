// src/components/ranger/AvatarBuilder.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Shield, Zap, Activity, Flame, Skull, 
  Crosshair, Check, RefreshCw, X 
} from "lucide-react";
import { toast } from "react-hot-toast";
import useAuthStore from "../../store/authStore";

// 🎨 RANGER COLOR PALETTE (Predefined for consistent neon theme)
const COLORS = [
  { id: "cyan", hex: "#22d3ee", label: "Medic Cyan", tailwind: "bg-cyan-500", glow: "shadow-cyan-500/50" },
  { id: "red", hex: "#ef4444", label: "Assault Red", tailwind: "bg-red-500", glow: "shadow-red-500/50" },
  { id: "green", hex: "#22c55e", label: "Scout Green", tailwind: "bg-green-500", glow: "shadow-green-500/50" },
  { id: "yellow", hex: "#eab308", label: "Tech Yellow", tailwind: "bg-yellow-500", glow: "shadow-yellow-500/50" },
  { id: "purple", hex: "#a855f7", label: "Void Purple", tailwind: "bg-purple-500", glow: "shadow-purple-500/50" },
  { id: "white", hex: "#f8fafc", label: "Command White", tailwind: "bg-slate-100", glow: "shadow-white/50" },
];

// 🛡️ SQUADRON INSIGNIAS
const EMBLEMS = [
  { id: "shield", Icon: Shield, label: "Guardian" },
  { id: "zap", Icon: Zap, label: "Voltage" },
  { id: "activity", Icon: Activity, label: "Vital" },
  { id: "flame", Icon: Flame, label: "Inferno" },
  { id: "crosshair", Icon: Crosshair, label: "Sniper" },
  { id: "skull", Icon: Skull, label: "Ghost" },
];

export default function AvatarBuilder({ onClose }) {
  const { user } = useAuthStore();
  const [color, setColor] = useState(COLORS[0]);
  const [emblem, setEmblem] = useState(EMBLEMS[0]);
  const [isSaving, setIsSaving] = useState(false);

  // Load existing avatar settings on mount
  useEffect(() => {
    const saved = localStorage.getItem("ranger_avatar");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const foundColor = COLORS.find(c => c.id === parsed.colorId) || COLORS[0];
        const foundEmblem = EMBLEMS.find(e => e.id === parsed.emblemId) || EMBLEMS[0];
        setColor(foundColor);
        setEmblem(foundEmblem);
      } catch (e) {
        console.error("Failed to load avatar", e);
      }
    }
  }, []);

  const handleSave = () => {
    setIsSaving(true);
    
    // Simulate "Calibration" processing delay
    setTimeout(() => {
      const avatarData = { colorId: color.id, emblemId: emblem.id };
      localStorage.setItem("ranger_avatar", JSON.stringify(avatarData));
      
      // Dispatch event so Header/Dashboard can update instantly
      window.dispatchEvent(new Event("avatar-updated"));

      toast.success("Suit Identity Calibrated", {
        icon: "🛡️",
        style: { background: "#0f172a", color: color.hex, border: `1px solid ${color.hex}` }
      });
      
      setIsSaving(false);
      if (onClose) onClose();
    }, 800);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-slate-900 border border-slate-700/50 rounded-2xl overflow-hidden relative shadow-2xl">
      
      {/* HEADER */}
      <div className="bg-slate-950 p-4 border-b border-slate-800 flex justify-between items-center">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <RefreshCw size={14} className={isSaving ? "animate-spin" : ""} />
          Suit Calibration
        </h2>
        
        <div className="flex gap-3 items-center">
            <div className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-500">
            MK-V ARMOR
            </div>
            {onClose && (
                <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                    <X size={18} />
                </button>
            )}
        </div>
      </div>

      <div className="p-6 space-y-8">
        
        {/* --- PREVIEW HOLOGRAM --- */}
        <div className="flex flex-col items-center">
          <div className="relative group">
            {/* Outer Glow Ring (Color Dynamic) */}
            <motion.div 
              layoutId="avatar-glow"
              className={`absolute -inset-6 rounded-full blur-2xl opacity-30 transition-colors duration-500 ${color.tailwind}`} 
            />
            
            {/* Main Avatar Circle */}
            <motion.div 
              className={`relative w-28 h-28 rounded-full border-4 border-slate-900 flex items-center justify-center transition-colors duration-500 shadow-2xl z-10 ${color.tailwind}`}
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-slate-900 drop-shadow-md">
                <emblem.Icon size={56} strokeWidth={2.5} />
              </div>
              
              {/* Glossy Overlay Reflection */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/25 to-transparent pointer-events-none" />
            </motion.div>
          </div>
          
          <div className="mt-4 text-center">
            <div className="text-white font-bold tracking-wide text-lg">{user?.name || "Ranger"}</div>
            <div className="text-xs font-mono text-slate-500 uppercase tracking-wider">{color.label} • {emblem.label} Class</div>
          </div>
        </div>

        {/* --- COLOR PICKER --- */}
        <div>
          <label className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-3 block">
            Nano-Fiber Pigment
          </label>
          <div className="flex justify-between gap-2">
            {COLORS.map((c) => (
              <button
                key={c.id}
                onClick={() => setColor(c)}
                className={`w-10 h-10 rounded-full border-2 transition-all duration-200 relative group
                  ${color.id === c.id 
                    ? "border-white scale-110 shadow-[0_0_15px_rgba(255,255,255,0.3)]" 
                    : "border-transparent opacity-60 hover:opacity-100 hover:scale-105"
                  }
                  ${c.tailwind}
                `}
                title={c.label}
              >
                {color.id === c.id && (
                  <motion.div 
                    layoutId="check-color"
                    className="absolute inset-0 flex items-center justify-center text-slate-900/60"
                  >
                    <Check size={18} strokeWidth={4} />
                  </motion.div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* --- EMBLEM PICKER --- */}
        <div>
          <label className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-3 block">
            Squadron Insignia
          </label>
          <div className="grid grid-cols-6 gap-2">
            {EMBLEMS.map((e) => (
              <button
                key={e.id}
                onClick={() => setEmblem(e)}
                className={`aspect-square rounded-xl flex items-center justify-center transition-all border
                  ${emblem.id === e.id 
                    ? `bg-slate-800 border-white text-white shadow-[0_0_10px_rgba(255,255,255,0.2)] scale-105` 
                    : "bg-slate-900/50 border-slate-700 text-slate-500 hover:bg-slate-800 hover:text-slate-300"
                  }
                `}
              >
                <e.Icon size={20} />
              </button>
            ))}
          </div>
        </div>

        {/* --- SAVE BUTTON --- */}
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={handleSave}
          disabled={isSaving}
          className={`w-full py-3.5 rounded-xl font-bold text-slate-900 transition-all shadow-lg flex items-center justify-center gap-2
            ${color.tailwind} hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          {isSaving ? "CALIBRATING..." : "CONFIRM IDENTITY"}
        </motion.button>
      </div>
    </div>
  );
}