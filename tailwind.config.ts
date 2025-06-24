import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
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
        "dashboard-bg": "hsl(var(--dashboard-bg))",
        "dashboard-foreground": "hsl(var(--dashboard-foreground))",
        "dashboard-card": {
          DEFAULT: "hsl(var(--dashboard-card))",
          foreground: "hsl(var(--dashboard-card-foreground))",
        },
        "dashboard-muted": "hsl(var(--dashboard-muted))",
        "sidebar-bg": "hsl(var(--sidebar-bg))",
        "sidebar-foreground": "hsl(var(--sidebar-foreground))",
        "sidebar-border": "hsl(var(--sidebar-border))",
        "sidebar-active": {
          DEFAULT: "hsl(var(--sidebar-active))",
          foreground: "hsl(var(--sidebar-active-foreground))",
        },
        "chart-1": "hsl(var(--chart-1))",
        "chart-2": "hsl(var(--chart-2))",
        "chart-3": "hsl(var(--chart-3))",
        "chart-4": "hsl(var(--chart-4))",
        "chart-5": "hsl(var(--chart-5))",

        /* VETTPRO Custom Variables */
        "glass-bg": "rgba(var(--glass-bg))",
        "glass-border": "rgba(var(--glass-border))",
        "glow-blue": "var(--glow-blue)",
        "glow-purple": "var(--glow-purple)",
        "glow-cyan": "var(--glow-cyan)",
        "glow-pink": "var(--glow-pink)",

        /* Neumorphic Theme */
        neumorphic: {
          bg: "var(--neumorphic-bg)",
          card: "var(--neumorphic-card)",
          "card-end": "var(--neumorphic-card-end)",
          button: "var(--neumorphic-button)",
          "text-primary": "var(--neumorphic-text-primary)",
          "text-secondary": "var(--neumorphic-text-secondary)",
          accent: "var(--neumorphic-accent)",
          border: "var(--neumorphic-border)",
          "dark-shadow": "var(--neumorphic-dark-shadow)",
          "darker-shadow": "var(--neumorphic-darker-shadow)",
        },
      },
      boxShadow: {
        "neumorphic-convex": "var(--neumorphic-shadow-convex)",
        "neumorphic-convex-sm": "var(--neumorphic-shadow-convex-sm)",
        "neumorphic-convex-lg": "var(--neumorphic-shadow-convex-lg)",
        "neumorphic-concave": "var(--neumorphic-shadow-concave)",
      },
      backgroundImage: {
        "neumorphic-gradient": "var(--neumorphic-gradient)",
        "neumorphic-bg-gradient": "var(--neumorphic-bg-gradient)",
      },
      backdropBlur: {
        neumorphic: "var(--neumorphic-blur)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        glow: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideInRight: {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "glow-subtle": {
          "0%, 100%": { "box-shadow": "0 0 5px 0px rgba(var(--glow-color), 0.5)" },
          "50%": { "box-shadow": "0 0 15px 5px rgba(var(--glow-color), 0.5)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up-fade": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        glow: "glow 2s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
        fadeIn: "fadeIn 1s ease-in-out",
        slideInRight: "slideInRight 0.5s ease-out",
        "glow-subtle": "glow-subtle 3s ease-in-out infinite",
        "fade-in": "fade-in 1.5s ease-in-out forwards",
        "slide-up-fade": "slide-up-fade 1s ease-in-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;