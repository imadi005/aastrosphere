'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import { Suspense } from 'react'
import { ZodiacSign } from './ZodiacSign'

const zodiacSigns = [
  'aries', 'taurus', 'gemini', 'cancer',
  'leo', 'virgo', 'libra', 'scorpio',
  'sagittarius', 'capricorn', 'aquarius', 'pisces',
]

export const Zodiac3DScene = () => {
  return (
    <div className="w-full h-screen fixed top-0 left-0 z-0">
      <Canvas camera={{ position: [0, 0, 12], fov: 60 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[0, 0, 5]} intensity={1.5} />
        <Stars radius={100} depth={50} count={8000} factor={5} fade />

        <Suspense fallback={null}>
          {zodiacSigns.map((sign, i) => {
            const angle = (i / zodiacSigns.length) * Math.PI * 2
            const radius = 5.5
            const x = Math.cos(angle) * radius
            const y = Math.sin(angle) * radius
            return (
              <ZodiacSign
                key={sign}
                signName={sign}
                position={[x, y, 0]}
                rotation={[0, 0, -angle]}
              />
            )
          })}
        </Suspense>

        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  )
}
