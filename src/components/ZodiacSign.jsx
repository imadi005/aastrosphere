'use client'

import { useRef } from 'react'
import { useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three'

export const ZodiacSign = ({ position, rotation, signName }) => {
  const texture = useLoader(TextureLoader, `/zodiac/${signName}.png`)
  const ref = useRef()

  return (
    <mesh position={position} rotation={rotation} ref={ref}>
      <planeGeometry args={[1.5, 1.5]} attach="geometry" />
      <meshStandardMaterial
        map={texture}
        transparent
        metalness={1}
        roughness={0.3}
        emissiveIntensity={0.4}
        attach="material"
      />
    </mesh>
  )
}
