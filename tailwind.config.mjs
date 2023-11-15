/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "hsl(var(--background) / <alpha-value>)",
          accent: "hsl(var(--background-accent) / <alpha-value>)",
        },
        foreground: {
          DEFAULT: "hsl(var(--foreground) / <alpha-value>)",
        },
        grayscale: {
          50: "hsl(var(--grayscale-50) / <alpha-value>)",
          100: "hsl(var(--grayscale-100) / <alpha-value>)",
          200: "hsl(var(--grayscale-200) / <alpha-value>)",
          300: "hsl(var(--grayscale-300) / <alpha-value>)",
          400: "hsl(var(--grayscale-400) / <alpha-value>)",
          500: "hsl(var(--grayscale-500) / <alpha-value>)",
          600: "hsl(var(--grayscale-600) / <alpha-value>)",
          700: "hsl(var(--grayscale-700) / <alpha-value>)",
          800: "hsl(var(--grayscale-800) / <alpha-value>)",
          900: "hsl(var(--grayscale-900) / <alpha-value>)",
          950: "hsl(var(--grayscale-950) / <alpha-value>)",
        },
      },
    },
  },
  darkMode: ["class", '[data-theme="dark"]'],
  plugins: [require("@tailwindcss/typography")],
};
