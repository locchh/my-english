import './style.css'
import { boardHTML } from './board'

// Inject the app's HTML markup into the #app container
document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <h1>My English</h1>
  ${boardHTML()}
  <!-- TODO: converter -->
`

