// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";

// Corrected imports (CASE SENSITIVE)
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import RangerDashboard from "./pages/RangerDashboard.jsx";

// Protected Route
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <Router>
      <Toaster position="top-right" />

      <Routes>
        {/* Default → Login */}
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

        {/* Catch all → Login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}
