/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0a0a0a',
          card: '#1a1a1a',
          hover: '#2a2a2a',
          border: '#333333',
        },
        light: {
          bg: '#ffffff',
          card: '#f9fafb',
          hover: '#f3f4f6',
          border: '#e5e7eb',
        }
      }
    },
  },
  plugins: [],
}

