import './style.css'
import { navHTML } from './nav'
import {
  notes,
  findTense,
  type Tense,
  type TenseForms,
  type TenseExample,
  type Note,
  type NoteRule,
  type Usage,
  type Time,
  type Aspect,
} from './tense-data'

// Display order for the grid — independent of the order `tenses` is stored
// in; findTense() looks up by (time, aspect), not position.
const times: Time[] = ['past', 'present', 'future']
const aspects: Aspect[] = ['simple', 'continuous', 'perfect', 'perfect-continuous']

const timeLabel: Record<Time, string> = { past: 'Past', present: 'Present', future: 'Future' }
const aspectLabel: Record<Aspect, string> = {
  simple: 'Simple',
  continuous: 'Continuous',
  perfect: 'Perfect',
  'perfect-continuous': 'Perfect Continuous',
}

// The two halves of the composition rule, printed in the headers so the
// matrix itself shows how each cell's meaning is derived — read a column
// hint + a row hint and you have the tense's meaning, no memorising.
//
// The column fixes WHICH POINT IN TIME is being talked about...
// "thời điểm", never "mốc". PROMPT.md — the authoritative register for this
// page — uses "thời điểm" four times and "mốc" zero times; "mốc" was invented
// here, and on its own it reads as either a boundary stake or mildew.
const timeHint: Record<Time, string> = {
  past: 'thời điểm nói tới ở quá khứ',
  present: 'thời điểm nói tới là hiện tại',
  future: 'thời điểm nói tới ở tương lai',
}

// The ASSEMBLY halves. Every English tense is one pattern (the row) whose
// first word is then conjugated by the column:
//   past + continuous  → be(quá khứ)  + V-ing → was/were working
//   present + perfect  → have(hiện tại) + V3  → have/has worked
//   future + perfect-continuous → will + have + been + V-ing
// Printed in the headers so a formula can be built from two pieces instead of
// memorised whole — which is what makes all twelve cells derivable.
const aspectFragment: Record<Aspect, string> = {
  simple: 'chỉ động từ chính',
  continuous: 'be + V-ing',
  perfect: 'have + V3',
  'perfect-continuous': 'have + been + V-ing',
}
// "chữ đầu", not "từ đầu": the latter reads far more naturally as the adverbial
// "from the start" than as "the first word".
const timeFragment: Record<Time, string> = {
  past: 'chia chữ đầu ở quá khứ',
  present: 'chia chữ đầu ở hiện tại',
  future: 'thêm will, chữ đầu để nguyên thể',
}

// ...and the row fixes HOW THE ACTION RELATES to that point. This is the half
// the naive "simple = diễn ra / perfect = hoàn thành" version drops, which is
// why it can't tell Past Simple from Past Perfect.
//
// Wording is deliberately plain-textbook Vietnamese (the register PROMPT.md
// uses), not invented shorthand. Three constraints each phrase has to satisfy:
//
// `simple` must NOT say "xảy ra tại mốc" — two documented usages disprove it:
// a chân lý ("The sun rises in the East") isn't located at any one time, and a
// timetable ("The train leaves at 8 a.m. tomorrow") is present tense about a
// FUTURE event. Past Simple also covers a closed span ("He worked there for
// ten years"), not just a point.
//
// `continuous` must NOT say "tại mốc" either — it covers a single point ("At
// eight o'clock last night, I was watching TV"), a whole span ("It was raining
// all day yesterday"), and two parallel actions.
//
// `perfect` must NOT say "xong" — perfect does not require completion:
// "They have lived in Ha Noi since 2015" is present perfect and they still
// live there. It asserts anteriority plus present relevance.
const aspectHint: Record<Aspect, string> = {
  simple: 'chỉ cho biết việc có xảy ra',
  continuous: 'đang xảy ra, chưa kết thúc',
  perfect: 'xảy ra trước thời điểm đó, còn liên quan tới nó',
  'perfect-continuous': 'kéo dài liên tục tới thời điểm đó',
}

/** One <td>: a flip card. Face-up is the example sentence — the same sentence
 *  across all twelve cells, so only the tense changes — and hovering flips to
 *  the formula.
 *
 *  Both faces are real DOM, so a screen reader gets example AND formula
 *  regardless of the visual state, and find-in-page matches either.
 *  :focus-visible flips too, so the formula is reachable by keyboard; on touch,
 *  where hover doesn't exist, tapping opens the popup which carries the full
 *  formula anyway. */
function cellHTML(time: Time, aspect: Aspect): string {
  const t = findTense(time, aspect)
  // time-${time} tints the box by column. The tint is reinforcement only —
  // the column header still names the time in text, so a colourblind reader
  // loses nothing (WCAG 1.4.1), same rule the IPA board follows.
  //
  // The star marking a common tense is aria-hidden and paired with sr-only
  // text, so it isn't announced as "black star" and isn't colour-only either.
  const badge = t.common
    ? `<span class="sr-only">Thì thông dụng. </span><span class="common-badge" aria-hidden="true">★</span>`
    : ''
  return `
    <td>
      <button type="button" class="tense-cell time-${time}${t.common ? ' is-common' : ''}"
              data-time="${time}" data-aspect="${aspect}">
        <span class="cell-inner">
          <span class="cell-face cell-front">
            ${badge}
            <span class="cell-example-en">${t.example.en}</span>
            <span class="cell-example-vi" lang="vi">${t.example.vi}</span>
          </span>
          <span class="cell-face cell-back">
            <span class="cell-formula">${t.forms.affirmative}</span>
          </span>
        </span>
      </button>
    </td>
  `
}

/** States the composition rule in prose, above the grid. Without this the
 *  header hints look like decoration rather than two halves to multiply. */
function ruleHTML(): string {
  return `
    <section class="tense-rule" aria-labelledby="rule-heading">
      <h2 id="rule-heading">How to read the matrix</h2>
      <p lang="vi">
        Mỗi thì được ghép từ hai phần: <strong>cột</strong> cho biết thời điểm nói
        tới (quá khứ, hiện tại hay tương lai), còn <strong>dòng</strong> cho biết
        hành động, sự việc đó xảy ra thế nào so với thời điểm ấy. Ghép hai phần lại
        ta được nghĩa của thì, không cần học thuộc cả 12 ô.
      </p>
      <p lang="vi">
        Ví dụ: <em>past</em> (thời điểm nói tới ở quá khứ) +
        <em>perfect continuous</em> (kéo dài liên tục tới thời điểm đó) =
        <strong>một hành động kéo dài liên tục cho tới một thời điểm trong quá khứ</strong>.
      </p>
      <p lang="vi">
        Chỗ dễ hiểu sai thứ nhất: <em>perfect</em> <strong>không</strong> có nghĩa là
        “đã xong”, mà là “xảy ra trước thời điểm nói tới và còn liên quan tới thời
        điểm đó” — <em>They have lived here since 2015</em> là hiện tại hoàn thành,
        và hiện họ vẫn sống ở đó.
      </p>
      <p lang="vi">
        Chỗ dễ hiểu sai thứ hai: <em>simple</em> <strong>không</strong> có nghĩa là
        “xảy ra đúng vào thời điểm đó” — <em>The sun rises in the East</em> là một
        chân lý, lúc nào cũng đúng chứ không xảy ra riêng vào một thời điểm nào; còn
        <em>The train leaves at 8 a.m. tomorrow</em> thì động từ chia ở thì hiện tại
        nhưng lại nói về việc trong tương lai.
      </p>
      <p lang="vi">
        Cuối cùng, đừng mặc định rằng <strong>đã / đang / sẽ</strong> luôn ứng với
        một thì tiếng Anh nhất định — xem ghi chú “Lỗi thường gặp khi dịch” ở dưới.
      </p>
    </section>
  `
}

/** The whole matrix: an empty corner cell + time headers, then one row per
 *  aspect built from cellHTML. Each header carries its half of the rule as a
 *  second line. */
function gridHTML(): string {
  const header = `
    <tr>
      <!-- <td>, not <th>: the corner labels nothing, and an empty <th> is a
           header that names no row or column — axe flags it as
           empty-table-header, and a screen reader announces a blank header. -->
      <td></td>
      ${times
        .map(
          (t) => `
        <th scope="col" class="time-${t}">
          ${timeLabel[t]}
          <span class="axis-hint" lang="vi">${timeHint[t]}</span>
          <span class="axis-fragment" lang="vi">${timeFragment[t]}</span>
        </th>
      `,
        )
        .join('')}
    </tr>
  `
  const rows = aspects
    .map(
      (a) => `
      <tr>
        <th scope="row">
          ${aspectLabel[a]}
          <span class="axis-hint" lang="vi">${aspectHint[a]}</span>
          <span class="axis-fragment">${aspectFragment[a]}</span>
        </th>
        ${times.map((t) => cellHTML(t, a)).join('')}
      </tr>
    `,
    )
    .join('')

  return `
    <section aria-labelledby="grid-heading">
      <h2 id="grid-heading">The 12 tenses</h2>
      <!-- Not .tagline: that class is centred for the home-page hero, which
           reads as a stray centred line above a left-aligned table. -->
      <p class="grid-hint">Click a cell for the full formula and examples.</p>

      <div class="grid-controls">
        <p class="legend-common">
          <span class="common-badge" aria-hidden="true">★</span>
          <span lang="vi">= 5 thì thông dụng nhất, nên học trước</span>
        </p>
      </div>

      <table class="tense-grid" id="tense-grid">
        <caption class="sr-only">
          The 12 English tenses arranged by time (columns) and aspect (rows)
        </caption>
        <thead>${header}</thead>
        <tbody>${rows}</tbody>
      </table>
    </section>
  `
}

/** One label → formula pair. <dt> is the label (left-aligned by CSS) and <dd>
 *  the boxed, centred formula. */
const formRow = (label: string, formula: string): string =>
  `<div><dt lang="vi">${label}</dt><dd>${formula}</dd></div>`

/** The Form block: affirmative, then the negative/question pairs.
 *
 *  A tense with ONE unlabelled variant (ten of the twelve) folds all three
 *  rows into a single list. Present/Past Simple carry two labelled variants —
 *  ordinary verbs vs. special verbs — so each gets its own sub-heading and
 *  list, which is the distinction that decides whether do/does/did appears
 *  at all. */
function formsHTML(f: TenseForms): string {
  const single = f.variants.length === 1 && !f.variants[0].label

  if (single) {
    const v = f.variants[0]
    return `
      <dl class="tense-forms">
        ${formRow('Khẳng định', f.affirmative)}
        ${formRow('Phủ định', v.negative)}
        ${formRow('Nghi vấn', v.question)}
      </dl>
    `
  }

  return `
    <dl class="tense-forms">
      ${formRow('Khẳng định', f.affirmative)}
    </dl>
    ${f.variants
      .map(
        (v) => `
      <div class="form-variant">
        <h4 lang="vi">${v.label}</h4>
        <dl class="tense-forms">
          ${formRow('Phủ định', v.negative)}
          ${formRow('Nghi vấn', v.question)}
        </dl>
      </div>
    `,
      )
      .join('')}
  `
}

/** Usage list: what the tense expresses (Vietnamese) with an English sentence
 *  showing it. Numbered because the uses are a checklist to work through, and
 *  Mai Lan Hương presents them numbered too. */
function usagesHTML(usages: Usage[]): string {
  return `
    <ol class="usage-list">
      ${usages
        .map(
          (u) => `
        <li>
          <span class="usage-vi" lang="vi">${u.vi}</span>
          <span class="usage-en"><span class="usage-ex">Ex:</span> ${u.en}</span>
        </li>
      `,
        )
        .join('')}
    </ol>
  `
}

/** Signal words, as chips. Returns nothing when a tense has none rather than
 *  printing an empty heading. */
function adverbsHTML(adverbs: string[] | undefined): string {
  if (!adverbs?.length) return ''
  return `
    <h3 lang="vi">Phó từ / dấu hiệu nhận biết</h3>
    <ul class="adverb-list">
      ${adverbs.map((a) => `<li>${a}</li>`).join('')}
    </ul>
  `
}

/** Shared by the dialog's tense examples and each note's examples — same
 *  en/vi pair shape, same list markup. */
function examplesHTML(examples: TenseExample[]): string {
  return `
    <ul class="tense-examples">
      ${examples
        .map((ex) => `<li><span class="ex-en">${ex.en}</span><span class="ex-vi" lang="vi">${ex.vi}</span></li>`)
        .join('')}
    </ul>
  `
}

/** Full detail for one tense — name, every form it has, and its examples.
 *  Rendered into the dialog body on click. The h2 here is what
 *  aria-labelledby on the <dialog> points at. */
function tenseDetailHTML(t: Tense): string {
  return `
    <h2 id="tense-dialog-title">${t.nameEn}<span class="tense-name-vi" lang="vi">${t.nameVi}</span></h2>
    <!-- Labelled, not a bare highlighted paragraph. For the tenses with a
         single usage this block and that usage restate each other, and without
         a heading it just reads as repetition. The heading makes the division
         legible: Diễn tả = the generic composition from the matrix, Usage = the
         concrete cases it covers. -->
    <h3 lang="vi">Diễn tả</h3>
    <p class="tense-meaning" lang="vi">${t.meaning}</p>
    <h3>Form</h3>
    ${formsHTML(t.forms)}
    <h3>Usage</h3>
    ${usagesHTML(t.usages)}
    ${adverbsHTML(t.adverbs)}
  `
}

/** The when → then → examples lookup table. Headings come from the note, not
 *  hardcoded: the s/es table and the đã/đang/sẽ table are both three-column
 *  mappings but describe entirely different things, so fixed headings would
 *  mislabel one of them. Returns nothing for the prose-only notes. */
function rulesHTML(rules: NoteRule[] | undefined, heads: [string, string, string] | undefined): string {
  if (!rules) return ''
  const [h1, h2, h3] = heads ?? ['Khi nào', 'Dùng gì', 'Examples']
  return `
    <table class="note-rules">
      <thead>
        <tr>
          <th scope="col" lang="vi">${h1}</th>
          <th scope="col" lang="vi">${h2}</th>
          <th scope="col" lang="vi">${h3}</th>
        </tr>
      </thead>
      <tbody>
        ${rules
          .map(
            (r) => `
          <tr>
            <th scope="row" lang="vi">${r.when}</th>
            <td class="rule-then">${r.then}</td>
            <td>${r.examples}</td>
          </tr>
        `,
          )
          .join('')}
      </tbody>
    </table>
  `
}

/** One note block (s/es rules, near-future, stative verbs) for the page
 *  bottom. Rules table sits between the prose and the examples.
 *
 *  lang="vi" on the title and prose: all three notes are written in
 *  Vietnamese, so this is unconditional rather than a per-note flag. Without
 *  it a screen reader reads "tri giác" with English phonetics. The embedded
 *  English verb names (see, hear, going to) are a minority inside a
 *  Vietnamese sentence, which is what lang on the block is for. */
function noteHTML(n: Note): string {
  return `
    <article class="note">
      <h3 lang="vi">${n.title}</h3>
      ${n.body.map((p) => `<p lang="vi">${p}</p>`).join('')}
      ${rulesHTML(n.rules, n.ruleHeads)}
      ${examplesHTML(n.examples)}
    </article>
  `
}

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  ${navHTML('tenses.html')}
  <main>
    <h1>Tenses</h1>
    ${ruleHTML()}
    ${gridHTML()}

    <!-- native <dialog>: free focus-trap + Esc-to-close, so the a11y work
         other pages did by hand (aria-live, sr-only, etc.) comes for free here. -->
    <dialog id="tense-dialog" aria-labelledby="tense-dialog-title">
      <button type="button" id="tense-dialog-close" aria-label="Close">&times;</button>
      <div id="tense-dialog-body"></div>
    </dialog>

    <section aria-labelledby="notes-heading">
      <h2 id="notes-heading">⚠️Notes</h2>
      ${notes.map(noteHTML).join('')}
    </section>
  </main>
`

const dialog = document.querySelector<HTMLDialogElement>('#tense-dialog')!
const dialogBody = document.querySelector<HTMLElement>('#tense-dialog-body')!
const dialogClose = document.querySelector<HTMLButtonElement>('#tense-dialog-close')!
const grid = document.querySelector<HTMLElement>('.tense-grid')!

// Event delegation: one listener on the table instead of 12 (one per cell).
grid.addEventListener('click', (e) => {
  const button = (e.target as HTMLElement).closest<HTMLButtonElement>('button[data-time]')
  if (!button) return
  const time = button.dataset.time as Time
  const aspect = button.dataset.aspect as Aspect
  dialogBody.innerHTML = tenseDetailHTML(findTense(time, aspect))
  dialog.showModal()
})

dialogClose.addEventListener('click', () => dialog.close())
