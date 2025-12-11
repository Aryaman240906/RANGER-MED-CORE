import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronRight, Play, Activity, Users, Zap, Globe, Shield 
} from "lucide-react";

// --- COMPONENTS ---
import IntroAnimation from "../components/global/IntroAnimation";
import Logo from "../components/global/Logo";
import DemoControl from "../components/landing/HeroAnimation"; // 👈 Visualization
import RoleExplanationModal from "../components/landing/RoleExplanationModal";
import StartTutorialModal from "../components/landing/StartTutorialModal";

// --- STORE ---
import { useTutorialStore } from "../store/tutorialStore";
import { useDemoStore } from "../store/demoStore";

export default function LandingPage() {
  const navigate = useNavigate();
  
  // State
  const [introDone, setIntroDone] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showTutorialModal, setShowTutorialModal] = useState(false);

  // Store Hooks
  const { startSimulation } = useDemoStore();
  const { openTutorial } = useTutorialStore();

  // --- ACTIONS ---
  const handleStartDemo = () => {
    startSimulation(); 
    navigate("/demo");
  };

  const handleStartTutorial = () => {
    setShowTutorialModal(true);
  };

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col selection:bg-cyan-500/30 overflow-hidden">
      
      {/* 1. INTRO SEQUENCE */}
      {!introDone && <IntroAnimation onComplete={() => setIntroDone(true)} />}

      {/* 2. PAGE-SPECIFIC LIGHTING */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Hero Spotlight */}
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-cyan-500/10 blur-[120px] rounded-full opacity-60" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 blur-[100px] rounded-full" />
      </div>

      {/* 3. GLASS HEADER */}
      <header className="relative z-20 w-full px-6 py-6 max-w-7xl mx-auto flex items-center justify-between">
        <Logo className="w-auto h-10" subtitle />
        
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/login")}
            className="hidden md:flex items-center gap-2 px-4 py-2 text-xs font-mono text-cyan-400/80 hover:text-cyan-300 transition-colors uppercase tracking-widest group"
          >
            <Shield size={12} className="group-hover:text-cyan-400 transition-colors" />
            [ SECURE_LOGIN ]
          </button>
          
          <button
            onClick={() => navigate("/register")}
            className="group relative px-6 py-2.5 overflow-hidden rounded-lg bg-cyan-900/20 border border-cyan-500/30 hover:border-cyan-400/80 transition-all duration-300 shadow-lg shadow-cyan-900/10"
          >
            <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent transition-transform duration-700" />
            <span className="relative text-xs font-bold tracking-[0.2em] text-cyan-100 group-hover:text-white uppercase flex items-center gap-2">
              Initialize <ChevronRight size={12} />
            </span>
          </button>
        </div>
      </header>

      {/* 4. MAIN HERO SECTION */}
      <main className="relative z-10 flex-grow flex flex-col justify-center items-center max-w-7xl mx-auto px-4 py-12 w-full">
        
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
          
          {/* LEFT: MISSION BRIEFING */}
          <motion.div 
            className="space-y-8 text-center lg:text-left order-2 lg:order-1"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              {/* STATUS PILL (Now holds the Tech Stack Name) */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-mono tracking-widest text-cyan-400 mb-6 backdrop-blur-md shadow-[0_0_15px_rgba(34,211,238,0.1)]">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_#22d3ee]" />
                BIO-SYNC NEURAL GRID: ONLINE v5.0
              </div>
              
              {/* MAIN TITLE (Brand Name) */}
              <h1 className="text-5xl md:text-7xl font-black leading-[0.95] tracking-tight text-white mb-6 drop-shadow-2xl uppercase">
                RANGER <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 neon-text">
                  MED-CORE
                </span>
              </h1>
              
              {/* SUBTITLE */}
              <p className="text-lg text-slate-400 max-w-lg mx-auto lg:mx-0 leading-relaxed font-light">
                Advanced tactical health monitoring system. <br/>
                <span className="text-cyan-200/80 font-medium">Optimize readiness</span> and transform biometric data into actionable insights in real-time.
              </p>
            </motion.div>

            {/* ACTION DECK */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              variants={itemVariants}
            >
              <button 
                onClick={handleStartTutorial}
                className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-black transition-all duration-300 bg-cyan-500 rounded-lg hover:bg-cyan-400 hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] ring-offset-2 focus:ring-2 ring-cyan-400"
              >
                <Play size={18} className="mr-2 fill-current" />
                <span>START TUTORIAL</span>
              </button>
              
              <button 
                onClick={handleStartDemo}
                className="px-8 py-4 font-bold text-cyan-300 border border-cyan-500/30 bg-cyan-950/20 rounded-lg hover:bg-cyan-900/40 hover:border-cyan-400 transition-all backdrop-blur-sm flex items-center justify-center gap-2 group"
              >
                <Activity size={18} className="group-hover:scale-110 transition-transform" />
                <span>RUN SIMULATION</span>
              </button>
            </motion.div>

            {/* Role Explainer Trigger */}
            <motion.div variants={itemVariants}>
              <button 
                onClick={() => setShowRoleModal(true)}
                className="mt-4 text-xs text-slate-500 hover:text-cyan-400 transition-colors flex items-center gap-2 mx-auto lg:mx-0 group"
              >
                <Users size={14} className="group-hover:scale-110 transition-transform" />
                <span>What are Ranger / Doctor roles?</span>
              </button>
            </motion.div>
          </motion.div>

          {/* RIGHT: HOLOGRAM EMITTER */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 1, type: "spring", bounce: 0.4 }}
            className="order-1 lg:order-2 flex justify-center relative"
          >
             {/* Hero Animation Component */}
             <div className="relative w-full max-w-[500px] aspect-square">
               <DemoControl />
             </div>
          </motion.div>

        </div>
      </main>

      {/* 5. FOOTER TELEMETRY */}
      <footer className="relative z-20 w-full border-t border-white/5 bg-[#02040a]/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-3 flex flex-col sm:flex-row items-center justify-between text-[10px] font-mono uppercase tracking-wider text-slate-500">
           <div className="flex gap-4">
             <span className="flex items-center gap-1.5">
               <Globe size={12} className="text-cyan-600 animate-pulse" />
               SECURE CONNECTION
             </span>
             <span>LATENCY: 12ms</span>
           </div>
           
           <div className="flex items-center gap-2 mt-2 sm:mt-0">
             <span>Powered by Bio-Sync Neural Grid</span>
             <Zap size={10} className="text-yellow-500" />
           </div>
        </div>
      </footer>

      {/* --- MODALS --- */}
      <AnimatePresence>
        {showRoleModal && (
          <RoleExplanationModal 
            isOpen={showRoleModal} 
            onClose={() => setShowRoleModal(false)} 
          />
        )}
        {showTutorialModal && (
          <StartTutorialModal 
            isOpen={showTutorialModal} 
            onClose={() => setShowTutorialModal(false)} 
          />
        )}
      </AnimatePresence>

    </div>
  );
}