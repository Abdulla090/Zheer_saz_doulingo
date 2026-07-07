import { UnitBank } from "../types";

// ── Unit 3: Advanced Conversations & Discussions — 10 unique lessons ──────────
// High-level English for deeper conversations, abstract ideas, and nuanced expressions.

const normalUnit03: UnitBank = [

  // Lesson 0: Persuading and Convincing
  {
    topic: "Persuading Others", topicKu: "قایڵکردنی کەسانی تر", topicAr: "إقناع الآخرين",
    words: [
      { english: "Hear me out",          kurdish: "گوێم لێ بگرە (تا کۆتایی قسەکانم)", arabic: "اسمعني للنهاية" },
      { english: "Look at it this way",  kurdish: "بەو شێوەیە سەیری بکە کە", arabic: "انظر إليها بهذه الطريقة" },
      { english: "I'm convinced that",   kurdish: "دڵنیام / قایڵم بەوەی کە", arabic: "أنا مقتنع بأن" },
      { english: "Doesn't it make sense", kurdish: "ئایا لۆژیکی نییە کە...؟", arabic: "أليس من المنطقي؟" },
      { english: "Take my word for it",  kurdish: "بڕوام پێ بکە (قسەم لێ وەربگرە)", arabic: "صدقني / خذ كلامي على محمل الجد" },
    ],
    voices: [
      { prompt: "داوای گوێگرتن بۆ ڕوونکردنەوە", target: "Just hear me out before you make a decision.", targetKurdish: "تەنها گوێم لێ بگرە پێش ئەوەی بڕیار بدەیت.", promptAr: "طلب الاستماع للتوضيح", targetArabic: "فقط اسمعني للنهاية قبل أن تتخذ قرارًا." },
      { prompt: "گۆڕینی تێڕوانین", target: "Look at it this way, we're actually saving money.", targetKurdish: "بەو شێوەیە سەیری بکە کە لە ڕاستیدا ئێمە پارە دەگەڕێنینەوە.", promptAr: "تغيير وجهة النظر", targetArabic: "انظر إليها بهذه الطريقة، نحن نوفر المال فعليًا." },
    ],
    sentences: [
      { english: ["I'm", "convinced", "that", "this", "is", "the", "right", "path"], kurdish: "دڵنیام لەوەی کە ئەمە ڕێگە دروستەکەیە", arabic: "أنا مقتنع بأن هذا هو المسار الصحيح" },
      { english: ["Doesn't", "it", "make", "sense", "to", "wait", "a", "bit"], kurdish: "ئایا لۆژیکیتر نییە کە کەمێک چاوەڕێ بکەین؟", arabic: "أليس من المنطقي الانتظار قليلًا؟" },
    ],
    fillBlanks: [
      { parts: ["Take my", "for it, this is the best option."], hint: "قسەی من وەرگرە (بڕوام پێ بکە)، ئەمە باشترین هەڵبژاردەیە.", answer: "word", wrongs: ["voice", "talk", "say"], arabicHint: "خذ كلامي على محمل الجد، هذا هو الخيار الأفضل.", arabicParts: ["خذ","على محمل الجد، هذا هو الخيار الأفضل."], arabicAnswer: "كلامي", arabicWrongs: ["صوتي","حديثي","قولي"] },
      { parts: ["Hear me", "before you say no."], hint: "گوێم لێ بگرە پێش ئەوەی بڵێیت نەخێر.", answer: "out", wrongs: ["up", "in", "to"], arabicHint: "اسمعني للنهاية قبل أن تقول لا.", arabicParts: ["اسمعني","قبل أن تقول لا."], arabicAnswer: "للنهاية", arabicWrongs: ["أعلى","في","إلى"] },
    ],
    conversations: [
      { situation: "دەتەوێت هاوکارێکت قایڵ بکەیت بە بیرۆکەیەک", theyAsk: "I don't think we should change the design right now.", correct: "Just hear me out. Look at it this way: the new design will attract more young users. Doesn't it make sense to try it?", wrong1: "You are wrong. New design is better.", wrong2: "Listen to me, I know the best design.", wrong3: "Why you say no? Design is good.", explanation: "'Hear me out' و 'Look at it this way' ڕێگەیەکی زۆر زیر��کانەن بۆ نەرمکردنی بەرامبەر پێش ئەوەی قایڵی بکەیت", situationAr: "تريد إقناع زميل بفكرة", explanationAr: "'اسمعني للنهاية' و 'انظر إليها بهذه الطريقة' طريقتان ذكيتان جدًا لتليين الطرف الآخر قبل إقناعه." },
    ],
  },

  // Lesson 1: Complaining Constructively
  {
    topic: "Constructive Complaints", topicKu: "سکاڵاکردن بە شێوازێکی بنیاتنەر", topicAr: "الشكاوى البناءة",
    words: [
      { english: "I'm not entirely satisfied", kurdish: "بەتەواوی ڕازی نیم", arabic: "أنا لست راضيًا تمامًا" },
      { english: "There seems to be a mistake", kurdish: "وادیارە هەڵەیەک ڕوویداوە", arabic: "يبدو أن هناك خطأ" },
      { english: "It falls short of",    kurdish: "لە ئاستی پێویستدا نییە بۆ...", arabic: "إنه لا يرقى إلى مستوى" },
      { english: "I expected better",    kurdish: "چاوەڕوانی شتی باشترم دەکرد", arabic: "كنت أتوقع أفضل" },
      { english: "Look into this matter", kurdish: "بەدواداچوون بۆ ئەم بابەتە", arabic: "التحقيق في هذا الأمر" },
    ],
    voices: [
      { prompt: "دەربڕینی ناڕەزایی نەرم", target: "I'm not entirely satisfied with the quality of this product.", targetKurdish: "بەتەواوی ڕازی نیم لە کوالێتی ئەم بەرهەمە.", promptAr: "التعبير عن عدم الرضا بلطف", targetArabic: "أنا لست راضيًا تمامًا عن جودة هذا المنتج." },
      { prompt: "ئاماژەدان بە هەڵەیەک", target: "There seems to be a mistake on my bill.", targetKurdish: "وادیارە هەڵەیەک لە پسووڵەی پارەکەمدا ڕوویداوە.", promptAr: "الإشارة إلى وجود خطأ", targetArabic: "يبدو أن هناك خطأ في فاتورتي." },
    ],
    sentences: [
      { english: ["Could", "you", "please", "look", "into", "this", "matter"], kurdish: "تکایە دەتوانیت بەدواداچوون بۆ ئەم بابەتە بکەیت؟", arabic: "هل يمكنك من فضلك التحقيق في هذا الأمر؟" },
      { english: ["The", "service", "falls", "short", "of", "my", "expectations"], kurdish: "خزمەتگوزارییەکە لە ئاست چاوەڕوانییەکانی مندا نییە", arabic: "الخدمة لا ترقى إلى مستوى توقعاتي" },
    ],
    fillBlanks: [
      { parts: ["I'm not entirely", "with how this was handled."], hint: "بەتەواوی ڕازی نیم بە چۆنیەتی مامەڵەکردن لەگەڵ ئەمەدا.", answer: "satisfied", wrongs: ["happy", "good", "pleased"], arabicHint: "أنا لست راضياً تماماً عن كيفية التعامل مع هذا الأمر.", arabicParts: ["أنا لست","تماماً عن كيفية التعامل مع هذا الأمر."], arabicAnswer: "راضياً", arabicWrongs: ["سعيداً","جيداً","مسروراً"] },
      { parts: ["There", "to be a mistake with my order."], hint: "وادیارە هەڵەیەک لە داواکارییەکەمدا ڕوویداوە.", answer: "seems", wrongs: ["looks", "feels", "shows"], arabicHint: "يبدو أن هناك خطأ في طلبي.", arabicParts: ["","أن هناك خطأ في طلبي."], arabicAnswer: "يبدو", arabicWrongs: ["يظهر","يشعر","يتضح"] },
    ],
    conversations: [
      { situation: "پەیوەندی بە خزمەتگوزاری کڕیارانەوە دەکەیت", theyAsk: "How can I assist you with your recent purchase?", correct: "Hi, I'm calling because I'm not entirely satisfied. There seems to be a mistake with the delivery, and it falls short of what I expected.", wrong1: "Your delivery is bad. I hate it.", wrong2: "You made a big mistake. Fix it.", wrong3: "I want my money. Delivery is wrong.", explanation: "'I'm not entirely satisfied' و 'There seems to be a mistake' شێوازی سکاڵاکردنی کەسانی پێگەیشتوو و پیشەییە", situationAr: "تتصل بخدمة العملاء", explanationAr: "'أنا لست راضيًا تمامًا' و 'يبدو أن هناك خطأ' هي طرق شكوى احترافية وناضجة." },
    ],
  },

  // Lesson 2: Giving Advice in Difficult Situations
  {
    topic: "Delicate Advice", topicKu: "ئامۆژگاری هەستیار", topicAr: "نصيحة حساسة",
    words: [
      { english: "Have you considered",  kurdish: "بیرت لەوە کردووەتەوە کە...؟", arabic: "هل فكرت في..." },
      { english: "It might be wise to",  kurdish: "لەوانەیە کارێکی ژیرانە بێت کە", arabic: "قد يكون من الحكمة أن" },
      { english: "I wouldn't recommend", kurdish: "پێشنیاری ئەوە ناکەم کە", arabic: "لا أوصي بـ" },
      { english: "Sleep on it",          kurdish: "بیرکردنەوەیەکی قووڵ (تا بەیانی بڕیار نەدان)", arabic: "فكر في الأمر مليًا (قبل اتخاذ قرار)" },
      { english: "Weigh your options",   kurdish: "هەڵسەنگاندن بۆ بژاردەکانت", arabic: "وازن خياراتك" },
    ],
    voices: [
      { prompt: "پێشنیارکردنی بیرکردنەوە", target: "Don't rush. It might be wise to sleep on it first.", targetKurdish: "پەلە مەکە. لەوانەیە کارێکی ژیرانە بێت کە سەرەتا (تا بەیانی) بیری لێ بکەیتەوە.", promptAr: "اقتراح التفكير", targetArabic: "لا تتسرع. قد يكون من الحكمة أن تفكر في الأمر مليًا أولاً." },
      { prompt: "ئامۆژگاری بۆ هەڵسەنگاندن", target: "You should weigh your options before deciding.", targetKurdish: "دەبێت هەڵسەنگاندن بۆ بژاردەکانت بکەیت پێش بڕیاردان.", promptAr: "نصيحة للتقييم", targetArabic: "يجب عليك موازنة خياراتك قبل اتخاذ القرار." },
    ],
    sentences: [
      { english: ["Have", "you", "considered", "talking", "to", "him", "directly"], kurdish: "بیرت لەوە کردووەتەوە ڕاستەوخۆ قسەی لەگەڵ بکەیت؟", arabic: "هل فكرت في التحدث إليه مباشرة؟" },
      { english: ["I", "wouldn't", "recommend", "quitting", "just", "yet"], kurdish: "پێشنیاری ئەوە ناکەم کە هەر ئێستا واز بهێنیت", arabic: "لا أوصي بالاستقالة الآن." },
    ],
    fillBlanks: [
      { parts: ["Take your time and", "your options carefully."], hint: "کاتی خۆت وەربگرە و بە وریاییەوە بژاردەکانت هەڵسەنگێنە.", answer: "weigh", wrongs: ["think", "look", "see"], arabicHint: "خذ وقتك ووازن خياراتك بعناية.", arabicParts: ["خذ وقتك و","خياراتك بعناية."], arabicAnswer: "وازن", arabicWrongs: ["فكر","انظر","شاهد"] },
      { parts: ["It's a big choice, you should", "on it."], hint: "بڕیارێکی گەورەیە، دەبێت (تا بەیانی) بیری لێ بکەیتەوە.", answer: "sleep", wrongs: ["wait", "rest", "stop"], arabicHint: "إنه خيار كبير، يجب أن تفكر فيه ملياً.", arabicParts: ["إنه خيار كبير، يجب أن","فيه ملياً."], arabicAnswer: "تفكر", arabicWrongs: ["تنتظر","ترتاح","تتوقف"] },
    ],
    conversations: [
      { situation: "هاوڕێیەکەت دەیەوێت بەپەلە واز لە کارەکەی بهێنێت", theyAsk: "I'm so angry at my boss. I'm going to quit tomorrow!", correct: "I understand you're upset, but I wouldn't recommend quitting just yet. It might be wise to sleep on it and weigh your options first.", wrong1: "Don't quit, it is bad.", wrong2: "You are wrong to quit.", wrong3: "I tell you not to quit.", explanation: "'sleep on it' ئیدیۆمێکی زۆر بەکارهاتووە بە واتای (پەلە مەکە و کاتی زیاتر بدە بە خۆت بۆ بیرکردنەوە لە بڕیارێک)", situationAr: "صديقك يريد الاستقالة من عمله على عجل", explanationAr: "'Sleep on it' تعبير شائع جدًا يعني (لا تتسرع وامنح نفسك المزيد من الوقت للتفكير في قرار)." },
    ],
  },

  // Lesson 3: Hypothetical Situations
  {
    topic: "Hypothetical Situations", topicKu: "بارودۆخە گریمانەییەکان", topicAr: "المواقف الافتراضية",
    words: [
      { english: "If I were in your shoes", kurdish: "ئەگەر لە جێگەی تۆ بوومایە", arabic: "لو كنت مكانك" },
      { english: "What if we",           kurdish: "چی دەبێت ئەگەر ئێمە", arabic: "ماذا لو فعلنا" },
      { english: "Suppose that",         kurdish: "گریمانەی ئەوە بکە کە", arabic: "افترض أن" },
      { english: "In a perfect world",   kurdish: "لە جیهانێکی بێگەرددا (ئەگەر هەموو شتێک ڕێک بووایە)", arabic: "في عالم مثالي" },
      { english: "Worst-case scenario",  kurdish: "خراپترین ئەگەری پێشبینیکراو", arabic: "أسوأ سيناريو" },
    ],
    voices: [
      { prompt: "خۆخستنە جێگەی کەسێک", target: "If I were in your shoes, I would ask for a raise.", targetKurdish: "ئەگەر لە جێگەی تۆ بوومایە، داوای زیادکردنی مووچەم دەکرد.", promptAr: "وضع النفس مكان شخص آخر", targetArabic: "لو كنت مكانك، لطلبت زيادة في الراتب." },
      { prompt: "باسکردنی خراپترین ئەگەر", target: "What is the worst-case scenario if we fail?", targetKurdish: "خراپترین ئەگەری پێشبینیکراو چییە ئەگەر سەرنەکەوین؟", promptAr: "مناقشة أسوأ الاحتمالات", targetArabic: "ما هو أسوأ سيناريو إذا فشلنا؟" },
    ],
    sentences: [
      { english: ["What", "if", "we", "tried", "a", "different", "approach"], kurdish: "چی دەبێت ئەگەر ڕێگەیەکی جیاواز تاقی بکەینەوە؟", arabic: "ماذا لو جربنا نهجًا مختلفًا؟" },
      { english: ["Suppose", "that", "they", "reject", "our", "offer"], kurdish: "گریمانەی ئەوە بکە کە ئەوان پێشنیارەکەمان ڕەتدەکەنەوە", arabic: "افترض أنهم يرفضون عرضنا." },
    ],
    fillBlanks: [
      { parts: ["If I were in your", ", I wouldn't worry so much."], hint: "ئەگەر لە جێگەی تۆ بوومایە، ئەوەندە خەمی لێ نەدەخوارد.", answer: "shoes", wrongs: ["place", "position", "mind"], arabicHint: "لو كنت مكانك، لما قلقت كثيراً.", arabicParts: ["لو كنت","، لما قلقت كثيراً."], arabicAnswer: "مكانك", arabicWrongs: ["موقعك","منصبك","عقلك"] },
      { parts: ["In a", "world, this project would be done by now."], hint: "لە جیهانێکی بێگەرددا، ئەم پڕۆژەیە تا ئێستا تەواو دەبوو.", answer: "perfect", wrongs: ["good", "great", "best"], arabicHint: "في عالم مثالي، كان هذا المشروع سينتهي الآن.", arabicParts: ["في عالم","، كان هذا المشروع سينتهي الآن."], arabicAnswer: "مثالي", arabicWrongs: ["جيد","عظيم","أفضل"] },
    ],
    conversations: [
      { situation: "تیمەکەت پێشبینی کێشەیەک دەکات لە پڕۆژەیەکدا", theyAsk: "I'm worried the client might not like the proposal.", correct: "Suppose that happens. What's the worst-case scenario? We just revise it. If I were in your shoes, I'd stay positive.", wrong1: "Don't think bad.", wrong2: "If they don't like, we cry.", wrong3: "Client is always right.", explanation: "'If I were in your shoes' زۆر باوتر و جوانترە لە وتنی 'If I were you'", situationAr: "فريقك يتوقع مشكلة في مشروع ما", explanationAr: "'لو كنت مكانك' (If I were in your shoes) أكثر شيوعًا وجمالًا من قول 'لو كنت أنت' (If I were you)." },
    ],
  },

  // Lesson 4: Expressing Probability
  {
    topic: "Probability & Certainty", topicKu: "ئەگەرەکان و دڵنیایی", topicAr: "الاحتمالية واليقين",
    words: [
      { english: "It's highly likely",   kurdish: "ئەگەرێکی زۆری هەیە", arabic: "من المحتمل جدًا" },
      { english: "There's no doubt that", kurdish: "هیچ گومانێک لەوەدا نییە کە", arabic: "لا شك أن" },
      { english: "Chances are",          kurdish: "ئەگەرەکان وا دەردەخەن / پێدەچێت", arabic: "الاحتمالات تشير إلى / من المرجح أن" },
      { english: "I bet that",           kurdish: "گرەو دەکەم کە / دڵنیام کە", arabic: "أراهن أن" },
      { english: "It's a long shot",     kurdish: "ئەگەرێکی زۆر لاوازە (قورسە ڕووبدات)", arabic: "احتمال ضعيف ج��ًا" },
    ],
    voices: [
      { prompt: "دەربڕینی دڵنیایی", target: "There's no doubt that she will get the promotion.", targetKurdish: "هیچ گومانێک لەوەدا نییە کە ئەو پلەبەرزکردنەوەکە وەردەگرێت.", promptAr: "التعبير عن اليقين", targetArabic: "لا شك أنها ستحصل على الترقية." },
      { prompt: "ئاماژەدان بە ئەگەرێکی لاواز", target: "Winning the lottery is a long shot.", targetKurdish: "بردنەوەی یانسیب ئەگەرێکی زۆر لاوازە.", promptAr: "الإشارة إلى احتمال ضعيف", targetArabic: "الفوز باليانصيب احتمال ضعيف جدًا." },
    ],
    sentences: [
      { english: ["Chances", "are", "it", "will", "rain", "tomorrow"], kurdish: "پێدەچێت بەیانی باران ببارێت", arabic: "من المرجح أن تمطر غدًا." },
      { english: ["It's", "highly", "likely", "that", "we", "will", "win"], kurdish: "ئەگەرێکی زۆری هەیە کە ئێمە ببەینەوە", arabic: "من المحتمل جدًا أن نفوز." },
    ],
    fillBlanks: [
      { parts: ["It's a long", ", but we might still win the game."], hint: "ئەگەرێکی زۆر لاوازە، بەڵام لەوانەیە هێشتا یارییەکە ببەینەوە.", answer: "shot", wrongs: ["chance", "way", "run"], arabicHint: "إنه احتمال ضعيف، لكننا قد نفوز بالمباراة.", arabicParts: ["إنه احتمال","، لكننا قد نفوز بالمباراة."], arabicAnswer: "ضعيف", arabicWrongs: ["فرصة","طريق","ركض"] },
      { parts: ["There's no", "that he is the best player."], hint: "هیچ گومانێک لەوەدا نییە کە ئەو باشترین یاریزانە.", answer: "doubt", wrongs: ["question", "thinking", "sure"], arabicHint: "لا شك أنه أفضل لاعب.", arabicParts: ["لا","أنه أفضل لاعب."], arabicAnswer: "شك", arabicWrongs: ["سؤال","تفكير","تأكيد"] },
    ],
    conversations: [
      { situation: "پێشبینیکردنی ئەنجامی چاوپێکەوتنێکی کار", theyAsk: "Do you think Sarah will get the job?", correct: "There's no doubt that she's qualified, but getting it is a long shot since there are so many applicants. However, chances are she'll at least get a second interview.", wrong1: "She will get job.", wrong2: "I think maybe she wins.", wrong3: "Job is hard.", explanation: "'It's a long shot' دەستەواژەیەکی نایابە بۆ شتێک کە ئەگەری ڕوودانی کەمە بەڵام مەحاڵ نییە", situationAr: "التنبؤ بنتيجة مقابلة عمل", explanationAr: "'احتمال ضعيف جدًا' (It's a long shot) تعبير ممتاز لشيء احتمالية حدوثه قليلة ولكنه ليس مستحيلاً." },
    ],
  },

  // Lesson 5: Changing the Subject
  {
    topic: "Changing the Subject", topicKu: "گۆڕینی بابەتی گفتوگۆ", topicAr: "تغيير الم��ضوع",
    words: [
      { english: "Speaking of which",    kurdish: "بە قسە بێت (مادام باسی ئەوەت کرد)", arabic: "بالمناسبة / بالحديث عن ذلك" },
      { english: "That reminds me",      kurdish: "ئەوەی بیرخستمەوە", arabic: "هذا يذكرني" },
      { english: "On a different note",  kurdish: "لە بابەتێکی جیاوازدا / با بێینە سەر شتێکی تر", arabic: "بالمناسبة / على صعيد آخر" },
      { english: "By the way",           kurdish: "لەبیرم چوو بڵێم / هەر لە ناو قسەکاندا", arabic: "بالمناسبة" },
      { english: "Going off on a tangent", kurdish: "لادan لە بابەتە سەرەکییەکە", arabic: "الخروج عن الموضوع" },
    ],
    voices: [
      { prompt: "بیرکەوتنەوەی شتێک", target: "That reminds me, I need to call my mother.", targetKurdish: "ئەوەی بیرخستمەوە، پێویستە تەلەفۆن بۆ دایکم بکەم.", promptAr: "تذكر شيء ما", targetArabic: "هذا يذكرني، أحتاج إلى الاتصال بوالدتي." },
      { prompt: "گۆڕینی بابەتەکە بەتەواوی", target: "On a different note, how was your vacation?", targetKurdish: "با بێینە سەر شتێک�� تر، پشووەکەت چۆن بوو؟", promptAr: "تغيير الموضوع تمامًا", targetArabic: "على صعيد آخر، كيف كانت عطلتك؟" },
    ],
    sentences: [
      { english: ["Speaking", "of", "which", "did", "you", "see", "the", "news"], kurdish: "بە قسە بێت، هەواڵەکانت بینی؟", arabic: "بالمناسبة، هل رأيت الأخبار؟" },
      { english: ["Sorry", "for", "going", "off", "on", "a", "tangent"], kurdish: "ببوورە کە لە بابەتەکە لامدا", arabic: "آسف للخروج عن الموضوع." },
    ],
    fillBlanks: [
      { parts: ["That", "me, we have a meeting at 2 PM."], hint: "ئەوەی بیرخستمەوە، کاتژمێر ٢ کۆبوونەوەمان هەیە.", answer: "reminds", wrongs: ["makes", "shows", "tells"], arabicHint: "هذا يذكرني، لدينا اجتماع في الساعة 2 مساءً.", arabicParts: ["هذا","، لدينا اجتماع في الساعة 2 مساءً."], arabicAnswer: "يذكرني", arabicWrongs: ["يجعلني","يريني","يخبرني"] },
      { parts: ["On a different", ", what are we having for dinner?"], hint: "لە بابەتێکی جیاوازدا، چی دەخۆین بۆ نانی ئێوارە؟", answer: "note", wrongs: ["topic", "subject", "thing"], arabicHint: "على صعيد آخر، ماذا سنتناول على العشاء؟", arabicParts: ["على","آخر، ماذا سنتناول على العشاء؟"], arabicAnswer: "صعيد", arabicWrongs: ["موضوع","شأن","شيء"] },
    ],
    conversations: [
      { situation: "لە ناوەڕاستی گفتوگۆیەکدا دەتەوێت باسی شتێکی تر بکەیت کە بیرت کەوتووەتەوە", theyAsk: "Yeah, the traffic today was terrible near the new restaurant.", correct: "Speaking of which! That reminds me, I wanted to ask if you want to go to that restaurant this Friday?", wrong1: "I want to go to restaurant Friday.", wrong2: "Traffic is bad. Friday restaurant?", wrong3: "I change subject. Let's go Friday.", explanation: "'Speaking of which' یان 'That reminds me' باشترین پردن بۆ پەڕینەوە لە نێوان بابەتەکاندا بەبێ پچڕاندنی گفتوگۆکە", situationAr: "في منتصف محادثة، تريد التحدث عن شيء آخر تذكرته", explanationAr: "'بالمناسبة' (Speaking of which) أو 'هذا يذكرني' (That reminds me) هما أفضل جسر للانتقال بين المواضيع دون قطع المحادثة." },
    ],
  },

  // Lesson 6: Justifying & Excuses
  {
    topic: "Making Excuses", topicKu: "هێنانەوەی پاساو", topicAr: "تقديم الأعذار",
    words: [
      { english: "The reason being",     kurdish: "هۆکارەکەی ئەوەیە کە", arabic: "السبب هو أن" },
      { english: "Due to unforeseen circumstances", kurdish: "بەهۆی بارودۆخێکی پێشبینینەکراوەوە", arabic: "بسبب ظروف غير متوقعة" },
      { english: "It was out of my hands", kurdish: "لە دەسەڵاتی مندا نەبوو", arabic: "��م يكن بيدي" },
      { english: "I didn't mean to",     kurdish: "مەبەستم نەبوو کە...", arabic: "لم أقصد أن" },
      { english: "Let me explain",       kurdish: "با ڕوونی بکەمەوە", arabic: "دعني أوضح" },
    ],
    voices: [
      { prompt: "لابردنی تاوان لەسەر خۆت", target: "I apologize, but the delay was completely out of my hands.", targetKurdish: "داوای لێبوردن دەکەم، بەڵام دواکەوتنەکە بەتەواوی لە دەسەڵاتی مندا نەبوو.", promptAr: "إزالة اللوم عن النفس", targetArabic: "أعتذر، لكن التأخير كان خارج عن إرادتي تمامًا." },
      { prompt: "پاساوی فەرمی", target: "Due to unforeseen circumstances, we must cancel the event.", targetKurdish: "بەهۆی بارودۆخێکی پێشبینینەکراوەوە، دەبێت بۆنەکە هەڵبوەشێنینەوە.", promptAr: "عذر رسمي", targetArabic: "بسبب ظروف غير متوقعة، يجب علينا إلغاء الحدث." },
    ],
    sentences: [
      { english: ["I", "didn't", "mean", "to", "offend", "you", "let", "me", "explain"], kurdish: "مەبەستم نەبوو دڵت بشکێنم، با ڕوونی بکەمەوە", arabic: "لم أقصد أ�� أسيء إليك، دعني أوضح." },
      { english: ["I", "was", "late", "the", "reason", "being", "heavy", "traffic"], kurdish: "دواکەوتم، هۆکارەکەی قەرەباڵغییەکی زۆر بوو", arabic: "تأخرت، والسبب هو الازدحام المروري الكثيف." },
    ],
    fillBlanks: [
      { parts: ["It wasn't my fault, it was", "of my hands."], hint: "هەڵەی من نەبوو، لە دەسەڵاتی مندا نەبوو.", answer: "out", wrongs: ["away", "far", "gone"], arabicHint: "لم يكن خطئي، كان خارجاً عن إرادتي.", arabicParts: ["لم يكن خطئي، كان","عن إرادتي."], arabicAnswer: "خارجاً", arabicWrongs: ["بعيداً","نادراً","مفقوداً"] },
      { parts: ["Due to", "circumstances, the flight is delayed."], hint: "بەهۆی بارودۆخێکی پێشبینینەکراوەوە، گەشتەکە دواکەوتووە.", answer: "unforeseen", wrongs: ["bad", "sudden", "unknown"], arabicHint: "بسبب ظروف غير متوقعة، تم تأجيل الرحلة.", arabicParts: ["بسبب ظروف","، تم تأجيل الرحلة."], arabicAnswer: "غير متوقعة", arabicWrongs: ["سيئة","مفاجئة","مجهولة"] },
    ],
    conversations: [
      { situation: "پڕۆژەیەک دواکەوتووە بەهۆی کێشەی کۆمپیوتەرەوە", theyAsk: "Why wasn't the report submitted on time yesterday?", correct: "Let me explain. The server crashed entirely. I wanted to finish it, but it was completely out of my hands.", wrong1: "Computer bad, not me.", wrong2: "I didn't do it because of server.", wrong3: "Not my fault, server stopped.", explanation: "'Out of my hands' ئیدیۆمێکی زۆر بەهێزە بۆ وتنی ئەوەی کە دەسەڵاتت بەسەر کێشەکەدا نەبووە", situationAr: "تأخر مشروع بسبب مشكلة في الكمبيوتر", explanationAr: "'لم يكن بيدي' (Out of my hands) تعبير قوي جدًا لقول أنك لم تكن تملك السيطرة على المشكلة." },
    ],
  },

  // Lesson 7: Warning and Instructing
  {
    topic: "Warning & Instructing", topicKu: "ئاگادارکردنەوە و ڕێنماییدان", topicAr: "التحذير والإرشاد",
    words: [
      { english: "Make sure you",        kurdish: "دڵنیابەرەوە لەوەی کە...", arabic: "تأكد من أنك" },
      { english: "Watch out for",        kurdish: "ئاگاداری ... بە", arabic: "احذر من" },
      { english: "Bear in mind",         kurdish: "لەبیری مەکە / ڕەچاوی ئەوە بکە", arabic: "ضع في اعتبارك" },
      { english: "Take precautions",     kurdish: "ڕێکاری خۆپارێزی بگرەبەر", arabic: "اتخذ احتياطات" },
      { english: "Better safe than sorry", kurdish: "خۆپاراستن باشترە لە پەشیمانی", arabic: "الوقاية خير من الندم" },
    ],
    voices: [
      { prompt: "ئاگادارکردنەوە لە مەترسی", target: "Watch out for the wet floor. Better safe than sorry.", targetKurdish: "ئاگاداری زەوییە تەڕەکە بە. خۆپاراستن باشترە لە پەشیمانی.", promptAr: "التحذير من الخطر", targetArabic: "احذر من الأرضية المبللة. الوقاية خير من الندم." },
      { prompt: "پێدانی ڕێنمایی ورد", target: "Make sure you lock the door and bear in mind the alarm code.", targetKurdish: "دڵنیابەرەوە لەوەی دەرگاکە قفڵ بکەیت و کۆدی زەنگەکەش لەبیر مەکە.", promptAr: "تقديم تعليمات مفصلة", targetArabic: "تأكد من إغلاق الباب وضع في اعتبارك رمز الإنذار." },
    ],
    sentences: [
      { english: ["You", "should", "always", "take", "precautions", "when", "traveling"], kurdish: "دەبێت هەمیشە ڕێکاری خۆپارێزی بگریتەبەر کاتێک گەشت دەکەیت", arabic: "يجب عليك دائمًا اتخاذ الاحتياطات عند السفر." },
      { english: ["Bear", "in", "mind", "that", "the", "deadline", "is", "strict"], kurdish: "لەیادت بێت کە وادەی کۆتایی توندە (ناگۆڕدرێت)", arabic: "ضع في اعتبارك أن الموعد النهائي صارم." },
    ],
    fillBlanks: [
      { parts: ["Bear in", "that things might change tomorrow."], hint: "لەیادت بێت (ڕەچاوی ئەوە بکە) کە لەوانەیە سبەی شتەکان بگۆڕێن.", answer: "mind", wrongs: ["head", "brain", "thought"], arabicHint: "ضع في اعتبارك أن الأمور قد تتغير غداً.", arabicParts: ["ضع في","أن الأمور قد تتغير غداً."], arabicAnswer: "اعتبارك", arabicWrongs: ["رأسك","عقلك","تفكيرك"] },
      { parts: ["Bring an umbrella. Better", "than sorry."], hint: "چەترێک بهێنە. خۆپاراستن باشترە لە پەشیمانی.", answer: "safe", wrongs: ["good", "dry", "careful"], arabicHint: "أحضر مظلة. الوقاية خير من الندم.", arabicParts: ["أحضر مظلة.","خير من الندم."], arabicAnswer: "الوقاية", arabicWrongs: ["الجيد","الجفاف","الحذر"] },
    ],
    conversations: [
      { situation: "ڕێنماییدانی کارمەندێکی نوێ سەبارەت بە سەلامەتی", theyAsk: "Is there anything else I need to know before using this machine?", correct: "Yes, watch out for the sharp edges. Make sure you wear gloves—better safe than sorry.", wrong1: "Machine is dangerous.", wrong2: "Wear gloves or you bleed.", wrong3: "Take care of edges.", explanation: "'Better safe than sorry' پەندێکی زۆر بەناوبانگ و باوی ئینگلیزییە بۆ هاندان لەسەر وریایی", situationAr: "إرشاد موظف جديد حول السلامة", explanationAr: "'الوقاية خير من الندم' (Better safe than sorry) مثل إنجليزي شائع جدًا للتشجيع على الحذر." },
    ],
  },

  // Lesson 8: Discussing News & Current Events
  {
    topic: "Current Events", topicKu: "ڕووداوە��انی ڕۆژ و هەواڵ", topicAr: "الأحداث الجارية",
    words: [
      { english: "Did you hear about",   kurdish: "ئایا بیستت دەربارەی...؟", arabic: "هل سمعت عن..." },
      { english: "It's all over the news", kurdish: "لە هەموو هەواڵەکاندا بڵاوبووەتەوە", arabic: "إنه في كل الأخبار" },
      { english: "According to reports", kurdish: "بەپێی ڕاپۆرتەکان", arabic: "وفقًا للتقارير" },
      { english: "It's a controversial topic", kurdish: "بابەتێکی مشتومڕ لەسەرە", arabic: "إنه موضوع مثير للجدل" },
      { english: "Keep up with the news", kurdish: "ئاگاداربوون لە دواین هەواڵەکان", arabic: "متابعة الأخبار" },
    ],
    voices: [
      { prompt: "کردنەوەی باسی هەواڵێک", target: "Did you hear about the election? It's all over the news.", targetKurdish: "ئایا گوێت لە هەواڵی هەڵبژاردنەکە بوو؟ لە هەموو هەواڵەکاندا بڵاوبووەتەوە.", promptAr: "فتح موضوع خبر", targetArabic: "هل سمعت عن الانتخابات؟ إنها في كل الأخبار." },
      { prompt: "گواستنەوەی زانیاری", target: "According to reports, the economy is improving.", targetKurdish: "بەپێی ڕاپۆرتەکان، ئابووری ڕوو لە باشبوونە.", promptAr: "نقل المعلومات", targetArabic: "وفقًا للتقارير، الاقتصاد يتحسن." },
    ],
    sentences: [
      { english: ["I", "try", "to", "keep", "up", "with", "the", "local", "news"], kurdish: "هەوڵدەدەم ئاگاداری دواین هەواڵە ناوخۆییەکان بم", arabic: "أحاول متابعة الأخبار المحلية." },
      { english: ["That", "is", "a", "very", "controversial", "topic", "lately"], kurdish: "لەم دواییانەدا ئەوە بابەتێکی پڕ مشتومڕ بووە", arabic: "هذا موضوع مثير للجدل جدًا مؤخرًا." },
    ],
    fillBlanks: [
      { parts: ["It's hard to keep", "with all the tech news."], hint: "قورسە ئاگاداری (بەدواداچوون بۆ) هەموو هەواڵەکانی تەکنەلۆژیا بکەیت.", answer: "up", wrongs: ["on", "in", "down"], arabicHint: "من الصعب مواكبة جميع أخبار التكنولوجيا.", arabicParts: ["من الصعب","جميع أخبار التكنولوجيا."], arabicAnswer: "مواكبة", arabicWrongs: ["تشغيل","دخول","إنزال"] },
      { parts: ["According", "recent reports, housing prices dropped."], hint: "بەپێی ڕاپۆرتەکانی ئەم دواییە، نرخی خانوو دابەزیوە.", answer: "to", wrongs: ["by", "with", "from"], arabicHint: "وفقاً للتقارير الأخيرة، انخفضت أسعار المساكن.", arabicParts: ["","للتقارير الأخيرة، انخفضت أسعار المساكن."], arabicAnswer: "وفقاً", arabicWrongs: ["بواسطة","مع","من"] },
    ],
    conversations: [
      { situation: "قسەکردن لەگەڵ هاوکارێک سەبارەت بە ڕووداوێکی نوێ", theyAsk: "I haven't checked my phone all day. Has anything happened?", correct: "Did you hear about the big merger? It's all over the news! According to reports, it's going to change the whole industry.", wrong1: "Yes, big company buy another.", wrong2: "News say merger is happen.", wrong3: "I saw on TV about company.", explanation: "'It's all over the news' و 'According to reports' دەستەواژەی زۆر باون بۆ باسکردنی ڕووداوە گەرمەکانی ڕۆژ", situationAr: "التحدث مع زميل حول حدث جديد", explanationAr: "'إنه في كل الأخبار' (It's all over the news) و 'وفقًا للتقارير' (According to reports) تعبيرات شائعة جدًا لمناقشة الأحداث الجارية." },
    ],
  },

  // Lesson 9: Summarizing and Concluding
  {
    topic: "Summarizing", topicKu: "پوختەکردنەوە و کۆتاییهێنان", topicAr: "التلخيص والختام",
    words: [
      { english: "Long story short",     kurdish: "بۆ ئەوەی درێژەی پێ نەدەم (بە کورتی)", arabic: "باختصار / الزب��ة" },
      { english: "In a nutshell",        kurdish: "بە کورتی و پوختی (لە توێکڵی گوێزێکدا)", arabic: "باختصار شديد" },
      { english: "To wrap things up",    kurdish: "بۆ کۆتاییهێنان بە بابەتەکە", arabic: "لإنهاء الأمور / للختام" },
      { english: "The bottom line is",   kurdish: "خاڵە سەرەکییەکە ئەوەیە کە / کورتەی کەلام", arabic: "الخلاصة هي أن" },
      { english: "At the end of the day", kurdish: "لەکۆتاییدا (دەرەنجامی کۆتایی شتەکە)", arabic: "في نهاية المطاف" },
    ],
    voices: [
      { prompt: "پوختەکردنەوەی چیرۆکێک", target: "Long story short, we missed the flight and had to stay another night.", targetKurdish: "بۆ ئەوەی درێژەی پێ نەدەم، گەشتەکەمان لەدەستدا و ناچار بووین شەوێکی تر بمێنینەوە.", promptAr: "تلخيص قصة", targetArabic: "باختصار، فاتتنا الرحلة واضطررنا للبقاء ليلة أخرى." },
      { prompt: "کۆتاییهێنان بە کۆبوونەوەیەک", target: "To wrap things up, the bottom line is we need more sales.", targetKurdish: "بۆ کۆتاییهێنان، کورتەی کەلام ئەوەی�� کە پێویستمان بە فرۆشی زیاترە.", promptAr: "إنهاء اجتماع", targetArabic: "لإنهاء الأمور، الخلاصة هي أننا بحاجة إلى المزيد من المبيعات." },
    ],
    sentences: [
      { english: ["In", "a", "nutshell", "the", "movie", "was", "terrible"], kurdish: "بە کورتی و پوختی، فیلمەکە زۆر خراپ بوو", arabic: "باختصار شديد، الفيلم كان فظيعًا." },
      { english: ["At", "the", "end", "of", "the", "day", "family", "is", "most", "important"], kurdish: "لەکۆتاییدا (لە دەرەنجامدا)، خێزان لە هەموو شتێک گرنگترە", arabic: "في نهاية المطاف، العائلة هي الأهم." },
    ],
    fillBlanks: [
      { parts: ["In a", ", the new software is faster but harder to use."], hint: "بە کورتی و پوختی، سۆفتوێرە نوێیەکە خێراترە بەڵام بەکارهێنانی قورسترە.", answer: "nutshell", wrongs: ["box", "word", "second"], arabicHint: "باختصار شديد، البرنامج الجديد أسرع ولكن استخدامه أصعب.", arabicParts: ["","، البرنامج الجديد أسرع ولكن استخدامه أصعب."], arabicAnswer: "باختصار شديد", arabicWrongs: ["صندوق","كلمة","ثانية"] },
      { parts: ["Let's", "things up so we can all go home."], hint: "با کۆتایی بە بابەتەکان بهێنین بۆ ئەوەی هەموومان بڕۆینەوە ماڵەوە.", answer: "wrap", wrongs: ["close", "finish", "end"], arabicHint: "دعنا نختتم الأمور حتى نتمكن جميعاً من العودة إلى المنزل.", arabicParts: ["دعنا","الأمور حتى نتمكن جميعاً من العودة إلى المنزل."], arabicAnswer: "نختتم", arabicWrongs: ["نغلق","ننهي","نختم"] },
    ],
    conversations: [
      { situation: "هاوڕێیەکەت پرسیاری فیلمێکی درێژت لێ دەکات", theyAsk: "I missed the 3-hour documentary. Can you tell me what happened?", correct: "Well, to put it in a nutshell, the planet is warming up fast. The bottom line is we need to act now.", wrong1: "It was about earth getting hot.", wrong2: "Short story: earth is hot.", wrong3: "I tell you short: it's warming.", explanation: "'In a nutshell' و 'The bottom line is' زۆر بەکاردێن بۆ پوختەکردنەوەی زانیاری زۆر بە چەند وشەیەکی کەم", situationAr: "صديقك يسألك عن فيلم وثائقي طويل", explanationAr: "'باختصار شديد' (In a nutshell) و 'الخلاصة هي أن' (The bottom line is) يستخدمان كثيرًا لتلخيص الكثير من المعلومات في بضع كلمات." },
    ],
  },

];

export default normalUnit03;