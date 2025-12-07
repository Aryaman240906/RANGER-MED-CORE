// src/App.jsx
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";

// --- BACKGROUND SYNC WORKER ---
import { registerSyncWorker } from "./workers/registerSyncWorker";

// --- CORE PAGES ---
import Landing from "./pages/Landing"; 
import Login from "./pages/Login";
import Register from "./pages/Register";
import RangerDashboard from "./pages/RangerDashboard";
import DemoMode from "./pages/DemoMode";
import Profile from "./pages/Profile";
import AvatarBuilderPage from "./pages/AvatarBuilder";

// --- NEW MODULE PAGES (Phase 15) ---
import DosePage from "./pages/DosePage";
import LogPage from "./pages/LogPage";
import AlertsPage from "./pages/AlertsPage";

// --- COMPONENTS ---
import DoctorMockPanel from "./components/demo/DoctorMockPanel";

// =====================
// SCROLL RESTORATION UTILITY
// =====================
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// =====================
// PROTECTED ROUTE
// =====================
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};

// =====================
// DOCTOR PAGE WRAPPER (Themed)
// =====================
const DoctorPage = () => (
  <div className="min-h-screen bg-[#050b14] p-4 md:p-8 flex items-center justify-center relative overflow-hidden">
    {/* Background Atmosphere */}
    <div className="absolute inset-0 pointer-events-none">
       <div className="absolute inset-0 hero-grid opacity-20" />
       <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(34,211,238,0.15),_transparent_70%)]" />
    </div>
    
    <div className="w-full max-w-6xl relative z-10">
      <div className="mb-6 flex items-center gap-4">
        {/* Status Indicator */}
        <div className="relative">
           <div className="w-1.5 h-12 bg-emerald-500 rounded-full shadow-[0_0_15px_#10b981]" />
           <div className="absolute top-0 w-1.5 h-12 bg-emerald-400 blur-sm opacity-50 animate-pulse" />
        </div>
        
        {/* Header Text */}
        <div>
          <h1 className="text-3xl font-black text-white tracking-[0.2em] uppercase leading-none drop-shadow-lg">
            Medical <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">Command</span>
          </h1>
          <div className="flex items-center gap-2 mt-1">
             <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
             <p className="text-[10px] font-mono text-cyan-500/80 uppercase tracking-widest">
               Live Unit Status Monitoring
             </p>
          </div>
        </div>
      </div>

      <DoctorMockPanel />
    </div>
  </div>
);

// =====================
// MAIN APP COMPONENT
// =====================
export default function App() {
  // Initialize Background Sync
  useEffect(() => {
    registerSyncWorker({ syncUrl: null });
    console.log(
      "%c RANGER MED-CORE %c SYSTEMS ONLINE ",
      "background:#06b6d4; color:white; font-weight:bold; padding:4px 8px; border-radius:4px 0 0 4px;",
      "background:#0f172a; color:#22d3ee; padding:4px 8px; border-radius:0 4px 4px 0;"
    );
  }, []);

  return (
    <Router>
      <ScrollToTop />
      
      {/* GLOBAL TOASTER (Cyberpunk Style) */}
      <Toaster 
        position="top-right"
        toastOptions={{
          className: 'neon-border !bg-[#050b14]/90 !text-cyan-50',
          duration: 4000,
          style: {
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(34,211,238,0.2)',
            padding: '16px',
            boxShadow: '0 0 20px rgba(0,0,0,0.5)',
          },
          success: {
            iconTheme: { primary: '#10b981', secondary: '#050b14' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#050b14' },
          }
        }}
      />

      <Routes>
        {/* === PUBLIC ROUTES === */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* === PROTECTED CORE ROUTES === */}
        
        {/* Ranger Dashboard (Main Hub) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <RangerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Profile / Morphin Grid Entry */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Avatar Builder (Direct Access) */}
        <Route
          path="/avatar"
          element={
            <ProtectedRoute>
              <AvatarBuilderPage />
            </ProtectedRoute>
          }
        />

        {/* --- NEW TACTICAL MODULES --- */}

        {/* 1. Dose / Capsule Console */}
        <Route
          path="/dose"
          element={
            <ProtectedRoute>
              <DosePage />
            </ProtectedRoute>
          }
        />

        {/* 2. Log / Bio-Diagnostics */}
        <Route
          path="/log"
          element={
            <ProtectedRoute>
              <LogPage />
            </ProtectedRoute>
          }
        />

        {/* 3. Alerts / Mission Control */}
        <Route
          path="/alerts"
          element={
            <ProtectedRoute>
              <AlertsPage />
            </ProtectedRoute>
          }
        />

        {/* --- UTILITIES --- */}

        {/* Demo Mode */}
        <Route
          path="/demo"
          element={
            <ProtectedRoute>
              <DemoMode />
            </ProtectedRoute>
          }
        />

        {/* Doctor Panel */}
        <Route
          path="/doctor"
          element={
            <ProtectedRoute>
              <DoctorPage />
            </ProtectedRoute>
          }
        />

        {/* === FALLBACK === */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
}