import type { Config } from "tailwindcss";

const config: Config = {
  important: true,
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/provider/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      "inherit": "inherit",
      "transparent": "transparent",
      "background": "rgb(var(--color-background) / <alpha-value>)",
      "primary": "rgb(var(--color-primary) / <alpha-value>)",
      "text": "rgb(var(--color-text) / <alpha-value>)",
      "white": "rgb(var(--color-white) / <alpha-value>)",
      "green": "rgb(var(--color-green) / <alpha-value>)",
      "white-light": "rgb(var(--color-white-light) / <alpha-value>)",
      "text-light": "rgb(var(--color-text-light) / <alpha-value>)",
    },
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      aspectRatio: {
        "video": "16/9",
        "square": "1/1",
        "auto": "auto",
        "reverse-video": "9/16",
        "34": "3/4",
        "pikachu-volleyball": "432 / 354",
      }
    },
  },
  plugins: [],
};
export default config;
