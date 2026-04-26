import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        aa: {
          blue: '#1C5FD8',
          red: '#E8252C',
          yellow: '#FFC91F',
          ink: '#0F1B3D',
          paper: '#FFFDF6',
          cream: '#FFF5D6',
          'blue-soft': '#6B9AEA',
          'red-soft': '#F07278',
        },
      },
      fontFamily: {
        display: ['"Archivo Black"', '"Arial Black"', 'sans-serif'],
        body: ['"Figtree"', 'system-ui', 'sans-serif'],
        hand: ['"Caveat Brush"', 'cursive'],
      },
      boxShadow: {
        'pop-sm': '4px 4px 0 0 #0F1B3D',
        pop: '6px 6px 0 0 #0F1B3D',
        'pop-lg': '10px 10px 0 0 #0F1B3D',
        'pop-xl': '14px 14px 0 0 #0F1B3D',
      },
      borderRadius: {
        sm: '14px',
        md: '20px',
        lg: '28px',
      },
      animation: {
        float: 'floatY 4s ease-in-out infinite',
        marquee: 'marquee 38s linear infinite',
        'bounce-arrow': 'bounceArrow 1.5s ease-in-out infinite',
        'pulse-ring': 'pulseRing 1.8s ease-out infinite',
        'pop-in': 'popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards',
        'slide-up': 'slideUp 0.5s ease forwards',
        'konami-dance': 'konamiDance 0.6s ease-in-out 6',
      },
      keyframes: {
        floatY: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        bounceArrow: {
          '0%,100%': { transform: 'rotate(45deg) translate(0,0)', opacity: '0.6' },
          '50%': { transform: 'rotate(45deg) translate(6px,6px)', opacity: '1' },
        },
        pulseRing: {
          '0%': { transform: 'scale(0.95)', opacity: '0.9' },
          '100%': { transform: 'scale(1.6)', opacity: '0' },
        },
        popIn: {
          '0%': { opacity: '0', transform: 'scale(0.5) rotate(-10deg)' },
          '80%': { transform: 'scale(1.1) rotate(2deg)' },
          '100%': { opacity: '1', transform: 'scale(1) rotate(0deg)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        konamiDance: {
          '0%,100%': { transform: 'translateY(0) rotate(-4deg)' },
          '25%': { transform: 'translateY(-24px) rotate(6deg)' },
          '50%': { transform: 'translateY(0) rotate(-6deg)' },
          '75%': { transform: 'translateY(-18px) rotate(4deg)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
