import './style.css'
import { navHTML } from './nav'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  ${navHTML('index.html')}
  <h1>my-english</h1>
  <ul class="home-links">
    <li><a href="ipa.html">IPA Converter</a></li>
    <li><a href="verbs.html">Irregular Verbs</a></li>
    <li><a href="tenses.html">Tenses</a></li>
  </ul>
`
