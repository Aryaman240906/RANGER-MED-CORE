import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Lock, Mail, Shield, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'ranger' });
  const register = useAuthStore((state) => state.register);
  const isLoading = useAuthStore((state) => state.isLoading);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await register(formData);
    if (success) {
      toast.success('Profile Created. Access Granted.', {
        style: { background: '#0F172A', color: '#22D3EE', border: '1px solid #22D3EE' },
      });
      navigate('/dashboard');
    } else {
      toast.error('Registration Failed.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden text-white">
      {/* Background Grid */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(#a855f7 1px, transparent 1px), linear-gradient(90deg, #a855f7 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      ></div>
      
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-600/20 rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-cyan-500/30 rounded-2xl shadow-2xl p-8 relative z-10"
      >
        <h2 className="text-2xl font-bold text-white text-center mb-1 tracking-tight">NEW PROFILE</h2>
        <p className="text-cyan-400/70 text-center text-sm mb-6 font-mono">ENTER CREDENTIALS</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative group">
            <User className="absolute left-3 top-3 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400" />
            <input type="text" name="name" required placeholder="Full Name" onChange={handleChange}
              className="w-full bg-slate-950/50 border border-slate-700 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500" />
          </div>

          <div className="relative group">
            <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400" />
            <input type="email" name="email" required placeholder="Email Address" onChange={handleChange}
              className="w-full bg-slate-950/50 border border-slate-700 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500" />
          </div>

          <div className="relative group">
            <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400" />
            <input type="password" name="password" required placeholder="Password (Min 6 chars)" onChange={handleChange}
              className="w-full bg-slate-950/50 border border-slate-700 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500" />
          </div>

          <div className="relative group">
            <Shield className="absolute left-3 top-3 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400" />
            <select name="role" onChange={handleChange}
              className="w-full bg-slate-950/50 border border-slate-700 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-cyan-500 appearance-none cursor-pointer"
            >
              <option value="ranger">Ranger (Standard)</option>
              <option value="doctor">Medical Officer</option>
              <option value="admin">System Admin</option>
            </select>
          </div>

          <button type="submit" disabled={isLoading}
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition-all flex items-center justify-center gap-2">
            {isLoading ? 'PROCESSING...' : <>CONFIRM REGISTRATION <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>

        <p className="text-center mt-6 text-slate-500 text-sm">
          Already have clearance? <Link to="/login" className="text-cyan-400 hover:text-cyan-300">Login</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;