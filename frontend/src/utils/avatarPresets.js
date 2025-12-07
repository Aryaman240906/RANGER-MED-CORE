// src/utils/avatarPresets.js

/**
 * ⚡ RANGER IDENTITY PRESETS
 * Predefined configurations for instant "Morphin" transformations.
 * Used by the Quick Access buttons in the Avatar Controls.
 */

export const AVATAR_PRESETS = {
  
  // 🔴 TYRANNOSAURUS (Leader)
  redRanger: {
    suitColor: "#ef4444", // Red-500
    emblem: "falcon",     // Shield/Falcon Icon
    aura: "glow",         // High intensity core glow
    glowStrength: 0.9,    // Maximum power output
    silhouette: "male"
  },

  // 🔵 TRICERATOPS (Intel)
  blueRanger: {
    suitColor: "#3b82f6", // Blue-500
    emblem: "wolf",       // Crosshair/Wolf Icon
    aura: "ring",         // Orbital defense rings
    glowStrength: 0.7,    // Balanced power
    silhouette: "male"
  },

  // 🟢 DRAGON (Stealth)
  greenRanger: {
    suitColor: "#22c55e", // Green-500
    emblem: "dino",       // Skull/Dino Icon
    aura: "pulse",        // Rhythmic breathing effect
    glowStrength: 0.8,
    silhouette: "male"
  },

  // 🟡 SABERTOOTH (Agility)
  yellowRanger: {
    suitColor: "#eab308", // Yellow-500
    emblem: "thunder",    // Zap/Thunder Icon
    aura: "pulse",
    glowStrength: 0.75,
    silhouette: "female"
  },

  // 🌸 PTERODACTYL (Aerial)
  pinkRanger: {
    suitColor: "#ec4899", // Pink-500
    emblem: "phoenix",    // Flame/Phoenix Icon
    aura: "ring",         // Defensive field
    glowStrength: 0.85,
    silhouette: "female"
  },

  // ⚪ WHITE TIGER (Legendary)
  whiteRanger: {
    suitColor: "#f8fafc", // Slate-50 = White
    emblem: "samurai",    // Activity/Samurai Icon
    aura: "glow",
    glowStrength: 1.0,    // Blinding light
    silhouette: "male"
  },

  // ⚫ MAMMOTH (Heavy)
  blackRanger: {
    suitColor: "#000000", // Pure Black
    emblem: "wolf",
    aura: "glow",
    glowStrength: 0.6,    // Stealth mode (low glow)
    silhouette: "male"
  }
};