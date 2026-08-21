import { UnitBank } from "../types";

// ── Unit 4: Specialized Daily Encounters — 10 unique lessons ──────────
// Practical vocabulary and phrasing for specific situations like banking, renting, and repairs.

const normalUnit04: UnitBank = [

  // Lesson 0: At the Bank
  {
    topic: "At the Bank", topicKu: "لە بانک", topicAr: "في البنك",
    words: [
      { english: "Open an account",      kurdish: "کردنەوەی هەژمار (حیساب)", arabic: "فتح حساب" },
      { english: "Transfer money",       kurdish: "حەواڵەکردنی پارە", arabic: "تحويل الأموال" },
      { english: "Interest rate",        kurdish: "ڕێژەی سوود", arabic: "سعر الفائدة" },
      { english: "Make a deposit",       kurdish: "خستنە سەر هەژمار (ئیداع)", arabic: "إيداع الأموال" },
      { english: "Withdraw cash",        kurdish: "ڕاکێشانی پارە (بە کاش)", arabic: "سحب النقود" },
    ],
    voices: [
      { prompt: "کردنەوەی هەژمارێکی نوێ", target: "I would like to open a savings account, please.", targetKurdish: "دەمەوێت هەژمارێکی پاشەکەوت بکەمەوە، تکایە.", promptAr: "فتح حساب جديد", targetArabic: "أود فتح حساب توفير، من فضلك." },
      { prompt: "حەواڵەکردنی پارە", target: "I need to transfer some money to another account.", targetKurdish: "پێویستە کەمێک پارە حەواڵەی هەژمارێکی تر بکەم.", promptAr: "تحويل الأموال", targetArabic: "أحتاج إلى تحويل بعض الأموال إلى حساب آخر." },
    ],
    sentences: [
      { english: ["Can", "I", "make", "a", "deposit", "into", "my", "account"], kurdish: "دەتوانم پارە بخەمە سەر هەژمارەکەم؟", arabic: "هل يمكنني إيداع الأموال في حسابي؟" },
      { english: ["What", "is", "the", "interest", "rate", "for", "a", "loan"], kurdish: "ڕێژەی سوود بۆ قەرزێک چەندە؟", arabic: "ما هو سعر الفائدة للقرض؟" },
    ],
    fillBlanks: [
      { parts: ["I need to", "some cash from the ATM."], hint: "پێویستە کەمێک پارە (بە کاش) لە ئامێری ئەی تی ئێم ڕابکێشم.", answer: "withdraw", wrongs: ["take", "get", "pull"], arabicHint: "أحتاج إلى سحب بعض النقود من ماكينة الصراف الآلي.", arabicParts: ["أحتاج إلى","بعض النقود من ماكينة الصراف الآلي."], arabicAnswer: "سحب", arabicWrongs: ["أخذ","حصول","جر"] },
      { parts: ["I want to", "a new checking account."], hint: "دەمەوێت هەژمارێکی نوێی جاری بکەمەوە.", answer: "open", wrongs: ["make", "start", "create"], arabicHint: "أريد فتح حساب جاري جديد.", arabicParts: ["أريد","حساب جاري جديد."], arabicAnswer: "فتح", arabicWrongs: ["صنع","بدء","إنشاء"] },
    ],
    conversations: [
      { situation: "چوونە بانک بۆ ڕاکێشانی پارە", theyAsk: "How can I help you today, sir?", correct: "I would like to withdraw five hundred dollars from my savings account, please.", wrong1: "Give me 500 dollars from my money.", wrong2: "I want to take cash from my save.", wrong3: "I need to pull 500 dollars out.", explanation: "'Withdraw' وشەی فەرمی و دروستە بۆ ڕاکێشانی پارە لە بانک", situationAr: "الذهاب إلى البنك لسحب الأموال", explanationAr: "'Withdraw' هي الكلمة الرسمية والصحيحة لسحب الأموال من البنك." },
    ],
  },

  // Lesson 1: Renting an Apartment
  {
    topic: "Renting an Apartment", topicKu: "کرێکردنی شوقە", topicAr: "استئجار شقة",
    words: [
      { english: "Sign the lease",       kurdish: "واژۆکردنی گرێبەستی کرێ", arabic: "توقع عقد الإيجار" },
      { english: "Security deposit",     kurdish: "پارەی بارمتە (تەئمینات)", arabic: "تأمين الإيجار" },
      { english: "Are utilities included", kurdish: "ئایا خزمەتگوزارییەکان (ئاو/کارەبا) لەگەڵدایە؟", arabic: "الخدمات داخلة بالسعر؟" },
      { english: "Fully furnished",      kurdish: "ئەساسی تێدایە (موئەسەس)", arabic: "مفروشة كامل" },
      { english: "Give notice",          kurdish: "ئاگادارکردنەوەی پێشوەختە (بۆ چۆڵکردن)", arabic: "تنطي خبر من وكت" },
    ],
    voices: [
      { prompt: "پرسین لە خزمەتگوزارییەکان", target: "Are utilities like water and electricity included in the rent?", targetKurdish: "ئایا خزمەتگوزارییەکانی وەک ئاو و کارەبا لە نرخی کرێیەکەدا هەژمار کراون؟", promptAr: "تسأل عن الخدمات", targetArabic: "الخدمات مثل المي والكهرباء مشمولة بالإيجار؟" },
      { prompt: "پێدانی بارمتە", target: "How much is the security deposit for this apartment?", targetKurdish: "پارەی بارمتە بۆ ئەم شوقەیە چەندە؟", promptAr: "دفع التأمين", targetArabic: "شكد مبلغ تأمين هاي الشقة؟" },
    ],
    sentences: [
      { english: ["We", "are", "ready", "to", "sign", "the", "lease", "today"], kurdish: "ئێمە ئامادەین ئەمڕۆ گرێبەستەکە واژۆ بکەین", arabic: "احنة جاهزين نوقع عقد الإيجار اليوم" },
      { english: ["You", "must", "give", "thirty", "days", "notice", "before", "leaving"], kurdish: "دەبێت سی ڕۆژ پێشوەختە ئاگاداری بدەیت پێش چۆڵکردن", arabic: "لازم تنطي اشعار قبل ثلاثين يوم من تطلع" },
    ],
    fillBlanks: [
      { parts: ["Is the apartment fully", "or empty?"], hint: "ئایا شوقەکە بەتەواوی کەلوپەلی تێدایە یان بەتاڵە؟", answer: "furnished", wrongs: ["filled", "ready", "done"], arabicHint: "الشقة مفروشة كامل لو فارغة؟", arabicParts: ["الشقة","كامل لو فارغة؟"], arabicAnswer: "مفروشة", arabicWrongs: ["مليانة","جاهزة","خلصت"] },
      { parts: ["I need to pay the first month's rent and the security", "."], hint: "پێویستە کرێی مانگی یەکەم و پارەی بارمتەکە بدەم.", answer: "deposit", wrongs: ["money", "payment", "cash"], arabicHint: "احتاج ادفع إيجار الشهر الأول ومبلغ التأمين.", arabicParts: ["احتاج ادفع إيجار الشهر الأول ومبلغ","."], arabicAnswer: "التأمين", arabicWrongs: ["المال","الدفع","النقد"] },
    ],
    conversations: [
      { situation: "سەیرکردنی شوقەیەک بۆ کرێکردن", theyAsk: "So, what do you think of the apartment?", correct: "It looks great, but I have a question. Are utilities included, or do I pay for electricity separately?", wrong1: "Does it have water and power free?", wrong2: "I want to know if I pay for lights.", wrong3: "Is electricity in the money?", explanation: "'Are utilities included?' پرسیارێکی زۆر ستانداردە کاتێک شوقەیەک بەکرێ دەگریت بۆ زانینی تێچووەکانی ئاو و کارەبا و هتد", situationAr: "تشوف شقة للإيجار", explanationAr: "'Are utilities included?' سؤال معتاد كلش لمن تأجر شقة حتى تعرف تكاليف المي والكهرباء." },
    ],
  },

  // Lesson 2: Car Troubles & Mechanics
  {
    topic: "Car Troubles", topicKu: "کێشەی ئۆتۆمبێل", topicAr: "مشاكل السيارة",
    words: [
      { english: "My car broke down",    kurdish: "ئۆتۆمبێلەکەم پەکی کەوت", arabic: "سيارتي خربانة" },
      { english: "Flat tire",            kurdish: "تایەی تەقیو / پەنجەر", arabic: "بنشر" },
      { english: "Making a weird noise", kurdish: "دەنگێکی سەیر دەدات", arabic: "يطلع صوت غريب" },
      { english: "Needs an oil change",  kurdish: "پێویستی بە گۆڕینی ڕۆنە", arabic: "يحتاج تغيير دهن" },
      { english: "Tow truck",            kurdish: "ئۆتۆمبێلی ڕاکێشان (کڕێن)", arabic: "ونش" },
    ],
    voices: [
      { prompt: "پەیوەندیکردن بە فیتەرەوە", target: "My car broke down on the highway. I need a tow truck.", targetKurdish: "ئۆتۆمبێلەکەم لەسەر ڕێگا خێراکە پەکی کەوت. پێویستم بە ئۆتۆمبێلی ڕاکێشانە.", promptAr: "تتصل بالميكانيكي", targetArabic: "سيارتي خربانة على الطريق السريع. احتاج ونش." },
      { prompt: "ڕوونکردنەوەی کێشەیەک", target: "The engine is making a weird noise when I start it.", targetKurdish: "بزوێنەرەکە دەنگێکی سەیر دەردەکات کاتێک ئیشی پێ دەکەم.", promptAr: "شرح مشكلة", targetArabic: "المحرك يطلع صوت غريب من اشغله." },
    ],
    sentences: [
      { english: ["I", "have", "a", "flat", "tire", "and", "no", "spare"], kurdish: "تایەیەکم تەقیوە و یەدەگیشم پێ نییە", arabic: "عندي بنشر وما عندي سبير" },
      { english: ["I", "think", "it", "needs", "an", "oil", "change", "soon"], kurdish: "پێم وایە بە زوویی پێویستی بە گۆڕینی ڕۆن هەیە", arabic: "عبالي تحتاج تغيير دهن عن قريب" },
    ],
    fillBlanks: [
      { parts: ["My car", "down in the middle of nowhere."], hint: "ئۆتۆمبێلەکەم لە شوێنێکی چۆڵدا پەکی کەوت.", answer: "broke", wrongs: ["stopped", "died", "failed"], arabicHint: "سيارتي خربت بمكان مقطوع.", arabicParts: ["سيارتي","بمكان مقطوع."], arabicAnswer: "خربت", arabicWrongs: ["وكفت","ماتت","فشلت"] },
      { parts: ["The brakes are making a", "noise."], hint: "برێکەکان دەنگێکی سەیر دەردەکەن.", answer: "weird", wrongs: ["bad", "loud", "wrong"], arabicHint: "البريكات تطلع صوت غريب.", arabicParts: ["البريكات تطلع صوت","."], arabicAnswer: "غريب", arabicWrongs: ["سيء","عالي","غلط"] },
    ],
    conversations: [
      { situation: "لە شوێنی چاککردنەوەی ئۆتۆمبێل (گەراج)", theyAsk: "What seems to be the problem with the vehicle?", correct: "It's making a weird noise when I brake, and I think it also needs an oil change.", wrong1: "Car goes squeak when stop.", wrong2: "Make sound bad and I want oil.", wrong3: "Fix the noise and change the oil.", explanation: "'Making a weird noise' باشترین ڕێگەیە بۆ وەسفکردنی کێشەیەک کە ناتوانیت دەستن��شانی بکەیت", situationAr: "في ورشة تصليح السيارات (الكراج)", explanationAr: "'Making a weird noise' هي أحسن طريقة توصف بيها مشكلة ما تكدر تحددها." },
    ],
  },

  // Lesson 3: Personal Finances
  {
    topic: "Personal Finances", topicKu: "دارایی کەسی", topicAr: "المالية الشخصية",
    words: [
      { english: "Living paycheck to paycheck", kurdish: "ژیان بەسەربردن لە مووچە بۆ مووچە (هیچ نامێنێتەوە)", arabic: "تعيش من راتب لراتب" },
      { english: "Stick to a budget",    kurdish: "پابەندبوون بە بودجەوە (خەرجنەکردنی زیاتر لە سنوور)", arabic: "تلتزم بالميزانية" },
      { english: "Pay off debt",         kurdish: "دانەوەی قەرز", arabic: "تسدد ديونك" },
      { english: "Cut back on expenses", kurdish: "کەمکردنەوەی خەرجییەکان", arabic: "تقلل المصاريف" },
      { english: "Emergency fund",       kurdish: "سندووقی باری لەناکاو (پارەی پاشەکەوتکراو بۆ کاتی پێویست)", arabic: "مبلغ للطوارئ" },
    ],
    voices: [
      { prompt: "باسکردنی کەمکردنەوەی خەرجی", target: "We need to cut back on expenses to save more money.", targetKurdish: "پێویستە خەرجییەکانمان کەم بکەینەوە بۆ ئەوەی پارەی زیاتر پاشەکەوت بکەین.", promptAr: "تحچي عن تقليل المصاريف", targetArabic: "نحتاج نقلل المصاريف حتى نوفر فلوس اكثر." },
      { prompt: "ئامانجی دارایی", target: "My goal this year is to pay off all my debt.", targetKurdish: "ئامانجی ئەمساڵم ئەوەیە هەموو قەرزەکانم بدەمەوە.", promptAr: "هدف مالي", targetArabic: "هدفي هالسنة اخلص كل ديوني." },
    ],
    sentences: [
      { english: ["It's", "hard", "living", "paycheck", "to", "paycheck"], kurdish: "قورسە لە مووچە بۆ مووچە بژیت", arabic: "صعبة تعيش من راتب لراتب" },
      { english: ["I", "am", "trying", "to", "stick", "to", "a", "strict", "budget"], kurdish: "هەوڵدەدەم پابەند بم بە بودجەیەکی توندەوە", arabic: "احاول التزم بميزانية صارمة" },
    ],
    fillBlanks: [
      { parts: ["Everyone should have an", "fund for unexpected costs."], hint: "هەموو کەسێک پێویستە سندووقی ��اری لەناکاوی هەبێت بۆ تێچووە چاوەڕواننەکراوەکان.", answer: "emergency", wrongs: ["extra", "save", "backup"], arabicHint: "لازم يكون عند الكل مبلغ للطوارئ للمصاريف اللي ما تتوقعها.", arabicParts: ["لازم يكون عند الكل مبلغ","للمصاريف اللي ما تتوقعها."], arabicAnswer: "طوارئ", arabicWrongs: ["إضافي","توفير","احتياطي"] },
      { parts: ["I need to cut", "on eating out so much."], hint: "پێویستە نانخواردنی دەرەوە کەم بکەمەوە.", answer: "back", wrongs: ["down", "off", "out"], arabicHint: "احتاج اقلل من الأكل بره هواية.", arabicParts: ["احتاج","من الأكل بره هواية."], arabicAnswer: "اقلل", arabicWrongs: ["انزل","اوقف","اقطع"] },
    ],
    conversations: [
      { situation: "قسەکردن لەگەڵ هاوڕێیەک دەربارەی پاشەکەوتکردن", theyAsk: "Do you want to go to that expensive concert next week?", correct: "I'd love to, but I'm trying to stick to a budget and pay off my debt. I really need to cut back on expenses.", wrong1: "I have no money, I am poor.", wrong2: "Concert is too much money for me.", wrong3: "I don't want to spend cash.", explanation: "'Stick to a budget' و 'cut back on expenses' ڕێگەیەکی زۆر مۆدێرن و باون بۆ باسکردنی ڕێکخستنی دارایی", situationAr: "تحچي ويه صاحبك عن التوفير", explanationAr: "'Stick to a budget' و 'cut back on expenses' طريقتين حديثة ومنتشرة كلش للحچي عن تنظيم الفلوس." },
    ],
  },

  // Lesson 4: Dealing with Authorities
  {
    topic: "Reporting to Authorities", topicKu: "مامەڵەکردن ل��گەڵ دەسەڵات (پۆلیس/ئاسایش)", topicAr: "الإبلاغ عن السلطات",
    words: [
      { english: "I'd like to report",   kurdish: "دەمەوێت سکاڵا / ڕاپۆرت بکەم", arabic: "اريد ابلغ عن" },
      { english: "My wallet was stolen", kurdish: "جزدانەکەم دزراوە", arabic: "انباكت محفظتي" },
      { english: "Fill out a form",      kurdish: "پڕکردنەوەی فۆڕمێک", arabic: "تملي استمارة" },
      { english: "Provide a description", kurdish: "پێدانی وەسف (وەسفکردنی کەسێک یان شتێک)", arabic: "تنطي مواصفات" },
      { english: "Lost and found",       kurdish: "بەشی ونبوو و دۆزراوە", arabic: "المفقودات" },
    ],
    voices: [
      { prompt: "ڕاپۆرتدانی دزی", target: "I'd like to report a crime. My wallet was stolen.", targetKurdish: "دەمەوێت سکاڵا لەسەر تاوانێک بکەم. جزدانەکەم دزراوە.", promptAr: "تبلغ عن سرقة", targetArabic: "اريد ابلغ عن جريمة. انباكت محفظتي." },
      { prompt: "بەشی ونبووەکان", target: "Did anyone turn in a bag to the lost and found?", targetKurdish: "ئایا کەس جانتایەکی ڕادەستی بەشی ونبوو و دۆزراوە کردووە؟", promptAr: "قسم المفقودات", targetArabic: "اكو احد سلم جنطة لقسم المفقودات؟" },
    ],
    sentences: [
      { english: ["You", "will", "need", "to", "fill", "out", "a", "report", "form"], kurdish: "پێویست دەکات فۆڕمێکی ڕاپۆرتکردن پڕ بکەیتەوە", arabic: "راح تحتاج تملي استمارة بلاغ" },
      { english: ["Can", "you", "provide", "a", "description", "of", "the", "man"], kurdish: "دەتوانیت وەسفی پیاوەکە بکەیت؟", arabic: "تكدر توصفلي الرجال؟" },
    ],
    fillBlanks: [
      { parts: ["My phone was", "on the train this morning."], hint: "مۆبایلەکەم دزرا لەسەر شەمەندەفەرەکە ئەم بەیانییە.", answer: "stolen", wrongs: ["robbed", "taken", "lost"], arabicHint: "انباك تليفوني بالقطار هذا الصباح.", arabicParts: ["تليفوني","بالقطار هذا الصباح."], arabicAnswer: "انباك", arabicWrongs: ["انسرق","انأخذ","ضاع"] },
      { parts: ["Please fill", "this incident form."], hint: "تکایە ئەم فۆڕمی ڕووداوە پڕ بکەرەوە.", answer: "out", wrongs: ["in", "up", "down"], arabicHint: "بلا زحمة املي استمارة الحادث هاي.", arabicParts: ["بلا زحمة","استمارة الحادث هاي."], arabicAnswer: "املي", arabicWrongs: ["ادخال","رفع","تنزيل"] },
    ],
    conversations: [
      { situation: "لە بنکەی پۆلیس", theyAsk: "How can we assist you today?", correct: "I'd like to report a theft. My wallet was stolen while I was at the cafe.", wrong1: "Someone take my money.", wrong2: "I lost wallet. Find it.", wrong3: "Thief stole my bag.", explanation: "'I'd like to report a theft/crime' شێوازی دروستی قسەکردنە لەگەڵ پۆلیس", situationAr: "بمركز الشرطة", explanationAr: "'I'd like to report a theft/crime' هي الطريقة الصحيحة حتى تحچي وية الشرطة." },
    ],
  },

  // Lesson 5: Parent-Teacher Meetings
  {
    topic: "Parent-Teacher Meetings", topicKu: "کۆبوونەوەی دایکوباوک و مامۆستا", topicAr: "اجتماعات أولياء الأمور والمعلمين",
    words: [
      { english: "Falling behind",       kurdish: "دواکەوتن لە خوێندن (لاوازبوون)", arabic: "متأخر بالدراسة" },
      { english: "Paying attention",     kurdish: "سەرنجدان / ئاگاداربوون لە پۆل", arabic: "ينتبه بالصف" },
      { english: "Room for improvement", kurdish: "هێشتا بواری بەرەوپێشچوونی هەیە", arabic: "يكدر يتحسن بعد" },
      { english: "Gets along well with", kurdish: "پەیوەندی باشە لەگەڵ (هاوڕێیەتیان دەکات)", arabic: "يتوالم زين وية" },
      { english: "Reaching their potential", kurdish: "گەیشتن بەو ئاستەی کە توانای هەیە", arabic: "يوصلون لمستواهم الحقيقي" },
    ],
    voices: [
      { prompt: "پرسیارکردن لە ئاستی منداڵ", target: "Is my son falling behind in math?", targetKurdish: "ئایا کوڕەکەم لە بیرکاریدا لاواز بووە و دواکەوتووە؟", promptAr: "تسأل عن مستوى الطفل", targetArabic: "ابني متأخر بالرياضيات؟" },
      { prompt: "پەسەندکردنی هەڵسوکەوت", target: "She gets along well with the other children.", targetKurdish: "ئەو پەیوەندییەکی باشی هەیە لەگەڵ منداڵەکانی تردا.", promptAr: "تمدح السلوك", targetArabic: "هي تتوالم زين وية الجهال الباقين." },
    ],
    sentences: [
      { english: ["He", "is", "smart", "but", "he", "needs", "to", "pay", "attention"], kurdish: "ئەو زیرەکە بەڵام پێویستە سەرنج بدات (گوێ بگرێت لە پۆل)", arabic: "هو ذكي بس يحتاج ينتبه" },
      { english: ["There", "is", "definitely", "room", "for", "improvement"], kurdish: "بێگومان هێشتا بواری بەرەوپێشچوون ماوە", arabic: "اكيد يكدر يتحسن بعد" },
    ],
    fillBlanks: [
      { parts: ["Your daughter gets", "very well with her classmates."], hint: "کچەکەت زۆر بەباشی هەڵدەکات لەگەڵ هاوپۆلەکانی.", answer: "along", wrongs: ["on", "with", "around"], arabicHint: "بنتك تتوالم زين وية زملائها بالصف.", arabicParts: ["بنتك","زين وية زملائها بالصف."], arabicAnswer: "تتوالم", arabicWrongs: ["تستمر","مع","حول"] },
      { parts: ["He is bright, but he is falling", "in reading."], hint: "ئەو زیرەکە، بەڵام لە خوێندنەوەدا دواکەوتووە.", answer: "behind", wrongs: ["back", "down", "off"], arabicHint: "هو ذكي، بس متأخر بالقراءة.", arabicParts: ["هو ذكي، بس","بالقراءة."], arabicAnswer: "متأخر", arabicWrongs: ["يرجع","ينزل","يوكع"] },
    ],
    conversations: [
      { situation: "قسەکردن لەگەڵ مامۆستای منداڵەکەت", theyAsk: "Do you have any specific concerns about Leo's progress?", correct: "Yes, I'm worried he might be falling behind in Science. Is he paying attention in class?", wrong1: "Is he bad at science?", wrong2: "Why he don't study science?", wrong3: "Does he sleep in class?", explanation: "'Falling behind' و 'paying attention' زاراوەی پەروەردەیی زۆر باون لەم کۆبوونەوانەدا", situationAr: "تحچي وية معلم طفلك", explanationAr: "'Falling behind' و 'paying attention' مصطلحات مال مدارس كلش شائعة بهاي الاجتماعات." },
    ],
  },

  // Lesson 6: At the Salon / Barbershop
  {
    topic: "Salon & Barbershop", topicKu: "لە سەرتاشخانە و ساڵۆن", topicAr: "في ��لصالون / صالون الحلاقة",
    words: [
      { english: "Just a trim",          kurdish: "تەنها کەمێک کورتکردنەوە (بۆ ڕێکخستن)", arabic: "زيان خفيف" },
      { english: "Take a little off the top", kurdish: "کەمێک لە سەرەوەی کورت بکەرەوە", arabic: "اخذ شوية من فوك" },
      { english: "Dye my hair",          kurdish: "قژم بۆیە بکەم", arabic: "اصبغ شعري" },
      { english: "Layers",               kurdish: "بڕینی قژ بە شێوەی چین چین (مدرج)", arabic: "مدرج" },
      { english: "Fade on the sides",    kurdish: "سووککردنی قژ لە تەنیشتەکان (تەدروج)", arabic: "تدرج من الصفاح" },
    ],
    voices: [
      { prompt: "داواکردنی ڕێکخستنی قژ", target: "I don't want it too short, just a trim please.", targetKurdish: "نامەوێت زۆر کورت بێت، تەنها کەمێک ڕێکی بخە تکایە.", promptAr: "تطلب تعديل الشعر", targetArabic: "ما اريده كلش قصير، بس خفيف بلا زحمة." },
      { prompt: "مۆدێلی پیاوانە", target: "Can you give me a fade on the sides and take a little off the top?", targetKurdish: "دەتوانیت تەنیشتەکانی بۆ سووک بکەیت و کەمێکیش لە سەرەوەی کورت بکەیتەوە؟", promptAr: "زيان رجالي", targetArabic: "تكدر تسويلي تدرج من الصفاح وتاخذ شوية من فوك؟" },
    ],
    sentences: [
      { english: ["I", "would", "like", "to", "dye", "my", "hair", "brown"], kurdish: "حەز دەکەم قژم بۆیە بکەم بە قاوەیی", arabic: "اريد اصبغ شعري جوزي" },
      { english: ["Could", "you", "add", "some", "layers", "in", "the", "back"], kurdish: "دەتوانیت لە دواوە بە شێوەی چین چین بیبڕیت؟", arabic: "تكدر تسويلي شوية مدرج ليورة؟" },
    ],
    fillBlanks: [
      { parts: ["I just want a", ", nothing too crazy."], hint: "تەنها ڕێکخستنێک (کەمێک کورتکردنەوەم) دەوێت، شتێکی زۆر سەیر نا.", answer: "trim", wrongs: ["cut", "chop", "style"], arabicHint: "اريد بس زيان خفيف، مو فد شي غريب.", arabicParts: ["اريد بس","، مو فد شي غريب."], arabicAnswer: "زيان خفيف", arabicWrongs: ["قص","تقطيع","تسريحة"] },
      { parts: ["Keep the length, but add some", "for volume."], hint: "درێژییەکەی بهێڵەرەوە، بەڵام کەمێک چین چینی (مدرج) تێ بکە بۆ ئەوەی پڕتر دەربکەوێت.", answer: "layers", wrongs: ["steps", "parts", "lines"], arabicHint: "بقي الطول، بس ضيف شوية مدرج حتى يبين ثخين.", arabicParts: ["بقي الطول، بس ضيف شوية","حتى يبين ثخين."], arabicAnswer: "مدرج", arabicWrongs: ["خطوات","اجزاء","خطوط"] },
    ],
    conversations: [
      { situation: "لەلای سەرتاشەکەت دانیشتوویت", theyAsk: "So, what are we doing today? A completely new style?", correct: "No, keep the length. Just a trim, and maybe take a little off the top. I like the current style.", wrong1: "Don't cut too much.", wrong2: "Make it small cut.", wrong3: "I want small hair.", explanation: "'Just a trim' و 'take a little off the top' باوترین دەستەواژەی سەرتاشخانەکانن", situationAr: "كاعد يم الحلاق", explanationAr: "'Just a trim' و 'take a little off the top' هيه اكثر الجمل الشائعة يم الحلاق." },
    ],
  },

  // Lesson 7: Home Repairs
  {
    topic: "Home Repairs", topicKu: "چاککردنەوەی ماڵ (کارەبا/بۆری)", topicAr: "إصلاحات المنزل",
    words: [
      { english: "The pipe is leaking",  kurdish: "بۆرییەکە دڵۆپە دەکات", arabic: "البوري يخر" },
      { english: "Power outage",         kurdish: "بڕانی کارەبا", arabic: "انكطعت الكهرباء" },
      { english: "Clogged drain",        kurdish: "گیرانی ئاوەڕۆ", arabic: "المجاري مسدودة" },
      { english: "Short circuit",        kurdish: "شۆرتی کارەبا", arabic: "شورت كهرباء" },
      { english: "Give me an estimate",  kurdish: "خەمڵاندنێکم بۆ بکە (بۆ نرخەکە)", arabic: "انطيني سعر تقريبي" },
    ],
    voices: [
      { prompt: "کێشەی بۆری ئاو", target: "The pipe under the sink is leaking. We need a plumber.", targetKurdish: "بۆری ژێر مەغسەلەکە دڵۆپە دەکات. پێویستمان بە بۆریچییەکە.", promptAr: "مشكلة ببوري المي", targetArabic: "البوري جوة المغسلة يخر. نحتاج سباك." },
      { prompt: "داوای نرخی خەمڵێنراو", target: "Can you give me an estimate for the repairs?", targetKurdish: "دەتوانیت خەمڵاندنێکم بۆ بکەیت بۆ نرخەی چاککردنەوەکە؟", promptAr: "تطلب سعر تقريبي", targetArabic: "تكدر تنطيني سعر تقريبي للتصليحات؟" },
    ],
    sentences: [
      { english: ["The", "drain", "is", "clogged", "and", "water", "won't", "go", "down"], kurdish: "ئاوەڕۆکە گیراوە و ئاوەکە ناڕوات", arabic: "المجاري مسدودة والمي ما ينزل" },
      { english: ["I", "think", "there", "was", "a", "short", "circuit", "in", "the", "wall"], kurdish: "پێم وایە شۆرتی کارەبا هەب��و لە دیوارەکەدا", arabic: "اعتقد صار شورت كهرباء بالحايط" },
    ],
    fillBlanks: [
      { parts: ["Can you give me a rough", "of the cost?"], hint: "دەتوانیت خەمڵاندنێکی زبری (گشتی) تێچووەکەم پێ بدەیت؟", answer: "estimate", wrongs: ["price", "guess", "number"], arabicHint: "تكدر تنطيني سعر تقريبي للتكلفة؟", arabicParts: ["تكدر تنطيني","تقريبي للتكلفة؟"], arabicAnswer: "سعر", arabicWrongs: ["رقم","تخمين","حساب"] },
      { parts: ["The sink is", ", the water won't drain."], hint: "مەغسەلەکە گیراوە، ئاوەکە بەتاڵ نابێتەوە.", answer: "clogged", wrongs: ["stuck", "blocked", "closed"], arabicHint: "المغسلة مسدودة، والمي ما ينزل.", arabicParts: ["المغسلة","، والمي ما ينزل."], arabicAnswer: "مسدودة", arabicWrongs: ["علكانة","مكسورة","مقفولة"] },
    ],
    conversations: [
      { situation: "تەلەفۆن بۆ کارەباچییەک دەکەیت", theyAsk: "What seems to be the issue with the electricity?", correct: "Half the house has a power outage. I think there was a short circuit. Can you give me an estimate before coming?", wrong1: "No electricity in house.", wrong2: "Lights went boom. Tell me price.", wrong3: "Fix my wires. How much?", explanation: "'Power outage'، 'short circuit'، و 'estimate' وشەی زۆر پێویستن بۆ مامەڵەکردن لەگەڵ وەستاکان", situationAr: "تتصل بكهربائي", explanationAr: "'Power outage'، 'short circuit'، و 'estimate' كلمات ضرورية كلش حتى تحچي وية الفنيين." },
    ],
  },

  // Lesson 8: Returning Defective Items
  {
    topic: "Returns & Refunds", topicKu: "گەڕاندنەوە و وەرگرتنەوەی پارە", topicAr: "الإرجاع واسترداد الأموال",
    words: [
      { english: "It's defective",       kurdish: "کەموکوڕی تێدایە (خراپە)", arabic: "بيه خلل" },
      { english: "I'd like a refund",    kurdish: "دەمەوێت پارەکەم وەربگرمەوە", arabic: "اريد ارجع فلوسي" },
      { english: "Do you have the receipt", kurdish: "ئایا پسووڵەکەت (وەسڵەکەت) پێیە؟", arabic: "عندك الوصل؟" },
      { english: "Exchange it for",      kurdish: "بیگۆڕمەوە بە...", arabic: "ابدله بـ" },
      { english: "Under warranty",       kurdish: "لەژێر زەمانەتدایە", arabic: "عليه ضمان" },
    ],
    voices: [
      { prompt: "گەڕاندنەوەی شتێکی خراپ", target: "I bought this yesterday, but it's defective. I'd like a refund.", targetKurdish: "دوێنێ ئەمەم کڕی، بەڵام کەموکوڕی تێدایە. دەمەوێت پارەکەم وەربگرمەوە.", promptAr: "إرجاع شيء معيب", targetArabic: "اشتريت هذا بالأمس، لكنه معيب. أود استرداد أ��والي." },
      { prompt: "گۆڕینەوەی کاڵایەک", target: "Can I exchange this for a larger size?", targetKurdish: "دەتوانم ئەمە بگۆڕمەوە بە قەبارەیەکی گەورەتر؟", promptAr: "تبديل غرض", targetArabic: "اكدر ابدل هذا بقياس اكبر؟" },
    ],
    sentences: [
      { english: ["Do", "you", "still", "have", "the", "original", "receipt"], kurdish: "ئایا هێشتا پسووڵە ڕەسەنەکەت پێیە؟", arabic: "بعدك محتفظ بالوصل الأصلي؟" },
      { english: ["The", "laptop", "is", "still", "under", "warranty", "right"], kurdish: "لاپتۆپەکە هێشتا لەژێر زەمانەتدایە، ڕاستە؟", arabic: "اللابتوب بعده على الضمان، مو؟" },
    ],
    fillBlanks: [
      { parts: ["This screen is broken. It's completely", "."], hint: "ئەم شاشەیە شکاوە. بەتەواوی کەموکوڕی تێدایە (خراپە).", answer: "defective", wrongs: ["bad", "wrong", "fault"], arabicHint: "هاي الشاشة مكسورة. بيها خلل تماماً.", arabicParts: ["هاي الشاشة مكسورة. بيها","تماماً."], arabicAnswer: "خلل", arabicWrongs: ["سيئة","غلط","خطأ"] },
      { parts: ["I'd like a full", "to my credit card."], hint: "دەمەوێت بەتەواوی پارەکەم بۆ بگەڕێندرێتەوە سەر کارتی بانکییەکەم.", answer: "refund", wrongs: ["return", "money", "back"], arabicHint: "اريد ارجع المبلغ كامل على بطاقتي الائتمانية.", arabicParts: ["اريد","المبلغ كامل على بطاقتي الائتمانية."], arabicAnswer: "ارجع", arabicWrongs: ["ابقي","فلوس","عودة"] },
    ],
    conversations: [
      { situation: "گەڕاندنەوەی تەلەڤیزیۆنێک بۆ فرۆشگاکە", theyAsk: "Is there something wrong with the item?", correct: "Yes, it's defective. The screen doesn't turn on. I have the receipt and it's under warranty. I'd like a refund.", wrong1: "TV is broken. Give my money.", wrong2: "It not work. Take it back.", wrong3: "I want refund because bad TV.", explanation: "'Defective', 'receipt', 'warranty', و 'refund' چوار وشەی ئاڵتوونین بۆ گەڕاندنەوەی کاڵا لە دەرەوەی وڵات", situationAr: "ترجع تلفزيون للمحل", explanationAr: "'Defective', 'receipt', 'warranty', و 'refund' اربع كلمات ذهبية حتى ترجع الأغراض برة البلد." },
    ],
  },

  // Lesson 9: Job Perks & HR
  {
    topic: "Human Resources (HR)", topicKu: "سەرچاوە مرۆییەکان و ئیمتیازاتی کار", topicAr: "الموارد البشرية ومزايا العمل",
    words: [
      { english: "Paid time off",        kurdish: "مۆڵەتی بە پارە (پشوو کە مووچەی لەگەڵدایە)", arabic: "اجازة مدفوعة الأجر" },
      { english: "Health benefits",      kurdish: "ئیمتیازاتی تەندروستی (دڵنیایی)", arabic: "مزايا صحية" },
      { english: "Performance review",   kurdish: "هەڵسەنگاندنی ئاستی کارکردن", arabic: "تقييم الأداء" },
      { english: "Call in sick",         kurdish: "پەیوەندیکردن بۆ وەرگرتنی مۆڵەتی نەخۆشی", arabic: "تخابر تاخذ اجازة مرضية" },
      { english: "Maternity leave",      kurdish: "مۆڵەتی دایکایەتی (بۆ منداڵبوون)", arabic: "اجازة امومة" },
    ],
    voices: [
      { prompt: "پرسین لە مۆڵەت", target: "How many days of paid time off do we get a year?", targetKurdish: "ساڵانە چەند ڕۆژ مۆڵەتی بە پارەمان هەیە؟", promptAr: "تسأل عن الاجازة", targetArabic: "كم يوم اجازة مدفوعة الأجر نحصل بالسنة؟" },
      { prompt: "وەرگرتنی مۆڵەتی نەخۆشی", target: "I'm not feeling well. I need to call in sick today.", targetKurdish: "هەست بە باشی ناکەم. پێویستە ئەمڕۆ تەلەفۆن بکەم و مۆڵەتی نەخۆشی وەربگرم.", promptAr: "الحصول على إجا��ة مرضية", targetArabic: "ما احس نفسي زين. احتاج اخابر اخذ اجازة مرضية اليوم." },
    ],
    sentences: [
      { english: ["She", "is", "currently", "on", "maternity", "leave", "until", "June"], kurdish: "ئەو لە ئێستادا لە مۆڵەتی دایکایەتیدایە تاوەکو مانگی حوزەیران", arabic: "هي هسة باجازة امومة لحد شهر حزيران" },
      { english: ["We", "have", "excellent", "health", "benefits", "at", "this", "company"], kurdish: "لەم کۆمپانیایەدا ئیمتیازاتی تەندروستی نایابمان هەیە", arabic: "عدنا مزايا صحية ممتازة بهاي الشركة" },
    ],
    fillBlanks: [
      { parts: ["I have the flu, so I have to", "in sick today."], hint: "ئەنفلۆنزام هەیە، بۆیە دەبێت ئەمڕۆ پەیوەندی بکەم بۆ مۆڵەتی نەخۆشی.", answer: "call", wrongs: ["tell", "say", "take"], arabicHint: "عندي فلاونزا، فـ لازم اخابر حتى اخذ اجازة مرضية اليوم.", arabicParts: ["عندي فلاونزا، فـ لازم","حتى اخذ اجازة مرضية اليوم."], arabicAnswer: "اخابر", arabicWrongs: ["اكول","احچي","اخذ"] },
      { parts: ["We will discuss your salary during your performance", "."], hint: "گفتوگۆ لەسەر مووچەکەت دەکەین لە کاتی هەڵسەنگاندنی ئاستی کارکردنەکەتدا.", answer: "review", wrongs: ["check", "talk", "meeting"], arabicHint: "راح نناقش راتبك من نسوي تقييم أدائك.", arabicParts: ["راح نناقش راتبك من نسوي","أدائك."], arabicAnswer: "تقييم", arabicWrongs: ["فحص","محادثة","اجتماع"] },
    ],
    conversations: [
      { situation: "چاوپێکەوتن لەگەڵ بەشی HR بۆ زانینی ئیمتیازاتەکان", theyAsk: "Do you have any questions about the benefits package?", correct: "Yes. Could you explain the health benefits and how much paid time off is offered?", wrong1: "How many days I sleep at home with money?", wrong2: "Do you pay when I am sick?", wrong3: "I want to know about doctor money.", explanation: "'Paid time off' (PTO) و 'Health benefits' زاراوەی فەرمی و زۆر گرنگن لە هەر گرێبەستێکی کارکردندا", situationAr: "مقابلة وية قسم الموارد البشرية", explanationAr: "'Paid time off' (PTO) و 'Health benefits' مصطلحات رسمية ومهمة كلش بأي عقد عمل." },
    ],
  },

];

export default normalUnit04;
