// src/services/localPersistence.js

/**
 * 💾 RANGER PERSISTENCE LAYER (V3.0)
 * The device's "Black Box" Recorder.
 * * RESPONSIBILITIES:
 * 1. Offline Action Queuing (Store-and-Forward)
 * 2. Long-term Historical Archiving (Log Rotation)
 * 3. Session Restoration (State Rehydration)
 * 4. Corruption Recovery (Auto-healing)
 */

const PREFIX = "ranger_core_";

const KEYS = {
  // Core Identity
  AVATAR: `${PREFIX}avatar`,
  STREAK: `${PREFIX}streak`,
  SETTINGS: `${PREFIX}settings`,
  
  // State Snapshots
  TELEMETRY_SNAPSHOT: `${PREFIX}telemetry_snap`,
  
  // Offline Sync
  ACTION_QUEUE: `${PREFIX}action_queue`,
  
  // Historical Logs (Archives)
  LOGS_DOSE: `${PREFIX}logs_dose`,
  LOGS_BIO: `${PREFIX}logs_bio`,
  LOGS_ALERTS: `${PREFIX}logs_alerts`
};

const DEFAULTS = {
  STREAK: { count: 0, lastLogDate: null, maxStreak: 0 },
  SETTINGS: { soundEnabled: true, lowSpecMode: false, notifications: true },
  QUEUE: [],
  LOGS: []
};

// --- 🛠️ INTERNAL SYSTEM TOOLS ---

/**
 * Safely parses JSON with auto-healing for corrupt data.
 */
const safeGet = (key, fallback) => {
  if (typeof window === "undefined") return fallback;
  try {
    const item = localStorage.getItem(key);
    if (item === null) return fallback;
    if (item === "undefined" || item === "null") return fallback;
    return JSON.parse(item);
  } catch (e) {
    console.warn(`[Persistence] ⚠️ Data corruption detected in sector ${key}. Re-initializing.`);
    // Auto-heal by resetting this key
    localStorage.removeItem(key);
    return fallback;
  }
};

/**
 * Writes data with quota protection.
 */
const safeSet = (key, value) => {
  if (typeof window === "undefined") return;
  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
  } catch (e) {
    console.error(`[Persistence] 🚨 Storage Critical: Quota Exceeded for ${key}.`);
    // Advanced strategy: Could trigger a log cleanup here if needed
  }
};

/**
 * Appends an item to a log array with rotation (LIFO/FIFO constraints).
 * Keeps the database lean (Max 100 items per log).
 */
const appendToArchive = (key, item) => {
  const currentLogs = safeGet(key, []);
  // Add to top, slice to max 100
  const updatedLogs = [item, ...currentLogs].slice(0, 100);
  safeSet(key, updatedLogs);
};

// ==========================================
// 📡 1. NETWORK QUEUE (Offline Support)
// ==========================================

/**
 * Queues a tactical action for background synchronization.
 * @param {string} type - 'dose' | 'symptom' | 'alert_ack' | 'alert_resolve'
 * @param {object} payload - The data payload
 */
export const queueAction = (type, payload) => {
  const currentQueue = safeGet(KEYS.ACTION_QUEUE, DEFAULTS.QUEUE);
  
  const action = {
    _txId: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    type,
    payload,
    timestamp: new Date().toISOString(),
    status: "pending",
    retryCount: 0
  };

  // 1. Add to Sync Queue
  const newQueue = [...currentQueue, action];
  safeSet(KEYS.ACTION_QUEUE, newQueue);
  
  // 2. Write to Local Archive immediately (Optimistic UI support)
  if (type === 'dose') appendToArchive(KEYS.LOGS_DOSE, payload);
  if (type === 'symptom') appendToArchive(KEYS.LOGS_BIO, payload);
  // Alerts usually stored in state snapshot, but we can log resolution if needed

  return action;
};

/**
 * Get all pending items waiting for uplink.
 */
export const getPendingActions = () => {
  const queue = safeGet(KEYS.ACTION_QUEUE, DEFAULTS.QUEUE);
  return queue.filter(q => q.status === "pending");
};

/**
 * Clear the queue after successful sync.
 */
export const flushQueue = () => {
  safeSet(KEYS.ACTION_QUEUE, []);
  // console.debug("[Persistence] Uplink complete. Queue flushed.");
  return true;
};

// ==========================================
// 📜 2. HISTORICAL ARCHIVES (Read Access)
// ==========================================

export const loadDoseHistory = () => safeGet(KEYS.LOGS_DOSE, []);
export const loadSymptomHistory = () => safeGet(KEYS.LOGS_BIO, []);

// ==========================================
// 🛡️ 3. IDENTITY & PROGRESSION
// ==========================================

export const getStreak = () => safeGet(KEYS.STREAK, DEFAULTS.STREAK);

export const updateStreak = () => {
  const current = getStreak();
  const today = new Date().toDateString();
  
  // Idempotency check: Don't double count same day
  if (current.lastLogDate === today) return current;

  // Streak Calculation Logic
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const isConsecutive = current.lastLogDate === yesterday.toDateString();
  
  const newCount = isConsecutive ? current.count + 1 : 1;
  const newMax = Math.max(current.maxStreak || 0, newCount);

  const newData = { 
    count: newCount, 
    maxStreak: newMax,
    lastLogDate: today 
  };
  
  safeSet(KEYS.STREAK, newData);
  return newData;
};

// ==========================================
// 📊 4. STATE SNAPSHOTS (Session Resume)
// ==========================================

/**
 * Saves the entire dashboard state (Stability, Readiness, etc).
 */
export const saveTelemetry = (stateSnapshot) => {
  // Only save essential metrics to keep it light
  const packet = {
    stability: stateSnapshot.stability,
    readiness: stateSnapshot.readiness,
    riskScore: stateSnapshot.riskScore,
    confidence: stateSnapshot.confidence,
    _capturedAt: Date.now()
  };
  safeSet(KEYS.TELEMETRY_SNAPSHOT, packet);
};

export const loadTelemetry = () => safeGet(KEYS.TELEMETRY_SNAPSHOT, null);

// ==========================================
// ⚙️ 5. SYSTEM SETTINGS
// ==========================================

export const getSettings = () => safeGet(KEYS.SETTINGS, DEFAULTS.SETTINGS);

export const toggleSetting = (settingKey) => {
  const current = getSettings();
  const newData = { ...current, [settingKey]: !current[settingKey] };
  safeSet(KEYS.SETTINGS, newData);
  return newData;
};

// ==========================================
// 🧹 6. HARD RESET
// ==========================================

export const clearAllPersistence = () => {
  // Clear all items with our prefix
  Object.values(KEYS).forEach(k => localStorage.removeItem(k));
  
  // Dispatch event for UI reaction (e.g., Logout)
  window.dispatchEvent(new Event("storage-cleared"));
  console.log("[Persistence] System memory purged.");
};