import { UnitBank } from "../types";

// ── Unit 2: Work & Professional Life — 10 unique lessons ──────────────────────────
// Formal and polite English for the workplace, interviews, meetings, and business communication.

const normalUnit02: UnitBank = [

  // Lesson 0: Job Interviews
  {
    topic: "Job Interviews", topicKu: "چاوپێکەوتنی کار", topicAr: "مقابلات العمل",
    words: [
      { english: "I have experience in", kurdish: "ئەزموونم هەیە لە...", arabic: "عندي خبرة بـ" },
      { english: "My strengths are",     kurdish: "خاڵە بەهێزەکانم بریتین لە...", arabic: "نقاط قوتي هي" },
      { english: "I am a quick learner", kurdish: "خێرام لە فێربووندا", arabic: "اني سريع التعلم" },
      { english: "Looking forward to",   kurdish: "بە تامەزرۆم بۆ...", arabic: "متحمس / منتظر" },
      { english: "Valuable asset",       kurdish: "سەرمایەیەکی بەنرخ (کەسێکی بەسوود بۆ کۆمپانیا)", arabic: "شخص مفيد / اضافة للفريق" },
    ],
    voices: [
      { prompt: "باسکردنی ئەزموون", target: "I have over five years of experience in marketing.", targetKurdish: "زیاتر لە پێنج ساڵ ئەزموونم لە بەبازاڕکردندا هەیە.", promptAr: "وصف الخبرة", targetArabic: "عندي اكثر من خمس سنين خبرة بالتسويق." },
      { prompt: "کۆتایی چاوپێکەوتن", target: "I am looking forward to hearing from you soon.", targetKurdish: "بە تامەزرۆم بۆ بیستنی هەواڵێک لە ئێوەوە بە زوویی.", promptAr: "نهاية المقابلة", targetArabic: "منتظر اسمع منكم قريب." },
    ],
    sentences: [
      { english: ["I", "believe", "I", "can", "be", "a", "valuable", "asset"], kurdish: "پێم وایە دەتوانم کەسێکی زۆر بەسوود بم بۆ تیمەکە", arabic: "اعتقد اكدر اكون اضافة قوية للفريق" },
      { english: ["I", "am", "a", "quick", "learner", "and", "a", "hard", "worker"], kurdish: "من خێرام لە فێربووندا و کەسێکی ماندوونەناسم", arabic: "اني سريع التعلم وشغيل" },
    ],
    fillBlanks: [
      { parts: ["I have a lot of", "in this field."], hint: "ئەزموونێکی زۆرم لەم بوارەدا هەیە.", answer: "experience", wrongs: ["work", "time", "job"], arabicHint: "عندي هواية خبرة بهالمجال.", arabicParts: ["عندي هواية","بهالمجال."], arabicAnswer: "خبرة", arabicWrongs: ["شغل","وقت","وظيفة"] },
      { parts: ["I am looking", "to the opportunity to work here."], hint: "بە تامەزرۆم بۆ ئەو دەرفەتەی لێرە کار بکەم.", answer: "forward", wrongs: ["ahead", "front", "waiting"], arabicHint: "اني متحمس لفرصة الشغل هنا.", arabicParts: ["اني","لفرصة الشغل هنا."], arabicAnswer: "متحمس", arabicWrongs: ["اتقدم","كدام","انتظر"] },
    ],
    conversations: [
      { situation: "لە چاوپێکەوتنی کار لێت دەپرسن بۆچی تۆ هەڵبژێرن", theyAsk: "Why should we hire you for this position?", correct: "I have extensive experience in this field, and I am a quick learner. I believe I can be a valuable asset to your team.", wrong1: "I need money.", wrong2: "Give me job.", wrong3: "I am good boy.", explanation: "'valuable asset' و 'extensive experience' دەستەواژەی زۆر بەهێزن لە چاوپێکەوتندا کە متمانەبەخۆبوون پیشان دەدەن", situationAr: "بمقابلة شغل، يسألوك ليش لازم يعينوك", explanationAr: "'اضافة قوية' و 'خبرة واسعة' عبارات كلش قوية بالمقابلات تبين الثقة بالنفس" },
    ],
  },

  // Lesson 1: Office Communication
  {
    topic: "Office Communication", topicKu: "پەیوەندیکردن لە ئۆفیس", topicAr: "التواصل بالمكتب",
    words: [
      { english: "Can you send me",      kurdish: "دەتوانیت بۆم بنێریت؟", arabic: "تكدر تدزلي" },
      { english: "I'll keep you posted", kurdish: "ئاگادارت دەکەمەوە (لە پێشهاتەکان)", arabic: "راح اخليك بالصورة" },
      { english: "I'll look into it",    kurdish: "بەدواداچوونی بۆ دەکەم", arabic: "راح اتابع الموضوع" },
      { english: "Get back to you",      kurdish: "وەڵامت دەدەمەوە (دواتر)", arabic: "راح اردلك / راح ارجعلك خبر" },
      { english: "Deadline",             kurdish: "دوا مۆڵەت", arabic: "الديدلاين / اخر موعد" },
    ],
    voices: [
      { prompt: "بەڵێندان بە پێدانی زانیاری نوێ", target: "I don't have the answer yet, but I'll keep you posted.", targetKurdish: "هێشتا وەڵامەکەم لا نییە، بەڵام ئاگادارت دەکەمەوە لە پێشهاتەکان.", promptAr: "وعد بمعلومات جديدة", targetArabic: "ما عندي الجواب هسة، بس راح اخليك بالصورة." },
      { prompt: "دواخستنی وەڵام بۆ بەدواداچوون", target: "I'll look into it and get back to you shortly.", targetKurdish: "بەدواداچوونی بۆ دەکەم و بە زوویی وەڵامت دەدەمەوە.", promptAr: "تأجيل الرد للمتابعة", targetArabic: "راح اتابع الموضوع وارجعلك خبر قريب." },
    ],
    sentences: [
      { english: ["Could", "you", "send", "me", "the", "updated", "report"], kurdish: "دەتوانیت ڕاپۆرتە نوێکراوەکەم بۆ بنێریت؟", arabic: "تكدر تدزلي التقرير المحدث" },
      { english: ["The", "deadline", "for", "this", "project", "is", "Friday"], kurdish: "دوا مۆڵەت بۆ ئەم پڕۆژەیە ڕۆژی هەینییە", arabic: "الديدلاين لهالمشروع يوم الجمعة" },
    ],
    fillBlanks: [
      { parts: ["I'll keep you", "on any updates."], hint: "لە هەر پێشهاتێکی نوێ ئاگادارت دەکەمەوە.", answer: "posted", wrongs: ["told", "knowing", "seen"], arabicHint: "راح اخليك بالصورة بأي تحديثات.", arabicParts: ["راح اخليك","بأي تحديثات."], arabicAnswer: "بالصورة", arabicWrongs: ["علم","معرفة","رؤية"] },
      { parts: ["I'll check with the team and get", "to you."], hint: "لەگەڵ تیمەکە پرسیار دەکەم و وەڵامت دەدەمەوە.", answer: "back", wrongs: ["return", "reply", "answer"], arabicHint: "راح اسأل الفريق و ارجعلك خبر.", arabicParts: ["راح اسأل الفريق و","خبر."], arabicAnswer: "ارجعلك", arabicWrongs: ["ارجع","ارد","اجاوب"] },
    ],
    conversations: [
      { situation: "هاوپیشەیەک پرسیارت لێ دەکات دەربارەی بابەتێک کە نایزانیت", theyAsk: "Do you know if the client approved the final design?", correct: "I am not sure. I'll look into it and get back to you shortly.", wrong1: "I don't know.", wrong2: "Wait.", wrong3: "I check.", explanation: "'I'll look into it and get back to you' ڕێگەیەکی زۆر پیشەگەرانەیە بۆ ئەوەی بڵێیت نازانم بەڵام بەدواداچوونی بۆ دەکەیت", situationAr: "زميلك بالشغل يسألك عن موضوع متعرفه", explanationAr: "'راح اتابع الموضوع وارجعلك خبر' طريقة كلش احترافية تكول بيها ما اعرف بس راح اتابع" },
    ],
  },

  // Lesson 2: Leading & Participating in Meetings
  {
    topic: "Meetings", topicKu: "کۆبوونەوەکان", topicAr: "الاجتماعات",
    words: [
      { english: "Let's get started",    kurdish: "با دەست پێ بکەین", arabic: "خلي نبدي" },
      { english: "I completely agree",   kurdish: "بەتەواوی هاوڕام", arabic: "اني متفق تماماً" },
      { english: "From my perspective",  kurdish: "لە ڕوانگەی منەوە / بە ڕای من", arabic: "برأيي" },
      { english: "Let's move on to",     kurdish: "با بچینە سەر...", arabic: "خلي ننتقل لـ" },
      { english: "Action items",         kurdish: "ئەو کارانەی کە دەبێت بکرێن (دوای کۆبوونەوە)", arabic: "الشغلات اللي لازم نسويها" },
    ],
    voices: [
      { prompt: "دەستپێکردنی کۆبوونەوە", target: "Since everyone is here, let's get started.", targetKurdish: "لەبەرئەوەی هەمووان لێرەن، با دەست پێ بکەین.", promptAr: "بداية الاجتماع", targetArabic: "بما انو الكل هنا، خلي نبدي." },
      { prompt: "گۆڕینی بابەت", target: "Let's move on to the next item on the agenda.", targetKurdish: "با بچینە سەر خاڵی داهاتوو لە بەرنامەی کارەکەدا.", promptAr: "تغيير الموضوع", targetArabic: "خلي ننتقل للنقطة الجاية بجدول الاعمال." },
    ],
    sentences: [
      { english: ["From", "my", "perspective", "this", "is", "the", "best", "option"], kurdish: "لە ڕوانگەی منەوە ئەمە باشترین هەڵبژاردەیە", arabic: "برأيي هذا احسن خيار" },
      { english: ["Let's", "review", "the", "action", "items", "before", "we", "finish"], kurdish: "با پێداچوونەوە بە کارە پێویستەکاندا بکەین پێش ئەوەی تەواو بین", arabic: "خلي نراجع الشغلات قبل ما نخلص" },
    ],
    fillBlanks: [
      { parts: ["From my", ", we need to increase the budget."], hint: "لە ڕوانگەی منەوە، پێویستە بودجەکە زیاد بکەین.", answer: "perspective", wrongs: ["mind", "eyes", "seeing"], arabicHint: "برأيي، لازم نزيد الميزانية.", arabicParts: ["برأيي","، لازم نزيد الميزانية."], arabicAnswer: "برأيي", arabicWrongs: ["عقلي","عيني","رؤيتي"] },
      { parts: ["Let's get", "with the meeting."], hint: "با دەست بکەین بە کۆبوونەوەکە.", answer: "started", wrongs: ["begin", "go", "ready"], arabicHint: "خلي نبدي الاجتماع.", arabicParts: ["خلي","الاجتماع."], arabicAnswer: "نبدي", arabicWrongs: ["نشرع","نروح","نستعد"] },
    ],
    conversations: [
      { situation: "بەڕێوەبردنی کۆبوونەوەیەک کە کاتی کەمە", theyAsk: "Should we discuss the marketing budget now?", correct: "Yes, let's move on to the budget. From my perspective, we need more funds.", wrong1: "We talk budget.", wrong2: "Go to budget.", wrong3: "I think budget good.", explanation: "'Let's move on to...' ڕستەیەکی زۆر بەکارهاتووە لە کۆبوونەوەکاندا بۆ گۆڕینی بابەت بە شێوەیەکی ڕێکخراو", situationAr: "ادارة اجتماع بوقت محدود", explanationAr: "'خلي ننتقل لـ...' جملة كلش شائعة بالاجتماعات لتغيير الموضوع بطريقة منظمة" },
    ],
  },

  // Lesson 3: Phone Calls at Work
  {
    topic: "Professional Phone Calls", topicKu: "پەیوەندی تەلەفۆنی فەرمی", topicAr: "المكالمات التلفونية بالعمل",
    words: [
      { english: "Speaking",             kurdish: "فەرموو لەگەڵتم (کاتی وەڵامدانەوەی تەلەفۆن)", arabic: "تفضل، اني وياك" },
      { english: "May I ask who is calling", kurdish: "دەتوانم بپرسم کێ پەیوەندی کردووە؟", arabic: "اكدر اعرف منو يتصل؟" },
      { english: "Hold the line",        kurdish: "لەسەر هێڵ بە / چاوەڕێ بکە", arabic: "بلا زحمة انطر على الخط" },
      { english: "I'll put you through", kurdish: "پەیوەندییەکەت بۆ دەگوازمەوە", arabic: "راح احولك عليه" },
      { english: "Leave a message",      kurdish: "جێهێشتنی پەیام", arabic: "تترك رسالة" },
    ],
    voices: [
      { prompt: "گواستنەوەی پەیوەندی", target: "Please hold the line, I'll put you through to the manager.", targetKurdish: "تکایە لەسەر هێڵ بە، پەیوەندییەکەت بۆ بەڕێوەبەر دەگوازمەوە.", promptAr: "تحويل المكالمة", targetArabic: "بلا زحمة انطر على الخط، راح احولك على المدير." },
      { prompt: "پرسین لە ناوی پەیوەندیکار", target: "May I ask who is calling, please?", targetKurdish: "تکایە، دەتوانم بپرسم کێ پەیوەندی کردووە؟", promptAr: "السؤال عن اسم المتصل", targetArabic: "بلا زحمة، اكدر اعرف منو يتصل؟" },
    ],
    sentences: [
      { english: ["Would", "you", "like", "to", "leave", "a", "message"], kurdish: "دەتەوێت پەیامێک جێبهێڵیت؟", arabic: "تريد تترك رسالة؟" },
      { english: ["I'm", "afraid", "he", "is", "in", "a", "meeting"], kurdish: "بەداخەوەم (دەترسم) ئەو لە کۆبوونەوەدایە", arabic: "للأسف هو باجتماع" },
    ],
    fillBlanks: [
      { parts: ["Please", "the line, I'm transferring you now."], hint: "تکایە لەسەر هێڵ بە، ئێستا پەیوەندییەکەت دەگوازمەوە.", answer: "hold", wrongs: ["stay", "keep", "wait"], arabicHint: "بلا زحمة انطر على الخط، هسة احولك.", arabicParts: ["بلا زحمة","على الخط، هسة احولك."], arabicAnswer: "انطر", arabicWrongs: ["ابقى","حافظ","ترقب"] },
      { parts: ["May I ask who is", "?"], hint: "دەتوانم بپرسم کێ پەیوەندی کردووە؟", answer: "calling", wrongs: ["speaking", "talking", "ringing"], arabicHint: "اكدر اعرف منو يتصل؟", arabicParts: ["اكدر اعرف منو","؟"], arabicAnswer: "يتصل", arabicWrongs: ["يحجي","يحكي","يدگ"] },
    ],
    conversations: [
      { situation: "کەسێک بە تەلەفۆن داوای بەڕێوەبەرەکەت دەکات کە لە کۆبوونەوەدایە", theyAsk: "Hello, could I speak to Mr. Smith, please?", correct: "I'm afraid he's in a meeting right now. Would you like to leave a message?", wrong1: "He not here.", wrong2: "No Smith.", wrong3: "Say message.", explanation: "'I'm afraid he's in a meeting' زۆر پیشەگەرانەترە، و 'Would you like to leave a message' ئادابی ستانداردی سکرتێرییە", situationAr: "واحد يتصل ويريد مديرك اللي باجتماع", explanationAr: "'للأسف هو باجتماع' اكثر احترافية، و 'تريد تترك رسالة' هي اداب سكرتارية معتادة" },
    ],
  },

  // Lesson 4: Dealing with Problems & Apologies
  {
    topic: "Solving Problems", topicKu: "چارەسەرکردنی کێشەکان", topicAr: "حل المشاكل",
    words: [
      { english: "We've run into a problem", kurdish: "توشی کێشەیەک بووین", arabic: "طلعتلنا مشكلة" },
      { english: "I sincerely apologize", kurdish: "لە دڵەوە داوای لێبوردن دەکەم", arabic: "كلش اعتذر" },
      { english: "Let's figure this out", kurdish: "با چارەسەرێکی بۆ بدۆزینەوە", arabic: "خلي نلكيلها حل" },
      { english: "Take care of it",      kurdish: "من چارەسەری دەکەم (ئەرکەکەی دەگرمە ئەستۆ)", arabic: "اني استلم الموضوع" },
      { english: "Inconvenience",        kurdish: "ناڕەحەتی / ئەزیەت", arabic: "ازعاج" },
    ],
    voices: [
      { prompt: "ئاگادارکردنەوە لە کێشەیەک", target: "We've run into a minor problem with the server.", targetKurdish: "تووشی کێشەیەکی بچووک بووین لەگەڵ سێرڤەرەکەدا.", promptAr: "التبليغ عن مشكلة", targetArabic: "طلعتلنا مشكلة بسيطة بالسيرفر." },
      { prompt: "گرتنەئەستۆی کێشەیەک", target: "Don't worry, I will take care of it right away.", targetKurdish: "خەمت نەبێت، دەستبەجێ من ئەرکی چارەسەرکردنەکەی دەگرمە ئەستۆ.", promptAr: "استلام مسؤولية المشكلة", targetArabic: "لا تشيل هم، اني استلم الموضوع هسة." },
    ],
    sentences: [
      { english: ["I", "sincerely", "apologize", "for", "the", "inconvenience"], kurdish: "لە دڵەوە داوای لێبوردن دەکەم بۆ ئەو ئەزیەتەی پێمان گەیاندیت", arabic: "كلش اعتذر على الازعاج" },
      { english: ["Let's", "figure", "this", "out", "together"], kurdish: "با پێکەوە چارەسەرێکی بۆ بدۆزینەوە", arabic: "خلي نلكيلها حل سوية" },
    ],
    fillBlanks: [
      { parts: ["We've", "into a problem with the delivery."], hint: "تووشی کێشەیەک بووین لەگەڵ گەیاندنەکەدا.", answer: "run", wrongs: ["walked", "got", "had"], arabicHint: "طلعتلنا مشكلة بالتوصيل.", arabicParts: ["طلعتلنا","بالتوصيل."], arabicAnswer: "مشكلة", arabicWrongs: ["سالفة","قصة","حجية"] },
      { parts: ["Leave it to me, I will take", "of it."], hint: "بۆ منى جێبهێڵە، من ئەرکەکەی دەگرمە ئەستۆ.", answer: "care", wrongs: ["fix", "job", "work"], arabicHint: "عوف الموضوع عليه، اني استلمه.", arabicParts: ["عوف الموضوع عليه، اني","."], arabicAnswer: "استلمه", arabicWrongs: ["اسوي","اخلصه","ارتبه"] },
    ],
    conversations: [
      { situation: "کڕیارێک زۆر تووڕەیە چونکە کاڵاکەی دواکەوتووە", theyAsk: "My order is a week late! This is unacceptable.", correct: "I sincerely apologize for the inconvenience. Let me look into this and take care of it immediately.", wrong1: "Sorry.", wrong2: "I don't know.", wrong3: "Wait more.", explanation: "'I sincerely apologize' داوای لێبوردنێکی فەرمییە، و 'take care of it' پیشانی دەدات کە تۆ بەرپرسیارێتییەکە هەڵدەگریت", situationAr: "زبون كلش ضايج لان غراضه تأخرت", explanationAr: "'كلش اعتذر' اعتذار رسمي، و 'اني استلم الموضوع' تبين انك تتحمل المسؤولية" },
    ],
  },

  // Lesson 5: Email Etiquette & Follow-ups
  {
    topic: "Email Etiquette", topicKu: "ئادابی ئیمەیڵ ناردن", topicAr: "اداب الايميل",
    words: [
      { english: "Just following up on", kurdish: "تەنها بەدواداچوون دەکەم بۆ...", arabic: "بس داتابع بخصوص" },
      { english: "Please find attached", kurdish: "تکایە هاوپێچکراوەکە ببینە", arabic: "بلا زحمة شوف المرفق" },
      { english: "Don't hesitate to reach out", kurdish: "دوودڵ مەبە لە پەیوەندیکردن", arabic: "لا تتردد تتواصل وياي" },
      { english: "As requested",         kurdish: "وەک چۆن داواتان کردبوو", arabic: "مثل ما طلبت" },
      { english: "Looking forward to your reply", kurdish: "بە تامەزرۆم بۆ وەڵامەکەت", arabic: "منتظر ردك" },
    ],
    voices: [
      { prompt: "بەدواداچوون بۆ ئیمەیڵێک", target: "I'm just following up on the email I sent yesterday.", targetKurdish: "تەنها بەدواداچوون دەکەم بۆ ئەو ئیمەیڵەی دوێنێ ناردم.", promptAr: "متابعة بريد إلكتروني", targetArabic: "اني بس داتابع الايميل اللي دزيته البارحة." },
      { prompt: "ئاماژەدان بە فایلێکی هاوپێچ", target: "Please find attached the report for this month.", targetKurdish: "تکایە ڕاپۆرتی ئەم مانگە ببینە کە هاوپێچ کراوە.", promptAr: "الإشارة إلى ملف مرفق", targetArabic: "بلا زحمة شوف التقرير المرفق مال هذا الشهر." },
    ],
    sentences: [
      { english: ["If", "you", "have", "any", "questions", "don't", "hesitate", "to", "reach", "out"], kurdish: "ئەگەر هەر پرسیارێکت هەیە دوودڵ مەبە لە پەیوەندیکردن پێمەوە", arabic: "اذا عندك اي اسئلة، لا تتردد تتواصل وياي" },
      { english: ["As", "requested", "here", "is", "the", "updated", "file"], kurdish: "وەک داوات کردبوو، فەرموو ئەمە فایلە نوێکراوەکەیە", arabic: "مثل ما طلبت، هذا الملف المحدث" },
    ],
    fillBlanks: [
      { parts: ["Just", "up on the invoice from last week."], hint: "تەنها بەدواداچوون دەکەم بۆ پسووڵەی هەفتەی ڕابردوو.", answer: "following", wrongs: ["checking", "asking", "seeing"], arabicHint: "بس داتابع فاتورة الاسبوع الراح.", arabicParts: ["بس","فاتورة الاسبوع الراح."], arabicAnswer: "داتابع", arabicWrongs: ["اشيك","اسأل","اشوف"] },
      { parts: ["Please find", "the document you asked for."], hint: "تکایە ئەو بەڵگەنامەیە ببینە کە داوات کردبوو (کە لکێنراوە بە ئیمەیڵەکەوە).", answer: "attached", wrongs: ["added", "included", "sent"], arabicHint: "بلا زحمة شوف الملف المرفق اللي طلبته.", arabicParts: ["بلا زحمة شوف الملف","اللي طلبته."], arabicAnswer: "المرفق", arabicWrongs: ["المضاف","المتضمن","المرسل"] },
    ],
    conversations: [
      { situation: "ئیمەیڵێک دەنێریت کە فایلێکی تێدایە و دەتەوێت وەڵامیان هەبێت", theyAsk: "Hi, did you manage to finish the quarterly report?", correct: "Yes, as requested, please find attached the report. I am looking forward to your feedback.", wrong1: "Here is file.", wrong2: "I attach report.", wrong3: "Read the file.", explanation: "'Please find attached' ستانداردترین دەستەواژەی ئیمەیڵە کاتێک فایلێک دەنێریت", situationAr: "تدز ايميل بي ملف وتريد ردهم", explanationAr: "'بلا زحمة شوف المرفق' هي العبارة الاكثر استخدام بالايميل من تدز ملف" },
    ],
  },

  // Lesson 6: Giving Presentations
  {
    topic: "Presentations", topicKu: "پێشکەشکردنی بابەت (پریزێنتەیشن)", topicAr: "العروض التقديمية",
    words: [
      { english: "I'd like to present",  kurdish: "دەمەوێت پێشکەشی بکەم", arabic: "اريد اقدم / اراويكم" },
      { english: "As you can see here",  kurdish: "وەک لێرەدا دەیبینن", arabic: "مثل مدتشوفون هنا" },
      { english: "To sum up",            kurdish: "بۆ پوختەکردنەوە / لە کۆتاییدا", arabic: "حتى نلخص الموضوع" },
      { english: "Any questions so far", kurdish: "تا ئێرە هیچ پرسیارێک هەیە؟", arabic: "اكو اي اسئلة لحد الان؟" },
      { english: "Let's move to the next slide", kurdish: "با بچینە سەر سلایدی داهاتوو", arabic: "خلي ننتقل للسلايد الجاي" },
    ],
    voices: [
      { prompt: "دەستستپێکی پێشکەشکردن", target: "Today, I'd like to present our new marketing strategy.", targetKurdish: "ئەمڕۆ، دەمەوێت ستراتیژییە نوێیەکەی بەبازاڕکردنمان پێشکەش بکەم.", promptAr: "بداية العرض التقديمي", targetArabic: "اليوم، اريد اقدم استراتيجيتنا التسويقية الجديدة." },
      { prompt: "کۆتاییهێنان بە پێشکەشکردن", target: "To sum up, our sales have increased by twenty percent.", targetKurdish: "بۆ پوختەکردنەوە، فرۆشەکانمان سەدا بیست زیادیان کردووە.", promptAr: "إنهاء العرض التقديمي", targetArabic: "حتى نلخص الموضوع، مبيعاتنا زادت بنسبة عشرين بالمية." },
    ],
    sentences: [
      { english: ["As", "you", "can", "see", "here", "on", "the", "graph"], kurdish: "وەک لێرەدا لەسەر هێڵکارییەکە دەیبینن", arabic: "مثل مدتشوفون هنا على الرسم البياني" },
      { english: ["Are", "there", "any", "questions", "so", "far"], kurdish: "تا ئێرە هیچ پرسیارێک هەیە؟", arabic: "اكو اي اسئلة لحد الان؟" },
    ],
    fillBlanks: [
      { parts: ["Let's move to the next", "."], hint: "با بچینە سەر سلایدی داهاتوو.", answer: "slide", wrongs: ["page", "picture", "paper"], arabicHint: "خلي ننتقل للسلايد الجاي.", arabicParts: ["خلي ننتقل للـ","الجاي."], arabicAnswer: "سلايد", arabicWrongs: ["صفحة","صورة","ورقة"] },
      { parts: ["To", "up, we need to focus on quality."], hint: "بۆ پوختەکردنەوە، پێویستە تەرکیز بکەینە سەر کوالێتی.", answer: "sum", wrongs: ["end", "close", "finish"], arabicHint: "حتى نلخص الموضوع، لازم نركز على الجودة.", arabicParts: ["حتى نلخص الـ","، لازم نركز على الجودة."], arabicAnswer: "موضوع", arabicWrongs: ["شغلة","نهاية","فكرة"] },
    ],
    conversations: [
      { situation: "لەکاتی پێشکەشکردندا دەتەوێت بپرسیت ئایا کەس پرسیاری هەیە", theyAsk: "...and that covers the technical details of the product.", correct: "Before we move to the next slide, are there any questions so far?", wrong1: "Who has question?", wrong2: "You want to ask?", wrong3: "I wait for questions.", explanation: "'Are there any questions so far?' زۆر بەئەدەبە و ڕێگە دەدات ئامادەبووان بە ئاسوودەیی پرسیار بکەن", situationAr: "بخلال البرزنتيشن، تريد تسأل اذا احد عنده اسئلة", explanationAr: "'اكو اي اسئلة لحد الان؟' كلش مؤدبة وتخلي الحضور يسألون براحتهم" },
    ],
  },

  // Lesson 7: Negotiating
  {
    topic: "Negotiating", topicKu: "گفتوگۆکردن (مامەڵەکردن لە کاردا)", topicAr: "التفاوض",
    words: [
      { english: "We can offer you",     kurdish: "دەتوانین پێت پێشکەش بکەین", arabic: "نكدر نقدم لك" },
      { english: "Is there any flexibility", kurdish: "ئایا هیچ نەرمی نواندنێک هەیە (لە نرخ/مەرج)؟", arabic: "اكو اي مجال / مرونة؟" },
      { english: "Meet halfway",         kurdish: "ڕێککەوتن لە ناوەڕاستدا (هەردوولا کەمێک سازش بکەن)", arabic: "نتفق بالنص / نلتقي بالنص" },
      { english: "Bottom line",          kurdish: "خاڵی کۆتایی / کەمترین ئاست کە قبوڵ بکرێت", arabic: "الحد الادنى / من الاخير" },
      { english: "Win-win situation",    kurdish: "بارودۆخێک هەردوولا براوە بن", arabic: "وضع يفيد الطرفين" },
    ],
    voices: [
      { prompt: "پرسین لە نەرمی نواندن", target: "Is there any flexibility with the price?", targetKurdish: "ئایا هیچ نەرمییەک هەیە لە نرخەکەدا؟", promptAr: "السؤال عن المرونة", targetArabic: "اكو اي مرونة بالسعر؟" },
      { prompt: "پێشنیارکردنی سازش", target: "Let's meet halfway. How about ten percent discount?", targetKurdish: "با لە ناوەڕاستدا ڕێککەوین. چی دەڵێیت بۆ سەدا دە داشکاندن؟", promptAr: "اقتراح تسوية", targetArabic: "خلي نلتقي بالنص. شتكول على خصم عشرة بالمية؟" },
    ],
    sentences: [
      { english: ["I", "think", "we", "can", "reach", "a", "win-win", "situation"], kurdish: "پێم وایە دەتوانین بگەینە بارودۆخێک کە هەردوولا براوە بین", arabic: "اعتقد نكدر نوصل لوضع يفيد الطرفين" },
      { english: ["My", "bottom", "line", "is", "fifty", "dollars"], kurdish: "دوا نرخم پەنجا دۆلارە (خوار ئەوە قبوڵ ناکەم)", arabic: "من الاخير، سعري خمسين دولار" },
    ],
    fillBlanks: [
      { parts: ["Is there any", "in your budget?"], hint: "ئایا هیچ نەرمییەک لە بودجەکەتاندا هەیە؟", answer: "flexibility", wrongs: ["change", "moving", "space"], arabicHint: "اكو اي مرونة بميزانيتك؟", arabicParts: ["اكو اي","بميزانيتك؟"], arabicAnswer: "مرونة", arabicWrongs: ["تغيير","حركة","مساحة"] },
      { parts: ["Let's meet", "and agree on this price."], hint: "با لە ناوەڕاستدا ڕێککەوین و لەسەر ئەم نرخە ڕازی بین.", answer: "halfway", wrongs: ["middle", "center", "between"], arabicHint: "خلي نلتقي بالنص ونوافق على هالسعر.", arabicParts: ["خلي نلتقي بالـ","ونوافق على هالسعر."], arabicAnswer: "نص", arabicWrongs: ["وسط","مركز","بين"] },
    ],
    conversations: [
      { situation: "دەتەوێت داشکاندنێک بکەیت بۆ کڕیارێک بەڵام ئەو زۆری دەوێت", theyAsk: "I want a 20% discount on this contract.", correct: "We can't do 20%, but let's meet halfway. We can offer you a 10% discount. That's our bottom line.", wrong1: "No 20%. I give 10%.", wrong2: "20 is too much.", wrong3: "I don't give discount.", explanation: "'Let's meet halfway' زاراوەیەکی زۆر باوی بازرگانییە کاتێک دەتەوێت بگەیتە ڕێککەوتنێک", situationAr: "تريد تنطي خصم لزبون بس هو يريد هواية", explanationAr: "'خلي نلتقي بالنص' مصطلح تجاري كلش شائع من تريد توصل لاتفاق" },
    ],
  },

  // Lesson 8: Giving Feedback & Reviews
  {
    topic: "Giving Feedback", topicKu: "پێدانی هەڵسەنگاندن (فیدباک)", topicAr: "تقديم الملاحظات",
    words: [
      { english: "Constructive feedback", kurdish: "هەڵسەنگاندنی بنیاتنەر (بۆ باشترکردن)", arabic: "ملاحظات بنّاءة" },
      { english: "You're doing great",   kurdish: "کارێکی زۆر باش دەکەیت", arabic: "شغلك كلش زين" },
      { english: "Room for improvement", kurdish: "بواری بەرەوپێشچوون ماوە", arabic: "مجال تتحسن" },
      { english: "Keep up the good work", kurdish: "بەردەوام بە لەم کارە باشە", arabic: "كمل على هالشغل الحلو" },
      { english: "Focus more on",        kurdish: "زیاتر تەرکیز بکەرە سەر...", arabic: "ركز اكثر على" },
    ],
    voices: [
      { prompt: "پێدانی فیدباکی ئەرێنی", target: "You're doing great, just keep up the good work.", targetKurdish: "کارێکی زۆر باش دەکەیت، تەنها بەردەوام بە لەم کارە باشە.", promptAr: "تقديم ملاحظات إيجابية", targetArabic: "شغلك كلش زين، بس كمل على هالشغل الحلو." },
      { prompt: "پێشنیارکردنی باشترکردن", target: "There is some room for improvement in your presentations.", targetKurdish: "بواری بەرەوپێشچوون ماوە لە پێشکەشکردنەکانتدا.", promptAr: "اقتراح تحسين", targetArabic: "اكو مجال تتحسن بعروضك التقديمية." },
    ],
    sentences: [
      { english: ["I", "have", "some", "constructive", "feedback", "for", "you"], kurdish: "چەند هەڵسەنگاندنێکی بنیاتنەرم هەیە بۆت", arabic: "عندي شوية ملاحظات بنّاءة الك" },
      { english: ["You", "need", "to", "focus", "more", "on", "details"], kurdish: "پێویستە زیاتر تەرکیز بکەیتە سەر وردەکارییەکان", arabic: "لازم تركز اكثر على التفاصيل" },
    ],
    fillBlanks: [
      { parts: ["There is always", "for improvement."], hint: "هەمیشە بواری بەرەوپێشچوون ماوە.", answer: "room", wrongs: ["space", "place", "time"], arabicHint: "دائماً اكو مجال للتحسين.", arabicParts: ["دائماً اكو","للتحسين."], arabicAnswer: "مجال", arabicWrongs: ["مساحة","مكان","وقت"] },
      { parts: ["Keep up the good", "!"], hint: "بەردەوام بە لەم کارە باشە!", answer: "work", wrongs: ["job", "doing", "thing"], arabicHint: "كمل على الشغل الحلو!", arabicParts: ["كمل على","الحلو!"], arabicAnswer: "الشغل", arabicWrongs: ["الوظيفة","الفعل","الشيء"] },
    ],
    conversations: [
      { situation: "هەڵسەنگاندنی کارمەندێک دەکەیت کە کارەکەی باشە بەڵام کەمێک خاوە", theyAsk: "How has my performance been this month?", correct: "You're doing great, but there's room for improvement with deadlines. Keep up the good work, just focus more on time management.", wrong1: "You are good but slow.", wrong2: "Work faster next time.", wrong3: "I don't like your speed.", explanation: "'room for improvement' ڕێگەیەکی زۆر نەرم و ئەرێنییە بۆ وتنی ئەوەی کە کەموکوڕییەک هەیە", situationAr: "تقيم موظف شغله زين بس شوية بطيء", explanationAr: "'مجال تتحسن' طريقة كلش لطيفة وايجابية حتى تكول اكو نقص" },
    ],
  },

  // Lesson 9: Networking & Building Connections
  {
    topic: "Networking", topicKu: "دروستکردنی پەیوەندی پیشەیی", topicAr: "بناء العلاقات المهنية",
    words: [
      { english: "Keep in touch",        kurdish: "لە پەیوەندیدا دەبین", arabic: "خلي نبقى على تواصل" },
      { english: "Exchange contact details", kurdish: "گۆڕینەوەی زانیاری پەیوەندی (ژمارە/ئیمەیڵ)", arabic: "نتبادل ارقام التواصل" },
      { english: "Connect on LinkedIn",  kurdish: "پەیوەندیکردن لە لینکدین", arabic: "تواصل على لينكد ان" },
      { english: "It was a pleasure",    kurdish: "جێگەی شانازی / خۆشحاڵی بوو", arabic: "كلش تشرفت" },
      { english: "Mutual contact",       kurdish: "ناسراوی هاوبەش", arabic: "معرفة مشتركة" },
    ],
    voices: [
      { prompt: "داوای ژمارە یان ئیمەیڵ", target: "Should we exchange contact details?", targetKurdish: "ئایا باشە زانیاری پەیوەندیکردنمان بگۆڕینەوە؟", promptAr: "طلب رقم أو بريد إلكتروني", targetArabic: "نتبادل ارقام التواصل؟" },
      { prompt: "کۆتاییهێنان بە قسەکردن لە کۆنفرانسێک", target: "It was a pleasure meeting you. Let's keep in touch.", targetKurdish: "ناسینت جێگەی خۆشحاڵی بوو. با لە پەیوەندیدا بین.", promptAr: "إنهاء المحادثة في مؤتمر", targetArabic: "كلش تشرفت بيك. خلي نبقى على تواصل." },
    ],
    sentences: [
      { english: ["I", "think", "we", "have", "a", "mutual", "contact"], kurdish: "پێم وایە ناسراوێکی هاوبەشمان هەیە", arabic: "اعتقد عدنا معرفة مشتركة" },
      { english: ["Let's", "connect", "on", "LinkedIn", "later"], kurdish: "با دواتر لە لینکدین پەیوەندی بە یەکەوە بکەین", arabic: "خلي نتواصل على لينكد ان بعدين" },
    ],
    fillBlanks: [
      { parts: ["Let's exchange contact", "before you leave."], hint: "با زانیاری پەیوەندیکردنمان بگۆڕینەوە پێش ئەوەی بڕۆیت.", answer: "details", wrongs: ["info", "papers", "numbers"], arabicHint: "خلي نتبادل ارقام التواصل قبل ما تروح.", arabicParts: ["خلي نتبادل","التواصل قبل ما تروح."], arabicAnswer: "ارقام", arabicWrongs: ["معلومات","اوراق","عناوين"] },
      { parts: ["It was a", "meeting you today."], hint: "ئەمڕۆ ناسینت جێگەی شانازی (خۆشحاڵی) بوو.", answer: "pleasure", wrongs: ["good", "happy", "nice"], arabicHint: "كلش تشرفت بيك اليوم.", arabicParts: ["كلش","بيك اليوم."], arabicAnswer: "تشرفت", arabicWrongs: ["فرحت","سعدت","انبسطت"] },
    ],
    conversations: [
      { situation: "لە کۆنفرانسێکی بازرگانیدا کەسێک دەناسیت", theyAsk: "I need to go to the next session now. It was nice talking to you.", correct: "It was a pleasure meeting you too. Should we exchange contact details? I'd love to keep in touch.", wrong1: "Give me your number.", wrong2: "I want to talk more later.", wrong3: "Call me.", explanation: "'exchange contact details' و 'keep in touch' باشترین وشەکانن بۆ دروستکردنی پەیوەندی لە بۆنە فەرمییەکاندا", situationAr: "بمؤتمر شغل، تتعرف على واحد", explanationAr: "'نتبادل ارقام التواصل' و 'نبقى على تواصل' هي احسن كلمات لبناء العلاقات بالمناسبات الرسمية" },
    ],
  },

];

export default normalUnit02;
