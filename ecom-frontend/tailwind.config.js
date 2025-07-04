// tailwind.config.js
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-montserrat-alternates)', 'sans-serif'], // 👈 Map font-sans to your variable
      },
    },
  },
  plugins: [],
};
