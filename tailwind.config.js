/**
 * Tailwind Config
 * @type {import("@types/tailwindcss/tailwind-config").TailwindConfig }
 */
 module.exports = {
    content: ["./app/**/*.{ts,tsx,jsx,js}"],
    theme: {
      colors: {
        'dark': '#2E2F30',
        'dark-alt': '#DB9731',
        'gray': '#C4C4C4',
        'light': '#E5E5E5',
        'light-alt': '#FEBE5D',
        'white': '#ffffff',
      },
      extend: {

      },
    fontFamily: {
        'sans': ['Ubuntu', 'Arial', 'sans-serif'],
        'serif': ['Merriweather', 'serif'],
      },
    },
    plugins: [
      require('@tailwindcss/forms')
    ],
  };  