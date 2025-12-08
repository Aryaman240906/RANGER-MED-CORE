import { create } from 'zustand';
import { useAuthStore } from './authStore'; // Assuming this exists per spec

// Lazy load content maps to keep bundle small
import dashboardSteps from '../tutorials/dashboardTutorial';
import doseSteps from '../tutorials/doseTutorial';
import logSteps from '../tutorials/logTutorial';
import alertsSteps from '../tutorials/alertsTutorial';
import profileSteps from '../tutorials/profileTutorial';
import demoSteps from '../tutorials/demoTutorial';

const TUTORIAL_CONTENT = {
  dashboard: dashboardSteps,
  dose: doseSteps,
  log: logSteps,
  alerts: alertsSteps,
  profile: profileSteps,
  demo: demoSteps,
};

export const useTutorialStore = create((set, get) => ({
  isOpen: false,
  pageKey: null,
  stepIndex: 0,
  steps: [],
  mode: 'once', // 'once' | 'always'

  /**
   * 🧠 DECISION ENGINE: Should we run the briefing?
   */
  showForUser: (pageKey, { mode = 'once', force = false } = {}) => {
    const user = useAuthStore.getState().user;
    const userId = user?.id || 'guest';
    const storageKey = `ranger_tutorial_seen::${userId}::${pageKey}`;

    // 1. If forcing (Replay button), always show
    if (force) {
      get().openTutorial(pageKey, { mode: 'always' });
      return true;
    }

    // 2. If Demo Mode, always show (unless suppressed recently, but spec says always)
    if (mode === 'always') {
      get().openTutorial(pageKey, { mode: 'always' });
      return true;
    }

    // 3. Real User: Check persistence
    const hasSeen = localStorage.getItem(storageKey);
    if (!hasSeen) {
      get().openTutorial(pageKey, { mode: 'once' });
      return true;
    }

    return false;
  },

  /**
   * 🚀 LAUNCH PROTOCOL
   */
  openTutorial: (pageKey, { mode = 'once', startAt = 0 } = {}) => {
    const content = TUTORIAL_CONTENT[pageKey];
    
    if (!content || content.length === 0) {
      console.warn(`[Tutorial] No intel found for sector: ${pageKey}`);
      return;
    }

    set({
      isOpen: true,
      pageKey,
      steps: content,
      stepIndex: startAt,
      mode,
    });
  },

  /**
   * ⏩ NAVIGATION
   */
  next: () => {
    const { stepIndex, steps, close } = get();
    if (stepIndex < steps.length - 1) {
      set({ stepIndex: stepIndex + 1 });
    } else {
      close({ completed: true });
    }
  },

  prev: () => {
    const { stepIndex } = get();
    if (stepIndex > 0) {
      set({ stepIndex: stepIndex - 1 });
    }
  },

  goTo: (index) => {
    const { steps } = get();
    if (index >= 0 && index < steps.length) {
      set({ stepIndex: index });
    }
  },

  /**
   * 🛑 TERMINATION & PERSISTENCE
   */
  close: ({ completed = false } = {}) => {
    const { mode, pageKey } = get();
    const user = useAuthStore.getState().user;
    const userId = user?.id || 'guest';

    if (completed && mode === 'once' && pageKey) {
      const storageKey = `ranger_tutorial_seen::${userId}::${pageKey}`;
      localStorage.setItem(storageKey, "true");
      // Optional: Save detailed progress if needed
      localStorage.setItem(`ranger_tutorial_progress::${userId}::${pageKey}`, JSON.stringify({ completed: true, timestamp: Date.now() }));
    }

    set({ isOpen: false, stepIndex: 0 });
  },

  /**
   * 🛠 UTILS
   */
  resetProgressForUser: (userId) => {
    Object.keys(TUTORIAL_CONTENT).forEach(key => {
      localStorage.removeItem(`ranger_tutorial_seen::${userId}::${key}`);
    });
    console.log("[Tutorial] User memory wiped.");
  }
}));