// src/store/demoStore.js
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { generateTickUpdate, seedEngine } from "../services/demoEngine";
import { saveDemoConfig } from "../services/demoPersistence";

// --- 🆔 ID GENERATOR (Browser Native) ---
const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `evt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// --- ⚙️ PHYSICS ENGINE (METRICS CALCULATOR) ---
/**
 * Pure function that calculates RPG stats based on history.
 * Ensures data consistency across all pages.
 */
const computeMetrics = (doseHistory, symptomHistory, currentStability) => {
  const now = Date.now();
  const ONE_DAY = 24 * 60 * 60 * 1000;

  // 1. Calculate Dose Bonuses (Last 24h)
  const recentDoses = doseHistory.filter(d => (now - new Date(d.timestamp).getTime()) < ONE_DAY);
  const doseBonus = recentDoses.reduce((acc, d) => acc + (d.metadata?.stabilityBoost || 5), 0);

  // 2. Calculate Symptom Penalties (Decaying over 24h)
  const symptomPenalty = symptomHistory.reduce((acc, s) => {
    const age = now - new Date(s.timestamp).getTime();
    if (age > ONE_DAY) return acc;
    const severity = s.severity || 1;
    const timeDecay = Math.max(0.1, 1 - (age / ONE_DAY)); // Newer = more impact
    return acc + (severity * 4 * timeDecay);
  }, 0);

  // 3. Compute Stability (Clamped 0-100)
  let newStability = currentStability + (doseBonus * 0.1) - (symptomPenalty * 0.05);
  newStability = Math.max(10, Math.min(100, Math.round(newStability)));

  // 4. Compute Readiness (Derived from Stability + Streak)
  let readiness = Math.round(newStability * 0.9 + (recentDoses.length * 2));
  readiness = Math.max(5, Math.min(100, readiness));

  // 5. Compute Risk Score (Inverse of Stability + Severity Spikes)
  let riskScore = 100 - newStability;
  if (symptomPenalty > 25) riskScore += 15; 
  riskScore = Math.max(0, Math.min(100, Math.round(riskScore)));

  // 6. Confidence (Data density)
  const dataPoints = recentDoses.length + symptomHistory.length;
  const confidence = Math.min(99, 60 + (dataPoints * 5));

  return { stability: newStability, readiness, riskScore, confidence };
};

// 🛡️ INITIAL STATE
const INITIAL_STATE = {
  // Computed Metrics
  stability: 76,
  readiness: 88,
  riskScore: 24,
  confidence: 78,
  trend: "Stable",
  
  // Raw Data Containers (The Source of Truth)
  doseHistory: [],
  symptomHistory: [],
  events: [],     // Visual Timeline
  alerts: [],     // Active Mission Alerts
  doseStreak: 3,
  
  // UX State
  assistantMessage: "System initialized. Monitoring neural link.",
  systemStatus: "ONLINE",
  
  // Simulation State
  demoMode: false,
  running: false,
  speed: 1, 
  scenario: "normal",
  seed: 123456789,
  _interval: null,
};

// 💊 DOSE CONFIG
const DOSE_EFFECTS = {
  standard: { stability: 6, readiness: 3 },
  booster: { stability: 12, readiness: 8 },
  emergency: { stability: 25, readiness: 15 }
};

export const useDemoStore = create(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      // --- 🧠 COMPUTED SELECTORS ---
      get alertsUnacknowledged() {
        return get().alerts.filter(a => a.status === 'active').length;
      },

      // =========================================
      // 💊 ACTION: TAKE DOSE
      // =========================================
      addDose: (payload) => set((state) => {
        const effect = DOSE_EFFECTS[payload.capsuleType] || DOSE_EFFECTS.standard;
        
        const newDose = {
          id: generateId(),
          timestamp: new Date().toISOString(),
          capsuleType: payload.capsuleType,
          amount: payload.doseAmount,
          metadata: { stabilityBoost: effect.stability }
        };

        const event = {
          id: generateId(),
          type: "dose",
          label: `INTAKE: ${payload.capsuleType.toUpperCase()}`,
          description: `Stability +${effect.stability}% | Readiness +${effect.readiness}%`,
          time: new Date().toLocaleTimeString(),
          timestamp: new Date().toISOString(),
          ...payload
        };

        const nextDoseHistory = [newDose, ...state.doseHistory];
        const immediateStability = Math.min(100, state.stability + effect.stability);
        const metrics = computeMetrics(nextDoseHistory, state.symptomHistory, immediateStability);

        return {
          ...metrics,
          doseStreak: state.doseStreak + 1,
          doseHistory: nextDoseHistory,
          events: [event, ...state.events].slice(0, 100),
          assistantMessage: "Capsule metabolized. Neural alignment stabilizing."
        };
      }),

      // =========================================
      // 🧬 ACTION: LOG SYMPTOM
      // =========================================
      addSymptom: (payload) => set((state) => {
        const newSymptom = {
          id: generateId(),
          timestamp: new Date().toISOString(),
          symptom: payload.symptom,
          severity: payload.severity,
          notes: payload.notes
        };

        const event = {
          id: generateId(),
          type: "symptom",
          label: `ANOMALY: ${payload.symptom.toUpperCase()}`,
          description: `Severity ${payload.severity}/10 detected`,
          time: new Date().toLocaleTimeString(),
          timestamp: new Date().toISOString(),
          ...payload
        };

        let nextAlerts = state.alerts;
        if (payload.severity >= 7) {
          const alert = {
            id: generateId(),
            title: "CRITICAL BIO-SPIKE",
            message: `${payload.symptom} spikes exceeding safety thresholds. Immediate rest advised.`,
            severity: "critical",
            status: "active",
            time: new Date().toISOString(),
            rangerId: "USER-01"
          };
          nextAlerts = [alert, ...state.alerts];
        }

        const nextSymptomHistory = [newSymptom, ...state.symptomHistory];
        const dropAmount = payload.severity * 2; 
        const immediateStability = Math.max(0, state.stability - dropAmount);
        const metrics = computeMetrics(state.doseHistory, nextSymptomHistory, immediateStability);

        return {
          ...metrics,
          symptomHistory: nextSymptomHistory,
          events: [event, ...state.events].slice(0, 100),
          alerts: nextAlerts,
          assistantMessage: payload.severity > 6 
            ? "WARNING: High stress detected. Counter-measures required." 
            : "Symptom logged. Adjusting predictive models."
        };
      }),

      // =========================================
      // 🚨 ACTION: ALERTS MANAGEMENT
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
      // 🕹️ SIMULATION ENGINE (The Heartbeat)
      // =========================================
      
      toggleDemoMode: () => {
        const { demoMode, stopSimulation, resetSimulation } = get();
        if (demoMode) {
          stopSimulation();
        }
        set({ demoMode: !demoMode });
        
        // Sync to persistence
        saveDemoConfig({ isRunning: !demoMode });
      },

      startSimulation: () => {
        const { _interval, speed, seed } = get();
        if (_interval) clearInterval(_interval);

        // Ensure engine is seeded
        seedEngine(seed);

        const tickRate = 1000 / (speed || 1);

        const interval = setInterval(() => {
          const currentState = get();
          
          // 1. Get deterministic update from Engine Service
          const tickUpdate = generateTickUpdate(currentState);
          
          // 2. Merge with physics constraints
          set((state) => {
            const nextStability = Math.max(0, Math.min(100, tickUpdate.stability));
            const derived = computeMetrics(state.doseHistory, state.symptomHistory, nextStability);
            
            return {
              ...tickUpdate,
              ...derived
            };
          });

        }, tickRate);

        set({ running: true, _interval: interval });
        saveDemoConfig({ isRunning: true });
      },

      pauseSimulation: () => {
        const { _interval } = get();
        if (_interval) clearInterval(_interval);
        set({ running: false, _interval: null });
        saveDemoConfig({ isRunning: false });
      },

      stopSimulation: () => get().pauseSimulation(),

      resetSimulation: () => {
        get().pauseSimulation();
        
        // Re-seed engine
        const newSeed = Date.now();
        seedEngine(newSeed);
        
        set({ 
          ...INITIAL_STATE,
          seed: newSeed,
          doseHistory: [],
          symptomHistory: []
        });
      },

      setScenario: (newScenario) => {
        set({ scenario: newScenario });
        saveDemoConfig({ scenario: newScenario });
      },

      setSpeed: (newSpeed) => {
        const { running, startSimulation, pauseSimulation } = get();
        set({ speed: newSpeed });
        saveDemoConfig({ speed: newSpeed });
        
        if (running) {
          pauseSimulation();
          startSimulation();
        }
      },

      // --- UTILS ---
      addEvent: (event) => set((state) => ({ 
        events: [{ ...event, id: generateId(), _receivedAt: Date.now() }, ...state.events].slice(0, 100) 
      })),

      setAssistantMessage: (msg) => set({ assistantMessage: msg }),

      exportSnapshot: () => {
        const state = get();
        const snapshot = {
          metrics: { stability: state.stability, readiness: state.readiness, risk: state.riskScore },
          history: { doses: state.doseHistory, symptoms: state.symptomHistory },
          config: { seed: state.seed, scenario: state.scenario, speed: state.speed }
        };
        return JSON.stringify(snapshot, null, 2);
      }
    }),
    {
      name: "ranger-core-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        demoMode: state.demoMode,
        scenario: state.scenario,
        speed: state.speed,
        seed: state.seed,
        doseStreak: state.doseStreak,
        events: state.events,
        alerts: state.alerts,
        stability: state.stability, 
        readiness: state.readiness,
        doseHistory: state.doseHistory,
        symptomHistory: state.symptomHistory
      }),
    }
  )
);