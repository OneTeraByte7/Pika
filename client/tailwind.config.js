/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'pitch-black': '#000000',
        'deep-void': '#050505',
        'electric-blue': '#00f2ff',
        'neon-green': '#00ff88',
        'hot-pink': '#ff00e5',
        'vivid-purple': '#bd00ff',
        'cyber-yellow': '#fff200',
        primary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
        },
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'matrix-gradient': 'linear-gradient(180deg, rgba(0, 242, 255, 0.1) 0%, rgba(0, 0, 0, 0) 100%)',
        'neon-glow': 'linear-gradient(135deg, #bd00ff 0%, #00f2ff 100%)',
        'cyber-gradient': 'linear-gradient(135deg, #00f2ff 0%, #00ff88 100%)',
        'pink-glow': 'linear-gradient(135deg, #ff00e5 0%, #bd00ff 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.4', filter: 'blur(8px)' },
          '50%': { opacity: '0.8', filter: 'blur(12px)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        }
      },
      boxShadow: {
        'neon-blue': '0 0 10px #00f2ff, 0 0 20px #00f2ff66',
        'neon-purple': '0 0 10px #bd00ff, 0 0 20px #bd00ff66',
        'neon-pink': '0 0 10px #ff00e5, 0 0 20px #ff00e566',
        'neon-green': '0 0 10px #00ff88, 0 0 20px #00ff8866',
      }
    },
  },
  plugins: [],
}
