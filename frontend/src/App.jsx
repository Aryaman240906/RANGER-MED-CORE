// src/App.jsx
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";

// Intro Animation (Fix)
import IntroAnimation from "./components/global/IntroAnimation";

// --- BACKGROUND SYNC WORKER ---
import { registerSyncWorker } from "./workers/registerSyncWorker";

// --- PAGES ---
import Login from "./pages/Login";
import Register from "./pages/Register";
import RangerDashboard from "./pages/RangerDashboard";
import DemoMode from "./pages/DemoMode";

// --- COMPONENTS ---
import DoctorMockPanel from "./components/demo/DoctorMockPanel";


// =====================
// PROTECTED ROUTE
// =====================
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();

  return isAuthenticated
    ? children
    : <Navigate to="/login" state={{ from: location }} replace />;
};


// =====================
// DOCTOR PAGE WRAPPER
// =====================
const DoctorPage = () => (
  <div className="min-h-screen bg-slate-950 p-4 md:p-8 flex items-center justify-center relative overflow-hidden">
    <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(34,211,238,0.1),_rgba(2,6,23,1))] pointer-events-none" />
    
    <div className="w-full max-w-6xl relative z-10">
      <div className="mb-6 flex items-center gap-3 opacity-80">
        <div className="w-2 h-8 bg-emerald-500 rounded-full shadow-[0_0_15px_#10b981]" />
        <div>
          <h1 className="text-2xl font-bold text-white tracking-widest uppercase leading-none">
            Medical <span className="text-emerald-400">Command</span>
          </h1>
          <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
            Unit Status Monitoring
          </p>
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
  const [bootComplete, setBootComplete] = useState(false);

  // Background Sync Worker
  useEffect(() => {
    registerSyncWorker({ syncUrl: null });
    console.log("📡 Ranger Med-Core: All Systems Online");
  }, []);


  // ⛔ If boot sequence not complete, show intro animation
  if (!bootComplete) {
    return (
      <IntroAnimation onComplete={() => setBootComplete(true)} />
    );
  }


  // ✅ After boot sequence → full app loads normally
  return (
    <Router>

      {/* GLOBAL TOASTER */}
      <Toaster 
        position="top-right"
        toastOptions={{
          className: 'backdrop-blur-md bg-slate-900/90 border border-slate-700 text-slate-200',
          duration: 4000,
          style: {
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          }
        }}
      />

      <Routes>

        {/* PUBLIC */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* RANGER DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <RangerDashboard />
            </ProtectedRoute>
          }
        />

        {/* DEMO / SIMULATION DECK */}
        <Route
          path="/demo"
          element={
            <ProtectedRoute>
              <DemoMode />
            </ProtectedRoute>
          }
        />

        {/* DOCTOR PANEL */}
        <Route
          path="/doctor"
          element={
            <ProtectedRoute>
              <DoctorPage />
            </ProtectedRoute>
          }
        />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </Router>
  );
}
