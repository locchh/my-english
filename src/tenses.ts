import './style.css'
import { navHTML } from './nav'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  ${navHTML('tenses.html')}
  <main>
    <h1>Tenses</h1>
    <p>Coming soon.</p>
  </main>
`
