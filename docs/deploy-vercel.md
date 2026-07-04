# Deploying to Vercel (free)

This app is a **static Vite site** — no backend, no serverless functions,
everything (including the espeak-ng WASM) runs in the browser. That makes it a
perfect fit for Vercel's **Hobby (free)** plan:

- Free static hosting with automatic HTTPS.
- 100 GB bandwidth / month — far more than a learning project needs.
- Hobby is for **non-commercial** use, which this project is.

So: **yes, it deploys free.**

## Prerequisites

- The repo is on GitHub and pushed: `github.com/locchh/my-english`. ✓
- `bun run build` succeeds locally and outputs to `dist/`. ✓

## Option A — Dashboard (easiest)

1. Go to <https://vercel.com> and sign in with your **GitHub** account.
2. **Add New… → Project**.
3. **Import** the `locchh/my-english` repository.
4. Vercel auto-detects the framework. Confirm the settings (defaults are correct):
   - **Framework Preset:** Vite
   - **Build Command:** `vite build` (or `bun run build`)
   - **Output Directory:** `dist`
   - **Install Command:** auto — Vercel sees `bun.lock` and uses Bun
5. Click **Deploy**. Wait ~30–60s.
6. You get a live URL like `https://my-english.vercel.app`.

After this, **every push to `main` auto-redeploys**, and pull requests get their
own preview URLs.

## Option B — CLI

```sh
npm i -g vercel     # install the CLI once
vercel              # first run: log in + link the project (accept defaults)
vercel --prod       # deploy to production
```

The CLI asks a few questions on first run; the detected defaults (Vite,
`dist`) are correct — just accept them.

## Build settings reference

| Setting          | Value                          |
| ---------------- | ------------------------------ |
| Framework        | Vite                           |
| Install command  | `bun install` (auto from `bun.lock`) |
| Build command    | `bun run build` → `tsc && vite build` |
| Output directory | `dist`                         |
| Node version     | default is fine                |

No `vercel.json` is required — the defaults cover a static Vite build.

## Notes / gotchas

- **The `.wasm` file** is a normal static asset in `dist/`; Vercel serves it like
  any file. No special config.
- **The ">500 kB chunk" build warning** (the WASM) is only a warning, not an
  error — the build still succeeds and the site works.
- **Single page, no routing** — the app lives at `/`, so no SPA rewrite rules are
  needed. (If client-side routes are added later, add a rewrite of all paths to
  `/index.html`.)
- **Favicon caching** — after a deploy, browsers may show the old favicon for a
  while; hard-refresh to update.
- **Custom domain** (optional) — can be added free under the project's Domains
  settings.
