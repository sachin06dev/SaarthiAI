/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef8ff',
          100: '#d9f0ff',
          200: '#bce4ff',
          300: '#8ed2ff',
          400: '#56b6ff',
          500: '#2c95ff',
          600: '#1476f5',
          700: '#0e5fe1',
          800: '#124db6',
          900: '#15438f',
          950: '#112957',
        },
        health: {
          inRange: '#059669', // Emerald 600
          inRangeBg: '#ecfdf5',
          aboveRange: '#dc2626', // Red 600
          aboveRangeBg: '#fef2f2',
          belowRange: '#d97706', // Amber 600
          belowRangeBg: '#fffbeb',
          review: '#7c3aed', // Purple 600
          reviewBg: '#f5f3ff',
          unverified: '#4b5563', // Slate 600
          unverifiedBg: '#f3f4f6',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
