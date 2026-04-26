/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', '../../packages/ui/src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Semantic brand color — reads from --bw-accent-rgb CSS variable set by ThemeContext.
        // Usage: bg-brand, text-brand, border-brand, bg-brand/10, hover:bg-brand, etc.
        brand: 'rgb(var(--bw-accent-rgb) / <alpha-value>)',
      },
    },
  },
  plugins: [],
}
