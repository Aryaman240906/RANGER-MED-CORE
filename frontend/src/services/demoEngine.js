// src/services/demoEngine.js

/**
 * 🛠️ MATH HELPERS
 * High-precision clamping and randomization for smooth UI animations.
 */
const rand = (min, max) => Math.random() * (max - min) + min;
const clamp = (val, min, max) => Math.min(Math.max(val, min), max);
const chance = (percentage) => Math.random() * 100 < percentage;

const getTimestamp = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

/**
 * ⚙️ SCENARIO PHYSICS
 * Defines how the "biological engine" behaves in different modes.
 *
 * drift: Magnitude of random fluctuation (volatility).
 * bias: Natural tendency (-0.1 = slowly dying, +0.1 = slowly healing).
 * eventChance: % chance per tick to trigger a timeline event.
 * critChance: % chance that an event is a "Danger" type.
 */
const SCENARIO_CONFIG = {
  calm:       { drift: 0.15, bias: 0.05,  eventChance: 1.5, critChance: 0 },
  normal:     { drift: 0.4,  bias: 0.0,   eventChance: 5,   critChance: 10 },
  aggressive: { drift: 1.2,  bias: -0.15, eventChance: 12,  critChance: 30 },
  unstable:   { drift: 2.5,  bias: -0.4,  eventChance: 25,  critChance: 60 },
};

/**
 * 📚 LORE DATABASE
 * Procedural text generation for Sci-Fi immersion.
 */
const TEXT_BANKS = {
  success: [
    "Capsule metabolization complete", "Neural sync nominal", "Adrenaline levels stabilized", 
    "Vitals optimal", "Bio-monitor connection secure", "Rapid recovery cycle active"
  ],
  warning: [
    "Mild fatigue markers", "Elevated heart rate", "Cortisol spike detected", 
    "Hydration levels dropping", "Minor cognitive drift", "Oxygen efficiency 94%"
  ],
  danger: [
    "CRITICAL: Neural desync", "DANGER: Hypoxia warning", "System Stress overload", 
    "Adrenal failure imminent", "Vision telemetry lost", "Core stability failure"
  ],
  info: [
    "Mission telemetry update", "Environment scan complete", "HQ data packet received", 
    "Background synthesis running", "Auto-logging biometrics"
  ],
  assistant: [
    "⚠️ Cognitive load high. Focus breathing.",
    "🛡️ System suggests hydration in T-minus 10m.",
    "📉 Stability trending down. Advise caution.",
    "✅ You are operating at peak efficiency, Ranger.",
    "🧠 Neural patterns indicate mild stress. Compensating.",
    "💊 Next capsule dose window opening soon.",
    "📡 Telemetry sync with HQ established."
  ]
};

/**
 * 🚀 MAIN ENGINE
 * Generates the next "Frame" of the simulation.
 * Called by demoStore every tick (e.g., 1000ms / speed).
 */
export function generateTickUpdate(state) {
  const { stability, readiness, scenario, events } = state;
  
  // 1. Load Physics Profile
  const config = SCENARIO_CONFIG[scenario] || SCENARIO_CONFIG.normal;

  // 2. Calculate Biological Drift (Brownian Motion + Bias)
  // We add 'Bias' so Aggressive modes naturally degrade over time without intervention.
  const stabDrift = (Math.random() - 0.5) * config.drift + config.bias;
  const readDrift = (Math.random() - 0.5) * (config.drift * 0.8) + (config.bias * 0.5);

  let newStability = clamp(stability + stabDrift, 0, 100);
  let newReadiness = clamp(readiness + readDrift, 0, 100);

  // 3. Generate Timeline Events (Procedural)
  let newEvent = null;
  let newEventsList = events;

  if (chance(config.eventChance)) {
    // Determine Event Severity
    let type = "info";
    const roll = Math.random() * 100;
    
    if (roll < config.critChance) type = "danger";
    else if (roll < config.critChance + 30) type = "warning";
    else if (roll < config.critChance + 60) type = "success";

    // Apply Impact to Stats
    if (type === "danger") newStability -= rand(4, 10);
    if (type === "warning") newStability -= rand(1, 4);
    if (type === "success") newStability += rand(2, 5);

    // Clamp again after impact
    newStability = clamp(newStability, 0, 100);

    // Pick random lore text
    const label = TEXT_BANKS[type][Math.floor(Math.random() * TEXT_BANKS[type].length)];

    newEvent = {
      id: crypto.randomUUID(),
      time: getTimestamp(),
      label: label,
      type: type,
    };

    // Add to list and slice to keep memory low (Max 20 items)
    newEventsList = [newEvent, ...events].slice(0, 20);
  }

  // 4. Generate AI Assistant Message (Rare)
  let assistantMessage = state.assistantMessage; // Keep old message by default
  // 5% chance usually, but higher if an event just happened
  if (chance(newEvent ? 20 : 3)) { 
    assistantMessage = TEXT_BANKS.assistant[Math.floor(Math.random() * TEXT_BANKS.assistant.length)];
  }

  // 5. Calculate Derivatives (Trend & Risk)
  let trend = "Stable";
  const delta = newStability - stability;
  if (delta > 0.1) trend = "Improving";
  if (delta < -0.1) trend = "Declining";

  // Risk is inverse of stability, but adds 'noise' based on volatility (drift)
  // This makes the risk gauge 'jitter' more in unstable modes
  const noise = (Math.random() - 0.5) * (config.drift * 5); 
  const riskScore = clamp(Math.round((100 - newStability) + noise), 0, 100);

  // Confidence drops if stability is low OR if volatility is high
  const confidence = clamp(Math.round(newStability * 0.8 + 20 - (config.drift * 5)), 10, 99);

  // 6. Return Payload (Precision formatting included)
  return {
    stability: Number(newStability.toFixed(2)), // Keep 2 decimals for smooth graph lerping
    readiness: Number(newReadiness.toFixed(2)),
    trend,
    riskScore: Math.round(riskScore), // Integers for UI display
    confidence: Math.round(confidence),
    assistantMessage,
    ...(newEvent ? { events: newEventsList } : {}), // Only update events if changed
  };
}