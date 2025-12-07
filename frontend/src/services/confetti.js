// src/services/confetti.js
import confetti from "canvas-confetti";

// 🎨 RANGER TACTICAL PALETTE
// Merged Cyan, Blue, White with the Emerald/Magenta accents
const TACTICAL_PALETTE = [
  "#22d3ee", // Cyan Bright (Tech)
  "#0ea5e9", // Sky Blue (Core)
  "#d946ef", // Magenta (Warning/Accent)
  "#10b981", // Emerald (Success)
  "#ffffff"  // Pure White (Medical/Clean)
];

// --- HELPER UTILS ---
const randomInRange = (min, max) => Math.random() * (max - min) + min;

/**
 * ⚡ TRIGGER POP (General Interaction)
 * Small, localized burst. Great for button clicks (e.g., logging a dose).
 * @param {number} x - Horizontal position (0 to 1). Default center (0.5).
 * @param {number} y - Vertical position (0 to 1). Default center (0.5).
 */
export const triggerPop = (x = 0.5, y = 0.5) => {
  const count = 40;
  const defaults = {
    origin: { x, y },
    colors: TACTICAL_PALETTE,
    disableForReducedMotion: true,
    gravity: 1.5, // Heavy gravity = mechanical feel
    scalar: 0.8,
    ticks: 80,    // Disappears quickly
    zIndex: 9999,
  };

  // Mix shapes for texture
  confetti({
    ...defaults,
    particleCount: count / 2,
    spread: 40,
    shapes: ['circle']
  });
  
  confetti({
    ...defaults,
    particleCount: count / 2,
    spread: 60,
    shapes: ['square'], // "Data" bits
    scalar: 0.6
  });
};

/**
 * 💠 TRIGGER SPARK (UI Feedback)
 * Tiny, monochromatic cyan burst. Perfect for toggles or small "check" actions.
 * @param {number} x - Horizontal position
 * @param {number} y - Vertical position
 */
export const smallSpark = (x = 0.5, y = 0.5) => {
  confetti({
    particleCount: 25,
    spread: 30,
    startVelocity: 25,
    origin: { x, y },
    colors: ["#22d3ee"], // Strict Cyan
    shapes: ['square'], // Digital pixels
    scalar: 0.5,
    gravity: 2,
    ticks: 40, // Very short life
    zIndex: 9999
  });
};

/**
 * 🌟 TRIGGER BURST (Mission Complete)
 * A massive full-screen explosion with complex physics.
 * Combines the "Cluster Bomb" logic with the high-velocity settings.
 */
export const triggerBurst = () => {
  const count = 250;
  const defaults = {
    origin: { y: 0.7 }, // Shoot from lower-mid
    zIndex: 9999,
    colors: TACTICAL_PALETTE,
  };

  function fire(particleRatio, opts) {
    confetti(
      Object.assign({}, defaults, opts, {
        particleCount: Math.floor(count * particleRatio),
      })
    );
  }

  // Volley 1: The Fast Core (High velocity)
  fire(0.25, {
    spread: 26,
    startVelocity: 65, // Faster than before
    shapes: ['square'],
    scalar: 1.2
  });

  // Volley 2: Wide Spread
  fire(0.2, {
    spread: 60,
    startVelocity: 50,
  });

  // Volley 3: Heavy Fallout (Dust)
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8
  });

  // Volley 4: The "Floaters" (Long lasting)
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
    shapes: ['circle']
  });

  // Volley 5: Wide lateral shot
  fire(0.1, {
    spread: 130,
    startVelocity: 45,
    decay: 0.91
  });
};

/**
 * 🏆 TRIGGER FIREWORKS (100% Stability)
 * Continuous dual-cannon fountain.
 * @param {number} duration - How long to run in ms (default 3000ms)
 */
export const triggerFireworks = (duration = 3000) => {
  const end = Date.now() + duration;

  (function frame() {
    // Left Cannon
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.8 },
      colors: TACTICAL_PALETTE,
      shapes: ['square'], // Digital confetti
      zIndex: 9999,
    });
    
    // Right Cannon
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.8 },
      colors: TACTICAL_PALETTE,
      shapes: ['circle'],
      zIndex: 9999,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
};

/**
 * 🧹 RESET
 * Clears any active confetti immediately.
 */
export const resetConfetti = () => {
  try {
    confetti.reset();
  } catch (e) {
    console.warn("Confetti reset failed", e);
  }
};