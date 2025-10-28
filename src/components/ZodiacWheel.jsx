'use client'

import { motion } from 'framer-motion'

export const ZodiacWheel = () => {
  return (
    <motion.div
      className="w-[300px] h-[300px] md:w-[400px] md:h-[400px] rounded-full border-4 border-purple-500 flex items-center justify-center text-2xl font-bold text-white relative z-10"
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 30, ease: 'linear' }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-3xl md:text-4xl text-purple-300">ASTROSPHERE</span>
      </div>
    </motion.div>
  )
}
