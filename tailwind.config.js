/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"Press Start 2P"', 'monospace'],
      },
      colors: {
        crt: {
          bg: '#2b2b29',
          sepia: '#c1a477',
          brown: '#8a6642',
          darkbrown: '#5c4321',
          lightsep: '#e4d4b8',
          glow: '#fcefb4',
        },
      },
      boxShadow: {
        frame: 'inset 0 0 4px rgba(255, 255, 255, 0.2)',
      },
      animation: {
        'news-ticker': 'news-ticker 20s linear infinite',
      },
      keyframes: {
        'news-ticker': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        }
      },
    },
  },
  plugins: [],
}