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
      backgroundImage: {
        "hero-pattern":
          "linear-gradient(to right bottom, rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.1)), url('../public/hero2.jpg')",
      },
    },
  },
  plugins: [require("daisyui"), require("@tailwindcss/typography")],
  // daisyui: {
  //   themes: [
  //     {
  //       mytheme: {
  //         /* your theme name */ primary: "#991b1b" /* Primary color */,
  //         "primary-focus": "#7f1d1d" /* Primary color - focused */,
  //         "primary-content":
  //           "#ffffff" /* Foreground content color to use on primary color */,

  //         secondary: "#f6d860" /* Secondary color */,
  //         "secondary-focus": "#f3cc30" /* Secondary color - focused */,
  //         "secondary-content":
  //           "#ffffff" /* Foreground content color to use on secondary color */,

  //         accent: "#991b1b" /* Accent color */,
  //         "accent-focus": "#7f1d1d" /* Accent color - focused */,
  //         "accent-content":
  //           "#ffffff" /* Foreground content color to use on accent color */,

  //         neutral: "#3d4451" /* Neutral color */,
  //         "neutral-focus": "#2a2e37" /* Neutral color - focused */,
  //         "neutral-content":
  //           "#ffffff" /* Foreground content color to use on neutral color */,

  //         "base-100":
  //           "#ffffff" /* Base color of page, used for blank backgrounds */,
  //         "base-200": "#f9fafb" /* Base color, a little darker */,
  //         "base-300": "#d1d5db" /* Base color, even more darker */,
  //         "base-content":
  //           "#1f2937" /* Foreground content color to use on base color */,

  //         info: "#2094f3" /* Info */,
  //         success: "#009485" /* Success */,
  //         warning: "#ff9900" /* Warning */,
  //         error: "#ff5724" /* Error */,
  //       },
  //     },
  //   ],
  // }
};
