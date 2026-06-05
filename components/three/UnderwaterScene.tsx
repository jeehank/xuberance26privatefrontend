"use client";

import { Canvas } from "@react-three/fiber";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import FloatingParticles from "./FloatingParticles";

function VolumetricLights() {
  const light1Ref = useRef<THREE.SpotLight>(null);
  const light2Ref = useRef<THREE.SpotLight>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (light1Ref.current) {
      light1Ref.current.position.x = Math.sin(time * 0.5) * 10;
      light1Ref.current.position.z = Math.cos(time * 0.3) * 5;
      light1Ref.current.intensity = 15 + Math.sin(time * 2) * 5;
    }

    if (light2Ref.current) {
      light2Ref.current.position.x = Math.cos(time * 0.4) * 8;
      light2Ref.current.position.z = Math.sin(time * 0.6) * 6;
      light2Ref.current.intensity = 10 + Math.cos(time * 1.5) * 3;
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <spotLight
        ref={light1Ref}
        position={[0, 15, 0]}
        angle={Math.PI / 3}
        penumbra={1}
        intensity={20}
        color="#00f2fe"
        distance={35}
      />
      <spotLight
        ref={light2Ref}
        position={[5, 12, -2]}
        angle={Math.PI / 4}
        penumbra={1}
        intensity={12}
        color="#0072ff"
        distance={30}
      />
      <directionalLight position={[-5, 5, -5]} intensity={0.6} color="#0dffd6" />
    </>
  );
}

export default function UnderwaterScene() {
  return (
    <div className="fixed inset-0 w-full h-full -z-10 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ gl, scene }) => {
          scene.fog = new THREE.FogExp2("#071224", 0.03);
        }}
      >
        <VolumetricLights />
        <FloatingParticles />
      </Canvas>
    </div>
  );
}
