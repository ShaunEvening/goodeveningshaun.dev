const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "hsl(var(--color-background) / <alpha-value>)",
          accent: "hsl(var(--color-background-accent) / <alpha-value>)",
        },
        foreground: {
          DEFAULT: "hsl(var(--color-foreground) / <alpha-value>)",
        },
        grayscale: {
          50: "hsl(var(--color-gray-50) / <alpha-value>)",
          100: "hsl(var(--color-gray-100) / <alpha-value>)",
          200: "hsl(var(--color-gray-200) / <alpha-value>)",
          300: "hsl(var(--color-gray-300) / <alpha-value>)",
          400: "hsl(var(--color-gray-400) / <alpha-value>)",
          500: "hsl(var(--color-gray-500) / <alpha-value>)",
          600: "hsl(var(--color-gray-600) / <alpha-value>)",
          700: "hsl(var(--color-gray-700) / <alpha-value>)",
          800: "hsl(var(--color-gray-800) / <alpha-value>)",
          900: "hsl(var(--color-gray-900) / <alpha-value>)",
          950: "hsl(var(--color-gray-950) / <alpha-value>)",
        },
        pink: {
          50: "hsl(var(--color-pink-50) / <alpha-value>)",
          100: "hsl(var(--color-pink-100) / <alpha-value>)",
          200: "hsl(var(--color-pink-200) / <alpha-value>)",
          300: "hsl(var(--color-pink-300) / <alpha-value>)",
          400: "hsl(var(--color-pink-400) / <alpha-value>)",
          500: "hsl(var(--color-pink-500) / <alpha-value>)",
          600: "hsl(var(--color-pink-600) / <alpha-value>)",
          700: "hsl(var(--color-pink-700) / <alpha-value>)",
          800: "hsl(var(--color-pink-800) / <alpha-value>)",
          900: "hsl(var(--color-pink-900) / <alpha-value>)",
          950: "hsl(var(--color-pink-950) / <alpha-value>)",
        },
        violet: {
          50: "hsl(var(--color-violet-50) / <alpha-value>)",
          100: "hsl(var(--color-violet-100) / <alpha-value>)",
          200: "hsl(var(--color-violet-200) / <alpha-value>)",
          300: "hsl(var(--color-violet-300) / <alpha-value>)",
          400: "hsl(var(--color-violet-400) / <alpha-value>)",
          500: "hsl(var(--color-violet-500) / <alpha-value>)",
          600: "hsl(var(--color-violet-600) / <alpha-value>)",
          700: "hsl(var(--color-violet-700) / <alpha-value>)",
          800: "hsl(var(--color-violet-800) / <alpha-value>)",
          900: "hsl(var(--color-violet-900) / <alpha-value>)",
          950: "hsl(var(--color-violet-950) / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          "Segoe UI Symbol",
          '"Noto Color Emoji"',
        ],
        mono: defaultTheme.fontFamily.mono,
      },
    },
  },
  darkMode: ["class", '[data-theme="dark"]'],
  plugins: [require("@tailwindcss/typography")],
};
