import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        bg: "#080808",
        bgSoft: "#111111",
        panel: "#151515",
        line: "#1E1E1E",
        paper: "#F2EEE8",
        muted: "#A8A19A",
        accent: "#710009",
        accentHover: "#8A0B12"
      },
      fontFamily: {
        display: ["var(--font-archivo)", "sans-serif"],
        body: ["var(--font-manrope)", "sans-serif"]
      },
      borderRadius: {
        DEFAULT: "2px"
      }
    }
  },
  plugins: []
};

export default config;
