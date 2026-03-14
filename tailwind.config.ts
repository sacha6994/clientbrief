import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ice: {
          50: "#F0F7FF",
          100: "#E0EFFF",
          200: "#B9DBFE",
          300: "#7CC2FE",
          400: "#60A5FA",
          500: "#3B82F6",
          600: "#2563EB",
          700: "#1D4ED8",
        },
        frost: {
          DEFAULT: "rgba(255, 255, 255, 0.62)",
          light: "rgba(255, 255, 255, 0.75)",
          heavy: "rgba(255, 255, 255, 0.85)",
          border: "rgba(255, 255, 255, 0.45)",
          subtle: "rgba(255, 255, 255, 0.35)",
        },
        txt: {
          primary: "#0F172A",
          secondary: "#475569",
          muted: "#94A3B8",
          ghost: "#CBD5E1",
        },
      },
      fontFamily: {
        sans: ['"Inter"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "slide-up": "slideUp 0.5s ease-out forwards",
      },
      keyframes: {
        fadeIn: { from: { opacity: "0" }, to: { opacity: "1" } },
        slideUp: { from: { opacity: "0", transform: "translateY(20px)" }, to: { opacity: "1", transform: "translateY(0)" } },
      },
    },
  },
  plugins: [],
};

export default config;
