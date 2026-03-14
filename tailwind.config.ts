import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        base: "#04080F",
        cyan: {
          DEFAULT: "#06B6D4",
          dim: "rgba(6, 182, 212, 0.15)",
          border: "rgba(6, 182, 212, 0.18)",
          glow: "rgba(6, 182, 212, 0.25)",
          strong: "rgba(6, 182, 212, 0.35)",
        },
        violet: {
          DEFAULT: "#8B5CF6",
          dim: "rgba(139, 92, 246, 0.12)",
        },
        neon: {
          green: "#10B981",
          amber: "#F59E0B",
          red: "#EF4444",
        },
        glass: {
          DEFAULT: "rgba(255, 255, 255, 0.04)",
          md: "rgba(255, 255, 255, 0.07)",
          hover: "rgba(255, 255, 255, 0.08)",
          border: "rgba(255, 255, 255, 0.06)",
        },
        txt: {
          primary: "#E2E8F0",
          secondary: "#94A3B8",
          muted: "#475569",
          ghost: "#334155",
        },
      },
      fontFamily: {
        sans: ['"Inter"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "slide-up": "slideUp 0.5s ease-out forwards",
        "glow-pulse": "glowPulse 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        glowPulse: {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
