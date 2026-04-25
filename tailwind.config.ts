import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Clinical dark palette — Notion meets a medical device
        bg: {
          DEFAULT: "#0a0a0b",
          elevated: "#141416",
          card: "#1a1a1d",
          input: "#0f0f11",
        },
        border: {
          DEFAULT: "#26262a",
          subtle: "#1f1f22",
        },
        text: {
          primary: "#f5f5f7",
          secondary: "#a1a1aa",
          tertiary: "#71717a",
        },
        sentiment: {
          positive: "#10b981",
          neutral: "#a1a1aa",
          negative: "#f59e0b",
          crisis: "#ef4444",
        },
        accent: {
          DEFAULT: "#8b5cf6",
          hover: "#a78bfa",
        },
      },
      fontFamily: {
        sans: ["-apple-system", "BlinkMacSystemFont", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      animation: {
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
        "pulse-recording": "pulse-recording 1.5s ease-in-out infinite",
      },
      keyframes: {
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
        "pulse-recording": {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.05)", opacity: "0.9" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
