import { buildLesson } from "./build-lesson";
import { UnitBank } from "../types";

// ── Unit 11: Money & Shopping — 10 unique lessons ────────────────────────────
// Practical interactions for stores, banks, budgets, and bills.

const unit11: UnitBank = [
  buildLesson(
    "At the Store",
    "لە فرۆشگا",
    [
      { en: "I'm just browsing — thanks though.", ku: "تەنها سەیر دەکەم (نایەکڕم) — بەڵام سوپاس." },
      { en: "Do you have this in a smaller size?", ku: "ئایا ئەمەتان بە قەبارەیەکی بچووکتر هەیە؟" },
      { en: "Where can I find the checkout counter?", ku: "لە کوێ دەتوانم مێزی پارەدان (کاشێر) بدۆزمەوە؟" },
      { en: "Is this item on sale this week?", ku: "ئایا ئەم کاڵایە ئەم هەفتەیە لە داشکاندندایە؟" },
      { en: "I'd like to try this on, please.", ku: "حەز دەکەم ئەمە تاقی بکەمەوە، تکایە." },
      { en: "Could you hold this at the register for me?", ku: "دەتوانیت ئەمە لەلای کاشێرەکە بۆم بپارێزیت تا دەگەڕێمەوە؟" },
    ],
    {
      convos: [
        {
          situation: "فرۆشیار دەپرسێت ئایا یارمەتیت دەوێت",
          theyAsk: "Can I help you find something today?",
          correct: "I'm just browsing for now, thanks. Though — do you have this jacket in a smaller size?",
          wrong1: "Go away I don't need you.",
          wrong2: "Give me everything free.",
          wrong3: "Store is too big.",
          explanation: "'Just browsing' = تەنها سەیر دەکەم — باوترین و بەئەدەبترین وەڵامە بۆ فرۆشیار کاتێک یارمەتیت ناوێت",
        },
        {
          situation: "دەتەوێت جلوبەرگ تاقی بکەیتەوە",
          theyAsk: "Would you like to try that on?",
          correct: "Yes, I'd like to try this on, please. Where are the fitting rooms?",
          wrong1: "No try I buy blind.",
          wrong2: "Fitting room is bad.",
          wrong3: "Clothes always fit.",
          explanation: "'Try this on' = تاقیکردنەوەی جل | 'Fitting rooms' = ژووری خۆگۆڕین لە فرۆشگادا",
        },
      ],
    },
  ),

  buildLesson(
    "Returns & Refunds",
    "گەڕاندنەوە و وەرگرتنەوەی پارە",
    [
      { en: "I'd like to return this item, please.", ku: "حەز دەکەم ئەم کاڵایە بگەڕێنمەوە، تکایە." },
      { en: "It doesn't fit — can I exchange it?", ku: "قەبارەکەی ناگونجێت — دەتوانم بیگۆڕمەوە؟" },
      { en: "I have the receipt from last Tuesday.", ku: "پسووڵەکەم (وەسڵەکەم) پێیە لە سێشەممەی ڕابردووەوە." },
      { en: "The product arrived damaged in the box.", ku: "بەرهەمەکە لەناو سندوقەکەدا بە شکاوی (تێکچووی) گەیشت." },
      { en: "How long do I have to return this?", ku: "ماوەی چەند ڕۆژم هەیە بۆ گەڕاندنەوەی ئەمە؟" },
      { en: "Can I get a refund to my original card?", ku: "دەتوانم پارەکە بگەڕێندرێتەوە بۆ هەمان کارت کە پێم کڕیوە؟" },
    ],
    {
      convos: [
        {
          situation: "لە بەشی خزمەتگوزاری کڕیار بۆ گەڕاندنەوەی جلێک",
          theyAsk: "What seems to be the problem with your purchase?",
          correct: "I'd like to return this item — it doesn't fit. I have the receipt from last Tuesday.",
          wrong1: "Product is fine I want money.",
          wrong2: "No receipt but return anyway.",
          wrong3: "I stole this item.",
          explanation: "'Return this item' و 'have the receipt' دوو خاڵی سەرەکین بۆ گەڕاندنەوەی هەر شتێک",
        },
        {
          situation: "کڕینی ئۆنلاین بە تێکچووی گەیشتووە",
          theyAsk: "Was the package opened when it arrived?",
          correct: "Yes — the product arrived damaged in the box. Can I get a refund to my original card?",
          wrong1: "Package was perfect.",
          wrong2: "I broke it myself.",
          wrong3: "Refund is not possible ever.",
          explanation: "'Arrived damaged' واتای ئەوەیە لە ڕێگا تێکچووە، وە داوای 'refund' واتە پارەکەم دەوێتەوە نەک گۆڕینەوە",
        },
      ],
    },
  ),

  buildLesson(
    "Banking Basics",
    "بنچینەکانی بانک",
    [
      { en: "I'd like to open a checking account.", ku: "حەز دەکەم هەژمارێکی جاری (checking) بکەمەوە." },
      { en: "What's the minimum balance required?", ku: "کەمترین بڕی پارە (باڵانس) کە پێویستە لە هەژمارەکەدا بێت چەندە؟" },
      { en: "Can I set up direct deposit for my salary?", ku: "دەتوانم دانانی ڕاستەوخۆ (direct deposit) بۆ مووچەکەم ڕێکبخەم؟" },
      { en: "I need to transfer money to another account.", ku: "پێویستە پارە حەواڵە بکەم بۆ هەژمارێکی تر." },
      { en: "My card was declined at the store.", ku: "کارتەکەم لە فرۆشگاکە ڕەتکرایەوە (پارەی لێ ڕانەکێشرا)." },
      { en: "Is there a fee for international transfers?", ku: "ئایا هیچ عمولەیەک (کرێیەک) هەیە بۆ حەواڵەی نێودەوڵەتی؟" },
    ],
    {
      convos: [
        {
          situation: "یەکەم جار دەچیتە بانک بۆ کردنەوەی حساب",
          theyAsk: "How can I help you with your banking today?",
          correct: "I'd like to open a checking account. What's the minimum balance required? Also, can I set up direct deposit?",
          wrong1: "Give me all bank money.",
          wrong2: "Banks are bad.",
          wrong3: "I don't need account.",
          explanation: "'Checking account' ئەو حسابەیە کە بۆ کڕین و مامەڵەی ڕۆژانە بەکاردێت. 'Direct deposit' واتە مووچەکەت ڕاستەوخۆ بێتە سەر حسابەکەت",
        },
        {
          situation: "کارتەکەت کاری نەکردووە کاتێک ویستووتە شت بکڕیت",
          theyAsk: "Did you recently make a large purchase?",
          correct: "Yes — my card was declined at the store. I need to transfer money to another account or increase my limit.",
          wrong1: "Card is broken forever.",
          wrong2: "Store is wrong not bank.",
          wrong3: "I don't use cards.",
          explanation: "'Card was declined' واتە ئامێرەکە کارتی قبوڵ نەکرد، جا لەبەر نەبوونی پارە بێت یان کێشەی بانک",
        },
      ],
    },
  ),

  buildLesson(
    "Rent & Housing",
    "کرێ و نیشتەجێبوون",
    [
      { en: "When is the rent due each month?", ku: "کرێ هەموو مانگێک کەی دەبێت بدرێت؟" },
      { en: "The landlord said the lease renews in June.", ku: "خاوەن ماڵەکە وتی گرێبەستەکە لە حوزەیراندا نوێ دەبێتەوە." },
      { en: "There's a leak in the bathroom ceiling.", ku: "دڵۆپە هەیە لە بنمیچی (سەقفی) گەرماوەکەدا." },
      { en: "Can we negotiate the security deposit?", ku: "دەتوانین مامەڵە بکەین لەسەر پارەی بارمتەکە (پێشەکییەکە)؟" },
      { en: "Utilities are not included in the rent.", ku: "تێچووی ئاو و کارەبا (Utilities) لە کرێیەکەدا هەژمار نەکراون." },
      { en: "I'm looking for a two-bedroom apartment.", ku: "بەدوای شوقەیەکی دوو نوستندا دەگەڕێم." },
    ],
    {
      convos: [
        {
          situation: "پرسیارکردن دەربارەی شوقەیەک بۆ کرێ",
          theyAsk: "This unit is twelve hundred a month — interested?",
          correct: "When is the rent due each month? Also, are utilities included or separate?",
          wrong1: "Rent is too cheap suspicious.",
          wrong2: "I pay whenever I want.",
          wrong3: "Apartment size doesn't matter.",
          explanation: "'Rent due' = وادەی دانی کرێ | 'Utilities included' پرسیارێکی زۆر گرنگە بۆ زانینی تێچووی مانگانە",
        },
        {
          situation: "پەیوەندی بە خاوەن ماڵ بۆ کێشەیەکی ناو شوقەکە",
          theyAsk: "What seems to be the issue with the apartment?",
          correct: "There's a leak in the bathroom ceiling — it started after the last rain. Can someone come fix it soon?",
          wrong1: "Apartment is perfect no problems.",
          wrong2: "I break things myself.",
          wrong3: "Fix it yourself landlord.",
          explanation: "'Leak in the ceiling' کێشەیەکی باوی کرێنشینانە کە خاوەن ماڵ دەبێت چارەسەری بکات",
        },
      ],
    },
  ),

  buildLesson(
    "Restaurant Bills & Tipping",
    "پسووڵەی چێشتخانە و بەخشیش (مەخسیش)",
    [
      { en: "Could we get the check, please?", ku: "دەتوانین پسووڵەکەمان پێ بدەیت، تکایە؟" },
      { en: "Can we split the bill evenly?", ku: "دەتوانین پسووڵەکە بە یەکسانی دابەش بکەین (بۆ پارەدان)؟" },
      { en: "I'll cover dinner tonight — my treat.", ku: "ئەمشەو پارەی نانخواردنەکە من دەیدەم — لەسەر حسابی منە." },
      { en: "I always tip at least twenty percent.", ku: "هەمیشە لانیکەم بیست لەسەد بەخشیش دەدەم." },
      { en: "Is the service charge included?", ku: "ئایا کرێی خزمەتگوزاری (سێرڤس) لە پسووڵەکەدا هەژمار کراوە؟" },
      { en: "Do you take card or cash only?", ku: "کارت قبوڵ دەکەن یان تەنها کاش؟" },
    ],
    {
      convos: [
        {
          situation: "دوای تەواوبوونی نانخواردن لە چێشتخانە",
          theyAsk: "Did you save room for dessert?",
          correct: "No thanks — could we get the check, please? Can we split the bill evenly?",
          wrong1: "We don't pay today.",
          wrong2: "Bill is wrong always.",
          wrong3: "Run without paying.",
          explanation: "'Get the check' وشەی باوی ئەمریکییە بۆ حساب | 'Split the bill' واتە هەرکەسە و بەشی خۆی دەدات",
        },
        {
          situation: "دەتەوێت ببیت بە میوانداری هاوڕێکەت",
          theyAsk: "Are we splitting or is someone covering tonight?",
          correct: "I'll cover dinner tonight — my treat. You can get drinks next time!",
          wrong1: "Everyone pays maximum.",
          wrong2: "My treat means you pay.",
          wrong3: "No one pays ever.",
          explanation: "'My treat' دەستەواژەیەکە بەکاردێت کاتێک دەتەوێت شتێک بکڕیت یان پارەی شتێک بدەیت بۆ کەسێکی تر (لە سەر حسابی منە)",
        },
      ],
    },
  ),
];

export default unit11;