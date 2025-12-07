// src/utils/avatarLocalStorage.js

/**
 * 💾 AVATAR PERSISTENCE MODULE
 * Handles the serialization and retrieval of Ranger Identity configurations.
 * Acts as the 'Black Box' recorder for the user's suit settings.
 */

const STORAGE_KEY = "ranger_avatar";

/**
 * Saves the current avatar configuration to local storage.
 * @param {Object} avatarConfig - The complete avatar state object
 */
export const saveAvatar = (avatarConfig) => {
  try {
    if (!avatarConfig) return;
    
    const serializedData = JSON.stringify(avatarConfig);
    localStorage.setItem(STORAGE_KEY, serializedData);
    
    // Optional: Log success in dev mode
    // console.log("Identity saved to Core Memory.");
  } catch (error) {
    console.error("Critical Failure: Unable to persist Avatar configuration.", error);
  }
};

/**
 * Retrieves the saved avatar configuration.
 * @returns {Object|null} The parsed configuration object, or null if not found/corrupt.
 */
export const loadAvatar = () => {
  try {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    
    if (!serializedData) {
      return null;
    }

    return JSON.parse(serializedData);
  } catch (error) {
    console.warn("Memory Corrupt: Resetting Avatar configuration to factory defaults.", error);
    // If data is corrupt, clear it to prevent recursive crashes
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

/**
 * Wipes the avatar configuration from storage.
 * Effectively performs a factory reset on the user's identity.
 */
export const clearAvatar = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    // Also clear legacy keys if they exist from previous versions
    localStorage.removeItem("ranger_avatar_name");
    localStorage.removeItem("ranger_avatar_color");
  } catch (error) {
    console.error("Failed to wipe Avatar memory.", error);
  }
};