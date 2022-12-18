/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        'miaka-red': '#fc354c',
        'miaka-green': '#0abfbc'
      }
    },
  },
  plugins: [],
}
