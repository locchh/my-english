import './style.css'
import { navHTML } from './nav'
import { conjugate, type Conjugation } from './conjugate'
import { IrregularVerbs, type IrregularVerb } from './verb-data'

/** Escape before interpolating into innerHTML. The looked-up word is echoed
 *  back to the page and comes straight from the user, so it can't be trusted. */
const esc = (s: string): string =>
  s.replace(
    /[&<>"']/g,
    (ch) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[
        ch
      ]!,
  )

/** One row of the reference table. v1 is a <th scope="row"> because it names
 *  the row — the other two cells are facts about it. */
const row = (v: IrregularVerb): string => `
  <tr>
    <th scope="row">${v.v1}</th>
    <td>${v.v2.join(' / ')}</td>
    <td>${v.v3.join(' / ')}</td>
  </tr>
`

/** Matches if any of the three forms contains the query. */
const matches = (v: IrregularVerb, q: string): boolean =>
  [v.v1, ...v.v2, ...v.v3].some((f) => f.includes(q))

/** The lookup result. `source` decides the wording: for a regular verb we
 *  derived the forms by rule and have to say so rather than imply we knew. */
const resultHTML = (c: Conjugation): string => `
  <div class="verb-card">
    <p class="verb-source ${c.source}">
      ${
        c.source === 'irregular'
          ? 'Irregular — from the table below'
          : 'Not in the irregular list — forms derived from the regular -ed rules'
      }
    </p>
    <dl class="verb-forms">
      <div><dt>V1 base</dt><dd>${esc(c.v1)}</dd></div>
      <div><dt>V2 past</dt><dd>${esc(c.v2.join(' / '))}</dd></div>
      <div><dt>V3 participle</dt><dd>${esc(c.v3.join(' / '))}</dd></div>
    </dl>
  </div>
`

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  ${navHTML('verbs.html')}
  <main>
    <h1>Irregular Verbs</h1>
    <p class="tagline">
      Look up any verb — irregular ones come from the table, the rest are
      built with the regular -ed rules.
    </p>

    <div class="converter">
      <label for="verb">Verb</label>
      <input id="verb" placeholder="go, went, stop..." autocomplete="off"/>
      <button id="lookup" type="button">Look up</button>
      <!-- aria-live so the answer announces itself; the user's focus stays
           in the input, so nothing else would tell a screen reader it changed. -->
      <div id="verb-result" aria-live="polite"></div>
    </div>

    <section aria-labelledby="table-heading">
      <h2 id="table-heading">All ${IrregularVerbs.length} irregular verbs</h2>
      <!-- Filter status is its own live region: row counts change as you
           type, and a silent table looks identical to a broken one. -->
      <p id="verb-count" class="verb-count" aria-live="polite"></p>
      <table class="verb-table">
        <caption class="sr-only">
          Irregular verbs with their base, past simple and past participle forms
        </caption>
        <thead>
          <tr>
            <th scope="col">V1 base</th>
            <th scope="col">V2 past</th>
            <th scope="col">V3 participle</th>
          </tr>
        </thead>
        <tbody id="verb-rows"></tbody>
      </table>
    </section>
  </main>
`

const input = document.querySelector<HTMLInputElement>('#verb')!
const button = document.querySelector<HTMLButtonElement>('#lookup')!
const result = document.querySelector<HTMLElement>('#verb-result')!
const tbody = document.querySelector<HTMLElement>('#verb-rows')!
const count = document.querySelector<HTMLElement>('#verb-count')!

/** Redraw the table for the current query. Cheap enough to run per keystroke
 *  at this list size — no debounce needed. */
function renderTable(query: string): void {
  const q = query.trim().toLowerCase()
  const shown = q ? IrregularVerbs.filter((v) => matches(v, q)) : IrregularVerbs
  // An empty <tbody> under a header row reads as a broken table, so say
  // plainly that no match is itself the answer: the verb is regular.
  tbody.innerHTML = shown.length
    ? shown.map(row).join('')
    : `<tr><td colspan="3" class="verb-empty">
         No irregular verb matches "${esc(q)}" — if it's a real verb, it's a
         regular one. Press <strong>Look up</strong> for its -ed forms.
       </td></tr>`
  count.textContent = q
    ? `${shown.length} of ${IrregularVerbs.length} verbs match "${q}"`
    : ''
}

function lookup(): void {
  const word = input.value.trim()
  // Clear rather than conjugate an empty string, which would return "ed".
  result.innerHTML = word ? resultHTML(conjugate(word)) : ''
}

// Typing filters the table live; the button (or Enter) runs the conjugation.
input.addEventListener('input', () => renderTable(input.value))
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') lookup()
})
button.addEventListener('click', lookup)

renderTable('')
