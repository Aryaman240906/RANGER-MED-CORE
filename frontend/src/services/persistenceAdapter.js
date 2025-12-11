// src/services/persistenceAdapter.js

/**
 * 💾 RANGER PERSISTENCE ADAPTER (V2.0)
 * Low-level storage interface for the Central Data Store.
 * Features: Debounced writes, corruption handling, and schema versioning.
 */

const STORAGE_KEY = "ranger_core_data_v1";
let saveTimeout = null;

// --- UTILS ---

/**
 * Robust JSON parser that won't crash the app on bad data.
 */
const safeParse = (str, fallback) => {
  try {
    return str ? JSON.parse(str) : fallback;
  } catch (e) {
    console.warn("⚠️ [PERSISTENCE] Data corruption detected. Resetting to fallback.");
    return fallback;
  }
};

// --- API ---

export const persistenceAdapter = {
  
  /**
   * 📥 Load
   * Retrieves the full state snapshot on boot.
   */
  loadSnapshot: async () => {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(STORAGE_KEY);
    return safeParse(raw, null);
  },

  /**
   * 📤 Save (Instant)
   * Writes state immediately. Use sparingly (e.g., critical user setting change).
   */
  saveSnapshot: (state) => {
    if (typeof window === "undefined") return;
    try {
      const serialized = JSON.stringify(state);
      localStorage.setItem(STORAGE_KEY, serialized);
    } catch (e) {
      console.error("🚨 [PERSISTENCE] Storage quota exceeded.", e);
    }
  },

  /**
   * ⏳ Save (Debounced)
   * The preferred method. Bundles rapid changes (like slider drags) into one write.
   * Wait time: 1000ms.
   */
  saveDebounced: (state) => {
    if (saveTimeout) clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
      persistenceAdapter.saveSnapshot(state);
      // console.debug("💾 [PERSISTENCE] Snapshot saved.");
    }, 1000);
  },

  /**
   * 🧹 Wipe
   * Factory reset.
   */
  clear: () => {
    localStorage.removeItem(STORAGE_KEY);
    console.log("💥 [PERSISTENCE] Hard reset complete.");
  }
};