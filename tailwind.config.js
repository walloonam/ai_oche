/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        cocoa: "#3b2a21",
        cream: "#fff7ef",
        sand: "#f2e2cd",
        blush: "#f6d1a9",
        ink: "#2c2420",
        accent: "#f2a23a",
      },
      fontFamily: {
        display: ["'Pixelify Sans'", "system-ui", "sans-serif"],
        body: ["'Nunito'", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 20px 40px rgba(55, 37, 25, 0.15)",
      },
      keyframes: {
        floaty: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-5px)" },
        },
      },
      animation: {
        floaty: "floaty 3.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
