import { UnitBank } from "../types";

// ── Unit 2: Work & Professional Life — 10 unique lessons ──────────────────────────
// Formal and polite English for the workplace, interviews, meetings, and business communication.

const normalUnit02: UnitBank = [

  // Lesson 0: Job Interviews
  {
    topic: "Job Interviews", topicKu: "چاوپێکەوتنی کار", topicAr: "مقابلات العمل",
    words: [
      { english: "I have experience in", kurdish: "ئەزموونم هەیە لە...", arabic: "لدي خبرة في" },
      { english: "My strengths are",     kurdish: "خاڵە بەهێزەکانم بریتین لە...", arabic: "نقاط قوتي هي" },
      { english: "I am a quick learner", kurdish: "خێرام لە فێربووندا", arabic: "أنا سريع التعلم" },
      { english: "Looking forward to",   kurdish: "بە تامەزرۆم بۆ...", arabic: "أتطلع إلى" },
      { english: "Valuable asset",       kurdish: "سەرمایەیەکی بەنرخ (کەسێکی بەسوود بۆ کۆمپانیا)", arabic: "مورد قيم / إضافة قيمة" },
    ],
    voices: [
      { prompt: "باسکردنی ئەزموون", target: "I have over five years of experience in marketing.", targetKurdish: "زیاتر لە پێنج ساڵ ئەزموونم لە بەبازاڕکردندا هەیە.", promptAr: "وصف الخبرة", targetArabic: "لدي أكثر من خمس سنوات من الخبرة في التسويق." },
      { prompt: "کۆتایی چاوپێکەوتن", target: "I am looking forward to hearing from you soon.", targetKurdish: "بە تامەزرۆم بۆ بیستنی هەواڵێک لە ئێوەوە بە زوویی.", promptAr: "إنهاء المقابلة", targetArabic: "أتطلع إلى الاستماع منكم قريبًا." },
    ],
    sentences: [
      { english: ["I", "believe", "I", "can", "be", "a", "valuable", "asset"], kurdish: "پێم وایە دەتوانم کەسێکی زۆر بەسوود بم بۆ تیمەکە", arabic: "أعتقد أنني أستطيع أ�� أكون إضافة قيمة" },
      { english: ["I", "am", "a", "quick", "learner", "and", "a", "hard", "worker"], kurdish: "من خێرام لە فێربووندا و کەسێکی ماندوونەناسم", arabic: "أنا سريع التعلم ومجتهد" },
    ],
    fillBlanks: [
      { parts: ["I have a lot of", "in this field."], hint: "ئەزموونێکی زۆرم لەم بوارەدا هەیە.", answer: "experience", wrongs: ["work", "time", "job"], arabicHint: "لدي الكثير من الخبرة في هذا المجال.", arabicParts: ["لدي الكثير من","في هذا المجال."], arabicAnswer: "الخبرة", arabicWrongs: ["العمل","الوقت","الوظيفة"] },
      { parts: ["I am looking", "to the opportunity to work here."], hint: "بە تامەزرۆم بۆ ئەو دەرفەتەی لێرە کار بکەم.", answer: "forward", wrongs: ["ahead", "front", "waiting"], arabicHint: "أنا أتطلع إلى فرصة العمل هنا.", arabicParts: ["أنا","إلى فرصة العمل هنا."], arabicAnswer: "أتطلع", arabicWrongs: ["أتقدم","أمام","أنتظر"] },
    ],
    conversations: [
      { situation: "لە چاوپێکەوتنی کار لێت دەپرسن بۆچی تۆ هەڵبژێرن", theyAsk: "Why should we hire you for this position?", correct: "I have extensive experience in this field, and I am a quick learner. I believe I can be a valuable asset to your team.", wrong1: "I need money.", wrong2: "Give me job.", wrong3: "I am good boy.", explanation: "'valuable asset' و 'extensive experience' دەستەواژەی زۆر بەهێزن لە چاوپێکەوتندا کە متمانەبەخۆبوون پیشان دەدەن", situationAr: "في مقابلة عمل، ي��سألونك لماذا يجب أن يختاروك", explanationAr: "'مورد قيم' و 'خبرة واسعة' عبارات قوية جدًا في المقابلات تظهر الثقة بالنفس" },
    ],
  },

  // Lesson 1: Office Communication
  {
    topic: "Office Communication", topicKu: "پەیوەندیکردن لە ئۆفیس", topicAr: "التواصل في المكتب",
    words: [
      { english: "Can you send me",      kurdish: "دەتوانیت بۆم بنێریت؟", arabic: "هل يمكنك أن ترسل لي" },
      { english: "I'll keep you posted", kurdish: "ئاگادارت دەکەمەوە (لە پێشهاتەکان)", arabic: "سأبقيك على اطلاع" },
      { english: "I'll look into it",    kurdish: "بەدواداچوونی بۆ دەکەم", arabic: "سأبحث في الأمر" },
      { english: "Get back to you",      kurdish: "وەڵامت دەدەمەوە (دواتر)", arabic: "سأعود إليك / سأرد عليك" },
      { english: "Deadline",             kurdish: "دوا مۆڵەت", arabic: "الموعد النهائي" },
    ],
    voices: [
      { prompt: "بەڵێندان بە پێدانی زانیاری نوێ", target: "I don't have the answer yet, but I'll keep you posted.", targetKurdish: "هێشتا وەڵامەکەم لا نییە، بەڵام ئاگادارت دەکەمەوە لە پێشهاتەکان.", promptAr: "الوعد بتقديم معلومات جديدة", targetArabic: "ليس لدي الإجابة بعد، لكنني سأبقيك على اطلاع." },
      { prompt: "دواخستنی وەڵام بۆ بەدواداچوون", target: "I'll look into it and get back to you shortly.", targetKurdish: "بەدواداچوونی بۆ دەکەم و بە زوویی وەڵامت دەدەمەوە.", promptAr: "تأجيل الرد للمتابعة", targetArabic: "سأبحث في الأمر وسأعود إليك قريبًا." },
    ],
    sentences: [
      { english: ["Could", "you", "send", "me", "the", "updated", "report"], kurdish: "دەتوانیت ڕاپۆرتە نوێکراوەکەم بۆ بنێریت؟", arabic: "هل يمكنك أن ترسل لي التقرير المحدث" },
      { english: ["The", "deadline", "for", "this", "project", "is", "Friday"], kurdish: "دوا مۆڵەت بۆ ئەم پڕۆژەیە ڕۆژی هەینییە", arabic: "الموعد النهائي لهذا المشروع هو يوم الجمعة" },
    ],
    fillBlanks: [
      { parts: ["I'll keep you", "on any updates."], hint: "لە هەر پێشهاتێکی نوێ ئاگادارت دەکەمەوە.", answer: "posted", wrongs: ["told", "knowing", "seen"], arabicHint: "سأبقيك على اطلاع بأي تحديثات.", arabicParts: ["سأبقيك على","بأي تحديثات."], arabicAnswer: "اطلاع", arabicWrongs: ["علم","معرفة","رؤية"] },
      { parts: ["I'll check with the team and get", "to you."], hint: "لەگەڵ تیمەکە پرسیار دەکەم و وەڵامت دەدەمەوە.", answer: "back", wrongs: ["return", "reply", "answer"], arabicHint: "سأتحقق مع الفريق وأعود إليك.", arabicParts: ["سأتحقق مع الفريق و","إليك."], arabicAnswer: "أعود", arabicWrongs: ["أرجع","أرد","أجيب"] },
    ],
    conversations: [
      { situation: "هاوپیشەیەک پرسیارت لێ دەکات دەربارەی بابەتێک کە نایزانیت", theyAsk: "Do you know if the client approved the final design?", correct: "I am not sure. I'll look into it and get back to you shortly.", wrong1: "I don't know.", wrong2: "Wait.", wrong3: "I check.", explanation: "'I'll look into it and get back to you' ڕێگەیەکی زۆر پیشەگەرانەیە بۆ ئەوەی بڵێیت نازانم بەڵام بەدواداچوونی بۆ دەکەیت", situationAr: "يسألك زميل في العمل عن موضوع لا تعرفه", explanationAr: "'سأبحث في الأمر وسأعود إليك' طريقة احترافية جدًا لقول أنك لا تعرف ولكنك ستتابع الأمر" },
    ],
  },

  // Lesson 2: Leading & Participating in Meetings
  {
    topic: "Meetings", topicKu: "کۆبوونەوەکان", topicAr: "الاجتماعات",
    words: [
      { english: "Let's get started",    kurdish: "با دەست پێ بکەین", arabic: "لنبدأ" },
      { english: "I completely agree",   kurdish: "بەتەواوی هاوڕام", arabic: "أنا أتفق تمامًا" },
      { english: "From my perspective",  kurdish: "لە ڕوانگەی منەوە / بە ڕای من", arabic: "من وجهة نظري" },
      { english: "Let's move on to",     kurdish: "با بچینە سەر...", arabic: "دعنا ننتقل إلى" },
      { english: "Action items",         kurdish: "ئەو کارانەی کە دەبێت بکرێن (دوای کۆبوونەوە)", arabic: "بنود العمل / المهام" },
    ],
    voices: [
      { prompt: "دەستپێکردنی کۆبوونەوە", target: "Since everyone is here, let's get started.", targetKurdish: "لەبەرئەوەی هەمووان لێرەن، با دەست پێ بکەین.", promptAr: "بدء الاجتماع", targetArabic: "بما أن الجميع هنا، فلنبدأ." },
      { prompt: "گۆڕینی بابەت", target: "Let's move on to the next item on the agenda.", targetKurdish: "با بچینە سەر خاڵی داهاتوو لە بەرنامەی کارەکەدا.", promptAr: "تغيير الموضوع", targetArabic: "دعنا ننتقل إلى البند التالي في جدول الأعمال." },
    ],
    sentences: [
      { english: ["From", "my", "perspective", "this", "is", "the", "best", "option"], kurdish: "لە ڕوانگەی منەوە ئەمە باشترین هەڵبژاردەیە", arabic: "من وجهة نظري هذا هو الخيار الأفضل" },
      { english: ["Let's", "review", "the", "action", "items", "before", "we", "finish"], kurdish: "با پێداچوونەوە بە کارە پێویستەکاندا بکەین پێش ئەوەی تەواو بین", arabic: "دعنا نراجع بنود العمل قبل أن ننتهي" },
    ],
    fillBlanks: [
      { parts: ["From my", ", we need to increase the budget."], hint: "لە ڕوانگەی منەوە، پێویستە بودجەکە زیاد بکەین.", answer: "perspective", wrongs: ["mind", "eyes", "seeing"], arabicHint: "من وجهة نظري، نحتاج إلى زيادة الميزانية.", arabicParts: ["من وجهة","، نحتاج إلى زيادة الميزانية."], arabicAnswer: "نظري", arabicWrongs: ["عقلي","عيني","رؤيتي"] },
      { parts: ["Let's get", "with the meeting."], hint: "با دەست بکەین بە کۆبوونەوەکە.", answer: "started", wrongs: ["begin", "go", "ready"], arabicHint: "دعنا نبدأ الاجتماع.", arabicParts: ["دعنا","الاجتماع."], arabicAnswer: "نبدأ", arabicWrongs: ["نشرع","نذهب","نستعد"] },
    ],
    conversations: [
      { situation: "بەڕێوەبردنی کۆبوونەوەیەک کە کاتی کەمە", theyAsk: "Should we discuss the marketing budget now?", correct: "Yes, let's move on to the budget. From my perspective, we need more funds.", wrong1: "We talk budget.", wrong2: "Go to budget.", wrong3: "I think budget good.", explanation: "'Let's move on to...' ڕستەیەکی زۆر بەکاره��تووە لە کۆبوونەوەکاندا بۆ گۆڕینی بابەت بە شێوەیەکی ڕێکخراو", situationAr: "إدارة اجتماع بوقت محدود", explanationAr: "'دعنا ننتقل إلى...' جملة شائعة جدًا في الاجتماعات لتغيير الموضوع بطريقة منظمة" },
    ],
  },

  // Lesson 3: Phone Calls at Work
  {
    topic: "Professional Phone Calls", topicKu: "پەیوەندی تەلەفۆنی فەرمی", topicAr: "المكالمات الهاتفية الاحترافية",
    words: [
      { english: "Speaking",             kurdish: "فەرموو لەگەڵتم (کاتی وەڵامدانەوەی تەلەفۆن)", arabic: "تفضل، أنا المتحدث" },
      { english: "May I ask who is calling", kurdish: "دەتوانم بپرسم کێ پەیوەندی کردووە؟", arabic: "هل لي أن أسأل من المتصل؟" },
      { english: "Hold the line",        kurdish: "لەسەر هێڵ بە / چاوەڕێ بکە", arabic: "الرجاء الانتظار على الخط" },
      { english: "I'll put you through", kurdish: "پەیوەندییەکەت بۆ دەگوازمەوە", arabic: "سأوصلك به" },
      { english: "Leave a message",      kurdish: "جێهێشتنی پەیام", arabic: "ترك رسالة" },
    ],
    voices: [
      { prompt: "گواستنەوەی پەیوەندی", target: "Please hold the line, I'll put you through to the manager.", targetKurdish: "تکایە لەسەر هێڵ بە، پەیوەندییەکەت بۆ بەڕێوەبەر دەگوازمەوە.", promptAr: "تحويل المكالمة", targetArabic: "الرجاء الانتظار على الخط، سأوصلك بالمدير." },
      { prompt: "پرسین لە ناوی پەیوەندیکار", target: "May I ask who is calling, please?", targetKurdish: "تکایە، دەتوانم بپرسم کێ پەیوەندی کردووە؟", promptAr: "السؤال عن اسم المتصل", targetArabic: "هل لي أن أسأل من المتصل، من فضلك؟" },
    ],
    sentences: [
      { english: ["Would", "you", "like", "to", "leave", "a", "message"], kurdish: "دەتەوێت پەیامێک جێبهێڵیت؟", arabic: "هل ترغب في ترك رسالة؟" },
      { english: ["I'm", "afraid", "he", "is", "in", "a", "meeting"], kurdish: "بەداخەوەم (دەترسم) ئەو لە کۆبوونەوەدایە", arabic: "أخشى أنه في اجتماع" },
    ],
    fillBlanks: [
      { parts: ["Please", "the line, I'm transferring you now."], hint: "تکایە لەسەر هێڵ بە، ئێستا پەیوەندییەکەت دەگوازمەوە.", answer: "hold", wrongs: ["stay", "keep", "wait"], arabicHint: "الرجاء الانتظار على الخط، أنا أحولك الآن.", arabicParts: ["الرجاء","على الخط، أنا أحولك الآن."], arabicAnswer: "الانتظار", arabicWrongs: ["البقاء","الحفاظ","الترقب"] },
      { parts: ["May I ask who is", "?"], hint: "دەتوانم بپرسم کێ پەیوەندی کردووە؟", answer: "calling", wrongs: ["speaking", "talking", "ringing"], arabicHint: "هل لي أن أسأل من المتصل؟", arabicParts: ["هل لي أن أسأل من","؟"], arabicAnswer: "المتصل", arabicWrongs: ["المتحدث","المتكلم","الرنين"] },
    ],
    conversations: [
      { situation: "کەسێک بە تەلەفۆن داوای بەڕێوەبەرەکەت دەکات کە لە کۆبوونەوەدایە", theyAsk: "Hello, could I speak to Mr. Smith, please?", correct: "I'm afraid he's in a meeting right now. Would you like to leave a message?", wrong1: "He not here.", wrong2: "No Smith.", wrong3: "Say message.", explanation: "'I'm afraid he's in a meeting' زۆر پیشەگەرانەترە، و 'Would you like to leave a message' ئادابی ستانداردی سکرتێرییە", situationAr: "شخص يتصل هاتفيًا ويطلب مديرك الذي في اجتماع", explanationAr: "'أخشى أنه في اجتماع' أكثر احترافية، و 'هل ترغب في ترك رسالة' هو آداب سكرتارية قياسية" },
    ],
  },

  // Lesson 4: Dealing with Problems & Apologies
  {
    topic: "Solving Problems", topicKu: "چارەسەرکردنی کێشەکان", topicAr: "حل المشكلات",
    words: [
      { english: "We've run into a problem", kurdish: "تو��شی کێشەیەک بووین", arabic: "لقد واجهنا مشكلة" },
      { english: "I sincerely apologize", kurdish: "لە دڵەوە داوای لێبوردن دەکەم", arabic: "أعتذر بصدق" },
      { english: "Let's figure this out", kurdish: "با چارەسەرێکی بۆ بدۆزینەوە", arabic: "دعنا نكتشف هذا / دعنا نجد حلاً" },
      { english: "Take care of it",      kurdish: "من چارەسەری دەکەم (ئەرکەکەی دەگرمە ئەستۆ)", arabic: "سأعتني بالأمر" },
      { english: "Inconvenience",        kurdish: "ناڕەحەتی / ئەزیەت", arabic: "إزعاج / إرباك" },
    ],
    voices: [
      { prompt: "ئاگادارکردنەوە لە کێشەیەک", target: "We've run into a minor problem with the server.", targetKurdish: "تووشی کێشەیەکی بچووک بووین لەگەڵ سێرڤەرەکەدا.", promptAr: "الإبلاغ عن مشكلة", targetArabic: "لقد واجهنا مشكلة بسيطة مع الخادم." },
      { prompt: "گرتنەئەستۆی کێشەیەک", target: "Don't worry, I will take care of it right away.", targetKurdish: "خەمت نەبێت، دەستبەجێ من ئەرکی چارەسەرکردنەکەی دەگرمە ئەستۆ.", promptAr: "تحمل مسؤولية مشكلة", targetArabic: "لا تقلق، سأعتني بالأمر على الفور." },
    ],
    sentences: [
      { english: ["I", "sincerely", "apologize", "for", "the", "inconvenience"], kurdish: "لە دڵەوە داوای لێبوردن دەکەم بۆ ئەو ئەزیەتەی پێمان گەیاندیت", arabic: "أعتذر بصدق عن الإزعاج" },
      { english: ["Let's", "figure", "this", "out", "together"], kurdish: "با پێکەوە چارەسەرێکی بۆ بدۆزینەوە", arabic: "دعنا نكتشف هذا معًا" },
    ],
    fillBlanks: [
      { parts: ["We've", "into a problem with the delivery."], hint: "تووشی کێشەیەک بووین لەگەڵ گەیاندنەکەدا.", answer: "run", wrongs: ["walked", "got", "had"], arabicHint: "لقد واجهنا مشكلة في التوصيل.", arabicParts: ["لقد","مشكلة في التوصيل."], arabicAnswer: "واجهنا", arabicWrongs: ["مشينا","حصلنا","كان"] },
      { parts: ["Leave it to me, I will take", "of it."], hint: "بۆ منى جێبهێڵە، من ئەرکەکەی دەگرمە ئەستۆ.", answer: "care", wrongs: ["fix", "job", "work"], arabicHint: "اترك الأمر لي، سأعتني بالأمر.", arabicParts: ["اترك الأمر لي،","بالأمر."], arabicAnswer: "سأعتني", arabicWrongs: ["سأصلح","سأعمل","سأنجز"] },
    ],
    conversations: [
      { situation: "کڕیارێک زۆر تووڕەیە چونکە کاڵاکەی دواکەوتووە", theyAsk: "My order is a week late! This is unacceptable.", correct: "I sincerely apologize for the inconvenience. Let me look into this and take care of it immediately.", wrong1: "Sorry.", wrong2: "I don't know.", wrong3: "Wait more.", explanation: "'I sincerely apologize' داوای لێبوردنێکی فەرمییە، و 'take care of it' پیشانی دەدات کە تۆ بەرپرسیارێتییەکە هەڵدەگریت", situationAr: "عميل غاضب جدًا لأن بضاعته تأخرت", explanationAr: "'أعتذر بصدق' هو اعتذار رسمي، و 'سأعتني بالأمر' يظهر أنك تتحمل المسؤولية" },
    ],
  },

  // Lesson 5: Email Etiquette & Follow-ups
  {
    topic: "Email Etiquette", topicKu: "ئادابی ئیمەیڵ ناردن", topicAr: "آداب البريد الإلكتروني",
    words: [
      { english: "Just following up on", kurdish: "تەنها بەدواداچوون دەکەم بۆ...", arabic: "فقط للمتابعة بشأن" },
      { english: "Please find attached", kurdish: "تکایە هاوپێچکراوەکە ببینە", arabic: "الرجاء الاطلاع على المرفق" },
      { english: "Don't hesitate to reach out", kurdish: "دوودڵ مەبە لە پەیوەندیکردن", arabic: "لا تتردد في التواصل" },
      { english: "As requested",         kurdish: "وەک چۆن داواتان کردبوو", arabic: "كما هو مطلوب" },
      { english: "Looking forward to your reply", kurdish: "بە تامەزرۆم بۆ وەڵامەکەت", arabic: "أتطلع إلى ردكم" },
    ],
    voices: [
      { prompt: "بەدواداچوون بۆ ئیمەیڵێک", target: "I'm just following up on the email I sent yesterday.", targetKurdish: "تەنها بەدواداچوون دەکەم بۆ ئەو ئیمەیڵەی دوێنێ ناردم.", promptAr: "متابعة بريد إلكتروني", targetArabic: "أنا فقط أتابع البريد الإلكتروني الذي أرسلته بالأمس." },
      { prompt: "ئاماژەدان بە فایلێکی هاوپێچ", target: "Please find attached the report for this month.", targetKurdish: "تکایە ڕاپۆرتی ئەم مانگە ببینە کە هاوپێچ کراوە.", promptAr: "الإشارة إلى ملف مرفق", targetArabic: "الرجاء الاطلاع على التقرير المرفق لهذا الشهر." },
    ],
    sentences: [
      { english: ["If", "you", "have", "any", "questions", "don't", "hesitate", "to", "reach", "out"], kurdish: "ئەگەر هەر پرسیارێکت هەیە دوودڵ مەبە لە پەیوەندیکردن پێمەوە", arabic: "إذا كان لديك أي أسئلة، فلا تتردد في التواصل" },
      { english: ["As", "requested", "here", "is", "the", "updated", "file"], kurdish: "وەک داوات کردبوو، فەرموو ئەمە فایلە نوێکراوەکەیە", arabic: "كما هو مطلوب، إليك الملف المحدث" },
    ],
    fillBlanks: [
      { parts: ["Just", "up on the invoice from last week."], hint: "تەنها بەدواداچوون دەکەم بۆ پسووڵەی هەفتەی ڕابردوو.", answer: "following", wrongs: ["checking", "asking", "seeing"], arabicHint: "مجرد متابعة لفاتورة الأسبوع الماضي.", arabicParts: ["مجرد","لفاتورة الأسبوع الماضي."], arabicAnswer: "متابعة", arabicWrongs: ["تحقق","سؤال","رؤية"] },
      { parts: ["Please find", "the document you asked for."], hint: "تکایە ئەو بەڵگەنامەیە ببینە کە داوات کردبوو (کە لکێنراوە بە ئیمەیڵەکەوە).", answer: "attached", wrongs: ["added", "included", "sent"], arabicHint: "الرجاء الاطلاع على المستند المرفق الذي طلبته.", arabicParts: ["الرجاء الاطلاع على المستند","الذي طلبته."], arabicAnswer: "المرفق", arabicWrongs: ["المضاف","المتضمن","المرسل"] },
    ],
    conversations: [
      { situation: "ئیمەیڵێک دەنێریت کە فایلێکی تێدایە و دەتەوێت وەڵامیان هەبێت", theyAsk: "Hi, did you manage to finish the quarterly report?", correct: "Yes, as requested, please find attached the report. I am looking forward to your feedback.", wrong1: "Here is file.", wrong2: "I attach report.", wrong3: "Read the file.", explanation: "'Please find attached' ستانداردترین دەستەواژەی ئیمەیڵە کاتێک فایلێک دەنێریت", situationAr: "ترسل بريدًا إلكترونيًا يحتوي على ملف وتريد ردًا منهم", explanationAr: "'الرجاء الاطلاع على المرفق' هي العبارة الأكثر شيوعًا في البريد الإلكتروني عند إرسال ملف" },
    ],
  },

  // Lesson 6: Giving Presentations
  {
    topic: "Presentations", topicKu: "پێشکەشکردنی بابەت (پریزێنتەیشن)", topicAr: "العروض التقديمية",
    words: [
      { english: "I'd like to present",  kurdish: "دەمەوێت پێشکەشی بکەم", arabic: "أود أن أقدم" },
      { english: "As you can see here",  kurdish: "وەک لێرەدا دەیبینن", arabic: "كما ترون هنا" },
      { english: "To sum up",            kurdish: "بۆ پوختەکردنەوە / لە کۆتاییدا", arabic: "لتلخيص الأمر" },
      { english: "Any questions so far", kurdish: "تا ئێرە هیچ پرسیارێک هەیە؟", arabic: "هل من أسئلة حتى الآن؟" },
      { english: "Let's move to the next slide", kurdish: "با بچینە سەر سلایدی داهاتوو", arabic: "دعنا ننتقل إلى الشريحة التالية" },
    ],
    voices: [
      { prompt: "دەستستپێکی پێشکەشکردن", target: "Today, I'd like to present our new marketing strategy.", targetKurdish: "ئەمڕۆ، دەمەوێت سترات��ژییە نوێیەکەی بەبازاڕکردنمان پێشکەش بکەم.", promptAr: "بداية العرض التقديمي", targetArabic: "اليوم، أود أن أقدم استراتيجيتنا التسويقية الجديدة." },
      { prompt: "کۆتاییهێنان بە پێشکەشکردن", target: "To sum up, our sales have increased by twenty percent.", targetKurdish: "بۆ پوختەکردنەوە، فرۆشەکانمان سەدا بیست زیادیان کردووە.", promptAr: "إنهاء العرض التقديمي", targetArabic: "لتلخيص الأمر، زادت مبيعاتنا بنسبة عشرين بالمائة." },
    ],
    sentences: [
      { english: ["As", "you", "can", "see", "here", "on", "the", "graph"], kurdish: "وەک لێرەدا لەسەر هێڵکارییەکە دەیبینن", arabic: "كما ترون هنا على الرسم البياني" },
      { english: ["Are", "there", "any", "questions", "so", "far"], kurdish: "تا ئێرە هیچ پرسیارێک هەیە؟", arabic: "هل من أسئلة حتى الآن؟" },
    ],
    fillBlanks: [
      { parts: ["Let's move to the next", "."], hint: "با بچینە سەر سلایدی داهاتوو.", answer: "slide", wrongs: ["page", "picture", "paper"], arabicHint: "دعنا ننتقل إلى الشريحة التالية.", arabicParts: ["دعنا ننتقل إلى","التالية."], arabicAnswer: "الشريحة", arabicWrongs: ["الصفحة","الصورة","الورقة"] },
      { parts: ["To", "up, we need to focus on quality."], hint: "بۆ پوختەکردنەوە، پێویستە تەرکیز بکەینە سەر کوالێتی.", answer: "sum", wrongs: ["end", "close", "finish"], arabicHint: "لتلخيص الأمر، نحتاج إلى التركيز على الجودة.", arabicParts: ["لـ","الأمر، نحتاج إلى التركيز على الجودة."], arabicAnswer: "تلخيص", arabicWrongs: ["إنهاء","إغلاق","إكمال"] },
    ],
    conversations: [
      { situation: "لەکاتی پێشکەشکردندا دەتەوێت بپرسیت ئایا کەس پرسیاری هەیە", theyAsk: "...and that covers the technical details of the product.", correct: "Before we move to the next slide, are there any questions so far?", wrong1: "Who has question?", wrong2: "You want to ask?", wrong3: "I wait for questions.", explanation: "'Are there any questions so far?' زۆر بەئەدەبە و ڕێگە دەدات ئامادەبووان بە ئاسوودەیی پرسیار بکەن", situationAr: "أثناء العرض التقديمي، تريد أن تسأل إذا كان لدى أحد أسئلة", explanationAr: "'هل من أسئلة حتى الآن؟' مهذبة جدًا وتسمح للحضور بطرح الأسئلة براحة" },
    ],
  },

  // Lesson 7: Negotiating
  {
    topic: "Negotiating", topicKu: "گفتوگۆکردن (مامەڵەکردن لە کاردا)", topicAr: "التفاوض",
    words: [
      { english: "We can offer you",     kurdish: "دەتوانین پێت پێشکەش بکەین", arabic: "يمكننا أن نقدم لك" },
      { english: "Is there any flexibility", kurdish: "ئایا هیچ نەرمی نواندنێک هەیە (لە نرخ/مەرج)؟", arabic: "هل هناك أي مرونة؟" },
      { english: "Meet halfway",         kurdish: "ڕێککەوتن لە ناوەڕاستدا (هەردوولا کەمێک سازش بکەن)", arabic: "نتفق في منتصف الطريق" },
      { english: "Bottom line",          kurdish: "خاڵی کۆتایی / کەمترین ئاست کە قبوڵ بکرێت", arabic: "الحد الأدنى / الخلاصة" },
      { english: "Win-win situation",    kurdish: "بارودۆخێک هەردوولا براوە بن", arabic: "وضع مربح للطرفين" },
    ],
    voices: [
      { prompt: "پرسین لە نەرمی نواندن", target: "Is there any flexibility with the price?", targetKurdish: "ئایا هیچ نەرمییەک هەیە لە نرخەکەدا؟", promptAr: "السؤال عن المرونة", targetArabic: "هل هناك أي مرونة في السعر؟" },
      { prompt: "پێشنیارکردنی سازش", target: "Let's meet halfway. How about ten percent discount?", targetKurdish: "با لە ناوەڕاستدا ڕێککەوین. چی دەڵێیت بۆ سەدا دە داشکاندن؟", promptAr: "اقتراح تسوية", targetArabic: "دعنا نتفق في منتصف الطريق. ماذا عن خصم عشرة بالمائة؟" },
    ],
    sentences: [
      { english: ["I", "think", "we", "can", "reach", "a", "win-win", "situation"], kurdish: "پێم وایە دەتوانین بگەینە بارودۆخێک کە هەردوولا براوە بین", arabic: "أعتقد أننا نستطيع الوصول إلى وضع مربح للطرفين" },
      { english: ["My", "bottom", "line", "is", "fifty", "dollars"], kurdish: "دوا نرخم پەنجا دۆلارە (خوار ئەوە قبوڵ ناکەم)", arabic: "الحد الأدنى لي هو خمسون دولارًا" },
    ],
    fillBlanks: [
      { parts: ["Is there any", "in your budget?"], hint: "ئایا هیچ نەرمییەک لە بودجەکەتاندا هەیە؟", answer: "flexibility", wrongs: ["change", "moving", "space"], arabicHint: "هل هناك أي مرونة في ميزانيتك؟", arabicParts: ["هل هناك أي","في ميزانيتك؟"], arabicAnswer: "مرونة", arabicWrongs: ["تغيير","حركة","مساحة"] },
      { parts: ["Let's meet", "and agree on this price."], hint: "با لە ناوەڕاستدا ڕێککەوین و لەسەر ئەم نرخە ڕازی بین.", answer: "halfway", wrongs: ["middle", "center", "between"], arabicHint: "دعنا نتفق في منتصف الطريق ونوافق على هذا السعر.", arabicParts: ["دعنا نتفق في","الطريق ونوافق على هذا السعر."], arabicAnswer: "منتصف", arabicWrongs: ["وسط","مركز","بين"] },
    ],
    conversations: [
      { situation: "دەتەوێت داشکاندنێک بکەیت بۆ کڕیارێک بەڵام ئەو زۆری دەوێت", theyAsk: "I want a 20% discount on this contract.", correct: "We can't do 20%, but let's meet halfway. We can offer you a 10% discount. That's our bottom line.", wrong1: "No 20%. I give 10%.", wrong2: "20 is too much.", wrong3: "I don't give discount.", explanation: "'Let's meet halfway' زاراوەیەکی زۆر باوی بازرگانییە کاتێک دەتەوێت بگەیتە ڕێککەوتنێک", situationAr: "تريد تقديم خصم لعميل لكنه يريد الكثير", explanationAr: "'دعنا نتفق في منتصف الطريق' مصطلح تجاري شائع جدًا عندما تريد التوصل إلى اتفاق" },
    ],
  },

  // Lesson 8: Giving Feedback & Reviews
  {
    topic: "Giving Feedback", topicKu: "پێدانی هەڵسەنگاندن (فیدباک)", topicAr: "تقديم الملاحظات",
    words: [
      { english: "Constructive feedback", kurdish: "هەڵسەنگاندنی بنیاتنەر (بۆ باشترکردن)", arabic: "ملاحظات بناءة" },
      { english: "You're doing great",   kurdish: "کارێکی زۆر باش دەکەیت", arabic: "أنت تقوم بعمل رائع" },
      { english: "Room for improvement", kurdish: "بواری بەرەوپێشچوون ماوە", arabic: "مجال للتحسين" },
      { english: "Keep up the good work", kurdish: "بەردەوام بە لەم کارە باشە", arabic: "اس��مر في العمل الجيد" },
      { english: "Focus more on",        kurdish: "زیاتر تەرکیز بکەرە سەر...", arabic: "ركز أكثر على" },
    ],
    voices: [
      { prompt: "پێدانی فیدباکی ئەرێنی", target: "You're doing great, just keep up the good work.", targetKurdish: "کارێکی زۆر باش دەکەیت، تەنها بەردەوام بە لەم کارە باشە.", promptAr: "تقديم ملاحظات إيجابية", targetArabic: "أنت تقوم بعمل رائع، فقط استمر في العمل الجيد." },
      { prompt: "پێشنیارکردنی باشترکردن", target: "There is some room for improvement in your presentations.", targetKurdish: "بواری بەرەوپێشچوون ماوە لە پێشکەشکردنەکانتدا.", promptAr: "اقتراح تحسين", targetArabic: "هناك بعض المجال للتحسين في عروضك التقديمية." },
    ],
    sentences: [
      { english: ["I", "have", "some", "constructive", "feedback", "for", "you"], kurdish: "چەند هەڵسەنگاندنێکی بنیاتنەرم هەیە بۆت", arabic: "لدي بعض الملاحظات البناءة لك" },
      { english: ["You", "need", "to", "focus", "more", "on", "details"], kurdish: "پێویستە زیاتر تەرکیز بکەیتە سەر وردەکارییەکان", arabic: "تحتاج إلى التركيز أكثر على التفاصيل" },
    ],
    fillBlanks: [
      { parts: ["There is always", "for improvement."], hint: "هەمیشە بواری بەرەوپێشچوون ماوە.", answer: "room", wrongs: ["space", "place", "time"], arabicHint: "هناك دائماً مجال للتحسين.", arabicParts: ["هناك دائماً","للتحسين."], arabicAnswer: "مجال", arabicWrongs: ["مساحة","مكان","وقت"] },
      { parts: ["Keep up the good", "!"], hint: "بەردەوام بە لەم کارە باشە!", answer: "work", wrongs: ["job", "doing", "thing"], arabicHint: "استمر في العمل الجيد!", arabicParts: ["استمر في","الجيد!"], arabicAnswer: "العمل", arabicWrongs: ["الوظيفة","الفعل","الشيء"] },
    ],
    conversations: [
      { situation: "هەڵسەنگاندنی کارمەندێک دەکەیت کە کارەکەی باشە بەڵام کەمێک خاوە", theyAsk: "How has my performance been this month?", correct: "You're doing great, but there's room for improvement with deadlines. Keep up the good work, just focus more on time management.", wrong1: "You are good but slow.", wrong2: "Work faster next time.", wrong3: "I don't like your speed.", explanation: "'room for improvement' ڕێگەیەکی زۆر نەرم و ئەرێنییە بۆ وتنی ئەوەی کە کەموکوڕییەک هەیە", situationAr: "تقوم بتقييم موظف عمله جيد ولكنه بطيء قليلا��", explanationAr: "'مجال للتحسين' طريقة لطيفة وإيجابية جدًا لقول أن هناك نقصًا" },
    ],
  },

  // Lesson 9: Networking & Building Connections
  {
    topic: "Networking", topicKu: "دروستکردنی پەیوەندی پیشەیی", topicAr: "بناء العلاقات المهنية",
    words: [
      { english: "Keep in touch",        kurdish: "لە پەیوەندیدا دەبین", arabic: "ابق على اتصال" },
      { english: "Exchange contact details", kurdish: "گۆڕینەوەی زانیاری پەیوەندی (ژمارە/ئیمەیڵ)", arabic: "تبادل تفاصيل الاتصال" },
      { english: "Connect on LinkedIn",  kurdish: "پەیوەندیکردن لە لینکدین", arabic: "تواصل على لينكد إن" },
      { english: "It was a pleasure",    kurdish: "جێگەی شانازی / خۆشحاڵی بوو", arabic: "كان من دواعي سروري" },
      { english: "Mutual contact",       kurdish: "ناسراوی هاوبەش", arabic: "جهة اتصال مشتركة" },
    ],
    voices: [
      { prompt: "داوای ژمارە یان ئیمەیڵ", target: "Should we exchange contact details?", targetKurdish: "ئایا باشە زانیاری پەیوەندیکردنمان بگۆڕینەوە؟", promptAr: "طلب رقم أو بريد إلكتروني", targetArabic: "هل يجب أن نتبادل تفاصيل الاتصال؟" },
      { prompt: "کۆتاییهێنان بە قسەکردن لە کۆنفرانسێک", target: "It was a pleasure meeting you. Let's keep in touch.", targetKurdish: "ناسینت جێگەی خۆشحاڵی بوو. با لە پەیوەندیدا بین.", promptAr: "إنهاء المحادثة في مؤتمر", targetArabic: "كان من دواعي سروري مقابلتك. دعنا نبقى على اتصال." },
    ],
    sentences: [
      { english: ["I", "think", "we", "have", "a", "mutual", "contact"], kurdish: "پێم وایە ناسراوێکی هاوبەشمان هەیە", arabic: "أعتقد أن لدينا جهة اتصال مشتركة" },
      { english: ["Let's", "connect", "on", "LinkedIn", "later"], kurdish: "با دواتر لە لینکدین پەیوەندی بە یەکەوە بکەین", arabic: "دعنا نتواصل على لينكد إن لاحقًا" },
    ],
    fillBlanks: [
      { parts: ["Let's exchange contact", "before you leave."], hint: "با زانیاری پەیوەندیکردنمان بگۆڕینەوە پێش ئەوەی بڕۆیت.", answer: "details", wrongs: ["info", "papers", "numbers"], arabicHint: "دعنا نتبادل تفاصيل الاتصال قبل أن تغادر.", arabicParts: ["دعنا نتبادل","الاتصال قبل أن تغادر."], arabicAnswer: "تفاصيل", arabicWrongs: ["معلومات","أوراق","أرقام"] },
      { parts: ["It was a", "meeting you today."], hint: "ئەمڕۆ ناسینت جێگەی شانازی (خۆشحاڵی) بوو.", answer: "pleasure", wrongs: ["good", "happy", "nice"], arabicHint: "كان من دواعي سروري مقابلتك اليوم.", arabicParts: ["كان من دواعي","مقابلتك اليوم."], arabicAnswer: "سروري", arabicWrongs: ["فرحتي","سعادتي","بهجتي"] },
    ],
    conversations: [
      { situation: "لە کۆنفرانسێکی بازرگانیدا کەسێک دەناسیت", theyAsk: "I need to go to the next session now. It was nice talking to you.", correct: "It was a pleasure meeting you too. Should we exchange contact details? I'd love to keep in touch.", wrong1: "Give me your number.", wrong2: "I want to talk more later.", wrong3: "Call me.", explanation: "'exchange contact details' و 'keep in touch' باشترین وشەکانن بۆ دروستکردنی پەیوەندی لە بۆنە فەرمییەکاندا", situationAr: "في مؤتمر عمل، تتعرف على شخص", explanationAr: "'تبادل تفاصيل الاتصال' و 'ابق على اتصال' هي أفضل الكلمات لبناء العلاقات في المناسبات الرسمية" },
    ],
  },

];

export default normalUnit02;