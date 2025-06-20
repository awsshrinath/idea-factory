
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
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
      screens: {
        'xs': '375px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      colors: {
        border: "#334155",
        input: "#334155",
        ring: "#6366f1",
        background: "#0f1419",
        foreground: "#f8fafc",
        card: "#1e2124",
        "card-foreground": "#f8fafc",
        primary: {
          DEFAULT: "#6366f1",
          foreground: "#f8fafc",
          hover: "#5855eb",
        },
        secondary: {
          DEFAULT: "#64748b",
          foreground: "#f8fafc",
          hover: "#475569",
        },
        destructive: {
          DEFAULT: "#ef4444",
          foreground: "#f8fafc",
        },
        muted: {
          DEFAULT: "#1a1d29",
          foreground: "#94a3b8",
          hover: "#2a2d3a",
        },
        accent: {
          DEFAULT: "#6366f1",
          foreground: "#f8fafc",
          hover: "#5855eb",
          gold: "#f59e0b",
        },
        popover: {
          DEFAULT: "#1a1d29",
          foreground: "#f8fafc",
        },
        success: "#10b981",
        warning: "#f59e0b",
        error: "#ef4444",
      },
      borderRadius: {
        lg: "12px",
        md: "8px",
        sm: "6px",
      },
      fontFamily: {
        sans: ["Inter", "Roboto", "sans-serif"],
        heading: ["Inter", "Poppins", "sans-serif"],
      },
      spacing: {
        "18": "72px",
        "22": "88px",
        "safe-top": "env(safe-area-inset-top)",
        "safe-bottom": "env(safe-area-inset-bottom)",
        "safe-left": "env(safe-area-inset-left)",
        "safe-right": "env(safe-area-inset-right)",
      },
      minHeight: {
        'touch': '48px',
        'screen-safe': '100vh',
      },
      minWidth: {
        'touch': '48px',
      },
      boxShadow: {
        card: "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",
        "card-hover": "0 4px 12px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.12)",
        glow: "0 0 20px rgba(99, 102, 241, 0.15)",
        "3xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        soft: "0 2px 8px rgba(0, 0, 0, 0.1)",
        premium: "0 8px 32px rgba(0, 0, 0, 0.12)",
        "mobile-card": "0 2px 8px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.06)",
        "mobile-button": "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",
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
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        scaleUp: {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.02)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "0 0" }
        },
        gentlePulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" }
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" }
        },
        subtleGlow: {
          "0%, 100%": { boxShadow: "0 0 8px rgba(99, 102, 241, 0.1)" },
          "50%": { boxShadow: "0 0 16px rgba(99, 102, 241, 0.2)" }
        },
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        "mobile-slide-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "mobile-fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "micro-scale": {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.02)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        fadeIn: "fadeIn 0.3s ease-out",
        slideIn: "slideIn 0.2s ease-out",
        scaleUp: "scaleUp 0.15s ease-out",
        shimmer: "shimmer 2.5s infinite linear",
        gentlePulse: "gentlePulse 3s ease-in-out infinite",
        float: "float 4s ease-in-out infinite",
        subtleGlow: "subtleGlow 2s ease-in-out infinite",
        "template-glow": "subtleGlow 2s ease-in-out infinite",
        'gradient': 'gradient 8s ease infinite',
        "mobile-slide-up": "mobile-slide-up 0.3s ease-out",
        "mobile-fade-in": "mobile-fade-in 0.2s ease-out",
        "micro-scale": "micro-scale 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(145deg, #1e2124, #2a2d3a)",
        "gradient-secondary": "linear-gradient(145deg, #1a1d29, #2a2d3a)",
        "gradient-card": "linear-gradient(145deg, #1e2124, #2a2d3a)",
        "gradient-card-hover": "linear-gradient(145deg, #2a2d3a, #1e2124)",
        "gradient-accent": "linear-gradient(135deg, #6366f1, #8b5cf6)",
        "gradient-gold": "linear-gradient(135deg, #f59e0b, #d97706)",
        "premium-card": "linear-gradient(145deg, rgba(30, 33, 36, 0.8), rgba(42, 45, 58, 0.6))",
        "glass": "linear-gradient(145deg, rgba(30, 33, 36, 0.1), rgba(42, 45, 58, 0.05))",
      },
      backdropBlur: {
        xs: '2px',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
      },
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
