import './style.css'
import { navHTML } from './nav'
import { makeBag } from './deck'
import talkData from './data/short-talks.json'

/**
 * Short Talk: one prompt, two minutes.
 *
 * Thirty seconds to prepare, ninety to speak. The point of the clock is that it
 * does not wait — the drill is answering before the mind has time to go blank,
 * so the handover happens whether or not you are ready for it.
 */

/*
 * Adding a prompt is editing short-talks.json and nothing else — the count in
 * the empty state, the rotation and the markup all follow from the file.
 *
 * `content` is the only field that has to be there. The other two are optional
 * because `talkData as ShortTalk[]` is an assertion rather than a check:
 * TypeScript will not notice a missing field in the JSON, so anything declared
 * required here is only required in a comment, and the first sign of trouble is
 * the page failing to render. Whatever the file can leave out, the code has to
 * cope with.
 */
interface ShortTalk {
  /** A stable handle for whoever is editing the file. Nothing reads it. */
  id?: string
  /**
   * The whole prompt, freeform. A blank line starts a new paragraph and a line
   * beginning `-`, `*` or `•` is a bullet, so a prompt carries its own points
   * rather than having them split into a second field. That split was the first
   * shape this had, and it was wrong: it only fitted prompts written as a
   * question plus a list, and the moment one wanted a second paragraph, or no
   * points at all, there was nowhere to put it.
   */
  content: string
  /** Metadata, shown as chips. Not a filter — there is nothing to filter yet. */
  topics?: string[]
}

const TALKS = talkData as ShortTalk[]

/** Seconds. The two phases and the whole run. */
const PREPARE = 30
const SPEAK = 90
const TOTAL = PREPARE + SPEAK

type Phase = 'idle' | 'prepare' | 'speak' | 'done'

/** Which phase a given moment falls in. The single source of truth for both the
 *  colour and the readout — deriving them from one elapsed time is what keeps
 *  them from disagreeing. */
const phaseAt = (elapsed: number): Phase =>
  elapsed < PREPARE ? 'prepare' : elapsed < TOTAL ? 'speak' : 'done'

/** Seconds still to run in whichever phase `elapsed` is in. */
const remainingIn = (elapsed: number): number =>
  elapsed < PREPARE ? PREPARE - elapsed : Math.max(0, TOTAL - elapsed)

/** m:ss. Rounded up, so a fresh phase reads 0:30 rather than 0:29. */
const clock = (seconds: number): string => {
  const s = Math.max(0, Math.ceil(seconds))
  return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`
}

const LABEL: Record<Phase, string> = {
  idle: 'Ready',
  prepare: 'Prepare',
  speak: 'Speak',
  done: 'Time',
}

const esc = (s: string): string =>
  s.replace(
    /[&<>"']/g,
    (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]!,
  )

const BULLET = /^[-*•]\s+/

/**
 * Freeform text to markup. Consecutive bullet lines gather into one list; a
 * blank line ends whatever was open.
 *
 * Every paragraph is set the same. An earlier version promoted the first one to
 * a heading on the assumption that it was always the question, which is exactly
 * the kind of structure a freeform field should not be inferring — the prompt is
 * written as it is meant to be read.
 */
const promptHTML = (t: ShortTalk): string => {
  const out: string[] = []
  let bullets: string[] = []

  const closeList = (): void => {
    if (!bullets.length) return
    out.push(`<ul class="talk-points">${bullets.join('')}</ul>`)
    bullets = []
  }

  for (const raw of (t.content ?? '').split('\n')) {
    const line = raw.trim()
    if (!line) {
      closeList()
      continue
    }
    if (BULLET.test(line)) {
      bullets.push(`<li>${esc(line.replace(BULLET, ''))}</li>`)
      continue
    }
    closeList()
    out.push(`<p class="talk-line">${esc(line)}</p>`)
  }
  closeList()

  // No chip list at all when there are no topics — an empty <ul> still carries
  // its bottom margin, which reads as a stray gap above the prompt.
  const topics = t.topics ?? []
  const chips = topics.length
    ? `<ul class="talk-topics">${topics.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`
    : ''
  return `${chips}${out.join('')}`
}

const EMPTY = `
  <p class="talk-empty">
    <span class="talk-empty__lead">Press Start for a prompt.</span>
    30 seconds to think, 90 seconds to answer out loud.
    ${TALKS.length} prompts — you will see every one before any comes round again.
  </p>
`

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  ${navHTML('talk.html')}
  <main>
    <h1>Short Talk</h1>
    <p class="tagline">
      A prompt and two minutes. Answer out loud — the clock is the exercise.
    </p>

    <section class="talk" data-phase="idle" aria-label="Short talk">
      <div class="talk-stage" id="talk-stage">${EMPTY}</div>

      <div class="talk-timer">
        <div class="talk-head">
          <span class="talk-phase" id="talk-phase">${LABEL.idle}</span>
          <!-- aria-live is off on purpose: a per-second countdown in a live
               region announces sixty times a minute and buries everything
               else. The polite region below speaks three times instead. -->
          <span class="talk-time" id="talk-time" role="timer" aria-live="off">${clock(PREPARE)}</span>
        </div>

        <!-- Both phases are painted on the track at all times, so the shape of
             the two minutes is legible before the clock has even started. -->
        <div class="talk-track">
          <span class="talk-fill" id="talk-fill"></span>
          <span class="talk-split"></span>
        </div>

        <!-- The legend is what makes the colours legible to someone who cannot
             tell amber from green: the split is stated in words and in widths,
             not only in hue (WCAG 1.4.1). -->
        <div class="talk-legend">
          <span class="talk-legend__zone talk-legend__zone--prepare">30s prepare</span>
          <span class="talk-legend__zone talk-legend__zone--speak">90s speak</span>
        </div>
      </div>

      <div class="talk-controls">
        <button type="button" id="talk-go">Start</button>
        <button type="button" id="talk-stop" disabled>Stop</button>
      </div>

      <p class="sr-only" id="talk-status" aria-live="polite"></p>
    </section>
  </main>
`

const root = document.querySelector<HTMLElement>('.talk')!
const stage = document.querySelector<HTMLElement>('#talk-stage')!
const phaseEl = document.querySelector<HTMLElement>('#talk-phase')!
const timeEl = document.querySelector<HTMLElement>('#talk-time')!
const fillEl = document.querySelector<HTMLElement>('#talk-fill')!
const goBtn = document.querySelector<HTMLButtonElement>('#talk-go')!
const stopBtn = document.querySelector<HTMLButtonElement>('#talk-stop')!
const statusEl = document.querySelector<HTMLElement>('#talk-status')!

const nextTalk = makeBag(TALKS)

let frame: number | undefined
let startedAt = 0
let shown: Phase = 'idle'

/**
 * Paint one moment. Everything visible is a function of `phase` and `elapsed`,
 * so there is no state to fall out of step — and the announcement fires only
 * where the phase actually changed, which is three times a run.
 */
const paint = (phase: Phase, elapsed: number): void => {
  root.dataset.phase = phase
  timeEl.textContent = clock(remainingIn(elapsed))
  fillEl.style.width = `${Math.min(100, (elapsed / TOTAL) * 100)}%`

  if (phase === shown) return
  shown = phase
  phaseEl.textContent = LABEL[phase]
  statusEl.textContent =
    phase === 'prepare'
      ? 'Prepare. 30 seconds.'
      : phase === 'speak'
        ? 'Speak. 90 seconds.'
        : phase === 'done'
          ? "Time's up."
          : ''
}

/**
 * Kill the running loop. Called before every start as well as by Stop — click
 * the button twice and without this there are two frame loops driving the same
 * elements, each with its own start time.
 */
const halt = (): void => {
  if (frame !== undefined) cancelAnimationFrame(frame)
  frame = undefined
  stopBtn.disabled = true
}

/*
 * One clock, and the phase read off it.
 *
 * The obvious alternative — a timeout at 30s for the handover plus an interval
 * for the display — drifts apart the moment the tab is backgrounded and its
 * timers are throttled, and you get a green bar over the word "Prepare".
 * Elapsed time from a single timestamp cannot disagree with itself.
 */
const tick = (): void => {
  const elapsed = (performance.now() - startedAt) / 1000
  const phase = phaseAt(elapsed)
  paint(phase, elapsed)

  if (phase === 'done') {
    halt()
    goBtn.textContent = 'Next prompt'
    goBtn.focus()
    return
  }
  frame = requestAnimationFrame(tick)
}

const start = (): void => {
  halt()
  stage.innerHTML = promptHTML(nextTalk())
  goBtn.textContent = 'Next prompt'
  stopBtn.disabled = false
  shown = 'idle'
  startedAt = performance.now()
  tick()
}

goBtn.addEventListener('click', start)

stopBtn.addEventListener('click', () => {
  halt()
  shown = 'idle'
  paint('idle', 0)
  goBtn.textContent = 'Start'
  stage.innerHTML = EMPTY
  statusEl.textContent = 'Stopped.'
})
