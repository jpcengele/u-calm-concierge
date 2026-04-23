# Multi-language brand website playbook

**Purpose.** This is the template to open when starting any brand website build — aviation, hospitality/concierge, legal, fashion, anything. The hardest problems are not subject-specific. They are patterns: how to generate dozens of consistent images, how to keep four languages in parallel without drift, how to apply "brand" when the client has no brand book, how to avoid the silent routing/scroll bugs that waste hours, what AI image generators reliably get wrong, how to set up a Supabase + Vercel + Resend backend on day one so forms and emails just work.

Next projects to apply this to: **U-calm Aviation** and **U-calm Concierge** — both already have brand books. Update this file as we learn more. Do not delete entries; mark them "superseded" if a better approach emerges.

---

## 0. How to use and share this playbook

This file lives in three places:

1. **Claude's auto-memory** (`.auto-memory/reference_multilang_brand_website_playbook.md`) — loads automatically for J-P in any Cowork session where relevant.
2. **Project workspace copy** (`WEBSITE_BUILD_PLAYBOOK.md` at the root of any brand-website project) — travels with the repo, visible to collaborators, survives tool changes.
3. **Potentially a Claude skill** — the most portable form. See section 16 for how to turn this into `skills/multilang-brand-website/SKILL.md` when there's time.

When sharing with someone new, hand them the workspace copy. It is deliberately written to be readable by another designer, developer, or AI assistant with no prior context.

When starting a new project, the first step is to copy this file into the new repo as `WEBSITE_BUILD_PLAYBOOK.md` and have Claude read it before writing any code.

---

## 1. Image generation at scale (10+ images, consistent look)

The cliché trap is stock-brochure imagery — identical-looking people in identical suits in identical interiors. Fight this at the prompt level, not the curation level.

**Prompt-level rules:**
- Explicitly describe **distinct, diverse people** — different ages, ethnicities, builds, hair. Never "a man in a suit"; always "a woman in her early 40s with dark curly hair, tailored navy blazer, mid-laugh".
- Include **modern tailoring** references (not just "suit" — "unstructured wool jacket, mock-neck, loafers").
- Anchor every scene with a **human moment** — someone handing someone else something, a glance, a pause. Empty rooms photograph as stock.
- Forbid mood lighting clichés unless the scene demands them: no defaulting to "golden hour dusk".
- State camera and film language when appropriate ("medium-format editorial, 50mm, available light") — makes the output more photographic, less CGI.

**Asset management pattern:**
- Typed manifest file (e.g. `src/brand/imagery.ts`) exporting `BRAND_IMAGES` array, `PAGE_HEROES` named constants, and `byId(n)` / `bySection(s)` accessors.
- A `<BrandImage id={n} />` component that handles CLS-safe dimensions, `priority` for above-the-fold, and `sizes` for responsive.
- A generation script (`generate_imagery.py` in Ascent's case) that reads a prompt list and writes to `manifest.jsonl`.
- Sections organised by theme (`01-alpine-winter`, `02-mediterranean-summer`) so filters like "all destination imagery except the featured four" are trivial.

**Revision workflow:**
- After review, some prompts get revised, some get disabled. Keep disabled ones with `enabled: false` — never delete. The record of *why* we rejected something is valuable.
- **Always `rm` matching output files before regenerating** — `--force` flags in generators are not reliable. Also prune the corresponding lines from `manifest.jsonl` or you'll get stale entries pointing at missing files.
- Batch regenerations: group revised prompts, clear, re-run, review together.

**How to apply:** At the start of a new project, copy this structure wholesale. Do not invent a new manifest format per project.

---

## 2. AI image-generation tells to avoid

Every AI image model has a consistent set of failure modes. Assume they will appear and review for them.

**Physical anatomy:**
- **Hands and fingers.** Six fingers, fused fingers, misaligned knuckles. Any close-up of a hand needs extra scrutiny; better yet, crop hands out of frame or show them holding a specific object so the model has an anchor.
- **Eyes and mouths.** Asymmetric irises, mismatched pupil sizes, teeth that don't align. Portraits with closed or averted eyes are more forgiving than direct gaze.
- **Animal proportions.** Dogs, horses, cats often come out with wrong head-to-body ratio or extra legs. If an animal is incidental, prompt for it partially occluded ("a golden retriever visible only from the chest up, seated beside the owner").

**Object / scene tells:**
- **Hallucinated text.** Any signage, book spines, screens, or labels will likely show garbled pseudo-letters. Either prompt text-free scenes or accept that text will need compositing in post.
- **Physical impossibilities on tools.** An Ascent prompt (#68 desk-work) had a letter opener whose geometry was wrong — revised to remove the object. Rule: if an object has a specific known shape users will recognise, either name it precisely or omit it.
- **Holding geometry.** A ski bag held at an angle that makes no sense (#71), a dog carrier with proportions that suggest the dog is the size of a cat (#73). Test: "could a human actually hold this object this way?"
- **Crowding at stairs / doorways.** A boarding scene with three people in the frame often has them physically overlapping. Prompt for explicit spacing ("spaced at arm's length, one foot ahead of the other").
- **Naturalism in family scenes.** The family-arrival-by-car prompt (#76) originally looked staged — fixed by adding "candid, unposed, mid-conversation, nobody looking at camera".

**Lighting inconsistency:**
- Shadow direction that disagrees with the implied light source — especially when combining indoor and window light.
- Reflections on windows that don't match the scene behind them.

**Text artifacts in-image:**
- Watermarks, signatures, or partial brand marks. Always scan a generated image's corners at 200% before approving.

**How to apply:** Build a one-page "tells checklist" PDF for every project and run every generated image against it before placement. Reject and revise, don't paper over.

---

## 3. Multi-language (i18n) discipline

We shipped English, German, French, Italian in parallel on Ascent. Failure modes were rarely obvious.

**Structural rules:**
- One JSON file per locale (`src/i18n/locales/{en,de,fr,it}.json`), identical key shape.
- When adding a new key to one locale, **add it to all four in the same commit**. Drift creates invisible bugs where some users see English fallbacks in the middle of German pages.
- For arrays in translations (e.g. `features: ["…", "…"]`), call with `t("key", { returnObjects: true }) as string[]`. Without `returnObjects`, i18next returns the string form of the object, which renders nothing useful.
- Validate programmatically after edits:
  ```js
  // Does every key listed resolve to a string in every locale?
  node -e "['en','de','fr','it'].forEach(l => { /* walk keys */ })"
  ```

**Content rules:**
- **Fixed phrases stay literal in every locale.** The Ascent strapline "Triple A all the way." does not translate — the wordplay only works on English initials. Document these in a project note so future Claude doesn't "helpfully" translate them.
- British English by default unless the client specifies American. "Savour" not "savor", "organisation" not "organization". Important for Europe-facing brands.
- Proper nouns (company name, city names) stay consistent across locales.
- Currency, dates, numbers: locale-format via `Intl.NumberFormat` / `Intl.DateTimeFormat`, not string templating.

**How to apply:** Never edit one locale file in isolation. Read all four, edit all four, validate all four.

---

## 4. Applying "brand" when the client has no brand document

Many clients will not have a brand book. You will have a logo, maybe a tagline, and taste preferences. That is enough if you build a *brand scaffold* on day one.

**The scaffold:**
- Pick a palette: **one primary (deep), one accent (warm), one neutral (light), one text-dark**. Four colours. Stop.
- Forbid pure `#000000` — use a tinted black (e.g. `rgba(47,59,47,X)` forest green for Ascent). Gives warmth and stops the page feeling like a template.
- Two typefaces: one serif for display, one sans for UI/body. Google Fonts has enough — Playfair Display + Inter is a reliable pair.
- Overlay rules: when layering text on photos, always use a **gradient** (`linear-gradient(180deg, rgba(X,Y,Z,0) 35%, rgba(X,Y,Z,0.75) 100%)`), never a flat tint.
- Image aspect ratios as a vocabulary: `aspect-[4/5]` for portrait editorial, `16/9` for full-width bands, `1/1` for small accents. Consistent set reads as intentional even if every image is a different subject.

**How to apply:** Before writing any components, define these six things in a `src/brand/` folder. 30 minutes. Saves three weeks of inconsistency.

---

## 5. Layout pitfalls to pre-empt

These are bugs that look catastrophic but are one-line fixes. Add them to the initial scaffold of every SPA build.

**ScrollToTop on route change (react-router-dom).** React Router preserves scroll Y across navigations. Click a footer link from the bottom of a long page → you land mid-page on the new page → looks like a blank page. Fix:
```tsx
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo({ top: 0, left: 0, behavior: "instant" }), [pathname]);
  return null;
};
```
Mount inside `SharedLayout`. Do this before you ship any page.

**HMR corruption after big refactors.** Vite will occasionally serve stale modules after a large cross-file edit. Symptom: one page blank, others work, no console errors, static checks clean. Fix: kill dev server, `npm run dev` again, Cmd+Shift+R. Don't debug for an hour before trying this.

**npm optional-dependency bug on Rollup.** Error like `Cannot find module @rollup/rollup-linux-arm64-gnu` after a package-lock shuffle. Fix: `rm -rf node_modules package-lock.json && npm install`. Known npm bug. Do not commit the regenerated package-lock unless it's a small diff.

**SPA routes must be above catch-all.** `<Route path="*" element={<NotFound />} />` last, always. Every new route goes *above* it.

---

## 6. Accessibility defaults

Ship these from day one. Retrofitting accessibility is painful.

**Images:**
- Decorative images (texture bands, gradient backdrops, abstract visuals): `alt=""` — this tells screen readers to skip them.
- Meaningful images (portraits with narrative, destination tiles): real `alt` describing the subject, not the filename.
- Gradient overlay divs: `aria-hidden="true"` on the overlay so it doesn't get announced.

**Interactive elements:**
- Icon-only buttons (menu, close, language toggle): must have a visible label or `aria-label` / `sr-only` span.
- Focus rings visible on all interactive elements. Do not remove focus outlines without replacing them. Tailwind's `focus-visible:ring-2 focus-visible:ring-gold` is a reliable default.
- Modal dialogs: use shadcn's Dialog (handles focus trap, ESC to close, aria roles). Don't hand-roll.

**Document-level:**
- `<html lang="…">` must update when the user switches language — otherwise screen readers keep announcing in the wrong language.
- Heading hierarchy: one `<h1>` per page, sections use `<h2>`, subsections `<h3>`. Never skip levels for styling; style via CSS.
- Colour contrast: gold accent colour against white background often fails WCAG AA. Use the gold on dark backgrounds only; on light backgrounds fall back to a text-dark.

**How to apply:** Run Lighthouse accessibility audit before every deploy. Target ≥ 95.

---

## 7. Performance patterns

**Images:**
- Hero / above-the-fold: `priority` prop / `loading="eager"` + `fetchpriority="high"`. Everything else lazy-loads by default.
- Always set explicit `width`/`height` or an `aspect-ratio` container — prevents CLS (cumulative layout shift).
- `sizes` attribute tells the browser which responsive variant to pick: `sizes="(min-width: 1024px) 50vw, 100vw"` for a half-width-on-desktop image.
- Use WebP/AVIF if the generator supports it; fall back to JPG. PNG only for vector-like UI assets with transparency.

**Fonts:**
- `font-display: swap` on custom fonts — avoids invisible text during load.
- Preload the single most-used font file: `<link rel="preload" as="font" href="…" crossorigin>`.

**Bundle:**
- Route-based code splitting via React Router's `lazy` for non-landing routes.
- Audit the final bundle with `vite build --mode=analyse` before first deploy.

---

## 8. Form and CTA patterns

**The BookingInquiryDialog pattern (reusable across projects):**
- One Dialog component imported into every page that needs it.
- Each page holds its own open/close state (`const [open, setOpen] = useState(false)`) — avoids a single global state that gets stuck.
- Form uses `react-hook-form` + `zod` for validation. Shadcn's `Form` wrapper handles accessibility.
- Include a honeypot field (hidden `input` named something like `website` that bots fill in; reject on submit if non-empty).
- Submit via `supabase.functions.invoke("<name>", { body })` to a Supabase edge function (see section 14b for the full stack). Don't hand-roll SMTP; don't call third-party email APIs from the browser — API keys leak.
- **Every form that submits to a backend should also persist to a DB table**, even if the primary action is "send me an email". Emails get lost, bounced, filtered — a row in `contact_inquiries` is evidence the submission happened.

**CTA hierarchy:**
- **One primary button per viewport.** Multiple primary buttons dilute the action. Secondary actions use outline variant.
- Primary button copy uses verbs: "Speak with a Specialist", "Plan Your Journey". Never "Click here" or "Submit".
- Every CTA should resolve to *exactly one* user intent. If two CTAs lead to the same form, consolidate.

---

## 9. Language-toggle UX

**What works:**
- Small pill or dropdown in the top-right of the header. Text-only labels ("EN · DE · FR · IT") — no flags. Flags are ambiguous (Swiss German? Austrian German?) and politically fraught.
- Active locale styled with `text-foreground`, others `text-muted-foreground`.
- On click, persist choice to `localStorage` so next visit opens in the same language.
- On first visit, read `navigator.language` and pick the best match from available locales.

**What to avoid:**
- Oversized flag pickers. They dominate the header and age poorly.
- Placing the toggle in the footer only — users want it visible upfront.
- Routing locale via URL prefix (`/de/…`) vs. in-memory state — URL-prefix is correct for SEO but a bigger architectural commitment; default to in-memory + `lang` attribute updates unless SEO is day-one critical.

---

## 10. SEO and metadata for multilingual sites

**Per-route, per-locale metadata:**
- `<title>` and `<meta name="description">` unique per route and locale.
- `<link rel="canonical">` per route.
- `hreflang` alternates for every locale variant:
  ```html
  <link rel="alternate" hreflang="en" href="https://site.com/services" />
  <link rel="alternate" hreflang="de" href="https://site.com/de/services" />
  <link rel="alternate" hreflang="x-default" href="https://site.com/services" />
  ```
- Open Graph image per route (`og:image`) — keeps link previews from looking generic.
- Structured data (JSON-LD) for the organisation at minimum — `@type: Organization` with name, logo, contact, sameAs social links.

**Sitemap:**
- `sitemap.xml` with `<xhtml:link rel="alternate">` entries for each locale of each URL.
- Submit to Google Search Console and Bing Webmaster on launch.

**Tooling:**
- Use `react-helmet-async` or the framework's built-in head management.
- Generate sitemap at build time from the route config so it can never drift from actual routes.

---

## 11. Content-vs-brand separation (the key to portability)

This is what makes the playbook work across subject matter. You should be able to swap the *client* without rewriting the *system*.

**What lives where:**
- `src/i18n/locales/*.json` — all user-facing copy. No hardcoded strings in components.
- `src/brand/tokens.ts` (or Tailwind config extensions) — palette, type scale, spacing, radius. All colour / type references go through these tokens.
- `src/brand/imagery.ts` — image manifest. Components reference images by ID, not by URL.
- `src/config/navigation.ts` — single source of truth for header/footer link structure.
- `src/config/services.ts` (or similar) — structured data for service cards, destinations, etc. Populated from translations.

**Swapping a client then means:**
1. Update the i18n JSON files with the new client's copy.
2. Update `brand/tokens.ts` with the new palette and fonts.
3. Regenerate imagery with new prompts into `brand/imagery.ts`.
4. Update `config/navigation.ts` if the site map differs.

Components, layouts, accessibility, performance, SEO — none of that changes. That's the test of whether you've separated correctly.

### 11a. The brand-alias wiring trap (Ascent hero, 2026-04-22)

**Symptom:** a named brand colour renders as invisible or off-looking in production. Michael spotted this on the Ascent hero — the "London · Lugano" eyebrow styled with `text-champagne/90` looked like a grey ghost against the dark overlay. Same bug was silently live on the CTA section's eyebrow.

**Root cause:** Lovable and similar scaffolders drop a `brand-assets/` directory containing a **reference** `06-Tailwind-Config.ts` and `05-CSS-Variables.css`. Those are *documentation*, not the live config. The project's real Tailwind file is `tailwind.config.ts` at the repo root, and it only exposes whatever colours you wired into it. Aliases like `champagne`, `aubergine`, `forest` that appear in `brand-assets/06-Tailwind-Config.ts` never reach the JIT — so classes like `text-champagne/90` generate no CSS, and the text falls back to whatever the browser inherits, which on dark overlays looks like near-invisible grey.

**How to verify:** after a build, grep the compiled CSS:

```bash
grep -oE "\.(text|bg)-(champagne|aubergine|forest)[^{]*\{[^}]*\}" dist/assets/index-*.css
```

If the named classes your components use aren't in there, Tailwind isn't generating them. The components still compile — there's no TypeScript error — which is why this hides until you look at the rendered page against a dark background.

**How to fix (template for every new brand):**

```ts
// tailwind.config.ts — alongside the existing primary/secondary/accent entries
champagne: {
  DEFAULT: 'hsl(var(--accent))',
  light:   'hsl(var(--accent-light))',
},
aubergine: 'hsl(var(--secondary))',  // NOT --primary (that's the signal colour, red on Ascent)
forest:    'hsl(var(--forest))',
```

Cross-check the HSL variables in `src/index.css` to know what each alias actually points at — `--primary` on Ascent is the **red** signal colour, not aubergine. Getting the mapping wrong flips the hero + CTA background to red on next deploy.

**Why this matters for every future brand:** U-CALM Aviation and U-CALM Concierge both ship with `brand-assets/` folders containing the same pattern. Scaffolding a new brand site without copying those aliases into the live `tailwind.config.ts` reintroduces the bug on day one.

---

## 12. Consolidated forbidden rules

One-glance checklist. If any of these appear in a PR, block it.

- `#000000` or `#FFFFFF` used for text or background. Always tint.
- Hardcoded English strings in component source. All copy in i18n.
- `<h1>` below the fold.
- "Click here" or "Submit" as CTA copy.
- Icon-only buttons without a visible or screen-reader label.
- Stock golden-hour imagery unless the scene specifically demands it.
- Translated fixed phrases (straplines, brand names, wordplay).
- Routes added below the catch-all `*` route.
- Images without `width`/`height` or `aspect-ratio` container.
- More than one primary-styled button in a single viewport.
- Brand-alias colour classes (`text-champagne`, `bg-aubergine`, `text-forest`, etc.) used in components without the alias being wired into the live `tailwind.config.ts` — see 11a. Grep the compiled CSS before merging.

---

## 13. Process habits that saved us

- **Commit in thematic chunks.** "Place ~50 brand images" is a commit. "Add ScrollToTop" is another. Bisecting later becomes impossible if you bundle unrelated changes.
- **Branch per redesign, then merge promptly.** `redesign/homepage-v1` gave us room to experiment without contaminating main. But: once the redesign is live, **merge back to main and delete the branch**. Long-lived feature branches bite you because the production URL on Vercel tracks `main` — so the live site keeps showing old work even though "all the new stuff is built". Hard rule: if it's live, it's on `main`.
- **Slash commands / skills for repeated workflows.** If you've done a workflow more than twice (image incorporation, locale key propagation, prompt revision), codify it.
- **Save surprises to memory, not just corrections.** When a non-obvious approach worked — e.g. "single coordinated commit beat splitting into N small PRs" — write that down. Drift away from validated judgment calls is as bad as repeating past mistakes.
- **Review before regenerating.** A five-minute pass over generated imagery saves two hours of later rework.
- **Backend/frontend congruence check before every merge.** If a PR touches forms, edge functions, DB schema, or auth, verify in order: (a) every edge function the frontend calls exists in the Supabase dashboard with the exact logical name; (b) every table/RPC the edge function uses exists in the DB (re-run `migration-bundle.sql` if unsure); (c) every env var the frontend needs is set in CI/Vercel for **both Production and Preview** — and critically, the env var **name** the deploy workflow injects matches the name `client.ts` reads (see 14d: `VITE_SUPABASE_PUBLISHABLE_KEY` vs `VITE_SUPABASE_ANON_KEY` cost us an evening on Ascent); (d) test end-to-end on a preview deployment, not just locally, and **include an auth flow in the smoke test** if the site has `/login` — edge-function smoke tests alone will miss the env-var naming bug because functions with JWT OFF don't check the apikey. Locally-working ≠ deployed-working.
- **Repo is the source of truth for backend code too.** Even when deploying edge functions via the Supabase dashboard, keep `supabase/functions/<name>/index.ts` and `migration-bundle.sql` in the repo. If the dashboard-deployed version diverges from the repo, fix the repo and re-deploy — don't leave the drift. Without this, "it works on prod but the repo shows something else" becomes untraceable.

---

## 14. Opening checklist — new brand website in 60–90 minutes

1. Create `src/brand/` with `tokens.ts` (palette, typography), overlay utilities, aspect-ratio vocabulary. **Also wire every brand-alias colour (`champagne`, `aubergine`, `forest`, etc.) into the live `tailwind.config.ts` — `brand-assets/06-Tailwind-Config.ts` is reference material, not auto-loaded. See 11a.**
2. Scaffold `src/i18n/locales/` with the target languages, identical key shape.
3. Create `src/components/layout/SharedLayout.tsx` with `<ScrollToTop />` mounted.
4. Create `src/brand/imagery.ts` manifest skeleton + `<BrandImage>` component.
5. Create `src/config/navigation.ts` and `src/config/routes.ts` — single sources of truth.
6. Set up form infra: shadcn Dialog + Form + zod resolver wired to `supabase.functions.invoke(...)` (not a placeholder fetch).
7. Language toggle in the header, text-only, localStorage-persisted.
8. Accessibility baseline: `lang` attribute wired to locale state, focus rings visible, skip-to-content link.
9. SEO baseline: `react-helmet-async`, default `<title>`, `<meta description>`, canonical, OG image.
10. **Backend day-one setup (see section 14b):** create a **standalone Supabase project** (not Lovable Cloud or any wrapper); add `VITE_SUPABASE_URL` + `VITE_SUPABASE_PUBLISHABLE_KEY` as GitHub Actions secrets (for the Hostinger build step); create `migration-bundle.sql` in repo root with baseline tables (`contact_inquiries`, `contact_rate_limit`) + the `check_contact_rate_limit` RPC; run it in Supabase SQL Editor.
11. **Edge functions (see section 14c):** deploy `submit-contact` (contact form → DB + rate-limit) and `send-booking-inquiry` (Resend email). Use CLI if deploying more than 2 functions; dashboard is fine for 1-2. For every function: JWT verification OFF, logical name matches `supabase.functions.invoke("...")` string, real code in the Code tab (not Hello World template), Test tab confirms expected response shape.
11b. **Supabase Auth day-one config (see section 14d):** if the site has a `/login` or member area — Dashboard → Authentication → URL Configuration → fix Site URL to staging domain (Lovable seeds `localhost:3000`), add Redirect URLs allowlist with `/**` wildcards for staging, apex, and localhost:5173/8080. Verify `src/integrations/supabase/client.ts` reads `VITE_SUPABASE_PUBLISHABLE_KEY` and that the deploy workflow injects under that exact name (the env-var trap — see 14d). Default SMTP is OK for smoke testing, wire Resend custom SMTP before real traffic.
12. **Resend setup:** create account, add `RESEND_API_KEY` as a Supabase edge-function secret, initially send from `onboarding@resend.dev`, and **before launch** verify the brand's own domain in Resend so the sender is `hello@<brand>.com`.
13. **Hostinger + GitHub Actions deployment (see section 14a):** create a staging subdomain (`new.<brand-domain>`) mapped to `/public_html/new/`; drop `.github/workflows/deploy-hostinger.yml` + `public/.htaccess` into the repo; add FTP secrets + `HOSTINGER_FTP_DIR` variable; push to main to trigger the first deploy. Keep WordPress or any prior installation at apex until the SPA is verified on staging.
14. Copy this playbook into the repo as `WEBSITE_BUILD_PLAYBOOK.md`. Have Claude read it at the start of every session on this project.
15. Commit the scaffold. Ship the skeleton. Then iterate.

---

## 14a. Deployment — Hostinger + GitHub Actions (current house standard)

Ascent Aviation Advisors shipped first on Vercel, then migrated to Hostinger
Premium Web Hosting once the brand portfolio consolidated onto Hostinger
for DNS, email, and registrar management. The pattern below is the house
standard for all three brand sites (Ascent, U-Calm Aviation, U-CALM
Concierge). **Skip section 14a-legacy (Vercel) unless you are deliberately
staying on Vercel for a specific reason.**

### Why Hostinger-first for brand sites

- Single control panel for DNS, email, SSL, backups, domain registration.
- User already owns Premium Web Hosting — zero marginal cost per brand site.
- Vercel remains available as a free parallel deploy for the whole
  transition period (git-connected, nothing to remove from the repo).
- FTP deploys are ancient but bulletproof — no surprise platform changes,
  no deployment-protection gotchas, no SSO friction for client previews.

### The constraint to design around

Hostinger Premium / Business / Cloud Startup / Cloud Professional are all
**shared hosting**. They serve files via Apache. They do **not** run
Node.js or execute `npm run build` on the server. So the build must
happen somewhere else and only the built `dist/` folder gets uploaded.
(Hostinger VPS tiers are different — they can run Node and a post-pull
hook; the VPS pattern is simpler but not the house standard right now.)

### Architecture

```
GitHub push to main
        │
        ▼
GitHub Actions runner (ubuntu-latest)
   ├── actions/checkout
   ├── actions/setup-node@v4   (Node 20, npm cache)
   ├── npm ci
   ├── npm run build            (VITE_SUPABASE_* env vars injected)
   ├── cp public/.htaccess dist/.htaccess
   └── SamKirkland/FTP-Deploy-Action@v4.3.5
                │
                ▼
      FTP over TLS to Hostinger
                │
                ▼
     /public_html/new/  (staging subdomain)
     /public_html/      (apex, after cutover)
```

### Files that travel with every brand repo

Copy these verbatim (with the SUPABASE URL swapped per project):

- **`.github/workflows/deploy-hostinger.yml`** — build + FTP deploy. See
  the Ascent repo for the canonical copy.
- **`public/.htaccess`** — SPA fallback, cache headers, HTTPS redirect,
  compression, security headers. Copied to `dist/` during the build.
- **`HOSTINGER_DEPLOYMENT_RUNBOOK.md`** — step-by-step runbook for the
  human side (hPanel clicks, subdomain creation, FTP-account scoping,
  cutover procedure, troubleshooting). Ship one per repo.

### Required repo config (Settings → Secrets and variables → Actions)

**Secrets:**
- `HOSTINGER_FTP_HOST` — hostname from hPanel → FTP Accounts (use the
  host shown there, not the IP; IPs rotate)
- `HOSTINGER_FTP_USER` — FTP username. **Hostinger's username format
  uses a DOT, not an underscore**: `u603183136.ascentstaging`, not
  `u603183136_ascentstaging`. Wrong separator = `530 Login Incorrect`.
- `HOSTINGER_FTP_PASSWORD`
- `VITE_SUPABASE_PUBLISHABLE_KEY` (same value as the legacy
  `VITE_SUPABASE_ANON_KEY`; Supabase renamed it in late 2025 — use the
  new name going forward, keep either working via code aliasing if
  needed)

**Variables (not secrets):**
- `VITE_SUPABASE_URL`
- `HOSTINGER_FTP_DIR` — depends on which FTP account you're using:
  - **Scoped secondary FTP account** (chrooted to `/public_html/new/`):
    set to `/`. Inside the chroot, `/` *is* the staging folder. Setting
    `/public_html/new/` here will fail with a path-not-found error.
  - **Primary FTP account** (root of the hosting): set to
    `/public_html/new/` for staging, flip to `/public_html/` at cutover.
  - Default to scoped-secondary + `/` for staging. It's the more robust
    option during the soak period because it can't accidentally write
    outside the staging folder.

### Staging-first cutover pattern (mandatory)

Every brand-site launch on Hostinger follows the same four beats:

1. **Back up** anything already on the target domain (most likely a
   Hostinger-auto-installed WordPress site). Full account backup via
   hPanel → Files → Backups.
2. **Stage on a subdomain** — create `new.<brand-domain>` in hPanel.
   Subdomain creation form quirk: the Subdomain field is `new` and the
   Custom Folder field is `new` — **do NOT type `public_html/new`**;
   hPanel prepends `/public_html/` automatically as a fixed prefix. SSL
   auto-provisions via Let's Encrypt within a minute of subdomain
   creation. Create a scoped FTP account rooted at
   `/public_html/new/`, set `HOSTINGER_FTP_DIR=/` (see section above for
   chroot logic), trigger workflow. Verify the live SPA at
   `https://new.<brand-domain>/`.
3. **Soak** — leave staging up for a few days of real-use testing. Share
   the subdomain URL with stakeholders; no DNS change needed because
   Hostinger routes the subdomain automatically.
4. **Cut over to apex** — clear `/public_html/` (delete or archive the
   WordPress install), then **switch FTP account**: the scoped
   secondary user from step 2 is chrooted to `/public_html/new/` and
   physically cannot reach `/public_html/`. Two paths:
   - **Easiest**: update `HOSTINGER_FTP_USER` / `HOSTINGER_FTP_PASSWORD`
     secrets to the **primary** account, and set
     `HOSTINGER_FTP_DIR=/public_html/`. (Primary is not chrooted.)
   - **More hygienic**: delete the scoped secondary, create a new
     secondary scoped to `/public_html/`, update the secrets, keep
     `HOSTINGER_FTP_DIR=/`.
   Either way, re-run workflow. DNS is unchanged because the domain is
   already Hostinger-managed. Delete the `new.` subdomain only after
   apex has been stable for a week.

**Never deploy straight to apex on first launch if anything else is
serving apex** — Vite will overwrite WordPress in place and the rollback
is a 10-minute restore from backup instead of a zero-downtime swap.

### Interplay with Vercel during transition

Leave the Vercel project connected during and immediately after cutover.
It keeps rebuilding every push to `main` and stays reachable at
`*.vercel.app`. If Hostinger misbehaves, you have a known-good second
live copy to diff against. Delete the Vercel project only after ~2 stable
weeks on Hostinger.

### Gotchas (Hostinger / Apache / FTP-specific)

**`AllowOverride None` on some Hostinger plans.** Deep routes 404 on
refresh because Apache isn't reading `.htaccess`. Fix: open a Hostinger
support chat and ask them to enable `AllowOverride All` on your
directory. Alternatively, check the plan tier — Premium and above should
have this by default.

**FTP uploads don't delete files they didn't upload.** If the target
directory has leftover WordPress files (`wp-config.php`, `wp-admin/`,
etc.), they coexist with the new SPA. Either clear the directory via
File Manager first, or set `dangerous-clean-slate: true` on the FTP
action (destructive — only after the backup is confirmed).

**Hostinger rate-limits FTP on flaky networks.** If the workflow fails
mid-upload with `ECONNREFUSED`, wait 5 min and re-run. The FTP action is
idempotent.

**`Error: Timeout (control socket)` on FTPS.** Different failure mode
from `ECONNREFUSED` — this one means the FTPS handshake opened but went
quiet. Almost always network flakiness between the GitHub Actions
runner and Hostinger, not a config problem. **Re-run the workflow
before changing anything.** If it fails twice in a row with the same
message, then check secrets; before that, it's noise.

**`FTPError: 530 Login incorrect` is almost always the username
separator.** Hostinger subaccount usernames are `<hosting-id>.<label>`
with a DOT, not an underscore. If you copy from the wrong place (or
from an older memory/note), it'll have `_` and produce 530 on every
attempt. First thing to check when a deploy gets 530.

**SPF record collisions.** If the domain already has an SPF record (from
the prior WP install or an email forward), you **must** merge new
`include:` entries into the existing `v=spf1` line — don't add a second
TXT record. Resolvers reject multiple SPF records.

**"Re-run jobs" on an old Actions run ships that commit's bundle, not HEAD's.** Caught us on Ascent (2026-04-22, late evening): a fix shipped via commit B (env-var rename) was later silently undone when someone clicked "Re-run all jobs" on an older workflow run that was still attached to commit A (pre-fix). GitHub re-runs *always* replay the original commit's workflow file and rebuild that commit's source tree, then FTP-upload it on top of whatever is on the server. If commit A predates a deploy-config fix, the re-run ships a zombie bundle — and on shared hosting with FTP, that bundle sits there silently serving broken JS until the next push. Symptoms match whatever the original bug was: on Ascent it was "Invalid API key" reappearing on signup after we'd already fixed it.

**Rules:**

1. After any workflow-file fix (env var names, FTP target, build step), **never** use the "Re-run all jobs" button on runs attached to older commits. The button is a foot-gun.
2. To re-deploy deliberately, use the `workflow_dispatch` trigger on the Actions tab (`Run workflow` → branch `main`) — that runs against HEAD.
3. If that isn't available, push an empty commit (`git commit --allow-empty -m "ci: redeploy"`). `paths-ignore` doesn't block empty commits because no files match the filter, so the workflow fires.
4. If staging suddenly goes broken and nothing was pushed, check the Actions tab for recent *re-runs* (distinguishable from fresh runs by the re-run icon) — that's your smoking gun.

**Cloudflare in front of Hostinger breaks FTP deploy.** If you orange-cloud
the domain in Cloudflare, FTP connections to the FTP hostname get proxied
and fail. Solution: keep the FTP hostname as a grey-clouded (DNS-only)
record, or use a separate `ftp.<domain>` record that Cloudflare isn't
proxying.

### Pointing non-Hostinger-registered domains at Hostinger

Not every brand domain is registered at Hostinger. U-CALM Concierge owns
`u-calm.com` and `u-calm.ch` at **Gandi**. JP's preference is to host
everything on Hostinger regardless of where the domain is registered.
Two paths:

**Option A — point DNS from the external registrar to Hostinger.**
Fastest. Two sub-variants:
- **A1 (simplest):** at the registrar, change nameservers to Hostinger's
  (`ns1.dns-parking.com` + `ns2.dns-parking.com`). All DNS records are
  then managed in hPanel. Good for greenfield domains with no email set
  up yet.
- **A2 (preserves existing registrar DNS):** keep DNS at the registrar,
  add an `A` record pointing at Hostinger's shared IP (find it in
  hPanel → Hosting → Details), plus a `CNAME` for `www`. Then add the
  domain as an External Domain in hPanel and accept the SSL
  provisioning. Good when you already have MX records, DKIM, or other
  DNS config at the registrar you don't want to re-create.

**Option B — transfer the domain registration to Hostinger.** Takes 5–7
days (ICANN window). Requires the domain to be unlocked at the current
registrar, an auth/EPP code, and compatibility checks for unusual TLDs
(e.g., `.ch` goes through SWITCH — verify Hostinger support first).

**Pattern to use:** ship with Option A now, transfer later if single-pane
billing is worth the effort. Don't block launching on a pending transfer.

**SEO caution:** if the domain already has inbound links or search
presence, pointing it at a staging placeholder or a half-built site can
hurt rankings. For greenfield domains this doesn't matter.

### How to apply

Bake these into the opening checklist for every new brand site:
- Copy `.github/workflows/deploy-hostinger.yml`, `public/.htaccess`, and
  `HOSTINGER_DEPLOYMENT_RUNBOOK.md` from Ascent.
- Create the staging subdomain **before** the first deploy, not after.
- Scope the FTP account to `/public_html/new/` during staging.
- Configure GitHub secrets + `HOSTINGER_FTP_DIR` variable on day one.
- Verify the staging subdomain loads the SPA before touching apex.
- For externally-registered domains (Gandi, GoDaddy, Cloudflare, etc.),
  point DNS first (Option A); transfer later if desired (Option B).

---

## 14a-legacy. Vercel deployment gotchas (historical — superseded by 14a)

Retained for reference because parts of the Ascent history lived on
Vercel, and because a future brand may choose Vercel despite the house
standard. Expect these on any Vercel-hosted brand site.

**Git commit email must match a verified email on your GitHub account.** Otherwise Vercel blocks the deployment with "commit email could not be matched to a GitHub account". Fix: add the email as verified on GitHub (Settings → Emails), *don't* rewrite history. Then push an empty commit (`git commit --allow-empty -m "trigger redeploy"`) to unblock — Vercel can't re-run the old blocked build, it needs a fresh one.

**Deployment Protection is ON by default for preview branches on Pro/Team accounts.** Anyone you send the preview URL to will be forced into a Vercel login — useless for sharing with clients or friends. Turn it off at **Settings → Deployment Protection → Vercel Authentication** → set to "Only Production Deployments" or "Disabled". Do this on day one of every new project so shared preview links just work.

**Production domain tracks `main`, preview URLs track feature branches.** Don't share the production `*.vercel.app` URL while the redesign lives on a branch — it still points at whatever's on `main` (often months-old stale work). Share the **branch URL** from the Deployments page: `<project>-git-<branch>-<team>.vercel.app`. This URL auto-updates on every push to that branch.

**Vercel moved the "Production Branch" setting.** It used to live on the Git tab. It now lives under **Settings → Environments → Production → Branch Tracking**. If the old location shows nothing, look in the new one before assuming something's broken.

**Custom subdomain for previews (e.g. `preview.brand.com`).** Worth setting up once a redesign is shareable. Process: (1) add in Vercel Settings → Domains, connect to the feature branch; (2) Vercel tells you what CNAME to add at the DNS provider; (3) add the CNAME; (4) wait 5-30 min for propagation + SSL auto-provision. Gotcha: Vercel detects the DNS provider from the current nameservers — "GoDaddy" in the dashboard doesn't mean the domain is *registered* there, only that nameservers point there. Registrar and DNS host can be different places. Ask the client where they actually log in to manage DNS.

**Rollup native-dep bug on `npm install`.** Symptom: `Cannot find module @rollup/rollup-linux-arm64-gnu`. Known npm bug (#4828). Fix: `rm -rf node_modules package-lock.json && npm install`. If it happens once, it'll happen again — keep the one-liner handy.

**How to apply:** Bake "turn off Deployment Protection + verify git email on GitHub + confirm Production Branch tracking" into the project opening-checklist (section 14 above).

---

## 14b. Backend stack — Supabase from day one

On Ascent we began on Lovable Cloud (a whitelabelled Supabase) and migrated to standalone Supabase mid-project. The migration cost ~2 hours and surfaced several gotchas that are far cheaper to learn once than to re-learn per project. Skip the migration by starting on **standalone Supabase** from day one.

**Why standalone Supabase over a wrapper (Lovable Cloud, etc.):**
- Free tier (Nano) is enough for most marketing sites — no reason to pay a reseller on top.
- Direct access to the Supabase dashboard (not a subset exposed through a reseller).
- Edge Functions, RPC, RLS, Auth, Storage, Secrets — all in one place.
- You own the credentials. You can swap frontend hosts (Vercel → Netlify → anywhere) without touching the backend.
- Migrating *off* a wrapper later means re-doing every table, policy, function, secret, and env var. Painful.

**Day-one Supabase setup (~10 minutes):**
1. Create a project at `supabase.com` (not through Lovable or a partner). Region closest to the audience — **Frankfurt (`eu-central-1`)** for Europe-facing brands.
2. Copy the project URL and the **Publishable key** (Supabase renamed the `anon` key to "Publishable key" in late 2025 — same value, same role, new label; Settings → API). Add to GitHub Actions as `VITE_SUPABASE_URL` (variable) and `VITE_SUPABASE_PUBLISHABLE_KEY` (secret) if deploying to Hostinger, or to Vercel env vars for **both Production and Preview** environments if on Vercel. Missing from Preview = forms break on preview deploys but work locally.
3. Create `migration-bundle.sql` at the repo root. Every schema change goes here — tables, RLS policies, RPC functions. Commit it. Running this file in Supabase SQL Editor recreates the entire schema from scratch. **This is your canonical reproducible schema.**
4. Create `src/integrations/supabase/client.ts` exporting a typed Supabase client using the env vars.

**Why `migration-bundle.sql` matters.** Supabase does not offer a portable "export database" through the UI. Migrating between projects (Lovable → standalone, dev → prod, region → region) only works reliably if you have one SQL file you can paste into SQL Editor. Without it, schema silently drifts between what's committed and what's deployed — and when a form returns 500 "Failed to process request", you won't know whether the RPC is missing on the server or was never created. Keep the file up to date on every schema change.

**Contact-form backend pattern (reusable across brands):**
- Table `contact_inquiries` — stores every submission. RLS enabled; INSERT is allowed from the edge function via service role, SELECT restricted to admins.
- Table `contact_rate_limit` — tracks recent submissions by IP and email to prevent spam.
- RPC `check_contact_rate_limit(_ip_address text, _email text) returns boolean` — returns true if a submission should be allowed. **Without this RPC, the edge function returns 500** even though the `contact_inquiries` table exists. It's a separate object, created by a separate SQL block — easy to miss.
- Edge function `submit-contact` — (a) parses and validates body, (b) calls `check_contact_rate_limit`, (c) inserts into `contact_inquiries`, (d) returns JSON with success/error.

**Booking-inquiry-by-email pattern (Resend):**
- Store `RESEND_API_KEY` as a Supabase **edge-function secret** (Dashboard → Edge Functions → Manage Secrets). Don't put it in Vercel env vars — edge functions can't read those.
- Edge function `send-booking-inquiry` — parses body, calls Resend's HTTP API, returns JSON. Also insert a row into a `bookings` (or similar) table so there's a record even if the email fails or gets filtered.
- **Sender domain — plan the domain-verification step before launch.** Resend's `onboarding@resend.dev` works for dev but deliverability is poor and the "from" address looks unprofessional. Before going live: verify the brand's domain in Resend (add the DNS records at the registrar), then change the sender to `hello@<brand>.com` or `contact@<brand>.com`.
- A common mistake: the booking dialog only emails and doesn't persist to DB. Always do both.

**How to apply:** Run the day-one setup above *before* writing a contact form. A contact form without rate limiting and with a default sender is a liability that you will ship and then never come back to.

---

## 14c. Supabase edge function deployment — gotchas

Three landmines cost ~2 hours on the Ascent migration. Memorise them. (Full details also in `feedback_supabase_edge_fn_deploy.md`.)

**1. The "New Function" modal's code paste does NOT deploy your code.** It creates the function with the default Hello World template *regardless* of what you pasted into the modal. Symptom: the Test tab returns `{"message": "Hello undefined!"}`. Fix:
- Create the function (ignore the code field in the modal).
- Open the function → **Code** tab.
- Select-all, delete the template, paste real code.
- Click the **Deploy** button *inside* the Code tab (separate from the Create button in the modal).
- Refresh the page and confirm line 1 matches what you pasted.

**2. JWT verification is ON by default and blocks CORS preflight.** OPTIONS requests don't carry `Authorization` headers, so JWT-gated functions return 500 on preflight. The browser surfaces this as "Failed to send a request to the Edge Function" — misleading because the function itself is fine. Fix: open the function → **Settings** tab → toggle **Verify JWT with legacy secret** OFF. Required for any edge function called from the browser via `supabase.functions.invoke()`.

**3. Functions get auto-generated names if you don't set one explicitly.** Names like `super-api`, `swift-task`, `friendly-sloth` in the function list mean the name wasn't set. The frontend calls functions by their *logical* name (`supabase.functions.invoke("submit-contact")`) — mismatched names return 404. Always set the name explicitly when creating.

**Post-deploy checklist (do in order, every time):**
1. Function name matches the string in `supabase.functions.invoke("...")` exactly.
2. Code tab shows your real code (not `Deno.serve((req) => new Response("Hello World"))`).
3. Click Deploy inside Code tab, see the green confirmation toast.
4. Settings tab → JWT verification is OFF.
5. Test tab → run with a realistic payload → confirm response shape matches your handler (not `{"message": "Hello undefined!"}`).
6. Only *then* test from the frontend.

**CLI alternative.** For more than ~3 functions or anything non-trivial, use the Supabase CLI (`supabase functions deploy <name>`) from the repo. The source of truth stays in the repo; the dashboard reflects it. The dashboard UI is fine for 1–2 small functions, painful beyond that.

**How to apply:** The Test tab in the Supabase dashboard is the fastest way to confirm what's actually running. If a handler returns `Hello undefined!`, the template is still live. If the response shape matches your real handler, real code is live. Don't debug from the frontend until the Test tab is green.

---

## 14d. Supabase Auth — the trap that cost us the Ascent evening

If the brand site has a `/login`, `/signup`, or any member area, you are
using Supabase Auth, which is a **separate subsystem** from edge
functions and the DB. It needs its own configuration and its own
end-to-end test. The Ascent build hit three distinct failures in this
area, all silent until someone actually tried to sign up.

### The env-var naming trap (the one that was invisible for two weeks)

The Supabase client (`src/integrations/supabase/client.ts`, which is
auto-generated by Lovable-style tooling) reads:
```ts
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
```

But the initial Hostinger deploy workflow injected the key under the
legacy name:
```yaml
VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
```

Result: Vite bakes `undefined` into the bundle as the API key. Every
call the Supabase client makes should fail — but **only Auth actually
fails**. Edge functions with JWT verification OFF (which is the
recommended default so CORS preflight works from the browser) don't
validate the `apikey` header at all. They just accept any POST with a
valid body. So:

- Contact form works ✅
- Booking dialog works ✅
- Any call to `supabase.auth.signUp()` / `signIn()` returns
  `Invalid API key` ❌

This asymmetry is why the bug slept through multiple smoke tests and
was only found when the user tried signing up as a member. **It is the
single most dangerous class of bug in this whole playbook** because
every standard test passes while the feature is silently broken.

**Fix:** in the deploy workflow, inject the env var under the name the
client code actually reads (`VITE_SUPABASE_PUBLISHABLE_KEY`). The
GitHub secret name can stay as `VITE_SUPABASE_ANON_KEY` for historical
reasons — you're just mapping it. Like this:
```yaml
VITE_SUPABASE_PUBLISHABLE_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
```

Or rename the secret too if you want consistency. Either way, **the
name on the left of the colon must match `import.meta.env.X` in
client.ts exactly.** If the repo uses a different generator, grep for
`import.meta.env.VITE_SUPABASE` in `src/integrations/supabase/client.ts`
to see what's expected.

### Auth URL Configuration ships with Lovable-style localhost defaults

Supabase Auth has its own Site URL and Redirect URLs allowlist, totally
separate from the `VITE_SUPABASE_URL` env var. When a new project is
scaffolded via Lovable (or migrated from Lovable Cloud), **both fields
get seeded with dev defaults**:
- Site URL: `http://localhost:3000`
- Redirect URLs: *(empty — no domains allowed)*

Leave these alone and production signup emails will contain links to
`http://localhost:3000/…`, and password-reset redirects will be
rejected by Supabase because no production domain is in the allowlist.
This also only breaks Auth, not edge functions.

**Fix on day one**, in Supabase Dashboard → Authentication → URL
Configuration:

Site URL:
```
https://<staging-or-apex>.<brand-domain>.com
```
For the staging-first pattern, use `https://new.<brand>.com` during
soak, flip to apex at cutover. Wildcards are NOT allowed here — single
URL only.

Redirect URLs (wildcards ARE allowed here, use them):
```
https://new.<brand-domain>.com/**
https://<brand-domain>.com/**
http://localhost:5173/**
http://localhost:8080/**
```
The `/**` suffix is required — without it, only the exact URL matches
and `emailRedirectTo: ${window.location.origin}/` gets rejected. Add
the two common Vite dev ports so local signup testing works.

### Default SMTP is dev-only

Supabase's built-in email sender (`noreply@mail.app.supabase.io`) is
rate-limited to **3 emails per hour per project** and has poor
deliverability (often lands in spam for non-Gmail recipients). Good
for the smoke test, broken for production.

Replace with custom SMTP — Resend is the house standard — before any
real user traffic:
- Dashboard → Authentication → Emails → **SMTP Settings** → toggle on.
- Host: `smtp.resend.com`, port `465` (SSL) or `587` (STARTTLS).
- Username: `resend`
- Password: an API key from Resend (can reuse `RESEND_API_KEY` if it
  already has sending permissions).
- Sender email: `hello@<brand-domain>.com` or similar. **Requires the
  domain to be verified in Resend first** — otherwise all emails bounce.

This is a separate flow from the `RESEND_API_KEY` that the
`send-booking-inquiry` edge function uses. They're two independent
integration points; configuring one doesn't affect the other.

### Mandatory Auth smoke test (new item for section 13)

Every brand site with a member area must add these to the pre-launch
smoke test:
1. Sign up with a real email at `/login`.
2. Receive confirmation email from the expected sender.
3. Click confirmation link — lands on the expected domain, logged in.
4. Sign out, sign back in with the same credentials — succeeds.
5. `auth.users` has a row. `profiles` (or equivalent) has a row.
6. Delete the test user from Authentication → Users before handover.

Skip any of these and you get the Ascent experience: ship, discover
signup is broken a week later, scramble to fix.

### How to apply

- Add "fix Auth URL Config" as a day-one item in the opening checklist.
- Add an "Auth flow smoke test" to the pre-launch checklist for every
  brand site that has a member area.
- When using Lovable-generated client code, grep
  `src/integrations/supabase/client.ts` for the exact `import.meta.env`
  var name and mirror it in the deploy workflow. Never assume the name.

---

## 15. Living doc — to capture as we go

- Image prompt templates across subjects — extract from Ascent prompt file and generalise into ready-to-use starters for aviation, hospitality/concierge, legal, fashion.
- Analytics privacy-first options (Plausible, Fathom) and cookie-banner-free setups.
- Auto-assembling a brand book PDF from `src/brand/tokens.ts` for client delivery.
- Post-launch: how to hand over to a non-developer client (content editing via headless CMS, Tina, or direct JSON PRs).
- CLI-first vs dashboard-first workflow for Supabase edge functions — once a project has more than 3 functions, move fully to the Supabase CLI with the repo as source of truth. Document the exact flow.
- Resend domain-verification end-to-end walkthrough with real DNS records for each common registrar (GoDaddy, Hostinger, Namecheap, Cloudflare). Still pending for Ascent.
- Preview-deployment smoke-test checklist — scripted list of every form and edge function to hit from a preview URL before merging to main.
- Honeypot + rate-limit tuning: real abuse data from a live site will tell us whether the rate-limit thresholds are too tight or too loose.

---

## 16. Turning this into a Claude skill (future task)

When this playbook has been through 2-3 more projects and feels stable:

1. Create folder `skills/multilang-brand-website/`.
2. `SKILL.md` at the root with front-matter:
   ```
   ---
   name: multilang-brand-website
   description: Use when building a multilingual brand website — scaffolding, image generation at scale, i18n discipline, layout pitfalls. Triggers on "brand website", "multilingual marketing site", "i18n react", etc.
   ---
   ```
3. Split this file into reference subfiles (`imagery.md`, `i18n.md`, `accessibility.md`, etc.) that the SKILL.md points at, so Claude loads only what's relevant to the current task.
4. Package as a plugin; publish to a personal marketplace or the Anthropic marketplace if it matures.

Once done, anyone — including people who have never worked with you — can install the skill and get the same opening-checklist behaviour.
