const typography = require("tailwindcss-typography");
const filters = require("tailwindcss-filters");

module.exports = {
  mode: 'jit',
  purge: ["./components/**/*.{js,ts,jsx,tsx}", "./pages/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    textShadow: {
      // defaults to {}
      default: "0 2px 5px rgba(0, 0, 0, 0.5)",
      lg: "0 2px 10px rgba(0, 0, 0, 0.5)",
      "text-glow": "0 2px 10px rgba(0, 0, 0, 0.5)",
    },
    extend: {
      width: {
        "w-1/10": "10%",
        "w-9/10": "90%",
        '20': '20rem',
        '30': '30rem',
      },
      minWidth: {
        '16': '16rem',
        '6': '6rem',
      },
      maxWidth: {
        '20': '20rem',
      },
      spacing: {
        22: "5.5rem"
      },
      zIndex: {
        "65": 65
      },
      colors: {
        "main-text": "#FFFFFD",
        "grad-1": "#E94A44",
        "redhead": "#E95A44",
        "grad-2": "#E97F44",
        "input-inactive": "#727272",
        "violet": "rgb(167 139 250)",
        "violet-dark": "rgb(139 92 246)",
        "violet-border": "rgb(88 28 135)",
        "violet-light": "rgb(245 243 255)",
        "deep-blue": "rgb(3 105 161)"
      },
      fontSize: {
        "h3": ["1rem", {
          lineHeight: "1.25rem"
        }]
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    typography({
      // all these options default to the values specified here
      ellipsis: true, // whether to generate ellipsis utilities
      hyphens: true, // whether to generate hyphenation utilities
      kerning: true, // whether to generate kerning utilities
      textUnset: true, // whether to generate utilities to unset text properties
      componentPrefix: "c-", // the prefix to use for text style classes
    }),
    filters,
  ],
};
