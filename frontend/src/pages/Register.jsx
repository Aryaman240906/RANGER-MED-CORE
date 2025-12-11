import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, ArrowRight, Loader2, AlertCircle, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

// --- CUSTOM COMPONENTS ---
import RoleToggle from '../components/auth/RoleToggle';
import PasswordField from '../components/auth/PasswordField';
import EmailValidationHint from '../components/auth/EmailValidationHint'; // 👈 NEW COMPONENT

const Register = () => {
  const navigate = useNavigate();
  const { register, checkEmail, isLoading } = useAuthStore();
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'ranger'
  });

  // UX State
  const [emailStatus, setEmailStatus] = useState('idle'); // idle | checking | valid | taken | invalid
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear specific error on type
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
    // Reset email status if user starts typing again after a check
    if (e.target.name === 'email' && emailStatus !== 'idle') {
      setEmailStatus('idle');
    }
  };

  // Live Email Check
  const handleEmailBlur = async () => {
    // 1. Basic Regex Validation
    if (!formData.email) {
      setEmailStatus('idle');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setEmailStatus('invalid');
      return;
    }
    
    // 2. Server Availability Check
    setEmailStatus('checking');
    try {
      const exists = await checkEmail(formData.email);
      if (exists) {
        setEmailStatus('taken');
        setErrors(prev => ({ ...prev, email: 'Account exists' }));
      } else {
        setEmailStatus('valid');
        setErrors(prev => ({ ...prev, email: null }));
      }
    } catch (err) {
      setEmailStatus('idle'); // Network error, fail silently/gracefully
    }
  };

  const validate = () => {
    const newErrors = {};
    if (formData.name.length < 2) newErrors.name = 'Name too short';
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid format';
    if (formData.password.length < 8) newErrors.password = 'Min 8 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (emailStatus === 'taken') newErrors.email = 'Email already registered';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const result = await register(formData);
      
      if (result?.token) {
        // Success with Auto-Login
        toast.success(
          <div className="flex flex-col">
            <span className="font-bold text-xs uppercase tracking-widest">Identity Verified</span>
            <span className="text-[10px] opacity-80 font-mono">Clearance Granted: RANGER</span>
          </div>, 
          { 
            icon: '🛡️',
            style: { background: '#050b14', border: '1px solid #22d3ee', color: '#22d3ee' }
          }
        );
        navigate('/dashboard');
      } else {
        // Success but needs verification
        toast.success('Profile Initialized. Please Log In.');
        navigate('/login');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#050b14] flex items-center justify-center p-4 relative overflow-hidden text-white font-sans selection:bg-cyan-500/30">
      
      {/* --- BACKGROUND ATMOSPHERE --- */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_#0f172a_0%,_transparent_60%)]" />
        <div className="absolute inset-0 scanlines opacity-5" />
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'linear-gradient(#22d3ee 1px, transparent 1px), linear-gradient(90deg, #22d3ee 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "circOut" }}
        className="w-full max-w-md relative z-10"
      >
        {/* Card Container */}
        <div className="bg-[#0b1221]/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-[0_0_60px_rgba(0,0,0,0.6)] p-8 relative overflow-hidden">
          
          {/* Top Border Glow */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-white tracking-[0.2em] mb-2 uppercase drop-shadow-lg">
              Initialize Unit
            </h2>
            <p className="text-cyan-500/60 text-[10px] font-mono tracking-[0.2em] uppercase">
              Secure Profile Creation
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Role Selection (Upgraded Component) */}
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1 mb-2 block">
                Select Designation
              </label>
              <RoleToggle 
                selectedRole={formData.role} 
                onSelect={(role) => setFormData({ ...formData, role })} 
              />
            </div>

            {/* Name Input */}
            <div className="space-y-1">
              <div className="relative group">
                <User className="absolute left-3 top-3.5 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                <input 
                  type="text" 
                  name="name" 
                  required 
                  placeholder="Operative Name" 
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full bg-[#050b14]/50 border rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-1 transition-all font-sans
                    ${errors.name 
                      ? 'border-rose-500/50 focus:border-rose-500 focus:ring-rose-500' 
                      : 'border-slate-700 focus:border-cyan-500 focus:ring-cyan-500 text-white placeholder-slate-600'}`} 
                />
              </div>
              {errors.name && <span className="text-[10px] text-rose-400 pl-1 font-mono">{errors.name}</span>}
            </div>

            {/* Email Input with Integrated Validation Hint */}
            <div className="space-y-1">
              <div className="relative group">
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                <input 
                  type="email" 
                  name="email" 
                  required 
                  placeholder="Secure Comms ID (Email)" 
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleEmailBlur}
                  className={`w-full bg-[#050b14]/50 border rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-1 transition-all font-sans
                    ${errors.email || emailStatus === 'taken' || emailStatus === 'invalid'
                      ? 'border-rose-500/50 focus:border-rose-500 focus:ring-rose-500' 
                      : 'border-slate-700 focus:border-cyan-500 focus:ring-cyan-500 text-white placeholder-slate-600'}`} 
                />
              </div>

              {/* 👇 NEW: Smart Validation Component */}
              <EmailValidationHint email={formData.email} status={emailStatus} />

              {/* Duplicate Email Detected UX (Conditional) */}
              <AnimatePresence>
                {emailStatus === 'taken' && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-2 flex items-center justify-between bg-rose-500/10 border border-rose-500/20 rounded p-3">
                      <span className="text-[10px] text-rose-300 flex items-center gap-1.5 font-bold">
                        <AlertCircle size={12} /> ALREADY REGISTERED
                      </span>
                      <Link 
                        to={`/login?email=${encodeURIComponent(formData.email)}`}
                        className="text-[10px] font-bold text-white bg-rose-500 hover:bg-rose-400 px-3 py-1 rounded transition-colors shadow-lg shadow-rose-900/20 flex items-center gap-1"
                      >
                        LOGIN <ChevronRight size={10} />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Password Fields (Upgraded Component) */}
            <div className="space-y-4">
              <PasswordField 
                name="password" 
                placeholder="Set Access Code" 
                value={formData.password} 
                onChange={handleChange}
                showStrength={true}
              />
              
              <div className="space-y-1">
                <PasswordField 
                  name="confirmPassword" 
                  placeholder="Confirm Access Code" 
                  value={formData.confirmPassword} 
                  onChange={handleChange}
                />
                {errors.confirmPassword && <span className="text-[10px] text-rose-400 pl-1 font-mono">{errors.confirmPassword}</span>}
              </div>
            </div>

            {/* Action Button */}
            <button 
              type="submit" 
              disabled={isLoading || emailStatus === 'taken'}
              className="group w-full bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 px-4 rounded-lg shadow-lg shadow-cyan-900/20 transition-all flex items-center justify-center gap-2 mt-4 relative overflow-hidden"
            >
              {/* Button Shine Effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="tracking-widest text-xs">ENCRYPTING DATA...</span>
                </>
              ) : (
                <>
                  ESTABLISH UPLINK <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center pt-6 border-t border-slate-800/50">
            <p className="text-slate-500 text-xs">
              Existing operative?{' '}
              <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-bold tracking-wide transition-colors ml-1 uppercase">
                Access Terminal
              </Link>
            </p>
          </div>

        </div>
        
        {/* Decorative Footer Glow */}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent blur-md" />
      </motion.div>
    </div>
  );
};

export default Register;