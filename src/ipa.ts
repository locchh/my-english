import './style.css'
import { navHTML } from './nav'
import { boardHTML } from './board'
import { convert } from './convert'

// Inject the app's HTML markup into the #app container.
// Everything below the nav lives in <main> so no content sits outside a
// landmark — that's what axe's `region` / `landmark-one-main` rules want.
document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  ${navHTML('ipa.html')}
  <main>
    <h1>IPA Converter</h1>
    <div class="converter">
      <!-- A real <label>, not just a placeholder: the placeholder vanishes
           the moment you type, taking the field's accessible name with it. -->
      <label for="text">English text</label>
      <input id="text" placeholder="Type English..."/>
      <button id="convert" type="button">Convert</button>
      <!-- aria-live makes the result announce itself. convert.ts writes to
           .innerText here, which mutates the DOM, so polite is enough — no
           change needed in convert.ts. -->
      <p id="result" aria-live="polite"></p>
    </div>
    ${boardHTML()}
  </main>
`

// Grab the converter elements (they exist now that the markup is rendered)
const input = document.querySelector<HTMLInputElement>('#text')!
const button = document.querySelector<HTMLButtonElement>('#convert')!
const result = document.querySelector<HTMLElement>('#result')!

// Wire up the converter: register the click handler on the button (runs once)
convert(input, button, result)