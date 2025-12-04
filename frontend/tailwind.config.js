/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        panelSlideRight: {
          'to': { transform: 'translateX(100%)', opacity: '1' },
        },
        panelSlideLeft: {
          'to': { transform: 'translateX(-100%)', opacity: '1' },
        },
        panelEnterLeft: {
          'from': { transform: 'translateX(-100%)' },
          'to': { transform: 'translateX(0)' },
        },
        panelEnterRight: {
          'from': { transform: 'translateX(100%)' },
          'to': { transform: 'translateX(0)' },
        },
        fadeIn: {
          'from': { opacity: '0', transform: 'translateY(20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        panelSlideRight: 'panelSlideRight 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards',
        panelSlideLeft: 'panelSlideLeft 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards',
        panelEnterLeft: 'panelEnterLeft 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards',
        panelEnterRight: 'panelEnterRight 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards',
      },
    },
  },
  plugins: [],
}

