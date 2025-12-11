import React, { useState, useEffect } from "react";
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate, 
  useLocation 
} from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Terminal, Cpu, Wifi, Server } from "lucide-react";

// --- STORES ---
import { useAuthStore } from "./store/authStore";

// --- WORKERS ---
import { registerSyncWorker } from "./workers/registerSyncWorker";

// --- GLOBAL LAYERS ---
import TutorialOverlay from "./components/tutorial/TutorialOverlay";
import DemoBanner from "./components/demo/DemoBanner";
import ToastPortal from "./components/global/ToastPortal"; // 👈 NEW: Imported your custom toast portal

// --- PUBLIC PAGES ---
import Landing from "./pages/Landing"; 
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

// --- COMMAND DECK PAGES ---
import RangerDashboard from "./pages/RangerDashboard";
import Profile from "./pages/Profile";
import AvatarBuilderPage from "./pages/AvatarBuilder";
import DemoMode from "./pages/DemoMode";

// --- TACTICAL MODULE PAGES ---
import DosePage from "./pages/DosePage";
import LogPage from "./pages/LogPage";
import AlertsPage from "./pages/AlertsPage";

// --- EXTERNAL COMPONENTS ---
import DoctorMockPanel from "./components/demo/DoctorMockPanel";

// ==========================================
// 🛠️ UTILITY: SCROLL RESTORATION
// ==========================================
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// ==========================================
// 🌌 COMPONENT: GLOBAL ATMOSPHERE
// ==========================================
const GlobalAtmosphere = () => (
  <div className="fixed inset-0 pointer-events-none z-0">
    <div className="absolute inset-0 bg-[#050b14]" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_#1e293b_0%,_transparent_75%)] opacity-40" />
    <div 
      className="absolute inset-0 opacity-[0.03]"
      style={{
        backgroundImage: `linear-gradient(#22d3ee 1px, transparent 1px), linear-gradient(90deg, #22d3ee 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
      }}
    />
    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-20" />
  </div>
);

// ==========================================
// 🎬 COMPONENT: ADVANCED PAGE TRANSITION
// ==========================================
const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, filter: "blur(4px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 1.02, filter: "blur(4px)" }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full h-full z-10"
    >
      {children}
    </motion.div>
  );
};

// ==========================================
// 🛡️ UTILITY: ROUTE GUARD
// ==========================================
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <PageTransition>{children}</PageTransition>;
};

// ==========================================
// 🎞️ COMPONENT: CINEMATIC SYSTEM BOOT
// ==========================================
const SystemBoot = ({ onComplete }) => {
  const [logs, setLogs] = useState([]);
  const [memory, setMemory] = useState(0);
  const [progress, setProgress] = useState(0);

  const addLog = (msg, status = "OK") => {
    setLogs(prev => [...prev.slice(-6), { msg, status, id: Date.now() }]);
  };

  useEffect(() => {
    // Memory Test
    const memInterval = setInterval(() => {
      setMemory(prev => {
        if (prev >= 32768) {
          clearInterval(memInterval);
          return 32768;
        }
        return prev + 1024;
      });
    }, 50);

    // Sequence
    const sequence = [
      { t: 200, fn: () => addLog("INITIALIZING BIOS v5.0.2...") },
      { t: 600, fn: () => addLog("CHECKING MEMORY INTEGRITY...") },
      { t: 1000, fn: () => addLog("MOUNTING FILE SYSTEM (ZFS)...") },
      { t: 1400, fn: () => addLog("LOADING KERNEL MODULES...") },
      { t: 1800, fn: () => addLog("ESTABLISHING SECURE UPLINK...", "WAIT") },
      { t: 2400, fn: () => addLog("UPLINK ESTABLISHED (1024-bit)", "SECURE") },
      { t: 2800, fn: () => addLog("DECRYPTING USER INTERFACE...") },
      { t: 3200, fn: onComplete }
    ];

    sequence.forEach(({ t, fn }) => setTimeout(fn, t));

    // Progress
    const progInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 60);

    return () => {
      clearInterval(memInterval);
      clearInterval(progInterval);
      sequence.forEach(({ t }) => clearTimeout(t));
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-[#020408] z-[99999] flex flex-col items-center justify-center font-mono text-cyan-500 cursor-wait">
      <div className="w-96 p-6 border border-slate-800 bg-slate-900/50 rounded-lg shadow-2xl backdrop-blur-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none opacity-50" />
        
        <div className="flex justify-between items-center border-b border-cyan-900/50 pb-3 mb-4 opacity-70">
          <div className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase">
            <Terminal size={12} /> Ranger_BIOS
          </div>
          <div className="text-[10px] text-emerald-500">SYS_OK</div>
        </div>

        <div className="flex justify-between text-xs mb-6 font-bold text-slate-400">
          <span>MEM_CHECK</span>
          <span className="text-cyan-400">{memory} MB OK</span>
        </div>
        
        <div className="space-y-2 text-[10px] h-32 flex flex-col justify-end font-mono">
          <AnimatePresence>
            {logs.map((log) => (
              <motion.div 
                key={log.id}
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }} 
                className="flex justify-between items-center border-l-2 border-slate-700 pl-2"
              >
                <span className="text-slate-300">{log.msg}</span>
                <span className={`${log.status === "SECURE" ? "text-cyan-400" : log.status === "WAIT" ? "text-amber-400 animate-pulse" : "text-emerald-500"} font-bold`}>
                  [{log.status}]
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="mt-6 space-y-2">
          <div className="flex justify-between text-[9px] text-cyan-600 uppercase tracking-wider">
            <span className="flex items-center gap-1"><Cpu size={10} /> Bootloader</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-700">
            <motion.div 
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 shadow-[0_0_15px_#22d3ee]"
            />
          </div>
        </div>
      </div>
      <div className="absolute bottom-10 text-[10px] text-slate-600 tracking-[0.5em] uppercase animate-pulse">
        System Initialization...
      </div>
    </div>
  );
};

// ==========================================
// 🩺 LAYOUT: DOCTOR / MEDICAL COMMAND
// ==========================================
const DoctorPageLayout = () => (
  <PageTransition>
    <div className="min-h-screen p-4 md:p-8 flex items-center justify-center relative overflow-hidden">
      <div className="w-full max-w-7xl relative z-10">
        <div className="mb-8 flex items-center gap-6 border-b border-white/10 pb-6">
          <div className="relative group">
             <div className="w-2 h-16 bg-emerald-500 rounded-full shadow-[0_0_20px_#10b981] group-hover:h-20 transition-all duration-300" />
             <div className="absolute top-0 w-2 h-16 bg-emerald-400 blur-md opacity-50 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-black text-white tracking-[0.15em] uppercase leading-none drop-shadow-2xl">
                Medical Command
              </h1>
              <Activity size={32} className="text-emerald-500 animate-pulse" />
            </div>
            <div className="flex items-center gap-4 mt-3">
               <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded text-[10px] font-mono text-emerald-400 uppercase tracking-widest">
                 <Wifi size={10} /> Secure Uplink
               </div>
               <div className="flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
                 <Server size={10} /> Unit Telemetry: LIVE
               </div>
            </div>
          </div>
        </div>
        <DoctorMockPanel />
      </div>
    </div>
  </PageTransition>
);

// ==========================================
// 🚀 MAIN APPLICATION ROOT
// ==========================================
export default function App() {
  const [isBooted, setIsBooted] = useState(false);
  
  useEffect(() => {
    registerSyncWorker({ syncUrl: null });
    console.log(
      "%c RANGER MED-CORE %c v5.0.2 SYSTEM ONLINE ",
      "background:#06b6d4; color:white; font-weight:bold; padding:4px 8px; border-radius:4px 0 0 4px;",
      "background:#0f172a; color:#22d3ee; padding:4px 8px; border-radius:0 4px 4px 0; border: 1px solid #06b6d4;"
    );
  }, []);

  return (
    <>
      {/* 0. BOOT LOADER */}
      {!isBooted && <SystemBoot onComplete={() => setIsBooted(true)} />}

      <Router>
        <ScrollToTop />
        <GlobalAtmosphere />
        
        {/* 🔔 GLOBAL NOTIFICATIONS (Using Custom Portal) */}
        <ToastPortal />

        {/* 🧠 GLOBAL OVERLAYS */}
        <TutorialOverlay />
        <DemoBanner />

        {/* 🗺️ ROUTING MATRIX */}
        <RouteTransitionHandler />
      </Router>
    </>
  );
}

// Extracted to use useLocation hook within Router context
const RouteTransitionHandler = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        
        {/* --- ZONE A: PUBLIC ACCESS --- */}
        <Route path="/" element={<PageTransition><Landing /></PageTransition>} />
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
        
        {/* 🆕 AUTH FLOWS */}
        <Route path="/forgot-password" element={<PageTransition><ForgotPassword /></PageTransition>} />
        <Route path="/reset-password" element={<PageTransition><ResetPassword /></PageTransition>} />

        {/* --- ZONE B: OPERATIVE COMMAND (Protected) --- */}
        <Route path="/dashboard" element={<ProtectedRoute><RangerDashboard /></ProtectedRoute>} />
        <Route path="/dose" element={<ProtectedRoute><DosePage /></ProtectedRoute>} />
        <Route path="/log" element={<ProtectedRoute><LogPage /></ProtectedRoute>} />
        <Route path="/alerts" element={<ProtectedRoute><AlertsPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/avatar" element={<ProtectedRoute><AvatarBuilderPage /></ProtectedRoute>} />

        {/* --- ZONE C: SIMULATION & OVERSIGHT --- */}
        <Route path="/demo" element={<ProtectedRoute><DemoMode /></ProtectedRoute>} />
        <Route path="/doctor" element={<ProtectedRoute><DoctorPageLayout /></ProtectedRoute>} />

        {/* --- FALLBACK PROTOCOL --- */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </AnimatePresence>
  );
};