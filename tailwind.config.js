const palette = require('./src/constants/palette');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: palette,
      // Custom names so they never clash with fontWeight utilities (font-bold etc.).
      fontFamily: {
        body: ['PlusJakartaSans_500Medium'],
        label: ['PlusJakartaSans_600SemiBold'],
        heading: ['PlusJakartaSans_700Bold'],
        display: ['PlusJakartaSans_800ExtraBold'],
      },
    },
  },
  plugins: [],
};
