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

const TabButton = ({ active, onClick, label, Icon, badgeCount }) => (
  <button
    onClick={onClick}
    className={`relative flex-1 py-3 px-1 rounded-xl flex flex-col items-center justify-center transition-all duration-300 group ${
      active ? "text-cyan-400" : "text-slate-500 hover:text-slate-300"
    }`}
  >
    {/* Active Background Glow */}
    {active && (
      <motion.div
        layoutId="nav-glow"
        className="absolute inset-0 bg-cyan-500/10 rounded-xl blur-md"
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />
    )}

    {/* Notification Badge */}
    {badgeCount > 0 && (
      <span className="absolute top-2 right-1/2 translate-x-2 -translate-y-1 z-20 flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border border-[#050b14]"></span>
      </span>
    )}

    {/* Icon */}
    <div className="relative z-10 transition-transform duration-300 group-active:scale-90">
      <Icon 
        size={24} 
        strokeWidth={active ? 2.5 : 2}
        className={active ? "drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" : ""} 
      />
    </div>
    
    {/* Label */}
    <span className={`text-[10px] font-medium mt-1 relative z-10 tracking-wide ${active ? "font-bold" : ""}`}>
      {label}
    </span>
  </button>
);

export default function BottomTabNav() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Connect to store for badges
  const alertsUnacknowledged = useDemoStore((state) => state.alertsUnacknowledged);

  const isActive = (path) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pointer-events-none">
      <nav className="pointer-events-auto max-w-md mx-auto bg-[#050b14]/90 backdrop-blur-xl border border-cyan-500/20 shadow-[0_10px_40px_rgba(0,0,0,0.8)] rounded-2xl p-2 flex items-center justify-between">
        
        <TabButton 
          Icon={LayoutDashboard} 
          label="Dash" 
          active={isActive("/dashboard")} 
          onClick={() => navigate("/dashboard")} 
        />
        
        <TabButton 
          Icon={Pill} 
          label="Dose" 
          active={isActive("/dose")} 
          onClick={() => navigate("/dose")} 
        />
        
        <TabButton 
          Icon={ClipboardList} 
          label="Log" 
          active={isActive("/log")} 
          onClick={() => navigate("/log")} 
        />
        
        <TabButton 
          Icon={ShieldAlert} 
          label="Alerts" 
          active={isActive("/alerts")} 
          onClick={() => navigate("/alerts")}
          badgeCount={alertsUnacknowledged}
        />
        
        <TabButton 
          Icon={UserCircle} 
          label="Profile" 
          active={isActive("/profile")} 
          onClick={() => navigate("/profile")} 
        />

      </nav>
    </div>
  );
}