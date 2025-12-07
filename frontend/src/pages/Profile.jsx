// src/pages/Profile.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, Zap, Activity, Award, Terminal } from "lucide-react";

// --- STORES ---
import { useAvatarStore } from "../store/avatarStore";
import { useAuthStore } from "../store/authStore";

// --- COMPONENTS ---
import AvatarPreview from "../components/profile/AvatarPreview";
import EnterMorphinGridButton from "../components/profile/EnterMorphinGridButton";
import AvatarBuilderModal from "../components/avatar/AvatarBuilderModal";

/**
 * 👤 PROFILE COMMAND CENTER
 * The hub for viewing Ranger status, stats, and identity configuration.
 */
export default function Profile() {
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  
  // Connect to stores
  const { appliedAvatar, loadFromStorage } = useAvatarStore();
  const { user } = useAuthStore();

  // Load avatar data on mount
  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-[#050b14] relative overflow-hidden flex flex-col items-center justify-center p-4 sm:p-8">
      
      {/* 1. ATMOSPHERE LAYERS */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 hero-grid opacity-20" />
        <div className="absolute inset-0 scanlines opacity-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.05),transparent_80%)]" />
      </div>

      {/* 2. MAIN PROFILE CARD */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-2xl bg-slate-900/60 border border-slate-700/50 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl"
      >
        {/* Card Header Decoration */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
        <div className="absolute top-0 right-0 p-4 opacity-50">
           <Terminal size={16} className="text-cyan-500" />
        </div>

        <div className="p-8 flex flex-col items-center text-center space-y-8">
          
          {/* A. AVATAR & IDENTITY */}
          <motion.div variants={itemVariants} className="flex flex-col items-center gap-4">
            <div className="relative group cursor-pointer" onClick={() => setIsBuilderOpen(true)}>
              {/* The Preview Component */}
              <AvatarPreview avatar={appliedAvatar} size="lg" />
              
              {/* Edit Hint Overlay */}
              <div className="absolute inset-0 rounded-full flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-[10px] font-mono font-bold text-cyan-400 tracking-widest uppercase">
                  Edit Suit
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <h1 className="text-3xl font-black text-white tracking-tight uppercase drop-shadow-md">
                {user?.name || "Ranger Operative"}
              </h1>
              <div className="flex items-center justify-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-widest font-bold bg-slate-800 border border-slate-700 text-slate-400`}>
                  {user?.role || "Unit-Unknown"}
                </span>
                <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]" />
                <span className="text-[10px] text-emerald-500/80 font-mono tracking-wider">ACTIVE</span>
              </div>
            </div>
          </motion.div>

          {/* B. TACTICAL STATS GRID */}
          <motion.div variants={itemVariants} className="w-full grid grid-cols-3 gap-4">
            <StatBox 
              icon={Zap} 
              label="Streak" 
              value="12 Days" 
              color="text-yellow-400" 
              glow="shadow-yellow-500/20" 
            />
            <StatBox 
              icon={Activity} 
              label="XP Level" 
              value="Lvl 05" 
              color="text-cyan-400" 
              glow="shadow-cyan-500/20" 
            />
            <StatBox 
              icon={Award} 
              label="Rank" 
              value="Elite" 
              color="text-purple-400" 
              glow="shadow-purple-500/20" 
            />
          </motion.div>

          {/* C. MORPHIN GRID ENTRY */}
          <motion.div variants={itemVariants} className="w-full pt-4 border-t border-white/5">
            <EnterMorphinGridButton onOpen={() => setIsBuilderOpen(true)} />
            
            <p className="mt-4 text-[10px] text-slate-500 font-mono uppercase tracking-[0.2em]">
              System Version 5.0.2 // Secure Connection
            </p>
          </motion.div>

        </div>
      </motion.div>

      {/* 3. THE BUILDER MODAL */}
      <AvatarBuilderModal 
        isOpen={isBuilderOpen} 
        onClose={() => setIsBuilderOpen(false)} 
      />

    </div>
  );
}

// --- SUB-COMPONENT: STAT BOX ---
const StatBox = ({ icon: Icon, label, value, color, glow }) => (
  <div className={`
    group relative p-4 rounded-xl bg-slate-950/40 border border-slate-800 
    hover:border-slate-600 transition-all duration-300 flex flex-col items-center gap-2
    hover:shadow-lg ${glow}
  `}>
    <div className={`p-2 rounded-lg bg-slate-900 ${color} bg-opacity-10 group-hover:scale-110 transition-transform`}>
      <Icon size={18} className={color} />
    </div>
    <div className="text-center">
      <div className="text-lg font-bold text-white font-mono leading-none mb-1">{value}</div>
      <div className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">{label}</div>
    </div>
  </div>
);