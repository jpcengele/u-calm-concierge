# U-CALM Concierge — Next Steps

Stage 1 (this commit) ships the scaffold: Vite + React + TS + Tailwind,
brand tokens wired per §11a, i18n skeleton in four locales (EN populated,
DE/FR/IT empty placeholders), routes for Home/Services/About/Contact,
Hostinger deploy workflow dropped in, imagery manifest stubbed with
typed slot ids.

Build passes. §11a grep passes for all brand aliases
(`.bg-aubergine`, `.text-champagne`, `.bg-forest`, `.bg-gold`, etc).

Below: what each subsequent stage needs to begin and what it produces.

---

## Stage 2 — Imagery (do NOT trigger before Sunday 2026-04-27)

Brand imagery generation is expensive; image-gen credits refresh weekly.
**Trigger the `ucalm-concierge-2-imagery` scheduled task on or after
Sunday 2026-04-27.**

### Prerequisites (must be green before Stage 2 starts)

- [x] Stage 1 scaffold committed + pushed to `main`.
- [x] `npm run build` passes on a clean clone.
- [x] §11a grep finds all eight brand-alias classes in
      `dist/assets/*.css`.
- [ ] Remote GitHub repo created — `github.com/jpcengele/u-calm-concierge`
      — and this scaffold pushed up. (Sandbox couldn't reach
      `api.github.com`; see the completion notice.)
- [ ] Image-gen credits confirmed available (Sunday window).

### What Stage 2 produces

- Real photography in `public/brand/{section}/{filename}.jpg` for every
  slot in `src/brand/imagery.ts` (stubbed today as `TODO:{slotKey}`).
- Every `BRAND_IMAGES[*].src` updated to its final path.
- `enabled: true` on every shipping slot; disabled-but-retained entries
  kept with `enabled: false` + a `disabledReason` note (per playbook §1).
- A review pass against the "tells checklist" (playbook §2) before any
  image is merged — no hallucinated text, no six-fingered hands, no
  stock-brochure clichés. The `enabled: false` retention rule means
  rejected prompts stay in history with their reason.
- Hero photography includes distinct diverse people, modern tailoring,
  and a human anchor (per the `feedback_ascent_imagery` memory).

### How to verify Stage 2

```bash
# Every slot has a real src (no TODO: prefixes)
grep -c 'TODO:' src/brand/imagery.ts    # should print 0
npm run build                           # passes
# Visual pass: open http://localhost:5173/ and walk every route.
```

---

## Stage 3 — Backend + Deploy

**Trigger only after Stage 2 is green.** This is the stage that takes
the site live.

### Prerequisites

- [ ] Stage 2 complete — imagery rendered, manifest clean, build green.
- [ ] Supabase project created in **Frankfurt (eu-central-1)**. Record
      the project ref, URL, and publishable key. (Don't use Lovable
      Cloud or any wrapper — see playbook §14b.)
- [ ] Hostinger subdomain `staging.u-calm.com` (or `new.u-calm.com`)
      created in hPanel with document root `/public_html/new/` and
      Let's Encrypt SSL enabled. Note the Subdomain-field quirk:
      type `new` only; hPanel prepends `/public_html/` as a fixed
      prefix.
- [ ] Scoped secondary FTP account created, chrooted to
      `/public_html/new/`. Username MUST use a DOT separator
      (`u603183136.ucalmstaging`) — not an underscore — or the deploy
      fails with `530 Login incorrect` (playbook §14a).
- [ ] DNS for `u-calm.com` pointed at Hostinger. Per memory
      `reference_brand_domains_portfolio`, the domain is at Gandi and
      the user wants it on Hostinger. Option A (point DNS) is the
      fastest path — either switch Gandi nameservers to Hostinger's
      (`ns1.dns-parking.com` + `ns2.dns-parking.com`) or add A/CNAME
      records at Gandi pointing at Hostinger's shared IP. Playbook §14a
      walks both options.
- [ ] Resend account provisioned; `u-calm.com` domain verified in Resend
      (DNS records added at registrar). Sender becomes `hello@u-calm.com`.

### What Stage 3 produces

1. **Supabase schema** — check `migration-bundle.sql` into the repo
   root with:
   - `contact_inquiries` table (RLS on; INSERT via service role from
     the edge function, SELECT restricted to admins).
   - `contact_rate_limit` table.
   - `check_contact_rate_limit(_ip_address text, _email text)` RPC —
     without this the edge function returns 500 (playbook §14b).
   Run the file in Supabase SQL Editor.

2. **Edge functions** — in `supabase/functions/`:
   - `submit-contact` — parses body, calls rate-limit RPC, inserts
     row, returns JSON.
   - `send-booking-inquiry` — parses body, calls Resend HTTP API,
     persists to `bookings` table.
   Deploy via CLI (`supabase functions deploy <name>`), not the "Via
   Editor" paste — that ships the Hello World template (playbook §14c).
   For both functions: **JWT verification OFF** (required for browser
   CORS preflight), logical name matches the frontend
   `supabase.functions.invoke("...")` string.

3. **Supabase Auth URL configuration** — per playbook §14d. Fix the
   Lovable-style localhost defaults:
   - Site URL → `https://staging.u-calm.com` (flip to apex at cutover).
   - Redirect URLs:
     - `https://staging.u-calm.com/**`
     - `https://u-calm.com/**`
     - `http://localhost:5173/**`
     - `http://localhost:8080/**`

4. **Supabase client** — create `src/integrations/supabase/client.ts`
   reading `import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY`. Mirror the
   exact name in the deploy workflow's `env:` block — THE name on the
   left of the colon must match `import.meta.env.X` in client.ts or
   Vite bakes `undefined` and auth silently breaks (playbook §14d).

5. **GitHub repo config**:
   - Secrets: `HOSTINGER_FTP_HOST`, `HOSTINGER_FTP_USER` (with dot),
     `HOSTINGER_FTP_PASSWORD`, `VITE_SUPABASE_ANON_KEY` (holds the
     publishable key — mapped to `VITE_SUPABASE_PUBLISHABLE_KEY` in
     the workflow).
   - Variables: `VITE_SUPABASE_URL`, `HOSTINGER_FTP_DIR` (`/` for
     chrooted staging account; `/public_html/` for apex cutover).

6. **Forms wired up**:
   - `Contact.tsx` — swap the placeholder block for a full inquiry form
     (react-hook-form + zod), submitting via
     `supabase.functions.invoke("submit-contact", { body })`.
   - `BookingInquiryDialog.tsx` — replace the toast in `handleSubmit`
     with the real `supabase.functions.invoke(...)` call. Keep the
     honeypot field.

7. **Auth smoke test** (playbook §14d) if `/login` is added at this
   stage:
   - Sign up with a real email → receive confirmation → click through →
     lands on staging domain, logged in.
   - Confirm `auth.users` + `profiles` have rows.
   - Delete the test user before handover.

### How to verify Stage 3

- Preview build served from `https://staging.u-calm.com/` responds 200
  on every route and loads assets.
- Contact form submits → row appears in `contact_inquiries` + inquiry
  email received.
- Booking dialog submits → row in bookings table + email from
  `hello@u-calm.com` received at the monitored inbox.
- Post-launch: run Lighthouse accessibility audit, target ≥95.

---

## Cutover checklist (after Stage 3 soaks on staging)

Per playbook §14a, mandatory staging-first cutover:

1. Staging soaks for 3-5 days of real use; share the URL with
   stakeholders; monitor error logs.
2. Back up any previous site on `/public_html/` via hPanel → Files →
   Backups.
3. Clear `/public_html/` (delete WordPress or placeholder).
4. Switch FTP account: easiest path is to update secrets to the
   **primary** hosting account and set `HOSTINGER_FTP_DIR=/public_html/`.
   More hygienic: recreate a scoped secondary rooted at `/public_html/`.
5. Trigger `workflow_dispatch` on Actions tab (NEVER click "Re-run all
   jobs" on a stale workflow run — playbook §14a explains why).
6. Verify apex loads the SPA; delete the `staging.` / `new.` subdomain
   after ~1 week of apex stability.
7. Apply forbidden-rules checklist (playbook §12) before calling
   Stage 3 done.

---

## Known constraints + open items

- **api.github.com unreachable from the Stage-1 sandbox.** The scheduled
  task specified `gh repo create`. Sandbox proxy allowlist returns 403
  on CONNECT to api.github.com, so the repo wasn't created
  programmatically. Stage 1 ships a local git repo + tag + tarball;
  the user (or a subsequent task run with API access) must create the
  remote and push. Command sketch:
  ```bash
  gh repo create jpcengele/u-calm-concierge --public \
    --description "U-CALM Concierge — lifestyle management website"
  cd /path/to/u-calm-concierge
  git remote add origin \
    https://x-access-token:${PAT}@github.com/jpcengele/u-calm-concierge.git
  git push -u origin main
  git push origin v0.1.0-scaffold
  ```

- **No Lovable tagger plugin.** Removed from `vite.config.ts` and
  `devDependencies` — Lovable-specific tooling not needed for this
  build pattern.

- **No Supabase code yet.** `src/integrations/supabase/client.ts` will
  be created in Stage 3 alongside the edge functions. The deploy
  workflow already references the right env var names so Stage 3 only
  needs to populate the secrets/variables, not touch the workflow.

- **Imagery manifest holds six slots today.** Stage 2 can expand this
  to whatever the content calendar requires; the `BrandImage`
  component's `isPlaceholder()` branch renders a gradient stand-in
  while `src` starts with `TODO:`.
