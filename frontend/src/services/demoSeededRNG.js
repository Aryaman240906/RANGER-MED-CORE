// src/services/demoSeededRNG.js

/**
 * 🎲 TACTICAL RNG ENGINE (Mulberry32)
 * A deterministic Pseudo-Random Number Generator.
 * * DESIGN PHILOSOPHY:
 * - Reproducibility: Given Seed X, the simulation MUST play out exactly the same way every time.
 * - Performance: Uses bitwise operations for zero-latency generation during 60fps renders.
 * - Utility: specialized methods for UI simulation (wobble, pick, chance).
 */

export function createRNG(initialSeed = Date.now()) {
  // Internal state (32-bit integer)
  let state = initialSeed >>> 0;

  /**
   * ⚙️ CORE ALGORITHM: Mulberry32
   * Generates a 32-bit random integer, normalized to [0, 1).
   * This is the heartbeat of the physics engine.
   */
  const next = () => {
    state += 0x6D2B79F5;
    let t = state;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };

  return {
    /**
     * @returns {number} Float between 0 (inclusive) and 1 (exclusive).
     */
    random: () => next(),

    /**
     * Returns a random float between min and max.
     * @param {number} min 
     * @param {number} max 
     */
    float: (min, max) => next() * (max - min) + min,

    /**
     * Returns a random integer between min and max (inclusive).
     * @param {number} min 
     * @param {number} max 
     */
    int: (min, max) => Math.floor(next() * (max - min + 1)) + min,

    /**
     * Returns true or false based on probability.
     * @param {number} percentage 0-100 (e.g., 25 for 25% chance)
     */
    chance: (percentage) => next() * 100 < percentage,

    /**
     * Picks a random item from an array.
     * @param {Array} array 
     */
    pick: (array) => {
      if (!array || array.length === 0) return null;
      return array[Math.floor(next() * array.length)];
    },

    /**
     * Shuffles an array in place using Fisher-Yates algorithm.
     * Useful for randomizing event order without bias.
     * @param {Array} array 
     */
    shuffle: (array) => {
      const arr = [...array]; // Copy to avoid mutation
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(next() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    },

    /**
     * Adds organic "jitter" to a value.
     * Useful for making graphs look like real biological data.
     * @param {number} value The baseline value
     * @param {number} intensity Max deviation (e.g., 5 means +/- 5)
     */
    wobble: (value, intensity) => {
      const noise = (next() - 0.5) * 2 * intensity;
      return value + noise;
    },

    /**
     * Generates a deterministic UUID-like string.
     * Essential for React keys in lists during simulation replay.
     */
    uuid: () => {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = next() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    },

    /**
     * Returns the current seed (for debug/export).
     */
    getSeed: () => initialSeed
  };
}