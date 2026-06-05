"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function FloatingParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 1000;

  const [positions, speeds, noiseOffsets] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    const noise = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 40;

      spd[i] = 0.05 + Math.random() * 0.15;

      noise[i * 3] = Math.random() * 100;
      noise[i * 3 + 1] = Math.random() * 100;
      noise[i * 3 + 2] = Math.random() * 100;
    }

    return [pos, spd, noise];
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;

    const time = state.clock.getElapsedTime();
    const posAttribute = pointsRef.current.geometry.attributes.position;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      
      posAttribute.setY(
        idx,
        posAttribute.getY(idx) + speeds[i] * 0.1
      );

      posAttribute.setX(
        idx,
        posAttribute.getX(idx) + Math.sin(time * 0.2 + noiseOffsets[idx]) * 0.005
      );

      if (posAttribute.getY(idx) > 20) {
        posAttribute.setY(idx, -20);
        posAttribute.setX(idx, (Math.random() - 0.5) * 40);
      }
    }

    posAttribute.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#00f2fe"
        size={0.08}
        transparent
        opacity={0.65}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
