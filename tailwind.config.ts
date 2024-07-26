import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      borderWidth: {
        1.5: "0.09375rem",
      },
      lineHeight: {
        4.5: "1.125rem",
      },
      width: {
        18: "4.5rem",
        128: "32rem",
      },
      height: {
        unset: "unset",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        "inherit": "inherit",
        "transparent": "transparent",
        "background": "rgb(var(--color-background) / <alpha-value>)",
        "background-dark": "rgb(var(--color-background-dark) / <alpha-value>)",
        "text": "rgb(var(--color-text) / <alpha-value>)",
        "text-dark": "rgb(var(--color-text-dark) / <alpha-value>)",
        "white": "rgb(var(--color-white) / <alpha-value>)",
        "white-dark": "rgb(var(--color-white-dark) / <alpha-value>)",
      },
    },
  },
  plugins: [
    require("tailwindcss-safe-area"),
  ],
};
export default config;
