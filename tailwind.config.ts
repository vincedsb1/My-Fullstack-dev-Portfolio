import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "rgb(var(--surface) / <alpha-value>)",
          raised: "rgb(var(--surface-raised) / <alpha-value>)",
          sunken: "rgb(var(--surface-sunken) / <alpha-value>)",
        },
        border: "rgb(var(--border) / <alpha-value>)",
        content: {
          DEFAULT: "rgb(var(--text) / <alpha-value>)",
          muted: "rgb(var(--text-muted) / <alpha-value>)",
          subtle: "rgb(var(--text-subtle) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "rgb(var(--accent) / <alpha-value>)",
          strong: "rgb(var(--accent-strong) / <alpha-value>)",
        },
      },
      borderRadius: {
        control: "9999px",
        card: "1.5rem",
        panel: "2rem",
        media: "1.25rem",
      },
      boxShadow: {
        card: "0 1px 2px rgb(0 0 0 / .04),0 8px 24px -12px rgb(0 0 0 / .08)",
        "card-hover":
          "0 2px 4px rgb(0 0 0 / .04),0 20px 40px -16px rgb(0 0 0 / .14)",
        overlay: "0 24px 64px -16px rgb(0 0 0 / .35)",
      },
      fontFamily: { sans: ["var(--font-sans)", "Arial", "sans-serif"] },
      fontSize: {
        display: [
          "clamp(2.5rem,6vw,4.5rem)",
          { lineHeight: "1.12", letterSpacing: "-.04em" },
        ],
        h1: ["clamp(2.25rem,5vw,4rem)", { lineHeight: "1.15" }],
        h2: [
          "clamp(1.75rem,3vw,2.5rem)",
          { lineHeight: "1.2", letterSpacing: "-.025em" },
        ],
        h3: ["1.25rem", { lineHeight: "1.4", letterSpacing: "-0.01em" }],
        lead: ["1.125rem", { lineHeight: "1.625" }],
        body: ["1rem", { lineHeight: "1.625" }],
        small: [".875rem", { lineHeight: "1.5" }],
        eyebrow: [".75rem", { lineHeight: "1.5", letterSpacing: ".16em" }],
      },
      transitionDuration: {
        fast: "150ms",
        base: "250ms",
        slow: "400ms",
        reveal: "600ms",
      },
      transitionTimingFunction: {
        standard: "cubic-bezier(.4,0,.2,1)",
        emphasized: "cubic-bezier(.16,1,.3,1)",
        exit: "cubic-bezier(.4,0,1,1)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      screens: {
        xs: "320px",
        "2xs": "390px",
        "3xs": "480px",
      },
      keyframes: {
        "pulse-subtle": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
      },
      animation: {
        "pulse-subtle": "pulse-subtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
  darkMode: "class",
};

export default config;
