import { UnitBank } from "../types";

// ── Unit 4: Specialized Daily Encounters — 10 unique lessons ──────────
// Practical vocabulary and phrasing for specific situations like banking, renting, and repairs.

const normalUnit04: UnitBank = [

  // Lesson 0: At the Bank
  {
    topic: "At the Bank", topicKu: "لە بانک",
    words: [
      { english: "Open an account",      kurdish: "کردنەوەی هەژمار (حساب)" },
      { english: "Transfer money",       kurdish: "حەواڵەکردنی پارە" },
      { english: "Interest rate",        kurdish: "ڕێژەی سوود" },
      { english: "Make a deposit",       kurdish: "دانانی پارە لە هەژماردا" },
      { english: "Withdraw cash",        kurdish: "ڕاکێشانی پارە (بە کاش)" },
    ],
    voices: [
      { prompt: "کردنەوەی هەژمارێکی نوێ", target: "I would like to open a savings account, please.", targetKurdish: "دەمەوێت هەژمارێکی پاشەکەوت بکەمەوە، تکایە." },
      { prompt: "حەواڵەکردنی پارە", target: "I need to transfer some money to another account.", targetKurdish: "پێویستە کەمێک پارە حەواڵەی هەژمارێکی تر بکەم." },
    ],
    sentences: [
      { english: ["Can", "I", "make", "a", "deposit", "into", "my", "account"], kurdish: "دەتوانم پارە بخەمە سەر هەژمارەکەم؟" },
      { english: ["What", "is", "the", "interest", "rate", "for", "a", "loan"], kurdish: "ڕێژەی سوود بۆ قەرزێک چەندە؟" },
    ],
    fillBlanks: [
      { parts: ["I need to", "some cash from the ATM."], hint: "پێویستە کەمێک پارە (بە کاش) لە ئامێری ئەی تی ئێم ڕابکێشم.", answer: "withdraw", wrongs: ["take", "get", "pull"] },
      { parts: ["I want to", "a new checking account."], hint: "دەمەوێت هەژمارێکی نوێی جاری بکەمەوە.", answer: "open", wrongs: ["make", "start", "create"] },
    ],
    conversations: [
      { situation: "چوونە بانک بۆ ڕاکێشانی پارە", theyAsk: "How can I help you today, sir?", correct: "I would like to withdraw five hundred dollars from my savings account, please.", wrong1: "Give me 500 dollars from my money.", wrong2: "I want to take cash from my save.", wrong3: "I need to pull 500 dollars out.", explanation: "'Withdraw' وشەی فەرمی و دروستە بۆ ڕاکێشانی پارە لە بانک" },
    ],
  },

  // Lesson 1: Renting an Apartment
  {
    topic: "Renting an Apartment", topicKu: "کرێکردنی شوقە",
    words: [
      { english: "Sign the lease",       kurdish: "واژۆکردنی گرێبەستی کرێ" },
      { english: "Security deposit",     kurdish: "پارەی بارمتە (تەئمینات)" },
      { english: "Are utilities included", kurdish: "ئایا خزمەتگوزارییەکان (ئاو/کارەبا) لەگەڵدایە؟" },
      { english: "Fully furnished",      kurdish: "بەتەواوی کەلوپەلی تێدایە (موبەلیغە)" },
      { english: "Give notice",          kurdish: "ئاگادارکردنەوەی پێشوەختە (بۆ چۆڵکردن)" },
    ],
    voices: [
      { prompt: "پرسین لە خزمەتگوزارییەکان", target: "Are utilities like water and electricity included in the rent?", targetKurdish: "ئایا خزمەتگوزارییەکانی وەک ئاو و کارەبا لە نرخی کرێیەکەدا هەژمار کراون؟" },
      { prompt: "پێدانی بارمتە", target: "How much is the security deposit for this apartment?", targetKurdish: "پارەی بارمتە بۆ ئەم شوقەیە چەندە؟" },
    ],
    sentences: [
      { english: ["We", "are", "ready", "to", "sign", "the", "lease", "today"], kurdish: "ئێمە ئامادەین ئەمڕۆ گرێبەستەکە واژۆ بکەین" },
      { english: ["You", "must", "give", "thirty", "days", "notice", "before", "leaving"], kurdish: "دەبێت سی ڕۆژ پێشوەختە ئاگاداری بدەیت پێش چۆڵکردن" },
    ],
    fillBlanks: [
      { parts: ["Is the apartment fully", "or empty?"], hint: "ئایا شوقەکە بەتەواوی کەلوپەلی تێدایە یان بەتاڵە؟", answer: "furnished", wrongs: ["filled", "ready", "done"] },
      { parts: ["I need to pay the first month's rent and the security", "."], hint: "پێویستە کرێی مانگی یەکەم و پارەی بارمتەکە بدەم.", answer: "deposit", wrongs: ["money", "payment", "cash"] },
    ],
    conversations: [
      { situation: "سەیرکردنی شوقەیەک بۆ کرێکردن", theyAsk: "So, what do you think of the apartment?", correct: "It looks great, but I have a question. Are utilities included, or do I pay for electricity separately?", wrong1: "Does it have water and power free?", wrong2: "I want to know if I pay for lights.", wrong3: "Is electricity in the money?", explanation: "'Are utilities included?' پرسیارێکی زۆر ستانداردە کاتێک شوقەیەک بەکرێ دەگریت بۆ زانینی تێچووەکانی ئاو و کارەبا و هتد" },
    ],
  },

  // Lesson 2: Car Troubles & Mechanics
  {
    topic: "Car Troubles", topicKu: "کێشەی ئۆتۆمبێل",
    words: [
      { english: "My car broke down",    kurdish: "ئۆتۆمبێلەکەم پەکی کەوت" },
      { english: "Flat tire",            kurdish: "تایەی تەقیو / پەنجەر" },
      { english: "Making a weird noise", kurdish: "دەنگێکی سەیر دەردەکات" },
      { english: "Needs an oil change",  kurdish: "پێویستی بە گۆڕینی ڕۆنە" },
      { english: "Tow truck",            kurdish: "ئۆتۆمبێلی ڕاکێشان (کڕێن)" },
    ],
    voices: [
      { prompt: "پەیوەندیکردن بە فیتەرەوە", target: "My car broke down on the highway. I need a tow truck.", targetKurdish: "ئۆتۆمبێلەکەم لەسەر ڕێگا خێراکە پەکی کەوت. پێویستم بە ئۆتۆمبێلی ڕاکێشانە." },
      { prompt: "ڕوونکردنەوەی کێشەیەک", target: "The engine is making a weird noise when I start it.", targetKurdish: "بزوێنەرەکە دەنگێکی سەیر دەردەکات کاتێک ئیشی پێ دەکەم." },
    ],
    sentences: [
      { english: ["I", "have", "a", "flat", "tire", "and", "no", "spare"], kurdish: "تایەیەکم تەقیوە و یەدەگیشم پێ نییە" },
      { english: ["I", "think", "it", "needs", "an", "oil", "change", "soon"], kurdish: "پێم وایە بە زوویی پێویستی بە گۆڕینی ڕۆن هەیە" },
    ],
    fillBlanks: [
      { parts: ["My car", "down in the middle of nowhere."], hint: "ئۆتۆمبێلەکەم لە شوێنێکی چۆڵدا پەکی کەوت.", answer: "broke", wrongs: ["stopped", "died", "failed"] },
      { parts: ["The brakes are making a", "noise."], hint: "برێکەکان دەنگێکی سەیر دەردەکەن.", answer: "weird", wrongs: ["bad", "loud", "wrong"] },
    ],
    conversations: [
      { situation: "لە شوێنی چاککردنەوەی ئۆتۆمبێل (گەراج)", theyAsk: "What seems to be the problem with the vehicle?", correct: "It's making a weird noise when I brake, and I think it also needs an oil change.", wrong1: "Car goes squeak when stop.", wrong2: "Make sound bad and I want oil.", wrong3: "Fix the noise and change the oil.", explanation: "'Making a weird noise' باشترین ڕێگەیە بۆ وەسفکردنی کێشەیەک کە ناتوانیت دەستنیشانی بکەیت" },
    ],
  },

  // Lesson 3: Personal Finances
  {
    topic: "Personal Finances", topicKu: "دارایی کەسی",
    words: [
      { english: "Living paycheck to paycheck", kurdish: "ژیان بەسەربردن لە مووچە بۆ مووچە (بەبێ پاشەکەوت)" },
      { english: "Stick to a budget",    kurdish: "پابەندبوون بە بودجەوە (خەرجنەکردنی زیاتر لە سنوور)" },
      { english: "Pay off debt",         kurdish: "دانەوەی قەرز" },
      { english: "Cut back on expenses", kurdish: "کەمکردنەوەی خەرجییەکان" },
      { english: "Emergency fund",       kurdish: "سندووقی باری لەناکاو (پارەی پاشەکەوتکراو بۆ کاتی پێویست)" },
    ],
    voices: [
      { prompt: "باسکردنی کەمکردنەوەی خەرجی", target: "We need to cut back on expenses to save more money.", targetKurdish: "پێویستە خەرجییەکانمان کەم بکەینەوە بۆ ئەوەی پارەی زیاتر پاشەکەوت بکەین." },
      { prompt: "ئامانجی دارایی", target: "My goal this year is to pay off all my debt.", targetKurdish: "ئامانجی ئەمساڵم ئەوەیە هەموو قەرزەکانم بدەمەوە." },
    ],
    sentences: [
      { english: ["It's", "hard", "living", "paycheck", "to", "paycheck"], kurdish: "قورسە لە مووچە بۆ مووچە بژیت" },
      { english: ["I", "am", "trying", "to", "stick", "to", "a", "strict", "budget"], kurdish: "هەوڵدەدەم پابەند بم بە بودجەیەکی توندەوە" },
    ],
    fillBlanks: [
      { parts: ["Everyone should have an", "fund for unexpected costs."], hint: "هەموو کەسێک پێویستە سندووقی باری لەناکاوی هەبێت بۆ تێچووە چاوەڕواننەکراوەکان.", answer: "emergency", wrongs: ["extra", "save", "backup"] },
      { parts: ["I need to cut", "on eating out so much."], hint: "پێویستە نانخواردنی دەرەوە کەم بکەمەوە.", answer: "back", wrongs: ["down", "off", "out"] },
    ],
    conversations: [
      { situation: "قسەکردن لەگەڵ هاوڕێیەک دەربارەی پاشەکەوتکردن", theyAsk: "Do you want to go to that expensive concert next week?", correct: "I'd love to, but I'm trying to stick to a budget and pay off my debt. I really need to cut back on expenses.", wrong1: "I have no money, I am poor.", wrong2: "Concert is too much money for me.", wrong3: "I don't want to spend cash.", explanation: "'Stick to a budget' و 'cut back on expenses' ڕێگەیەکی زۆر مۆدێرن و باون بۆ باسکردنی ڕێکخستنی دارایی" },
    ],
  },

  // Lesson 4: Dealing with Authorities
  {
    topic: "Reporting to Authorities", topicKu: "مامەڵەکردن لەگەڵ دەسەڵات (پۆلیس/ئاسایش)",
    words: [
      { english: "I'd like to report",   kurdish: "دەمەوێت سکاڵا / ڕاپۆرت بکەم" },
      { english: "My wallet was stolen", kurdish: "جزدانەکەم دزراوە" },
      { english: "Fill out a form",      kurdish: "پڕکردنەوەی فۆڕمێک" },
      { english: "Provide a description", kurdish: "پێدانی وەسف (وەسفکردنی کەسێک یان شتێک)" },
      { english: "Lost and found",       kurdish: "بەشی ونبوو و دۆزراوە" },
    ],
    voices: [
      { prompt: "ڕاپۆرتدانی دزی", target: "I'd like to report a crime. My wallet was stolen.", targetKurdish: "دەمەوێت سکاڵا لەسەر تاوانێک بکەم. جزدانەکەم دزراوە." },
      { prompt: "بەشی ونبووەکان", target: "Did anyone turn in a bag to the lost and found?", targetKurdish: "ئایا کەس جانتایەکی ڕادەستی بەشی ونبوو و دۆزراوە کردووە؟" },
    ],
    sentences: [
      { english: ["You", "will", "need", "to", "fill", "out", "a", "report", "form"], kurdish: "پێویست دەکات فۆڕمێکی ڕاپۆرتکردن پڕ بکەیتەوە" },
      { english: ["Can", "you", "provide", "a", "description", "of", "the", "man"], kurdish: "دەتوانیت وەسفی پیاوەکە بکەیت؟" },
    ],
    fillBlanks: [
      { parts: ["My phone was", "on the train this morning."], hint: "مۆبایلەکەم دزرا لەسەر شەمەندەفەرەکە ئەم بەیانییە.", answer: "stolen", wrongs: ["robbed", "taken", "lost"] },
      { parts: ["Please fill", "this incident form."], hint: "تکایە ئەم فۆڕمی ڕووداوە پڕ بکەرەوە.", answer: "out", wrongs: ["in", "up", "down"] },
    ],
    conversations: [
      { situation: "لە بنکەی پۆلیس", theyAsk: "How can we assist you today?", correct: "I'd like to report a theft. My wallet was stolen while I was at the cafe.", wrong1: "Someone take my money.", wrong2: "I lost wallet. Find it.", wrong3: "Thief stole my bag.", explanation: "'I'd like to report a theft/crime' شێوازی دروستی قسەکردنە لەگەڵ پۆلیس" },
    ],
  },

  // Lesson 5: Parent-Teacher Meetings
  {
    topic: "Parent-Teacher Meetings", topicKu: "کۆبوونەوەی دایکوباوک و مامۆستا",
    words: [
      { english: "Falling behind",       kurdish: "دواکەوتن لە خوێندن (لاوازبوون)" },
      { english: "Paying attention",     kurdish: "سەرنجدان / ئاگاداربوون لە پۆل" },
      { english: "Room for improvement", kurdish: "بواری بەرەوپێشچوون ماوە" },
      { english: "Gets along well with", kurdish: "پەیوەندی باشە لەگەڵ (هاوڕێیەتیان دەکات)" },
      { english: "Reaching their potential", kurdish: "گەیشتن بەو ئاستەی کە توانای هەیە" },
    ],
    voices: [
      { prompt: "پرسیارکردن لە ئاستی منداڵ", target: "Is my son falling behind in math?", targetKurdish: "ئایا کوڕەکەم لە بیرکاریدا لاواز بووە و دواکەوتووە؟" },
      { prompt: "پەسەندکردنی هەڵسوکەوت", target: "She gets along well with the other children.", targetKurdish: "ئەو پەیوەندییەکی باشی هەیە لەگەڵ منداڵەکانی تردا." },
    ],
    sentences: [
      { english: ["He", "is", "smart", "but", "he", "needs", "to", "pay", "attention"], kurdish: "ئەو زیرەکە بەڵام پێویستە سەرنج بدات (گوێ بگرێت لە پۆل)" },
      { english: ["There", "is", "definitely", "room", "for", "improvement"], kurdish: "بێگومان هێشتا بواری بەرەوپێشچوون ماوە" },
    ],
    fillBlanks: [
      { parts: ["Your daughter gets", "very well with her classmates."], hint: "کچەکەت زۆر بەباشی هەڵدەکات لەگەڵ هاوپۆلەکانی.", answer: "along", wrongs: ["on", "with", "around"] },
      { parts: ["He is bright, but he is falling", "in reading."], hint: "ئەو زیرەکە، بەڵام لە خوێندنەوەدا دواکەوتووە.", answer: "behind", wrongs: ["back", "down", "off"] },
    ],
    conversations: [
      { situation: "قسەکردن لەگەڵ مامۆستای منداڵەکەت", theyAsk: "Do you have any specific concerns about Leo's progress?", correct: "Yes, I'm worried he might be falling behind in Science. Is he paying attention in class?", wrong1: "Is he bad at science?", wrong2: "Why he don't study science?", wrong3: "Does he sleep in class?", explanation: "'Falling behind' و 'paying attention' زاراوەی پەروەردەیی زۆر باون لەم کۆبوونەوانەدا" },
    ],
  },

  // Lesson 6: At the Salon / Barbershop
  {
    topic: "Salon & Barbershop", topicKu: "لە سەرتاشخانە و ساڵۆن",
    words: [
      { english: "Just a trim",          kurdish: "تەنها کەمێک کورتکردنەوە (بۆ ڕێکخستن)" },
      { english: "Take a little off the top", kurdish: "کەمێک لە سەرەوەی کورت بکەرەوە" },
      { english: "Dye my hair",          kurdish: "قژم بۆیە بکەم" },
      { english: "Layers",               kurdish: "بڕینی قژ بە شێوەی چین چین (مدرج)" },
      { english: "Fade on the sides",    kurdish: "سووککردنی قژ لە تەنیشتەکان (تەدروج)" },
    ],
    voices: [
      { prompt: "داواکردنی ڕێکخستنی قژ", target: "I don't want it too short, just a trim please.", targetKurdish: "نامەوێت زۆر کورت بێت، تەنها کەمێک ڕێکی بخە تکایە." },
      { prompt: "مۆدێلی پیاوانە", target: "Can you give me a fade on the sides and take a little off the top?", targetKurdish: "دەتوانیت تەنیشتەکانی بۆ سووک بکەیت و کەمێکیش لە سەرەوەی کورت بکەیتەوە؟" },
    ],
    sentences: [
      { english: ["I", "would", "like", "to", "dye", "my", "hair", "brown"], kurdish: "حەز دەکەم قژم بۆیە بکەم بە قاوەیی" },
      { english: ["Could", "you", "add", "some", "layers", "in", "the", "back"], kurdish: "دەتوانیت لە دواوە بە شێوەی چین چین بیبڕیت؟" },
    ],
    fillBlanks: [
      { parts: ["I just want a", ", nothing too crazy."], hint: "تەنها ڕێکخستنێک (کەمێک کورتکردنەوەم) دەوێت، شتێکی زۆر سەیر نا.", answer: "trim", wrongs: ["cut", "chop", "style"] },
      { parts: ["Keep the length, but add some", "for volume."], hint: "درێژییەکەی بهێڵەرەوە، بەڵام کەمێک چین چینی (مدرج) تێ بکە بۆ ئەوەی پڕتر دەربکەوێت.", answer: "layers", wrongs: ["steps", "parts", "lines"] },
    ],
    conversations: [
      { situation: "لەلای سەرتاشەکەت دانیشتوویت", theyAsk: "So, what are we doing today? A completely new style?", correct: "No, keep the length. Just a trim, and maybe take a little off the top. I like the current style.", wrong1: "Don't cut too much.", wrong2: "Make it small cut.", wrong3: "I want small hair.", explanation: "'Just a trim' و 'take a little off the top' باوترین دەستەواژەی سەرتاشخانەکانن" },
    ],
  },

  // Lesson 7: Home Repairs
  {
    topic: "Home Repairs", topicKu: "چاککردنەوەی ماڵ (کارەبا/بۆری)",
    words: [
      { english: "The pipe is leaking",  kurdish: "بۆرییەکە دڵۆپە دەکات" },
      { english: "Power outage",         kurdish: "بڕانی کارەبا" },
      { english: "Clogged drain",        kurdish: "گیرانی ئاوەڕۆ" },
      { english: "Short circuit",        kurdish: "شۆرتی کارەبا" },
      { english: "Give me an estimate",  kurdish: "خەمڵاندنێکم بۆ بکە (بۆ نرخەکە)" },
    ],
    voices: [
      { prompt: "کێشەی بۆری ئاو", target: "The pipe under the sink is leaking. We need a plumber.", targetKurdish: "بۆری ژێر مەغسەلەکە دڵۆپە دەکات. پێویستمان بە بۆریچییەکە." },
      { prompt: "داوای نرخی خەمڵێنراو", target: "Can you give me an estimate for the repairs?", targetKurdish: "دەتوانیت خەمڵاندنێکم بۆ بکەیت بۆ نرخەی چاککردنەوەکە؟" },
    ],
    sentences: [
      { english: ["The", "drain", "is", "clogged", "and", "water", "won't", "go", "down"], kurdish: "ئاوەڕۆکە گیراوە و ئاوەکە ناڕوات" },
      { english: ["I", "think", "there", "was", "a", "short", "circuit", "in", "the", "wall"], kurdish: "پێم وایە شۆرتی کارەبا هەبوو لە دیوارەکەدا" },
    ],
    fillBlanks: [
      { parts: ["Can you give me a rough", "of the cost?"], hint: "دەتوانیت خەمڵاندنێکی زبری (گشتی) تێچووەکەم پێ بدەیت؟", answer: "estimate", wrongs: ["price", "guess", "number"] },
      { parts: ["The sink is", ", the water won't drain."], hint: "مەغسەلەکە گیراوە، ئاوەکە بەتاڵ نابێتەوە.", answer: "clogged", wrongs: ["stuck", "blocked", "closed"] },
    ],
    conversations: [
      { situation: "تەلەفۆن بۆ کارەباچییەک دەکەیت", theyAsk: "What seems to be the issue with the electricity?", correct: "Half the house has a power outage. I think there was a short circuit. Can you give me an estimate before coming?", wrong1: "No electricity in house.", wrong2: "Lights went boom. Tell me price.", wrong3: "Fix my wires. How much?", explanation: "'Power outage'، 'short circuit'، و 'estimate' وشەی زۆر پێویستن بۆ مامەڵەکردن لەگەڵ وەستاکان" },
    ],
  },

  // Lesson 8: Returning Defective Items
  {
    topic: "Returns & Refunds", topicKu: "گەڕاندنەوە و وەرگرتنەوەی پارە",
    words: [
      { english: "It's defective",       kurdish: "کەموکوڕی تێدایە (خراپە)" },
      { english: "I'd like a refund",    kurdish: "دەمەوێت پارەکەم وەربگرمەوە" },
      { english: "Do you have the receipt", kurdish: "ئایا پسووڵەکەت (وەسڵەکەت) پێیە؟" },
      { english: "Exchange it for",      kurdish: "بیگۆڕمەوە بە..." },
      { english: "Under warranty",       kurdish: "لەژێر زەمانەتدایە" },
    ],
    voices: [
      { prompt: "گەڕاندنەوەی شتێکی خراپ", target: "I bought this yesterday, but it's defective. I'd like a refund.", targetKurdish: "دوێنێ ئەمەم کڕی، بەڵام کەموکوڕی تێدایە. دەمەوێت پارەکەم وەربگرمەوە." },
      { prompt: "گۆڕینەوەی کاڵایەک", target: "Can I exchange this for a larger size?", targetKurdish: "دەتوانم ئەمە بگۆڕمەوە بە قەبارەیەکی گەورەتر؟" },
    ],
    sentences: [
      { english: ["Do", "you", "still", "have", "the", "original", "receipt"], kurdish: "ئایا هێشتا پسووڵە ڕەسەنەکەت پێیە؟" },
      { english: ["The", "laptop", "is", "still", "under", "warranty", "right"], kurdish: "لاپتۆپەکە هێشتا لەژێر زەمانەتدایە، ڕاستە؟" },
    ],
    fillBlanks: [
      { parts: ["This screen is broken. It's completely", "."], hint: "ئەم شاشەیە شکاوە. بەتەواوی کەموکوڕی تێدایە (خراپە).", answer: "defective", wrongs: ["bad", "wrong", "fault"] },
      { parts: ["I'd like a full", "to my credit card."], hint: "دەمەوێت بەتەواوی پارەکەم بۆ بگەڕێندرێتەوە سەر کارتی بانکییەکەم.", answer: "refund", wrongs: ["return", "money", "back"] },
    ],
    conversations: [
      { situation: "گەڕاندنەوەی تەلەڤیزیۆنێک بۆ فرۆشگاکە", theyAsk: "Is there something wrong with the item?", correct: "Yes, it's defective. The screen doesn't turn on. I have the receipt and it's under warranty. I'd like a refund.", wrong1: "TV is broken. Give my money.", wrong2: "It not work. Take it back.", wrong3: "I want refund because bad TV.", explanation: "'Defective', 'receipt', 'warranty', و 'refund' چوار وشەی ئاڵتوونین بۆ گەڕاندنەوەی کاڵا لە دەرەوەی وڵات" },
    ],
  },

  // Lesson 9: Job Perks & HR
  {
    topic: "Human Resources (HR)", topicKu: "سەرچاوە مرۆییەکان و ئیمتیازاتی کار",
    words: [
      { english: "Paid time off",        kurdish: "مۆڵەتی بە پارە (پشوو کە مووچەی لەگەڵدایە)" },
      { english: "Health benefits",      kurdish: "ئیمتیازاتی تەندروستی (دڵنیایی)" },
      { english: "Performance review",   kurdish: "هەڵسەنگاندنی ئاستی کارکردن" },
      { english: "Call in sick",         kurdish: "پەیوەندیکردن بۆ وەرگرتنی مۆڵەتی نەخۆشی" },
      { english: "Maternity leave",      kurdish: "مۆڵەتی دایکایەتی (بۆ منداڵبوون)" },
    ],
    voices: [
      { prompt: "پرسین لە مۆڵەت", target: "How many days of paid time off do we get a year?", targetKurdish: "ساڵانە چەند ڕۆژ مۆڵەتی بە پارەمان هەیە؟" },
      { prompt: "وەرگرتنی مۆڵەتی نەخۆشی", target: "I'm not feeling well. I need to call in sick today.", targetKurdish: "هەست بە باشی ناکەم. پێویستە ئەمڕۆ تەلەفۆن بکەم و مۆڵەتی نەخۆشی وەربگرم." },
    ],
    sentences: [
      { english: ["She", "is", "currently", "on", "maternity", "leave", "until", "June"], kurdish: "ئەو لە ئێستادا لە مۆڵەتی دایکایەتیدایە تاوەکو مانگی حوزەیران" },
      { english: ["We", "have", "excellent", "health", "benefits", "at", "this", "company"], kurdish: "لەم کۆمپانیایەدا ئیمتیازاتی تەندروستی نایابمان هەیە" },
    ],
    fillBlanks: [
      { parts: ["I have the flu, so I have to", "in sick today."], hint: "ئەنفلۆنزام هەیە، بۆیە دەبێت ئەمڕۆ پەیوەندی بکەم بۆ مۆڵەتی نەخۆشی.", answer: "call", wrongs: ["tell", "say", "take"] },
      { parts: ["We will discuss your salary during your performance", "."], hint: "گفتوگۆ لەسەر مووچەکەت دەکەین لە کاتی هەڵسەنگاندنی ئاستی کارکردنەکەتدا.", answer: "review", wrongs: ["check", "talk", "meeting"] },
    ],
    conversations: [
      { situation: "چاوپێکەوتن لەگەڵ بەشی HR بۆ زانینی ئیمتیازاتەکان", theyAsk: "Do you have any questions about the benefits package?", correct: "Yes. Could you explain the health benefits and how much paid time off is offered?", wrong1: "How many days I sleep at home with money?", wrong2: "Do you pay when I am sick?", wrong3: "I want to know about doctor money.", explanation: "'Paid time off' (PTO) و 'Health benefits' زاراوەی فەرمی و زۆر گرنگن لە هەر گرێبەستێکی کارکردندا" },
    ],
  },

];

export default normalUnit04;
