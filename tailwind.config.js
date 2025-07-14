/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // This line tells Tailwind to look for classes in all JS, TS, JSX, TSX files inside the src directory.
  ],
  theme: {
    extend: {
      colors: {
        primaryBg: '#DCEDFF', // custom color
      },
    },
  },
  plugins: [],
}