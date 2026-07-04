# From source to browser: build & hosting

How the project goes from the files you edit to a page in a visitor's browser —
and why everything runs client-side.

## Source vs. build output

There are two different sets of files:

- **Source** (what you edit): `index.html`, `src/main.ts`, `src/style.css`,
  `public/`, etc.
- **Build output** (what ships): the `dist/` folder, produced by
  `bun run build`. This is the *only* thing deployed to the host.

The browser never loads your source `.ts` files. It loads the built output.

## What `bun run build` does

`build` runs `tsc && vite build`, which:

1. **Compiles TypeScript → JavaScript.** Browsers can't run `.ts`. `main.ts`,
   `counter.ts`, and everything they import are bundled into one JS file, e.g.
   `dist/assets/index-B4vdZNPd.js`.
2. **Extracts CSS** into its own file, e.g. `dist/assets/index-CsUDhMuy.css`.
3. **Fingerprints assets** — `hero.png` becomes `hero-CLDdwZDr.png` so that
   changed files bust the browser cache.
4. **Rewrites `index.html`** to point at the built files instead of the source.

The `<script>` tag changes from source to output:

```html
<!-- source index.html (what you edit) -->
<script type="module" src="/src/main.ts"></script>

<!-- dist/index.html (what ships) -->
<script type="module" src="/assets/index-B4vdZNPd.js"></script>
```

There is **no `.ts` file anywhere in `dist/`**. `main.ts` is a source input to
the build, not a file the client ever loads.

## Dev vs. production

This is why the source `index.html` can still reference `main.ts`:

| | `bun run dev` (local) | hosted (production) |
| ---------------- | ------------------------------------------- | ----------------------------------- |
| What runs        | the Vite dev server                         | just static files on the host       |
| `main.ts`        | browser requests it; Vite compiles it to JS on the fly, per request | pre-compiled into `/assets/index-[hash].js`; not shipped |
| Why              | instant reloads (HMR) while coding          | optimized, no build tooling at runtime |

In dev, the browser really does fetch `/src/main.ts` — but Vite intercepts and
returns compiled JavaScript, never raw TypeScript. In production there is no
Vite server; everything must be pre-built.

## How the host delivers `index.html`

When someone opens `https://<app>.vercel.app/`:

1. **URL → server.** The browser resolves the domain (DNS) to the host's IP and
   sends `GET /`.
2. **`/` → `index.html`.** By the web's **index-document convention**, a request
   for a directory (and `/` is the root directory) returns the file named
   `index.html` in it. That's why the entry file is called `index.html`. The
   server responds with `dist/index.html` and a `Content-Type: text/html` header
   so the browser renders it as a page.
3. **The HTML triggers more requests (wave 1).** The browser parses the HTML and
   fires a separate `GET` for each file it names — the JS bundle, the CSS, the
   favicon.
4. **Each path → a file.** The host maps each URL path to a file in `dist/` and
   returns its bytes. `/assets/index-B4vdZNPd.js` → `dist/assets/index-B4vdZNPd.js`.
5. **The JS runs and requests more (wave 2).** Once the JS bundle arrives it
   executes — `main.ts` fills `#app`. The *running* code can then request more
   files itself. The **`.wasm` is fetched here**: `phonemizer` asks for it when
   it initializes, because the code told it to — not from a tag in `index.html`.

So a "visit" is really **many requests, in two waves** — the files named in the
HTML, then the files the running JS asks for:

```
GET /                → index.html
  (browser reads it) → GET /assets/index.js, /assets/index.css, /favicon.svg   ← wave 1
  (js runs)          → GET /…espeak-ng.wasm                                     ← wave 2
```

One fact specific to this setup: **`dist/` is the website root.** The host
treats the build output folder as the site, so the folder structure inside
`dist/` becomes the URL structure: `/` = `dist/index.html`,
`/favicon.svg` = `dist/favicon.svg`.

## Everything runs client-side

Every shipped file — HTML, JS, CSS, images, `.wasm` — is **stored on the server
but executed on the client**:

- At rest, each file just sits on the host's CDN; the server never runs it.
- The browser downloads the files it needs.
- The executable ones (JS and WASM) run in the **visitor's browser**, on their
  CPU, in the tab's sandbox.

This project uses **no** server-side code — no Node backend, no serverless
functions, no server-side rendering. That is the definition of a *static site*,
and it's exactly why it deploys free and needs no backend.

Mental model: a URL is an address for a file. The server's only job is to look
up the file at that address and send it. The moment anything *executes*, it has
already been downloaded and is running in the visitor's browser.

## See also

- [wasm.md](wasm.md) — the same server-stored / client-executed model applied to
  the espeak-ng WebAssembly engine.
