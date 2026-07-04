import './style.css'
import { boardHTML } from './board'
import { convert } from './convert'

// Inject the app's HTML markup into the #app container
document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <h1>IPA Converter</h1>
  <div class="converter">
    <input id="text" placeholder="Type English..."/>
    <button id="convert">Convert</button>
    <p id="result"></p>
  </div>
  ${boardHTML()}
`

// Grab the converter elements (they exist now that the markup is rendered)
const input = document.querySelector<HTMLInputElement>('#text')!
const button = document.querySelector<HTMLButtonElement>('#convert')!
const result = document.querySelector<HTMLElement>('#result')!

// Wire up the converter: register the click handler on the button (runs once)
convert(input, button, result)