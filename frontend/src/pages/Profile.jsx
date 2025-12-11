import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Shield, Zap, Activity, Award, Terminal, 
  LogOut, PlayCircle, Settings, FileText, Pill, ShieldAlert, Power 
} from "lucide-react";
import { Toaster } from "react-hot-toast";

// --- STORES ---
import { useAvatarStore } from "../store/avatarStore";
import { useAuthStore } from "../store/authStore";
import { useDemoStore } from "../store/demoStore"; 
import { useTutorialStore } from "../store/tutorialStore";
import { getStreak } from "../services/localPersistence";

// --- COMPONENTS ---
import AvatarPreview from "../components/profile/AvatarPreview";
import EnterMorphinGridButton from "../components/profile/EnterMorphinGridButton";
import AvatarBuilderModal from "../components/avatar/AvatarBuilderModal";
import BottomTabNav from "../components/global/BottomTabNav";
import TutorialOverlay from "../components/tutorial/TutorialOverlay";
import ConfettiListener from "../components/global/Confetti";

// --- ANIMATION VARIANTS ---
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { staggerChildren: 0.1, delayChildren: 0.2, duration: 0.5 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

/**
 * 👤 PROFILE COMMAND CENTER
 * The hub for viewing Ranger status, stats, and identity configuration.
 */
export default function Profile() {
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [streakData, setStreakData] = useState({ count: 0 });
  
  // Connect to stores
  const { appliedAvatar, loadFromStorage } = useAvatarStore();
  const { user, logout } = useAuthStore();
  const { events } = useDemoStore(); 
  const { showForUser, openTutorial } = useTutorialStore();

  // --- 1. INITIALIZATION ---
  useEffect(() => {
    loadFromStorage();
    setStreakData(getStreak()); // Load real streak

    // Trigger Tutorial if needed
    const t = setTimeout(() => {
      showForUser('profile');
    }, 600);
    return () => clearTimeout(t);
  }, [loadFromStorage, showForUser]);

  return (
    <div className="min-h-screen bg-[#050b14] relative overflow-y-auto flex flex-col items-center justify-start p-4 sm:p-8 pt-12 pb-32">
      
      {/* 1. ATMOSPHERE LAYERS */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 hero-grid opacity-20" />
        <div className="absolute inset-0 scanlines opacity-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.05),transparent_80%)]" />
      </div>

      {/* Global Overlays */}
      <ConfettiListener />
      <TutorialOverlay />
      <Toaster position="top-right" />

      {/* 2. MAIN PROFILE CARD */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-lg bg-slate-900/80 border border-slate-700/50 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl"
      >
        {/* Card Header Decoration */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
        
        {/* Top Left: Terminal Icon Decoration */}
        <div className="absolute top-0 left-0 p-5 opacity-40 text-cyan-500">
           <Terminal size={14} />
        </div>

        {/* 👆 FIX: LOGOUT MOVED TO TOP RIGHT (Power Button Style) */}
        <button
          onClick={logout}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/50 border border-slate-700 text-slate-400 hover:text-rose-400 hover:border-rose-500/50 hover:bg-rose-500/10 transition-all group z-20"
          title="End Session"
        >
          <Power size={18} className="group-hover:drop-shadow-[0_0_8px_rgba(244,63,94,0.5)] transition-all" />
        </button>

        <div className="p-8 flex flex-col items-center text-center space-y-8">
          
          {/* A. AVATAR & IDENTITY */}
          <motion.div 
            variants={itemVariants} 
            className="flex flex-col items-center gap-4 w-full"
          >
            <div 
              data-tour="avatar-preview" 
              className="relative group cursor-pointer" 
              onClick={() => setIsBuilderOpen(true)}
            >
              {/* The Preview Component */}
              <AvatarPreview avatar={appliedAvatar} size="lg" />
              
              {/* Scanning Ring Animation */}
              <div className="absolute inset-[-10px] rounded-full border border-cyan-500/20 border-dashed animate-spin-slow opacity-50 pointer-events-none" />
              
              {/* Edit Hint Overlay */}
              <div className="absolute inset-0 rounded-full flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm border border-cyan-500/50">
                <Settings size={24} className="text-cyan-400" />
              </div>
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl font-black text-white tracking-tight uppercase drop-shadow-md">
                {user?.name || "Ranger Operative"}
              </h1>
              <div className="flex items-center justify-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-widest font-bold bg-slate-800 border border-slate-700 text-slate-400`}>
                  {user?.role || "Unit-Unknown"}
                </span>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]" />
                  <span className="text-[9px] text-emerald-400 font-mono tracking-wider font-bold">ACTIVE</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* B. TACTICAL STATS GRID */}
          <motion.div 
            variants={itemVariants} 
            data-tour="profile-stats"
            className="w-full grid grid-cols-3 gap-3"
          >
            <StatBox 
              icon={Zap} 
              label="Streak" 
              value={`${streakData.count} Day`} 
              color="text-yellow-400" 
              glow="shadow-yellow-500/20" 
            />
            <StatBox 
              icon={Activity} 
              label="Missions" 
              value={events?.length || 0} 
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
          <motion.div 
            variants={itemVariants} 
            data-tour="enter-morphin"
            className="w-full pt-2"
          >
            <EnterMorphinGridButton onOpen={() => setIsBuilderOpen(true)} />
          </motion.div>

          {/* D. TRAINING DECK (Tutorial Replays) */}
          <motion.div variants={itemVariants} className="w-full pt-4 border-t border-white/5">
            <h3 className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-3 text-left">
              Training Modules
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <TutorialButton label="Dashboard Brief" onClick={() => openTutorial('dashboard', { mode: 'always' })} />
              <TutorialButton label="Dose Protocols" onClick={() => openTutorial('dose', { mode: 'always' })} icon={Pill} />
              <TutorialButton label="Bio-Scan Ops" onClick={() => openTutorial('log', { mode: 'always' })} icon={FileText} />
              <TutorialButton label="Alert Handling" onClick={() => openTutorial('alerts', { mode: 'always' })} icon={ShieldAlert} />
            </div>
          </motion.div>

          {/* E. FOOTER INFO (Logout removed from here) */}
          <motion.div 
            variants={itemVariants}
            className="w-full pt-4 flex justify-center opacity-40"
          >
            <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">
              ID: {user?.id || "UNREGISTERED"} • V5.0.2
            </p>
          </motion.div>

        </div>
      </motion.div>

      {/* 3. THE BUILDER MODAL */}
      <AvatarBuilderModal 
        isOpen={isBuilderOpen} 
        onClose={() => setIsBuilderOpen(false)} 
      />

      {/* 4. NAVIGATION */}
      <BottomTabNav />

    </div>
  );
}

// --- SUB-COMPONENTS ---

const StatBox = ({ icon: Icon, label, value, color, glow }) => (
  <div className={`
    group relative p-3 rounded-xl bg-slate-950/40 border border-slate-800 
    hover:border-slate-600 transition-all duration-300 flex flex-col items-center gap-2
    hover:bg-slate-900 cursor-default
  `}>
    <div className={`p-2 rounded-lg bg-slate-900 ${color} bg-opacity-10 group-hover:scale-110 transition-transform ${glow}`}>
      <Icon size={18} className={color} />
    </div>
    <div className="text-center">
      <div className="text-sm font-bold text-white font-mono leading-none mb-1">{value}</div>
      <div className="text-[8px] text-slate-500 uppercase tracking-widest font-bold">{label}</div>
    </div>
  </div>
);

const TutorialButton = ({ label, onClick, icon: Icon = PlayCircle }) => (
  <button 
    onClick={onClick}
    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900/50 border border-slate-800 hover:border-cyan-500/30 hover:bg-slate-800 transition-all text-[10px] text-slate-400 hover:text-cyan-400 font-bold uppercase tracking-wide text-left"
  >
    <Icon size={12} className="shrink-0" />
    <span className="truncate">{label}</span>
  </button>
);