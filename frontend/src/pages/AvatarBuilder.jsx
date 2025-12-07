// src/pages/AvatarBuilder.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import AvatarBuilder from "../components/ranger/AvatarBuilder";
import Logo from "../components/global/Logo"; // Assuming you have this from Step 1

export default function AvatarBuilderPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#050b14] relative flex flex-col items-center justify-center overflow-hidden p-4">
      
      {/* --- 1. ATMOSPHERE & BACKGROUND --- */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Tactical Grid */}
        <div className="absolute inset-0 hero-grid opacity-20" />
        
        {/* CRT Scanlines */}
        <div className="absolute inset-0 scanlines opacity-10" />
        
        {/* Vignette (Focus attention on center) */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#050b14_85%)]" />
        
        {/* Ambient Glow */}
        <div className="absolute top-[-20%] left-[50%] -translate-x-1/2 w-[600px] h-[600px] bg-cyan-500/10 blur-[100px] rounded-full" />
      </div>

      {/* --- 2. TOP CORNER BRANDING --- */}
      <div className="absolute top-6 left-6 z-20 opacity-80 hover:opacity-100 transition-opacity">
        <div 
          onClick={() => navigate("/dashboard")} 
          className="cursor-pointer flex items-center gap-3"
        >
          <Logo className="w-10 h-10" />
          <div className="hidden sm:block">
            <h1 className="text-sm font-bold text-white tracking-widest">RANGER MED-CORE</h1>
            <p className="text-[10px] text-cyan-500 font-mono">ARMORY DECK // LEVEL 1</p>
          </div>
        </div>
      </div>

      {/* --- 3. MAIN CONTENT --- */}
      <div className="relative z-10 w-full flex flex-col items-center">
        
        {/* The Builder Component */}
        <AvatarBuilder onClose={() => navigate("/dashboard")} />
        
        {/* Contextual Footer Text */}
        <div className="mt-8 text-center space-y-2">
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em]">
            System Calibration Required before Deployment
          </p>
          <div className="flex items-center justify-center gap-2">
            <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[9px] font-mono text-emerald-500/60">SERVER CONNECTION STABLE</span>
          </div>
        </div>
      </div>

    </div>
  );
}