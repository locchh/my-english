// Time = column axis; Aspect = row axis. Every tense is exactly one
// (time, aspect) pair — e.g. ('past', 'perfect') = Past Perfect.
export type Time = 'past' | 'present' | 'future'
export type Aspect = 'simple' | 'continuous' | 'perfect' | 'perfect-continuous'

/** A negative + question pair.
 *
 *  Present Simple and Past Simple carry TWO of these, because their
 *  negative/question depends on the verb: ordinary verbs need do-support
 *  (do/does/did), while special verbs (be, can, may…) take `not` directly and
 *  invert directly. `label` names which group the pair belongs to.
 *
 *  The other ten tenses already have an auxiliary (be / have / had / will)
 *  doing that job, so do-support never applies and one unlabelled pair
 *  covers every verb. */
export type FormVariant = {
  /** Undefined when the tense has a single pair covering all verbs. */
  label?: string
  negative: string
  question: string
}

export type TenseForms = {
  affirmative: string
  variants: FormVariant[]
}

/** One documented use of the tense: `vi` says what it expresses, `en` is a
 *  sentence chosen so the stated use is visible in it — the time marker,
 *  the interrupting clause, or the present result is present in the sentence
 *  rather than left implied. */
export type Usage = {
  vi: string // "Diễn tả một chân lý, một sự thật hiển nhiên."
  en: string // "The sun rises in the East."
}

export type Tense = {
  time: Time
  aspect: Aspect
  nameEn: string // "Past Perfect Continuous"
  nameVi: string // "Quá khứ hoàn thành tiếp diễn"
  /** Plain-Vietnamese summary of what the tense expresses, in the same
   *  register as PROMPT.md ("Diễn tả một hành động, sự việc…"). Must cover
   *  every case listed in `usages` — see scripts/audit-tense-consistency.mjs. */
  meaning: string
  /** The SAME sentence conjugated into this tense, so the grid can show all
   *  twelve side by side and only the tense changes. This is what makes the
   *  auxiliary pattern visible: works → is working → has worked → has been
   *  working. Subject is "She" throughout so the -s and is/has forms show. */
  example: { en: string; vi: string }
  /** The five tenses that cover most everyday English. Marked in the grid so
   *  a beginner knows where to start instead of facing all twelve at once. */
  common?: boolean
  forms: TenseForms
  usages: Usage[]
  /** Signal words that point at this tense. Every tense here has some, but
   *  kept optional so a tense with no distinctive set can omit it rather than
   *  carry a misleading empty list. */
  adverbs?: string[]
}

// Ordered time-major (all of Past, then Present, then Future) purely for
// readability — findTense() looks up by (time, aspect), not position.
export const tenses: Tense[] = [
  // ---- Past ----
  {
    time: 'past',
    aspect: 'simple',
    nameEn: 'Past Simple',
    nameVi: 'Quá khứ đơn',
    example: { en: 'She worked.', vi: 'Cô ấy đã làm việc. (đã xong hẳn)' },
    common: true,
    meaning:
      'Diễn tả một hành động, sự việc đã xảy ra vào một thời điểm trong quá khứ và nay đã chấm dứt hẳn. Hành động đó có thể chỉ xảy ra trong giây lát, hoặc kéo dài suốt một khoảng thời gian rồi kết thúc.',
    forms: {
      affirmative: 'S + V2/V-ed',
      variants: [
        {
          label: 'Động từ thường',
          negative: 'S + did not (didn’t) + V(bare)',
          question: 'Did + S + V(bare)?',
        },
        {
          label: 'Động từ đặc biệt (be, can, may…)',
          negative: 'S + was/were/could/might + not + …',
          question: 'Was/Were/Could/Might + S + …?',
        },
      ],
    },
    usages: [
      {
        vi: 'Diễn tả một hành động đã xảy ra trong quá khứ, chấm dứt rồi và biết rõ thời gian.',
        en: 'I met him at the airport yesterday.',
      },
      {
        vi: 'Diễn tả một hành động đã xảy ra trong suốt một khoảng thời gian trong quá khứ, nhưng nay đã hoàn toàn chấm dứt.',
        en: 'He worked in that factory for ten years.',
      },
    ],
    adverbs: ['yesterday', 'last night/week/month/year', 'ago (two days ago)', 'in 1990', 'when I was young'],
  },
  {
    time: 'past',
    aspect: 'continuous',
    nameEn: 'Past Continuous',
    nameVi: 'Quá khứ tiếp diễn',
    example: { en: 'She was working.', vi: 'Lúc đó cô ấy đang làm việc.' },
    // Not "tại một mốc": usages 2 and 4 below are a whole span (all day) and a
    // pair of parallel actions, neither of which sits on a single point.
    meaning:
      'Diễn tả một hành động, sự việc đang xảy ra ở quá khứ và lúc đó chưa kết thúc: xảy ra vào một thời điểm nhất định trong quá khứ, kéo dài suốt một khoảng thời gian, hoặc xảy ra cùng lúc với một hành động khác.',
    forms: {
      affirmative: 'S + was/were + V-ing',
      variants: [
        {
          negative: 'S + was/were + not (wasn’t/weren’t) + V-ing',
          question: 'Was/Were + S + V-ing?',
        },
      ],
    },
    usages: [
      {
        vi: 'Diễn tả hành động đang xảy ra vào một thời điểm ở quá khứ.',
        en: 'At eight o’clock last night, I was watching TV.',
      },
      {
        vi: 'Diễn tả hành động đã xảy ra và kéo dài một thời gian ở quá khứ.',
        en: 'It was raining all day yesterday.',
      },
      {
        vi: 'Hành động đang xảy ra (ở quá khứ) thì có một hành động khác xen vào — hành động kéo dài hơn dùng quá khứ tiếp diễn, hành động ngắn hơn dùng quá khứ đơn.',
        en: 'I was cooking dinner when she arrived.',
      },
      {
        vi: 'Hai hành động xảy ra đồng thời ở quá khứ.',
        en: 'While I was cooking, my brother was watching TV.',
      },
    ],
    adverbs: ['at 8 p.m. last night', 'at that time', 'at that moment', 'while', 'when', 'as'],
  },
  {
    time: 'past',
    aspect: 'perfect',
    nameEn: 'Past Perfect',
    nameVi: 'Quá khứ hoàn thành',
    // NOT "xong trước": the comment below and ruleHTML both state that perfect
    // does not mean completion. "trước một việc khác" carries the anteriority
    // without the completion claim.
    example: { en: 'She had worked.', vi: 'Cô ấy đã làm việc. (trước một việc khác trong quá khứ)' },
    // "Nằm trước", not "xong trước": perfect asserts anteriority, not
    // completion ("He had lived there for ten years before he moved" is past
    // perfect and unfinished at that point). The usage below happens to be the
    // completed case, which is the common one.
    meaning:
      'Diễn tả một hành động, sự việc đã xảy ra trước một thời điểm trong quá khứ, hoặc trước một hành động khác trong quá khứ. So với quá khứ đơn: cả hai đều nói về quá khứ, nhưng quá khứ hoàn thành cho biết rõ việc nào xảy ra trước.',
    forms: {
      affirmative: 'S + had + V3/V-ed',
      variants: [
        {
          negative: 'S + had not (hadn’t) + V3/V-ed',
          question: 'Had + S + V3/V-ed?',
        },
      ],
    },
    usages: [
      {
        // PROMPT.md says "trước một thời gian quá khứ"; deviating on purpose —
        // "thời gian" for a single point is awkward and collides with the
        // "thời điểm" wording used everywhere else on the page.
        vi: 'Diễn tả một hành động xảy ra trước một thời điểm trong quá khứ, hoặc trước một hành động khác trong quá khứ.',
        en: 'The train had left before we arrived at the station.',
      },
    ],
    adverbs: ['before', 'after', 'by the time', 'until then', 'already', 'as soon as'],
  },
  {
    time: 'past',
    aspect: 'perfect-continuous',
    nameEn: 'Past Perfect Continuous',
    nameVi: 'Quá khứ hoàn thành tiếp diễn',
    example: { en: 'She had been working.', vi: 'Cô ấy đã làm việc liên tục cho tới lúc đó.' },
    // Deliberately generic ("một mốc"): Diễn tả is the matrix composition, and
    // the usage below is what pins the mốc down (a second past action, in past
    // simple). Stated as one sentence they look duplicated — the split is
    // generic rule vs. concrete application, so the pointer makes that explicit.
    meaning:
      'Diễn tả một hành động, sự việc đã xảy ra và kéo dài liên tục cho tới một thời điểm trong quá khứ, hoặc cho tới khi một hành động khác xảy ra, nhấn mạnh khoảng thời gian hành động đã kéo dài.',
    forms: {
      affirmative: 'S + had + been + V-ing',
      variants: [
        {
          negative: 'S + had not (hadn’t) + been + V-ing',
          question: 'Had + S + been + V-ing?',
        },
      ],
    },
    usages: [
      {
        vi: 'Diễn tả một hành động quá khứ đã xảy ra và kéo dài liên tục cho đến khi hành động quá khứ thứ hai xảy ra (hành động thứ hai dùng quá khứ đơn).',
        en: 'I had been waiting for an hour when the bus finally came.',
      },
    ],
    adverbs: ['for + khoảng thời gian', 'since', 'before', 'until then', 'how long'],
  },

  // ---- Present ----
  {
    time: 'present',
    aspect: 'simple',
    nameEn: 'Present Simple',
    nameVi: 'Hiện tại đơn',
    example: { en: 'She works.', vi: 'Cô ấy làm việc. (nói chung, thường xuyên)' },
    common: true,
    // The "lịch trình" clause must say the event is in the FUTURE. Naming the
    // case alone isn't enough: under a sentence about "bây giờ", a reader has
    // no way to guess that this one describes tomorrow's train.
    meaning:
      'Diễn tả một chân lý hay một sự thực hiển nhiên; một thói quen ở hiện tại; hoặc một hành động, sự việc ở tương lai sẽ xảy ra theo thời gian biểu, chương trình hay kế hoạch đã định (trường hợp này nói về việc trong tương lai nhưng động từ vẫn chia ở hiện tại). Riêng việc đang xảy ra ngay lúc nói thì không dùng thì này, phải dùng hiện tại tiếp diễn.',
    forms: {
      affirmative: 'S + V(s/es)',
      variants: [
        {
          label: 'Động từ thường',
          negative: 'S + do/does not (don’t/doesn’t) + V(bare)',
          question: 'Do/Does + S + V(bare)?',
        },
        {
          label: 'Động từ đặc biệt (be, can, may…)',
          negative: 'S + am/is/are/can/may + not + …',
          question: 'Am/Is/Are/Can/May + S + …?',
        },
      ],
    },
    usages: [
      {
        vi: 'Diễn tả một chân lý, một sự thực hiển nhiên.',
        en: 'The sun rises in the East.',
      },
      {
        vi: 'Diễn tả một thói quen, một hành động xảy ra thường xuyên ở hiện tại.',
        en: 'She usually gets up at six o’clock.',
      },
      {
        vi: 'Diễn tả một hành động, sự việc ở tương lai sẽ xảy ra theo thời gian biểu, chương trình hoặc kế hoạch đã định.',
        en: 'The train leaves at 8 a.m. tomorrow.',
      },
    ],
    adverbs: [
      'always',
      'usually',
      'often',
      'sometimes',
      'seldom',
      'rarely',
      'never',
      'every day/week/year',
      'once a week',
    ],
  },
  {
    time: 'present',
    aspect: 'continuous',
    nameEn: 'Present Continuous',
    nameVi: 'Hiện tại tiếp diễn',
    example: { en: 'She is working.', vi: 'Cô ấy đang làm việc.' },
    common: true,
    // The old wording stopped at "bây giờ" and left usage 3 — the near-future
    // arrangement — completely uncovered, even though it's the one use that
    // isn't about the present at all.
    meaning:
      'Diễn tả một hành động, sự việc đang xảy ra ngay lúc nói, hoặc nói chung là đang diễn ra trong thời gian này nhưng không nhất thiết diễn ra đúng vào lúc nói. Ngoài ra còn dùng cho một cuộc hẹn hoặc một kế hoạch đã sắp xếp trước, sẽ xảy ra trong tương lai gần.',
    forms: {
      affirmative: 'S + am/is/are + V-ing',
      variants: [
        {
          negative: 'S + am/is/are + not + V-ing',
          question: 'Am/Is/Are + S + V-ing?',
        },
      ],
    },
    usages: [
      {
        vi: 'Diễn tả một hành động hay một sự việc đang diễn ra ngay lúc nói.',
        en: 'Listen! The baby is crying.',
      },
      {
        vi: 'Diễn tả một hành động hoặc sự việc nói chung là đang diễn ra, nhưng không nhất thiết phải thực sự diễn ra ngay lúc nói.',
        en: 'I am reading an interesting novel these days.',
      },
      {
        vi: 'Diễn tả một hành động sắp xảy ra ở tương lai gần — cách dùng này diễn tả một sự sắp xếp hoặc một kế hoạch đã định.',
        en: 'I am flying to Da Nang tomorrow morning.',
      },
    ],
    adverbs: ['now', 'right now', 'at the moment', 'at present', 'today', 'these days', 'Look!', 'Listen!', 'Be quiet!'],
  },
  {
    time: 'present',
    aspect: 'perfect',
    nameEn: 'Present Perfect',
    nameVi: 'Hiện tại hoàn thành',
    example: { en: 'She has worked.', vi: 'Cô ấy đã làm việc, và việc đó còn liên quan tới hiện tại.' },
    common: true,
    // "có thể đã xong, hoặc vẫn đang kéo dài" is load-bearing: usage 3
    // ("They have lived in Ha Noi since 2015") is NOT finished, so any wording
    // built on "đã xong" would contradict it.
    meaning:
      'Diễn tả một hành động, sự việc đã xảy ra trong quá khứ nhưng còn liên quan đến hiện tại: hoặc vừa mới kết thúc, hoặc vẫn còn kéo dài đến hiện tại. Thì này không nói rõ việc đó xảy ra lúc nào; nếu nêu rõ thời điểm thì phải dùng quá khứ đơn.',
    forms: {
      affirmative: 'S + have/has + V3/V-ed',
      variants: [
        {
          negative: 'S + have/has not (haven’t/hasn’t) + V3/V-ed',
          question: 'Have/Has + S + V3/V-ed?',
        },
      ],
    },
    usages: [
      {
        vi: 'Diễn tả một hành động hoặc một sự việc vừa mới xảy ra.',
        en: 'She has just finished her homework.',
      },
      {
        vi: 'Diễn tả một hành động được lặp đi lặp lại nhiều lần ở quá khứ và còn có thể được lặp lại ở hiện tại hoặc tương lai.',
        en: 'I have seen that film three times.',
      },
      {
        vi: 'Diễn tả một hành động bắt đầu trong quá khứ, kéo dài đến hiện tại và có khả năng tiếp tục ở tương lai.',
        en: 'They have lived in Ha Noi since 2015.',
      },
      {
        vi: 'Diễn tả một hành động, sự việc xảy ra trong quá khứ mà người nói không biết rõ hoặc không muốn đề cập tới thời điểm chính xác.',
        en: 'I have met him somewhere before.',
      },
      {
        vi: 'Diễn tả một hành động hoặc sự việc đã xảy ra trong quá khứ nhưng kết quả vẫn còn trong hiện tại.',
        en: 'I have lost my keys, so I can’t open the door.',
      },
    ],
    adverbs: [
      'just',
      'already',
      'yet',
      'ever',
      'never',
      'since',
      'for',
      'recently',
      'lately',
      'so far',
      'up to now',
      'several times',
    ],
  },
  {
    time: 'present',
    aspect: 'perfect-continuous',
    nameEn: 'Present Perfect Continuous',
    nameVi: 'Hiện tại hoàn thành tiếp diễn',
    example: { en: 'She has been working.', vi: 'Cô ấy đã làm việc liên tục cho tới bây giờ.' },
    // "hoặc vừa dứt" covers usage 2 — she has stopped crying; only the result
    // (red eyes) is present. "Thường vẫn đang tiếp tục" alone would exclude it.
    meaning:
      'Diễn tả một hành động, sự việc bắt đầu trong quá khứ và kéo dài liên tục đến hiện tại, nhấn mạnh khoảng thời gian hành động đã kéo dài. Hành động đó có thể vẫn đang tiếp tục, hoặc vừa mới kết thúc và kết quả vẫn còn ở hiện tại.',
    forms: {
      affirmative: 'S + have/has + been + V-ing',
      variants: [
        {
          negative: 'S + have/has not (haven’t/hasn’t) + been + V-ing',
          question: 'Have/Has + S + been + V-ing?',
        },
      ],
    },
    usages: [
      {
        vi: 'Diễn tả một hành động hoặc một sự việc bắt đầu trong quá khứ và kéo dài liên tục tới hiện tại.',
        en: 'I have been learning English for two years.',
      },
      {
        vi: 'Diễn tả một hành động hoặc một sự việc vừa mới kết thúc và có kết quả ở hiện tại.',
        en: 'Her eyes are red because she has been crying.',
      },
    ],
    adverbs: ['for + khoảng thời gian', 'since', 'all day', 'all morning', 'recently', 'lately', 'how long'],
  },

  // ---- Future ----
  {
    time: 'future',
    aspect: 'simple',
    nameEn: 'Future Simple',
    nameVi: 'Tương lai đơn',
    example: { en: 'She will work.', vi: 'Cô ấy sẽ làm việc.' },
    common: true,
    // Purely temporal wording left usage 2 uncovered: `will` is a modal, so
    // besides placing an event in the future it also carries the speaker's
    // attitude (opinion / promise / decision made on the spot).
    meaning:
      'Diễn tả một hành động, sự việc sẽ xảy ra ở tương lai. Ngoài ra còn dùng để nêu ý kiến, đưa ra một lời hứa hoặc một quyết định ngay lúc nói.',
    forms: {
      affirmative: 'S + will + V(bare)',
      variants: [
        {
          negative: 'S + will not (won’t) + V(bare)',
          question: 'Will + S + V(bare)?',
        },
      ],
    },
    usages: [
      {
        vi: 'Diễn tả một hành động sẽ xảy ra ở tương lai.',
        en: 'They will travel to Japan next summer.',
      },
      {
        vi: 'Dùng để nêu ý kiến, đưa ra một lời hứa hoặc một quyết định ngay lúc nói.',
        en: 'The phone is ringing. I will answer it.',
      },
    ],
    adverbs: ['tomorrow', 'next week/month/year', 'soon', 'in the future', 'someday', 'I think/believe/hope…'],
  },
  {
    time: 'future',
    aspect: 'continuous',
    nameEn: 'Future Continuous',
    nameVi: 'Tương lai tiếp diễn',
    example: { en: 'She will be working.', vi: 'Lúc đó cô ấy sẽ đang làm việc.' },
    // Same span problem as Past Continuous: usage 2 is "all day tomorrow".
    meaning:
      'Diễn tả một hành động, sự việc sẽ đang xảy ra vào một thời điểm trong tương lai, hoặc sẽ kéo dài suốt một khoảng thời gian ở tương lai.',
    forms: {
      affirmative: 'S + will + be + V-ing',
      variants: [
        {
          negative: 'S + will not (won’t) + be + V-ing',
          question: 'Will + S + be + V-ing?',
        },
      ],
    },
    usages: [
      {
        vi: 'Diễn tả một hành động sẽ đang xảy ra vào một thời điểm ở tương lai.',
        en: 'At this time tomorrow, I will be flying to Singapore.',
      },
      {
        vi: 'Diễn tả một hành động sẽ diễn ra và kéo dài suốt một khoảng thời gian ở tương lai.',
        en: 'I will be working all day tomorrow.',
      },
    ],
    adverbs: ['at this time tomorrow', 'at 8 p.m. tomorrow', 'this time next week', 'all day tomorrow'],
  },
  {
    time: 'future',
    aspect: 'perfect',
    nameEn: 'Future Perfect',
    nameVi: 'Tương lai hoàn thành',
    example: { en: 'She will have worked.', vi: 'Cô ấy sẽ làm việc xong trước lúc đó.' },
    meaning:
      'Diễn tả một hành động, sự việc sẽ hoàn tất trước một thời điểm hoặc trước một hành động khác trong tương lai. Thời điểm đó thường được nêu bằng một cụm bắt đầu với by (by next year, by Friday).',
    forms: {
      affirmative: 'S + will + have + V3/V-ed',
      variants: [
        {
          negative: 'S + will not (won’t) + have + V3/V-ed',
          question: 'Will + S + have + V3/V-ed?',
        },
      ],
    },
    usages: [
      {
        vi: 'Diễn tả một hành động sẽ hoàn tất trước một thời điểm, hoặc trước một hành động khác trong tương lai.',
        en: 'By the time you arrive, I will have finished the report.',
      },
    ],
    adverbs: ['by + thời điểm', 'by the time', 'by then', 'before', 'by the end of…'],
  },
  {
    time: 'future',
    aspect: 'perfect-continuous',
    nameEn: 'Future Perfect Continuous',
    nameVi: 'Tương lai hoàn thành tiếp diễn',
    // "sẽ đã" is a word-for-word calque of "will have" and isn't Vietnamese.
    // Uses the "được + khoảng thời gian … rồi" construction the translation
    // note prescribes for perfect continuous.
    example: { en: 'She will have been working.', vi: 'Đến lúc đó, cô ấy sẽ làm việc liên tục được một thời gian rồi.' },
    meaning:
      'Diễn tả một hành động, sự việc sẽ kéo dài liên tục cho tới một thời điểm hoặc một hành động khác trong tương lai, nhấn mạnh khoảng thời gian hành động đã kéo dài cho tới lúc đó.',
    forms: {
      affirmative: 'S + will + have + been + V-ing',
      variants: [
        {
          negative: 'S + will not (won’t) + have + been + V-ing',
          question: 'Will + S + have + been + V-ing?',
        },
      ],
    },
    usages: [
      // Wording widened from "bắt đầu từ quá khứ": the action only has to start
      // BEFORE the future mốc, not necessarily before now. In the second example
      // the studying may well start tomorrow, after the moment of speaking.
      {
        vi: 'Diễn tả một hành động bắt đầu trước một thời điểm trong tương lai (thường là bắt đầu từ trong quá khứ) và kéo dài liên tục cho tới thời điểm đó.',
        en: 'By next month, I will have been working here for ten years.',
      },
      {
        vi: 'Diễn tả một hành động kéo dài liên tục cho tới khi một hành động khác trong tương lai xảy ra.',
        en: 'She will have been studying for five hours by the time we arrive.',
      },
    ],
    adverbs: ['by + thời điểm … for + khoảng thời gian', 'by then', 'by the time'],
  },
]

// Built once at module load, same pattern as conjugate.ts's `index` map —
// O(1) lookup per grid cell instead of a 12-entry scan on every click.
const index = new Map<string, Tense>()
for (const t of tenses) {
  index.set(`${t.time}:${t.aspect}`, t)
}

/** Find the tense for a (time, aspect) cell. Throws instead of returning
 *  undefined — a missing entry means the grid data itself is incomplete,
 *  which should fail loudly at render time, not draw a blank cell. */
export function findTense(time: Time, aspect: Aspect): Tense {
  const t = index.get(`${time}:${aspect}`)
  if (!t) throw new Error(`No tense defined for ${time}/${aspect}`)
  return t
}

/** An English sentence with its Vietnamese gloss. Used by the notes below;
 *  the tense popups use `Usage` instead (description + example). */
export type TenseExample = { en: string; vi: string }

/** One row of a three-column lookup table inside a Note — for content that is
 *  a mapping ("given X, use Y, e.g. Z") rather than prose. Column meanings
 *  come from the note's `ruleHeads`, so the s/es table and the đã/đang/sẽ
 *  table can share this shape without either one's headings lying. */
export type NoteRule = {
  when: string
  then: string
  examples: string
}

export type Note = {
  title: string
  body: string[] // paragraphs
  /** Renders the note as a highlighted tip rather than a plain reference
   *  block. For the one note that is a procedure to follow, not a table to
   *  look things up in. */
  highlight?: boolean
  /** Only on notes whose core content is a lookup table. The prose notes
   *  leave this undefined and render body + examples alone. */
  rules?: NoteRule[]
  /** Column headings for `rules`. Required whenever `rules` is set — the two
   *  tables describe completely different things. */
  ruleHeads?: [string, string, string]
  examples: TenseExample[]
}

export const notes: Note[] = [
  // First: this is the procedure for USING the grid, so it outranks the
  // spelling rules. The grid above shows how a tense is built; this shows how
  // to pick one — and the third question is the part the matrix cannot answer,
  // because it turns on facts about the verb, not about time.
  {
    title: 'Cách chọn thì: ba câu hỏi',
    highlight: true,
    body: [
      '1. Thời điểm đang nói là thời điểm nào? (hiện tại, quá khứ, tương lai)',
      '2. Sự vật, hiện tượng được nói tới được diễn tả thế nào tại thời điểm đó?',
      '3. Ngữ pháp có bắt dùng dạng khác không? (bảng dưới)',
    ],
    ruleHeads: ['Trường hợp', 'Bắt buộc dùng', 'Ví dụ'],
    rules: [
      {
        when: 'Động từ chỉ trạng thái (be, know, love…)',
        then: 'Không dùng thể tiếp diễn',
        examples: 'He has not been here since Christmas. (KHÔNG: has not been being here)',
      },
      {
        when: 'Thời gian biểu, lịch trình đã định',
        then: 'Hiện tại đơn',
        examples: 'The train leaves at 8 a.m. tomorrow. (KHÔNG: will leave)',
      },
      {
        when: 'Cuộc hẹn đã sắp xếp cụ thể',
        then: 'Hiện tại tiếp diễn',
        examples: 'I am meeting my dentist at 3 p.m. tomorrow.',
      },
      {
        when: 'Sau if, when, before, after, as soon as',
        then: 'Hiện tại đơn, không dùng will',
        examples: 'If it rains, I will stay at home. (KHÔNG: if it will rain)',
      },
    ],
    examples: [
      {
        en: 'I lost my keys yesterday. / I have lost my keys.',
        vi: 'Cùng sự việc, khác thời điểm: hôm qua → quá khứ đơn; bây giờ → hiện tại hoàn thành.',
      },
      {
        en: 'He has not been here since Christmas.',
        vi: 'Câu 1–2 ra hiện tại hoàn thành tiếp diễn; câu 3 chặn lại vì be là động từ chỉ trạng thái.',
      },
    ],
  },
  // Then the spelling mechanics: the grid's Present Simple cell shows
  // "S + V(s/es)", so the reader meets that formula early.
  {
    title: 'Quy tắc thêm s/es (ngôi thứ 3 số ít, hiện tại đơn)',
    body: [
      'Chỉ ngôi thứ 3 số ít mới thêm s/es — I, you, we, they giữ nguyên động từ nguyên mẫu.',
      // Uncountables have no number, so they can't sit inside "mọi danh từ số
      // ít" — they're named alongside it instead.
      'Ngôi thứ 3 số ít không chỉ là he, she, it. Mọi danh từ số ít — và cả danh từ không đếm được — đều thuộc ngôi này: tên riêng (Vietnam, Lan), danh từ đếm được số ít (the cat, my brother), danh từ không đếm được (rain, water, money, time). Tất cả đều đi với động từ thêm s/es: The cat sleeps a lot. / Vietnam has a long coastline. / Water boils at 100 degrees.',
      'Cách phát âm đuôi này: /ɪz/ sau các âm xì (watches, misses), /s/ sau âm vô thanh (works, stops), /z/ sau âm hữu thanh và nguyên âm (plays, goes). Tra các âm ở trang IPA Converter.',
      'Hai quy tắc “y” bên dưới giống hệt quy tắc thêm -ed: study → studied, play → played.',
    ],
    ruleHeads: ['Động từ tận cùng', 'Thêm', 'Examples'],
    rules: [
      { when: 'Phần lớn động từ', then: '+ s', examples: 'work → works, live → lives' },
      {
        when: 'Tận cùng o, s, x, z, ch, sh',
        then: '+ es',
        examples: 'go → goes, do → does, miss → misses, fix → fixes, watch → watches, wash → washes',
      },
      { when: 'Phụ âm + y', then: 'bỏ y, + ies', examples: 'study → studies, fly → flies, carry → carries' },
      { when: 'Nguyên âm + y', then: '+ s', examples: 'play → plays, buy → buys, say → says' },
      { when: 'Bất quy tắc', then: '—', examples: 'have → has' },
    ],
    examples: [
      { en: 'She goes to school. / They go to school.', vi: 'Chỉ ngôi thứ 3 số ít thêm es; các ngôi khác giữ nguyên.' },
      { en: 'He studies English. / I study English.', vi: 'studies (phụ âm + y → ies) so với study giữ nguyên.' },
    ],
  },
  // Right after the s/es note: that note says "ngôi thứ 3 số ít" changes the
  // verb, and this is the full table of what each subject changes.
  {
    title: 'Chủ ngữ nào đi với am/is/are, was/were, have/has, do/does',
    body: [
      // "trợ động từ" would be wrong for half the examples here: in "Vietnam is
      // beautiful" or "The rain is heavy", is/are is the main (linking) verb.
      'Chọn dạng của be, have, do theo chủ ngữ, không theo nghĩa của câu. Cùng một thì nhưng chủ ngữ khác nhau thì dạng của các động từ này khác nhau.',
      'Danh từ số ít, tên riêng và danh từ không đếm được đều tính là ngôi thứ 3 số ít, nên đi với is/was/has/does giống hệt he, she, it.',
      'Ở quá khứ chỉ có be đổi theo chủ ngữ (was/were); have → had và do → did thì dùng chung cho mọi chủ ngữ.',
      'Riêng will thì dùng chung cho mọi chủ ngữ, không đổi theo ngôi. Shall chỉ dùng với I và we, mang nghĩa trang trọng hoặc để đưa ra lời đề nghị: Shall we go?',
    ],
    ruleHeads: ['Chủ ngữ', 'Dạng hiện tại', 'Dạng quá khứ của be, và ví dụ'],
    rules: [
      { when: 'I', then: 'am · have · do', examples: 'was — I am working. / I have worked.' },
      { when: 'You, We, They', then: 'are · have · do', examples: 'were — They are working. / They have worked.' },
      { when: 'He, She, It', then: 'is · has · does', examples: 'was — She is working. / She has worked.' },
      {
        when: 'Danh từ số ít (the cat, my brother)',
        then: 'is · has · does',
        examples: 'was — The cat is sleeping. / The cat has slept all day.',
      },
      { when: 'Tên riêng (Vietnam, Lan)', then: 'is · has · does', examples: 'was — Vietnam is beautiful.' },
      {
        when: 'Danh từ không đếm được (rain, water, money)',
        then: 'is · has · does',
        examples: 'was — The rain is heavy today.',
      },
      {
        when: 'Danh từ số nhiều (the cats, my brothers)',
        then: 'are · have · do',
        examples: 'were — The cats are sleeping.',
      },
    ],
    examples: [
      {
        en: 'The news is good. / My glasses are new.',
        vi: 'Đừng chỉ nhìn chữ s ở cuối: news là danh từ không đếm được nên đi với is, còn glasses luôn ở số nhiều nên đi với are.',
      },
    ],
  },
  {
    title: 'Quy tắc thêm đuôi -ing',
    body: [
      'Dùng cho tất cả các thì tiếp diễn (be + V-ing) và hoàn thành tiếp diễn (have + been + V-ing).',
      'Quy tắc gấp đôi phụ âm cuối chỉ áp dụng khi động từ tận cùng bằng phụ âm – nguyên âm – phụ âm VÀ âm tiết cuối được nhấn trọng âm. Vì vậy begin → beginning (trọng âm ở -gin) nhưng open → opening (trọng âm ở o-), còn explain → explaining vì không tận cùng phụ âm – nguyên âm – phụ âm.',
      'Khác với s/es và -ed, đuôi -y không bao giờ đổi trước -ing: study → studying, carry → carrying, play → playing.',
    ],
    ruleHeads: ['Động từ tận cùng', 'Cách thêm', 'Examples'],
    rules: [
      // play belongs in the w/x/y row below, where it blocks the false
      // positive that p-l-a-y looks like consonant–vowel–consonant.
      { when: 'Phần lớn động từ', then: '+ ing', examples: 'work → working, study → studying, open → opening' },
      { when: 'Tận cùng bằng e câm', then: 'bỏ e, + ing', examples: 'write → writing, make → making, come → coming' },
      { when: 'Tận cùng bằng ee', then: 'giữ nguyên, + ing', examples: 'see → seeing, agree → agreeing' },
      { when: 'Tận cùng bằng ie', then: 'ie → y, + ing', examples: 'lie → lying, die → dying, tie → tying' },
      {
        when: 'Một âm tiết, tận cùng phụ âm – nguyên âm – phụ âm',
        then: 'gấp đôi phụ âm cuối, + ing',
        examples: 'run → running, sit → sitting, stop → stopping, get → getting',
      },
      {
        // The CVC condition is NOT optional here. Without it the row also
        // matches explain (two syllables, stress on the last) and produces
        // "explainning". Same for appear, remain, contain.
        when: 'Hai âm tiết, trọng âm ở âm tiết cuối, tận cùng phụ âm – nguyên âm – phụ âm',
        then: 'gấp đôi phụ âm cuối, + ing',
        examples: 'begin → beginning, prefer → preferring, forget → forgetting',
      },
      {
        when: 'Tận cùng bằng w, x, y',
        then: 'KHÔNG gấp đôi, + ing',
        examples: 'snow → snowing, fix → fixing, play → playing',
      },
      {
        when: 'Tận cùng bằng nguyên âm + l (Anh-Anh)',
        then: 'gấp đôi l, + ing',
        examples: 'travel → travelling, cancel → cancelling (Anh-Mỹ: traveling, canceling)',
      },
      {
        when: 'Tận cùng bằng nguyên âm + c',
        then: 'c → ck, + ing',
        examples: 'picnic → picnicking, panic → panicking',
      },
    ],
    examples: [
      {
        en: 'begin → beginning, but open → opening',
        vi: 'Cùng hai âm tiết và cùng tận cùng phụ âm – nguyên âm – phụ âm, nhưng begin nhấn ở âm cuối nên gấp đôi, còn open nhấn ở âm đầu nên không gấp đôi.',
      },
    ],
  },
  {
    title: 'Lỗi thường gặp khi dịch: đã / đang / sẽ không ứng cố định với một thì tiếng Anh',
    body: [
      'Tiếng Việt đánh dấu thể bằng phó từ (đã, đang, sẽ, sắp, vừa) và được phép bỏ hẳn phó từ khi trong câu đã có từ chỉ thời gian: “Hôm qua tôi ăn ở nhà” vẫn là quá khứ. Tiếng Anh thì buộc phải chia động từ, dù câu đã có yesterday hay tomorrow. Vì vậy không dịch được từng chữ một.',
      'Quan trọng nhất: “đã” KHÔNG phân biệt được quá khứ đơn với hiện tại hoàn thành, còn “đang” KHÔNG tự chọn được thì — chỉ từ chỉ thời gian trong câu mới quyết định. Bảng dưới cho thấy cùng một phó từ tiếng Việt ra ba, bốn thì tiếng Anh khác nhau.',
      'Riêng các thì hoàn thành tiếp diễn không có phó từ riêng trong tiếng Việt; dấu hiệu là cấu trúc “được + khoảng thời gian … rồi”.',
    ],
    ruleHeads: ['Câu tiếng Việt', 'Thì tiếng Anh', 'Câu tiếng Anh'],
    rules: [
      { when: 'Tôi đang ăn. (ngay bây giờ)', then: 'Hiện tại tiếp diễn', examples: 'I am eating.' },
      { when: 'Lúc đó tôi đang ăn.', then: 'Quá khứ tiếp diễn', examples: 'I was eating then.' },
      {
        when: '8 giờ tối mai tôi đang ăn.',
        then: 'Tương lai tiếp diễn',
        examples: 'At 8 p.m. tomorrow I will be eating.',
      },
      { when: 'Tôi ăn rồi. (không nêu lúc nào)', then: 'Hiện tại hoàn thành', examples: 'I have eaten.' },
      { when: 'Tôi ăn lúc 7 giờ. (nêu rõ lúc nào)', then: 'Quá khứ đơn', examples: 'I ate at seven.' },
      {
        when: 'Tôi sẽ gặp nha sĩ lúc 3 giờ mai. (đã hẹn)',
        then: 'Hiện tại tiếp diễn',
        examples: 'I am meeting my dentist at 3 p.m. tomorrow.',
      },
      { when: 'Trời sắp mưa. (có căn cứ)', then: 'be going to', examples: 'It is going to rain.' },
      {
        when: 'Tôi học tiếng Anh được 2 năm rồi.',
        then: 'Hiện tại hoàn thành tiếp diễn',
        examples: 'I have been learning English for two years.',
      },
    ],
    examples: [
      {
        en: 'I ate at seven. / I have eaten.',
        vi: 'Cùng dịch là “Tôi ăn rồi / đã ăn” — có nêu thời điểm thì dùng quá khứ đơn, không nêu thì dùng hiện tại hoàn thành.',
      },
    ],
  },
  {
    title: 'Tương lai gần: “going to” và hiện tại tiếp diễn',
    body: [
      '“Going to” (S + am/is/are + going to + V) dùng cho hai trường hợp tương lai gần: dự định, kế hoạch đã quyết định từ trước lúc nói; và dự đoán có căn cứ trước mắt.',
      'Hiện tại tiếp diễn (S + am/is/are + V-ing) dùng cho một cuộc hẹn đã sắp xếp cố định — đã chốt thời gian hoặc địa điểm cụ thể, thường là hẹn với người khác.',
      'Khác với “will”: “will” dùng khi quyết định ngay tại lúc nói, hoặc dự đoán không có căn cứ nào.',
    ],
    examples: [
      { en: 'I am going to visit my grandma this weekend.', vi: 'Tôi định đi thăm bà vào cuối tuần này. (dự định có sẵn)' },
      { en: 'Look at those clouds! It is going to rain.', vi: 'Nhìn những đám mây kìa! Trời sắp mưa. (dự đoán có căn cứ)' },
      { en: 'I’m meeting my dentist at 3 pm tomorrow.', vi: 'Tôi sẽ gặp nha sĩ lúc 3 giờ chiều mai. (đã hẹn cụ thể)' },
    ],
  },
  {
    title: 'Động từ chỉ trạng thái: không dùng thể tiếp diễn',
    body: [
      'Động từ diễn tả trạng thái — tri giác, nhận thức, cảm xúc, sở hữu — chứ không phải hành động thì thường không dùng ở thể tiếp diễn, kể cả khi ý nghĩa là “ngay lúc này”. Dùng thể đơn thay thế.',
      'Các nhóm thường gặp: tri giác (see, hear, smell, taste), nhận thức (know, understand, believe, remember, forget), cảm xúc (like, love, hate, want, need, prefer), sở hữu (have, own, belong).',
      'Lưu ý: một số động từ trên còn có nghĩa hành động, và nghĩa đó CÓ dùng thể tiếp diễn — “see” (nhìn thấy) so với “look at” / “watch” (chủ ý xem); “think” (cho rằng) so với “think about” (đang cân nhắc). Chỉ nghĩa trạng thái mới phải giữ thể đơn.',
    ],
    examples: [
      { en: 'I know the answer.', vi: 'Tôi biết câu trả lời. (KHÔNG nói: I am knowing the answer.)' },
      { en: 'She loves this song.', vi: 'Cô ấy thích bài hát này. (KHÔNG nói: She is loving this song.)' },
    ],
  },
]
