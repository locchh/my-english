import './style.css'
import { navHTML } from './nav'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  ${navHTML('verbs.html')}
  <main>
    <h1>Irregular Verbs</h1>
    <p>Coming soon.</p>
  </main>
`
