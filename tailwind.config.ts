import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#0B0F17",
        surface: {
          DEFAULT: "#111827",
          raised: "#151D2B",
          subtle: "#0E1420",
        },
        accent: {
          DEFAULT: "#6366F1",
          strong: "#818CF8",
          cyan: "#06B6D4",
        },
        ink: {
          DEFAULT: "#F8FAFC",
          muted: "#A7B0C0",
          faint: "#7E889B",
        },
        line: {
          DEFAULT: "rgba(148, 163, 184, 0.14)",
          strong: "rgba(148, 163, 184, 0.24)",
        },
        success: "#34D399",
        danger: "#F87171",
        warning: "#FBBF24",
      },
      fontFamily: {
        sans: ['"Inter Variable"', "Inter", "system-ui", "sans-serif"],
        display: [
          '"Space Grotesk Variable"',
          '"Space Grotesk"',
          "Inter",
          "system-ui",
          "sans-serif",
        ],
        mono: [
          '"JetBrains Mono Variable"',
          '"JetBrains Mono"',
          "ui-monospace",
          "SFMono-Regular",
          "monospace",
        ],
      },
      fontSize: {
        "display-xl": [
          "clamp(2.8rem, 7vw, 5rem)",
          { lineHeight: "1.02", letterSpacing: "-0.045em", fontWeight: "600" },
        ],
        "display-lg": [
          "clamp(2.35rem, 5.5vw, 4rem)",
          { lineHeight: "1.05", letterSpacing: "-0.04em", fontWeight: "600" },
        ],
        "display-md": [
          "clamp(1.9rem, 4vw, 2.85rem)",
          { lineHeight: "1.1", letterSpacing: "-0.03em", fontWeight: "600" },
        ],
        "display-sm": [
          "clamp(1.5rem, 3vw, 2rem)",
          { lineHeight: "1.15", letterSpacing: "-0.025em", fontWeight: "600" },
        ],
        eyebrow: [
          "0.72rem",
          { lineHeight: "1rem", letterSpacing: "0.18em", fontWeight: "600" },
        ],
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
        30: "7.5rem",
      },
      maxWidth: {
        container: "76rem",
        prose: "68ch",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
      boxShadow: {
        card: "0 24px 60px -32px rgba(2, 6, 23, 0.9)",
        float: "0 30px 80px -40px rgba(6, 182, 212, 0.28)",
        focus: "0 0 0 2px #0B0F17, 0 0 0 4px rgba(6, 182, 212, 0.85)",
      },
      backgroundImage: {
        "grid-fine":
          "linear-gradient(to right, rgba(148,163,184,0.055) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.055) 1px, transparent 1px)",
        "radial-fade":
          "radial-gradient(ellipse at center, rgba(99,102,241,0.18), transparent 68%)",
      },
      backgroundSize: {
        grid: "56px 56px",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "soft-pulse": {
          "0%, 100%": { opacity: "0.45" },
          "50%": { opacity: "0.85" },
        },
        "orbit-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-up": "fade-up 600ms cubic-bezier(0.22, 1, 0.36, 1) both",
        "soft-pulse": "soft-pulse 6s ease-in-out infinite",
        "orbit-slow": "orbit-slow 48s linear infinite",
        shimmer: "shimmer 2.2s linear infinite",
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
