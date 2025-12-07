// src/pages/Landing.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Activity, Shield, Zap, ChevronRight, Terminal } from "lucide-react";

// Components
import IntroAnimation from "../components/global/IntroAnimation";
import Logo from "../components/global/Logo";

export default function Landing() {
  const [introDone, setIntroDone] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#050b14] text-white relative overflow-hidden flex flex-col selection:bg-cyan-500/30">
      
      {/* 1. Intro Sequence */}
      {!introDone && <IntroAnimation onComplete={() => setIntroDone(true)} />}

      {/* 2. Environmental Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Tactical Grid */}
        <div className="absolute inset-0 hero-grid opacity-30" />
        {/* CRT Scanlines */}
        <div className="absolute inset-0 scanlines opacity-10" />
        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#050b14_90%)]" />
        {/* Top Glow Spot */}
        <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-cyan-500/10 blur-[100px] rounded-full" />
      </div>

      {/* 3. Glass Header */}
      <header className="relative z-20 w-full px-6 py-6 max-w-7xl mx-auto flex items-center justify-between">
        <Logo className="w-auto h-10" subtitle />
        
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/login")}
            className="hidden md:flex items-center gap-2 px-4 py-2 text-xs font-mono text-cyan-400 hover:text-white transition-colors"
          >
            [ LOGIN_ACCESS ]
          </button>
          <button
            onClick={() => navigate("/register")}
            className="group relative px-5 py-2 overflow-hidden rounded-md bg-cyan-900/20 border border-cyan-500/30 hover:border-cyan-400/80 transition-all duration-300"
          >
            <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent transition-transform duration-700" />
            <span className="relative text-xs font-bold tracking-widest text-cyan-100 group-hover:text-white uppercase">
              Initialize
            </span>
          </button>
        </div>
      </header>

      {/* 4. Main Hero Section */}
      <main className="relative z-10 flex-grow flex flex-col justify-center max-w-7xl mx-auto px-6 py-12 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column: Copy */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-mono tracking-widest text-cyan-300 mb-6">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                SYSTEM ONLINE v5.0
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black leading-[0.9] tracking-tight text-white mb-6">
                MISSION <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 neon-text">
                  CRITICAL
                </span>
              </h1>
              
              <p className="text-lg text-slate-400 max-w-lg leading-relaxed border-l-2 border-cyan-500/30 pl-6">
                Ranger Med-Core is a high-fidelity command center for predicting stability, 
                tracking medication, and accelerating triage.
                <br />
                <span className="text-cyan-400 text-sm font-mono mt-2 block opacity-80">// DEPLOYMENT READY</span>
              </p>
            </motion.div>

            <motion.div 
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Link 
                to="/demo" 
                className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-cyan-600 font-lg rounded-sm hover:bg-cyan-500 hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] focus:outline-none ring-offset-2 focus:ring-2 ring-cyan-400"
              >
                <span>LAUNCH_DEMO</span>
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <button 
                onClick={() => navigate("/login")}
                className="px-8 py-4 font-bold text-cyan-200 border border-cyan-500/30 rounded-sm hover:bg-cyan-950/50 hover:border-cyan-400 transition-all backdrop-blur-sm"
              >
                AUTHENTICATE
              </button>
            </motion.div>
          </div>

          {/* Right Column: Holographic HUD */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="hidden lg:block relative"
          >
            {/* The Main Card */}
            <div className="relative z-10 w-full max-w-md mx-auto aspect-square bg-[#08101f]/80 backdrop-blur-md border border-cyan-500/20 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)] group hover:border-cyan-500/40 transition-colors duration-500">
              {/* Card Header */}
              <div className="h-12 border-b border-cyan-500/20 bg-cyan-950/30 flex items-center justify-between px-4">
                 <div className="flex gap-2">
                   <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                   <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                   <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                 </div>
                 <span className="text-[10px] font-mono text-cyan-500/60">MED-CORE TERMINAL</span>
              </div>

              {/* Card Body (Simulated Dashboard) */}
              <div className="p-6 space-y-6">
                {/* 1. Status Row */}
                <div className="flex items-center justify-between pb-4 border-b border-cyan-500/10">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                      <Activity size={20} />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400">System Status</div>
                      <div className="text-sm font-bold text-white">OPTIMAL</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-400">Uptime</div>
                    <div className="text-sm font-mono text-cyan-300">99.9%</div>
                  </div>
                </div>

                {/* 2. Grid Metric */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Bio-Grid Load</span>
                    <span>78%</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full w-[78%] bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
                  </div>
                </div>

                 {/* 3. Action Buttons Mockup */}
                 <div className="grid grid-cols-2 gap-3">
                   <div className="p-3 bg-cyan-500/5 border border-cyan-500/20 rounded-lg flex flex-col items-center justify-center gap-2 hover:bg-cyan-500/10 transition-colors cursor-default">
                      <Shield size={18} className="text-cyan-400" />
                      <span className="text-[10px] font-bold text-cyan-200">DEFENSE</span>
                   </div>
                   <div className="p-3 bg-cyan-500/5 border border-cyan-500/20 rounded-lg flex flex-col items-center justify-center gap-2 hover:bg-cyan-500/10 transition-colors cursor-default">
                      <Zap size={18} className="text-yellow-400" />
                      <span className="text-[10px] font-bold text-cyan-200">ENERGY</span>
                   </div>
                 </div>

                 {/* 4. Terminal Output */}
                 <div className="mt-2 p-3 bg-black/40 rounded-md border border-cyan-500/10 font-mono text-[10px] text-cyan-600/80 leading-relaxed overflow-hidden">
                    <p>&gt; Connecting to secure server...</p>
                    <p>&gt; Handshake established.</p>
                    <p className="animate-pulse">&gt; Awaiting user input_</p>
                 </div>
              </div>
            </div>

            {/* Floating Decorative Elements behind card */}
            <div className="absolute -top-10 -right-10 w-32 h-32 border border-cyan-500/20 rounded-full border-dashed animate-spin-slow opacity-30" />
            <div className="absolute -bottom-5 -left-5 w-24 h-24 border border-blue-500/20 rounded-full animate-reverse-spin opacity-30" />
          </motion.div>
        </div>
      </main>

      {/* 5. Footer Telemetry Bar */}
      <footer className="relative z-20 w-full bg-[#02040a] border-t border-cyan-500/20">
        <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-cyan-600/60">
           <div className="flex gap-4">
             <span className="flex items-center gap-1">
               <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
               SERVER: US-EAST-1
             </span>
             <span className="hidden sm:inline">LATENCY: 12ms</span>
           </div>
           
           <div className="flex items-center gap-2">
             <Terminal size={10} />
             <span className="animate-pulse">DECRYPTING DATA STREAM...</span>
           </div>
        </div>
      </footer>
    </div>
  );
}