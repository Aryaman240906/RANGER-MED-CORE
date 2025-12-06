// src/components/demo/DoctorMockPanel.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Activity, AlertTriangle, ShieldAlert, HeartPulse 
} from "lucide-react";

// 🩺 MOCK ROSTER DATA
const INITIAL_ROSTER = [
  { id: "R-01", name: "Jason Lee", color: "text-red-500", bg: "bg-red-500", role: "Leader", stability: 45, hr: 145, status: "CRITICAL" },
  { id: "R-02", name: "Billy C.", color: "text-blue-400", bg: "bg-blue-400", role: "Tech", stability: 92, hr: 72, status: "STABLE" },
  { id: "R-03", name: "Kimberly H.", color: "text-pink-400", bg: "bg-pink-400", role: "Scout", stability: 88, hr: 78, status: "STABLE" },
  { id: "R-04", name: "Zack T.", color: "text-slate-100", bg: "bg-slate-100", role: "Heavy", stability: 65, hr: 98, status: "CAUTION" },
  { id: "R-05", name: "Trini K.", color: "text-yellow-400", bg: "bg-yellow-400", role: "Stealth", stability: 78, hr: 82, status: "STABLE" },
  { id: "R-06", name: "Tommy O.", color: "text-green-500", bg: "bg-green-500", role: "Spec-Ops", stability: 32, hr: 160, status: "CRITICAL" },
];

/**
 * 📈 Micro-Chart Component (Zero Dependency SVG)
 * Draws a random jagged line to simulate EKG/Vitals
 */
const VitalGraph = ({ color }) => {
  const [path, setPath] = useState("");

  useEffect(() => {
    // Generate a random EKG-like path
    const generatePath = () => {
      let d = "M0,20 ";
      for (let i = 1; i <= 10; i++) {
        const x = i * 10;
        const y = 20 + (Math.random() - 0.5) * 30; // Random jaggedness
        d += `L${x},${y} `;
      }
      return d;
    };
    setPath(generatePath());

    const interval = setInterval(() => {
      setPath(generatePath());
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden w-[100px] h-[40px]">
      <svg width="100" height="40" className="opacity-80">
        <path 
          d={path} 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          className={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {/* Scanline Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent w-[20%] animate-[ping_2s_linear_infinite] opacity-20" />
    </div>
  );
};

export default function DoctorMockPanel() {
  const [roster, setRoster] = useState(INITIAL_ROSTER);
  const [filter, setFilter] = useState("ALL"); // ALL | CRITICAL

  // 🏥 Simulate Live Data Updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRoster(prev => prev.map(ranger => {
        // Randomly fluctuate vitals
        const drift = Math.floor(Math.random() * 5) - 2; 
        let newStability = Math.min(100, Math.max(0, ranger.stability + drift));
        
        // Update Status based on Stability
        let newStatus = "STABLE";
        if (newStability < 50) newStatus = "CAUTION";
        if (newStability < 40) newStatus = "CRITICAL";

        return {
          ...ranger,
          stability: newStability,
          hr: ranger.hr + (Math.random() > 0.5 ? 1 : -1),
          status: newStatus
        };
      }).sort((a, b) => a.stability - b.stability)); // Always sort Critical to top
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const filteredRoster = filter === "ALL" 
    ? roster 
    : roster.filter(r => r.status === "CRITICAL");

  return (
    <div className="w-full bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col h-[600px]">
      
      {/* --- COMMAND HEADER --- */}
      <div className="bg-slate-900 p-4 border-b border-slate-800 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-800 rounded flex items-center justify-center border border-slate-700">
            <Activity className="text-emerald-400" />
          </div>
          <div>
            <h2 className="text-white font-bold tracking-widest uppercase text-sm">Med-Core Command</h2>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] text-slate-400 font-mono">LIVE MONITORING ACTIVE</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={() => setFilter("ALL")}
            className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${filter === "ALL" ? "bg-slate-700 text-white" : "text-slate-500 hover:text-white"}`}
          >
            ALL UNITS
          </button>
          <button 
            onClick={() => setFilter("CRITICAL")}
            className={`px-3 py-1.5 rounded text-xs font-bold transition-colors flex items-center gap-1 ${filter === "CRITICAL" ? "bg-red-500/20 text-red-400 border border-red-500/50" : "text-slate-500 hover:text-red-400"}`}
          >
            <AlertTriangle size={12} /> TRIAGE
          </button>
        </div>
      </div>

      {/* --- SCROLLABLE LIST CONTAINER --- */}
      <div className="flex-1 overflow-x-auto overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900">
        <div className="min-w-[700px]"> {/* Prevents crushing on mobile */}
          
          {/* GRID HEADER */}
          <div className="grid grid-cols-12 gap-4 px-6 py-2 bg-slate-900/50 border-b border-slate-800 text-[10px] font-mono text-slate-500 uppercase tracking-wider sticky top-0 backdrop-blur-sm z-10">
            <div className="col-span-1">ID</div>
            <div className="col-span-3">Operative</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2 text-center">Stability</div>
            <div className="col-span-2 text-center">Heart Rate</div>
            <div className="col-span-2 text-right">Telemetry</div>
          </div>

          {/* ROSTER ITEMS */}
          <AnimatePresence>
            {filteredRoster.map((ranger) => (
              <motion.div
                layout
                key={ranger.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className={`grid grid-cols-12 gap-4 px-6 py-4 border-b border-slate-800/50 items-center hover:bg-slate-900/40 transition-colors 
                  ${ranger.status === "CRITICAL" ? "bg-red-950/10" : ""}`}
              >
                {/* ID */}
                <div className="col-span-1 font-mono text-xs text-slate-500">{ranger.id}</div>
                
                {/* Name & Role */}
                <div className="col-span-3 flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full ${ranger.bg} flex items-center justify-center text-slate-900 font-bold text-xs`}>
                    {ranger.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-200">{ranger.name}</div>
                    <div className="text-[10px] text-slate-500 uppercase">{ranger.role}</div>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="col-span-2">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border ${
                    ranger.status === "CRITICAL" ? "bg-red-500/10 text-red-400 border-red-500/30 animate-pulse" :
                    ranger.status === "CAUTION" ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/30" :
                    "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                  }`}>
                    {ranger.status === "CRITICAL" && <ShieldAlert size={10} />}
                    {ranger.status}
                  </span>
                </div>

                {/* Stability Score */}
                <div className="col-span-2 text-center">
                  <div className={`text-lg font-mono font-bold ${
                     ranger.stability < 50 ? "text-red-500" : "text-cyan-400"
                  }`}>
                    {ranger.stability}%
                  </div>
                </div>

                {/* Heart Rate */}
                <div className="col-span-2 flex items-center justify-center gap-1 text-slate-400">
                  <HeartPulse size={14} className={ranger.hr > 120 ? "text-red-500 animate-bounce" : "text-slate-600"} />
                  <span className="font-mono text-sm">{ranger.hr}</span> 
                  <span className="text-[10px]">BPM</span>
                </div>

                {/* Live Graph */}
                <div className="col-span-2 flex justify-end">
                  <VitalGraph color={ranger.color} />
                </div>

              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* --- FOOTER --- */}
      <div className="p-3 bg-slate-900 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-500 font-mono">
         <div>SECURE CONNECTION // ENCRYPTED</div>
         <div className="flex items-center gap-2">
            LAST SYNC: JUST NOW
            <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse" />
         </div>
      </div>
    </div>
  );
}