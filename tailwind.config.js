/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'christmas-red': '#DC143C',
        'christmas-red-dark': '#B22222',
        'christmas-green': '#228B22',
        'christmas-green-dark': '#006400',
        'christmas-gold': '#FFD700',
        'christmas-gold-light': '#FFEC8C',
        'snow-white': '#FFFAFA',
        'candy-cane': '#FF6B6B',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'sparkle': 'sparkle 2s ease-in-out infinite',
        'snow': 'snow 10s linear infinite',
        'twinkle': 'twinkle 1.5s ease-in-out infinite',
        'bounce-slow': 'bounce 3s infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'shimmer': 'shimmer 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(5deg)' },
        },
        sparkle: {
          '0%, 100%': { opacity: 1, transform: 'scale(1) rotate(0deg)' },
          '50%': { opacity: 0.7, transform: 'scale(1.3) rotate(180deg)' },
        },
        snow: {
          '0%': { transform: 'translateY(-100vh) translateX(0) rotate(0deg)' },
          '100%': { transform: 'translateY(100vh) translateX(20px) rotate(360deg)' },
        },
        twinkle: {
          '0%, 100%': { opacity: 0.3, transform: 'scale(0.8)' },
          '50%': { opacity: 1, transform: 'scale(1.2)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 215, 0, 0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(255, 215, 0, 0.8), 0 0 60px rgba(255, 215, 0, 0.4)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'christmas-pattern': 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.05) 10px, rgba(255,255,255,0.05) 20px)',
      },
    },
  },
  plugins: [],
}

