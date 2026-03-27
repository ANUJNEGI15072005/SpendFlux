/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['"Martel Sans"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      screens: {
        xs: "350px",  
      },
    },
  },
  plugins: [],
}