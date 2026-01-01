/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#0055ff',   // Deep Blue
          secondary: '#00aaff', // Bright Blue
          light: '#97e5ff',     // Pale Blue
        }
      }
    },
  },
  plugins: [],
}