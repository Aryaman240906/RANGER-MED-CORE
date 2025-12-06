// src/components/ranger/ConfettiBurst.jsx
import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';

const ConfettiBurst = () => {
  useEffect(() => {
    // First burst
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#22d3ee', '#3b82f6', '#06b6d4', '#0ea5e9', '#14b8a6']
    });

    // Second burst with delay
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#22d3ee', '#3b82f6', '#06b6d4']
      });
    }, 200);

    // Third burst with delay
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#22d3ee', '#3b82f6', '#06b6d4']
      });
    }, 400);

    // Cleanup function
    return () => {
      // Canvas confetti automatically cleans up
    };
  }, []);

  return null; // This component doesn't render anything visible
};

export default ConfettiBurst;