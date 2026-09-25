import type { Config } from "tailwindcss";

// Colours are CSS variables (RGB triplets, see globals.css) so every
// page flips between the light "menu card" and dark "cart at night"
// themes without per-component dark: variants.
const token = (name: string) => `rgb(var(--c-${name}) / <alpha-value>)`;

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./context/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        base: token("base"), // page background
        card: token("card"), // card surface
        raised: token("raised"), // inputs, chips, secondary buttons
        line: token("line"), // borders
        "line-strong": token("line-strong"),
        ink: token("ink"), // primary text
        soft: token("soft"), // secondary text
        muted: token("muted"), // tertiary text
        gold: token("gold"), // gold for text/icons (contrast-safe per theme)
        accent: token("accent"), // gold for fills (buttons, badges)
        "on-accent": token("on-accent"), // text on accent fills
        veg: token("veg"),
        nonveg: token("nonveg"),
        brown: token("brown"),
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-dm-sans)", "sans-serif"],
        mono: ["var(--font-dm-mono)", "monospace"],
        hand: ["var(--font-hand)", "cursive"],
      },
    },
  },
  plugins: [],
};
export default config;
