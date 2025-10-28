'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export const CenterOrb = () => {
  const orbRef = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (orbRef.current) {
      orbRef.current.scale.setScalar(1 + Math.sin(t * 3) * 0.05)
    }
  })

  return (
    <mesh ref={orbRef} position={[0, 0, 0]}>
      <sphereGeometry args={[0.6, 64, 64]} />
      <meshStandardMaterial
        color="#FFD700"
        emissive="#FFD700"
        emissiveIntensity={1.8}
        metalness={1}
        roughness={0.1}
      />
    </mesh>
  )
}
