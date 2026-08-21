import { UnitBank } from "../types";

// ── Visible Unit 9: Travel & Exploring — 10 unique lessons ───────────────────
// Advanced travel vocabulary for navigating airports, cities, emergencies, and new cultures.

const normalUnit05: UnitBank = [

  // Lesson 0: Immigration & Customs
  {
    topic: "Immigration & Customs", topicKu: "پاسپۆرت و گومرگ (لە فڕۆکەخانە)", topicAr: "الهجرة والكمارك",
    words: [
      { english: "Purpose of your visit", kurdish: "مەبەست لە سەردانەکەت (گەشتەکەت)", arabic: "شنو الغرض من زيارتك" },
      { english: "Declare anything",     kurdish: "ئاشکراکردنی شتێک (بۆ گومرگ - شتێک کە باجی لەسەرە)", arabic: "عندك شي تصرح عنه" },
      { english: "Duration of stay",     kurdish: "ماوەی مانەوە", arabic: "شكد راح تبقى" },
      { english: "Connecting flight",    kurdish: "گەشتی ترانزێت (گۆڕینی فڕۆکە)", arabic: "رحلة ترانزيت" },
      { english: "Return ticket",        kurdish: "بلیتی گەڕانەوە", arabic: "تكت رجعة" },
    ],
    voices: [
      { prompt: "پرسیاری پاسەوانی سنوور", target: "What is the purpose of your visit to this country?", targetKurdish: "مەبەست لە سەردانەکەت بۆ ئەم وڵاتە چییە؟", promptAr: "سؤال شرطة الحدود", targetArabic: "شنو الغرض من زيارتك لهل بلد؟" },
      { prompt: "ئاماژەدان بە کاتی گەڕانەوە", target: "I have a return ticket for the 15th of next month.", targetKurdish: "بلیتی گەڕانەوەم هەیە بۆ ڕۆژی ١٥ی مانگی داهاتوو.", promptAr: "توضيح وقت الرجعة", targetArabic: "عندي تكت رجعة يوم 15 بالشهر الجاي." },
    ],
    sentences: [
      { english: ["Do", "you", "have", "anything", "to", "declare", "at", "customs"], kurdish: "ئایا هیچ شتێکت پێیە کە پێویست بکات لە گومرگ ئاشکرای بکەیت؟", arabic: "عندك شي تصرح عنه بالكمارك؟" },
      { english: ["My", "duration", "of", "stay", "will", "be", "two", "weeks"], kurdish: "ماوەی مانەوەکەم دوو هەفتە دەبێت", arabic: "راح أبقى أسبوعين" },
    ],
    fillBlanks: [
      { parts: ["I am here on vacation. The", "of my visit is tourism."], hint: "بۆ پشوو لێرەم. مەبەست لە گەشتەکەم گەشتیارییە.", answer: "purpose", wrongs: ["reason", "way", "idea"], arabicHint: "أني هنا بإجازة. الغرض من زيارتي هو السياحة.", arabicParts: ["أني هنا بإجازة.","من زيارتي هو السياحة."], arabicAnswer: "الغرض", arabicWrongs: ["السبب","الطريقة","الفكرة"] },
      { parts: ["I need to catch my", "flight to London at gate 4."], hint: "پێویستە بگەڕێمەوە بە گەشتی ترانزێتەکەم (گۆڕینی فڕۆکەکەم) بۆ لەندەن لە دەروازەی ٤.", answer: "connecting", wrongs: ["second", "next", "moving"], arabicHint: "لازم ألحگ على رحلة الترانزيت للندن ببوابة 4.", arabicParts: ["لازم ألحگ على رحلة","مالتي للندن ببوابة 4."], arabicAnswer: "الترانزيت", arabicWrongs: ["الثانية","التالية","المتحركة"] },
    ],
    conversations: [
      { situation: "لە بەردەم ئەفسەری پاسپۆرت", theyAsk: "Welcome. May I see your passport? What is the purpose of your visit?", correct: "Here is my passport. The purpose of my visit is tourism. My duration of stay is exactly two weeks.", wrong1: "I'm here on vacation for two weeks.", wrong2: "I'm visiting the country as a tourist.", wrong3: "I'll be staying for exactly two weeks.", explanation: "'Purpose of your visit' و 'duration of stay' پرسیارە فەرمییەکانی هەموو فڕۆکەخانەیەکن", situationAr: "كبال ضابط الجوازات", explanationAr: "'شنو الغرض من زيارتك' و 'شكد راح تبقى' هي أسئلة رسمية بكل المطارات" },
    ],
  },

  // Lesson 1: Renting a Car Abroad
  {
    topic: "Renting a Car", topicKu: "کرێکردنی ئۆتۆمبێل (لە دەرەوەی وڵات)", topicAr: "تأجير سيارة",
    words: [
      { english: "International driving permit", kurdish: "مۆڵەتی شۆفێریی نێودەوڵەتی", arabic: "إجازة سوق دولية" },
      { english: "Full coverage insurance", kurdish: "دڵنیایی (تەئمینی) گشتگیر", arabic: "تأمين شامل" },
      { english: "Unlimited mileage",    kurdish: "کیلۆمەتری بێسنوور (بۆ لێخوڕین)", arabic: "كيلومترات مفتوحة" },
      { english: "Drop-off location",    kurdish: "شوێنی ڕادەستکردنەوە (دانانەوەی ئۆتۆمبێلەکە)", arabic: "مكان التسليم" },
      { english: "Manual or automatic",  kurdish: "گێڕی عادی یان ئۆتۆماتیک", arabic: "عادي لو أوتوماتيك" },
    ],
    voices: [
      { prompt: "پرسیارکردن دەربارەی دڵنیایی", target: "I would like to add full coverage insurance to my rental.", targetKurdish: "حەز دەکەم دڵنیایی گشتگیر (تەئمینی فول) زیاد بکەم بۆ کرێی ئۆتۆمبێلەکەم.", promptAr: "السؤال عن التأمين", targetArabic: "أريد أضيف تأمين شامل على السيارة اللي أجرتها." },
      { prompt: "شوێنی دانانەوەی ئۆتۆمبێل", target: "Can I choose a different drop-off location?", targetKurdish: "دەتوانم شوێنێکی جیاواز هەڵبژێرم بۆ ڕادەستکردنەوەی ئۆتۆمبێلەکە؟", promptAr: "مكان تسليم السيارة", targetArabic: "أكدر أختار مكان تسليم مختلف؟" },
    ],
    sentences: [
      { english: ["Do", "you", "need", "an", "international", "driving", "permit", "here"], kurdish: "لێرە پێویستت بە مۆڵەتی شۆفێریی نێودەوڵەتییە؟", arabic: "تحتاج إجازة سوق دولية هنا؟" },
      { english: ["Does", "this", "car", "come", "with", "unlimited", "mileage"], kurdish: "ئایا ئەم ئۆتۆمبێلە کیلۆمەتری بێسنووری لەگەڵدایە؟", arabic: "هاي السيارة بيها كيلومترات مفتوحة؟" },
    ],
    fillBlanks: [
      { parts: ["I only know how to drive an", "transmission."], hint: "تەنها دەزانم ئۆتۆمبێلی گێڕ ئۆتۆماتیک لێبخوڕم.", answer: "automatic", wrongs: ["easy", "normal", "fast"], arabicHint: "أعرف أسوق بس سيارة أوتوماتيك.", arabicParts: ["أعرف أسوق بس سيارة","."], arabicAnswer: "أوتوماتيك", arabicWrongs: ["سهل","عادي","سريع"] },
      { parts: ["Make sure you have full", "insurance just in case."], hint: "دڵنیابەرەوە کە دڵنیایی گشتگیرت (فول تەئمین) هەیە نەوەک شتێک ڕووبدات.", answer: "coverage", wrongs: ["cover", "money", "paper"], arabicHint: "تأكد إنو عندك تأمين شامل خاف يصير شي.", arabicParts: ["تأكد إنو عندك","شامل خاف يصير شي."], arabicAnswer: "تأمين", arabicWrongs: ["غطاء","مال","ورق"] },
    ],
    conversations: [
      { situation: "لە کۆمپانیای کرێدانی ئۆتۆمبێل", theyAsk: "We have an SUV available. Would you like basic or full insurance?", correct: "I'll take the full coverage insurance, please. Also, does the rental include unlimited mileage?", wrong1: "I'd prefer the full insurance option.", wrong2: "Does the full coverage include damage to the vehicle?", wrong3: "Is there a mileage limit on the rental?", explanation: "کۆمپانیاکانی کرێدانی ئۆتۆمبێل زاراوەی وەک 'Coverage' (دڵنیایی) و 'Mileage' (دووری) بەکاردەهێنن", situationAr: "بشركة تأجير السيارات", explanationAr: "شركات تأجير السيارات تستخدم مصطلحات مثل 'التغطية' (التأمين) و 'عدد الأميال' (المسافة)" },
    ],
  },

  // Lesson 2: Navigating Public Transport
  {
    topic: "Public Transport", topicKu: "گواستنەوەی گشتی (مترۆ، پاس)", topicAr: "المواصلات العامة",
    words: [
      { english: "Which line goes to",   kurdish: "کام هێڵ دەچێت بۆ...", arabic: "يا خط يروح لـ..." },
      { english: "Round trip ticket",    kurdish: "بلیتی چوون و هاتنەوە", arabic: "تكت روحة ورجعة" },
      { english: "Mind the gap",         kurdish: "ئاگاداری بۆشاییەکە بە (نێوان شەمەندەفەر و سەکۆکە)", arabic: "دير بالك من الفراغ" },
      { english: "Rush hour",            kurdish: "کاتی قەرەباڵغی (کاتی چوونە سەر کار و گەڕانەوە)", arabic: "وقت الازدحام" },
      { english: "Transfer at the next stop", kurdish: "گۆڕین (دابەزین بۆ هێڵێکی تر) لە وێستگەی داهاتوو", arabic: "بدل الخط بالمحطة الجاية" },
    ],
    voices: [
      { prompt: "کڕینی بلیتی گەڕانەوە", target: "I would like one round trip ticket to the city center.", targetKurdish: "یەک بلیتی چوون و هاتنەوەم دەوێت بۆ سەنتەری شار.", promptAr: "شراء تكت روحة ورجعة", targetArabic: "أريد تكت روحة ورجعة لمركز المدينة." },
      { prompt: "پرسیارکردن لە ڕێگا", target: "Excuse me, which line goes to the central station?", targetKurdish: "ببوورە، کام هێڵ دەچێت بۆ وێستگەی ناوەندی؟", promptAr: "السؤال عن الطريق", targetArabic: "عفواً، يا خط يروح للمحطة المركزية؟" },
    ],
    sentences: [
      { english: ["You", "need", "to", "transfer", "at", "the", "next", "stop"], kurdish: "پێویستە لە وێستگەی داهاتوو دابەزیت بۆ گۆڕینی هێڵەکە", arabic: "لازم تبدل الخط بالمحطة الجاية" },
      { english: ["The", "trains", "are", "very", "packed", "during", "rush", "hour"], kurdish: "شەمەندەفەرەکان زۆر قەرەباڵغن لە کاتی چونە سەر کاردا", arabic: "القطارات كلش مزدحمة بوقت الازدحام" },
    ],
    fillBlanks: [
      { parts: ["Please stand back and", "the gap."], hint: "تکایە بگەڕێرەوە دواوە و ئاگاداری بۆشاییەکە (نێوان شەمەندەفەر و وێستگەکە) بە.", answer: "mind", wrongs: ["watch", "look", "see"], arabicHint: "رجاءً ارجع ليورة ودير بالك من الفراغ.", arabicParts: ["رجاءً ارجع ليورة و","من الفراغ."], arabicAnswer: "دير بالك", arabicWrongs: ["باوع","شوف","انتبه"] },
      { parts: ["A one-way ticket is $5, and a", "trip is $9."], hint: "بلیتی یەک ئاراستە ٥ دۆلارە، و بلیتی چوون و هاتنەوە ٩ دۆلارە.", answer: "round", wrongs: ["two", "both", "full"], arabicHint: "تكت الروحة بـ 5 دولارات، وتكت الروحة والرجعة بـ 9 دولارات.", arabicParts: ["تكت الروحة بـ 5 دولارات، وتكت الروحة و","بـ 9 دولارات."], arabicAnswer: "الرجعة", arabicWrongs: ["اثنين","كلاهما","الكاملة"] },
    ],
    conversations: [
      { situation: "پرسیارکردن لە کارمەندێکی میترۆ", theyAsk: "Can I help you find your train?", correct: "Yes, please. Which line goes to the museum? And do I need to transfer at the next stop?", wrong1: "Yes, which train should I take to the museum?", wrong2: "Could you tell me whether I need to change trains?", wrong3: "Which subway line stops near the museum?", explanation: "'Which line goes to' و 'Transfer' دوو وشەی سەرەکین لە سیستەمی گواستنەوەی وڵاتاندا", situationAr: "سؤال موظف المترو", explanationAr: "'يا خط يروح لـ' و 'بدل' كلمات أساسية بأنظمة النقل بالدول" },
    ],
  },

  // Lesson 3: Dealing with Lost Luggage
  {
    topic: "Lost Luggage", topicKu: "ونبوونی جانتا (لە فڕۆکەخانە)", topicAr: "الجنط الضايعة",
    words: [
      { english: "My luggage hasn't arrived", kurdish: "جانتاکانم (کەلوپەلەکانم) نەگەیشتوون", arabic: "جنطي ما وصلت" },
      { english: "Baggage claim",        kurdish: "شوێنی وەرگرتنەوەی جانتا", arabic: "استلام الجنط" },
      { english: "File a missing baggage report", kurdish: "فۆڕمی ونبوونی جانتا پڕبکەرەوە", arabic: "تقديم بلاغ عن جنط ضايعة" },
      { english: "Luggage tag",          kurdish: "تاگی جانتا (ئەو لەزگەیەی بە جانتاکەوەیە)", arabic: "تاك الجنطة" },
      { english: "Deliver it to my hotel", kurdish: "بیگەیەنن بۆ هۆتێلەکەم", arabic: "توصيلها لفندقي" },
    ],
    voices: [
      { prompt: "ڕاپۆرتکردنی ونبوون", target: "My luggage hasn't arrived yet. Where can I file a report?", targetKurdish: "جانتاکانم هێشتا نەگەیشتوون. لە کوێ دەتوانم ڕاپۆرت بکەم؟", promptAr: "التبليغ عن الضياع", targetArabic: "جنطي بعدهي ما وصلت. وين أكدر أقدم بلاغ؟" },
      { prompt: "داوای گەیاندن", target: "When it is found, can you deliver it to my hotel?", targetKurdish: "کاتێک دۆزرایەوە، دەتوانن بیگەیەنن بۆ هۆتێلەکەم؟", promptAr: "طلب التوصيل", targetArabic: "من تلكوها، تكدرون توصلوها لفندقي؟" },
    ],
    sentences: [
      { english: ["Here", "is", "my", "luggage", "tag", "and", "boarding", "pass"], kurdish: "فەرموو ئەمە تاگی جانتاکەم و بلیتی فڕۆکەکەمە", arabic: "تفضل، هذا تاك جنطتي وبوردنك الطيارة" },
      { english: ["I", "waited", "at", "baggage", "claim", "for", "an", "hour"], kurdish: "کاتژمێرێک لە شوێنی وەرگرتنەوەی جانتاکان چاوەڕێم کرد", arabic: "انتظرت بمكان استلام الجنط لمدة ساعة" },
    ],
    fillBlanks: [
      { parts: ["I need to file a missing baggage", "immediately."], hint: "پێویستە دەستبەجێ فۆڕمی ڕاپۆرتی ونبوونی جانتا پڕبکەمەوە.", answer: "report", wrongs: ["paper", "form", "claim"], arabicHint: "لازم أقدم بلاغ عن جنط ضايعة فوراً.", arabicParts: ["لازم أقدم","عن جنط ضايعة فوراً."], arabicAnswer: "بلاغ", arabicWrongs: ["ورقة","نموذج","مطالبة"] },
      { parts: ["Please check my luggage", "number."], hint: "تکایە ژمارەی تاگی جانتاکەم بپشکنە.", answer: "tag", wrongs: ["sticker", "paper", "mark"], arabicHint: "رجاءً تأكد من رقم تاك جنطتي.", arabicParts: ["رجاءً تأكد من رقم","جنطتي."], arabicAnswer: "تاك", arabicWrongs: ["ملصق","ورقة","علامة"] },
    ],
    conversations: [
      { situation: "لە بەشی جانتا ونبووەکانی فڕۆکەخانە", theyAsk: "I'm sorry your bag isn't on the belt. Do you have your receipt?", correct: "Yes, here is my luggage tag. My luggage hasn't arrived. I need to file a missing baggage report and have it delivered to my hotel.", wrong1: "Yes, here's the luggage tag for my missing bag.", wrong2: "My suitcase never arrived at baggage claim.", wrong3: "Could you help me report the bag as missing?", explanation: "'File a report' و پێدانی 'Luggage tag' پرۆسەی ڕەسمی فڕۆکەخانەکانە", situationAr: "بقسم الجنط الضايعة بالمطار", explanationAr: "'تقديم بلاغ' وإعطاء 'تاك الجنطة' هي إجراءات رسمية بالمطارات" },
    ],
  },

  // Lesson 4: Checking into an Airbnb
  {
    topic: "Airbnb & Rentals", topicKu: "وەرگرتنی ماڵی کرێی گەشتیاری (Airbnb)", topicAr: "إير بي إن بي والإيجارات",
    words: [
      { english: "Self check-in instructions", kurdish: "ڕێنماییەکانی وەرگرتنی ماڵ (بەبێ بینینی خاوەن ماڵ)", arabic: "تعليمات الدخول الذاتي" },
      { english: "Lockbox code",         kurdish: "کۆدی سندووقی قفڵەکە (بۆ دەرکردنی کلیل)", arabic: "رمز صندوق المفاتيح" },
      { english: "House rules",          kurdish: "یاساکانی ماڵەکە", arabic: "قوانين البيت" },
      { english: "Wi-Fi password",       kurdish: "وشەی نهێنی وایفای", arabic: "باسورد الواي فاي" },
      { english: "Leave a review",       kurdish: "جێهێشتنی هەڵسەنگاندن / کۆمێنت", arabic: "تخلي تقييم" },
    ],
    voices: [
      { prompt: "پرسین لە ڕێنماییەکان", target: "Could you send me the self check-in instructions?", targetKurdish: "دەتوانیت ڕێنماییەکانی وەرگرتنی ماڵەکەم (بۆ خۆم) بۆ بنێریت؟", promptAr: "السؤال عن التعليمات", targetArabic: "تكدر تدزلي تعليمات الدخول الذاتي؟" },
      { prompt: "کۆدی کلیلەکە", target: "The lockbox code is not working.", targetKurdish: "کۆدی سندووقی قفڵەکە کار ناکات.", promptAr: "رمز المفتاح", targetArabic: "رمز صندوق المفاتيح ما ديشتغل." },
    ],
    sentences: [
      { english: ["Please", "make", "sure", "to", "read", "the", "house", "rules"], kurdish: "تکایە دڵنیابەرەوە لەوەی کە یاساکانی ماڵەکە دەخوێنیتەوە", arabic: "رجاءً تأكد تقره قوانين البيت" },
      { english: ["Where", "can", "I", "find", "the", "Wi-Fi", "password"], kurdish: "لە کوێ دەتوانم وشەی نهێنی وایفایەکە بدۆزمەوە؟", arabic: "وين أكدر الكي باسورد الواي فاي؟" },
    ],
    fillBlanks: [
      { parts: ["We had a great time and will definitely leave a positive", "."], hint: "کاتی زۆر خۆشمان بەسەربرد و بێگومان هەڵسەنگاندنێکی ئەرێنی جێدەهێڵین.", answer: "review", wrongs: ["message", "text", "word"], arabicHint: "كضينا وقت كلش حلو وأكيد راح نخلي تقييم إيجابي.", arabicParts: ["كضينا وقت كلش حلو وأكيد راح نخلي","إيجابي."], arabicAnswer: "تقييم", arabicWrongs: ["رسالة","نصاً","كلمة"] },
      { parts: ["I couldn't open the door. What is the", "code again?"], hint: "نەمتوانی دەرگاکە بکەمەوە. کۆدی سندووقی قفڵەکە چی بوو؟", answer: "lockbox", wrongs: ["key", "safe", "door"], arabicHint: "ما كدرت أفتح الباب. شنو رمز صندوق المفاتيح مرة ثانية؟", arabicParts: ["ما كدرت أفتح الباب. شنو رمز","مرة ثانية؟"], arabicAnswer: "صندوق المفاتيح", arabicWrongs: ["المفتاح","الخزنة","الباب"] },
    ],
    conversations: [
      { situation: "نامە ناردن بۆ خاوەن ماڵی کرێی گەشتیاری", theyAsk: "Hi! You'll be arriving today. Let me know if you need anything.", correct: "Hi! I just arrived. The lockbox code isn't working. Could you resend the self check-in instructions?", wrong1: "Hi, I'm here, but I can't get inside.", wrong2: "Could you tell me how to open the lockbox?", wrong3: "I arrived, and the key box seems to be broken.", explanation: "'Self check-in' و 'lockbox' زاراوەی تایبەتی خزمەتگوزارییەکانی وەک Airbnbـن", situationAr: "تدز رسالة لصاحب مكان الإقامة السياحي", explanationAr: "'الدخول الذاتي' و 'صندوق المفاتيح' هي مصطلحات شائعة بخدمات مثل Airbnb" },
    ],
  },

  // Lesson 5: Medical Emergencies Abroad
  {
    topic: "Medical Emergencies", topicKu: "باری لەناکاوی پزیشکی لە دەرەوە", topicAr: "حالات الطوارئ الطبية",
    words: [
      { english: "I need an ambulance",  kurdish: "پێویستم بە ئەمبولانسە (ئۆتۆمبێلی فریاکەوتن)", arabic: "محتاج إسعاف" },
      { english: "Travel insurance",     kurdish: "دڵنیایی گەشتکردن (بۆ نەخۆشی)", arabic: "تأمين السفر" },
      { english: "Prescription medication", kurdish: "دەرمانی ڕەچەتە (بەپێی نووسراوی پزیشک)", arabic: "دوه براچيتة" },
      { english: "Allergic reaction",    kurdish: "کاردانەوەی هەستیاری (حەساسیەت)", arabic: "حساسية" },
      { english: "Food poisoning",       kurdish: "ژەهراویبوونی خۆراک", arabic: "تسمم غذائي" },
    ],
    voices: [
      { prompt: "داوای یارمەتی خێرا", target: "Please call an ambulance, it's an emergency!", targetKurdish: "تکایە تەلەفۆن بۆ ئەمبولانس بکەن، ئەمە حاڵەتێکی لەناکاوە!", promptAr: "طلب مساعدة سريعة", targetArabic: "رجاءً خابروا إسعاف، هاي حالة طارئة!" },
      { prompt: "باسکردنی کێشەی تەندروستی", target: "I think I have severe food poisoning.", targetKurdish: "پێم وایە ژەهراویبوونی خۆراکیی زۆر سەختم هەیە.", promptAr: "وصف المشكلة الصحية", targetArabic: "أتصور عندي تسمم غذائي قوي." },
    ],
    sentences: [
      { english: ["Does", "your", "travel", "insurance", "cover", "hospital", "visits"], kurdish: "ئایا دڵنیایی گەشتەکەت تێچووی نەخۆشخانە دەگرێتەوە؟", arabic: "تأمين سفرك يغطي روحات المستشفى؟" },
      { english: ["I", "am", "having", "a", "bad", "allergic", "reaction"], kurdish: "کاردانەوەیەکی هەستیاری (حەساسیەت)ی خراپم هەیە", arabic: "عندي حساسية كلش قوية" },
    ],
    fillBlanks: [
      { parts: ["You can't buy these pills here without a", "."], hint: "ناتوانیت ئەم حەبانە لێرە بکڕیت بەبێ ڕەچەتە (نووسراوی پزیشک).", answer: "prescription", wrongs: ["doctor", "paper", "note"], arabicHint: "ما تكدر تشتري هاي الحبوب هنا بدون راچيتة.", arabicParts: ["ما تكدر تشتري هاي الحبوب هنا بدون","."], arabicAnswer: "راچيتة", arabicWrongs: ["دكتور","ورقة","ملاحظة"] },
      { parts: ["Make sure to buy", "insurance before you fly."], hint: "دڵنیابەرەوە لە کڕینی دڵنیایی گەشت پێش ئەوەی گەشت بکەیت.", answer: "travel", wrongs: ["flight", "ticket", "health"], arabicHint: "تأكد تشتري تأمين السفر قبل لا تسافر.", arabicParts: ["تأكد تشتري تأمين","قبل لا تسافر."], arabicAnswer: "السفر", arabicWrongs: ["الرحلة","التذكرة","الصحة"] },
    ],
    conversations: [
      { situation: "لە دەرمانخانەیەک لە دەرەوەی وڵات", theyAsk: "Are you okay? Do you need a doctor?", correct: "I think I'm having an allergic reaction to something I ate. Do you have any medicine, or do I need a prescription?", wrong1: "I think something I ate caused an allergic reaction.", wrong2: "I have a rash and need something for the allergy.", wrong3: "Can you tell me whether I need to see a doctor?", explanation: "لە دەرەوەی وڵات جیاوازی زۆر هەیە لە نێوان دەرمانی ئاسایی و دەرمانی 'prescription' (کە تەنها بە وەرەقەی دکتۆر دەدرێت)", situationAr: "بصيدلية خارج البلد", explanationAr: "بالخارج، اكو فرق جبير بين الأدوية العادية والأدوية اللي تحتاج 'راچيتة' (اللي تنصرف بس بوصفة دكتور)" },
    ],
  },

  // Lesson 6: Haggling & Buying Souvenirs
  {
    topic: "Haggling (Bargaining)", topicKu: "مامەڵەکردن (کەمکردنەوەی نرخ)", topicAr: "المكاسر",
    words: [
      { english: "Can you lower the price", kurdish: "دەتوانیت نرخەکە دابەزێنیت؟", arabic: "تكدر تنزل السعر؟" },
      { english: "That's a bit steep",   kurdish: "ئەوە کەمێک گرانە (زۆرە)", arabic: "هذا غالي شوية" },
      { english: "What's your best price", kurdish: "کۆتا نرخت چەندە؟ (باشترین نرخت)", arabic: "شنو قفالته؟ (أحسن سعر)" },
      { english: "I'll give you",        kurdish: "ئەوەندەت دەدەمێ...", arabic: "راح أنطيك..." },
      { english: "Rip-off",              kurdish: "فێڵلێکردن (فرۆشتن بە نرخی زۆر بەرز)", arabic: "نصب / بوقة" },
    ],
    voices: [
      { prompt: "داوای دابەزاندنی نرخ", target: "That's a bit steep. Can you lower the price?", targetKurdish: "ئەوە کەمێک گرانە. دەتوانیت نرخەکە دابەزێنیت؟", promptAr: "طلب تنزيل السعر", targetArabic: "هذا غالي شوية. تكدر تنزل السعر؟" },
      { prompt: "پرسیار لە نرخی کۆتایی", target: "If I buy three, what's your best price?", targetKurdish: "ئەگەر سیانیان لێ بکڕم، کۆتا نرخت چەندە؟", promptAr: "السؤال عن السعر الأخير", targetArabic: "إذا أشتري تلاثة، بيش تحسبهم؟ (شنو أحسن سعر)" },
    ],
    sentences: [
      { english: ["Don't", "buy", "it", "there", "it", "is", "a", "rip-off"], kurdish: "لەوێ مەیکڕە، ئەوە فێڵلێکردنە (زۆر گرانە)", arabic: "لا تشتري من هناك، هذا نصب (كلش غالي)" },
      { english: ["I'll", "give", "you", "twenty", "dollars", "for", "it"], kurdish: "بیست دۆلارت پێ دەدەم بۆ ئەوە", arabic: "راح أنطيك عشرين دولار بي" },
    ],
    fillBlanks: [
      { parts: ["Fifty dollars? That's a bit", "for a small shirt."], hint: "پەنجا دۆلار؟ ئەوە کەمێک گرانە بۆ کراسێکی بچووک.", answer: "steep", wrongs: ["high", "much", "big"], arabicHint: "خمسين دولار؟ هذا غالي شوية على قميص صغير.", arabicParts: ["خمسين دولار؟ هذا","شوية على قميص صغير."], arabicAnswer: "غالي", arabicWrongs: ["مرتفع","كثير","كبير"] },
      { parts: ["$100 is a total", ". I saw it for $20 somewhere else."], hint: "١٠٠ دۆلار بەتەواوی فێڵلێکردنە (گرانە). لە شوێنێکی تر بە ٢٠ دۆلار بینیم.", answer: "rip-off", wrongs: ["scam", "bad", "fake"], arabicHint: "100 دولار نصبة. شفته بـ 20 دولار بغير مكان.", arabicParts: ["100 دولار هي","تماماً. شفته بـ 20 دولار بغير مكان."], arabicAnswer: "نصبة", arabicWrongs: ["نصب","سيء","مزيف"] },
    ],
    conversations: [
      { situation: "لە بازاڕێکی میللیدایت و دەتەوێت دیارییەک بکڕیت", theyAsk: "For you my friend, a special price: $50.", correct: "That's a bit steep for a small souvenir. What's your best price? I'll give you $30.", wrong1: "Fifty is more than I was hoping to spend.", wrong2: "Would you consider taking thirty dollars?", wrong3: "Is there any room to lower the price?", explanation: "'That's a bit steep' و 'What's your best price' شێوازێکی زۆر باو و ڕێزدارانەن بۆ مامەڵەکردن و کەمکردنەوەی نرخ", situationAr: "أنت بسوق شعبي وتريد تشتري هدية تذكارية", explanationAr: "'هذا غالي شوية' و 'شنو قفالته' هي طرق شائعة ومحترمة للمكاسر وتنزيل السعر" },
    ],
  },

  // Lesson 7: Taking a Guided Tour
  {
    topic: "Guided Tours", topicKu: "گەشتی ڕێبەریکراو (لەگەڵ ڕێبەر/گاید)", topicAr: "الجولات ويه مرشد",
    words: [
      { english: "Tour guide",           kurdish: "ڕێبەری گەشتیاری", arabic: "مرشد سياحي" },
      { english: "Meeting point",        kurdish: "خاڵی کۆبوونەوە (شوێنی یەکتربینین)", arabic: "نقطة التجمع" },
      { english: "Free time",            kurdish: "کاتی سەربەست (بۆ گەڕان بەتەنیا)", arabic: "وقت حر" },
      { english: "Admission fee",        kurdish: "کرێی چوونەژوورەوە", arabic: "رسوم الدخول" },
      { english: "Skip the line",        kurdish: "پەڕینەوە لە ڕیزەکە (بێ سەرە گرتن)", arabic: "تعبر السرة" },
    ],
    voices: [
      { prompt: "پرسیارکردن لە ڕێبەرەکە", target: "Excuse me, where is the meeting point after our free time?", targetKurdish: "ببوورە، خاڵی کۆبوونەوەکە لە کوێیە دوای کاتە سەربەستەکەمان؟", promptAr: "السؤال من المرشد", targetArabic: "عفواً، وين نقطة التجمع بعد وقتنا الحر؟" },
      { prompt: "کرێی شوێنەکان", target: "Does the ticket include the admission fee for the museum?", targetKurdish: "ئایا بلیتەکە کرێی چوونەژوورەوەی مۆزەخانەکەش لەخۆ دەگرێت؟", promptAr: "رسوم الأماكن", targetArabic: "التكت يشمل رسوم دخول المتحف؟" },
    ],
    sentences: [
      { english: ["We", "bought", "skip", "the", "line", "tickets", "online"], kurdish: "ئێمە بلیتی (بێ سەرە گرتن)مان بە ئۆنلاین کڕی", arabic: "اشترينا تكتات تعبر السرة من الإنترنت" },
      { english: ["Our", "tour", "guide", "was", "very", "knowledgeable"], kurdish: "ڕێبەرە گەشتیارییەکەمان زۆر زانیاری هەبوو", arabic: "مرشدنا السياحي چان كلش فاهم" },
    ],
    fillBlanks: [
      { parts: ["We will have 30 minutes of", "time to take photos."], hint: "ئێمە ٣٠ خولەک کاتی سەربەستمان دەبێت بۆ وێنەگرتن.", answer: "free", wrongs: ["empty", "good", "relax"], arabicHint: "راح يصير عدنا 30 دقيقة وقت حر حتى ناخذ صور.", arabicParts: ["راح يصير عدنا 30 دقيقة من الوقت","حتى ناخذ صور."], arabicAnswer: "الحر", arabicWrongs: ["الفارغ","الجيد","الاسترخاء"] },
      { parts: ["The", "point for the bus is next to the fountain."], hint: "خاڵی کۆبوونەوە بۆ پاسەکە لە تەنیشت نافوورەکەیە.", answer: "meeting", wrongs: ["start", "see", "wait"], arabicHint: "نقطة التجمع للباص بصف النافورة.", arabicParts: ["نقطة","للباص بصف النافورة."], arabicAnswer: "التجمع", arabicWrongs: ["البداية","الرؤية","الانتظار"] },
    ],
    conversations: [
      { situation: "قسەکردن لەگەڵ ڕێبەری گەشتەکەت", theyAsk: "We will go inside the castle now. Does everyone have their tickets?", correct: "I have my ticket, but I wanted to ask: is the admission fee included, and do we skip the line?", wrong1: "I have my ticket. Do we need to wait in the regular line?", wrong2: "Does this ticket include the castle entrance?", wrong3: "Where should I show my ticket?", explanation: "'Skip the line' خزمەتگوزارییەکی زۆر باوە لە ئەوروپا کە بە پارەی زیاتر سەرە نادەگریت", situationAr: "تحجي ويه مرشدك السياحي", explanationAr: "'تعبر السرة' خدمة كلش شائعة بأوروبا تخليك تتجنب الانتظار مقابل مبلغ إضافي" },
    ],
  },

  // Lesson 8: Eating at Street Food Stalls
  {
    topic: "Street Food", topicKu: "خواردنی سەر شەقام (لە وڵاتانی تر)", topicAr: "أكل الشارع",
    words: [
      { english: "Is this spicy",        kurdish: "ئایا ئەمە توونە؟", arabic: "هذا حار؟" },
      { english: "What is the local specialty", kurdish: "تایبەتمەندی ناوچەکە چییە؟ (بەناوبانگترین خواردنی لۆکاڵی)", arabic: "شنو أكلتكم المحلية المميزة؟" },
      { english: "Food stall",           kurdish: "عەرەبانەی خواردن / دوکانی سەر شەقام", arabic: "عربانة أكل / كشك أكل" },
      { english: "To go / Takeaway",     kurdish: "بۆ بردنەوە (نەخواردن لەوێ)", arabic: "سفري" },
      { english: "Vegetarian options",   kurdish: "بژاردەی ڕووەکی", arabic: "أكلات نباتية" },
    ],
    voices: [
      { prompt: "پرسیار لە خواردنی ناوچەکە", target: "What is the local specialty here?", targetKurdish: "تایبەتمەندی (بەناوبانگترین خواردنی) ناوچەکە چییە لێرە؟", promptAr: "السؤال عن أكل المنطقة", targetArabic: "شنو الأكلة المحلية المميزة هنا؟" },
      { prompt: "داوای بردنەوە", target: "I'll have two of these, to go please.", targetKurdish: "دوو دانە لەمانەم دەوێت، بۆ بردنەوە تکایە.", promptAr: "طلب الأكل سفري", targetArabic: "راح آخذ ثنين من هاي، سفري بلا زحمة." },
    ],
    sentences: [
      { english: ["Do", "you", "have", "any", "vegetarian", "options", "available"], kurdish: "ئایا هیچ بژاردەیەکی ڕووەکیتان بەردەستە؟", arabic: "عدكم أي أكلات نباتية؟" },
      { english: ["That", "food", "stall", "looks", "very", "popular", "with", "locals"], kurdish: "ئەو عەرەبانەی خواردنە وا دیارە زۆر لای خەڵکی ناوچەکە خۆشەویستە", arabic: "عربانة الأكل هاي مبينة كلش مشهورة يم أهل المنطقة" },
    ],
    fillBlanks: [
      { parts: ["Can you make it not too", "? I can't handle chili."], hint: "دەتوانیت وا بکەیت زۆر توون نەبێت؟ بەرگەی بیبەر ناگرم.", answer: "spicy", wrongs: ["hot", "red", "strong"], arabicHint: "تكدر تخليها مو كلش حارة؟ ما أتحمل الفلفل.", arabicParts: ["تكدر تخليها مو","كلش؟ ما أتحمل الفلفل."], arabicAnswer: "حارة", arabicWrongs: ["ساخناً","أحمر","قوياً"] },
      { parts: ["I want this sandwich", "go, please."], hint: "ئەم لەفەیەم بۆ بردنەوە دەوێت تکایە.", answer: "to", wrongs: ["for", "away", "take"], arabicHint: "أريد هاي اللفة سفري، بلا زحمة.", arabicParts: ["أريد هاي اللفة","، بلا زحمة."], arabicAnswer: "سفري", arabicWrongs: ["لأجل","بعيداً","أخذ"] },
    ],
    conversations: [
      { situation: "لەلای عەرەبانەیەکی خواردن لە بانکوک یان مەکسیک", theyAsk: "Hi! What can I get for you today?", correct: "I'd like to try the local specialty, but is it spicy? If so, can you make it mild? And I'll take it to go.", wrong1: "What local dish would you recommend?",
        wrong2: "I'd like something mild to take away.", wrong3: "Could you make the specialty without much chili?", explanation: "لە ئەمریکا دەڵێن 'to go'، لە بەریتانیا دەڵێن 'takeaway' بۆ خواردنێک کە لەگەڵ خۆت دەیبەیت", situationAr: "يم عربانة أكل ببانكوك لو المكسيك", explanationAr: "بأمريكا يكولون 'to go'، وببريطانيا يكولون 'takeaway' للأكل اللي تاخذه وياك" },
    ],
  },

  // Lesson 9: Meeting Other Travelers
  {
    topic: "Meeting Other Travelers", topicKu: "یەکترناسینی گەشتیارانی تر (لە هۆستێل و گەشتەکان)", topicAr: "التعرف على مسافرين ثانين",
    words: [
      { english: "Where are you heading next", kurdish: "دواتر بەرەو کوێ دەڕۆیت؟ (وێستگەی داهاتووت کوێیە)", arabic: "وين راح تروح بعدين؟" },
      { english: "How long have you been traveling", kurdish: "چەندە گەشت دەکەیت؟ (ماوەی چەندە لە گەشتدایت)", arabic: "صارلك شكد تسافر؟" },
      { english: "Any recommendations",  kurdish: "هیچ پێشنیارێکت هەیە؟ (بۆ شوێن و خواردن)", arabic: "عندك أي نصائح أو توصيات؟" },
      { english: "Solo traveler",        kurdish: "گەشتیاری تاقانە (کەسێک بەتەنیا گەشت دەکات)", arabic: "مسافر بوحده" },
      { english: "Keep in touch",        kurdish: "لە پەیوەندیدا دەبین (مانەوەی پەیوەندی)", arabic: "خلينا على تواصل" },
    ],
    voices: [
      { prompt: "پرسیارکردن لە بەرنامەی داهاتوو", target: "Where are you heading next on your trip?", targetKurdish: "دواتر بەرەو کوێ دەڕۆیت لە گەشتەکەتدا؟", promptAr: "السؤال عن الخطط الجاية", targetArabic: "وين وجهتك الجاية بسفرتك؟" },
      { prompt: "خواحافیزی کردن لە هاوڕێی نوێ", target: "It was great meeting you. Let's keep in touch!", targetKurdish: "بینینت زۆر خۆش بوو. با لە پەیوەندیدا بین!", promptAr: "توديع صديق جديد", targetArabic: "فرصة سعيدة شفتك. خلينا على تواصل!" },
    ],
    sentences: [
      { english: ["Do", "you", "have", "any", "recommendations", "for", "good", "restaurants"], kurdish: "هیچ پێشنیارێکت هەیە بۆ چێشتخانەی باش؟", arabic: "عندك أي توصيات لمطاعم زينة؟" },
      { english: ["I", "am", "a", "solo", "traveler", "exploring", "Europe"], kurdish: "من گەشتیارێکی تاقانەم بە ئەوروپادا دەگەڕێم", arabic: "أني مسافر بوحدي أستكشف أوروبا" },
    ],
    fillBlanks: [
      { parts: ["Where are you", "next after you leave here?"], hint: "دواتر بەرەو کوێ دەڕۆیت دوای ئەوەی لێرە دەڕۆیت؟", answer: "heading", wrongs: ["going", "travel", "visiting"], arabicHint: "وين راح تروح بعدين من تطلع منانه؟", arabicParts: ["وين راح","بعدين من تطلع منانه؟"], arabicAnswer: "تروح", arabicWrongs: ["تذهب","تسافر","تزور"] },
      { parts: ["I hope we cross paths again. Let's keep in", "."], hint: "هیوادارم دووبارە یەکتر ببینینەوە. با لە پەیوەندیدا بین.", answer: "touch", wrongs: ["contact", "talk", "message"], arabicHint: "أتمنى نلتقي مرة ثانية. خلينا على تواصل.", arabicParts: ["أتمنى نلتقي مرة ثانية. خلينا على","."], arabicAnswer: "تواصل", arabicWrongs: ["اتصال","حديث","رسالة"] },
    ],
    conversations: [
      { situation: "قسەکردن لەگەڵ گەشتیارێکی تر لە هۆتێلەکە", theyAsk: "I just got here yesterday. I've been traveling for a month.", correct: "Wow, a whole month! I'm a solo traveler too. Where are you heading next? Do you have any recommendations for this city?", wrong1: "A month is a long trip. Where are you going next?", wrong2: "I'm traveling alone too. Any favorite places so far?", wrong3: "Do you have any tips for someone new to the city?", explanation: "'Where are you heading next' باوترین پرسیاری نێوان گەشتیارانە", situationAr: "تحجي ويه مسافر ثاني بالفندق", explanationAr: "'وين راح تروح بعدين' هو أكثر سؤال ينطرح بين المسافرين" },
    ],
  },

];

export default normalUnit05;
