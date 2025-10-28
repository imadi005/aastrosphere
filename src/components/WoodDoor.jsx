'use client'

import { useRef, useEffect } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three'

export const WoodDoor = ({ position, direction = 'left', open }) => {
  const texture = useLoader(TextureLoader, '/textures/wood.jpg')
  const doorRef = useRef()

  useFrame(() => {
    if (open && doorRef.current.position.x < 6) {
      doorRef.current.position.x += direction === 'left' ? -0.1 : 0.1
    }
  })

  return (
    <mesh ref={doorRef} position={position}>
      <boxGeometry args={[3.5, 10, 0.2]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  )
}
