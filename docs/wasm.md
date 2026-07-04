# WebAssembly (WASM)

## What it is

**WebAssembly (WASM)** is a low-level binary instruction format that runs in the
browser at near-native speed, alongside JavaScript. It lets code written in
languages like **C, C++, or Rust** be compiled to a compact `.wasm` binary and
run inside a web page. JavaScript and WASM can call each other.

## Why it exists

Browsers historically only ran JavaScript. JS is fine for most work but slow for
heavy computation. WASM addresses that:

- It's a **compiled binary**, not text that has to be parsed and interpreted, so
  it loads fast and runs close to native speed.
- It lets you reuse **existing programs written in other languages** in the
  browser, instead of rewriting them in JavaScript.

## How it fits with JavaScript

WASM does not replace JavaScript — they work together:

1. JS fetches and instantiates the `.wasm` module.
2. JS calls exported WASM functions and passes data in.
3. WASM runs the computation and returns results to JS.
4. JS handles the DOM, events, and UI as usual.

You almost never write raw WASM by hand. You write C/C++/Rust and a toolchain
(e.g. Emscripten for C/C++) compiles it to `.wasm` plus a JS "glue" file that
loads it.

## Why this project uses it

The text → IPA feature depends on **espeak-ng**, a program written in **C**.

- Normally espeak-ng runs as a **system binary** on a computer. That's exactly
  why it can't run on Vercel's serverless runtime (you can't install the binary
  there) and can't run in a browser natively.
- espeak-ng has been **compiled to WASM**, so the entire engine runs *inside the
  browser tab*, on the visitor's own machine.
- The [`phonemizer`](https://www.npmjs.com/package/phonemizer) package is the
  JavaScript that loads that `.wasm` file and calls into it. When you
  `await phonemize("hello")`, JS hands the text to the WASM engine, the engine
  does the phonetic conversion, and hands the IPA back.

## Consequences for this app

- **No backend.** Conversion happens on the user's device, so the site is pure
  static files — which is why it deploys free to Vercel/Netlify.
- **Works offline** once the page and WASM are loaded.
- **No per-request server cost** and nothing to scale.
- **Trade-off:** the `.wasm` binary is a few MB that the browser downloads once
  (then caches). This is the "heavier bundle" cost of the WASM approach.

## Mental model

WASM is a way to ship a **compiled program to the browser and run it there**,
instead of running it on a server. This app ships the espeak-ng *engine itself*
to each visitor.

## References

- [WebAssembly — MDN](https://developer.mozilla.org/en-US/docs/WebAssembly)
- [webassembly.org](https://webassembly.org/)
- [Emscripten](https://emscripten.org/) — the C/C++ → WASM toolchain
