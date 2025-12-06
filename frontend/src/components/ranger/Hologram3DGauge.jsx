// src/components/ranger/Hologram3DGauge.jsx
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

// Rotating wireframe ring component
const RotatingRing = () => {
  const ringRef = useRef();
  const particlesRef = useRef();

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.x += 0.005;
      ringRef.current.rotation.y += 0.01;
    }
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.002;
    }
  });

  // Create particles for hologram effect
  const particlesCount = 100;
  const particles = new Float32Array(particlesCount * 3);
  
  for (let i = 0; i < particlesCount * 3; i += 3) {
    const radius = 2 + Math.random() * 2;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    
    particles[i] = radius * Math.sin(phi) * Math.cos(theta);
    particles[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
    particles[i + 2] = radius * Math.cos(phi);
  }

  return (
    <group>
      {/* Main rotating ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[2, 0.1, 8, 32]} />
        <meshBasicMaterial 
          color="#22d3ee" 
          wireframe 
          transparent 
          opacity={0.8}
        />
      </mesh>

      {/* Inner ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[1.5, 0.05, 6, 24]} />
        <meshBasicMaterial 
          color="#3b82f6" 
          wireframe 
          transparent 
          opacity={0.6}
        />
      </mesh>

      {/* Particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particlesCount}
            array={particles}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial 
          color="#22d3ee" 
          size={0.02} 
          transparent 
          opacity={0.6}
        />
      </points>

      {/* Central core */}
      <mesh>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial 
          color="#22d3ee" 
          transparent 
          opacity={0.4}
          wireframe
        />
      </mesh>
    </group>
  );
};

const Hologram3DGauge = () => {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="bg-slate-900/50 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-6 hover:border-cyan-500/40 transition-all duration-300 h-80"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
        <h3 className="text-lg font-semibold text-white">3D Hologram</h3>
      </div>

      <div className="h-64 w-full">
        <Canvas
          camera={{ position: [5, 5, 5], fov: 50 }}
          style={{ background: 'transparent' }}
        >
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={0.5} color="#22d3ee" />
          <RotatingRing />
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            autoRotate
            autoRotateSpeed={1}
          />
        </Canvas>
      </div>

      <div className="text-center mt-4">
        <div className="text-sm text-cyan-400 font-medium">Neural Interface</div>
        <div className="text-xs text-slate-500">Active Monitoring</div>
      </div>
    </motion.div>
  );
};

export default Hologram3DGauge;