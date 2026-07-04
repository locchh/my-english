# Text → IPA engine: `phonemizer` vs `espeak-ng`

Comparison of the two npm packages considered for converting English text to IPA
in the browser. Both run **the same espeak-ng engine compiled to WebAssembly** —
the difference is entirely in the API surface around it.

- [`espeak-ng`](https://www.npmjs.com/package/espeak-ng) — espeak-ng compiled to
  WASM, driven like the command-line tool.
- [`phonemizer`](https://www.npmjs.com/package/phonemizer) — a thin, ergonomic
  wrapper around that same WASM, by xenova (transformers.js).
  Repo: <https://github.com/xenova/phonemizer.js>

## At a glance

| Aspect              | `espeak-ng`                                  | `phonemizer`                              |
| ------------------- | -------------------------------------------- | ----------------------------------------- |
| API style           | argv-style flags + read a virtual FS file    | one async function: `await phonemize()`   |
| Underlying engine   | espeak-ng WASM                               | **the same** espeak-ng WASM               |
| Output              | raw string you must parse                    | array of IPA strings, ready to use        |
| Accent / voice      | `-v en-gb` flag                              | 2nd argument; `list_voices()` to enumerate |
| Level of control    | every espeak-ng flag (separators, output...) | the common cases only                     |
| Learning curve      | steep (CLI flags, emscripten FS)             | trivial                                   |
| Async               | yes (`await ESpeakNg(...)`)                  | yes (`await phonemize(...)`)              |
| Runs client-side    | yes                                          | yes                                       |
| Free-tier / static  | yes — no backend needed                      | yes — no backend needed                   |

## Feature

Functionally identical for our purpose (English text → IPA), because they wrap
the same engine:

- Real grapheme-to-phoneme conversion, so **any** word works — including names,
  typos, and made-up words (not just dictionary entries).
- IPA output **with stress marks** (e.g. the `ˈ` in `həlˈəʊ`), which is useful
  for pronunciation learning.
- Multiple English accents (America, RP/GB, Scotland, NYC, etc.) and other
  languages.

`espeak-ng` additionally exposes the full flag set: custom phoneme separators,
different output modes (`--ipa=1/2/3`), stress/tie options, and direct control
over the emscripten filesystem. `phonemizer` deliberately hides these.

## Usage

### `espeak-ng` — drive it like the CLI

```js
import ESpeakNg from "espeak-ng";

// Pass command-line-style arguments; output is written to a virtual file.
const espeak = await ESpeakNg({
  arguments: [
    "--phonout", "generated",   // write phonemes to this virtual file
    '--sep=""',                 // no separator between phonemes
    "-q",                       // quiet (no audio)
    "-b=1",                     // UTF-8
    "--ipa=3",                  // IPA output
    "-v", "en-us",              // voice / accent
    '"Some text segment"',
  ],
});

// Read the result back out of the emscripten filesystem.
const phonemes = espeak.FS.readFile("generated", { encoding: "utf8" });
```

Downsides: you assemble argv by hand (quoting is easy to get wrong), and you
must read the output back out of a virtual filesystem.

### `phonemizer` — one call

```js
import { phonemize } from "phonemizer";

const phonemes = await phonemize("Hello world.");
console.log(phonemes); // ['həlˈəʊ wˈɜːld']

// Accent as the second argument:
const scottish = await phonemize("Hello world.", "en-gb-scotland");
console.log(scottish); // ['həlˈoː wˈʌɹld']
```

Install / import:

```js
import { phonemize } from "phonemizer";        // ES module
const { phonemize } = require("phonemizer");    // CommonJS
```

```html
<!-- CDN -->
<script type="module">
  import { phonemize } from "https://cdn.jsdelivr.net/npm/phonemizer";
</script>
```

Notes:

- Returns an **array** of strings — take `result[0]` or `result.join(" ")`.
- Both `phonemize()` and `list_voices()` are `async` — must be `await`ed.

## Decision

Use **`phonemizer`** for this project.

- It's the same engine with a clean, one-line API, so there's no downside in
  output quality — only less boilerplate.
- For "text → IPA" we don't need the extra espeak-ng flags.
- The stress marks in its output are a plus for pronunciation learning.

Only drop down to raw **`espeak-ng`** if we later need a specific flag that
`phonemizer` doesn't expose (e.g. a custom phoneme separator or a different
`--ipa` mode).
