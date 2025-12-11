import React, { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate, Link, useLocation, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { ShieldCheck, Mail, ChevronRight, Loader2, AlertCircle } from "lucide-react";

// --- CUSTOM COMPONENTS ---
import Logo from "../components/global/Logo";
import PasswordField from "../components/auth/PasswordField";
import SocialLoginStub from "../components/auth/SocialLoginStub"; // 👈 NEW COMPONENT

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  // Store
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);

  // State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // 1. Auto-fill email if passed via URL (e.g. from Register duplicate check)
  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
      toast(
        <div className="flex flex-col">
          <span className="font-bold text-xs">PROFILE DETECTED</span>
          <span className="text-[10px] opacity-80">Please verify identity to proceed.</span>
        </div>, 
        { icon: "ℹ️", style: { background: "#0b1221", color: "#22d3ee", border: "1px solid #22d3ee" } }
      );
    }
  }, [searchParams]);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      // 2. Attempt Login
      await login(email, password, rememberMe);

      // 3. Success Feedback
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

      // 4. Smart Redirect (Go back to where they came from, or Dashboard)
      const from = location.state?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });

    } catch (error) {
      // Error handling managed by store/service, but we show toast here just in case
      console.error("Login failed:", error);
      toast.error(
        <div className="flex flex-col">
          <span className="font-bold text-xs uppercase">Access Denied</span>
          <span className="text-[10px] opacity-80">Invalid Credentials</span>
        </div>, 
        { 
          style: { background: "#050b14", border: "1px solid #ef4444", color: "#ef4444" }
        }
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#050b14] flex items-center justify-center relative overflow-hidden p-4 selection:bg-cyan-500/30">
      
      {/* --- BACKGROUND ATMOSPHERE --- */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_#0f172a_0%,_transparent_60%)]" />
        <div className="absolute inset-0 hero-grid opacity-20" />
        <div className="absolute inset-0 scanlines opacity-5" />
      </div>

      {/* --- LOGIN CARD --- */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "circOut" }}
        className="relative z-10 w-full max-w-md bg-[#0b1221]/80 border border-slate-700/50 backdrop-blur-xl rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.6)]"
      >
        {/* Top Glow */}
        <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-60" />

        <div className="p-8">
          
          {/* Logo Section */}
          <div className="flex flex-col items-center mb-8">
            <Logo className="w-16 h-16 mb-4" subtitle={false} />
            <h2 className="text-xl font-bold text-white tracking-[0.2em] uppercase drop-shadow-lg">
              Ranger Command
            </h2>
            <p className="text-[10px] text-cyan-500/60 font-mono mt-1 uppercase tracking-widest">
              Secure Uplink Required
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            
            {/* Email Input */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                Operative ID
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#050b14]/50 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-sans"
                  placeholder="ranger@med-core.com"
                />
              </div>
            </div>

            {/* Password Input (Using upgraded custom component) */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                Security Clearance
              </label>
              <PasswordField 
                name="password" 
                placeholder="Access Code" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
            </div>

            {/* Utility Row: Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer group select-none">
                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${rememberMe ? 'bg-cyan-600 border-cyan-500' : 'border-slate-600 bg-transparent group-hover:border-cyan-500/50'}`}>
                  {rememberMe && <ChevronRight size={12} className="text-white rotate-90" />}
                </div>
                <input 
                  type="checkbox" 
                  className="hidden" 
                  checked={rememberMe} 
                  onChange={(e) => setRememberMe(e.target.checked)} 
                />
                <span className={`${rememberMe ? 'text-cyan-400' : 'text-slate-500'} transition-colors font-mono`}>Keep Active</span>
              </label>

              <Link 
                to="/forgot-password" 
                className="text-slate-500 hover:text-cyan-400 transition-colors font-mono hover:underline decoration-cyan-500/30 underline-offset-4"
              >
                Lost Credentials?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="relative w-full py-3.5 mt-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white font-bold tracking-widest uppercase transition-all shadow-lg shadow-cyan-900/20 flex items-center justify-center gap-2 group overflow-hidden"
            >
              {/* Shine Effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span className="text-xs">Handshaking...</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={18} />
                  <span className="text-xs">Authenticate</span>
                  <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                </>
              )}
            </button>
          </form>

          {/* Social Login Section (Optional Stub) */}
          <div className="mt-8">
            <SocialLoginStub />
          </div>

          {/* Footer Links */}
          <div className="mt-8 pt-6 border-t border-slate-800/50 text-center">
            <p className="text-xs text-slate-500">
              New recruit?{' '}
              <Link to="/register" className="text-cyan-400 hover:text-cyan-300 font-bold tracking-wide transition-colors ml-1 uppercase hover:underline decoration-cyan-500/30 underline-offset-4">
                Initialize Protocol
              </Link>
            </p>
          </div>

        </div>
      </motion.div>

      {/* --- FOOTER VERSION --- */}
      <div className="absolute bottom-6 text-[10px] font-mono text-slate-700 uppercase tracking-[0.3em] select-none">
        Bio-Sync Neural Grid v5.0
      </div>

    </div>
  );
}

export default Login;