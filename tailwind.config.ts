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
          DEFAULT: "#FF416C",
          foreground: "#F5F5F5",
          hover: "#FF4B2B",
        },
        secondary: {
          DEFAULT: "#00C6FF",
          foreground: "#121826",
          hover: "#0072FF",
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
          DEFAULT: "#42E695",
          foreground: "#F5F5F5",
          hover: "#3BB2B8",
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
        sans: ["Roboto", "sans-serif"],
        heading: ["Poppins", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 8px rgba(0, 0, 0, 0.2)",
        "card-hover": "0 6px 12px rgba(0, 0, 0, 0.3)",
        glow: "0 0 15px rgba(0, 0, 0, 0.6)",
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
          "0%, 100%": { boxShadow: "0 0 5px rgba(255, 255, 255, 0.1)" },
          "50%": { boxShadow: "0 0 20px rgba(255, 255, 255, 0.4)" }
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
        "gradient-primary": "linear-gradient(90deg, #FF416C, #FF4B2B)",
        "gradient-secondary": "linear-gradient(90deg, #00C6FF, #0072FF)",
        "gradient-card": "linear-gradient(145deg, #1F1F33, #2C2C4A)",
        "gradient-card-hover": "linear-gradient(145deg, #2C2C4A, #1F1F33)",
        "gradient-friendly": "linear-gradient(90deg, #42E695, #3BB2B8)",
        "gradient-casual": "linear-gradient(90deg, #FFD54F, #FFB74D)",
        "gradient-creative": "linear-gradient(90deg, #6A5ACD, #8A2BE2)",
        "tone-button": "linear-gradient(to right, #2b5876, #4e4376)",
        "tone-button-hover": "linear-gradient(to right, #243B55, #141E30)",
        "template-purple": "linear-gradient(135deg, rgba(108,95,211,0.1), rgba(108,95,211,0.3))",
        "template-blue": "linear-gradient(135deg, rgba(66,153,225,0.1), rgba(66,153,225,0.3))",
        "template-green": "linear-gradient(135deg, rgba(72,187,120,0.1), rgba(72,187,120,0.3))",
        "template-pink": "linear-gradient(135deg, rgba(237,100,166,0.1), rgba(237,100,166,0.3))",
        "noise": 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%\' height=\'100%\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
