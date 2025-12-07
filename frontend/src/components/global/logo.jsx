// src/components/global/Logo.jsx
import React from 'react';

/**
 * High-fidelity Neon Logo.
 * - Scales perfectly with parent font-size or explicit w/h classes.
 * - Usage: <Logo className="h-14 text-cyan-400" subtitle />
 */
export default function Logo({ className = '', subtitle = false }) {
  return (
    <div 
      className={`flex items-center gap-3 select-none group ${className}`}
      aria-label="Ranger Med-Core Logo"
    >
      <div className="relative flex items-center justify-center">
        {/* Ambient Background Glow */}
        <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          // We use 'current' dimensions to let parent className control size
          // Default to h-14 (56px) if no size is passed
          className="h-14 w-auto drop-shadow-[0_0_10px_rgba(34,211,238,0.3)] transition-all duration-500 ease-out group-hover:drop-shadow-[0_0_15px_rgba(34,211,238,0.6)]"
        >
          <defs>
            <linearGradient id="neon-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22d3ee" />   {/* cyan-400 */}
              <stop offset="100%" stopColor="#0ea5e9" /> {/* sky-500 */}
            </linearGradient>
            
            <linearGradient id="accent-grad" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#bef264" />   {/* lime-300 */}
              <stop offset="100%" stopColor="#86efac" /> {/* green-300 */}
            </linearGradient>
          </defs>

          {/* Outer HUD Ring (Broken Circle) */}
          <circle 
            cx="32" cy="32" r="28" 
            stroke="url(#neon-grad)" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            className="opacity-20"
          />
          <path
            d="M32 4 A 28 28 0 0 1 56 18" // Top Right segment
            stroke="url(#neon-grad)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M32 60 A 28 28 0 0 1 8 46" // Bottom Left segment
            stroke="url(#neon-grad)"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Medical Cross / Data Core Construction */}
          <g transform="translate(32 32)">
             {/* Center Square */}
            <rect x="-6" y="-6" width="12" height="12" rx="3" fill="url(#neon-grad)" fillOpacity="0.2" stroke="#22d3ee" strokeWidth="1.5" />
            
            {/* Horizontal Nodes */}
            <rect x="-16" y="-3" width="8" height="6" rx="1" fill="#22d3ee" className="group-hover:translate-x-[-2px] transition-transform duration-500" />
            <rect x="8" y="-3" width="8" height="6" rx="1" fill="#22d3ee" className="group-hover:translate-x-[2px] transition-transform duration-500" />
            
            {/* Vertical Accent (The "Life" Line) */}
            <rect x="-2" y="-18" width="4" height="10" rx="2" fill="url(#accent-grad)" />
            <rect x="-2" y="8" width="4" height="10" rx="2" fill="url(#accent-grad)" />
          </g>
          
          {/* Decorative blip */}
          <circle cx="50" cy="14" r="2" fill="#bef264" className="animate-pulse" />
        </svg>
      </div>

      <div className="flex flex-col leading-none justify-center">
        <span className="text-white font-black tracking-[0.15em] text-xl drop-shadow-md">
          RANGER
        </span>
        {subtitle && (
          <div className="flex items-center gap-1.5 mt-1">
            <span className="h-[1px] w-3 bg-cyan-500/50"></span>
            <span className="text-[0.65rem] font-bold font-mono text-cyan-300 tracking-widest uppercase opacity-80">
              MED-CORE
            </span>
            <span className="h-[1px] w-8 bg-gradient-to-r from-cyan-500/50 to-transparent"></span>
          </div>
        )}
      </div>
    </div>
  );
}