/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "HTC": "var(--HTC)",
        "BGC": "var(--BGC)",
        "BTC": "var(--BTC)",
      },
      keyframes: {
        "spin": {
          from: {transform: "rotate(0deg)"},
          to: {transform: "rotate(360deg)"},
        },
        "wave": {
          "0%": {transform: "translateY(0)"},
          "50%": {transform: "translateY(-30px)"},
          "100%": {transform: "translateY(0px)"},
        },
      },
      animation: {
        "spin": "spin 2500ms linear infinite",
      },
    },
  },
  plugins: [],
}

