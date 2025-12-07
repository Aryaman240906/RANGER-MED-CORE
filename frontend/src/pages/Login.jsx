// src/pages/Login.jsx
import React, { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { ShieldCheck, Lock, Mail, ChevronRight, Loader2 } from "lucide-react";
import Logo from "../components/global/Logo";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      // 1. Attempt Login
      await login(email, password);

      // 2. Success Toast (Fires ONCE)
      toast.success(
        <div className="flex flex-col">
          <span className="font-bold tracking-widest text-xs">IDENTITY VERIFIED</span>
          <span className="text-[10px] opacity-80">Welcome back, Ranger.</span>
        </div>,
        {
          id: "login-success",
          icon: "🛡️",
          style: {
            background: "#050b14",
            border: "1px solid #22d3ee",
            color: "#22d3ee",
            backdropFilter: "blur(10px)"
          },
          duration: 3000
        }
      );

      // 3. Navigate
      navigate("/dashboard");

    } catch (error) {
      toast.error("ACCESS DENIED: Invalid Credentials", {
        style: { background: "#050b14", border: "1px solid #ef4444", color: "#ef4444" }
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#050b14] flex items-center justify-center relative overflow-hidden p-4">
      
      {/* 1. ATMOSPHERE */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 hero-grid opacity-20" />
        <div className="absolute inset-0 scanlines opacity-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.05),transparent_70%)]" />
      </div>

      {/* 2. LOGIN CARD */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "circOut" }}
        className="relative z-10 w-full max-w-md bg-slate-900/60 border border-slate-700/50 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl"
      >
        {/* Header Beam */}
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />

        <div className="p-8">
          
          {/* Logo Section */}
          <div className="flex flex-col items-center mb-8">
            <Logo className="w-16 h-16 mb-4" />
            <h2 className="text-xl font-bold text-white tracking-[0.2em] uppercase">
              Ranger Command
            </h2>
            <p className="text-[10px] text-cyan-500/60 font-mono mt-1">
              SECURE UPLINK ESTABLISHED
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            
            {/* Email Input */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">
                Operative ID / Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={16} className="text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0a1020] border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all font-mono"
                  placeholder="ranger@med-core.com"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">
                Security Clearance
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={16} className="text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0a1020] border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all font-mono"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 mt-4 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white font-bold tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] flex items-center justify-center gap-2 group"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={18} />
                  <span>Authenticate</span>
                  <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                </>
              )}
            </button>

          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500">
              New recruit?{' '}
              <Link to="/register" className="text-cyan-400 hover:text-cyan-300 font-bold hover:underline decoration-cyan-500/50 underline-offset-4 transition-all">
                Initialize Protocol
              </Link>
            </p>
          </div>

        </div>
      </motion.div>

      {/* 3. FOOTER DECORATION */}
      <div className="absolute bottom-6 text-[10px] font-mono text-slate-600 uppercase tracking-[0.3em] opacity-50">
        Ranger Med-Core System v9.2
      </div>

    </div>
  );
}

export default Login;