const colors = require("tailwindcss/colors");

module.exports = {
  purge: [".src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      primary: colors.lime,
      // black: colors.black,
      // white: colors.white,
      ...colors
    }
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms")],
}
