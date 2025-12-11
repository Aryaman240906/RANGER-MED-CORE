import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowRight, CheckCircle2, ChevronLeft, Loader2 } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import Logo from "../components/global/Logo";
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Store
  const requestPasswordReset = useAuthStore((state) => state.requestPasswordReset);
  const isLoading = useAuthStore((state) => state.isLoading);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await requestPasswordReset(email);
      // We explicitly set submitted state even if email doesn't exist (Security Best Practice)
      setIsSubmitted(true);
    } catch (error) {
      toast.error("Network Uplink Failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#050b14] flex items-center justify-center p-4 relative overflow-hidden selection:bg-cyan-500/30">
      
      {/* --- ATMOSPHERE --- */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 hero-grid opacity-20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.05),transparent_70%)]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md bg-[#0b1221]/90 border border-slate-700/50 backdrop-blur-xl rounded-2xl p-8 shadow-2xl"
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <Logo className="w-12 h-12 mb-4" subtitle={false} />
          <h2 className="text-xl font-bold text-white tracking-[0.2em] uppercase">
            Recovery Protocol
          </h2>
        </div>

        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            /* --- FORM STATE --- */
            <motion.form 
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleSubmit} 
              className="space-y-6"
            >
              <div className="space-y-2">
                <p className="text-xs text-slate-400 text-center px-4 leading-relaxed">
                  Enter your encrypted operative ID. We will transmit a secure reset token to your comms channel.
                </p>
                
                <div className="relative group">
                  <Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                  <input
                    type="email"
                    required
                    placeholder="Operative Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950/50 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2 group"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin w-4 h-4" />
                ) : (
                  <>
                    TRANSMIT TOKEN <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </motion.form>
          ) : (
            /* --- SUCCESS STATE --- */
            <motion.div
              key="success"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-center space-y-6"
            >
              <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-white font-bold tracking-wider">TRANSMISSION SENT</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  If an active profile exists for <span className="text-cyan-400">{email}</span>, you will receive a recovery link shortly.
                </p>
              </div>

              <div className="p-3 bg-slate-900/50 rounded border border-slate-800 text-[10px] text-slate-500 font-mono">
                SESSION ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
          <Link 
            to="/login" 
            className="inline-flex items-center gap-2 text-xs text-slate-500 hover:text-cyan-400 transition-colors font-bold uppercase tracking-wide"
          >
            <ChevronLeft size={14} /> Return to Terminal
          </Link>
        </div>
      </motion.div>
    </div>
  );
}