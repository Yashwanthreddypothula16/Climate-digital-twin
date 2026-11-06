/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#071330',
          dark: '#040b1b',
          card: 'rgba(9, 23, 58, 0.75)',
          panel: 'rgba(7, 19, 48, 0.85)',
          overlay: 'rgba(3, 10, 26, 0.92)',
        },
        navy: {
          950: '#040b1b',
          900: '#071330',
          850: '#0a1a42',
          800: '#0d2256',
          700: '#143175',
          600: '#1e4499',
        },
        cyan: {
          glow: '#00F0FF',
          DEFAULT: '#00E5FF',
          dark: '#0099b8',
        },
        electric: {
          blue: '#1E60FF',
          DEFAULT: '#2563EB',
          light: '#38BDF8',
        },
        neon: {
          cyan: '#00F0FF',
          blue: '#1E88E5',
          orange: '#FF7A00',
          red: '#EF4444',
          green: '#10B981',
          yellow: '#F59E0B',
          purple: '#8B5CF6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        display: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan': '0 0 15px rgba(0, 240, 255, 0.35)',
        'glow-cyan-lg': '0 0 30px rgba(0, 240, 255, 0.5)',
        'glow-blue': '0 0 15px rgba(30, 96, 255, 0.35)',
        'glow-orange': '0 0 15px rgba(255, 122, 0, 0.35)',
        'glow-red': '0 0 15px rgba(239, 68, 68, 0.35)',
        'glow-green': '0 0 15px rgba(16, 185, 129, 0.4)',
        'glass-card': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'inner-glow': 'inset 0 0 12px rgba(0, 240, 255, 0.15)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite alternate',
        'spin-slow': 'spin 12s linear infinite',
        'radar-sweep': 'radarSweep 4s linear infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        glowPulse: {
          '0%': { boxShadow: '0 0 8px rgba(0, 240, 255, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(0, 240, 255, 0.6), inset 0 0 10px rgba(0, 240, 255, 0.2)' },
        },
        radarSweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
