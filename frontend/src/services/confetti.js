// src/services/confetti.js
import confetti from "canvas-confetti";

// 🎨 RANGER NEON PALETTE
// Cyan (#22d3ee), Blue (#3b82f6), White (#ffffff), Purple (#c084fc)
const colors = ["#22d3ee", "#3b82f6", "#ffffff", "#c084fc"];

/**
 * 💥 TRIGGER POP
 * Small, localized burst. Great for button clicks (e.g., logging a dose).
 * @param {number} x - Horizontal position (0 to 1). Default center (0.5).
 * @param {number} y - Vertical position (0 to 1). Default center (0.5).
 */
export const triggerPop = (x = 0.5, y = 0.5) => {
  confetti({
    particleCount: 40,
    spread: 50,
    origin: { x, y },
    colors: colors,
    disableForReducedMotion: true,
    zIndex: 9999, // Ensure it sits on top of modals
    gravity: 1.2, // Falls faster
    scalar: 0.8,  // Smaller "digital" particles
    ticks: 100    // Disappears faster
  });
};

/**
 * 🌟 TRIGGER BURST
 * A massive full-screen explosion. Great for "Level Up" or "Mission Complete".
 */
export const triggerBurst = () => {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    zIndex: 9999,
    colors: colors,
    gravity: 1.5,
  };

  function fire(particleRatio, opts) {
    confetti(
      Object.assign({}, defaults, opts, {
        particleCount: Math.floor(count * particleRatio),
      })
    );
  }

  // Fire 5 distinct volleys for a "Cluster Bomb" effect
  fire(0.25, { spread: 26, startVelocity: 55 });
  fire(0.2, { spread: 60 });
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
  fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
  fire(0.1, { spread: 120, startVelocity: 45 });
};

/**
 * 🏆 TRIGGER FIREWORKS
 * Continuous fountain of particles. Great for "100% Stability".
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
      colors: colors,
      zIndex: 9999,
    });
    
    // Right Cannon
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.8 },
      colors: colors,
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
  confetti.reset();
};