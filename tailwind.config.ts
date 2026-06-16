import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        space: {
          DEFAULT: '#000000',
          deep: '#03050a',
          nav: 'rgba(5, 6, 11, 0.6)',
        },
        horizon: '#1B3A5C',
        orange: {
          DEFAULT: '#FF6A00',
          flame: '#FFA52A',
          core: '#FFD15C',
          glow: 'rgba(255, 106, 0, 0.4)',
        },
        blue: {
          isro: '#0054A6',
          light: '#2D9CDB',
        },
        accent: {
          blue: '#2D9CDB',
        },
        panel: '#0E1117',
        muted: '#9CA3AF',
      },
      fontFamily: {
        display: ['var(--font-sora)', 'sans-serif'],
        body: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
        orbitron: ['var(--font-orbitron)', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s infinite ease-in-out',
        'twinkle': 'twinkle 4s infinite ease-in-out',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', filter: 'drop-shadow(0 0 5px rgba(255, 106, 0, 0.4))' },
          '50%': { opacity: '1', filter: 'drop-shadow(0 0 20px rgba(255, 106, 0, 0.8))' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.2' },
          '50%': { opacity: '1' },
        }
      }
    },
  },
  plugins: [],
};
export default config;
