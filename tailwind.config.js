/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#B48465', // Copper
        background: '#181818', // Deep dark
        text: '#181818', // Brand text
        light: '#fff',
        accent: '#C9A88C', // Lighter copper accent
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

