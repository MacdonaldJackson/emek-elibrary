import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // "Emek" (valley) palette — warm parchment + deep valley green + gold accent
        parchment: {
          50: "#fdfbf6",
          100: "#f8f3e8",
          200: "#efe4cc",
        },
        valley: {
          700: "#1f3d2e",
          800: "#173023",
          900: "#0f221a",
        },
        gold: {
          400: "#d9b45a",
          500: "#c79a3a",
          600: "#a87e2b",
        },
      },
      fontFamily: {
        serif: ["Georgia", "Cambria", "Times New Roman", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
