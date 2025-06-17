
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
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "#1E1E2E",
        foreground: "#F5F5F5",
        card: "#212121",
        "card-foreground": "#F5F5F5",
        primary: {
          DEFAULT: "#3B82F6",
          foreground: "#F5F5F5",
          hover: "#1D4ED8",
        },
        secondary: {
          DEFAULT: "#06B6D4",
          foreground: "#F5F5F5",
          hover: "#0891B2",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "#1F1F33",
          foreground: "#A0A0A0",
          hover: "#2C2C4A",
        },
        accent: {
          DEFAULT: "#8B5CF6",
          foreground: "#F5F5F5",
          hover: "#7C3AED",
        },
        popover: {
          DEFAULT: "#1D2433",
          foreground: "#F5F5F5",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["Inter", "Roboto", "sans-serif"],
        heading: ["Inter", "Poppins", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 8px rgba(0, 0, 0, 0.2)",
        "card-hover": "0 6px 12px rgba(0, 0, 0, 0.3)",
        glow: "0 0 15px rgba(0, 0, 0, 0.6)",
        "3xl": "0 35px 60px -12px rgba(0, 0, 0, 0.25)",
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
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        scaleUp: {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.05)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "0 0" }
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" }
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" }
        },
        glow: {
          "0%, 100%": { boxShadow: "0 0 5px rgba(59, 130, 246, 0.2)" },
          "50%": { boxShadow: "0 0 20px rgba(59, 130, 246, 0.6)" }
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
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        fadeIn: "fadeIn 0.5s ease-out",
        slideIn: "slideIn 0.3s ease-out",
        scaleUp: "scaleUp 0.2s ease-out",
        shimmer: "shimmer 2.5s infinite linear",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        float: "float 3s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite",
        "template-glow": "glow 2s ease-in-out infinite",
        'gradient': 'gradient 8s ease infinite',
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(90deg, #3B82F6, #1D4ED8)",
        "gradient-secondary": "linear-gradient(90deg, #06B6D4, #0891B2)",
        "gradient-card": "linear-gradient(145deg, #1F1F33, #2C2C4A)",
        "gradient-card-hover": "linear-gradient(145deg, #2C2C4A, #1F1F33)",
        "gradient-friendly": "linear-gradient(90deg, #8B5CF6, #7C3AED)",
        "gradient-casual": "linear-gradient(90deg, #F59E0B, #D97706)",
        "gradient-creative": "linear-gradient(90deg, #8B5CF6, #7C3AED)",
        "tone-button": "linear-gradient(to right, #3B82F6, #1D4ED8)",
        "tone-button-hover": "linear-gradient(to right, #1D4ED8, #1E40AF)",
        "template-purple": "linear-gradient(135deg, rgba(139,92,246,0.1), rgba(139,92,246,0.3))",
        "template-blue": "linear-gradient(135deg, rgba(59,130,246,0.1), rgba(59,130,246,0.3))",
        "template-green": "linear-gradient(135deg, rgba(6,182,212,0.1), rgba(6,182,212,0.3))",
        "template-pink": "linear-gradient(135deg, rgba(236,72,153,0.1), rgba(236,72,153,0.3))",
        "noise": 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%\' height=\'100%\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
