// src/services/localPersistence.js

/**
 * 💾 RANGER PERSISTENCE LAYER
 * Centralized wrapper for localStorage to handle User Preferences & Offline State.
 * Prevents JSON parse errors and ensures data consistency.
 */

const KEYS = {
  AVATAR: "ranger_avatar",
  STREAK: "ranger_streak",
  LAST_STATE: "ranger_last_telemetry",
  SETTINGS: "ranger_settings"
};

const DEFAULTS = {
  AVATAR: { colorId: "cyan", emblemId: "shield" },
  STREAK: { count: 0, lastLogDate: null },
  SETTINGS: { soundEnabled: true, lowSpecMode: false }
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
    console.error(`[Persistence] Storage quota exceeded or disabled.`);
  }
};

// --- 📦 PUBLIC API ---

export const LocalStorage = {
  
  // 1. 🛡️ AVATAR & IDENTITY
  getAvatar: () => safeGet(KEYS.AVATAR, DEFAULTS.AVATAR),
  
  saveAvatar: (colorId, emblemId) => {
    const data = { colorId, emblemId };
    safeSet(KEYS.AVATAR, data);
    // Dispatch event for UI reactivity (Header, AvatarBuilder)
    window.dispatchEvent(new Event("avatar-updated")); 
    return data;
  },

  // 2. 🔥 STREAKS & GAMIFICATION
  getStreak: () => safeGet(KEYS.STREAK, DEFAULTS.STREAK),
  
  updateStreak: () => {
    const current = safeGet(KEYS.STREAK, DEFAULTS.STREAK);
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
  },

  // 3. 📡 DASHBOARD STATE (For restoring session after refresh)
  getLastTelemetry: () => safeGet(KEYS.LAST_STATE, null),
  
  saveTelemetry: (stability, readiness) => {
    safeSet(KEYS.LAST_STATE, { 
      stability, 
      readiness, 
      timestamp: Date.now() 
    });
  },

  // 4. ⚙️ APP SETTINGS
  getSettings: () => safeGet(KEYS.SETTINGS, DEFAULTS.SETTINGS),
  
  toggleSetting: (settingKey) => {
    const current = safeGet(KEYS.SETTINGS, DEFAULTS.SETTINGS);
    const newData = { ...current, [settingKey]: !current[settingKey] };
    safeSet(KEYS.SETTINGS, newData);
    return newData;
  },

  // 5. 🧹 RESET
  clearAll: () => {
    Object.values(KEYS).forEach(k => localStorage.removeItem(k));
    window.dispatchEvent(new Event("storage-cleared"));
  }
};