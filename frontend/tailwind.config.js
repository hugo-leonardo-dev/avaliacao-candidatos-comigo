/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'media',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Certifique-se de que este padrão está correto para seu projeto
  ],
  theme: {
    extend: {
      colors: {
        'custom-blue': '#0061a7',
      },
    },
  },
  plugins: [],
};