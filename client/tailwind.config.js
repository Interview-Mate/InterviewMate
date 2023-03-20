/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "eerie-black": "#262626ff",
        "dark-cyan": "#548687ff",
        "african-violet": {
          400: "#FFBFEF",
          900: "#c98bb9ff",
        },
        // prettier-ignore
        "seasalt": "#f8f7f9ff",
        white: "#fcfcfcff",
      },
    },
    theme: {
      screens: {
        sm: "480px",
        md: "768px",
        lg: "976px",
        xl: "1440px",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
