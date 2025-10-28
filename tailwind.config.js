/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {},
  },
  plugins: [],
  // Important for Tailwind v3.3+ that uses oklch()
  future: {
    respectDefaultRingColorOpacity: false,
    respectDefaultRingOpacity: false,
  },
  experimental: {
    optimizeUniversalDefaults: true,
  },
}

