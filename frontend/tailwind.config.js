/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          green: '#1b5e20',
          darkgreen: '#144517',
          emerald: '#2E7D32',
          lightgreen: '#E8F5E9',
          saffron: '#FF9933',
          darksaffron: '#E65100',
          navy: '#0D47A1',
          gold: '#FBC02D',
          parchment: '#F9FBF7',
          card: '#FFFFFF',
          border: '#DCE7D6'
        }
      },
      fontFamily: {
        sans: ['"Inter"', '"Noto Sans Devanagari"', 'system-ui', 'sans-serif'],
        hindi: ['"Noto Sans Devanagari"', '"Inter"', 'sans-serif']
      },
      boxShadow: {
        'gov': '0 2px 8px -2px rgba(27, 94, 32, 0.08), 0 4px 16px 0 rgba(0, 0, 0, 0.06)',
        'gov-lg': '0 10px 25px -3px rgba(27, 94, 32, 0.12), 0 4px 12px -2px rgba(0, 0, 0, 0.08)',
        'glow-green': '0 0 20px rgba(46, 125, 50, 0.35)',
        'glow-saffron': '0 0 20px rgba(255, 153, 51, 0.4)'
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'tractor-drive': 'drive 12s linear infinite',
        'sway': 'sway 4s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        },
        sway: {
          '0%': { transform: 'rotate(-2deg)' },
          '100%': { transform: 'rotate(2deg)' },
        }
      }
    },
  },
  plugins: [],
}
