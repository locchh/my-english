type NavItem = { href: string; label: string }

const items: NavItem[] = [
  { href: 'index.html', label: 'Home' },
  { href: 'ipa.html', label: 'IPA Converter' },
  { href: 'verbs.html', label: 'Irregular Verbs' },
  { href: 'tenses.html', label: 'Tenses' },
]

// active: current page's href (e.g. 'ipa.html'). The current page stays an
// <a> so it keeps its place in the link list; aria-current="page" is what
// tells assistive tech it's the one you're on. Rendering it as a bare
// <span> instead would drop it out of the list entirely.
export function navHTML(active: string): string {
  const links = items
    .map((item) =>
      item.href === active
        ? `<a href="${item.href}" class="nav-current" aria-current="page">${item.label}</a>`
        : `<a href="${item.href}">${item.label}</a>`,
    )
    .join('')
  return `<nav class="site-nav" aria-label="Main">${links}</nav>`
}
