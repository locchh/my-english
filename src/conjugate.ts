import { IrregularVerbs, type IrregularVerb } from './verb-data'

export type Conjugation = {
  v1: string
  v2: string[]
  v3: string[]
  // 'irregular' = found in the table, known good.
  // 'regular-rule' = not found, derived by spelling rule below — a guess.
  source: 'irregular' | 'regular-rule'
}

// Built once at module load. Map EVERY form -> its entry, so looking up
// "went" or "gone" finds the same row as "go".
const index = new Map<string, IrregularVerb>()
for (const verb of IrregularVerbs) {
  // Set avoids adding the same key twice when a form repeats (cut/cut/cut).
  for (const form of new Set([verb.v1, ...verb.v2, ...verb.v3])) {
    index.set(form, verb)
  }
}

const VOWELS = 'aeiou'

// The -ed spelling rules, in order — the order is what makes them correct.
function regularPast(v1: string): string {
  // 1. ends in 'e'           -> +d        love -> loved
  if (v1.endsWith('e')) return v1 + 'd'

  // 2. consonant + 'y'       -> y -> ied  carry -> carried
  if (/[^aeiou]y$/.test(v1)) return v1.slice(0, -1) + 'ied'
  //    vowel + 'y'           -> +ed       play -> played
  if (/[aeiou]y$/.test(v1)) return v1 + 'ed'

  // 3. single-syllable CVC   -> double    stop -> stopped
  //    EXCEPT final w/x/y    -> +ed       fix -> fixed, snow -> snowed
  const last = v1[v1.length - 1]
  const mid = v1[v1.length - 2]
  const first = v1[v1.length - 3]
  const isCVC =
    v1.length >= 3 &&
    !VOWELS.includes(last) &&
    VOWELS.includes(mid) &&
    !VOWELS.includes(first) &&
    !'wxy'.includes(last)
  // "Single syllable" approximated as exactly one vowel group — reliable
  // syllable counting isn't doable with a regex, so multi-syllable words
  // like 'prefer' fall through to rule 4 and come out wrong (documented
  // gap, not silently mangled: 'preferred' would need real stress rules).
  const isSingleSyllable = (v1.match(/[aeiou]+/g) ?? []).length === 1
  if (isCVC && isSingleSyllable) return v1 + last + 'ed'

  // 4. default               -> +ed       walk -> walked
  return v1 + 'ed'
}

/** Look up any form of a word (v1, v2, or v3); fall back to the regular
 *  -ed rules if it isn't in the irregular table. */
export function conjugate(word: string): Conjugation {
  const key = word.trim().toLowerCase()
  const entry = index.get(key)
  if (entry) {
    return { v1: entry.v1, v2: entry.v2, v3: entry.v3, source: 'irregular' }
  }
  const past = regularPast(key)
  return { v1: key, v2: [past], v3: [past], source: 'regular-rule' }
}
