import './style.css'
import { renderScene } from './scene'

/**
 * The homepage: the Big Ben scene, with the menu over it. No site nav and no
 * card list — the picture is the page and the menu is the navigation, the way a
 * title screen works. Every other page keeps the ordinary nav.
 *
 * Two things move once the page is up, and nothing else does: `data-phase` on
 * the root, which every colour in the picture reads through a CSS variable, and
 * the rotation of the two clock hands. Both are written by the same tick.
 */

type Phase = 'day' | 'night'

/** One entry in the menu. `label` is the keyword under the title, not a blurb. */
type Board = { href: string; title: string; label: string }

const BOARDS: Board[] = [
  { href: 'ipa.html', title: 'IPA Converter', label: 'pronunciation' },
  { href: 'verbs.html', title: 'Irregular Verbs', label: 'the awkward ones' },
  { href: 'tenses.html', title: 'Tenses', label: 'all twelve' },
  { href: 'talk.html', title: 'Short Talk', label: 'two minutes' },
]

/**
 * Local wall-clock hours. Deliberately blunt — the point is that the page looks
 * like the time it is, not that it models sunset.
 */
const phaseAt = (hour: number): Phase => (hour >= 6 && hour < 18 ? 'day' : 'night')

/**
 * Where the hands point, in degrees clockwise from twelve.
 *
 * Big Ben has no second hand, so neither does this, and one update a minute is
 * enough. The half-degree per minute on the hour hand is what stops it jumping
 * from numeral to numeral: at twenty to four the real hand is most of the way
 * to four, and a clock whose hour hand sits exactly on three all through the
 * hour looks wrong in a way that is hard to name but easy to see.
 */
const handAngles = (now: Date): { hour: number; minute: number } => {
  const h = now.getHours() % 12
  const m = now.getMinutes()
  return { hour: h * 30 + m * 0.5, minute: m * 6 }
}

/** "Big Ben. The clock reads 3:47." — the picture's alternative text. */
const clockLabel = (now: Date): string => {
  const h = now.getHours() % 12 || 12
  const m = now.getMinutes().toString().padStart(2, '0')
  return `Big Ben. The clock reads ${h}:${m}.`
}

/**
 * The Union Flag, drawn rather than set as an emoji: Windows renders 🇬🇧 as the
 * bare letters "GB", and a wordmark is the wrong place to discover that.
 *
 * Built the way the flag itself is specified — a blue field, the white saltire
 * of St Andrew, the red saltire of St Patrick laid over it, then the white and
 * red cross of St George. The clip path is what counterchanges St Patrick's
 * red: it is offset clockwise of the white in each quarter, which is why the
 * diagonals pinwheel rather than sit centred.
 */
const FLAG = `
  <svg class="menu__flag" viewBox="0 0 60 30" aria-hidden="true">
    <clipPath id="uk-counterchange">
      <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/>
    </clipPath>
    <rect width="60" height="30" fill="#012169"/>
    <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" stroke-width="6"/>
    <path d="M0,0 L60,30 M60,0 L0,30" clip-path="url(#uk-counterchange)"
          stroke="#c8102e" stroke-width="4"/>
    <path d="M30,0 v30 M0,15 h60" stroke="#fff" stroke-width="10"/>
    <path d="M30,0 v30 M0,15 h60" stroke="#c8102e" stroke-width="6"/>
  </svg>`

/*
 * The quote sits above the list, not below it. Below, it was a closing line;
 * with more boards to come it would have been pushed off the bottom of a
 * scrolling list, so it reads as a standing epigraph instead.
 */
const menu = (): string => `
  <div class="menu">
    <h1 class="menu__title">my-english ${FLAG}</h1>
    <p class="menu__tagline">Tools for English pronunciation and grammar.</p>
    <p class="menu__quote">“There are no shortcuts — practicing every day is the <strong>ONLY</strong> way.”</p>
    <nav class="menu__nav" aria-label="Boards">
      <ul class="menu__list">
        ${BOARDS.map(
          (b) => `
          <li>
            <a class="pick" href="${b.href}">
              <span class="pick__title">${b.title}</span>
              <span class="pick__label">${b.label}</span>
            </a>
          </li>`,
        ).join('')}
      </ul>
    </nav>
  </div>`

/*
 * <main> rather than <section>: the picture and the menu together are the whole
 * of this page, and without a landmark around them the h1 and the tower sit
 * outside any region. The heading is a sibling of the <nav>, not inside it — a
 * page title is not part of the navigation.
 */
const mount = document.querySelector<HTMLDivElement>('#app')!
mount.innerHTML = `
  <main class="home" data-phase="day">
    ${renderScene()}
    ${menu()}
  </main>`

const home = mount.querySelector<HTMLElement>('.home')!
const bigben = mount.querySelector<HTMLElement>('.bigben')!
const hourHand = mount.querySelector<HTMLElement>('.hand--hour')!
const minuteHand = mount.querySelector<HTMLElement>('.hand--minute')!

// ?phase=night forces one, for looking at both without waiting half a day.
const forced = new URLSearchParams(location.search).get('phase')
const pinned: Phase | null = forced === 'day' || forced === 'night' ? forced : null

/**
 * One `Date` for the whole tick. Reading the clock twice would let a minute
 * boundary fall between the two reads and leave the hands disagreeing.
 */
const tick = (): void => {
  const now = new Date()
  const phase = pinned ?? phaseAt(now.getHours())
  if (home.dataset.phase !== phase) home.dataset.phase = phase

  const { hour, minute } = handAngles(now)
  hourHand.style.setProperty('--deg', `${hour}deg`)
  minuteHand.style.setProperty('--deg', `${minute}deg`)
  bigben.setAttribute('aria-label', clockLabel(now))
}

/**
 * Tick on the minute rather than every sixty seconds from load. A plain
 * interval starting at, say, :30 leaves the displayed minute half a minute
 * stale for as long as the page is open; re-aiming at each boundary also
 * absorbs the drift a background tab accumulates while its timers are
 * throttled. The 50ms is margin — firing a hair early would land the tick back
 * in the minute it just left, and the clock would stall for a whole minute.
 */
const scheduleTick = (): void => {
  tick()
  const now = new Date()
  const untilNextMinute = 60_000 - (now.getSeconds() * 1000 + now.getMilliseconds())
  window.setTimeout(scheduleTick, untilNextMinute + 50)
}

scheduleTick()
