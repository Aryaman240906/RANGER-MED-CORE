import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const TabButton = ({ active, onClick, label, svg }) => (
  <button
    onClick={onClick}
    className={`relative flex-1 py-2 px-1 rounded-xl flex flex-col items-center justify-center transition-colors duration-300 ${
      active ? "text-cyan-400" : "text-slate-500 hover:text-slate-300"
    }`}
  >
    {active && (
      <motion.div
        layoutId="nav-glow"
        className="absolute inset-0 bg-cyan-500/10 rounded-xl blur-sm"
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />
    )}
    <div className="w-6 h-6 relative z-10" dangerouslySetInnerHTML={{ __html: svg }} />
    <span className="text-[10px] font-medium mt-1 relative z-10">{label}</span>
  </button>
);

export default function BottomTabNav({ onOpenDose, onOpenSymptom }) {
  const navigate = useNavigate();
  const location = useLocation();

  const active = (path) => location.pathname === path;

  // Optimized SVGs
  const svgs = {
    home: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`,
    capsule: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="10" rx="5" ry="5"></rect><line x1="8" y1="7" x2="8" y2="17"></line><line x1="16" y1="7" x2="16" y2="17"></line></svg>`,
    symptom: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v6m0 14v-2"></path><circle cx="12" cy="12" r="8"></circle></svg>`,
    alert: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2.25 2.25 0 0 0 1.89 3.34h16.58a2.25 2.25 0 0 0 1.89-3.34L13.71 3.86a2.25 2.25 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
    profile: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pointer-events-none">
      <nav className="pointer-events-auto max-w-md mx-auto bg-slate-900/90 backdrop-blur-xl border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)] rounded-2xl p-2 flex items-center justify-between">
        <TabButton svg={svgs.home} label="Dash" active={active("/dashboard")} onClick={() => navigate("/dashboard")} />
        <TabButton svg={svgs.capsule} label="Dose" active={false} onClick={onOpenDose} />
        <TabButton svg={svgs.symptom} label="Log" active={false} onClick={onOpenSymptom} />
        <TabButton svg={svgs.alert} label="Alerts" active={active("/alerts")} onClick={() => navigate("/alerts")} />
        <TabButton svg={svgs.profile} label="Profile" active={active("/profile")} onClick={() => navigate("/profile")} />
      </nav>
    </div>
  );
}