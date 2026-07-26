import './style.css'
import { navHTML } from './nav'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  ${navHTML('verbs.html')}
  <h1>Irregular Verbs</h1>
  <p>Coming soon.</p>
`
