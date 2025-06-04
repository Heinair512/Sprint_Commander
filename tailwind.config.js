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
          bg: '#1a1b26',
          primary: '#7aa2f7',
          secondary: '#bb9af7',
          accent: '#2ac3de',
          surface: '#24283b',
          muted: '#565f89',
          success: '#9ece6a',
          error: '#f7768e',
          warning: '#e0af68',
          glow: '#c0caf5',
        },
      },
      boxShadow: {
        frame: 'inset 0 0 4px rgba(255, 255, 255, 0.2)',
        glow: '0 0 10px rgba(192, 202, 245, 0.2)',
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