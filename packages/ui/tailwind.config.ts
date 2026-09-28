import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    '../../apps/web/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        neu: {
          bg: '#e6ecf5',
          flat: '#e6ecf5',
          'shadow-dark': '#b8c2d0',
          'shadow-light': '#ffffff',

          'dark-bg': '#0f172a',
          'dark-flat': '#0f172a',
          'dark-shadow-dark': '#070a12',
          'dark-shadow-light': '#182238',
        },
        brand: {
          500: '#6366f1',
          600: '#4f46e5',
        },
      },
      boxShadow: {
        'neu-flat': '8px 8px 16px #b8c2d0, -8px -8px 16px #ffffff',
        'neu-pressed': 'inset 5px 5px 10px #b8c2d0, inset -5px -5px 10px #ffffff',
        'neu-convex': 'linear-gradient(145deg, #f7fdff, #cfd4dd)',

        'neu-dark-flat': '6px 6px 14px #070a12, -6px -6px 14px #182238',
        'neu-dark-pressed': 'inset 4px 4px 8px #070a12, inset -4px -4px 8px #182238',

        'glow-primary': '0 0 20px rgba(99, 102, 241, 0.45)',
        'glow-success': '0 0 20px rgba(34, 197, 94, 0.45)',
        'glow-warning': '0 0 20px rgba(234, 179, 8, 0.45)',
      },
      borderRadius: {
        'neu-sm': '12px',
        'neu-md': '20px',
        'neu-lg': '28px',
      },
    },
  },
  plugins: [],
};

export default config;