/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        // Luxury aesthetic: Montserrat body, Cormorant Garamond display.
        // Inter/Lora kept as fallbacks so legacy components don't break.
        sans:  ['Montserrat', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['"Cormorant Garamond"', 'Lora', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
