// Underlined letters (the ones that make the sound) are wrapped in [ ... ].
// The cell renderer converts [x] -> <u>x</u>.
// `type` drives the cell colour: vowels are short/long/diphthong,
// consonants are voiced/unvoiced.
// `vi` is a rough Vietnamese approximation of the sound. Sounds marked * have
// no real Vietnamese equivalent (English th, etc.) — these are only hints.
type PhonemeType = 'short' | 'long' | 'diphthong' | 'voiced' | 'unvoiced'
type Phoneme = { symbol: string; alt?: string; type: PhonemeType; vi: string; words: string[] }

const vowels: Phoneme[] = [
  // row 1
  { symbol: 'iː', type: 'long', vi: 'i (dài)', words: ['sh[ee]p', '[ea]gle', 'f[ie]ld'] },
  { symbol: 'ɪ', type: 'short', vi: 'i (ngắn)', words: ['sh[i]p', 'b[u]sy', 'start[e]d'] },
  { symbol: 'ʊ', type: 'short', vi: 'u (ngắn)', words: ['g[oo]d', 'p[u]t', 'sh[oul]d'] },
  { symbol: 'uː', type: 'long', vi: 'u (dài)', words: ['m[oo]n', 'gr[ew]', 'thr[ough]'] },
  { symbol: 'ɪə', alt: 'ɪɹ', type: 'diphthong', vi: 'i-ơ', words: ['[ea]r', 'h[ere]', 'car[eer]'] },
  { symbol: 'eɪ', type: 'diphthong', vi: 'ây', words: ['tr[ai]n', 's[ay]', 'pl[a]ne'] },
  // row 2
  { symbol: 'e', alt: 'ɛ', type: 'short', vi: 'e', words: ['b[e]d', 'd[ea]d', 's[ai]d'] },
  { symbol: 'ə', type: 'short', vi: 'ơ (nhẹ)', words: ['[a]bout', 'p[o]lice', 'th[e]'] },
  { symbol: 'ɜː', type: 'long', vi: 'ơ (dài)', words: ['b[ir]d', 'h[ur]t', 'w[or]k'] },
  { symbol: 'ɔː', type: 'long', vi: 'o (dài)', words: ['d[oor]', 'w[al]k', 's[aw]'] },
  { symbol: 'ʊə', alt: 'ʊɹ', type: 'diphthong', vi: 'u-ơ', words: ['y[our]', 's[ure]', 't[our]ist'] },
  { symbol: 'ɔɪ', type: 'diphthong', vi: 'oi', words: ['b[oy]', 'p[oi]nt', '[oi]l'] },
  { symbol: 'əʊ', alt: 'oʊ', type: 'diphthong', vi: 'âu', words: ['c[oa]t', 'l[ow]', 'n[o]te'] },
  // row 3
  { symbol: 'æ', type: 'short', vi: 'a (pha e)', words: ['[a]pple', 'c[a]t', 'm[a]t'] },
  { symbol: 'ʌ', type: 'short', vi: 'â', words: ['[u]p', 'm[o]ney', 'c[u]t'] },
  { symbol: 'ɑː', type: 'long', vi: 'a (dài)', words: ['c[ar]', 'b[a]th', 'saf[ar]i'] },
  { symbol: 'ɒ', alt: 'ɑ', type: 'short', vi: 'o (ngắn)', words: ['n[o]t', 'wh[a]t', 'bec[au]se'] },
  { symbol: 'eə', alt: 'ɛɹ', type: 'diphthong', vi: 'e-ơ', words: ['h[air]', 'c[are]ful', 'th[ere]'] },
  { symbol: 'aɪ', type: 'diphthong', vi: 'ai', words: ['b[y]', 'h[igh]', 'f[i]ne'] },
  { symbol: 'aʊ', type: 'diphthong', vi: 'ao', words: ['n[ow]', '[ou]r', 'h[ou]se'] },
]

const consonants: Phoneme[] = [
  // row 1
  { symbol: 'p', type: 'unvoiced', vi: 'p (bật hơi)', words: ['[p]en', 'ho[pp]ing', 'jum[p]'] },
  { symbol: 'b', type: 'voiced', vi: 'b', words: ['[b]all', 'ho[bb]y', 'her[b]'] },
  { symbol: 't', type: 'unvoiced', vi: 't (bật hơi)', words: ['[t]able', 'li[tt]le', 'watch[ed]'] },
  { symbol: 'd', type: 'voiced', vi: 'đ', words: ['[d]og', 'a[dd]ed', 'play[ed]'] },
  { symbol: 'tʃ', type: 'unvoiced', vi: 'ch', words: ['[ch]ips', 'i[tch]', 'pic[t]ure'] },
  { symbol: 'dʒ', type: 'voiced', vi: 'gi (nặng)', words: ['[j]am', 'dan[g]er', 'fu[dge]'] },
  { symbol: 'k', type: 'unvoiced', vi: 'c / k', words: ['[k]ey', '[c]ar', 'lu[ck]'] },
  { symbol: 'g', type: 'voiced', vi: 'g (gờ)', words: ['[g]reen', 'hu[g]', 'lea[gu]e'] },
  // row 2
  { symbol: 'f', type: 'unvoiced', vi: 'ph', words: ['[f]ire', 'lau[gh]', '[ph]one'] },
  { symbol: 'v', type: 'voiced', vi: 'v', words: ['[v]ideo', 'mo[v]e', 'o[f]'] },
  { symbol: 'θ', type: 'unvoiced', vi: 'th (đầu lưỡi) *', words: ['[th]ick', 'heal[th]y', 'tee[th]'] },
  { symbol: 'ð', type: 'voiced', vi: 'đ (rung) *', words: ['mo[th]er', '[th]is', 'wi[th]'] },
  { symbol: 's', type: 'unvoiced', vi: 'x / s', words: ['[s]ee', '[c]ity', 'noti[ce]'] },
  { symbol: 'z', type: 'voiced', vi: 'z (như d)', words: ['[z]ebra', 'co[s]y', 'ha[s]'] },
  { symbol: 'ʃ', type: 'unvoiced', vi: 's (uốn lưỡi)', words: ['[sh]op', 'na[ti]on', 'spe[ci]al'] },
  { symbol: 'ʒ', type: 'voiced', vi: 'gi (mềm)', words: ['televi[si]on', 'vi[su]al', 'lei[s]ure'] },
  // row 3
  { symbol: 'm', type: 'voiced', vi: 'm', words: ['[m]an', 'tu[mm]y', 'la[m]b'] },
  { symbol: 'n', type: 'voiced', vi: 'n', words: ['[n]o', 'fu[nn]y', '[kn]ife'] },
  { symbol: 'ŋ', type: 'voiced', vi: 'ng', words: ['si[ng]', 'u[n]cle', 'a[ng]ry'] },
  { symbol: 'j', type: 'voiced', vi: 'y', words: ['[y]es', 'on[i]on', 'v[i]ew'] },
  { symbol: 'l', type: 'voiced', vi: 'l', words: ['[l]ight', 'sme[ll]y', 'fee[l]'] },
  { symbol: 'r', alt: 'ɹ', type: 'voiced', vi: 'r (uốn lưỡi)', words: ['[r]ight', 'be[rr]y', '[wr]ong'] },
  { symbol: 'w', type: 'voiced', vi: 'oa / w', words: ['[w]in', '[wh]ere', '[o]ne'] },
  { symbol: 'h', type: 'unvoiced', vi: 'h', words: ['[h]ouse', '[h]ungry', '[wh]o'] },
]

function cell(p: Phoneme): string {
  const symbol = `<div class="symbol">${p.symbol}</div>`
  const alt = p.alt ? `<span class="alt">/${p.alt}/</span>` : ''
  const vi = `<div class="vi">${p.vi}</div>`
  const words = p.words
    .map((w) => `<span>${w.replace(/\[(.+?)\]/g, '<u>$1</u>')}</span>`)
    .join(' ')
  return `<div class="cell ${p.type}">${symbol}${alt}${vi}<div class="words">${words}</div></div>`
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
