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

/**
 * The topic filter, in chip order.
 *
 * Only categories something is actually filed under get a chip — an empty chip
 * is a dead end, and a chip that always returns the same one prompt is barely
 * better. Listed in a fixed order rather than in the order they happen to
 * appear in the data, so the row does not reshuffle when a prompt is added.
 */
const CATEGORIES: { id: string; label: string }[] = [
  { id: 'work', label: 'Work' },
  { id: 'personal', label: 'Personal' },
  { id: 'society', label: 'Society' },
  { id: 'future', label: 'Future' },
].filter((c) => TALKS.some((t) => t.topics?.includes(c.id)))

/** Empty means everything. Selecting nothing is the same question as selecting
 *  all of them, and making the user tick four boxes to get the default would be
 *  a worse way to say so. */
const selected = new Set<string>()

const pool = (): ShortTalk[] =>
  selected.size ? TALKS.filter((t) => t.topics?.some((x) => selected.has(x))) : TALKS

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

/**
 * ARES, offered once here and nowhere else.
 *
 * It is deliberately not a template with a blank per step. Four labelled slots
 * to fill in turns speaking into form-filling: you stop listening to your own
 * answer and start checking which box you are in, and every answer comes out
 * the same shape. It belongs on the idle screen as something to fall back on
 * when the mind goes blank — which is the failure this whole drill exists to
 * fix — and it disappears the moment a prompt is on, because by then the
 * question is what you have to say, not what order to say it in.
 */
const aresHTML = (): string => `
  <p class="ares">
    Stuck for a way in? <strong>ARES</strong> — agree, reason, explain,
    substitution <span class="ares__vi" lang="vi">(thay thế)</span>.
    <span class="ares__ex">
      “Yeah, I remember a serious mistake… Because I… If I had the chance I’d
      never do it again, and I will…”
    </span>
    A way in, not a rule — drop it as soon as you have something to say.
  </p>
`

/** The idle stage. The count follows the current selection — a fixed total
 *  would be a lie the moment a tag is on. */
const emptyHTML = (): string => {
  const n = pool().length
  return `
    <p class="talk-empty">
      <span class="talk-empty__lead">Press Start for a prompt.</span>
      30 seconds to think, 90 seconds to answer out loud.
      ${n} prompt${n === 1 ? '' : 's'} in this selection — you will see every one
      before any comes round again.
    </p>
    ${aresHTML()}
  `
}

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  ${navHTML('talk.html')}
  <main>
    <h1>Short Talk</h1>
    <p class="tagline">
      A prompt and two minutes. Answer out loud — the clock is the exercise.
    </p>

    <!--
      Above the card, not inside it. The card is one prompt and its clock; the
      filter is what decides which prompts the card can draw at all, and it
      outlives every run. It also grows — four categories now, more later — and
      inside the card that growth would push the prompt down the page.

      Outside .talk-stage matters for a second reason: the stage's innerHTML is
      replaced on every draw and on Stop, so chips living in there would be
      destroyed along with whatever was listening to them. One delegated
      listener on this container, bound once, survives all of it.
    -->
    <div class="talk-tags" id="talk-tags" role="group" aria-label="Topics">
      <span class="talk-tags__label">Topics</span>
      ${CATEGORIES.map(
        (c) => `
        <button type="button" class="talk-tag" data-topic="${c.id}" aria-pressed="false">
          ${c.label}
        </button>`,
      ).join('')}
      <span class="talk-tags__hint">none selected = everything</span>
    </div>

    <section class="talk" data-phase="idle" aria-label="Short talk">
      <div class="talk-stage" id="talk-stage">${emptyHTML()}</div>

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
const tagsEl = document.querySelector<HTMLElement>('#talk-tags')!

/**
 * The bag is rebuilt whenever the selection changes, which is what starts a
 * fresh shuffle over the new pool. Including the change back to nothing
 * selected: zero tags means the full set, and that is a different pool from
 * the filtered one it replaces, not the absence of a change.
 */
let nextTalk = makeBag(pool())

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
  stage.innerHTML = emptyHTML()
  statusEl.textContent = 'Stopped.'
})

/*
 * Toggling a tag mid-run leaves the run alone: the clock keeps its time and the
 * prompt on screen stays, because the new selection is about what comes next
 * and pulling the question out from under someone who is answering it would be
 * the opposite of the exercise. The alternative — disabling the chips while the
 * clock runs — is a worse cure than the problem.
 */
tagsEl.addEventListener('click', (e) => {
  const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('.talk-tag')
  if (!btn) return

  const id = btn.dataset.topic!
  if (selected.has(id)) selected.delete(id)
  else selected.add(id)
  btn.setAttribute('aria-pressed', String(selected.has(id)))

  nextTalk = makeBag(pool())
  // The idle stage prints the count, so it is stale the moment this changes.
  // Mid-run the stage holds a prompt, which is not ours to overwrite.
  if (root.dataset.phase === 'idle') stage.innerHTML = emptyHTML()
  statusEl.textContent = `${pool().length} prompts in this selection.`
})
