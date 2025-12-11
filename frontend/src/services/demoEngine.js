// src/services/demoEngine.js
import { createRNG } from './demoSeededRNG';

/**
 * 🌌 RANGER PHYSICS ENGINE (V2.0 - DETERMINISTIC)
 * A seedable, scenario-based simulation engine for generating tactical telemetry.
 * * DESIGN PHILOSOPHY:
 * - Deterministic: Same seed = Same outcome. Essential for demos/judging.
 * - Organic: Values don't just "jump"; they drift, recover, and spike like bio-signals.
 * - Integrated: Generates events compatible with the main DataStore schemas.
 */

// --- 1. ENGINE STATE (Module Level) ---
// This allows the store to simply call 'generateTickUpdate' without managing the RNG instance.
let rng = createRNG(Date.now());

/**
 * Re-initializes the physics engine with a specific entropy seed.
 * Called by DemoControls when the user hits "Reset" or enters a custom seed.
 */
export const seedEngine = (seed) => {
  rng = createRNG(seed);
  // console.debug(`[Physics] Engine re-seeded: ${seed}`);
};

// --- 2. SCENARIO CONFIGURATION ---
const SCENARIOS = {
  calm: {
    volatility: 0.2, // Very stable
    bias: 0.05,      // Slowly heals
    eventChance: 0.02,
    maxSeverity: 3   // Minor symptoms only
  },
  normal: {
    volatility: 0.8,
    bias: 0.0,       // Neutral drift
    eventChance: 0.05,
    maxSeverity: 6
  },
  aggressive: {
    volatility: 2.5, // High variance
    bias: -0.15,     // Slowly degrades
    eventChance: 0.12,
    maxSeverity: 9
  },
  unstable: {
    volatility: 5.0, // Chaos
    bias: -0.4,      // Rapid crash
    eventChance: 0.25,
    maxSeverity: 10
  }
};

// --- 3. LORE DATABANKS ---
const SYMPTOMS = ["Cephalic Pressure", "Visual Artifacts", "Tremor", "Nausea", "Core Fatigue", "Cognitive Drift"];
const ALERTS = ["Telemetry Desync", "Vitals Critical", "Pattern Anomaly", "System Stress"];

/**
 * 🚀 THE TICK
 * Calculates the next frame of the simulation.
 * @param {Object} state - Current Zustand state
 */
export const generateTickUpdate = (state) => {
  const { stability, readiness, scenario, events } = state;
  const config = SCENARIOS[scenario] || SCENARIOS.normal;

  // --- A. BIOLOGICAL PHYSICS (Brownian Motion with Homeostasis) ---
  
  // 1. Noise: Random fluctuation based on volatility
  const noise = (rng.random() - 0.5) * config.volatility;

  // 2. Gravity: Natural pull towards baseline (Homeostasis) or crash (Entropy)
  // If stability is high (>80), gravity pulls up slightly (momentum).
  // If low (<40), gravity pulls down (spiral).
  let gravity = 0;
  if (stability > 80) gravity = 0.05;
  else if (stability < 40) gravity = -0.1;
  
  // 3. Apply Forces
  let nextStability = stability + noise + gravity + config.bias;
  nextStability = Math.max(0, Math.min(100, nextStability));

  // 4. Readiness lags behind stability (Recovery takes time)
  let nextReadiness = readiness + ((nextStability - readiness) * 0.1);
  nextReadiness = Math.max(0, Math.min(100, nextReadiness));


  // --- B. PROCEDURAL EVENT GENERATION ---
  
  let newEvent = null;
  let newAlert = null;

  // Roll for event based on scenario chance
  if (rng.chance(config.eventChance)) {
    const roll = rng.random();

    // 30% Chance: Simulated Auto-Dose (Recovery)
    if (roll < 0.3 && stability < 70) {
      nextStability += rng.range(5, 15);
      newEvent = {
        id: `sim-dose-${Date.now()}`,
        type: 'dose',
        label: "AUTO-INJECT: STABILIZER",
        description: "Emergency Protocol Triggered",
        time: new Date().toLocaleTimeString(),
        timestamp: new Date().toISOString(),
        source: 'simulation',
        capsuleType: 'emergency',
        doseAmount: 1
      };
    } 
    // 50% Chance: Symptom Spike (Damage)
    else if (roll < 0.8) {
      const severity = rng.range(1, config.maxSeverity);
      const symptom = SYMPTOMS[rng.range(0, SYMPTOMS.length - 1)];
      nextStability -= severity * 1.5;
      
      newEvent = {
        id: `sim-sym-${Date.now()}`,
        type: 'symptom',
        label: `DETECTED: ${symptom.toUpperCase()}`,
        description: `Severity Level ${severity}/10`,
        time: new Date().toLocaleTimeString(),
        timestamp: new Date().toISOString(),
        source: 'simulation',
        severity: severity,
        symptom: symptom
      };

      // Critical escalation logic
      if (severity >= 8) {
        newAlert = {
          id: `sim-alert-${Date.now()}`,
          title: "CRITICAL VITALS",
          message: `${symptom} exceeding safety limits. Immediate intervention required.`,
          severity: "critical",
          status: "active",
          time: new Date().toISOString()
        };
      }
    }
    // 20% Chance: System Alert (Info)
    else {
      newEvent = {
        id: `sim-info-${Date.now()}`,
        type: 'warning',
        label: "SYSTEM SCAN COMPLETE",
        description: "No new anomalies detected.",
        time: new Date().toLocaleTimeString(),
        timestamp: new Date().toISOString(),
        source: 'simulation'
      };
    }
  }

  // --- C. DERIVED METRICS ---
  
  // Trend Analysis
  let trend = "Stable";
  if (nextStability > stability + 0.2) trend = "Improving";
  if (nextStability < stability - 0.2) trend = "Declining";

  // Risk Calculation (Inverse of stability + volatility penalty)
  let riskScore = (100 - nextStability) + (config.volatility * 2);
  riskScore = Math.max(0, Math.min(100, Math.round(riskScore)));

  // Confidence (AI certainty drops in chaos)
  let confidence = 100 - (config.volatility * 5);
  confidence = Math.max(20, Math.min(99, Math.round(confidence)));

  // --- D. OUTPUT PAYLOAD ---
  
  const updates = {
    stability: Number(nextStability.toFixed(2)),
    readiness: Number(nextReadiness.toFixed(2)),
    trend,
    riskScore,
    confidence
  };

  if (newEvent) {
    // Append to event log (Max 50 items)
    updates.events = [newEvent, ...state.events].slice(0, 50);
    
    // Update assistant based on event type
    if (newEvent.type === 'dose') updates.assistantMessage = "Stabilizing... Recovery sequence active.";
    if (newEvent.type === 'symptom') updates.assistantMessage = `Anomaly detected: ${newEvent.label}. Analyzing impact.`;
  }

  if (newAlert) {
    updates.alerts = [newAlert, ...state.alerts];
    updates.assistantMessage = "CRITICAL ALERT: Officer Down Protocol recommended.";
  }

  return updates;
};