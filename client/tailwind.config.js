/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#e6f4f2",
          100: "#cde8e5",
          200: "#b3dcd7",
          300: "#9ad0ca",
          400: "#80c4bd",
          500: "#1C6758",
          600: "#195e50",
          700: "#165447",
          800: "#134b3f",
          900: "#104236",
        },
        secondary: {
          50: "#fff2e8",
          100: "#ffe5d1",
          200: "#ffd5b7",
          300: "#ffc59c",
          400: "#ffb582",
          500: "#ff8c42",
          600: "#e67f3b",
          700: "#cc7133",
          800: "#b3632c",
          900: "#994f24",
        },
        lite: "#FEF3E2",
      },
    },
  },
  plugins: [],
};
