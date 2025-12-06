import React, { useEffect, useRef } from 'react';

/**
 * ConfettiBurst
 * Small, dependency-free confetti burst using canvas.
 * Trigger by changing the `trigger` prop value.
 * 
 * Usage:
 *   const [confettiKey, setConfettiKey] = useState(0);
 *   <ConfettiBurst trigger={confettiKey} />
 *   // To trigger: setConfettiKey(k => k + 1)
 */
export default function ConfettiBurst({ trigger = 0 }) {
  const canvasRef = useRef();

  useEffect(() => {
    if (trigger === 0) return; // Don't burst on initial render
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const w = (canvas.width = window.innerWidth);
    const h = (canvas.height = window.innerHeight);
    const colors = ['#06b6d4', '#22d3ee', '#7c3aed', '#60a5fa', '#f97316', '#10b981', '#f43f5e'];

    const pieces = Array.from({ length: 100 }).map(() => ({
      x: w / 2 + (Math.random() - 0.5) * 200,
      y: h / 2 + (Math.random() - 0.5) * 100,
      vx: -8 + Math.random() * 16,
      vy: -12 + Math.random() * 8,
      size: 4 + Math.random() * 10,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: -0.2 + Math.random() * 0.4,
      ttl: 120 + Math.random() * 60,
      alpha: 1
    }));

    let raf;
    function step() {
      ctx.clearRect(0, 0, w, h);
      
      let anyAlive = false;
      pieces.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.25; // gravity
        p.vx *= 0.99; // air resistance
        p.rotation += p.rotationSpeed;
        p.ttl--;
        
        // Fade out in last 30 frames
        if (p.ttl < 30) {
          p.alpha = p.ttl / 30;
        }
        
        if (p.ttl > 0) {
          anyAlive = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
          ctx.restore();
        }
      });
      
      if (anyAlive) {
        raf = requestAnimationFrame(step);
      } else {
        ctx.clearRect(0, 0, w, h);
      }
    }

    step();

    return () => {
      if (raf) {
        cancelAnimationFrame(raf);
      }
      ctx.clearRect(0, 0, w, h);
    };
  }, [trigger]);

  return (
    <canvas 
      ref={canvasRef} 
      className="pointer-events-none fixed inset-0 z-50" 
      style={{ mixBlendMode: 'screen' }}
    />
  );
}