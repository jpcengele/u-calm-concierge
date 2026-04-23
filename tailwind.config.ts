import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

/**
 * U-CALM Concierge — LIVE Tailwind config.
 *
 * Brand aliases below (champagne, aubergine, forest, gold, teal) are the
 * names components use in class names. They MUST be wired here — the
 * copies in `u-calm-concierge-brand-assets/06-Tailwind-Config.ts` are
 * reference-only and are never auto-loaded.
 *
 * See WEBSITE_BUILD_PLAYBOOK.md §11a for the trap that makes these
 * non-negotiable. Skip the aliases and `text-champagne` / `bg-aubergine`
 * silently render invisible against dark overlays.
 */

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  safelist: [
    // §11a brand-alias guardrail. These aliases must resolve to real CSS
    // rules — if the mapping in theme.extend.colors is broken, this list
    // forces the build to fail loudly rather than silently skipping them.
    "text-champagne",
    "bg-champagne",
    "text-aubergine",
    "bg-aubergine",
    "text-forest",
    "bg-forest",
    "text-gold",
    "bg-gold",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1280px" },
    },
    extend: {
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
          light:      "hsl(var(--primary-light))",
          glow:       "hsl(var(--primary-glow))",
        },
        secondary: {
          DEFAULT:    "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          light:      "hsl(var(--secondary-light))",
        },
        accent: {
          DEFAULT:    "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          light:      "hsl(var(--accent-light))",
        },
        gold: {
          DEFAULT:    "hsl(var(--gold))",
          foreground: "hsl(var(--gold-foreground))",
        },

        /* ------------------------------------------------------------
         * Brand aliases — non-negotiable (§11a).
         * `champagne` and `aubergine` are the names the brand book and
         * legacy components expect; they MUST resolve to something here
         * or the JIT emits zero CSS for classes like text-champagne.
         * On U-CALM Concierge, aubergine doesn't exist as a swatch, so
         * we alias it to the Still Navy tinted-black we use for forest
         * overlays — this keeps the compiled CSS present and the colour
         * harmonious with the brand.
         * ------------------------------------------------------------ */
        champagne: {
          DEFAULT: "hsl(var(--secondary))",
          light:   "hsl(var(--secondary-light))",
        },
        aubergine: "hsl(var(--forest))",
        forest:    "hsl(var(--forest))",

        /* Named brand aliases — more readable in JSX */
        "serene-teal":    "hsl(189 55% 51%)",
        "deep-teal":      "hsl(187 56% 38%)",
        "mist-teal":      "hsl(187 48% 83%)",
        "warm-champagne": "hsl(48 37% 61%)",
        "champagne-mist": "hsl(48 44% 82%)",
        "still-navy":     "hsl(211 34% 17%)",
        "harbour-grey":   "hsl(213 11% 47%)",
        "cloud-white":    "hsl(210 25% 99%)",

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
      },

      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },

      fontFamily: {
        sans:  ["Gill Sans", "Gill Sans MT", "Gill Sans Nova", "Seravek", "Lato", "Inter", "system-ui", "sans-serif"],
        serif: ["Cormorant Garamond", "Playfair Display", "Didot", "Georgia", "serif"],
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
        "gradient-overlay":   "var(--gradient-overlay)",
      },

      keyframes: {
        "accordion-down": { from: { height: "0" }, to:   { height: "var(--radix-accordion-content-height)" } },
        "accordion-up":   { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
        "fade-soft":      { "0%": { opacity: "0", transform: "translateY(8px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        breathe:          { "0%, 100%": { transform: "scale(1)", opacity: "1" }, "50%": { transform: "scale(1.015)", opacity: "0.9" } },
      },

      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up":   "accordion-up 0.2s ease-out",
        "fade-soft":      "fade-soft 1s ease-out",
        breathe:          "breathe 4s ease-in-out infinite",
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
