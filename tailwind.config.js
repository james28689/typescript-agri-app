const colors = require("tailwindcss/colors");

delete colors.lightBlue;

module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  purge: true,
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      primary: colors.lime,
      secondary: colors.gray,
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
