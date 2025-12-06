// src/App.jsx
import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";

// Worker Registration
import { registerSyncWorker } from "./workers/registerSyncWorker";

// Page Imports
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import RangerDashboard from "./pages/RangerDashboard.jsx";

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default function App() {
  
  // 🟢 Initialize Background Sync Worker
  useEffect(() => {
    // Passing null enables "Mock Mode" (simulates sync without a real backend)
    // In Phase 4/6, you will change this to: "http://localhost:5000/api/sync"
    registerSyncWorker({ syncUrl: null });
    
    console.log("📡 Ranger Sync Worker: Online & Ready");
  }, []);

  return (
    <Router>
      {/* Global Toast Notifications */}
      <Toaster position="top-right" />

      <Routes>
        {/* Default Redirect → Login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected: Ranger Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <RangerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Catch-all Redirect */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}