'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export const CenterOrb = () => {
  const orbRef = useRef();
  const haloRef = useRef();

  // 🔄 Smooth breathing animation for orb + halo
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const scale = 1 + Math.sin(t * 1.5) * 0.05;
    if (orbRef.current) {
      orbRef.current.scale.setScalar(scale);
      orbRef.current.rotation.y += 0.0025;
    }
    if (haloRef.current) {
      haloRef.current.scale.setScalar(1.5 + Math.sin(t * 0.8) * 0.03);
      haloRef.current.material.opacity = 0.08 + Math.sin(t * 0.5) * 0.02;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* 🌞 Main golden orb */}
      <mesh ref={orbRef}>
        <sphereGeometry args={[1.1, 64, 64]} />
        <meshStandardMaterial
          color="#FFD700"
          emissive="#FFD700"
          emissiveIntensity={2.2}
          metalness={0.9}
          roughness={0.15}
        />
      </mesh>

      {/* 🌕 Soft glowing halo */}
      <mesh ref={haloRef}>
        <sphereGeometry args={[1.8, 64, 64]} />
        <meshBasicMaterial
          color="#FFD700"
          transparent
          opacity={0.1}
          blending={2} // Additive blending
        />
      </mesh>

      {/* 💡 Inner light source */}
      <pointLight color="#FFD700" intensity={1.5} distance={10} />
    </group>
  );
};
