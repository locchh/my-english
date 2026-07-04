// Underlined letters (the ones that make the sound) are wrapped in [ ... ].
// The cell renderer converts [x] -> <u>x</u>.
// `type` drives the cell colour: vowels are short/long/diphthong,
// consonants are voiced/unvoiced.
type PhonemeType = 'short' | 'long' | 'diphthong' | 'voiced' | 'unvoiced'
type Phoneme = { symbol: string; type: PhonemeType; words: string[] }

const vowels: Phoneme[] = [
  // row 1
  { symbol: 'iː', type: 'long', words: ['sh[ee]p', '[ea]gle', 'f[ie]ld'] },
  { symbol: 'ɪ', type: 'short', words: ['sh[i]p', 'b[u]sy', 'start[e]d'] },
  { symbol: 'ʊ', type: 'short', words: ['g[oo]d', 'p[u]t', 'sh[oul]d'] },
  { symbol: 'uː', type: 'long', words: ['m[oo]n', 'gr[ew]', 'thr[ough]'] },
  { symbol: 'ɪə', type: 'diphthong', words: ['[ea]r', 'h[ere]', 'car[eer]'] },
  { symbol: 'eɪ', type: 'diphthong', words: ['tr[ai]n', 's[ay]', 'pl[a]ne'] },
  // row 2
  { symbol: 'e', type: 'short', words: ['b[e]d', 'd[ea]d', 's[ai]d'] },
  { symbol: 'ə', type: 'short', words: ['[a]bout', 'p[o]lice', 'th[e]'] },
  { symbol: 'ɜː', type: 'long', words: ['b[ir]d', 'h[ur]t', 'w[or]k'] },
  { symbol: 'ɔː', type: 'long', words: ['d[oor]', 'w[al]k', 's[aw]'] },
  { symbol: 'ʊə', type: 'diphthong', words: ['y[our]', 's[ure]', 't[our]ist'] },
  { symbol: 'ɔɪ', type: 'diphthong', words: ['b[oy]', 'p[oi]nt', '[oi]l'] },
  { symbol: 'əʊ', type: 'diphthong', words: ['c[oa]t', 'l[ow]', 'n[o]te'] },
  // row 3
  { symbol: 'æ', type: 'short', words: ['[a]pple', 'c[a]t', 'm[a]t'] },
  { symbol: 'ʌ', type: 'short', words: ['[u]p', 'm[o]ney', 'c[u]t'] },
  { symbol: 'ɑː', type: 'long', words: ['c[ar]', 'b[a]th', 'saf[ar]i'] },
  { symbol: 'ɒ', type: 'short', words: ['n[o]t', 'wh[a]t', 'bec[au]se'] },
  { symbol: 'eə', type: 'diphthong', words: ['h[air]', 'c[are]ful', 'th[ere]'] },
  { symbol: 'aɪ', type: 'diphthong', words: ['b[y]', 'h[igh]', 'f[i]ne'] },
  { symbol: 'aʊ', type: 'diphthong', words: ['n[ow]', '[ou]r', 'h[ou]se'] },
]

const consonants: Phoneme[] = [
  // row 1
  { symbol: 'p', type: 'unvoiced', words: ['[p]en', 'ho[pp]ing', 'jum[p]'] },
  { symbol: 'b', type: 'voiced', words: ['[b]all', 'ho[bb]y', 'her[b]'] },
  { symbol: 't', type: 'unvoiced', words: ['[t]able', 'li[tt]le', 'watch[ed]'] },
  { symbol: 'd', type: 'voiced', words: ['[d]og', 'a[dd]ed', 'play[ed]'] },
  { symbol: 'tʃ', type: 'unvoiced', words: ['[ch]ips', 'i[tch]', 'pic[t]ure'] },
  { symbol: 'dʒ', type: 'voiced', words: ['[j]am', 'dan[g]er', 'fu[dge]'] },
  { symbol: 'k', type: 'unvoiced', words: ['[k]ey', '[c]ar', 'lu[ck]'] },
  { symbol: 'g', type: 'voiced', words: ['[g]reen', 'hu[g]', 'lea[gu]e'] },
  // row 2
  { symbol: 'f', type: 'unvoiced', words: ['[f]ire', 'lau[gh]', '[ph]one'] },
  { symbol: 'v', type: 'voiced', words: ['[v]ideo', 'mo[v]e', 'o[f]'] },
  { symbol: 'θ', type: 'unvoiced', words: ['[th]ick', 'heal[th]y', 'tee[th]'] },
  { symbol: 'ð', type: 'voiced', words: ['mo[th]er', '[th]is', 'wi[th]'] },
  { symbol: 's', type: 'unvoiced', words: ['[s]ee', '[c]ity', 'noti[ce]'] },
  { symbol: 'z', type: 'voiced', words: ['[z]ebra', 'co[s]y', 'ha[s]'] },
  { symbol: 'ʃ', type: 'unvoiced', words: ['[sh]op', 'na[ti]on', 'spe[ci]al'] },
  { symbol: 'ʒ', type: 'voiced', words: ['televi[si]on', 'vi[su]al', 'lei[s]ure'] },
  // row 3
  { symbol: 'm', type: 'voiced', words: ['[m]an', 'tu[mm]y', 'la[m]b'] },
  { symbol: 'n', type: 'voiced', words: ['[n]o', 'fu[nn]y', '[kn]ife'] },
  { symbol: 'ŋ', type: 'voiced', words: ['si[ng]', 'u[n]cle', 'a[ng]ry'] },
  { symbol: 'j', type: 'voiced', words: ['[y]es', 'on[i]on', 'v[i]ew'] },
  { symbol: 'l', type: 'voiced', words: ['[l]ight', 'sme[ll]y', 'fee[l]'] },
  { symbol: 'r', type: 'voiced', words: ['[r]ight', 'be[rr]y', '[wr]ong'] },
  { symbol: 'w', type: 'voiced', words: ['[w]in', '[wh]ere', '[o]ne'] },
  { symbol: 'h', type: 'unvoiced', words: ['[h]ouse', '[h]ungry', '[wh]o'] },
]

function cell(p: Phoneme): string {
  const symbol = `<div class="symbol">${p.symbol}</div>`
  const words = p.words
    .map((w) => `<span>${w.replace(/\[(.+?)\]/g, '<u>$1</u>')}</span>`)
    .join(' ')
  return `<div class="cell ${p.type}">${symbol}<div class="words">${words}</div></div>`
}

const legendTypes: PhonemeType[] = ['short', 'long', 'diphthong', 'voiced', 'unvoiced']

export function boardHTML(): string {
  const legend = legendTypes
    .map((t) => `<span class="chip ${t}">${t}</span>`)
    .join('')
  return `
    <section class="board">
      <div class="legend">${legend}</div>
      <div class="grid vowels">${vowels.map(cell).join('')}</div>
      <div class="grid consonants">${consonants.map(cell).join('')}</div>
    </section>
  `
}
