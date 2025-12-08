// src/App.jsx
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Activity } from "lucide-react";

// --- STORES ---
import { useAuthStore } from "./store/authStore";

// --- WORKERS ---
import { registerSyncWorker } from "./workers/registerSyncWorker";

// --- PUBLIC PAGES ---
import Landing from "./pages/Landing"; 
import Login from "./pages/Login";
import Register from "./pages/Register";

// --- PROTECTED PAGES (COMMAND DECK) ---
import RangerDashboard from "./pages/RangerDashboard";
import Profile from "./pages/Profile";
import AvatarBuilderPage from "./pages/AvatarBuilder";
import DemoMode from "./pages/DemoMode";

// --- PROTECTED PAGES (TACTICAL MODULES) ---
import DosePage from "./pages/DosePage";
import LogPage from "./pages/LogPage";
import AlertsPage from "./pages/AlertsPage";

// --- EXTERNAL COMPONENTS ---
import DoctorMockPanel from "./components/demo/DoctorMockPanel";

// ==========================================
// 📜 UTILITY: SCROLL RESTORATION
// ==========================================
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// ==========================================
// 🛡️ UTILITY: ROUTE GUARD
// ==========================================
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login, preserving the intended destination
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};

// ==========================================
// 🩺 LAYOUT: DOCTOR / MEDICAL COMMAND
// ==========================================
const DoctorPageLayout = () => (
  <div className="min-h-screen bg-[#050b14] p-4 md:p-8 flex items-center justify-center relative overflow-hidden">
    {/* Atmosphere */}
    <div className="absolute inset-0 pointer-events-none">
       <div className="absolute inset-0 hero-grid opacity-20" />
       <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(34,211,238,0.15),_transparent_70%)]" />
       <div className="absolute inset-0 scanlines opacity-5" />
    </div>
    
    <div className="w-full max-w-7xl relative z-10">
      <div className="mb-8 flex items-center gap-4 border-b border-white/10 pb-6">
        <div className="relative">
           <div className="w-1.5 h-12 bg-emerald-500 rounded-full shadow-[0_0_15px_#10b981]" />
           <div className="absolute top-0 w-1.5 h-12 bg-emerald-400 blur-sm opacity-50 animate-pulse" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-white tracking-[0.2em] uppercase leading-none drop-shadow-lg flex items-center gap-3">
            Medical Command
            <Activity size={24} className="text-emerald-500" />
          </h1>
          <div className="flex items-center gap-2 mt-2">
             <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
             <p className="text-[10px] font-mono text-cyan-500/80 uppercase tracking-widest">
               Live Unit Status Monitoring • Secure Uplink
             </p>
          </div>
        </div>
      </div>

      <DoctorMockPanel />
    </div>
  </div>
);

// ==========================================
// 🚀 MAIN APPLICATION ROOT
// ==========================================
export default function App() {
  
  // --- SYSTEM BOOT ---
  useEffect(() => {
    registerSyncWorker({ syncUrl: null });
    
    // Console Banner
    console.log(
      "%c RANGER MED-CORE %c v5.0.2 SYSTEM ONLINE ",
      "background:#06b6d4; color:white; font-weight:bold; padding:4px 8px; border-radius:4px 0 0 4px;",
      "background:#0f172a; color:#22d3ee; padding:4px 8px; border-radius:0 4px 4px 0; border: 1px solid #06b6d4;"
    );
  }, []);

  return (
    <Router>
      <ScrollToTop />
      
      {/* 🔔 GLOBAL NOTIFICATION SYSTEM */}
      <Toaster 
        position="top-right"
        toastOptions={{
          className: 'neon-border !bg-[#050b14]/95 !text-cyan-50',
          duration: 4000,
          style: {
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(34,211,238,0.2)',
            padding: '16px',
            boxShadow: '0 0 30px rgba(0,0,0,0.6)',
            fontFamily: 'monospace',
            letterSpacing: '0.05em'
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
        
        {/* --- ZONE A: PUBLIC ACCESS --- */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* --- ZONE B: OPERATIVE COMMAND (Protected) --- */}
        
        {/* 1. Dashboard (Hub) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <RangerDashboard />
            </ProtectedRoute>
          }
        />

        {/* 2. Tactical Modules */}
        <Route
          path="/dose"
          element={
            <ProtectedRoute>
              <DosePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/log"
          element={
            <ProtectedRoute>
              <LogPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/alerts"
          element={
            <ProtectedRoute>
              <AlertsPage />
            </ProtectedRoute>
          }
        />

        {/* 3. Identity & Config */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/avatar"
          element={
            <ProtectedRoute>
              <AvatarBuilderPage />
            </ProtectedRoute>
          }
        />

        {/* --- ZONE C: SIMULATION & OVERSIGHT --- */}
        
        <Route
          path="/demo"
          element={
            <ProtectedRoute>
              <DemoMode />
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctor"
          element={
            <ProtectedRoute>
              <DoctorPageLayout />
            </ProtectedRoute>
          }
        />

        {/* --- FALLBACK PROTOCOL --- */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
}