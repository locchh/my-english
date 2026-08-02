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
  /** The special cases: what the form above does not tell you. A restriction
   *  (no continuous with stative verbs), a confusion with a neighbouring tense
   *  (will vs be going to), or a warning that the tense is rarer than the grid
   *  makes it look.
   *
   *  One line each, and only where there is something real to say — this is the
   *  last thing in a dialog someone opened to check a formula, so it earns its
   *  place by being short. Not to be confused with `notes` at module scope,
   *  which is the page's own reference section below the grid. */
  notes?: string[]
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
    adverbs: ['yesterday', 'last night/week/month/year', 'ago (two days ago)', 'in + năm đã qua (in 2024)', 'when I was young'],
    notes: [
      'Động từ bất quy tắc dùng cột V2 — tra ở trang Irregular Verbs.',
      'Thói quen trong quá khứ nay không còn: dùng used to + V(bare) — He used to smoke.',
    ],
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
    notes: [
      'Không dùng với động từ chỉ trạng thái (know, love, want…).',
      'Cặp hay đi cùng nhau: while + quá khứ tiếp diễn (việc dài), when + quá khứ đơn (việc ngắn xen vào).',
    ],
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
    adverbs: ['before / after + vế còn lại ở quá khứ', 'by the time + vế còn lại ở quá khứ', 'until then', 'already', 'as soon as'],
    notes: [
      'Chỉ cần khi thứ tự trước/sau chưa rõ. Đã có before hoặc after thì để cả hai vế ở quá khứ đơn cũng đúng — He left before I arrived.',
    ],
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
    notes: [
      'Ít dùng. Chỉ chọn khi cần nhấn vào sự kéo dài liên tục ngay trước mốc quá khứ; còn lại dùng quá khứ hoàn thành.',
      'Không dùng với động từ chỉ trạng thái.',
    ],
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
    notes: [
      'Ngôi thứ 3 số ít thêm s/es — xem ghi chú quy tắc thêm s/es ở phần Notes.',
      'Sau if, when, before, after, as soon as: việc tương lai vẫn chia hiện tại đơn, không dùng will.',
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
    notes: [
      'Không dùng với động từ chỉ trạng thái (know, love, want…).',
      'always + hiện tại tiếp diễn mang nghĩa phàn nàn: He is always coming late.',
    ],
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
    notes: [
      'Không đi với mốc quá khứ xác định (yesterday, in 2020) — những mốc đó dùng quá khứ đơn.',
      'have been to = đã đi và đã về; have gone to = đã đi, chưa về.',
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
    notes: [
      'Nhấn vào quá trình kéo dài; hiện tại hoàn thành nhấn vào kết quả.',
      'Không dùng với động từ chỉ trạng thái.',
    ],
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
    notes: [
      'will so với be going to: will là quyết định ngay lúc nói hoặc dự đoán không có căn cứ; be going to là dự định đã có sẵn hoặc dự đoán có căn cứ trước mắt.',
      'Sau if, when, before, after không dùng will — If it rains, I will stay at home.',
      'shall chỉ dùng với I/we, trong văn trang trọng hoặc khi đề nghị: Shall we go?',
    ],
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
    notes: [
      'Ít dùng. Nhấn vào việc sẽ đang diễn ra tại một mốc tương lai.',
      'Cũng dùng để hỏi lịch một cách lịch sự: Will you be using the car tonight?',
    ],
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
    adverbs: ['by + mốc tương lai (by 2030)', 'by the time + vế còn lại ở tương lai', 'by then', 'before + mốc tương lai', 'by the end of…'],
    notes: [
      'Vế sau by the time chia hiện tại đơn, không dùng will — By the time you arrive, she will have finished.',
    ],
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
    notes: [
      'Rất ít dùng. Nhấn vào tổng thời gian kéo dài tính đến một mốc tương lai.',
    ],
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
  // Second: the signal words. Each tense already carries its own list in the
  // dialog, but that list is only reachable by opening twelve dialogs and
  // holding them in your head — and the question a learner actually has runs
  // the other way round ("I see `by the time`, which tense?"). So the same
  // information is inverted here into one table, on the page, unclicked.
  //
  // Every `when` is unique, and that is the whole difficulty of this table:
  // before, after, by the time and since each point at two or three different
  // tenses, so the word alone answers nothing. What settles it is the other
  // clause, which is why the left column carries the word AND that condition.
  {
    title: 'Dấu hiệu nhận biết thì',
    body: [
      'Dấu hiệu nhận biết là gợi ý, không phải luật. Chúng cho biết nên nghĩ tới thì nào trước; quyết định cuối cùng vẫn là ba câu hỏi ở ghi chú trên.',
      'Nhiều dấu hiệu dùng chung cho nhiều thì: before, after, by the time, since đều xuất hiện ở cả quá khứ lẫn tương lai. Cái phân biệt chúng là vế còn lại của câu, nên cột “Dấu hiệu” dưới đây ghi kèm điều kiện đó.',
      'Hai bẫy hay gặp. Thứ nhất, in + năm ra quá khứ đơn khi năm đó đã qua (in 2024) nhưng ra tương lai khi năm đó chưa tới (in 2030) — bản thân chữ in không quyết định gì. Thứ hai, now đi với động từ chỉ trạng thái thì vẫn dùng hiện tại đơn: I understand now, không phải I am understanding now.',
    ],
    ruleHeads: ['Dấu hiệu', 'Thì', 'Ví dụ'],
    rules: [
      {
        when: 'now, right now, at the moment, at present',
        then: 'Hiện tại tiếp diễn',
        examples: 'She is working now.',
      },
      {
        when: 'Look! / Listen! / Be quiet!',
        then: 'Hiện tại tiếp diễn',
        examples: 'Listen! The baby is crying.',
      },
      {
        when: 'always, usually, often, sometimes, every day',
        then: 'Hiện tại đơn',
        examples: 'She usually works at home.',
      },
      {
        when: 'yesterday, last week/month/year',
        then: 'Quá khứ đơn',
        examples: 'She worked here last year.',
      },
      { when: 'ago (two days ago)', then: 'Quá khứ đơn', examples: 'She left two days ago.' },
      {
        when: 'in + năm đã qua (in 2024)',
        then: 'Quá khứ đơn',
        examples: 'She moved to Ha Noi in 2024.',
      },
      {
        when: 'while + vế còn lại ở quá khứ',
        then: 'Quá khứ tiếp diễn (vế dài) + quá khứ đơn (vế xen vào)',
        examples: 'While she was working, the phone rang.',
      },
      {
        when: 'at 8 p.m. last night, at that moment',
        then: 'Quá khứ tiếp diễn',
        examples: 'At 8 p.m. last night she was working.',
      },
      {
        when: 'before / after + vế còn lại ở quá khứ',
        then: 'Quá khứ hoàn thành (việc xảy ra trước)',
        examples: 'She had worked there before she moved.',
      },
      {
        when: 'by the time + vế còn lại ở quá khứ',
        then: 'Quá khứ hoàn thành',
        examples: 'By the time he arrived, she had left.',
      },
      {
        when: 'just, already, yet, ever, never',
        then: 'Hiện tại hoàn thành',
        examples: 'She has just finished the report.',
      },
      {
        when: 'since + mốc thời gian, for + khoảng thời gian',
        then: 'Hiện tại hoàn thành — hoặc HTHT tiếp diễn nếu nhấn vào sự kéo dài',
        examples: 'She has worked here since 2020.',
      },
      {
        when: 'tomorrow, next week/month/year, soon',
        then: 'Tương lai đơn',
        examples: 'She will work tomorrow.',
      },
      {
        when: 'in the future, someday',
        then: 'Tương lai đơn',
        examples: 'She will work abroad in the future.',
      },
      {
        when: 'at this time tomorrow, this time next week',
        then: 'Tương lai tiếp diễn',
        examples: 'At this time tomorrow she will be working.',
      },
      {
        when: 'by the time + vế còn lại ở tương lai',
        then: 'Tương lai hoàn thành',
        examples: 'By the time you arrive, she will have finished.',
      },
      {
        when: 'by + mốc tương lai (by 2030), by then',
        then: 'Tương lai hoàn thành',
        examples: 'She will have finished by 2030.',
      },
    ],
    examples: [
      {
        en: 'While she was working, the phone rang.',
        vi: 'while → vế dài chia quá khứ tiếp diễn, vế ngắn xen vào chia quá khứ đơn.',
      },
      {
        en: 'By the time you arrive, she will have finished.',
        vi: 'by the time + vế còn lại ở tương lai → vế chính chia ở tương lai hoàn thành. Chú ý vế by the time dùng hiện tại đơn (arrive), không dùng will.',
      },
    ],
  },
  // Then the spelling mechanics: the grid's Present Simple cell shows
  // "S + V(s/es)", so the reader meets that formula early.
  {
    title: 'Quy tắc thêm s/es (ngôi thứ 3 số ít, hiện tại đơn)',
    body: [
      'Chỉ ngôi thứ 3 số ít mới thêm s/es — I, you, we, they giữ nguyên động từ nguyên mẫu.',
      // Uncountables have no number, so they're named alongside "danh từ số ít"
      // rather than placed inside it.
      'Ngôi thứ 3 số ít không chỉ là he, she, it: tên riêng (Vietnam, Lan), danh từ đếm được số ít (the cat, my brother) và danh từ không đếm được (rain, water, money) đều thuộc ngôi này — The cat sleeps a lot. / Vietnam has a long coastline. / Water boils at 100 degrees.',
      'Phát âm đuôi này: /ɪz/ sau âm xì (watches, misses), /s/ sau âm vô thanh (works, stops), /z/ sau âm hữu thanh và nguyên âm (plays, goes). Tra ở trang IPA Converter.',
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
      'Chọn dạng của be, have, do theo chủ ngữ, không theo nghĩa của câu.',
      'Danh từ số ít, tên riêng, danh từ không đếm được, và someone/everyone/nobody… đều tính là ngôi thứ 3 số ít, nên đi với is/was/has/does giống hệt he, she, it.',
      'Ở quá khứ chỉ có be đổi theo chủ ngữ (was/were); had, did và will thì dùng chung cho mọi ngôi. Shall chỉ dùng với I và we, mang nghĩa trang trọng hoặc để đề nghị: Shall we go?',
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
        // everyone/everybody feel plural (they refer to many people) but take
        // is/has/does — the mistake this row exists to block.
        when: 'someone, everyone, nobody, everything…',
        then: 'is · has · does',
        examples: 'was — Everyone is here. / Nobody has left. / Someone does it.',
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
      {
        en: 'Everyone is happy. (KHÔNG: Everyone are happy.)',
        vi: 'everyone, nobody… nói về nhiều người nhưng luôn chia số ít.',
      },
    ],
  },
  // Directly after the subject table: that one says which auxiliary to pick,
  // this one says what the main verb does once an auxiliary is in front of it.
  {
    title: 'Câu hỏi: sau did/does dùng nguyên mẫu, sau has/had dùng V3',
    body: [
      'Trong câu hỏi, trợ động từ đứng đầu đã mang thì rồi, nên động từ chính KHÔNG chia lại nữa. Dạng của nó do chính trợ động từ đó quyết định, và luôn cố định.',
      'Hai chỗ hay nhầm nhất: did/does đi với nguyên mẫu (Did she work?), còn has/had đi với V3 (Has she worked?).',
    ],
    ruleHeads: ['Trợ động từ đứng đầu', 'Động từ chính', 'Ví dụ'],
    rules: [
      {
        when: 'Do / Does / Did',
        then: 'nguyên mẫu (V)',
        examples: 'Did she work yesterday? (KHÔNG: Did she worked?)',
      },
      {
        when: 'Have / Has / Had',
        then: 'V3',
        examples: 'Has she worked here? (KHÔNG: Has she work?)',
      },
      {
        when: 'Am / Is / Are / Was / Were',
        then: 'V-ing',
        examples: 'Is she working now?',
      },
      { when: 'Will / Can / May', then: 'nguyên mẫu (V)', examples: 'Will she work tomorrow?' },
    ],
    examples: [
      {
        en: 'Did she work? / Has she worked?',
        vi: 'did mang nghĩa quá khứ nên work giữ nguyên mẫu; has thì luôn kéo theo V3.',
      },
    ],
  },
  {
    title: 'Quy tắc thêm đuôi -ing',
    body: [
      'Dùng cho mọi thì tiếp diễn (be + V-ing) và hoàn thành tiếp diễn (have + been + V-ing).',
      'Chỉ gấp đôi phụ âm cuối khi động từ tận cùng phụ âm – nguyên âm – phụ âm VÀ trọng âm rơi vào âm tiết cuối: begin → beginning, nhưng open → opening (trọng âm ở o-) và explain → explaining (không đúng dạng trên).',
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
      'Tiếng Việt đánh dấu thể bằng phó từ (đã, đang, sẽ, sắp, vừa) và được bỏ hẳn phó từ khi câu đã có từ chỉ thời gian: “Hôm qua tôi ăn ở nhà” vẫn là quá khứ. Tiếng Anh thì luôn phải chia động từ, nên không dịch từng chữ được.',
      'Quan trọng nhất: “đã” KHÔNG phân biệt được quá khứ đơn với hiện tại hoàn thành, “đang” cũng KHÔNG tự chọn được thì — chỉ từ chỉ thời gian mới quyết định. Bảng dưới cho thấy cùng một phó từ ra ba, bốn thì khác nhau.',
      'Riêng các thì hoàn thành tiếp diễn không có phó từ riêng trong tiếng Việt; dấu hiệu là “được + khoảng thời gian … rồi”.',
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
      '“Going to” (S + am/is/are + going to + V): dự định đã quyết định từ trước lúc nói, hoặc dự đoán có căn cứ trước mắt.',
      'Hiện tại tiếp diễn (S + am/is/are + V-ing): cuộc hẹn đã sắp xếp cố định — đã chốt thời gian hoặc địa điểm cụ thể, thường là hẹn với người khác.',
      '“Will”: quyết định ngay tại lúc nói, hoặc dự đoán không có căn cứ nào.',
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
      'Động từ chỉ trạng thái — chứ không phải hành động — thì không dùng ở thể tiếp diễn, kể cả khi ý nghĩa là “ngay lúc này”. Dùng thể đơn thay thế.',
      'Các nhóm thường gặp: tri giác (see, hear, smell, taste), nhận thức (know, understand, believe, remember), cảm xúc (like, love, hate, want, need), sở hữu (have, own, belong).',
      'Lưu ý: một số động từ trên còn có nghĩa hành động, và nghĩa đó CÓ dùng thể tiếp diễn — “see” (nhìn thấy) so với “watch” (chủ ý xem); “think” (cho rằng) so với “think about” (đang cân nhắc). Chỉ nghĩa trạng thái mới giữ thể đơn.',
    ],
    examples: [
      { en: 'I know the answer.', vi: 'Tôi biết câu trả lời. (KHÔNG nói: I am knowing the answer.)' },
      { en: 'She loves this song.', vi: 'Cô ấy thích bài hát này. (KHÔNG nói: She is loving this song.)' },
    ],
  },
]
