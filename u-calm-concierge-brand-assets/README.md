# U-CALM — Concierge (Parent) Brand Assets

The master concierge-and-lifestyle-management brand. Bound by shared visual
language to the sister brand `U-Calm Aviation`, and intentionally distinct
from the external aviation brand `Ascent Aviation`.

This folder is a **minimum viable pack** extracted from the full brand book
at `../u-calm-brand-book.html` / `../u-calm-brand-book.pdf`. It contains the
three files Claude Design / Artifacts / any tooling need to build on-brand:

| File | Purpose |
|---|---|
| `04-Design-Tokens.json` | W3C DTCG tokens — colour, typography, motion, layout, shadow |
| `05-CSS-Variables.css` | Drop-in CSS custom properties + signature components + light/dark |
| `06-Tailwind-Config.ts` | Tailwind v3 theme extension — binds to the CSS variables |

For the full 13-section brand pack (brand story, positioning, voice and
messaging, services, personas, photography, AI prompt templates, sub-brand
architecture, sales discipline) read `../u-calm-brand-book.html` or
`../u-calm-brand-book.pdf`.

## Brand at a glance

- **Tagline:** *Consider it done.*
- **Soul:** Restored peace of mind.
- **Primary:** Serene Teal `#3BB5C7` — the "U" mark, CTAs, links
- **Primary deep:** Deep Teal `#2A8A98` — hover states, body links
- **Secondary:** Warm Champagne `#BCB17A` — premium accents, Aviation sub-brand
- **Text:** Still Navy `#1C2B3A`
- **Background:** Cloud White `#FBFCFD` (not pure white — slightly cooler)
- **Alt surface:** Linen `#F3F1EA` (warm)
- **Display type:** Cormorant Garamond, 300–400 weight
- **Body type:** Gill Sans, with Lato → Inter as web fallbacks

## The brand family

```
U-CALM (this pack — parent concierge house)
  ├── U-Calm Aviation ← sister face — see ../u-calm-brand-assets/
  └── Cool CALM       ← dormant
```

`Ascent Aviation` is a separately-operated external aviation brand — see
`../brand-assets/` — that **shares operational backbone** but is visually
and verbally distinct. Never cross-reference Ascent from U-CALM-facing
surfaces.

## How to use

Paste as the first instruction in a Claude Design / Artifacts build:

> Use the brand assets in this project to build on-brand for **U-CALM**, the
> concierge and lifestyle-management house. Tagline: *Consider it done.* —
> never invent new taglines. Palette: ivory/cloud-white surfaces, Serene
> Teal primary, Warm Champagne for premium accents. Typography: Cormorant
> Garamond for display and H1–H3, Gill Sans for body and UI. British
> English. No exclamation marks. No emojis. Never say "luxury" or use
> superlatives (ultimate, best, world-class). Pair `05-CSS-Variables.css`
> with `06-Tailwind-Config.ts`. For anything beyond tokens, read the full
> brand book at `../u-calm-brand-book.html`.

## Non-negotiables

1. Serene Teal is the single primary. Don't introduce a second hero colour.
2. Warm Champagne is decorative only — never text (fails AA on Cloud White).
3. No red, orange, neon, vivid yellow, hot pink. The cool palette is the brand.
4. Serene Teal stays constant in dark mode — brand tuning fork.
5. Tagline is *Consider it done.* with a full stop. Sentence case or small caps. Never with an exclamation mark.
6. British English. No emojis. No "luxury". No superlatives without citation.

## Versioning

Extracted from `u-calm-brand-book.html` on 2026-04-22. When the brand book
updates, re-run the extraction and bump this pack.
