import React, { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";

/**
 * POWER-RANGER ATOMIC ENERGY CORE
 * Plasma center + rotating electron rings + orbiting particles
 */

function ElectronOrbit({ radius, speed, tilt = [0, 0, 0], color }) {
  const ringRef = useRef();
  const electronRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    ringRef.current.rotation.z = t * speed;
    electronRef.current.position.x = Math.cos(t * speed * 2) * radius;
    electronRef.current.position.y = Math.sin(t * speed * 2) * radius;
  });

  return (
    <group rotation={tilt}>
      {/* Glowing orbit ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[radius, 0.03, 12, 100]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.5}
          roughness={0.2}
          metalness={0.1}
        />
      </mesh>

      {/* Orbiting electron sphere */}
      <mesh ref={electronRef}>
        <sphereGeometry args={[0.09, 24, 24]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={2}
        />
      </mesh>
    </group>
  );
}

function PlasmaCore({ stability }) {
  const ref = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    ref.current.scale.setScalar(1 + Math.sin(t * 3) * 0.1);
    ref.current.rotation.y = t * 0.4;
  });

  // Color depends on stability
  const color =
    stability >= 70 ? "#22ff99" : stability >= 40 ? "#facc15" : "#ff5678";

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.55, 32, 32]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={1.6}
        metalness={0.3}
        roughness={0.15}
      />
    </mesh>
  );
}

function AtomicCoreGauge({ value }) {
  return (
    <>
      <ambientLight intensity={0.8} />
      <pointLight intensity={1.4} position={[3, 3, 3]} />

      {/* Central plasma core */}
      <PlasmaCore stability={value} />

      {/* Three atomic orbit rings */}
      <ElectronOrbit
        radius={1.1}
        speed={0.6}
        tilt={[0, 0, 0]}
        color="#22d3ee"
      />
      <ElectronOrbit
        radius={1.1}
        speed={0.6}
        tilt={[1, 0.3, 0]}
        color="#38bdf8"
      />
      <ElectronOrbit
        radius={1.1}
        speed={0.6}
        tilt={[0.4, 1, 0]}
        color="#67e8f9"
      />

      {/* Readable Text */}
      <Html center>
        <div
          style={{
            textAlign: "center",
            color: "white",
            fontWeight: 700,
            textShadow: "0 0 8px rgba(0,0,0,0.8)",
            userSelect: "none",
          }}
        >
          <div style={{ fontSize: "26px" }}>{value}%</div>
          <div
            style={{
              fontSize: "11px",
              letterSpacing: "1px",
              opacity: 0.9,
              marginTop: "2px",
            }}
          >
            STABILITY
          </div>
        </div>
      </Html>
    </>
  );
}

export default function Hologram3DGauge({ value = 76, size = 260 }) {
  return (
    <div
      style={{ width: size, height: size }}
      className="rounded-2xl overflow-hidden bg-slate-900/40 backdrop-blur-md border border-cyan-500/20 shadow-[0_0_25px_rgba(34,211,238,0.15)]"
    >
      <Canvas camera={{ position: [0, 0, 4.5], fov: 48 }}>
        <Suspense
          fallback={
            <Html center>
              <div className="text-cyan-200 text-sm animate-pulse">
                Initializing Core…
              </div>
            </Html>
          }
        >
          <AtomicCoreGauge value={value} />
        </Suspense>
      </Canvas>
    </div>
  );
}
