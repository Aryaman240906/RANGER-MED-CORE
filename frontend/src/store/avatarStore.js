// src/store/avatarStore.js
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { saveAvatar, loadAvatar, clearAvatar } from '../utils/avatarLocalStorage';

// ------------------------------------------------------------------
// 🛡️ RANGER COMMAND: DEFAULT CONFIGURATION
// ------------------------------------------------------------------
const DEFAULT_AVATAR_CONFIG = {
  suitColor: "#22d3ee",       // Default 'Cyan'
  emblem: "falcon",           // Default insignia
  aura: "pulse",              // 'pulse' | 'glow' | 'ring'
  glowStrength: 0.75,         // float 0.0 - 1.0
  silhouette: "male",         // 'male' | 'female'
};

/**
 * ⚡ MORPHIN GRID STATE MANAGER
 * Handles the logic for the Hologram Builder, including:
 * 1. Draft State (Real-time hologram updates)
 * 2. Applied State (The actual user profile)
 * 3. Persistence (LocalStorage sync)
 */
export const useAvatarStore = create(
  devtools((set, get) => ({

    // --- 1. STATE VARIABLES ---
    
    // The "Live" configuration used throughout the app (Header, Profile, etc.)
    appliedAvatar: { ...DEFAULT_AVATAR_CONFIG },

    // The "Draft" configuration used ONLY inside the Hologram Builder Modal
    suitColor: DEFAULT_AVATAR_CONFIG.suitColor,
    emblem: DEFAULT_AVATAR_CONFIG.emblem,
    aura: DEFAULT_AVATAR_CONFIG.aura,
    glowStrength: DEFAULT_AVATAR_CONFIG.glowStrength,
    silhouette: DEFAULT_AVATAR_CONFIG.silhouette,

    // UI State for the builder
    hasUnsavedChanges: false,

    // --- 2. SETTERS (DRAFT MODIFICATION) ---
    // These update the Hologram in real-time without affecting the actual profile

    setSuitColor: (color) => set({ suitColor: color, hasUnsavedChanges: true }),
    
    setEmblem: (emblemKey) => set({ emblem: emblemKey, hasUnsavedChanges: true }),
    
    setAura: (auraType) => set({ aura: auraType, hasUnsavedChanges: true }),
    
    setGlowStrength: (value) => set({ glowStrength: value, hasUnsavedChanges: true }),
    
    setSilhouette: (type) => set({ silhouette: type, hasUnsavedChanges: true }),

    // --- 3. CORE ACTIONS ---

    /**
     * loadFromStorage()
     * Called on App Mount. Retreives data from File 12 (avatarLocalStorage).
     * Hydrates both the Applied and Draft states.
     */
    loadFromStorage: () => {
      const savedData = loadAvatar();
      
      if (savedData) {
        // Merge saved data with defaults to ensure structural integrity
        const mergedData = { ...DEFAULT_AVATAR_CONFIG, ...savedData };
        set({
          appliedAvatar: mergedData,
          ...mergedData, // Sync draft to match saved
          hasUnsavedChanges: false
        });
      }
    },

    /**
     * applyAvatar()
     * Called when user clicks "INITIALIZE SUIT" (Save).
     * Commits the Draft state to the Applied state and persists to storage.
     */
    applyAvatar: () => {
      const { suitColor, emblem, aura, glowStrength, silhouette } = get();
      
      const newConfig = {
        suitColor,
        emblem,
        aura,
        glowStrength,
        silhouette
      };

      // 1. Update Live State
      set({ 
        appliedAvatar: newConfig,
        hasUnsavedChanges: false 
      });

      // 2. Persist to LocalStorage (File 12)
      saveAvatar(newConfig);
    },

    /**
     * resetAvatar()
     * Called when user clicks "FACTORY RESET".
     * Reverts Draft to the absolute defaults.
     */
    resetAvatar: () => {
      set({
        ...DEFAULT_AVATAR_CONFIG,
        hasUnsavedChanges: true
      });
      clearAvatar(); // Optional: clears storage depending on UX preference
    },

    /**
     * cancelChanges()
     * Called when user closes modal without saving.
     * Reverts Draft state back to the last Applied state.
     */
    cancelChanges: () => {
      const { appliedAvatar } = get();
      set({
        ...appliedAvatar,
        hasUnsavedChanges: false
      });
    },

    /**
     * loadPreset()
     * Helper to bulk-update the draft from File 11 (avatarPresets).
     */
    loadPreset: (presetConfig) => {
      set({
        ...DEFAULT_AVATAR_CONFIG, // Safety reset first
        ...presetConfig,
        hasUnsavedChanges: true
      });
    }

  }))
);