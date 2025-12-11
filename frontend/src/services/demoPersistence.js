// src/services/demoPersistence.js

/**
 * 💾 DEMO STATE PERSISTENCE
 * Specialized storage adapter for the Simulation Engine.
 * Ensures the "Game State" (Seed, Scenario, Speed) survives browser refreshes.
 * Separate from the main app data to prevent pollution of real user logs.
 */

const STORAGE_KEY = 'ranger_demo_config_v1';

// 🛡️ DEFAULT CONFIGURATION
const DEFAULTS = {
  isRunning: false,
  scenario: 'normal',   // calm | normal | aggressive | unstable
  speed: 1,             // 1 | 2 | 4
  seed: 123456789,      // Deterministic fallback
  lastActive: Date.now()
};

// --- VALIDATORS ---
const VALID_SCENARIOS = ['calm', 'normal', 'aggressive', 'unstable'];
const VALID_SPEEDS = [1, 2, 4];

/**
 * 📥 LOAD CONFIGURATION
 * Retrieves the saved demo state with strict validation.
 * @returns {Object} The complete config object (merged with defaults)
 */
export const loadDemoConfig = () => {
  if (typeof window === 'undefined') return DEFAULTS;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;

    const saved = JSON.parse(raw);

    // Schema Validation / Sanitization
    return {
      isRunning: typeof saved.isRunning === 'boolean' ? saved.isRunning : DEFAULTS.isRunning,
      scenario: VALID_SCENARIOS.includes(saved.scenario) ? saved.scenario : DEFAULTS.scenario,
      speed: VALID_SPEEDS.includes(saved.speed) ? saved.speed : DEFAULTS.speed,
      seed: typeof saved.seed === 'number' ? saved.seed : DEFAULTS.seed,
      lastActive: saved.lastActive || Date.now()
    };

  } catch (err) {
    console.warn("[DemoPersistence] Corrupt config detected. Resetting to defaults.");
    // Auto-heal by clearing bad data
    localStorage.removeItem(STORAGE_KEY);
    return DEFAULTS;
  }
};

/**
 * 📤 SAVE CONFIGURATION
 * Persists simulation settings. Supports partial updates (patching).
 * @param {Object} updates - Partial config object (e.g. { speed: 2 })
 */
export const saveDemoConfig = (updates) => {
  if (typeof window === 'undefined') return;

  try {
    // 1. Load current to ensure we don't wipe missing keys
    const current = loadDemoConfig();
    
    // 2. Merge updates
    const nextConfig = {
      ...current,
      ...updates,
      lastActive: Date.now()
    };

    // 3. Write
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextConfig));
    
  } catch (err) {
    console.error("[DemoPersistence] Write failed (Quota exceeded?)", err);
  }
};

/**
 * 🧹 WIPE CONFIGURATION
 * Resets the demo settings to factory defaults without affecting other app data.
 */
export const clearDemoConfig = () => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    // console.debug("[DemoPersistence] Config wiped.");
  } catch (err) {
    // Ignore
  }
};

/**
 * 🔍 DEBUG HELPER
 * Returns raw string for export/clipboard
 */
export const getRawDemoConfig = () => {
  if (typeof window === 'undefined') return "";
  return localStorage.getItem(STORAGE_KEY) || "";
};