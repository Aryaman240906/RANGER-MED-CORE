// src/store/dataStore.js
import { create } from 'zustand';
import { persistenceAdapter } from '../services/persistenceAdapter';

// --- 🆔 ID GENERATOR ---
const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `evt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// --- ⚙️ PHYSICS ENGINE (METRICS) ---
/**
 * Pure function that calculates RPG stats based on history.
 * This ensures the dashboard is always mathematically correct.
 */
const computeMetricsRaw = (doseHistory, symptomHistory) => {
  const now = Date.now();
  const ONE_DAY = 24 * 60 * 60 * 1000;

  // 1. Calculate Dose Impact (Positive)
  // Recent doses count more.
  const recentDoses = doseHistory.filter(d => (now - new Date(d.timestamp).getTime()) < ONE_DAY);
  const doseBonus = recentDoses.reduce((acc, d) => acc + (d.metadata?.potency || 10), 0);

  // 2. Calculate Symptom Penalty (Negative)
  // Recent, high-severity symptoms hurt stability most.
  const symptomPenalty = symptomHistory.reduce((acc, s) => {
    const age = now - new Date(s.timestamp).getTime();
    if (age > ONE_DAY) return acc; // Ignore old symptoms for live stability
    
    const severity = s.severity || 1;
    const timeDecay = Math.max(0.2, 1 - (age / ONE_DAY)); // Newer = more impact
    return acc + (severity * 3 * timeDecay);
  }, 0);

  // 3. Compute Stability (0-100)
  // Base 60 + Doses - Symptoms
  let stability = 60 + doseBonus - symptomPenalty;
  stability = Math.max(10, Math.min(100, Math.round(stability)));

  // 4. Compute Readiness (0-100)
  // Readiness lags behind stability (recovery takes time)
  let readiness = Math.round(stability * 0.9 + (recentDoses.length * 2));
  readiness = Math.max(5, Math.min(100, readiness));

  // 5. Compute Risk Score (0-100)
  // Inverse of stability, heavily weighted by recent severe symptoms
  let riskScore = 100 - stability;
  if (symptomPenalty > 20) riskScore += 10; // Penalty flag
  riskScore = Math.max(0, Math.min(100, Math.round(riskScore)));

  // 6. Confidence (Mock AI confidence)
  // Higher data points = higher confidence
  const dataPoints = recentDoses.length + symptomHistory.length;
  const confidence = Math.min(99, 70 + (dataPoints * 2));

  return { stability, readiness, riskScore, confidence };
};

// --- 🛡️ THE STORE ---

export const useDataStore = create((set, get) => ({
  
  // --- STATE CONTAINERS ---
  doseHistory: [],
  symptomHistory: [],
  events: [],     // The Master Timeline
  alerts: [],     // Active Mission Alerts
  
  // --- COMPUTED METRICS ---
  stability: 75,
  readiness: 80,
  riskScore: 25,
  confidence: 70,

  // --- FLAGS ---
  isHydrated: false, // Has data loaded from disk?

  // =========================================
  // 🕹️ ACTIONS
  // =========================================

  /**
   * 🚀 INIT
   * Called by App.jsx on mount to load data from persistence.
   */
  hydrate: async () => {
    const saved = await persistenceAdapter.loadSnapshot();
    if (saved) {
      set({ 
        ...saved, 
        isHydrated: true 
      });
      // Recalculate metrics based on loaded data to ensure freshness
      get().recompute(); 
    } else {
      set({ isHydrated: true });
    }
  },

  /**
   * 🔄 RECOMPUTE
   * Runs the Physics Engine and updates stats.
   * Also triggers the auto-save.
   */
  recompute: () => {
    const state = get();
    const metrics = computeMetricsRaw(state.doseHistory, state.symptomHistory);
    
    set({ ...metrics });
    
    // Auto-Save the entire state snapshot
    persistenceAdapter.saveDebounced({
      doseHistory: state.doseHistory,
      symptomHistory: state.symptomHistory,
      events: state.events,
      alerts: state.alerts
    });
  },

  /**
   * 💊 TAKE DOSE
   */
  takeDose: (payload = {}) => {
    const newDose = {
      id: generateId(),
      timestamp: new Date().toISOString(),
      method: 'manual',
      metadata: payload
    };

    const newEvent = {
      id: generateId(),
      type: 'dose',
      timestamp: newDose.timestamp,
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      label: `DOSE ADMINISTERED`,
      description: payload.capsuleType ? `${payload.capsuleType.toUpperCase()} Sequence Initiated` : 'Standard Protocol',
      source: 'manual'
    };

    set(state => ({
      doseHistory: [newDose, ...state.doseHistory],
      events: [newEvent, ...state.events].slice(0, 100)
    }));

    get().recompute();
  },

  /**
   * 🧬 LOG SYMPTOM
   */
  logSymptom: (payload = {}) => {
    const newLog = {
      id: generateId(),
      timestamp: new Date().toISOString(),
      severity: payload.severity || 1,
      text: payload.symptom || 'Unknown Anomaly',
      metadata: payload
    };

    const newEvent = {
      id: generateId(),
      type: 'symptom',
      timestamp: newLog.timestamp,
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      label: `BIO-SCAN: ${payload.symptom.toUpperCase()}`,
      description: `Severity Level ${payload.severity} detected`,
      source: 'manual'
    };

    set(state => ({
      symptomHistory: [newLog, ...state.symptomHistory],
      events: [newEvent, ...state.events].slice(0, 100)
    }));

    // Auto-raise alert if severity is critical
    if (payload.severity >= 7) {
      get().raiseAlert({
        title: "CRITICAL VITALS",
        message: `${payload.symptom} spikes exceeding safety thresholds.`,
        severity: "critical"
      });
    }

    get().recompute();
  },

  /**
   * 🚨 ALERTS SYSTEM
   */
  raiseAlert: (alertPayload) => {
    const newAlert = {
      id: generateId(),
      timestamp: new Date().toISOString(),
      status: 'active', // active | acknowledged | resolved
      severity: 'info', // info | warning | critical
      ...alertPayload
    };

    const alertEvent = {
      id: generateId(),
      type: 'alert',
      timestamp: newAlert.timestamp,
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      label: `ALERT: ${newAlert.title}`,
      description: "Mission Control Notification",
      source: 'system'
    };

    set(state => ({
      alerts: [newAlert, ...state.alerts],
      events: [alertEvent, ...state.events].slice(0, 100)
    }));
    
    get().recompute();
  },

  resolveAlert: (id) => {
    set(state => ({
      alerts: state.alerts.map(a => 
        a.id === id ? { ...a, status: 'resolved' } : a
      )
    }));
    get().recompute();
  },

  acknowledgeAlert: (id) => {
    set(state => ({
      alerts: state.alerts.map(a => 
        a.id === id ? { ...a, status: 'acknowledged' } : a
      )
    }));
    get().recompute(); // Persist the ack
  },

  /**
   * 🧹 DEBUG / RESET
   */
  wipeData: () => {
    set({
      doseHistory: [],
      symptomHistory: [],
      events: [],
      alerts: [],
      stability: 75,
      readiness: 80
    });
    persistenceAdapter.clear();
  }

}));