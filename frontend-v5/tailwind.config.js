/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        blue: "#0190ea",
        purple: "#7e5bef",
        pink: "#ff49db",
        orange: "#ff7849",
        green: "#13ce66",
        yellow: "#ffc82c",
        "gray-dark": "#386ba5",
        gray: "#8492a6",
        "gray-light": "#d3dce6",
        dark: "#0e0f11",
        "sidebar-dark": "#101113",
        "outline-dark": "#1D2125",
        "medium-emphasis-dark": "#878889",
        "card-dark": "#101113",
        "card-secondary-dark": "#18191d",
        "badge-default-dark": "#2e2e2e",
        red: "#F44336",
        teal: "#009688",
        star: "#ffa000",
        white: "#ffffff",
        indigo: "#3f51b5"
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"]
      },
      container: {
        center: true
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1680px",
        "2xl": "1920px",
        "3xl": "2160px"
      }
    }
  },
  plugins: [],
  darkMode: "class"
};
