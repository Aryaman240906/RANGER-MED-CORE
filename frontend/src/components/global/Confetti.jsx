// src/components/global/Confetti.jsx
import { useEffect, useRef } from "react";
import { useDemoStore } from "../../store/demoStore";
import toast from "react-hot-toast";
import confetti from "canvas-confetti";

/**
 * RANGER MED-CORE CONFETTI CONTROLLER
 * Advanced particle physics tuned for a "Digital/Tactical" feel.
 */

// 1. Defined Palette: Neons + Pure White for high contrast
const TACTICAL_PALETTE = [
  "#22d3ee", // Cyan Bright (Tech)
  "#0ea5e9", // Sky Blue (Data)
  "#d946ef", // Magenta (Accent)
  "#10b981", // Emerald (Success)
  "#ffffff"  // Pure White (Cleanliness/Medical)
];

export default function ConfettiListener() {
  // --- STORE SUBSCRIPTION ---
  const stability = useDemoStore((s) => s.stability);
  const events = useDemoStore((s) => s.events);
  
  // Track event IDs to prevent duplicate blasts on re-renders
  const lastEventIdRef = useRef(null);

  // --- PHYSICS ENGINES ---

  /**
   * Effect 1: "Data Burst"
   * Fast, snappy, directional. Used for standard success events.
   */
  const triggerDataBurst = () => {
    const count = 150;
    const defaults = {
      origin: { y: 0.8 }, // Bottom center
      colors: TACTICAL_PALETTE,
      disableForReducedMotion: true,
      zIndex: 9999, // Above all UI
    };

    // Fire two distinct shapes for texture
    confetti({
      ...defaults,
      particleCount: count / 2,
      spread: 60,
      startVelocity: 45,
      scalar: 1.2,
      shapes: ['circle'],
      decay: 0.9, // Fast decay = "Snappy" tech feel
    });

    confetti({
      ...defaults,
      particleCount: count / 2,
      spread: 100,
      startVelocity: 35,
      scalar: 0.8,
      shapes: ['square'], // Squares look like "pixels"
      gravity: 1.2,
    });
  };

  /**
   * Effect 2: "System Overdrive"
   * Sustained, wide-spread fireworks. Used for 100% Stability.
   */
  const triggerSystemOverdrive = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    (function frame() {
      // Launch dual emitters from sides
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 }, // Left corner
        colors: TACTICAL_PALETTE,
        zIndex: 9999,
      });
      
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 }, // Right corner
        colors: TACTICAL_PALETTE,
        zIndex: 9999,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  // --- LOGIC TRIGGERS ---

  // 1. Milestone Trigger (100% Stability)
  useEffect(() => {
    if (stability === 100) {
      triggerSystemOverdrive();
      
      // Custom Styled Toast
      toast("SYSTEM OPTIMAL", {
        icon: "🛡️",
        style: {
          border: "1px solid #10b981", // Emerald border
          padding: "16px",
          background: "rgba(6, 78, 59, 0.9)", // Emerald dark bg
          color: "#fff",
          backdropFilter: "blur(12px)",
          boxShadow: "0 0 30px rgba(16, 185, 129, 0.4)",
          fontFamily: "monospace",
          letterSpacing: "0.1em",
          fontWeight: "bold"
        },
      });
    }
  }, [stability]);

  // 2. Event Stream Trigger (Timeline Updates)
  useEffect(() => {
    if (events.length > 0) {
      const latest = events[0];

      // Deduplication check
      if (latest.id === lastEventIdRef.current) return;
      lastEventIdRef.current = latest.id;

      // Only fire on explicit 'success' type events
      if (latest.type === "success") {
        triggerDataBurst();
      }
    }
  }, [events]);

  // Invisible Logic Component
  return null;
}