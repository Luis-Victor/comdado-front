/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc8fb',
          400: '#36aaf4',
          500: '#0c8ee3',
          600: '#0270c3',
          700: '#045a9e',
          800: '#074b83',
          900: '#0c406d',
        },
        secondary: {
          50: '#f3f7fc',
          100: '#e7eff9',
          200: '#c9ddf1',
          300: '#9bc2e5',
          400: '#65a0d6',
          500: '#4180c4',
          600: '#3366ab',
          700: '#2b528b',
          800: '#274673',
          900: '#243c61',
        },
      },
      boxShadow: {
        'card': '0 2px 4px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 4px 6px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
};