/**
 * U-CALM — Tailwind theme extension
 *
 * Drop this whole export into your tailwind.config.ts, or merge its
 * `theme.extend` block into an existing config. Pair with the CSS
 * variables defined in 05-CSS-Variables.css so the HSL tokens resolve.
 *
 * Works out of the box with shadcn/ui.
 */
import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

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
      padding: "2.5rem",
      screens: { "2xl": "1280px" },
    },
    extend: {
      /* ----------------------------------------------------------------
         Colours — all bound to CSS variables so the brand stays
         composable (you can override the variables at a parent level
         to shift into a sub-brand palette).
      ---------------------------------------------------------------- */
      colors: {
        border:      "hsl(var(--border))",
        input:       "hsl(var(--input))",
        ring:        "hsl(var(--ring))",
        background:  "hsl(var(--background))",
        foreground:  "hsl(var(--foreground))",
        linen:       "hsl(var(--linen))",

        primary: {
          DEFAULT:    "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          deep:       "hsl(var(--primary-deep))",
          soft:       "hsl(var(--primary-soft))",
        },
        secondary: {
          DEFAULT:    "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          light:      "hsl(var(--secondary-light))",
        },
        champagne: {
          DEFAULT: "hsl(var(--secondary))",
          light:   "hsl(var(--secondary-light))",
        },
        muted: {
          DEFAULT:    "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        destructive: {
          DEFAULT:    "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        success: { DEFAULT: "hsl(var(--success))" },
        warning: { DEFAULT: "hsl(var(--warning))" },

        popover: {
          DEFAULT:    "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT:    "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

        /* Named brand aliases — sometimes easier to read in JSX */
        "serene-teal":    "hsl(189 55% 51%)",
        "deep-teal":      "hsl(187 56% 38%)",
        "mist-teal":      "hsl(187 48% 83%)",
        "warm-champagne": "hsl(48 37% 61%)",
        "champagne-mist": "hsl(48 44% 82%)",
        "still-navy":     "hsl(211 34% 17%)",
        "harbour-grey":   "hsl(213 11% 47%)",
        "cloud-white":    "hsl(210 25% 99%)",
      },

      borderRadius: {
        sm:   "8px",
        md:   "12px",
        lg:   "var(--radius)",   // 14px default
        xl:   "20px",
        pill: "999px",
      },

      fontFamily: {
        sans:  ["Gill Sans", "Gill Sans MT", "Gill Sans Nova", "Seravek", "Lato", "Inter", "system-ui", "sans-serif"],
        serif: ["Cormorant Garamond", "Playfair Display", "Didot", "Georgia", "serif"],
      },

      fontSize: {
        /* Fluid scale — matches --step-* in the CSS vars file */
        "hero":  ["clamp(3rem, 6vw, 6rem)",          { lineHeight: "1.1", letterSpacing: "-0.01em",   fontWeight: "300" }],
        "title": ["clamp(2.25rem, 4vw, 3.5rem)",     { lineHeight: "1.2", letterSpacing: "-0.005em",  fontWeight: "400" }],
        "head":  ["clamp(1.5rem, 2.5vw, 2.25rem)",   { lineHeight: "1.3", fontWeight: "500" }],
        "sub":   ["clamp(1.125rem, 1.6vw, 1.5rem)",  { lineHeight: "1.4", fontWeight: "700" }],
        "lead":  ["1.25rem",                         { lineHeight: "1.5", fontWeight: "300" }],
        "body":  ["1.0625rem",                       { lineHeight: "1.65" }],
        "small": ["0.875rem",                        { lineHeight: "1.5" }],
        "eyebrow": ["0.75rem",                       { lineHeight: "1.4", letterSpacing: "0.15em", fontWeight: "700" }],
      },

      boxShadow: {
        calm:    "var(--shadow-calm)",
        float:   "var(--shadow-float)",
        whisper: "var(--shadow-whisper)",
      },

      backgroundImage: {
        "gradient-primary":   "var(--gradient-primary)",
        "gradient-champagne": "var(--gradient-champagne)",
        "gradient-calm":      "var(--gradient-calm)",
        "gradient-horizon":   "var(--gradient-horizon)",
      },

      transitionTimingFunction: {
        calm: "cubic-bezier(0.25, 0.8, 0.25, 1)",
      },

      transitionDuration: {
        calm: "500ms",
        soft: "300ms",
      },

      keyframes: {
        "fade-soft": {
          "0%":   { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        breathe: {
          "0%, 100%": { transform: "scale(1)",     opacity: "1"   },
          "50%":      { transform: "scale(1.015)", opacity: "0.9" },
        },
        drift: {
          from: { transform: "translateX(-2%)" },
          to:   { transform: "translateX(2%)"  },
        },
      },

      animation: {
        "fade-soft": "fade-soft 1s ease-out",
        breathe:     "breathe 4s ease-in-out infinite",
        drift:       "drift 8s ease-in-out infinite alternate",
      },

      spacing: {
        section: "6rem",
        gutter:  "2rem",
      },

      maxWidth: {
        "prose-calm": "68ch",   /* slightly wider than Tailwind default — suits Gill Sans */
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
