import { UnitBank } from "../types";

// ── Unit 10: Logic, Plans, & Hypotheticals — 10 lessons ──────────────────────────
// Practical B2 vocabulary and sentence structures for planning, hypothetical logic, time clauses, and predictions.

const normalUnit10: UnitBank = [
  // Lesson 0: Making Plans
  {
    topic: "Making Plans", topicKu: "پلاندانان", topicAr: "صنع الخطط",
    words: [
      { english: "Confirm the schedule", kurdish: "دڵنیابوونەوە لە خشتەی کارەکە", arabic: "تأكيد الجدول الزمني" },
      { english: "Arrange a meeting", kurdish: "ڕێکخستنی کۆبوونەوەیەک", arabic: "ترتيب اجتماع" },
      { english: "Postpone the event", kurdish: "دواخستنی چالاکییەکە", arabic: "تأجيل الفعالية" },
      { english: "Tentative agenda", kurdish: "کارنامەی کاتی (ئەجێندای ناھەمیشەیی)", arabic: "جدول أعمال مؤقت" },
      { english: "Set a deadline", kurdish: "دیاریکردنی مۆڵەت (دوا وادە)", arabic: "تحديد موعد نهائي" },
      { english: "Coordinate the details", kurdish: "هەماهەنگی کردنی وردەکارییەکان", arabic: "تنسيق التفاصيل" },
      { english: "Back-up plan", kurdish: "پلانی جێگرەوە (یەدەگ)", arabic: "خطة بديلة" },
      { english: "Calendar invites", kurdish: "بانگهێشتی ڕۆژژمێر", arabic: "دعوات التقويم" },
    ],
    voices: [
      { prompt: "بڵێ دەبێت خشتەکە پشتڕاست بکەینەوە", target: "We need to confirm the schedule before we arrange the meeting.", targetKurdish: "پێویستە خشتەکە پشتڕاست بکەینەوە پێش ئەوەی کۆبوونەوەکە ڕێکبخەین.", promptAr: "قل يجب تأكيد الجدول قبل ترتيب الاجتماع", targetArabic: "نحن بحاجة لتأكيد الجدول الزمني قبل ترتيب الاجتماع." },
      { prompt: "پێشنیازی دواخستنی کارەکە بکە", target: "Could we postpone the meeting to next Thursday?", targetKurdish: "دەکرێت کۆبوونەوەکە بۆ پێنجشەممەی داهاتوو دوا بخەین؟", promptAr: "اقترح تأجيل الاجتماع", targetArabic: "هل يمكننا تأجيل الاجتماع إلى يوم الخميس القادم؟" },
      { prompt: "پرسیار بکە دەربارەی دوا وادە", target: "Have they set a deadline for this project yet?", targetKurdish: "ئایا هێشتا مۆڵەتی کۆتاییان بۆ ئەم پڕۆژەیە دیاری کردووە؟", promptAr: "اسأل عن الموعد النهائي", targetArabic: "هل حددوا موعداً نهائياً لهذا المشروع بعد؟" },
    ],
    sentences: [
      { english: ["We", "should", "always", "have", "a", "back-up", "plan", "in", "mind"], kurdish: "دەبێت هەمیشە پلانێکی جێگرەوەمان لە مێشکدا هەبێت", arabic: "ينبغي أن يكون لدينا دائماً خطة بديلة في ذهننا" },
      { english: ["I", "will", "send", "the", "calendar", "invites", "to", "everyone", "soon"], kurdish: "بەم زووانە بانگهێشتی ڕۆژژمێر بۆ هەمووان دەنێرم", arabic: "سأرسل دعوات التقويم للجميع قريباً" },
      { english: ["The", "tentative", "agenda", "is", "subject", "to", "change", "later"], kurdish: "کارنامە کاتییەکە لەوانەیە دواتر بگۆڕێت", arabic: "جدول الأعمال المؤقت عرضة للتغيير لاحقاً" },
      { english: ["Let's", "coordinate", "the", "details", "tomorrow", "morning"], kurdish: "با بەیانی زوو هەماهەنگی وردەکارییەکان بکەین", arabic: "فلننسق التفاصيل صباح الغد" },
    ],
    fillBlanks: [
      { parts: ["We must", "the schedule by sending emails today."], hint: "پێویستە خشتەی کارەکە پشتڕاست بکەینەوە بە ناردنی ئیمەیڵ لە ئەمڕۆدا.", answer: "confirm", wrongs: ["postpone", "coordinate", "arrange"], arabicHint: "يجب تأكيد الجدول الزمني عن طريق إرسال رسائل بريد إلكتروني اليوم.", arabicParts: ["يجب علينا", "الجدول الزمني بإرسال رسائل بريد اليوم."], arabicAnswer: "تأكيد", arabicWrongs: ["تأجيل", "تنسيق", "ترتيب"] },
      { parts: ["If the main plan fails, we will use our", "."], hint: "ئەگەر پلانی سەرەکی شکستی هێنا، پلانی جێگرەوەکەمان بەکاردەهێنین.", answer: "back-up plan", wrongs: ["deadline", "calendar", "agenda"], arabicHint: "إذا فشلت الخطة الرئيسية، سنستخدم خطتنا البديلة.", arabicParts: ["إذا فشلت الخطة الرئيسية، سنستخدم", "."], arabicAnswer: "خطتنا البديلة", arabicWrongs: ["الموعد النهائي", "التقويم", "جدول الأعمال"] },
      { parts: ["She wants to", "a meeting with the marketing team."], hint: "ئەو دەیەوێت کۆبوونەوەیەک لەگەڵ تیمی مارکێتینگ ڕێکبخات.", answer: "arrange", wrongs: ["postpone", "confirm", "deadline"], arabicHint: "تريد ترتيب اجتماع مع فريق التسويق.", arabicParts: ["تريد", "اجتماع مع فريق التسويق."], arabicAnswer: "ترتيب", arabicWrongs: ["تأجيل", "تأكيد", "موعد نهائي"] },
    ],
    conversations: [
      {
        situation: "دواخستنی چالاکییەک بەهۆی بارانەوە",
        theyAsk: "The weather forecast says it will rain tomorrow. What should we do?",
        correct: "We should postpone the event until next week, and let's coordinate the details now.",
        wrong1: "Please set a deadline.",
        wrong2: "I will confirm the schedule immediately.",
        wrong3: "Send calendar invites to everyone.",
        explanation: "دواخستنی چالاکییەک بەهۆی خراپی کەشوهەوا بە 'postpone' دەربڕینێکی زۆر دروستە.",
        situationAr: "تأجيل فعالية بسبب المطر",
        theyAskAr: "توقعات الطقس تشير إلى هطول الأمطار غداً. ماذا يجب أن نفعل؟",
        correctAr: "يجب أن نؤجل الفعالية حتى الأسبوع القادم، ودعنا ننسق التفاصيل الآن.",
        wrong1Ar: "يرجى تحديد موعد نهائي.",
        wrong2Ar: "سأقوم بتأكيد الجدول الزمني فوراً.",
        wrong3Ar: "أرسل دعوات التقويم للجميع.",
        explanationAr: "تأجيل فعالية بسبب سوء الطقس يعبر عنه بشكل صحيح بـ 'postpone'."
      },
      {
        situation: "ڕێکخستنی کۆبوونەوەی خێرا",
        theyAsk: "We have some urgent issues to discuss.",
        correct: "I will arrange a meeting for this afternoon and send the calendar invites.",
        wrong1: "Let's postpone the back-up plan.",
        wrong2: "The deadline is set for yesterday.",
        wrong3: "I have a tentative agenda for shopping.",
        explanation: "'Arrange a meeting' و ناردنی 'calendar invites' وەڵامێکی باوی شوێنی کارە.",
        situationAr: "ترتيب اجتماع عاجل",
        theyAskAr: "لدينا بعض القضايا العاجلة لمناقشتها.",
        correctAr: "سأقوم بترتيب اجتماع لظهر اليوم وإرسال دعوات التقويم.",
        wrong1Ar: "فلنؤجل الخطة البديلة.",
        wrong2Ar: "تم تحديد الموعد النهائي ليوم أمس.",
        wrong3Ar: "لدي جدول أعمال مؤقت للتسوق.",
        explanationAr: "ترتيب اجتماع وإرسال دعوات التقويم هو الرد الاحترافي المناسب Urgently."
      }
    ]
  },

  // Lesson 1: Hypotheticals (Second & Third Conditionals)
  {
    topic: "Hypotheticals", topicKu: "گریمانەکان", topicAr: "الافتراضات",
    words: [
      { english: "If I were in your position", kurdish: "ئەگەر لە شوێنی تۆ بوومایە", arabic: "لو كنت في مكانك" },
      { english: "Would have acted differently", kurdish: "بە شێوازێکی تر ڕەفتارم دەکرد", arabic: "لكنت تصرفت بشكل مختلف" },
      { english: "Imagine the possibilities", kurdish: "تصورکردنی ئەگەرەکان", arabic: "تخيل الاحتمالات" },
      { english: "On the condition that", kurdish: "بەو مەرجەی کە...", arabic: "بشرط أن" },
      { english: "Supposing it is true", kurdish: "بە فرضکردنی ئەوەی ڕاست بێت", arabic: "على افتراض أنه صحيح" },
      { english: "Under these circumstances", kurdish: "لەژێر ئەم بارودۆخانەدا", arabic: "في هذه الظروف" },
      { english: "Had I known about it", kurdish: "ئەگەر پێشتر بمزانیبایە", arabic: "لو كنت أعرف عن ذلك" },
      { english: "What would happen if", kurdish: "چی ڕوودەدا ئەگەر...", arabic: "ماذا سيحدث لو" },
    ],
    voices: [
      { prompt: "ئامۆژگاری هاوڕێیەک بکە بە شێوەی گریمانەیی", target: "If I were in your position, I would talk to him.", targetKurdish: "ئەگەر لە شوێنی تۆ بوومایە، قسەم لەگەڵ دەکرد.", promptAr: "انصح صديقاً بافتراض لو كنت مكانه", targetArabic: "لو كنت في مكانك، لتحدثت معه." },
      { prompt: "بڵێ ئەگەر بزانیتایە دەهاتیت", target: "Had I known about the party, I would have come.", targetKurdish: "ئەگەر بە ئاهەنگەکەم بزانیبایە، دەهاتم.", promptAr: "قل لو علمت بالحدث لأتيت", targetArabic: "لو كنت أعلم بالحدث، لكنت قد أتيت." },
      { prompt: "بپرس چی ڕوودەدات ئەگەر دواکەون", target: "What would happen if we missed the deadline?", targetKurdish: "چی ڕوودەدا ئەگەر مۆڵەتەکەمان لەدەست بدایە؟", promptAr: "اسأل ماذا سيحدث لو تأخرنا", targetArabic: "ماذا سيحدث لو فوتنا الموعد النهائي؟" },
    ],
    sentences: [
      { english: ["Under", "these", "circumstances", "we", "cannot", "make", "a", "decision"], kurdish: "لەژێر ئەم بارودۆخانەدا ناتوانین بڕیار بدەین", arabic: "في هذه الظروف لا يمكننا اتخاذ قرار" },
      { english: ["I", "would", "agree", "on", "the", "condition", "that", "you", "help", "me"], kurdish: "من ڕازی دەبم بەو مەرجەی کە یارمەتیم بدەیت", arabic: "سأوافق بشرط أن تساعدني" },
      { english: ["Supposing", "we", "fail", "what", "is", "our", "next", "step"], kurdish: "بە فرضکردنی ئەوەی شکست بهێنین، هەنگاوی داهاتوومان چییە؟", arabic: "على افتراض أننا فشلنا، فما هي خطوتنا التالية؟" },
      { english: ["Imagine", "the", "possibilities", "if", "we", "won", "this", "contract"], kurdish: "ئەگەرەکان تصور بکە ئەگەر ئەم گرێبەستە ببەینەوە", arabic: "تخيل الاحتمالات لو فزنا بهذا العقد" },
    ],
    fillBlanks: [
      { parts: ["If I", "you, I would accept the job offer."], hint: "ئەگەر من تۆ بوومایە، پێشنیاری کارەکەم قبووڵ دەکرد.", answer: "were", wrongs: ["am", "was", "be"], arabicHint: "لو كنت مكانك، لقبلت عرض العمل.", arabicParts: ["لو كنت", "، لقبلت عرض العمل."], arabicAnswer: "مكانك", arabicWrongs: ["أنا", "كان", "يكون"] },
      { parts: ["We will join", "the condition that it is free."], hint: "ئێمە بەژدار دەبین بەو مەرجەی کە بێ بەرامبەر بێت.", answer: "on", wrongs: ["at", "in", "with"], arabicHint: "سننضم بشرط أن يكون مجانياً.", arabicParts: ["سننضم", "شرط أن يكون مجانياً."], arabicAnswer: "بـ", arabicWrongs: ["في", "إلى", "على"] },
      { parts: ["Had I", "the truth, I wouldn't have lied."], hint: "ئەگەر بە ڕاستییەکەم بزانیبایە، درۆم نەدەکرد.", answer: "known", wrongs: ["know", "knew", "knowing"], arabicHint: "لو كنت عرفت الحقيقة، لما كذبت.", arabicParts: ["لو كنت", "الحقيقة، لما كذبت."], arabicAnswer: "عرفت", arabicWrongs: ["أعرف", "عرف", "معرفة"] },
    ],
    conversations: [
      {
        situation: "گفتوگۆ دەربارەی گۆڕینی کار",
        theyAsk: "Should I resign from my current job?",
        correct: "If I were in your position, I wouldn't leave under these circumstances.",
        wrong1: "On the condition that you buy me lunch.",
        wrong2: "Imagine the possibilities of rain.",
        wrong3: "I would have acted differently tomorrow.",
        explanation: "بەکارهێنانی 'If I were in your position' جوانترین دەربڕینە بۆ ئامۆژگاری گۆڕینی کار.",
        situationAr: "نقاش حول تغيير العمل",
        theyAskAr: "هل يجب أن أستقيل من عملي الحالي؟",
        correctAr: "لو كنت في مكانك، لما تركت العمل في هذه الظروف.",
        wrong1Ar: "بشرط أن تشتري لي الغداء.",
        wrong2Ar: "تخيل احتمالات المطر.",
        wrong3Ar: "لكنت قد تصرفت بشكل مختلف غداً.",
        explanationAr: "استخدام 'لو كنت في مكانك' هو الأنسب لتقديم المشورة بشأن الاستقالة."
      },
      {
        situation: "پرسیار دەربارەی ئەنجامی پێشوو",
        theyAsk: "Why did you make that choice yesterday?",
        correct: "Had I known about the issues, I would have acted differently.",
        wrong1: "Supposing it is true next week.",
        wrong2: "Under these circumstances, I am fine.",
        wrong3: "What would happen if we play?",
        explanation: "لە کاتی وەڵامدانەوەی ڕووداوێکی ڕابردوو، بەکارھێنانی مەرجی سێیەم (Had I known... I would have acted...) دروستە.",
        situationAr: "السؤال عن قرار اتخذ بالأمس",
        theyAskAr: "لماذا اتخذت هذا القرار بالأمس؟",
        correctAr: "لو كنت أعلم بالمشاكل، لكنت قد تصرفت بشكل مختلف.",
        wrong1Ar: "على افتراض أنه صحيح الأسبوع القادم.",
        wrong2Ar: "في هذه الظروف، أنا بخير.",
        wrong3Ar: "ماذا سيحدث لو لعبنا؟",
        explanationAr: "عند الحديث عن قرار خاطئ اتخذ بالماضي، نستخدم الصيغة الشرطية الثالثة (Had I known... I would have...)."
      }
    ]
  },

  // Lesson 2: Cause & Effect
  {
    topic: "Cause & Effect", topicKu: "هۆکار و دەرئەنجام", topicAr: "السبب والنتيجة",
    words: [
      { english: "Therefore we decided", kurdish: "لەبەر ئەوە بڕیارماندا", arabic: "لذلك قررنا" },
      { english: "Due to heavy rain", kurdish: "بەهۆی بارانی بەخوڕ", arabic: "بسبب المطر الغزير" },
      { english: "Leads to a conflict", kurdish: "دەبێتە هۆی ناکۆکیەک", arabic: "يؤدي إلى صراع" },
      { english: "As a direct result", kurdish: "وەک ئەنجامێکی ڕاستەوخۆ", arabic: "كنتيجة مباشرة" },
      { english: "Consequently", kurdish: "لە ئەنجامدا (بەم شێوەیە)", arabic: "وبالتالي (نتيجة لذلك)" },
      { english: "This explains why", kurdish: "ئەمە ڕوونی دەکاتەوە بۆچی", arabic: "هذا يفسر لماذا" },
      { english: "Give rise to concerns", kurdish: "سەرهەڵدانی نیگەرانییەکان", arabic: "يثير المخاوف" },
      { english: "Owing to circumstances", kurdish: "بەهۆی بارودۆخەکانەوە", arabic: "نظراً للظروف" },
    ],
    voices: [
      { prompt: "بڵێ بەهۆی باران گەشتەکە هەڵوەشایەوە", target: "Due to heavy rain, the flight was canceled.", targetKurdish: "بەهۆی بارانی بەخوڕ، گەشتەکە هەڵوەشایەوە.", promptAr: "قل بسبب المطر ألغيت الرحلة", targetArabic: "بسبب المطر الغزير، تم إلغاء الرحلة الجوية." },
      { prompt: "بڵێ ئەم ڕەفتارە دەبێتە هۆی کێشە", target: "This decision might lead to a serious conflict.", targetKurdish: "ئەم بڕیارە لەوانەیە ببێتە هۆی ناکۆکییەکی جدی.", promptAr: "قل هذا القرار يؤدي إلى مشكلة", targetArabic: "هذا القرار قد يؤدي إلى صراع خطير." },
      { prompt: "دەربڕینی دەرئەنجام", target: "He missed the bus; consequently, he was late.", targetKurdish: "پاسەکەی لەدەست چوو، لە ئەنجامدا، دواکەوت.", promptAr: "عبر عن النتيجة", targetArabic: "لقد فاتته الحافلة، وبالتالي تأخر." },
    ],
    sentences: [
      { english: ["Consequently", "we", "had", "to", "cancel", "the", "entire", "project"], kurdish: "لە ئەنجامدا، ناچار بووین تەواوی پڕۆژەکە هەڵبوەشێنینەوە", arabic: "وبالتالي، اضطررنا لإلغاء المشروع بأكمله" },
      { english: ["Owing", "to", "bad", "weather", "they", "postponed", "the", "match"], kurdish: "بەهۆی کەشوهەوای خراپەوە، یارییەکەیان دواخست", arabic: "نظراً لسوء الأحوال الجوية، قاموا بتأجيل المباراة" },
      { english: ["This", "explains", "why", "the", "system", "crashed", "yesterday"], kurdish: "ئەمە ڕوونی دەکاتەوە بۆچی سیستمەکە دوێنێ تێکچوو", arabic: "هذا يفسر لماذا تعطل النظام بالأمس" },
      { english: ["Poor", "communication", "leads", "to", "many", "misunderstandings"], kurdish: "پەیوەندی لاواز دەبێتە هۆی تێنەگەیشتنی زۆر", arabic: "التواصل الضعيف يؤدي إلى سوء تفاهم كبير" },
    ],
    fillBlanks: [
      { parts: ["The company lost money; ", ", they laid off workers."], hint: "کۆمپانیاکە زیانی پێ گەیشت؛ لە ئەنجامدا، کرێکارەکانیان دەرکرد.", answer: "consequently", wrongs: ["because", "since", "supposing"], arabicHint: "خسرت الشركة المال؛ وبالتالي، قامت بتسريح العمال.", arabicParts: ["خسرت الشركة المال؛", "، قامت بتسريح العمال."], arabicAnswer: "وبالتالي", arabicWrongs: ["لأن", "منذ", "على افتراض"] },
      { parts: ["The delay was", "technical issues in the server."], hint: "دواکەوتنەکە بەهۆی کێشەی تەکنیکی بوو لە سێرڤەرەکەدا.", answer: "due to", wrongs: ["therefore", "leads to", "consequently"], arabicHint: "التأخير كان بسبب مشاكل فنية في الخادم.", arabicParts: ["التأخير كان", "مشاكل فنية في الخادم."], arabicAnswer: "بسبب", arabicWrongs: ["لذلك", "يؤدي إلى", "وبالتالي"] },
      { parts: ["Lack of sleep", "health problems over time."], hint: "کەمخەوی دەبێتە هۆی کێشەی تەندروستی بە تێپەڕبوونی کات.", answer: "leads to", wrongs: ["due to", "owing to", "therefore"], arabicHint: "قلة النوم تؤدي إلى مشاكل صحية بمرور الوقت.", arabicParts: ["قلة النوم", "مشاكل صحية بمرور الوقت."], arabicAnswer: "تؤدي إلى", arabicWrongs: ["بسبب", "نظراً لـ", "لذلك"] },
    ],
    conversations: [
      {
        situation: "ڕوونکردنەوەی دواکەوتنی پڕۆژە",
        theyAsk: "Why didn't we submit the report on time?",
        correct: "Owing to database issues, the files were lost. Consequently, we were delayed.",
        wrong1: "Therefore we decided to play football.",
        wrong2: "This leads to a table for two.",
        wrong3: "Due to heavy rain, I am going to buy bananas.",
        explanation: "'Owing to... Consequently...' دەستەواژەی زۆر فەرمی و گونجاون بۆ شیکردنەوەی هۆکار و ئەنجام لە کاردا.",
        situationAr: "توضيح تأخر تسليم التقرير",
        theyAskAr: "لماذا لم نسلم التقرير في الوقت المحدد؟",
        correctAr: "نظراً لمشاكل في قاعدة البيانات، فُقدت الملفات. وبالتالي، تأخرنا.",
        wrong1Ar: "لذلك قررنا لعب كرة القدم.",
        wrong2Ar: "هذا يؤدي إلى طاولة لشخصين.",
        wrong3Ar: "بسبب المطر الغزير، سأذهب لشراء الموز.",
        explanationAr: "استخدام 'Owing to... Consequently...' تعبير رسمي لتفسير الأسباب والنتائج في العمل."
      },
      {
        situation: "شیکردنەوەی تێکچوونی پەیوەندییەکان",
        theyAsk: "Why are they arguing so much?",
        correct: "A lack of trust leads to misunderstandings, and this explains why.",
        wrong1: "Due to heavy rain we laughed a lot.",
        wrong2: "Consequently we preheated the oven.",
        wrong3: "Therefore they are ripe tomatoes.",
        explanation: "پرسیارەکە دەربارەی هۆکارە، وەڵامەکە بە 'leads to... explains why' گرێ دەداتەوە.",
        situationAr: "تحليل خلاف بين شخصين",
        theyAskAr: "لماذا يتجادلون كثيراً؟",
        correctAr: "عدم الثقة يؤدي إلى سوء التفاهم، وهذا يفسر السبب.",
        wrong1Ar: "بسبب المطر الغزير ضحكنا كثيراً.",
        wrong2Ar: "وبالتالي قمنا بتسخين الفرن مسبقاً.",
        wrong3Ar: "لذلك هي طماطم ناضجة.",
        explanationAr: "السؤال عن السبب، والجواب يربط الخلاف بـ 'leads to... explains why'."
      }
    ]
  },

  // Lesson 3: Giving Alternatives
  {
    topic: "Giving Alternatives", topicKu: "پێدانی بژاردەی تر (جێگرەوە)", topicAr: "تقديم البدائل",
    words: [
      { english: "Otherwise we will fail", kurdish: "ئەگەر نا (یاخود) شکست دەهێنین", arabic: "وإلا سنفشل" },
      { english: "Instead of complaining", kurdish: "لەبری گله‌یی کردن", arabic: "بدلاً من الشكوى" },
      { english: "Alternatively", kurdish: "وەک بژاردەیەکی تر (جێگرەوە)", arabic: "كخيار بديل (أو بدلاً من ذلك)" },
      { english: "Explore other options", kurdish: "گەڕان بەدوای بژاردەکانی تردا", arabic: "استكشاف خيارات أخرى" },
      { english: "On the other hand", kurdish: "لە لایەکی ترەوە", arabic: "من ناحية أخرى" },
      { english: "Preference for this", kurdish: "پەسەندکردنی ئەمە", arabic: "تفضيل هذا" },
      { english: "Take it or leave it", kurdish: "وەریگرە یان وازی لێ بهێنە", arabic: "خذه أو اتركه" },
      { english: "Rather than waiting", kurdish: "لەبری چاوەڕوانکردن", arabic: "بدلاً من الانتظار" },
    ],
    voices: [
      { prompt: "بڵێ با هەوڵ بدەین لەبری گله‌یی", target: "Instead of complaining, we should find a solution.", targetKurdish: "لەبری گله‌یی کردن، پێویستە چارەسەرێک بدۆزینەوە.", promptAr: "قل يجب إيجاد حل بدلاً من الشكوى", targetArabic: "بدلاً من الشكوى، ينبغي أن نجد حلاً." },
      { prompt: "بژاردەیەکی تر پێشنیاز بکە", target: "Alternatively, we can hire a freelancer for this task.", targetKurdish: "وەک بژاردەیەکی تر، دەتوانین فریلانسەرێک بۆ ئەم کارە دابمەزرێنین.", promptAr: "اقترح خياراً بديلاً", targetArabic: "بدلاً من ذلك، يمكننا توظيف مستقل لهذه المهمة." },
      { prompt: "پەلە بکە ئەگەر نا دوا دەکەوین", target: "We must hurry, otherwise we will miss the train.", targetKurdish: "پێویستە پەلە بکەین، ئەگەر نا شەمەندەفەرەکەمان لەدەست دەچێت.", promptAr: "استعجل وإلا سنتأخر", targetArabic: "يجب أن نسرع، وإلا سنفوت القطار." },
    ],
    sentences: [
      { english: ["We", "should", "explore", "other", "options", "before", "signing", "it"], kurdish: "پێویستە پێش واژووکردنی، بەدوای بژاردەکانی تردا بگەڕێین", arabic: "ينبغي أن نستكشف خيارات أخرى قبل توقيعه" },
      { english: ["I", "would", "prefer", "to", "leave", "now", "rather", "than", "wait", "here"], kurdish: "من پێم باشترە ئێستا بڕۆم لەبری ئەوەی لێرە چاوەڕێ بکەم", arabic: "أفضل المغادرة الآن بدلاً من الانتظار هنا" },
      { english: ["On", "the", "other", "hand", "the", "new", "deal", "is", "cheaper"], kurdish: "لە لایەکی ترەوە، ڕێککەوتنە نوێیەکە هەرزانترە", arabic: "من ناحية أخرى، الصفقة الجديدة أرخص" },
      { english: ["This", "is", "my", "final", "offer", "take", "it", "or", "leave", "it"], kurdish: "ئەمە پێشنیازی کۆتاییمە، وەریگرە یان وازی لێ بهێنە", arabic: "هذا هو عرضي الأخير، خذه أو اتركه" },
    ],
    fillBlanks: [
      { parts: ["We should act now, ", " it will be too late."], hint: "پێویستە ئێستا بجوڵێین، ئەگەر نا زۆر درەنگ دەبێت.", answer: "otherwise", wrongs: ["instead of", "alternatively", "rather than"], arabicHint: "يجب أن نتصرف الآن، وإلا سيكون الوقت قد فات.", arabicParts: ["يجب أن نتصرف الآن،", "سيكون الوقت قد فات."], arabicAnswer: "وإلا", arabicWrongs: ["بدلاً من", "أو بدلاً من ذلك", "فضلاً عن"] },
      { parts: ["Let's walk", "taking a taxi."], hint: "با بە پێ بڕۆین لەبری ئەوەی تاکسی بگرین.", answer: "instead of", wrongs: ["otherwise", "alternatively", "on the other hand"], arabicHint: "لنذهب سيراً على الأقدام بدلاً من ركوب تاكسي.", arabicParts: ["لنذهب سيراً على الأقدام", "ركوب تاكسي."], arabicAnswer: "بدلاً من", arabicWrongs: ["وإلا", "كخيار بديل", "من ناحية أخرى"] },
      { parts: ["I prefer to study", "wasting my time."], hint: "من پێم باشترە بخوێنم لەبری ئەوەی کاتەکەم بەفیڕۆ بدەم.", answer: "rather than", wrongs: ["otherwise", "instead of", "alternatively"], arabicHint: "أفضل الدراسة بدلاً من إضاعة وقتي.", arabicParts: ["أفضل الدراسة", "إضاعة وقتي."], arabicAnswer: "بدلاً من", arabicWrongs: ["وإلا", "عوضاً عن", "كبديل"] },
    ],
    conversations: [
      {
        situation: "دیاریکردنی شێوازی گەشتکردن",
        theyAsk: "Should we book the expensive flight?",
        correct: "Alternatively, we could take the train and explore other options to save money.",
        wrong1: "Otherwise we will fail completely.",
        wrong2: "Take it or leave it immediately.",
        wrong3: "Instead of complaining about the train.",
        explanation: "'Alternatively' وەڵامێکی نایابە بۆ پێشنیازکردنی بژاردەیەکی تری هاوسەنگ.",
        situationAr: "تحديد وسيلة السفر",
        theyAskAr: "هل يجب أن نحجز رحلة الطيران الغالية؟",
        correctAr: "بدلاً من ذلك، يمكننا ركوب القطار واستكشاف خيارات أخرى لتوفير المال.",
        wrong1Ar: "وإلا سنفشل تماماً.",
        wrong2Ar: "خذه أو اتركه فوراً.",
        wrong3Ar: "بدلاً من الشكوى من القطار.",
        explanationAr: "'Alternatively' (بدلاً من ذلك) كلمة ممتازة لاقتراح حل بديل وموفر."
      },
      {
        situation: "پێشکەشکردنی ڕێککەوتنی کۆتایی",
        theyAsk: "Can you lower the price a bit more?",
        correct: "I cannot. This is my final offer, so take it or leave it.",
        wrong1: "Instead of complaining, yes.",
        wrong2: "Otherwise we will succeed.",
        wrong3: "On the other hand, it is salty.",
        explanation: "دەستەواژەی 'take it or leave it' کاتێک بەکاردێت کە هیچ بژاردەیەکی تر بۆ دانوستان نەمابێت.",
        situationAr: "تقديم العرض النهائي للعميل",
        theyAskAr: "هل يمكنك تخفيض السعر قليلاً بعد؟",
        correctAr: "لا يمكنني ذلك. هذا هو عرضي الأخير، فخذه أو اتركه.",
        wrong1Ar: "بدلاً من الشكوى، نعم.",
        wrong2Ar: "وإلا سننجح.",
        wrong3Ar: "من ناحية أخرى، إنه مالح.",
        explanationAr: "تعبير 'take it or leave it' (خذه أو اتركه) يستخدم عندما لا يكون هناك مجال للتفاوض."
      }
    ]
  },

  // Lesson 4: Time Clauses
  {
    topic: "Time Clauses", topicKu: "ڕستە کاتییەکان", topicAr: "الجمل الزمنية",
    words: [
      { english: "As soon as possible", kurdish: "تا بتوانرێت زووتر (لە زووترین کاتدا)", arabic: "في أقرب وقت ممكن" },
      { english: "By the time we arrived", kurdish: "تا ئەو کاتەی گەیشتین", arabic: "بحلول الوقت الذي وصلنا فيه" },
      { english: "Meanwhile", kurdish: "لەو کاتەدا (لە هەمان کاتدا)", arabic: "في هذه الأثناء" },
      { english: "Until further notice", kurdish: "تا ئاگادارکردنەوەی تر", arabic: "حتى إشعار آخر" },
      { english: "While studying", kurdish: "لە کاتی خوێندندا", arabic: "أثناء الدراسة" },
      { english: "Once you complete it", kurdish: "تەنها کە تەواوت کرد", arabic: "بمجرد أن تكمله" },
      { english: "Prior to departure", kurdish: "پێش بەڕێکەوتن", arabic: "قبل المغادرة" },
      { english: "Subsequently", kurdish: "دوای ئەوە (لەپاشاندا)", arabic: "في وقت لاحق (بعد ذلك)" },
    ],
    voices: [
      { prompt: "بڵێ لە زووترین کاتدا دەنێریت", target: "I will call you as soon as possible.", targetKurdish: "لە زووترین کاتدا پەیوەندیت پێوە دەکەم.", promptAr: "قل سأتصل بك في أقرب وقت", targetArabic: "سأتصل بك في أقرب وقت ممكن." },
      { prompt: "بڵێ تا ئەوان گەیشتن کۆبوونەوەکە تەواو بوبو", target: "By the time they arrived, the meeting had ended.", targetKurdish: "تا ئەو کاتەی ئەوان گەیشتن، کۆبوونەوەکە کۆتایی هاتبوو.", promptAr: "قل بحلول وصولهم كان الاجتماع قد انتهى", targetArabic: "بحلول الوقت الذي وصلوا فيه، كان الاجتماع قد انتهى." },
      { prompt: "بڵێ ئۆفیسەکە داخراوە تا ئاگاداری تر", target: "The office is closed until further notice.", targetKurdish: "ئۆفیسەکە داخراوە تا ئاگادارکردنەوەی تر.", promptAr: "قل المكتب مغلق حتى إشعار آخر", targetArabic: "المكتب مغلق حتى إشعار آخر." },
    ],
    sentences: [
      { english: ["Prior", "to", "departure", "we", "must", "double", "check", "our", "bags"], kurdish: "پێش بەڕێکەوتن دەبێت جانتاکانمان بپشکنینەوە", arabic: "قبل المغادرة يجب أن نتحقق من حقائبنا مرتين" },
      { english: ["She", "was", "cooking", "meanwhile", "he", "cleaned", "the", "house"], kurdish: "ئەو خەریکی چێشت لێنان بوو، لە هەمان کاتدا ئەویش خانوەکەی پاکدەکردەوە", arabic: "كانت تطبخ وفي هذه الأثناء كان ينظف المنزل" },
      { english: ["Once", "you", "complete", "the", "test", "you", "can", "leave", "the", "room"], kurdish: "تەنها کە تاقیکردنەوەکەت تەواو کرد، دەتوانیت ژوورەکە جێبهێڵیت", arabic: "بمجرد أن تكمل الاختبار يمكنك مغادرة الغرفة" },
      { english: ["They", "crashed", "and", "subsequently", "the", "game", "was", "delayed"], kurdish: "ئەوان تووشی پێکدادان بوون و لەپاشاندا یارییەکە دواخرا", arabic: "لقد تحطموا وفي وقت لاحق تم تأجيل المباراة" },
    ],
    fillBlanks: [
      { parts: ["Please report to the manager", "you finish the task."], hint: "تکایە ڕاپۆرت بدە بە بەڕێوبەرەکە تەنها کە پڕۆژەکەت تەواو کرد.", answer: "once", wrongs: ["meanwhile", "until", "prior to"], arabicHint: "يرجى تقديم تقرير للمدير بمجرد انتهائك من المهمة.", arabicParts: ["يرجى تقديم تقرير للمدير", "انتهائك من المهمة."], arabicAnswer: "بمجرد", arabicWrongs: ["في هذه الأثناء", "حتى", "قبل"] },
      { parts: ["We must wait here", "further notice."], hint: "پێویستە لێرە چاوەڕێ بکەین تا ئاگادارکردنەوەی تر.", answer: "until", wrongs: ["while", "once", "prior to"], arabicHint: "يجب أن ننتظر هنا حتى إشعار آخر.", arabicParts: ["يجب أن ننتظر هنا", "إشعار آخر."], arabicAnswer: "حتى", arabicWrongs: ["بينما", "بمجرد", "قبل"] },
      { parts: ["Please sign the documents", "to your departure."], hint: "تکایە بەڵگەنامەکان واژوو بکە پێش بەڕێکەوتنت.", answer: "prior", wrongs: ["meanwhile", "subsequently", "once"], arabicHint: "يرجى توقيع المستندات قبل مغادرتك.", arabicParts: ["يرجى توقيع المستندات", "لمغادرتك."], arabicAnswer: "قبل", arabicWrongs: ["في هذه الأثناء", "لاحقاً", "بمجرد"] },
    ],
    conversations: [
      {
        situation: "پرسیار دەربارەی وادەی دەستپێکردنەوەی پڕۆژە",
        theyAsk: "When can we start working on the project again?",
        correct: "Everything is paused until further notice due to the budget crisis.",
        wrong1: "As soon as possible, I met my friends.",
        wrong2: "Prior to departure, we are full.",
        wrong3: "Once you complete the cake, stir the soup.",
        explanation: "'until further notice' وەڵامێکی فەرمی و گونجاوە بۆ ڕووداوێکی ڕاگیراو.",
        situationAr: "السؤال عن موعد استئناف المشروع",
        theyAskAr: "متى يمكننا البدء في العمل على المشروع مرة أخرى؟",
        correctAr: "كل شيء متوقف حتى إشعار آخر بسبب أزمة الميزانية.",
        wrong1Ar: "في أقرب وقت ممكن، قابلت أصدقائي.",
        wrong2Ar: "قبل المغادرة، نحن ممتلئون.",
        wrong3Ar: "بمجرد إكمال الكعكة، حرك الحساء.",
        explanationAr: "'until further notice' (حتى إشعار آخر) هو الجواب الرسمي المناسب للمشاريع المعلقة."
      },
      {
        situation: "ڕێکخستنی کات لە کاتی ئیشکردندا",
        theyAsk: "Can you design the website while I write the content?",
        correct: "Sure! Meanwhile, let's keep each other updated on the progress.",
        wrong1: "Prior to departure, yes.",
        wrong2: "Subsequently we will fail.",
        wrong3: "By the time we arrived, it was salty.",
        explanation: "'Meanwhile' (لە هەمان کاتدا) بەکاردێت بۆ کارکردن لەسەر دوو پڕۆژەی هاوتەریب.",
        situationAr: "تنسيق الوقت أثناء العمل",
        theyAskAr: "هل يمكنك تصميم الموقع بينما أكتب المحتوى؟",
        correctAr: "بالتأكيد! في هذه الأثناء، لنبقِ بعضنا على اطلاع بالتقدم.",
        wrong1Ar: "قبل المغادرة، نعم.",
        wrong2Ar: "لاحقاً سوف نفشل.",
        wrong3Ar: "بحلول الوقت الذي وصلنا فيه، كان مالحاً.",
        explanationAr: "تستخدم 'Meanwhile' (في هذه الأثناء) للعمل على مشروعين متوازيين في نفس الوقت."
      }
    ]
  },

  // Lesson 5: Certainty & Doubt
  {
    topic: "Certainty & Doubt", topicKu: "دڵنیایی و گومان", topicAr: "اليقين والشك",
    words: [
      { english: "Definitely yes", kurdish: "بە دڵنیاییەوە بەڵێ", arabic: "بالتأكيد نعم" },
      { english: "Highly unlikely", kurdish: "زۆر دوورە لە ڕاستییەوە (ئەگەرێکی کەمە)", arabic: "غير مرجح للغاية" },
      { english: "Without a doubt", kurdish: "بەبێ هیچ گومانێک", arabic: "بدون أدنى شك" },
      { english: "Reason to believe", kurdish: "هۆکار بۆ باوەڕکردن", arabic: "سبب للاعتقاد" },
      { english: "Skeptical about it", kurdish: "بەگومان بوون لەسەری", arabic: "متشكك في ذلك" },
      { english: "Clear evidence", kurdish: "بەڵگەی ڕوون", arabic: "دليل واضح" },
      { english: "Probably correct", kurdish: "پێدەچێت ڕاست بێت", arabic: "من المحتمل أن يكون صحيحاً" },
      { english: "Have reservations", kurdish: "تێبینی یان گومانی تایبەتم هەیە", arabic: "لدي تحفظات" },
    ],
    voices: [
      { prompt: "دڵنیایی خۆت دەربڕە", target: "Without a doubt, this is the best decision we have made.", targetKurdish: "بەبێ هیچ گومانێک، ئەمە باشترین بڕیارە کە داومانە.", promptAr: "عبر عن يقينك بالقرار", targetArabic: "بدون أدنى شك، هذا هو أفضل قرار اتخذناه." },
      { prompt: "بڵێ زۆر دوورە لە ڕاستییەوە", target: "It is highly unlikely that the project will finish this week.", targetKurdish: "زۆر دوورە لە ڕاستییەوە کە پڕۆژەکە ئەم هەفتەیە تەواو بێت.", promptAr: "قل إنه غير مرجح للغاية", targetArabic: "من غير المرجح للغاية أن ينتهي المشروع هذا الأسبوع." },
      { prompt: "بڵێ گومانت هەیە", target: "I am skeptical about the success of this plan.", targetKurdish: "من بەگومانم لە سەرکەوتنی ئەم پلانە.", promptAr: "قل أنك متشكك في الخطة", targetArabic: "أنا متشكك بشأن نجاح هذه الخطة." },
    ],
    sentences: [
      { english: ["There", "is", "clear", "evidence", "that", "the", "climate", "is", "changing"], kurdish: "بەڵگەی ڕوون هەیە کە کەشوهەوا لە گۆڕاندایە", arabic: "هناك دليل واضح على أن المناخ يتغير" },
      { english: ["I", "have", "some", "reservations", "about", "his", "proposal"], kurdish: "تێبینی و گومانی تایبەتم هەیە دەربارەی پێشنیازەکەی ئەو", arabic: "لدي بعض التحفظات بشأن اقتراحه" },
      { english: ["We", "have", "every", "reason", "to", "believe", "she", "is", "innocent"], kurdish: "هەموو هۆکارێکمان هەیە بۆ ئەوەی باوەڕ بکەین کە ئەو بێتاوانە", arabic: "لدينا كل الأسباب للاعتقاد بأنها بريئة" },
      { english: ["The", "answers", "they", "provided", "are", "probably", "correct"], kurdish: "ئەو وەڵامانەی کە دایانناوە پێدەچێت ڕاست بن", arabic: "الإجابات التي قدموها من المحتمل أن تكون صحيحة" },
    ],
    fillBlanks: [
      { parts: ["He will", "win the award; he is the best player."], hint: "ئەو بە دڵنیاییەوە خەڵاتەکە دەباتەوە؛ باشترین یاریزانە.", answer: "definitely", wrongs: ["skeptical", "unlikely", "reservations"], arabicHint: "سيفوز بالتأكيد بالجائزة؛ إنه أفضل لاعب.", arabicParts: ["سيفوز", "بالجائزة؛ إنه أفضل لاعب."], arabicAnswer: "بالتأكيد", arabicWrongs: ["متشكك", "غير مرجح", "تحفظات"] },
      { parts: ["I am a bit", "about their promises."], hint: "من کەمێک بەگومانم دەربارەی بەڵێنەکانی ئەوان.", answer: "skeptical", wrongs: ["definitely", "clear", "probably"], arabicHint: "أنا متشكك قليلاً بشأن وعودهم.", arabicParts: ["أنا", "قليلاً بشأن وعودهم."], arabicAnswer: "متشكك", arabicWrongs: ["بالتأكيد", "واضح", "من المحتمل"] },
      { parts: ["It is highly", "that it will snow in July."], hint: "زۆر دوورە لە ڕاستییەوە کە لە تەمموزدا بەفر ببارێت.", answer: "unlikely", wrongs: ["definitely", "without", "clear"], arabicHint: "من غير المرجح للغاية أن تثلج في يوليو.", arabicParts: ["من غير المرجح", "أن تثلج في يوليو."], arabicAnswer: "للغاية", arabicWrongs: ["بالتأكيد", "بدون", "واضح"] },
    ],
    conversations: [
      {
        situation: "دانوستان دەربارەی پێشنیازی نوێ",
        theyAsk: "Do you agree with the terms of our proposal?",
        correct: "I have some reservations about it. I need to see clear evidence first.",
        wrong1: "Without a doubt, it is highly unlikely.",
        wrong2: "Definitely yes, it is a decaf option.",
        wrong3: "We missed the deadline to be skeptical.",
        explanation: "'I have reservations' و 'clear evidence' باشترین شێوازی دەربڕینی گومان و نیگەرانین.",
        situationAr: "نقاش حول شروط اتفاقية جديدة",
        theyAskAr: "هل توافق على شروط اقتراحنا؟",
        correctAr: "لدي بعض التحفظات حول الأمر. أحتاج لرؤية دليل واضح أولاً.",
        wrong1Ar: "بدون أدنى شك، غير مرجح للغاية.",
        wrong2Ar: "بالتأكيد نعم، إنه خيار خالٍ من الكافيين.",
        wrong3Ar: "لقد فوتنا الموعد النهائي لنكون متشككين.",
        explanationAr: "استخدام 'لدي تحفظات' (reservations) و'دليل واضح' هو الرد المهذب للتعبير عن القلق."
      },
      {
        situation: "شیکردنەوەی بارودۆخی کەشوهەوا",
        theyAsk: "Will the outdoor concert be canceled?",
        correct: "It is highly unlikely, unless we have heavy rain.",
        wrong1: "Without a doubt, it is salty.",
        wrong2: "I am skeptical about the napkin.",
        wrong3: "Definitely, I met my friends yesterday.",
        explanation: "وەڵامی 'highly unlikely' ئەگەرێکی زۆر لاواز دەردەبڕێت.",
        situationAr: "تقييم احتمالية إلغاء الحفل الموسيقي",
        theyAskAr: "هل سيتم إلغاء الحفل الموسيقي في الهواء الطلق؟",
        correctAr: "هذا غير مرجح للغاية، ما لم يكن لدينا مطر غزير.",
        wrong1Ar: "بدون أدنى شك، إنه مالح.",
        wrong2Ar: "أنا متشكك بشأن المنديل.",
        wrong3Ar: "بالتأكيد، قابلت أصدقائي أمس.",
        explanationAr: "الرد بـ 'highly unlikely' يعبر عن استبعاد حدوث الشيء إلا بظروف قاهرة."
      }
    ]
  },

  // Lesson 6: Making Assumptions
  {
    topic: "Making Assumptions", topicKu: "گریمانەکردن (داڕشتنی گریمانە)", topicAr: "صنع الافتراضات",
    words: [
      { english: "Assume the worst", kurdish: "فەرزکردنی خراپترین دۆخ", arabic: "افتراض الأسوأ" },
      { english: "Must have forgotten", kurdish: "دەبێت لەبیری چووبێت", arabic: "لا بد أنه نسي" },
      { english: "Apparently she left", kurdish: "پێدەچێت ئەو ڕۆشتبێت (بە پێی دیار)", arabic: "على ما يبدو غادرت" },
      { english: "Seems reasonable", kurdish: "پێدەچێت ژیرانە بێت", arabic: "يبدو معقولاً" },
      { english: "Make assumptions", kurdish: "دروستکردنی فەرزەکان", arabic: "صنع افتراضات" },
      { english: "Might have missed it", kurdish: "لەوانەیە لەدەستی دابێت", arabic: "ربما فاته ذلك" },
      { english: "Based on rumors", kurdish: "لەسەر بنەمای دەنگۆکان", arabic: "بناءً على الشائعات" },
      { english: "Safe to assume", kurdish: "دروستە فەرز بکەین (فەرزێکی سەلامەتە)", arabic: "من الآمن افتراض" },
    ],
    voices: [
      { prompt: "بڵێ لەوانەیە پاسەکەیان لەدەست دابێت", target: "They might have missed the bus because they are late.", targetKurdish: "لەوانەیە پاسەکەیان لەدەست دابێت چونکە درەنگ کەوتوون.", promptAr: "قل ربما فاتهم الأتوبيس لأنهم متأخرون", targetArabic: "ربما فاتهم الأتوبيس لأنهم متأخرون." },
      { prompt: "بڵێ پێدەچێت بڕیارێکی باش بێت", target: "This offer seems reasonable to me.", targetKurdish: "ئەم پێشنیازە بەلای منەوە ژیرانە (عەقڵانی) دیارە.", promptAr: "قل هذا العرض يبدو معقولاً", targetArabic: "هذا العرض يبدو معقولاً بالنسبة لي." },
      { prompt: "بڵێ پێدەچێت خەوتوبێت", target: "He didn't reply; he must have fallen asleep.", targetKurdish: "وەڵامی نەدایەوە؛ دەبێت خەوتبێت.", promptAr: "قل لا بد أنه نائم لأنه لم يجب", targetArabic: "لم يجب، لا بد أنه قد نام." },
    ],
    sentences: [
      { english: ["Never", "make", "assumptions", "without", "checking", "the", "facts"], kurdish: "هیچ کات بەبێ پشکنینی ڕاستییەکان گریمانە دروست مەکە", arabic: "لا تضع افتراضات أبداً دون التحقق من الحقائق" },
      { english: ["It", "is", "safe", "to", "assume", "the", "office", "is", "closed"], kurdish: "دروستە فەرز بکەین کە ئۆفیسەکە داخراوە", arabic: "من الآمن افتراض أن المكتب مغلق" },
      { english: ["Apparently", "she", "left", "the", "meeting", "early", "today"], kurdish: "پێدەچێت ئەو ئەمڕۆ زوو کۆبوونەوەکەی جێهێشتبێت", arabic: "على ما يبدو، غادرت الاجتماع مبكراً اليوم" },
      { english: ["We", "should", "not", "assume", "the", "worst", "immediately"], kurdish: "نابێت یەکسەر فەرزی خراپترین دۆخ بکەین", arabic: "لا ينبغي لنا افتراض الأسوأ على الفور" },
    ],
    fillBlanks: [
      { parts: ["He is not answering; he", "have lost his phone."], hint: "ئەو وەڵام ناداتەوە؛ دەبێت مۆبایلەکەی ون کردبێت.", answer: "must", wrongs: ["might", "seems", "assume"], arabicHint: "إنه لا يجيب؛ لا بد أنه فقد هاتفه.", arabicParts: ["إنه لا يجيب؛ لا بد", "فقد هاتفه."], arabicAnswer: "أنه", arabicWrongs: ["ربما", "يبدو", "يفترض"] },
      { parts: ["This price", "reasonable for a new laptop."], hint: "ئەم نرخە ژیرانە (عەقڵانی) دیارە بۆ لاپتۆپێکی نوێ.", answer: "seems", wrongs: ["assume", "apparently", "must"], arabicHint: "هذا السعر يبدو معقولاً لجهاز محمول جديد.", arabicParts: ["هذا السعر", "معقولاً لجهاز محمول جديد."], arabicAnswer: "يبدو", arabicWrongs: ["يفترض", "على ما يبدو", "لا بد"] },
      { parts: ["It is", "to assume that they will help us."], hint: "فەرزێکی سەلامەتە (دروستە فەرز بکەین) کە یارمەتیمان دەدەن.", answer: "safe", wrongs: ["worse", "rumor", "missed"], arabicHint: "من الآمن افتراض أنهم سيساعدوننا.", arabicParts: ["من", "افتراض أنهم سيساعدوننا."], arabicAnswer: "الآمن", arabicWrongs: ["الأسوأ", "الشائعة", "المفقود"] },
    ],
    conversations: [
      {
        situation: "کاتێک هاوکارەکەت لەسەر کار ئامادە نییە",
        theyAsk: "Where is Ahmed today? He is not in his office.",
        correct: "Apparently he left early, or he might have missed the bus.",
        wrong1: "Never make assumptions about food.",
        wrong2: "This steak seems reasonable.",
        wrong3: "I will assume the worst regarding the recipe.",
        explanation: "'Apparently' و 'might have missed' باشترین دەربڕینی گریمانەن بۆ نەبوونی کەسێک.",
        situationAr: "عندما يغيب زميل العمل عن مكتبه",
        theyAskAr: "أين أحمد اليوم؟ إنه ليس في مكتبه.",
        correctAr: "على ما يبدو غادر مبكراً، أو ربما فاتته الحافلة.",
        wrong1Ar: "لا تضع افتراضات أبداً حول الطعام.",
        wrong2Ar: "شريحة اللحم هذه تبدو معقولة.",
        wrong3Ar: "سأفترض الأسوأ بخصوص الوصفة.",
        explanationAr: "استخدام 'على ما يبدو' (Apparently) و 'ربما فاته' هو الأنسب لصنع افتراضات حول الغياب."
      },
      {
        situation: "بڕیاردان لەسەر کڕینی شتێک",
        theyAsk: "Do you think we should buy this car based on these rumors?",
        correct: "No, we should never make assumptions without checking the facts first.",
        wrong1: "Yes, it is safe to assume the worst.",
        wrong2: "Apparently she must have forgotten to buy it.",
        wrong3: "The price seems reasonable for coffee.",
        explanation: "وەڵامی دروست ڕەتکردنەوەی بڕیاردانە تەنها لەسەر بنەمای دەنگۆ بەبێ ڕاستییەکان.",
        situationAr: "اتخاذ قرار شراء بناءً على شائعة",
        theyAskAr: "هل تعتقد أننا يجب أن نشتري هذه السيارة بناءً على هذه الشائعات؟",
        correctAr: "لا، لا ينبغي لنا وضع افتراضات أبداً دون التحقق من الحقائق أولاً.",
        wrong1Ar: "نعم، من الآمن افتراض الأسوأ.",
        wrong2Ar: "على ما يبدو، لا بد أنها نسيت شراءها.",
        wrong3Ar: "السعر يبدو معقولاً لشراء القهوة.",
        explanationAr: "الرد الصحيح هو رفض وضع الافتراضات أو اتخاذ قرارات بناءً على الشائعات دون حقائق."
      }
    ]
  },

  // Lesson 7: Purpose & Goal
  {
    topic: "Purpose & Goal", topicKu: "مەبەست و ئامانج", topicAr: "الهدف والغاية",
    words: [
      { english: "In order to succeed", kurdish: "بۆ ئەوەی سەرکەوتوو بیت", arabic: "من أجل النجاح" },
      { english: "So that we can start", kurdish: "بۆ ئەوەی بتوانین دەست پێ بکەین", arabic: "حتى نتمكن من البدء" },
      { english: "Aim for a high score", kurdish: "ئامانج دیاریکردن بۆ نمرەیەکی بەرز", arabic: "السعي للحصول على نتيجة عالية" },
      { english: "Achieve the objective", kurdish: "بەدیهێنانی ئامانجەکە", arabic: "تحقيق الهدف" },
      { english: "Ultimate goal", kurdish: "ئامانجی کۆتایی", arabic: "الهدف الأسمى" },
      { english: "Focus on progress", kurdish: "تەرکیزکردن لەسەر پێشکەوتن", arabic: "التركيز على التقدم" },
      { english: "Dedicated to learning", kurdish: "تەرخانکراو بۆ فێربوون", arabic: "مخصص للتعلم" },
      { english: "With the intention of", kurdish: "بە مەبەستی...", arabic: "بنية..." },
    ],
    voices: [
      { prompt: "بڵێ دەبێت بخوێنین بۆ سەرکەوتن", target: "We must study hard in order to succeed in our career.", targetKurdish: "پێویستە زۆر بخوێنین بۆ ئەوەی لە کارەکانماندا سەرکەوتوو بین.", promptAr: "قل يجب الدراسة بجد من أجل النجاح", targetArabic: "يجب أن ندرس بجد من أجل النجاح في مسيرتنا المهنية." },
      { prompt: "باسی ئامانجی کۆتایی بکە", target: "My ultimate goal is to speak English fluently.", targetKurdish: "ئامانجی کۆتاییم ئەوەیە بە ڕەوانی بە ئینگلیزی قسە بکەم.", promptAr: "تحدث عن هدفك الأسمى", targetArabic: "هدفي الأسمى هو التحدث بالإنجليزية بطلاقة." },
      { prompt: "بڵێ مەبەستت یارمەتیدان بووە", target: "I shared this with the intention of helping you.", targetKurdish: "ئەمەم هاوبەش کرد بە مەبەستی یارمەتیدانی تۆ.", promptAr: "قل أن نيتك كانت المساعدة", targetArabic: "شاركت هذا بنية مساعدتك." },
    ],
    sentences: [
      { english: ["Please", "send", "the", "file", "so", "that", "we", "can", "start", "working"], kurdish: "تکایە فایلەکە بنێرە بۆ ئەوەی بتوانین دەست بە کارکردن بکەین", arabic: "يرجى إرسال الملف حتى نتمكن من بدء العمل" },
      { english: ["He", "is", "completely", "dedicated", "to", "improving", "his", "skills"], kurdish: "ئەو بە تەواوی خۆی تەرخانکردووە بۆ باشترکردنی کارامەییەکانی", arabic: "إنه مكرس بالكامل لتحسين مهاراته" },
      { english: ["We", "must", "focus", "on", "progress", "rather", "than", "perfection"], kurdish: "پێویستە تەرکیز لەسەر پێشکەوتن بکەین نەک بێخەوشی", arabic: "يجب أن نركز على التقدم بدلاً من الكمال" },
      { english: ["They", "managed", "to", "achieve", "their", "objective", "early"], kurdish: "ئەوان توانییان پێشوەختە ئامانجەکەیان بەدیبهێنن", arabic: "تمكنوا من تحقيق هدفهم مبكراً" },
    ],
    fillBlanks: [
      { parts: ["We practice daily", "improve our accent."], hint: "ئێمە ڕۆژانە ڕاهێنان دەکەین بۆ ئەوەی ئەکسێنتەکەمان باشتر بکەین.", answer: "in order to", wrongs: ["so that", "with the intention", "consequently"], arabicHint: "نتدرب يومياً من أجل تحسين لكنتنا.", arabicParts: ["نتدرب يومياً", "تحسين لكنتنا."], arabicAnswer: "من أجل", arabicWrongs: ["حتى", "بنية", "وبالتالي"] },
      { parts: ["I am saving money", "I can buy a house."], hint: "من پارە پاشەکەوت دەکەم بۆ ئەوەی بتوانم خانوو بکڕم.", answer: "so that", wrongs: ["in order to", "owing to", "therefore"], arabicHint: "أنا أدخر المال حتى أتمكن من شراء منزل.", arabicParts: ["أنا أدخر المال", "أتمكن من شراء منزل."], arabicAnswer: "حتى", arabicWrongs: ["من أجل", "بسبب", "لذلك"] },
      { parts: ["Her", "goal is to become a doctor."], hint: "ئامانجی کۆتایی ئەو ئەوەیە ببێتە پزیشک.", answer: "ultimate", wrongs: ["tentative", "healthy", "skeptical"], arabicHint: "هدفها الأسمى هو أن تصبح طبيبة.", arabicParts: ["هدفها", "هو أن تصبح طبيبة."], arabicAnswer: "الأسمى", arabicWrongs: ["المؤقت", "الصحي", "المتشكك"] },
    ],
    conversations: [
      {
        situation: "قسەکردن لەسەر پلانی دواڕۆژ",
        theyAsk: "Why are you taking this advanced course?",
        correct: "In order to succeed in my career. My ultimate goal is international business.",
        wrong1: "So that we can start the rain.",
        wrong2: "I had reservations about success.",
        wrong3: "I assumed the worst about learning.",
        explanation: "پرسیاری 'Why' (بۆچی) بە دەستەواژەی مەبەست وەک 'In order to...' یان 'My ultimate goal...' وەڵام دەدرێتەوە.",
        situationAr: "الحديث عن خطط المستقبل",
        theyAskAr: "لماذا تأخذ هذه الدورة المتقدمة؟",
        correctAr: "من أجل النجاح في مسيرتي المهنية. هدفي الأسمى هو التجارة الدولية.",
        wrong1Ar: "حتى نتمكن من بدء المطر.",
        wrong2Ar: "كان لدي تحفظات بشأن النجاح.",
        wrong3Ar: "افترضت الأسوأ بشأن التعلم.",
        explanationAr: "السؤال بـ 'Why' (لماذا) يجاب عنه بتعبيرات الغاية مثل 'In order to...' أو 'My ultimate goal'."
      },
      {
        situation: "پێشنیارکردنی فایل ناردن بۆ هاوکار",
        theyAsk: "When should I email the feedback?",
        correct: "Please send it now so that we can achieve our objective on time.",
        wrong1: "Aim for a high score yesterday.",
        wrong2: "With the intention of postponing it.",
        wrong3: "Focus on processed sugar.",
        explanation: "'so that we can...' گرێدەرێکی کاتی و مەبەستییە بۆ کارکردنی بەکۆمەڵ.",
        situationAr: "اقتراح إرسال الملفات للزميل",
        theyAskAr: "متى يجب أن أرسل ملاحظاتي بالبريد الإلكتروني؟",
        correctAr: "يرجى إرسالها الآن حتى نتمكن من تحقيق هدفنا في الوقت المحدد.",
        wrong1Ar: "اسعَ للحصول على نتيجة عالية بالأمس.",
        wrong2Ar: "بنية تأجيل الأمر.",
        wrong3Ar: "التركيز على السكر المصنع.",
        explanationAr: "'so that we can...' (حتى نتمكن من) رابط غاية ممتاز للتنسيق بين الزملاء."
      }
    ]
  },

  // Lesson 8: Making Comparisons
  {
    topic: "Making Comparisons", topicKu: "بەراوردکردن", topicAr: "إجراء المقارنات",
    words: [
      { english: "Compared to last year", kurdish: "بە بەراورد بە ساڵی ڕابردوو", arabic: "مقارنة بالعام الماضي" },
      { english: "Unlike the previous version", kurdish: "بەپێچەوانەی وەشانی پێشوو", arabic: "على عكس النسخة السابقة" },
      { english: "Similar in performance", kurdish: "هاوشێوە لە ئەنجامدا (پێشکەشکردندا)", arabic: "متشابه في الأداء" },
      { english: "Vast difference", kurdish: "جیاوازییەکی زۆر (فراوان)", arabic: "فرق شاسع" },
      { english: "In contrast to", kurdish: "بە پێچەوانەی...", arabic: "على النقيض من" },
      { english: "Slightly better", kurdish: "کەمێک باشتر", arabic: "أفضل قليلاً" },
      { english: "Far superior", kurdish: "زۆر باڵاتر (زۆر باشتر)", arabic: "متفوق بكثير" },
      { english: "Equally important", kurdish: "هاوشێوە گرنگ (بە هەمان شێوە گرنگ)", arabic: "على نفس القدر من الأهمية" },
    ],
    voices: [
      { prompt: "بەراوردی دوو مۆدێل بکە", target: "This new model is far superior compared to the old one.", targetKurdish: "ئەم مۆدێلە نوێیە بە بەراورد بە مۆدێلە کۆنەکە زۆر باڵاترە.", promptAr: "قارن بين طرازين", targetArabic: "هذا الطراز الجديد متفوق بكثير مقارنة بالطراز القديم." },
      { prompt: "بڵێ دوو لاپتۆپەکە لە یەک دەچن", target: "Both laptops are very similar in performance.", targetKurdish: "هەردوو لاپتۆپەکە لە پێشکەشکردنیاندا زۆر لە یەک دەچن.", promptAr: "قل أن الحاسوبين متشابهان في الأداء", targetArabic: "كلا الحاسوبين متشابهان جداً في الأداء." },
      { prompt: "بڵێ جیاوازی زۆرە لە نێوانیاندا", target: "There is a vast difference between these two plans.", targetKurdish: "جیاوازییەکی زۆر لە نێوان ئەم دوو پلانەدا هەیە.", promptAr: "قل هناك فرق شاسع بين الخطتين", targetArabic: "هناك فرق شاسع بين هاتين الخطتين." },
    ],
    sentences: [
      { english: ["Compared", "to", "last", "year", "our", "sales", "are", "slightly", "better"], kurdish: "بە بەراورد بە ساڵی ڕابردوو فرۆشەکانمان کەمێک باشترن", arabic: "مقارنة بالعام الماضي مبيعاتنا أفضل قليلاً" },
      { english: ["Unlike", "his", "brother", "he", "is", "interested", "in", "science"], kurdish: "بەپێچەوانەی براکەیەوە، ئەو حەزی لە زانستە", arabic: "على عكس أخيه، هو مهتم بالعلوم" },
      { english: ["Speed", "and", "security", "are", "equally", "important", "for", "us"], kurdish: "خێرایی و پارێزگاری بە هەمان شێوە گرنگن بۆ ئێمە", arabic: "السرعة والأمان على نفس القدر من الأهمية بالنسبة لنا" },
      { english: ["In", "contrast", "to", "the", "city", "the", "village", "is", "very", "quiet"], kurdish: "بە پێچەوانەی شارەکەوە، گوندەکە زۆر بێدەنگە", arabic: "على النقيض من المدينة، القرية هادئة جداً" },
    ],
    fillBlanks: [
      { parts: ["This design is", "to the previous one we saw."], hint: "ئەم دیزاینە هاوشێوەی دیزاینە پێشووەکەیە کە بینیمان.", answer: "similar", wrongs: ["unlike", "contrast", "superior"], arabicHint: "هذا التصميم مشابه للتصميم السابق الذي رأيناه.", arabicParts: ["هذا التصميم", "للتصميم السابق الذي رأيناه."], arabicAnswer: "مشابه", arabicWrongs: ["على عكس", "النقيض", "متفوق"] },
      { parts: ["Unlike", "her sister, she loves public speaking."], hint: "بەپێچەوانەی خوشکەکەیەوە، ئەو حەزی لە قسەکردنە لەبەردەم خەڵکدا.", answer: "unlike", wrongs: ["similar", "equally", "contrast"], arabicHint: "على عكس أختها، هي تحب التحدث أمام الجمهور.", arabicParts: ["", "أختها، هي تحب التحدث أمام الجمهور."], arabicAnswer: "على عكس", arabicWrongs: ["مشابه", "بالتساوي", "النقيض"] },
      { parts: ["The quality of this product is far", "."], hint: "کوالێتی ئەم بەرهەمە زۆر باڵاترە (باشترە).", answer: "superior", wrongs: ["similar", "bland", "ripe"], arabicHint: "جودة هذا المنتج متفوقة بكثير.", arabicParts: ["جودة هذا المنتج", "بكثير."], arabicAnswer: "متفوقة", arabicWrongs: ["مشابهة", "خفيفة المذاق", "ناضجة"] },
    ],
    conversations: [
      {
        situation: "بەراوردی دوو سیستەم لەسەر کار",
        theyAsk: "Which software version should we buy?",
        correct: "Unlike the previous version, the new one is far superior in security.",
        wrong1: "Compared to last year, it was too salty.",
        wrong2: "Equally important to bake a cake.",
        wrong3: "Similar in performance to ripe tomatoes.",
        explanation: "بەکارھێنانی 'Unlike... far superior...' جوانترین و کاریگەرترین شێوازە بۆ بەراوردکاری فەرمی.",
        situationAr: "المقارنة بين نظامين في العمل",
        theyAskAr: "أي نسخة برنامج يجب أن نشتريها؟",
        correctAr: "على عكس النسخة السابقة، النسخة الجديدة متفوقة بكثير في الأمان.",
        wrong1Ar: "مقارنة بالعام الماضي، كان مالحاً جداً.",
        wrong2Ar: "على نفس القدر من الأهمية خبز كعكة.",
        wrong3Ar: "متشابه في الأداء مع الطماطم الناضجة.",
        explanationAr: "استخدام 'على عكس... متفوق بكثير' هو الأسلوب الأمثل للمقارنة الرسمية الفنية."
      },
      {
        situation: "بەراوردی بارودۆخی فرۆشتنی ساڵانە",
        theyAsk: "How are our sales compared to last year?",
        correct: "Compared to last year, our performance is slightly better, but we need more progress.",
        wrong1: "In contrast to the vast difference of olives.",
        wrong2: "Take it or leave it, sales are low.",
        wrong3: "Otherwise, we met our friends.",
        explanation: "'Compared to... slightly better...' دەستەواژەیەکی گرنگە بۆ شیکردنەوەی ئاماری دارایی.",
        situationAr: "مقارنة المبيعات بالعام الماضي",
        theyAskAr: "كيف هي مبيعاتنا مقارنة بالعام الماضي؟",
        correctAr: "مقارنة بالعام الماضي، أداؤنا أفضل قليلاً، لكننا بحاجة لمزيد من التقدم.",
        wrong1Ar: "على النقيض من الفرق الشاسع للزيتون.",
        wrong2Ar: "خذه أو اتركه، المبيعات منخفضة.",
        wrong3Ar: "وإلا، قابلنا أصدقاءنا.",
        explanationAr: "تعبير 'Compared to... slightly better...' مفتاح أساسي لشرح التقدم المالي السنوي."
      }
    ]
  },

  // Lesson 9: Future Predictions
  {
    topic: "Future Predictions", topicKu: "پێشبینییەکانی داهاتوو", topicAr: "توقعات المستقبل",
    words: [
      { english: "Predict the future", kurdish: "پێشبینیکردنی داهاتوو", arabic: "التنبؤ بالمستقبل" },
      { english: "Expected to rise", kurdish: "چاوەڕوان دەکرێت بەرزببێتەوە", arabic: "من المتوقع أن يرتفع" },
      { english: "Likely to happen", kurdish: "ئەگەری زۆرە ڕووبدات", arabic: "من المرجح أن يحدث" },
      { english: "Eventual success", kurdish: "سەرکەوتنی کۆتایی (دەرئەنجامی)", arabic: "النجاح النهائي" },
      { english: "Weather forecast", kurdish: "پێشبینی کەشوهەوا", arabic: "توقعات الطقس" },
      { english: "Future generations", kurdish: "نەوەکانی داهاتوو", arabic: "أجيال المستقبل" },
      { english: "No guarantee", kurdish: "هیچ گەرەنتییەک نییە", arabic: "لا يوجد ضمان" },
      { english: "Sign of improvement", kurdish: "نیشانەی باشتربوون", arabic: "علامة على التحسن" },
    ],
    voices: [
      { prompt: "بڵێ چاوەڕوان دەکرێت نرخەکان بەرزببنەوە", target: "Prices are expected to rise due to inflation.", targetKurdish: "چاوەڕوان دەکرێت نرخەکان بەهۆی هەڵاوسانەوە بەرزببنەوە.", promptAr: "قل من المتوقع أن ترتفع الأسعار", targetArabic: "من المتوقع أن ترتفع الأسعار بسبب التضخم." },
      { prompt: "بڵێ هیچ گەرەنتی نییە بۆ سەرکەوتن", target: "There is no guarantee that this plan will work.", targetKurdish: "هیچ گەرەنتییەک نییە کە ئەم پلانە سەرکەوتوو بێت.", promptAr: "قل لا يوجد ضمان لنجاح الخطة", targetArabic: "لا يوجد ضمان بأن هذه الخطة ستنجح." },
      { prompt: "بڵێ نیشانەی باشتربوون دەبینیت", target: "We can see clear signs of improvement in the economy.", targetKurdish: "دەتوانین نیشانەی ڕوونی باشتربوون لە ئابووریدا ببینین.", promptAr: "قل نرى علامات واضحة للتحسن", targetArabic: "يمكننا رؤية علامات واضحة على التحسن في الاقتصاد." },
    ],
    sentences: [
      { english: ["It", "is", "highly", "likely", "to", "happen", "in", "the", "near", "future"], kurdish: "زۆر ئەگەری هەیە لە داهاتوویەکی نزیکدا ڕووبدات", arabic: "من المرجح جداً أن يحدث ذلك في المستقبل القريب" },
      { english: ["We", "must", "protect", "resources", "for", "our", "future", "generations"], kurdish: "دەبێت سەرچاوەکان بۆ نەوەکانی داهاتوومان بپارێزین", arabic: "يجب أن نحمي الموارد لأجيالنا القادمة" },
      { english: ["The", "weather", "forecast", "predicts", "a", "very", "hot", "summer"], kurdish: "پێشبینی کەشوهەوا هاوینێکی زۆر گەرم پێشبینی دەکات", arabic: "توقعات الطقس تتنبأ بصيف حار جداً" },
      { english: ["Hard", "work", "leads", "to", "the", "eventual", "success", "of", "the", "team"], kurdish: "کاری قورس دەبێتە هۆی سەرکەوتنی کۆتایی تیمی کارەکە", arabic: "العمل الجاد يؤدي إلى النجاح النهائي للفريق" },
    ],
    fillBlanks: [
      { parts: ["Interest rates are", "to rise next month."], hint: "چاوەڕوان دەکرێت ڕێژەی سوو لە مانگی داهاتوودا بەرزببێتەوە.", answer: "expected", wrongs: ["likely", "guarantee", "eventual"], arabicHint: "من المتوقع أن ترتفع أسعار الفائدة الشهر المقبل.", arabicParts: ["من", "أن ترتفع أسعار الفائدة الشهر المقبل."], arabicAnswer: "المتوقع", arabicWrongs: ["المرجح", "الضمان", "النهائي"] },
      { parts: ["It is", "to rain; look at those dark clouds."], hint: "ئەگەری هەیە باران ببارێت؛ سەیری ئەو هەورە تاریکانە بکە.", answer: "likely", wrongs: ["guarantee", "eventual", "forecast"], arabicHint: "من المرجح أن تمطر؛ انظر لتلك الغيوم الداكنة.", arabicParts: ["من", "أن تمطر؛ انظر لتلك الغيوم الداكنة."], arabicAnswer: "المرجح", arabicWrongs: ["الضمان", "النهائي", "التوقعات"] },
      { parts: ["There is no", "of success in this market."], hint: "هیچ گەرەنتییەکی سەرکەوتنی دارایی لەم بازاڕەدا نییە.", answer: "guarantee", wrongs: ["likely", "forecast", "improvement"], arabicHint: "لا يوجد ضمان للنجاح في هذا السوق.", arabicParts: ["لا يوجد", "للنجاح في هذا السوق."], arabicAnswer: "ضمان", arabicWrongs: ["مرجح", "توقعات", "تحسن"] },
    ],
    conversations: [
      {
        situation: "پرسیار دەربارەی دۆخی ئابووری داهاتوو",
        theyAsk: "Do you think the business market will improve soon?",
        correct: "There are clear signs of improvement, and sales are expected to rise next quarter.",
        wrong1: "No, the weather forecast predicts a bitter taste.",
        wrong2: "Eventual success with no guarantee of organic food.",
        wrong3: "I predict that we will fail prior to departure.",
        explanation: "ئەم وەڵامە پێشبینییەکی ئەرێنییە لەسەر بنەمای نیشانەی ڕوون (clear signs) و بەرزبوونەوەی چاوەڕوانکراو (expected to rise).",
        situationAr: "السؤال عن وضع السوق المالي مستقبلاً",
        theyAskAr: "هل تعتقد أن سوق الأعمال سيتحسن قريباً؟",
        correctAr: "هناك علامات واضحة على التحسن، ومن المتوقع أن ترتفع المبيعات في الربع القادم.",
        wrong1Ar: "لا، توقعات الطقس تتنبأ بطعم مر.",
        wrong2Ar: "النجاح النهائي بدون ضمان للأغذية العضوية.",
        wrong3Ar: "أتوقع أننا سنفشل قبل المغادرة.",
        explanationAr: "الرد يعطي توقعات إيجابية مبنية على 'علامات واضحة' (clear signs) وارتفاع متوقع (expected to rise)."
      },
      {
        situation: "پێشبینیکردنی کەشوهەوای سەیرانەکە",
        theyAsk: "Will we have a sunny day for our picnic on Friday?",
        correct: "The weather forecast predicts a sunny day, so it is highly likely to happen.",
        wrong1: "No guarantee compared to last year's salt.",
        wrong2: "Unlike the previous version, it is likely to rain potatoes.",
        wrong3: "Otherwise, stay hydrated with espresso.",
        explanation: "بەکارهێنانی 'weather forecast' و 'highly likely' وەڵامێکی زۆر گونجاوە بۆ پێشبینی بارودۆخی سروشتی.",
        situationAr: "التنبؤ بطقس نزهة يوم الجمعة",
        theyAskAr: "هل سيكون الطقس مشمساً لنزهتنا يوم الجمعة؟",
        correctAr: "توقعات الطقس تتنبأ بيوم مشمس، لذا من المرجح جداً أن يحدث ذلك.",
        wrong1Ar: "لا يوجد ضمان مقارنة بملح العام الماضي.",
        wrong2Ar: "على عكس النسخة السابقة، من المحتمل أن تمطر بطاطس.",
        wrong3Ar: "وإلا، حافظ على رطوبة جسمك بالإسبريسو.",
        explanationAr: "استخدام 'weather forecast' (توقعات الطقس) و'highly likely' هو الجواب المنطقي لتوقع أحوال جوية."
      }
    ]
  }
];

export default normalUnit10;
