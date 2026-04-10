/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6', // Violet
          600: '#7c3aed',
          700: '#6d28d9', // Deep Violet
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
        },
        indigo: {
          500: '#6366f1',
          600: '#4f46e5',
        },
        surface: {
          0: '#ffffff',
          50: '#f8fafc', // Frost
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617', // Midnight Obsidian
        },
        accent: {
          cyan: '#06b6d4',
          rose: '#f43f5e',
          emerald: '#10b981',
          amber: '#f59e0b',
        }
      },
      boxShadow: {
        'glow': '0 0 24px rgba(124, 58, 237, 0.12)',
        'glow-lg': '0 0 40px rgba(124, 58, 237, 0.18)',
        'card': '0 2px 8px -1px rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
        'card-hover': '0 12px 30px -4px rgba(0, 0, 0, 0.08), 0 4px 12px -2px rgba(0, 0, 0, 0.04)',
        'inner-glow': 'inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        'inner-glow-light': 'inset 0 1px 0 rgba(255, 255, 255, 0.8)',
        'modal': '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        'modal-light': '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-up': 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'shimmer': 'shimmer 2.5s infinite linear',
        'pulse-soft': 'pulseSoft 3s infinite ease-in-out',
        'bounce-in': 'bounceIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.97)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        bounceIn: {
          '0%': { opacity: '0', transform: 'scale(0.92)' },
          '50%': { transform: 'scale(1.01)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
    },
  },
  plugins: [],
};
