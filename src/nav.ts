type NavItem = { href: string; label: string }

const items: NavItem[] = [
  { href: 'index.html', label: 'Home' },
  { href: 'ipa.html', label: 'IPA Converter' },
  { href: 'verbs.html', label: 'Irregular Verbs' },
  { href: 'tenses.html', label: 'Tenses' },
]

// active: current page's href (e.g. 'ipa.html'), so its entry renders
// as plain text instead of a link.
export function navHTML(active: string): string {
  const links = items
    .map((item) =>
      item.href === active
        ? `<span class="nav-current">${item.label}</span>`
        : `<a href="${item.href}">${item.label}</a>`,
    )
    .join('')
  return `<nav class="site-nav">${links}</nav>`
}
