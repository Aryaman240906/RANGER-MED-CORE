// src/components/landing/HeroAnimation.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Shield, Activity, Zap, Cpu, ScanFace, 
  Globe, Radio, Disc 
} from "lucide-react";

/**
 * 🌌 HERO HOLOGRAM EMITTER
 * A cinematic, 3D-simulated projection of the Ranger system.
 * Serves as the visual anchor for the Landing Page.
 */
export default function HeroAnimation() {
  const [scanLine, setScanLine] = useState(0);

  // Cycle the "System Status" text
  const [statusText, setStatusText] = useState("INITIALIZING");
  useEffect(() => {
    const states = ["BIO-SYNC...", "ESTABLISHING UPLINK...", "READINESS: 98%", "SYSTEM ONLINE"];
    let i = 0;
    const interval = setInterval(() => {
      setStatusText(states[i]);
      i = (i + 1) % states.length;
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center perspective-[1200px] select-none pointer-events-none">
      
      {/* 1. ATMOSPHERIC GLOW (The "Room" Light) */}
      <div className="absolute inset-0 bg-cyan-500/5 blur-[80px] rounded-full animate-pulse" />

      {/* 2. THE FLOATING ASSEMBLY */}
      <motion.div
        animate={{ y: [-10, 10, -10] }}
        transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
        className="relative w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] flex items-center justify-center preserve-3d"
      >
        
        {/* --- ORBITAL RINGS (The HUD) --- */}
        
        {/* Outer Ring (Slow, Clockwise) */}
        <motion.div
          animate={{ rotate: 360, rotateX: 10, rotateY: 5 }}
          transition={{ duration: 30, ease: "linear", repeat: Infinity }}
          className="absolute inset-[-10%] rounded-full border border-dashed border-cyan-500/20 shadow-[0_0_30px_rgba(34,211,238,0.1)]"
        />
        
        {/* Middle Ring (Medium, Counter-Clockwise, Tilted) */}
        <motion.div
          animate={{ rotate: -360, rotateX: 20, rotateY: -10 }}
          transition={{ duration: 20, ease: "linear", repeat: Infinity }}
          className="absolute inset-[10%] rounded-full border-[1px] border-cyan-400/30 border-t-transparent border-b-transparent"
        />
        
        {/* Inner Ring (Fast, Gyroscopic) */}
        <motion.div
          animate={{ rotateX: [0, 360], rotateY: [0, 180] }}
          transition={{ duration: 12, ease: "linear", repeat: Infinity }}
          className="absolute inset-[25%] rounded-full border border-dotted border-white/20"
        />


        {/* --- CENTRAL HOLOGRAM (The Ranger Helmet) --- */}
        <div className="relative z-20 w-48 h-48 sm:w-64 sm:h-64 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">
          {/* SVG Silhouette */}
          <svg viewBox="0 0 24 24" className="w-full h-full stroke-cyan-400 fill-cyan-500/10" strokeWidth="0.5">
            <path d="M12 2C7.58 2 4 5.58 4 10v2c0 1.1.9 2 2 2h1v6c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2v-6h1c1.1 0 2-.9 2-2v-2c0-4.42-3.58-8-8-8zm0 2c3.31 0 6 2.69 6 6v1H6v-1c0-3.31 2.69-6 6-6zm-1 9h2v7h-2v-7z" />
            <path d="M9 10a3 3 0 1 1 6 0" className="animate-pulse" strokeOpacity="0.8" />
          </svg>
          
          {/* Glitch Overlay */}
          <div className="absolute inset-0 bg-cyan-400/20 mix-blend-overlay opacity-0 animate-[glitch_3s_infinite]" 
               style={{ clipPath: 'polygon(0 0, 100% 0, 100% 40%, 0 40%)' }} />
          
          {/* Scanning Laser Beam */}
          <motion.div
            animate={{ top: ["0%", "100%", "0%"] }}
            transition={{ duration: 4, ease: "linear", repeat: Infinity }}
            className="absolute left-[-20%] right-[-20%] h-[2px] bg-cyan-400/50 blur-[2px] shadow-[0_0_20px_#22d3ee]"
          />
        </div>


        {/* --- FLOATING DATA NODES (Satellites) --- */}
        
        {/* Node 1: Shield Status */}
        <motion.div 
          animate={{ x: [60, 70, 60], y: [-80, -90, -80], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 flex items-center gap-2"
        >
          <div className="w-8 h-8 rounded-full border border-emerald-500/30 bg-emerald-900/20 flex items-center justify-center backdrop-blur-md">
            <Shield size={14} className="text-emerald-400" />
          </div>
          <div className="flex flex-col">
            <div className="h-[1px] w-8 bg-emerald-500/50" />
            <span className="text-[8px] font-mono text-emerald-400">DEF: 100%</span>
          </div>
        </motion.div>

        {/* Node 2: Activity */}
        <motion.div 
          animate={{ x: [-90, -100, -90], y: [40, 50, 40], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
          className="absolute top-1/2 left-1/2 flex flex-row-reverse items-center gap-2"
        >
          <div className="w-8 h-8 rounded-full border border-amber-500/30 bg-amber-900/20 flex items-center justify-center backdrop-blur-md">
            <Activity size={14} className="text-amber-400" />
          </div>
          <div className="flex flex-col items-end">
            <div className="h-[1px] w-8 bg-amber-500/50" />
            <span className="text-[8px] font-mono text-amber-400">HR: 64</span>
          </div>
        </motion.div>

         {/* Node 3: CPU/Core */}
         <motion.div 
          animate={{ x: [80, 90, 80], y: [60, 50, 60], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 4.5, repeat: Infinity, delay: 2 }}
          className="absolute top-1/2 left-1/2 flex items-center gap-2"
        >
          <div className="w-8 h-8 rounded-full border border-purple-500/30 bg-purple-900/20 flex items-center justify-center backdrop-blur-md">
            <Cpu size={14} className="text-purple-400" />
          </div>
          <div className="flex flex-col">
            <div className="h-[1px] w-8 bg-purple-500/50" />
            <span className="text-[8px] font-mono text-purple-400">CORE: OK</span>
          </div>
        </motion.div>

      </motion.div>


      {/* 3. BASE EMITTER (The Projector) */}
      <div className="absolute bottom-[-40px] flex flex-col items-center z-0">
        {/* Light Cone */}
        <div 
          className="w-80 h-40 bg-gradient-to-t from-transparent to-transparent opacity-30 blur-2xl pointer-events-none"
          style={{ background: `conic-gradient(from 180deg at 50% 100%, transparent -35deg, rgba(34,211,238,0.4) 0deg, transparent 35deg)` }}
        />
        
        {/* Physical Base */}
        <div className="w-48 h-12 rounded-[100%] border border-cyan-500/20 bg-[#050b14]/80 backdrop-blur-xl shadow-[0_0_40px_rgba(34,211,238,0.15)] flex items-center justify-center relative overflow-hidden">
          {/* Spinning Fan Effect */}
          <motion.div 
             animate={{ rotate: 360 }}
             transition={{ duration: 2, ease: "linear", repeat: Infinity }}
             className="absolute inset-0 border-[4px] border-dashed border-cyan-500/10 rounded-full"
          />
          <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_15px_white] z-10" />
          <div className="absolute inset-x-0 top-1/2 h-[1px] bg-cyan-500/30" />
        </div>

        {/* Text Readout */}
        <div className="mt-4 flex flex-col items-center gap-1">
          <div className="flex items-center gap-2 text-[9px] font-mono text-cyan-400/80 uppercase tracking-[0.3em]">
            <Radio size={10} className="animate-pulse" />
            {statusText}
          </div>
          <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
        </div>
      </div>

    </div>
  );
}