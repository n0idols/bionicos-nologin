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
      colors: {
        brand: {
          green: "#9dc24e",
          red: "#ff6b37",
          redhover: "#cc552c",
          yellow: "#feef2c",
        },
      },
      screens: {
        standalone: { raw: "(display-mode: standalone)" },
      },
    },
  },
  plugins: [require("daisyui"), require("@tailwindcss/typography")],
};
