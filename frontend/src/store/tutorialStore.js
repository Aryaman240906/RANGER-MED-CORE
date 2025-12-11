import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { useAuthStore } from './authStore';

// --- INTEL PACKAGES (Tutorial Scripts) ---
// Ensure these files exist in your src/tutorials folder
import dashboardSteps from '../tutorials/dashboardTutorial';
import doseSteps from '../tutorials/doseTutorial';
import logSteps from '../tutorials/logTutorial';
import alertsSteps from '../tutorials/alertsTutorial';
import profileSteps from '../tutorials/profileTutorial';
import demoSteps from '../tutorials/demoTutorial';

// Registry of available briefings
const INTEL_DATABASE = {
  dashboard: dashboardSteps,
  dose: doseSteps,
  log: logSteps,
  alerts: alertsSteps,
  profile: profileSteps,
  demo: demoSteps,
};

// --- UTILS ---
const logSystem = (msg) => {
  console.log(`%c[CORTEX] ${msg}`, 'background: #0f172a; color: #a5f3fc; padding: 2px 4px; border-radius: 2px; font-family: monospace;');
};

const playSound = (type) => {
  // Dispatches event for a global SoundManager to catch
  window.dispatchEvent(new CustomEvent('ranger-sfx', { detail: { type } }));
};

/**
 * 🧠 CORTEX ONBOARDING ENGINE
 * Manages "Tactical Briefings" (Tutorials).
 * Features:
 * - User-specific persistence (Guest vs Logged In)
 * - "Always On" Demo Mode support
 * - Event emission for UI/Sound reactions
 */
export const useTutorialStore = create(
  devtools((set, get) => ({
    
    // --- STATE ---
    isOpen: false,
    activeModuleId: null,  // 'dashboard' | 'dose' etc.
    stepIndex: 0,
    steps: [],             // Active script payload
    mode: 'history',       // 'history' (Respects seen status) | 'force' (Replay/Demo)

    // --- COMPUTED HELPERS ---
    get currentStep() {
      const { steps, stepIndex } = get();
      return steps[stepIndex] || null;
    },
    
    get progress() {
      const { steps, stepIndex } = get();
      if (steps.length === 0) return 0;
      return Math.round(((stepIndex + 1) / steps.length) * 100);
    },

    get isLastStep() {
      const { steps, stepIndex } = get();
      return stepIndex === steps.length - 1;
    },

    // =========================================
    // 🛡️ PERMISSION & STORAGE LOGIC
    // =========================================

    /**
     * Generates a unique storage key for the current user and module.
     */
    _getStorageKey: (moduleId) => {
      const user = useAuthStore.getState().user;
      const userId = user?.id || 'guest_operative';
      return `ranger_intel_v1::${userId}::${moduleId}`;
    },

    /**
     * Determines if a briefing should run based on history and mode.
     */
    showForUser: (moduleId, { mode = 'history', force = false } = {}) => {
      // 1. Validation
      if (!INTEL_DATABASE[moduleId]) {
        console.warn(`[Cortex] Unknown sector requested: ${moduleId}`);
        return false;
      }

      // 2. Force Override (Manual Trigger)
      if (force || mode === 'force') {
        get().triggerBriefing(moduleId, { mode: 'force' });
        return true;
      }

      // 3. Demo Mode Override (If global demo mode is active, usually we force tutorials)
      // Check your demoStore here if you want global demo mode to always show tutorials
      // const isGlobalDemo = useDemoStore.getState().demoMode; 
      // if (isGlobalDemo) { ... }

      // 4. History Check
      const key = get()._getStorageKey(moduleId);
      const hasSeen = localStorage.getItem(key);

      if (!hasSeen) {
        logSystem(`Initiating First-Time Briefing: ${moduleId.toUpperCase()}`);
        get().triggerBriefing(moduleId, { mode: 'history' });
        return true;
      }

      return false; // User has already been briefed
    },

    // =========================================
    // 🚀 ACTION PROTOCOLS
    // =========================================

    /**
     * Boots up the tutorial overlay.
     */
    triggerBriefing: (moduleId, { mode = 'history', startAt = 0 } = {}) => {
      const content = INTEL_DATABASE[moduleId];
      
      if (!content || content.length === 0) return;

      set({
        isOpen: true,
        activeModuleId: moduleId,
        steps: content,
        stepIndex: startAt,
        mode,
      });

      playSound('ui_open');
      // Pause other background activities if needed
      window.dispatchEvent(new CustomEvent("tutorial-start", { detail: { moduleId } }));
    },

    /**
     * Advances the sequence.
     */
    next: () => {
      const { stepIndex, steps, close } = get();
      
      if (stepIndex < steps.length - 1) {
        set({ stepIndex: stepIndex + 1 });
        playSound('ui_click');
      } else {
        // End of sequence
        close({ completed: true });
      }
    },

    /**
     * Rewinds the sequence.
     */
    prev: () => {
      const { stepIndex } = get();
      if (stepIndex > 0) {
        set({ stepIndex: stepIndex - 1 });
        playSound('ui_click_soft');
      }
    },

    /**
     * Terminates the briefing.
     * @param {boolean} completed - If true, marks as "Seen" in DB.
     */
    close: ({ completed = false } = {}) => {
      const { mode, activeModuleId, _getStorageKey } = get();

      // Only save persistence if we are in normal history mode
      if (completed && mode === 'history' && activeModuleId) {
        const key = _getStorageKey(activeModuleId);
        localStorage.setItem(key, new Date().toISOString());
        logSystem(`Briefing Complete: ${activeModuleId.toUpperCase()}`);
      } else {
        logSystem(`Briefing Terminated: ${activeModuleId?.toUpperCase()}`);
      }

      set({ isOpen: false, stepIndex: 0, steps: [] }); // Reset state
      playSound('ui_close');
      
      if (completed) {
        window.dispatchEvent(new CustomEvent("tutorial-complete", { detail: { activeModuleId } }));
      }
    },

    /**
     * Immediate abort (Skip).
     */
    skip: () => {
      get().close({ completed: true }); // We treat skipping as "seen" so it doesn't annoy them again
    },

    // =========================================
    // 🛠 SYSTEM UTILS (Debug/Admin)
    // =========================================

    /**
     * Wipes memory for specific module (allows re-triggering).
     */
    resetModuleMemory: (moduleId) => {
      const key = get()._getStorageKey(moduleId);
      localStorage.removeItem(key);
      logSystem(`Memory Wiped: ${moduleId}`);
    },

    /**
     * Factory Reset: Clears all tutorial history for current user.
     */
    resetAllMemory: () => {
      const user = useAuthStore.getState().user;
      const userId = user?.id || 'guest_operative';
      
      Object.keys(INTEL_DATABASE).forEach(mod => {
        const key = `ranger_intel_v1::${userId}::${mod}`;
        localStorage.removeItem(key);
      });
      
      logSystem("Full Intel Database Reset.");
      toast.success("Tutorial History Reset");
    }

  }), { name: 'ranger-tutorial-store' })
);