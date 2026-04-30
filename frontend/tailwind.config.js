/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff7ed',
          100: '#ffedd5',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
        },
        surface: {
          DEFAULT: '#1a1a2e',
          50: '#f8f9fb',
          100: '#f1f3f7',
          200: '#e4e8f0',
          800: '#1e2235',
          900: '#12141f',
        },
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      animation: {
        'slide-up': 'slideUp 0.3s ease-out',
        'fade-in': 'fadeIn 0.4s ease-out',
        'bounce-in': 'bounceIn 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'cart-pop': 'cartPop 0.25s ease-out',
      },
      keyframes: {
        slideUp: {
          from: { transform: 'translateY(20px)', opacity: 0 },
          to: { transform: 'translateY(0)', opacity: 1 },
        },
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        bounceIn: {
          from: { transform: 'scale(0.8)', opacity: 0 },
          to: { transform: 'scale(1)', opacity: 1 },
        },
        cartPop: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.25)' },
          '100%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
