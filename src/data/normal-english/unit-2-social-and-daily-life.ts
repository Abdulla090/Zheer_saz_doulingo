import { UnitBank } from "../types";

// ── Visible Unit 6: Social & Practical English — 10 unique lessons ────────────
// Practical English for Kurdish speakers: Real-life scenarios, social interactions, and practical daily tasks.

const normalUnit01: UnitBank = [

  // Lesson 0: Greetings & Catching Up
  {
    topic: "Catching Up", topicKu: "هەواڵپرسین و بینینەوە", topicAr: "السؤال عن الحال واللقاء",
    words: [
      { english: "How have you been",  kurdish: "چۆن بوویت؟ (بۆ ماوەیەک کە نەتبینیوە)", arabic: "شلونك؟ (صارلي هواي مشايفك)" },
      { english: "It's been a while",  kurdish: "ماوەیەکە یەکمان نەدیوە", arabic: "صار هواية مشايفك" },
      { english: "What have you been up to", kurdish: "خەریکی چیت؟ (لەم ماوەیەدا)", arabic: "شجنت تسوي؟ (بالفترة الأخيرة)" },
      { english: "Let's catch up soon", kurdish: "با بە زوویی یەکتر ببینینەوە و قسە بکەین", arabic: "خلي نلتقي قريب ونسولف" },
      { english: "Taking it easy",     kurdish: "تەنها پشوو دەدەم / خۆم ماندوو ناکەم", arabic: "كاعد مرتاح / مماخذها بجدية" },
    ],
    voices: [
      { prompt: "سڵاوکردن لە هاوڕێیەک دوای ماوەیەک", target: "Hi, how have you been? It's been a while.", targetKurdish: "سڵاو، چۆن بوویت؟ ماوەیەکە یەکمان نەدیوە.", promptAr: "تسلم على صديق بعد فترة", targetArabic: "هلا، شلونك؟ صار هواية مشايفك." },
      { prompt: "کۆتایی پێهێنانی گفتوگۆیەکی کورت", target: "It was great seeing you. Let's catch up soon.", targetKurdish: "بینینت زۆر خۆش بوو. با بە زوویی یەکتر ببینینەوە.", promptAr: "تنهي محادثة قصيرة", targetArabic: "كلش فرحت بشوفتك. خلي نلتقي قريب." },
    ],
    sentences: [
      { english: ["What", "have", "you", "been", "up", "to", "lately"], kurdish: "لەم دواییانەدا خەریکی چی بوویت؟", arabic: "شجنت تسوي بالفترة الأخيرة؟" },
      { english: ["I'm", "just", "taking", "it", "easy", "these", "days"], kurdish: "ئەم ڕۆژانە تەنها پشوو دەدەم و خۆم ماندوو ناکەم", arabic: "بس كاعد مرتاح هالايام" },
    ],
    fillBlanks: [
      { parts: ["How have you", "lately?"], hint: "لەم دواییانەدا چۆن بوویت؟", answer: "been", wrongs: ["are", "is", "doing"], arabicHint: "شلونك هالأيام؟", arabicParts: ["شلونك","هالأيام؟"], arabicAnswer: "حالك", arabicWrongs: ["انت","تكون","تسوي"] },
      { parts: ["Let's catch", "over coffee next week."], hint: "با هەفتەی داهاتوو لەسەر قاوەیەک یەکتر ببینینەوە و قسە بکەین.", answer: "up", wrongs: ["out", "in", "on"], arabicHint: "خلي نلتقي ونسولف على كهوة السبوع الجاي.", arabicParts: ["خلي","ونسولف على كهوة السبوع الجاي."], arabicAnswer: "نلتقي", arabicWrongs: ["نطلع","ندخل","نروح"] },
    ],
    conversations: [
      { situation: "لە مۆڵێکدا بە ڕێکەوت هاوڕێیەکی کۆن دەبینیت", theyAsk: "Hey! I haven't seen you in months. How are you?", correct: "I've been great, thanks! What have you been up to these days?", wrong1: "I've been doing well, thanks.", wrong2: "Nothing much—how about you?", wrong3: "I'm good. What are you doing today?", explanation: "'How have you been' و 'What have you been up to' ڕێگەیەکی زۆر سروشتی و باوە بۆ هەواڵپرسین لە کەسێک کە ماوەیەکە نەتبینیوە", situationAr: "تلتقي بصديق قديم صدفة بمول", explanationAr: "'How have you been' و 'What have you been up to' هي طرق طبيعية وكلش شائعة حتى تسأل عن أحوال شخص صارلك هواية مشايفه." },
    ],
  },

  // Lesson 1: Making Plans & Inviting
  {
    topic: "Making Plans", topicKu: "دانانی پلان و بانگهێشتکردن", topicAr: "ترتيب الطلعات والدعوات",
    words: [
      { english: "Are you free",         kurdish: "کاتت هەیە؟ / بەتاڵیت؟", arabic: "فارغ؟ / عندك وكت؟" },
      { english: "Do you want to grab",  kurdish: "دەتەوێت بچین بۆ (خواردن/خواردنەوە)؟", arabic: "تريد نطلع ناكل/نشرب شي؟" },
      { english: "Does that work for you", kurdish: "ئەوە بۆ تۆ گونجاوە؟", arabic: "يناسبك هذا الشي؟" },
      { english: "Sounds like a plan",   kurdish: "بیرۆکەیەکی زۆر باشە (ڕازیبوون لەسەر پلانێک)", arabic: "خوش فكرة (موافقة على خطة)" },
      { english: "I'm tied up",          kurdish: "دەستم گیراوە / سەرقاڵم", arabic: "كلش مشغول / ملتهي" },
    ],
    voices: [
      { prompt: "پێشنیارکردنی چوونە دەرەوە", target: "Do you want to grab coffee tomorrow morning?", targetKurdish: "دەتەوێت بەیانی بچین قاوەیەک بخۆینەوە؟", promptAr: "تقترح تطلعون", targetArabic: "تريد نطلع نشرب كهوة باجر الصبح؟" },
      { prompt: "گونجاندنی کات", target: "Let's meet at six. Does that work for you?", targetKurdish: "با کاتژمێر شەش یەکتر ببینین. ئەوە بۆ تۆ گونجاوە؟", promptAr: "تتفق على موعد", targetArabic: "خلي نلتقي بالستة. يناسبك؟" },
    ],
    sentences: [
      { english: ["Are", "you", "free", "to", "meet", "up", "this", "weekend"], kurdish: "کاتت هەیە ئەم کۆتایی هەفتەیە یەکتر ببینین؟", arabic: "فارغ نلتقي بنهاية هالاسبوع؟" },
      { english: ["That", "sounds", "like", "a", "plan", "see", "you", "then"], kurdish: "بیرۆکەیەکی زۆر باشە، کەواتە دەتبینم", arabic: "خوش فكرة، اشوفك لعد" },
    ],
    fillBlanks: [
      { parts: ["Are you", "on Friday evening?"], hint: "ئێوارەی هەینی کاتت هەیە؟", answer: "free", wrongs: ["empty", "available", "good"], arabicHint: "فارغ يوم الجمعة بالليل؟", arabicParts: ["انت","يوم الجمعة بالليل؟"], arabicAnswer: "فارغ", arabicWrongs: ["خالي","موجود","زين"] },
      { parts: ["I'd love to, but I'm", "up with work."], hint: "حەزم دەکرد بێم، بەڵام دەستم گیراوە بە کارەوە.", answer: "tied", wrongs: ["busy", "stuck", "held"], arabicHint: "ياريت، بس كلش ملتهي بالشغل.", arabicParts: ["ياريت، بس","كلش بالشغل."], arabicAnswer: "ملتهي", arabicWrongs: ["مشغول","مرتبط","محبوس"] },
    ],
    conversations: [
      { situation: "دەتەوێت لەگەڵ هاوکارێکت بچیتە دەرەوە بۆ نانخواردن", theyAsk: "I'm getting hungry. Should we go eat?", correct: "Yeah, do you want to grab lunch at the new cafe? Does 1 PM work for you?", wrong1: "Sure, we could get lunch.", wrong2: "I'd like to eat around one.", wrong3: "Do you want to go to the cafe now?", explanation: "دەستەواژەی 'grab lunch/coffee' زۆر باوە لە ئینگلیزی ئاخاوتندا بۆ چوونە دەرەوەیەکی خێرا", situationAr: "تريد تطلع تتغدى وية زميلك", explanationAr: "عبارة 'grab lunch/coffee' كلش شائعة باللغة الانكليزية المحجية للطلعات السريعة." },
    ],
  },

  // Lesson 2: Ordering at a Restaurant
  {
    topic: "Dining Out", topicKu: "نانخواردن لە دەرەوە", topicAr: "الاكل برة",
    words: [
      { english: "I would like to order", kurdish: "دەمەوێت داوا بکەم", arabic: "اريد اطلب" },
      { english: "Could I have the bill", kurdish: "دەکرێت پسووڵەکە (حسابەکە) بێنیت؟", arabic: "تكدر تجيب القائمة (الحساب)؟" },
      { english: "On the side",          kurdish: "لە تەنیشتییەوە (وەک خواردنی لاوەکی)", arabic: "على صفحة (كطبق جانبي)" },
      { english: "I'll have the same",   kurdish: "منیش هەمان شت دەخۆم", arabic: "راح اخذ نفس الشي" },
      { english: "Keep the change",      kurdish: "باقیەکەی بۆ خۆت (وەک بەخشیش)", arabic: "خلي الباقي الك (اكرامية)" },
    ],
    voices: [
      { prompt: "داواکردنی خواردن بە شێوازێکی جوان", target: "I would like the grilled chicken with salad on the side, please.", targetKurdish: "تکایە، حەزم لە مریشکی برژاوەیە لەگەڵ زەڵاتە لە تەنیشتییەوە.", promptAr: "تطلب اكل بطريقة محترمة", targetArabic: "اريد دجاج شوي وية زلاطة على صفحة بلا زحمة." },
      { prompt: "داواکردنی پسووڵەی پارە", target: "Could we get the bill, please? We're ready to pay.", targetKurdish: "تکایە، دەکرێت پسووڵەکەمان بۆ بێنیت؟ ئامادەین بۆ پارەدان.", promptAr: "تطلب القائمة (الحساب)", targetArabic: "نكدر ناخذ القائمة بلا زحمة؟ احنة جاهزين ندفع." },
    ],
    sentences: [
      { english: ["Could", "I", "have", "the", "bill", "please"], kurdish: "دەکرێت پسووڵەکە بێنیت تکایە؟", arabic: "تكدر تجيب القائمة بلا زحمة؟" },
      { english: ["I'll", "have", "the", "same", "as", "him"], kurdish: "منیش هەمان شتی ئەو دەخۆم", arabic: "راح اخذ نفس الشي مثله." },
    ],
    fillBlanks: [
      { parts: ["I", "like to order the pasta."], hint: "حەزم لێیە پاستاکە داوا بکەم.", answer: "would", wrongs: ["want", "will", "can"], arabicHint: "اريد اطلب معكرونة.", arabicParts: ["اني","اطلب معكرونة."], arabicAnswer: "اريد", arabicWrongs: ["احب","راح","اكدر"] },
      { parts: ["Could we get some fries on the", "?"], hint: "دەکرێت کەمێک پەتاتەی سوورکراوە وەک خواردنی لاوەکی بێنین؟", answer: "side", wrongs: ["next", "plate", "part"], arabicHint: "نكدر نطلب شوية بتيتة مكلية على صفحة؟", arabicParts: ["نكدر نطلب شوية بتيتة مكلية على","؟"], arabicAnswer: "صفحة", arabicWrongs: ["اضافي","ماعون","جزء"] },
    ],
    conversations: [
      { situation: "نانخواردنەکەتان تەواو بووە و دەتەوێت بڕۆیت", theyAsk: "Can I get you anything else for dessert?", correct: "No, thank you. Could I have the bill, please?", wrong1: "No, thanks. We're ready to pay.", wrong2: "Nothing else, thank you.", wrong3: "Could you bring the check when you have a moment?", explanation: "'Could I have the bill, please?' باوترین و بەئەدەبترین ڕێگەیە بۆ داواکردنی حسابی چێشتخانە", situationAr: "خلصت اكل وتريد تطلع", explanationAr: "'Could I have the bill, please?' هي الطريقة الاكثر شيوعا وكلش محترمة حتى تطلب بيها حساب المطعم." },
    ],
  },

  // Lesson 3: Shopping & Bargaining
  {
    topic: "Shopping", topicKu: "بازاڕکردن", topicAr: "السوك والمكاسر",
    words: [
      { english: "I'm just browsing",    kurdish: "تەنها سەیر دەکەم (نامەوێت شت بکڕم لە ئێستادا)", arabic: "بس داباوع (ما اريد اشتري هسة)" },
      { english: "Do you have this in",  kurdish: "ئەمەتان هەیە بە (قەبارە/ڕەنگ)...؟", arabic: "عدكم من هذا بـ (قياس/لون)...؟" },
      { english: "Can I try it on",      kurdish: "دەتوانم تاقی بکەمەوە؟", arabic: "اكدر اجربه (اقيسه)؟" },
      { english: "Out of my budget",     kurdish: "لە سەرووی بودجەکەمەوەیە (گرانە)", arabic: "فوك ميزانيتي (غالي)" },
      { english: "Is that your best price", kurdish: "ئەوە دوا نرختە؟ / داشکاندن دەکەیت؟", arabic: "هذا اخر سعر؟ / تسوي خصم؟" },
    ],
    voices: [
      { prompt: "کاتێک پێویستت بە یارمەتی فرۆشیار نییە", target: "No thank you, I'm just browsing for now.", targetKurdish: "نەخێر سوپاس، تەنها سەیر دەکەم بۆ ئێستا.", promptAr: "من ما تحتاج مساعدة البياع", targetArabic: "لا شكراً، بس داباوع هسة." },
      { prompt: "مامەڵەکردن لەسەر نرخ", target: "It's a bit out of my budget. Is that your best price?", targetKurdish: "کەمێک لە سەرووی بودجەکەمەوەیە. ئەوە باشترین نرختە؟", promptAr: "تكاسر على السعر", targetArabic: "هذا شوية فوك ميزانيتي. هذا اخر سعر؟" },
    ],
    sentences: [
      { english: ["Do", "you", "have", "this", "in", "a", "medium"], kurdish: "ئەمەتان هەیە بە قەبارەی مامناوەند (میدیەم)؟", arabic: "عدكم من هذا بقياس وسط؟" },
      { english: ["Where", "is", "the", "fitting", "room", "please"], kurdish: "تکایە ژووری خۆگۆڕین لە کوێیە؟", arabic: "وين غرفة القياس بلا زحمة؟" },
    ],
    fillBlanks: [
      { parts: ["I'm just", ", thank you."], hint: "تەنها سەیر دەکەم، سوپاس.", answer: "browsing", wrongs: ["looking", "seeing", "watching"], arabicHint: "بس داباوع، شكراً.", arabicParts: ["بس","، شكراً."], arabicAnswer: "داباوع", arabicWrongs: ["اباوع","اشوف","اتفرج"] },
      { parts: ["Is that your", "price?"], hint: "ئەوە باشترین نرختە؟ (بۆ مامەڵەکردن)", answer: "best", wrongs: ["last", "final", "good"], arabicHint: "هذا احسن سعر عندك؟", arabicParts: ["هذا","سعر عندك؟"], arabicAnswer: "احسن", arabicWrongs: ["اخر","نهائي","زين"] },
    ],
    conversations: [
      { situation: "جلێک تاقی دەکەیتەوە بەڵام نرخەکەی گرانە", theyAsk: "How did the jacket fit? It looks great on you.", correct: "It fits perfectly, but it's a bit out of my budget. Do you offer any discounts?", wrong1: "It fits well, but it's more than I wanted to spend.", wrong2: "I like it, but the price is a little high for me.", wrong3: "Do you have a less expensive option?", explanation: "'A bit out of my budget' ڕێگەیەکی زۆر جوانە بۆ گوتنی ئەوەی کە شتێک گرانە بەبێ ئەوەی ڕاستەوخۆ بڵێیت گرانە", situationAr: "تقيس ملابس بس سعرها غالي", explanationAr: "'A bit out of my budget' هي طريقة كلش محترمة حتى تكول على شي غالي بدون ما تكولها بشكل مباشر." },
    ],
  },

  // Lesson 4: Asking for Directions
  {
    topic: "Asking for Directions", topicKu: "پرسین لە ناونیشان", topicAr: "تندل الطريق",
    words: [
      { english: "Could you point me to", kurdish: "دەتوانیت ڕێنماییم بکەیت بۆ...", arabic: "تكدر تدليني على..." },
      { english: "Walking distance",     kurdish: "دوورییەک کە بە پێ بڕۆیت", arabic: "مسافة مشي (قريبة تكدر تروحلها مشي)" },
      { english: "I'm a bit lost",       kurdish: "کەمێک ون بووم", arabic: "اني تايه شوية / مضيع الطريق" },
      { english: "Go straight ahead",    kurdish: "ڕاستەوخۆ بڕۆ پێشەوە", arabic: "امشي كبل" },
      { english: "Right around the corner", kurdish: "ڕێک لەو سووچەیە / زۆر نزیکە", arabic: "بالركن بالضبط / كلش قريب" },
    ],
    voices: [
      { prompt: "داوای یارمەتی بکە کاتێک ون بوویت", target: "Excuse me, I'm a bit lost. Could you point me to the train station?", targetKurdish: "ببوورە، کەمێک ون بووم. دەتوانیت ڕێنماییم بکەیت بۆ وێستگەی شەمەندەفەرەکە؟", promptAr: "اطلب مساعدة من تتيه", targetArabic: "بلا زحمة، اني تايه شوية. تكدر تدليني على محطة القطار؟" },
      { prompt: "پرسین لە دووری شوێنێک", target: "Is the museum within walking distance from here?", targetKurdish: "ئایا مۆزەخانەکە بە پێ لێرەوە نزیکە؟", promptAr: "تسأل عن مسافة مكان", targetArabic: "المتحف قريب منا بحيث ينراحله مشي؟" },
    ],
    sentences: [
      { english: ["Is", "it", "within", "walking", "distance", "from", "here"], kurdish: "ئایا لێرەوە ئەوەندە نزیکە کە بە پێ بڕۆین؟", arabic: "هذا قريب منا وينراحله مشي؟" },
      { english: ["Go", "straight", "ahead", "and", "take", "the", "second", "right"], kurdish: "ڕاستەوخۆ بڕۆ پێشەوە و بە دووەم لاڕێی لای ڕاستدا بڕۆ", arabic: "امشي كبل وبعدين لوف يمنى باللفة الثانية." },
    ],
    fillBlanks: [
      { parts: ["Could you", "me to the nearest bank?"], hint: "دەتوانیت ڕێنماییم بکەیت بۆ نزیکترین بانك؟", answer: "point", wrongs: ["show", "give", "tell"], arabicHint: "تكدر تدليني على اقرب بنك؟", arabicParts: ["تكدر","على اقرب بنك؟"], arabicAnswer: "تدليني", arabicWrongs: ["تشوفني","تنطيني","تكلي"] },
      { parts: ["Don't worry, it's right around the", "."], hint: "خەمت نەبێت، ڕێک لەو سووچەیە (زۆر نزیکە).", answer: "corner", wrongs: ["street", "way", "block"], arabicHint: "لا تدير بال، هو بالركن بالضبط.", arabicParts: ["لا تدير بال، هو بالضبط بالـ","."], arabicAnswer: "ركن", arabicWrongs: ["شارع","طريق","عمارة"] },
    ],
    conversations: [
      { situation: "لە شارێکی نوێیت و بەدوای میوانخانەکەدا دەگەڕێیت", theyAsk: "You look lost. Can I help you find something?", correct: "Yes, please. I'm looking for the Grand Hotel. Is it within walking distance?", wrong1: "Yes, could you tell me where the Grand Hotel is?", wrong2: "I'm trying to get to the Grand Hotel.", wrong3: "Could you point me toward the hotel?", explanation: "'Is it within walking distance?' پرسیارێکی زۆر باوە بۆ زانینی ئەوەی ئایا پێویست بە تەکسی دەکات یان نا", situationAr: "انت بمدينة جديدة وتدور على الفندق", explanationAr: "'Is it within walking distance?' هو سؤال كلش شائع حتى تعرف اذا تحتاج تكسي لو لا." },
    ],
  },

  // Lesson 5: Health & Seeing a Doctor
  {
    topic: "Health & Doctor", topicKu: "تەندروستی و سەردانی پزیشک", topicAr: "الصحة وزيارة الدكتور",
    words: [
      { english: "I'm not feeling well", kurdish: "هەست بە باشی ناکەم", arabic: "مدا احس نفسي زين / متخربط" },
      { english: "Make an appointment",  kurdish: "دانانی کات بۆ بینین (مەوعید)", arabic: "تحجز موعد" },
      { english: "I've been feeling dizzy", kurdish: "هەستم بە گێژبوونی سەر کردووە", arabic: "جنت دايخ / احس بدوخة" },
      { english: "Sore throat",          kurdish: "قورگ ئێشە", arabic: "بلاعيم / التهاب بلاعيم" },
      { english: "Prescription",         kurdish: "ڕەچەتەی پزیشک", arabic: "راجيتة (وصفة طبية)" },
    ],
    voices: [
      { prompt: "هەستکردن بە نەخۆشی", target: "I'm not feeling well today. I have a headache and a sore throat.", targetKurdish: "ئەمڕۆ هەست بە باشی ناکەم. سەرم دێشێت و قورگیشم دێشێت.", promptAr: "تحس نفسك مريض", targetArabic: "مدا احس نفسي زين اليوم. عندي وجع راس وبلاعيمي توجعني." },
      { prompt: "دانانی کات لای پزیشک", target: "I need to make an appointment. I've been feeling dizzy lately.", targetKurdish: "پێویستە کاتێک دابنێم. لەمدوایانەدا هەستم بە گێژبوون کردووە.", promptAr: "تحجز موعد يم الدكتور", targetArabic: "احتاج احجز موعد. جنت احس بدوخة بالفترة الاخيرة." },
    ],
    sentences: [
      { english: ["I", "need", "to", "make", "an", "appointment"], kurdish: "پێویستە کاتێک (مەوعیدێک) دابنێم", arabic: "احتاج احجز موعد" },
      { english: ["The", "doctor", "gave", "me", "a", "prescription"], kurdish: "پزیشکەکە ڕەچەتەیەکی پێدام", arabic: "انطاني الدكتور راجيتة" },
    ],
    fillBlanks: [
      { parts: ["I've been feeling a bit", "lately, like the room is spinning."], hint: "لەمدوایانەدا هەستم بە گێژبوون کردووە، وەک ئەوەی ژوورەکە بسوڕێتەوە.", answer: "dizzy", wrongs: ["tired", "sick", "weak"], arabicHint: "جنت احس بدوخة بالفترة الاخيرة، عبالك الغرفة تفتر بيه.", arabicParts: ["جنت احس بشوية","بالفترة الاخيرة، عبالك الغرفة تفتر بيه."], arabicAnswer: "دوخة", arabicWrongs: ["تعب","مرض","ضعف"] },
      { parts: ["I need to drop off this", "at the pharmacy."], hint: "پێویستە ئەم ڕەچەتەیە ببەمە دەرمانخانەکە.", answer: "prescription", wrongs: ["paper", "medicine", "note"], arabicHint: "احتاج اودي هاي الراجيتة للصيدلية.", arabicParts: ["احتاج اودي هاي","للصيدلية."], arabicAnswer: "الراجيتة", arabicWrongs: ["الورقة","الدوا","الملاحظة"] },
    ],
    conversations: [
      { situation: "تەلەفۆن بۆ نۆرینگەی پزیشک دەکەیت", theyAsk: "City Clinic, how can I help you?", correct: "Hi, I'm not feeling well and I've had a sore throat for days. I'd like to make an appointment, please.", wrong1: "Hi, I'd like to schedule a doctor's appointment.", wrong2: "I've had a sore throat and don't feel well.", wrong3: "Do you have any appointments available today?", explanation: "'I'd like to make an appointment' باشترین شێوازە. لە ئینگلیزیدا وشەی 'appointment' بەکاردێت بۆ دانانی کات لای پزیشک، نەک 'meeting' یان 'time'", situationAr: "تخابر عيادة الدكتور", explanationAr: "'I'd like to make an appointment' هي احسن طريقة. بالانكليزي، تستخدم كلمة 'appointment' حتى تحجز موعد يم الدكتور، مو 'meeting' ولا 'time'." },
    ],
  },

  // Lesson 6: Expressing Emotions & Empathy
  {
    topic: "Emotions & Empathy", topicKu: "هەستەکان و هاوسۆزی", topicAr: "التعبير عن المشاعر والمواساة",
    words: [
      { english: "I'm absolutely thrilled", kurdish: "زۆر زۆر دڵخۆشم / بەپەرۆشم", arabic: "اني كلش فرحان / كلش متحمس" },
      { english: "I'm so sorry to hear that", kurdish: "زۆر خەفەتم خوارد کە ئەوەم بیست", arabic: "كلش انقهرت من سمعت هيج" },
      { english: "It's so frustrating",   kurdish: "ئەمە زۆر بێزارکەرە (کاتێک شتێک بە دڵی تۆ ناڕوات)", arabic: "هذا الشي كلش يقهر / يضوج" },
      { english: "That's such a relief",  kurdish: "ئەوە جێگەی دڵنەواییە (سووکنایی)", arabic: "هذا الشي يريح الكلب / ارتاحيت" },
      { english: "I can't believe it",    kurdish: "بڕوا ناکەم (لە سەرسووڕماندا)", arabic: "مدا اصدك (متفاجئ)" },
    ],
    voices: [
      { prompt: "دڵخۆشییەکی زۆر دەرببڕە", target: "I'm absolutely thrilled about the new job!", targetKurdish: "زۆر زۆر دڵخۆشم بە کارە نوێیەکە!", promptAr: "عبر عن فرحة چبيرة", targetArabic: "اني كلش فرحان بالشغل الجديد!" },
      { prompt: "هاوسۆزی بۆ هەواڵێکی ناخۆش", target: "I'm so sorry to hear that you've been unwell.", targetKurdish: "زۆر خەفەتم خوارد کە بیستم نەخۆش بوویت.", promptAr: "واسي شخص على خبر محلو", targetArabic: "كلش انقهرت من سمعت بيك جنت مريض." },
    ],
    sentences: [
      { english: ["That's", "such", "a", "relief", "to", "know"], kurdish: "ئەوە جێگەی دڵنەواییە کە ئەوە دەزانم", arabic: "ارتاحيت من عرفت بهالشي" },
      { english: ["It's", "so", "frustrating", "when", "things", "go", "wrong"], kurdish: "زۆر بێزارکەرە کاتێک شتەکان هەڵە دەبن", arabic: "الوضع كلش يضوج من تتعقد الامور" },
    ],
    fillBlanks: [
      { parts: ["I'm absolutely", "to be joining your team!"], hint: "زۆر زۆر دڵخۆشم کە پەیوەندی بە تیمەکەتانەوە دەکەم!", answer: "thrilled", wrongs: ["happy", "glad", "good"], arabicHint: "اني كلش متحمس انضم لفريقكم!", arabicParts: ["اني كلش","انضم لفريقكم!"], arabicAnswer: "متحمس", arabicWrongs: ["فرحان","مسرور","زين"] },
      { parts: ["That's such a", "— I thought I lost my wallet."], hint: "ئەوە جێگەی سووکناییە — پێم وابوو جزدانەکەم ون کردووە.", answer: "relief", wrongs: ["good thing", "luck", "break"], arabicHint: "كلش ارتاحيت — عبالي ضيعت محفظتي.", arabicParts: ["كلش","— عبالي ضيعت محفظتي."], arabicAnswer: "ارتاحيت", arabicWrongs: ["شي زين","حظ","راحة"] },
    ],
    conversations: [
      { situation: "هاوڕێیەکەت پێت دەڵێت کە تاقیکردنەوەیەکی قورسی دەرچووە", theyAsk: "I finally passed my driving test! I was so stressed.", correct: "That's such a relief! I'm absolutely thrilled for you.", wrong1: "That's great news—congratulations!", wrong2: "I'm really happy for you.", wrong3: "You must be so relieved.", explanation: "'That's such a relief' و 'absolutely thrilled' کاردانەوەی زۆر سروشتی و بەهێزن لە ئینگلیزیدا لەبری تەنها وتنێکی سادەی 'I am happy'", situationAr: "صديقك يكلك انه نجح بامتحان صعب", explanationAr: "'That's such a relief' و 'absolutely thrilled' هي ردود فعل طبيعية وكلش قوية بالانكليزي بدال ما تكول بس 'I am happy'." },
    ],
  },

  // Lesson 7: Travel & Airport English
  {
    topic: "Airport & Flights", topicKu: "فڕۆکەخانە و گەشتەکان", topicAr: "المطار والطيارات",
    words: [
      { english: "Where is the check-in desk", kurdish: "مێزی پشکنین (چێک ئین) لە کوێیە؟", arabic: "وين مكتب الجيك ان (تسجيل الدخول)؟" },
      { english: "Boarding pass",        kurdish: "بلیت یان کارتی سواربوون", arabic: "البوردنك (بطاقة الطيارة)" },
      { english: "Any luggage to check", kurdish: "هیچ جانتایەکت هەیە بیدەیتە بار؟", arabic: "عندك جنط تريد تشحنها؟" },
      { english: "Gate number",          kurdish: "ژمارەی دەروازە", arabic: "رقم البوابة" },
      { english: "Carry-on bag",         kurdish: "جانتای دەست (کە دەچێتە ناو فڕۆکە)", arabic: "جنطة ايد (اللي تصعدها وياك للطيارة)" },
    ],
    voices: [
      { prompt: "پرسین لە مێزی پشکنین", target: "Excuse me, where is the check-in desk for this flight?", targetKurdish: "ببوورە، مێزی پشکنین بۆ ئەم گەشتە لە کوێیە؟", promptAr: "تسأل عن مكتب الجيك ان", targetArabic: "بلا زحمة، وين مكتب الجيك ان لهالرحلة؟" },
      { prompt: "پێدانی پاسپۆرت لە فڕۆکەخانە", target: "Here is my passport and ticket.", targetKurdish: "فەرموو ئەمە پاسپۆرت و بلیتەکەمە.", promptAr: "تنطي جوازك بالمطار", targetArabic: "تفضل، هذا جوازي وتذكرتي." },
    ],
    sentences: [
      { english: ["Do", "you", "have", "any", "luggage", "to", "check", "in"], kurdish: "هیچ جانتایەکت هەیە بۆ پشکنین (بار)؟", arabic: "عندك اي جنط تريد تشحنها؟" },
      { english: ["Your", "flight", "leaves", "from", "gate", "number", "five"], kurdish: "گەشتەکەت لە دەروازەی ژمارە پێنجەوە دەفڕێت", arabic: "رحلتك تطلع من البوابة رقم خمسة." },
    ],
    fillBlanks: [
      { parts: ["Here is my", "pass and passport."], hint: "فەرموو ئەمە کارتی سواربوون و پاسپۆرتەکەمە.", answer: "boarding", wrongs: ["flying", "plane", "ticket"], arabicHint: "تفضل هذا البوردنك وجوازي.", arabicParts: ["تفضل","وجوازي."], arabicAnswer: "البوردنك", arabicWrongs: ["الطيران","الطيارة","التذكرة"] },
      { parts: ["Is this your only", "bag?"], hint: "ئایا ئەمە تەنها جانتای دەستتە؟", answer: "carry-on", wrongs: ["hand", "small", "flight"], arabicHint: "هاي جنطة ايدك الوحيدة؟", arabicParts: ["هاي","الوحيدة؟"], arabicAnswer: "جنطة ايدك", arabicWrongs: ["جنطة صغيرة","جنطة طيران","جنطة"] },
    ],
    conversations: [
      { situation: "لە مێزی پشکنین (Check-in) لە فڕۆکەخانە", theyAsk: "Can I see your passport and ticket, please? Are you checking any bags?", correct: "Here is my passport. Yes, I have one suitcase to check in, and this is my carry-on.", wrong1: "Of course. I have one large bag and one small bag.", wrong2: "Here's my passport. I'd like to check this suitcase.", wrong3: "Yes, I'm checking one bag today.", explanation: "وشەکانی 'suitcase', 'check in', و 'carry-on' وشەی بنەڕەتی و دروستن بۆ مامەڵەکردن لە فڕۆکەخانە", situationAr: "بمكتب الجيك ان بالمطار", explanationAr: "كلمات 'suitcase', 'check in', و 'carry-on' هي كلمات اساسية وكلش مهمة حتى تتعامل بيها بالمطار." },
    ],
  },

  // Lesson 8: Checking into a Hotel
  {
    topic: "Hotel Check-in", topicKu: "وەرگرتنی ژوور لە هۆتێل", topicAr: "تسجيل الدخول بالفندق",
    words: [
      { english: "I have a reservation", kurdish: "حجزێکم هەیە", arabic: "عندي حجز" },
      { english: "Under the name",       kurdish: "بە ناوی...", arabic: "باسم..." },
      { english: "Is breakfast included", kurdish: "ئایا نانی بەیانی لەگەڵدایە؟", arabic: "الريوك مشمول؟" },
      { english: "What time is check-out", kurdish: "کاتی جێهێشتنی ژوور کەییە؟", arabic: "شوكت وقت الجيك اوت (الخروج)؟" },
      { english: "Room key",             kurdish: "کلیلی ژوور", arabic: "مفتاح الغرفة" },
    ],
    voices: [
      { prompt: "پێدانی زانیاری حجزکردن", target: "I have a reservation for three nights under the name Ali.", targetKurdish: "حجزێکم هەیە بۆ سێ شەو بە ناوی عەلی.", promptAr: "تنطي معلومات حجزك", targetArabic: "عندي حجز لثلاث ليالي باسم علي." },
      { prompt: "پرسین لە کاتی جێهێشتن", target: "What time is check-out tomorrow morning?", targetKurdish: "سبەی بەیانی کاتی جێهێشتنی ژوور (چێک ئاوت) کەییە؟", promptAr: "تسأل عن وقت تسجيل الخروج (الجيك اوت)", targetArabic: "شوكت وقت الجيك اوت باجر الصبح؟" },
    ],
    sentences: [
      { english: ["Is", "breakfast", "included", "in", "the", "room", "price"], kurdish: "ئایا نانی بەیانی لە نرخی ژوورەکەدا هەژمار کراوە؟", arabic: "الريوك مشمول بسعر الغرفة؟" },
      { english: ["Could", "I", "get", "a", "wake-up", "call", "at", "seven"], kurdish: "دەکرێت کاتژمێر حەوت تەلەفۆنم بۆ بکەن بۆ لەخەوهەستان؟", arabic: "تكدرون تخابروني وتكعدوني بسبعة؟" },
    ],
    fillBlanks: [
      { parts: ["I have a", "for two nights."], hint: "حجزێکم هەیە بۆ دوو شەو.", answer: "reservation", wrongs: ["booking", "room", "place"], arabicHint: "عندي حجز لليلتين.", arabicParts: ["عندي","لليلتين."], arabicAnswer: "حجز", arabicWrongs: ["حجز مسبق","غرفة","مكان"] },
      { parts: ["Is breakfast", "?"], hint: "ئایا نانی بەیانی لەگەڵدایە؟", answer: "included", wrongs: ["with", "there", "free"], arabicHint: "الريوك مشمول؟", arabicParts: ["الريوك","؟"], arabicAnswer: "مشمول", arabicWrongs: ["وية","هناك","بلاش"] },
    ],
    conversations: [
      { situation: "گەیشتن بە هۆتێل و وەرگرتنی ژوور", theyAsk: "Welcome to the Grand Hotel. How can I help you?", correct: "Hello, I have a reservation for three nights under the name Ahmed. Is breakfast included?", wrong1: "Hi, I booked a room for three nights.", wrong2: "Hello, I'm here to check in.", wrong3: "I have a reservation under Ahmed.", explanation: "'I have a reservation under the name...' ڕستەیەکی زۆر ستاندارد و فەرمییە بۆ وەرگرتنی ژووری هۆتێل", situationAr: "توصل للفندق وتسجل دخول (جيك ان)", explanationAr: "'I have a reservation under the name...' جملة كلش ستاندر ورسمية حتى تسجل دخول بالفندق." },
    ],
  },

  // Lesson 9: Supermarket & Groceries
  {
    topic: "Supermarket & Groceries", topicKu: "بازاڕکردن لە سوپەرمارکێت", topicAr: "السوبر ماركت والمسواك",
    words: [
      { english: "Shopping cart",        kurdish: "عەرەبانەی بازاڕکردن", arabic: "عربانة التسوق" },
      { english: "Aisle",                kurdish: "ڕاڕەو (لەنێوان ڕەفەکاندا)", arabic: "ممر (بين الرفوف)" },
      { english: "On sale",              kurdish: "داشکاندنی بۆ کراوە", arabic: "عليه تنزيلات / خصم" },
      { english: "Self-checkout",        kurdish: "ئامێری خۆ-حسابکردن", arabic: "الدفع الذاتي / تحاسب بنفسك" },
      { english: "Paper or plastic",     kurdish: "کیسی کاغەز یان پلاستیک؟", arabic: "علاكة ورقية لو نايلون؟" },
    ],
    voices: [
      { prompt: "پرسیارکردن لە شوێنی شتێک", target: "Excuse me, which aisle is the milk in?", targetKurdish: "ببوورە، شیر لە کام ڕاڕەودایە؟", promptAr: "تسأل على مكان شي", targetArabic: "بلا زحمة، بيا ممر الكى الحليب؟" },
      { prompt: "پرسیارکردن لە نرخ", target: "Is this item on sale? I saw a sign outside.", targetKurdish: "ئایا داشکاندن بۆ ئەمە کراوە؟ لە دەرەوە تابلۆیەکم بینی.", promptAr: "تسأل على السعر", targetArabic: "هذا عليه تنزيلات؟ شفت قطعة برة." },
    ],
    sentences: [
      { english: ["Could", "you", "tell", "me", "where", "the", "baking", "aisle", "is"], kurdish: "دەتوانیت پێم بڵێیت ڕاڕەوی کەلوپەلی هەویرکاری لە کوێیە؟", arabic: "تكدر تكلي وين ممر الخبز بلا زحمة؟" },
      { english: ["I", "will", "use", "the", "self-checkout", "to", "save", "time"], kurdish: "ئامێری خۆ-حسابکردن بەکاردەهێنم بۆ ئەوەی کات بگەڕێنمەوە", arabic: "راح استخدم الدفع الذاتي حتى اختصر الوقت." },
    ],
    fillBlanks: [
      { parts: ["Excuse me, which", "is the bread in?"], hint: "ببوورە، نان لە کام ڕاڕەودایە؟", answer: "aisle", wrongs: ["hall", "path", "line"], arabicHint: "بلا زحمة، بيا ممر الكى الخبز؟", arabicParts: ["بلا زحمة، بيا","الكى الخبز؟"], arabicAnswer: "ممر", arabicWrongs: ["قاعة","طريق","خط"] },
      { parts: ["I need a shopping", "because I'm buying a lot."], hint: "پێویستم بە عەرەبانەیەکی بازاڕکردنە چونکە شتی زۆر دەکڕم.", answer: "cart", wrongs: ["bag", "box", "car"], arabicHint: "احتاج عربانة تسوق لان راح اشتري هواية.", arabicParts: ["احتاج","تسوق لان راح اشتري هواية."], arabicAnswer: "عربانة", arabicWrongs: ["جنطة","صندوق","سيارة"] },
    ],
    conversations: [
      { situation: "لە سوپەرمارکێت بەدوای شتێکدا دەگەڕێیت", theyAsk: "Do you need help finding anything?", correct: "Yes, please. Which aisle is the milk in? Also, are these apples on sale?", wrong1: "Yes, I'm looking for the milk.", wrong2: "Could you show me where the dairy section is?", wrong3: "Are these apples discounted today?", explanation: "وشەی 'aisle' (ڕاڕەو) زۆر گرنگە لە سوپەرمارکێتدا و پیتی (s) تێیدا ناخوێندرێتەوە", situationAr: "تدور على شي بالسوبر ماركت", explanationAr: "كلمة 'aisle' (ممر) كلش مهمة بالسوبر ماركت وحرف (s) بيها ما ينلفظ." },
    ],
  },

];

export default normalUnit01;
