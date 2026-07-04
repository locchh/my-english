# my-english

A static web page for learning English pronunciation. It displays the full IPA
chart and converts English text into its IPA transcription — entirely in the
browser, no backend.

## Features

- **IPA chart** — displays the IPA vowel/consonant chart.
- **Text → IPA** — type English text and get its IPA transcription. Powered by
  espeak-ng compiled to WebAssembly, so it runs client-side and handles any
  word, including unknown ones.

## Stack

- [Vite](https://vite.dev/guide/) + TypeScript — build tooling and app code.
- [phonemizer](https://www.npmjs.com/package/phonemizer) — a thin wrapper over
  espeak-ng compiled to WASM; the grapheme-to-phoneme engine that produces the
  IPA output. See [why we chose it](docs/phonemizer-vs-espeak-ng.md).
- Static site deployed to [Vercel](https://vercel.com) (free, non-commercial).

## Setup

Bun and npm are interchangeable here — the choice only affects installing and
running; the app behaves identically in the browser.

| Task             | npm                      | Bun                  |
| ---------------- | ------------------------ | -------------------- |
| Scaffold         | `npm create vite@latest` | `bun create vite`    |
| Install deps     | `npm install`            | `bun install`        |
| Add a package    | `npm install phonemizer` | `bun add phonemizer` |
| Dev server       | `npm run dev`            | `bun run dev`        |
| Production build | `npm run build`          | `bun run build`      |

Use only **one** lockfile — don't commit both `package-lock.json` and
`bun.lock`.

## Build & deploy

`build` outputs static files to `dist/`. Push the repo to GitHub and connect it
to Vercel — it auto-detects Vite (and whichever lockfile is present) and
redeploys `dist/` on every push.

## Related to

- [Vite](https://vite.dev/guide/) — build tool and dev server; scaffolds the
  TypeScript project and bundles it into static files.
- [Vercel](https://vercel.com) — the host we deploy to (free, non-commercial);
  auto-detects Vite and redeploys on every push.
- [Netlify](https://www.netlify.com) — the alternative static host we compared
  against Vercel.
- [espeak-ng (npm, WASM)](https://www.npmjs.com/package/espeak-ng) — the
  text-to-phoneme engine compiled to WebAssembly; runs in the browser.
- [phonemizer (npm)](https://www.npmjs.com/package/phonemizer) — the thin
  wrapper over espeak-ng WASM that we actually call (`await phonemize(text)`).
- [bootphon/phonemizer](https://github.com/bootphon/phonemizer/tree/master) —
  the original Python phonemizer that inspired this project's approach.
- [lucide](https://lucide.dev/)
- [](https://fonts.google.com/icons)