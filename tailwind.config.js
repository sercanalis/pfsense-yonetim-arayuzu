/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'pfsense-primary': '#D9534F',
        'pfsense-secondary': '#F0AD4E',
        'pfsense-dark': '#212529',
        'pfsense-light': '#F8F9FA',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}