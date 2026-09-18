import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0A0A0A",
        bgSoft: "#141412",
        panel: "#171613",
        line: "#2A2926",
        paper: "#F2F0EB",
        muted: "#8A8A8A",
        accent: "#B3402E"
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
