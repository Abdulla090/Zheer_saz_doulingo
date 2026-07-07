import { UnitBank } from "../types";

// ── Unit 5: Travel & Exploring the World — 10 unique lessons ──────────
// Advanced travel vocabulary for navigating airports, cities, emergencies, and new cultures.

const normalUnit05: UnitBank = [

  // Lesson 0: Immigration & Customs
  {
    topic: "Immigration & Customs", topicKu: "پاسپۆرت و گومرگ (لە فڕۆکەخانە)", topicAr: "الهجرة والجمارك",
    words: [
      { english: "Purpose of your visit", kurdish: "مەبەست لە سەردانەکەت (گەشتەکەت)", arabic: "الغرض من زيارتك" },
      { english: "Declare anything",     kurdish: "ئاشکراکردنی شتێک (بۆ گومرگ - شتێک کە باجی لەسەرە)", arabic: "التصريح عن أي شيء" },
      { english: "Duration of stay",     kurdish: "ماوەی مانەوە", arabic: "مدة الإقامة" },
      { english: "Connecting flight",    kurdish: "گەشتی ترانزێت (گۆڕینی فڕۆکە)", arabic: "رحلة ربط (ترانزيت)" },
      { english: "Return ticket",        kurdish: "بلیتی گەڕانەوە", arabic: "تذكرة عودة" },
    ],
    voices: [
      { prompt: "پرسیاری پاسەوانی سنوور", target: "What is the purpose of your visit to this country?", targetKurdish: "مەبەست لە سەردانەکەت بۆ ئەم وڵاتە چییە؟", promptAr: "سؤال حارس الحدود", targetArabic: "ما هو الغرض من زيارتك لهذا البلد؟" },
      { prompt: "ئاماژەدان بە کاتی گەڕانەوە", target: "I have a return ticket for the 15th of next month.", targetKurdish: "بلیتی گەڕانەوەم هەیە بۆ ڕۆژی ١٥ی مانگی داهاتوو.", promptAr: "الإشارة إلى وقت العودة", targetArabic: "لدي تذكرة عودة ليوم الخامس عشر من الشهر القادم." },
    ],
    sentences: [
      { english: ["Do", "you", "have", "anything", "to", "declare", "at", "customs"], kurdish: "ئایا هیچ شتێکت پێیە کە پێویست بکات ��ە گومرگ ئاشکرای بکەیت؟", arabic: "هل لديك أي شيء للتصريح عنه في الجمارك؟" },
      { english: ["My", "duration", "of", "stay", "will", "be", "two", "weeks"], kurdish: "ماوەی مانەوەکەم دوو هەفتە دەبێت", arabic: "مدة إقامتي ستكون أسبوعين" },
    ],
    fillBlanks: [
      { parts: ["I am here on vacation. The", "of my visit is tourism."], hint: "بۆ پشوو لێرەم. مەبەست لە گەشتەکەم گەشتیارییە.", answer: "purpose", wrongs: ["reason", "way", "idea"], arabicHint: "أنا هنا في إجازة. الغرض من زيارتي هو السياحة.", arabicParts: ["أنا هنا في إجازة.","من زيارتي هو السياحة."], arabicAnswer: "الغرض", arabicWrongs: ["السبب","الطريقة","الفكرة"] },
      { parts: ["I need to catch my", "flight to London at gate 4."], hint: "پێویستە بگەڕێمەوە بە گەشتی ترانزێتەکەم (گۆڕینی فڕۆکەکەم) بۆ لەندەن لە دەروازەی ٤.", answer: "connecting", wrongs: ["second", "next", "moving"], arabicHint: "أحتاج إلى اللحاق برحلة الربط الخاصة بي إلى لندن عند البوابة 4.", arabicParts: ["أحتاج إلى اللحاق برحلة","الخاصة بي إلى لندن عند البوابة 4."], arabicAnswer: "الربط", arabicWrongs: ["الثانية","التالية","المتحركة"] },
    ],
    conversations: [
      { situation: "لە بەردەم ئەفسەری پاسپۆرت", theyAsk: "Welcome. May I see your passport? What is the purpose of your visit?", correct: "Here is my passport. The purpose of my visit is tourism. My duration of stay is exactly two weeks.", wrong1: "I come to see things. Two weeks.", wrong2: "Passport here. I am tourist.", wrong3: "I visit for holiday.", explanation: "'Purpose of your visit' و 'duration of stay' پرسیارە فەرمییەکانی هەموو فڕۆکەخانەیەکن", situationAr: "أمام ضابط الجوازات", explanationAr: "'الغرض من زيارتك' و 'مدة الإقامة' هي أسئلة رسمية في جميع المطارات" },
    ],
  },

  // Lesson 1: Renting a Car Abroad
  {
    topic: "Renting a Car", topicKu: "کرێکردنی ئۆتۆمبێل (لە دەرەوەی وڵات)", topicAr: "استئجار سيارة",
    words: [
      { english: "International driving permit", kurdish: "مۆڵەتی شۆفێریی نێودەوڵەتی", arabic: "رخصة قيادة دولية" },
      { english: "Full coverage insurance", kurdish: "دڵنیایی (تەئمینی) گشتگیر", arabic: "تأمين شامل" },
      { english: "Unlimited mileage",    kurdish: "کیلۆمەتری بێسنوور (بۆ لێخوڕین)", arabic: "عدد أميال غير محدود" },
      { english: "Drop-off location",    kurdish: "شوێنی ڕادەستکردنەوە (دانانەوەی ئۆتۆمبێلەکە)", arabic: "موقع التسليم" },
      { english: "Manual or automatic",  kurdish: "گێڕی عادی یان ئۆتۆماتیک", arabic: "يدوي أو أوتوماتيكي" },
    ],
    voices: [
      { prompt: "پرسیارکردن دەربار��ی دڵنیایی", target: "I would like to add full coverage insurance to my rental.", targetKurdish: "حەز دەکەم دڵنیایی گشتگیر (تەئمینی فول) زیاد بکەم بۆ کرێی ئۆتۆمبێلەکەم.", promptAr: "السؤال عن التأمين", targetArabic: "أود إضافة تأمين شامل على سيارتي المستأجرة." },
      { prompt: "شوێنی دانانەوەی ئۆتۆمبێل", target: "Can I choose a different drop-off location?", targetKurdish: "دەتوانم شوێنێکی جیاواز هەڵبژێرم بۆ ڕادەستکردنەوەی ئۆتۆمبێلەکە؟", promptAr: "مكان تسليم السيارة", targetArabic: "هل يمكنني اختيار موقع تسليم مختلف؟" },
    ],
    sentences: [
      { english: ["Do", "you", "need", "an", "international", "driving", "permit", "here"], kurdish: "لێرە پێویستت بە مۆڵەتی شۆفێریی نێودەوڵەتییە؟", arabic: "هل تحتاج إلى رخصة قيادة دولية هنا؟" },
      { english: ["Does", "this", "car", "come", "with", "unlimited", "mileage"], kurdish: "ئایا ئەم ئۆتۆمبێلە کیلۆمەتری بێسنووری لەگەڵدایە؟", arabic: "هل تأتي هذه السيارة بعدد أميال غير محدود؟" },
    ],
    fillBlanks: [
      { parts: ["I only know how to drive an", "transmission."], hint: "تەنها دەزانم ئۆتۆمبێلی گێڕ ئۆتۆماتیک لێبخوڕم.", answer: "automatic", wrongs: ["easy", "normal", "fast"], arabicHint: "أعرف فقط كيف أقود سيارة ذات ناقل حركة أوتوماتيكي.", arabicParts: ["أعرف فقط كيف أقود سيارة ذات ناقل حركة","."], arabicAnswer: "أوتوماتيكي", arabicWrongs: ["سهل","عادي","سريع"] },
      { parts: ["Make sure you have full", "insurance just in case."], hint: "دڵنیابەرەوە کە دڵنیایی گشتگیرت (فول تەئمین) هەیە نەوەک شتێک ڕووبدات.", answer: "coverage", wrongs: ["cover", "money", "paper"], arabicHint: "تأكد من أن لديك تأمين تغطية شاملة تحسباً لأي طارئ.", arabicParts: ["تأكد من أن لديك تأمين","شاملة تحسباً لأي طارئ."], arabicAnswer: "تغطية", arabicWrongs: ["غطاء","مال","ورق"] },
    ],
    conversations: [
      { situation: "لە کۆمپانیای کرێدانی ئۆتۆمبێل", theyAsk: "We have an SUV available. Would you like basic or full insurance?", correct: "I'll take the full coverage insurance, please. Also, does the rental include unlimited mileage?", wrong1: "Give me good insurance and free drive.", wrong2: "I want full protect and no kilometer limit.", wrong3: "Yes full insurance. Unlimited distance?", explanation: "کۆمپانیاکانی کرێدانی ئۆتۆمبێل زاراوەی وەک 'Coverage' (دڵنیایی) و 'Mileage' (دووری) بەکاردەهێنن", situationAr: "في شركة تأجير السيارات", explanationAr: "تستخدم شركات تأجير السيارات مصطلحات مثل 'التغطية' (التأمين) و 'عدد الأميال' (المسافة)" },
    ],
  },

  // Lesson 2: Navigating Public Transport
  {
    topic: "Public Transport", topicKu: "گواستنەوەی گشتی (مترۆ، پاس)", topicAr: "المواصلات العامة",
    words: [
      { english: "Which line goes to",   kurdish: "کام هێڵ دەچێت بۆ...", arabic: "أي خط يذهب إلى..." },
      { english: "Round trip ticket",    kurdish: "بلیتی چوون و هاتنەوە", arabic: "تذكرة ذهاب وعودة" },
      { english: "Mind the gap",         kurdish: "ئاگاداری بۆشاییەکە بە (نێوان شەمەندەفەر و سەکۆکە)", arabic: "انتبه للفجوة" },
      { english: "Rush hour",            kurdish: "کاتی قەرەباڵغی (کاتی چوونە سەر کار و گەڕانەوە)", arabic: "ساعة الذروة" },
      { english: "Transfer at the next stop", kurdish: "گۆڕین (دابەزین بۆ هێڵێکی تر) لە وێستگەی داهاتوو", arabic: "غيّر (الخط) في المحطة التالية" },
    ],
    voices: [
      { prompt: "کڕینی بلیتی گەڕانەوە", target: "I would like one round trip ticket to the city center.", targetKurdish: "یەک بلیتی چوون و هاتنەوەم دەوێت بۆ سەنتەری شار.", promptAr: "شراء تذكرة عودة", targetArabic: "أرغب في تذكرة ذهاب وعودة واحدة إلى وسط المدينة." },
      { prompt: "پرسیارکردن لە ڕێگا", target: "Excuse me, which line goes to the central station?", targetKurdish: "ببوورە، کام هێڵ دەچێت بۆ وێستگەی ناوەندی؟", promptAr: "السؤال عن الطريق", targetArabic: "عفواً، أي خط يذهب إلى المحطة المركزية؟" },
    ],
    sentences: [
      { english: ["You", "need", "to", "transfer", "at", "the", "next", "stop"], kurdish: "پێویستە لە وێستگەی داهاتوو دابەزیت بۆ گۆڕینی هێڵەکە", arabic: "عليك أن تغيّر (الخط) في المحطة التالية" },
      { english: ["The", "trains", "are", "very", "packed", "during", "rush", "hour"], kurdish: "شەمەندەفەرەکان زۆر قەرەباڵغن لە کاتی چونە سەر کاردا", arabic: "القطارات مزدحمة جداً خلال ساعة الذروة" },
    ],
    fillBlanks: [
      { parts: ["Please stand back and", "the gap."], hint: "تکایە بگەڕێرەوە دواوە و ئاگاداری بۆشاییەکە (نێوان شەمەندەفەر و وێستگەکە) بە.", answer: "mind", wrongs: ["watch", "look", "see"], arabicHint: "يرجى التراجع للخلف والانتباه للفجوة.", arabicParts: ["يرجى التراجع للخلف و","للفجوة."], arabicAnswer: "الانتباه", arabicWrongs: ["مراقبة","النظر","رؤية"] },
      { parts: ["A one-way ticket is $5, and a", "trip is $9."], hint: "بلیتی یەک ئاراستە ٥ دۆلارە، و بلیتی چوون و هاتنەوە ٩ دۆلارە.", answer: "round", wrongs: ["two", "both", "full"], arabicHint: "تذكرة الذهاب فقط بـ 5 دولارات، وتذكرة الذهاب والعودة بـ 9 دولارات.", arabicParts: ["تذكرة الذهاب فقط بـ 5 دولارات، وتذكرة الذهاب و","بـ 9 دولارات."], arabicAnswer: "العودة", arabicWrongs: ["اثنين","كلاهما","الكاملة"] },
    ],
    conversations: [
      { situation: "پرسیارکردن لە کارمەندێکی میترۆ", theyAsk: "Can I help you find your train?", correct: "Yes, please. Which line goes to the museum? And do I need to transfer at the next stop?", wrong1: "Where is museum train? Do I change?", wrong2: "I want museum. Tell me train.", wrong3: "Which subway to museum?", explanation: "'Which line goes to' و 'Transfer' دوو وشەی سەرەکین لە سیستەمی گواستنەوەی وڵاتاندا", situationAr: "السؤال من موظف المترو", explanationAr: "'أي خط يذهب إلى' و 'غيّر' كلمتان أساسيتان في أنظمة النقل في البلدان" },
    ],
  },

  // Lesson 3: Dealing with Lost Luggage
  {
    topic: "Lost Luggage", topicKu: "ونبوونی جانتا (لە فڕۆکەخانە)", topicAr: "الأمتعة المفقودة",
    words: [
      { english: "My luggage hasn't arrived", kurdish: "جانتاکانم (کەلوپەلەکانم) نەگەیشتوون", arabic: "أمتعتي لم تصل" },
      { english: "Baggage claim",        kurdish: "شوێنی وەرگرتنەوەی جانتا", arabic: "استلام الأمتعة" },
      { english: "File a missing baggage report", kurdish: "فۆڕمی ونبوونی جانتا پڕبکەرەوە", arabic: "تقديم بلاغ عن أمتعة مفقودة" },
      { english: "Luggage tag",          kurdish: "تاگی جانتا (ئەو لەزگەیەی بە جانتاکەوەیە)", arabic: "بطاقة الأمتعة" },
      { english: "Deliver it to my hotel", kurdish: "بیگەیەنن بۆ هۆتێلەکەم", arabic: "توصيلها إلى فندقي" },
    ],
    voices: [
      { prompt: "ڕاپۆرتکردنی ونبوون", target: "My luggage hasn't arrived yet. Where can I file a report?", targetKurdish: "جانتاکانم هێشتا نەگەیشتوون. لە کوێ دەتوانم ڕاپۆرت بکەم؟", promptAr: "الإبلاغ عن الفقدان", targetArabic: "أمتعتي لم تصل بعد. أين يمكنني تقديم بلاغ؟" },
      { prompt: "داوای گەیاندن", target: "When it is found, can you deliver it to my hotel?", targetKurdish: "کاتێک دۆزرایەوە، دەتوانن بیگەیەنن بۆ هۆتێلەکەم؟", promptAr: "طلب التوصيل", targetArabic: "عندما يتم العثور عليها، هل يم��نك توصيلها إلى فندقي؟" },
    ],
    sentences: [
      { english: ["Here", "is", "my", "luggage", "tag", "and", "boarding", "pass"], kurdish: "فەرموو ئەمە تاگی جانتاکەم و بلیتی فڕۆکەکەمە", arabic: "تفضل، هذه بطاقة أمتعتي وبطاقة صعود الطائرة" },
      { english: ["I", "waited", "at", "baggage", "claim", "for", "an", "hour"], kurdish: "کاتژمێرێک لە شوێنی وەرگرتنەوەی جانتاکان چاوەڕێم کرد", arabic: "انتظرت في منطقة استلام الأمتعة لمدة ساعة" },
    ],
    fillBlanks: [
      { parts: ["I need to file a missing baggage", "immediately."], hint: "پێویستە دەستبەجێ فۆڕمی ڕاپۆرتی ونبوونی جانتا پڕبکەمەوە.", answer: "report", wrongs: ["paper", "form", "claim"], arabicHint: "أحتاج إلى تقديم بلاغ عن أمتعة مفقودة على الفور.", arabicParts: ["أحتاج إلى تقديم","عن أمتعة مفقودة على الفور."], arabicAnswer: "بلاغ", arabicWrongs: ["ورقة","نموذج","مطالبة"] },
      { parts: ["Please check my luggage", "number."], hint: "تکایە ژمارەی تاگی جانتاکەم بپشکنە.", answer: "tag", wrongs: ["sticker", "paper", "mark"], arabicHint: "يرجى التحقق من رقم بطاقة أمتعتي.", arabicParts: ["يرجى التحقق من رقم","أمتعتي."], arabicAnswer: "بطاقة", arabicWrongs: ["ملصق","ورقة","علامة"] },
    ],
    conversations: [
      { situation: "لە بەشی جانتا ونبووەکانی فڕۆکەخانە", theyAsk: "I'm sorry your bag isn't on the belt. Do you have your receipt?", correct: "Yes, here is my luggage tag. My luggage hasn't arrived. I need to file a missing baggage report and have it delivered to my hotel.", wrong1: "Bag is lost. Bring to hotel.", wrong2: "I no have bag. Where is it?", wrong3: "Find my bag. Here is sticker.", explanation: "'File a report' و پێدانی 'Luggage tag' پرۆسەی ڕەسمی فڕۆکەخانەکانە", situationAr: "في قسم الأمتعة المفقودة بالمطار", explanationAr: "'تقديم بلاغ' و إعطاء 'بطاقة الأمتعة' هي إجراءات رسمية في المطارات" },
    ],
  },

  // Lesson 4: Checking into an Airbnb
  {
    topic: "Airbnb & Rentals", topicKu: "وەرگرتنی ماڵی کرێی گەشتیاری (Airbnb)", topicAr: "إير بي إن بي والإيجارات",
    words: [
      { english: "Self check-in instructions", kurdish: "ڕێنماییەکانی وەرگرتنی ماڵ (بەبێ بینینی خاوەن ماڵ)", arabic: "تعليمات تسجيل الدخول الذاتي" },
      { english: "Lockbox code",         kurdish: "کۆدی سندووقی قفڵەکە (بۆ دەرکردنی کلیل)", arabic: "رمز صندوق المفاتيح" },
      { english: "House rules",          kurdish: "یاساکانی ماڵەکە", arabic: "قواعد المنزل" },
      { english: "Wi-Fi password",       kurdish: "وشەی نهێن�� وایفای", arabic: "كلمة مرور الواي فاي" },
      { english: "Leave a review",       kurdish: "جێهێشتنی هەڵسەنگاندن / کۆمێنت", arabic: "ترك تقييم" },
    ],
    voices: [
      { prompt: "پرسین لە ڕێنماییەکان", target: "Could you send me the self check-in instructions?", targetKurdish: "دەتوانیت ڕێنماییەکانی وەرگرتنی ماڵەکەم (بۆ خۆم) بۆ بنێریت؟", promptAr: "السؤال عن التعليمات", targetArabic: "هل يمكنك إرسال تعليمات تسجيل الدخول الذاتي لي؟" },
      { prompt: "کۆدی کلیلەکە", target: "The lockbox code is not working.", targetKurdish: "کۆدی سندووقی قفڵەکە کار ناکات.", promptAr: "رمز المفتاح", targetArabic: "رمز صندوق المفاتيح لا يعمل." },
    ],
    sentences: [
      { english: ["Please", "make", "sure", "to", "read", "the", "house", "rules"], kurdish: "تکایە دڵنیابەرەوە لەوەی کە یاساکانی ماڵەکە دەخوێنیتەوە", arabic: "الرجاء التأكد من قراءة قواعد المنزل" },
      { english: ["Where", "can", "I", "find", "the", "Wi-Fi", "password"], kurdish: "لە کوێ دەتوانم وشەی نهێنی وایفایەکە بدۆزمەوە؟", arabic: "أين يمكنني العثور على كلمة مرور الواي فاي؟" },
    ],
    fillBlanks: [
      { parts: ["We had a great time and will definitely leave a positive", "."], hint: "کاتی زۆر خۆشمان بەسەربرد و بێگومان هەڵسەنگاندنێکی ئەرێنی جێدەهێڵین.", answer: "review", wrongs: ["message", "text", "word"], arabicHint: "لقد قضينا وقتاً رائعاً وسنترك بالتأكيد تقييماً إيجابياً.", arabicParts: ["لقد قضينا وقتاً رائعاً وسنترك بالتأكيد","إيجابياً."], arabicAnswer: "تقييماً", arabicWrongs: ["رسالة","نصاً","كلمة"] },
      { parts: ["I couldn't open the door. What is the", "code again?"], hint: "نەمتوانی دەرگاکە بکەمەوە. کۆدی سندووقی قفڵەکە چی بوو؟", answer: "lockbox", wrongs: ["key", "safe", "door"], arabicHint: "لم أستطع فتح الباب. ما هو رمز صندوق المفاتيح مرة أخرى؟", arabicParts: ["لم أستطع فتح الباب. ما هو رمز","مرة أخرى؟"], arabicAnswer: "صندوق المفاتيح", arabicWrongs: ["المفتاح","الخزنة","الباب"] },
    ],
    conversations: [
      { situation: "نامە ناردن بۆ خاوەن ماڵی کرێی گەشتیاری", theyAsk: "Hi! You'll be arriving today. Let me know if you need anything.", correct: "Hi! I just arrived. The lockbox code isn't working. Could you resend the self check-in instructions?", wrong1: "Door is closed. I need code.", wrong2: "How I open the box?", wrong3: "I am here. Box is broken.", explanation: "'Self check-in' و 'Lockbox' زاراوەی تایبەتی خزمەتگوزارییەکانی وەک Airbnbـن", situationAr: "إرسال رسالة إلى صاحب مكان الإقامة السياحي", explanationAr: "'تس��يل الدخول الذاتي' و 'صندوق المفاتيح' هي مصطلحات خاصة بخدمات مثل Airbnb" },
    ],
  },

  // Lesson 5: Medical Emergencies Abroad
  {
    topic: "Medical Emergencies", topicKu: "باری لەناکاوی پزیشکی لە دەرەوە", topicAr: "حالات الطوارئ الطبية",
    words: [
      { english: "I need an ambulance",  kurdish: "پێویستم بە ئەمبولانسە (ئۆتۆمبێلی فریاکەوتن)", arabic: "أحتاج سيارة إسعاف" },
      { english: "Travel insurance",     kurdish: "دڵنیایی گەشتکردن (بۆ نەخۆشی)", arabic: "تأمين السفر" },
      { english: "Prescription medication", kurdish: "دەرمانی ڕەچەتە (بەپێی نووسراوی پزیشک)", arabic: "دواء بوصفة طبية" },
      { english: "Allergic reaction",    kurdish: "کاردانەوەی هەستیاری (حەساسیەت)", arabic: "رد فعل تحسسي" },
      { english: "Food poisoning",       kurdish: "ژەهراویبوونی خۆراک", arabic: "تسمم غذائي" },
    ],
    voices: [
      { prompt: "داوای یارمەتی خێرا", target: "Please call an ambulance, it's an emergency!", targetKurdish: "تکایە تەلەفۆن بۆ ئەمبولانس بکەن، ئەمە حاڵە��ێکی لەناکاوە!", promptAr: "طلب مساعدة سريعة", targetArabic: "الرجاء الاتصال بسيارة إسعاف، إنها حالة طارئة!" },
      { prompt: "باسکردنی کێشەی تەندروستی", target: "I think I have severe food poisoning.", targetKurdish: "پێم وایە ژەهراویبوونی خۆراکیی زۆر سەختم هەیە.", promptAr: "وصف المشكلة الصحية", targetArabic: "أعتقد أن لدي تسمم غذائي حاد." },
    ],
    sentences: [
      { english: ["Does", "your", "travel", "insurance", "cover", "hospital", "visits"], kurdish: "ئایا دڵنیایی گەشتەکەت تێچووی نەخۆشخانە دەگرێتەوە؟", arabic: "هل يغطي تأمين سفرك زيارات المستشفى؟" },
      { english: ["I", "am", "having", "a", "bad", "allergic", "reaction"], kurdish: "کاردانەوەیەکی هەستیاری (حەساسیەت)ی خراپم هەیە", arabic: "لدي رد فعل تحسسي سيء" },
    ],
    fillBlanks: [
      { parts: ["You can't buy these pills here without a", "."], hint: "ناتوانیت ئەم حەبانە لێرە بکڕیت بەبێ ڕەچەتە (نووسراوی پزیشک).", answer: "prescription", wrongs: ["doctor", "paper", "note"], arabicHint: "لا يمكنك شراء هذه الحبوب هنا بدون وصفة طبية.", arabicParts: ["لا يمكنك شراء هذه الحبوب هنا بدون","طبيّة."], arabicAnswer: "وصفة", arabicWrongs: ["طبيب","ورقة","ملاحظة"] },
      { parts: ["Make sure to buy", "insurance before you fly."], hint: "دڵنیابەرەوە لە کڕینی دڵنیایی گەشت پێش ئەوەی گەشت بکەیت.", answer: "travel", wrongs: ["flight", "ticket", "health"], arabicHint: "تأكد من شراء تأمين السفر قبل أن تسافر.", arabicParts: ["تأكد من شراء تأمين","قبل أن تسافر."], arabicAnswer: "السفر", arabicWrongs: ["الرحلة","التذكرة","الصحة"] },
    ],
    conversations: [
      { situation: "لە دەرمانخانەیەک لە دەرەوەی وڵات", theyAsk: "Are you okay? Do you need a doctor?", correct: "I think I'm having an allergic reaction to something I ate. Do you have any medicine, or do I need a prescription?", wrong1: "I sick from food. Give pill.", wrong2: "My body red. Medicine please.", wrong3: "I have allergy. I need drugs.", explanation: "لە دەرەوەی وڵات جیاوازی زۆر هەیە لە نێوان دەرمانی ئاسایی و دەرمانی 'prescription' (کە تەنها بە وەرەقەی دکتۆر دەدرێت)", situationAr: "في صيدلية خارج البلاد", explanationAr: "في الخارج، هناك فرق كبير بين الأدوية العادية والأدوية التي تحتاج إلى 'وصفة طبية' (التي تُعطى فقط بوصفة من الطبيب)" },
    ],
  },

  // Lesson 6: Haggling & Buying Souvenirs
  {
    topic: "Haggling (Bargaining)", topicKu: "مامەڵەکردن (کەمکردنەوەی نرخ)", topicAr: "المساومة (المفاصلة)",
    words: [
      { english: "Can you lower the price", kurdish: "دەتوانیت نرخەکە دابەزێنیت؟", arabic: "هل يمكنك تخفيض السعر؟" },
      { english: "That's a bit steep",   kurdish: "ئەوە کەمێک گرانە (زۆرە)", arabic: "هذا باهظ الثمن قليلاً" },
      { english: "What's your best price", kurdish: "کۆتا نرخت چەندە؟ (باشترین نرخت)", arabic: "ما هو أفضل سعر لديك؟" },
      { english: "I'll give you",        kurdish: "ئەوەندەت دەدەمێ...", arabic: "سأعطيك..." },
      { english: "Rip-off",              kurdish: "فێڵلێکردن (فرۆشتن بە نرخی زۆر بەرز)", arabic: "احتيال / سرقة" },
    ],
    voices: [
      { prompt: "داوای دابەزاندنی نرخ", target: "That's a bit steep. Can you lower the price?", targetKurdish: "ئەوە کەمێک گرانە. دەتوانیت نرخەکە دابەزێنیت؟", promptAr: "طلب تخفيض السعر", targetArabic: "هذا باهظ الثمن قليلاً. هل يمكنك تخفيض السعر؟" },
      { prompt: "پرسیار لە نرخی کۆتایی", target: "If I buy three, what's your best price?", targetKurdish: "ئەگەر سیانیان لێ بکڕم، کۆتا نرخت چەندە؟", promptAr: "السؤال عن السعر النهائي", targetArabic: "إذا اشتريت ثلاثة، فما هو أفضل سعر لديك؟" },
    ],
    sentences: [
      { english: ["Don't", "buy", "it", "there", "it", "is", "a", "rip-off"], kurdish: "لەوێ مەیکڕە، ئەوە فێڵلێکردنە (زۆر گرانە)", arabic: "لا تشتريه من هناك، إنه احتيال (باهظ الثمن جداً)" },
      { english: ["I'll", "give", "you", "twenty", "dollars", "for", "it"], kurdish: "بیست دۆلارت پێ دەدەم بۆ ئەوە", arabic: "سأعطيك عشرين دولاراً مقابل ذلك" },
    ],
    fillBlanks: [
      { parts: ["Fifty dollars? That's a bit", "for a small shirt."], hint: "پەنجا دۆلار؟ ئەوە کەمێک گرانە بۆ کراسێکی بچووک.", answer: "steep", wrongs: ["high", "much", "big"], arabicHint: "خمسون دولاراً؟ هذا باهظ الثمن قليلاً بالنسبة لقميص صغير.", arabicParts: ["خمسون دولاراً؟ هذا","قليلاً بالنسبة لقميص صغير."], arabicAnswer: "باهظ الثمن", arabicWrongs: ["مرتفع","كثير","كبير"] },
      { parts: ["$100 is a total", ". I saw it for $20 somewhere else."], hint: "١٠٠ دۆلار بەتەواوی فێڵلێکردنە (گرانە). لە شوێنێکی تر بە ٢٠ دۆلار بینیم.", answer: "rip-off", wrongs: ["scam", "bad", "fake"], arabicHint: "100 دولار هو احتيال تام. رأيته بـ 20 دولاراً في مكان آخر.", arabicParts: ["100 دولار هو","تام. رأيته بـ 20 دولاراً في مكان آخر."], arabicAnswer: "احتيال", arabicWrongs: ["نصب","سيء","مزيف"] },
    ],
    conversations: [
      { situation: "لە بازاڕێکی میللیدایت و دەتەوێت دیارییەک بکڕیت", theyAsk: "For you my friend, a special price: $50.", correct: "That's a bit steep for a small souvenir. What's your best price? I'll give you $30.", wrong1: "Too much money. I give 30.", wrong2: "Make it cheap. 50 is bad.", wrong3: "I want 30. 50 is rip-off.", explanation: "'That's a bit steep' و 'What's your best price' شێوازێکی زۆر باو و ڕێزدارانەن بۆ مامەڵەکردن و کەمکردنەوەی نرخ", situationAr: "أنت في سوق شعبي وتريد شراء هدية تذكارية", explanationAr: "'هذا باهظ الثمن قليلاً' و 'ما هو أفضل سعر لديك' هي طرق شائعة ومحترمة للمساومة وتخفيض السعر" },
    ],
  },

  // Lesson 7: Taking a Guided Tour
  {
    topic: "Guided Tours", topicKu: "گەشتی ڕێبەریکراو (لەگەڵ ڕێبەر/گاید)", topicAr: "الجولات المصحوبة بمرشدين",
    words: [
      { english: "Tour guide",           kurdish: "ڕێبەری گەشتیاری", arabic: "مرشد سياحي" },
      { english: "Meeting point",        kurdish: "خاڵی کۆبوونەوە (شوێنی یەکتربینین)", arabic: "نقطة التجمع" },
      { english: "Free time",            kurdish: "کاتی سەربەست (بۆ گەڕان بەتەنیا)", arabic: "وقت حر" },
      { english: "Admission fee",        kurdish: "کرێی چوونەژوورەوە", arabic: "رسوم الدخول" },
      { english: "Skip the line",        kurdish: "پەڕینەوە لە ڕیزەکە (بێ سەرە گرتن)", arabic: "تجاوز الطابور" },
    ],
    voices: [
      { prompt: "پرسیارکردن لە ڕێبەرەکە", target: "Excuse me, where is the meeting point after our free time?", targetKurdish: "ببوورە، خاڵی کۆبوونەوەکە لە کوێیە دوای کاتە سەربەستەکەمان؟", promptAr: "السؤال من المرشد", targetArabic: "عفواً، أين نقطة التجمع بعد وقتنا الحر؟" },
      { prompt: "کرێی شوێنەکان", target: "Does the ticket include the admission fee for the museum?", targetKurdish: "ئایا بلیتەکە کرێی چوونەژوورەوەی مۆزەخانەکەش لەخۆ دەگرێت؟", promptAr: "رسوم الأماكن", targetArabic: "هل تشمل التذكرة رسوم دخول المتحف؟" },
    ],
    sentences: [
      { english: ["We", "bought", "skip", "the", "line", "tickets", "online"], kurdish: "ئێمە بلیتی (بێ سەرە گرتن)مان بە ئۆنلاین کڕی", arabic: "اشترينا تذاكر تجاوز الطابور عبر الإنترنت" },
      { english: ["Our", "tour", "guide", "was", "very", "knowledgeable"], kurdish: "ڕێبەرە گەشتیارییەکەمان زۆر زانیاری هەبوو", arabic: "كان مرشدنا السياحي مطلعاً جداً" },
    ],
    fillBlanks: [
      { parts: ["We will have 30 minutes of", "time to take photos."], hint: "ئێمە ٣٠ خولەک کاتی سەربەستمان دەبێت بۆ وێنەگرتن.", answer: "free", wrongs: ["empty", "good", "relax"], arabicHint: "سيكون لدينا 30 دقيقة من الوقت الحر لالتقاط الصور.", arabicParts: ["سيكون لدينا 30 دقيقة من الوقت","لالتقاط الصور."], arabicAnswer: "الحر", arabicWrongs: ["الفارغ","الجيد","الاسترخاء"] },
      { parts: ["The", "point for the bus is next to the fountain."], hint: "خاڵی کۆبوونەوە بۆ پاسەکە لە تەنیشت نافوورەکەیە.", answer: "meeting", wrongs: ["start", "see", "wait"], arabicHint: "نقطة التجمع للحافلة بجوار النافورة.", arabicParts: ["نقطة","للحافلة بجوار النافورة."], arabicAnswer: "التجمع", arabicWrongs: ["البداية","الرؤية","الانتظار"] },
    ],
    conversations: [
      { situation: "قسەکردن لەگەڵ ڕێبەری گەشتەکەت", theyAsk: "We will go inside the castle now. Does everyone have their tickets?", correct: "I have my ticket, but I wanted to ask: is the admission fee included, and do we skip the line?", wrong1: "Do we wait in line? Is money paid?", wrong2: "I have ticket. I go in now?", wrong3: "Ticket here. No line?", explanation: "'Skip the line' خزمەتگوزارییەکی زۆر باوە لە ئەوروپا کە بە پارەی زیاتر سەرە نادەگریت", situationAr: "التحدث مع مرشدك السياحي", explanationAr: "'ت��اوز الطابور' هي خدمة شائعة جداً في أوروبا حيث لا تنتظر في الطابور مقابل مبلغ إضافي" },
    ],
  },

  // Lesson 8: Eating at Street Food Stalls
  {
    topic: "Street Food", topicKu: "خواردنی سەر شەقام (لە وڵاتانی تر)", topicAr: "طعام الشارع",
    words: [
      { english: "Is this spicy",        kurdish: "ئایا ئەمە توونە؟", arabic: "هل هذا حار؟" },
      { english: "What is the local specialty", kurdish: "تایبەتمەندی ناوچەکە چییە؟ (بەناوبانگترین خواردنی لۆکاڵی)", arabic: "ما هو الطبق المحلي المميز؟" },
      { english: "Food stall",           kurdish: "عەرەبانەی خواردن / دوکانی سەر شەقام", arabic: "عربة طعام / كشك طعام" },
      { english: "To go / Takeaway",     kurdish: "بۆ بردنەوە (نەخواردن لەوێ)", arabic: "للخارج / سفري" },
      { english: "Vegetarian options",   kurdish: "بژاردەی ڕووەکی", arabic: "خيارات نباتية" },
    ],
    voices: [
      { prompt: "پرسیار لە خواردنی ناوچەکە", target: "What is the local specialty here?", targetKurdish: "تایبەتمەندی (بەناوبانگترین خواردنی) ناوچەکە چییە لێرە؟", promptAr: "السؤال عن طعام المنطقة", targetArabic: "ما هو الطبق المحلي المميز هنا؟" },
      { prompt: "داوای بردنەوە", target: "I'll have two of these, to go please.", targetKurdish: "دوو دانە لەمانەم دەوێت، بۆ بردنەوە تکایە.", promptAr: "طلب الطعام سفري", targetArabic: "سآخذ اثنتين من هذه، سفري من فضلك." },
    ],
    sentences: [
      { english: ["Do", "you", "have", "any", "vegetarian", "options", "available"], kurdish: "ئایا هیچ بژاردەیەکی ڕووەکیتان بەردەستە؟", arabic: "هل لديكم أي خيارات نباتية متاحة؟" },
      { english: ["That", "food", "stall", "looks", "very", "popular", "with", "locals"], kurdish: "ئەو عەرەبانەی خواردنە وا دیارە زۆر لای خەڵکی ناوچەکە خۆشەویستە", arabic: "عربة الطعام تلك تبدو مشهورة جداً لدى السكان المحليين" },
    ],
    fillBlanks: [
      { parts: ["Can you make it not too", "? I can't handle chili."], hint: "دەتوانیت وا بکەیت زۆر توون نەبێت؟ بەرگەی بیبەر ناگرم.", answer: "spicy", wrongs: ["hot", "red", "strong"], arabicHint: "هل يمكنك جعله ليس حاراً جداً؟ لا أستطيع تحمل الفلفل.", arabicParts: ["هل يمكنك جعله ليس","جداً؟ لا أستطيع تحمل الفلفل."], arabicAnswer: "حاراً", arabicWrongs: ["ساخناً","أحمر","قوياً"] },
      { parts: ["I want this sandwich", "go, please."], hint: "ئەم لەفەیەم بۆ بردنەوە دەوێت تکایە.", answer: "to", wrongs: ["for", "away", "take"], arabicHint: "أريد هذه الشطيرة سفري، من فضلك.", arabicParts: ["أريد هذه الشطيرة","، من فضلك."], arabicAnswer: "سفري", arabicWrongs: ["لأجل","بعيداً","أخذ"] },
    ],
    conversations: [
      { situation: "لەلای عەرەبانەیەکی خواردن لە بانکوک یان مەکسیک", theyAsk: "Hi! What can I get for you today?", correct: "I'd like to try the local specialty, but is it spicy? If so, can you make it mild? And I'll take it to go.", wrong1: "Give me good food. No chili.", wrong2: "I want best food. Make it takeaway.", wrong3: "What is local food? I take away.", explanation: "لە ئەمریکا دەڵێن 'to go'، لە بەریتانیا دەڵێن 'takeaway' بۆ خواردنێک کە لەگەڵ خۆت دەیبەیت", situationAr: "عند عربة طعام في بانكوك أو المكسيك", explanationAr: "في أمريكا يقولون 'to go'، وفي بريطانيا يقولون 'takeaway' للطعام الذي تأخذه معك" },
    ],
  },

  // Lesson 9: Meeting Other Travelers
  {
    topic: "Meeting Other Travelers", topicKu: "یەکترناسینی گەشتیارانی تر (لە هۆستێ�� و گەشتەکان)", topicAr: "التعرف على مسافرين آخرين",
    words: [
      { english: "Where are you heading next", kurdish: "دواتر بەرەو کوێ دەڕۆیت؟ (وێستگەی داهاتووت کوێیە)", arabic: "إلى أين تتجه بعد ذلك؟" },
      { english: "How long have you been traveling", kurdish: "چەندە گەشت دەکەیت؟ (ماوەی چەندە لە گەشتدایت)", arabic: "منذ متى وأنت تسافر؟" },
      { english: "Any recommendations",  kurdish: "هیچ پێشنیارێکت هەیە؟ (بۆ شوێن و خواردن)", arabic: "هل لديك أي توصيات؟" },
      { english: "Solo traveler",        kurdish: "گەشتیاری تاقانە (کەسێک بەتەنیا گەشت دەکات)", arabic: "مسافر منفرد" },
      { english: "Keep in touch",        kurdish: "لە پەیوەندیدا دەبین (مانەوەی پەیوەندی)", arabic: "ابق على اتصال" },
    ],
    voices: [
      { prompt: "پرسیارکردن لە بەرنامەی داهاتوو", target: "Where are you heading next on your trip?", targetKurdish: "دواتر بەرەو کوێ دەڕۆیت لە گەشتەکەتدا؟", promptAr: "السؤال عن الخطط المستقبلية", targetArabic: "إلى أين تتجه بعد ذ��ك في رحلتك؟" },
      { prompt: "خواحافیزی کردن لە هاوڕێی نوێ", target: "It was great meeting you. Let's keep in touch!", targetKurdish: "بینینت زۆر خۆش بوو. با لە پەیوەندیدا بین!", promptAr: "توديع صديق جديد", targetArabic: "كان من الرائع مقابلتك. لنبق على اتصال!" },
    ],
    sentences: [
      { english: ["Do", "you", "have", "any", "recommendations", "for", "good", "restaurants"], kurdish: "هیچ پێشنیارێکت هەیە بۆ چێشتخانەی باش؟", arabic: "هل لديك أي توصيات لمطاعم جيدة؟" },
      { english: ["I", "am", "a", "solo", "traveler", "exploring", "Europe"], kurdish: "من گەشتیارێکی تاقانەم بە ئەوروپادا دەگەڕێم", arabic: "أنا مسافر منفرد أستكشف أوروبا" },
    ],
    fillBlanks: [
      { parts: ["Where are you", "next after you leave here?"], hint: "دواتر بەرەو کوێ دەڕۆیت دوای ئەوەی لێرە دەڕۆیت؟", answer: "heading", wrongs: ["going", "travel", "visiting"], arabicHint: "إلى أين تتجه بعد ذلك بعد أن تغادر هنا؟", arabicParts: ["إلى أين","بعد ذلك بعد أن تغادر هنا؟"], arabicAnswer: "تتجه", arabicWrongs: ["تذهب","تسافر","تزور"] },
      { parts: ["I hope we cross paths again. Let's keep in", "."], hint: "هیوادارم دووبارە یەکتر ببینینەوە. با لە پەیوەندیدا بین.", answer: "touch", wrongs: ["contact", "talk", "message"], arabicHint: "آمل أن نلتقي مرة أخرى. لنبق على تواصل.", arabicParts: ["آمل أن نلتقي مرة أخرى. لنبق على","."], arabicAnswer: "تواصل", arabicWrongs: ["اتصال","حديث","رسالة"] },
    ],
    conversations: [
      { situation: "قسەکردن لەگەڵ گەشتیارێکی تر لە هۆتێلەکە", theyAsk: "I just got here yesterday. I've been traveling for a month.", correct: "Wow, a whole month! I'm a solo traveler too. Where are you heading next? Do you have any recommendations for this city?", wrong1: "You travel long. Where you go?", wrong2: "I am alone. Tell me good places.", wrong3: "Where to next? Give me tips.", explanation: "'Where are you heading next' باوترین پرسیاری نێوان گەشتیارانە", situationAr: "التحدث مع مسافر آخر في الفندق", explanationAr: "'إلى أين تتجه بعد ذلك' هو السؤال الأكثر شيوعاً بين المسافرين" },
    ],
  },

];

export default normalUnit05;