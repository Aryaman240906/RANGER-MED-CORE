import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Save, Loader2, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";

// Stores & Components
import { useAuthStore } from "../store/authStore";
import PasswordField from "../components/auth/PasswordField";
import Logo from "../components/global/Logo";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); // Assumes /reset-password?token=XYZ

  const { resetPassword, isLoading } = useAuthStore();

  const [formData, setFormData] = useState({ password: "", confirmPassword: "" });
  const [error, setError] = useState(null);

  // Validate Token Existence
  useEffect(() => {
    if (!token) {
      setError("INVALID OR MISSING SECURITY TOKEN");
    }
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Credentials do not match");
      return;
    }

    try {
      await resetPassword(token, formData.password);
      
      toast.success(
        <div className="flex flex-col">
          <span className="font-bold text-xs uppercase">Credentials Updated</span>
          <span className="text-[10px] opacity-80">Please log in with new access code.</span>
        </div>,
        { icon: "🔐" }
      );
      
      navigate("/login");
    } catch (err) {
      setError("Token expired or invalid. Request a new link.");
    }
  };

  return (
    <div className="min-h-screen bg-[#050b14] flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 hero-grid opacity-20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.05),transparent_70%)]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-md bg-[#0b1221]/90 border border-slate-700/50 backdrop-blur-xl rounded-2xl p-8 shadow-2xl"
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <Logo className="w-12 h-12 mb-4" subtitle={false} />
          <h2 className="text-xl font-bold text-white tracking-[0.2em] uppercase">
            Reset Credentials
          </h2>
          <p className="text-[10px] text-cyan-500/60 font-mono mt-1 uppercase">
            Secure Channel Active
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-6 p-3 bg-rose-500/10 border border-rose-500/30 rounded flex items-center gap-3">
            <AlertTriangle className="text-rose-400 w-5 h-5 flex-shrink-0" />
            <p className="text-xs text-rose-300 font-mono">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* New Password */}
          <PasswordField 
            name="password"
            placeholder="New Access Code"
            value={formData.password}
            onChange={handleChange}
            showStrength={true}
          />

          {/* Confirm Password */}
          <PasswordField 
            name="confirmPassword"
            placeholder="Confirm Access Code"
            value={formData.confirmPassword}
            onChange={handleChange}
          />

          <button
            type="submit"
            disabled={isLoading || !token}
            className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-900/20 mt-4"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin w-4 h-4" />
                <span className="text-xs tracking-widest">UPDATING...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span className="text-xs tracking-widest">SAVE CREDENTIALS</span>
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <Link 
            to="/login" 
            className="text-xs text-slate-500 hover:text-cyan-400 transition-colors font-bold uppercase tracking-wide"
          >
            Cancel Protocol
          </Link>
        </div>
      </motion.div>
    </div>
  );
}