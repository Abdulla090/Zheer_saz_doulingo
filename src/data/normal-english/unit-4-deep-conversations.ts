import { UnitBank } from "../types";

// ── Visible Unit 7: Deep Conversations & Nuance — 10 unique lessons ──────────
// Nuanced, advanced conversational English: persuasion, diplomatic criticism, hypotheticals, and summarizing.

const normalUnit03: UnitBank = [

  // Lesson 0: Persuading Others
  {
    topic: "Persuading Others", topicKu: "قایڵکردنی کەسانی تر", topicAr: "إقناع الناس", topicRu: "Искусство убеждения",
    words: [
      { english: "Hear me out", kurdish: "گوێم لێ بگرە (تا کۆتایی قسەکانم)", arabic: "اسمعني للاخر", russian: "Выслушай меня" },
      { english: "Look at it this way", kurdish: "بەو شێوەیە سەیری بکە کە", arabic: "شوف الموضوع من هالزاوية", russian: "Посмотри на это с другой стороны" },
      { english: "I'm convinced that", kurdish: "دڵنیام / قایڵم بەوەی کە", arabic: "اني مقتنع انو", russian: "Я убежден, что..." },
      { english: "Doesn't it make sense", kurdish: "ئایا لۆژیکی نییە کە...؟", arabic: "مو منطقي؟", russian: "Разве это не логично?" },
      { english: "Take my word for it", kurdish: "بڕوام پێ بکە (قسەم لێ وەربگرە)", arabic: "صدگني / خذ كلامي جد", russian: "Поверь мне на слово" },
    ],
    voices: [
      { prompt: "داوای گوێگرتن بۆ ڕوونکردنەوە", target: "Just hear me out before you make a decision.", targetKurdish: "تەنها گوێم لێ بگرە پێش ئەوەی بڕیار بدەیت.", promptAr: "تطلب منه يسمعك للاخر", targetArabic: "بس اسمعني للاخر قبل ما تاخذ قرار.", promptRu: "Попроси выслушать тебя до конца", targetRussian: "Просто выслушай меня, прежде чем принимать решение." },
      { prompt: "گۆڕینی تێڕوانین", target: "Look at it this way, we're actually saving money.", targetKurdish: "بەو شێوەیە سەیری بکە کە لە ڕاستیدا ئێمە پارە دەگەڕێنینەوە.", promptAr: "تغيير وجهة النظر", targetArabic: "شوف الموضوع من هالزاوية، إحنا بالحقيقة نوفر فلوس.", promptRu: "Покажи выгоду с другой стороны", targetRussian: "Посмотри на это так: мы на самом деле экономим деньги." },
    ],
    sentences: [
      { english: ["I'm","convinced","that","this","is","the","right","path"], kurdish: "دڵنیام لەوەی کە ئەمە ڕێگە دروستەکەیە", arabic: "اني مقتنع انو هذا هو الطريق الصحيح", russian: "Я убежден, что это правильный путь" },
      { english: ["Doesn't","it","make","sense","to","wait","a","bit"], kurdish: "ئایا لۆژیکیتر نییە کە کەمێک چاوەڕێ بکەین؟", arabic: "مو منطقي نستنه شوية؟", russian: "Разве не логично было бы немного подождать?" },
    ],
    fillBlanks: [
      { parts: ["Take my","for it, this is the best option."], hint: "قسەی من وەرگرە (بڕوام پێ بکە)، ئەمە باشترین هەڵبژاردەیە.", answer: "word", wrongs: ["voice","talk","say"], arabicHint: "صدگني، هذا احسن خيار.", arabicParts: ["اخذ","حچيي، هذا احسن خيار."], arabicAnswer: "حچيي", arabicWrongs: ["صوتي","كلامي","قولي"], russianHint: "Поверь мне на слово, это наилучший вариант.", russianParts: ["Поверь мне на",", это наилучший вариант."], russianAnswer: "слово", russianWrongs: ["дело","мысль","честь"] },
      { parts: ["Hear me","before you say no."], hint: "گوێم لێ بگرە پێش ئەوەی بڵێیت نەخێر.", answer: "out", wrongs: ["up","in","to"], arabicHint: "اسمعني للاخر قبل ما تگول لا.", arabicParts: ["اسمعني","قبل ما تگول لا."], arabicAnswer: "للاخر", arabicWrongs: ["فوگ","بي","الى"], russianHint: "Выслушай меня, прежде чем сказать «нет».", russianParts: ["","меня, прежде чем сказать «нет»."], russianAnswer: "Выслушай", russianWrongs: ["Пойми","Прости","Узнай"] },
    ],
    conversations: [
      {
        situation: "دەتەوێت هاوکارێکت قایڵ بکەیت بە بیرۆکەیەک",
        theyAsk: "I don't think we should change the design right now.",
        correct: "Just hear me out. Look at it this way: the new design will attract more young users. Doesn't it make sense to try it?",
        wrong1: "You are wrong. New design is better.",
        wrong2: "Listen to me, I know the best design.",
        wrong3: "Why you say no? Design is good.",
        explanation: "'Hear me out' و 'Look at it this way' ڕێگەیەکی زۆر زیرکانەن بۆ نەرمکردنی بەرامبەر پێش ئەوەی قایڵی بکەیت",
        situationAr: "تريد تقنع زميلك بفكرة",
        explanationAr: "'اسمعني للاخر' و 'شوف الموضوع من هالزاوية' طريقتين ذكيات كلش حتى تخلي الطرف الثاني يتقبل كلامك.",
        theyAskAr: "ما أعتقد لازم نغير التصميم هسة.",
        correctAr: "بس اسمعني للاخر. شوف الموضوع من هالزاوية: التصميم الجديد راح يجذب مستخدمين شباب اكثر. مو منطقي نجربه؟",
        wrong1Ar: "أنت غلطان. التصميم الجديد أحسن.",
        wrong2Ar: "اسمع كلامي، أني أعرف أحسن تصميم.",
        wrong3Ar: "ليش تگول لا؟ التصميم زين.",
        situationRu: "Убеждаешь коллегу согласиться с новой идеей",
        theyAskRu: "Я не думаю, что нам стоит менять дизайн прямо сейчас.",
        correctRu: "Просто выслушай меня. Посмотри на это так: новый дизайн привлечет молодую аудиторию. Разве не логично попробовать?",
        wrong1Ru: "Ты не прав. Новый дизайн лучше.",
        wrong2Ru: "Слушай меня, я знаю лучший дизайн.",
        wrong3Ru: "Почему ты говоришь нет? Дизайн хороший.",
        explanationRu: "«Hear me out» и «Look at it this way» мягко снимают возражения собеседника и настраивают на конструктивный диалог."
      },
    ],
  },

  // Lesson 1: Constructive Complaints
  {
    topic: "Constructive Complaints", topicKu: "سکاڵاکردن بە شێوازێکی بنیاتنەر", topicAr: "الشكاوى بطريقة زينة", topicRu: "Конструктивные претензии",
    words: [
      { english: "I'm not entirely satisfied", kurdish: "بەتەواوی ڕازی نیم", arabic: "مو راضي بالكامل", russian: "Я не вполне удовлетворен" },
      { english: "There seems to be a mistake", kurdish: "وادیارە هەڵەیەک ڕوویداوە", arabic: "يبين اكو غلط", russian: "Похоже, здесь произошла ошибка" },
      { english: "It falls short of", kurdish: "لە ئاستی پێویستدا نییە بۆ...", arabic: "ما يوصل للمستوى المطلوب", russian: "Не дотягивает до..." },
      { english: "I expected better", kurdish: "چاوەڕوانی شتی باشترم دەکرد", arabic: "كنت اتوقع احسن", russian: "Я ожидал большего" },
      { english: "Look into this matter", kurdish: "بەدواداچوون بۆ ئەم بابەتە", arabic: "تتابع هالموضوع / تشوف هالموضوع", russian: "Разобраться с этим вопросом" },
    ],
    voices: [
      { prompt: "دەربڕینی ناڕەزایی نەرم", target: "I'm not entirely satisfied with the quality of this product.", targetKurdish: "بەتەواوی ڕازی نیم لە کوالێتی ئەم بەرهەمە.", promptAr: "تعبر عن عدم رضاك بلطف", targetArabic: "مو راضي بالكامل عن جودة هالمنتج.", promptRu: "Вырази претензию по поводу качества", targetRussian: "Я не вполне удовлетворен качеством этого товара." },
      { prompt: "ئاماژەدان بە هەڵەیەک", target: "There seems to be a mistake on my bill.", targetKurdish: "وادیارە هەڵەیەک لە پسووڵەی پارەکەمدا ڕوویداوە.", promptAr: "تشير لوجود غلط", targetArabic: "يبين اكو غلط بالفاتورة مالتي.", promptRu: "Вежливо укажи на ошибку в счете", targetRussian: "Кажется, в моем счете допущена ошибка." },
    ],
    sentences: [
      { english: ["Could","you","please","look","into","this","matter"], kurdish: "تکایە دەتوانیت بەدواداچوون بۆ ئەم بابەتە بکەیت؟", arabic: "تكدر بلا زحمة تتابع هالموضوع؟", russian: "Не могли бы вы разобраться с этой ситуацией?" },
      { english: ["The","service","falls","short","of","my","expectations"], kurdish: "خزمەتگوزارییەکە لە ئاست چاوەڕوانییەکانی مندا نییە", arabic: "الخدمة ما توصل لمستوى توقعاتي", russian: "Уровень сервиса не дотягивает до моих ожиданий" },
    ],
    fillBlanks: [
      { parts: ["I'm not entirely","with how this was handled."], hint: "بەتەواوی ڕازی نیم بە چۆنیەتی مامەڵەکردن لەگەڵ ئەمەدا.", answer: "satisfied", wrongs: ["happy","good","pleased"], arabicHint: "مو راضي بالكامل عن طريقة التعامل ويه هالموضوع.", arabicParts: ["مو","بالكامل عن طريقة التعامل ويه هالموضوع."], arabicAnswer: "راضي", arabicWrongs: ["مرتاح","زين","فرحان"], russianHint: "Я не совсем доволен тем, как разрешилась эта ситуация.", russianParts: ["Я не совсем","тем, как разрешилась эта ситуация."], russianAnswer: "доволен", russianWrongs: ["уверен","готов","согласен"] },
      { parts: ["There","to be a mistake with my order."], hint: "وادیارە هەڵەیەک لە داواکارییەکەمدا ڕوویداوە.", answer: "seems", wrongs: ["looks","feels","shows"], arabicHint: "يبين اكو غلط بالطلب مالتي.", arabicParts: ["","اكو غلط بالطلب مالتي."], arabicAnswer: "يبين", arabicWrongs: ["يطلع","يحس","يتبين"], russianHint: "Кажется, в моем заказе произошла ошибка.", russianParts: ["Кажется, в моем заказе произошла","."], russianAnswer: "ошибка", russianWrongs: ["проблема","задержка","путаница"] },
    ],
    conversations: [
      {
        situation: "پەیوەندی بە خزمەتگوزاری کڕیارانەوە دەکەیت",
        theyAsk: "How can I assist you with your recent purchase?",
        correct: "Hi, I'm calling because I'm not entirely satisfied. There seems to be a mistake with the delivery, and it falls short of what I expected.",
        wrong1: "Your delivery is bad. I hate it.",
        wrong2: "You made a big mistake. Fix it.",
        wrong3: "I want my money. Delivery is wrong.",
        explanation: "'I'm not entirely satisfied' و 'There seems to be a mistake' شێوازی سکاڵاکردنی کەسانی پێگەیشتوو و پیشەییە",
        situationAr: "تتصل بخدمة الزباين",
        explanationAr: "'مو راضي بالكامل' و 'يبين اكو غلط' هاي طرق شكوى محترمة و ناضجة.",
        theyAskAr: "شلون أگدر أساعدك بخصوص طلبك الأخير؟",
        correctAr: "مرحبا، دي أتصل لأن مو راضي بالكامل. يبين اكو غلط بالتوصيل، وما يوصل للي چنت متوقعه.",
        wrong1Ar: "التوصيل مالتكم سيء. ما أحبه.",
        wrong2Ar: "سويتوا غلط چبير. صلحوه.",
        wrong3Ar: "أريد فلوسي. التوصيل غلط.",
        situationRu: "Звонок в службу поддержки по поводу неудачной покупки",
        theyAskRu: "Здравствуйте! Чем я могу помочь вам по поводу вашей недавней покупки?",
        correctRu: "Здравствуйте, я звоню, потому что не вполне доволен. Кажется, возникла ошибка с доставкой, и это далеко от того, чего я ожидал.",
        wrong1Ru: "Ваша доставка ужасна. Я ее ненавижу.",
        wrong2Ru: "Вы совершили огромную ошибку. Исправьте ее.",
        wrong3Ru: "Я хочу свои деньги. Доставка неправильная.",
        explanationRu: "«I'm not entirely satisfied» и «There seems to be a mistake» — вежливый тон профессиональной претензии, позволяющий решить проблему без конфликтов."
      },
    ],
  },

  // Lesson 2: Delicate Advice
  {
    topic: "Delicate Advice", topicKu: "ئامۆژگاری هەستیار", topicAr: "نصيحة حساسة", topicRu: "Деликатные советы",
    words: [
      { english: "Have you considered", kurdish: "بیرت لەوە کردووەتەوە کە...؟", arabic: "فكرت بـ...", russian: "Ты не думал о том, чтобы..." },
      { english: "It might be wise to", kurdish: "لەوانەیە کارێکی ژیرانە بێت کە", arabic: "يمكن احسن شي تسوي", russian: "Было бы разумно..." },
      { english: "I wouldn't recommend", kurdish: "پێشنیاری ئەوە ناکەم کە", arabic: "ما انصح بـ", russian: "Я бы не рекомендовал..." },
      { english: "Sleep on it", kurdish: "بیرکردنەوەیەکی قووڵ (تا بەیانی بڕیار نەدان)", arabic: "خليها لباچر وفكر بيها زين", russian: "Переспать с этой мыслью (обдумать до утра)" },
      { english: "Weigh your options", kurdish: "هەڵسەنگاندن بۆ بژاردەکانت", arabic: "وزن خياراتك", russian: "Взвесить все за и против" },
    ],
    voices: [
      { prompt: "پێشنیارکردنی بیرکردنەوە", target: "Don't rush. It might be wise to sleep on it first.", targetKurdish: "پەلە مەکە. لەوانەیە کارێکی ژیرانە بێت کە سەرەتا (تا بەیانی) بیری لێ بکەیتەوە.", promptAr: "اقتراح التفكير", targetArabic: "لا تستعجل. يمكن احسن شي تخليها لباچر وتفكر بيها زين اول.", promptRu: "Посоветуй не принимать поспешных решений", targetRussian: "Не спеши. Было бы разумно сначала все обдумать до утра." },
      { prompt: "ئامۆژگاری بۆ هەڵسەنگاندن", target: "You should weigh your options before deciding.", targetKurdish: "دەبێت هەڵسەنگاندن بۆ بژاردەکانت بکەیت پێش بڕیاردان.", promptAr: "نصيحة للتقييم", targetArabic: "لازم توزن خياراتك قبل ما تقرر.", promptRu: "Предложи взвесить варианты", targetRussian: "Тебе стоит взвесить все варианты, прежде чем принимать решение." },
    ],
    sentences: [
      { english: ["Have","you","considered","talking","to","him","directly"], kurdish: "بیرت لەوە کردووەتەوە ڕاستەوخۆ قسەی لەگەڵ بکەیت؟", arabic: "فكرت تحچي وياه گبل؟", russian: "Ты не думал о том, чтобы поговорить с ним напрямую?" },
      { english: ["I","wouldn't","recommend","quitting","just","yet"], kurdish: "پێشنیاری ئەوە ناکەم کە هەر ئێستا واز بهێنیت", arabic: "ما انصحك تبطل هسة.", russian: "Я бы не советовал увольняться прямо сейчас" },
    ],
    fillBlanks: [
      { parts: ["Take your time and","your options carefully."], hint: "کاتی خۆت وەربگرە و بە وریاییەوە بژاردەکانت هەڵسەنگێنە.", answer: "weigh", wrongs: ["think","look","see"], arabicHint: "اخذ وقتك وقيس خياراتك زين.", arabicParts: ["اخذ وقتك و","خياراتك زين."], arabicAnswer: "قيس", arabicWrongs: ["فكر","شوف","تابع"], russianHint: "Не торопись и тщательно взвесь все варианты.", russianParts: ["Не торопись и тщательно","все варианты."], russianAnswer: "взвесь", russianWrongs: ["выбери","оставь","забудь"] },
      { parts: ["It's a big choice, you should","on it."], hint: "بڕیارێکی گەورەیە، دەبێت (تا بەیانی) بیری لێ بکەیتەوە.", answer: "sleep", wrongs: ["wait","rest","stop"], arabicHint: "هذا خيار چبير، لازم تفكر بيه زين.", arabicParts: ["هذا خيار چبير، لازم","بيه زين."], arabicAnswer: "تفكر", arabicWrongs: ["تنتظر","ترتاح","توقف"], russianHint: "Это важный выбор, тебе стоит с этим переспать.", russianParts: ["Это важный выбор, тебе стоит с этой мыслью","."], russianAnswer: "переспать", russianWrongs: ["пожить","погулять","смириться"] },
    ],
    conversations: [
      {
        situation: "هاوڕێیەکەت دەیەوێت بەپەلە واز لە کارەکەی بهێنێت",
        theyAsk: "I'm so angry at my boss. I'm going to quit tomorrow!",
        correct: "I understand you're upset, but I wouldn't recommend quitting just yet. It might be wise to sleep on it and weigh your options first.",
        wrong1: "Don't quit, it is bad.",
        wrong2: "You are wrong to quit.",
        wrong3: "I tell you not to quit.",
        explanation: "'sleep on it' ئیدیۆمێکی زۆر بەکارهاتووە بە واتای (پەلە مەکە و کاتی زیاتر بدە بە خۆت بۆ بیرکردنەوە لە بڕیارێک)",
        situationAr: "صاحبك يريد يستقيل من شغله على عجل",
        explanationAr: "'Sleep on it' تعبير كلش شايع يعني (لا تستعجل وخلي بالك يفكر زين بالقرار).",
        theyAskAr: "أني كلش ضايج من مديري. راح أقدم استقالتي باچر!",
        correctAr: "أفهمك مقهور، بس ما أنصحك تبطل هسة. يمكن أحسن شي تخليها لباچر وتوزن خياراتك زين أول.",
        wrong1Ar: "لا تبطل، مو زين.",
        wrong2Ar: "أنت غلطان إذا تبطل.",
        wrong3Ar: "أگلك لا تستقيل.",
        situationRu: "Друг на эмоциях собирается уволиться с работы",
        theyAskRu: "Я так зол на своего начальника. Завтра же увольняюсь!",
        correctRu: "Я понимаю твои чувства, но я бы не советовал рубить с плеча. Разумнее будет все обдумать до утра и взвесить варианты.",
        wrong1Ru: "Не увольняйся, это плохо.",
        wrong2Ru: "Ты не прав, что увольняешься.",
        wrong3Ru: "Я говорю тебе не увольняться.",
        explanationRu: "«Sleep on it» (утро вечера мудренее / переспать с мыслью) — классический совет дать эмоциям остыть перед важным шагом."
      },
    ],
  },

  // Lesson 3: Hypothetical Situations
  {
    topic: "Hypothetical Situations", topicKu: "بارودۆخە گریمانەییەکان", topicAr: "المواقف الافتراضية", topicRu: "Гипотетические ситуации",
    words: [
      { english: "If I were in your shoes", kurdish: "ئەگەر لە جێگەی تۆ بوومایە", arabic: "لو اني مكانك", russian: "Будь я на твоем месте..." },
      { english: "What if we", kurdish: "چی دەبێت ئەگەر ئێمە", arabic: "شنو لو سوينا", russian: "Что, если мы..." },
      { english: "Suppose that", kurdish: "گریمانەی ئەوە بکە کە", arabic: "افرض انو", russian: "Предположим, что..." },
      { english: "In a perfect world", kurdish: "لە جیهانێکی بێگەرددا (ئەگەر هەموو شتێک ڕێک بووایە)", arabic: "بعالم مثالي", russian: "В идеальном мире..." },
      { english: "Worst-case scenario", kurdish: "خراپترین ئەگەری پێشبینیکراو", arabic: "اسوأ شي ممكن يصير", russian: "Худший сценарий" },
    ],
    voices: [
      { prompt: "خۆخستنە جێگەی کەسێک", target: "If I were in your shoes, I would ask for a raise.", targetKurdish: "ئەگەر لە جێگەی تۆ بوومایە، داوای زیادکردنی مووچەم دەکرد.", promptAr: "تحط نفسك مكان شخص ثاني", targetArabic: "لو اني مكانك، چان طلبت زيادة بالراتب.", promptRu: "Посоветуй, как поступил бы ты на его месте", targetRussian: "Будь я на твоем месте, я бы попросил о прибавке к зарплате." },
      { prompt: "باسکردنی خراپترین ئەگەر", target: "What is the worst-case scenario if we fail?", targetKurdish: "خراپترین ئەگەری پێشبینیکراو چییە ئەگەر سەرنەکەوین؟", promptAr: "مناقشة اسوأ الاحتمالات", targetArabic: "شنو اسوأ شي ممكن يصير لو فشلنا؟", promptRu: "Спроси о худшем развитии событий", targetRussian: "Каков наихудший сценарий в случае нашей неудачи?" },
    ],
    sentences: [
      { english: ["What","if","we","tried","a","different","approach"], kurdish: "چی دەبێت ئەگەر ڕێگەیەکی جیاواز تاقی بکەینەوە؟", arabic: "شنو لو جربنا طريقة مختلفة؟", russian: "Что, если нам попробовать другой подход?" },
      { english: ["Suppose","that","they","reject","our","offer"], kurdish: "گریمانەی ئەوە بکە کە ئەوان پێشنیارەکەمان ڕەتدەکەنەوە", arabic: "افرض انهم يرفضون عرضنا.", russian: "Предположим, что они отклонят наше предложение" },
    ],
    fillBlanks: [
      { parts: ["If I were in your",", I wouldn't worry so much."], hint: "ئەگەر لە جێگەی تۆ بوومایە، ئەوەندە خەمی لێ نەدەخوارد.", answer: "shoes", wrongs: ["place","position","mind"], arabicHint: "لو اني مكانك، چان ما قلقت هواية.", arabicParts: ["لو اني","، چان ما قلقت هواية."], arabicAnswer: "مكانك", arabicWrongs: ["موقعك","منصبك","عقلك"], russianHint: "Будь я на твоем месте, я бы так сильно не переживал.", russianParts: ["Будь я на твоем",", я бы так сильно не переживал."], russianAnswer: "месте", russianWrongs: ["пути","доме","слове"] },
      { parts: ["In a","world, this project would be done by now."], hint: "لە جیهانێکی بێگەرددا، ئەم پڕۆژەیە تا ئێستا تەواو دەبوو.", answer: "perfect", wrongs: ["good","great","best"], arabicHint: "بعالم مثالي، چان هالمشروع خلص هسة.", arabicParts: ["بعالم","، چان هالمشروع خلص هسة."], arabicAnswer: "مثالي", arabicWrongs: ["زين","عظيم","احسن"], russianHint: "В идеальном мире этот проект был бы уже завершен.", russianParts: ["В","мире этот проект был бы уже завершен."], russianAnswer: "идеальном", russianWrongs: ["нашем","другом","реальном"] },
    ],
    conversations: [
      {
        situation: "تیمەکەت پێشبینی کێشەیەک دەکات لە پڕۆژەیەکدا",
        theyAsk: "I'm worried the client might not like the proposal.",
        correct: "Suppose that happens. What's the worst-case scenario? We just revise it. If I were in your shoes, I'd stay positive.",
        wrong1: "Don't think bad.",
        wrong2: "If they don't like, we cry.",
        wrong3: "Client is always right.",
        explanation: "'If I were in your shoes' زۆر باوتر و جوانترە لە وتنی 'If I were you'",
        situationAr: "فريقك يتوقع مشكلة بمشروع",
        explanationAr: "'لو اني مكانك' (If I were in your shoes) اكثر شيوعاً وجمالاً من قول 'لو اني انت' (If I were you).",
        theyAskAr: "قلقان لا العميل ما يعجبه المقترح.",
        correctAr: "افرض صار هيچي. شنو أسوأ شي ممكن يصير؟ نعدله وبس. لو أني بمكانك، أبقى متفائل.",
        wrong1Ar: "لا تفكر بشي مو زين.",
        wrong2Ar: "إذا ما عجبهم نبچي.",
        wrong3Ar: "العميل دائماً على حق.",
        situationRu: "Команда опасается, что заказчику не понравится коммерческое предложение",
        theyAskRu: "Я очень переживаю, что клиенту не понравится наше предложение.",
        correctRu: "Предположим, так и будет. Каков худший сценарий? Мы просто внесем правки. Будь я на твоем месте, я бы мыслил позитивно.",
        wrong1Ru: "Не думай о плохом.",
        wrong2Ru: "Если им не понравится, мы будем плакать.",
        wrong3Ru: "Клиент всегда прав.",
        explanationRu: "Идиома «If I were in your shoes» звучит живее и естественнее, чем буквальное «If I were you»."
      },
    ],
  },

  // Lesson 4: Probability & Certainty
  {
    topic: "Probability & Certainty", topicKu: "ئەگەرەکان و دڵنیایی", topicAr: "الاحتمالية واليقين", topicRu: "Вероятность и уверенность",
    words: [
      { english: "It's highly likely", kurdish: "ئەگەرێکی زۆری هەیە", arabic: "اكو احتمال كبير", russian: "Весьма вероятно" },
      { english: "There's no doubt that", kurdish: "هیچ گومانێک لەوەدا نییە کە", arabic: "ما اكو شك انو", russian: "Нет никаких сомнений в том, что..." },
      { english: "Chances are", kurdish: "ئەگەرەکان وا دەردەخەن / پێدەچێت", arabic: "الاحتمالات تگول / غالباً", russian: "Скорее всего / велики шансы" },
      { english: "I bet that", kurdish: "گرەو دەکەم کە / دڵنیام کە", arabic: "اراهن انو", russian: "Готов поспорить, что..." },
      { english: "It's a long shot", kurdish: "ئەگەرێکی زۆر لاوازە (قورسە ڕووبدات)", arabic: "احتمال ضعيف كلش", russian: "Маловероятно / призрачный шанс" },
    ],
    voices: [
      { prompt: "دەربڕینی دڵنیایی", target: "There's no doubt that she will get the promotion.", targetKurdish: "هیچ گومانێک لەوەدا نییە کە ئەو پلەبەرزکردنەوەکە وەردەگرێت.", promptAr: "تعبر عن يقينك", targetArabic: "ما اكو شك انها راح تحصل على الترقية.", promptRu: "Вырази уверенность в повышении коллеги", targetRussian: "Нет сомнений в том, что она получит это повышение." },
      { prompt: "ئاماژەدان بە ئەگەرێکی لاواز", target: "Winning the lottery is a long shot.", targetKurdish: "بردنەوەی یانسیب ئەگەرێکی زۆر لاوازە.", promptAr: "تشير لاحتمال ضعيف", targetArabic: "الفوز باليانصيب احتمال ضعيف كلش.", promptRu: "Оцени шансы выиграть в лотерею", targetRussian: "Выиграть в лотерею — шанс один на миллион." },
    ],
    sentences: [
      { english: ["Chances","are","it","will","rain","tomorrow"], kurdish: "پێدەچێت بەیانی باران ببارێت", arabic: "غالباً راح تمطر باچر.", russian: "Весьма вероятно, что завтра пойдет дождь" },
      { english: ["It's","highly","likely","that","we","will","win"], kurdish: "ئەگەرێکی زۆری هەیە کە ئێمە ببەینەوە", arabic: "اكو احتمال كبير انو نفوز.", russian: "С высокой долей вероятности мы одержим победу" },
    ],
    fillBlanks: [
      { parts: ["It's a long",", but we might still win the game."], hint: "ئەگەرێکی زۆر لاوازە، بەڵام لەوانەیە هێشتا یارییەکە ببەینەوە.", answer: "shot", wrongs: ["chance","way","run"], arabicHint: "هذا احتمال ضعيف، بس يمكن نفوز بالمباراة.", arabicParts: ["هذا احتمال","، بس يمكن نفوز بالمباراة."], arabicAnswer: "ضعيف", arabicWrongs: ["فرصة","طريق","ركض"], russianHint: "Шанс призрачный, но мы все еще можем выиграть эту игру.", russianParts: ["Шанс",", но мы все еще можем выиграть эту игру."], russianAnswer: "призрачный", russianWrongs: ["большой","точный","верный"] },
      { parts: ["There's no","that he is the best player."], hint: "هیچ گومانێک لەوەدا نییە کە ئەو باشترین یاریزانە.", answer: "doubt", wrongs: ["question","thinking","sure"], arabicHint: "ما اكو شك انو احسن لاعب.", arabicParts: ["ما","انو احسن لاعب."], arabicAnswer: "اكو شك", arabicWrongs: ["سؤال","تفكير","تأكيد"], russianHint: "Нет никаких сомнений в том, что он лучший игрок.", russianParts: ["Нет никаких","в том, что он лучший игрок."], russianAnswer: "сомнений", russianWrongs: ["мыслей","слов","ответов"] },
    ],
    conversations: [
      {
        situation: "پێشبینیکردنی ئەنجامی چاوپێکەوتنێکی کار",
        theyAsk: "Do you think Sarah will get the job?",
        correct: "There's no doubt that she's qualified, but getting it is a long shot since there are so many applicants. However, chances are she'll at least get a second interview.",
        wrong1: "She will get job.",
        wrong2: "I think maybe she wins.",
        wrong3: "Job is hard.",
        explanation: "'It's a long shot' دەستەواژەیەکی نایابە بۆ شتێک کە ئەگەری ڕوودانی کەمە بەڵام مەحاڵ نییە",
        situationAr: "تتوقع نتيجة مقابلة شغل",
        explanationAr: "'احتمال ضعيف كلش' (It's a long shot) تعبير ممتاز لشي احتمالية حدوثه قليلة بس مو مستحيل.",
        theyAskAr: "تتوقع سارة راح تحصل على الوظيفة؟",
        correctAr: "ماكو شك إنها مؤهلة، بس قبولها احتمال ضعيف لأن اكو متقدمين هواية. مع هذا، غالباً راح تحصل على الأقل مقابلة ثانية.",
        wrong1Ar: "هي راح تاخذ الوظيفة.",
        wrong2Ar: "أعتقد يمكن هي تفوز.",
        wrong3Ar: "الوظيفة صعبة.",
        situationRu: "Обсуждение шансов Сары получить престижную должность",
        theyAskRu: "Как думаешь, Сара получит эту работу?",
        correctRu: "Нет никаких сомнений в ее квалификации, но шансы невелики из-за огромного числа кандидатов. Впрочем, скорее всего, ее пригласят на второй тур.",
        wrong1Ru: "Она получит работу.",
        wrong2Ru: "Я думаю, может, она победит.",
        wrong3Ru: "Работу получить трудно.",
        explanationRu: "«A long shot» — прекрасное образное выражение для ситуации с низкой вероятностью успеха, которая тем не менее возможна."
      },
    ],
  },

  // Lesson 5: Changing the Subject
  {
    topic: "Changing the Subject", topicKu: "گۆڕینی بابەتی گفتوگۆ", topicAr: "تغيير الموضوع", topicRu: "Смена темы разговора",
    words: [
      { english: "Speaking of which", kurdish: "بە قسە بێت (مادام باسی ئەوەت کرد)", arabic: "بالمناسبة / بالحديث عن ذلك", russian: "Кстати говоря / к слову" },
      { english: "That reminds me", kurdish: "ئەوەی بیرخستمەوە", arabic: "هذا يذكرني", russian: "Это напомнило мне о..." },
      { english: "On a different note", kurdish: "لە بابەتێکی جیاوازدا / با بێینە سەر شتێکی تر", arabic: "بالمناسبة / على صعيد آخر", russian: "Кстати о другом / меняя тему" },
      { english: "By the way", kurdish: "لەبیرم چوو بڵێم / هەر لە ناو قسەکاندا", arabic: "بالمناسبة", russian: "Между прочим" },
      { english: "Going off on a tangent", kurdish: "لادan لە بابەتە سەرەکییەکە", arabic: "الخروج عن الموضوع", russian: "Уходить в сторону от темы" },
    ],
    voices: [
      { prompt: "بیرکەوتنەوەی شتێک", target: "That reminds me, I need to call my mother.", targetKurdish: "ئەوەی بیرخستمەوە، پێویستە تەلەفۆن بۆ دایکم بکەم.", promptAr: "تذكر شيء ما", targetArabic: "هذا يذكرني، أحتاج إلى الاتصال بوالدتي.", promptRu: "Вспомни о важном звонке по ходу разговора", targetRussian: "Это напомнило мне, что мне нужно позвонить маме." },
      { prompt: "گۆڕینی بابەتەکە بەتەواوی", target: "On a different note, how was your vacation?", targetKurdish: "با بێینە سەر شتێک تر، پشووەکەت چۆن بوو؟", promptAr: "تغيير الموضوع تمامًا", targetArabic: "على صعيد آخر، كيف كانت عطلتك؟", promptRu: "Смени тему и спроси об отпуске", targetRussian: "Кстати о другом: как прошел твой отпуск?" },
    ],
    sentences: [
      { english: ["Speaking","of","which","did","you","see","the","news"], kurdish: "بە قسە بێت، هەواڵەکانت بینی؟", arabic: "بالمناسبة، شفت الاخبار؟", russian: "Кстати об этом, ты видел последние новости?" },
      { english: ["Sorry","for","going","off","on","a","tangent"], kurdish: "ببوورە کە لە بابەتەکە لامدا", arabic: "اسف لان طلعت عن الموضوع.", russian: "Извини, что я отклоняюсь от темы" },
    ],
    fillBlanks: [
      { parts: ["That","me, we have a meeting at 2 PM."], hint: "ئەوەی بیرخستمەوە، کاتژمێر ٢ کۆبوونەوەمان هەیە.", answer: "reminds", wrongs: ["makes","shows","tells"], arabicHint: "هذا يذكرني، عدنا اجتماع الساعة 2 الظهر.", arabicParts: ["هذا","، عدنا اجتماع الساعة 2 الظهر."], arabicAnswer: "يذكرني", arabicWrongs: ["يخليني","يشوفني","يگلي"], russianHint: "Это напомнило мне: у нас встреча в 2 часа дня.", russianParts: ["Это","мне: у нас встреча в 2 часа дня."], russianAnswer: "напомнило", russianWrongs: ["сказало","показало","объяснило"] },
      { parts: ["On a different",", what are we having for dinner?"], hint: "لە بابەتێکی جیاوازدا، چی دەخۆین بۆ نانی ئێوارە؟", answer: "note", wrongs: ["topic","subject","thing"], arabicHint: "بغير موضوع، شنو راح نتعشى؟", arabicParts: ["بغير","، شنو راح نتعشى؟"], arabicAnswer: "موضوع", arabicWrongs: ["شي","سالفة","شأن"], russianHint: "Меняя тему: что у нас сегодня на ужин?", russianParts: ["Кстати о",": что у нас сегодня на ужин?"], russianAnswer: "другом", russianWrongs: ["новом","главном","первом"] },
    ],
    conversations: [
      {
        situation: "لە ناوەڕاستی گفتوگۆیەکدا دەتەوێت باسی شتێکی تر بکەیت کە بیرت کەوتووەتەوە",
        theyAsk: "Yeah, the traffic today was terrible near the new restaurant.",
        correct: "Speaking of which! That reminds me, I wanted to ask if you want to go to that restaurant this Friday?",
        wrong1: "I want to go to restaurant Friday.",
        wrong2: "Traffic is bad. Friday restaurant?",
        wrong3: "I change subject. Let's go Friday.",
        explanation: "'Speaking of which' یان 'That reminds me' باشترین پردن بۆ پەڕینەوە لە نێوان بابەتەکاندا بەبێ پچڕاندنی گفتوگۆکە",
        situationAr: "في منتصف محادثة، تريد التحدث عن شيء آخر تذكرته",
        explanationAr: "'بالمناسبة' (Speaking of which) أو 'هذا يذكرني' (That reminds me) هما أفضل جسر للانتقال بين المواضيع دون قطع المحادثة.",
        theyAskAr: "إي والله، الازدحام اليوم چان فد شي يخنگ يم المطعم الجديد.",
        correctAr: "بالمناسبة! هذا يذكرني، چنت أريد أسألك إذا تحب نروح لذاك المطعم هالمجمعة؟",
        wrong1Ar: "أريد أروح للمطعم يوم الجمعة.",
        wrong2Ar: "الازدحام مو زين. الجمعة مطعم؟",
        wrong3Ar: "أغير الموضوع. خل نروح الجمعة.",
        situationRu: "В разговоре о пробках вам вспомнился ресторан, куда вы хотели пойти",
        theyAskRu: "Да, сегодня были ужасные пробки возле того нового ресторана.",
        correctRu: "Кстати об этом! Это напомнило мне: я как раз хотел спросить, не хочешь сходить туда в эту пятницу?",
        wrong1Ru: "Я хочу пойти в ресторан в пятницу.",
        wrong2Ru: "Пробки ужасны. Пятница ресторан?",
        wrong3Ru: "Я меняю тему. Пойдем в пятницу.",
        explanationRu: "Связки «Speaking of which» и «That reminds me» позволяют элегантно и плавно переключить разговор на другую мысль."
      },
    ],
  },

  // Lesson 6: Making Excuses
  {
    topic: "Making Excuses", topicKu: "هێنانەوەی پاساو", topicAr: "تقديم الأعذار", topicRu: "Оправдания и причины",
    words: [
      { english: "The reason being", kurdish: "هۆکارەکەی ئەوەیە کە", arabic: "السبب هو أن", russian: "Причина в том, что..." },
      { english: "Due to unforeseen circumstances", kurdish: "بەهۆی بارودۆخێکی پێشبینینەکراوەوە", arabic: "بسبب ظروف غير متوقعة", russian: "В связи с непредвиденными обстоятельствами" },
      { english: "It was out of my hands", kurdish: "لە دەسەڵاتی مندا نەبوو", arabic: "��م يكن بيدي", russian: "Это было вне моего контроля" },
      { english: "I didn't mean to", kurdish: "مەبەستم نەبوو کە...", arabic: "لم أقصد أن", russian: "Я не хотел обидеть / случайно" },
      { english: "Let me explain", kurdish: "با ڕوونی بکەمەوە", arabic: "دعني أوضح", russian: "Позвольте мне объяснить" },
    ],
    voices: [
      { prompt: "لابردنی تاوان لەسەر خۆت", target: "I apologize, but the delay was completely out of my hands.", targetKurdish: "داوای لێبوردن دەکەم، بەڵام دواکەوتنەکە بەتەواوی لە دەسەڵاتی مندا نەبوو.", promptAr: "إزالة اللوم عن النفس", targetArabic: "اعتذر، بس التأخير چان طالع من ايدي تماماً.", promptRu: "Объясни, что задержка произошла не по твоей вине", targetRussian: "Прошу прощения, но эта задержка была абсолютно вне моего контроля." },
      { prompt: "پاساوی فەرمی", target: "Due to unforeseen circumstances, we must cancel the event.", targetKurdish: "بەهۆی بارودۆخێکی پێشبینینەکراوەوە، دەبێت بۆنەکە هەڵبوەشێنینەوە.", promptAr: "عذر رسمي", targetArabic: "بسبب ظروف ما كانت بالحسبان، لازم نلغي الحدث.", promptRu: "Сообщи об отмене из-за непредвиденных обстоятельств", targetRussian: "Из-за непредвиденных обстоятельств нам приходится отменить мероприятие." },
    ],
    sentences: [
      { english: ["I","didn't","mean","to","offend","you","let","me","explain"], kurdish: "مەبەستم نەبوو دڵت بشکێنم، با ڕوونی بکەمەوە", arabic: "ما كنت اقصد اسيء الك، خليني اوضح.", russian: "Я не хотел вас обидеть, позвольте мне все объяснить" },
      { english: ["I","was","late","the","reason","being","heavy","traffic"], kurdish: "دواکەوتم، هۆکارەکەی قەرەباڵغییەکی زۆر بوو", arabic: "تأخرت، والسبب هو الازدحام القوي.", russian: "Я опоздал по причине огромных пробок на дороге" },
    ],
    fillBlanks: [
      { parts: ["It wasn't my fault, it was","of my hands."], hint: "هەڵەی من نەبوو، لە دەسەڵاتی مندا نەبوو.", answer: "out", wrongs: ["away","far","gone"], arabicHint: "مو غلطتي، چان طالع من ايدي.", arabicParts: ["مو غلطتي، چان","من ايدي."], arabicAnswer: "طالع", arabicWrongs: ["بعيد","نادر","مفقود"], russianHint: "Это была не моя вина, это было вне моего контроля.", russianParts: ["Это была не моя вина, все было вне моего","."], russianAnswer: "контроля", russianWrongs: ["внимания","желания","плана"] },
      { parts: ["Due to","circumstances, the flight is delayed."], hint: "بەهۆی بارودۆخێکی پێشبینینەکراوەوە، گەشتەکە دواکەوتووە.", answer: "unforeseen", wrongs: ["bad","sudden","unknown"], arabicHint: "بسبب ظروف ما كانت بالحسبان، تأجلت الرحلة.", arabicParts: ["بسبب ظروف","، تأجلت الرحلة."], arabicAnswer: "ما كانت بالحسبان", arabicWrongs: ["سيئة","مفاجئة","مجهولة"], russianHint: "Из-за непредвиденных обстоятельств рейс задерживается.", russianParts: ["Из-за","обстоятельств рейс задерживается."], russianAnswer: "непредвиденных", russianWrongs: ["плохих","странных","сложных"] },
    ],
    conversations: [
      {
        situation: "پڕۆژەیەک دواکەوتووە بەهۆی کێشەی کۆمپیوتەرەوە",
        theyAsk: "Why wasn't the report submitted on time yesterday?",
        correct: "Let me explain. The server crashed entirely. I wanted to finish it, but it was completely out of my hands.",
        wrong1: "Computer bad, not me.",
        wrong2: "I didn't do it because of server.",
        wrong3: "Not my fault, server stopped.",
        explanation: "'Out of my hands' ئیدیۆمێکی زۆر بەهێزە بۆ وتنی ئەوەی کە دەسەڵاتت بەسەر کێشەکەدا نەبووە",
        situationAr: "تأخر مشروع بسبب مشكلة في الكمبيوتر",
        explanationAr: "'لم يكن بيدي' (Out of my hands) تعبير قوي جدًا لقول أنك لم تكن تملك السيطرة على المشكلة.",
        theyAskAr: "ليش ما تسلم التقرير بوقته البارحة؟",
        correctAr: "خليني أوضحلك. السيرفر وگف بالكامل. چنت أريد أكمله، بس الموضوع چان طالع من إيدي تماماً.",
        wrong1Ar: "الكمبيوتر خربان، مو أني.",
        wrong2Ar: "ما سويته بسبب السيرفر.",
        wrong3Ar: "مو صوچي، السيرفر وگف.",
        situationRu: "Отчет не был сдан вовремя из-за внезапного сбоя серверов",
        theyAskRu: "Почему вчера отчет не был сдан вовремя?",
        correctRu: "Позвольте мне объяснить. Произошел полный сбой сервера. Я очень хотел все доделать, но это было абсолютно вне моего контроля.",
        wrong1Ru: "Компьютер плохой, не я.",
        wrong2Ru: "Я не сделал из-за сервера.",
        wrong3Ru: "Не моя вина, сервер встал.",
        explanationRu: "«It was out of my hands» — весомый аргумент, означающий, что форс-мажорные обстоятельства не зависели от вашей воли."
      },
    ],
  },

  // Lesson 7: Warning & Instructing
  {
    topic: "Warning & Instructing", topicKu: "ئاگادارکردنەوە و ڕێنماییدان", topicAr: "التحذير والإرشاد", topicRu: "Предостережения и безопасность",
    words: [
      { english: "Make sure you", kurdish: "دڵنیابەرەوە لەوەی کە...", arabic: "تأكد من أنك", russian: "Обязательно сделай..." },
      { english: "Watch out for", kurdish: "ئاگاداری ... بە", arabic: "احذر من", russian: "Остерегайся..." },
      { english: "Bear in mind", kurdish: "لەبیری مەکە / ڕەچاوی ئەوە بکە", arabic: "ضع في اعتبارك", russian: "Имей в виду, что..." },
      { english: "Take precautions", kurdish: "ڕێکاری خۆپارێزی بگرەبەر", arabic: "اتخذ احتياطات", russian: "Принять меры предосторожности" },
      { english: "Better safe than sorry", kurdish: "خۆپاراستن باشترە لە پەشیمانی", arabic: "الوقاية خير من الندم", russian: "Береженого бог бережет (лучше перестраховаться)" },
    ],
    voices: [
      { prompt: "ئاگادارکردنەوە لە مەترسی", target: "Watch out for the wet floor. Better safe than sorry.", targetKurdish: "ئاگاداری زەوییە تەڕەکە بە. خۆپاراستن باشترە لە پەشیمانی.", promptAr: "التحذير من الخطر", targetArabic: "دير بالك من الكاع المبللة. الوقاية خير من الندم.", promptRu: "Предостереги от падения на мокром полу", targetRussian: "Осторожно, пол мокрый! Лучше перестраховаться." },
      { prompt: "پێدانی ڕێنمایی ورد", target: "Make sure you lock the door and bear in mind the alarm code.", targetKurdish: "دڵنیابەرەوە لەوەی دەرگاکە قفڵ بکەیت و کۆدی زەنگەکەش لەبیر مەکە.", promptAr: "تقديم تعليمات مفصلة", targetArabic: "تأكد تسد الباب وخلي بالك رمز الانذار.", promptRu: "Напомни запереть дверь и код сигналки", targetRussian: "Обязательно запри дверь и не забудь код сигнализации." },
    ],
    sentences: [
      { english: ["You","should","always","take","precautions","when","traveling"], kurdish: "دەبێت هەمیشە ڕێکاری خۆپارێزی بگریتەبەر کاتێک گەشت دەکەیت", arabic: "لازم دائماً تاخذ احتياطاتك من تسافر.", russian: "В путешествиях всегда следует соблюдать меры предосторожности" },
      { english: ["Bear","in","mind","that","the","deadline","is","strict"], kurdish: "لەیادت بێت کە وادەی کۆتایی توندە (ناگۆڕدرێت)", arabic: "خلي ببالك انو الموعد النهائي كلش صارم.", russian: "Имей в виду, что дедлайн установлен очень жесткий" },
    ],
    fillBlanks: [
      { parts: ["Bear in","that things might change tomorrow."], hint: "لەیادت بێت (ڕەچاوی ئەوە بکە) کە لەوانەیە سبەی شتەکان بگۆڕێن.", answer: "mind", wrongs: ["head","brain","thought"], arabicHint: "خلي ببالك انو الامور ممكن تتغير باچر.", arabicParts: ["خلي بـ","انو الامور ممكن تتغير باچر."], arabicAnswer: "بالك", arabicWrongs: ["راسك","عقلك","تفكيرك"], russianHint: "Имей в виду, что завтра все может поменяться.", russianParts: ["Имей в",", что завтра все может поменяться."], russianAnswer: "виду", russianWrongs: ["плане","мыслях","деле"] },
      { parts: ["Bring an umbrella. Better","than sorry."], hint: "چەترێک بهێنە. خۆپاراستن باشترە لە پەشیمانی.", answer: "safe", wrongs: ["good","dry","careful"], arabicHint: "جيب شمسية. الوقاية خير من الندم.", arabicParts: ["جيب شمسية.","خير من الندم."], arabicAnswer: "الوقاية", arabicWrongs: ["الجيد","الجفاف","الحذر"], russianHint: "Возьми зонт. Береженого бог бережет.", russianParts: ["Возьми зонт. Лучше",", чем потом жалеть."], russianAnswer: "перестраховаться", russianWrongs: ["подождать","подумать","поспешить"] },
    ],
    conversations: [
      {
        situation: "ڕێنماییدانی کارمەندێکی نوێ سەبارەت بە سەلامەتی",
        theyAsk: "Is there anything else I need to know before using this machine?",
        correct: "Yes, watch out for the sharp edges. Make sure you wear gloves—better safe than sorry.",
        wrong1: "Machine is dangerous.",
        wrong2: "Wear gloves or you bleed.",
        wrong3: "Take care of edges.",
        explanation: "'Better safe than sorry' پەندێکی زۆر بەناوبانگ و باوی ئینگلیزییە بۆ هاندان لەسەر وریایی",
        situationAr: "إرشاد موظف جديد حول السلامة",
        explanationAr: "'الوقاية خير من الندم' (Better safe than sorry) مثل إنجليزي شائع جدًا للتشجيع على الحذر.",
        theyAskAr: "أكو أي شي ثاني لازم أعرفه قبل ما أستخدم هالجهاز؟",
        correctAr: "إي، دير بالك من الحافات الحادة. وتأكد تلبس كفوف—الوقاية خير من الندم.",
        wrong1Ar: "الجهاز خطر.",
        wrong2Ar: "البس كفوف لو تنزف.",
        wrong3Ar: "دير بالك من الحافات.",
        situationRu: "Инструктаж нового сотрудника по технике безопасности у станка",
        theyAskRu: "Мне нужно знать что-то еще перед началом работы на станке?",
        correctRu: "Да, берегитесь острых краев. Обязательно наденьте перчатки — лучше перестраховаться, чем потом жалеть.",
        wrong1Ru: "Станок опасный.",
        wrong2Ru: "Надень перчатки, иначе будет кровь.",
        wrong3Ru: "Следи за краями.",
        explanationRu: "Пословица «Better safe than sorry» — лучший способ подчеркнуть важность мер безопасности без лишнего устрашения."
      },
    ],
  },

  // Lesson 8: Current Events
  {
    topic: "Current Events", topicKu: "ڕووداوەکان ڕۆژ و هەواڵ", topicAr: "الأحداث الجارية", topicRu: "Обсуждение новостей",
    words: [
      { english: "Did you hear about", kurdish: "ئایا بیستت دەربارەی...؟", arabic: "هل سمعت عن...", russian: "Ты слышал о...?" },
      { english: "It's all over the news", kurdish: "لە هەموو هەواڵەکاندا بڵاوبووەتەوە", arabic: "إنه في كل الأخبار", russian: "Об этом трубят во всех новостях" },
      { english: "According to reports", kurdish: "بەپێی ڕاپۆرتەکان", arabic: "وفقًا للتقارير", russian: "Согласно сообщениям СМИ / отчетам" },
      { english: "It's a controversial topic", kurdish: "بابەتێکی مشتومڕ لەسەرە", arabic: "إنه موضوع مثير للجدل", russian: "Это весьма спорная тема" },
      { english: "Keep up with the news", kurdish: "ئاگاداربوون لە دواین هەواڵەکان", arabic: "متابعة الأخبار", russian: "Следить за новостями" },
    ],
    voices: [
      { prompt: "کردنەوەی باسی هەواڵێک", target: "Did you hear about the election? It's all over the news.", targetKurdish: "ئایا گوێت لە هەواڵی هەڵبژاردنەکە بوو؟ لە هەموو هەواڵەکاندا بڵاوبووەتەوە.", promptAr: "فتح موضوع خبر", targetArabic: "سمعت بالانتخابات؟ متروسة بيها الاخبار.", promptRu: "Спроси про громкую новость о выборах", targetRussian: "Ты слышал о выборах? Об этом сейчас говорят во всех новостях." },
      { prompt: "گواستنەوەی زانیاری", target: "According to reports, the economy is improving.", targetKurdish: "بەپێی ڕاپۆرتەکان، ئابووری ڕوو لە باشبوونە.", promptAr: "نقل المعلومات", targetArabic: "حسب التقارير، الاقتصاد ديتحسن.", promptRu: "Сошлись на данные о состоянии экономики", targetRussian: "Судя по отчетам, состояние экономики улучшается." },
    ],
    sentences: [
      { english: ["I","try","to","keep","up","with","the","local","news"], kurdish: "هەوڵدەدەم ئاگاداری دواین هەواڵە ناوخۆییەکان بم", arabic: "احاول اتابع الاخبار المحلية.", russian: "Я стараюсь быть в курсе местных новостей" },
      { english: ["That","is","a","very","controversial","topic","lately"], kurdish: "لەم دواییانەدا ئەوە بابەتێکی پڕ مشتومڕ بووە", arabic: "هالموضوع كلش مثير للجدل مؤخراً.", russian: "В последнее время это крайне спорная тема для дискуссий" },
    ],
    fillBlanks: [
      { parts: ["It's hard to keep","with all the tech news."], hint: "قورسە ئاگاداری (بەدواداچوون بۆ) هەموو هەواڵەکانی تەکنەلۆژیا بکەیت.", answer: "up", wrongs: ["on","in","down"], arabicHint: "صعب تتابع كل اخبار التكنولوجيا.", arabicParts: ["صعب","كل اخبار التكنولوجيا."], arabicAnswer: "تتابع", arabicWrongs: ["تشغل","تدخل","تنزل"], russianHint: "Трудно уследить за всеми новостями в мире технологий.", russianParts: ["Трудно","за всеми новостями в мире технологий."], russianAnswer: "уследить", russianWrongs: ["узнать","увидеть","понять"] },
      { parts: ["According","recent reports, housing prices dropped."], hint: "بەپێی ڕاپۆرتەکانی ئەم دواییە، نرخی خانوو دابەزیوە.", answer: "to", wrongs: ["by","with","from"], arabicHint: "حسب التقارير الاخيرة، نزلت اسعار البيوت.", arabicParts: ["","التقارير الاخيرة، نزلت اسعار البيوت."], arabicAnswer: "حسب", arabicWrongs: ["بواسطة","وية","من"], russianHint: "Согласно последним отчетам, цены на жилье упали.", russianParts: ["Согласно последним",", цены на жилье упали."], russianAnswer: "отчетам", russianWrongs: ["словам","делам","мыслям"] },
    ],
    conversations: [
      {
        situation: "قسەکردن لەگەڵ هاوکارێک سەبارەت بە ڕووداوێکی نوێ",
        theyAsk: "I haven't checked my phone all day. Has anything happened?",
        correct: "Did you hear about the big merger? It's all over the news! According to reports, it's going to change the whole industry.",
        wrong1: "Yes, big company buy another.",
        wrong2: "News say merger is happen.",
        wrong3: "I saw on TV about company.",
        explanation: "'It's all over the news' و 'According to reports' دەستەواژەی زۆر باون بۆ باسکردنی ڕووداوە گەرمەکانی ڕۆژ",
        situationAr: "التحدث مع زميل حول حدث جديد",
        explanationAr: "'إنه في كل الأخبار' (It's all over the news) و 'وفقًا للتقارير' (According to reports) تعبيرات شائعة جدًا لمناقشة الأحداث الجارية.",
        theyAskAr: "ما شفت موبايلي طول اليوم. صاير شي؟",
        correctAr: "سمعت بخبر الاندماج الچبير؟ بكل الأخبار طالع! حسب التقارير، راح يغير المجال كله.",
        wrong1Ar: "إي، شركة چبيرة اشترت وحدة ثانية.",
        wrong2Ar: "الأخبار تگول صاير اندماج.",
        wrong3Ar: "شفت بالتلفزيون عن الشركة.",
        situationRu: "Коллега не читал новости весь день и интересуется событиями",
        theyAskRu: "Я весь день не заглядывал в телефон. Что-нибудь произошло?",
        correctRu: "Ты слышал о крупном слиянии компаний? Об этом сейчас трубят во всех новостях! По сообщениям прессы, это изменит весь рынок.",
        wrong1Ru: "Да, большая компания покупает другую.",
        wrong2Ru: "Новости говорят слияние происходит.",
        wrong3Ru: "Я видел по телевизору про компанию.",
        explanationRu: "«It's all over the news» и «According to reports» — стандартные фразы носителей языка для живого обсуждения актуальных событий."
      },
    ],
  },

  // Lesson 9: Summarizing
  {
    topic: "Summarizing", topicKu: "پوختەکردنەوە و کۆتاییهێنان", topicAr: "التلخيص والختام", topicRu: "Подведение итогов",
    words: [
      { english: "Long story short", kurdish: "بۆ ئەوەی درێژەی پێ نەدەم (بە کورتی)", arabic: "باختصار / الزبدة", russian: "Короче говоря / в двух словах" },
      { english: "In a nutshell", kurdish: "بە کورتی و پوختی (لە توێکڵی گوێزێکدا)", arabic: "باختصار شديد", russian: "Если вкратце..." },
      { english: "To wrap things up", kurdish: "بۆ کۆتاییهێنان بە بابەتەکە", arabic: "لإنهاء الأمور / للختام", russian: "Подводя черту / завершая" },
      { english: "The bottom line is", kurdish: "خاڵە سەرەکییەکە ئەوەیە کە / کورتەی کەلام", arabic: "الخلاصة هي أن", russian: "Суть сводится к тому, что..." },
      { english: "At the end of the day", kurdish: "لەکۆتاییدا (دەرەنجامی کۆتایی شتەکە)", arabic: "في نهاية المطاف", russian: "В конечном счете..." },
    ],
    voices: [
      { prompt: "پوختەکردنەوەی چیرۆکێک", target: "Long story short, we missed the flight and had to stay another night.", targetKurdish: "بۆ ئەوەی درێژەی پێ نەدەم، گەشتەکەمان لەدەستدا و ناچار بووین شەوێکی تر بمێنینەوە.", promptAr: "تلخيص قصة", targetArabic: "باختصار، فاتتنا الرحلة واضطررنا للبقاء ليلة أخرى.", promptRu: "Кратко перескажи дорожное происшествие", targetRussian: "Короче говоря, мы опоздали на рейс и нам пришлось остаться еще на ночь." },
      { prompt: "کۆتاییهێنان بە کۆبوونەوەیەک", target: "To wrap things up, the bottom line is we need more sales.", targetKurdish: "بۆ کۆتاییهێنان، کورتەی کەلام ئەوەیە کە پێویستمان بە فرۆشی زیاترە.", promptAr: "إنهاء اجتماع", targetArabic: "لإنهاء الأمور، الخلاصة هي أننا بحاجة إلى المزيد من المبيعات.", promptRu: "Сформулируй главный вывод презентации", targetRussian: "Подводя итог, суть в том, что нам нужно увеличивать продажи." },
    ],
    sentences: [
      { english: ["In","a","nutshell","the","movie","was","terrible"], kurdish: "بە کورتی و پوختی، فیلمەکە زۆر خراپ بوو", arabic: "باختصار شديد، الفيلم چان كلش سيء.", russian: "Если в двух словах, фильм оказался ужасным" },
      { english: ["At","the","end","of","the","day","family","is","most","important"], kurdish: "لەکۆتاییدا (لە دەرەنجامدا)، خێزان لە هەموو شتێک گرنگترە", arabic: "بالنهاية، العائلة هي الاهم.", russian: "В конечном счете семья — это самое главное" },
    ],
    fillBlanks: [
      { parts: ["In a",", the new software is faster but harder to use."], hint: "بە کورتی و پوختی، سۆفتوێرە نوێیەکە خێراترە بەڵام بەکارهێنانی قورسترە.", answer: "nutshell", wrongs: ["box","word","second"], arabicHint: "باختصار، البرنامج الجديد اسرع بس استخدامه اصعب.", arabicParts: ["","، البرنامج الجديد اسرع بس استخدامه اصعب."], arabicAnswer: "باختصار", arabicWrongs: ["صندوق","كلمة","ثانية"], russianHint: "В двух словах: новая программа быстрее, но сложнее в использовании.", russianParts: ["В двух",": новая программа быстрее, но сложнее в использовании."], russianAnswer: "словах", russianWrongs: ["делах","фразах","днях"] },
      { parts: ["Let's","things up so we can all go home."], hint: "با کۆتایی بە بابەتەکان بهێنین بۆ ئەوەی هەموومان بڕۆینەوە ماڵەوە.", answer: "wrap", wrongs: ["close","finish","end"], arabicHint: "خل نختم السالفة حتى نگدر كلنا نرجع للبيت.", arabicParts: ["خل","السالفة حتى نگدر كلنا نرجع للبيت."], arabicAnswer: "نختم", arabicWrongs: ["نسد","ننهي","نلغي"], russianHint: "Давайте подведем итоги, чтобы мы могли разойтись по домам.", russianParts: ["Давайте","итоги, чтобы мы могли разойтись по домам."], russianAnswer: "подведем", russianWrongs: ["закончим","узнаем","посмотрим"] },
    ],
    conversations: [
      {
        situation: "هاوڕێیەکەت پرسیاری فیلمێکی درێژت لێ دەکات",
        theyAsk: "I missed the 3-hour documentary. Can you tell me what happened?",
        correct: "Well, to put it in a nutshell, the planet is warming up fast. The bottom line is we need to act now.",
        wrong1: "It was about earth getting hot.",
        wrong2: "Short story: earth is hot.",
        wrong3: "I tell you short: it's warming.",
        explanation: "'In a nutshell' و 'The bottom line is' زۆر بەکاردێن بۆ پوختەکردنەوەی زانیاری زۆر بە چەند وشەیەکی کەم",
        situationAr: "صديقك يسألك عن فيلم وثائقي طويل",
        explanationAr: "'باختصار شديد' (In a nutshell) و 'الخلاصة هي أن' (The bottom line is) يستخدمان كثيرًا لتلخيص الكثير من المعلومات في بضع كلمات.",
        theyAskAr: "فاتني الفيلم الوثائقي أبو الـ 3 ساعات. تگدر تگلي شنو صار بيه؟",
        correctAr: "يعني باختصار شديد، الكوكب ديحمى بسرعة. وخلاصة الحچي لازم نتحرك هسة.",
        wrong1Ar: "چان عن الأرض وهي تحتر.",
        wrong2Ar: "قصة قصيرة: الأرض حارة.",
        wrong3Ar: "أگلك باختصار: ديصير دافي.",
        situationRu: "Друг пропустил трехчасовой документальный фильм и просит краткий пересказ",
        theyAskRu: "Я пропустил трехчасовой фильм. Можешь рассказать в двух словах, о чем там?",
        correctRu: "Если вкратце, планета нагревается тревожными темпами. Главный вывод — действовать нужно прямо сейчас.",
        wrong1Ru: "Там было про то, как Земле жарко.",
        wrong2Ru: "Короткая история: Земля горячая.",
        wrong3Ru: "Я говорю тебе коротко: теплеет.",
        explanationRu: "«In a nutshell» (в двух словах) и «The bottom line is» (главный вывод в том, что...) — лучшие обороты для емкого резюмирования длинных историй."
      },
    ],
  },

];

export default normalUnit03;
