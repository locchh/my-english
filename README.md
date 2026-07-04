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

## Docs

- [phonemizer vs espeak-ng](docs/phonemizer-vs-espeak-ng.md) — comparison of the
  two IPA engines and why `phonemizer` was chosen.
- [WebAssembly (WASM)](docs/wasm.md) — what WASM is and why the app relies on it.

## Related to

- [espeak-ng (npm, WASM)](https://www.npmjs.com/package/espeak-ng)
- [phonemizer (npm)](https://www.npmjs.com/package/phonemizer)
- [bootphon/phonemizer](https://github.com/bootphon/phonemizer/tree/master)
- [Vite](https://vite.dev/guide/)
- [Vercel](https://vercel.com)
- [Netlify](https://www.netlify.com)
