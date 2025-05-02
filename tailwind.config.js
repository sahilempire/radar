/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#C67B49', // Main orange-brown color
        'primary-light': '#E3A778', // Light variant
        'primary-dark': '#8B5E3C', // Dark variant
        warm: {
          DEFAULT: '#C67B49',
          50: '#C67B49/10',
          100: '#C67B49/20',
          200: '#C67B49/40',
          300: '#C67B49/60',
          400: '#C67B49/70',
          500: '#C67B49/80',
          600: '#C67B49/90',
          700: '#E3A778',
          800: '#8B5E3C',
        },
        background: '#000000',
        accent: '#0080ff',
        light: '#ffffff',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

