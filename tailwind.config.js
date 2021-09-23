const colors = require("tailwindcss/colors");

module.exports = {
  purge: [".src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      primary: colors.lime,
      secondary: colors.gray,
      // black: colors.black,
      // white: colors.white,
      ...colors
    },
  },
  variants: {
    extend: {
      grayscale: ["hover"],
      "bg-opacity": ["hover"],
    },
  },
  plugins: [require("@tailwindcss/forms")],
}
