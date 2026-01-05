/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        dropdown: {
          '0%': {
            opacity: '0',
            transform: 'translateY(-6px) scale(0.95)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0) scale(1)'
          },
        },
      },
      animation: {
        dropdown: 'dropdown 0.15s ease-out forwards',
      },
    },
  },
  plugins: [],
}

