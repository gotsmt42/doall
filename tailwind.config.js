// tailwind.config.js
module.exports = {
  darkMode: 'class',
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#f87171',      // red-400
          DEFAULT: '#dc2626',    // red-600
          dark: '#991b1b',
          grey: '#cdcfd1'        
        }
      }
    },
  },
  plugins: [],
};
