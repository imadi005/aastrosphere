'use client'

import { useRef } from 'react'
import { useLoader, useFrame } from '@react-three/fiber'
import { TextureLoader } from 'three'

export const ZodiacSign = ({ position, rotation, signName }) => {
  const meshRef = useRef()
  const texture = useLoader(TextureLoader, `/zodiac/${signName}.png`)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (meshRef.current) {
      meshRef.current.position.z = Math.sin(t + position[0]) * 0.2
      meshRef.current.scale.setScalar(1 + Math.sin(t * 2) * 0.02)
    }
  })

  return (
    <mesh position={position} rotation={rotation} ref={meshRef}>
      <planeGeometry args={[1.5, 1.5]} />
      <meshStandardMaterial
        map={texture}
        transparent
        metalness={0.9}
        roughness={0.4}
        emissive="#fff"
        emissiveIntensity={0.05}
      />
    </mesh>
  )
}
