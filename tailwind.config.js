/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: "#0b0f1a",
          surface: "#101622",
          gold: "#d4a657",
          goldLight: "#f2ce83",
          text: "#f5f5f5",
          muted: "#a5a6ab",
        },
      },
      boxShadow: {
        glow: "0 0 24px rgba(212,166,87,0.25)",
      },
      borderRadius: {
        "2xl": "1.25rem",
      },
    },
  },
  plugins: [],
  future: {
    respectDefaultRingColorOpacity: false,
    respectDefaultRingOpacity: false,
  },
  experimental: {
    optimizeUniversalDefaults: true,
  },
};
