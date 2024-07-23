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
          50: "#ebf2ff",
          100: "#d6e4ff",
          200: "#adc8ff",
          300: "#84abff",
          400: "#5b8fff",
          500: "#3B82F6",
          600: "#3575dd",
          700: "#2f68c4",
          800: "#295baa",
          900: "#234e91",
        },
        lite: "#FEF3E2",
      },
    },
  },
  plugins: [],
};
