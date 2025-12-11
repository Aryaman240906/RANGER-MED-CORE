// src/hooks/useDataActions.js
import { useDataStore } from '../store/dataStore';
import { useShallow } from 'zustand/react/shallow';

/**
 * 💊 CAPSULE OPS HOOK
 * Operations regarding medication intake and history.
 */
export const useDoseActions = () => {
  const takeDose = useDataStore((s) => s.takeDose);
  const history = useDataStore((s) => s.doseHistory);
  
  // Computed on the fly for UI efficiency
  const lastDose = history[0] || null;
  const streak = calculateStreak(history); // Helper below

  return { 
    takeDose, 
    doseHistory: history,
    lastDose,
    streak 
  };
};

/**
 * 🧬 BIO-LOGS HOOK
 * Operations regarding symptom tracking and diagnostics.
 */
export const useSymptomActions = () => {
  const logSymptom = useDataStore((s) => s.logSymptom);
  const history = useDataStore((s) => s.symptomHistory);

  return {
    logSymptom,
    symptomHistory: history,
    lastLog: history[0] || null
  };
};

/**
 * 🚨 MISSION CONTROL HOOK
 * Managing alerts and security status.
 */
export const useAlertActions = () => {
  const { raiseAlert, resolveAlert, acknowledgeAlert, alerts } = useDataStore(
    useShallow(s => ({
      raiseAlert: s.raiseAlert,
      resolveAlert: s.resolveAlert,
      acknowledgeAlert: s.acknowledgeAlert,
      alerts: s.alerts
    }))
  );

  const activeAlerts = alerts.filter(a => a.status !== 'resolved');
  const criticalCount = activeAlerts.filter(a => a.severity === 'critical').length;

  return {
    alerts: activeAlerts,
    allAlerts: alerts,
    criticalCount,
    raiseAlert,
    resolveAlert,
    acknowledgeAlert
  };
};

/**
 * 📊 TELEMETRY HOOK
 * Read-only access to calculated RPG stats.
 */
export const useTelemetry = () => {
  return useDataStore(
    useShallow(s => ({
      stability: s.stability,
      readiness: s.readiness,
      riskScore: s.riskScore,
      confidence: s.confidence,
      events: s.events // The Master Timeline
    }))
  );
};

// --- HELPER UTILS ---

function calculateStreak(history) {
  if (!history || history.length === 0) return 0;
  // Simple streak logic: Consecutive days with at least 1 dose
  // (This can be expanded later for complex logic)
  let streak = 0;
  const today = new Date().setHours(0,0,0,0);
  
  // Sort descending just in case
  const sorted = [...history].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
  // Basic implementation: Count total doses for now as a "Level"
  // Real implementation would check dates.
  return sorted.length; 
}