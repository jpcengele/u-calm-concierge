---
description: Wire the generated Ascent Aviation brand imagery into the Vite/React site as a first-class, typed asset library
argument-hint: "[optional: single section slug, e.g. 07-principal]"
---

# Incorporate Ascent Aviation brand imagery

You are integrating the newly generated brand imagery (in `brand-assets/generated/`) into the Vite + React + Tailwind site under `src/`. The goal is a clean, typed, accessible image system — not a pile of ad-hoc `<img>` tags.

Argument (optional): `$ARGUMENTS` — if supplied, scope the incorporation to a single section slug (e.g. `07-principal`). If empty, incorporate the whole active library.

## Source of truth

The authoritative list of images and their metadata is generated, not hand-maintained:

- **`brand-assets/scripts/prompts.py`** — Python module exposing `SECTIONS: List[Section]`, each with a list of `Prompt(id, filename, title, body, aspect)`. Any commented-out `Prompt(...)` is a **disabled** prompt — do not ship it.
- **`brand-assets/generated/manifest.jsonl`** — one JSON object per generated file with `id`, `section`, `path`, `filename`, `aspect`, plus generation metadata. Last-write-wins per `path`.
- **`brand-assets/generated/<NN-slug>/<filename>.jpg`** — the actual JPGs, grouped by section.
- **`brand-assets/generated/_all-review/<id>_<filename>.jpg`** — a flat review folder. Do NOT import from this folder; it is copies for human review. Always import from the section folder.

Treat these three as ground truth. Every image that ships on the site must trace back to an active `Prompt` in `prompts.py`.

## What to do

Work through these phases in order. At the end of each phase, summarise what changed before moving on.

### Phase 1 — Inventory and mapping

1. Parse `prompts.py` via a small throwaway Python script (or by reading it as text) to extract every **active** `(section.slug, id, filename, title, aspect)` tuple. Filter out anything commented-out (lines starting with `#`).
2. Cross-check each row against `manifest.jsonl` — flag any prompt that has no generated file on disk.
3. Walk `src/` and list every current `<img>`, `background-image`, CSS `url(...)`, Tailwind `bg-[url(...)]`, and `import` of a file ending in `.jpg|.jpeg|.png|.webp|.avif`. Build a "currently used images" table.
4. Produce a **proposed mapping** — one row per site location → one `Prompt.id` → one filename → `alt` text (from `Prompt.title`, lightly edited if needed). Prefer:
    - Destination / hero-wide images for page heroes and full-bleed bands.
    - Vignette images (sections 07–09) for customer-story blocks.
    - Cabin / aircraft / FBO (05, 06, 10) for feature sections.
    - Brand-abstract (12) for texture backgrounds and small tiles.
    - Pick `aspect` to match the slot — use 16:9 for hero bands, 4:5 for portrait cards, 1:1 for tiles, 3:4 only when the slot is genuinely tall.
5. Show the mapping to the user (as a compact table) and wait for confirmation before writing code.

### Phase 2 — Asset pipeline

1. Decide asset location: static files go under **`public/brand/<section-slug>/<filename>`** (served at `/brand/<section-slug>/<filename>`). Do not import JPGs through the TS bundler — they belong in `public/` so Vite serves them verbatim and the build stays fast.
2. Copy every **active** JPG from `brand-assets/generated/<section-slug>/` to `public/brand/<section-slug>/`. Never copy files that correspond to a disabled/commented `Prompt`. Use `cp -R` filtered by the active list, not a blanket wildcard — we must not ship the four rejected images (67, 75, 80, 81).
3. Generate lightweight web variants if `sharp` or an equivalent is already installed; otherwise skip and leave a TODO in `brand-assets/README.md` noting that responsive variants can be added later. Do **not** install new heavy dependencies without asking.

### Phase 3 — Typed asset manifest

Create `src/brand/imagery.ts` — a generated, typed manifest the rest of the app imports from. It must:

- Export a `BrandImage` type: `{ id: number; section: string; filename: string; title: string; aspect: "4:5" | "16:9" | "1:1" | "3:4"; src: string; alt: string }`.
- Export `BRAND_IMAGES: readonly BrandImage[]` — one entry per active image, `src` pointing at `/brand/<section-slug>/<filename>`.
- Export helpers: `bySection(slug)`, `byId(id)`, `heroesFor(page)`.
- Include a top banner comment: `// GENERATED FROM brand-assets/scripts/prompts.py — do not hand-edit. Regenerate with the /incorporate-brand-imagery command.`

Regenerate this file deterministically — sorted by `id` — so diffs stay clean. Add a small Node or shell script in `brand-assets/scripts/` called `sync-imagery-manifest.(mjs|sh)` that can re-run the generation step alone, and wire it up as an npm script `"imagery:sync"` in `package.json`.

### Phase 4 — Component integration

1. Add a shared `<BrandImage>` component at `src/components/brand/BrandImage.tsx` that:
    - Takes `id` **or** `image: BrandImage` plus `className`, `priority?: boolean`, `sizes?: string`.
    - Resolves src, alt, and aspect from the manifest — never accepts raw URLs.
    - Applies `loading="lazy"` by default, `loading="eager"` + `fetchpriority="high"` for `priority` (hero).
    - Sets `decoding="async"`, `width`/`height` derived from `aspect` so CLS is zero.
    - Respects Tailwind's `object-cover`/`object-center` for any crop; never stretches.
2. For every slot in the proposed mapping, replace the existing `<img>` / `background-image` with `<BrandImage id={…} …>` or (for backgrounds) a typed helper that resolves to the correct `/brand/...` URL.
3. Do not change page layout, typography, or copy in this pass — imagery only. If a slot is empty (no current image), add the image using the minimal JSX the surrounding component already implies.
4. Preserve the brand `DISCRETION` rule — any alt text that would name a person must describe the moment, not identify them. Use `Prompt.title` as the default alt and only edit for grammar.

### Phase 5 — Accessibility and SEO

1. Confirm every new `<BrandImage>` has non-empty alt text; decorative backgrounds use `aria-hidden="true"` on a parent wrapper, not empty alt on an `<img>`.
2. If `public/index.html` or any page sets Open Graph / Twitter image meta tags, wire them to a hero image from section 01 or 04 at 16:9.
3. Run the site's existing linter (`npm run lint` if defined) and typecheck (`tsc --noEmit` / `npm run build`) and fix only issues introduced by this pass.

### Phase 6 — Verify

1. Run `npm run dev` in the background long enough to confirm the build compiles cleanly and no `/brand/...` URL 404s in the first render of the homepage. (Use a background shell, poll for a few seconds, then stop.)
2. Print a final summary:
    - files copied into `public/brand/` (count)
    - typed manifest entries (count)
    - components touched (list)
    - any prompts still missing a rendered file (list with IDs)
    - any site slots still using non-brand placeholder imagery (list with file:line)
3. Stage the changes with `git add` (do not commit — leave that to the user).

## Guardrails

- **Never import or ship a disabled prompt.** Cross-check the active `Prompt` list from `prompts.py` before copying any file.
- **Never hand-edit `src/brand/imagery.ts`.** It is generated. Regenerate.
- **Never edit files under `brand-assets/generated/`.** They are generator output. If an image is wrong, update the prompt and re-run `generate_imagery.py`.
- **Never install new image-processing dependencies** without asking the user first.
- **Never commit.** Stage only.
- If an instruction here conflicts with existing `CLAUDE.md` or project conventions, stop and ask.

## Definition of done

- Every active `Prompt` has a copy in `public/brand/<section-slug>/` and a row in `src/brand/imagery.ts`.
- Every current site image slot either uses `<BrandImage>` or is explicitly documented as intentionally non-brand (e.g. UI icon).
- Four rejected images (IDs 67, 75, 80, 81) are nowhere in `public/` or `src/`.
- `npm run build` passes. `tsc --noEmit` passes. Homepage renders with no console errors and no 404s on `/brand/...`.
- A `git status` summary is printed showing only additions under `public/brand/`, `src/brand/`, `src/components/brand/`, `brand-assets/scripts/sync-imagery-manifest.*`, `package.json`, and edits to component files that previously held raw `<img>` tags.
