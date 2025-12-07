// src/components/ranger/AvatarBuilder.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, Zap, Activity, Flame, Skull, 
  Crosshair, Check, Cpu, RefreshCw, X, Sliders, User 
} from "lucide-react";
import { toast } from "react-hot-toast";

// 🔧 FIX: Added curly braces for named import
import { useAuthStore } from "../../store/authStore";

// 🎨 RANGER NEON PALETTE (Rich Definition for UI feedback)
const COLORS = [
  { id: "cyan", hex: "#22d3ee", label: "Medic Cyan", tailwind: "bg-cyan-500", border: "border-cyan-400", ring: "ring-cyan-500" },
  { id: "red", hex: "#ef4444", label: "Assault Red", tailwind: "bg-red-500", border: "border-red-400", ring: "ring-red-500" },
  { id: "green", hex: "#10b981", label: "Scout Green", tailwind: "bg-emerald-500", border: "border-emerald-400", ring: "ring-emerald-500" },
  { id: "yellow", hex: "#eab308", label: "Tech Yellow", tailwind: "bg-yellow-400", border: "border-yellow-300", ring: "ring-yellow-400" },
  { id: "pink", hex: "#ec4899", label: "Viper Pink", tailwind: "bg-pink-500", border: "border-pink-400", ring: "ring-pink-500" },
  { id: "white", hex: "#f8fafc", label: "Command White", tailwind: "bg-slate-100", border: "border-white", ring: "ring-slate-200" },
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
  
  // State
  const [color, setColor] = useState(COLORS[0]);
  const [emblem, setEmblem] = useState(EMBLEMS[0]);
  const [callSign, setCallSign] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Load existing avatar settings on mount
  useEffect(() => {
    // Try loading complex object first
    const saved = localStorage.getItem("ranger_avatar");
    // Fallback for simple saved name
    const legacyName = localStorage.getItem("ranger_avatar_name"); 
    
    // Default name logic: Saved > Legacy > Auth Store > "Ranger"
    let initialName = legacyName || user?.name || "RANGER";

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const foundColor = COLORS.find(c => c.id === parsed.colorId) || COLORS[0];
        const foundEmblem = EMBLEMS.find(e => e.id === parsed.emblemId) || EMBLEMS[0];
        if (parsed.callSign) initialName = parsed.callSign;
        
        setColor(foundColor);
        setEmblem(foundEmblem);
      } catch (e) {
        console.error("Failed to load avatar configuration", e);
      }
    }
    setCallSign(initialName);
  }, [user]);

  const handleSave = () => {
    setIsSaving(true);
    
    // Simulate "Calibration" processing delay for effect
    setTimeout(() => {
      const avatarData = { 
        colorId: color.id, 
        emblemId: emblem.id,
        callSign: callSign.toUpperCase() // Force uppercase for tactical look
      };
      
      // Save to local storage
      localStorage.setItem("ranger_avatar", JSON.stringify(avatarData));
      
      // Also save legacy keys for backward compatibility if needed
      localStorage.setItem("ranger_avatar_name", avatarData.callSign);
      localStorage.setItem("ranger_avatar_color", color.hex);

      // Dispatch event so Header/Dashboard can update instantly
      window.dispatchEvent(new Event("avatar-updated"));

      // High-Tech Toast
      toast.success(
        <div className="flex flex-col gap-1">
          <span className="font-mono tracking-wide text-xs font-bold">IDENTITY CONFIRMED</span>
          <span className="text-[10px] opacity-80">Callsign: {avatarData.callSign}</span>
        </div>, 
        {
          icon: "🛡️",
          style: { 
            background: "#050b14", 
            color: color.hex, 
            border: `1px solid ${color.hex}`,
            boxShadow: `0 0 20px ${color.hex}40`
          }
        }
      );
      
      setIsSaving(false);
      if (onClose) onClose();
    }, 1000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full max-w-md mx-auto bg-[#050b14]/95 backdrop-blur-xl border border-cyan-500/30 rounded-2xl overflow-hidden relative shadow-[0_0_50px_rgba(0,0,0,0.8)]"
    >
      
      {/* 1. ATMOSPHERE LAYERS */}
      <div className="absolute inset-0 hero-grid opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-cyan-900/10 pointer-events-none" />

      {/* 2. HEADER HUD */}
      <div className="relative z-10 bg-slate-950/80 p-4 border-b border-cyan-500/20 flex justify-between items-center">
        <div className="flex items-center gap-2 text-cyan-500">
          <Sliders size={16} />
          <h2 className="text-xs font-bold text-cyan-100 uppercase tracking-[0.2em]">
            Suit Calibration
          </h2>
        </div>
        
        <div className="flex gap-3 items-center">
            {isSaving && (
              <div className="flex items-center gap-2 px-2 py-0.5 bg-cyan-500/10 rounded text-[9px] font-mono text-cyan-400 animate-pulse border border-cyan-500/20">
                <RefreshCw size={10} className="animate-spin" />
                WRITING...
              </div>
            )}
            
            {onClose && !isSaving && (
                <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                    <X size={18} />
                </button>
            )}
        </div>
      </div>

      <div className="relative z-10 p-6 space-y-6">
        
        {/* 3. HOLOGRAPHIC PREVIEW */}
        <div className="flex flex-col items-center">
          <div className="relative w-40 h-40 flex items-center justify-center mb-4">
            
            {/* Spinning Rings */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
              className="absolute inset-0 rounded-full border border-dashed border-slate-700"
            />
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
              className={`absolute inset-2 rounded-full border border-dotted opacity-40 ${color.border.replace('bg-', 'border-')}`} 
              style={{ borderColor: color.hex }}
            />

            {/* The Avatar */}
            <motion.div 
              layoutId="avatar-core"
              className={`relative w-28 h-28 rounded-full flex items-center justify-center transition-all duration-500 z-10 ${color.tailwind} shadow-[0_0_30px_rgba(0,0,0,0.5)]`}
              style={{ boxShadow: `0 0 30px ${color.hex}60` }}
            >
              <div className="text-slate-900 drop-shadow-md relative z-10">
                <emblem.Icon size={52} strokeWidth={2.5} />
              </div>
              
              {/* Glossy Overlay */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/40 via-transparent to-transparent opacity-50" />
            </motion.div>
          </div>

          {/* Call Sign Input */}
          <div className="w-full relative group">
            <div className={`absolute -inset-0.5 rounded-lg opacity-30 group-focus-within:opacity-100 transition duration-500 blur ${color.tailwind}`}></div>
            <div className="relative flex items-center bg-slate-900 rounded-lg border border-slate-700 overflow-hidden">
                <div className="pl-3 text-slate-500">
                    <User size={16} />
                </div>
                <input 
                    type="text"
                    value={callSign}
                    onChange={(e) => setCallSign(e.target.value)}
                    placeholder="ENTER CALL-SIGN"
                    maxLength={12}
                    className="w-full bg-transparent border-none text-white font-mono uppercase tracking-widest text-center py-3 focus:ring-0 focus:outline-none placeholder:text-slate-600"
                />
                <div className="pr-3 text-[10px] text-slate-600 font-mono">
                    {callSign.length}/12
                </div>
            </div>
          </div>
        </div>

        {/* 4. CONTROLS */}
        <div className="space-y-5 bg-slate-900/50 p-4 rounded-xl border border-cyan-500/10">
          
          {/* Color Picker */}
          <div>
            <label className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-3 flex items-center gap-2">
              <span className="w-1 h-3 bg-cyan-500 rounded-full"></span>
              Nano-Fiber Pigment
            </label>
            <div className="flex justify-between gap-1">
              {COLORS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setColor(c)}
                  className={`w-10 h-10 rounded-lg transition-all duration-300 relative group flex items-center justify-center overflow-hidden
                    ${color.id === c.id 
                      ? "ring-2 ring-white scale-110 z-10" 
                      : "opacity-60 hover:opacity-100 hover:scale-105"
                    }
                  `}
                  style={{ backgroundColor: c.hex }}
                  title={c.label}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
                  {color.id === c.id && (
                    <motion.div layoutId="check-mark" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <Check size={16} className="text-slate-900 font-bold" strokeWidth={4} />
                    </motion.div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Emblem Picker */}
          <div>
            <label className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-3 flex items-center gap-2">
              <span className="w-1 h-3 bg-cyan-500 rounded-full"></span>
              Squadron Insignia
            </label>
            <div className="grid grid-cols-6 gap-2">
              {EMBLEMS.map((e) => (
                <button
                  key={e.id}
                  onClick={() => setEmblem(e)}
                  className={`aspect-square rounded-md flex items-center justify-center transition-all duration-200 border relative overflow-hidden
                    ${emblem.id === e.id 
                      ? `bg-slate-800 border-cyan-400 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]` 
                      : "bg-slate-900 border-slate-700 text-slate-500 hover:bg-slate-800 hover:text-slate-300 hover:border-slate-600"
                    }
                  `}
                >
                  <e.Icon size={18} />
                  {emblem.id === e.id && (
                    <div className="absolute top-0 right-0 w-2 h-2 bg-cyan-400" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%)' }} />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 5. ACTION FOOTER */}
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="group relative w-full overflow-hidden rounded-lg font-bold text-slate-900 transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {/* Dynamic Background */}
          <div className={`absolute inset-0 transition-colors duration-500 ${color.tailwind}`} />
          
          {/* Shine effect */}
          <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700" />
          
          <div className="relative py-4 flex items-center justify-center gap-2">
            {isSaving ? (
              <>
                <Cpu size={18} className="animate-spin" />
                <span className="tracking-widest">CALIBRATING SUIT...</span>
              </>
            ) : (
              <>
                <Shield size={18} />
                <span className="tracking-widest">CONFIRM LOADOUT</span>
              </>
            )}
          </div>
        </button>

      </div>
    </motion.div>
  );
}