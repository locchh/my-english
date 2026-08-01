/**
 * The homepage picture: the sky and the Big Ben clock tower, ported from the
 * "Big Ben Drawing" design.
 *
 * The geometry is the design's and is kept verbatim — it is drawn artwork, and
 * nothing good comes of adjusting the numbers. Two things changed in the port.
 *
 * The first is where it all lives. The design carried every size and colour
 * inline; here the sizes move to CSS classes, and every colour that varies by
 * time of day resolves to a CSS variable. So the scene is built once and
 * repainted by writing one attribute — `data-phase` on the section — rather
 * than being redrawn.
 *
 * The second is the loops. The design used `<sc-for>`, a template tag belonging
 * to the design tool, for the clock's hour marks, the diamond band, the shaft
 * windows and the birds. A browser has never heard of `<sc-for>` and would
 * render it as an empty unknown element, so those are generated here instead.
 */

/** `n` copies of one block — what `<sc-for>` did where the items are identical. */
const times = (n: number, make: (i: number) => string): string =>
  Array.from({ length: n }, (_, i) => make(i)).join('')

/**
 * Deterministic scatter for the stars. Seeded rather than `Math.random` so the
 * sky is the same every load — a constellation that reshuffles on refresh reads
 * as a rendering fault rather than as sky.
 */
const rand = (seed: number): number => {
  const x = Math.sin(seed * 127.1) * 43758.5453
  return x - Math.floor(x)
}

/* ---------- sky ---------- */

/** The design's three birds, with the phases of their glide already offset. */
const BIRDS: { top: string; left: string; delay: string }[] = [
  { top: '14%', left: '18%', delay: '0s' },
  { top: '22%', left: '68%', delay: '-5s' },
  { top: '9%', left: '55%', delay: '-9s' },
]

const STARS = 46

/**
 * Stars are the one part of the scene the design has no counterpart for: it is
 * a daylight drawing. They sit at opacity 0 by day, so day is still exactly the
 * picture that was designed, and fade in with the rest of the night palette.
 *
 * They are kept to the upper half of the frame. Lower down they would fall
 * behind the tower, and a star showing through masonry reads as a speck of dust
 * on the screen rather than as sky.
 */
const stars = (): string =>
  times(STARS, (i) => {
    const left = rand(i + 1) * 100
    const top = 2 + rand(i + 17) * 52
    const size = 1 + rand(i + 29) * 1.6
    return `<span class="star" style="
      left: ${left.toFixed(2)}%; top: ${top.toFixed(2)}%;
      width: ${size.toFixed(2)}px; height: ${size.toFixed(2)}px;
      animation-delay: -${(rand(i + 41) * 6).toFixed(2)}s"></span>`
  })

/**
 * A distant bird: two wings sweeping up from the body, drawn as one stroke.
 *
 * The design made these from a pair of straight bars tilted towards each other,
 * which meets in the middle as a peak — a "^", which is a bird pointing the
 * wrong way up. A bird in flight is the other shape: the body sits lowest and
 * the wings rise from it.
 *
 * Two details do the work. The far control point of each half sits level with
 * the body, which puts a horizontal tangent at the centre and keeps the wings
 * one smooth line rather than a kink. The near control point sits close to the
 * wingtip, which makes the wing leave the tip at about fifty degrees and flatten
 * as it comes in — steep tips over a flat body. Spread the control points evenly
 * instead and the curve is a single shallow arc, which reads as a smile.
 */
const BIRD_PATH = 'M1 1 C 5 5.5, 7 9, 9 9 C 11 9, 13 5.5, 17 1'

/**
 * Everything above the tower: the sun (or moon), three cloud banks, the stars
 * and the birds. All of it is placed in percentages, so it is responsive
 * without any help — the tower is the only fixed-pixel thing in the picture.
 */
const sky = (): string => `
  <div class="sky" aria-hidden="true">
    <div class="glow"></div>
    <div class="stars">${stars()}</div>
    <div class="cloud cloud--a"></div>
    <div class="cloud cloud--b"></div>
    <div class="cloud cloud--c"></div>
    ${BIRDS.map(
      (b) => `
      <svg class="bird" viewBox="0 0 18 10"
           style="top: ${b.top}; left: ${b.left}; animation-delay: ${b.delay}">
        <path d="${BIRD_PATH}"/>
      </svg>`,
    ).join('')}
  </div>`

/* ---------- the clock ---------- */

/**
 * The dial, from the bezel inwards.
 *
 * The hands carry no angle here. Their rotation is a custom property that
 * `home.ts` writes on every tick, because the full transform is a composition —
 * `translate(-50%, -100%) rotate(...)` — and the translate is what puts the
 * pivot on the centre of the dial. Writing `transform` from script would drop
 * it and both hands would fly off the face.
 */
const dial = (): string => `
  <div class="dial">
    <div class="dial__minutes"></div>
    ${times(12, (i) => `<span class="dial__tick" style="--deg: ${i * 30}deg"></span>`)}
    <div class="dial__hairline"></div>
    <div class="hand hand--hour"></div>
    <div class="hand hand--minute"></div>
    <div class="dial__boss"></div>
  </div>`

/* ---------- the tower ---------- */

/**
 * Seventeen blocks in a flex column, finial down to plinth — 172px wide and
 * 936px tall at the size it was drawn. It stays at that size in the markup and
 * is fitted to the screen by a single `transform: scale()` in the stylesheet;
 * see the note on `.bigben` there for why it is scaled rather than rebuilt in
 * fluid units.
 */
const tower = (): string => `
  <div class="bigben" role="img" aria-label="Big Ben">
    <div class="bb-rod"></div>
    <div class="bb-orb"></div>
    <div class="bb-neck"></div>
    <div class="bb-ball"></div>
    <div class="bb-spire"><span class="bb-spire__seam"></span></div>
    <div class="bb-spire-foot">
      <span class="bb-horn"></span>
      <span class="bb-horn"></span>
    </div>
    <div class="bb-belfry-top">${times(4, () => '<span class="bb-louvre-sm"></span>')}</div>
    <div class="bb-roof"></div>
    <div class="bb-roof-band"></div>
    <div class="bb-belfry">${times(4, () => '<span class="bb-louvre"></span>')}</div>
    <div class="bb-belfry-band"></div>
    <div class="bb-pinnacles">
      <span class="bb-pinnacle"></span>
      <span class="bb-pinnacle-rail"></span>
      <span class="bb-pinnacle"></span>
    </div>
    <div class="bb-clock">
      <span class="bb-clock__inset"></span>
      <span class="bb-clock__lozenge"></span>
      <div class="bb-clock__bezel">${dial()}</div>
    </div>
    <div class="bb-diamonds">${times(9, () => '<span class="bb-diamond"></span>')}</div>
    <div class="bb-shaft">
      ${times(
        3,
        () => `
        <span class="bb-window">
          <span class="bb-window__mullion"></span>
          <span class="bb-window__transom" style="top: 64px"></span>
          <span class="bb-window__transom" style="top: 130px"></span>
          <span class="bb-window__transom" style="top: 196px"></span>
        </span>`,
      )}
    </div>
    <div class="bb-base">${times(5, () => '<span class="bb-tooth"></span>')}</div>
    <div class="bb-plinth"></div>
  </div>`

/**
 * The whole picture as one string. No DOM access — `home.ts` owns that.
 *
 * The design put a city skyline along the bottom; it is deliberately not here.
 * The page is the tower and the menu, and a row of anonymous rooftops competed
 * with both for the eye without being either.
 */
export const renderScene = (): string => `${sky()}${tower()}`
