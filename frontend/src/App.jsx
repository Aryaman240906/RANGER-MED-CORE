import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";

// Pages
import Login from "./pages/login.jsx";
import Register from "./pages/register.jsx";

// Temporary simple dashboard for testing
const Dashboard = () => {
  const { user, logout } = useAuthStore();
  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <h1 className="text-3xl font-bold text-cyan-400">Welcome, {user?.name}</h1>
      <p className="text-slate-400 mt-2">Role: {user?.role?.toUpperCase()}</p>
      <button
        onClick={logout}
        className="mt-8 bg-red-500/20 text-red-400 px-4 py-2 rounded hover:bg-red-500/30"
      >
        Logout
      </button>
    </div>
  );
};

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}
