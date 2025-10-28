'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import './CelestialDoors.css'

export default function CelestialDoors({ onDoorsOpen }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setOpen(true)
      if (onDoorsOpen) onDoorsOpen()
    }, 2000)

    return () => clearTimeout(timeout)
  }, [])

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Stars Background (appears after doors open) */}
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="absolute inset-0 bg-black z-0 overflow-hidden"
        >
          <div className="stars" />
          <div className="twinkling" />
        </motion.div>
      )}

      {/* Zodiac Wheel Center */}
      <motion.div
        className="absolute z-10 w-[500px] h-[500px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        animate={open ? { rotate: 360 } : { rotate: 0 }}
        transition={{ duration: 30, ease: 'linear', repeat: Infinity }}
      >
        <Image
          src="/zodiac_circle_gold.png"
          alt="Zodiac Wheel"
          width={500}
          height={500}
          className="object-contain"
        />
      </motion.div>

      {/* Left Door */}
      <AnimatePresence>
        {!open && (
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: '-100%' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: 'easeInOut' }}
            className="absolute left-0 top-0 h-full w-1/2 z-20 overflow-hidden"
          >
            <Image
              src="/wooden_door_texture.png"
              alt="Left Door"
              layout="fill"
              objectFit="cover"
              className="brightness-110"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Right Door */}
      <AnimatePresence>
        {!open && (
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: '100%' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: 'easeInOut' }}
            className="absolute right-0 top-0 h-full w-1/2 z-20 overflow-hidden"
          >
            <Image
              src="/wooden_door_texture.png"
              alt="Right Door"
              layout="fill"
              objectFit="cover"
              className="brightness-110"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Light Flash Reveal */}
      {open && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 bg-yellow-200/30 blur-3xl z-30"
        />
      )}
    </div>
  )
}
