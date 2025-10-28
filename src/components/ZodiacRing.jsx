'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { ZodiacSign } from './ZodiacSign.client'

const zodiacSigns = [
  'aries', 'taurus', 'gemini', 'cancer',
  'leo', 'virgo', 'libra', 'scorpio',
  'sagittarius', 'capricorn', 'aquarius', 'pisces',
]

export const ZodiacRing = () => {
  const groupRef = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (groupRef.current) {
      groupRef.current.rotation.z += 0.0015
      groupRef.current.position.y = Math.sin(t * 0.5) * 0.2
    }
  })

  return (
    <group ref={groupRef}>
      {zodiacSigns.map((sign, i) => {
        const angle = (i / zodiacSigns.length) * Math.PI * 2
        const x = Math.cos(angle) * 4
        const y = Math.sin(angle) * 4
        return (
          <ZodiacSign
            key={sign}
            signName={sign}
            position={[x, y, 0]}
            rotation={[0, 0, -angle]}
          />
        )
      })}
    </group>
  )
}
