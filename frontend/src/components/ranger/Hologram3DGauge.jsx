// src/components/ranger/Hologram3DGauge.jsx
import React, { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, Torus, Sphere } from "@react-three/drei";
import * as THREE from "three";
import { Activity, Disc } from "lucide-react";

/**
 * 🎨 Dynamic Color Logic
 */
const getStatusColor = (value) => {
  if (value > 70) return new THREE.Color("#22d3ee"); // Cyan
  if (value > 40) return new THREE.Color("#facc15"); // Amber
  return new THREE.Color("#ef4444"); // Red
};

/**
 * 💍 Atomic Ring Component
 */
const AtomicRing = ({ radius, speed, axis, stability }) => {
  const meshRef = useRef();
  
  // Stability Physics: Lower stability = Higher Chaos
  const rotationFactor = 1 + (100 - stability) / 20;

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += delta * speed * rotationFactor * axis[0];
    meshRef.current.rotation.y += delta * speed * rotationFactor * axis[1];
    meshRef.current.rotation.z += delta * speed * rotationFactor * axis[2];
  });

  const color = useMemo(() => getStatusColor(stability), [stability]);

  return (
    <Torus ref={meshRef} args={[radius, 0.05, 16, 100]}>
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={2.5}
        transparent
        opacity={0.5}
        roughness={0.2}
        metalness={0.9}
        wireframe={false}
      />
    </Torus>
  );
};

/**
 * ⚛️ Central Core Component
 */
const CoreOrb = ({ stability }) => {
  const meshRef = useRef();
  const color = useMemo(() => getStatusColor(stability), [stability]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const pulseSpeed = stability < 50 ? 10 : 3; 
    const scale = 0.8 + Math.sin(t * pulseSpeed) * 0.1; // Base size 0.8
    if (meshRef.current) {
      meshRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <Sphere ref={meshRef} args={[1, 32, 32]}>
       {/* High Polish Material for Core */}
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={4} 
        transparent
        opacity={0.8}
        roughness={0}
        metalness={0.2}
      />
    </Sphere>
  );
};

/**
 * 🌌 Main Scene
 */
const HologramScene = ({ stability }) => {
  const colorHex = getStatusColor(stability).getStyle();

  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={2} />
      <pointLight position={[-10, -10, -5]} intensity={1} color={colorHex} />
      
      {/* Spinning Rings */}
      <AtomicRing radius={3.2} speed={0.3} axis={[1, 0.5, 0]} stability={stability} />
      <AtomicRing radius={2.4} speed={0.5} axis={[0, 1, 0.5]} stability={stability} />
      <AtomicRing radius={1.6} speed={0.7} axis={[0.5, 0, 1]} stability={stability} />
      
      {/* Center Core */}
      <CoreOrb stability={stability} />

      {/* Floating 3D Label */}
      <Html position={[0, -4, 0]} center zIndexRange={[100, 0]}>
        <div className="flex flex-col items-center pointer-events-none select-none">
          <div 
            className="text-3xl font-bold font-mono tracking-tighter drop-shadow-[0_0_15px_rgba(0,0,0,1)]" 
            style={{ color: colorHex }}
          >
            {Math.round(stability)}%
          </div>
          <div className="text-[9px] text-cyan-200/60 uppercase tracking-[0.3em] font-bold mt-1 bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm border border-cyan-500/10">
            SYNC STATUS
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
  // Handle prop mismatch
  const finalValue = stability !== undefined ? stability : (value || 100);

  // Determine status string
  const statusLabel = finalValue > 70 ? "OPTIMAL" : finalValue > 40 ? "UNSTABLE" : "CRITICAL";
  const statusColor = finalValue > 70 ? "text-cyan-400" : finalValue > 40 ? "text-yellow-400" : "text-red-500";

  return (
    <div className="w-full h-full min-h-[300px] relative rounded-2xl overflow-hidden bg-[#050b14]/80 border border-slate-800/50 backdrop-blur-xl shadow-lg flex flex-col">
      
      {/* 1. ATMOSPHERE */}
      <div className="absolute inset-0 scanlines opacity-10 pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.03),transparent_80%)] pointer-events-none z-0" />
      
      {/* 2. PROJECTOR BEAM (Bottom Gradient) */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-1/3 bg-gradient-to-t from-cyan-500/10 to-transparent blur-xl pointer-events-none z-0" />

      {/* 3. HUD OVERLAYS (Static HTML on top of Canvas) */}
      <div className="absolute top-0 left-0 w-full p-4 z-10 flex justify-between items-start pointer-events-none">
        <div className="flex items-center gap-2">
          <Activity size={14} className="text-cyan-500/70" />
          <span className="text-[10px] font-mono text-cyan-500/60 tracking-widest uppercase">
            Holo-Emitter v4.2
          </span>
        </div>
        
        {/* Live Status Tag */}
        <div className={`flex items-center gap-2 px-2 py-1 rounded bg-black/40 border border-white/5 backdrop-blur-md ${statusColor}`}>
          <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${statusColor.replace('text-', 'bg-')}`} />
          <span className="text-[9px] font-bold font-mono tracking-widest">{statusLabel}</span>
        </div>
      </div>
      
      {/* 4. REACTIVE CORNERS */}
      <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-cyan-500/20 rounded-tr-xl z-10 opacity-50" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-cyan-500/20 rounded-bl-xl z-10 opacity-50" />

      {/* 5. 3D SCENE */}
      <div className="flex-grow relative z-0">
         <Canvas camera={{ position: [0, 0, 9], fov: 40 }} dpr={[1, 2]}>
           <Suspense fallback={null}>
             <HologramScene stability={finalValue} />
           </Suspense>
         </Canvas>
      </div>
      
      {/* 6. FOOTER DECORATION */}
      <div className="absolute bottom-3 w-full flex justify-center z-10 pointer-events-none opacity-40">
        <div className="flex items-center gap-1 text-[9px] font-mono text-cyan-900">
           <Disc size={10} className="animate-spin-slow" />
           <span>PROJECTION MATRIX ACTIVE</span>
        </div>
      </div>

    </div>
  );
}