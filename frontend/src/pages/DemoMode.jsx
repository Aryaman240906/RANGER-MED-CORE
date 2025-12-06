// src/pages/DemoMode.jsx
import React from "react";
import { motion } from "framer-motion";
import { Activity, Terminal, ShieldAlert, ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useDemoStore } from "../store/demoStore";

// Import the controls we just built
import ScenarioSlider from "../components/demo/ScenarioSlider";
import DemoControls from "../components/demo/DemoControls";

export default function DemoMode() {
  // Connect to the brain
  const stability = useDemoStore((s) => s.stability);
  const readiness = useDemoStore((s) => s.readiness);
  const riskScore = useDemoStore((s) => s.riskScore);
  const confidence = useDemoStore((s) => s.confidence);
  const events = useDemoStore((s) => s.events);
  const assistantMessage = useDemoStore((s) => s.assistantMessage);

  return (
    <div className="min-h-screen bg-slate-950 text-cyan-50 font-sans p-6 relative overflow-hidden">
      
      {/* 🌌 BACKGROUND GRID EFFECT */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none" 
        style={{ backgroundImage: 'linear-gradient(#22d3ee 1px, transparent 1px), linear-gradient(90deg, #22d3ee 1px, transparent 1px)', backgroundSize: '40px 40px' }}
      />
      <div className="absolute inset-0 bg-radial-gradient from-transparent to-slate-950 pointer-events-none" />

      {/* HEADER */}
      <header className="relative z-10 flex items-center justify-between mb-8 border-b border-cyan-500/30 pb-4">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="p-2 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-400 transition-colors">
            <ChevronLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-widest uppercase text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
              Simulation Deck
            </h1>
            <p className="text-xs text-slate-400 font-mono">Ranger Med-Core // Physics Engine Diagnostic</p>
          </div>
        </div>
        <div className="px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/50 text-xs font-mono text-cyan-300 animate-pulse">
          ● SYSTEM ONLINE
        </div>
      </header>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        
        {/* 🎛️ LEFT COL: CONTROLS */}
        <div className="space-y-6">
          <section>
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Terminal size={16} /> Input Parameters
            </h2>
            <div className="space-y-4">
              <ScenarioSlider />
              <DemoControls />
            </div>
          </section>

          {/* AI ASSISTANT DEBUG VIEW */}
          <section className="p-4 rounded-xl bg-slate-900/80 border border-purple-500/30 backdrop-blur-md">
             <h2 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2">
               AI Hologram Output
             </h2>
             <div className="font-mono text-sm text-purple-200">
               {assistantMessage || "Waiting for neural input..."}
             </div>
          </section>
        </div>

        {/* 📊 RIGHT COL: LIVE TELEMETRY */}
        <div className="space-y-6">
           <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Activity size={16} /> Live Telemetry
            </h2>

            {/* RAW DATA CARDS */}
            <div className="grid grid-cols-2 gap-4">
              <DataCard label="Stability" value={stability + "%"} color="cyan" />
              <DataCard label="Readiness" value={readiness + "%"} color="blue" />
              <DataCard label="Risk Score" value={riskScore} color="red" />
              <DataCard label="Confidence" value={confidence + "%"} color="emerald" />
            </div>

            {/* EVENT LOG STREAM */}
            <div className="rounded-xl bg-slate-900/90 border border-slate-700 overflow-hidden h-[300px] flex flex-col">
              <div className="p-3 bg-slate-800/50 border-b border-slate-700 text-xs font-bold text-slate-300 uppercase">
                Event Stream Log
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs">
                {events.length === 0 && (
                  <div className="text-slate-600 text-center mt-10 italic">No events logged yet. Start simulation.</div>
                )}
                {events.map((ev) => (
                  <motion.div 
                    key={ev.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex gap-3 pb-2 border-b border-slate-800/50 ${
                      ev.type === 'danger' ? 'text-red-400' : 
                      ev.type === 'warning' ? 'text-amber-400' : 
                      ev.type === 'success' ? 'text-green-400' : 'text-slate-400'
                    }`}
                  >
                    <span className="opacity-50 select-none">[{ev.time}]</span>
                    <span>{ev.type === 'danger' && '⚠ '} {ev.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>
        </div>

      </div>
    </div>
  );
}

// Simple Helper Component for the Grid
const DataCard = ({ label, value, color }) => {
  const colors = {
    cyan: "text-cyan-400 border-cyan-500/30 bg-cyan-950/20",
    blue: "text-blue-400 border-blue-500/30 bg-blue-950/20",
    red: "text-red-400 border-red-500/30 bg-red-950/20",
    emerald: "text-emerald-400 border-emerald-500/30 bg-emerald-950/20",
  };

  return (
    <div className={`p-4 rounded-xl border flex flex-col items-center justify-center ${colors[color] || colors.cyan}`}>
      <span className="text-3xl font-bold font-mono tracking-tighter">{value}</span>
      <span className="text-[10px] uppercase opacity-70 mt-1">{label}</span>
    </div>
  );
};