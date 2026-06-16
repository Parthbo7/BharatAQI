/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          DEFAULT: '#000000',
          deep: '#05060B',
        },
        horizon: '#1B3A5C',
        orange: {
          DEFAULT: '#FF6A00',
          flame: '#FFA52A',
          core: '#FFD15C',
        },
        accent: {
          blue: '#2D9CDB',
        },
        panel: '#0E1117',
        muted: '#9CA3AF',
      },
      fontFamily: {
        display: ['Sora', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
