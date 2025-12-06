// src/components/ranger/Hologram3DGauge.jsx
import React, { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, Torus, Sphere } from "@react-three/drei";
import * as THREE from "three";

/**
 * 🎨 Dynamic Color Logic
 * Returns a Three.js Color object based on stability percentage.
 */
const getStatusColor = (value) => {
  if (value > 70) return new THREE.Color("#22d3ee"); // Cyan (Stable)
  if (value > 40) return new THREE.Color("#facc15"); // Amber (Warning)
  return new THREE.Color("#ef4444"); // Red (Critical)
};

/**
 * 💍 Atomic Ring Component
 * A single rotating ring that reacts to stability speed.
 */
const AtomicRing = ({ radius, speed, axis, stability }) => {
  const meshRef = useRef();
  
  // ⚡ CHAOS FACTOR:
  // Stability 100 = 1x speed (Calm)
  // Stability 0   = 5x speed (Chaotic)
  const rotationFactor = 1 + (100 - stability) / 20;

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    // Rotate around the provided axis
    meshRef.current.rotation.x += delta * speed * rotationFactor * axis[0];
    meshRef.current.rotation.y += delta * speed * rotationFactor * axis[1];
    meshRef.current.rotation.z += delta * speed * rotationFactor * axis[2];
  });

  const color = useMemo(() => getStatusColor(stability), [stability]);

  return (
    <Torus ref={meshRef} args={[radius, 0.06, 16, 100]}>
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={2} // Intense Neon Glow
        transparent
        opacity={0.6}
        roughness={0.1}
        metalness={0.8}
        wireframe={false}
      />
    </Torus>
  );
};

/**
 * ⚛️ Central Core Component
 * The pulsing orb in the center.
 */
const CoreOrb = ({ stability }) => {
  const meshRef = useRef();
  const color = useMemo(() => getStatusColor(stability), [stability]);

  useFrame((state) => {
    // Pulse effect: Breathing animation
    const t = state.clock.getElapsedTime();
    // Pulse faster if unstable
    const pulseSpeed = stability < 50 ? 8 : 3; 
    const scale = 1 + Math.sin(t * pulseSpeed) * 0.1;
    
    if (meshRef.current) {
      meshRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <Sphere ref={meshRef} args={[0.7, 32, 32]}>
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={3} // Very bright core
        transparent
        opacity={0.9}
        roughness={0}
        metalness={0.5}
      />
    </Sphere>
  );
};

/**
 * 🌌 Main Scene Layout
 */
const HologramScene = ({ stability }) => {
  // Get color for text
  const colorHex = getStatusColor(stability).getStyle();

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      
      {/* 3 Nested Rings spinning on different axes */}
      <AtomicRing radius={2.8} speed={0.4} axis={[1, 0.5, 0]} stability={stability} />
      <AtomicRing radius={2.0} speed={0.6} axis={[0, 1, 0.5]} stability={stability} />
      <AtomicRing radius={1.4} speed={0.8} axis={[0.5, 0, 1]} stability={stability} />
      
      {/* Center Core */}
      <CoreOrb stability={stability} />

      {/* Floating HTML Label */}
      <Html position={[0, -3.5, 0]} center zIndexRange={[100, 0]}>
        <div className="flex flex-col items-center pointer-events-none select-none">
          <div 
            className="text-2xl font-bold font-mono tracking-widest drop-shadow-[0_0_8px_rgba(0,0,0,0.8)]" 
            style={{ color: colorHex }}
          >
            {Math.round(stability)}%
          </div>
          <div className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold mt-1">
            CORE SYNC
          </div>
        </div>
      </Html>
    </>
  );
};

/**
 * 📦 Default Export
 */
export default function Hologram3DGauge({ stability = 100, value }) {
  // Handle prop mismatch: Component might receive 'value' or 'stability'
  const finalValue = stability !== undefined ? stability : (value || 100);

  return (
    <div className="w-full h-full min-h-[250px] relative rounded-xl overflow-hidden bg-slate-900/40 border border-slate-800/50 backdrop-blur-md shadow-inner">
      
      {/* 🌌 BACKGROUND EFFECTS */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.05),transparent_70%)] pointer-events-none" />
      
      {/* Grid Overlay for "Scanner" look */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none" 
        style={{ 
          backgroundImage: 'linear-gradient(#22d3ee 1px, transparent 1px), linear-gradient(90deg, #22d3ee 1px, transparent 1px)', 
          backgroundSize: '30px 30px' 
        }}
      />

      <Canvas camera={{ position: [0, 0, 8], fov: 45 }} dpr={[1, 2]}>
        <Suspense fallback={null}>
          <HologramScene stability={finalValue} />
        </Suspense>
      </Canvas>
    </div>
  );
}