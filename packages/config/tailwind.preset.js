/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: 'rgb(var(--bw-accent-rgb) / <alpha-value>)',
        surface: 'var(--lt-surface-bg)',
        'surface-border': 'var(--lt-surface-border)',
      },
      borderRadius: {
        'surface': 'var(--lt-surface-radius)',
      },
      spacing: {
        'layout': 'var(--lt-spacing)',
      },
      keyframes: {
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        pulseBrand: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(var(--bw-accent-rgb), 0.4)' },
          '50%': { boxShadow: '0 0 0 8px rgba(var(--bw-accent-rgb), 0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        }
      },
      animation: {
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in': 'fadeIn 0.2s ease-out',
        'pulse-brand': 'pulseBrand 2s infinite',
        'float': 'float 3s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
