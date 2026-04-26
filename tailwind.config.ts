import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#f0f2f5",
          elevated: "#ffffff",
          card: "rgba(255, 255, 255, 0.55)",
          input: "rgba(255, 255, 255, 0.8)",
        },
        border: {
          DEFAULT: "rgba(255, 255, 255, 0.5)",
          subtle: "rgba(226, 232, 240, 0.5)",
        },
        text: {
          primary: "#0f172a",
          secondary: "#475569",
          tertiary: "#94a3b8",
        },
        sentiment: {
          positive: "#059669",
          neutral: "#64748b",
          negative: "#f59e0b",
          crisis: "#e11d48",
        },
        accent: {
          DEFAULT: "#8b5cf6",
          hover: "#7c3aed",
        },
      },
      fontFamily: {
        sans: ["'Inter'", "system-ui", "-apple-system", "sans-serif"],
        display: ["'Inter'", "system-ui", "-apple-system", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      animation: {
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
        "pulse-recording": "pulse-recording 1.5s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "float-delayed": "float 6s ease-in-out 2s infinite",
        "float-slow": "float 8s ease-in-out 1s infinite",
        "fade-in-up": "fade-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-in-up-delay-1": "fade-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards",
        "fade-in-up-delay-2": "fade-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards",
        "fade-in-up-delay-3": "fade-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards",
        "orb-breathe": "orb-breathe 3s ease-in-out infinite",
        "orb-ring": "orb-ring 3s ease-in-out infinite",
        "orb-ring-2": "orb-ring-2 3s ease-in-out 0.5s infinite",
        "shimmer": "shimmer 2.5s ease-in-out infinite",
        "spin-slow": "spin 8s linear infinite",
        "blob-morph": "blob-morph 8s ease-in-out infinite",
      },
      keyframes: {
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        "pulse-recording": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.06)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "33%": { transform: "translateY(-12px) rotate(1deg)" },
          "66%": { transform: "translateY(-6px) rotate(-1deg)" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(30px) scale(0.97)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "orb-breathe": {
          "0%, 100%": {
            transform: "scale(1)",
            boxShadow: "0 0 60px 15px rgba(139, 92, 246, 0.3), 0 0 120px 40px rgba(236, 72, 153, 0.15), inset 0 -10px 30px rgba(139, 92, 246, 0.2)",
          },
          "50%": {
            transform: "scale(1.04)",
            boxShadow: "0 0 80px 25px rgba(139, 92, 246, 0.4), 0 0 160px 60px rgba(236, 72, 153, 0.2), inset 0 -10px 30px rgba(139, 92, 246, 0.3)",
          },
        },
        "orb-ring": {
          "0%, 100%": { transform: "scale(1)", opacity: "0.6" },
          "50%": { transform: "scale(1.15)", opacity: "0" },
        },
        "orb-ring-2": {
          "0%, 100%": { transform: "scale(1)", opacity: "0.4" },
          "50%": { transform: "scale(1.3)", opacity: "0" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "blob-morph": {
          "0%, 100%": { borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%" },
          "25%": { borderRadius: "30% 60% 70% 40% / 50% 60% 30% 60%" },
          "50%": { borderRadius: "50% 60% 30% 60% / 30% 60% 70% 40%" },
          "75%": { borderRadius: "60% 40% 60% 30% / 70% 30% 50% 60%" },
        },
      },
      backgroundImage: {
        "mesh": "radial-gradient(at 20% 10%, hsla(250, 100%, 74%, 0.18) 0px, transparent 50%), radial-gradient(at 80% 5%, hsla(189, 100%, 56%, 0.15) 0px, transparent 50%), radial-gradient(at 0% 80%, hsla(340, 100%, 76%, 0.12) 0px, transparent 50%), radial-gradient(at 90% 90%, hsla(45, 100%, 70%, 0.08) 0px, transparent 50%)",
      },
      boxShadow: {
        "glass": "0 8px 32px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.6)",
        "glass-lg": "0 20px 60px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.6)",
        "glass-xl": "0 30px 80px rgba(0,0,0,0.1), inset 0 2px 0 rgba(255,255,255,0.5)",
        "orb": "0 0 60px 15px rgba(139, 92, 246, 0.3), 0 0 120px 40px rgba(236, 72, 153, 0.15), inset 0 -10px 30px rgba(139, 92, 246, 0.2)",
        "orb-recording": "0 0 80px 20px rgba(225, 29, 72, 0.3), 0 0 140px 50px rgba(225, 29, 72, 0.15), inset 0 -10px 30px rgba(225, 29, 72, 0.2)",
        "bento": "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04)",
        "bento-hover": "0 4px 12px rgba(0,0,0,0.06), 0 20px 48px rgba(0,0,0,0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
