/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        base: {
          DEFAULT: '#0a0a0f',
          50: '#16162a',
          100: '#12121a',
          200: '#1a1a2e',
          300: '#22223a',
          400: '#2a2a44',
        },
        neon: {
          cyan: '#00f0ff',
          magenta: '#ff00e5',
          violet: '#8b5cf6',
          lime: '#39ff14',
          pink: '#f472b6',
        },
        surface: {
          DEFAULT: '#12121a',
          light: '#1a1a2e',
          lighter: '#22223a',
        },
        muted: {
          DEFAULT: '#8888aa',
          light: '#a0a0c0',
        },
        text: {
          DEFAULT: '#e0e0ff',
          muted: '#8888aa',
          bright: '#f0f0ff',
        },
      },
      fontFamily: {
        heading: ['Space Grotesk', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      backgroundImage: {
        'neon-mesh': 'radial-gradient(ellipse at 20% 50%, rgba(0,240,255,0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(139,92,246,0.08) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(255,0,229,0.06) 0%, transparent 50%)',
        'neon-grid': 'linear-gradient(rgba(0,240,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.03) 1px, transparent 1px)',
        'neon-gradient-cyan': 'linear-gradient(135deg, #00f0ff, #8b5cf6)',
        'neon-gradient-magenta': 'linear-gradient(135deg, #ff00e5, #8b5cf6)',
        'neon-gradient-full': 'linear-gradient(135deg, #00f0ff, #8b5cf6, #ff00e5)',
      },
      backgroundSize: {
        'grid-size': '60px 60px',
      },
      boxShadow: {
        'neon-sm': '0 0 5px rgba(0,240,255,0.3), 0 0 10px rgba(0,240,255,0.1)',
        'neon-md': '0 0 10px rgba(0,240,255,0.4), 0 0 30px rgba(0,240,255,0.15)',
        'neon-lg': '0 0 20px rgba(0,240,255,0.5), 0 0 60px rgba(0,240,255,0.2)',
        'neon-magenta-sm': '0 0 5px rgba(255,0,229,0.3), 0 0 10px rgba(255,0,229,0.1)',
        'neon-magenta-md': '0 0 10px rgba(255,0,229,0.4), 0 0 30px rgba(255,0,229,0.15)',
        'neon-violet-sm': '0 0 5px rgba(139,92,246,0.3), 0 0 10px rgba(139,92,246,0.1)',
        'neon-violet-md': '0 0 10px rgba(139,92,246,0.4), 0 0 30px rgba(139,92,246,0.15)',
        'neon-glow': '0 0 15px rgba(0,240,255,0.3), 0 0 45px rgba(139,92,246,0.15), inset 0 0 15px rgba(0,240,255,0.05)',
      },
      animation: {
        'pulse-neon': 'pulse-neon 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow-border': 'glow-border 3s ease-in-out infinite',
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'slide-in-left': 'slide-in-left 0.5s ease-out forwards',
        'typing': 'typing 3.5s steps(40, end)',
        'thread-flow': 'thread-flow 3s linear infinite',
      },
      keyframes: {
        'pulse-neon': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'glow-border': {
          '0%, 100%': { borderColor: 'rgba(0,240,255,0.3)' },
          '50%': { borderColor: 'rgba(0,240,255,0.6)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in-left': {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'typing': {
          '0%': { width: '0' },
          '100%': { width: '100%' },
        },
        'thread-flow': {
          '0%': { backgroundPosition: '0% 0%' },
          '100%': { backgroundPosition: '200% 0%' },
        },
      },
    },
  },
  plugins: [],
}

