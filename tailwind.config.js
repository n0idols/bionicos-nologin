module.exports = {
  mode: "jit",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        brand: ["Work Sans"],
      },
    },
  },
  plugins: [require("daisyui"), require("@tailwindcss/typography")],
};
