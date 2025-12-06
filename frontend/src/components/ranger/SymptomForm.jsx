// src/components/ranger/SymptomForm.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Send } from 'lucide-react';
import { toast } from 'react-hot-toast';

const SymptomForm = () => {
  const [severity, setSeverity] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const severityOptions = [
    { value: 'mild', label: 'Mild', color: 'text-green-400', bg: 'bg-green-500/10' },
    { value: 'moderate', label: 'Moderate', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { value: 'severe', label: 'Severe', color: 'text-red-400', bg: 'bg-red-500/10' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!severity || !description.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast.success(`Symptom logged: ${severity} - ${description}`, {
      duration: 4000,
      style: {
        background: 'rgba(15, 23, 42, 0.9)',
        color: '#fff',
        border: '1px solid rgba(34, 211, 238, 0.3)',
        borderRadius: '12px',
      },
    });

    setSeverity('');
    setDescription('');
    setIsSubmitting(false);
  };

  return (
    <motion.div
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-slate-900/50 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-6 hover:border-cyan-500/40 transition-all duration-300"
    >
      <div className="flex items-center gap-2 mb-6">
        <Heart className="w-5 h-5 text-cyan-400" />
        <h3 className="text-lg font-semibold text-white">Log Symptoms</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Severity Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-3">
            Severity Level
          </label>
          <div className="grid grid-cols-3 gap-2">
            {severityOptions.map((option) => (
              <motion.button
                key={option.value}
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSeverity(option.value)}
                className={`p-3 rounded-xl border transition-all duration-200 ${
                  severity === option.value
                    ? `${option.bg} border-current ${option.color} shadow-[0_0_15px_rgba(34,211,238,0.2)]`
                    : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600'
                }`}
              >
                <div className="text-xs font-medium">{option.label}</div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your symptoms..."
            rows={3}
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200 resize-none"
          />
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isSubmitting || !severity || !description.trim()}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
            />
          ) : (
            <>
              <Send className="w-4 h-4" />
              Log Symptom
            </>
          )}
        </motion.button>
      </form>

      {/* Quick Actions */}
      <div className="mt-4 pt-4 border-t border-slate-700/50">
        <p className="text-xs text-slate-500 mb-2">Quick Log:</p>
        <div className="flex flex-wrap gap-2">
          {['Headache', 'Fatigue', 'Nausea', 'Dizziness'].map((symptom) => (
            <motion.button
              key={symptom}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setDescription(symptom)}
              className="px-3 py-1 text-xs bg-slate-800 text-slate-400 rounded-full hover:bg-slate-700 hover:text-cyan-400 transition-all duration-200"
            >
              {symptom}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default SymptomForm;