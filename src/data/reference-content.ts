// ─────────────────────────────────────────────────────────────────────────────
// Reference content — the Guidebook hub's Letters / Nouns / Verbs pages.
//
// One curated set per target language (the catalog is `en`, `ar`, `ru`), with
// every explanation written in the learner's UI language. The guidebook's unit
// pages stay the "everyday talking" card; this file holds the foundations the
// unit pages assume the learner already has.
//
// Quality bar for edits: every example must be a word or form a real teacher
// would write on a whiteboard. No filler rows, no near-duplicate rules.
// ─────────────────────────────────────────────────────────────────────────────

export type ReferenceLocale = "en" | "ku" | "ar";

export type LocalizedText = Record<ReferenceLocale, string>;

export type LetterEntry = {
  /** The letter itself, in the target language's script. */
  glyph: string;
  /** Letter name, written in the target language's own convention. */
  name: string;
  /** How the letter sounds, explained in the learner's language. */
  sound: LocalizedText;
  /** A common example word in the target language… */
  example: string;
  /** …and what it means, in the learner's language. */
  exampleMeaning: LocalizedText;
};

export type LetterSet = {
  note?: LocalizedText;
  letters: LetterEntry[];
};

export type GrammarRow = {
  /** The target-language form. Use " → " between a base and its inflection. */
  form: string;
  /** What the TTS button should read, when `form` itself is not speakable. */
  speak?: string;
  /** Label that prefixes the form — a pronoun, a case name, a rule name. */
  label?: LocalizedText;
  /** What the form means, in the learner's language. */
  meaning: LocalizedText;
};

export type GrammarSection = {
  title: LocalizedText;
  note?: LocalizedText;
  rows: GrammarRow[];
};

export type GrammarSet = {
  sections: GrammarSection[];
};

export type ReferenceCategory = "letters" | "nouns" | "verbs";

export type ReferenceContent =
  | { category: "letters"; set: LetterSet }
  | { category: "nouns" | "verbs"; set: GrammarSet };

// ── English ──────────────────────────────────────────────────────────────────

const ENGLISH_LETTERS: LetterEntry[] = [
  { glyph: "A", name: "ay", sound: { en: "a as in apple", ku: "ئە — وەک لە Apple", ar: "أَ — كما في apple" }, example: "apple", exampleMeaning: { en: "apple", ku: "سێو", ar: "تفاحة" } },
  { glyph: "B", name: "bee", sound: { en: "b as in book", ku: "ب — وەک لە Book", ar: "ب — كما في book" }, example: "book", exampleMeaning: { en: "book", ku: "کتێب", ar: "كتاب" } },
  { glyph: "C", name: "see", sound: { en: "k or s", ku: "ک یان س — بەپێی وشەکە", ar: "ك أو س — حسب الكلمة" }, example: "cat", exampleMeaning: { en: "cat", ku: "پیشیلە", ar: "قطة" } },
  { glyph: "D", name: "dee", sound: { en: "d as in day", ku: "د — وەک لە Day", ar: "د — كما في day" }, example: "day", exampleMeaning: { en: "day", ku: "ڕۆژ", ar: "يوم" } },
  { glyph: "E", name: "ee", sound: { en: "e as in egg", ku: "ئێ — وەک لە Egg", ar: "إِ — كما في egg" }, example: "egg", exampleMeaning: { en: "egg", ku: "هێلکە", ar: "بيضة" } },
  { glyph: "F", name: "ef", sound: { en: "f as in fish", ku: "ف — وەک لە Fish", ar: "ف — كما في fish" }, example: "fish", exampleMeaning: { en: "fish", ku: "ماسی", ar: "سمكة" } },
  { glyph: "G", name: "gee", sound: { en: "g as in go", ku: "گ — وەک لە Go", ar: "g كما في go" }, example: "go", exampleMeaning: { en: "go", ku: "چوون", ar: "يذهب" } },
  { glyph: "H", name: "aych", sound: { en: "h as in house", ku: "ھ — وەک لە House", ar: "هـ — كما في house" }, example: "house", exampleMeaning: { en: "house", ku: "خانوو", ar: "منزل" } },
  { glyph: "I", name: "eye", sound: { en: "i as in ice", ku: "ئای — وەک لە Ice", ar: "آي — كما في ice" }, example: "ice", exampleMeaning: { en: "ice", ku: "سەھۆڵ", ar: "ثلج" } },
  { glyph: "J", name: "jay", sound: { en: "j as in juice", ku: "ج — وەک لە Juice", ar: "ج — كما في juice" }, example: "juice", exampleMeaning: { en: "juice", ku: "شەربەت", ar: "عصير" } },
  { glyph: "K", name: "kay", sound: { en: "k as in key", ku: "ک — وەک لە Key", ar: "ك — كما في key" }, example: "key", exampleMeaning: { en: "key", ku: "کلیل", ar: "مفتاح" } },
  { glyph: "L", name: "el", sound: { en: "l as in lion", ku: "ل — وەک لە Lion", ar: "ل — كما في lion" }, example: "lion", exampleMeaning: { en: "lion", ku: "شێر", ar: "أسد" } },
  { glyph: "M", name: "em", sound: { en: "m as in moon", ku: "م — وەک لە Moon", ar: "م — كما في moon" }, example: "moon", exampleMeaning: { en: "moon", ku: "مانگ", ar: "قمر" } },
  { glyph: "N", name: "en", sound: { en: "n as in nose", ku: "ن — وەک لە Nose", ar: "ن — كما في nose" }, example: "nose", exampleMeaning: { en: "nose", ku: "لووت", ar: "أنف" } },
  { glyph: "O", name: "oh", sound: { en: "o as in orange", ku: "ۆ — وەک لە Orange", ar: "أُ — كما في orange" }, example: "orange", exampleMeaning: { en: "orange", ku: "پرتەقاڵ", ar: "برتقال" } },
  { glyph: "P", name: "pee", sound: { en: "p as in pen", ku: "پ — وەک لە Pen", ar: "پ — كما في pen" }, example: "pen", exampleMeaning: { en: "pen", ku: "پێنووس", ar: "قلم" } },
  { glyph: "Q", name: "cue", sound: { en: "q — always with u", ku: "هەمیشە لەگەڵ u دێت: qu", ar: "تأتي دائماً مع u: qu" }, example: "queen", exampleMeaning: { en: "queen", ku: "شاژن", ar: "ملكة" } },
  { glyph: "R", name: "ar", sound: { en: "r as in red", ku: "ڕ — وەک لە Red", ar: "ر — كما في red" }, example: "red", exampleMeaning: { en: "red", ku: "سوور", ar: "أحمر" } },
  { glyph: "S", name: "es", sound: { en: "s as in sun", ku: "س — وەک لە Sun", ar: "س — كما في sun" }, example: "sun", exampleMeaning: { en: "sun", ku: "خۆر", ar: "شمس" } },
  { glyph: "T", name: "tee", sound: { en: "t as in tea", ku: "ت — وەک لە Tea", ar: "ت — كما في tea" }, example: "tea", exampleMeaning: { en: "tea", ku: "چا", ar: "شاي" } },
  { glyph: "U", name: "you", sound: { en: "u as in umbrella", ku: "ئا-ئو — وەک لە Umbrella", ar: "أُ — كما في umbrella" }, example: "umbrella", exampleMeaning: { en: "umbrella", ku: "چەتر", ar: "مظلة" } },
  { glyph: "V", name: "vee", sound: { en: "v as in van", ku: "ڤ — وەک لە Van", ar: "ڤ — كما في van" }, example: "van", exampleMeaning: { en: "van", ku: "ئۆتۆمبێلی بچووک", ar: "شاحنة صغيرة" } },
  { glyph: "W", name: "double-u", sound: { en: "w as in water", ku: "و — وەک لە Water", ar: "و — كما في water" }, example: "water", exampleMeaning: { en: "water", ku: "ئاو", ar: "ماء" } },
  { glyph: "X", name: "ex", sound: { en: "ks as in box", ku: "کس — وەک لە Box", ar: "كس — كما في box" }, example: "box", exampleMeaning: { en: "box", ku: "سنووک", ar: "صندوق" } },
  { glyph: "Y", name: "why", sound: { en: "y as in yellow", ku: "ی — وەک لە Yellow", ar: "ي — كما في yellow" }, example: "yellow", exampleMeaning: { en: "yellow", ku: "زەرد", ar: "أصفر" } },
  { glyph: "Z", name: "zee", sound: { en: "z as in zoo", ku: "ز — وەک لە Zoo", ar: "ز — كما في zoo" }, example: "zoo", exampleMeaning: { en: "zoo", ku: "باخی ئاژەڵان", ar: "حديقة حيوانات" } },
];

const ENGLISH_NOUNS: GrammarSet = {
  sections: [
    {
      title: { en: "a / an / the", ku: "a / an / the", ar: "a / an / the" },
      note: {
        en: "Use a before a consonant sound, an before a vowel sound. The points at something specific.",
        ku: "a پێش دەنگی بێدەنگ دێت، an پێش دەنگی بزوێن. the بۆ شتێکی دیاریکراو.",
        ar: "a قبل الحرف الساكن، an قبل حركة المد. the لشيء محدد.",
      },
      rows: [
        { form: "a book", speak: "a book", meaning: { en: "one book (any book)", ku: "کتێبێک (هەر کتێبێک)", ar: "كتابٌ (أي كتاب)" } },
        { form: "an apple", speak: "an apple", meaning: { en: "one apple (any apple)", ku: "سێوێک (هەر سێوێک)", ar: "تفاحةٌ (أي تفاحة)" } },
        { form: "the sun", speak: "the sun", meaning: { en: "the sun — the one we all know", ku: "خۆرەکە — ئەوەی هەموومان دەیزانین", ar: "الشمس — المعروفة" } },
      ],
    },
    {
      title: { en: "Plurals", ku: "زۆرکردن", ar: "الجمع" },
      rows: [
        { form: "book → books", speak: "books", meaning: { en: "most words: add -s", ku: "زۆربەی وشەکان: -s زیاد دەکەین", ar: "معظم الكلمات: أضف -s" } },
        { form: "box → boxes", speak: "boxes", meaning: { en: "after s, x, ch, sh: add -es", ku: "دوای s و x و ch و sh: -es زیاد دەکەین", ar: "بعد s وx وch وsh: أضف -es" } },
        { form: "city → cities", speak: "cities", meaning: { en: "consonant + y: y becomes ies", ku: "بێدەنگ + y: دەبێتە ies", ar: "ساكن + y: تصبح ies" } },
        { form: "knife → knives", speak: "knives", meaning: { en: "-fe often becomes -ves", ku: "-fe زۆرجار دەبێتە -ves", ar: "-fe غالباً تصبح -ves" } },
      ],
    },
    {
      title: { en: "Irregular plurals", ku: "کۆی تایبەت", ar: "جمع شاذ" },
      note: {
        en: "These must be memorised — there is no rule.",
        ku: "ئەمانە دەبێت لەبیر بکرێن — یاسایان نییە.",
        ar: "هذه تُحفظ — لا قاعدة لها.",
      },
      rows: [
        { form: "child → children", speak: "children", meaning: { en: "child → children", ku: "منداڵ → منداڵان", ar: "طفل → أطفال" } },
        { form: "man → men", speak: "men", meaning: { en: "man → men", ku: "پیاویش → پیاوان", ar: "رجل → رجال" } },
        { form: "woman → women", speak: "women", meaning: { en: "woman → women", ku: "ژن → ژنان", ar: "امرأة → نساء" } },
        { form: "person → people", speak: "people", meaning: { en: "person → people", ku: "کەس → خەڵک", ar: "شخص → أشخاص" } },
        { form: "foot → feet", speak: "feet", meaning: { en: "foot → feet", ku: "پێ → پێکان", ar: "قدم → أقدام" } },
        { form: "tooth → teeth", speak: "teeth", meaning: { en: "tooth → teeth", ku: "ددان → ددانەکان", ar: "سنّ → أسنان" } },
      ],
    },
    {
      title: { en: "No plural, no a/an", ku: "بێ کۆ و بێ a/an", ar: "بدون جمع وبدون a/an" },
      note: {
        en: "Uncountable things — liquids, materials, ideas — never take a/an or -s.",
        ku: "شتە نەژمێردراوەکان — شل، کێڵگە، بیرۆکە — هەرگیز a/an یان -s ناوەستن.",
        ar: "غير المعدود — سوائل ومواد وأفكار — لا تأخذ a/an ولا -s.",
      },
      rows: [
        { form: "water", meaning: { en: "never a water, waters", ku: "هەرگیز «ئاوێک» ناوترێت", ar: "لا تُقال a water" } },
        { form: "money", meaning: { en: "how much money — not how many", ku: "چەند پارە (much) — نەک (many)", ar: "how much وليس how many" } },
        { form: "information", meaning: { en: "always singular", ku: "هەمیشە یەکە", ar: "مفردة دائماً" } },
        { form: "advice", meaning: { en: "a piece of advice — not an advice", ku: "a piece of advice — نەک an advice", ar: "a piece of advice وليس an advice" } },
      ],
    },
    {
      title: { en: "Possessive 's", ku: "خاوەندارێتی 's", ar: "الإضافة 's" },
      rows: [
        { form: "Tom's car", speak: "Tom's car", meaning: { en: "the car of Tom", ku: "ئۆتۆمبێلی تۆم", ar: "سيارة توم" } },
        { form: "the teacher's desk", speak: "the teacher's desk", meaning: { en: "the desk of the teacher", ku: "مێزی مامۆستا", ar: "مكتب المعلم" } },
        { form: "my parents' house", speak: "my parents' house", meaning: { en: "plural: add ' after the s", ku: "کۆ: ' دوای s دەنووسرێت", ar: "للجمع: ضع ' بعد s" } },
      ],
    },
  ],
};

const ENGLISH_VERBS: GrammarSet = {
  sections: [
    {
      title: { en: "to be — present", ku: "to be — ئێستا", ar: "to be — المضارع" },
      rows: [
        { form: "I am", meaning: { en: "I am a student.", ku: "من قوتابییم.", ar: "أنا طالب." } },
        { form: "you are", meaning: { en: "You are right.", ku: "تۆ ڕاست دەکەیت.", ar: "أنت محق." } },
        { form: "he / she is", meaning: { en: "She is a doctor.", ku: "ئەو (ژن) پزیشکە.", ar: "هي طبيبة." } },
        { form: "we are", meaning: { en: "We are ready.", ku: "ئێمە ئامادەین.", ar: "نحن مستعدون." } },
        { form: "they are", meaning: { en: "They are late.", ku: "ئەوان درەنگ دەگەن.", ar: "هم متأخرون." } },
      ],
    },
    {
      title: { en: "to be — past", ku: "to be — ڕابردوو", ar: "to be — الماضي" },
      rows: [
        { form: "I / he / she was", meaning: { en: "I was at home.", ku: "من لە ماڵ بووم.", ar: "كنت في المنزل." } },
        { form: "you / we / they were", meaning: { en: "They were tired.", ku: "ئەوان ماندوو بوون.", ar: "كانوا متعبين." } },
      ],
    },
    {
      title: { en: "Present simple: -s with he/she/it", ku: "Present simple: -s لەگەڵ he/she/it", ar: "المضارع: -s مع he/she/it" },
      note: {
        en: "Only the third person takes -s. Everything else stays bare.",
        ku: "تەنها کەسی سێیەم -s وەردەگرێت. ئەوانی تر بێ زیادەن.",
        ar: "فقط الغائب يأخذ -s. الباقي بدون إضافة.",
      },
      rows: [
        { form: "I work", meaning: { en: "every day", ku: "هەموو ڕۆژێک", ar: "كل يوم" } },
        { form: "he works", meaning: { en: "add -s", ku: "-s زیاد دەکەین", ar: "أضف -s" } },
        { form: "she watches", meaning: { en: "after ch/sh/s/x: -es", ku: "دوای ch/sh/s/x: -es", ar: "بعد ch/sh/s/x: -es" } },
        { form: "it rains", meaning: { en: "weather too", ku: "کەش و هەوا وەها دەبێت", ar: "الطقس كذلك" } },
      ],
    },
    {
      title: { en: "Past: regular -ed", ku: "ڕابردوو: -ed", ar: "الماضي: -ed" },
      rows: [
        { form: "work → worked", speak: "worked", meaning: { en: "most verbs: add -ed", ku: "زۆربەی کردارەکان: -ed زیاد دەکەین", ar: "معظم الأفعال: أضف -ed" } },
        { form: "play → played", speak: "played", meaning: { en: "vowel + y: just -ed", ku: "بزوێن + y: تەنها -ed", ar: "حركة + y: فقط -ed" } },
        { form: "study → studied", speak: "studied", meaning: { en: "consonant + y: -ied", ku: "بێدەنگ + y: -ied", ar: "ساكن + y: -ied" } },
        { form: "stop → stopped", speak: "stopped", meaning: { en: "short verb: double the last letter", ku: "کرداری کورت: کۆتا پیت دووبارە دەکەین", ar: "الفعل القصير: ضاعف الحرف الأخير" } },
      ],
    },
    {
      title: { en: "Past: irregular", ku: "ڕابردووی تایبەت", ar: "الماضي الشاذ" },
      note: {
        en: "The most-used verbs in English are irregular. Learn them as pairs.",
        ku: "زۆر بەکارهاتووترین کردارەکانی ئینگلیزی تایبەتن. وەک جووت فێری بە.",
        ar: "أكثر الأفعال استخداماً شاذة. احفظها كأزواج.",
      },
      rows: [
        { form: "go → went", speak: "went", meaning: { en: "go → went", ku: "چوون → چوو", ar: "يذهب → ذهب" } },
        { form: "see → saw", speak: "saw", meaning: { en: "see → saw", ku: "بینین → بینی", ar: "يرى → رأى" } },
        { form: "eat → ate", speak: "ate", meaning: { en: "eat → ate", ku: "خواردن → خوارد", ar: "يأكل → أكل" } },
        { form: "take → took", speak: "took", meaning: { en: "take → took", ku: "وەرگرتن → وەرگرت", ar: "يأخذ → أخذ" } },
        { form: "make → made", speak: "made", meaning: { en: "make → made", ku: "دروستکردن → دروستکرد", ar: "يصنع → صنع" } },
        { form: "come → came", speak: "came", meaning: { en: "come → came", ku: "هاتن → هات", ar: "يأتي → جاء" } },
      ],
    },
    {
      title: { en: "Questions & negatives", ku: "پرسیار و ڕەتکردنەوە", ar: "السؤال والنفي" },
      rows: [
        { form: "Do you speak English?", meaning: { en: "questions with do/does", ku: "پرسیار بە do/does", ar: "السؤال بـ do/does" } },
        { form: "She doesn't smoke.", meaning: { en: "negative with doesn't", ku: "ڕەتکردنەوە بە doesn't", ar: "النفي بـ doesn't" } },
        { form: "They didn't come.", meaning: { en: "past negative: didn't + bare verb", ku: "ڕابردووی نەرێنی: didn't + کرداری ساکار", ar: "النفي في الماضي: didn't + المصدر" } },
      ],
    },
  ],
};

// ── Arabic ───────────────────────────────────────────────────────────────────

const ARABIC_LETTERS: LetterEntry[] = [
  { glyph: "ا", name: "أَلِف", sound: { en: "ā — long a", ku: "ئا — درێژ", ar: "أَ / ا" }, example: "أسد", exampleMeaning: { en: "lion", ku: "شێر", ar: "أسد" } },
  { glyph: "ب", name: "باء", sound: { en: "b as in book", ku: "ب — وەک لە Book", ar: "ب" }, example: "بَيت", exampleMeaning: { en: "house", ku: "خانوو", ar: "بيت" } },
  { glyph: "ت", name: "تاء", sound: { en: "t as in tea", ku: "ت — وەک لە Tea", ar: "ت" }, example: "تَمر", exampleMeaning: { en: "dates", ku: "خورما", ar: "تمر" } },
  { glyph: "ث", name: "ثاء", sound: { en: "th as in think", ku: "ث — نەرمتر لە s", ar: "ث" }, example: "ثَلج", exampleMeaning: { en: "snow", ku: "بەفر", ar: "ثلج" } },
  { glyph: "ج", name: "جيم", sound: { en: "j as in juice", ku: "ج — وەک لە Juice", ar: "ج" }, example: "جَمَل", exampleMeaning: { en: "camel", ku: "حوشتر", ar: "جمل" } },
  { glyph: "ح", name: "حاء", sound: { en: "h — deep breathy h", ku: "ح — h قووڵ لە قوڕگەوە", ar: "ح" }, example: "حَديقة", exampleMeaning: { en: "garden", ku: "باخ", ar: "حديقة" } },
  { glyph: "خ", name: "خاء", sound: { en: "kh as in Bach", ku: "خ — وەک خ", ar: "خ" }, example: "خُبز", exampleMeaning: { en: "bread", ku: "نان", ar: "خبز" } },
  { glyph: "د", name: "دال", sound: { en: "d as in day", ku: "د — وەک لە Day", ar: "د" }, example: "دار", exampleMeaning: { en: "house", ku: "خانوو", ar: "دار" } },
  { glyph: "ذ", name: "ذال", sound: { en: "th as in this", ku: "ذ — نەرم وەک لە This", ar: "ذ" }, example: "ذَهَب", exampleMeaning: { en: "gold", ku: "زێر", ar: "ذهب" } },
  { glyph: "ر", name: "راء", sound: { en: "r — rolled", ku: "ر — لەرزۆک", ar: "ر" }, example: "رَجُل", exampleMeaning: { en: "man", ku: "پیاویش", ar: "رجل" } },
  { glyph: "ز", name: "زاي", sound: { en: "z as in zoo", ku: "ز — وەک لە Zoo", ar: "ز" }, example: "زَرافة", exampleMeaning: { en: "giraffe", ku: "ژیرافە", ar: "زرافة" } },
  { glyph: "س", name: "سين", sound: { en: "s as in sun", ku: "س — وەک لە Sun", ar: "س" }, example: "سَلام", exampleMeaning: { en: "peace", ku: "ئاشتی", ar: "سلام" } },
  { glyph: "ش", name: "شين", sound: { en: "sh as in ship", ku: "ش — وەک لە Ship", ar: "ش" }, example: "شَمس", exampleMeaning: { en: "sun", ku: "خۆر", ar: "شمس" } },
  { glyph: "ص", name: "صاد", sound: { en: "s — heavy s", ku: "ص — s قووڵ", ar: "ص" }, example: "صَديق", exampleMeaning: { en: "friend", ku: "هاوڕێ", ar: "صديق" } },
  { glyph: "ض", name: "ضاد", sound: { en: "d — heavy d", ku: "ض — d قووڵ", ar: "ض" }, example: "ضَيف", exampleMeaning: { en: "guest", ku: "میوان", ar: "ضيف" } },
  { glyph: "ط", name: "طاء", sound: { en: "t — heavy t", ku: "ط — t قووڵ", ar: "ط" }, example: "طالِب", exampleMeaning: { en: "student", ku: "قوتابی", ar: "طالب" } },
  { glyph: "ظ", name: "ظاء", sound: { en: "th — heavy th", ku: "ظ — ذی قووڵ", ar: "ظ" }, example: "ظُهر", exampleMeaning: { en: "noon", ku: "نیوەڕۆ", ar: "ظهر" } },
  { glyph: "ع", name: "عين", sound: { en: "ʿa — deep throat sound", ku: "ع — دەنگی قووڵی قوڕگ", ar: "ع" }, example: "عَين", exampleMeaning: { en: "eye", ku: "چاو", ar: "عين" } },
  { glyph: "غ", name: "غين", sound: { en: "gh — like French r", ku: "غ — وەک ر نەرمی فەڕەنسی", ar: "غ" }, example: "غَيم", exampleMeaning: { en: "cloud", ku: "هەور", ar: "غيم" } },
  { glyph: "ف", name: "فاء", sound: { en: "f as in fish", ku: "ف — وەک لە Fish", ar: "ف" }, example: "فيل", exampleMeaning: { en: "elephant", ku: "فیل", ar: "فيل" } },
  { glyph: "ق", name: "قاف", sound: { en: "q — k from the throat", ku: "ق — لە بنی قوڕگەوە", ar: "ق" }, example: "قَمَر", exampleMeaning: { en: "moon", ku: "مانگ", ar: "قمر" } },
  { glyph: "ك", name: "كاف", sound: { en: "k as in key", ku: "ک — وەک لە Key", ar: "ك" }, example: "كِتاب", exampleMeaning: { en: "book", ku: "کتێب", ar: "كتاب" } },
  { glyph: "ل", name: "لام", sound: { en: "l as in lion", ku: "ل — وەک لە Lion", ar: "ل" }, example: "لَيل", exampleMeaning: { en: "night", ku: "شەو", ar: "ليل" } },
  { glyph: "م", name: "ميم", sound: { en: "m as in moon", ku: "م — وەک لە Moon", ar: "م" }, example: "مَدينة", exampleMeaning: { en: "city", ku: "شار", ar: "مدينة" } },
  { glyph: "ن", name: "نون", sound: { en: "n as in nose", ku: "ن — وەک لە Nose", ar: "ن" }, example: "نور", exampleMeaning: { en: "light", ku: "ڕووناکی", ar: "نور" } },
  { glyph: "هـ", name: "هاء", sound: { en: "h as in house", ku: "ھ — وەک لە House", ar: "هـ" }, example: "هَديّة", exampleMeaning: { en: "gift", ku: "دیاری", ar: "هدية" } },
  { glyph: "و", name: "واو", sound: { en: "w as in water / ū", ku: "و — یان دەنگی درێژی «وو»", ar: "و / ū" }, example: "وَردة", exampleMeaning: { en: "rose", ku: "گوڵ", ar: "وردة" } },
  { glyph: "ي", name: "ياء", sound: { en: "y as in yellow / ī", ku: "ی — یان دەنگی درێژی «یی»", ar: "ي / ī" }, example: "يَد", exampleMeaning: { en: "hand", ku: "دەست", ar: "يد" } },
];

const ARABIC_NOUNS: GrammarSet = {
  sections: [
    {
      title: { en: "الـ — the definite article", ku: "الـ — ناسکردن", ar: "الـ — التعريف" },
      note: {
        en: "Arabic has no word for 'a'. كِتاب alone means 'a book'; add الـ to make it 'the book'.",
        ku: "عەرەبی وشەی «یەک/یەکێک» نییە. کِتاب بە تەنها «کتێبێک»ە؛ الـ زیاد بکە دەبێتە «کتێبەکە».",
        ar: "لا يوجد نكرة بأداة. كِتاب نكرة، والـ لتعريفه.",
      },
      rows: [
        { form: "كِتاب", meaning: { en: "a book", ku: "کتێبێک", ar: "كتابٌ" } },
        { form: "الْكِتاب", meaning: { en: "the book", ku: "کتێبەکە", ar: "الكتابُ" } },
        { form: "بَيت", meaning: { en: "a house", ku: "خانووێک", ar: "بيتٌ" } },
        { form: "الْبَيت", meaning: { en: "the house", ku: "خانووەکە", ar: "البيتُ" } },
      ],
    },
    {
      title: { en: "Sun & moon letters", ku: "حەرفەکانی خۆر و مانگ", ar: "الحروف الشمسية والقمرية" },
      note: {
        en: "After sun letters the ل of الـ is silent and the letter doubles: ash-shams. After moon letters you hear it: al-qamar.",
        ku: "دوای حەرفە خۆرییەکان لـ ی الـ ناخوێنرێتەوە و حەرفەکە دووبارە دەبێت: ash-shams. دوای مانگییەکان دەخوێنرێت: al-qamar.",
        ar: "بعد الحروف الشمسية تُحذف لام الـ وتشدد: ash-shams. وبعد القمرية تُسمع: al-qamar.",
      },
      rows: [
        { form: "الشَّمس", speak: "ash-shams", meaning: { en: "the sun — sun letter ش", ku: "خۆرەکە — ش حەرفی خۆرییە", ar: "الشمس — شمسية" } },
        { form: "الرَّجُل", speak: "ar-rajul", meaning: { en: "the man — sun letter ر", ku: "پیاویشەکە — ر حەرفی خۆرییە", ar: "الرجل — شمسية" } },
        { form: "الْقَمَر", speak: "al-qamar", meaning: { en: "the moon — moon letter ق", ku: "مانگەکە — ق حەرفی مانگییە", ar: "القمر — قمرية" } },
        { form: "الْكِتاب", speak: "al-kitab", meaning: { en: "the book — moon letter ک", ku: "کتێبەکە — ک حەرفی مانگییە", ar: "الكتاب — قمرية" } },
      ],
    },
    {
      title: { en: "Gender", ku: "ڕەگەز", ar: "الجنس" },
      note: {
        en: "Every noun is masculine or feminine. Most feminine words end in ة.",
        ku: "هەموو ناوەکان نێر یان مێن. زۆربەی مێیەکان بە ئ کۆتایی دێن.",
        ar: "كل اسم مذكر أو مؤنث. ومعظم المؤنث ينتهي بـ ة.",
      },
      rows: [
        { form: "كِتاب", meaning: { en: "book — masculine", ku: "کتێب — نێر", ar: "كتاب — مذكر" } },
        { form: "سيّارة", meaning: { en: "car — feminine (ة)", ku: "ئۆتۆمبێل — مێ (ة)", ar: "سيارة — مؤنث (ة)" } },
        { form: "شَمس", meaning: { en: "sun — feminine without ة", ku: "خۆر — مێ بێ ة", ar: "شمس — مؤنث بلا ة" } },
        { form: "بَيت", meaning: { en: "house — masculine", ku: "خانوو — نێر", ar: "بيت — مذكر" } },
      ],
    },
    {
      title: { en: "Dual — exactly two", ku: "دووانی — بۆ دوو شت", ar: "المثنى" },
      note: {
        en: "Two of anything takes ان. There is no separate word for 'two'.",
        ku: "بۆ دوو شت ان زیاد دەکەین. وشەی «دوو» جیا بەکارنایەت.",
        ar: "الثنائية بإضافة ان. لا حاجة لكلمة «اثنان» معها.",
      },
      rows: [
        { form: "كِتابان", speak: "kitaban", meaning: { en: "two books", ku: "دوو کتێب", ar: "كتابان" } },
        { form: "بَيتان", speak: "baytan", meaning: { en: "two houses", ku: "دوو خانوو", ar: "بيتان" } },
      ],
    },
    {
      title: { en: "Plurals", ku: "کۆ", ar: "الجمع" },
      note: {
        en: "Sound plurals add endings; broken plurals change the word's shape and must be learned with the noun.",
        ku: "کۆی سالم پاشگر زیاد دەکات؛ کۆی شێوانی شێوەی وشەکە دەگۆڕێت — لەگەڵ ناوەکە فێری بە.",
        ar: "الجمع السالم يضيف لاحقة، والجمع التكسيري يغيّر بنية الكلمة فتُحفظ معها.",
      },
      rows: [
        { form: "مُعَلِّمون", speak: "mu'allimun", meaning: { en: "teachers (male) — ون", ku: "مامۆستایان (نێر) — ون", ar: "معلمون" } },
        { form: "مُعَلِّمات", speak: "mu'allimat", meaning: { en: "teachers (female) — ات", ku: "مامۆستایان (مێ) — ات", ar: "معلمات" } },
        { form: "كِتاب → كُتُب", speak: "kutub", meaning: { en: "book → books (broken)", ku: "کتێب → کتێبەکان (شێوانی)", ar: "كتاب → كتب (تكسير)" } },
        { form: "وَلَد → أَولاد", speak: "awlad", meaning: { en: "boy → children (broken)", ku: "منداڵ → منداڵان (شێوانی)", ar: "ولد → أولاد (تكسير)" } },
      ],
    },
  ],
};

const ARABIC_VERBS: GrammarSet = {
  sections: [
    {
      title: { en: "Past — كَتَبَ (he wrote)", ku: "ڕابردوو — كَتَبَ", ar: "الماضي — كَتَبَ" },
      rows: [
        { form: "كَتَبْتُ", speak: "katabtu", meaning: { en: "I wrote", ku: "من نووسیوم", ar: "أنا كتبتُ" } },
        { form: "كَتَبْتَ", speak: "katabta", meaning: { en: "you (m) wrote", ku: "تۆ (نێر) نووسیوت", ar: "أنتَ كتبتَ" } },
        { form: "كَتَبَتْ", speak: "katabat", meaning: { en: "she wrote", ku: "ئەو (مێ) نووسی", ar: "هي كتبتْ" } },
        { form: "كَتَبْنا", speak: "katabna", meaning: { en: "we wrote", ku: "ئێمە نووسیمان", ar: "نحن كتبنا" } },
        { form: "كَتَبوا", speak: "katabu", meaning: { en: "they wrote", ku: "ئەوان نووسیان", ar: "هم كتبوا" } },
      ],
    },
    {
      title: { en: "Present — يَكْتُبُ (he writes)", ku: "ئێستا — يَكْتُبُ", ar: "المضارع — يَكْتُبُ" },
      rows: [
        { form: "أَكْتُبُ", speak: "aktubu", meaning: { en: "I write", ku: "من دەنووسم", ar: "أنا أكتبُ" } },
        { form: "تَكْتُبُ", speak: "taktubu", meaning: { en: "you write", ku: "تۆ دەنووسی", ar: "أنتَ تكتبُ" } },
        { form: "يَكْتُبُ", speak: "yaktubu", meaning: { en: "he writes", ku: "ئەو (نێر) دەنووسێت", ar: "هو يكتبُ" } },
        { form: "نَكْتُبُ", speak: "naktubu", meaning: { en: "we write", ku: "ئێمە دەنووسین", ar: "نحن نكتبُ" } },
        { form: "يَكْتُبون", speak: "yaktubun", meaning: { en: "they write", ku: "ئەوان دەنووسن", ar: "هم يكتبون" } },
      ],
    },
    {
      title: { en: "Negation", ku: "ڕەتکردنەوە", ar: "النفي" },
      rows: [
        { form: "لا أَكْتُبُ", speak: "la aktubu", meaning: { en: "I don't write (present)", ku: "دەنووسم (ئێستا)", ar: "لا أكتبُ — مضارع" } },
        { form: "ما كَتَبْتُ", speak: "ma katabtu", meaning: { en: "I didn't write (past)", ku: "نووسیوم (ڕابردوو)", ar: "ما كتبتُ — ماضٍ" } },
        { form: "لم يَكْتُبْ", speak: "lam yaktub", meaning: { en: "he didn't write (emphatic past)", ku: "نووسی (پتوی ڕابردوو)", ar: "لم يكتبْ — ماضٍ مؤكد" } },
      ],
    },
    {
      title: { en: "كان — to be (past)", ku: "كان — بوون (ڕابردوو)", ar: "كان — الماضي" },
      rows: [
        { form: "كان", speak: "kana", meaning: { en: "he was", ku: "ئەو (نێر) بوو", ar: "هو كان" } },
        { form: "كانت", speak: "kanat", meaning: { en: "she was", ku: "ئەو (مێ) بوو", ar: "هي كانت" } },
        { form: "كانوا", speak: "kanu", meaning: { en: "they were", ku: "ئەوان بوون", ar: "هم كانوا" } },
      ],
    },
    {
      title: { en: "Common verbs", ku: "کردارە باوەکان", ar: "أفعال شائعة" },
      rows: [
        { form: "ذَهَبَ", speak: "dhahaba", meaning: { en: "went", ku: "چوو", ar: "ذهب" } },
        { form: "أَكَلَ", speak: "akala", meaning: { en: "ate", ku: "خوارد", ar: "أكل" } },
        { form: "شَرِبَ", speak: "shariba", meaning: { en: "drank", ku: "نووشی", ar: "شرب" } },
        { form: "دَرَسَ", speak: "darasa", meaning: { en: "studied", ku: "خوێندی", ar: "درس" } },
        { form: "سَمِعَ", speak: "sami'a", meaning: { en: "heard", ku: "بیستی", ar: "سمع" } },
      ],
    },
  ],
};

// ── Russian ──────────────────────────────────────────────────────────────────

const RUSSIAN_LETTERS: LetterEntry[] = [
  { glyph: "А а", name: "а", sound: { en: "a as in father", ku: "ئا — درێژ", ar: "آ" }, example: "арбуз", exampleMeaning: { en: "watermelon", ku: "شەمامە", ar: "بطيخ" } },
  { glyph: "Б б", name: "бэ", sound: { en: "b as in book", ku: "ب — وەک لە Book", ar: "ب" }, example: "банан", exampleMeaning: { en: "banana", ku: "مۆز", ar: "موز" } },
  { glyph: "В в", name: "вэ", sound: { en: "v as in van", ku: "ڤ — وەک لە Van", ar: "ڤ" }, example: "вода", exampleMeaning: { en: "water", ku: "ئاو", ar: "ماء" } },
  { glyph: "Г г", name: "гэ", sound: { en: "g as in go", ku: "گ — وەک لە Go", ar: "g كما في go" }, example: "город", exampleMeaning: { en: "city", ku: "شار", ar: "مدينة" } },
  { glyph: "Д д", name: "дэ", sound: { en: "d as in day", ku: "د — وەک لە Day", ar: "د" }, example: "дом", exampleMeaning: { en: "house", ku: "خانوو", ar: "منزل" } },
  { glyph: "Е е", name: "йэ", sound: { en: "ye as in yes", ku: "یە — وەک لە Yes", ar: "يَه" }, example: "еда", exampleMeaning: { en: "food", ku: "خواردن", ar: "طعام" } },
  { glyph: "Ё ё", name: "йо", sound: { en: "yo as in yolk", ku: "یۆ", ar: "يُو" }, example: "ёлка", exampleMeaning: { en: "fir tree", ku: "داری کریسمس", ar: "شجرة التنوب" } },
  { glyph: "Ж ж", name: "жэ", sound: { en: "s as in pleasure", ku: "ژ — وەک ژ", ar: "ج فارسية" }, example: "журнал", exampleMeaning: { en: "magazine", ku: "گۆڤار", ar: "مجلة" } },
  { glyph: "З з", name: "зэ", sound: { en: "z as in zoo", ku: "ز — وەک لە Zoo", ar: "ز" }, example: "завод", exampleMeaning: { en: "factory", ku: "کارگە", ar: "مصنع" } },
  { glyph: "И и", name: "и", sound: { en: "ee as in see", ku: "یی — درێژ", ar: "إي" }, example: "игра", exampleMeaning: { en: "game", ku: "یاری", ar: "لعبة" } },
  { glyph: "Й й", name: "и краткое", sound: { en: "y as in boy (short)", ku: "ی — کورت", ar: "ي قصيرة" }, example: "йогурт", exampleMeaning: { en: "yogurt", ku: "ماست", ar: "لبن زبادي" } },
  { glyph: "К к", name: "ка", sound: { en: "k as in key", ku: "ک — وەک لە Key", ar: "ك" }, example: "книга", exampleMeaning: { en: "book", ku: "کتێب", ar: "كتاب" } },
  { glyph: "Л л", name: "эль", sound: { en: "l as in lion", ku: "ل — وەک لە Lion", ar: "ل" }, example: "лампа", exampleMeaning: { en: "lamp", ku: "چرا", ar: "مصباح" } },
  { glyph: "М м", name: "эм", sound: { en: "m as in moon", ku: "م — وەک لە Moon", ar: "م" }, example: "мама", exampleMeaning: { en: "mom", ku: "دایک", ar: "أم" } },
  { glyph: "Н н", name: "эн", sound: { en: "n as in nose", ku: "ن — وەک لە Nose", ar: "ن" }, example: "небо", exampleMeaning: { en: "sky", ku: "ئاسمان", ar: "سماء" } },
  { glyph: "О о", name: "о", sound: { en: "o as in more", ku: "ۆ — وەک لە More", ar: "أُو" }, example: "окно", exampleMeaning: { en: "window", ku: "پەنجەرە", ar: "نافذة" } },
  { glyph: "П п", name: "пэ", sound: { en: "p as in pen", ku: "پ — وەک لە Pen", ar: "پ" }, example: "поезд", exampleMeaning: { en: "train", ku: "شەمەندەفەر", ar: "قطار" } },
  { glyph: "Р р", name: "эр", sound: { en: "r — rolled", ku: "р — لەرزۆک", ar: "ر مكررة" }, example: "радио", exampleMeaning: { en: "radio", ku: "ڕادیۆ", ar: "راديو" } },
  { glyph: "С с", name: "эс", sound: { en: "s as in sun", ku: "س — وەک لە Sun", ar: "س" }, example: "солнце", exampleMeaning: { en: "sun", ku: "خۆر", ar: "شمس" } },
  { glyph: "Т т", name: "тэ", sound: { en: "t as in tea", ku: "ت — وەک لە Tea", ar: "ت" }, example: "телефон", exampleMeaning: { en: "phone", ku: "تەلەفۆن", ar: "هاتف" } },
  { glyph: "У у", name: "у", sound: { en: "oo as in book", ku: "و — درێژ", ar: "أُو" }, example: "утро", exampleMeaning: { en: "morning", ku: "بەیانی", ar: "صباح" } },
  { glyph: "Ф ф", name: "эф", sound: { en: "f as in fish", ku: "ف — وەک لە Fish", ar: "ف" }, example: "фильм", exampleMeaning: { en: "film", ku: "فیلم", ar: "فيلم" } },
  { glyph: "Х х", name: "ха", sound: { en: "kh as in Bach", ku: "خ — وەک خ", ar: "خ" }, example: "хлеб", exampleMeaning: { en: "bread", ku: "نان", ar: "خبز" } },
  { glyph: "Ц ц", name: "цэ", sound: { en: "ts as in cats", ku: "تس — وەک لە Cats", ar: "تس" }, example: "цвет", exampleMeaning: { en: "flower", ku: "گوڵ", ar: "زهرة" } },
  { glyph: "Ч ч", name: "че", sound: { en: "ch as in chair", ku: "چ — وەک لە Chair", ar: "تش" }, example: "чай", exampleMeaning: { en: "tea", ku: "چا", ar: "شاي" } },
  { glyph: "Ш ш", name: "ша", sound: { en: "sh as in ship", ku: "ش — وەک لە Ship", ar: "ش" }, example: "школа", exampleMeaning: { en: "school", ku: "قوتابخانە", ar: "مدرسة" } },
  { glyph: "Щ щ", name: "ща", sound: { en: "long soft sh", ku: "ش درێژ و نەرم", ar: "ش ممدودة" }, example: "щётка", exampleMeaning: { en: "brush", ku: "فڕۆکەی پاککردنەوە", ar: "فرشاة" } },
  { glyph: "Ъ ъ", name: "твёрдый знак", sound: { en: "no sound — hard sign", ku: "بێ دەنگ — نیشانەی ڕەق", ar: "بلا صوت — علامة" }, example: "подъезд", exampleMeaning: { en: "entrance", ku: "دەروازە", ar: "مدخل" } },
  { glyph: "Ы ы", name: "ы", sound: { en: "i — deep, tense", ku: "ی — قووڵ", ar: "إي عميقة" }, example: "сын", exampleMeaning: { en: "son", ku: "کوڕ", ar: "ابن" } },
  { glyph: "Ь ь", name: "мягкий знак", sound: { en: "no sound — softens the letter before", ku: "بێ دەنگ — پێشی نەرم دەکات", ar: "بلا صوت — يلين ما قبله" }, example: "соль", exampleMeaning: { en: "salt", ku: "خوێ", ar: "ملح" } },
  { glyph: "Э э", name: "э", sound: { en: "e as in met", ku: "ئێ — وەک لە Met", ar: "إِه" }, example: "этаж", exampleMeaning: { en: "floor", ku: "نه‌م", ar: "طابق" } },
  { glyph: "Ю ю", name: "ю", sound: { en: "yu as in Yulia", ku: "یو", ar: "يُو" }, example: "юбка", exampleMeaning: { en: "skirt", ku: "دەمەبەند", ar: "تنورة" } },
  { glyph: "Я я", name: "я", sound: { en: "ya as in yard", ku: "یا — وەک لە Yard", ar: "يَا" }, example: "яблоко", exampleMeaning: { en: "apple", ku: "سێو", ar: "تفاحة" } },
];

const RUSSIAN_NOUNS: GrammarSet = {
  sections: [
    {
      title: { en: "Gender", ku: "ڕەگەز", ar: "الجنس" },
      note: {
        en: "Three genders, visible from the ending: consonant = masculine, а/я = feminine, о/е = neuter.",
        ku: "سێ ڕەگەز، لە کۆتایی وشەکە دیارە: بێدەنگ = نێر، а/я = مێ، о/е = بێ‌لایەن.",
        ar: "ثلاثة أجناس من النهاية: ساكن = مذكر، а/я = مؤنث، о/е = محيّد.",
      },
      rows: [
        { form: "стол", meaning: { en: "table — masculine", ku: "مێز — نێر", ar: "طاولة — مذكر" } },
        { form: "книга", meaning: { en: "book — feminine", ku: "کتێب — مێ", ar: "كتاب — مؤنث" } },
        { form: "окно", meaning: { en: "window — neuter", ku: "پەنجەرە — بێ‌لایەن", ar: "نافذة — محيّد" } },
      ],
    },
    {
      title: { en: "Plurals", ku: "کۆ", ar: "الجمع" },
      rows: [
        { form: "стол → столы", speak: "stoly", meaning: { en: "masculine: -ы", ku: "نێر: -ы", ar: "مذكر: -ы" } },
        { form: "книга → книги", speak: "knigi", meaning: { en: "feminine а: -и", ku: "مێی а: -и", ar: "مؤنث а: -и" } },
        { form: "окно → окна", speak: "okna", meaning: { en: "neuter о: -а", ku: "بێ‌لایەنی о: -а", ar: "محيّд о: -а" } },
        { form: "дом → дома", speak: "doma", meaning: { en: "irregular: stressed -а́", ku: "تایبەت: -а́ بە پەستان", ar: "شاذ: -а́" } },
      ],
    },
    {
      title: { en: "The six cases", ku: "شەش حالەکە", ar: "الحالات الست" },
      note: {
        en: "Russian nouns change ending depending on their role in the sentence. The question identifies the case.",
        ku: "ناوەکانی ڕوسی بەپێی ئەرکەکەیان لە ڕستە کۆتایی دەگۆڕن. پرسیارەکە حالەکە دیاری دەکات.",
        ar: "الأسماء الروسية تتغير نهايتها حسب دورها في الجملة. السؤال يحدد الحالة.",
      },
      rows: [
        { form: "книга", label: { en: "who? what?", ku: "کێ؟ چی؟", ar: "من؟ ماذا؟" }, meaning: { en: "subject", ku: "کاری سەرەکی", ar: "فاعل" } },
        { form: "книги", label: { en: "of what?", ku: "چیی چی؟", ar: "ماذا؟ (ملكية)" }, meaning: { en: "belonging: the book's", ku: "خاوەندارێتی: کتابەکەی", ar: "إضافة" } },
        { form: "книге", label: { en: "to what?", ku: "بۆ چی؟", ar: "لمن؟" }, meaning: { en: "giving to", ku: "پێدان", ar: "المعطى" } },
        { form: "книгу", label: { en: "see what?", ku: "چی دەبینم؟", ar: "ماذا أرى؟" }, meaning: { en: "object", ku: "مەفعوول", ar: "مفعول" } },
        { form: "книгой", label: { en: "with what?", ku: "بە چی؟", ar: "بماذا؟" }, meaning: { en: "with / by", ku: "بە", ar: "بـ" } },
        { form: "о книге", speak: "o knige", label: { en: "about what?", ku: "دەربارەی چی؟", ar: "عن ماذا؟" }, meaning: { en: "after о — the only case with a preposition you must learn early", ku: "دوای о — تاک حالە کە لە سەرەتاوە پێویستە", ar: "بعد о — حالات تحتاج حرف الجر" } },
      ],
    },
  ],
};

const RUSSIAN_VERBS: GrammarSet = {
  sections: [
    {
      title: { en: "Present — работать (to work)", ku: "ئێستا — работать", ar: "المضارع — работать" },
      rows: [
        { form: "я работаю", speak: "ya rabotayu", meaning: { en: "I work", ku: "من کار دەکەم", ar: "أنا أعمل" } },
        { form: "ты работаешь", speak: "ty rabotayesh", meaning: { en: "you work (informal)", ku: "تۆ کار دەکەیت", ar: "أنت تعمل" } },
        { form: "он работает", speak: "on rabotayet", meaning: { en: "he works", ku: "ئەو کار دەکات", ar: "هو يعمل" } },
        { form: "мы работаем", speak: "my rabotayem", meaning: { en: "we work", ku: "ئێمە کار دەکەین", ar: "نحن نعمل" } },
        { form: "вы работаете", speak: "vy rabotayete", meaning: { en: "you work (formal/plural)", ku: "ئێوە کار دەکەن", ar: "أنتم تعملون" } },
        { form: "они работают", speak: "oni rabotayut", meaning: { en: "they work", ku: "ئەوان کار دەکەن", ar: "هم يعملون" } },
      ],
    },
    {
      title: { en: "Past — by gender", ku: "ڕابردوو — بەپێی ڕەگەز", ar: "الماضي — حسب الجنس" },
      note: {
        en: "No 'he/she' verb change like English -s: the ending follows gender.",
        ku: "وەک -s ی ئینگلیزی نییە: کۆتایی بەپێی ڕەگەز دێت.",
        ar: "لا تغيير مثل -s الإنجليزية: النهاية تتبع الجنس.",
      },
      rows: [
        { form: "он работал", speak: "on rabotal", meaning: { en: "he worked", ku: "ئەو (نێر) کاری کرد", ar: "هو عمل" } },
        { form: "она работала", speak: "ona rabotala", meaning: { en: "she worked", ku: "ئەو (مێ) کاری کرد", ar: "هي عملت" } },
        { form: "оно работало", speak: "ono rabotalo", meaning: { en: "it worked", ku: "ئەو (شتی) کاری کرد", ar: "هو (لغير العاقل) عمل" } },
        { form: "они работали", speak: "oni rabotali", meaning: { en: "they worked", ku: "ئەوان کاریان کرد", ar: "هم عملوا" } },
      ],
    },
    {
      title: { en: "Future", ku: "داهاتوو", ar: "المستقبل" },
      rows: [
        { form: "буду работать", speak: "budu rabotat", meaning: { en: "I will work (ongoing)", ku: "کار دەکەم (بەردەوام)", ar: "سأعمل (استمرارية)" } },
        { form: "прочитаю", speak: "prochitayu", meaning: { en: "I will read (finish it)", ku: "دەخوێنمەوە (تەواوی)", ar: "سأقرأ (إتماماً)" } },
      ],
    },
    {
      title: { en: "Motion: идти / ехать", ku: "بزووتن: идти / ехать", ar: "الحركة: идти / ехать" },
      note: {
        en: "Walking and riding use different verbs — a famously Russian distinction.",
        ku: "پیاسە و سواری کردنی کرداری جیایان ھەیە — تایبەتمەندی ناسراوی ڕوسی.",
        ar: "المشي والركوب لكلٍّ منهما فعل — ميزة روسية شهيرة.",
      },
      rows: [
        { form: "идти", speak: "idti", meaning: { en: "to go on foot", ku: "بە پیاسە چوون", ar: "يذهب مشياً" } },
        { form: "ехать", speak: "yekhat", meaning: { en: "to go by vehicle", ku: "بە ئۆتۆمبێل چوون", ar: "يذهب مركبةً" } },
        { form: "Я иду домой", speak: "ya idu domoy", meaning: { en: "I'm walking home", ku: "بە پیاسە دەچمە ماڵەوە", ar: "أذهب مشياً للمنزل" } },
      ],
    },
  ],
};

// ── Catalog ──────────────────────────────────────────────────────────────────

const CONTENT: Record<string, Record<ReferenceCategory, ReferenceContent> | undefined> = {
  en: {
    letters: { category: "letters", set: { letters: ENGLISH_LETTERS } },
    nouns: { category: "nouns", set: ENGLISH_NOUNS },
    verbs: { category: "verbs", set: ENGLISH_VERBS },
  },
  ar: {
    letters: { category: "letters", set: { letters: ARABIC_LETTERS } },
    nouns: { category: "nouns", set: ARABIC_NOUNS },
    verbs: { category: "verbs", set: ARABIC_VERBS },
  },
  ru: {
    letters: { category: "letters", set: { letters: RUSSIAN_LETTERS } },
    nouns: { category: "nouns", set: RUSSIAN_NOUNS },
    verbs: { category: "verbs", set: RUSSIAN_VERBS },
  },
};

export function getReferenceContent(
  category: ReferenceCategory,
  targetLanguage: string,
): ReferenceContent | null {
  return CONTENT[targetLanguage]?.[category] ?? null;
}
