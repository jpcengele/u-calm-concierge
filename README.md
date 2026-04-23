# U-CALM Concierge

Website for U-CALM Concierge — the lifestyle-management and concierge
house within the U-CALM brand family. Sister-brand to U-Calm Aviation
(`u-calmaviation.com`) and the commercially-separate Ascent Aviation.

Strapline: **Consider it done.**

## Stack

- Vite + React 18 + TypeScript
- Tailwind 3 (brand tokens in `src/index.css`, aliases in
  `tailwind.config.ts` — see §11a of the playbook)
- react-i18next (EN populated; DE/FR/IT scaffolded)
- react-router-dom 6
- shadcn/ui components under `src/components/ui/`
- GitHub Actions → Hostinger FTP deploy (house standard — see
  `.github/workflows/deploy-hostinger.yml`)

## Local dev

```bash
npm install
npm run dev          # serves at http://localhost:8080
npm run build        # outputs dist/
```

## Brand

- `u-calm-concierge-brand-assets/` — reference design-tokens + CSS
  variables + (reference-only) Tailwind extension. Brand updates are
  made in the **live** `tailwind.config.ts` and `src/index.css` — the
  reference files travel for documentation only.
- `WEBSITE_BUILD_PLAYBOOK.md` — the reusable cross-brand playbook.
  §11a is the non-negotiable about brand-alias wiring.

## Stages

- **Stage 1 (this commit)** — scaffold, brand tokens wired, build green.
- **Stage 2** — imagery generated and wired. Trigger on/after Sunday
  2026-04-27.
- **Stage 3** — Supabase backend, Hostinger deploy, domain cutover.

See `NEXT_STEPS.md` for the full plan.
