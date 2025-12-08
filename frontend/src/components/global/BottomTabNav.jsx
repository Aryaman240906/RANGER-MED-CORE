// src/components/global/BottomTabNav.jsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, // Home
  Pill,            // Dose
  ClipboardList,   // Log
  ShieldAlert,     // Alerts
  UserCircle       // Profile
} from "lucide-react";

// --- STORE ---
import { useDemoStore } from "../../store/demoStore";

/**
 * 🧭 TACTICAL NAVIGATION DECK
 * The persistent footer navigation. Handles routing between command modules.
 * Features active state tracking, alert badges, and fluid motion backgrounds.
 */
const TabButton = ({ active, onClick, label, Icon, badgeCount, id }) => (
  <motion.button
    onClick={onClick}
    whileTap={{ scale: 0.9 }}
    className={`relative flex-1 py-3 px-1 rounded-xl flex flex-col items-center justify-center transition-all duration-300 group outline-none select-none ${
      active ? "text-cyan-400" : "text-slate-500 hover:text-slate-300"
    }`}
    aria-label={label}
    data-tour={`nav-${id}`} // Granular targeting for future tutorials
  >
    {/* Active Background Glow (Sliding Pill Effect) */}
    {active && (
      <motion.div
        layoutId="nav-glow"
        className="absolute inset-0 bg-cyan-500/10 rounded-xl blur-md border border-cyan-500/20"
        transition={{ type: "spring", stiffness: 350, damping: 30 }}
      />
    )}

    {/* Notification Badge (Pulse) */}
    {badgeCount > 0 && (
      <span className="absolute top-2 right-1/2 translate-x-3 -translate-y-1 z-20 flex h-2.5 w-2.5 pointer-events-none">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border border-[#050b14]"></span>
      </span>
    )}

    {/* Icon Layer */}
    <div className="relative z-10 transition-transform duration-300 group-active:scale-95">
      <Icon 
        size={22} 
        strokeWidth={active ? 2.5 : 2}
        className={`transition-all duration-300 ${active ? "drop-shadow-[0_0_8px_rgba(34,211,238,0.6)] scale-110" : "opacity-80"}`} 
      />
    </div>
    
    {/* Label Layer */}
    <span className={`text-[10px] font-medium mt-1 relative z-10 tracking-wide transition-all duration-300 ${active ? "font-bold text-cyan-100" : "scale-90"}`}>
      {label}
    </span>
  </motion.button>
);

export default function BottomTabNav() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Connect to store for live badges
  const alertsUnacknowledged = useDemoStore((state) => state.alertsUnacknowledged);

  const isActive = (path) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-6 pointer-events-none flex justify-center">
      
      {/* Navigation Container */}
      <nav 
        data-tour="nav-deck" // 👈 Main Tutorial Target
        className="pointer-events-auto w-full max-w-md bg-[#050b14]/95 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.8)] rounded-2xl p-1.5 flex items-center justify-between ring-1 ring-white/5"
      >
        
        <TabButton 
          id="dashboard"
          Icon={LayoutDashboard} 
          label="Dash" 
          active={isActive("/dashboard")} 
          onClick={() => navigate("/dashboard")} 
        />
        
        <TabButton 
          id="dose"
          Icon={Pill} 
          label="Dose" 
          active={isActive("/dose")} 
          onClick={() => navigate("/dose")} 
        />
        
        <TabButton 
          id="log"
          Icon={ClipboardList} 
          label="Log" 
          active={isActive("/log")} 
          onClick={() => navigate("/log")} 
        />
        
        <TabButton 
          id="alerts"
          Icon={ShieldAlert} 
          label="Alerts" 
          active={isActive("/alerts")} 
          onClick={() => navigate("/alerts")}
          badgeCount={alertsUnacknowledged}
        />
        
        <TabButton 
          id="profile"
          Icon={UserCircle} 
          label="Profile" 
          active={isActive("/profile")} 
          onClick={() => navigate("/profile")} 
        />

      </nav>
    </div>
  );
}