/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      // pizza: "Roboto Mono, monospace",
      sans: "Roboto Mono, monospace", // override sans font
    },

    // extend is when you do not want to override any default tailwind properties
    extend: {
      height: {
        // best for mobile screens
        screen: "100dvh",
      },
    },
  },
  plugins: [],
};
