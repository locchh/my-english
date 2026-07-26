// Re-checks the exact contradictions found by hand: a Diễn tả that asserts
// something a Usage of the same tense disproves.
import { readFileSync } from 'fs'
const src = readFileSync('src/tense-data.ts', 'utf8')
const body = src.slice(0, src.indexOf('export const notes'))
const blocks = body.split(/\n  \{\n    time:/).slice(1)

// Each rule: if a usage matches `usageHas`, the meaning must NOT match `meaningBans`.
const rules = [
  { name: 'span vs point', usageHas: /kéo dài (một|suốt một) khoảng|đồng thời|song song/i,
    meaningBans: /\btại một (mốc|thời điểm)\b(?!.*hoặc)/i,
    why: 'usage covers a span/parallel actions, meaning pins it to one point' },
  { name: 'unfinished vs xong', usageHas: /kéo dài đến hiện tại|còn có thể được lặp|khả năng tiếp tục/i,
    meaningBans: /\bxong trước\b|\bđã xong\b(?!.*hoặc)/i,
    why: 'usage is still ongoing, meaning claims it is finished' },
  { name: 'future use vs present-only', usageHas: /tương lai gần|theo thời gian biểu/i,
    meaningBans: /^(?!.*tương lai).*$/is,
    why: 'usage covers a future event, meaning never mentions tương lai' },
  { name: 'modality uncovered', usageHas: /lời hứa|quyết định tức thì/i,
    meaningBans: /^(?!.*(khiếm khuyết|ý kiến|lời hứa)).*$/is,
    why: 'usage is about speaker attitude, meaning is purely temporal' },
]

let fails = 0, checked = 0
for (const b of blocks) {
  const name = b.match(/nameEn: '([^']+)'/)?.[1]
  const meaning = (b.match(/meaning:\s*\n?\s*'((?:[^'\\]|\\.)*)'/s)?.[1] ?? '')
  const usages = [...b.matchAll(/vi: '((?:[^'\\]|\\.)*)'/g)].map((m) => m[1])
  for (const r of rules) {
    if (!usages.some((u) => r.usageHas.test(u))) continue
    checked++
    if (r.meaningBans.test(meaning)) {
      fails++
      console.log(`FAIL  ${name}  [${r.name}]  ${r.why}`)
      console.log(`      meaning: ${meaning.slice(0, 100)}`)
    }
  }
}
console.log(`\n${checked} applicable meaning/usage pairs checked, ${fails} contradiction(s)`)
process.exit(fails ? 1 : 0)
