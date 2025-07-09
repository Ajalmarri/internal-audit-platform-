/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Custom colors for badges/statuses if needed
        sky: {
          // For 'In Progress' or informational items
          100: "#e0f2fe", // bg-sky-100
          200: "#bae6fd", // hover:bg-sky-200
          300: "#7dd3fc", // border-sky-300
          400: "#38bdf8", // bg-sky-400
          500: "#0ea5e9", // border-sky-500
          600: "#0284c7", // text-sky-600
          700: "#0369a1", // text-sky-700
        },
        // Adding more vibrant colors for statuses
        vibrant: {
          blue: {
            DEFAULT: "#3b82f6", // blue-500
            hover: "#2563eb", // blue-600
          },
          yellow: {
            DEFAULT: "#f59e0b", // amber-500
            hover: "#d97706", // amber-600
          },
          green: {
            DEFAULT: "#22c55e", // green-500
            hover: "#16a34a", // green-600
          },
          gray: {
            DEFAULT: "#6b7280", // gray-500
            hover: "#4b5563", // gray-600
          },
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in-up": "fade-in-up 0.5s ease-out forwards",
      },
      boxShadow: {
        soft: "0 4px 14px 0 rgba(0, 0, 0, 0.05)",
        "soft-lg": "0 8px 28px 0 rgba(0, 0, 0, 0.07)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
