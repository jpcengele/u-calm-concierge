---
name: propagate-i18n
description: Extract hardcoded user-visible strings from React components, convert them to i18n keys, and populate all locale JSON files (en + de/fr/it) with brand-voiced translations. Reusable across every brand site.
---

# /propagate-i18n

One-shot workflow that drains hardcoded English from React components and
produces a fully localised site across all target languages.

## When to use

- After writing new pages/components with hardcoded copy (fastest, most
  creative first pass — but leaves the site mono-lingual).
- When adding a new locale to an existing site.
- When auditing an existing site for locale drift ("why does this button
  still say 'Submit' in German?").

## Assumed project layout

- `src/pages/**/*.tsx` — route components
- `src/components/layout/*.tsx` — Header, Footer, shared chrome
- `src/components/brand/*.tsx` — brand-aware components (BrandImage etc.)
- `src/i18n/locales/{en,de,fr,it}.json` — locale files, identical key shape
- `src/brand/config.ts` — brand facts (strapline, expansion, email, etc.)
- `useTranslation()` from `react-i18next` available everywhere

If any of these are missing, stop and ask the user before proceeding.

## Target locales

Default: `en`, `de`, `fr`, `it`. If the project needs others, ask before
running. Always keep `en` as the source of truth.

## Phase 0 — pre-flight audit (always)

Before touching any file:

1. Count files in scope:
   ```
   find src/pages src/components/layout -name "*.tsx" | wc -l
   ```
2. Confirm the 4 locale files exist and parse:
   ```
   for f in src/i18n/locales/{en,de,fr,it}.json; do
     node -e "JSON.parse(require('fs').readFileSync('$f'))" && echo "$f OK"
   done
   ```
3. Confirm useTranslation is in `src/components/brand` if BrandImage uses
   alt text — the component needs its own t() calls.
4. Report a single **go / no-go** paragraph with file count, locale count,
   estimated string count (ballpark from a quick grep), and any blockers.
   No file edits until user says go.

## Phase 1 — extract

For each file in scope, identify **user-visible** strings:

**In scope (translate these):**
- JSX text children: `<p>Hello</p>` → the literal "Hello"
- Attribute strings on user-facing props: `alt`, `aria-label`, `title`,
  `placeholder`, `label`
- String-literal fields in const arrays/objects where the const drives
  rendered UI (e.g. `SERVICE_TILES = [{title: "...", blurb: "..."}]`)
- Button/link text children

**Out of scope (leave hardcoded):**
- URLs (internal routes like `/contact`, external URLs, image paths)
- CSS class names / Tailwind strings
- Email addresses / domain strings (those live in `src/brand/config.ts`
  and are read from `brand.inquiryEmail`, not translated)
- Proper nouns that never translate: "U-CALM", "Cool CALM", brand name,
  city names used verbatim ("Lugano", "Saanen", "Gandria"), historic
  dates in-body ("2013", "08:40"). *Labels around them translate,
  the nouns themselves do not.*
- File paths, identifier keys, code
- `t()` calls themselves or already-localised content
- Test/data IDs

**Edge cases:**
- Interpolation like `"© {year} U-CALM"` — keep the `{{year}}` placeholder,
  translate the rest. Key with `i18next` interpolation.
- JSX with embedded expressions: `<p>Arrived at {time}</p>` — extract as
  two sibling strings or use i18next `<Trans>` component. Default to
  splitting unless the sentence truly requires the expression mid-flow.

## Phase 2 — key naming

Derive keys from file + section context:

- File → top-level namespace: `Index.tsx` → `home.*`, `About.tsx` → `about.*`,
  `PersonaExpat.tsx` → `personas.expat.*`, etc.
- Section within file → nested object: `home.signature.headline`
- Role of string → leaf name:
  - `headline` — the main h1/h2 for a section
  - `eyebrow` — the small-caps kicker above a headline
  - `body` — the paragraph
  - `subheadline` — the lead paragraph below a hero h1
  - `cta` — button label
  - `alt` — image alt text
  - `label` — form label / figure caption
  - `title` — card title
  - `blurb` — card body text
- Index arrays (like persona tiles) → use semantic sub-keys, not
  numeric indices: `home.personaTiles.expat.title`, not
  `home.personaTiles.0.title`. Numeric indices hurt reading the
  translated file later.

Reuse existing keys if the string already appears in `en.json` — don't
duplicate `"Speak with a specialist"` as both `cta.speakSpecialist`
and `home.hero.cta`.

## Phase 3 — rewrite components

For each component:

1. Ensure `import { useTranslation } from "react-i18next";` is present
   (it already is for existing pages; add to new ones).
2. Ensure the component has `const { t } = useTranslation();` at the
   top of the function body.
3. Replace each hardcoded string with `{t("derived.key")}`:
   ```tsx
   // before
   <h2 className="...">A small team, a quiet standard.</h2>
   // after
   <h2 className="...">{t("about.headline")}</h2>
   ```
4. For attribute strings:
   ```tsx
   alt={t("personas.expat.alt")}
   ```
5. For const arrays, restructure so the array holds only data (keys/
   slugs/ids) and rendered strings come from `t()`:
   ```tsx
   // before
   const TILES = [{ slug: "phone", title: "Phone concierge", blurb: "..." }];
   // after
   const TILE_SLUGS = ["phone", "ground", "relocations", ...] as const;
   // in render:
   TILE_SLUGS.map(slug => ({
     slug,
     title: t(`services.tiles.${slug}.title`),
     blurb: t(`services.tiles.${slug}.blurb`),
   }))
   ```
6. For interpolation: `t("footer.rights", { year })` — don't concatenate
   in JSX; use i18next interpolation syntax in the locale string.

## Phase 4 — en.json authoring

1. Read existing `en.json`.
2. For each extracted string, merge it into the appropriate nested
   location in the JSON tree.
3. Preserve existing keys (don't delete keys that are still referenced).
4. Keep key order alphabetical within each nesting level for diff-ability
   over time.
5. Validate the resulting JSON parses.

## Phase 5 — translate to de / fr / it

Translation rules per section 3 of the multilang-brand-website playbook:

**Voice preservation:**
- Match the brand's register per locale (quiet, restrained, declarative
  for U-CALM; more formal/professional for Aviation; etc.). Don't
  translate literally — translate *as the brand would write*.
- Keep sentence cadence similar (short sentences stay short).
- Preserve em-dashes, typographic punctuation, single/double quote style.
- British English for `en` unless the client specifies otherwise —
  already the default on these sites.

**What NOT to translate:**
- Proper nouns: brand name, product names (U-CALM, Cool CALM, CALM
  Aviation), city names, emails.
- Wordplay straplines that only work in source language (on Ascent:
  "Triple A all the way." does not translate — mark it as locked in a
  project note).
- Acronym expansions where the *letters* need to stay as English
  initials (U·C·A·L·M). The expansion words DO translate, but each
  translated word must still start with the matching English letter,
  OR the acronym treatment is re-labelled as "U-CALM signifie..."
  with translated words that don't start with U/C/A/L/M. The
  U-CALM Concierge brand has decided to keep the acronym in English
  source form everywhere — the translated locales show
  "Ultimate Concierge and Lifestyle Management" untranslated in the
  acronym band. (Client decision. Document per project.)

**Structure enforcement:**
- The 4 locale files MUST have identical key shapes. No missing keys.
  Validate with a recursive diff after writing.
- Interpolation placeholders (`{{year}}`, `{{email}}`) are preserved
  verbatim across locales.

**Length sanity:**
- German strings tend ~20–30% longer than English. Re-check long-form
  UI (buttons, nav items) fits the existing layout after translation.
  Flag any string that looks like it'll break a single-line nav.

## Phase 6 — validate

1. JSON parse all 4 locale files.
2. Recursive structural diff: every key in en.json must exist in de, fr,
   it (and vice-versa). Report any mismatches.
3. Run `npm run build` — must pass with no TypeScript errors (catches
   `t()` being called without the hook or typos in key paths).
4. If the project uses `i18next-parser` or similar lint, run it.

## Phase 7 — report

Summarise:
- Files touched (by path).
- Key count added per locale.
- Keys marked "locked in source language" (straplines, wordplay).
- Any warnings (e.g. German strings that might overflow).
- Deploy command (`cp` block) if running in Cowork, or git diff summary
  if running in-repo.

## Never

- Run Phase 3+ without explicit user go after Phase 0's report.
- Translate a locked string (strapline, proper noun, wordplay).
- Edit a single locale in isolation — all four move together.
- Drop `useTranslation()` hook calls from a component mid-refactor.
- Produce a locale file with a key shape that differs from en.json.
- Leave English fallbacks in non-English locales (empty strings, "TODO",
  or just the source English are all forbidden).

## How to apply

- Copy this file into every brand repo as `.claude/commands/propagate-i18n.md`.
- Keep it up to date as new patterns emerge — Stage-2 brand sites will
  surface edge cases this v1 didn't anticipate.
- For the first few runs per brand, do Phase 0 carefully and double-read
  the translations before deploy. The command's value is consistency
  across locales, not zero-review output.
