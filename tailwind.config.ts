import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        saffron: {
          50: "#fff8ed",
          100: "#ffefd4",
          200: "#ffdba8",
          300: "#ffc170",
          400: "#ff9c37",
          500: "#ff7f11",
          600: "#f06407",
          700: "#c74a08",
          800: "#9e3a0f",
          900: "#7f3210",
        },
        maroon: {
          50: "#fdf3f3",
          100: "#fbe5e5",
          200: "#f8d0d0",
          300: "#f2aaaa",
          400: "#e97878",
          500: "#dc4c4c",
          600: "#c73030",
          700: "#a72525",
          800: "#8a2222",
          900: "#5c1a1a",
          950: "#3d0f0f",
        },
        gold: {
          300: "#fde68a",
          400: "#facc15",
          500: "#eab308",
          600: "#ca8a04",
        },
      },
      fontFamily: {
        sans: ["var(--font-devanagari-sans)", "sans-serif"],
        serif: ["var(--font-devanagari-serif)", "serif"],
      },
      keyframes: {
        "scale-pulse": {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.15)", opacity: "0.8" },
        },
      },
      animation: {
        "scale-pulse": "scale-pulse 1.2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
