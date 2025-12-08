// src/store/demoStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { generateTickUpdate } from "../services/demoEngine";

// 🆔 ID Generator (Safe Fallback)
const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `evt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// 🛡️ SYSTEM DEFAULTS (Factory Reset State)
const INITIAL_STATE = {
  // Telemetry
  stability: 76,
  readiness: 88,
  trend: "Stable",
  confidence: 78,
  riskScore: 42,
  
  // Tactical Data
  events: [],
  alerts: [],
  doseStreak: 3, // Start with a small streak for motivation
  
  // UX State
  assistantMessage: "System initialized. Monitoring neural link.",
  systemStatus: "ONLINE",
};

// ⚙️ PHYSICS CONSTANTS (Deterministic Rules)
const DOSE_EFFECTS = {
  standard: { stability: 6, readiness: 3 },
  booster: { stability: 12, readiness: 8 },
  emergency: { stability: 25, readiness: 15 }
};

const SYMPTOM_IMPACT = {
  low: { stability: -3, readiness: -2 },    // Severity 1-3
  med: { stability: -8, readiness: -5 },    // Severity 4-6
  high: { stability: -18, readiness: -12 }  // Severity 7-10
};

/**
 * 🧠 CENTRAL NERVOUS SYSTEM (STORE)
 * Manages both the simulation engine AND the user's tactical actions.
 * Acts as the "Single Source of Truth" for the entire dashboard.
 */
export const useDemoStore = create(
  persist(
    (set, get) => ({
      
      // =========================================
      // 🌌 SIMULATION ENGINE STATE
      // =========================================
      demoMode: false,
      running: false,
      speed: 1, 
      scenario: "normal",
      _interval: null,

      // =========================================
      // 📊 TELEMETRY DATA STREAMS
      // =========================================
      ...INITIAL_STATE,

      // --- COMPUTED SELECTORS (Helpers) ---
      // Used by BottomNav badges and Header alerts
      get alertsUnacknowledged() {
        return get().alerts.filter(a => a.status === 'active').length;
      },

      // =========================================
      // 💊 TACTICAL MODULE: DOSE
      // =========================================
      addDose: (payload) => set((state) => {
        const effect = DOSE_EFFECTS[payload.capsuleType] || DOSE_EFFECTS.standard;
        
        // 1. Calculate new vitals (Clamped 0-100)
        const newStability = Math.min(100, state.stability + effect.stability);
        const newReadiness = Math.min(100, state.readiness + effect.readiness);

        // 2. Create Timeline Event
        const event = {
          id: generateId(),
          type: "dose",
          label: `INTAKE: ${payload.capsuleType.toUpperCase()}`,
          description: `Stability +${effect.stability}%`,
          time: new Date().toLocaleTimeString(),
          timestamp: new Date().toISOString(),
          ...payload
        };

        return {
          stability: newStability,
          readiness: newReadiness,
          doseStreak: state.doseStreak + 1,
          events: [event, ...state.events].slice(0, 50), // Keep last 50
          assistantMessage: "Capsule metabolized. Neural alignment stabilizing."
        };
      }),

      // =========================================
      // 🧬 TACTICAL MODULE: LOGS
      // =========================================
      addSymptom: (payload) => set((state) => {
        const severity = payload.severity;
        const impact = severity >= 7 ? SYMPTOM_IMPACT.high 
                     : severity >= 4 ? SYMPTOM_IMPACT.med 
                     : SYMPTOM_IMPACT.low;

        // 1. Apply Damage (Clamped 0-100)
        const newStability = Math.max(0, state.stability + impact.stability);
        const newReadiness = Math.max(0, state.readiness + impact.readiness);

        // 2. Create Timeline Event
        const event = {
          id: generateId(),
          type: "symptom",
          label: `ANOMALY: ${payload.symptom.toUpperCase()}`,
          description: `Severity ${severity}/10 detected`,
          time: new Date().toLocaleTimeString(),
          timestamp: new Date().toISOString(),
          ...payload
        };

        // 3. Trigger Alert if Critical (Auto-Escalation Logic)
        let newAlerts = state.alerts;
        if (severity >= 7) {
          const alert = {
            id: generateId(),
            title: "CRITICAL BIO-SPIKE",
            message: `${payload.symptom} detected at critical levels. Immediate rest protocol advised.`,
            severity: "critical",
            status: "active",
            time: new Date().toISOString(),
            rangerId: "RNG-01"
          };
          newAlerts = [alert, ...state.alerts];
        }

        return {
          stability: newStability,
          readiness: newReadiness,
          events: [event, ...state.events].slice(0, 50),
          alerts: newAlerts,
          assistantMessage: severity > 6 
            ? "WARNING: High stress detected. Counter-measures required." 
            : "Symptom logged. Adjusting predictive models."
        };
      }),

      // =========================================
      // 🚨 TACTICAL MODULE: ALERTS
      // =========================================
      addAlert: (alert) => set((state) => ({
        alerts: [{ ...alert, id: generateId(), status: "active", time: new Date().toISOString() }, ...state.alerts]
      })),

      acknowledgeAlert: (id) => set((state) => ({
        alerts: state.alerts.map(a => 
          a.id === id ? { ...a, status: "acknowledged" } : a
        )
      })),

      resolveAlert: (id) => set((state) => ({
        alerts: state.alerts.map(a => 
          a.id === id ? { ...a, status: "resolved" } : a
        )
      })),

      // =========================================
      // 🕹️ ENGINE CONTROL ACTIONS
      // =========================================
      toggleDemoMode: () => {
        const { demoMode, stopSimulation, resetSimulation } = get();
        if (demoMode) {
          stopSimulation();
          resetSimulation();
        }
        set({ demoMode: !demoMode });
      },

      startSimulation: () => {
        const { _interval, speed } = get();
        if (_interval) clearInterval(_interval);

        const tickRate = 1000 / (speed || 1);

        // The Heartbeat of the App
        const interval = setInterval(() => {
          const currentState = get();
          // Ask the engine for the next frame based on physics
          const update = generateTickUpdate(currentState);
          set(update); 
        }, tickRate);

        set({ running: true, _interval: interval });
      },

      pauseSimulation: () => {
        const { _interval } = get();
        if (_interval) clearInterval(_interval);
        set({ running: false, _interval: null });
      },

      stopSimulation: () => get().pauseSimulation(),

      resetSimulation: () => {
        get().pauseSimulation();
        set({ ...INITIAL_STATE });
      },

      setScenario: (newScenario) => set({ scenario: newScenario }),

      setSpeed: (newSpeed) => {
        const { running, startSimulation, pauseSimulation } = get();
        set({ speed: newSpeed });
        if (running) {
          pauseSimulation(); // restart timer with new speed
          startSimulation();
        }
      },

      // --- UTILS ---
      
      // Generic event pusher (for system logs)
      addEvent: (event) => set((state) => ({ 
        events: [{ ...event, id: generateId(), _receivedAt: Date.now() }, ...state.events].slice(0, 50) 
      })),

      setAssistantMessage: (msg) => set({ assistantMessage: msg }),

    }),
    {
      name: "ranger-core-storage", 
      partialize: (state) => ({ 
        // PERSISTENCE WHITELIST
        demoMode: state.demoMode,
        scenario: state.scenario,
        speed: state.speed,
        doseStreak: state.doseStreak,
        events: state.events,
        alerts: state.alerts,
        // We persist stability/readiness so refresh doesn't jar the user
        stability: state.stability, 
        readiness: state.readiness
      }),
    }
  )
);