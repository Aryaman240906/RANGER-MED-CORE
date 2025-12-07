// src/services/localPersistence.js

/**
 * 💾 RANGER PERSISTENCE LAYER (v2.0)
 * The device's "Black Box". Handles offline action queuing, settings, 
 * and session restoration.
 */

const KEYS = {
  // Core Data
  AVATAR: "ranger_avatar",
  STREAK: "ranger_streak",
  TELEMETRY: "ranger_telemetry",
  SETTINGS: "ranger_settings",
  
  // Tactical Queue (Offline Actions)
  ACTION_QUEUE: "ranger_action_queue",
  
  // Log Archives (Local History)
  DOSE_LOGS: "ranger_logs_dose",
  BIO_LOGS: "ranger_logs_bio"
};

const DEFAULTS = {
  STREAK: { count: 0, lastLogDate: null },
  SETTINGS: { soundEnabled: true, lowSpecMode: false },
  QUEUE: []
};

// --- 🛠️ INTERNAL HELPERS ---

const safeGet = (key, fallback) => {
  if (typeof window === "undefined") return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.warn(`[Persistence] Corrupt data for ${key}, resetting.`);
    return fallback;
  }
};

const safeSet = (key, value) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`[Persistence] Storage quota exceeded.`);
  }
};

// ==========================================
// 📡 1. SYNC & ACTION QUEUE (The "Network" Layer)
// ==========================================

/**
 * Queues a user action (Dose, Log, Ack) for background processing.
 * Used by the UI when performing any state change.
 * @param {string} type - 'dose' | 'symptom' | 'alert_ack'
 * @param {object} payload - The data associated with the action
 */
export const queueAction = (type, payload) => {
  const currentQueue = safeGet(KEYS.ACTION_QUEUE, DEFAULTS.QUEUE);
  
  const action = {
    id: payload.id || `act_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type,
    payload,
    timestamp: new Date().toISOString(),
    status: "pending" // pending | synced | failed
  };

  const newQueue = [action, ...currentQueue];
  safeSet(KEYS.ACTION_QUEUE, newQueue);
  
  // Also save to specific local logs for instant history retrieval
  if (type === 'dose') appendToLog(KEYS.DOSE_LOGS, payload);
  if (type === 'symptom') appendToLog(KEYS.BIO_LOGS, payload);

  return action;
};

/**
 * Retrieves all pending actions.
 * Used by the Background Worker to "flush" data to the server (or sim engine).
 */
export const getPendingActions = () => {
  const queue = safeGet(KEYS.ACTION_QUEUE, DEFAULTS.QUEUE);
  return queue.filter(q => q.status === "pending");
};

/**
 * Clears the queue (e.g., after successful sync).
 */
export const flushQueue = () => {
  safeSet(KEYS.ACTION_QUEUE, []);
  return true;
};

// Helper for local history archives
const appendToLog = (key, item) => {
  const logs = safeGet(key, []);
  // Keep last 50 items locally
  const updated = [item, ...logs].slice(0, 50);
  safeSet(key, updated);
};

// ==========================================
// 🛡️ 2. IDENTITY & GAMIFICATION
// ==========================================

export const getStreak = () => safeGet(KEYS.STREAK, DEFAULTS.STREAK);

export const updateStreak = () => {
  const current = getStreak();
  const today = new Date().toDateString();
  
  // If already logged today, do nothing
  if (current.lastLogDate === today) return current;

  // Check if yesterday was logged to increment, else reset
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  let newCount = 1;
  if (current.lastLogDate === yesterday.toDateString()) {
    newCount = current.count + 1;
  }

  const newData = { count: newCount, lastLogDate: today };
  safeSet(KEYS.STREAK, newData);
  return newData;
};

// ==========================================
// 📊 3. DASHBOARD STATE RESTORATION
// ==========================================

export const saveTelemetry = (stateSnapshot) => {
  safeSet(KEYS.TELEMETRY, {
    ...stateSnapshot,
    _savedAt: Date.now()
  });
};

export const loadTelemetry = () => safeGet(KEYS.TELEMETRY, null);

// ==========================================
// ⚙️ 4. APP SETTINGS
// ==========================================

export const getSettings = () => safeGet(KEYS.SETTINGS, DEFAULTS.SETTINGS);

export const toggleSetting = (settingKey) => {
  const current = getSettings();
  const newData = { ...current, [settingKey]: !current[settingKey] };
  safeSet(KEYS.SETTINGS, newData);
  return newData;
};

// ==========================================
// 🧹 5. SYSTEM UTILS
// ==========================================

export const clearAllPersistence = () => {
  Object.values(KEYS).forEach(k => localStorage.removeItem(k));
  // Dispatch event so UI components can react (e.g., logout)
  window.dispatchEvent(new Event("storage-cleared"));
};