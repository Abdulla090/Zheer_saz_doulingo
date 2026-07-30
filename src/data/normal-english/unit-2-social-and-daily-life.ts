import { UnitBank } from "../types";

// ── Visible Unit 6: Social & Practical English — 10 unique lessons ────────────
// Practical English for Kurdish speakers: Real-life scenarios, social interactions, and practical daily tasks.

const normalUnit01: UnitBank = [

  // Lesson 0: Greetings & Catching Up
  {
    topic: "Catching Up", topicKu: "هەواڵپرسین و بینینەوە", topicAr: "الاطمئنان على الأحوال والالتقاء",
    words: [
      { english: "How have you been",  kurdish: "چۆن بوویت؟ (بۆ ماوەیەک کە نەتبینیوە)", arabic: "كيف حالك؟ (لم أرك منذ مدة)" },
      { english: "It's been a while",  kurdish: "ماوەیەکە یەکمان نەدیوە", arabic: "لقد مر وقت طويل" },
      { english: "What have you been up to", kurdish: "خەریکی چیت؟ (لەم ماوەیەدا)", arabic: "ماذا كنت تفعل؟ (في الآونة الأخيرة)" },
      { english: "Let's catch up soon", kurdish: "با بە زوویی یەکتر ببینینەوە و قسە بکەین", arabic: "دعنا نلتقي قريباً ونتحدث" },
      { english: "Taking it easy",     kurdish: "تەنها پشوو دەدەم / خۆم ماندوو ناکەم", arabic: "أنا أسترخي / لا أجهد نفسي" },
    ],
    voices: [
      { prompt: "سڵاوکردن لە هاوڕێیەک دوای ماوەیەک", target: "Hi, how have you been? It's been a while.", targetKurdish: "سڵاو، چۆن بوویت؟ ماوەیەکە یەکمان نەدیوە.", promptAr: "تحية صديق بعد فترة", targetArabic: "مرحباً، كيف حالك؟ لقد مر وقت طويل." },
      { prompt: "کۆتایی پێهێنانی گفتوگۆیەکی کورت", target: "It was great seeing you. Let's catch up soon.", targetKurdish: "بینینت زۆر خۆش بوو. با بە زوویی یەکتر ببینینەوە.", promptAr: "إنهاء محادثة قصيرة", targetArabic: "كان من الرائع رؤيتك. دعنا نلتقي قريباً." },
    ],
    sentences: [
      { english: ["What", "have", "you", "been", "up", "to", "lately"], kurdish: "لەم دواییانەدا خەریکی چی بوویت؟", arabic: "ماذا كنت تفعل في الآونة الأخيرة؟" },
      { english: ["I'm", "just", "taking", "it", "easy", "these", "days"], kurdish: "ئەم ڕۆژانە تەنها پشوو دەدەم و خۆم ماندوو ناکەم", arabic: "أنا فقط أسترخي هذه الأيام" },
    ],
    fillBlanks: [
      { parts: ["How have you", "lately?"], hint: "لەم دواییانەدا چۆن بوویت؟", answer: "been", wrongs: ["are", "is", "doing"], arabicHint: "كيف حالك مؤخراً؟", arabicParts: ["كيف","مؤخراً؟"], arabicAnswer: "حالك", arabicWrongs: ["أنت","تكون","تفعل"] },
      { parts: ["Let's catch", "over coffee next week."], hint: "با هەفتەی داهاتوو لەسەر قاوەیەک یەکتر ببینینەوە و قسە بکەین.", answer: "up", wrongs: ["out", "in", "on"], arabicHint: "دعنا نلتقي ونتحدث على القهوة الأسبوع المقبل.", arabicParts: ["دعنا","ونتحدث على القهوة الأسبوع المقبل."], arabicAnswer: "نلتقي", arabicWrongs: ["نخرج","ندخل","نذهب"] },
    ],
    conversations: [
      { situation: "لە مۆڵێکدا بە ڕێکەوت هاوڕێیەکی کۆن دەبینیت", theyAsk: "Hey! I haven't seen you in months. How are you?", correct: "I've been great, thanks! What have you been up to these days?", wrong1: "I've been doing well, thanks.", wrong2: "Nothing much—how about you?", wrong3: "I'm good. What are you doing today?", explanation: "'How have you been' و 'What have you been up to' ڕێگەیەکی زۆر سروشتی و باوە بۆ هەواڵپرسین لە کەسێک کە ماوەیەکە نەتبینیوە", situationAr: "تقابل صديقاً قديماً بالصدفة في مركز تجاري", explanationAr: "'How have you been' و 'What have you been up to' هي طرق طبيعية وشائعة جداً للسؤال عن أحوال شخص لم تره منذ فترة." },
    ],
  },

  // Lesson 1: Making Plans & Inviting
  {
    topic: "Making Plans", topicKu: "دانانی پلان و بانگهێشتکردن", topicAr: "وضع الخطط والدعوات",
    words: [
      { english: "Are you free",         kurdish: "کاتت هەیە؟ / بەتاڵیت؟", arabic: "هل أنت متفرغ؟" },
      { english: "Do you want to grab",  kurdish: "دەتەوێت بچین بۆ (خواردن/خواردنەوە)؟", arabic: "هل تريد أن نذهب لتناول (طعام/شراب)؟" },
      { english: "Does that work for you", kurdish: "ئەوە بۆ تۆ گونجاوە؟", arabic: "هل هذا مناسب لك؟" },
      { english: "Sounds like a plan",   kurdish: "بیرۆکەیەکی زۆر باشە (ڕازیبوون لەسەر پلانێک)", arabic: "تبدو كخطة جيدة (موافقة على خطة)" },
      { english: "I'm tied up",          kurdish: "دەستم گیراوە / سەرقاڵم", arabic: "أنا مشغول جداً" },
    ],
    voices: [
      { prompt: "پێشنیارکردنی چوونە دەرەوە", target: "Do you want to grab coffee tomorrow morning?", targetKurdish: "دەتەوێت بەیانی بچین قاوەیەک بخۆینەوە؟", promptAr: "اقتراح الخروج", targetArabic: "هل تريد أن نذهب لتناول القهوة صباح الغد؟" },
      { prompt: "گونجاندنی کات", target: "Let's meet at six. Does that work for you?", targetKurdish: "با کاتژمێر شەش یەکتر ببینین. ئەوە بۆ تۆ گونجاوە؟", promptAr: "تحديد موعد", targetArabic: "دعنا نلتقي في السادسة. هل هذا مناسب لك؟" },
    ],
    sentences: [
      { english: ["Are", "you", "free", "to", "meet", "up", "this", "weekend"], kurdish: "کاتت هەیە ئەم کۆتایی هەفتەیە یەکتر ببینین؟", arabic: "هل أنت متفرغ للقاء في نهاية هذا الأسبوع؟" },
      { english: ["That", "sounds", "like", "a", "plan", "see", "you", "then"], kurdish: "بیرۆکەیەکی زۆر باشە، کەواتە دەتبینم", arabic: "تبدو كخطة جيدة، أراك إذاً" },
    ],
    fillBlanks: [
      { parts: ["Are you", "on Friday evening?"], hint: "ئێوارەی هەینی کاتت هەیە؟", answer: "free", wrongs: ["empty", "available", "good"], arabicHint: "هل أنت متفرغ مساء الجمعة؟", arabicParts: ["هل أنت","مساء الجمعة؟"], arabicAnswer: "متفرغ", arabicWrongs: ["فارغ","متاح","جيد"] },
      { parts: ["I'd love to, but I'm", "up with work."], hint: "حەزم دەکرد بێم، بەڵام دەستم گیراوە بە کارەوە.", answer: "tied", wrongs: ["busy", "stuck", "held"], arabicHint: "أود ذلك، لكني مشغول جداً بالعمل.", arabicParts: ["أود ذلك، لكني","جداً بالعمل."], arabicAnswer: "مشغول", arabicWrongs: ["عالق","مرتبط","محتجز"] },
    ],
    conversations: [
      { situation: "دەتەوێت لەگەڵ هاوکارێکت بچیتە دەرەوە بۆ نانخواردن", theyAsk: "I'm getting hungry. Should we go eat?", correct: "Yeah, do you want to grab lunch at the new cafe? Does 1 PM work for you?", wrong1: "Sure, we could get lunch.", wrong2: "I'd like to eat around one.", wrong3: "Do you want to go to the cafe now?", explanation: "دەستەواژەی 'grab lunch/coffee' زۆر باوە لە ئینگلیزی ئاخاوتندا بۆ چوونە دەرەوەیەکی خێرا", situationAr: "تريد الخروج لتناول الغداء مع زميل لك", explanationAr: "عبارة 'grab lunch/coffee' شائعة جداً في اللغة الإنجليزية المحكية للخروج السريع." },
    ],
  },

  // Lesson 2: Ordering at a Restaurant
  {
    topic: "Dining Out", topicKu: "نانخواردن لە دەرەوە", topicAr: "تناول الطعام في الخارج",
    words: [
      { english: "I would like to order", kurdish: "دەمەوێت داوا بکەم", arabic: "أود أن أطلب" },
      { english: "Could I have the bill", kurdish: "دەکرێت پسووڵەکە (حسابەکە) بێنیت؟", arabic: "هل يمكنني الحصول على الفاتورة؟" },
      { english: "On the side",          kurdish: "لە تەنیشتییەوە (وەک خواردنی لاوەکی)", arabic: "على الجانب (كطبق جانبي)" },
      { english: "I'll have the same",   kurdish: "منیش هەمان شت دەخۆم", arabic: "سآخذ نفس الشيء" },
      { english: "Keep the change",      kurdish: "باقیەکەی بۆ خۆت (وەک بەخشیش)", arabic: "احتفظ بالباقي (كإكرامية)" },
    ],
    voices: [
      { prompt: "داواکردنی خواردن بە شێوازێکی جوان", target: "I would like the grilled chicken with salad on the side, please.", targetKurdish: "تکایە، حەزم لە مریشکی برژاوەیە لەگەڵ زەڵاتە لە تەنیشتییەوە.", promptAr: "طلب الطعام بطريقة مهذبة", targetArabic: "أود الدجاج المشوي مع السلطة على الجانب، من فضلك." },
      { prompt: "داواکردنی پسووڵەی پارە", target: "Could we get the bill, please? We're ready to pay.", targetKurdish: "تکایە، دەکرێت پسووڵەکەمان بۆ بێنیت؟ ئامادەین بۆ پارەدان.", promptAr: "طلب فاتورة الدفع", targetArabic: "هل يمكننا الحصول على الفاتورة، من فضلك؟ نحن جاهزون للدفع." },
    ],
    sentences: [
      { english: ["Could", "I", "have", "the", "bill", "please"], kurdish: "دەکرێت پسووڵەکە بێنیت تکایە؟", arabic: "هل يمكنني الحصول على الفاتورة من فضلك؟" },
      { english: ["I'll", "have", "the", "same", "as", "him"], kurdish: "منیش هەمان شتی ئەو دەخۆم", arabic: "سآخذ نفس الشيء مثله." },
    ],
    fillBlanks: [
      { parts: ["I", "like to order the pasta."], hint: "حەزم لێیە پاستاکە داوا بکەم.", answer: "would", wrongs: ["want", "will", "can"], arabicHint: "أود أن أطلب المعكرونة.", arabicParts: ["أود","أطلب المعكرونة."], arabicAnswer: "أن", arabicWrongs: ["أريد","سوف","أستطيع"] },
      { parts: ["Could we get some fries on the", "?"], hint: "دەکرێت کەمێک پەتاتەی سوورکراوە وەک خواردنی لاوەکی بێنین؟", answer: "side", wrongs: ["next", "plate", "part"], arabicHint: "هل يمكننا الحصول على بعض البطاطس المقلية كطبق جانبي؟", arabicParts: ["هل يمكننا الحصول على بعض البطاطس المقلية كطبق","؟"], arabicAnswer: "جانبي", arabicWrongs: ["إضافي","صحن","جزء"] },
    ],
    conversations: [
      { situation: "نانخواردنەکەتان تەواو بووە و دەتەوێت بڕۆیت", theyAsk: "Can I get you anything else for dessert?", correct: "No, thank you. Could I have the bill, please?", wrong1: "No, thanks. We're ready to pay.", wrong2: "Nothing else, thank you.", wrong3: "Could you bring the check when you have a moment?", explanation: "'Could I have the bill, please?' باوترین و بەئەدەبترین ڕێگەیە بۆ داواکردنی حسابی چێشتخانە", situationAr: "لقد انتهيت من تناول الطعام وتريد المغادرة", explanationAr: "'Could I have the bill, please?' هي الطريقة الأكثر شيوعاً وتهذيباً لطلب فاتورة المطعم." },
    ],
  },

  // Lesson 3: Shopping & Bargaining
  {
    topic: "Shopping", topicKu: "بازاڕکردن", topicAr: "التسوق والمساومة",
    words: [
      { english: "I'm just browsing",    kurdish: "تەنها سەیر دەکەم (نامەوێت شت بکڕم لە ئێستادا)", arabic: "أنا فقط أتصفح (لا أرغب في الشراء حالياً)" },
      { english: "Do you have this in",  kurdish: "ئەمەتان هەیە بە (قەبارە/ڕەنگ)...؟", arabic: "هل لديكم هذا بـ (الحجم/اللون)...؟" },
      { english: "Can I try it on",      kurdish: "دەتوانم تاقی بکەمەوە؟", arabic: "هل يمكنني تجربته؟" },
      { english: "Out of my budget",     kurdish: "لە سەرووی بودجەکەمەوەیە (گرانە)", arabic: "خارج ميزانيتي (غالٍ)" },
      { english: "Is that your best price", kurdish: "ئەوە دوا نرختە؟ / داشکاندن دەکەیت؟", arabic: "هل هذا أفضل سعر لديك؟ / هل تقدم خصماً؟" },
    ],
    voices: [
      { prompt: "کاتێک پێویستت بە یارمەتی فرۆشیار نییە", target: "No thank you, I'm just browsing for now.", targetKurdish: "نەخێر سوپاس، تەنها سەیر دەکەم بۆ ئێستا.", promptAr: "عندما لا تحتاج إلى مساعدة البائع", targetArabic: "لا شكراً، أنا فقط أتصفح الآن." },
      { prompt: "مامەڵەکردن لەسەر نرخ", target: "It's a bit out of my budget. Is that your best price?", targetKurdish: "کەمێک لە سەرووی بودجەکەمەوەیە. ئەوە باشترین نرختە؟", promptAr: "المساومة على السعر", targetArabic: "إنه أغلى قليلاً من ميزانيتي. هل هذا أفضل سعر لديك؟" },
    ],
    sentences: [
      { english: ["Do", "you", "have", "this", "in", "a", "medium"], kurdish: "ئەمەتان هەیە بە قەبارەی مامناوەند (میدیەم)؟", arabic: "هل لديكم هذا بحجم متوسط؟" },
      { english: ["Where", "is", "the", "fitting", "room", "please"], kurdish: "تکایە ژووری خۆگۆڕین لە کوێیە؟", arabic: "أين غرفة القياس من فضلك؟" },
    ],
    fillBlanks: [
      { parts: ["I'm just", ", thank you."], hint: "تەنها سەیر دەکەم، سوپاس.", answer: "browsing", wrongs: ["looking", "seeing", "watching"], arabicHint: "أنا فقط أتصفح، شكراً لك.", arabicParts: ["أنا فقط","، شكراً لك."], arabicAnswer: "أتصفح", arabicWrongs: ["أنظر","أرى","أشاهد"] },
      { parts: ["Is that your", "price?"], hint: "ئەوە باشترین نرختە؟ (بۆ مامەڵەکردن)", answer: "best", wrongs: ["last", "final", "good"], arabicHint: "هل هذا أفضل سعر لديك؟", arabicParts: ["هل هذا","سعر لديك؟"], arabicAnswer: "أفضل", arabicWrongs: ["آخر","نهائي","جيد"] },
    ],
    conversations: [
      { situation: "جلێک تاقی دەکەیتەوە بەڵام نرخەکەی گرانە", theyAsk: "How did the jacket fit? It looks great on you.", correct: "It fits perfectly, but it's a bit out of my budget. Do you offer any discounts?", wrong1: "It fits well, but it's more than I wanted to spend.", wrong2: "I like it, but the price is a little high for me.", wrong3: "Do you have a less expensive option?", explanation: "'A bit out of my budget' ڕێگەیەکی زۆر جوانە بۆ گوتنی ئەوەی کە شتێک گرانە بەبێ ئەوەی ڕاستەوخۆ بڵێیت گرانە", situationAr: "تجرب ملابس ولكن سعرها باهظ", explanationAr: "'A bit out of my budget' هي طريقة مهذبة جداً لقول أن شيئاً ما غالٍ دون قوله مباشرة." },
    ],
  },

  // Lesson 4: Asking for Directions
  {
    topic: "Asking for Directions", topicKu: "پرسین لە ناونیشان", topicAr: "طلب الاتجاهات",
    words: [
      { english: "Could you point me to", kurdish: "دەتوانیت ڕێنماییم بکەیت بۆ...", arabic: "هل يمكنك أن تدلني على..." },
      { english: "Walking distance",     kurdish: "دوورییەک کە بە پێ بڕۆیت", arabic: "مسافة مشي (يمكن الوصول إليها سيراً على الأقدام)" },
      { english: "I'm a bit lost",       kurdish: "کەمێک ون بووم", arabic: "أنا تائه قليلاً" },
      { english: "Go straight ahead",    kurdish: "ڕاستەوخۆ بڕۆ پێشەوە", arabic: "اذهب مباشرة إلى الأمام" },
      { english: "Right around the corner", kurdish: "ڕێک لەو سووچەیە / زۆر نزیکە", arabic: "بالضبط عند الزاوية / قريب جداً" },
    ],
    voices: [
      { prompt: "داوای یارمەتی بکە کاتێک ون بوویت", target: "Excuse me, I'm a bit lost. Could you point me to the train station?", targetKurdish: "ببوورە، کەمێک ون بووم. دەتوانیت ڕێنماییم بکەیت بۆ وێستگەی شەمەندەفەرەکە؟", promptAr: "اطلب المساعدة عندما تكون تائهاً", targetArabic: "عفواً، أنا تائه قليلاً. هل يمكنك أن تدلني على محطة القطار؟" },
      { prompt: "پرسین لە دووری شوێنێک", target: "Is the museum within walking distance from here?", targetKurdish: "ئایا مۆزەخانەکە بە پێ لێرەوە نزیکە؟", promptAr: "السؤال عن بعد مكان ما", targetArabic: "هل المتحف على مسافة قريبة سيراً على الأقدام من هنا؟" },
    ],
    sentences: [
      { english: ["Is", "it", "within", "walking", "distance", "from", "here"], kurdish: "ئایا لێرەوە ئەوەندە نزیکە کە بە پێ بڕۆین؟", arabic: "هل هو على مسافة قريبة سيراً على الأقدام من هنا؟" },
      { english: ["Go", "straight", "ahead", "and", "take", "the", "second", "right"], kurdish: "ڕاستەوخۆ بڕۆ پێشەوە و بە دووەم لاڕێی لای ڕاستدا بڕۆ", arabic: "اذهب مباشرة إلى الأمام ثم انعطف يميناً عند المنعطف الثاني." },
    ],
    fillBlanks: [
      { parts: ["Could you", "me to the nearest bank?"], hint: "دەتوانیت ڕێنماییم بکەیت بۆ نزیکترین بانك؟", answer: "point", wrongs: ["show", "give", "tell"], arabicHint: "هل يمكنك أن تدلني على أقرب بنك؟", arabicParts: ["هل يمكنك أن","على أقرب بنك؟"], arabicAnswer: "تدلني", arabicWrongs: ["تريني","تعطيني","تخبرني"] },
      { parts: ["Don't worry, it's right around the", "."], hint: "خەمت نەبێت، ڕێک لەو سووچەیە (زۆر نزیکە).", answer: "corner", wrongs: ["street", "way", "block"], arabicHint: "لا تقلق، إنه بالضبط عند الزاوية.", arabicParts: ["لا تقلق، إنه بالضبط عند","."], arabicAnswer: "الزاوية", arabicWrongs: ["الشارع","الطريق","المبنى"] },
    ],
    conversations: [
      { situation: "لە شارێکی نوێیت و بەدوای میوانخانەکەدا دەگەڕێیت", theyAsk: "You look lost. Can I help you find something?", correct: "Yes, please. I'm looking for the Grand Hotel. Is it within walking distance?", wrong1: "Yes, could you tell me where the Grand Hotel is?", wrong2: "I'm trying to get to the Grand Hotel.", wrong3: "Could you point me toward the hotel?", explanation: "'Is it within walking distance?' پرسیارێکی زۆر باوە بۆ زانینی ئەوەی ئایا پێویست بە تەکسی دەکات یان نا", situationAr: "أنت في مدينة جديدة وتبحث عن الفندق", explanationAr: "'Is it within walking distance?' هو سؤال شائع جداً لمعرفة ما إذا كنت بحاجة إلى سيارة أجرة أم لا." },
    ],
  },

  // Lesson 5: Health & Seeing a Doctor
  {
    topic: "Health & Doctor", topicKu: "تەندروستی و سەردانی پزیشک", topicAr: "الصحة وزيارة الطبيب",
    words: [
      { english: "I'm not feeling well", kurdish: "هەست بە باشی ناکەم", arabic: "أنا لا أشعر أنني بخير" },
      { english: "Make an appointment",  kurdish: "دانانی کات بۆ بینین (مەوعید)", arabic: "تحديد موعد" },
      { english: "I've been feeling dizzy", kurdish: "هەستم بە گێژبوونی سەر کردووە", arabic: "كنت أشعر بالدوار" },
      { english: "Sore throat",          kurdish: "قورگ ئێشە", arabic: "التهاب الحلق" },
      { english: "Prescription",         kurdish: "ڕەچەتەی پزیشک", arabic: "وصفة طبية" },
    ],
    voices: [
      { prompt: "هەستکردن بە نەخۆشی", target: "I'm not feeling well today. I have a headache and a sore throat.", targetKurdish: "ئەمڕۆ هەست بە باشی ناکەم. سەرم دێشێت و قورگیشم دێشێت.", promptAr: "الشعور بالمرض", targetArabic: "أنا لا أشعر أنني بخير اليوم. لدي صداع والتهاب في الحلق." },
      { prompt: "دانانی کات لای پزیشک", target: "I need to make an appointment. I've been feeling dizzy lately.", targetKurdish: "پێویستە کاتێک دابنێم. لەمدوایانەدا هەستم بە گێژبوون کردووە.", promptAr: "تحديد موعد مع الطبيب", targetArabic: "أحتاج إلى تحديد موعد. كنت أشعر بالدوار مؤخراً." },
    ],
    sentences: [
      { english: ["I", "need", "to", "make", "an", "appointment"], kurdish: "پێویستە کاتێک (مەوعیدێک) دابنێم", arabic: "أحتاج إلى تحديد موعد" },
      { english: ["The", "doctor", "gave", "me", "a", "prescription"], kurdish: "پزیشکەکە ڕەچەتەیەکی پێدام", arabic: "أعطاني الطبيب وصفة طبية" },
    ],
    fillBlanks: [
      { parts: ["I've been feeling a bit", "lately, like the room is spinning."], hint: "لەمدوایانەدا هەستم بە گێژبوون کردووە، وەک ئەوەی ژوورەکە بسوڕێتەوە.", answer: "dizzy", wrongs: ["tired", "sick", "weak"], arabicHint: "كنت أشعر بالدوار قليلاً مؤخراً، وكأن الغرفة تدور.", arabicParts: ["كنت أشعر","قليلاً مؤخراً، وكأن الغرفة تدور."], arabicAnswer: "بالدوار", arabicWrongs: ["بالتعب","بالمرض","بالضعف"] },
      { parts: ["I need to drop off this", "at the pharmacy."], hint: "پێویستە ئەم ڕەچەتەیە ببەمە دەرمانخانەکە.", answer: "prescription", wrongs: ["paper", "medicine", "note"], arabicHint: "أحتاج إلى تسليم هذه الوصفة الطبية في الصيدلية.", arabicParts: ["أحتاج إلى تسليم هذه","في الصيدلية."], arabicAnswer: "الوصفة الطبية", arabicWrongs: ["الورقة","الدواء","الملاحظة"] },
    ],
    conversations: [
      { situation: "تەلەفۆن بۆ نۆرینگەی پزیشک دەکەیت", theyAsk: "City Clinic, how can I help you?", correct: "Hi, I'm not feeling well and I've had a sore throat for days. I'd like to make an appointment, please.", wrong1: "Hi, I'd like to schedule a doctor's appointment.", wrong2: "I've had a sore throat and don't feel well.", wrong3: "Do you have any appointments available today?", explanation: "'I'd like to make an appointment' باشترین شێوازە. لە ئینگلیزیدا وشەی 'appointment' بەکاردێت بۆ دانانی کات لای پزیشک، نەک 'meeting' یان 'time'", situationAr: "تتصل بعيادة الطبيب", explanationAr: "'I'd like to make an appointment' هي أفضل طريقة. في اللغة الإنجليزية، تُستخدم كلمة 'appointment' لتحديد موعد مع الطبيب، وليس 'meeting' أو 'time'." },
    ],
  },

  // Lesson 6: Expressing Emotions & Empathy
  {
    topic: "Emotions & Empathy", topicKu: "هەستەکان و هاوسۆزی", topicAr: "التعبير عن المشاعر والتعاطف",
    words: [
      { english: "I'm absolutely thrilled", kurdish: "زۆر زۆر دڵخۆشم / بەپەرۆشم", arabic: "أنا سعيد للغاية / متحمس جداً" },
      { english: "I'm so sorry to hear that", kurdish: "زۆر خەفەتم خوارد کە ئەوەم بیست", arabic: "يؤسفني جداً سماع ذلك" },
      { english: "It's so frustrating",   kurdish: "ئەمە زۆر بێزارکەرە (کاتێک شتێک بە دڵی تۆ ناڕوات)", arabic: "هذا محبط جداً (عندما لا تسير الأمور كما تريد)" },
      { english: "That's such a relief",  kurdish: "ئەوە جێگەی دڵنەواییە (سووکنایی)", arabic: "هذا مريح جداً (شعور بالارتياح)" },
      { english: "I can't believe it",    kurdish: "بڕوا ناکەم (لە سەرسووڕماندا)", arabic: "لا أصدق ذلك (في حالة دهشة)" },
    ],
    voices: [
      { prompt: "دڵخۆشییەکی زۆر دەرببڕە", target: "I'm absolutely thrilled about the new job!", targetKurdish: "زۆر زۆر دڵخۆشم بە کارە نوێیەکە!", promptAr: "عبر عن سعادة غامرة", targetArabic: "أنا سعيد للغاية بالوظيفة الجديدة!" },
      { prompt: "هاوسۆزی بۆ هەواڵێکی ناخۆش", target: "I'm so sorry to hear that you've been unwell.", targetKurdish: "زۆر خەفەتم خوارد کە بیستم نەخۆش بوویت.", promptAr: "تعاطف مع خبر سيء", targetArabic: "يؤسفني جداً سماع أنك كنت مريضاً." },
    ],
    sentences: [
      { english: ["That's", "such", "a", "relief", "to", "know"], kurdish: "ئەوە جێگەی دڵنەواییە کە ئەوە دەزانم", arabic: "هذا مريح جداً معرفة ذلك" },
      { english: ["It's", "so", "frustrating", "when", "things", "go", "wrong"], kurdish: "زۆر بێزارکەرە کاتێک شتەکان هەڵە دەبن", arabic: "إنه محبط جداً عندما تسوء الأمور" },
    ],
    fillBlanks: [
      { parts: ["I'm absolutely", "to be joining your team!"], hint: "زۆر زۆر دڵخۆشم کە پەیوەندی بە تیمەکەتانەوە دەکەم!", answer: "thrilled", wrongs: ["happy", "glad", "good"], arabicHint: "أنا متحمس جداً للانضمام إلى فريقكم!", arabicParts: ["أنا","جداً للانضمام إلى فريقكم!"], arabicAnswer: "متحمس", arabicWrongs: ["سعيد","مسرور","جيد"] },
      { parts: ["That's such a", "— I thought I lost my wallet."], hint: "ئەوە جێگەی سووکناییە — پێم وابوو جزدانەکەم ون کردووە.", answer: "relief", wrongs: ["good thing", "luck", "break"], arabicHint: "هذا مريح جداً — اعتقدت أنني فقدت محفظتي.", arabicParts: ["هذا","جداً — اعتقدت أنني فقدت محفظتي."], arabicAnswer: "مريح", arabicWrongs: ["شيء جيد","حظ","راحة"] },
    ],
    conversations: [
      { situation: "هاوڕێیەکەت پێت دەڵێت کە تاقیکردنەوەیەکی قورسی دەرچووە", theyAsk: "I finally passed my driving test! I was so stressed.", correct: "That's such a relief! I'm absolutely thrilled for you.", wrong1: "That's great news—congratulations!", wrong2: "I'm really happy for you.", wrong3: "You must be so relieved.", explanation: "'That's such a relief' و 'absolutely thrilled' کاردانەوەی زۆر سروشتی و بەهێزن لە ئینگلیزیدا لەبری تەنها وتنێکی سادەی 'I am happy'", situationAr: "يخبرك صديقك أنه اجتاز اختباراً صعباً", explanationAr: "'That's such a relief' و 'absolutely thrilled' هما ردود فعل طبيعية وقوية جداً في اللغة الإنجليزية بدلاً من مجرد قول 'I am happy' بسيط." },
    ],
  },

  // Lesson 7: Travel & Airport English
  {
    topic: "Airport & Flights", topicKu: "فڕۆکەخانە و گەشتەکان", topicAr: "المطار والرحلات الجوية",
    words: [
      { english: "Where is the check-in desk", kurdish: "مێزی پشکنین (چێک ئین) لە کوێیە؟", arabic: "أين مكتب تسجيل الدخول؟" },
      { english: "Boarding pass",        kurdish: "بلیت یان کارتی سواربوون", arabic: "بطاقة الصعود إلى الطائرة" },
      { english: "Any luggage to check", kurdish: "هیچ جانتایەکت هەیە بیدەیتە بار؟", arabic: "هل لديك أي أمتعة لتسجيلها؟" },
      { english: "Gate number",          kurdish: "ژمارەی دەروازە", arabic: "رقم البوابة" },
      { english: "Carry-on bag",         kurdish: "جانتای دەست (کە دەچێتە ناو فڕۆکە)", arabic: "حقيبة يد (التي تحملها معك إلى الطائرة)" },
    ],
    voices: [
      { prompt: "پرسین لە مێزی پشکنین", target: "Excuse me, where is the check-in desk for this flight?", targetKurdish: "ببوورە، مێزی پشکنین بۆ ئەم گەشتە لە کوێیە؟", promptAr: "السؤال عن مكتب تسجيل الدخول", targetArabic: "عفواً، أين مكتب تسجيل الدخول لهذه الرحلة؟" },
      { prompt: "پێدانی پاسپۆرت لە فڕۆکەخانە", target: "Here is my passport and ticket.", targetKurdish: "فەرموو ئەمە پاسپۆرت و بلیتەکەمە.", promptAr: "تقديم جواز السفر في المطار", targetArabic: "تفضل، هذا جواز سفري وتذكرتي." },
    ],
    sentences: [
      { english: ["Do", "you", "have", "any", "luggage", "to", "check", "in"], kurdish: "هیچ جانتایەکت هەیە بۆ پشکنین (بار)؟", arabic: "هل لديك أي أمتعة لتسجيلها؟" },
      { english: ["Your", "flight", "leaves", "from", "gate", "number", "five"], kurdish: "گەشتەکەت لە دەروازەی ژمارە پێنجەوە دەفڕێت", arabic: "رحلتك تغادر من البوابة رقم خمسة." },
    ],
    fillBlanks: [
      { parts: ["Here is my", "pass and passport."], hint: "فەرموو ئەمە کارتی سواربوون و پاسپۆرتەکەمە.", answer: "boarding", wrongs: ["flying", "plane", "ticket"], arabicHint: "تفضل بطاقة الصعود إلى الطائرة وجواز سفري.", arabicParts: ["تفضل بطاقة","إلى الطائرة وجواز سفري."], arabicAnswer: "الصعود", arabicWrongs: ["الطيران","الطائرة","التذكرة"] },
      { parts: ["Is this your only", "bag?"], hint: "ئایا ئەمە تەنها جانتای دەستتە؟", answer: "carry-on", wrongs: ["hand", "small", "flight"], arabicHint: "هل هذه حقيبة يدك الوحيدة؟", arabicParts: ["هل هذه","الوحيدة؟"], arabicAnswer: "حقيبة يدك", arabicWrongs: ["حقيبة صغيرة","حقيبة طيران","حقيبة"] },
    ],
    conversations: [
      { situation: "لە مێزی پشکنین (Check-in) لە فڕۆکەخانە", theyAsk: "Can I see your passport and ticket, please? Are you checking any bags?", correct: "Here is my passport. Yes, I have one suitcase to check in, and this is my carry-on.", wrong1: "Of course. I have one large bag and one small bag.", wrong2: "Here's my passport. I'd like to check this suitcase.", wrong3: "Yes, I'm checking one bag today.", explanation: "وشەکانی 'suitcase', 'check in', و 'carry-on' وشەی بنەڕەتی و دروستن بۆ مامەڵەکردن لە فڕۆکەخانە", situationAr: "في مكتب تسجيل الدخول في المطار", explanationAr: "كلمات 'suitcase', 'check in', و 'carry-on' هي كلمات أساسية وصحيحة للتعامل في المطار." },
    ],
  },

  // Lesson 8: Checking into a Hotel
  {
    topic: "Hotel Check-in", topicKu: "وەرگرتنی ژوور لە هۆتێل", topicAr: "تسجيل الدخول في الفندق",
    words: [
      { english: "I have a reservation", kurdish: "حجزێکم هەیە", arabic: "لدي حجز" },
      { english: "Under the name",       kurdish: "بە ناوی...", arabic: "باسم..." },
      { english: "Is breakfast included", kurdish: "ئایا نانی بەیانی لەگەڵدایە؟", arabic: "هل الإفطار مشمول؟" },
      { english: "What time is check-out", kurdish: "کاتی جێهێشتنی ژوور کەییە؟", arabic: "متى وقت تسجيل الخروج؟" },
      { english: "Room key",             kurdish: "کلیلی ژوور", arabic: "مفتاح الغرفة" },
    ],
    voices: [
      { prompt: "پێدانی زانیاری حجزکردن", target: "I have a reservation for three nights under the name Ali.", targetKurdish: "حجزێکم هەیە بۆ سێ شەو بە ناوی عەلی.", promptAr: "تقديم معلومات الحجز", targetArabic: "لدي حجز لثلاث ليالٍ باسم علي." },
      { prompt: "پرسین لە کاتی جێهێشتن", target: "What time is check-out tomorrow morning?", targetKurdish: "سبەی بەیانی کاتی جێهێشتنی ژوور (چێک ئاوت) کەییە؟", promptAr: "السؤال عن وقت تسجيل الخروج", targetArabic: "متى وقت تسجيل الخروج صباح الغد؟" },
    ],
    sentences: [
      { english: ["Is", "breakfast", "included", "in", "the", "room", "price"], kurdish: "ئایا نانی بەیانی لە نرخی ژوورەکەدا هەژمار کراوە؟", arabic: "هل الإفطار مشمول في سعر الغرفة؟" },
      { english: ["Could", "I", "get", "a", "wake-up", "call", "at", "seven"], kurdish: "دەکرێت کاتژمێر حەوت تەلەفۆنم بۆ بکەن بۆ لەخەوهەستان؟", arabic: "هل يمكنني الحصول على مكالمة إيقاظ في السابعة؟" },
    ],
    fillBlanks: [
      { parts: ["I have a", "for two nights."], hint: "حجزێکم هەیە بۆ دوو شەو.", answer: "reservation", wrongs: ["booking", "room", "place"], arabicHint: "لدي حجز لليلتين.", arabicParts: ["لدي","لليلتين."], arabicAnswer: "حجز", arabicWrongs: ["حجز مسبق","غرفة","مكان"] },
      { parts: ["Is breakfast", "?"], hint: "ئایا نانی بەیانی لەگەڵدایە؟", answer: "included", wrongs: ["with", "there", "free"], arabicHint: "هل الإفطار مشمول؟", arabicParts: ["هل الإفطار","؟"], arabicAnswer: "مشمول", arabicWrongs: ["مع","هناك","مجاني"] },
    ],
    conversations: [
      { situation: "گەیشتن بە هۆتێل و وەرگرتنی ژوور", theyAsk: "Welcome to the Grand Hotel. How can I help you?", correct: "Hello, I have a reservation for three nights under the name Ahmed. Is breakfast included?", wrong1: "Hi, I booked a room for three nights.", wrong2: "Hello, I'm here to check in.", wrong3: "I have a reservation under Ahmed.", explanation: "'I have a reservation under the name...' ڕستەیەکی زۆر ستاندارد و فەرمییە بۆ وەرگرتنی ژووری هۆتێل", situationAr: "الوصول إلى الفندق وتسجيل الدخول", explanationAr: "'I have a reservation under the name...' هي جملة قياسية ورسمية جداً لتسجيل الدخول في الفندق." },
    ],
  },

  // Lesson 9: Supermarket & Groceries
  {
    topic: "Supermarket & Groceries", topicKu: "بازاڕکردن لە سوپەرمارکێت", topicAr: "السوبر ماركت ومحلات البقالة",
    words: [
      { english: "Shopping cart",        kurdish: "عەرەبانەی بازاڕکردن", arabic: "عربة التسوق" },
      { english: "Aisle",                kurdish: "ڕاڕەو (لەنێوان ڕەفەکاندا)", arabic: "ممر (بين الرفوف)" },
      { english: "On sale",              kurdish: "داشکاندنی بۆ کراوە", arabic: "معروض للبيع / عليه خصم" },
      { english: "Self-checkout",        kurdish: "ئامێری خۆ-حسابکردن", arabic: "الدفع الذاتي" },
      { english: "Paper or plastic",     kurdish: "کیسی کاغەز یان پلاستیک؟", arabic: "كيس ورقي أم بلاستيكي؟" },
    ],
    voices: [
      { prompt: "پرسیارکردن لە شوێنی شتێک", target: "Excuse me, which aisle is the milk in?", targetKurdish: "ببوورە، شیر لە کام ڕاڕەودایە؟", promptAr: "السؤال عن مكان شيء ما", targetArabic: "عفواً، في أي ممر يوجد الحليب؟" },
      { prompt: "پرسیارکردن لە نرخ", target: "Is this item on sale? I saw a sign outside.", targetKurdish: "ئایا داشکاندن بۆ ئەمە کراوە؟ لە دەرەوە تابلۆیەکم بینی.", promptAr: "السؤال عن السعر", targetArabic: "هل هذا المنتج معروض للبيع؟ رأيت لافتة في الخارج." },
    ],
    sentences: [
      { english: ["Could", "you", "tell", "me", "where", "the", "baking", "aisle", "is"], kurdish: "دەتوانیت پێم بڵێیت ڕاڕەوی کەلوپەلی هەویرکاری لە کوێیە؟", arabic: "هل يمكنك أن تخبرني أين ممر الخبز؟" },
      { english: ["I", "will", "use", "the", "self-checkout", "to", "save", "time"], kurdish: "ئامێری خۆ-حسابکردن بەکاردەهێنم بۆ ئەوەی کات بگەڕێنمەوە", arabic: "سأستخدم الدفع الذاتي لتوفير الوقت." },
    ],
    fillBlanks: [
      { parts: ["Excuse me, which", "is the bread in?"], hint: "ببوورە، نان لە کام ڕاڕەودایە؟", answer: "aisle", wrongs: ["hall", "path", "line"], arabicHint: "عفواً، في أي ممر يوجد الخبز؟", arabicParts: ["عفواً، في أي","يوجد الخبز؟"], arabicAnswer: "ممر", arabicWrongs: ["قاعة","طريق","خط"] },
      { parts: ["I need a shopping", "because I'm buying a lot."], hint: "پێویستم بە عەرەبانەیەکی بازاڕکردنە چونکە شتی زۆر دەکڕم.", answer: "cart", wrongs: ["bag", "box", "car"], arabicHint: "أحتاج إلى عربة تسوق لأنني أشتري الكثير.", arabicParts: ["أحتاج إلى","تسوق لأنني أشتري الكثير."], arabicAnswer: "عربة", arabicWrongs: ["حقيبة","صندوق","سيارة"] },
    ],
    conversations: [
      { situation: "لە سوپەرمارکێت بەدوای شتێکدا دەگەڕێیت", theyAsk: "Do you need help finding anything?", correct: "Yes, please. Which aisle is the milk in? Also, are these apples on sale?", wrong1: "Yes, I'm looking for the milk.", wrong2: "Could you show me where the dairy section is?", wrong3: "Are these apples discounted today?", explanation: "وشەی 'aisle' (ڕاڕەو) زۆر گرنگە لە سوپەرمارکێتدا و پیتی (s) تێیدا ناخوێندرێتەوە", situationAr: "تبحث عن شيء ما في السوبر ماركت", explanationAr: "كلمة 'aisle' (ممر) مهمة جداً في السوبر ماركت وحرف (s) فيها لا يُنطق." },
    ],
  },

];

export default normalUnit01;
