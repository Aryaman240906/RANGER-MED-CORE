import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTutorialStore } from '../../store/tutorialStore';
import { ChevronRight, ChevronLeft, X, CheckCircle, Zap } from 'lucide-react';

/**
 * 🛰️ TACTICAL OVERLAY
 * Renders a "Holo-Projection" explaining interface elements.
 */
export default function TutorialOverlay() {
  const { isOpen, steps, stepIndex, next, prev, close } = useTutorialStore();
  const [targetRect, setTargetRect] = useState(null);
  
  const currentStep = steps[stepIndex];
  
  // --- 1. TARGETING SYSTEM (Finds element on screen) ---
  useEffect(() => {
    if (!isOpen || !currentStep) return;

    const updatePosition = () => {
      if (currentStep.highlightSelector) {
        const el = document.querySelector(currentStep.highlightSelector);
        if (el) {
          const rect = el.getBoundingClientRect();
          // Add generous padding for the highlight ring
          setTargetRect({
            top: rect.top - 10,
            left: rect.left - 10,
            width: rect.width + 20,
            height: rect.height + 20,
          });
          
          // Auto-scroll if out of view
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          return;
        }
      }
      // Fallback: Center screen if no selector or not found
      setTargetRect(null); 
    };

    // Initial scan
    updatePosition();

    // Re-scan on resize/scroll to keep ring attached
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isOpen, stepIndex, currentStep]);

  // --- 2. KEYBOARD CONTROL ---
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'Enter') next();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, next, prev, close]);

  if (!isOpen || !currentStep) return null;

  // Determine Tooltip Position based on Target
  // Simple logic: If target is in top half, show bottom. Else top.
  // If no target, center.
  const isCentered = !targetRect;
  const isTopHalf = targetRect && (targetRect.top < window.innerHeight / 2);
  
  const tooltipStyle = isCentered 
    ? { top: '50%', left: '50%', x: '-50%', y: '-50%' }
    : { 
        top: isTopHalf ? targetRect.top + targetRect.height + 20 : 'auto',
        bottom: isTopHalf ? 'auto' : (window.innerHeight - targetRect.top) + 20,
        left: '50%', // Center horizontally relative to screen for mobile safety
        x: '-50%',
        maxWidth: '90vw'
      };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex flex-col"
        aria-live="polite"
      >
        {/* A. DIMMED BACKDROP */}
        <div className="absolute inset-0 bg-[#050b14]/80 backdrop-blur-sm" onClick={() => close()} />

        {/* B. TARGET HIGHLIGHT RING */}
        {targetRect && (
          <motion.div
            layoutId="tutorial-ring"
            className="absolute rounded-xl border-2 border-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.4)] pointer-events-none"
            initial={false}
            animate={{
              top: targetRect.top,
              left: targetRect.left,
              width: targetRect.width,
              height: targetRect.height,
            }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            {/* Animated Corners */}
            <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-white" />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-white" />
            {/* Pulse Effect */}
            <div className="absolute inset-0 bg-cyan-400/10 animate-pulse rounded-lg" />
          </motion.div>
        )}

        {/* C. INTEL CARD (Tooltip) */}
        <motion.div
          className="fixed w-full max-w-md pointer-events-auto"
          style={tooltipStyle}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          key={stepIndex} // Re-animate on step change
          transition={{ duration: 0.3 }}
        >
          <div className="bg-[#0a1020] border border-cyan-500/30 rounded-2xl overflow-hidden shadow-2xl relative">
            
            {/* Holographic Top Bar */}
            <div className="h-1 w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-transparent" />
            
            <div className="p-6 relative z-10">
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                    <Zap size={16} className="text-cyan-400" />
                  </div>
                  <span className="text-[10px] font-mono text-cyan-500 uppercase tracking-widest">
                    Briefing {stepIndex + 1}/{steps.length}
                  </span>
                </div>
                <button onClick={() => close()} className="text-slate-500 hover:text-white transition-colors">
                  <X size={18} />
                </button>
              </div>

              {/* Content */}
              <h3 className="text-lg font-bold text-white mb-2">{currentStep.title}</h3>
              <div 
                className="text-sm text-slate-300 leading-relaxed font-mono"
                dangerouslySetInnerHTML={{ __html: currentStep.message }} 
              />

              {/* Media Attachment (Optional) */}
              {currentStep.media && (
                <div className="mt-4 rounded-lg overflow-hidden border border-white/10">
                  <img src={currentStep.media.src} alt={currentStep.media.alt} className="w-full h-32 object-cover" />
                </div>
              )}
            </div>

            {/* Footer / Controls */}
            <div className="p-4 bg-black/40 border-t border-white/5 flex justify-between items-center">
              
              <button 
                onClick={prev} 
                disabled={stepIndex === 0}
                className="text-slate-400 hover:text-white disabled:opacity-30 transition-colors flex items-center gap-1 text-xs font-bold uppercase"
              >
                <ChevronLeft size={14} /> Back
              </button>

              <div className="flex gap-1">
                {steps.map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1 rounded-full transition-all ${i === stepIndex ? 'w-6 bg-cyan-400' : 'w-2 bg-slate-700'}`} 
                  />
                ))}
              </div>

              <button 
                onClick={next}
                className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all"
              >
                {stepIndex === steps.length - 1 ? (
                  <>Finish <CheckCircle size={14} /></>
                ) : (
                  <>Next <ChevronRight size={14} /></>
                )}
              </button>
            </div>

          </div>
        </motion.div>

      </motion.div>
    </AnimatePresence>
  );
}