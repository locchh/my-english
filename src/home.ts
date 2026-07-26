import './style.css'
import { navHTML } from './nav'

/** One card on the landing page: an emoji, a title, and what the page does. */
type Feature = {
  href: string
  /** Decorative only — rendered with aria-hidden so screen readers skip it
   *  and announce the title instead of "speaking head, IPA Converter". */
  emoji: string
  title: string
  blurb: string
}

const features: Feature[] = [
  {
    href: 'ipa.html',
    emoji: '🗣️',
    title: 'IPA Converter',
    blurb: 'Type English, get the IPA transcription — plus the full phoneme chart with Vietnamese hints.',
  },
  {
    href: 'verbs.html',
    emoji: '📚',
    title: 'Irregular Verbs',
    blurb: 'Base, past simple and past participle for the verbs that refuse to follow the rules.',
  },
  {
    href: 'tenses.html',
    emoji: '⏳',
    title: 'Tenses',
    blurb: 'All twelve English tenses, each with its shape and a worked example.',
  },
]

// The <a> wraps the whole card, so the entire tile is one click target and
// one tab stop — rather than a tiny link with dead space around it.
const card = (f: Feature): string => `
  <li>
    <a class="card" href="${f.href}">
      <span class="card-emoji" aria-hidden="true">${f.emoji}</span>
      <span class="card-body">
        <span class="card-title">${f.title}</span>
        <span class="card-blurb">${f.blurb}</span>
      </span>
    </a>
  </li>
`

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  ${navHTML('index.html')}
  <main>
    <h1>my-english <span aria-hidden="true">✨</span></h1>
    <p class="tagline">A small set of tools for learning English pronunciation and grammar.</p>
    <ul class="home-links">
      ${features.map(card).join('')}
    </ul>
  </main>
`
